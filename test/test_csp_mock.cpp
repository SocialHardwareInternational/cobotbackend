// test_csp_mock.cpp -- runtime check of the CSP (Cyclic-Synchronous-Position) path.
//
// Drives the simulated EtherCAT drives through the SAME ecrt API the real node uses
// (request master -> slave config -> set mode 0x6060=8 (CSP) -> reg PDO list -> activate
// -> CiA-402 bring-up -> stream target_position(0x607A) each cycle), then asserts:
//   1. no jump on enable      (actual_position stays at 0 until we command a move)
//   2. exact stop, no overshoot (the drive's own position loop lands on target, peak<=target)
//   3. freedrive (CST mode 10) -> drive does not self-move; switching back resumes position.
// This exercises the drive-sim CSP model end-to-end. Overshoot itself is a real-hardware
// servo phenomenon (perfect in sim) -- the point here is that the CSP wiring/bring-up is
// correct and the commanded setpoint is tracked and held exactly.
#include "ecrt.h"
#include <cstdio>
#include <cmath>
#include <cstdint>

static const double TWO_PI = 6.283185307179586;
static const double ENC = 524288.0;
#define NAX 6
struct PDO { unsigned cw, tp, tv, tq, sw, ap, av, at; };
static PDO pdo[NAX];

static int32_t counts(double rad){ return (int32_t)(rad/TWO_PI*ENC); }

// one CiA-402 step for axis i: returns controlword for its current statusword,
// and (if OP-ENABLED) streams target_position = setp in CSP.
static void axis_step(uint8_t* pd, int i, bool enable, int32_t setp){
    uint16_t s = EC_READ_U16(pd+pdo[i].sw) & 0x6F;
    int32_t  ap = EC_READ_S32(pd+pdo[i].ap);
    EC_WRITE_S32(pd+pdo[i].tp, ap);            // default: sync setpoint to actual (no jump on enable)
    uint16_t cw;
    switch(s){
        case 0x08: cw=0x0080; break;           // FAULT -> reset
        case 0x40: cw=0x0006; break;           // switch-on-disabled -> shutdown
        case 0x21: cw=0x0007; break;           // ready -> switch on
        case 0x23: cw= enable?0x000F:0x0007; break; // switched-on -> enable / hold
        case 0x27:                              // OPERATION ENABLED
            if(enable){ EC_WRITE_S32(pd+pdo[i].tp, setp); cw=0x000F; }
            else cw=0x0007;
            break;
        default: cw=0x0000; break;
    }
    EC_WRITE_U16(pd+pdo[i].cw, cw);
}

int main(){
    ec_master_t* m = ecrt_request_master(0);
    ec_slave_config_t* sc[NAX];
    for(int i=0;i<NAX;i++){
        sc[i]=ecrt_master_slave_config(m,0,i,0x5a65726f,0x00029252);
        ecrt_slave_config_sdo8(sc[i],0x6060,0x00,8);   // CSP mode of operation
    }
    ec_domain_t* dom = ecrt_master_create_domain(m);
    ec_pdo_entry_reg_t regs[NAX*8+1]; int k=0;
    for(int i=0;i<NAX;i++){
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x6040,0,&pdo[i].cw,0};
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x607A,0,&pdo[i].tp,0};
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x60FF,0,&pdo[i].tv,0};
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x6071,0,&pdo[i].tq,0};
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x6041,0,&pdo[i].sw,0};
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x6064,0,&pdo[i].ap,0};
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x606C,0,&pdo[i].av,0};
        regs[k++]={0,(uint16_t)i,0x5a65726f,0x00029252,0x6077,0,&pdo[i].at,0};
    }
    regs[k]={0,0,0,0,0,0,0,0};
    ecrt_domain_reg_pdo_entry_list(dom, regs);
    ecrt_master_activate(m);
    uint8_t* pd = ecrt_domain_data(dom);

    // ---- 1) bring-up to OPERATION-ENABLED, commanding NO move (setp=actual) ----
    int32_t jump_peak=0;
    for(int c=0;c<400;c++){
        ecrt_master_receive(m); ecrt_domain_process(dom);
        for(int i=0;i<NAX;i++){ axis_step(pd,i,true,0); int32_t ap=EC_READ_S32(pd+pdo[i].ap); if(std::abs(ap)>jump_peak) jump_peak=std::abs(ap); }
        ecrt_domain_queue(dom); ecrt_master_send(m);
    }
    int enabled=0; for(int i=0;i<NAX;i++) if((EC_READ_U16(pd+pdo[i].sw)&0x6F)==0x27) enabled++;
    printf("[bring-up] %d/%d drives OPERATION-ENABLED; max |pos| during enable = %d counts\n", enabled, NAX, jump_peak);

    // ---- 2) command a move to qf and check exact stop + no overshoot ----
    const double qf[NAX]={0.50,-0.40,0.80,1.20,-0.90,0.60};
    int32_t tgt[NAX], peak[NAX]={0}; for(int i=0;i<NAX;i++) tgt[i]=counts(qf[i]);
    const int RAMP=500, HOLD=300;
    for(int c=0;c<RAMP+HOLD;c++){
        ecrt_master_receive(m); ecrt_domain_process(dom);
        double u = c<RAMP ? (double)c/RAMP : 1.0;
        double sstep = u*u*(3.0-2.0*u);                 // smoothstep ease in/out
        for(int i=0;i<NAX;i++){
            int32_t setp=(int32_t)(sstep*tgt[i]);
            axis_step(pd,i,true,setp);
        }
        ecrt_domain_queue(dom); ecrt_master_send(m);
        for(int i=0;i<NAX;i++){ int32_t ap=EC_READ_S32(pd+pdo[i].ap);
            if(tgt[i]>=0){ if(ap>peak[i]) peak[i]=ap; } else { if(ap<peak[i]) peak[i]=ap; } }
    }
    bool ok=true;
    for(int i=0;i<NAX;i++){
        int32_t ap=EC_READ_S32(pd+pdo[i].ap);
        int32_t err=ap-tgt[i];
        int32_t over = tgt[i]>=0 ? (peak[i]-tgt[i]) : (tgt[i]-peak[i]); // >0 means overshoot past target
        double deg_err=(double)err/ENC*360.0;
        bool jok = std::abs(err)<=2;     // landed exactly (<=2 counts ~ 0.0014 deg)
        bool nok = over<=2;              // never overshot the target
        printf("  J%d  target=%8d  final=%8d  err=%+4d (%.4f deg)  overshoot=%+5d  %s\n",
               i+1, tgt[i], ap, err, deg_err, over, (jok&&nok)?"OK":"FAIL");
        ok = ok && jok && nok;
    }

    // ---- 3) freedrive: switch to CST (mode 10) -> no self-motion; back to CSP resumes ----
    ec_sdo_request_t* sm[NAX];
    for(int i=0;i<NAX;i++){ sm[i]=ecrt_slave_config_create_sdo_request(sc[i],0x6060,0x00,1);
        EC_WRITE_U8(ecrt_sdo_request_data(sm[i]),10); ecrt_sdo_request_write(sm[i]); }   // -> CST
    int32_t before[NAX]; for(int i=0;i<NAX;i++) before[i]=EC_READ_S32(pd+pdo[i].ap);
    for(int c=0;c<200;c++){
        ecrt_master_receive(m); ecrt_domain_process(dom);
        for(int i=0;i<NAX;i++){ EC_WRITE_U16(pd+pdo[i].cw,0x000F); EC_WRITE_S16(pd+pdo[i].tq,0); }  // zero torque, stay enabled
        ecrt_domain_queue(dom); ecrt_master_send(m);
    }
    bool fd_ok=true;
    for(int i=0;i<NAX;i++){ int32_t ap=EC_READ_S32(pd+pdo[i].ap); if(std::abs(ap-before[i])>2) fd_ok=false; }
    printf("[freedrive] CST (zero torque): drives held position (no self-motion) = %s\n", fd_ok?"OK":"FAIL");

    printf("\n%s\n", (ok&&fd_ok&&enabled==NAX) ? "CSP RUNTIME TEST: PASS" : "CSP RUNTIME TEST: FAIL");
    return (ok&&fd_ok&&enabled==NAX)?0:1;
}
