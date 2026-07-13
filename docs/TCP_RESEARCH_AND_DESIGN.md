# TCP (Tool Center Point) configuration — research and recommended design

This is the research pass requested before implementation. It surveys how the
major cobot/industrial vendors and the open-source/academic community define and
configure a TCP, then reasons out the **best implementation for this specific
machine** (the ZeroErr eRob 6-axis cobot) and **this codebase** (the validated
DH/LM kinematics + RNEA dynamics + shared-memory pipeline already in `erobo10_motion`).
It deliberately does **not** reuse the earlier standalone TCP project; it designs
from the sources and from the hardware.

---

## 1. What a TCP actually is (vendor consensus)

Every credible source agrees on the same core model:

> A TCP is a **rigid frame** — a translation **and** a rotation — defined **relative
> to the center of the tool output flange**. Motion, jogging and pose readout are
> then expressed at the TCP instead of the bare flange.

- **Universal Robots**: a pose is `p[x, y, z, ax, ay, az]` where `x,y,z` is the TCP
  position and `ax,ay,az` is the orientation as an **axis-angle / rotation vector**.
  `set_tcp(pose)` sets the tool frame relative to the flange; `get_actual_tcp_pose()`
  returns the TCP in the base frame from encoder readings. The default TCP sits on
  the flange face.
- **ROS-Industrial / MoveIt**: the flange is the `tool0` link; a TCP is an extra
  frame/link (`tcp_frame`) attached to `tool0` by a fixed TF transform, and the IK
  tip frame is switched to it. "Planning in the tool frame" = planning the point
  between the gripper fingers, not the mount.
- **ABB (`tooldata`), KUKA (`$TOOL`), FANUC (UTOOL)**: identical idea — a tool frame
  `{position, orientation}` plus a **load** (mass, center of gravity, inertia).

**Takeaway:** the right internal representation is a `4×4` rigid transform
`T_flange→tcp`. The UI can accept the rotation as roll/pitch/yaw (most intuitive for
operators) and/or UR-style axis-angle; both convert to the same matrix.

## 2. Payload and center of gravity (non-negotiable for a torque-controlled arm)

- The mass **and** center of gravity of everything past the flange (tool + grasped
  part) must be configured accurately **at all times**; UR warns that wrong values
  cause incorrect motor control → protective stops, inaccurate motion, unsafe
  operation. `set_payload(m, cog)` / `set_payload_cog([x,y,z])`.
- Payload must be **updated when the tool picks up or releases** a workpiece.

**Why this matters here specifically:** this project already runs **RNEA inverse
dynamics** (`dynamics.hpp`) and gates every motion on the **real eRob actuator torque
limits** (281 / 140 / 51 N·m for the 142H120 / 110H120 / 80H100 joints). Today the
payload enters as a point mass at the *flange origin*. A TCP without a CoG would make
the torque/gravity model wrong exactly when a heavy, offset tool is mounted — the case
that matters most. So CoG must feed the dynamics, not just be cosmetic.

## 3. Calibration methods (how the numbers get measured on a real arm)

- **4-point method** (position only): jog the tool tip onto one fixed reference point
  from ≥4 different orientations; the flange poses give `n` equations, solved by
  least-squares / sphere-fit for the TCP offset `(x,y,z)` in the flange frame
  (`3n` linear equations → pseudo-inverse). ≥4 points; 8+ improves precision.
- **6-point method**: 4-point for position **plus** two points to fix the tool's
  X/Z direction → full orientation. Needed for asymmetric tools.
- Reference open-source implementation: **Jmeyer1292/tool_point_calibration** (ROS),
  which does exactly this least-squares solve from `tool0` samples.

**Takeaway:** provide direct numeric entry (fast, exact when the CAD offset is known)
**and** a 4-point teach helper (for unknown/asymmetric tools), using the standard
least-squares solve. 6-point can follow.

## 4. The hardware we are configuring for

- ZeroErr **eRob 6-axis cobot**, ~**5 kg payload**, ~**805 mm reach**, T-series eRob
  integrated actuators (142T/110T/80T), **ISO 9409-1** tool flange.
- Already modelled in-repo: clean DH kinematics, 19-bit encoders, per-joint torque
  ceilings, 36.5 kg mass model, CSP position control.

This means the TCP layer must: respect the **5 kg payload ceiling** in the torque
gate; express the tool offset from the **ISO-9409 flange face** (the `toolOffset()`
frame already in the DH model is the flange); and stay inside the existing
**singularity / IK-fail / collision** safety that wraps every move.

---

## 5. Recommended design for THIS cobot (and why it beats the alternatives)

**Chosen approach: a thin "TCP frame" layer over the existing flange-space kinematics.**

```
tcpFK(q)        = forwardKinematics(q) · T_tool          // report the tool tip
solveIKtcp(P)   = solveIK( P · T_tool⁻¹ )                // accept tool-tip targets
```

- **Single source of truth, no new process:** the tool transform + payload (mass,
  CoG) travel through the existing `CmdRegion` (add `tcp[7]`, `payload_cog[3]`,
  `CMD_SET_TCP`). `ik_solver`, `motion_planner` and both control nodes already read
  `CmdRegion`, so all of them see the same TCP — nothing new to launch or sync.
- **Validated kinematics stay untouched:** the robust LM IK and DH FK keep operating
  in flange space; TCP is a pre/post multiply. This is provably correct and risk-free
  versus rewriting IK.
- **Tool-tip-straight Cartesian moves (UR/ABB semantics):** make the trajectory
  classes interpolate the **TCP** frame and back out the flange per step (a one-line
  change in each `sampleJoints`). MoveL/MoveC/MoveP then move the **tool tip** in a
  straight line / true arc — strictly better than "flange straight," which only
  coincides when orientation is constant.
- **Payload + CoG into the real torque model:** extend the RNEA payload to a point
  mass at the CoG (flange frame). The torque-feasibility gate, gravity-hold and
  collision prediction then reflect the actual mounted tool and the eRob 5 kg / per-
  joint limits.
- **Calibration + persistence + UI:** 4-point teach (least-squares) **and** numeric
  entry; save the config to JSON like waypoints and re-apply on connect; a TCP panel
  in the PC viewer (offset, RPY/axis-angle, payload, CoG, presets, live TCP readout).

**Alternatives considered and rejected for this machine:**

| Alternative | Why not |
|---|---|
| Add a `tcp_link` to the URDF and re-run kinematics (ROS-Industrial style) | Heavy: regenerates the DH/dyn headers and re-validates IK for a frame that is just a constant multiply. No benefit over the thin layer; more risk. |
| Apply TCP only in the Python bridge | The C++ planner/IK/dynamics wouldn't know the tool, so torque gating, Cartesian tracking and singularity checks would all be wrong. Must live in the C++ core. |
| Reuse the earlier standalone TCP project as-is | It wasn't built against this arm's dynamics/safety pipeline; bolting it on would bypass the torque gate and the per-step IK. Designing into the core is the correct fit. |
| Interpolate the flange and ignore TCP curvature | Only correct when orientation is constant during the move; wrong for reorienting MoveL. The tool-tip interpolation is the vendor-correct behavior. |

---

## 6. Implementation plan (end to end)

1. **`core/include/erm/tcp.hpp`** — runtime tool transform (default identity) +
   `tcpFK`, `solveIKtcp`, `flangeFromTcp`, axis-angle/RPY↔matrix helpers.
2. **`dynamics.hpp`** — `inverseDynamics(... , payload_mass, payload_cog={0,0,0})`;
   place the payload point mass at the CoG.
3. **`shm_layout.hpp` + `shm_layout.py`** — `CmdRegion.tcp[7]`, `CmdRegion.payload_cog[3]`,
   `StateRegion.tcp_pos[3]/tcp_quat[4]`, `CMD_SET_TCP=15`; recompute sizes + asserts.
4. **`ik_solver.cpp`** — read TCP from `CmdRegion`; PTP/LIN/MoveP/MoveC targets become
   tool-tip targets via `solveIKtcp`; feed CoG to the torque gate.
5. **`motion_planner.cpp`** — start poses use `tcpFK`; the path-tracking guard compares
   the TCP; tool-frame jog rotates about the TCP.
6. **`trajectory.hpp`** — `sampleJoints` solves via `solveIKtcp` so the interpolated
   pose is the tool tip.
7. **control nodes** — apply TCP; publish `tcp_pos/tcp_quat`; feed payload CoG to RNEA.
8. **`bridge/ws_bridge.py` + `tcp_config.py`** — `set_tcp` / `tcp_teach` commands,
   report the TCP pose, JSON persistence, re-apply on connect.
9. **`tools/erobo10_viewer.html`** — TCP panel (offset, orientation, payload, CoG,
   presets, 4-point teach, live readout).
10. **Tests + docs** — FK-oracle round trip with a tool; tool-tip-straight check;
    payload-CoG torque check; update `MOTION_TYPES.md`.

---

## Sources
- Universal Robots — TCP Configuration (PolyScope manual), Setting payload & center of
  gravity, Change payload/CoG via URScript, Explanation on robot orientation,
  URScript manual (`set_tcp`, `pose_trans`, `get_actual_tcp_pose`).
- ROS-Industrial / MoveIt — tool0/tcp frame configuration; "shift from end-effector to
  tool-tip frame" threads; ROS-Industrial training "Build a MoveIt Package."
- Calibration — control.com "Methods of Performing Robot TCP Calibration"; MDPI
  *Actuators* "Automatic Calibration of TCP for 6-DOF Robot"; FANUC 3-point method
  (Industrial Monitor Direct); GitHub **Jmeyer1292/tool_point_calibration**.
- Hardware — ZeroErr eRob six-axis cobot application page and actuator datasheets;
  ISO 9409-1 tool flange interface.
