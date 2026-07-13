> **Note:** the canonical, up-to-date system overview — with the full folder/file map and
> the freedrive path — is now [`ARCHITECTURE.md`](ARCHITECTURE.md). This file is kept for detail.

# erobo10_motion — full architecture & data flow (every detail)

This explains exactly how a command typed in a terminal reaches the C++ motion
logic and back, byte by byte, process by process. Nothing hand-waved.

============================================================================
## 0. The actors (processes & languages)
============================================================================
Five independent OS processes. They do NOT call each other's functions; they
share ONE memory-mapped file.

| Process            | Lang   | Rate     | Role |
|--------------------|--------|----------|------|
| control_node       | C++    | 1000 Hz  | owns shm; runs EtherCAT/HAL; publishes state |
| motion_planner     | C++    | 1000 Hz  | jerk-limited S-curve trajectory; writes setpoints |
| ik_solver          | C++    | ~500 Hz  | goal -> joint target (IK / passthrough) |
| ws_bridge.py       | Python | 50 Hz    | WebSocket <-> shm translator (non-real-time) |
| pose_cli.py / UI   | Python/JS | on demand | sends JSON commands, shows state |
| inject (optional)  | C++    | on demand | writes shm directly (no Python, no WebSocket) |

The shared file: `/dev/shm/erobo10_shm` (640 bytes). On Linux `/dev/shm` is a
RAM-backed tmpfs, so this is pure RAM shared between processes — no disk, no
network.

============================================================================
## 1. THE key idea: how Python "gets" the C++ logic
============================================================================
There is no RPC, no Python-calling-C++ binding, no embedding. Instead:

1. C++ defines a packed struct `ShmBlock` (shm_layout.hpp, `#pragma pack(1)`),
   640 bytes, laid out at fixed byte offsets.
2. control_node creates a 640-byte file and `mmap`s it -> the struct lives in
   shared RAM.
3. Python (shm_layout.py) declares the SAME struct with `ctypes` and
   `_pack_ = 1`, so its field offsets are byte-for-byte identical (verified by
   `assert sizeof == 144/136/120/232/640`). Python `mmap`s the same file and
   overlays the ctypes struct on those bytes with `ShmBlock.from_buffer(mm)`.
4. Now Python writing `blk.cmd.target_q[0] = 0.3` and C++ reading
   `blk->cmd.target_q[0]` touch the *same 8 bytes in RAM*. That double is the
   bridge between the languages. No serialization, no copy.

So "Python command -> C++ logic" = Python writes numbers into shared RAM at the
exact offsets C++ reads them from. The "protocol" is the struct layout itself.

The C++ nodes then run the actual logic (FK/IK/trajectory) and write results
back into the same RAM; Python reads them the same way.

============================================================================
## 2. The shared-memory block map (who writes / who reads)
============================================================================
```
offset  region        size  WRITER            READERS
0       magic,version   8    control_node      all (handshake: 'ERO1')
8       CmdRegion     144    bridge / inject   ik_solver, motion_planner, control_node
152     IkRegion      136    ik_solver         motion_planner
288     SpRegion      120    motion_planner    control_node
408     StateRegion   232    control_node      bridge, ik_solver, motion_planner
```
- CmdRegion: type, frame, target_q[6], target_pose[7] (xyz+quat), speed, estop_req, reset_req, cmd_seq, ack_seq.
- IkRegion: move_type (JOINT/LIN), target_q[6], target_pose[7], ok, pos_err, ik_seq.
- SpRegion: q_cmd[6], qd_cmd[6], moving, progress, traj_id, sp_seq.
- StateRegion: q[6], qd[6], flange_pos[3], flange_quat[4], mode, estop, manip, t, state_seq.

Each region has exactly ONE writer (no write contention) and its own `*_seq`
counter for the seqlock.

============================================================================
## 3. The seqlock: lock-free, tear-free exchange (no UDP, no mutex)
============================================================================
A reader must never see a half-written frame (e.g. q[0] new but q[1] old). We
use a seqlock instead of a mutex (a mutex in a 1 kHz loop risks priority
inversion / blocking).

WRITE (one writer):  seq |= 1   (odd = "writing")   <-- release fence
                     ...write all fields...          <-- release fence
                     seq += 1   (even = "done")
READ (any reader):   loop:
                       s1 = seq; if (s1 odd) retry
                       ...copy fields out...
                       s2 = seq; if (s1 == s2) success else retry
If a write started mid-read, s2 != s1 and the reader retries. Readers never
block the writer; the 1 kHz loop is deterministic. (C++ seqWrite/seqRead in
shm.hpp; Python mirrors it in ShmClient.read_state / send_command.)

How a command is detected: each writer bumps its `*_seq` by 2 per message.
Consumers remember `last_seq` and act only when `cur_seq != last_seq`. That is
how "a new command arrived" is signalled across processes with no events/queues.

============================================================================
## 4. FULL FLOW — `python3 tools/pose_cli.py joint 0.3 0.5 -0.8 0.2 0.7 -0.3 0.5`
============================================================================
Step by step, every hop:

(1) pose_cli.py parses argv -> builds JSON
    {"cmd":"move_joint","q":[0.3,0.5,-0.8,0.2,0.7,-0.3],"speed":0.5,"id":1}
    opens a TCP WebSocket to ws://localhost:8765, sends the text frame.

(2) ws_bridge.py handle(): json.loads -> dispatch "move_joint" ->
    shm.send_command(CMD_MOVE_JOINT, target_q=q, speed=0.5).
    send_command (shm_layout.py): seqlock-writes into CmdRegion:
        cmd.type=1, cmd.target_q[0..5]=the angles, cmd.speed=0.5,
        bumps cmd.cmd_seq (odd then even). These are writes into shared RAM.

(3) ik_solver (C++) loop, ~every 2 ms: seqRead(cmd). Sees cmd_seq changed.
    type==CMD_MOVE_JOINT -> it's already joint space, so it validates limits
    (withinLimits) and copies target_q into IkRegion: ik.move_type=MV_JOINT,
    ik.target_q=the angles, ik.ok=1, then seqWrite bumps ik.ik_seq.
    It also sets cmd.ack_seq = cmd.cmd_seq (so the bridge's send_command, which
    is polling ack_seq, returns ok + pos_err to pose_cli as the {"type":"ack"}).
    (For move_ptp/move_lin this is where solveIK() actually runs -- see 5.)

(4) motion_planner (C++) loop @1000 Hz: seqRead(ik). Sees ik_seq changed, ok=1,
    move_type=MV_JOINT. It reads its current commanded position `qcmd` and calls
    JointTrajectory::plan(qcmd, target_q) (trajectory.hpp): builds a jerk-limited
    7-phase S-curve per joint, time-scaled so all joints finish together
    (duration = max single-joint time). Sets active=true, clock tclk=0.

(5) Same planner loop, EVERY 1 ms while active: tclk += dt*speed; samples the
    trajectory JointTrajectory::sample(tclk) -> q_cmd[6], qd_cmd[6]; seqWrite
    into SpRegion (sp.q_cmd, sp.moving=1, sp.progress). When tclk>=duration,
    active=false, moving=0. This is the continuous setpoint stream.

(6) control_node (C++) loop @1000 Hz: seqRead(sp) -> q_cmd. Calls
    hal.cycle(q_cmd, q_act, qd_act, dt). In simulation the HAL tracks q_cmd
    (ideal CSP); on hardware this is the EtherCAT PDO exchange to the drives.
    Then it runs forwardKinematics(q_act) (kinematics.hpp, the validated DH) to
    get flange pose, manipulability(jacobianFlange) for singularity proximity,
    and seqWrite into StateRegion (q, qd, flange_pos, flange_quat, mode, manip).

(7) Back to the UI: ws_bridge.py broadcaster @50 Hz: seqRead(state) -> builds a
    {"type":"state",...} JSON -> sends to every connected WebSocket client.
    pose_cli.py reads these state frames, sees moving go 1->0, prints
    "reached: flange [...]". The 3D viewer uses the same frames to animate.

Net: a Python list of 6 doubles became bytes in RAM, a C++ planner turned them
into a 1 kHz jerk-limited stream, the C++ control loop drove the robot, and the
measured state flowed back out as JSON -- all with zero network in the control
path and no torn reads.

============================================================================
## 5. Variations of the flow
============================================================================
**move_ptp (Cartesian, IK once):** at step (3) ik_solver builds the target pose
from cmd.target_pose (poseFromPosQuat), seeds solveIK() with the *current* joint
state (warm start), runs Levenberg-Marquardt damped-least-squares IK (ik.hpp) to
get target_q, writes ik.target_q + ik.pos_err. Steps (4)-(7) identical (joint
S-curve to that target). The ack to the UI carries pos_err / ok.

**move_lin (straight line):** ik_solver only validates reachability and passes
the POSE (ik.move_type=MV_LIN, ik.target_pose). The planner uses
CartesianTrajectory: a jerk-limited scalar advances u:0->1 along the straight
line (position lerp + quaternion SLERP), and at EACH 1 ms tick it runs solveIK()
for that interpolated pose (warm-started from the previous q_cmd) -> straight
tool path, continuous joints.

**jog (velocity):** bridge sends CMD_JOG with frame + a velocity vector in
target_q. The planner (not ik_solver) reads it directly and runs a per-joint
jerk-limited velocity follower; for base/tool frame it converts the Cartesian
twist to joint velocity via the damped-least-squares Jacobian. A 0.25 s watchdog
ramps to zero if jog messages stop (dead-client safety).

**stop:** planner decelerates the current trajectory with a cosine-eased
playback ramp (smooth). **estop:** bridge sets cmd.estop_req=1; control_node
calls hal.estop() within its next 1 ms cycle -> mode ESTOP, motion frozen.
**reset:** cmd.reset_req=1 -> hal.resetEstop().

============================================================================
## 6. Where the math actually runs (all C++, header-only `erm::`)
============================================================================
- linalg.hpp      : Vec3/Mat3/Mat4, quaternion, SLERP, SO(3) log/exp, linear solver.
- erobo10_dh.hpp  : the validated clean DH table + per-joint limits (generated).
- kinematics.hpp  : forwardKinematics (DH product * tool), geometric Jacobian,
                    dampedLeastSquares, manipulability.
- ik.hpp          : solveIK = LM/DLS with quaternion error, joint-limit clamping,
                    warm-start + multi-seed restarts (100% / 1 um, verified).
- trajectory.hpp  : ScurveProfile (7-phase double-S), JointTrajectory (synced PTP),
                    CartesianTrajectory (LIN, SLERP, per-step IK).
control_node runs FK + manipulability; ik_solver runs solveIK; motion_planner
runs the trajectory classes (and the Jacobian for Cartesian jog).

============================================================================
## 7. Startup order & handshake
============================================================================
control_node first: zeroes the block, sets sp=home, writes state, then sets
`magic='ERO1'` LAST. Every other process maps the file and spins until
`magic==ERO1` before using it (so no one reads an uninitialized block). The
planner additionally waits for state_seq>=2 (control wrote at least once) before
seeding its qcmd from the measured state. `scripts/run.sh` launches them in the
right order: control_node -> planner -> ik_solver -> ws_bridge.

============================================================================
## 8. Timing / threads summary
============================================================================
- control_node, motion_planner: hard 1 kHz, `std::this_thread::sleep_until` on a
  steady clock (on hardware: SCHED_FIFO + mlockall + EtherCAT DC sync).
- ik_solver: ~500 Hz poll (IK is event-driven, only solves on a new command).
- ws_bridge: 50 Hz state broadcast (asyncio); blocking send_command runs in a
  thread executor so the event loop never stalls.
- All cross-process exchange is the seqlock over the single mmap'd block.

============================================================================
## 9. Where hardware plugs in (one seam)
============================================================================
Only `EthercatInterface::cycle()` in hal.hpp changes for real hardware: instead
of the sim follower, it does the EtherCAT PDO exchange (CSP target position out,
actual position in) and unit conversion counts<->radians per joint. Everything
above the HAL -- shm, IK, planner, bridge, UI, flow -- is unchanged. See
INTEGRATION.md and HARDWARE_BRINGUP.md.

============================================================================
## 10. Complete file tree & what each file does
============================================================================
```
erobo10_motion/
  robot/
    erobo10.urdf              source of truth for geometry (your file)
    meshes/erobo10/*.STL      7 binary meshes (base + link1..6), for the viewer
  core/include/erm/           C++ headers (header-only, namespace erm) -- the engine
    linalg.hpp                math: Vec3/Mat3/Mat4, Quat, SLERP, SO(3) log/exp, solver
    erobo10_dh.hpp            GENERATED: clean DH table + limits (v/a/jerk/effort)
    kinematics.hpp            FK, geometric Jacobian, damped-least-squares, manipulability
    ik.hpp                    solveIK: LM/DLS, warm-start, multi-seed restarts
    trajectory.hpp            ScurveProfile, JointTrajectory (PTP), CartesianTrajectory (LIN)
    shm_layout.hpp            packed structs + enums = the shared-memory wire contract
    shm.hpp                   mmap helpers + seqWrite/seqRead (the seqlock)
    hal.hpp                   EthercatInterface (abstract) + SimDrives (sim backend)
  apps/                       the 3 real-time C++ processes (thin mains over the headers)
    ik_solver.cpp             cmd -> joint/pose target
    motion_planner.cpp        ik target -> 1 kHz jerk-limited setpoints (+ jog, stop)
    control_node.cpp          owns shm; 1 kHz HAL loop; publishes state
  bridge/
    shm_layout.py             ctypes MIRROR of shm_layout.hpp (byte-identical) + ShmClient
    ws_bridge.py              asyncio WebSocket server <-> shared memory
    requirements.txt          websockets
  tools/
    pose_cli.py               terminal client over WebSocket (ptp/lin/joint/state)
    inject.cpp                terminal client straight into shm (no bridge) -- C++
    erobo10_viewer.html       3D viewer: loads URDF+STL, animates from live state
  test/
    test_fk.cpp               FK orthonormality + Jacobian vs finite-diff + URDF cross-check
    test_ik.cpp               IK round-trip: 100% convergence, 1 um, continuity
    test_traj.cpp             S-curve limits, synced PTP, straight-line LIN
    urdf_fk_oracle.py         independent NumPy FK of the URDF (ground truth)
  scripts/  build.sh (compile+test) · run.sh (launch all 4) · serve_viewer.sh
  docs/     this file + ARCHITECTURE/PROTOCOL/INTEGRATION/DH_PARAMETERS/HARDWARE_BRINGUP/RUN_AND_TEST_GUIDE
  Makefile  builds apps + tools + tests into bin/
```

============================================================================
## 11. Build system
============================================================================
Pure `make` + g++ (C++17), no external C++ libraries (the engine is header-only
and dependency-free, so it ports to an RT control box). Each `apps/*.cpp` and
`test/*.cpp` is a tiny `main` that `#include`s the `erm::` headers; the Makefile
compiles each into `bin/`. `build.sh` = `make all` then runs the 3 unit tests.
Python side needs only `websockets` (+ `numpy` for the test oracle). The Python
mirror is validated at import time by `assert ctypes.sizeof(...) == ...` so a
layout drift between C++ and Python is caught immediately.

============================================================================
## 12. The 3D viewer internals (tools/erobo10_viewer.html)
============================================================================
- Loads three.js + STLLoader from CDN. Embeds the URDF joint chain (origin
  xyz/rpy + axis for all 6 joints) directly in JS (verified to match the file).
- Loads the 7 STL meshes (served over http) and, if they look like millimetres,
  auto-scales by 0.001. If meshes can't load it falls back to primitive
  cylinders so it still works.
- Connects to ws://host:8765, receives the 50 Hz `state` frames, takes `q`, and
  computes the SAME URDF forward kinematics in JS to place each link mesh's
  4x4 matrix -> the model is a live digital twin of the robot.
- Sends move_ptp / move_lin / move_joint / jog / stop / estop / reset over the
  same WebSocket. So the viewer is just another client of the bridge.

============================================================================
## 13. Test & verification architecture
============================================================================
Two layers:
1. C++ unit tests (no hardware, deterministic): test_fk (FK valid + Jacobian vs
   finite difference + DH-FK vs the NumPy URDF oracle = 1.7e-6 m), test_ik (3000
   random poses, 100% convergence, 1 um, smooth continuity), test_traj (velocity/
   accel/jerk within limits, synchronized arrival, straight-line deviation 0.6 um).
2. Integration (all processes running): inject / pose_cli drive real moves
   through cmd->ik->planner->control->state and assert the robot reaches the
   target smoothly. The NumPy oracle (urdf_fk_oracle.py) is the independent
   ground truth that proves the C++ kinematics equal YOUR URDF.

============================================================================
## 14. The two ways into the same C++ logic (recap)
============================================================================
- Path A (UI / network): pose_cli or React/Electron --WebSocket--> ws_bridge.py
  --ctypes/shm--> CmdRegion --> C++ nodes. Used in production.
- Path B (direct): inject (C++) --shm--> CmdRegion --> C++ nodes. No Python, no
  WebSocket. Used for low-level testing / scripting on the control box.
Both write the identical CmdRegion bytes, so the C++ control plane can't tell
which one sent the command -- it just sees a new cmd_seq.
