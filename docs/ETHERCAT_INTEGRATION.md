# erobo10 — EtherCAT Hardware Integration

This connects the erobo10 motion stack (IK · jerk-limited planner · MoveJ/L/P ·
WebSocket UI) to the **physical 6-axis cobot** over EtherCAT, using your proven IgH
master logic as the real HAL backend. Nothing in the upper stack changes — the UI →
bridge → IK → planner → control loop path is identical to simulation; only the bottom
layer (drives) switches from `SimDrives` to `EcatDrives`.

```
 React/Electron pendant
        │  WebSocket JSON
        ▼
   ws_bridge.py ──► /dev/shm/erobo10_shm (seqlock, lock-free) ◄── ik_solver ◄── motion_planner
        ▲                                                                            │ q_cmd, qd_cmd @1kHz
        │ state @50Hz                                                                ▼
        └────────────────────────────── control_node ──► EcatDrives ──► EtherCAT ──► 6 drives
                                          (1 kHz)         (CSV + SW position loop)     + brakes
                                              ▲ encoder pos/vel ─────────────────────────┘
```

## What is reused from your bridge (unchanged)
- Slave identity: vendor `0x5a65726f`, product `0x00029252`.
- **CSV mode** (0x6060 = 9): drives take a cyclic **target velocity** (0x60FF).
- PDO map (per drive):

  | Dir | Object | Sub | Bits | Meaning |
  |-----|--------|-----|------|---------|
  | Rx (0x1600) | 0x6040 | 0 | 16 | controlword |
  | Rx | 0x60FF | 0 | 32 | target velocity |
  | Rx | 0x60FE | 0 | 32 | digital outputs (**brake**) |
  | Tx (0x1A00) | 0x6041 | 0 | 16 | statusword |
  | Tx | 0x6064 | 0 | 32 | actual position |
  | Tx | 0x606C | 0 | 32 | actual velocity |

- CiA-402 state machine: FAULT→reset, SWITCH-ON-DISABLED→shutdown, READY→switch-on,
  SWITCHED-ON→enable, OPERATION-ENABLED→run.
- Brake on digital output 0x60FE (1 = release, 0 = apply).
- Encoder scaling 524287 counts/rev (19-bit).

All of this lives in **`core/include/erm/ecat_config.hpp`** (one file to edit) and
**`core/include/erm/ecat_hal.hpp`** (the `EcatDrives` backend).

## The one real change: position setpoints → velocity (CSV)
The planner emits smooth, jerk-limited **position** setpoints `q_cmd` at 1 kHz. CSV
drives want a **velocity**. `EcatDrives` closes the position loop in software each tick:

```
qd_ff   = (q_cmd - q_cmd_prev) / dt        # planner's own joint velocity (feed-forward)
error   = q_cmd - q_actual                  # following error from the encoder
qd_cmd  = qd_ff + POS_KP * error            # commanded joint velocity (rad/s)
qd_cmd  = clamp(qd_cmd, ±JOINT_VEL_CLAMP)   # HARD safety cap
target_velocity[counts/s] = qd_cmd * counts_per_rad
```

Because the feed-forward already matches the planned motion, the error term stays tiny
and the velocity stream is smooth (this is what removes the old UDP jitter). The clamp
is the last-line safety: no error can ever command more than `JOINT_VEL_CLAMP[i]`.

## Build & run on the robot
```bash
# 1) Build control_node against the real IgH master (other binaries unchanged):
make HARDWARE=1 apps          # links -lethercat, defines WITH_ETHERCAT

# (sanity, no hardware needed — type-checks the whole EtherCAT path:)
make test-ecat-mock

# 2) Bring up the IgH master (your setup), then start the stack as root/RT:
sudo ./bin/control_node --hardware --shm /dev/shm/erobo10_shm
./bin/motion_planner --shm /dev/shm/erobo10_shm
./bin/ik_solver      --shm /dev/shm/erobo10_shm
cd bridge && python3 ws_bridge.py --port 8765

# 3) From the UI (or terminal): ENABLE the drives, then move.
#    Motion is refused until enabled. Order: enable → move → (disable when done).
python3 tools/pose_cli.py monitor          # live joint angle + pose readout
```
`control_node` **without** `--hardware` still runs the full simulation (default), so you
can develop UI/motion offline and flip to hardware with one flag.

## Calibration — do this once, in order (REQUIRED for correct motion)
Edit `core/include/erm/ecat_config.hpp`, rebuild `make HARDWARE=1 apps` after each change.
**Start with the conservative default `JOINT_VEL_CLAMP` (0.6 rad/s).**

1. **Encoder scale** — confirm `ENCODER_COUNTS_PER_REV[i]` (default 524287) makes the
   live URDF joint angle match the real joint 1:1. Rotate a joint 90° by hand (brakes
   off, disabled) and check `pose_cli monitor` reads ~90°. If geared differently, set the
   per-joint counts-per-output-rev.
2. **Direction sign** `JOINT_DIR[i]` — enable, jog each joint **+** slowly; if the real
   joint (and the live URDF) turn the *wrong* way, flip that joint's sign to `-1`.
3. **Home offset** `JOINT_OFFSET[i]` — drive/teach the robot to a known reference pose
   with DH angles `q_ref`. Set `JOINT_OFFSET[i] = q_ref[i] − q_measured[i]` so encoder
   zero aligns with the URDF zero. Verify `pose_cli fk` of `q_ref` matches the real TCP.
4. **Brake polarity** — if a brake clicks on the wrong command (or a joint sags on
   enable), swap `BRAKE_RELEASE_VALUE` / `BRAKE_APPLY_VALUE`.
5. **Gain `POS_KP`** — raise from 40 until tracking is stiff; back off ~30% if you hear
   buzz or feel vibration. Watch following error in `monitor`.
6. **Raise `JOINT_VEL_CLAMP`** toward production speeds (up to `jointVelMax()` = 1.57
   rad/s) only after 1–5 are confirmed safe.

## Safety (non-negotiable)
- The **E-stop / STO must be a hardware safety circuit** independent of this software.
  The software `estop` (zeros velocity, drops to SHUTDOWN, applies brakes) is a
  convenience stop, **not** a safety function.
- First power-on: low `JOINT_VEL_CLAMP`, one joint at a time, hand on the hardware
  E-stop. The software refuses all motion until you explicitly **enable**.
- On enable there is no jump: while disabled the planner tracks the measured position,
  so following error is ~0 at the moment drives engage.

## Troubleshooting
- **Drives never reach OPERATION_ENABLED** — watch `control_node` stderr per-joint state;
  a stuck FAULT means check wiring/limits/STO; verify vendor/product IDs and that all 6
  slaves enumerate (`ethercat slaves`).
- **A joint runs away on enable** — wrong `JOINT_DIR` sign (positive feedback). Disable,
  flip the sign, rebuild.
- **Joint sags / won't hold** — brake polarity (step 4) or `POS_KP` too low.
- **Audible buzz / vibration** — `POS_KP` too high, or enable DC for tighter sync.
- **Jitter** — set `ECAT_USE_DC = true` (1 ms sync0) and run `control_node` with RT
  priority (`chrt`/`SCHED_FIFO`) and CPU isolation.

## CSV vs CSP
Your drives run **CSV** (velocity) and this backend matches that. If you later prefer
**CSP** (position, 0x6060 = 8): map 0x607A (target position) in place of 0x60FF, set
`ECAT_OP_MODE = 8`, and write `radToCounts(i, q_cmd[i])` each cycle instead of the
velocity law. The position-loop code is then unnecessary (the drive closes it). Keep CSV
unless you have a reason — it's what your hardware is proven on.

---

# Bring-up tooling (built in this stack)

## 1. `--selftest` — verify comms before any real motion
```bash
make HARDWARE=1 apps
sudo ./bin/control_node --hardware --selftest                 # comms + encoders, NO motion
sudo ./bin/control_node --hardware --selftest --allow-motion  # + tiny clamped per-joint nudges
```
Without `--allow-motion` it only brings EtherCAT up, confirms **all 6 drives reach
OPERATION_ENABLED**, and prints each per-drive CiA-402 state + encoder reading — nothing
moves. With `--allow-motion` it then nudges each joint at <= `SELFTEST_NUDGE_VEL`
(0.05 rad/s) for ~0.3 s and reports measured travel vs expected, flagging `NO MOTION`
(dead joint / stuck brake) or `TOO MUCH` (scale / runaway). Watch each joint against the
live URDF; if one turns the wrong way, flip its sign (next section).

## 2. Runtime calibration — no recompiles
`EcatDrives` auto-loads **`config/ecat_calib.conf`** at startup and overrides the
compile-time defaults. Edit it and restart `control_node` — no rebuild. Keys: `dir`,
`offset`, `cpr`, `kp`, `vclamp` (six comma-separated values, J0..J5) and `brake_release`,
`brake_apply`. The shipped file is a safe template (all defaults).

- **Direction sign**: set `dir=...` to `-1` for any joint that nudged the wrong way.
- **Home offset**: drive/teach to a known reference pose, then
  ```bash
  sudo ./bin/control_node --hardware --set-home  0 0.6 -1.2 0 0.9 0
  ```
  captures the current encoders so they read those joint angles, and writes `offset=...`.
- **Brake polarity**: swap `brake_release` / `brake_apply` if a brake clicks the wrong way.
- **Gain / speed caps**: tune `kp` and raise `vclamp` toward production speed once safe.

## 3. Free-drive / drag-teach (hand-guiding)
Replicates your bridge's `drag_mode`: brakes off, zero-velocity, position loop disabled, so
the arm is back-drivable. The planner tracks the measured pose during free-drive, so
leaving it is bump-free. Motion commands are refused while in free-drive.

Protocol: `{"cmd":"freedrive","on":true|false}` (state broadcast carries `"freedrive":bool`,
mode `FREEDRIVE`). From the terminal:
```bash
python3 tools/pose_cli.py freedrive on      # hand-guide
python3 tools/pose_cli.py freedrive off
python3 tools/pose_cli.py teach             # guided: [Enter]=record  'play'=replay  'done'=finish
```
`teach` records joint waypoints while you hand-guide, then replays them as a sequence of
MoveJ. In the 3D viewer: **Free-drive → hand-guide → Record → Play** (Drag-teach card).

> Free-drive enables the drives with brakes released. Keep the hardware E-stop in reach and
> support the arm before engaging. On drives that resist back-driving in velocity mode, add a
> gravity-compensation feed-forward (per-joint torque) — the hook is the FREEDRIVE branch in
> ecat_hal.hpp.

---

# Tuning for smooth & accurate motion on the real arm (measured)

The IK and planner were profiled against the hardware control path; findings and the
tuning now in place:

- **Per-step IK fits the 1 kHz budget.** Warm-started LM solve: mean ~2 us, worst ~21 us
  per cycle (budget 1000 us). MoveL/MoveP can close IK every tick with huge margin.

- **Velocity feed-forward tracks faithfully.** The CSV position loop runs
  `vel = qd_ff + KP*(q_cmd - q_act)`. With the clamp at/above vmax, following error on a
  full-speed MoveJ is ~0.017 deg. The planner now also publishes `qd_cmd` for Cartesian
  moves (not just joint moves).

- **The velocity clamp must sit ABOVE vmax.** `JOINT_VEL_CLAMP` is a *safety backstop*, not
  a speed setting. Below vmax it silently clamps normal motion and the arm lags the plan
  (measured: clamp 0.6 vs plan 1.4 rad/s -> 45 deg error, move doesn't finish in time).
  Default is now 2.0 rad/s (> vmax 1.57) and `control_node` **warns at startup** if any
  value is below vmax. To run slowly during bring-up, use the **UI speed scale (0..1)** --
  the planner honours it -- never a low clamp.

- **Singularities no longer distort Cartesian moves.** A MoveL/MoveP through a wrist
  singularity previously demanded ~1800x the joint velocity limit (which the drive would
  clamp -> gross path distortion). The planner now caps per-cycle joint velocity at
  `jointVelMax` and time-scales the path: it **slows through the singular region** and
  still reaches the target (verified: peak joint velocity 1807x -> 100% of limit, end error
  0.000 mm; a live MoveL through manip=0.056 completes cleanly). Normal moves are unchanged.

- **Real-time loop.** Run the control loop with `--rt` (locks memory + SCHED_FIFO prio 80)
  under privilege for jitter-free 1 kHz; combine with `ECAT_USE_DC = true` (1 ms sync0) and
  CPU isolation for the tightest EtherCAT timing.
  ```bash
  sudo ./bin/control_node --hardware --rt
  ```

Net: with the clamp as a backstop (>= vmax), the speed scale for slow work, singularity
time-scaling, the jerk-limited planner, warm-started continuous IK, and `--rt`, the
commanded stream to the drives is smooth and the measured arm tracks the URDF model
accurately across joint, linear, and process moves.

---

# Actuator dynamics & torque limits (so motion stays within what the drives can deliver)

Originally the planner used only *kinematic* limits (velocity / accel / jerk) and never
checked joint **torque**. A gravity analysis from the URDF masses showed that is unsafe at
load: holding the home pose with a 10 kg payload needs **128 Nm at joint 2 (116% of its
110 Nm limit)**, and an extended shoulder pose needs **172 Nm (156%)**. Commanding such a
move would fault the drive (overcurrent / following-error) or sag the arm. Now modelled:

- **Inverse-dynamics model** (`erm/dynamics.hpp`, RNEA over the URDF rigid bodies):
  `tau = M(q)·qdd + C(q,qd)·qd + G(q)` with an optional flange payload. Gravity torque was
  cross-validated against an independent computation (matches to 0.1 Nm).
- **Feasibility gate** (`ik_solver`): a target whose gravity-hold torque exceeds 98% of any
  joint's effort is **refused** with a clear reason ("exceeds actuator torque (NN% of
  limit) at this payload") instead of being run into a fault.
- **Torque-feasible speed de-rate** (planner): a MoveJ whose peak inverse-dynamics torque
  would exceed effort is automatically slowed until it fits. Verified: a full-speed MoveJ is
  39% of effort at 0 kg (runs full speed), 118% at 5 kg and 197% at 10 kg (both de-rated).
- **Payload**: `{"cmd":"set_payload","kg":X}` (or `pose_cli payload X`) sets the tool/load
  mass used by the gate, de-rate, and telemetry. Sticky across commands.
- **Live torque telemetry**: state carries per-joint `torque[6]` (Nm) and `torque_util`
  (peak fraction of effort); shown by `pose_cli monitor` and the viewer (green/amber/red).

## What still needs the real hardware / datasheets (honest list)
- **Verify `jointEffortMax`** (140,110,110,107,87,57 Nm in erobo10_dh.hpp) against the real
  drive/motor **continuous** torque (gear ratio, peak-vs-continuous). The gate is only as
  correct as these numbers; if the URDF efforts are placeholders, set the true values.
- **Friction** (Coulomb + viscous) is not in the model; the drive's current loop absorbs it,
  but the estimate slightly under-reads. Add per-joint friction terms if you need precision.
- **True free-drive "float"** (zero-gravity hand-guiding) needs **CST torque mode** with a
  gravity-compensation feed-forward (we now have `gravityTorque(q,payload)` for exactly
  this). The current free-drive holds via the velocity loop -- safe, but stiff to push.
- **Drive current / following-error / thermal limits** are configured in the drive itself
  and remain the hardware backstop; keep them enabled.
