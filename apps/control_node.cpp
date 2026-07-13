// control_node.cpp -- 1 kHz SIMULATION control loop (owns the shared-memory block).
//
// This is the simulation control node: it drives the SimDrives model so you can develop and
// test the whole stack (UI -> bridge -> ik -> planner -> control) with no robot. On the real
// robot use apps/ecat_control_node.cpp instead (the ZeroErr EtherCAT driver, ported from
// main.cpp) -- it speaks the same shared-memory contract, so nothing else changes.
//
//   ./control_node --shm /dev/shm/erobo10_shm
#include <chrono>
#include <cstdio>
#include <cstring>
#include <csignal>
#include <string>
#include <thread>
#include <cmath>
#include "erm/hal.hpp"
#include "erm/kinematics.hpp"
#include "erm/tcp.hpp"
#include "erm/dynamics.hpp"
#include "erm/contact.hpp"
#include <cstdlib>
#include "erm/collision.hpp"
#include "erm/safety.hpp"
#include "erm/shm.hpp"
using namespace erm;

// Default safety configuration published at startup (controller overwrites from its
// persisted settings). Conservative collaborative-mode defaults.
static void initSafetyRegion(SafetyRegion& r){
    r.enabled=1; r.speed_override=1.0;
    r.tcp_speed_max=1.5; r.tcp_speed_reduced=0.25; r.tcp_force_max=150.0; r.elbow_speed_max=2.0;
    r.reach_max=0.0; r.z_min=-1e9; r.z_max=1e9; r.base_cyl_r=0.0; r.nplanes=0;
    r.safety_seq=2;   // even = valid snapshot
}
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
static const double COLL_WARN_M=0.005, COLL_CRIT_M=0.0, SING_MANIP=0.02;

static volatile std::sig_atomic_t g_run = 1;
static void onSig(int) { g_run = 0; }

int main(int argc, char** argv) {
    std::string path = DEFAULT_SHM_PATH; double rate = 1000.0;
    for (int i=1;i<argc;++i){ std::string a=argv[i];
        if (a=="--shm"&&i+1<argc) path=argv[++i];
        else if (a=="--rate"&&i+1<argc) rate=std::stod(argv[++i]); }
    std::signal(SIGINT,onSig); std::signal(SIGTERM,onSig);

    SimDrives hal(homePose());
    std::printf("[control] HAL = simulation\n");

    bool created=false; ShmBlock* blk=nullptr;
    try { blk=shmMap(path,created); } catch(const std::exception&e){ std::fprintf(stderr,"[control] %s\n",e.what()); return 1; }

    std::memset(blk,0,sizeof(ShmBlock));
    blk->version=SHM_VERSION;
    JArr h=homePose();
    blk->sp.valid=1; blk->sp.moving=0; blk->sp.traj_id=0;
    for (int i=0;i<SJ;++i){ blk->sp.q_cmd[i]=h[i]; blk->sp.qd_cmd[i]=0; }
    blk->cmd.contact_on=0u; blk->cmd.contact_sens=0.5; blk->cmd.contact_test=0u;   // contact detection OFF until explicitly enabled (safe default)
    initSafetyRegion(blk->safety);
    blk->magic=SHM_MAGIC;

    const double dt=1.0/rate; double t=0; auto clk=std::chrono::steady_clock::now();
    std::printf("[control] erobo10 control loop up @ %.0f Hz, shm=%s\n", rate, path.c_str());

    bool want_enable=true, freedrive=false, coll_stop=false, coll_on=true;   // sim is auto-enabled
    bool safety_stop=false; uint32_t safety_code_l=0;                         // latched safety-monitor stop
    double jit_max_us=0; uint32_t overruns=0; int jit_n=0; double jit_pub=0;  // loop-timing health
    ContactDetector contact_det; bool contact_stop=false; int poke_cnt=0, poke_joint=-1, contact_joint_pub=0;
    const char* _stz=std::getenv("EROBO_SIM_TABLE_Z"); bool sim_table=(_stz!=nullptr); double sim_table_z=sim_table?std::atof(_stz):0.0;  // sim: virtual table height (m); marker pressing below it injects contact
    uint32_t last_cmd=blk->cmd.cmd_seq;
    uint32_t estop_ctr=blk->cmd.estop_req, reset_ctr=blk->cmd.reset_req;   // edge counters
    JArr qcmd=h, qda_prev{};
    while (g_run) {
        CmdRegion c{}; if(!seqRead(blk->cmd.cmd_seq, [&]{ c=blk->cmd; })) c.cmd_seq=last_cmd;  // failed read: keep last (no phantom edges)
        if (c.estop_req!=estop_ctr){ estop_ctr=c.estop_req; hal.estop(); }
        if (c.reset_req!=reset_ctr){ reset_ctr=c.reset_req; hal.resetEstop(); }
        if (c.cmd_seq!=last_cmd) {
            last_cmd=c.cmd_seq;
            if (c.type==CMD_ENABLE)  { want_enable=true; coll_stop=false; contact_stop=false; safety_stop=false; safety_code_l=0; contact_det.reset(); }
            else if (c.type==CMD_DISABLE) { want_enable=false; freedrive=false; }
            else if (c.type==CMD_FREEDRIVE_ON)  { freedrive=true; want_enable=true; coll_stop=false; contact_stop=false; }
            else if (c.type==CMD_FREEDRIVE_OFF) freedrive=false;
            else if (c.type==CMD_ECAT_RESET) { hal.resetEstop(); coll_stop=false; std::printf("[control] EtherCAT re-init (sim: cleared faults/estop)\n"); }
            else if (c.type==CMD_SET_COLLISION){ coll_on=(c.frame!=0); if(!coll_on) coll_stop=false; std::printf("[control] collision monitor %s\n", coll_on?"ENABLED":"DISABLED"); }
            else if (c.type==CMD_SET_CONTACT){ if(c.contact_test!=0){ poke_cnt=300; poke_joint=(int)c.contact_test-1; std::printf("[control] sim contact poke on J%d\n", (int)c.contact_test); } }
        }
        if (want_enable) hal.enable(); else hal.disable();
        hal.setFreedrive(freedrive && want_enable);

        SpRegion sp{}; bool got=seqRead(blk->sp.sp_seq, [&]{ sp=blk->sp; });
        bool en = hal.isEnabled();
        bool fd = freedrive && en;
        if (en && !fd) { if (got && sp.valid) {
            // setpoint sanity clamp: never step more than 2x rated speed in one cycle,
            // whatever the upstream fault (torn read, planner glitch, bad IPC data).
            const double* Vm=jointVelMax();
            for (int i=0;i<SJ;++i){ double lim=2.0*Vm[i]*dt, d=sp.q_cmd[i]-qcmd[i];
                if(d> lim) d= lim; if(d<-lim) d=-lim; qcmd[i]+=d; } } }
        else           { JArr m=hal.position(); for (int i=0;i<SJ;++i) qcmd[i]=m[i]; }

        JArr qa, qda; hal.cycle(qcmd, qa, qda, dt);
        JArr qdd_est; for (int i=0;i<SJ;++i) qdd_est[i]=(qda[i]-qda_prev[i])/dt; qda_prev=qda;
        double payload = c.payload>0.0 ? c.payload : 0.0;
        setToolFromPosQuat(c.tcp);                                        // active TCP (flange if unset)
        Vec3a cog{c.payload_cog[0], c.payload_cog[1], c.payload_cog[2]};  // tool CoG in flange frame
        auto tau = inverseDynamics(qa, qda, qdd_est, payload, cog);

        Mat4 T=forwardKinematics(qa); Vec3 p=T.pos(); Quat qq=Quat::fromMat3(T.rot());
        Mat4 Tt=tcpFromFlange(T); Vec3 pt=Tt.pos(); Quat qt=Quat::fromMat3(Tt.rot());  // tool tip pose
        double manip=manipulability(jacobianFlange(qa));
        // ---- safety monitor: self-collision proximity + singularity ----
        CollisionResult cc=selfCollision(qa);
        bool coll_warn=coll_on&&cc.dist<COLL_WARN_M, coll_crit=coll_on&&cc.dist<COLL_CRIT_M, singular=(manip<SING_MANIP)&&got&&sp.moving;
        if(coll_crit && en && !fd){ want_enable=false; coll_stop=true; }
        // ---- external-contact (physical collision) detection: residual = measured - (model + friction) ----
        JArr tau_fric=frictionTorque(qda), tau_meas;
        for(int i=0;i<SJ;++i) tau_meas[i]=tau[i]+tau_fric[i];                 // sim 'measured' = model + friction
        if(poke_cnt>0 && poke_joint>=0 && poke_joint<SJ){ tau_meas[poke_joint]+=35.0; poke_cnt--; }  // sim poke
        if(sim_table && pt.z < sim_table_z){ double pen=sim_table_z-pt.z; double fr=15000.0*pen; tau_meas[1]+=fr; tau_meas[2]+=fr; }  // sim: stiff table pushes back on shoulder+elbow when the tip presses in
        contact_det.sensitivity = c.contact_sens<0?0:(c.contact_sens>1?1:c.contact_sens);
        ContactResult cr{false,-1,{0},0.0};
        if(c.contact_on){ cr=contact_det.update(tau_meas,qa,qda,qdd_est,payload,cog); } else contact_det.reset();
        if(cr.contact && en && !fd){ want_enable=false; contact_stop=true; contact_joint_pub=cr.joint; }
        // ---- configurable safety monitor: measured-state last line of software defence ----
        SafetyRegion sfr{}; seqRead(blk->safety.safety_seq,[&]{ sfr=blk->safety; });
        SafetyConfig scfg=cfgFromShm(sfr);
        JVec extt; for(int i=0;i<SJ;++i) extt[i]=cr.resid[i];
        SafetyMeasured sm=checkMeasured(scfg,qa,qda,pt,extt,c.contact_on!=0);
        if(sm.code!=SAFE_OK && en && !fd){ want_enable=false; safety_stop=true; safety_code_l=sm.code;
            std::printf("[control] SAFETY STOP: %s\n", safetyCodeName(sm.code)); }
        // ---- I/O: apply commanded outputs; sim inputs come from the controller (di_sim) ----
        { IoRegion iov=blk->io;
          seqWrite(blk->io.io_seq,[&]{ IoRegion& o=blk->io;
              o.do_state=iov.do_cmd; o.di=iov.di_sim;
              o.ao_state[0]=iov.ao_cmd[0]; o.ao_state[1]=iov.ao_cmd[1];
              o.ai[0]=iov.ao_cmd[0]; o.ai[1]=iov.ao_cmd[1]; }); }   // sim: AI loops back AO (verifiable in tests)
        uint32_t mode = hal.isEstopped()?MODE_ESTOP
                      : fd?MODE_FREEDRIVE
                      : (!en?MODE_HOLD : ((got&&sp.moving)?MODE_MOVING:MODE_IDLE));

        seqWrite(blk->st.state_seq, [&]{
            StateRegion& s=blk->st;
            s.mode=mode; s.estop=hal.isEstopped()?1:0; s.enabled=en?1:0; s.t=t;
            for (int i=0;i<SJ;++i){ s.q[i]=qa[i]; s.qd[i]=qda[i]; s.torque[i]=tau[i]; }
            { const double* eff=jointEffortMax();                       // synthesize plausible drive telemetry
              for (int i=0;i<SJ;++i){
                double frac = eff[i]>1e-9 ? tau_meas[i]/eff[i] : 0.0;    // measured (model+friction+contact)
                if(frac> 1.5) frac= 1.5;
                else if(frac<-1.5) frac=-1.5;                            // clamp sim transients to a plausible range
                s.temp[i]        = 38.0 + 1.5*i + 6.0*std::fabs(qda[i]); // C, warms with motion
                s.current[i]     = 0.25 + 2.0*std::fabs(frac);          // A, ~ load
                s.voltage[i]     = 48.0;                                // V, nominal DC link
                s.torque_meas[i] = 100.0*frac;                          // % of rated (signed)
                s.brake[i]       = en ? 1u : 0u;                        // released when enabled
              } }
            s.flange_pos[0]=p.x; s.flange_pos[1]=p.y; s.flange_pos[2]=p.z;
            s.flange_quat[0]=qq.w; s.flange_quat[1]=qq.x; s.flange_quat[2]=qq.y; s.flange_quat[3]=qq.z;
            s.tcp_pos[0]=pt.x; s.tcp_pos[1]=pt.y; s.tcp_pos[2]=pt.z;
            s.tcp_quat[0]=qt.w; s.tcp_quat[1]=qt.x; s.tcp_quat[2]=qt.y; s.tcp_quat[3]=qt.z;
            s.manip=manip;
            s.coll_dist=cc.dist; s.coll_i=(uint32_t)(cc.i<0?0:cc.i); s.coll_j=(uint32_t)(cc.j<0?0:cc.j);
            s.coll_warn=coll_warn?1:0; s.coll_stop=coll_stop?1:0; s.singular=singular?1:0;
            for(int i=0;i<SJ;++i) s.ext_torque[i]=cr.resid[i];
            s.contact=contact_stop?1:0; s.contact_joint=(uint32_t)(contact_joint_pub<0?0:contact_joint_pub);
            s.tcp_speed=sm.tcp_speed; s.elbow_speed=sm.elbow_speed;
            s.ext_force[0]=sm.force.x; s.ext_force[1]=sm.force.y; s.ext_force[2]=sm.force.z;
            s.ext_force_mag=sm.force_mag;
            s.safety_zone=(uint32_t)sm.zone; s.safety_code=safety_code_l; s.safety_stop=safety_stop?1:0;
            s.speed_pct=(uint32_t)(0.5+100.0*(sp.valid?sp.speed_scale:1.0));
            s.loop_jitter_us=jit_pub; s.loop_overruns=overruns;
            setCStr(s.status,sizeof(s.status),
                    mode==MODE_ESTOP?"ESTOP":mode==MODE_FREEDRIVE?"FREEDRIVE":mode==MODE_HOLD?"DISABLED":mode==MODE_MOVING?"MOVING":"IDLE");
        });
        t+=dt;
        clk += std::chrono::duration_cast<std::chrono::steady_clock::duration>(std::chrono::duration<double>(dt));
        std::this_thread::sleep_until(clk);
        { double err_us=std::chrono::duration<double,std::micro>(std::chrono::steady_clock::now()-clk).count();
          if(err_us>jit_max_us) jit_max_us=err_us;
          if(err_us>1e6*dt) ++overruns;
          if(++jit_n>=1000){ jit_pub=jit_max_us; jit_max_us=0; jit_n=0; } }
    }
    std::printf("\n[control] shutdown\n");
    shmUnmap(blk); return 0;
}
