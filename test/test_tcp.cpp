// test_tcp.cpp -- end-to-end correctness of the TCP layer (standalone, no shm/processes).
//
// Validates the design's headline claims against the SAME code the planner uses:
//   1. solveIKtcp round-trip: a tool-tip target is reached exactly by the tool tip.
//   2. MoveL moves the TOOL TIP in a straight line (UR/ABB semantics): with a tool that
//      has both an offset and an orientation change along the path, the TCP stays on its
//      straight chord while the FLANGE necessarily curves off its own chord.
//   3. Payload CoG changes the gravity torque (feeds the eRob torque model).
#include "erm/tcp.hpp"
#include "erm/trajectory.hpp"
#include "erm/dynamics.hpp"
#include <cstdio>
#include <cmath>
using namespace erm;

static double distToLine(const Vec3& p, const Vec3& a, const Vec3& b){
    Vec3 ab{b.x-a.x,b.y-a.y,b.z-a.z}; Vec3 ap{p.x-a.x,p.y-a.y,p.z-a.z};
    double L2=ab.x*ab.x+ab.y*ab.y+ab.z*ab.z; if(L2<1e-12) return std::sqrt(ap.x*ap.x+ap.y*ap.y+ap.z*ap.z);
    double t=(ap.x*ab.x+ap.y*ab.y+ap.z*ab.z)/L2; if(t<0)t=0; if(t>1)t=1;
    Vec3 c{a.x+ab.x*t,a.y+ab.y*t,a.z+ab.z*t};
    return std::sqrt((p.x-c.x)*(p.x-c.x)+(p.y-c.y)*(p.y-c.y)+(p.z-c.z)*(p.z-c.z));
}

int main(){
    bool pass=true;

    // mounted tool: 180 mm along flange +z, tilted 25 deg about flange x (an offset, angled tool)
    setToolTransform(toolFromPosRpy(0,0,0.180, 25*M_PI/180, 0, 0));

    JVec q0{0.0, 0.7, -1.1, 0.2, 1.0, 0.3};

    // ---- 1) solveIKtcp round-trip ----
    Mat4 tgt = tcpFK(q0);
    IkResult r = solveIKtcp(tgt, JVec{0,0.5,-0.8,0,0.8,0});
    Mat4 got = tcpFK(r.q);
    double e1 = std::sqrt(std::pow(got.pos().x-tgt.pos().x,2)+std::pow(got.pos().y-tgt.pos().y,2)+std::pow(got.pos().z-tgt.pos().z,2));
    bool p1 = r.ok && e1<1e-5; pass&=p1;
    printf("1) solveIKtcp round-trip: ok=%d  tool-tip err=%.2e m  %s\n", r.ok, e1, p1?"PASS":"FAIL");

    // ---- 2) MoveL keeps the TOOL TIP straight ----
    // start = current tool-tip pose; end = translate 0.25 m in base + reorient 35 deg.
    Mat4 P0 = tcpFK(q0);
    Mat3 Rend = rpyToMat3(35*M_PI/180, -20*M_PI/180, 15*M_PI/180) * P0.rot();
    Mat4 P1 = Mat4::fromRotTrans(Rend, Vec3{P0.pos().x+0.18, P0.pos().y-0.10, P0.pos().z+0.12});
    CartesianTrajectory ctr; ctr.plan(P0, P1, q0);            // planner plans in TCP space now
    double dur=ctr.duration();
    Vec3 fa = forwardKinematics(q0).pos();                    // flange chord endpoints
    JVec qe; ctr.sampleJoints(dur, qe); Vec3 fb = forwardKinematics(qe).pos();
    double tcpDev=0, flDev=0; int N=60;
    JVec qs=q0;
    for(int k=0;k<=N;k++){ double t=dur*k/N; JVec q; if(!ctr.sampleJoints(t,q)) continue; qs=q;
        tcpDev=std::max(tcpDev, distToLine(tcpFK(q).pos(),           P0.pos(), P1.pos()));
        flDev =std::max(flDev,  distToLine(forwardKinematics(q).pos(), fa, fb)); }
    bool p2 = (tcpDev < 1e-3) && (flDev > 3*tcpDev + 1e-3);   // tip straight; flange measurably curved
    pass&=p2;
    printf("2) MoveL straightness: tool-tip dev=%.2e m (straight)  flange dev=%.2e m (curves)  %s\n", tcpDev, flDev, p2?"PASS":"FAIL");

    // ---- 3) payload CoG feeds gravity torque ----
    auto g0=gravityTorque(q0, 3.0, Vec3a{0,0,0});
    auto g1=gravityTorque(q0, 3.0, Vec3a{0.0,0.0,0.18});      // 3 kg, CoG 180 mm out
    double d3=0; for(int i=0;i<NJ;i++) d3=std::max(d3,std::fabs(g0[i]-g1[i]));
    bool p3 = d3>0.5; pass&=p3;
    printf("3) payload CoG -> torque: max |dtau|=%.2f Nm  %s\n", d3, p3?"PASS":"FAIL");

    printf("\nTCP END-TO-END: %s\n", pass?"PASS":"FAIL");
    return pass?0:1;
}
