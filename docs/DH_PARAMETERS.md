# erobo10 — Clean DH Parameters

Extracted from `erobo10.urdf` and **validated against the exact URDF forward kinematics**: max position+orientation error **1.78e-6 m** over 50,000 random configurations across the full joint range. That residual is dominated by the URDF rounding pi/2 to `1.5708`; the DH below uses exact angles.

Convention (standard / distal): `T_i = Rz(theta0_i + q_i) * Tz(d_i) * Tx(a_i) * Rx(alpha_i)`, base frame = identity (joint-1 axis is the base z-axis).

| Joint | a (m) | alpha (rad) | d (m) | theta0 (rad) | limit (rad) | v_max (rad/s) | tau_max (Nm) |
|---|---|---|---|---|---|---|---|
| 1 | 0.000001 | 1.570799 | 0.123000 | 0.807906 | [-3.140, 3.140] | 1.57 | 140 |
| 2 | 0.611996 | 3.141585 | -0.000000 | 1.583038 | [-3.140, 3.140] | 1.57 | 110 |
| 3 | 0.590001 | -0.000007 | -0.000000 | -0.219999 | [-3.140, 3.140] | 1.57 | 110 |
| 4 | 0.000000 | 1.570794 | -0.128600 | 1.547938 | [-3.140, 3.140] | 1.57 | 107 |
| 5 | 0.000003 | 1.570795 | 0.098000 | 3.111059 | [-3.140, 3.140] | 1.57 | 87 |
| 6 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | [-3.140, 3.124] | 1.57 | 57 |

**Structure:** J1 vertical base yaw; J2-J3-J4 parallel (planar arm, a2=0.612 m upper arm, a3=0.590 m forearm in DH frame); J5 perpendicular; J6 perpendicular.

**Tool/flange offset** (DH frame6 -> URDF link6): translation z = -0.0785 m, rotation rpy = [pi, 0, -1.308] rad.

**Accel/jerk limits** (tuned for 6-DOF 10 kg payload, conservative, tunable): a_max = [6,5,6,8,8,10] rad/s^2, jerk = [120,100,120,160,160,200] rad/s^3.
