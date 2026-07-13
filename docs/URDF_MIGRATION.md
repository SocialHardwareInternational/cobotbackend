# Corrected URDF — validation & migration

The corrected URDF was validated and installed as the kinematic + dynamic model.

## Validation (URDF is sound)

- **Structure**: 6 joints — base→j1 (continuous), j1→j2/j2→j3/j3→j4 (revolute, ±175°),
  j4→j5 (continuous), j5→j6 (continuous). Well-formed serial chain.
- **Inertia**: all 7 links have **positive-definite** inertia tensors satisfying the
  principal-moment **triangle inequality**. ✓
- **Geometry**: upper arm 0.612 m, forearm 0.590 m → **max reach 1.435 m** (horizontal 1.306 m).
  Home (q=0) flange at (0.0, -0.171, 1.423) — straight up.

## What changed vs the previous model

The corrected URDF is a **different/cleaner robot** than the previous model encoded:
the joint frames were skewed before and are now axis-aligned, and the conventions differ,
so the old vs new FK disagreed by up to **1.2 m**. The whole kinematic model was therefore
regenerated — not tweaked.

- **Kinematics — now URDF-native and exact.** `kinematics.hpp` no longer fits DH; it walks
  the URDF chain directly: `T = Π_i H(R_i,p_i)·Rot(axis_i, q_i)`. C++ FK now matches the
  URDF oracle to **0.0** (machine precision) at all test configs. The legacy tool offset is
  identity (the flange == the last URDF link frame).
- **Dynamics — from the CAD inertials.** `erobo10_dyn.hpp` is regenerated straight from the
  URDF `<inertial>` blocks (mass, CoM, inertia-about-CoM per link). No hand calibration.
- **Joint limits** updated from the URDF (revolute ±3.054326 rad; continuous software-capped
  at ±π).
- **Reproducible**: `tools/gen_model_from_urdf.py <urdf>` regenerates both headers.
- **Regression**: `test_fk`, `test_ik` (3000/3000 cold + warm), `test_traj`, `test_tcp`,
  `test_csp_mock` all pass against the new model. (IK restarts raised 60→128 for the larger
  workspace; two test fixtures retargeted to non-singular poses in the new workspace.)

## Mass calibration (resolved)

The URDF `<inertial>` masses are **uncalibrated CAD** (default densities → ~80.5 kg total),
not the real arm. Per your call, the generator **scales every link mass + inertia by
k = 36.5 / 80.5 = 0.4532** so the absolute total is the real **36.5 kg**, while the CAD's
trustworthy **distribution** (relative masses, CoM, inertia shape) is preserved. Result:
moving links j1–j6 = 35.24 kg, base = 1.26 kg. Re-run with a different target via
`gen_dyn(..., target_total=...)`.

The eRob actuator limits are now **confirmed from the eRob Rotary Actuator User Manual V3.39**.

**Joint → module → gear ratio:** J1,J2 = eRob **142H** (GR 120); J3 = eRob **110H** (GR 120);
J4,J5,J6 = eRob **80H** (GR 100).

| Joint | Module | `jointEffortMax` = avg-load max (Table 2-1) | rated / momentary | `jointVelMax` = 0.9× max ang.vel (Table 12-1) |
|---|---|---|---|---|
| J1, J2 | 142H-120 | **281 N·m** | 178 / 892 N·m | 1.574 rad/s (ceiling 1.749) |
| J3 | 110H-120 | **140 N·m** | 87 / 395 N·m | 2.356 rad/s (ceiling 2.618) |
| J4–J6 | 80H-100 | **51 N·m** | 31 / 143 N·m | 2.827 rad/s (ceiling 3.142) |

`jointAccMax` = velMax / 0.3 s (manual "recommended acc/dec time ≥ 0.3 s"). The CSV drive-speed
ceilings `JOINT_VMAX_C` (counts/s) also match Table 12-1 exactly (145927 / 218453 / 262144).

These limits are consistent with the scaled 36.5 kg arm — worst-case gravity:

| Pose | Payload | J2 gravity torque | vs 281 N·m limit |
|---|---|---|---|
| upper arm horizontal | 0 kg | 146 N·m | 52% ✓ |
| upper arm horizontal | 5 kg | 210 N·m | 75% ✓ |

Everything — FK, IK, Jacobian, TCP, collision, trajectories, the torque-feasibility gate — is
correct and validated against the corrected URDF. If the real per-joint actuator torque/speed
ratings differ from these eRob values, drop them into `jointEffortMax()` / `jointVelMax()` in
`erobo10_dh.hpp` (or send them and I'll set them).

## 3D visualization (meshes)

The corrected STL meshes were baked into the viewers so the 3D view matches the new model:

- `tools/gen_meshes_from_stl.py <urdf> <base.stl> <j1..j6.stl>` reads each STL, scales mm→m,
  applies the URDF `<visual><origin>` so the geometry sits in its **link frame** (the viewers
  set `mesh.matrix = linkFrame`), and writes both the **embedded** fallback `cobot_meshes.js`
  (decimated by vertex clustering, <65 k verts for a Uint16 index, ~360 KB) and **full-res
  baked STLs** to `tools/meshes/erobo10/` (`STL_OUT=… python3 …`).
- The viewers' `URDF[]` chains and mesh paths in `erobo10_viewer.html` and `cobot_mobile.html`
  were updated to the corrected model.
- **Validated**: the baked meshes assemble at q=0 into a contiguous **1.466 m** arm (each link
  stacks onto the next), and the viewer's THREE.js chain reproduces the model flange
  (0.0001, -0.171, 1.423) exactly.

The original `robot/meshes/erobo10/*.STL` (old arm) are read-only and were left in place; the
viewers no longer reference them.

## Self-collision model rebuilt for the new arm

The old monitor used one fat capsule per link (joint-to-joint axis + a hand radius). On this
arm that produced a **constant false collision**: the forearm capsule starts at the shoulder,
which is structurally only ~9 cm from the base at *every* pose, while the base+forearm radii
summed to ~17 cm — so `base ↔ forearm` always read ≈ −53 mm and auto-disabled the drives
regardless of pose (and re-enable instantly re-tripped).

Replaced with a **point-cloud** model fitted to the real meshes (`erobo10_collision_geom.hpp`):
**200** surface points per link (farthest-point sampled from the full-res STLs, in each link
frame) with a small per-link skin (covering radius, **capped at 12 mm** so long links like the
forearm don't inflate), so `clearance(i,j) = min|p_i−p_j| − skin_i − skin_j` tracks the true
surface clearance. Mechanically-constrained non-adjacent pairs that are always close
(upper-arm↔base, and the two wrist-internal pairs) are excluded. Thresholds for this compact
arm: warn 10 mm, **auto-disable only on modelled envelope overlap (0 mm)** — i.e. the drives
disable just when the surfaces meet, not at mere proximity (was 80/40 mm).

Verified against full-mesh ground truth: e.g. a 105° wrist bend has a true forearm↔tool
clearance of **39 mm** — the model reads **+19 mm (clear, no stop)**; the earlier stuck pose,
home and ready poses are all clear; deliberately folded/jammed poses still trip the stop
(−20 mm). The viewer toast names were updated to the 7 links. (Rebuild + restart `control_node`
for the fix to take effect.)

Skin later tightened to **6 mm** (from the capped covering radius) after checking deeper wrist
folds against ground truth: a 161° J5 bend has a true forearm↔tool clearance of **18 mm** (the
wrist never actually contacts — min ~17 mm), which the 12 mm skin was wrongly reading as
contact. At 6 mm the proxy reads **+7 mm (clear)** there while a real self-crossing jam still
reads −9 mm.

### Enable/disable toggle

A **🛡 Collision** button in the viewer header (and a `set_collision` bridge command →
`CMD_SET_COLLISION`) turns the software self-collision monitor on/off at runtime. When off, the
control node skips the warning + auto-disable (and clears any latched collision stop), so the
operator can deliberately drive through tight poses. The hardware E-stop / STO is unaffected.

### J5 axis-direction fix

The real arm's **J5** (URDF joint `j4_Revolute-5`) rotated *opposite* to the model — identical at
0° but diverging as the angle changed, the signature of a flipped joint axis. Its URDF `<axis>`
was negated (`0 0 1` → `0 0 -1`). FK at q=0 is unchanged (still matches the real arm); J5=+θ now
produces what −θ did before, i.e. the model's positive J5 matches the real arm's. The flipped URDF
is saved at `core/erobo10.urdf`; the model headers and both viewer chains were regenerated/updated
and verified to agree (C++ FK == viewer FK at a J5≠0 pose).

> On real hardware, also confirm the J5 *command* direction matches (the encoder/command sign in
> `ecat_control_node.cpp`, `JOINT_SIGN`/`MOTOR_DIR` for J5) — the URDF fix corrects the kinematic
> convention; the drive count direction is a separate per-joint calibration.

### MoveL realism on the larger arm + two hardware fixes

On the bigger 1.3 m arm, long straight-line **MoveL** moves are far more likely to cross a wrist/
elbow singularity than on the old 0.8 m arm. The motion was never actually *wild* (the planner's
per-cycle velocity cap holds commanded joint speed ≤ ~100%, and a branch-flip aborts the move),
but a long MoveL would **start and then abort part-way** (e.g. 192 mm short) — which looks
unrealistic. Fix: the IK solver now **pre-validates the straight-line path** (`linPathFeasible`):
it samples the LIN path at ~1 cm spacing, warm-starts IK along it, and rejects the move **up front**
if IK fails or a branch flip / singularity is detected — exactly like UR/ABB. The UI then shows
"straight-line path crosses a singularity — use MoveJ" instead of starting an un-finishable move.
Feasible long lines are still accepted (they slow through high-Jacobian regions, which is correct).
`test/test_motion.cpp` exercises MoveJ/MoveL/MoveP/MoveC; all are clean from normal poses, and
MoveC/MoveP keep the planner's runtime guards.

Two hardware-bring-up fixes from the on-robot log:
- **EtherCAT SDO error** "Received 4 bytes do not fit into SDO data memory (1 byte)": the brake
  status object `0x4602` is **UINT32** on these drives — its SDO request was sized 1 byte. Now
  requested as 4 bytes and read with `EC_READ_U32`.
- **`cobot_server` crash** `OSError: Address already in use`: the phone HTTP server now sets
  `SO_REUSEADDR` and exits gracefully with a message if its port is taken (the WebSocket bridge on
  8765 is unaffected) instead of throwing a traceback.

Note: the manipulability/singularity threshold (`SING_MANIP`) may also want review for this
larger arm — it only drives a non-blocking popup, so it wasn't changed here.
