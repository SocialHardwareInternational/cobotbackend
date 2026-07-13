"""shm_layout.py -- Python mirror of core/include/erm/shm_layout.hpp.

ctypes structures match the C++ packed layout byte-for-byte so the WebSocket
bridge can mmap the exact same /dev/shm block the control plane uses.

Verified sizes: CmdRegion=256 IkRegion=152 SpRegion=120 StateRegion=636 ShmBlock=2116
"""
import ctypes
import mmap
import os
import threading
import time

SHM_MAGIC = 0x45524F31  # 'ERO1'
DEFAULT_SHM_PATH = "/dev/shm/erobo10_shm"

# CmdType
CMD_NONE, CMD_MOVE_JOINT, CMD_MOVE_PTP, CMD_MOVE_LIN, CMD_STOP, CMD_HOLD, CMD_JOG, CMD_MOVE_P = 0, 1, 2, 3, 4, 5, 6, 7
CMD_ENABLE, CMD_DISABLE = 8, 9
CMD_FREEDRIVE_ON, CMD_FREEDRIVE_OFF = 10, 11
CMD_SET_PAYLOAD = 12
CMD_MOVE_C = 13
CMD_ECAT_RESET = 14
CMD_SET_TCP = 15
CMD_SET_COLLISION = 16
CMD_SET_CONTACT = 17
CMD_SET_SIGN = 18
CMD_PAUSE = 19
CMD_RESUME = 20
MAX_WP = 16
JOINT_EFFORT = [281.0, 281.0, 140.0, 51.0, 51.0, 51.0]   # Nm, eRob avg-load max (142H120/110H120/80H100)
MODE_NAMES = {0: "IDLE", 1: "MOVING", 2: "STOPPING", 3: "ESTOP", 4: "HOLD", 5: "FREEDRIVE"}

u32 = ctypes.c_uint32
f64 = ctypes.c_double


class CmdRegion(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("cmd_seq", u32), ("ack_seq", u32), ("type", u32), ("frame", u32),
                ("target_q", f64 * 6), ("target_pose", f64 * 7), ("speed", f64),
                ("estop_req", u32), ("enable_req", u32), ("reset_req", u32), ("_pad2", u32),
                ("payload", f64), ("accel", f64),
                ("tcp", f64 * 7), ("payload_cog", f64 * 3),
                ("contact_sens", f64), ("contact_on", u32), ("contact_test", u32)]


class IkRegion(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("ik_seq", u32), ("ok", u32), ("move_type", u32), ("src_cmd_seq", u32),
                ("target_q", f64 * 6), ("target_pose", f64 * 7), ("speed", f64), ("pos_err", f64), ("grav_util", f64), ("accel", f64)]


class SpRegion(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("sp_seq", u32), ("valid", u32), ("moving", u32), ("traj_id", u32),
                ("q_cmd", f64 * 6), ("qd_cmd", f64 * 6), ("progress", f64), ("speed_scale", f64)]


class StateRegion(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("state_seq", u32), ("mode", u32), ("estop", u32), ("enabled", u32),
                ("t", f64), ("q", f64 * 6), ("qd", f64 * 6),
                ("flange_pos", f64 * 3), ("flange_quat", f64 * 4), ("manip", f64),
                ("torque", f64 * 6),
                ("temp", f64 * 6), ("current", f64 * 6), ("voltage", f64 * 6),
                ("torque_meas", f64 * 6), ("brake", u32 * 6),
                ("coll_dist", f64), ("coll_i", u32), ("coll_j", u32),
                ("coll_warn", u32), ("coll_stop", u32), ("singular", u32),
                ("status", ctypes.c_char * 48),
                ("tcp_pos", f64 * 3), ("tcp_quat", f64 * 4),
                ("ext_torque", f64 * 6), ("contact", u32), ("contact_joint", u32),
                ("tcp_speed", f64), ("elbow_speed", f64), ("ext_force", f64 * 3), ("ext_force_mag", f64),
                ("safety_zone", u32), ("safety_code", u32), ("safety_stop", u32), ("speed_pct", u32),
                ("loop_jitter_us", f64), ("loop_overruns", u32), ("_pad3", u32)]


class PathRegion(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("path_seq", u32), ("npts", u32), ("_p0", u32), ("_p1", u32),
                ("blend", f64), ("tool_speed", f64), ("tool_acc", f64), ("_pad", f64),
                ("pts", f64 * (MAX_WP * 7))]


class SafetyPlaneShm(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("mode", u32), ("_pad", u32), ("p", f64 * 3), ("n", f64 * 3)]


class SafetyRegion(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("safety_seq", u32), ("enabled", u32), ("speed_override", f64),
                ("tcp_speed_max", f64), ("tcp_speed_reduced", f64), ("tcp_force_max", f64),
                ("elbow_speed_max", f64), ("reach_max", f64), ("z_min", f64), ("z_max", f64),
                ("base_cyl_r", f64), ("nplanes", u32), ("_pad", u32), ("planes", SafetyPlaneShm * 6)]


class IoRegion(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("io_seq", u32), ("do_seq", u32), ("do_cmd", u32), ("do_state", u32),
                ("di", u32), ("di_sim", u32), ("ao_cmd", f64 * 2), ("ao_state", f64 * 2), ("ai", f64 * 2)]


class ShmBlock(ctypes.Structure):
    _pack_ = 1
    _fields_ = [("magic", u32), ("version", u32),
                ("cmd", CmdRegion), ("ik", IkRegion), ("sp", SpRegion), ("st", StateRegion),
                ("path", PathRegion), ("safety", SafetyRegion), ("io", IoRegion)]


assert ctypes.sizeof(CmdRegion) == 256, ctypes.sizeof(CmdRegion)
assert ctypes.sizeof(IkRegion) == 152, ctypes.sizeof(IkRegion)
assert ctypes.sizeof(SpRegion) == 128, ctypes.sizeof(SpRegion)
assert ctypes.sizeof(StateRegion) == 716, ctypes.sizeof(StateRegion)
assert ctypes.sizeof(PathRegion) == 944, ctypes.sizeof(PathRegion)
assert ctypes.sizeof(SafetyRegion) == 424, ctypes.sizeof(SafetyRegion)
assert ctypes.sizeof(IoRegion) == 72, ctypes.sizeof(IoRegion)
assert ctypes.sizeof(ShmBlock) == 2700, ctypes.sizeof(ShmBlock)

SAFETY_CODE_NAMES = {0: "ok", 1: "safety plane", 2: "max reach", 3: "workspace floor",
                     4: "workspace ceiling", 5: "base keep-out", 6: "TCP overspeed",
                     7: "TCP force limit", 8: "elbow overspeed", 9: "joint overspeed"}
ZONE_NAMES = {0: "normal", 1: "reduced", 2: "forbidden"}


class ShmClient:
    def __init__(self, path=DEFAULT_SHM_PATH, wait_s=15.0):
        deadline = time.time() + wait_s
        while True:
            if os.path.exists(path) and os.path.getsize(path) >= ctypes.sizeof(ShmBlock):
                break
            if time.time() > deadline:
                raise RuntimeError(f"shm '{path}' not ready -- start control_node first")
            time.sleep(0.1)
        self._fd = os.open(path, os.O_RDWR)
        self._tx = threading.RLock()      # one writer at a time into the command/path regions
        self._mm = mmap.mmap(self._fd, ctypes.sizeof(ShmBlock))
        self.blk = ShmBlock.from_buffer(self._mm)
        self._payload = 0.0
        self._tcp = [0.0,0.0,0.0, 1.0,0.0,0.0,0.0]   # x,y,z, qw,qx,qy,qz (identity)
        self._cog = [0.0,0.0,0.0]
        self._contact_sens = 0.5
        self._estop_ctr = 0
        self._reset_ctr = 0
        self._t_commit = 0.0
        self._contact_on = 0        # physical-contact detection OFF by default (opt-in). Avoids false drive-offs on an uncalibrated arm; hardware E-STOP/STO is independent.
        self._contact_test = 0
        for _ in range(150):           # wait for control node to publish magic
            if self.blk.magic == SHM_MAGIC:
                break
            time.sleep(0.1)

    def read_state(self, retries=64):
        s = self.blk.st
        snap = None
        for _ in range(retries):
            s1 = s.state_seq
            if s1 & 1:
                continue
            snap = dict(
                seq=int(s1), mode=int(s.mode), mode_name=MODE_NAMES.get(int(s.mode), "?"),
                estop=bool(s.estop), enabled=bool(s.enabled), t=float(s.t),
                q=list(s.q), qd=list(s.qd),
                flange_pos=list(s.flange_pos), flange_quat=list(s.flange_quat),
                manip=float(s.manip), torque=[float(s.torque[i]) for i in range(6)],
                temp=[float(s.temp[i]) for i in range(6)], current=[float(s.current[i]) for i in range(6)],
                voltage=[float(s.voltage[i]) for i in range(6)], torque_meas=[float(s.torque_meas[i]) for i in range(6)],
                brake=[bool(s.brake[i]) for i in range(6)],
                coll_dist=float(s.coll_dist), coll_i=int(s.coll_i), coll_j=int(s.coll_j),
                coll_warn=bool(s.coll_warn), coll_stop=bool(s.coll_stop), singular=bool(s.singular),
                moving=bool(self.blk.sp.moving), progress=float(self.blk.sp.progress),
                status=s.status.decode("utf-8", "ignore"),
                tcp_pos=list(s.tcp_pos), tcp_quat=list(s.tcp_quat),
                ext_torque=[float(s.ext_torque[i]) for i in range(6)],
                contact=bool(s.contact), contact_joint=int(s.contact_joint),
                tcp_speed=float(s.tcp_speed), elbow_speed=float(s.elbow_speed),
                ext_force=[float(s.ext_force[i]) for i in range(3)], ext_force_mag=float(s.ext_force_mag),
                safety_zone=int(s.safety_zone), safety_code=int(s.safety_code),
                safety_stop=bool(s.safety_stop), speed_pct=int(s.speed_pct),
                loop_jitter_us=float(s.loop_jitter_us), loop_overruns=int(s.loop_overruns),
            )
            if s.state_seq == s1:
                return snap
        if snap is None:
            snap = dict(seq=-1, mode=int(s.mode), mode_name=MODE_NAMES.get(int(s.mode), "?"),
                        estop=bool(s.estop), enabled=bool(s.enabled), t=float(s.t),
                        q=list(s.q), qd=list(s.qd), flange_pos=list(s.flange_pos),
                        flange_quat=list(s.flange_quat), manip=float(s.manip),
                        torque=list(s.torque), temp=list(s.temp), current=list(s.current),
                        voltage=list(s.voltage), torque_meas=list(s.torque_meas),
                        brake=[bool(b) for b in s.brake], coll_dist=float(s.coll_dist),
                        coll_i=int(s.coll_i), coll_j=int(s.coll_j), coll_warn=bool(s.coll_warn),
                        coll_stop=bool(s.coll_stop), singular=bool(s.singular),
                        moving=bool(self.blk.sp.moving), progress=float(self.blk.sp.progress),
                        status=s.status.decode("utf-8", "ignore"), tcp_pos=list(s.tcp_pos),
                        tcp_quat=list(s.tcp_quat), ext_torque=list(s.ext_torque),
                        contact=bool(s.contact), contact_joint=int(s.contact_joint),
                        tcp_speed=float(s.tcp_speed), elbow_speed=float(s.elbow_speed),
                        ext_force=list(s.ext_force), ext_force_mag=float(s.ext_force_mag),
                        safety_zone=int(s.safety_zone), safety_code=int(s.safety_code),
                        safety_stop=bool(s.safety_stop), speed_pct=int(s.speed_pct),
                        loop_jitter_us=float(s.loop_jitter_us), loop_overruns=int(s.loop_overruns))
        return snap

    def send_command(self, ctype, target_q=None, target_pose=None, speed=1.0,
                     estop_req=0, reset_req=0, frame=0, timeout_s=1.0, accel=1.0):
        with self._tx:
            return self._send_command_locked(ctype, target_q, target_pose, speed,
                                             estop_req, reset_req, frame, timeout_s, accel)

    def _send_command_locked(self, ctype, target_q=None, target_pose=None, speed=1.0,
                             estop_req=0, reset_req=0, frame=0, timeout_s=1.0, accel=1.0):
        # Guarantee >= 3 ms between command commits so the 1 kHz control node samples
        # EVERY commit (two back-to-back commands can otherwise share one cycle and
        # the earlier one becomes invisible -- e.g. reset immediately followed by enable).
        dt = time.time() - self._t_commit
        if dt < 0.003:
            time.sleep(0.003 - dt)
        c = self.blk.cmd
        e = int(c.cmd_seq) & ~1          # current even
        c.cmd_seq = e | 1                # odd: write in progress
        c.type = ctype; c.speed = float(speed); c.frame = int(frame); c.accel = float(accel)
        # e-stop / reset are EDGE requests carried as monotonic counters: the control
        # node acts on a counter CHANGE, so a request can never be missed or replayed.
        if estop_req:
            self._estop_ctr += 1
        if reset_req:
            self._reset_ctr += 1
        c.estop_req = int(self._estop_ctr); c.reset_req = int(self._reset_ctr)
        c.payload = float(self._payload)
        for i in range(7): c.tcp[i] = float(self._tcp[i])
        for i in range(3): c.payload_cog[i] = float(self._cog[i])
        c.contact_sens = float(self._contact_sens); c.contact_on = int(self._contact_on)
        c.contact_test = int(self._contact_test); self._contact_test = 0
        for i in range(6): c.target_q[i] = float(target_q[i]) if target_q else 0.0
        for i in range(7): c.target_pose[i] = float(target_pose[i]) if target_pose else 0.0
        new = (e | 1) + 1                # even: committed
        c.cmd_seq = new
        self._t_commit = time.time()
        if ctype in (CMD_MOVE_JOINT, CMD_MOVE_PTP, CMD_MOVE_LIN, CMD_MOVE_P, CMD_MOVE_C):
            dl = time.time() + timeout_s
            while time.time() < dl:
                if int(c.ack_seq) == new:
                    return dict(ok=bool(self.blk.ik.ok), pos_err=float(self.blk.ik.pos_err), grav_util=float(self.blk.ik.grav_util), cmd_seq=new)
                time.sleep(0.001)
            return dict(ok=False, pos_err=0.0, cmd_seq=new, timeout=True)
        return dict(ok=True, cmd_seq=new)

    def set_payload(self, kg, cog=None):
        self._payload = float(kg)
        if cog is not None:
            self._cog = [float(cog[0]), float(cog[1]), float(cog[2])]
        return self.send_command(CMD_SET_PAYLOAD)

    def tcp_active(self):
        """True if a real tool transform is set (non-identity) -- i.e. a TCP
        offset from the flange face. Used to decide whether stored waypoints are
        replayed to the TOOL TIP (honouring the TCP) or as raw joint angles."""
        p = self._tcp
        pos_off = (abs(p[0]) + abs(p[1]) + abs(p[2])) > 1e-6
        rot_off = ((abs(p[3]) - 1.0) ** 2 + p[4]*p[4] + p[5]*p[5] + p[6]*p[6]) > 1e-9
        return bool(pos_off or rot_off)

    def set_tcp(self, pos, quat, payload=None, cog=None):
        """pos=[x,y,z] (m), quat=[qw,qx,qy,qz] tool transform T_flange->tcp."""
        self._tcp = [float(pos[0]),float(pos[1]),float(pos[2]),
                     float(quat[0]),float(quat[1]),float(quat[2]),float(quat[3])]
        if payload is not None: self._payload = float(payload)
        if cog is not None: self._cog = [float(cog[0]),float(cog[1]),float(cog[2])]
        return self.send_command(CMD_SET_TCP)

    def set_contact(self, on=None, sensitivity=None):
        if on is not None: self._contact_on = 1 if on else 0
        if sensitivity is not None: self._contact_sens = max(0.0, min(1.0, float(sensitivity)))
        return self.send_command(CMD_SET_CONTACT)

    def contact_poke(self, joint):
        """SIM demo: inject a synthetic external torque on `joint` (1..6) to trip detection."""
        self._contact_test = int(joint)
        return self.send_command(CMD_SET_CONTACT)

    def send_path(self, waypoints, blend=0.05, tool_speed=0.25, tool_acc=1.2):
      with self._tx:
        pr = self.blk.path
        e = int(pr.path_seq) & ~1
        pr.path_seq = e | 1
        n = min(len(waypoints), MAX_WP)
        pr.npts = n; pr.blend = float(blend); pr.tool_speed = float(tool_speed); pr.tool_acc = float(tool_acc)
        for i in range(n):
            for j in range(7):
                pr.pts[i*7 + j] = float(waypoints[i][j])
        pr.path_seq = (e | 1) + 1
        return self.send_command(CMD_MOVE_P)

    def send_circular(self, via, end, speed=1.0, full=False, accel=1.0):
      """MoveC: PathRegion pts[0]=via, pts[1]=end (each [x,y,z,qw,qx,qy,qz]); start = current pose."""
      with self._tx:
        pr = self.blk.path
        e = int(pr.path_seq) & ~1
        pr.path_seq = e | 1
        pr.npts = 2
        pr.blend = 1.0 if full else 0.0                  # MoveC: blend>0.5 => full 360 deg circle
        for j in range(7):
            pr.pts[0*7 + j] = float(via[j]); pr.pts[1*7 + j] = float(end[j])
        pr.path_seq = (e | 1) + 1
        return self.send_command(CMD_MOVE_C, speed=speed, accel=accel)

    # ---- v2: safety configuration (this client is the single writer) ----
    def read_safety(self):
        r = self.blk.safety
        return dict(enabled=int(r.enabled), speed_override=float(r.speed_override),
                    tcp_speed_max=float(r.tcp_speed_max), tcp_speed_reduced=float(r.tcp_speed_reduced),
                    tcp_force_max=float(r.tcp_force_max), elbow_speed_max=float(r.elbow_speed_max),
                    reach_max=float(r.reach_max), z_min=float(r.z_min), z_max=float(r.z_max),
                    base_cyl_r=float(r.base_cyl_r),
                    planes=[dict(mode=int(r.planes[i].mode),
                                 p=[float(v) for v in r.planes[i].p],
                                 n=[float(v) for v in r.planes[i].n])
                            for i in range(int(min(r.nplanes, 6)))])

    def write_safety(self, cfg):
        """cfg: dict with any of the safety fields; unspecified fields keep their value."""
        r = self.blk.safety
        cur = self.read_safety()
        cur.update({k: v for k, v in cfg.items() if v is not None})
        e = int(r.safety_seq) & ~1
        r.safety_seq = e | 1
        r.enabled = 1 if cur.get("enabled", 1) else 0
        r.speed_override = max(0.05, min(1.0, float(cur.get("speed_override", 1.0))))
        r.tcp_speed_max = max(0.05, float(cur.get("tcp_speed_max", 1.5)))
        r.tcp_speed_reduced = max(0.02, float(cur.get("tcp_speed_reduced", 0.25)))
        r.tcp_force_max = max(10.0, float(cur.get("tcp_force_max", 150.0)))
        r.elbow_speed_max = max(0.05, float(cur.get("elbow_speed_max", 2.0)))
        r.reach_max = max(0.0, float(cur.get("reach_max", 0.0)))
        r.z_min = float(cur.get("z_min", -1e9)); r.z_max = float(cur.get("z_max", 1e9))
        r.base_cyl_r = max(0.0, float(cur.get("base_cyl_r", 0.0)))
        planes = (cur.get("planes") or [])[:6]
        r.nplanes = len(planes)
        for i, pl in enumerate(planes):
            r.planes[i].mode = int(pl.get("mode", 0))
            n = [float(v) for v in (list(pl.get("n", [0, 0, 1])) + [0, 0, 1])[:3]]
            mag = (n[0]**2 + n[1]**2 + n[2]**2) ** 0.5 or 1.0
            for k in range(3):
                r.planes[i].p[k] = float((list(pl.get("p", [0, 0, 0])) + [0, 0, 0])[k])
                r.planes[i].n[k] = n[k] / mag
        r.safety_seq = (e | 1) + 1
        return self.read_safety()

    def set_speed_override(self, frac):
        return self.write_safety({"speed_override": float(frac)})

    # ---- v2: digital / analog I/O ----
    def read_io(self):
        io = self.blk.io
        return dict(do_cmd=int(io.do_cmd), do_state=int(io.do_state), di=int(io.di),
                    ao=[float(io.ao_state[0]), float(io.ao_state[1])],
                    ai=[float(io.ai[0]), float(io.ai[1])])

    def set_do(self, index=None, value=None, mask=None):
        io = self.blk.io
        cur = int(io.do_cmd)
        if mask is not None:
            cur = int(mask) & 0xFFFF
        elif index is not None:
            b = 1 << int(index)
            cur = (cur | b) if value else (cur & ~b)
        io.do_cmd = cur
        io.do_seq = int(io.do_seq) + 1
        return cur

    def set_ao(self, index, volts):
        io = self.blk.io
        io.ao_cmd[int(index)] = float(volts)
        io.do_seq = int(io.do_seq) + 1

    def force_di(self, index=None, value=None, mask=None):
        """Controller-level inputs (PLC handshake / simulation)."""
        io = self.blk.io
        cur = int(io.di_sim)
        if mask is not None:
            cur = int(mask) & 0xFFFF
        elif index is not None:
            b = 1 << int(index)
            cur = (cur | b) if value else (cur & ~b)
        io.di_sim = cur
        return cur

    def close(self):
        self.blk = None
        self._mm.close()
        os.close(self._fd)
