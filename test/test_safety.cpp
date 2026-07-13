// test_safety.cpp -- unit tests for the configurable safety monitor (erm/safety.hpp).
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <random>
#include "erm/safety.hpp"
#include "erm/tcp.hpp"
using namespace erm;

static int fails = 0;
#define CHECK(cond, msg) do{ if(!(cond)){ std::printf("  FAIL: %s\n", msg); fails++; } }while(0)

int main(){
    // [1] safety planes: point + normal semantics ------------------------------
    SafetyConfig c;
    c.nplanes = 1;
    c.planes[0].mode = PLANE_FORBIDDEN;
    c.planes[0].p[0]=0; c.planes[0].p[1]=0; c.planes[0].p[2]=0.20;   // floor plane at z=0.2
    c.planes[0].n[0]=0; c.planes[0].n[1]=0; c.planes[0].n[2]=1;      // keep TCP above
    auto vAbove = checkPosition(c, {0.4, 0.0, 0.50});
    auto vBelow = checkPosition(c, {0.4, 0.0, 0.10});
    CHECK(vAbove.zone==ZONE_NORMAL, "above plane should be NORMAL");
    CHECK(std::fabs(vAbove.margin-0.30)<1e-9, "margin above plane = 0.30 m");
    CHECK(vBelow.zone==ZONE_FORBIDDEN && vBelow.code==SAFE_PLANE && vBelow.which==0, "below plane FORBIDDEN");
    std::printf("[1] safety planes ok\n");

    // [2] reduced zone + boundary ramp -----------------------------------------
    c.planes[0].mode = PLANE_REDUCED;
    CHECK(checkPosition(c, {0.4,0,0.10}).zone==ZONE_REDUCED, "reduced side flags REDUCED");
    double sIn  = plannerSpeedScale(c, {0.4,0,0.10});
    CHECK(std::fabs(sIn - c.tcp_speed_reduced/c.tcp_speed_max) < 1e-9, "reduced zone scales to reduced/max");
    c.planes[0].mode = PLANE_FORBIDDEN;
    CHECK(plannerSpeedScale(c, {0.4,0,0.10})==0.0, "forbidden zone scale = 0");
    double sNear = plannerSpeedScale(c, {0.4,0,0.22});   // 20 mm above, inside 50 mm slow band
    CHECK(sNear>0.35 && sNear<0.45, "boundary approach ramps speed (~0.4 at 20/50 mm)");
    std::printf("[2] zone speed scaling ok\n");

    // [3] workspace bounds -------------------------------------------------------
    SafetyConfig w; w.reach_max=1.0; w.z_min=0.0; w.base_cyl_r=0.15;
    CHECK(checkPosition(w,{1.2,0,0.5}).code==SAFE_REACH,   "outside reach sphere");
    CHECK(checkPosition(w,{0.5,0,-0.1}).code==SAFE_FLOOR,  "below floor");
    { SafetyConfig w2; w2.z_max=1.2;
      CHECK(checkPosition(w2,{0.5,0,1.5}).code==SAFE_CEILING, "above ceiling"); }
    CHECK(checkPosition(w,{0.05,0.05,0.5}).code==SAFE_BASE_CYL, "inside base cylinder");
    CHECK(checkPosition(w,{0.5,0,0.5}).zone==ZONE_NORMAL,  "normal point ok");
    std::printf("[3] workspace bounds ok\n");

    // [4] measured TCP speed vs finite difference -------------------------------
    std::mt19937 rng(7); std::uniform_real_distribution<double> U(-1.2,1.2), Uv(-0.5,0.5);
    double worst=0;
    for(int t=0;t<50;++t){
        JVec q,qd; for(int i=0;i<NJ;++i){ q[i]=U(rng); qd[i]=Uv(rng); }
        Vec3 p0=forwardKinematics(q).pos();
        double v_ana=tcpSpeed(q,qd,p0);
        double h=1e-7; JVec q2; for(int i=0;i<NJ;++i) q2[i]=q[i]+qd[i]*h;
        double v_num=norm(forwardKinematics(q2).pos()-p0)/h;
        worst=std::max(worst,std::fabs(v_ana-v_num));
    }
    CHECK(worst<1e-5, "tcpSpeed matches finite-diff FK");
    std::printf("[4] tcp speed vs finite-diff: max err %.2e m/s ok\n", worst);

    // [5] external force estimation round-trip ----------------------------------
    double fworst=0;
    for(int t=0;t<50;++t){
        JVec q; for(int i=0;i<NJ;++i) q[i]=U(rng);
        Vec3 p=forwardKinematics(q).pos();
        Vec3 F{Uv(rng)*80, Uv(rng)*80, Uv(rng)*80};
        auto J=jacobianAt(q,p);
        JVec tau; for(int i=0;i<NJ;++i) tau[i]=J[0][i]*F.x+J[1][i]*F.y+J[2][i]*F.z;  // tau = J_v^T F
        Vec3 Fe=estimateTcpForce(q,tau,p);
        fworst=std::max(fworst,norm(Fe-F));
    }
    CHECK(fworst<0.1, "force estimate recovers applied TCP force (<0.1 N on 80 N)");
    std::printf("[5] TCP force estimation: max err %.2e N ok\n", fworst);

    // [6] measured-state trip logic ----------------------------------------------
    SafetyConfig m; m.tcp_speed_max=0.5; m.tcp_speed_reduced=0.25; m.tcp_force_max=50; m.elbow_speed_max=10;
    JVec z{};
    JVec qh{0,0.6,-1.2,0,0.9,0};
    Vec3 tp=forwardKinematics(qh).pos();
    // (a) overspeed: give J1 a spin that produces > 0.5*1.15 m/s at the TCP
    JVec fast{}; fast[0]=2.5;
    SafetyMeasured r1=checkMeasured(m,qh,fast,tp,z,false);
    CHECK(r1.tcp_speed>0.575 && r1.code==SAFE_TCP_SPEED, "TCP overspeed trips");
    // (b) at rest, no trip
    SafetyMeasured r2=checkMeasured(m,qh,z,tp,z,false);
    CHECK(r2.code==SAFE_OK, "at rest no trip");
    // (c) force trip only when the residual stream is valid
    JVec tauF; { auto J=jacobianAt(qh,tp); for(int i=0;i<NJ;++i) tauF[i]=J[2][i]*80.0; }  // 80 N down
    CHECK(checkMeasured(m,qh,z,tp,tauF,false).code==SAFE_OK, "force ignored when detector off");
    CHECK(checkMeasured(m,qh,z,tp,tauF,true ).code==SAFE_TCP_FORCE, "80 N trips 50 N limit when valid");
    // (d) plane penetration hysteresis: 3 mm in = planner's job, no control trip; 10 mm = trip
    SafetyConfig pl; pl.nplanes=1; pl.planes[0].mode=PLANE_FORBIDDEN;
    pl.planes[0].p[2]=0.20; pl.planes[0].n[2]=1;
    CHECK(checkMeasured(pl,qh,z,{0.4,0,0.197},z,false).code==SAFE_OK,   "3 mm penetration -> no control trip (hysteresis)");
    CHECK(checkMeasured(pl,qh,z,{0.4,0,0.190},z,false).code==SAFE_PLANE,"10 mm penetration -> control trips");
    std::printf("[6] measured-state trip logic ok\n");

    if(fails){ std::printf("\nSAFETY: %d FAILURES\n", fails); return 1; }
    std::printf("\nSAFETY MONITOR OK (planes, zones, bounds, speed, force, trips)\n");
    return 0;
}
