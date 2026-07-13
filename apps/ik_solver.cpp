// ik_solver.cpp -- consumes UI goals, produces joint targets for the planner.
// MOVE_JOINT: passthrough (+limit check). MOVE_PTP: IK once -> target_q.
// MOVE_LIN: validate reachability, hand the pose to the planner (per-step IK).
#include <algorithm>
#include <chrono>
#include <cstdio>
#include <csignal>
#include <string>
#include <thread>
#include "erm/ik.hpp"
#include "erm/tcp.hpp"
#include "erm/trajectory.hpp"
#include "erm/dynamics.hpp"
#include "erm/safety.hpp"
#include "erm/shm.hpp"
using namespace erm;

// Copy the shared-memory safety region into a SafetyConfig (zone validation of targets).
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

static constexpr double GRAV_GATE = 0.98;   // refuse a target if gravity-hold torque exceeds this fraction of effort
static volatile std::sig_atomic_t g_run = 1;
static void onSig(int) { g_run = 0; }
static Mat4 poseFromPosQuat(const double* p) {
    Quat q{p[3],p[4],p[5],p[6]}; return Mat4::fromRotTrans(q.toMat3(), {p[0],p[1],p[2]});
}

// Straight-line (LIN) feasibility: sample the Cartesian path P0->P1 and warm-start IK along it.
// Returns false if IK fails mid-line or a branch flip / singularity crossing occurs (a jump
// between densely-spaced points), so an infeasible straight move is rejected UP FRONT (UR/ABB
// behavior) instead of starting and aborting mid-air. Endpoint reachability is checked separately.
static bool linPathFeasible(const Mat4& P0, const Mat4& P1, const JVec& seed){
    CartesianTrajectory probe; probe.plan(P0, P1, seed);
    double T=probe.duration(); if(T<1e-9) return true;
    double L=norm(P1.pos()-P0.pos());
    int N=std::max(48, (int)(L/0.01));          // ~1 cm spacing, min 48 samples
    JVec prev=seed;
    for(int k=0;k<=N;k++){ double t=T*(double)k/N; JVec q;
        if(!probe.sampleJoints(t,q)) return false;
        double jump=0; for(int i=0;i<NJ;i++) jump=std::max(jump,std::fabs(q[i]-prev[i]));
        if(jump>0.30) return false;             // branch flip / near-singularity
        prev=q;
    }
    return true;
}
static bool withinLimits(const double* q) {
    const double* lo=jointLower(); const double* hi=jointUpper();
    for (int i=0;i<SJ;++i) if (q[i]<lo[i]-1e-9||q[i]>hi[i]+1e-9) return false;
    return true;
}

int main(int argc, char** argv) {
    std::string path = DEFAULT_SHM_PATH;
    for (int i=1;i<argc;++i){ std::string a=argv[i]; if (a=="--shm"&&i+1<argc) path=argv[++i]; }
    std::signal(SIGINT,onSig); std::signal(SIGTERM,onSig);
    bool created=false; ShmBlock* blk=nullptr;
    try { blk=shmMap(path,created); } catch(const std::exception&e){ std::fprintf(stderr,"[ik] %s\n",e.what()); return 1; }
    while (g_run && blk->magic!=SHM_MAGIC) std::this_thread::sleep_for(std::chrono::milliseconds(20));
    std::printf("[ik] attached, ready\n");

    uint32_t last_cmd=blk->cmd.cmd_seq;
    while (g_run) {
        CmdRegion c{}; seqRead(blk->cmd.cmd_seq,[&]{ c=blk->cmd; });
        if (c.cmd_seq!=last_cmd) {
            last_cmd=c.cmd_seq;
            SafetyConfig scfg; { SafetyRegion sfr{}; seqRead(blk->safety.safety_seq,[&]{ sfr=blk->safety; }); scfg=cfgFromShm(sfr); }
            // A motion target whose TCP lands in a FORBIDDEN zone is rejected up front
            // (UR behaviour: "target outside the safety plane"), flagged with pos_err=-2.
            auto zoneBlocked=[&](const Vec3& p){ return checkPosition(scfg,p).zone==ZONE_FORBIDDEN; };
            bool emit=false; IkRegion out{}; out.src_cmd_seq=c.cmd_seq;
            out.speed = c.speed>0 ? c.speed : 1.0;
            double payload = c.payload>0.0 ? c.payload : 0.0;
            setToolFromPosQuat(c.tcp);                                   // active TCP (flange if unset)
            Vec3a cog{c.payload_cog[0], c.payload_cog[1], c.payload_cog[2]};  // tool CoG in flange frame
            if (c.type==CMD_MOVE_JOINT) {
                for (int i=0;i<SJ;++i) out.target_q[i]=c.target_q[i];
                JVec tq; for(int i=0;i<SJ;++i) tq[i]=c.target_q[i];
                double gu=torqueUtilization(gravityTorque(tq,payload,cog)); out.grav_util=gu;
                out.move_type=MV_JOINT; out.ok=(withinLimits(c.target_q)&&gu<=GRAV_GATE)?1:0; emit=true;
                if (out.ok && zoneBlocked(tcpFK(tq).pos())){ out.ok=0; out.pos_err=-2.0; }
            } else if (c.type==CMD_MOVE_P) {
                PathRegion pr{}; seqRead(blk->path.path_seq,[&]{ pr=blk->path; });
                JVec seed; { StateRegion s{}; seqRead(blk->st.state_seq,[&]{s=blk->st;}); for(int i=0;i<SJ;++i) seed[i]=s.q[i]; }
                bool ok=(pr.npts>=2); double maxerr=0, maxgu=0;
                bool blocked=false;
                for (uint32_t k=0;k<pr.npts && k<(uint32_t)MAX_WP;++k){ const double* d=&pr.pts[k*7];
                    Quat q{d[3],d[4],d[5],d[6]}; Mat4 T=Mat4::fromRotTrans(q.toMat3(), Vec3{d[0],d[1],d[2]});
                    if (zoneBlocked(Vec3{d[0],d[1],d[2]})) blocked=true;
                    IkResult r=solveIKtcp(T, seed); if(!r.ok) ok=false; else { seed=r.q; maxgu=std::max(maxgu,torqueUtilization(gravityTorque(seed,payload,cog))); } maxerr=std::max(maxerr,r.pos_err); }
                if (blocked){ ok=false; maxerr=-2.0; }
                out.move_type=MV_P; out.grav_util=maxgu; out.ok=(ok&&maxgu<=GRAV_GATE)?1:0; out.pos_err=maxerr; emit=true;
            } else if (c.type==CMD_MOVE_C) {
                PathRegion pr{}; seqRead(blk->path.path_seq,[&]{ pr=blk->path; });
                JVec seed; { StateRegion s{}; seqRead(blk->st.state_seq,[&]{s=blk->st;}); for(int i=0;i<SJ;++i) seed[i]=s.q[i]; }
                bool ok=(pr.npts>=2); double maxerr=0, maxgu=0;
                bool blocked=false;
                for (uint32_t k=0;k<2 && k<pr.npts;++k){ const double* d=&pr.pts[k*7];
                    Quat q{d[3],d[4],d[5],d[6]}; Mat4 T=Mat4::fromRotTrans(q.toMat3(), Vec3{d[0],d[1],d[2]});
                    if (zoneBlocked(Vec3{d[0],d[1],d[2]})) blocked=true;
                    IkResult r=solveIKtcp(T, seed); if(!r.ok) ok=false; else { seed=r.q; maxgu=std::max(maxgu,torqueUtilization(gravityTorque(seed,payload,cog))); } maxerr=std::max(maxerr,r.pos_err); }
                if (blocked){ ok=false; maxerr=-2.0; }
                out.move_type=MV_C; out.grav_util=maxgu; out.ok=(ok&&maxgu<=GRAV_GATE)?1:0; out.pos_err=maxerr; emit=true;
            } else if (c.type==CMD_MOVE_PTP || c.type==CMD_MOVE_LIN) {
                JVec seed; { StateRegion s{}; seqRead(blk->st.state_seq,[&]{s=blk->st;}); for(int i=0;i<SJ;++i) seed[i]=s.q[i]; }
                Mat4 T=poseFromPosQuat(c.target_pose);
                IkResult r=solveIKtcp(T, seed);
                double gu = r.ok ? torqueUtilization(gravityTorque(r.q,payload,cog)) : 1e9;
                if (c.type==CMD_MOVE_PTP && (!r.ok || gu>GRAV_GATE)) {
                    // warm-start branch infeasible/heavy -> PTP needs no continuity, so try comfortable
                    // seeds and keep the lightest torque-feasible config (UR/ABB pick a posture too).
                    JVec alts[2] = { JVec{0,0.6,-1.2,0,0.9,0}, JVec{0,0,0,0,0,0} };
                    for (auto& a : alts){ IkResult r2=solveIKtcp(T,a); if(!r2.ok) continue;
                        double g2=torqueUtilization(gravityTorque(r2.q,payload,cog));
                        if(!r.ok || g2<gu){ r=r2; gu=g2; } if(g2<=GRAV_GATE) break; }
                }
                out.ok = r.ok?1:0; out.pos_err=r.pos_err; out.grav_util = r.ok?gu:0;
                if (r.ok && gu>GRAV_GATE) out.ok=0;
                if (out.ok && zoneBlocked(Vec3{c.target_pose[0],c.target_pose[1],c.target_pose[2]})){ out.ok=0; out.pos_err=-2.0; }
                if (c.type==CMD_MOVE_PTP){ out.move_type=MV_JOINT; for(int i=0;i<SJ;++i) out.target_q[i]=r.q[i]; }
                else { out.move_type=MV_LIN; for(int i=0;i<7;++i) out.target_pose[i]=c.target_pose[i];
                    if (out.ok && r.ok && !linPathFeasible(tcpFK(seed), T, seed)) { out.ok=0; out.pos_err=-1.0; } // straight line crosses a singularity
                }
                emit=true;
            }
            if (emit) {
                seqWrite(blk->ik.ik_seq, [&]{
                    IkRegion& d=blk->ik; d.ok=out.ok; d.move_type=out.move_type; d.src_cmd_seq=out.src_cmd_seq;
                    d.speed=out.speed; d.pos_err=out.pos_err; d.grav_util=out.grav_util; d.accel=(c.accel>0.0?c.accel:1.0);
                    for (int i=0;i<SJ;++i) d.target_q[i]=out.target_q[i];
                    for (int i=0;i<7;++i) d.target_pose[i]=out.target_pose[i];
                });
                std::printf("[ik] cmd#%u type=%u -> %s (err %.2e m, torque %.0f%% of limit)\n", c.cmd_seq, c.type, out.ok?"OK":(out.grav_util>GRAV_GATE?"TORQUE-INFEASIBLE":"UNREACHABLE"), out.pos_err, out.grav_util*100);
            }
            blk->cmd.ack_seq = c.cmd_seq;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(2));
    }
    std::printf("\n[ik] shutdown\n"); shmUnmap(blk); return 0;
}
