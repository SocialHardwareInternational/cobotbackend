// motion_planner.cpp -- 1 kHz jerk-limited trajectory generation.
// Reads solved goals from the IK region, plans synchronized PTP / straight-line
// LIN trajectories, and streams C2-continuous joint setpoints to shared memory.
#include <algorithm>
#include <chrono>
#include <cstdio>
#include <csignal>
#include <string>
#include <thread>
#include "erm/shm.hpp"
#include "erm/trajectory.hpp"
#include "erm/tcp.hpp"
#include "erm/dynamics.hpp"
#include "erm/safety.hpp"
using namespace erm;

// Copy the shared-memory safety region into a SafetyConfig.
static SafetyConfig cfgFromShm(const SafetyRegion& r){
    SafetyConfig c; c.enabled=r.enabled; c.speed_override=r.speed_override;
    c.tcp_speed_max=r.tcp_speed_max; c.tcp_speed_reduced=r.tcp_speed_reduced;
    c.tcp_force_max=r.tcp_force_max; c.elbow_speed_max=r.elbow_speed_max;
    c.reach_max=r.reach_max; c.z_min=r.z_min; c.z_max=r.z_max; c.base_cyl_r=r.base_cyl_r;
    c.nplanes=r.nplanes>MAX_SAFETY_PLANES?MAX_SAFETY_PLANES:r.nplanes;
    for(uint32_t i=0;i<c.nplanes;++i){ c.planes[i].mode=r.planes[i].mode;
        for(int k=0;k<3;++k){ c.planes[i].p[k]=r.planes[i].p[k]; c.planes[i].n[k]=r.planes[i].n[k]; } }
    return c;
}

static volatile std::sig_atomic_t g_run = 1;
static void onSig(int) { g_run = 0; }
static Mat4 poseFromPosQuat(const double* p) {
    Quat q{p[3],p[4],p[5],p[6]}; return Mat4::fromRotTrans(q.toMat3(), {p[0],p[1],p[2]});
}
static CartLimits accLim(double a){ CartLimits L; double s=a<0.05?0.05:(a>1.0?1.0:a); L.a*=s; L.aw*=s; L.j*=s; L.jw*=s; return L; }

int main(int argc, char** argv) {
    std::string path = DEFAULT_SHM_PATH; double rate = 1000.0;
    for (int i=1;i<argc;++i){ std::string a=argv[i];
        if (a=="--shm"&&i+1<argc) path=argv[++i];
        else if (a=="--rate"&&i+1<argc) rate=std::stod(argv[++i]); }
    std::signal(SIGINT,onSig); std::signal(SIGTERM,onSig);
    bool created=false; ShmBlock* blk=nullptr;
    try { blk=shmMap(path,created); } catch(const std::exception&e){ std::fprintf(stderr,"[planner] %s\n",e.what()); return 1; }
    while (g_run && blk->magic!=SHM_MAGIC) std::this_thread::sleep_for(std::chrono::milliseconds(20));
    std::printf("[planner] attached, control block ready\n");

    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    JVec qcmd{}; { StateRegion s{};
        for (int k=0;k<200;++k){ seqRead(blk->st.state_seq,[&]{s=blk->st;}); if (blk->st.state_seq>=2) break; std::this_thread::sleep_for(std::chrono::milliseconds(2)); }
        for (int i=0;i<SJ;++i) qcmd[i]=s.q[i]; }

    JointTrajectory jtr; CartesianTrajectory ctr; BlendedPath bp; CircularTrajectory cir;
    bool active=false; int isLin=0; double tclk=0, dur=0, base_speed=1.0;
    bool stopping=false; double tstop=0; const double Tstop=0.4; int lin_fail=0;
    uint32_t last_ik=blk->ik.ik_seq, last_cmd=blk->cmd.cmd_seq, traj_id=0;
    bool jogging=false; JVec jvel{}, jacc{}; std::array<double,6> jvec{}; int jframe=0;
    double jog_t=0, jog_deadline=0;
    double ovr_cur=1.0;              // slew-limited global speed override (bump-free changes)
    double safe_scale=1.0;           // zone-based scale (reduced zones / boundary approach)
    double pause_scale=1.0; bool paused=false;   // feed-hold: velocity scale ramps 1->0 to hold ON the path, 0->1 to resume

    const double dt=1.0/rate; auto clk=std::chrono::steady_clock::now();
    while (g_run) {
        { CmdRegion ct{}; seqRead(blk->cmd.cmd_seq,[&]{ ct=blk->cmd; }); setToolFromPosQuat(ct.tcp); }  // active TCP
        IkRegion ik{}; seqRead(blk->ik.ik_seq,[&]{ ik=blk->ik; });
        if (ik.ik_seq!=last_ik) {
            last_ik=ik.ik_seq;
            if (ik.ok) {
                base_speed = std::min(1.0, std::max(0.05, ik.speed<=0?1.0:ik.speed));
                stopping=false; tclk=0; ++traj_id; jogging=false; lin_fail=0;
                if (ik.move_type==MV_JOINT) {
                    JVec tq; for(int i=0;i<SJ;++i) tq[i]=ik.target_q[i];
                    jtr.plan(qcmd, tq, ik.accel>0?ik.accel:1.0); dur=jtr.duration(); isLin=0; active=(dur>1e-9);
                    // torque-feasible time scaling: shrink speed until peak inverse-dynamics
                    // torque (gravity + inertia at this payload) stays within actuator effort.
                    { double payload=0; Vec3a cog{0,0,0}; { CmdRegion cc{}; seqRead(blk->cmd.cmd_seq,[&]{cc=blk->cmd;}); payload=cc.payload>0?cc.payload:0; cog={cc.payload_cog[0],cc.payload_cog[1],cc.payload_cog[2]}; }
                      auto peakUtil=[&](double sc){ double u=0; int MM=std::max(1,(int)(dur/0.05));
                        for(int k=0;k<=MM;++k){ double tt2=dur*(double)k/MM; JVec q,qd,qdd; jtr.sample(tt2,q,qd,qdd);
                          JVec a,b; for(int i=0;i<SJ;++i){a[i]=qd[i]*sc; b[i]=qdd[i]*sc*sc;}
                          u=std::max(u, torqueUtilization(inverseDynamics(q,a,b,payload,cog))); } return u; };
                      double sc=1.0; for(int it=0; it<10 && peakUtil(sc)>0.90; ++it) sc*=0.85;  // 10% torque headroom to brake -> no overshoot
                      base_speed=std::max(0.05, std::min(base_speed, sc)); }
                } else if (ik.move_type==MV_LIN) {
                    Mat4 P0=tcpFK(qcmd), P1=poseFromPosQuat(ik.target_pose);
                    ctr.plan(P0,P1,qcmd, accLim(ik.accel)); dur=ctr.duration(); isLin=1; active=(dur>1e-9);
                } else if (ik.move_type==MV_P) {
                    PathRegion pr{}; seqRead(blk->path.path_seq,[&]{ pr=blk->path; });
                    std::vector<BlendedPath::Pose> wp;
                    for (uint32_t k=0;k<pr.npts && k<(uint32_t)MAX_WP;++k){ const double* d=&pr.pts[k*7];
                        wp.push_back({Vec3{d[0],d[1],d[2]}, Quat{d[3],d[4],d[5],d[6]}}); }
                    double jr = std::max(1.0, pr.tool_acc)*10.0;
                    if (bp.plan(wp, pr.blend, pr.tool_speed, pr.tool_acc, jr, qcmd)){
                        dur=bp.duration(); isLin=2; active=(dur>1e-9); base_speed=1.0; }
                } else if (ik.move_type==MV_C) {
                    PathRegion pr{}; seqRead(blk->path.path_seq,[&]{ pr=blk->path; });
                    Mat4 via=poseFromPosQuat(&pr.pts[0]), end=poseFromPosQuat(&pr.pts[7]);
                    cir.plan(tcpFK(qcmd), via, end, qcmd, accLim(ik.accel), pr.blend>0.5); dur=cir.duration(); isLin=3; active=(dur>1e-9);
                }
            }
        }
        // ---- global speed override + safety zones (applied to ALL motion, live) ----
        { SafetyRegion sfr{}; seqRead(blk->safety.safety_seq,[&]{ sfr=blk->safety; });
          SafetyConfig sc=cfgFromShm(sfr);
          double tgt=sfr.speed_override; if(!(tgt>0)) tgt=1.0; tgt=tgt<0.05?0.05:(tgt>1.0?1.0:tgt);
          double slew=3.0*dt;                                            // full-range change in ~0.33 s
          ovr_cur += (tgt>ovr_cur)?std::min(slew,tgt-ovr_cur):std::max(-slew,tgt-ovr_cur);
          double zs=plannerSpeedScale(sc, tcpFK(qcmd).pos());
          // smooth the zone scale too so entering a reduced zone never steps the velocity
          safe_scale += (zs>safe_scale)?std::min(slew,zs-safe_scale):std::max(-slew,zs-safe_scale);
          if(zs<=0.0 && active && !stopping){ stopping=true; tstop=0; }  // decelerate INTO a forbidden boundary
        }
        { double pslew=3.0*dt, ptgt=paused?0.0:1.0;            // feed-hold ramp (bump-free, ~0.33 s full range)
          pause_scale += (ptgt>pause_scale)?std::min(pslew,ptgt-pause_scale):std::max(-pslew,ptgt-pause_scale); }
        double live_scale = ovr_cur*safe_scale*pause_scale;   // scale->0 freezes trajectory time (tclk) => hold ON path
        CmdRegion c{}; seqRead(blk->cmd.cmd_seq,[&]{ c=blk->cmd; });
        if (c.cmd_seq!=last_cmd) { last_cmd=c.cmd_seq;
            if (c.type==CMD_STOP){ if(active){stopping=true;tstop=0;} jogging=false; jvel.fill(0); jacc.fill(0); }
            else if (c.type==CMD_HOLD){ active=false; }
            else if (c.type==CMD_PAUSE){ paused=true; }        // feed-hold: decelerate & hold on the path (resumable)
            else if (c.type==CMD_RESUME){ paused=false; }      // release the feed-hold: ramp back along the same trajectory
            else if (c.type==CMD_JOG){ if(!jogging){ jvel.fill(0); jacc.fill(0); } jogging=true; active=false; jframe=(int)c.frame;
                for(int i=0;i<6;++i) jvec[i]=c.target_q[i];
                base_speed=std::min(1.0,std::max(0.05, c.speed<=0?1.0:c.speed));
                jog_deadline=jog_t+0.25; }
        }

        // safety: if the controller dropped enable (e.g. collision auto-disable), cancel any
        // active motion so re-enabling never replays a stale trajectory (no surprise jump).
        { StateRegion s2{}; bool okr=seqRead(blk->st.state_seq,[&]{ s2=blk->st; });
          if(okr && !s2.enabled){ active=false; jogging=false; stopping=false; } }   // confirmed read only

        JVec qd_cmd{}; uint32_t moving=0; double prog=1.0;
        jog_t += dt;
        if (jogging) {
            std::array<double,6> vt{}; bool expired=(jog_t>jog_deadline);
            if (!expired) {
                if (jframe==0) { for(int i=0;i<6;++i) vt[i]=jvec[i]*base_speed*live_scale; }
                else {
                    Mat4 T=tcpFK(qcmd);
                    Vec3 lin{jvec[0],jvec[1],jvec[2]}, ang{jvec[3],jvec[4],jvec[5]};
                    if (jframe==2){ Mat3 R=T.rot(); lin=R*lin; ang=R*ang; }
                    double js=base_speed*live_scale;
                    std::array<double,6> tw{lin.x*js,lin.y*js,lin.z*js,
                                            ang.x*js,ang.y*js,ang.z*js};
                    auto J=jacobianAt(qcmd, T.pos());
                    JVec dq=dampedLeastSquares(J, tw, 0.06);
                    for(int i=0;i<6;++i) vt[i]=dq[i];
                }
            }
            const double *V=jointVelMax(), *A=jointAccMax(), *Jm=jointJerkMax();
            const double *lo=jointLower(), *hi=jointUpper(); double vmag=0;
            for (int i=0;i<6;++i){
                double a_des=std::min(std::max((vt[i]-jvel[i])/dt,-A[i]),A[i]);
                double jk=std::min(std::max((a_des-jacc[i])/dt,-Jm[i]),Jm[i]);
                jacc[i]+=jk*dt; jvel[i]+=jacc[i]*dt;
                jvel[i]=std::min(std::max(jvel[i],-V[i]),V[i]);
                qcmd[i]+=jvel[i]*dt;
                if(qcmd[i]<=lo[i]){qcmd[i]=lo[i];jvel[i]=0;jacc[i]=0;}
                if(qcmd[i]>=hi[i]){qcmd[i]=hi[i];jvel[i]=0;jacc[i]=0;}
                qd_cmd[i]=jvel[i]; vmag=std::max(vmag,std::abs(jvel[i]));
            }
            moving=1; prog=0;
            if (expired && vmag<2e-3){ jogging=false; jvel.fill(0); jacc.fill(0); }
        } else if (active) {
            double adv=dt*base_speed*live_scale;
            if (stopping){ tstop+=dt; double e=0.5*(1.0+std::cos(PI*std::min(1.0,tstop/Tstop))); adv*=e; }
            if (isLin==0){
                tclk+=adv; double tt=std::min(tclk,dur);
                JVec q,qd,qdd; jtr.sample(tt,q,qd,qdd); qcmd=q; qd_cmd=qd;
            } else {
                // Cartesian (LIN / MoveP): cap per-cycle joint velocity at jointVelMax so the
                // path SLOWS through near-singular regions instead of demanding impossible joint
                // speed (which the drive would clamp -> distorted, inaccurate motion). One IK per
                // cycle; take a partial step toward the path target and advance path-time to match.
                const double* Vm=jointVelMax();
                double tt=std::min(tclk+adv,dur);
                JVec qs; bool ok = (isLin==1)? ctr.sampleJoints(tt,qs) : (isLin==3)? cir.sampleJoints(tt,qs) : bp.sampleJoints(tt,qs);
                if (ok){
                    double jump=0; for(int i=0;i<SJ;++i) jump=std::max(jump,std::fabs(qs[i]-qcmd[i]));
                    if (jump > 0.5){ active=false; }   // IK branch flip: straight line infeasible here -> stop cleanly (no wild reconfigure)
                    else {
                        double vr=0; for(int i=0;i<SJ;++i) vr=std::max(vr,std::fabs(qs[i]-qcmd[i])/dt/Vm[i]);
                        double f = (vr>1.0)? 1.0/vr : 1.0;
                        for(int i=0;i<SJ;++i){ double nv=qcmd[i]+f*(qs[i]-qcmd[i]); qd_cmd[i]=(nv-qcmd[i])/dt; qcmd[i]=nv; }
                        tclk += adv*f; lin_fail=0;
                        if (isLin!=2){ Vec3 tgt=(isLin==1)?ctr.pose(tt).pos():cir.pose(tt).pos();
                            if (norm(tcpFK(qcmd).pos()-tgt) > 0.05) active=false; }   // lost path tracking -> stop, never drift
                    }
                } else if (++lin_fail > 5){ active=false; }   // IK can't follow the line here -> stop, don't hang
            }
            double tt=std::min(tclk,dur);
            prog = dur>1e-9 ? tt/dur : 1.0;
            if ((tclk>=dur) || (stopping && tstop>=Tstop)) active=false;
            moving = active?1:0;
        } else {
            // idle/hold: while the drives are DISABLED, track the measured position so
            // that enabling never produces a following-error jump (bump-free engage).
            // CONFIRMED reads only: a torn/failed seqlock read must never move the setpoint.
            StateRegion s{}; bool oks=seqRead(blk->st.state_seq,[&]{ s=blk->st; });
            if (oks && (!s.enabled || s.mode==MODE_FREEDRIVE)) for (int i=0;i<SJ;++i) qcmd[i]=s.q[i];
        }
        seqWrite(blk->sp.sp_seq, [&]{
            SpRegion& s=blk->sp; s.valid=1; s.moving=moving; s.traj_id=traj_id; s.progress=prog;
            s.speed_scale=live_scale;
            for (int i=0;i<SJ;++i){ s.q_cmd[i]=qcmd[i]; s.qd_cmd[i]=qd_cmd[i]; }
        });
        clk += std::chrono::duration_cast<std::chrono::steady_clock::duration>(std::chrono::duration<double>(dt));
        std::this_thread::sleep_until(clk);
    }
    std::printf("\n[planner] shutdown\n"); shmUnmap(blk); return 0;
}
