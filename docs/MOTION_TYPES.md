# Motion types — MoveJ / MoveL / MoveP (research-backed)

Definitions follow Universal Robots' official documentation (the de-facto cobot
standard; ABB MoveJ/MoveL/MoveC and KUKA PTP/LIN/CIRC are equivalent).

## MoveJ — joint-space point-to-point
The joints rotate directly from their current angles to the target angles. No
inverse kinematics is needed for the *path* (only to convert a Cartesian target
into joint angles), so there is **no singularity problem** and it is the fastest
move. The TCP traces a **curved** path. Used where the target matters but the
path does not: pick-and-place, palletizing, machine tending, packaging.
Parameters: joint acceleration (rad/s²), joint speed (rad/s), blend radius (m).

## MoveL — Cartesian linear
The TCP moves in a **straight line** in Cartesian space. The segment is
interpolated and **IK is solved at every interpolated point**. Used where the
path matters: gluing, dispensing, welding, assembly, and the final approach of a
pick. Can encounter singularities / joint-limit issues mid-line.
Parameters: tool acceleration (m/s²), tool speed (m/s), blend radius (m).

## MoveP — process move (constant TCP speed + circular blends)
The TCP moves linearly at **constant speed**, with **circular blends** rounding
the corners between waypoints. Intended for processes that need a steady speed:
sealing, gluing, dispensing. The blend radius is shared across waypoints — a
**smaller radius makes the path turn sharper**, a **larger radius makes it
smoother** — and the robot **does not stop** at the blended waypoints.
Parameters: tool acceleration (m/s²), tool speed (m/s, held constant on the
straight parts), blend radius (m).

## Blend radius (zone / CONT)
When a blend radius is set, the trajectory is modified so the arm does not stop
at the waypoint: it leaves the straight path a distance `r` before the waypoint
and rejoins it `r` after, rounding the corner with a tangent arc. This gives
smooth, continuous, faster motion through a path of points.

## How this project implements them
| UR term | This project | Engine |
|---|---|---|
| MoveJ (joints) | `move_joint` / `inject movejoint` / `pose_cli joint` | `JointTrajectory` (synced jerk-limited S-curve) |
| MoveJ (to a pose) | `move_ptp` / `pose_cli ptp` | IK once → `JointTrajectory` |
| MoveL | `move_lin` / `pose_cli lin` | `CartesianTrajectory` (straight line, SLERP, per-step IK) |
| MoveP | `move_p` / `pose_cli movep` | `BlendedPath` (segments + tangent circular arcs, single constant-speed jerk-limited profile, per-step IK) |
| MoveC (arc) | `move_c` {via, end} | `CircularTrajectory` — unique circle through current→via→end, SLERP, per-step IK |
| MoveC (full circle) | `move_c` {via, end, full:true} | `CircularTrajectory` swept 360° back to the start through the via |
| Relative / offset | `move_rel` {delta[xyz], frame:base\|tool} | delta added to the current flange pose → `CartesianTrajectory` (straight line) |

All are jerk-limited (S-curve) for smoothness. MoveP holds constant tool speed on
the straight parts and blends each interior corner with a circular arc of radius
`R = d·tan(β/2)` (d = blend distance, β = corner angle ABC), so the path is
C1-continuous and never stops at a waypoint.

## MoveC — circular arc (ABB MoveC / KUKA CIRC)
Three points define the move: the **current** pose (start), a taught **via** (mid) point, and the
**end** point. The unique circle through them is found (3‑point circumcircle); the TCP follows the arc
at jerk‑limited speed while the orientation SLERPs start→end. With `full:true` it sweeps the **complete
360° circle** back to the start through the via (UR "complete circle"). Used for circular dispensing,
deburring, sealing around a bore. Collinear points degrade gracefully to a straight line.

## Relative / offset move (ABB Offs / UR pose_trans)
`move_rel` nudges the TCP by a delta `[dx,dy,dz]` from its **current** pose, either in the **base**
frame (world axes) or the **tool** frame (delta rotated by the current TCP orientation — e.g. "5 cm
along the tool's approach axis"). Runs as a straight line. Handy for teach‑time jogging‑by‑amount and
for approach/retract offsets.

## Palletizing (UR Pallet template)
Teach a **PICK** pose and a pallet **CORNER** pose (as waypoints, which store the pose), then give a
grid: counts `nx·ny·layers` and pitch `dx,dy,dz` plus an **approach** clearance. Every cell is computed
as an offset from the corner, and for each cell the generator emits
`pick‑approach → PICK → retract → place‑approach → PLACE(cell) → retract` (transit = PTP, the vertical
legs = MoveL). The whole thing runs as a normal **program**, so each move is completion‑gated and the
collision / singularity safety applies. `order:snake` alternates row direction to cut travel. See
`bridge/palletizing.py`; run via `pallet_run` or the viewer's **▦ Motion+** panel.

## Path‑tracking safety (all Cartesian moves)
Straight‑line and circular paths solve IK per cycle, which can become infeasible mid‑path (IK branch
flip, joint limit, wrist wind‑up on a full circle). Two guards keep this safe: a **discontinuity guard**
(abort if the per‑cycle IK jumps) and a **flange‑tracking guard** (abort if the achieved TCP position
drifts >5 cm from the commanded path). So an infeasible Cartesian move **stops cleanly** rather than
flailing — MoveJ (or splitting into shorter segments) is the fallback when a straight/round path can't
be followed.

Sources: Universal Robots — Robot motion basics
(universal-robots.com/developer/hardware-and-motion/robot-motion-motion-control-basics),
URScript `movej/movel/movep` manual entries, UR "Circular path using MoveP/MoveC", UR "Create a
complete Circle using MoveC", and the UR Palletizing template; ABB RAPID `MoveC`/`Offs` and KUKA
`CIRC` for the circular/relative semantics.
