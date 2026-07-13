// erm/ik.hpp -- robust full-6-DOF inverse kinematics for erobo10.
//
// Method: Levenberg-Marquardt damped least squares on the 6-D pose error
// (position + quaternion/log-map orientation). Singularity-robust via adaptive
// damping; joint limits enforced by clamping; warm-start seeding gives
// continuity (the returned solution is the branch nearest the seed -> no flips,
// no jitter between successive solves); multi-seed restart gives no-fail
// reliability. Validated by FK round-trip (the "FK oracle" method).
#pragma once
#include <algorithm>
#include <cmath>
#include <random>
#include "erm/kinematics.hpp"

namespace erm {

struct IkOptions {
    double pos_tol = 1e-6;     // metres
    double ori_tol = 1e-6;     // radians
    int    max_iters = 400;
    double lambda0 = 1e-3;     // initial LM damping
    double lambda_min = 1e-6, lambda_max = 1e2;
    double dq_max = 0.35;      // max joint step per iteration (rad)
    int    restarts = 128;     // random restarts if the seed fails (larger workspace -> more)
    bool   clamp_limits = true;
};

struct IkResult {
    bool ok = false;
    JVec q{};
    double pos_err = 0, ori_err = 0;
    int iters = 0, seeds_used = 1;
};

// 6-D pose error: [p_des - p_cur ; log(R_des R_cur^T)] in the base frame.
inline std::array<double, 6> poseError(const Mat4& des, const Mat4& cur) {
    Vec3 dp = des.pos() - cur.pos();
    Vec3 dr = mat3ToRotVec(des.rot() * cur.rot().transpose());
    return {dp.x, dp.y, dp.z, dr.x, dr.y, dr.z};
}

inline void clampToLimits(JVec& q) {
    const double* lo = jointLower(); const double* hi = jointUpper();
    for (int i = 0; i < NJ; ++i) q[i] = std::min(std::max(q[i], lo[i]), hi[i]);
}

// One LM descent from a given seed. Returns true if converged within tolerances.
inline bool ikFromSeed(const Mat4& target, JVec q, const IkOptions& o, IkResult& out) {
    double lambda = o.lambda0;
    auto errs = [&](const JVec& qq, double& pe, double& oe) {
        auto e = poseError(target, forwardKinematics(qq));
        pe = std::sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);
        oe = std::sqrt(e[3]*e[3]+e[4]*e[4]+e[5]*e[5]);
        return e;
    };
    double pe, oe; auto e = errs(q, pe, oe);
    for (int it = 0; it < o.max_iters; ++it) {
        if (pe < o.pos_tol && oe < o.ori_tol) {
            out.q = q; out.pos_err = pe; out.ori_err = oe; out.iters = it; return true;
        }
        auto J = jacobianFlange(q);
        JVec dq = dampedLeastSquares(J, e, lambda);
        // limit step size
        double mx = 0; for (int i=0;i<NJ;++i) mx = std::max(mx, std::abs(dq[i]));
        if (mx > o.dq_max) { double s=o.dq_max/mx; for (int i=0;i<NJ;++i) dq[i]*=s; }
        JVec q2 = q; for (int i=0;i<NJ;++i) q2[i]+=dq[i];
        if (o.clamp_limits) clampToLimits(q2);
        double pe2, oe2; auto e2 = errs(q2, pe2, oe2);
        if (pe2*pe2+oe2*oe2 < pe*pe+oe*oe) {        // accept, trust Newton more
            q=q2; e=e2; pe=pe2; oe=oe2; lambda=std::max(lambda*0.7, o.lambda_min);
        } else {                                    // reject, damp harder
            lambda=std::min(lambda*2.5, o.lambda_max);
            if (lambda >= o.lambda_max) {           // stuck
                out.q=q; out.pos_err=pe; out.ori_err=oe; out.iters=it;
                return pe<o.pos_tol && oe<o.ori_tol;
            }
        }
    }
    out.q=q; out.pos_err=pe; out.ori_err=oe; out.iters=o.max_iters;
    return pe<o.pos_tol && oe<o.ori_tol;
}

// Full solve: warm-start from `seed` (continuity), then random restarts (no-fail).
inline IkResult solveIK(const Mat4& target, const JVec& seed, const IkOptions& o = {}) {
    IkResult best; best.ok=false; best.pos_err=1e9; best.ori_err=1e9;
    const double* lo=jointLower(); const double* hi=jointUpper();
    int used=0;
    auto trySeed=[&](const JVec& q0)->bool{
        IkResult ri; ++used;
        bool ok=ikFromSeed(target,q0,o,ri);
        if (ri.pos_err+ri.ori_err < best.pos_err+best.ori_err){ best=ri; best.seeds_used=used; }
        if (ok){ best=ri; best.ok=true; best.seeds_used=used; }
        return ok;
    };
    // 1) warm-start from the caller's seed -> continuity (nearest branch)
    if (trySeed(seed)) return best;
    // 2) structured seeds covering shoulder/elbow/wrist configuration branches
    JVec mid; for(int i=0;i<NJ;++i) mid[i]=0.5*(lo[i]+hi[i]);
    const JVec structured[] = {
        {0,0,0,0,0,0}, mid,
        {0, 1.0,-1.5, 0, 1.0, 0}, {0,-1.0, 1.5, 0,-1.0, 0},
        {1.57, 0.8,-1.2, 0, 0.8, 0}, {-1.57,-0.8, 1.2, 0,-0.8, 0},
        {0, 1.5, 1.5, 1.5, 1.5, 1.5}, {0,-1.5,-1.5,-1.5,-1.5,-1.5},
    };
    for (const auto& q0 : structured) if (trySeed(q0)) return best;
    // 3) random restarts -> no-fail reliability
    std::mt19937 rng(12345);
    for (int s=0; s<o.restarts; ++s) {
        JVec q0; for (int i=0;i<NJ;++i){ std::uniform_real_distribution<double> U(lo[i],hi[i]); q0[i]=U(rng); }
        if (trySeed(q0)) return best;
    }
    best.ok = (best.pos_err<o.pos_tol && best.ori_err<o.ori_tol);
    return best;
}

// Convenience: build a target pose from position + RPY.
inline Mat4 poseFromPosRpy(double x,double y,double z,double r,double p,double yw){
    return Mat4::fromRotTrans(rpyToMat3(r,p,yw), {x,y,z});
}

}  // namespace erm
