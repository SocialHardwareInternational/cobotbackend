// erobo10_dh.hpp -- AUTO-GENERATED from erobo10.urdf by tools/gen_model_from_urdf.py.
// URDF-NATIVE kinematic chain (no DH fitting): joint i is a fixed origin transform
// (R row-major + translation p) followed by a rotation q_i about `axis`. FK to the flange:
//   T_base_flange(q) = PROD_i [ H(R_i, p_i) * Rot(axis_i, q_i) ]   (flange == last link frame)
// Used by kinematics.hpp (FK + geometric Jacobian).
#pragma once
namespace erm {
constexpr int NJ = 6;
// One joint: fixed parent->joint origin (R row-major, p) and the rotation axis (unit).
struct UrdfJoint { double R[9]; double p[3]; double axis[3]; };
inline const UrdfJoint* urdfChain() {
  static const UrdfJoint J[NJ] = {
    { {+1.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, -1.000000000000e+00, +5.665538897648e-16, +0.000000000000e+00, -5.665538897648e-16, -1.000000000000e+00}, {+5.025000000000e-05, -4.029600000000e-04, +4.808044000000e-02}, {+0.000000000000e+00, +0.000000000000e+00, +1.000000000000e+00} },  // base_Revolute-1 -> j1
    { {+1.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +5.053215498074e-16, -1.000000000000e+00, +0.000000000000e+00, +1.000000000000e+00, +5.053215498074e-16}, {-2.510144869738e-17, +9.000000000000e-02, -7.500000000000e-02}, {+0.000000000000e+00, +0.000000000000e+00, +1.000000000000e+00} },  // j1_Revolute-2 -> j2
    { {+1.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, -1.000000000000e+00, +5.665538897648e-16, +0.000000000000e+00, -5.665538897648e-16, -1.000000000000e+00}, {+0.000000000000e+00, -6.120000000000e-01, -1.700000000000e-02}, {+0.000000000000e+00, +0.000000000000e+00, +1.000000000000e+00} },  // j2_Revolute-3 -> j3
    { {+1.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, -1.000000000000e+00, -5.665538897648e-16, +0.000000000000e+00, +5.665538897648e-16, -1.000000000000e+00}, {+5.086209231564e-17, +5.900000000000e-01, -3.430000000000e-02}, {+0.000000000000e+00, +0.000000000000e+00, +1.000000000000e+00} },  // j3_Revolute-4 -> j4
    { {+1.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +6.123233995737e-17, -1.000000000000e+00, +0.000000000000e+00, +1.000000000000e+00, +6.123233995737e-17}, {-8.445501242793e-17, -4.250000000000e-02, -5.550000000000e-02}, {+0.000000000000e+00, +0.000000000000e+00, -1.000000000000e+00} },  // j4_Revolute-5 -> j5
    { {+1.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +0.000000000000e+00, +6.123233995737e-17, +1.000000000000e+00, +0.000000000000e+00, -1.000000000000e+00, +6.123233995737e-17}, {-7.984064798183e-17, -4.250000000000e-02, +5.550000000000e-02}, {+0.000000000000e+00, +0.000000000000e+00, +1.000000000000e+00} },  // j5_Revolute-6 -> j6
  };
  return J;
}
// Flange == last URDF link frame, so the legacy "tool offset" is identity (kept for API compat).
inline const double* toolOffset() { static const double T[16]={1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1}; return T; }

// ---- joint limits (rad): revolute from URDF; continuous joints software-capped at +/- pi ----
inline const double* jointLower(){ static const double v[NJ]={-3.141593, -3.054326, -3.054326, -3.054326, -3.141593, -3.141593}; return v; }
inline const double* jointUpper(){ static const double v[NJ]={3.141593, 3.054326, 3.054326, 3.054326, 3.141593, 3.141593}; return v; }
// ---- per-joint actuator limits from the eRob Rotary Actuator User Manual V3.39 ----
// Joint -> module -> gear ratio:  J1,J2 = eRob 142H (GR 120) | J3 = eRob 110H (GR 120) | J4,J5,J6 = eRob 80H (GR 100).
// jointEffortMax = "Permissible Max Torque with Average Load" (Manual Table 2-1, the safe sustained
//   operating limit): 142H120=281, 110H120=140, 80H100=51 Nm.  For reference -- rated/continuous:
//   178/87/31 Nm; peak start-stop: 459/217/70 Nm; NEVER-EXCEED momentary: 892/395/143 Nm.
// jointVelMax = 0.9 x "Max Output Angular Velocity" (Manual Table 12-1): ceilings 1.749/2.618/3.1416 rad/s.
// jointAccMax = velMax / 0.3 s (Manual "recommended acc/dec time >= 0.3 s", Table 12-1).
inline const double* jointVelMax(){ static const double v[NJ]={1.574, 1.574, 2.356, 2.827, 2.827, 2.827}; return v; }
inline const double* jointAccMax(){ static const double v[NJ]={5.25, 5.25, 7.85, 9.42, 9.42, 9.42}; return v; }
inline const double* jointJerkMax(){ static const double v[NJ]={105.0, 105.0, 157.0, 188.0, 188.0, 188.0}; return v; }
inline const double* jointEffortMax(){ static const double v[NJ]={281.0, 281.0, 140.0, 51.0, 51.0, 51.0}; return v; }
}  // namespace erm
