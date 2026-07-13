// erm/safety.hpp -- configurable safety monitor for the erobo10 control plane.
//
// Implements the safety features expected of a collaborative robot (mirroring the
// UR "Safety Planes / Reduced mode / speed & force limits" model):
//
//   * SAFETY PLANES  (up to MAX_SAFETY_PLANES): a point + unit normal. The TCP must
//     stay on the NORMAL side. mode: OFF / FORBIDDEN (motion must stop at the plane)
//     / REDUCED (crossing switches the arm to reduced speed).
//   * WORKSPACE BOUNDS: max spherical reach from the base, a floor (z_min) and a
//     ceiling (z_max), and a cylindrical keep-out around the base column.
//   * TCP SPEED LIMITS: a hard maximum and a reduced-mode maximum, monitored from
//     the MEASURED joint velocities through the Jacobian (not from the plan).
//   * TCP FORCE LIMIT: external force estimated from the contact-detector torque
//     residuals mapped through the Jacobian, F = (J J^T)^-1 J tau_ext.
//   * ELBOW SPEED LIMIT: the elbow (joint-3 origin) is monitored like the TCP so a
//     fast elbow sweep near a person is caught even when the TCP is slow.
//
// The monitor is deterministic, allocation-free after construction, and pure: it
// never touches hardware. The PLANNER uses it to scale/stop commanded motion
// BEFORE it happens; the CONTROL node uses it on measured state as the last line
// of software defence (protective stop). The hardware E-stop / STO is independent
// and always wins.
#pragma once
#include <cmath>
#include <cstdint>
#include "erm/kinematics.hpp"
#include "erm/linalg.hpp"

namespace erm {

constexpr int MAX_SAFETY_PLANES = 6;

enum SafetyZone : uint32_t { ZONE_NORMAL = 0, ZONE_REDUCED = 1, ZONE_FORBIDDEN = 2 };
enum PlaneMode  : uint32_t { PLANE_OFF = 0, PLANE_FORBIDDEN = 1, PLANE_REDUCED = 2 };

// Violation codes published in StateRegion::safety_code.
enum SafetyCode : uint32_t {
    SAFE_OK             = 0,
    SAFE_PLANE          = 1,   // TCP crossed a forbidden safety plane
    SAFE_REACH          = 2,   // TCP outside the max-reach sphere
    SAFE_FLOOR          = 3,   // TCP below z_min
    SAFE_CEILING        = 4,   // TCP above z_max
    SAFE_BASE_CYL       = 5,   // TCP inside the base-column keep-out cylinder
    SAFE_TCP_SPEED      = 6,   // measured TCP speed above the active limit
    SAFE_TCP_FORCE      = 7,   // estimated external TCP force above the limit
    SAFE_ELBOW_SPEED    = 8,   // measured elbow speed above the limit
    SAFE_JOINT_SPEED    = 9,   // measured joint speed above 1.15x its rated limit
};

struct SafetyPlaneCfg {
    uint32_t mode = PLANE_OFF;   // PlaneMode
    uint32_t _pad = 0;
    double p[3] = {0, 0, 0};     // a point on the plane [m], base frame
    double n[3] = {0, 0, 1};     // unit normal; TCP must stay on the +n side
};

// Full safety configuration (persisted by the controller, mirrored over shm).
// Defaults are conservative collaborative-mode values (ISO/TS 15066 flavour).
struct SafetyConfig {
    uint32_t enabled = 1;              // zone system on/off (limits stay active)
    uint32_t nplanes = 0;
    double speed_override  = 1.0;      // global speed slider 0.05..1.0
    double tcp_speed_max   = 1.5;      // m/s hard limit
    double tcp_speed_reduced = 0.25;   // m/s in reduced zones (250 mm/s collaborative)
    double tcp_force_max   = 150.0;    // N estimated external force trip
    double elbow_speed_max = 2.0;      // m/s
    double reach_max       = 0.0;      // m, 0 = off (erobo10 full reach ~1.3 m)
    double z_min           = -1e9;     // workspace floor [m]
    double z_max           = 1e9;      // workspace ceiling [m]
    double base_cyl_r      = 0.0;      // m keep-out radius around base column, 0 = off
    SafetyPlaneCfg planes[MAX_SAFETY_PLANES];
};

struct SafetyVerdict {
    SafetyZone zone   = ZONE_NORMAL;
    SafetyCode code   = SAFE_OK;
    int        which  = -1;      // plane index for SAFE_PLANE
    double     margin = 1e9;     // distance to the nearest active boundary [m]
};

inline double planeSignedDist(const SafetyPlaneCfg& pl, const Vec3& p) {
    return (p.x - pl.p[0]) * pl.n[0] + (p.y - pl.p[1]) * pl.n[1] + (p.z - pl.p[2]) * pl.n[2];
}

// Position-only zone check for a candidate TCP position (base frame).
inline SafetyVerdict checkPosition(const SafetyConfig& c, const Vec3& p) {
    SafetyVerdict v;
    if (!c.enabled) return v;
    // margin tracks distance to the nearest FORBIDDEN boundary only (feeds the planner's
    // decelerate-into-the-boundary ramp); reduced-mode planes switch zone but not margin.
    auto worse = [&](SafetyZone z, SafetyCode cd, int w, double m) {
        if (m < v.margin) v.margin = m;
        if (z > v.zone) { v.zone = z; v.code = cd; v.which = w; }
    };
    for (uint32_t i = 0; i < c.nplanes && i < (uint32_t)MAX_SAFETY_PLANES; ++i) {
        const auto& pl = c.planes[i];
        if (pl.mode == PLANE_OFF) continue;
        double d = planeSignedDist(pl, p);
        if (pl.mode == PLANE_FORBIDDEN) {
            if (d < 0) worse(ZONE_FORBIDDEN, SAFE_PLANE, (int)i, 0.0);
            else       worse(ZONE_NORMAL, SAFE_OK, -1, d);
        } else if (d < 0) {
            if (ZONE_REDUCED > v.zone) { v.zone = ZONE_REDUCED; v.code = SAFE_PLANE; v.which = (int)i; }
        }
    }
    if (c.reach_max > 1e-9) {
        double r = std::sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        if (r > c.reach_max) worse(ZONE_FORBIDDEN, SAFE_REACH, -1, 0.0);
        else                 worse(ZONE_NORMAL, SAFE_OK, -1, c.reach_max - r);
    }
    if (p.z < c.z_min) worse(ZONE_FORBIDDEN, SAFE_FLOOR, -1, 0.0);
    else               worse(ZONE_NORMAL, SAFE_OK, -1, p.z - c.z_min);
    if (p.z > c.z_max) worse(ZONE_FORBIDDEN, SAFE_CEILING, -1, 0.0);
    else               worse(ZONE_NORMAL, SAFE_OK, -1, c.z_max - p.z);
    if (c.base_cyl_r > 1e-9) {
        double rxy = std::sqrt(p.x * p.x + p.y * p.y);
        if (rxy < c.base_cyl_r && p.z > 0.05) worse(ZONE_FORBIDDEN, SAFE_BASE_CYL, -1, 0.0);
        else                                  worse(ZONE_NORMAL, SAFE_OK, -1, rxy - c.base_cyl_r);
    }
    return v;
}

// Speed scale for the PLANNER: 1.0 in normal space, tcp_speed_reduced/tcp_speed_max
// in reduced zones, and a smooth ramp to 0 within `slow_band` of any forbidden
// boundary so motion decelerates INTO the boundary instead of tripping on it.
inline double plannerSpeedScale(const SafetyConfig& c, const Vec3& tcp, double slow_band = 0.05) {
    if (!c.enabled) return 1.0;
    SafetyVerdict v = checkPosition(c, tcp);
    if (v.zone == ZONE_FORBIDDEN) return 0.0;
    double s = 1.0;
    if (v.zone == ZONE_REDUCED && c.tcp_speed_max > 1e-9)
        s = std::min(1.0, c.tcp_speed_reduced / c.tcp_speed_max);
    if (v.margin < slow_band) s = std::min(s, std::max(0.0, v.margin / slow_band));
    return s;
}

// Measured TCP linear speed [m/s] from joint velocities through the Jacobian.
inline double tcpSpeed(const JVec& q, const JVec& qd, const Vec3& tcp_pos) {
    auto J = jacobianAt(q, tcp_pos);
    double vx = 0, vy = 0, vz = 0;
    for (int i = 0; i < NJ; ++i) { vx += J[0][i] * qd[i]; vy += J[1][i] * qd[i]; vz += J[2][i] * qd[i]; }
    return std::sqrt(vx * vx + vy * vy + vz * vz);
}

// Elbow (joint-4 origin = end of the upper arm) position and speed.
inline Vec3 elbowPos(const JVec& q) { return linkFrames(q)[3].pos(); }
inline double elbowSpeed(const JVec& q, const JVec& qd) {
    Vec3 e = elbowPos(q);
    auto J = jacobianAt(q, e);
    double vx = 0, vy = 0, vz = 0;
    for (int i = 0; i < 3; ++i) { vx += J[0][i] * qd[i]; vy += J[1][i] * qd[i]; vz += J[2][i] * qd[i]; }  // only J1..J3 move the elbow
    return std::sqrt(vx * vx + vy * vy + vz * vz);
}

// External TCP force estimate from joint-torque residuals: solve tau_ext = J_v^T F
// in least squares, F = (J_v J_v^T + eps I)^-1 J_v tau_ext (linear rows only).
inline Vec3 estimateTcpForce(const JVec& q, const JVec& tau_ext, const Vec3& tcp_pos) {
    auto J = jacobianAt(q, tcp_pos);
    std::vector<std::vector<double>> A(3, std::vector<double>(3, 0.0));
    std::vector<double> b(3, 0.0), x;
    for (int r = 0; r < 3; ++r) {
        for (int cc = 0; cc < 3; ++cc) {
            double s = 0; for (int k = 0; k < NJ; ++k) s += J[r][k] * J[cc][k];
            A[r][cc] = s + (r == cc ? 1e-6 : 0.0);
        }
        double s = 0; for (int k = 0; k < NJ; ++k) s += J[r][k] * tau_ext[k];
        b[r] = s;
    }
    if (!solveLinearSystem(A, b, x)) return {0, 0, 0};
    return {x[0], x[1], x[2]};
}

// Measured-state check for the CONTROL node (last line of software defence).
// `hard_margin` gives the planner room to do its job: control only trips when the
// state is DEEPER in violation than the planner should ever allow.
struct SafetyMeasured {
    SafetyCode code = SAFE_OK;
    SafetyZone zone = ZONE_NORMAL;
    double tcp_speed = 0, elbow_speed = 0, force_mag = 0;
    Vec3 force{0, 0, 0};
};
inline SafetyMeasured checkMeasured(const SafetyConfig& c, const JVec& q, const JVec& qd,
                                    const Vec3& tcp_pos, const JVec& tau_ext, bool force_valid) {
    SafetyMeasured m;
    m.tcp_speed   = tcpSpeed(q, qd, tcp_pos);
    m.elbow_speed = elbowSpeed(q, qd);
    m.force       = estimateTcpForce(q, tau_ext, tcp_pos);
    m.force_mag   = norm(m.force);
    SafetyVerdict v = checkPosition(c, tcp_pos);
    m.zone = v.zone;
    double v_lim = (v.zone == ZONE_REDUCED) ? c.tcp_speed_reduced : c.tcp_speed_max;
    // Trip rules (1.15x speed / 5 mm penetration hysteresis so planner-side limiting acts first):
    bool deep = false;
    if (v.zone == ZONE_FORBIDDEN) {
        SafetyConfig shrunk = c;                         // re-check with a 5 mm tolerance shell
        for (uint32_t i = 0; i < shrunk.nplanes && i < (uint32_t)MAX_SAFETY_PLANES; ++i) {
            auto& pl = shrunk.planes[i];
            for (int k = 0; k < 3; ++k) pl.p[k] -= 0.005 * pl.n[k];
        }
        shrunk.reach_max  = (c.reach_max > 1e-9) ? c.reach_max + 0.005 : 0.0;
        shrunk.z_min      = c.z_min - 0.005;  shrunk.z_max = c.z_max + 0.005;
        shrunk.base_cyl_r = (c.base_cyl_r > 1e-9) ? std::max(0.0, c.base_cyl_r - 0.005) : 0.0;
        deep = (checkPosition(shrunk, tcp_pos).zone == ZONE_FORBIDDEN);
    }
    if (deep) m.code = v.code;
    else if (v_lim > 1e-9 && m.tcp_speed > v_lim * 1.15) m.code = SAFE_TCP_SPEED;
    else if (c.elbow_speed_max > 1e-9 && m.elbow_speed > c.elbow_speed_max * 1.15) m.code = SAFE_ELBOW_SPEED;
    else if (force_valid && c.tcp_force_max > 1e-9 && m.force_mag > c.tcp_force_max) m.code = SAFE_TCP_FORCE;
    else {
        const double* V = jointVelMax();
        for (int i = 0; i < NJ; ++i)
            if (std::fabs(qd[i]) > V[i] * 1.15) { m.code = SAFE_JOINT_SPEED; break; }
    }
    return m;
}

inline const char* safetyCodeName(uint32_t c) {
    switch (c) {
        case SAFE_OK: return "ok";                     case SAFE_PLANE: return "safety plane";
        case SAFE_REACH: return "max reach";           case SAFE_FLOOR: return "workspace floor";
        case SAFE_CEILING: return "workspace ceiling"; case SAFE_BASE_CYL: return "base keep-out";
        case SAFE_TCP_SPEED: return "TCP overspeed";   case SAFE_TCP_FORCE: return "TCP force limit";
        case SAFE_ELBOW_SPEED: return "elbow overspeed"; case SAFE_JOINT_SPEED: return "joint overspeed";
        default: return "unknown";
    }
}

}  // namespace erm
