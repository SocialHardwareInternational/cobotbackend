// FUNCTIONAL EtherCAT drive simulator standing in for <ecrt.h>. Models 6 CiA-402 drives
// (state machine + velocity integration + mode-of-operation) so the REAL driver code can be
// run offline: closed-loop servo AND the freedrive torque-mode switch execute exactly as on
// hardware, minus the physical drives. For verification only -- never on a real robot.
#pragma once
#include <cstdint>
#include <cstddef>
#define EC_END (~0U)

typedef struct ec_master_t ec_master_t;
typedef struct ec_domain_t ec_domain_t;
typedef struct ec_slave_config_t ec_slave_config_t;
typedef enum { EC_DIR_INVALID, EC_DIR_OUTPUT, EC_DIR_INPUT, EC_DIR_BOTH } ec_direction_t;
typedef enum { EC_WD_DEFAULT, EC_WD_ENABLE, EC_WD_DISABLE } ec_watchdog_mode_t;
typedef struct { uint16_t index; uint8_t subindex; uint8_t bit_length; } ec_pdo_entry_info_t;
typedef struct { uint16_t index; unsigned int n_entries; ec_pdo_entry_info_t* entries; } ec_pdo_info_t;
typedef struct { uint8_t index; ec_direction_t dir; unsigned int n_pdos; ec_pdo_info_t* pdos; ec_watchdog_mode_t watchdog_mode; } ec_sync_info_t;
typedef struct { uint16_t alias; uint16_t position; uint32_t vendor_id; uint32_t product_code;
                 uint16_t index; uint8_t subindex; unsigned int* offset; unsigned int* bit_position; } ec_pdo_entry_reg_t;

// async SDO request API (used for the runtime modes-of-operation switch)
typedef enum { EC_REQUEST_UNUSED, EC_REQUEST_BUSY, EC_REQUEST_SUCCESS, EC_REQUEST_ERROR } ec_request_state_t;
typedef enum { EC_WC_ZERO, EC_WC_INCOMPLETE, EC_WC_COMPLETE } ec_wc_state_t;
typedef struct { unsigned int slaves_responding; unsigned int al_states; unsigned int link_up; } ec_master_state_t;
typedef struct { unsigned int working_counter; ec_wc_state_t wc_state; unsigned int redundancy_active; } ec_domain_state_t;
typedef struct { int slave; uint16_t index; uint8_t sub; uint8_t data[8]; ec_request_state_t state; } ec_sdo_request_t;

#define EC_READ_U8(D)       (*(uint8_t*)(D))
#define EC_READ_U16(D)      (*(uint16_t*)(D))
#define EC_READ_S16(D)      (*(int16_t*)(D))
#define EC_READ_S32(D)      (*(int32_t*)(D))
#define EC_READ_U32(D)      (*(uint32_t*)(D))
#define EC_WRITE_U8(D,V)    do{*(uint8_t*)(D)=(uint8_t)(V);}while(0)
#define EC_WRITE_U16(D,V)   do{*(uint16_t*)(D)=(uint16_t)(V);}while(0)
#define EC_WRITE_S16(D,V)   do{*(int16_t*)(D)=(int16_t)(V);}while(0)
#define EC_WRITE_U32(D,V)   do{*(uint32_t*)(D)=(uint32_t)(V);}while(0)
#define EC_WRITE_S32(D,V)   do{*(int32_t*)(D)=(int32_t)(V);}while(0)

// ---- simulated drives ----  mode: 8=CSP (position), 9=CSV (velocity), 10=CST (torque/freedrive)
struct _SimDrv { uint16_t sw; int32_t pos; int32_t vel; uint8_t mode; };
static _SimDrv _sd[6] = { {0x40,0,0,9},{0x40,0,0,9},{0x08,0,0,9},{0x40,0,0,9},{0x40,0,0,9},{0x40,0,0,9} }; // J3 starts FAULTed
static uint8_t  _pd[4096];
static struct { unsigned off; int slave; uint16_t idx; } _reg[64];
static int _nreg = 0; static unsigned _noff = 0; static int _mobj;
static int _cyc = 0;                                  // master cycles since activate
static inline int _live(int s){ return _cyc > 30 + s*15; }   // slaves reach EtherCAT OP at staggered times
static ec_sdo_request_t _sdoreqs[64]; static int _nsdoreq = 0;

static inline ec_master_t* ecrt_request_master(unsigned){ return (ec_master_t*)&_mobj; }
static inline void ecrt_release_master(ec_master_t*){}
// encode the slave index in the returned pointer so SDO requests can find their drive
static inline ec_slave_config_t* ecrt_master_slave_config(ec_master_t*,uint16_t,uint16_t pos,uint32_t,uint32_t){ return (ec_slave_config_t*)(intptr_t)(pos+1); }
static inline int ecrt_slave_config_sdo8(ec_slave_config_t* sc,uint16_t idx,uint8_t,uint8_t val){
    if (idx==0x6060){ int s=(int)(intptr_t)sc-1; if(s>=0&&s<6) _sd[s].mode=val; } return 0; }
static inline int ecrt_slave_config_sdo16(ec_slave_config_t*,uint16_t,uint8_t,uint16_t){ return 0; }
static inline ec_sdo_request_t* ecrt_slave_config_create_sdo_request(ec_slave_config_t* sc,uint16_t index,uint8_t sub,size_t){
    ec_sdo_request_t* r=&_sdoreqs[_nsdoreq++]; r->slave=(int)(intptr_t)sc-1; r->index=index; r->sub=sub; r->state=EC_REQUEST_UNUSED; return r; }
static inline ec_request_state_t ecrt_sdo_request_state(ec_sdo_request_t* r){ return r->state; }
static inline uint8_t* ecrt_sdo_request_data(ec_sdo_request_t* r){ return r->data; }
static inline void ecrt_sdo_request_read(ec_sdo_request_t* r){ int s=r->slave; if(s<0||s>5) s=0;
    if(r->index==0x603F){ *(uint16_t*)r->data=0; }
    else if(r->index==0x22A2){ *(uint16_t*)r->data=(uint16_t)(30+s*3+(_cyc/4000)%6); }                  // temp raw (whole deg C) ~30..48
    else if(r->index==0x6078){ int32_t mv=_sd[s].vel<0?-_sd[s].vel:_sd[s].vel; *(int16_t*)r->data=(int16_t)(300+s*60+mv/4000); } // current -> *0.001 A
    else if(r->index==0x6079){ *(uint32_t*)r->data=(uint32_t)(48000+s*120); }                          // voltage raw mV -> *0.001 V
    else if(r->index==0x4602){ r->data[0]=(_sd[s].sw==0x27)?1:0; }                                      // brake released when OP-enabled
    r->state=EC_REQUEST_SUCCESS; }
static inline void ecrt_sdo_request_write(ec_sdo_request_t* r){
    if (r->index==0x6060 && r->slave>=0 && r->slave<6) _sd[r->slave].mode=r->data[0];   // apply mode switch
    r->state=EC_REQUEST_SUCCESS; }
static inline int ecrt_slave_config_pdos(ec_slave_config_t*,unsigned,const ec_sync_info_t*){ return 0; }
static inline int ecrt_slave_config_dc(ec_slave_config_t*,uint16_t,uint32_t,int32_t,uint32_t,int32_t){ return 0; }
static inline ec_domain_t* ecrt_master_create_domain(ec_master_t*){ return (ec_domain_t*)&_mobj; }
static inline int ecrt_domain_reg_pdo_entry_list(ec_domain_t*, const ec_pdo_entry_reg_t* r){
    _nreg=0; _noff=0;
    for (int i=0; r[i].offset; ++i){
        unsigned _ix=r[i].index; unsigned sz = (_ix==0x6040||_ix==0x6041||_ix==0x6060||_ix==0x6061||_ix==0x6071||_ix==0x6077)?2:4;
        *r[i].offset = _noff;
        _reg[_nreg].off=_noff; _reg[_nreg].slave=r[i].position; _reg[_nreg].idx=r[i].index; _nreg++;
        _noff += sz;
    }
    return 0;
}
static inline int ecrt_master_select_reference_clock(ec_master_t*, ec_slave_config_t*){ return 0; }
static inline int ecrt_master_activate(ec_master_t*){ return 0; }
static inline uint8_t* ecrt_domain_data(ec_domain_t*){ return _pd; }
static inline void ecrt_master_state(ec_master_t*, ec_master_state_t* m){ int up=0; for(int i=0;i<6;i++) if(_live(i)) up++;
    m->slaves_responding=(unsigned)up; m->al_states=(up==6)?0x08u:(up>0?0x0Au:0x02u); m->link_up=1; }
static inline void ecrt_domain_state(ec_domain_t*, ec_domain_state_t* d){ int up=0; for(int i=0;i<6;i++) if(_live(i)) up++;
    d->working_counter=(unsigned)(up*3); d->wc_state=(up==6)?EC_WC_COMPLETE:(up>0?EC_WC_INCOMPLETE:EC_WC_ZERO); d->redundancy_active=0; }
static inline void ecrt_master_receive(ec_master_t*){ _cyc++; }
// inputs (statusword/pos/vel) -> process image
static inline void ecrt_domain_process(ec_domain_t*){
    for (int i=0;i<_nreg;++i){ int s=_reg[i].slave; uint8_t* d=_pd+_reg[i].off;
        int live=_live(s);
        if (_reg[i].idx==0x6041) EC_WRITE_U16(d, live?_sd[s].sw:0);
        else if (_reg[i].idx==0x6064) EC_WRITE_S32(d, live?_sd[s].pos:0);
        else if (_reg[i].idx==0x606C) EC_WRITE_S32(d, live?_sd[s].vel:0);
        else if (_reg[i].idx==0x6077) EC_WRITE_S16(d, live?(int16_t)(_sd[s].vel/2000):0);   // measured torque ~ motion
    }
}
static inline void ecrt_domain_queue(ec_domain_t*){}
// outputs (controlword/target_velocity) -> drive model + step (dt=1ms)
static inline void ecrt_master_send(ec_master_t*){
    uint16_t cw[6]={}; int32_t tv[6]={}; int32_t tp[6]={}; bool hastp[6]={};
    for (int i=0;i<_nreg;++i){ int s=_reg[i].slave; uint8_t* d=_pd+_reg[i].off;
        if (_reg[i].idx==0x6040) cw[s]=EC_READ_U16(d);
        else if (_reg[i].idx==0x60FF) tv[s]=EC_READ_S32(d);
        else if (_reg[i].idx==0x607A){ tp[s]=EC_READ_S32(d); hastp[s]=true; }   // CSP target position
    }
    for (int s=0;s<6;++s){ if(!_live(s)) continue;
        switch (cw[s]) { case 0x06:_sd[s].sw=0x21;break; case 0x07:_sd[s].sw=0x23;break;
            case 0x0F:_sd[s].sw=0x27;break; case 0x80:_sd[s].sw=0x40;break; }
        // CSP(8): drive servoes to the streamed position setpoint and STOPS exactly on it (its own
        // critically-damped loop, modelled here as exact tracking of the 1 kHz setpoint -> no overshoot).
        // CSV(9): follow commanded velocity. CST(10)=freedrive: zero torque -> no self-motion.
        if (_sd[s].sw==0x27 && _sd[s].mode==8 && hastp[s]){ _sd[s].vel=(tp[s]-_sd[s].pos)*1000; _sd[s].pos=tp[s]; }
        else if (_sd[s].sw==0x27 && _sd[s].mode==9){ _sd[s].vel=tv[s]; _sd[s].pos += (int32_t)(tv[s]*0.001); }
        else if (_sd[s].sw==0x27 && _sd[s].mode==10){ _sd[s].vel=7777; }  // CST sentinel: torque mode active, no self-motion
        else _sd[s].vel=0;
    }
}
static inline void ecrt_master_application_time(ec_master_t*,uint64_t){}
static inline void ecrt_master_sync_reference_clock(ec_master_t*){}
static inline void ecrt_master_sync_slave_clocks(ec_master_t*){}
