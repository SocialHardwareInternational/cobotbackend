// test_traj.cpp -- validate jerk-limited profiles, synchronized PTP, and LIN moves.
#include <cmath>
#include <cstdio>
#include <random>
#include "erm/trajectory.hpp"
using namespace erm;

int main() {
    int fail = 0;
    const double dt = 0.001;  // 1 kHz sampling

    // ---- 1. S-curve: limits + boundary conditions + jerk continuity ----
    {
        ScurveProfile p; p.plan(1.0, 0.5, 2.0, 20.0);
        double T=p.duration(), maxv=0, maxa=0, maxjerk=0, prevA=0; bool first=true;
        for (double t=0;t<=T+1e-9;t+=dt){ Kin s=p.sample(t);
            maxv=std::max(maxv,std::abs(s.v)); maxa=std::max(maxa,std::abs(s.a));
            if(!first) maxjerk=std::max(maxjerk,std::abs(s.a-prevA)/dt);
            prevA=s.a; first=false; }
        Kin e=p.sample(T);
        bool ok = std::abs(e.x-1.0)<1e-6 && std::abs(e.v)<1e-6 && maxv<=0.5+1e-4 && maxa<=2.0+1e-4 && maxjerk<=20.0*1.05;
        std::printf("[1] S-curve T=%.3fs  v<=%.3f a<=%.3f jerk<=%.1f  end x=%.6f  %s\n",
                    T,maxv,maxa,maxjerk,e.x, ok?"ok":"FAIL"); fail+=ok?0:1;
    }

    // ---- 2. Synchronized PTP: all joints arrive together, limits, C2 ----
    {
        std::mt19937 rng(3); const double*lo=jointLower();const double*hi=jointUpper();
        const double*V=jointVelMax();const double*A=jointAccMax();const double*Jm=jointJerkMax();
        bool allok=true; double worstSync=0, worstJerk=0;
        for (int trial=0;trial<200;++trial){
            JVec q0,qf; for(int i=0;i<NJ;++i){ std::uniform_real_distribution<double>U(lo[i]+0.1,hi[i]-0.1); q0[i]=U(rng); qf[i]=U(rng);}
            JointTrajectory tr; tr.plan(q0,qf); double T=tr.duration();
            JVec q,qd,qdd,prevqd; bool first=true;
            for (double t=0;t<=T+1e-9;t+=dt){ tr.sample(t,q,qd,qdd);
                for(int i=0;i<NJ;++i){ if(std::abs(qd[i])>V[i]*1.001||std::abs(qdd[i])>A[i]*1.001) allok=false;
                    if(!first){ double jk=std::abs(qdd[i]-prevqd[i])/dt; worstJerk=std::max(worstJerk,jk-Jm[i]); } }
                prevqd=qdd; first=false;
            }
            tr.sample(T,q,qd,qdd);
            for(int i=0;i<NJ;++i) worstSync=std::max(worstSync,std::abs(q[i]-qf[i]));
        }
        bool ok = allok && worstSync<1e-6 && worstJerk<1.0;  // jerk within limit (margin)
        std::printf("[2] PTP x200: arrive-together err %.2e, vel/acc within limits=%d, jerk overflow %.2e  %s\n",
                    worstSync, allok?1:0, worstJerk, ok?"ok":"FAIL"); fail+=ok?0:1;
    }

    // ---- 3. Cartesian LIN: straight line, continuous joints, IK accurate ----
    {
        JVec qa={0.0,-0.6,1.0,0.0,0.6,0.0};   // comfortable mid-workspace pose (new URDF arm)
        Mat4 P0=forwardKinematics(qa);
        Mat4 P1=Mat4::fromRotTrans(P0.rot(), P0.pos()+Vec3{0.12,-0.08,0.06});  // 0.16 m straight move
        CartesianTrajectory ct; ct.plan(P0,P1,qa);
        double T=ct.duration(); Vec3 d=P1.pos()-P0.pos(); double L=norm(d); Vec3 u=d*(1.0/L);
        double maxDevLine=0, maxStep=0; JVec prev=qa; bool allik=true; int n=0;
        for (double t=0;t<=T+1e-9;t+=dt){ JVec q;
            if(!ct.sampleJoints(t,q)){ allik=false; break; }
            Vec3 P=forwardKinematics(q).pos(); Vec3 rel=P-P0.pos();
            Vec3 along=u*dot(rel,u); double dev=norm(rel-along);
            maxDevLine=std::max(maxDevLine,dev);
            if(n>0){ double st=0; for(int i=0;i<NJ;++i) st=std::max(st,std::abs(q[i]-prev[i])); maxStep=std::max(maxStep,st); }
            prev=q; ++n;
        }
        bool ok = allik && maxDevLine<5e-5 && maxStep<0.05;
        std::printf("[3] LIN move T=%.3fs L=%.3fm: line deviation %.2e m, max joint step/ms %.4f rad, IK ok=%d  %s\n",
                    T,L,maxDevLine,maxStep,allik?1:0, ok?"ok":"FAIL"); fail+=ok?0:1;
    }

    std::printf("\n%s\n", fail?"TRAJECTORY ISSUES":"MOTION PLANNER OK (jerk-limited, synced, straight-line)");
    return fail?1:0;
}
