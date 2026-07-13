// test_motion.cpp -- exercise each motion type on the new URDF and report realism:
// duration, max per-cycle joint step, peak joint velocity vs limit, IK feasibility,
// and (for Cartesian) straight-line / arc tracking error.
#include "erm/trajectory.hpp"
#include "erm/tcp.hpp"
#include <cstdio>
#include <cmath>
using namespace erm;

static double maxJointVelFrac(const JVec& a, const JVec& b, double dt){
    const double* V=jointVelMax(); double m=0;
    for(int i=0;i<NJ;i++) m=std::max(m, std::fabs(b[i]-a[i])/dt/V[i]);
    return m;
}

int main(){
    const double dt=0.001;
    JVec q0{0.0,-0.6,1.0,0.0,0.6,0.0};                 // a comfortable "ready" pose
    Mat4 P0=tcpFK(q0);
    printf("ready flange = (%.3f,%.3f,%.3f)\n", P0.pos().x,P0.pos().y,P0.pos().z);

    // ---------- MoveL: straight 0.20 m in -z, orientation held ----------
    {
        Mat4 P1=Mat4::fromRotTrans(P0.rot(), P0.pos()+Vec3{0.0,0.0,-0.20});
        CartesianTrajectory ct; ct.plan(P0,P1,q0);
        double T=ct.duration(); Vec3 u=(P1.pos()-P0.pos())*(1.0/norm(P1.pos()-P0.pos()));
        JVec prev=q0; double maxStep=0,maxVel=0,maxDev=0; bool ok=true; int n=0;
        for(double t=0;t<=T+1e-9;t+=dt){ JVec q; if(!ct.sampleJoints(t,q)){ok=false;break;}
            if(n>0){ double st=0; for(int i=0;i<NJ;i++) st=std::max(st,std::fabs(q[i]-prev[i])); maxStep=std::max(maxStep,st);
                     maxVel=std::max(maxVel,maxJointVelFrac(prev,q,dt)); }
            Vec3 P=tcpFK(q).pos()-P0.pos(); maxDev=std::max(maxDev, norm(P - u*dot(P,u)));
            prev=q; n++; }
        printf("MoveL : T=%.2fs  IK_ok=%d  maxStep/ms=%.4f rad  peakJointVel=%.0f%% of limit  lineDev=%.2emm\n",
               T,ok,maxStep,maxVel*100,maxDev*1000);
    }
    // ---------- MoveJ: joint move to a different pose ----------
    {
        JVec qf{0.6,-0.4,0.8,0.3,-0.5,0.4}; JointTrajectory jt; jt.plan(q0,qf);
        double T=jt.duration(); JVec prev=q0; double maxVel=0;
        for(double t=0;t<=T+1e-9;t+=dt){ JVec q,qd,qdd; jt.sample(t,q,qd,qdd);
            maxVel=std::max(maxVel,maxJointVelFrac(prev,q,dt)); prev=q; }
        printf("MoveJ : T=%.2fs  peakJointVel=%.0f%% of limit\n",T,maxVel*100);
    }
    // ---------- MoveC: arc through a via ----------
    {
        Mat4 via=Mat4::fromRotTrans(P0.rot(), P0.pos()+Vec3{0.10,0.0,-0.06});
        Mat4 end=Mat4::fromRotTrans(P0.rot(), P0.pos()+Vec3{0.20,0.0,0.0});
        CircularTrajectory cir; bool planned=cir.plan(P0,via,end,q0); double T=cir.duration();
        JVec prev=q0; double maxStep=0,maxVel=0; bool ok=planned; int n=0;
        for(double t=0;t<=T+1e-9;t+=dt){ JVec q; if(!cir.sampleJoints(t,q)){ok=false;break;}
            if(n>0){ double st=0; for(int i=0;i<NJ;i++) st=std::max(st,std::fabs(q[i]-prev[i])); maxStep=std::max(maxStep,st);
                     maxVel=std::max(maxVel,maxJointVelFrac(prev,q,dt)); } prev=q; n++; }
        printf("MoveC : T=%.2fs  IK_ok=%d  maxStep/ms=%.4f rad  peakJointVel=%.0f%% of limit\n",T,ok,maxStep,maxVel*100);
    }
    // ---------- MoveP: blended path through 3 points ----------
    {
        std::vector<BlendedPath::Pose> wp={
            {P0.pos(), Quat::fromMat3(P0.rot())},
            {P0.pos()+Vec3{0.15,0.0,0.0}, Quat::fromMat3(P0.rot())},
            {P0.pos()+Vec3{0.15,0.15,0.0}, Quat::fromMat3(P0.rot())}};
        BlendedPath bp; bool planned=bp.plan(wp,0.05,0.25,1.2,12.0,q0); double T=bp.duration();
        JVec prev=q0; double maxStep=0,maxVel=0; bool ok=planned; int n=0;
        for(double t=0;t<=T+1e-9;t+=dt){ JVec q; if(!bp.sampleJoints(t,q)){ok=false;break;}
            if(n>0){ double st=0; for(int i=0;i<NJ;i++) st=std::max(st,std::fabs(q[i]-prev[i])); maxStep=std::max(maxStep,st);
                     maxVel=std::max(maxVel,maxJointVelFrac(prev,q,dt)); } prev=q; n++; }
        printf("MoveP : T=%.2fs  IK_ok=%d  maxStep/ms=%.4f rad  peakJointVel=%.0f%% of limit\n",T,ok,maxStep,maxVel*100);
    }
    printf("\n(unrealistic = peakJointVel >> 100%%, maxStep/ms large, or IK_ok=0)\n");
    return 0;
}
