# TCP (Tool Center Point) configuration — implementation & usage

This is the working TCP feature for the eRob cobot. Design rationale and the source
survey are in `TCP_RESEARCH_AND_DESIGN.md`; this file is the how-it-works / how-to-use.

## What it does

A TCP is a rigid transform **T_flange→tcp** (a translation + rotation from the tool
output flange) plus the **payload** the tool carries (mass + centre of gravity). Once
set, the whole stack works at the **tool tip** instead of the bare flange:

- pose readout (`tool tip xyz` in the UI) reports the TCP in the base frame;
- **MoveJ / MoveP / PTP / MoveL / MoveC** targets are interpreted as **tool-tip**
  targets (IK back-solves the flange);
- **MoveL / MoveC** move the **tool tip** in a straight line / true arc (verified:
  tip deviates 1 µm while the flange curves ~9 mm on a reorienting MoveL);
- the **payload mass + CoG** feed the RNEA torque model, so the torque-feasibility
  gate, gravity-hold and collision prediction reflect the real mounted tool and the
  eRob per-joint limits (281 / 140 / 51 N·m).

Default (no tool) = identity = the bare flange, so existing behavior is unchanged
until a TCP is set.

## Architecture (one source of truth, no new process)

```
core/include/erm/tcp.hpp     tcpFK(q)=FK(q)·T_tool ;  solveIKtcp(P)=solveIK(P·T_tool⁻¹)
core/include/erm/dynamics.hpp inverseDynamics(...,payload,cog)  -> payload point mass at CoG
shm CmdRegion.tcp[7], payload_cog[3], CMD_SET_TCP=15 ; StateRegion.tcp_pos/tcp_quat
ik_solver / motion_planner / control nodes  read CmdRegion.tcp -> setToolFromPosQuat()
trajectory.hpp  sampleJoints -> solveIKtcp  (Cartesian paths interpolate the tool tip)
bridge/ws_bridge.py  set_tcp / tcp_teach / get_tcp ; reports tcp pose ; applies saved TCP
bridge/tcp_config.py persistent JSON store + 4-point least-squares solver
tools/erobo10_viewer.html  ⧉ TCP panel: offset, RPY/axis-angle, payload, CoG, 4-pt teach
```

The validated DH FK and LM IK are untouched — TCP is a pre/post multiply, so the
robust kinematics and all the existing safety (singularity, IK-fail, collision,
torque gate) still wrap every move.

## Using it (PC viewer ⧉ TCP panel)

1. **Numeric**: enter the offset `x,y,z` (mm from the flange face), the orientation
   (switchable **roll/pitch/yaw deg** or **UR axis-angle deg**), the **payload mass**
   and its **centre of gravity** (mm), then **Apply TCP**. **Reset to flange** clears it.
2. **4-point teach** (for an unknown/asymmetric tool): jog the tool tip onto one fixed
   point from ≥4 different orientations, **Capture** each, then **Solve & apply**. The
   bridge solves the offset by least squares `(R_i−R_j)·o = (t_j−t_i)` and reports the
   RMS residual.

The active TCP is saved to `run/tcp_config.json` and re-applied automatically on the
next connect, so every UI shares it and it survives restarts.

## WebSocket protocol

```json
{"cmd":"set_tcp","name":"gripper","pos":[x,y,z],         // metres, from the flange
 "rpy":[r,p,y] | "quat":[w,x,y,z] | "rotvec":[rx,ry,rz], // any one; orientation
 "payload":2.5,"cog":[x,y,z]}                            // kg, metres
{"cmd":"get_tcp"}                                         -> ack {tcp:{...}}
{"cmd":"tcp_teach","flanges":[[x,y,z,qw,qx,qy,qz], …≥4], "apply":true}
                                                          -> ack {offset,point,rms,n}
```
State broadcast now carries `"tcp":{pos,quat}` alongside `"flange":{pos,quat}`.

## Validation (standalone, reproducible)

`test/test_tcp.cpp` (build: `g++ -std=c++17 -O2 -Icore/include test/test_tcp.cpp -o bin/test_tcp`):

1. **solveIKtcp round-trip** — tool tip reaches the target to **1.1e-8 m**.
2. **MoveL straightness** — on a reorienting linear move the **tool tip stays straight
   (1.0e-6 m)** while the **flange curves (8.9e-3 m)** — i.e. the tip is the controlled
   point (UR/ABB semantics).
3. **Payload CoG → torque** — a 3 kg load at 180 mm shifts joint torque by **2.9 N·m**.

The 4-point solver is unit-checked (recovers a synthetic offset to 0 m). All prior
tests (`test_fk`, `test_ik`, `test_traj`, `test_csp_mock`) still pass.

> Note: like the CSP change, the kinematic correctness is proven in simulation/standalone.
> Validate the taught offset on the real arm before relying on it for tight processes.
