# eRoBo 10 — User & Operator Manual

*Platform v2.0 · applies to the physical robot and the simulator*

## 1. What you have

The eRoBo 10 is a 6-axis collaborative robot (ZeroErr eRob actuators: 142H shoulder,
110H elbow, 80H wrists) with a real-time EtherCAT controller, a jerk-limited motion
engine, a configurable safety system, and **eRoBo Studio** — the desktop / pendant
software. One controller exposes every interface: Studio (desktop app or browser at
`http://<robot>:8080/`), WebSocket + REST APIs, Modbus TCP for PLCs and optional MQTT.

## 2. Powering on

1. Switch on the control box; wait for the drives' status LEDs.
2. The controller services start automatically (see `deploy/`). Within ~15 s the
   pendant UI is reachable at `http://<robot>:8080/`.
3. Open Studio. The header shows the robot mode: **DISABLED** after power-on.
4. Press **Enable**. The brakes release and the arm holds position (mode **IDLE**).
   Enabling is bump-free: the commanded setpoint is synchronised to the measured
   position before power, so the arm never jumps.

First boot only: log in as `admin` / PIN `1234` and change the PIN when prompted
(Setup → My account).

## 3. Moving the robot

**Jogging (Move page).** Choose Base or Tool frame, hold the +/− keys for Cartesian
or per-joint jogging. Jog speed and the global speed slider both scale motion; jogging
stops the instant you release. `Esc` or **STOP MOTION** halts smoothly at any time.

**Hand guiding (freedrive).** Toggle *Hand guiding*: the drives switch to zero-torque
mode and you can move the arm by hand. Used for drag-teaching waypoints. Toggle off to
hold position again.

**Move to pose.** Enter a Cartesian target (mm / degrees), then MoveJ (fastest, joint
interpolated) or MoveL (straight TCP line). Unreachable targets, torque-infeasible
poses, singular straight lines and targets inside restricted safety zones are rejected
*before* motion starts, with a plain-language reason.

## 4. Teaching and programs (Program page)

1. **Teach waypoints**: jog or hand-guide to a pose, then *⊕ Teach current pose* (also
   available inside a step's parameter panel).
2. **Create a program** and add steps: MoveJ / MoveL / MoveP (blended continuous
   path) / MoveC (arc), Wait, Wait-DI, Set-DO/AO, Speed, Payload, Tool, Note, Halt.
3. Select a step to edit its parameters; reorder with ↑ ↓.
4. **Run.** The running step is highlighted live; the console shows step events.
   *Loop* repeats until stopped. Programs, run counts and cycle counts are stored on
   the robot and survive restarts.

Motion quality: all moves are jerk-limited S-curves, C²-continuous, synchronized
across joints, torque-checked against the actuator limits at the active payload, and
MoveP holds constant tool speed through blended corners — no stop-and-go between
waypoints.

## 5. Tools & payload (Tools page)

Define tools in the library (offset, orientation, payload mass, centre of gravity) and
**Activate** the one that is mounted; programs can switch tools with a *Tool* step.
The active TCP governs Cartesian moves, taught poses, speed/force monitoring and
gravity compensation. Use **TCP teach (4-point)** to measure an unknown tool: touch
one fixed point from 4+ orientations and apply the solved offset (RMS shown in mm).

## 6. Safety (Safety page)

- **Speed limits**: hard TCP speed, reduced-zone speed, elbow speed.
- **Force limit**: estimated external TCP force (from joint-torque residuals) —
  requires contact detection to be enabled.
- **Safety planes** (up to 6): keep the TCP on the normal side. *Forbidden* planes
  stop motion at the boundary and reject targets beyond it; *Reduced* planes switch
  the arm to the reduced speed. Planes render in the 3-D view.
- **Workspace bounds**: max reach sphere, floor, ceiling, base keep-out cylinder.
- **Contact detection**: sensorless collision detection from motor-torque residuals;
  a detected impact triggers a protective stop.
- **Self-collision monitor**: predicted link-to-link clearance with auto-stop.

Recovery: any protective stop shows a banner naming the cause. Remove the cause and
press **Enable** — recovery never replays stale motion. The **hardware E-stop chain
is independent of all software** and always takes priority.

## 7. Production & integration

- **Speed override** (header slider) scales all motion live, 5–100 %.
- **PLC / fieldbus**: Modbus TCP (port 1502) — start/stop programs, read state,
  drive I/O. See `docs/INTEGRATION_API.md`.
- **I/O page**: monitor & drive DO/AO, watch DI, force DI for dry-runs.
- **Diagnostics page**: per-joint temperature, current, torque utilisation, brake
  state, live torque sparklines, control-loop jitter, 24 h alarm summary.
- **Logs page**: the controller's flight recorder (every alarm, mode change, program
  event and configuration change).
- **Backup** (Setup page): one file containing programs, waypoints, tools, safety
  configuration, users and settings; restorable on any eRoBo controller.

## 8. Daily checklist

Power on → Enable → verify E-stop works → run the day's program at reduced speed for
one cycle → full speed. At shutdown: Disable (brakes engage), then power off.
