// erm/shm_layout.hpp -- shared-memory contract for the erobo10 control plane.
//
// One mmap-backed block shared by all control-box modules (NOT the UI):
//
//   ws_bridge  --cmd-->  ik_solver  --ik-->  motion_planner  --sp-->  control_node
//        ^                                                                |
//        +-------------------------- state <------------------------------+
//
// Each region is protected by its own seqlock counter (writer bumps it odd before
// writing, even after; readers retry on odd/changed) so there is never a torn
// read and never a blocking lock in the 1 kHz path. This replaces the UDP
// transport that introduced jitter.
//
// The Python WebSocket bridge mirrors this layout byte-for-byte (bridge/shm_layout.py).
#pragma once
#include <cstdint>

namespace erm {

constexpr uint32_t SHM_MAGIC = 0x45524F31;   // 'ERO1'
constexpr uint32_t SHM_VERSION = 2;
constexpr int SJ = 6;                         // joints (kept independent of NJ for the wire)

// Goal types (UI -> ik_solver).
enum CmdType : uint32_t {
    CMD_NONE = 0,
    CMD_MOVE_JOINT = 1,   // target_q  : synchronized jerk-limited joint move
    CMD_MOVE_PTP   = 2,   // target_pose: IK once, then joint move
    CMD_MOVE_LIN   = 3,   // target_pose: straight-line Cartesian move
    CMD_STOP       = 4,   // smooth decel to rest
    CMD_HOLD       = 5,   // hold current setpoint
    CMD_JOG        = 6,   // velocity jog: frame + target_q[0..5] = velocities
    CMD_MOVE_P     = 7,   // process move: PathRegion waypoints, constant speed + blends
    CMD_ENABLE     = 8,   // power-enable the drives (CiA-402 -> Operation Enabled)
    CMD_DISABLE    = 9,   // power-disable the drives (hold, brakes engaged)
    CMD_FREEDRIVE_ON  = 10,  // hand-guide / drag-teach: brakes off, zero-velocity, no servo
    CMD_FREEDRIVE_OFF = 11,  // leave free-drive, return to position hold
    CMD_SET_PAYLOAD   = 12,  // set tool/payload mass [kg] for the torque model
    CMD_MOVE_C        = 13,  // circular arc: PathRegion pts[0]=via, pts[1]=end (start = current)
    CMD_ECAT_RESET    = 14,  // restart the EtherCAT connection: clear faults + re-bring-up all slaves
    CMD_SET_TCP       = 15,  // set tool center point transform + payload mass + CoG
    CMD_SET_COLLISION = 16,  // enable(1)/disable(0) the self-collision monitor (frame field)
    CMD_SET_CONTACT   = 17,  // external-contact detector: carries contact_sens/on/test (no motion)
    CMD_SET_SIGN      = 18,  // set per-joint direction sign (+1/-1) LIVE; carries the 6 signs in target_q[6]
    CMD_PAUSE         = 19,  // feed-hold: decelerate to a stop ON the path and hold (resumable, no replan)
    CMD_RESUME        = 20,  // release a feed-hold: ramp velocity back up along the SAME trajectory
};

// Move types planner understands (ik_solver -> motion_planner).
enum MoveType : uint32_t { MV_NONE = 0, MV_JOINT = 1, MV_LIN = 2, MV_P = 3, MV_C = 4 };
constexpr int MAX_WP = 16;  // max MoveP waypoints

// Controller mode (control_node -> everyone).
enum Mode : uint32_t { MODE_IDLE = 0, MODE_MOVING = 1, MODE_STOPPING = 2, MODE_ESTOP = 3, MODE_HOLD = 4, MODE_FREEDRIVE = 5 };

#pragma pack(push, 1)

// UI command (bridge writes; ik_solver reads; control reads the *_req flags).
struct CmdRegion {
    uint32_t cmd_seq;     // bridge bumps to submit a new goal
    uint32_t ack_seq;     // ik_solver echoes when consumed
    uint32_t type;        // CmdType
    uint32_t frame;       // jog frame: 0 joint, 1 base, 2 tool
    double   target_q[SJ];
    double   target_pose[7];  // pos xyz + quat (w,x,y,z)
    double   speed;           // 0..1 scale of nominal limits
    uint32_t estop_req;       // latched protective stop request
    uint32_t enable_req;      // 1 enable drives / 0 disable
    uint32_t reset_req;       // clear estop
    uint32_t _pad2;
    double   payload;         // tool/payload mass [kg] for inverse-dynamics torque
    double   accel;           // 0..1 scale of nominal acceleration/jerk limits (UI accel control)
    double   tcp[7];          // tool transform T_flange->tcp: pos xyz + quat (w,x,y,z); zero/identity = flange
    double   payload_cog[3];  // tool/payload center of gravity in the flange frame [m]
    double   contact_sens;    // external-contact detector sensitivity 0..1 (higher = lighter touch trips)
    uint32_t contact_on;      // 1 = physical-contact (collision) detection enabled
    uint32_t contact_test;    // SIM only: joint 1..6 to inject a synthetic external torque (0 = none)
};

// IK output (ik_solver writes; motion_planner reads).
struct IkRegion {
    uint32_t ik_seq;          // bumped on each new solved goal
    uint32_t ok;              // 1 if reachable / solved
    uint32_t move_type;       // MoveType
    uint32_t src_cmd_seq;     // which cmd this answers
    double   target_q[SJ];    // for MV_JOINT
    double   target_pose[7];  // for MV_LIN
    double   speed;
    double   pos_err;         // IK residual (m), diagnostic
    double   grav_util;       // gravity-hold torque / effort at the target (>1 = can't hold)
    double   accel;           // 0..1 acceleration scale forwarded to the planner
};

// Setpoint stream (motion_planner writes at 1 kHz; control_node reads).
struct SpRegion {
    uint32_t sp_seq;          // seqlock
    uint32_t valid;
    uint32_t moving;
    uint32_t traj_id;         // increments per planned trajectory
    double   q_cmd[SJ];
    double   qd_cmd[SJ];
    double   progress;        // 0..1 of current trajectory
    double   speed_scale;     // v2: effective speed factor the planner is applying (override x zones)
};

// Robot state (control_node writes; everyone reads).
struct StateRegion {
    uint32_t state_seq;       // seqlock
    uint32_t mode;            // Mode
    uint32_t estop;
    uint32_t enabled;
    double   t;               // control uptime (s)
    double   q[SJ];           // measured joint positions
    double   qd[SJ];          // measured joint velocities
    double   flange_pos[3];
    double   flange_quat[4];  // w,x,y,z
    double   manip;           // manipulability (singularity proximity)
    double   torque[SJ];      // estimated joint torque [Nm] (inverse dynamics)
    // --- measured drive telemetry (eRob CiA-402 objects; see Feedback.cpp map) ---
    double   temp[SJ];        // drive temperature [C]        (0x22A2 * 0.1)
    double   current[SJ];     // motor current [A]            (0x6078 * 0.001)
    double   voltage[SJ];     // DC-link voltage [V]          (0x6079 * 0.001)
    double   torque_meas[SJ]; // measured torque [% of rated] (0x6077 * 0.1)
    uint32_t brake[SJ];       // brake released (1) / engaged (0)  (0x4602)
    // --- safety monitor (self-collision proximity + singularity) ---
    double   coll_dist;       // min self-collision clearance [m], predicted; <=0 = modelled contact
    uint32_t coll_i;          // colliding capsule pair (0 base,1 upper,2 forearm,3 wrist,4 tool)
    uint32_t coll_j;
    uint32_t coll_warn;       // 1 = within warning distance
    uint32_t coll_stop;       // 1 = auto-disabled by the collision monitor (latched until re-enable)
    uint32_t singular;        // 1 = near a kinematic singularity (low manipulability)
    char     status[48];
    double   tcp_pos[3];      // TCP position in base frame [m] (flange * tool transform)
    double   tcp_quat[4];     // TCP orientation in base frame (w,x,y,z)
    double   ext_torque[SJ];  // estimated EXTERNAL joint torque [Nm] (measured - model): contact residual
    uint32_t contact;         // 1 = physical contact detected -> protective stop (latched until re-enable)
    uint32_t contact_joint;   // joint index (0..5) with the largest contact residual
    // --- v2: configurable safety monitor + runtime health ---
    double   tcp_speed;       // measured TCP linear speed [m/s] (Jacobian * measured qd)
    double   elbow_speed;     // measured elbow speed [m/s]
    double   ext_force[3];    // estimated external force at the TCP [N], base frame
    double   ext_force_mag;   // |ext_force| [N]
    uint32_t safety_zone;     // SafetyZone: 0 normal, 1 reduced, 2 forbidden (measured TCP)
    uint32_t safety_code;     // SafetyCode of the latched safety stop (0 = none)
    uint32_t safety_stop;     // 1 = protective stop latched by the safety monitor (until re-enable)
    uint32_t speed_pct;       // effective global speed override applied by the planner [%]
    double   loop_jitter_us;  // control-loop max |wake error| over the last second [us]
    uint32_t loop_overruns;   // cycles that overran the period since start
    uint32_t _pad3;
};

// MoveP path (bridge writes; ik_solver + motion_planner read).
struct PathRegion {
    uint32_t path_seq;        // seqlock
    uint32_t npts;            // number of waypoints (<= MAX_WP)
    uint32_t _p0, _p1;
    double   blend;           // blend distance d (m): corner rounding
    double   tool_speed;      // m/s, constant cruise on straight parts
    double   tool_acc;        // m/s^2
    double   _pad;
    double   pts[MAX_WP * 7]; // each waypoint: x,y,z, qw,qx,qy,qz
};

// v2: safety configuration (controller writes; planner + control + ik read).
// Mirrors erm::SafetyConfig field-for-field (see safety.hpp for semantics).
struct SafetyPlaneShm { uint32_t mode; uint32_t _pad; double p[3]; double n[3]; };
struct SafetyRegion {
    uint32_t safety_seq;      // seqlock
    uint32_t enabled;         // zone system on/off (limits always monitored)
    double   speed_override;  // global speed slider 0.05..1.0 (applied live by the planner)
    double   tcp_speed_max;   // m/s
    double   tcp_speed_reduced;
    double   tcp_force_max;   // N
    double   elbow_speed_max; // m/s
    double   reach_max;       // m (0 = off)
    double   z_min, z_max;    // workspace floor / ceiling [m]
    double   base_cyl_r;      // m (0 = off)
    uint32_t nplanes;
    uint32_t _pad;
    SafetyPlaneShm planes[6]; // MAX_SAFETY_PLANES
};

// v2: digital / analog I/O (controller commands DO/AO; control node applies + publishes DI/AI).
struct IoRegion {
    uint32_t io_seq;          // seqlock (control node writes di/ai/do_state)
    uint32_t do_seq;          // controller bumps to (re)apply do_cmd/ao_cmd
    uint32_t do_cmd;          // desired digital outputs, bitmask DO0..DO15
    uint32_t do_state;        // applied digital outputs
    uint32_t di;              // digital inputs DI0..DI15
    uint32_t di_sim;          // SIM only: forced inputs (controller writes for program testing)
    double   ao_cmd[2];       // desired analog outputs [V]
    double   ao_state[2];
    double   ai[2];           // analog inputs [V]
};

struct ShmBlock {
    uint32_t magic;
    uint32_t version;
    CmdRegion cmd;
    IkRegion ik;
    SpRegion sp;
    StateRegion st;
    PathRegion path;
    SafetyRegion safety;
    IoRegion io;
};
#pragma pack(pop)

}  // namespace erm
