// apps/ecat_control_node.cpp -- EtherCAT control node for erobo10 (ZeroErr eRob).
//
// The EtherCAT layer follows ZeroErr's OFFICIAL IgH driver
// (github.com/ZeroErrControl/eRob_IGH_EtherCAT) -- the configuration ZeroErr verified on the IgH
// master that this project uses:
//   * PDO map  RxPDO 0x1600 = controlword(0x6040) target_position(0x607A) target_velocity(0x60FF)
//                            target_torque(0x6071);  TxPDO 0x1A00 = statusword(0x6041)
//                            position(0x6064) velocity(0x606C) torque(0x6077).
//              (No 0x60FE -- the eRob brake is automatic: released at OPERATION_ENABLED, engaged below.)
//   * Distributed Clocks: SYNC0 at the control period, assign-activate 0x0300 (eRob REQUIRES DC for CSV).
//   * Hard real-time loop: SCHED_FIFO(max) + mlockall + clock_nanosleep(TIMER_ABSTIME) so SYNC0 is stable.
//   * CiA-402 enable state machine (FAULT->reset->shutdown->switch-on->enable).
// Integrated with the ebot shared-memory interface + jerk-limited CSV speed control (velocity
// feed-forward + position correction) + freedrive (runtime switch to CST / zero torque).
//
// Build:  make HARDWARE=1 apps      Run: sudo ./bin/ecat_control_node --shm /dev/shm/erobo10_shm
#include <ecrt.h>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <vector>
#include <cmath>
#include <csignal>
#include <sched.h>
#include <sys/mman.h>
#include <time.h>
#include <string>
#include "erm/hal.hpp"
#include "erm/shm.hpp"
#include "erm/kinematics.hpp"
#include "erm/tcp.hpp"
#include "erm/dynamics.hpp"
#include "erm/contact.hpp"
#include "erm/collision.hpp"
#include "erm/safety.hpp"
using namespace erm;

// Default safety configuration published at startup (controller overwrites from its persisted
// settings). Conservative collaborative-mode defaults.
static void initSafetyRegion(SafetyRegion& r){
    r.enabled=1; r.speed_override=1.0;
    r.tcp_speed_max=1.5; r.tcp_speed_reduced=0.25; r.tcp_force_max=150.0; r.elbow_speed_max=2.0;
    r.reach_max=0.0; r.z_min=-1e9; r.z_max=1e9; r.base_cyl_r=0.0; r.nplanes=0;
    r.safety_seq=2;
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

#define NUM_AXES 6
static const double   ENCODER_RES   = 524288.0;            // 2^19 output counts/rev
// per-joint position-correction gain (counts/s per count). Scaled to actuator bandwidth:
// 142T (J1,J2) heavy/slower -> gentler; 110T (J3) mid; 80T (J4-6) light/fast -> tighter. Critically damped (no overshoot).
static const double   ANGLE_KP[NUM_AXES] = {8.0, 8.0, 9.0, 12.0, 12.0, 12.0};
static const int32_t  ANGLE_DEADBAND= 40;                  // counts (~0.027 deg): tight settle for repeatability, still hunt-free
static const uint32_t VENDOR_ID     = 0x5a65726f;
static const uint32_t PRODUCT_CODE  = 0x00029252;
static const double   TWO_PI        = 6.283185307179586;
static double JOINT_SIGN[NUM_AXES]   = {1,1,1,1,1,1};   // per-joint encoder->model direction (calibration)
static double JOINT_OFFSET[NUM_AXES] = {0,0,0,0,0,0};   // per-joint zero offset [rad] (calibration)
static const double MOTOR_DIR[NUM_AXES]    = {1,1,1,1,1,1};
// per-joint max output speed (drive counts/s) = eRob ceiling: 142H120=145927, 110H120=218453, 80H100=262144
static const int32_t JOINT_VMAX_C[NUM_AXES]= {145927,145927,218453,262144,262144,262144};
static const uint8_t MODE_CSP=8, MODE_CSV=9, MODE_CST=10;  // modes of operation (0x6060): 8=Cyclic-Sync-Position, 9=Velocity, 10=Torque
// ---- safety monitor thresholds ----
static const double COLL_WARN_M = 0.005;  // self-collision clearance [m] -> warning
static const double COLL_CRIT_M = 0.0;    // -> auto-disable only on modelled envelope overlap
static const double SING_MANIP  = 0.02;   // manipulability below this -> singularity

#define STATE_FAULT 0x08
#define STATE_SWITCH_ON_DISABLED 0x40
#define STATE_READY_TO_SWITCH_ON 0x21
#define STATE_SWITCHED_ON 0x23
#define STATE_OPERATION_ENABLED 0x27
#define CW_SHUTDOWN 0x0006
#define CW_SWITCH_ON 0x0007
#define CW_ENABLE_OPERATION 0x000F
#define CW_FAULT_RESET 0x0080
#define J_OPERABLE(st) ((st)==STATE_OPERATION_ENABLED || (st)==STATE_SWITCHED_ON)
#define NSEC_PER_SEC 1000000000L

// PDO offsets into the process image (ZeroErr official IgH map)
struct MotorPDO { unsigned controlword, target_position, target_velocity, target_torque,
                           statusword, actual_position, actual_velocity, actual_torque; };

static ec_master_t* master=nullptr;
static ec_domain_t* domain1=nullptr;
static uint8_t* domain1_pd=nullptr;
static MotorPDO pdo[NUM_AXES];
static ec_slave_config_t* sc[NUM_AXES];
static ec_sdo_request_t* sdo_mode[NUM_AXES]={nullptr};   // 0x6060 runtime CSV<->CST switch (freedrive)
static ec_sdo_request_t* sdo_err [NUM_AXES]={nullptr};   // 0x603F error/warning readout (diagnostics)
static ec_sdo_request_t* sdo_temp [NUM_AXES]={nullptr};  // 0x22A2 drive temperature      (Feedback.cpp)
static ec_sdo_request_t* sdo_curr [NUM_AXES]={nullptr};  // 0x6078 motor current
static ec_sdo_request_t* sdo_volt [NUM_AXES]={nullptr};  // 0x6079 DC-link voltage
static ec_sdo_request_t* sdo_brake[NUM_AXES]={nullptr};  // 0x4602 brake released

static volatile std::sig_atomic_t g_run=1;
static void onSig(int){ g_run=0; }
static const char* stateName(uint16_t s){ switch(s){ case 0x08:return "FAULT"; case 0x40:return "SWITCH-ON-DISABLED";
    case 0x21:return "READY"; case 0x23:return "SWITCHED-ON"; case 0x27:return "OPERATION-ENABLED"; default:return "UNKNOWN"; } }

// Load per-joint calibration (sign + zero offset) from run/calibration.txt so the 3D model
// matches the physical robot without recompiling. Format (offsets in DEGREES for convenience):
//     sign    1 1 1 1 1 1
//     offset  0 0 0 0 0 0
// A joint that moves the OPPOSITE way in the model gets sign -1; a joint whose zero pose differs
// gets an offset (model_angle = sign*encoder + offset).
static void loadCalibration(){
    // Bulletproof lookup so it loads even under sudo / from any cwd: env var, then the path next to
    // the binary (bin/../run), then relative fallbacks.
    std::vector<std::string> paths;
    if(const char* e=std::getenv("EROBO_CALIB")) paths.push_back(e);
    char exe[2048]={0}; ssize_t n=readlink("/proc/self/exe", exe, sizeof(exe)-1);
    if(n>0){ std::string p(exe,(size_t)n); size_t sl=p.find_last_of('/'); if(sl!=std::string::npos) paths.push_back(p.substr(0,sl)+"/../run/calibration.txt"); }
    paths.push_back("run/calibration.txt"); paths.push_back("../run/calibration.txt");
    FILE* fp=nullptr; std::string used;
    for(auto& p:paths){ fp=std::fopen(p.c_str(),"r"); if(fp){ used=p; break; } }
    if(!fp){
        std::printf("\n***** [ecat] CALIBRATION FILE NOT FOUND -> sign stuck at +1. Editing it will do NOTHING.\n");
        std::printf("*****        Fix: run  EROBO_CALIB=%s/run/calibration.txt  (absolute) or run from the repo root.\n\n", "<repo>");
        std::fflush(stdout); return;
    }
    char key[32];
    while(std::fscanf(fp,"%31s",key)==1){
        if(!std::strcmp(key,"sign"))        for(int i=0;i<NUM_AXES;i++){ if(std::fscanf(fp,"%lf",&JOINT_SIGN[i])!=1) break; }
        else if(!std::strcmp(key,"offset")) for(int i=0;i<NUM_AXES;i++){ double d; if(std::fscanf(fp,"%lf",&d)!=1) break; JOINT_OFFSET[i]=d*3.14159265358979/180.0; }
        else if(key[0]=='#'){ int ch; while((ch=std::fgetc(fp))!='\n'&&ch!=EOF){} }  // skip comment line
        else { double d; if(std::fscanf(fp,"%lf",&d)!=1) break; }
    }
    std::fclose(fp);
    std::printf("\n***** [ecat] CALIBRATION LOADED from %s\n", used.c_str());
    std::printf("*****        sign=[%.0f %.0f %.0f %.0f %.0f %.0f]  offset(deg)=[%.1f %.1f %.1f %.1f %.1f %.1f]\n\n",
        JOINT_SIGN[0],JOINT_SIGN[1],JOINT_SIGN[2],JOINT_SIGN[3],JOINT_SIGN[4],JOINT_SIGN[5],
        JOINT_OFFSET[0]*57.29578,JOINT_OFFSET[1]*57.29578,JOINT_OFFSET[2]*57.29578,JOINT_OFFSET[3]*57.29578,JOINT_OFFSET[4]*57.29578,JOINT_OFFSET[5]*57.29578);
    std::fflush(stdout);
}

int main(int argc,char**argv){
    std::string path=DEFAULT_SHM_PATH; double rate=1000.0; bool use_dc=true; bool use_csp=true;
    for(int i=1;i<argc;++i){ std::string a=argv[i];
        if(a=="--shm"&&i+1<argc)path=argv[++i];
        else if(a=="--rate"&&i+1<argc)rate=std::stod(argv[++i]);
        else if(a=="--no-dc")use_dc=false;
        else if(a=="--dc")use_dc=true;
        else if(a=="--csv")use_csp=false;   // fall back to master-side velocity control
        else if(a=="--csp")use_csp=true; }
    std::signal(SIGINT,onSig); std::signal(SIGTERM,onSig);
    loadCalibration();
    const long PERIOD_NS=(long)(1e9/rate);

    // ---- hard real-time setup (required for stable Distributed Clocks) ----
    { struct sched_param sp; sp.sched_priority=sched_get_priority_max(SCHED_FIFO);
      if(sched_setscheduler(0,SCHED_FIFO,&sp)!=0) std::fprintf(stderr,"[ecat] WARNING: no SCHED_FIFO (run as root) -- DC may be unstable\n");
      else std::printf("[ecat] real-time scheduling (SCHED_FIFO prio %d)\n", sp.sched_priority); }
    if(mlockall(MCL_CURRENT|MCL_FUTURE)!=0) std::fprintf(stderr,"[ecat] WARNING: mlockall failed\n");
    { volatile unsigned char dummy[8*1024]; for(size_t k=0;k<sizeof(dummy);++k) dummy[k]=0; }  // stack prefault

    // ---- EtherCAT master + slave config (ZeroErr official IgH PDO map) ----
    master=ecrt_request_master(0);
    if(!master){ std::fprintf(stderr,"[ecat] master request failed\n"); return 1; }
    for(int i=0;i<NUM_AXES;i++){
        sc[i]=ecrt_master_slave_config(master,0,i,VENDOR_ID,PRODUCT_CODE);
        if(!sc[i]){ std::fprintf(stderr,"[ecat] slave %d config failed\n",i); return 1; }
        ecrt_slave_config_sdo8 (sc[i],0x6060,0x00,use_csp?MODE_CSP:MODE_CSV);  // mode of operation
        if(use_csp){ // CSP needs the interpolation time period (0x60C2) = SYNC cycle so the drive
            // interpolates between the position setpoints we stream each cycle (units x 10^index s).
            long ms=PERIOD_NS/1000000L; if(ms<1) ms=1;
            ecrt_slave_config_sdo8(sc[i],0x60C2,0x01,(uint8_t)ms);          // units
            ecrt_slave_config_sdo8(sc[i],0x60C2,0x02,(uint8_t)(int8_t)-3);  // 10^-3 s => milliseconds
        }
        ecrt_slave_config_sdo16(sc[i],0x6071,0x00,0);          // target torque 0
        sdo_mode[i]=ecrt_slave_config_create_sdo_request(sc[i],0x6060,0x00,1);
        sdo_err [i]=ecrt_slave_config_create_sdo_request(sc[i],0x603F,0x00,2);
        sdo_temp [i]=ecrt_slave_config_create_sdo_request(sc[i],0x22A2,0x00,2);  // telemetry (async, off the RT path)
        sdo_curr [i]=ecrt_slave_config_create_sdo_request(sc[i],0x6078,0x00,2);
        sdo_volt [i]=ecrt_slave_config_create_sdo_request(sc[i],0x6079,0x00,4);
        sdo_brake[i]=ecrt_slave_config_create_sdo_request(sc[i],0x4602,0x00,4);  // brake status is UINT32 on these drives
        if(use_dc) ecrt_slave_config_dc(sc[i],0x0300,(uint32_t)PERIOD_NS,0,0,0);  // SYNC0 @ control period
    }
    ec_pdo_entry_info_t ent[]={
        {0x6040,0x00,16},{0x607A,0x00,32},{0x60FF,0x00,32},{0x6071,0x00,16},   // RxPDO 0x1600
        {0x6041,0x00,16},{0x6064,0x00,32},{0x606C,0x00,32},{0x6077,0x00,16},   // TxPDO 0x1A00
    };
    ec_pdo_info_t pdos[]={ {0x1600,4,ent+0}, {0x1A00,4,ent+4} };
    ec_sync_info_t syncs[]={
        {0,EC_DIR_OUTPUT,0,NULL  ,EC_WD_DISABLE},
        {1,EC_DIR_INPUT ,0,NULL  ,EC_WD_DISABLE},
        {2,EC_DIR_OUTPUT,1,pdos+0,EC_WD_ENABLE},
        {3,EC_DIR_INPUT ,1,pdos+1,EC_WD_DISABLE},
        {0xFF},
    };
    for(int i=0;i<NUM_AXES;i++)
        if(ecrt_slave_config_pdos(sc[i],EC_END,syncs)){ std::fprintf(stderr,"[ecat] PDO config failed (slave %d)\n",i); return 1; }

    domain1=ecrt_master_create_domain(master);
    ec_pdo_entry_reg_t regs[NUM_AXES*8+1]; int idx=0;
    for(int i=0;i<NUM_AXES;i++){
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x6040,0,&pdo[i].controlword};
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x607A,0,&pdo[i].target_position};
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x60FF,0,&pdo[i].target_velocity};
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x6071,0,&pdo[i].target_torque};
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x6041,0,&pdo[i].statusword};
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x6064,0,&pdo[i].actual_position};
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x606C,0,&pdo[i].actual_velocity};
        regs[idx++]={0,(uint16_t)i,VENDOR_ID,PRODUCT_CODE,0x6077,0,&pdo[i].actual_torque};
    }
    regs[idx]={};
    if(ecrt_domain_reg_pdo_entry_list(domain1,regs)){ std::fprintf(stderr,"[ecat] PDO register failed\n"); return 1; }

    { struct timespec t; clock_gettime(CLOCK_MONOTONIC,&t);
      ecrt_master_application_time(master,(uint64_t)t.tv_sec*NSEC_PER_SEC+t.tv_nsec); }
    if(ecrt_master_activate(master)){ std::fprintf(stderr,"[ecat] master activate failed\n"); return 1; }
    domain1_pd=ecrt_domain_data(domain1);
    std::printf("[ecat] master active: %d ZeroErr drives | Distributed Clocks %s | %s\n",
        NUM_AXES, use_dc?"ENABLED (SYNC0 @ control period)":"DISABLED (--dc to enable)",
        use_csp?"CSP position control (drive closes the loop -> stops exactly)":"CSV velocity control (master closes the loop)");

    // ---- cyclic timing (absolute clock_nanosleep) + DC sync ----
    struct timespec wake; clock_gettime(CLOCK_MONOTONIC,&wake);
    auto wait_cycle=[&]{ wake.tv_nsec+=PERIOD_NS; while(wake.tv_nsec>=NSEC_PER_SEC){ wake.tv_nsec-=NSEC_PER_SEC; wake.tv_sec++; }
        clock_nanosleep(CLOCK_MONOTONIC,TIMER_ABSTIME,&wake,nullptr); };
    auto dc_sync=[&]{ if(use_dc){ struct timespec tn; clock_gettime(CLOCK_MONOTONIC,&tn);
        ecrt_master_application_time(master,(uint64_t)tn.tv_sec*NSEC_PER_SEC+tn.tv_nsec);
        ecrt_master_sync_reference_clock(master); ecrt_master_sync_slave_clocks(master); } };

    // ---- shared memory ----
    bool created=false; ShmBlock* blk=nullptr;
    try{ blk=shmMap(path,created); }catch(const std::exception&e){ std::fprintf(stderr,"[ecat] %s\n",e.what()); return 1; }
    std::memset(blk,0,sizeof(ShmBlock)); blk->version=SHM_VERSION;

    // ---- bring-up: exchange DC-synced frames until every drive's statusword is live ----
    JArr q0{};
    { int stable=0,last=-1; long n=0;
      std::printf("[ecat] waiting for all %d drives to come live...\n",NUM_AXES); std::fflush(stdout);
      while(g_run){
          wait_cycle();
          ecrt_master_receive(master); ecrt_domain_process(domain1);
          int live=0; for(int i=0;i<NUM_AXES;i++) if(EC_READ_U16(domain1_pd+pdo[i].statusword)!=0) live++;
          for(int i=0;i<NUM_AXES;i++) EC_WRITE_U16(domain1_pd+pdo[i].controlword,0);
                  ecrt_domain_queue(domain1); dc_sync(); ecrt_master_send(master);
          if(live!=last){ last=live; std::printf("[ecat] %d/%d drives live\n",live,NUM_AXES); std::fflush(stdout); }
          stable=(live>=NUM_AXES)?stable+1:0;
          if(stable>=200) break;
          if(++n>(long)(25*rate)){ std::fprintf(stderr,"[ecat] WARNING: only %d/%d live after 25s -- check power/cabling; proceeding.\n",live,NUM_AXES); break; }
      }
      for(int k=0;k<200 && g_run;++k){ wait_cycle(); ecrt_master_receive(master); ecrt_domain_process(domain1);
          for(int i=0;i<NUM_AXES;i++){ int32_t pos=EC_READ_S32(domain1_pd+pdo[i].actual_position);
              q0[i]=JOINT_SIGN[i]*((double)pos/ENCODER_RES*TWO_PI)+JOINT_OFFSET[i]; }
          for(int i=0;i<NUM_AXES;i++) EC_WRITE_U16(domain1_pd+pdo[i].controlword,0);
          ecrt_domain_queue(domain1); dc_sync(); ecrt_master_send(master); }
      std::printf("[ecat] bring-up complete -- starting control.\n"); std::fflush(stdout);
    }
    blk->sp.valid=1; blk->sp.moving=0; blk->sp.traj_id=0;
    for(int i=0;i<SJ;++i){ blk->sp.q_cmd[i]=q0[i]; blk->sp.qd_cmd[i]=0; }
    blk->cmd.contact_on=0u; blk->cmd.contact_sens=0.5; blk->cmd.contact_test=0u;   // contact detection OFF until explicitly enabled (safe default)
    initSafetyRegion(blk->safety);
    blk->magic=SHM_MAGIC;

    // ---- control loop ----
    bool want_enable=false,freedrive=false,estopped=false,coll_stop=false,coll_on=false;  // self-collision monitor OFF by default (opt-in; avoids false drive-offs). Hardware E-STOP independent.
    bool safety_stop=false; uint32_t safety_code_l=0;                         // latched safety-monitor stop
    double jit_max_us=0; uint32_t overruns=0; int jit_n=0; double jit_pub=0;  // loop-timing health
    // ---- drive-fault AUTO-RECOVERY + EtherCAT link supervision -------------------------------
    // A transient drive fault (DC sync hiccup, momentary over-velocity, brownout) must NOT take
    // the arm down: faults are reset with a PROPER controlword edge and the drive is walked back
    // to OPERATION-ENABLED automatically. Only a PERSISTENT fault (>4 episodes on one joint
    // within 15 s) latches a drive alarm that requires the operator's Enable. While any joint is
    // not operable the published 'enabled' goes 0 so the planner cancels motion (no stale replay).
    int  flt_pulse[NUM_AXES]={0};        // fault-reset edge generator (bit7 must RISE to reset)
    int  flt_strikes[NUM_AXES]={0};      // fault episodes within the strike window
    double flt_last[NUM_AXES]={0};       // time of the last episode [s]
    bool was_fault[NUM_AXES]={false};
    bool drive_latched=false; int latched_j=-1;   // persistent-fault alarm (operator must Enable)
    int  link_bad=0; bool link_ok=true;           // consecutive degraded-link cycles
    const int LINK_REINIT_CYC=(int)(5.0*rate);    // 5 s degraded -> automatic re-init
    struct timespec t_prev; clock_gettime(CLOCK_MONOTONIC,&t_prev);
    uint32_t last_cmd=blk->cmd.cmd_seq;
    const double dt=1.0/rate; double t=0;
    const int OP_DEBOUNCE=(int)(0.3*rate); int op_cnt[NUM_AXES]={0};
    uint16_t errcode[NUM_AXES]={0};
    double tempv[NUM_AXES]={0},currv[NUM_AXES]={0},voltv[NUM_AXES]={0},tmeasv[NUM_AXES]={0}; uint32_t brakev[NUM_AXES]={0};
    ContactDetector contact_det; bool contact_stop=false; int contact_joint_pub=0;
    JArr qa{},qda{},qda_prev{};
    uint8_t mode_have[NUM_AXES],mode_wrote[NUM_AXES];
    for(int i=0;i<NUM_AXES;i++){ uint8_t m0=use_csp?MODE_CSP:MODE_CSV; mode_have[i]=m0; mode_wrote[i]=m0; }
    bool fd_prev=false; int dbg=0;
    // ---- EtherCAT re-init ("restart connection"): clear faults and re-establish every slave
    //      to an operable (SWITCHED-ON, disabled) state; drives are held idle during it. ----
    auto ecat_reinit=[&](){
        std::printf("[ecat] EtherCAT re-init requested -- re-establishing all slaves...\n"); std::fflush(stdout);
        want_enable=false; freedrive=false; estopped=false;
        for(int i=0;i<NUM_AXES;i++){ op_cnt[i]=0; errcode[i]=0; }
        long n=0; int stable=0;
        while(g_run){
            wait_cycle(); ecrt_master_receive(master); ecrt_domain_process(domain1);
            int ready=0;
            for(int i=0;i<NUM_AXES;i++){
                uint16_t sw=EC_READ_U16(domain1_pd+pdo[i].statusword); uint16_t s=sw&0x6F; uint16_t cw;
                if(s==STATE_FAULT) cw=CW_FAULT_RESET;                 // clear a fault
                else if(s==STATE_SWITCH_ON_DISABLED) cw=CW_SHUTDOWN;  // -> ready
                else if(s==STATE_READY_TO_SWITCH_ON) cw=CW_SWITCH_ON; // -> switched-on
                else cw=CW_SWITCH_ON;                                 // hold operable, disabled
                EC_WRITE_U16(domain1_pd+pdo[i].controlword,cw);
                EC_WRITE_S32(domain1_pd+pdo[i].target_velocity,0);
                if(sw!=0 && s!=STATE_FAULT) ready++;
            }
            ecrt_domain_queue(domain1); dc_sync(); ecrt_master_send(master);
            stable=(ready>=NUM_AXES)?stable+1:0;
            if(stable>=200){ std::printf("[ecat] re-init OK: %d/%d slaves operable\n",ready,NUM_AXES); break; }
            if(++n>(long)(10*rate)){ std::printf("[ecat] re-init: %d/%d operable after 10s (proceeding)\n",ready,NUM_AXES); break; }
        }
        std::fflush(stdout);
    };

    uint32_t estop_ctr=blk->cmd.estop_req, reset_ctr=blk->cmd.reset_req;   // edge counters
    while(g_run){
        wait_cycle();
        ecrt_master_receive(master); ecrt_domain_process(domain1);

        CmdRegion c{}; if(!seqRead(blk->cmd.cmd_seq,[&]{ c=blk->cmd; })) c.cmd_seq=last_cmd;   // failed read: keep last (no phantom edges)
        if(c.estop_req!=estop_ctr){ estop_ctr=c.estop_req; estopped=true;
            std::printf("[ecat] E-STOP requested -> drives to safe stop\n"); std::fflush(stdout); }
        if(c.reset_req!=reset_ctr){ reset_ctr=c.reset_req; estopped=false; }
        if(c.cmd_seq!=last_cmd){ last_cmd=c.cmd_seq;
            if(c.type==CMD_ENABLE){ want_enable=true; coll_stop=false; contact_stop=false; safety_stop=false; safety_code_l=0; contact_det.reset();
                drive_latched=false; latched_j=-1; for(int i2=0;i2<NUM_AXES;i2++){ flt_strikes[i2]=0; flt_pulse[i2]=0; } }   // re-enable clears collision/contact/safety/drive-fault stops
            else if(c.type==CMD_DISABLE){ want_enable=false; freedrive=false; }
            else if(c.type==CMD_FREEDRIVE_ON){ freedrive=true; want_enable=true; coll_stop=false; contact_stop=false; }
            else if(c.type==CMD_FREEDRIVE_OFF) freedrive=false;
            else if(c.type==CMD_ECAT_RESET) ecat_reinit();
            else if(c.type==CMD_SET_COLLISION){ coll_on=(c.frame!=0); if(!coll_on) coll_stop=false; std::printf("[ecat] collision monitor %s\n", coll_on?"ENABLED":"DISABLED"); }
            else if(c.type==CMD_SET_SIGN){                        // per-joint direction sign (+1/-1), applied LIVE
                for(int i=0;i<NUM_AXES;i++) JOINT_SIGN[i]=(c.target_q[i]<0.0?-1.0:1.0);
                want_enable=false;                                // drop to a safe hold; user re-enables after the flip
                std::printf("[ecat] joint signs -> [%.0f %.0f %.0f %.0f %.0f %.0f] (drives disabled; re-enable to move)\n",
                    JOINT_SIGN[0],JOINT_SIGN[1],JOINT_SIGN[2],JOINT_SIGN[3],JOINT_SIGN[4],JOINT_SIGN[5]); std::fflush(stdout);
            }
        }
        double payload=c.payload>0.0?c.payload:0.0;
        setToolFromPosQuat(c.tcp);                                        // active TCP (flange if unset)
        Vec3a cog{c.payload_cog[0], c.payload_cog[1], c.payload_cog[2]};  // tool CoG in flange frame
        // ---- EtherCAT link supervision: detect slaves dropping out of OP / lost link ----
        { ec_master_state_t ms{}; ecrt_master_state(master,&ms);
          bool ok_now = ms.link_up && ms.slaves_responding>=NUM_AXES && ms.al_states==0x08;
          if(ok_now){ if(!link_ok){ std::printf("[ecat] link RESTORED (%u/%d slaves OP)\n",ms.slaves_responding,NUM_AXES); std::fflush(stdout);} link_bad=0; link_ok=true; }
          else {
            if(link_ok){ std::printf("[ecat] link DEGRADED: %u/%d responding, AL=0x%02x, link=%u -- auto-recovery armed\n",
                                     ms.slaves_responding,NUM_AXES,ms.al_states,ms.link_up); std::fflush(stdout); }
            link_ok=false;
            if(++link_bad>=LINK_REINIT_CYC){                 // staged recovery: re-establish all slaves
              bool we=want_enable;
              std::printf("[ecat] link degraded for 5 s -> automatic EtherCAT re-init\n"); std::fflush(stdout);
              ecat_reinit();
              want_enable=we; estopped=false; link_bad=0;    // resume the previous enable intent
            }
          } }
        SpRegion sp{}; bool got=seqRead(blk->sp.sp_seq,[&]{ sp=blk->sp; });
        bool en=want_enable&&!estopped&&!drive_latched;
        bool fd=freedrive&&en;

        // runtime CSV<->CST mode switch (freedrive) -- only writes on a change, so no SDO traffic normally
        uint8_t want_mode=fd?MODE_CST:(use_csp?MODE_CSP:MODE_CSV);
        for(int i=0;i<NUM_AXES;i++){ if(!sdo_mode[i])continue;
            ec_request_state_t rs=ecrt_sdo_request_state(sdo_mode[i]);
            if(rs==EC_REQUEST_SUCCESS) mode_have[i]=mode_wrote[i];
            else if(rs==EC_REQUEST_ERROR) mode_have[i]=0;
            if(rs!=EC_REQUEST_BUSY && mode_have[i]!=want_mode){ EC_WRITE_U8(ecrt_sdo_request_data(sdo_mode[i]),want_mode); mode_wrote[i]=want_mode; ecrt_sdo_request_write(sdo_mode[i]); } }
        if(fd&&!fd_prev) std::printf("[ecat] FREEDRIVE on  -> torque mode (zero torque). Support the arm.\n");
        if(!fd&&fd_prev) std::printf("[ecat] FREEDRIVE off -> %s, holding position.\n", use_csp?"position mode (CSP)":"velocity mode");
        fd_prev=fd;

        uint16_t jstate[NUM_AXES],jraw[NUM_AXES];
        for(int i=0;i<NUM_AXES;i++){
            uint16_t sw=EC_READ_U16(domain1_pd+pdo[i].statusword);
            uint16_t state=sw&0x6F; jstate[i]=state; jraw[i]=sw;
            op_cnt[i]=J_OPERABLE(state)?op_cnt[i]+1:0;
            int32_t pos=EC_READ_S32(domain1_pd+pdo[i].actual_position);
            int32_t vel=EC_READ_S32(domain1_pd+pdo[i].actual_velocity);
            int16_t mtq=EC_READ_S16(domain1_pd+pdo[i].actual_torque);   // 0x6077 measured torque (in TxPDO)
            tmeasv[i]=mtq*0.1;                                          // -> % of rated (Feedback.cpp convention)
            qa[i]=JOINT_SIGN[i]*((double)pos/ENCODER_RES*TWO_PI)+JOINT_OFFSET[i];
            qda[i]=JOINT_SIGN[i]*((double)vel/ENCODER_RES*TWO_PI);
            double qc=(got&&sp.valid)?sp.q_cmd[i]:qa[i];
            { // setpoint sanity clamp (2x rated speed per cycle): no upstream fault may step the drives
              static double qc_prev[NUM_AXES]; static bool qc_init=false;
              if(!qc_init){ for(int k2=0;k2<NUM_AXES;k2++) qc_prev[k2]=qa[k2]; qc_init=true; }
              const double* Vm=jointVelMax(); double lim=2.0*Vm[i]/rate, d=qc-qc_prev[i];
              if(d> lim) d= lim; if(d<-lim) d=-lim;
              qc=qc_prev[i]+d; qc_prev[i]=qc;
              if(!en||fd) qc_prev[i]=qa[i];   // while disabled/freedrive, track measured (bump-free) }
            }
            double enc_rad=(qc-JOINT_OFFSET[i])*JOINT_SIGN[i];
            EC_WRITE_S32(domain1_pd+pdo[i].target_position,pos);   // sync setpoint to actual: no jump on enable (this IS the CSP setpoint)

            uint16_t cw;
            switch(state){
                case STATE_FAULT:
                    // CiA-402 fault reset is EDGE triggered (bit 7 must rise). Pulse 12 cycles low,
                    // 12 cycles high so every retry produces a clean rising edge.
                    cw = ((flt_pulse[i]++/12)&1) ? CW_FAULT_RESET : 0x0000;
                    break;
                case STATE_SWITCH_ON_DISABLED: cw=CW_SHUTDOWN;     break;
                case STATE_READY_TO_SWITCH_ON: cw=CW_SWITCH_ON;    break;
                case STATE_SWITCHED_ON:        cw= en?CW_ENABLE_OPERATION:CW_SWITCH_ON; break; // enable on command; else hold (brake on)
                case STATE_OPERATION_ENABLED:{
                    if(!en){ EC_WRITE_S32(domain1_pd+pdo[i].target_velocity,0); EC_WRITE_S16(domain1_pd+pdo[i].target_torque,0); cw=CW_SWITCH_ON; break; }
                    if(fd){ EC_WRITE_S16(domain1_pd+pdo[i].target_torque,0); EC_WRITE_S32(domain1_pd+pdo[i].target_velocity,0); cw=CW_ENABLE_OPERATION; break; }
                    int32_t targetCounts=(int32_t)(enc_rad/TWO_PI*ENCODER_RES);
                    if(use_csp){
                        // CSP (mode 8): stream the jerk-limited setpoint; the DRIVE closes its own
                        // critically-damped position loop and the 0x60C2 interpolator smooths between
                        // 1 kHz setpoints. The arm decelerates into the target and STOPS EXACTLY there
                        // -- no master-side velocity-loop overshoot. Velocity is left to the drive.
                        EC_WRITE_S32(domain1_pd+pdo[i].target_position,targetCounts);
                        EC_WRITE_S16(domain1_pd+pdo[i].target_torque,0);
                    }else{
                        // CSV fallback (mode 9): master closes the position loop (vff + KP*error).
                        int32_t error=targetCounts-pos;
                        double qd_ff=(got&&sp.valid)?sp.qd_cmd[i]:0.0;
                        int32_t vff=(int32_t)(MOTOR_DIR[i]*JOINT_SIGN[i]*qd_ff/TWO_PI*ENCODER_RES);
                        int32_t vcorr=(int32_t)(MOTOR_DIR[i]*ANGLE_KP[i]*(double)error);
                        if(std::abs(error)<ANGLE_DEADBAND) vcorr=0;
                        int32_t velCmd=vff+vcorr, vmax=JOINT_VMAX_C[i];
                        if(velCmd> vmax) velCmd= vmax;
                        if(velCmd<-vmax) velCmd=-vmax;
                        EC_WRITE_S32(domain1_pd+pdo[i].target_velocity,velCmd);
                        EC_WRITE_S16(domain1_pd+pdo[i].target_torque,0);
                    }
                    cw=CW_ENABLE_OPERATION; break;
                }
                default: cw=0x0000; break;
            }
            EC_WRITE_U16(domain1_pd+pdo[i].controlword,cw);
        }

        // ---- drive-fault auto-recovery: count fault EPISODES per joint (edges), auto-reset,
        //      and only latch a persistent offender. Strikes decay after 15 s without a fault.
        for(int i=0;i<NUM_AXES;i++){
            bool f=(jstate[i]==STATE_FAULT);
            if(f && !was_fault[i]){                                   // new fault episode
                if(t-flt_last[i]>15.0) flt_strikes[i]=0;              // stale window -> fresh budget
                flt_strikes[i]++; flt_last[i]=t; flt_pulse[i]=0;
                std::printf("[ecat] J%d drive FAULT (episode %d/4) -> automatic reset + re-enable\n", i+1, flt_strikes[i]); std::fflush(stdout);
                if(flt_strikes[i]>4 && !drive_latched){
                    drive_latched=true; latched_j=i;
                    std::printf("[ecat] J%d faults PERSIST (>4 in 15 s) -> drive alarm latched. Check 0x603F code, then Enable.\n", i+1); std::fflush(stdout);
                }
            }
            if(!f) flt_pulse[i]=0;
            was_fault[i]=f;
        }
        bool all_op=true; for(int i=0;i<NUM_AXES;i++) if(!J_OPERABLE(jstate[i])) all_op=false;

        ecrt_domain_queue(domain1); dc_sync(); ecrt_master_send(master);

        // diagnostic every ~0.5 s + throttled 0x603F readout (keep SDO traffic off the fast path)
        if(++dbg>=500){ dbg=0;
            for(int i=0;i<NUM_AXES;i++){ if(!sdo_err[i])continue;
                ec_request_state_t es=ecrt_sdo_request_state(sdo_err[i]);
                if(es==EC_REQUEST_SUCCESS) errcode[i]=EC_READ_U16(ecrt_sdo_request_data(sdo_err[i]));
                if(es!=EC_REQUEST_BUSY) ecrt_sdo_request_read(sdo_err[i]); }
            // telemetry: temperature / current / voltage / brake (async SDO, polled here -- not in the RT path)
            for(int i=0;i<NUM_AXES;i++){
                if(sdo_temp[i]){ ec_request_state_t s=ecrt_sdo_request_state(sdo_temp[i]);
                    if(s==EC_REQUEST_SUCCESS) tempv[i]=EC_READ_U16(ecrt_sdo_request_data(sdo_temp[i]))*1.0;  // 0x22A2 = whole degrees C
                    if(s!=EC_REQUEST_BUSY) ecrt_sdo_request_read(sdo_temp[i]); }
                if(sdo_curr[i]){ ec_request_state_t s=ecrt_sdo_request_state(sdo_curr[i]);
                    if(s==EC_REQUEST_SUCCESS) currv[i]=EC_READ_S16(ecrt_sdo_request_data(sdo_curr[i]))*0.001;
                    if(s!=EC_REQUEST_BUSY) ecrt_sdo_request_read(sdo_curr[i]); }
                if(sdo_volt[i]){ ec_request_state_t s=ecrt_sdo_request_state(sdo_volt[i]);
                    if(s==EC_REQUEST_SUCCESS) voltv[i]=EC_READ_U32(ecrt_sdo_request_data(sdo_volt[i]))*0.001;
                    if(s!=EC_REQUEST_BUSY) ecrt_sdo_request_read(sdo_volt[i]); }
                if(sdo_brake[i]){ ec_request_state_t s=ecrt_sdo_request_state(sdo_brake[i]);
                    if(s==EC_REQUEST_SUCCESS) brakev[i]=EC_READ_U32(ecrt_sdo_request_data(sdo_brake[i]))?1u:0u;
                    if(s!=EC_REQUEST_BUSY) ecrt_sdo_request_read(sdo_brake[i]); }
            }
            std::printf("[ecat] enabled=%d want_enable=%d estop=%d | drives:",(int)en,(int)want_enable,(int)estopped);
            for(int i=0;i<NUM_AXES;i++) std::printf(" J%d=%s[sw0x%04x%s err0x%04x]",i,stateName(jstate[i]),jraw[i],(jraw[i]&0x0080)?" WARN":"",errcode[i]);
            std::printf("\n"); std::fflush(stdout);
        }

        JArr qdd_est; for(int i=0;i<SJ;++i) qdd_est[i]=(qda[i]-qda_prev[i])/dt; qda_prev=qda;
        auto tau=inverseDynamics(qa,qda,qdd_est,payload,cog);
        Mat4 T=forwardKinematics(qa); Vec3 p=T.pos(); Quat qq=Quat::fromMat3(T.rot());
        Mat4 Tt=tcpFromFlange(T); Vec3 pt=Tt.pos(); Quat qt=Quat::fromMat3(Tt.rot());  // tool tip pose
        double manip=manipulability(jacobianFlange(qa));
        // ---- safety monitor: self-collision proximity + singularity ----
        CollisionResult cc=selfCollision(qa);
        bool coll_warn=coll_on&&cc.dist<COLL_WARN_M, coll_crit=coll_on&&cc.dist<COLL_CRIT_M, singular=(manip<SING_MANIP)&&got&&sp.moving;
        if(coll_crit && en && !fd){ want_enable=false; coll_stop=true; }  // not in freedrive (recovery)   // auto-disable just before contact
        // ---- external-contact (physical collision) detection: residual = measured motor torque - model ----
        const double* eff2=jointEffortMax(); JArr tau_meas_nm;
        for(int i=0;i<SJ;++i) tau_meas_nm[i]=tmeasv[i]/100.0*eff2[i];        // 0x6077 (% of rated) -> Nm (approx; sensitivity tunes)
        contact_det.sensitivity = c.contact_sens<0?0:(c.contact_sens>1?1:c.contact_sens);
        ContactResult cr{false,-1,{0},0.0};
        if(c.contact_on){ cr=contact_det.update(tau_meas_nm,qa,qda,qdd_est,payload,cog); } else contact_det.reset();
        if(cr.contact && en && !fd){ want_enable=false; contact_stop=true; contact_joint_pub=cr.joint;
            std::printf("[ecat] EXTERNAL CONTACT on J%d (|ext| margin %.1fx) -> protective stop\n", cr.joint+1, cr.margin); }
        // ---- configurable safety monitor: measured-state last line of software defence ----
        SafetyRegion sfr{}; seqRead(blk->safety.safety_seq,[&]{ sfr=blk->safety; });
        SafetyConfig scfg=cfgFromShm(sfr);
        JVec extt; for(int i=0;i<SJ;++i) extt[i]=cr.resid[i];
        SafetyMeasured sm=checkMeasured(scfg,qa,qda,pt,extt,c.contact_on!=0);
        if(sm.code!=SAFE_OK && en && !fd){ want_enable=false; safety_stop=true; safety_code_l=sm.code;
            std::printf("[ecat] SAFETY STOP: %s -> drives disabled\n", safetyCodeName(sm.code)); std::fflush(stdout); }
        // ---- I/O: controller-level virtual I/O (PLC handshake bits); physical modules attach
        //      through the controller's Modbus TCP mapping. Applied outputs echo back. ----
        { IoRegion iov=blk->io;
          seqWrite(blk->io.io_seq,[&]{ IoRegion& o=blk->io;
              o.do_state=iov.do_cmd; o.di=iov.di_sim;
              o.ao_state[0]=iov.ao_cmd[0]; o.ao_state[1]=iov.ao_cmd[1]; }); }
        // functional enable: the arm is only OPERATIONAL when every joint is operable AND the
        // link is healthy. Publishing 0 during recovery makes the planner cancel motion cleanly;
        // when the fault clears (want_enable still true) the arm returns to service by itself.
        bool en_pub = en && all_op && link_ok;
        uint32_t mode=estopped?MODE_ESTOP:fd?MODE_FREEDRIVE:(!en_pub?MODE_HOLD:((got&&sp.moving)?MODE_MOVING:MODE_IDLE));
        seqWrite(blk->st.state_seq,[&]{
            StateRegion& s=blk->st;
            s.mode=mode; s.estop=estopped?1:0; s.enabled=en_pub?1:0; s.t=t;
            for(int i=0;i<SJ;++i){ s.q[i]=qa[i]; s.qd[i]=qda[i]; s.torque[i]=tau[i];
                s.temp[i]=tempv[i]; s.current[i]=currv[i]; s.voltage[i]=voltv[i]; s.torque_meas[i]=tmeasv[i]; s.brake[i]=brakev[i]; }
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
            const char* mn=mode==MODE_ESTOP?"ESTOP":mode==MODE_FREEDRIVE?"FREEDRIVE":mode==MODE_HOLD?"DISABLED":mode==MODE_MOVING?"MOVING":"IDLE";
            if(drive_latched) mn="FAULT-LATCHED";
            else if(!link_ok) mn="LINK-RECOVERY";
            else if(en && !all_op) mn="DRIVE-RECOVERY";
            char stbuf[48];
            std::snprintf(stbuf,sizeof(stbuf),"%s op=%d%d%d%d%d%d",mn,
                op_cnt[0]>=OP_DEBOUNCE,op_cnt[1]>=OP_DEBOUNCE,op_cnt[2]>=OP_DEBOUNCE,
                op_cnt[3]>=OP_DEBOUNCE,op_cnt[4]>=OP_DEBOUNCE,op_cnt[5]>=OP_DEBOUNCE);
            setCStr(s.status,sizeof(s.status),stbuf);
        });
        t+=dt;
        { struct timespec tn; clock_gettime(CLOCK_MONOTONIC,&tn);           // wake-time error vs the absolute schedule
          double err_us=((double)(tn.tv_sec-wake.tv_sec)*1e6)+((double)(tn.tv_nsec-wake.tv_nsec)*1e-3);
          if(err_us<0) err_us=0;
          if(err_us>jit_max_us) jit_max_us=err_us;
          if(err_us>1e-3*PERIOD_NS) ++overruns;
          if(++jit_n>=1000){ jit_pub=jit_max_us; jit_max_us=0; jit_n=0; } }
    }

    for(int i=0;i<NUM_AXES;i++){ EC_WRITE_S32(domain1_pd+pdo[i].target_velocity,0); EC_WRITE_U16(domain1_pd+pdo[i].controlword,CW_SHUTDOWN); }
    ecrt_domain_queue(domain1); dc_sync(); ecrt_master_send(master);
    if(master) ecrt_release_master(master);
    shmUnmap(blk);
    std::printf("\n[ecat] shutdown\n");
    return 0;
}
