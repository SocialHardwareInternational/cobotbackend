# Running erobo10 on the real hardware — full step-by-step

This is the complete operator runbook: from a bare machine to the cobot moving under UI
control. Follow it in order. Commands are copy-paste; after each, the **Expect** line tells
you what success looks like, and **If not** tells you where to go.

> SAFETY FIRST — read once before you start
> - The **hardware E-stop / STO must be a real safety circuit**, independent of this
>   software. The software `estop` is a convenience stop, **not** a safety function.
> - During commissioning keep a hand on the hardware E-stop, move **one joint at a time**,
>   and keep the **speed scale low**.
> - The arm can hold/move heavy loads — keep clear of pinch points; support the arm before
>   releasing brakes (free-drive / disable).

---

## 0. Two ways to run (know which you're doing)

| Mode | Where it runs | What you need | Command flag |
|------|---------------|---------------|--------------|
| **Simulation** | any Linux / WSL, no robot | just the code | *(none)* |
| **Hardware** | a real Linux PC wired to the drives | EtherCAT NIC + IgH master + the cobot | `--hardware` |

Do the **Simulation** smoke-test first (Part C on a dev machine) to learn the UI safely,
then do **Hardware** (Parts A→B→C) on the control PC. Real EtherCAT needs a **native Linux
PC** with a dedicated NIC — **WSL/VMs cannot drive EtherCAT in real time.**

---

# PART A — One-time machine setup (control PC)

## A1. What you need
- A Linux PC (Ubuntu/Debian recommended), **not** WSL, for the real robot.
- A **dedicated** Ethernet port for EtherCAT (separate from your internet NIC).
- The 6-axis cobot powered, with its drives daisy-chained on the EtherCAT bus in order
  **J0 → J1 → … → J5**, and the hardware E-stop wired.

## A2. Install software dependencies
```bash
sudo apt update
sudo apt install -y build-essential make python3 python3-pip git
pip3 install --user websockets
```
**Expect:** `g++ --version`, `make --version`, `python3 -c "import websockets"` all succeed.

## A3. Install & start the EtherCAT master (IgH EtherLab)
The code talks to drives through the **IgH EtherLab** master (that's the `ecrt.h` API your
bridge already used). Install it once:
```bash
git clone https://gitlab.com/etherlab.org/ethercat.git
cd ethercat
./bootstrap
./configure --enable-generic --disable-8139too
make -j$(nproc)
sudo make install modules_install
sudo depmod
```
Point it at your **dedicated NIC** (find its MAC with `ip link`):
```bash
sudo nano /etc/ethercat.conf
#   MASTER0_DEVICE="aa:bb:cc:dd:ee:ff"   # <- your EtherCAT NIC's MAC
#   DEVICE_MODULES="generic"
sudo systemctl start ethercat        # or: sudo /etc/init.d/ethercat start
```
Verify the bus:
```bash
ethercat master      # Expect: "Phase: Idle/Operation", link up
ethercat slaves      # Expect: a line for each of your 6 drives
```
**If not:** check the NIC MAC, the cable/daisy-chain order, and drive power. No slaves = no
link — fix this before going further.

> Drive identity: the code expects vendor `0x5a65726f`, product `0x00029252`, **CSV mode**.
> If `ethercat slaves` shows different IDs, edit `core/include/erm/ecat_config.hpp`
> (`ECAT_VENDOR_ID`, `ECAT_PRODUCT_CODE`) and rebuild.

## A4. Get the code and build
```bash
cd ~/erobo10_motion           # the project folder (contains Makefile, core/, apps/, bridge/)

# 4a. Sanity build in SIMULATION first (no hardware, no -lethercat):
make all
./bin/test_fk && ./bin/test_ik && ./bin/test_traj
```
**Expect:** `FK/JACOBIAN OK`, `IK OK ...`, `MOTION PLANNER OK ...`.

```bash
# 4b. Build the control node against the real EtherCAT master:
make HARDWARE=1 apps
```
**Expect:** compiles and links (`-lethercat`) with no errors. Other binaries
(`motion_planner`, `ik_solver`) are hardware-independent and already built by `make all`.

```bash
# 4c. (optional) Offline self-check of the EtherCAT code path, no robot needed:
make test-ecat-mock          # Expect: "ECAT MOCK OK"
```

---

# PART B — Commissioning (once per robot, BEFORE any real motion)

Run these on the control PC with the robot powered and the EtherCAT bus up (Part A3).
Most of Part B needs **root** (EtherCAT master access): use `sudo`.

## B1. Self-test — comms & encoders only (NO motion)
```bash
sudo ./bin/control_node --hardware --selftest
```
**Expect:**
```
[selftest] bringing drives to OPERATION_ENABLED (max 5 s)...
   J0  state=0x27 OPERATION-ENABLED   encoder=...  -> +0.0000 rad
   ... (J1..J5) ...
[selftest] PASS: all 6 drives OPERATION_ENABLED, encoders read.
```
**If not** ("not all drives reached OPERATION_ENABLED"): check drive power, STO/E-stop,
wiring, and that all 6 slaves enumerate (`ethercat slaves`). Nothing moves in this step.

## B2. Self-test — tiny motion (direction & response)
> Hand on the hardware E-stop. This nudges each joint ~1° slowly.
```bash
sudo ./bin/control_node --hardware --selftest --allow-motion
```
**Expect:** each joint reports `responded OK` with a small measured travel. Watch each
**physical joint vs the 3D model** — note any that move the *opposite* way to the model.
**If** a joint shows `NO MOTION` (stuck brake / dead axis) or `TOO MUCH` (scale/runaway),
stop and fix wiring/brakes before continuing.

## B3. Calibrate direction signs
For every joint that moved the **wrong way** in B2, flip its sign in the runtime calibration
file (no rebuild needed):
```bash
nano config/ecat_calib.conf
#   dir=1,1,1,1,1,1      <- change the wrong ones to -1, e.g. dir=1,-1,1,1,-1,1
```
Re-run B2 until every joint moves the **same way as the model**.

## B4. Set the home offsets (so the model matches the real arm)
Move/teach the robot to a **known reference pose** (e.g. its mechanical home), then capture
it. Give the joint angles that pose *should* read, in radians:
```bash
sudo ./bin/control_node --hardware --set-home  0 0.6 -1.2 0 0.9 0
```
**Expect:** `[set-home] wrote config/ecat_calib.conf` with new `offset=...`. Verify: run
`pose_cli fk 0 0.6 -1.2 0 0.9 0` and check the printed flange XYZ matches the real TCP.

## B5. Verify brake polarity
On `enable` the brakes should **release** and the arm should hold position (not sag). If a
brake clicks the wrong way or a joint drops, swap the two brake values:
```bash
nano config/ecat_calib.conf
#   brake_release=1   ->  0
#   brake_apply=0     ->  1
```

## B6. (Recommended) Confirm the actuator effort limits
The torque-safety gate uses `jointEffortMax` in `core/include/erm/erobo10_dh.hpp`
(`140,110,110,107,87,57` Nm). Confirm these match your drive/motor **continuous** torque
(after gearing). If they're placeholders, set the real values and rebuild — the gate is only
as correct as these numbers.

> Speed during bring-up comes from the **UI speed scale (0..1)**, *not* from a low velocity
> clamp. Keep `vclamp` in `ecat_calib.conf` at/above the planner's vmax (default `2,2,...`);
> if it's lower you'll see a startup WARNING and moves will lag.

---

# PART C — Every session: start the stack and move

The system is **4 processes** sharing one memory block, with a WebSocket bridge for the UI:

```
 UI (viewer / pose_cli) --WebSocket--> ws_bridge.py --shared mem--> ik_solver
                                                                       |
                                          control_node <-- motion_planner
                                              |  (EtherCAT, 1 kHz)
                                              v
                                        the 6 drives
```

## C1. Start the control stack
Open **four terminals** (clearest for the first time). On the real robot use `sudo` and add
`--rt` to the control node for jitter-free timing.

**Terminal 1 — control node (owns EtherCAT):**
```bash
cd ~/erobo10_motion
sudo ./bin/control_node --hardware --rt --shm /dev/shm/erobo10_shm
```
**Expect:** `[ecat] master active: 6 drives ...`, `[control] HAL = EtherCAT (real hardware)`,
`[control] real-time: SCHED_FIFO ...`, `[control] erobo10 control loop up @ 1000 Hz ... [HARDWARE]`.

**Terminal 2 — motion planner:**
```bash
cd ~/erobo10_motion && ./bin/motion_planner --shm /dev/shm/erobo10_shm
```
**Expect:** `[planner] attached, control block ready`.

**Terminal 3 — IK solver:**
```bash
cd ~/erobo10_motion && ./bin/ik_solver --shm /dev/shm/erobo10_shm
```
**Expect:** `[ik] attached, ready`.

**Terminal 4 — WebSocket bridge:**
```bash
cd ~/erobo10_motion/bridge && python3 ws_bridge.py --shm /dev/shm/erobo10_shm --port 8765
```
**Expect:** `[bridge] WebSocket on ws://0.0.0.0:8765, state @ 50 Hz`.

> Simulation shortcut (dev machine, no robot): just run `./scripts/run.sh` — it starts all
> four with the **simulation** control node. For hardware, start Terminal 1 manually with
> `--hardware --rt` as above (or edit `scripts/run.sh` to add those flags).

## C2. Connect the UI

**Option A — 3D viewer (recommended):** in a 5th terminal,
```bash
cd ~/erobo10_motion && python3 -m http.server 8000
```
Open **http://localhost:8000/tools/erobo10_viewer.html** in a browser, leave the URL as
`ws://localhost:8765` (or the control PC's IP from another machine), click **Connect**.
**Expect:** the status dot turns green, the model starts tracking the real joints live, and
the panel shows joint angles, flange pose, manipulability, and **torque (peak)**.

**Option B — terminal:**
```bash
python3 tools/pose_cli.py state         # one-shot snapshot (proves the link)
python3 tools/pose_cli.py monitor       # live joint angles + pose + torque, ~10 Hz
```
(From another machine: `EROBO_WS=ws://<control-pc-ip>:8765 python3 tools/pose_cli.py monitor`.)

## C3. Enable the drives
Motion is **refused until you enable**. From the viewer click **Enable**; or:
```bash
# (any move command below auto-handled; to enable explicitly from a script send {"cmd":"enable"})
```
**Expect (viewer/monitor):** mode goes `DISABLED` → `IDLE`, `enabled=true`, brakes release,
the arm holds position. There is **no jump** on enable (the planner tracks the measured pose
while disabled).

## C4. First motion — a slow MoveJ
Start slow (speed `0.1`). MoveJ moves joints to target angles (radians):
```bash
python3 tools/pose_cli.py joint  0.0 0.5 -0.9 0.0 0.8 0.0  0.1
```
**Expect:** `ack ... ok: True`, the arm moves smoothly, `reached: ...`. Watch the model and
the real arm move together. Raise the speed scale (last number, up to `1.0`) as you gain
confidence.

## C5. The other motions
First find a reachable Cartesian pose from any joint pose (offline, no robot):
```bash
python3 tools/pose_cli.py fk 0.0 0.5 -0.9 0.0 0.8 0.0
#  -> prints flange  X Y Z  ROLL PITCH YAW  ready to paste
```
- **MoveL** (straight line; X Y Z R P Y, speed):
  ```bash
  python3 tools/pose_cli.py lin  <X> <Y> <Z> <R> <P> <YW>  0.3
  ```
- **MoveP** (constant tool speed through circular blends; groups of 6, then flags):
  ```bash
  python3 tools/pose_cli.py movep  <X1 Y1 Z1 R1 P1 YW1>  <X2 ...>  <X3 ...>  --blend 0.04 --speed 0.1
  ```
- **Jog** (continuous, from the viewer's jog buttons, or `{"cmd":"jog","frame":"joint|base|tool","vel":[6],"speed":1.0}`; stop on release).

All Cartesian moves **auto-slow through singularities** to keep joint speed within limits, so
the path stays smooth.

## C6. Free-drive (hand-guiding) & drag-teach
Hand-guide the arm and record waypoints, then replay them:
```bash
python3 tools/pose_cli.py teach
#   [Enter] = record current pose   |   'play' = replay as MoveJ   |   'done' = finish
```
Or from the viewer's **Drag-teach** card: **Free-drive → hand-guide → Record → Play**.
(Plain toggle: `pose_cli freedrive on` / `freedrive off`.) Motion commands are refused while
in free-drive; leaving it is bump-free.

## C7. Set the payload (so torque limits are correct)
Tell the controller the tool/load mass so the torque model and safety gate are accurate:
```bash
python3 tools/pose_cli.py payload 5.0      # 5 kg tool/payload
```
**Expect:** subsequent fast moves auto-slow if they'd exceed actuator torque, and a target
the arm physically can't hold at that load is **refused** with
`"exceeds actuator torque (NN% of limit) at this payload"`.

## C8. Monitor while running
- **Live stream:** `python3 tools/pose_cli.py monitor` — joint angles (deg+rad), flange
  pose, manipulability, and **torque % of limit** (watch this stay well under 100%).
- **Viewer:** the panel shows the same; the torque readout turns amber >80%, red >100%.

---

# PART D — Stopping safely
- **Smooth stop of a move:** viewer **Stop**, or `{"cmd":"stop"}` — decelerates to rest.
- **Software protective stop:** viewer **E-STOP**, or `{"cmd":"estop"}` — zeros velocity,
  drops torque, applies brakes. Clear with **Reset** (`{"cmd":"reset"}`) then **Enable**.
- **Park & power down:**
  1. Move to a safe/rest pose. 2. **Disable** (brakes engage, arm held).
  3. Ctrl-C the four terminals (or the hardware E-stop button).
  4. Power down the drives, then `sudo systemctl stop ethercat` if desired.
- **Always-available hardware E-stop** cuts drive power regardless of software.

---

# PART E — Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ethercat slaves` shows nothing | wrong NIC MAC / cabling / drives off | fix `/etc/ethercat.conf`, daisy-chain order, power |
| Self-test: not all reach OPERATION_ENABLED | STO/E-stop open, fault, wrong IDs | clear STO, check `ethercat slaves`, verify vendor/product IDs |
| A joint **runs away** on enable | feedback polarity at the drive | stop; check the drive's own velocity-loop wiring (drive-level), then re-run self-test |
| A joint moves **opposite** the model | wrong `dir` sign | flip `dir=...` in `config/ecat_calib.conf` (Part B3) |
| Arm **sags** / brake wrong | brake polarity | swap `brake_release`/`brake_apply` (Part B5) |
| Model & real arm offset by a constant | home offset not set | run `--set-home` (Part B4) |
| Arm **lags** the planned path | `vclamp` below planner vmax | raise `vclamp` in `ecat_calib.conf`; you'll have seen the startup WARNING |
| Move **refused**, "exceeds actuator torque" | pose not holdable at this payload | reduce payload, choose a less-extended pose, or verify `jointEffortMax` |
| Move **refused**, "unreachable / IK failed" | target outside workspace | pick a reachable pose (use `pose_cli fk`) |
| UI won't connect | bridge not up / wrong host | check Terminal 4, use `ws://<control-pc-ip>:8765`, open port 8765 |
| Jittery motion | not real-time | run control node with `--rt` (and `sudo`); set `ECAT_USE_DC=true`; isolate a CPU |

---

# Appendix

## Command cheat-sheet
```
# build
make all                      # simulation build + binaries
make HARDWARE=1 apps          # control_node against the real EtherCAT master
make test-ecat-mock           # offline EtherCAT code self-check

# control node (Terminal 1)
sudo ./bin/control_node --hardware --rt           # run on hardware, real-time
sudo ./bin/control_node --hardware --selftest [--allow-motion]
sudo ./bin/control_node --hardware --set-home q0 q1 q2 q3 q4 q5

# terminal client (pose_cli.py)
fk Q1..Q6        monitor        state
joint Q1..Q6 [speed]            ptp X Y Z R P Y [speed]      lin X Y Z R P Y [speed]
movep <6 vals>... --blend b --speed v
payload KG       freedrive on|off       teach

# raw WebSocket commands (ws://host:8765)
enable | disable | freedrive{on} | set_payload{kg}
move_joint{q,speed} | move_ptp{pos,rpy,speed} | move_lin{...} | move_p{waypoints,blend,tool_speed}
jog{frame,vel,speed} | stop | estop | reset | get_state
```

## File map
- `config/ecat_calib.conf` — runtime calibration (dir, offset, cpr, kp, vclamp, brake). **Edit here, no rebuild.**
- `core/include/erm/ecat_config.hpp` — EtherCAT identity, mode, defaults (rebuild to change).
- `core/include/erm/erobo10_dh.hpp` — kinematic limits + `jointEffortMax` (torque limits).
- `tools/erobo10_viewer.html` — the 3D UI. `tools/pose_cli.py` — terminal client.
- More detail: `docs/ETHERCAT_INTEGRATION.md` (wiring, control law, calibration, tuning,
  torque model), `docs/PROTOCOL.md` (WebSocket messages), `docs/FLOW_AND_ARCHITECTURE.md`.

## The three things that MUST be right before trusting motion
1. **Direction signs** (`dir`) — verified in self-test (Part B2/B3).
2. **Home offsets** (`offset`) — set with `--set-home` (Part B4).
3. **Brake polarity** + **effort limits** — verified in Part B5/B6.

Everything else (smooth jerk-limited motion, singularity slowdown, torque gating, bump-free
enable) is handled by the software once those three are correct.
