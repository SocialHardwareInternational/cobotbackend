# Joint calibration — make the 3D model match the physical arm

The model poses the arm from the encoder angles using `model_angle = sign·encoder + offset` per
joint. If a joint turns the **opposite way** in the model, its `sign` is wrong; if the model's zero
pose differs from the arm's, its `offset` is wrong. Both live in **`run/calibration.txt`** and are
applied on the next ecat‑node start — **no rebuild** needed.

```
sign    1  1  1  1  1  1     # 1 or -1 per joint J1..J6
offset  0  0  0  0  0  0     # DEGREES per joint J1..J6
```

## Procedure (≈5 min, do it on the real arm)

Clear space around the robot; keep a hand on the E‑STOP.

### 1. Signs (direction) — the usual cause of "diverges as the angle changes"
1. **Enable**, then **All joints → 0**. (If any joint would swing into something, jog it clear first.)
2. For **each joint J1…J6**, use the Jog arrow to move it **+~30°** (the ▶ / "+" direction), watch
   the **3D model**, then look at the **real arm**:
   - Same rotation direction → `sign = 1` (leave it).
   - Opposite direction → `sign = -1` for that joint.
3. Put those six values on the `sign` line and restart the ecat node.

### 2. Zero offsets (pose) — only if the model's shape is shifted after signs are right
1. With signs correct, go to **All joints → 0**. The model shows the "candle" (all links straight
   up in a line).
2. If the real arm at all‑zeros is **not** that same straight‑up pose, each joint needs an offset.
   The easiest reference: for each joint, line the arm up to a pose you can judge by eye (e.g. a
   link exactly horizontal or vertical), read the model's displayed angle for that joint, and set
   `offset` so the model reads the true angle there. Equivalently: `offset_deg = true_deg −
   shown_deg`.
3. Put the six values on the `offset` line (degrees) and restart.

### 3. Verify
- All‑zeros → model and arm both in the straight‑up candle.
- Sweep each joint across its range → the model tracks the arm 1:1 in direction and amount.
- A couple of Cartesian moves land where the model shows them.

## Notes
- `sign`/`offset` map encoder ↔ model **consistently for both display and control**, so once the
  model matches the arm, Cartesian moves (IK) are correct too.
- If a joint is *geometrically* wrong (elbow bends the wrong way even with sign/offset right), that's
  a URDF axis/origin issue, not calibration — tell me and I'll fix the URDF for that joint.
- The ecat node prints the loaded calibration at startup: `[ecat] calibration loaded: sign=[…]
  offset(deg)=[…]` — check it matches your file.

## How the active TCP is applied to motion (j / p / l / c / waypoints)

Applying a TCP sets one runtime tool transform `T_flange->tcp` that travels with
**every** command in the shared-memory `cmd.tcp` field. Each node uses it:

- `ik_solver`  : `solveIKtcp(P) = solveIK(P · T_tool⁻¹)` for PTP / LIN / P / C.
- `motion_planner` : interpolates the **tool-tip** path via `tcpFK(q) = FK(q) · T_tool`.
- `ecat_control_node` : publishes the tip pose (`tcp_pos`, `tcp_quat`) in state.

Move-type semantics (matches UR/ABB: a waypoint is fundamentally a TCP pose —
"the robot moves the TCP to the position and orientation saved within the waypoint"):

- **MoveL / MoveP / MoveC** — Cartesian; always honour the active TCP (the tip
  follows the path). Unchanged.
- **MoveJ / stored waypoint replay** — previously replayed *raw joint angles*, so
  the TCP had no effect (the flange returned to the taught posture). Now: when a
  tool is applied **and** the waypoint carries a taught pose, the step is replayed
  as **PTP to the taught tool-tip pose** (IK in TCP space), so applying/changing
  the TCP actually changes where the arm lands. With no tool (identity TCP) or a
  joint-only waypoint, exact joint replay is preserved (drive-stable, unchanged).

So after **Apply TCP**, j / p / l / c and both single-waypoint `Go` and full
programs all move the tool tip to the taught location.
