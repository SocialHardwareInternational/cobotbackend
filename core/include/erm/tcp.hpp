// erm/tcp.hpp -- Tool Center Point (TCP) frame layer.
//
// A thin, provably-correct layer over the validated flange-space kinematics
// (kinematics.hpp / ik.hpp). The mounted tool is a single rigid transform
// T_tool = T_flange->tcp (UR/ABB/KUKA convention: a translation + rotation
// relative to the tool output flange). With it:
//
//   tcpFK(q)      = forwardKinematics(q) * T_tool        // report the tool tip
//   solveIKtcp(P) = solveIK( P * T_tool^-1 )             // accept tool-tip targets
//
// All existing FK/IK stay in flange space and are untouched; TCP is a pre/post
// multiply. The transform is a process-local runtime singleton, set from shared
// memory by every node that needs it (ik_solver, motion_planner, control nodes),
// so there is one source of truth and nothing new to launch.
#pragma once
#include "erm/kinematics.hpp"
#include "erm/ik.hpp"

namespace erm {

// Runtime tool transform T_flange->tcp (default identity = TCP on the flange face).
inline Mat4& toolTransform() { static Mat4 T = Mat4::identity(); return T; }
inline void  setToolTransform(const Mat4& T) { toolTransform() = T; }

// Build a tool transform from pos + quaternion [x,y,z, qw,qx,qy,qz]. A zero/unset
// quaternion (norm ~ 0) is treated as identity (so an uninitialised shm field =
// "no tool" = flange).
inline Mat4 toolFromPosQuat(const double* p) {
    double n = std::sqrt(p[3]*p[3] + p[4]*p[4] + p[5]*p[5] + p[6]*p[6]);
    if (n < 1e-9) return Mat4::fromRotTrans(rpyToMat3(0,0,0), Vec3{p[0],p[1],p[2]});
    Quat q{p[3]/n, p[4]/n, p[5]/n, p[6]/n};
    return Mat4::fromRotTrans(q.toMat3(), Vec3{p[0], p[1], p[2]});
}
inline void setToolFromPosQuat(const double* p) { setToolTransform(toolFromPosQuat(p)); }

// Pose conversions between the flange and the tool tip (base frame).
inline Mat4 tcpFromFlange(const Mat4& flange) { return flange * toolTransform(); }
inline Mat4 flangeFromTcp(const Mat4& tcp)    { return tcp * toolTransform().inverseRigid(); }

// TCP forward kinematics: base -> tool tip.
inline Mat4 tcpFK(const JVec& q) { return forwardKinematics(q) * toolTransform(); }

// IK for a tool-tip target: convert to the flange target, then solve in flange space.
inline IkResult solveIKtcp(const Mat4& tcpTarget, const JVec& seed, const IkOptions& o = {}) {
    return solveIK(flangeFromTcp(tcpTarget), seed, o);
}

// Convenience: tool transform from pos + roll/pitch/yaw (rad).
inline Mat4 toolFromPosRpy(double x,double y,double z,double r,double p,double yw){
    return Mat4::fromRotTrans(rpyToMat3(r,p,yw), Vec3{x,y,z});
}
// Convenience: tool transform from pos + UR axis-angle / rotation vector (rad).
inline Mat4 toolFromPosRotVec(double x,double y,double z,double rx,double ry,double rz){
    return Mat4::fromRotTrans(rotVecToMat3(Vec3{rx,ry,rz}), Vec3{x,y,z});
}

}  // namespace erm
