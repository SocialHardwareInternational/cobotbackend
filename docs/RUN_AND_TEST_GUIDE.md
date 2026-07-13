# erobo10_motion — full run & test guide

Goal: build it, run the whole control stack, and **test the IK + motion on your
real erobo10 URDF** — both from the command line and in a 3D viewer that loads
your actual STL meshes.

If any terminal line shows a `>` prompt, you pasted a stray quote — press
`Ctrl + C` and retry.

---

## PART 0 — what you'll run
Four programs talk over shared memory, and a bridge exposes WebSocket:
`control_node` (1 kHz) · `motion_planner` (1 kHz, jerk-limited) · `ik_solver` ·
`ws_bridge.py`. You drive it with `pose_cli.py`, the 3D viewer, or Postman.
This is a Linux stack, so on Windows run it inside **WSL**.

---

## PART 1 — one-time setup
**Windows:** open PowerShell as admin → `wsl --install` → reboot → open **Ubuntu**.
Then, in Ubuntu (or any Linux/WSL shell):
```bash
sudo apt update && sudo apt install -y build-essential python3 python3-pip
pip3 install --break-system-packages websockets numpy
```

## PART 2 — get the project & build
Put the `erobo10_motion` folder somewhere simple. On Windows copy it to
`C:\Users\aryan\erobo10_motion`, then in Ubuntu:
```bash
cp -r /mnt/c/Users/aryan/erobo10_motion ~/erobo10_motion
cd ~/erobo10_motion && chmod +x scripts/*.sh
./scripts/build.sh
```
You should see the three unit-test lines pass:
```
FK/JACOBIAN OK
IK OK (no-fail + precise + continuous)
MOTION PLANNER OK (jerk-limited, synced, straight-line)
```
`FK/JACOBIAN OK` already means the C++ kinematics reproduce **your URDF** (it is
cross-checked against a NumPy FK built from `robot/erobo10.urdf`).

## PART 3 — run the whole stack
```bash
cd ~/erobo10_motion
./scripts/run.sh
```
Leave it running. It prints `WebSocket on ws://0.0.0.0:8765`. Open a **second**
Ubuntu window for the test commands below.

## PART 4 — test IK + motion from the command line
In the second window (`cd ~/erobo10_motion`):

**A pose move (this exercises the IK).** Arguments: x y z roll pitch yaw [speed]:
```bash
python3 tools/pose_cli.py ptp -0.40 -0.62 0.85 3.14 0 0 0.6
```
Expect: `ack ... ok: True, pos_err ~1e-9 m` then `reached: flange [-0.4, -0.62, 0.85]`.
`pos_err` is the IK residual — it lands on the target to ~nanometres.

**A straight-line move (Cartesian LIN):**
```bash
python3 tools/pose_cli.py lin -0.35 -0.62 0.78 3.14 0 0 0.5
```

**A joint move:**
```bash
python3 tools/pose_cli.py joint 0.3 0.5 -0.8 0.2 0.7 -0.3
```

**An unreachable pose** (far outside the ~0.9 m reach) returns `ok:false` instead
of moving — the IK refuses cleanly:
```bash
python3 tools/pose_cli.py ptp 5 5 5 0 0 0
```

You can also use the C++ injector directly (no bridge needed), e.g.
`./bin/inject ptp -0.40 -0.62 0.85 0.98 0 0.20 0`.

## PART 5 — test/apply on the REAL URDF (3D viewer with your meshes)
This shows your actual robot model moving under the IK + planner.

1. Keep the stack from Part 3 running. Open a **third** Ubuntu window:
   ```bash
   cd ~/erobo10_motion
   ./scripts/serve_viewer.sh
   ```
   (Serving over http is required so the browser can load the STL meshes.)
2. In your browser open: `http://localhost:8000/tools/erobo10_viewer.html`
   - The legend shows **"real STL meshes"** once your 7 meshes load.
3. Click **Connect** (URL is already `ws://localhost:8765`). The real erobo10
   appears and tracks the live robot.
4. **Move to a pose:** set position x/y/z and orientation roll/pitch/yaw, pick a
   speed, click **PTP** (fastest) or **LIN** (straight line). Watch the model run
   the jerk-limited motion to the pose computed by the IK.
5. **Joint target:** drag the J1..J6 sliders → **Move joints**.
6. **Jog** in real time (Part 6).
7. **E‑STOP / Reset** are top-right; `manip` (top bar) shows singularity proximity.

If the legend says "primitive view (serve over http)", you opened the file
directly (`file://`) — use the `http://localhost:8000/...` URL from step 2.

## PART 6 — jogging (teach-pendant style)
Real-time velocity jog, jerk-limited. From the CLI or your UI send repeated `jog`
messages while a button is held, then `stop` on release:
```json
{ "cmd": "jog", "frame": "joint", "vel": [0.5,0,0,0,0,0], "speed": 1.0 }
{ "cmd": "jog", "frame": "tool",  "vel": [0,0,0.05,0,0,0] }
{ "cmd": "stop" }
```
`frame` = `joint` (6 joint rad/s) or `base`/`tool` (twist [vx,vy,vz,wx,wy,wz]).
A 0.25 s watchdog smoothly stops the robot if messages stop arriving.

## PART 7 — drive it from Postman (optional)
New → WebSocket → `ws://localhost:8765` → Connect. Paste any message, e.g.
`{ "cmd": "move_ptp", "pos": [-0.4,-0.62,0.85], "rpy": [3.14,0,0], "speed": 0.6 }`.
Full protocol in `docs/PROTOCOL.md`.

## PART 8 — prove the kinematics match your URDF
```bash
# C++ FK (from the derived DH) vs an independent NumPy FK of your URDF:
./bin/test_fk --fk > /tmp/dh.txt
python3 test/urdf_fk_oracle.py > /tmp/urdf.txt
python3 -c "import numpy as np;print('max |DH-URDF| =','%.2e m'%np.max(np.abs(np.loadtxt('/tmp/dh.txt')-np.loadtxt('/tmp/urdf.txt'))))"
```
Expect ~`1.7e-06 m` — sub-micron (limited only by the URDF rounding pi/2 to 1.5708).
The clean DH table is in `docs/DH_PARAMETERS.md`.

## Troubleshooting
- **CLI/viewer can't connect** → the stack (Part 3) isn't running, or URL isn't
  exactly `ws://localhost:8765`.
- **`No module named websockets`** → `pip3 install --break-system-packages websockets`.
- **viewer shows "primitive view"** → open via `http://localhost:8000/...`, not `file://`.
- **a command says `ok:false`** → the pose is unreachable; pick one within ~0.9 m
  of the base, e.g. the Part 4 examples.
- **`Address already in use`** → an old stack is running; close it or change the
  port: `EROBO_PORT=8766 ./scripts/run.sh` and connect to `ws://localhost:8766`.
