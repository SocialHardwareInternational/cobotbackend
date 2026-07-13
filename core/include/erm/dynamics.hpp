// erm/dynamics.hpp -- rigid-body inverse dynamics (RNEA) for erobo10.
//
// tau = M(q) qdd + C(q,qd) qd + G(q), computed by the Recursive Newton-Euler
// Algorithm over the URDF rigid-body model (erobo10_dyn.hpp), with an optional
// point payload at the flange. This lets the planner respect ACTUATOR TORQUE
// limits (not just kinematic velocity/accel), so commanded motion stays within
// what the drives can deliver against gravity + inertia + the payload.
#pragma once
#include <array>
#include <cmath>
#include "erm/erobo10_dh.hpp"     // NJ, jointEffortMax
#include "erm/erobo10_dyn.hpp"    // dynModel()

namespace erm {

using Vec3a = std::array<double,3>;

namespace dyn_detail {
inline Vec3a cross(const Vec3a&a,const Vec3a&b){ return {a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]}; }
inline Vec3a add(const Vec3a&a,const Vec3a&b){ return {a[0]+b[0],a[1]+b[1],a[2]+b[2]}; }
inline Vec3a sub(const Vec3a&a,const Vec3a&b){ return {a[0]-b[0],a[1]-b[1],a[2]-b[2]}; }
inline Vec3a scl(const Vec3a&a,double s){ return {a[0]*s,a[1]*s,a[2]*s}; }
inline double dot(const Vec3a&a,const Vec3a&b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
inline Vec3a matT(const double R[9],const Vec3a&v){ return { R[0]*v[0]+R[3]*v[1]+R[6]*v[2], R[1]*v[0]+R[4]*v[1]+R[7]*v[2], R[2]*v[0]+R[5]*v[1]+R[8]*v[2] }; }
inline Vec3a matN(const double R[9],const Vec3a&v){ return { R[0]*v[0]+R[1]*v[1]+R[2]*v[2], R[3]*v[0]+R[4]*v[1]+R[5]*v[2], R[6]*v[0]+R[7]*v[1]+R[8]*v[2] }; }
inline Vec3a Imul(const double I[9],const Vec3a&v){ return { I[0]*v[0]+I[1]*v[1]+I[2]*v[2], I[3]*v[0]+I[4]*v[1]+I[5]*v[2], I[6]*v[0]+I[7]*v[1]+I[8]*v[2] }; }
// R = Rorigin * axisRot(axis,q), row-major
inline void linkRot(const double Ro[9], const Vec3a& ax, double q, double R[9]) {
    double n=std::sqrt(ax[0]*ax[0]+ax[1]*ax[1]+ax[2]*ax[2]); double x=ax[0]/n,y=ax[1]/n,z=ax[2]/n;
    double c=std::cos(q),s=std::sin(q),C=1-c;
    double A[9]={ c+x*x*C, x*y*C-z*s, x*z*C+y*s,
                 y*x*C+z*s, c+y*y*C, y*z*C-x*s,
                 z*x*C-y*s, z*y*C+x*s, c+z*z*C };
    for(int r=0;r<3;++r)for(int cc=0;cc<3;++cc){ double v=0; for(int k=0;k<3;++k) v+=Ro[r*3+k]*A[k*3+cc]; R[r*3+cc]=v; }
}
}  // namespace dyn_detail

// Full inverse dynamics: joint torques [Nm] for (q, qd, qdd) with point payload [kg] at flange.
inline std::array<double,NJ> inverseDynamics(const std::array<double,NJ>& q,
                                             const std::array<double,NJ>& qd,
                                             const std::array<double,NJ>& qdd,
                                             double payload = 0.0,
                                             const Vec3a& payload_cog = {0,0,0}) {
    using namespace dyn_detail;
    const DynLink* M = dynModel();
    const int N = NJ + (payload>0 ? 1 : 0);
    double R[7][9]; Vec3a axis[7], p[7], com[7]; double mass[7]; const double* In[7];
    static const double Ipayload[9]={0,0,0,0,0,0,0,0,0};
    for (int i=0;i<NJ;++i){
        axis[i]={M[i].axis[0],M[i].axis[1],M[i].axis[2]};
        linkRot(M[i].R, axis[i], q[i], R[i]);
        p[i]={M[i].p[0],M[i].p[1],M[i].p[2]};
        com[i]={M[i].com[0],M[i].com[1],M[i].com[2]};
        mass[i]=M[i].mass; In[i]=M[i].I;
    }
    if (payload>0){ // rigid point mass at link6 frame origin (flange-mounted)
        static const double Ieye[9]={1,0,0,0,1,0,0,0,1};
        for(int k=0;k<9;++k) R[NJ][k]=Ieye[k];
        axis[NJ]={0,0,1}; p[NJ]={0,0,0}; com[NJ]={payload_cog[0],payload_cog[1],payload_cog[2]}; mass[NJ]=payload; In[NJ]=Ipayload;
    }
    Vec3a w[7], wd[7], a[7];
    Vec3a w_prev={0,0,0}, wd_prev={0,0,0}, a_prev={0,0,9.81};   // base accel folds in gravity (+z up)
    Vec3a F[7], Nt[7];
    for (int i=0;i<N;++i){
        double qd_i  = (i<NJ)? qd[i]  : 0.0;
        double qdd_i = (i<NJ)? qdd[i] : 0.0;
        Vec3a win = matT(R[i], w_prev);
        w[i]  = add(win, scl(axis[i], qd_i));
        wd[i] = add(add(matT(R[i], wd_prev), cross(win, scl(axis[i], qd_i))), scl(axis[i], qdd_i));
        Vec3a ain = add(add(cross(wd_prev,p[i]), cross(w_prev,cross(w_prev,p[i]))), a_prev);
        a[i] = matT(R[i], ain);
        Vec3a ac = add(add(cross(wd[i],com[i]), cross(w[i],cross(w[i],com[i]))), a[i]);
        F[i] = scl(ac, mass[i]);
        Nt[i] = add(Imul(In[i],wd[i]), cross(w[i], Imul(In[i],w[i])));
        w_prev=w[i]; wd_prev=wd[i]; a_prev=a[i];
    }
    std::array<double,NJ> tau{};
    Vec3a f_next={0,0,0}, n_next={0,0,0};
    for (int i=N-1;i>=0;--i){
        Vec3a fn = (i==N-1)? Vec3a{0,0,0} : matN(R[i+1], f_next);
        Vec3a nn = (i==N-1)? Vec3a{0,0,0} : matN(R[i+1], n_next);
        Vec3a f_i = add(fn, F[i]);
        Vec3a pterm = (i==N-1)? Vec3a{0,0,0} : cross(p[i+1], fn);
        Vec3a n_i = add(add(add(Nt[i], nn), cross(com[i], F[i])), pterm);
        if (i<NJ) tau[i] = dot(n_i, axis[i]);
        f_next=f_i; n_next=n_i;
    }
    return tau;
}

// Gravity-hold torque (static): tau to merely hold pose q against gravity + payload.
inline std::array<double,NJ> gravityTorque(const std::array<double,NJ>& q, double payload=0.0,
                                           const Vec3a& payload_cog={0,0,0}) {
    std::array<double,NJ> z{};
    return inverseDynamics(q, z, z, payload, payload_cog);
}

// Worst per-joint torque utilisation (|tau|/effort) over a motion sample.
inline double torqueUtilization(const std::array<double,NJ>& tau) {
    const double* e=jointEffortMax(); double u=0;
    for (int i=0;i<NJ;++i) u=std::max(u, std::abs(tau[i])/e[i]);
    return u;
}

}  // namespace erm
