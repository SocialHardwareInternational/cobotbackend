# erobo10_motion — Architecture & Flow

End‑to‑end motion stack for the **erobo10**, a 6‑DOF ZeroErr cobot (~10 kg payload class).
It takes a high‑level command from a UI (move to a pose, jog a joint, hand‑guide), turns it
into a smooth, jerk‑limited, torque‑feasible motion, and drives six ZeroErr servo drives over
EtherCAT in real time — then streams measured state back to the UI.

This document is the map: the two planes, the shared‑memory contract that joins them, the
command/state flow, the freedrive path, and **what every folder and every file does.**

---

## 1. The two planes

```
        ┌──────────────────────── UI plane (a phone, tablet, or PC browser) ────────────────────────┐
        │  erobo10_viewer.html   cobot_mobile.html   pose_tester.py / pose_cli.py                     │
        └───────────────┬───────────────────────────────────────────────┬───────────────────────────┘
                        │ JSON over WebSocket (ws://host:8765)            │ JSON over HTTP (http://host:8080/api)
                        ▼                                                 ▼
                 bridge/ws_bridge.py                              bridge/cobot_server.py
                        └───────────────────────┬─────────────────────────┘
                                                │  reads/writes POSIX shared memory
                                                ▼  /dev/shm/erobo10_shm  (one mmap'd block, seqlock)
   ┌──────────────────────────────── real‑time control plane (C++, on the robot) ───────────────────────────────┐
   │  ik_solver  ──IkRegion──▶  motion_planner  ──SpRegion──▶  ecat_control_node  ──EtherCAT──▶  6 ZeroErr drives │
   │      ▲                            ▲                              │                                           │
   │      └────────────── CmdRegion ───┴──────────────────────────────┘ (enable/estop/freedrive/jog/stop)        │
   │                                          StateRegion ◀── measured q, torque, flange pose, mode ─────────────┘
   └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

* **UI plane** — not real time. Buttons/joysticks emit small JSON commands and render the
  streamed state (including a Three.js 3D twin). It never touches the drives directly.
* **Bridge** — translates JSON ⇄ shared memory. Two transports exist (WebSocket and one‑port
  HTTP); both speak the *same* command set and both attach to the *same* shared block.
* **Control plane** — four C++ roles (one of which has a real and a simulated variant). It runs
  at 1 kHz, owns the motion math, and is the only thing that talks to hardware.

The **network boundary is only UI ⇄ bridge.** Bridge ⇄ control‑plane is shared memory in the
same machine, so it is lock‑free and microsecond‑fast.

---

## 2. The spine: shared‑memory contract

One mmap‑backed block at `/dev/shm/erobo10_shm` (`ShmBlock`, 1648 bytes) is the single source
of truth between the bridge and the control plane. Concurrency is a **seqlock** (writers bump an
odd→even sequence; readers retry on odd), so no mutexes and no blocking. The block has five
regions, each with a clear owner:

| Region | Written by | Read by | Carries |
|---|---|---|---|
| **CmdRegion** | bridge | ik_solver, motion_planner, ecat_control_node | the latest command: type, target_q/target_pose, speed, enable/estop/reset, payload |
| **IkRegion** | ik_solver | motion_planner | solved goal: move type, target_q or target_pose, reachability, gravity utilisation |
| **PathRegion** | bridge | motion_planner | MoveP waypoint list + blend/tool‑speed |
| **SpRegion** | motion_planner | ecat_control_node / control_node | the 1 kHz streamed setpoint: q_cmd, qd_cmd, moving, progress |
| **StateRegion** | ecat_control_node / control_node | bridge, motion_planner | measured q, qd, joint torque, flange pose, manipulability, mode, enabled/estop, per‑joint status |

The C++ definition lives in `core/include/erm/shm_layout.hpp`; the byte‑identical Python mirror
is `bridge/shm_layout.py`. The control node creates and zeroes the block, then publishes a magic
number; everyone else attaches and waits for it.

---

## 3. Command & state flow

**A motion goal** (move to a pose / joint target) takes the long path through the math:

```
UI: {"cmd":"move_ptp","pos":[...],"rpy":[...],"speed":0.5}
  → bridge writes CmdRegion
  → ik_solver         reads CmdRegion → solves IK → writes IkRegion (target_q) + acks the command
  → motion_planner    reads IkRegion → plans a jerk‑limited, torque‑feasible trajectory
                      → streams q_cmd into SpRegion at 1 kHz
  → ecat_control_node reads SpRegion → angle‑mode P‑controller → CSV velocity per drive
                      → EtherCAT → the six ZeroErr drives move
  → ecat_control_node publishes StateRegion → bridge → UI updates the 3D twin & readouts
```

**Direct controls** (enable, disable, e‑stop, reset, jog, stop, freedrive, payload) are shorter:

* `enable / disable / estop / reset / freedrive / set_payload` → CmdRegion → **read directly by
  `ecat_control_node`** (and e‑stop/reset latch there).
* `jog` and `stop` → CmdRegion → **read by `motion_planner`**, which integrates a jerk‑limited
  velocity follower into SpRegion (so jogging is as smooth as a planned move).

**State** always flows the other way: `ecat_control_node` (or `control_node` in sim) writes
StateRegion at 1 kHz; the bridge samples it (50 Hz for WebSocket, on‑demand for HTTP) and the UI
renders it.

---

## 4. Freedrive (hand‑guiding) path

Freedrive is special because a velocity servo holding zero velocity *resists* being pushed. So:

```
UI "Free‑drive"  → {"cmd":"enable"} + {"cmd":"freedrive","on":true}
  → CmdRegion: CMD_ENABLE, CMD_FREEDRIVE_ON
  → ecat_control_node:
        • freedrive implies enable (brakes release even if ENABLE was missed)
        • switches each drive 0x6060: 9 (CSV/velocity) → 10 (CST/torque) via a runtime SDO
        • commands zero torque (0x6071 = 0)  ⇒ motors apply ~no torque ⇒ arm is back‑drivable
  → motion_planner: while mode == FREEDRIVE it sets q_cmd = measured q (tracks your hand)
  → "Lock" / {"cmd":"freedrive","on":false}:
        • drives switch back to CSV, hold the CURRENT (hand‑moved) pose — no snap‑back
```

The PDO map is **unchanged** by this — only `0x6060` is toggled at runtime — so normal CSV motion
cannot be affected. Caveat: zero‑torque freedrive is held only by gear friction, so the arm can
sag under gravity; support it when engaging. The hardware E‑stop/STO must remain independent of
software.

---

## 5. Folders — what each one is for

| Folder | Function |
|---|---|
| **`apps/`** | The C++ executables (the control‑plane processes): the real EtherCAT driver, the simulation node, the planner, and the IK solver. |
| **`core/include/erm/`** | Header‑only, dependency‑free motion library (math, kinematics, dynamics, IK, trajectories, shared‑memory contract). Portable to an RT box with no external libs. |
| **`bridge/`** | Python translation layer: JSON ⇄ shared memory. WebSocket bridge, one‑port HTTP server, and the Python mirror of the shm layout. |
| **`tools/`** | Operator/developer front‑ends: the 3D web viewers, the phone UIs, the embedded meshes, and CLI/GUI test drivers. |
| **`robot/`** | The robot description: URDF + the STL visual meshes the viewers render. |
| **`config/`** | Runtime calibration template (direction signs, offsets) loaded on bring‑up. |
| **`scripts/`** | One‑command build and launch helpers for the sim stack, the hardware stack, and the viewer http server. |
| **`test/`** | Unit tests (FK, IK, trajectory), the NumPy URDF oracle, and the two EtherCAT mocks used to compile/run the driver offline. |
| **`docs/`** | This documentation set. |
| **`bin/`** | Build output (git‑ignored). |

---

## 6. Files — what each one does

### `apps/` — control‑plane executables
* **`ecat_control_node.cpp`** — THE hardware driver. Brings up the IgH EtherCAT master, configures
  the six ZeroErr drives (CSV mode), runs the CiA‑402 state machine + the angle‑mode P‑controller,
  and implements **freedrive** (runtime switch to CST/zero‑torque). Reads CmdRegion (enable/estop/
  freedrive/payload) + SpRegion (q_cmd); publishes StateRegion. Build with `make HARDWARE=1 apps`.
* **`control_node.cpp`** — the SIMULATION twin of the above. Same shared‑memory role, but drives an
  internal `SimDrives` model instead of hardware, so the whole stack runs on a laptop with no robot.
* **`motion_planner.cpp`** — 1 kHz jerk‑limited (S‑curve) trajectory generator. Reads IkRegion goals,
  plans synchronized PTP / straight‑line LIN / blended MoveP / jog, applies torque‑feasible time
  scaling, and streams C2‑continuous setpoints to SpRegion. Tracks measured position when disabled
  or in freedrive (bump‑free engage/exit).
* **`ik_solver.cpp`** — consumes UI goals from CmdRegion and produces joint targets in IkRegion:
  MOVE_JOINT is a limit‑checked passthrough, MOVE_PTP solves IK once, MOVE_LIN validates reachability
  and hands the pose to the planner for per‑step IK.

### `core/include/erm/` — header‑only motion library
* **`linalg.hpp`** — dependency‑free SE(3)/SO(3) math: matrices, quaternions, rotation vectors, a dense linear solver.
* **`kinematics.hpp`** — forward kinematics and the geometric Jacobian, built on the DH model.
* **`erobo10_dh.hpp`** — auto‑generated, validated Denavit‑Hartenberg parameters (from the URDF).
* **`erobo10_dyn.hpp`** — auto‑generated per‑joint frames + link rigid‑body inertials (mass, CoM, inertia).
* **`dynamics.hpp`** — Recursive Newton‑Euler inverse dynamics: joint torque `τ = M q̈ + C q̇ + G`, with payload — used for gravity/torque feasibility and the torque readout.
* **`ik.hpp`** — robust full‑6‑DOF inverse kinematics (Levenberg‑Marquardt damped least squares with multiple seeds).
* **`trajectory.hpp`** — the anti‑jitter core: jerk‑limited S‑curve profiles, synchronized PTP, Cartesian LIN, and blended paths.
* **`hal.hpp`** — EtherCAT hardware‑abstraction types/shape (`JArr`, cyclic interface) shared by the nodes.
* **`shm.hpp`** — POSIX shared‑memory map/unmap + the seqlock read/write helpers.
* **`shm_layout.hpp`** — the canonical shared‑memory contract: the five regions, `CmdType`, sizes, magic/version.
* **`ecat_hal.hpp`, `ecat_config.hpp`** — **removed** (tombstone headers). The EtherCAT layer and its tunables now live at the top of `apps/ecat_control_node.cpp`.

### `bridge/` — JSON ⇄ shared memory
* **`ws_bridge.py`** — WebSocket server (`ws://host:8765`). Maps JSON commands to shm and broadcasts StateRegion at 50 Hz. Used by the desktop viewers.
* **`cobot_server.py`** — **one‑port** HTTP server (`:8080`): serves the UI *and* the control API (`GET /api/state`, `POST /api/cmd`) on the same origin, so a phone needs no second connection. Serves the landscape UI with an injected transport shim, and reuses `shm_layout`.
* **`shm_layout.py`** — ctypes mirror of `shm_layout.hpp` (byte‑identical). `ShmClient` exposes `read_state`, `send_command`, `send_path`, `set_payload`.
* **`requirements.txt`** — Python deps (`websockets`, only needed for `ws_bridge.py`; `cobot_server.py` is stdlib‑only).

### `tools/` — front‑ends & test drivers
* **`erobo10_viewer.html`** — desktop 3D viewer + control panel (Three.js, real STL meshes, joint jog, drag‑teach, named‑waypoint panel). Connects over WebSocket.
* **`cobot_mobile.html`** — landscape touch UI: translate/rotate joysticks, per‑joint D‑pads, mode toggle, teach, payload, view presets, named‑waypoint panel, 3D. Served at `/` by `cobot_server.py` (same‑origin HTTP) or used directly over WebSocket.
* **`cobot_meshes.js`** — decimated, baked‑to‑metres copies of the 7 meshes, embedded so the viewers can render the real arm from any folder (even `file://`) when the full STLs aren't reachable.
* **`inject.cpp`** — CLI command injector + motion monitor; stands in for the bridge during testing (writes a goal, watches state, reports pose error and smoothness).
* **`pose_cli.py`** — drive the robot through the WebSocket from the terminal; includes an offline FK helper to pick reachable poses.
* **`pose_tester.py`** — tkinter GUI to test MoveJ / MoveL / MoveP, with a randomizer that fills realistic waypoints.

### `robot/` — robot description
* **`erobo10.urdf`** — the robot model (SolidWorks export): links, joints, limits, visual mesh references.
* **`meshes/erobo10/*.STL`** — the seven visual meshes (`base_link`, `link1`…`link6`) rendered by the viewers.

### `config/`
* **`ecat_calib.conf`** — EtherCAT runtime calibration template (per‑joint direction signs / offsets), auto‑loaded if present; as shipped it changes nothing until bring‑up populates it.

### `scripts/`
* **`build.sh`** — build the project.
* **`run.sh`** — start the **simulation** control plane: `control_node` + `motion_planner` + `ik_solver` + `ws_bridge`.
* **`run_hardware.sh`** — start the **real** stack: `ecat_control_node` (root) + shm permissions + `motion_planner` + `ik_solver` + `cobot_server.py` (:8080, phone) + `ws_bridge.py` (:8765, desktop).
* **`serve_viewer.sh`** — serve the project over http so the desktop viewer can load the STL meshes.

### `test/`
* **`test_fk.cpp`** — verifies DH‑based FK and the Jacobian against the URDF oracle.
* **`test_ik.cpp`** — FK‑oracle validation of the IK solver (convergence, precision, continuity).
* **`test_traj.cpp`** — validates jerk‑limited profiles, synchronized PTP, and straight‑line LIN.
* **`urdf_fk_oracle.py`** — independent NumPy URDF forward‑kinematics oracle used by the tests.
* **`mock_ecrt_sim/ecrt.h`** — a *functional* EtherCAT drive simulator (CiA‑402 state machine + velocity integration + modes‑of‑operation/SDO) so `ecat_control_node` can be **run** offline; used to validate the servo loop and freedrive.
* **`mock_ecrt/ecrt.h`** — a *minimal* `<ecrt.h>` API surface for pure **compile**‑testing.
* **`test_ecat_compile.cpp`** — obsolete tombstone (the old HAL compile test).

### Root
* **`Makefile`** — builds the sim apps + tools + tests by default; `make HARDWARE=1 apps` adds `ecat_control_node` (links `-lethercat`); `make test` runs the unit tests; `make test-ecat-mock` compiles/links the driver against the simulator.
* **`README.md`** — project entry point.
* **`.gitignore`** — ignores `bin/`, `run/`, `__pycache__/`.

---

## 7. Build & run (quick pointers)

```bash
make HARDWARE=1 apps        # build the real driver (needs libethercat)
bash scripts/run_hardware.sh   # bring up the whole stack on the robot
#   phone (landscape):  http://<robot-ip>:8080/
#   desktop viewer:     http://<robot-ip>:8080/tools/erobo10_viewer.html
make            # sim build (no hardware)
make test       # FK / IK / trajectory unit tests
make test-ecat-mock   # compile + offline-run the driver against the drive simulator
```

See the companion docs for detail: `RUN_ON_HARDWARE.md` / `HARDWARE_BRINGUP.md` (bring‑up),
`PHONE_UI.md` (phone control), `PROTOCOL.md` / `POSTMAN.md` (the JSON command set),
`ETHERCAT_INTEGRATION.md` (the drive layer), `MOTION_TYPES.md` (PTP/LIN/MoveP/jog),
`DH_PARAMETERS.md` (the kinematic model),
`HARDWARE_ACTUATORS.md` (the ZeroErr eRob actuators on each joint — torque/speed limits, CiA‑402 objects, freedrive).
