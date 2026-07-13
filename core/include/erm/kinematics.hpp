// erm/kinematics.hpp -- forward kinematics + geometric Jacobian for erobo10,
// built on the validated clean DH model (erobo10_dh.hpp).
#pragma once
#include <array>
#include "erm/erobo10_dh.hpp"
#include "erm/linalg.hpp"

namespace erm {

using JVec = std::array<double, NJ>;

// Single DH link transform: Rz(theta)Tz(d)Tx(a)Rx(alpha).
// Homogeneous transform for a URDF joint's fixed parent->joint origin H(R, p).
inline Mat4 urdfOrigin(const UrdfJoint& Jt){
    Mat3 R; for(int i=0;i<9;++i) R.m[i]=Jt.R[i];
    return Mat4::fromRotTrans(R, Vec3{Jt.p[0],Jt.p[1],Jt.p[2]});
}
// Rotation about the joint axis by q (axis is unit; exp-map via rotation vector).
inline Mat4 urdfJointRot(const UrdfJoint& Jt, double q){
    return Mat4::fromRotTrans(rotVecToMat3(Vec3{Jt.axis[0]*q,Jt.axis[1]*q,Jt.axis[2]*q}), Vec3{0,0,0});
}
inline Mat4 toolOffsetMat() { return Mat4::fromRowMajor(toolOffset()); }   // identity (flange == last link frame)

// Cumulative link frames. F[0]=base(I); F[i+1]=F[i]*H(R_i,p_i)*Rot(axis_i,q_i).
// F[i].pos() = origin of joint i (a point on the arm); F[NJ] = flange.
inline std::array<Mat4, NJ + 1> linkFrames(const JVec& q) {
    std::array<Mat4, NJ + 1> F;
    F[0] = Mat4::identity();
    const UrdfJoint* J = urdfChain();
    for (int i = 0; i < NJ; ++i)
        F[i + 1] = F[i] * urdfOrigin(J[i]) * urdfJointRot(J[i], q[i]);
    return F;
}

// Flange pose: base -> last URDF link frame (j6).
inline Mat4 forwardKinematics(const JVec& q) { return linkFrames(q)[NJ]; }

// Geometric Jacobian (6 x NJ) at a base-frame reference point p_ref. Rows 0-2 linear, 3-5
// angular. Joint i rotates about its axis expressed in the post-origin frame O_i=F[i-1]*H(R_i,p_i).
inline std::array<std::array<double, NJ>, 6> jacobianAt(const JVec& q, const Vec3& p_ref) {
    std::array<std::array<double, NJ>, 6> Jc{};
    const UrdfJoint* J = urdfChain();
    Mat4 T = Mat4::identity();
    for (int i = 0; i < NJ; ++i) {
        Mat4 O = T * urdfOrigin(J[i]);                                       // frame holding joint i's axis
        Vec3 z = O.rot() * Vec3{J[i].axis[0], J[i].axis[1], J[i].axis[2]};   // screw axis (base frame)
        Vec3 o = O.pos();
        Vec3 Jv = cross(z, p_ref - o);
        Jc[0][i]=Jv.x; Jc[1][i]=Jv.y; Jc[2][i]=Jv.z;
        Jc[3][i]=z.x;  Jc[4][i]=z.y;  Jc[5][i]=z.z;
        T = O * urdfJointRot(J[i], q[i]);
    }
    return Jc;
}
inline std::array<std::array<double, NJ>, 6> jacobianFlange(const JVec& q) {
    return jacobianAt(q, forwardKinematics(q).pos());
}

// Damped least squares: dq = J^T (J J^T + lambda^2 I)^-1 v  (singularity-robust).
inline JVec dampedLeastSquares(const std::array<std::array<double, NJ>, 6>& J,
                               const std::array<double, 6>& v, double lambda) {
    std::vector<std::vector<double>> A(6, std::vector<double>(6, 0.0));
    for (int i=0;i<6;++i) for (int j=0;j<6;++j){ double s=0; for(int k=0;k<NJ;++k) s+=J[i][k]*J[j][k]; A[i][j]=s+(i==j?lambda*lambda:0); }
    std::vector<double> b(v.begin(), v.end()), y; JVec dq{};
    if (!solveLinearSystem(A,b,y)) return dq;
    for (int k=0;k<NJ;++k){ double s=0; for(int i=0;i<6;++i) s+=J[i][k]*y[i]; dq[k]=s; }
    return dq;
}

// Yoshikawa manipulability sqrt(det(J J^T)) -- low near singularities.
inline double manipulability(const std::array<std::array<double, NJ>, 6>& J) {
    std::vector<std::vector<double>> A(6, std::vector<double>(6,0.0));
    for (int i=0;i<6;++i) for (int j=0;j<6;++j){ double s=0; for(int k=0;k<NJ;++k) s+=J[i][k]*J[j][k]; A[i][j]=s; }
    // determinant via LU (reuse elimination)
    double det=1; const int n=6;
    for (int col=0; col<n; ++col){
        int piv=col; double best=std::abs(A[col][col]);
        for (int r=col+1;r<n;++r) if (std::abs(A[r][col])>best){best=std::abs(A[r][col]);piv=r;}
        if (best<1e-15) return 0.0;
        if (piv!=col){ std::swap(A[piv],A[col]); det=-det; }
        det*=A[col][col];
        for (int r=col+1;r<n;++r){ double f=A[r][col]/A[col][col]; for(int c=col;c<n;++c) A[r][c]-=f*A[col][c]; }
    }
    return det>0 ? std::sqrt(det) : 0.0;
}

}  // namespace erm
