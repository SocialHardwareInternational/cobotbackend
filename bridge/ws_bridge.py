#!/usr/bin/env python3
"""ws_bridge.py -- WebSocket <-> shared-memory bridge for the erobo10 control box.

  React/Electron pendant  --(JSON / WebSocket)-->  this bridge
                          <--(state @ 50 Hz)-------
  this bridge  --(POSIX shared memory)-->  ik_solver / motion_planner / control_node

Non-real-time: it only mmaps the shared block, translates JSON to commands, and
streams state. The real-time motion runs entirely in the C++ control plane.

Protocol (client -> server), each may carry an "id" echoed back on the ack:
  { "cmd": "move_joint", "q": [6], "speed": 0.5 }
  { "cmd": "move_ptp", "pos": [x,y,z], "quat": [w,x,y,z], "speed": 0.5 }
  { "cmd": "move_ptp", "pos": [x,y,z], "rpy": [r,p,y] }       # rpy accepted too
  { "cmd": "move_lin", "pos": [...], "rpy"/"quat": [...] }
  { "cmd": "stop" } | { "cmd": "hold" } | { "cmd": "estop" } | { "cmd": "reset" }
  { "cmd": "get_state" }
Server -> client: {"type":"state",...} (broadcast), {"type":"ack",...}, "welcome", "error".
"""
import argparse
import asyncio
import json
import math
import time
import os

import websockets

from waypoints import WaypointStore
WP = WaypointStore()
from programs import ProgramStore, validate_step
PROGS = ProgramStore()
from shm_layout import (ShmClient, CMD_MOVE_JOINT, CMD_MOVE_PTP, CMD_MOVE_LIN,
                        CMD_STOP, CMD_HOLD, CMD_JOG, CMD_MOVE_P, CMD_ENABLE, CMD_DISABLE,
                        CMD_FREEDRIVE_ON, CMD_FREEDRIVE_OFF, CMD_SET_PAYLOAD, CMD_ECAT_RESET, CMD_SET_TCP,
                        CMD_SET_COLLISION, CMD_SET_SIGN, CMD_PAUSE, CMD_RESUME, JOINT_EFFORT, SAFETY_CODE_NAMES, ZONE_NAMES)
from tcp_config import TcpStore, ToolLibrary, solve_tcp_position, solve_tcp_orientation
TCP = TcpStore()
TOOLS = ToolLibrary(active_store=TCP)
_SAFETY_FILE = os.path.join(os.environ.get("EROBO_RUN_DIR") or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "run"), "safety.json")
EVENT_SINK = None       # controller daemon installs a callable(level, source, code, message, data)
PROGRAM_STATUS = {"running": False, "id": None, "name": None, "step": -1, "nsteps": 0, "cycle": 0}


def _sink(level, code, message, data=None):
    if EVENT_SINK:
        try: EVENT_SINK(level, "program", code, message, data)
        except Exception: pass


def load_safety_file():
    try:
        with open(_SAFETY_FILE) as f:
            return json.load(f)
    except Exception:
        return None


def save_safety_file(cfg):
    os.makedirs(os.path.dirname(_SAFETY_FILE), exist_ok=True)
    tmp = _SAFETY_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(cfg, f, indent=1)
    os.replace(tmp, _SAFETY_FILE)
import writing
import planes
PL = planes.PlaneStore()
_READY_FILE = os.path.join(os.environ.get("EROBO_RUN_DIR") or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "run"), "ready_pose.json")
_CALIB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "run", "calibration.txt")
def _load_signs():
    try:
        for line in open(_CALIB_FILE):
            p = line.split()
            if p and p[0] == "sign":
                return [1 if float(x) >= 0 else -1 for x in p[1:7]]
    except Exception:
        pass
    return [1, 1, 1, 1, 1, 1]
def _load_offsets():
    try:
        for line in open(_CALIB_FILE):
            p = line.split()
            if p and p[0] == "offset":
                return [float(x) for x in p[1:7]]
    except Exception:
        pass
    return [0, 0, 0, 0, 0, 0]
def _save_calib(signs, offsets):
    os.makedirs(os.path.dirname(_CALIB_FILE), exist_ok=True)
    with open(_CALIB_FILE, "w") as f:
        f.write("# erobo10 joint calibration -- per-joint direction. Edit from the UI (\u00b11 toggles) or here.\n")
        f.write("# sign: 1 or -1 per joint J1..J6 ; offset: degrees per joint J1..J6\n")
        f.write("sign    " + " ".join("%2d" % int(s) for s in signs) + "\n")
        f.write("offset  " + " ".join("%g" % o for o in offsets) + "\n")
def _load_ready():
    try:
        with open(_READY_FILE) as f: d = json.load(f)
        q = [float(v) for v in d.get("q", [])]
        return q if len(q) == 6 else None
    except Exception:
        return None

clients = set()
cmd_lock = asyncio.Lock()
_prog_task = None      # the running waypoint-program task (one robot, one program)
_prog_paused = False   # play/pause: while True the running waypoint program holds at the next waypoint


def rpy_to_quat(r, p, y):
    cr, sr = math.cos(r/2), math.sin(r/2)
    cp, sp = math.cos(p/2), math.sin(p/2)
    cy, sy = math.cos(y/2), math.sin(y/2)
    return [cr*cp*cy + sr*sp*sy, sr*cp*cy - cr*sp*sy,
            cr*sp*cy + sr*cp*sy, cr*cp*sy - sr*sp*cy]


def pose_from_msg(m):
    pos = m.get("pos", [0, 0, 0])
    if "quat" in m:
        q = m["quat"]
    elif "rpy" in m:
        q = rpy_to_quat(*m["rpy"])
    else:
        q = [1, 0, 0, 0]
    return [float(pos[0]), float(pos[1]), float(pos[2]),
            float(q[0]), float(q[1]), float(q[2]), float(q[3])]


async def emit_all(ws, obj):
    """Send to the requesting socket AND every other connected client (a program
    started from one pendant is visible on all of them), and mirror into the event log."""
    raw = json.dumps(obj)
    sent = set()
    if ws is not None:
        try: await ws.send(raw); sent.add(ws)
        except Exception: pass
    for c in list(clients):
        if c in sent: continue
        try: await c.send(raw)
        except Exception: clients.discard(c)
    if obj.get("type") == "program":
        ev = obj.get("event")
        if ev == "error": _sink("alarm", "PROGRAM_ERROR", obj.get("message", ""), obj)
        elif ev in ("start", "done", "aborted", "stopped"): _sink("info", "PROGRAM_" + ev.upper(), obj.get("name") or "", obj)


def state_msg(s):
    st = s.get("status", "")
    jop = [True] * 6
    if "op=" in st:
        bits = st.split("op=", 1)[1].strip()[:6]
        for i, ch in enumerate(bits):
            jop[i] = (ch == "1")
    return {
        "joint_op": jop,
        "type": "state", "t": round(s["t"], 4), "mode": s["mode_name"],
        "estop": s["estop"], "enabled": s["enabled"], "moving": s["moving"],
        "freedrive": s["mode_name"] == "FREEDRIVE",
        "progress": round(s["progress"], 4), "manip": round(s["manip"], 6),
        "q": [round(v, 6) for v in s["q"]], "qd": [round(v, 6) for v in s["qd"]],
        "torque": [round(v, 2) for v in s["torque"]],
        "torque_util": round(max(abs(s["torque"][i]) / JOINT_EFFORT[i] for i in range(6)), 3),
        "temp": [round(v, 1) for v in s["temp"]], "current": [round(v, 3) for v in s["current"]],
        "voltage": [round(v, 1) for v in s["voltage"]], "torque_meas": [round(v, 1) for v in s["torque_meas"]],
        "brake": [1 if b else 0 for b in s["brake"]],
        "coll_dist": round(s["coll_dist"], 3), "coll_warn": 1 if s["coll_warn"] else 0,
        "coll_stop": 1 if s["coll_stop"] else 0, "singular": 1 if s["singular"] else 0,
        "coll_pair": [s["coll_i"], s["coll_j"]],
        "flange": {"pos": [round(v, 6) for v in s["flange_pos"]],
                   "quat": [round(v, 6) for v in s["flange_quat"]]},
        "tcp": {"pos": [round(v, 6) for v in s.get("tcp_pos", s["flange_pos"])],
                "quat": [round(v, 6) for v in s.get("tcp_quat", s["flange_quat"])]},
        "contact": 1 if s.get("contact") else 0, "contact_joint": s.get("contact_joint", 0),
        "ext_torque": [round(v, 1) for v in s.get("ext_torque", [0]*6)],
        "speed_pct": s.get("speed_pct", 100),
        "tcp_speed": round(s.get("tcp_speed", 0.0), 4),
        "elbow_speed": round(s.get("elbow_speed", 0.0), 4),
        "ext_force": round(s.get("ext_force_mag", 0.0), 1),
        "safety": {"zone": s.get("safety_zone", 0), "code": s.get("safety_code", 0),
                   "stop": 1 if s.get("safety_stop") else 0,
                   "code_name": SAFETY_CODE_NAMES.get(s.get("safety_code", 0), "?")},
        "jitter_us": round(s.get("loop_jitter_us", 0.0), 1),
        "overruns": s.get("loop_overruns", 0),
        "program": dict(PROGRAM_STATUS),
    }


def quat_to_rpy(q):
    """[w,x,y,z] -> [roll, pitch, yaw] radians (ZYX)."""
    w, x, y, z = (list(q) + [0,0,0,0])[:4]
    roll  = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw   = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return [roll, pitch, yaw]

def quat_rotate(q, v):
    """Rotate vector v by quaternion q=[w,x,y,z] (for tool-frame relative moves)."""
    w, x, y, z = q
    tx = 2*(y*v[2]-z*v[1]); ty = 2*(z*v[0]-x*v[2]); tz = 2*(x*v[1]-y*v[0])
    return [v[0]+w*tx+(y*tz-z*ty), v[1]+w*ty+(z*tx-x*tz), v[2]+w*tz+(x*ty-y*tx)]

def rotvec_to_quat(rx, ry, rz):
    """UR axis-angle / rotation vector (rad) -> quaternion [w,x,y,z]."""
    th = math.sqrt(rx*rx + ry*ry + rz*rz)
    if th < 1e-12:
        return [1.0, 0.0, 0.0, 0.0]
    ax, ay, az = rx/th, ry/th, rz/th
    s = math.sin(th/2.0)
    return [math.cos(th/2.0), ax*s, ay*s, az*s]


def tcp_orient_to_quat(m):
    """Accept quat[w,x,y,z] | rpy[r,p,y] | rotvec[rx,ry,rz] from a message."""
    if 'quat' in m: return [float(v) for v in m['quat']]
    if 'rpy' in m: return rpy_to_quat(*[float(v) for v in m['rpy']])
    if 'rotvec' in m: return rotvec_to_quat(*[float(v) for v in m['rotvec']])
    return [1.0, 0.0, 0.0, 0.0]


def pose_dict(state):
    """TCP (tool tip) pose from a state snapshot -> {pos:{x,y,z} m, rot:{roll,pitch,yaw} rad}.
    Falls back to the flange when no tool is set (tcp == flange)."""
    p = state.get("tcp_pos") or state["flange_pos"]; r = quat_to_rpy(state.get("tcp_quat") or state["flange_quat"])
    return {"pos": {"x": round(p[0],6), "y": round(p[1],6), "z": round(p[2],6)},
            "rot": {"roll": round(r[0],6), "pitch": round(r[1],6), "yaw": round(r[2],6)}}


def _pose7(pose):
    """waypoint pose {pos:{x,y,z}, rot:{roll,pitch,yaw}} -> [x,y,z, qw,qx,qy,qz]."""
    p = pose["pos"]; r = pose["rot"]; q = rpy_to_quat(r["roll"], r["pitch"], r["yaw"])
    return [p["x"], p["y"], p["z"], q[0], q[1], q[2], q[3]]


async def _wait_motion(shm, target_q=None, target_pose=None, start_timeout=2.5, move_timeout=120.0):
    """Block until the current move finishes AND verify it reached its target. Returns (ok, why).
    Catches a Cartesian move that stopped short (infeasible straight line/arc -> the path guards
    aborted it) instead of silently proceeding. Aborts if the drives drop (collision/stop)."""
    def reached(st):
        if target_q is not None:
            return all(abs(st["q"][i]-target_q[i]) < 0.05 for i in range(6))      # within ~3 deg/joint
        if target_pose is not None:
            fp = st.get("tcp_pos") or st["flange_pos"]     # moves target the TOOL TIP (TCP), not the flange
            return sum((fp[k]-target_pose[k])**2 for k in range(3)) < 0.012*0.012  # within 12 mm
        return True
    t0 = time.time(); started = False
    while time.time()-t0 < start_timeout:                 # wait for the move to start
        if _prog_paused: t0 = time.time(); await asyncio.sleep(0.05); continue   # feed-hold: freeze the start timeout
        st = shm.read_state()
        if st["coll_stop"] or not st["enabled"]: return False, "drives disabled (collision / stop)"
        if st["moving"]: started = True; break
        if reached(st): return True, "already at target"
        await asyncio.sleep(0.02)
    if not started:
        return (True, "already at target") if reached(shm.read_state()) else (False, "motion did not start")
    t1 = time.time()
    while time.time()-t1 < move_timeout:                  # wait for the move to finish
        if _prog_paused: t1 = time.time(); await asyncio.sleep(0.05); continue   # feed-hold: freeze the move timeout while held
        st = shm.read_state()
        if st["coll_stop"] or not st["enabled"]: return False, "drives disabled mid-motion (collision / stop)"
        if not st["moving"]:
            return (True, "ok") if reached(st) else (False, "stopped short of target -- straight path infeasible here (try MoveJ/PTP for this step)")
        await asyncio.sleep(0.02)
    return False, "timeout"


async def _run_program(ws, shm, steps, speed, loopf, accel=1.0):
    """Execute saved waypoints in order, each gated on the previous motion COMPLETING."""
    loop = asyncio.get_event_loop()
    async def emit(o):
        try: await ws.send(json.dumps(o))
        except Exception: pass
    def resolve(step):                                            # -> (move_type, pose, q, name)
        if not isinstance(step, dict): step = {"id": step, "type": "j"}
        mt = (step.get("type") or "j").lower()
        pose = step.get("pose"); q = step.get("q"); name = step.get("name")
        if "id" in step:
            wp = WP.get(step["id"])
            if wp:
                name = name or wp["name"]
                if pose is None: pose = wp.get("pose")
                if q is None:    q = wp.get("q")
        return mt, pose, q, name
    try:
        await emit({"type": "program", "event": "start", "n": len(steps), "loop": bool(loopf)})
        cycle = 0
        while True:
            i = 0
            while i < len(steps):
                while _prog_paused:                                       # play/pause: hold at the current waypoint until resumed
                    await asyncio.sleep(0.08)
                mtype, pose, q, name = resolve(steps[i]); name = name or ("step %d" % (i + 1))
                if not shm.read_state()["enabled"]:
                    await emit({"type": "program", "event": "error", "index": i, "message": "drives not enabled"}); return
                if mtype == "c":                                          # circular arc: this wp = via, next wp = end
                    if i + 1 >= len(steps):
                        await emit({"type": "program", "event": "error", "index": i, "message": "'%s' (arc) needs a following waypoint as the arc end" % name}); return
                    _, epose, _, ename = resolve(steps[i + 1]); ename = ename or ("step %d" % (i + 2))
                    if not pose or not epose:
                        await emit({"type": "program", "event": "error", "index": i, "message": "arc needs a pose on the via ('%s') and the end ('%s')" % (name, ename)}); return
                    label = "arc " + name + " \u2192 " + ename
                    await emit({"type": "program", "event": "step_start", "index": i, "name": label, "move": "c"})
                    e7 = _pose7(epose)
                    res = await loop.run_in_executor(None, lambda v=_pose7(pose), e=e7: shm.send_circular(v, e, speed, False, accel))
                    if not res.get("ok"):
                        await emit({"type": "program", "event": "error", "index": i, "message": "arc through '%s' to '%s' unreachable (IK failed)" % (name, ename)}); return
                    ok, why = await _wait_motion(shm, target_pose=e7)
                    if not ok:
                        await emit({"type": "program", "event": "error", "index": i, "message": why}); return
                    await emit({"type": "program", "event": "step_done", "index": i, "name": label, "move": "c"})
                    i += 2; continue                                      # via + end consumed
                await emit({"type": "program", "event": "step_start", "index": i, "name": name, "move": mtype})
                if mtype in ("l", "p"):                                    # Cartesian to a pose (inline or waypoint)
                    if not pose:
                        await emit({"type": "program", "event": "error", "index": i, "message": "'%s' has no pose (needed for Move%s)" % (name, mtype.upper())}); return
                    ct = CMD_MOVE_LIN if mtype == "l" else CMD_MOVE_PTP    # l = straight line, p = PTP via IK
                    p7 = _pose7(pose)
                    res = await loop.run_in_executor(None, lambda p=p7, ct=ct: shm.send_command(ct, target_pose=p, speed=speed, accel=accel))
                    wt = {"target_pose": p7}
                else:                                                     # j = joint move
                    # Honour the active TCP: when a tool is applied AND this waypoint carries a
                    # taught Cartesian pose, drive the TOOL TIP to that pose via PTP (IK in TCP
                    # space) so "Apply TCP" actually governs where the arm lands. With no tool
                    # (identity TCP) or a joint-only waypoint, replay the exact taught joints --
                    # byte-for-byte the original, drive-stable behaviour.
                    if pose and shm.tcp_active():
                        p7 = _pose7(pose)
                        res = await loop.run_in_executor(None, lambda p=p7: shm.send_command(CMD_MOVE_PTP, target_pose=p, speed=speed, accel=accel))
                        wt = {"target_pose": p7}
                    elif q:
                        res = await loop.run_in_executor(None, lambda qq=list(q): shm.send_command(CMD_MOVE_JOINT, target_q=qq, speed=speed, accel=accel))
                        wt = {"target_q": list(q)}
                    else:
                        await emit({"type": "program", "event": "error", "index": i, "message": "'%s' has no joint values or pose" % name}); return
                if not res.get("ok"):
                    await emit({"type": "program", "event": "error", "index": i, "message": "'%s' unreachable (Move%s / IK failed)" % (name, mtype.upper())}); return
                ok, why = await _wait_motion(shm, **wt)
                if not ok:
                    await emit({"type": "program", "event": "error", "index": i, "message": "'%s': %s" % (name, why)}); return
                await emit({"type": "program", "event": "step_done", "index": i, "name": name, "move": mtype})
                i += 1
            cycle += 1
            if not loopf: break
            await emit({"type": "program", "event": "loop", "cycle": cycle})
        await emit({"type": "program", "event": "done", "cycles": cycle})
    except asyncio.CancelledError:
        await emit({"type": "program", "event": "aborted"}); raise
    except Exception as e:
        await emit({"type": "program", "event": "error", "message": str(e)})


def _p7(xyz, q):
    return [float(xyz[0]), float(xyz[1]), float(xyz[2]), float(q[0]), float(q[1]), float(q[2]), float(q[3])]


def _resolve_plane(shm, m):
    """Pick the writing plane: explicit dict > named saved plane > active saved plane > current
    tool-tip pose."""
    p = m.get("plane")
    if isinstance(p, dict) and p.get("xdir"):
        return planes._norm_rec(p)
    if m.get("plane_name"):
        pl = PL.get(m["plane_name"])
        if not pl: raise ValueError("plane '%s' not found" % m["plane_name"])
        return pl
    act = PL.active_plane()
    if act: return act
    s = shm.read_state()
    pos = s.get("tcp_pos") or s["flange_pos"]; quat = s.get("tcp_quat") or s["flange_quat"]
    return planes.plane_from_pose7([pos[0], pos[1], pos[2], quat[0], quat[1], quat[2], quat[3]])


def _make_writing(shm, m):
    """Build the writing toolpath. Returns (gen, plane)."""
    plane = _resolve_plane(shm, m)
    gen = writing.generate(str(m.get("text", "")), plane,
                           height=float(m.get("height", 0.03)),
                           char_gap=float(m.get("char_gap", 3.0)),
                           line_gap=float(m.get("line_gap", 11.0)),
                           align=m.get("align", "left"),
                           tilt_deg=float(m.get("tilt_deg", 0.0)))
    return gen, plane


async def _run_writing(ws, shm, gen, pen_up, draw_speed, travel_speed, accel, blend, press=0.0015):
    """Draw text at the marker TCP. Per stroke: PTP above start (pen up) -> MoveL down (pen down)
    -> MoveP through the stroke (blended, slow) -> MoveL up (pen up). Each move completion-gated,
    so the marker only touches paper while drawing. Orientation is fixed to the writing plane."""
    loop = asyncio.get_event_loop()
    async def emit(obj):
        try: await ws.send(json.dumps(obj))
        except Exception: pass
    q = gen["orient"]; up = gen["up"]; into = gen.get("into", [-up[0], -up[1], -up[2]]); strokes = gen["strokes"]
    def lift(p): return [p[0] + pen_up*up[0], p[1] + pen_up*up[1], p[2] + pen_up*up[2]]
    def press_pt(p): return [p[0] + press*into[0], p[1] + press*into[1], p[2] + press*into[2]]  # small press-in for contact
    # The marker pressing on the paper is an EXPECTED contact, which would otherwise trip the
    # physical-contact protective stop and abort the write. Suppress contact detection for the
    # duration of the write, then restore whatever the user had set. (Hardware E-STOP/STO is
    # unaffected and still protects the arm.)
    prev_on = getattr(shm, "_contact_on", 1); prev_sens = getattr(shm, "_contact_sens", 0.5)
    try:
        shm.set_contact(on=0)
        await emit({"type": "program", "event": "start", "n": len(strokes), "loop": False, "mode": "write"})
        await emit({"type": "program", "event": "note", "message": "contact detection paused while writing (pen touches paper)"})
        for i, st in enumerate(strokes):
            if not st: continue
            if not shm.read_state()["enabled"]:
                await emit({"type": "program", "event": "error", "index": i, "message": "drives not enabled"}); return
            await emit({"type": "program", "event": "step_start", "index": i, "name": "stroke %d" % (i+1), "move": "write"})
            start = st[0]; end = st[-1]
            # 1) travel above the start with the pen UP (PTP, fast, avoids Cartesian singularities in the air)
            r = await loop.run_in_executor(None, lambda p=_p7(lift(start), q): shm.send_command(CMD_MOVE_PTP, target_pose=p, speed=travel_speed, accel=accel))
            if not r.get("ok"):
                await emit({"type": "program", "event": "error", "index": i, "message": "stroke %d start unreachable" % (i+1)}); return
            ok, why = await _wait_motion(shm, target_pose=_p7(lift(start), q))
            if not ok: await emit({"type": "program", "event": "error", "index": i, "message": why}); return
            # 2) pen down (straight MoveL onto the paper, pressing in slightly for consistent contact)
            dn = press_pt(start)
            await loop.run_in_executor(None, lambda p=_p7(dn, q): shm.send_command(CMD_MOVE_LIN, target_pose=p, speed=0.12, accel=accel))
            ok, why = await _wait_motion(shm, target_pose=_p7(dn, q))
            if not ok: await emit({"type": "program", "event": "error", "index": i, "message": "pen-down: " + why}); return
            # 3) draw the WHOLE stroke as ONE blended MoveP -> smooth, constant speed, no mid-stroke
            #    stops (strokes were curvature-simplified to fit the waypoint limit). Fixed orientation
            #    = pure translation, so the tool tip tracks the letter without wrist spin.
            if len(st) >= 2:
                wps = [_p7(press_pt(p), q) for p in st]
                res = await loop.run_in_executor(None, lambda w=wps: shm.send_path(w, blend, draw_speed, 1.0))
                if not res.get("ok"):
                    await emit({"type": "program", "event": "error", "index": i, "message": "stroke %d not drawable (IK/singularity)" % (i+1)}); return
                ok, why = await _wait_motion(shm, target_pose=wps[-1])
                if not ok: await emit({"type": "program", "event": "error", "index": i, "message": why}); return
            # 4) pen up (straight MoveL off the paper)
            await loop.run_in_executor(None, lambda p=_p7(lift(end), q): shm.send_command(CMD_MOVE_LIN, target_pose=p, speed=0.12, accel=accel))
            ok, why = await _wait_motion(shm, target_pose=_p7(lift(end), q))
            if not ok: await emit({"type": "program", "event": "error", "index": i, "message": "pen-up: " + why}); return
            await emit({"type": "program", "event": "step_done", "index": i, "name": "stroke %d" % (i+1), "move": "write"})
        await emit({"type": "program", "event": "done", "cycles": 1, "mode": "write"})
    except asyncio.CancelledError:
        await emit({"type": "program", "event": "aborted"}); raise
    except Exception as e:
        await emit({"type": "program", "event": "error", "message": str(e)})
    finally:
        shm.set_contact(on=prev_on, sensitivity=prev_sens)   # restore the user's contact setting
        await emit({"type": "program", "event": "note", "message": "contact detection restored (%s)" % ("on" if prev_on else "off")})


def _pen_down_quat():
    """Marker held perpendicular to a level base, pointing straight DOWN: tool Z=[0,0,-1] (approach),
    X=[1,0,0], Y=[0,-1,0]. So on a level table the pen is square to the surface (0 deg)."""
    return writing._R_to_quat([[1.0, 0.0, 0.0], [0.0, -1.0, 0.0], [0.0, 0.0, -1.0]])


async def _run_probe_plane(ws, shm, m):
    """Auto-detect a table plane by touch probing. FULLY AUTOMATED from joints-0:
      1) go to the joints-0 home
      2) move (JOINT SPACE) to a fixed ready configuration that holds the marker PERPENDICULAR to
         the base (pen straight down) over the front workspace -- commanded in joint space so the
         orientation is exactly what the calibrated 3D model shows (no Cartesian-orientation flip)
      3) descend straight down until the tip touches the table (coarse then fine, contact-sensed so
         the marker tip is not damaged)
      4) build & activate a LEVEL writing plane at the touched height.
    The hardware E-STOP/STO stays independent."""
    loop = asyncio.get_event_loop()
    async def emit(o):
        try: await ws.send(json.dumps(o))
        except Exception: pass
    # Ready joint config: marker perpendicular to the base (pen straight down) over the front
    # workspace. Verified in the calibrated model (tool-Z = [0,0,-1]).
    READY = [-0.0761, -0.4418, -2.4480, -0.4353, 1.5708, -1.4947]
    ready = list(m.get("ready_joints") or _load_ready() or READY)
    max_drop = float(m.get("max_drop", 0.30))
    coarse = float(m.get("coarse_speed", 0.03)); fine = float(m.get("fine_speed", 0.01))
    retract = float(m.get("retract", 0.010)); sens = float(m.get("sensitivity", 0.9))
    size_w = float(m.get("width", 0.20)); size_h = float(m.get("height", 0.15))
    name = m.get("name", "table")
    prev_on = getattr(shm, "_contact_on", 1); prev_sens = getattr(shm, "_contact_sens", 0.5)
    qd = _pen_down_quat()
    Pp = lambda x, y, z: [x, y, z, qd[0], qd[1], qd[2], qd[3]]

    async def enable_settle():
        shm.send_command(CMD_ENABLE)
        for _ in range(80):
            if shm.read_state()["enabled"]: break
            await asyncio.sleep(0.02)
        await asyncio.sleep(0.15)

    async def descend(x, y, z_to, speed):
        await enable_settle()
        shm.set_contact(on=1, sensitivity=sens)
        await asyncio.sleep(0.6)                      # let the contact detector learn its baseline
        await loop.run_in_executor(None, lambda: shm.send_command(CMD_MOVE_LIN, target_pose=Pp(x, y, z_to), speed=speed, accel=0.2))
        t0 = time.time()
        while time.time() - t0 < 90.0:
            st = shm.read_state()
            if st.get("contact") or not st["enabled"]:
                return (st.get("tcp_pos") or st["flange_pos"])[2]
            fp = st.get("tcp_pos") or st["flange_pos"]
            if not st["moving"] and abs(fp[2] - z_to) < 0.003:
                return None
            await asyncio.sleep(0.01)
        return None

    try:
        await emit({"type": "probe", "event": "start", "points": 1})
        shm.set_contact(on=0)                          # off while positioning
        # 1) home to joints-0
        await emit({"type": "probe", "event": "note", "message": "moving to joints-0 home…"})
        await enable_settle()
        await loop.run_in_executor(None, lambda: shm.send_command(CMD_MOVE_JOINT, target_q=[0.0]*6, speed=0.4, accel=0.3))
        ok, why = await _wait_motion(shm, target_q=[0.0]*6, move_timeout=45.0)
        if not ok:
            await emit({"type": "probe", "event": "error", "message": "could not reach joints-0: " + why}); return
        # 2) JOINT move to the perpendicular ready pose (pen straight down) -- deterministic orientation
        await emit({"type": "probe", "event": "note", "message": "positioning: marker perpendicular to the base (pen straight down)…"})
        await enable_settle()
        await loop.run_in_executor(None, lambda: shm.send_command(CMD_MOVE_JOINT, target_q=ready, speed=0.4, accel=0.3))
        ok, why = await _wait_motion(shm, target_q=ready, move_timeout=45.0)
        if not ok:
            await emit({"type": "probe", "event": "error", "message": "could not reach the ready pose: " + why}); return
        st = shm.read_state(); tip = st.get("tcp_pos") or st["flange_pos"]
        x0, y0, z0 = tip[0], tip[1], tip[2]
        await emit({"type": "probe", "event": "probing", "corner": "centre", "xy": [round(x0, 4), round(y0, 4)]})
        # 3) coarse descend straight down
        zc = await descend(x0, y0, z0 - max_drop, coarse)
        if zc is None:
            await emit({"type": "probe", "event": "error", "message": "no surface within %.0f mm below the ready pose" % (max_drop*1000)}); return
        # 4) retract a little, fine descend
        await enable_settle(); shm.set_contact(on=0)
        await loop.run_in_executor(None, lambda: shm.send_command(CMD_MOVE_PTP, target_pose=Pp(x0, y0, zc + retract), speed=0.3, accel=0.4))
        await _wait_motion(shm, target_pose=Pp(x0, y0, zc + retract))
        zf = await descend(x0, y0, zc - 0.006, fine)
        zt = zf if zf is not None else zc
        await emit({"type": "probe", "event": "touched", "corner": "centre", "z": round(zt, 5)})
        # 5) lift back to the safe height
        await enable_settle(); shm.set_contact(on=0)
        await loop.run_in_executor(None, lambda: shm.send_command(CMD_MOVE_PTP, target_pose=Pp(x0, y0, z0), speed=0.3, accel=0.4))
        await _wait_motion(shm, target_pose=Pp(x0, y0, z0))
        # 6) build a LEVEL plane at the touched point (normal up; text X=+baseX, Y=+baseY). Origin =
        #    bottom-left so the touched point is the centre of the writing area.
        ox = x0 - size_w/2.0; oy = y0 - size_h/2.0
        sol = {"name": name, "pos": [round(ox, 6), round(oy, 6), round(zt, 6)],
               "xdir": [1.0, 0.0, 0.0], "ydir": [0.0, 1.0, 0.0], "zdir": [0.0, 0.0, -1.0],
               "size": {"w": round(size_w, 5), "h": round(size_h, 5)}}
        saved = PL.save(sol)
        await emit({"type": "probe", "event": "done", "plane": saved})
        await emit({"type": "planes", "planes": PL.list(), "active": PL.get_active()})
    except asyncio.CancelledError:
        await emit({"type": "probe", "event": "aborted"}); raise
    except Exception as e:
        await emit({"type": "probe", "event": "error", "message": str(e)})
    finally:
        shm.set_contact(on=prev_on, sensitivity=prev_sens)


async def run_typed_program(ws, shm, prog):
    """Execute a stored typed-step program (the production job runner).
    Every motion step is completion-gated; program state is broadcast to all
    clients and mirrored into PROGRAM_STATUS (state stream + Modbus)."""
    loop = asyncio.get_event_loop()
    speed = float(prog.get("speed", 0.5)); accel = float(prog.get("accel", 1.0))
    steps = prog.get("steps") or []
    want_cycles = int(prog.get("cycles", 0)); loopf = bool(prog.get("loop", False))
    PROGRAM_STATUS.update({"running": True, "id": prog.get("id"), "name": prog.get("name"),
                           "step": -1, "nsteps": len(steps), "cycle": 0})

    def wp_pose7(ref):
        wp = WP.get(ref) if isinstance(ref, str) else None
        if wp and wp.get("pose"): return _pose7(wp["pose"]), wp
        return None, wp

    async def do_motion(send_fn, wait_kw):
        res = await loop.run_in_executor(None, send_fn)
        if not res.get("ok"):
            why = "unreachable / IK failed"
            if res.get("pos_err", 0) == -2.0: why = "target inside a restricted safety zone"
            elif res.get("pos_err", 0) < 0: why = "straight path crosses a singularity (use MoveJ)"
            elif res.get("grav_util", 0) > 0.98: why = "exceeds actuator torque at this payload"
            return False, why
        return await _wait_motion(shm, **wait_kw)

    cycle = 0
    try:
        await emit_all(ws, {"type": "program", "event": "start", "id": prog.get("id"),
                            "name": prog.get("name"), "n": len(steps), "loop": loopf})
        while True:
            i = 0
            while i < len(steps):
                st = steps[i]; t = st.get("type"); name = st.get("name") or ("%s %d" % (t, i + 1))
                PROGRAM_STATUS["step"] = i
                stt = shm.read_state()
                if not stt["enabled"] and t.startswith(("movej", "movel", "movep", "movec")):
                    await emit_all(ws, {"type": "program", "event": "error", "index": i,
                                        "message": "drives not enabled"}); return
                await emit_all(ws, {"type": "program", "event": "step_start", "index": i, "name": name, "move": t})
                sp = float(st.get("speed", speed)); ac = float(st.get("accel", accel))
                ok, why = True, "ok"
                if t == "movej":
                    p7, wp = wp_pose7(st.get("wp"))
                    if p7 and shm.tcp_active():
                        ok, why = await do_motion(lambda p=p7: shm.send_command(CMD_MOVE_PTP, target_pose=p, speed=sp, accel=ac), {"target_pose": p7})
                    else:
                        q = st.get("q") or (wp and wp.get("q"))
                        if st.get("pose") and not q:
                            p7i = _pose7(st["pose"])
                            ok, why = await do_motion(lambda p=p7i: shm.send_command(CMD_MOVE_PTP, target_pose=p, speed=sp, accel=ac), {"target_pose": p7i})
                        elif q:
                            ok, why = await do_motion(lambda qq=list(q): shm.send_command(CMD_MOVE_JOINT, target_q=qq, speed=sp, accel=ac), {"target_q": list(q)})
                        else:
                            ok, why = False, "movej step has no waypoint/joints/pose"
                elif t == "movel":
                    p7, wp = wp_pose7(st.get("wp"))
                    if not p7 and st.get("pose"): p7 = _pose7(st["pose"])
                    if not p7: ok, why = False, "movel step has no pose"
                    else:
                        ok, why = await do_motion(lambda p=p7: shm.send_command(CMD_MOVE_LIN, target_pose=p, speed=sp, accel=ac), {"target_pose": p7})
                elif t == "movep":
                    pts = []
                    for ref in (st.get("wps") or []):
                        p7, _ = wp_pose7(ref)
                        if not p7: ok, why = False, "movep waypoint '%s' has no pose" % ref; break
                        pts.append(p7)
                    if ok and len(pts) >= 2:
                        bl = float(st.get("blend", 0.02)); ts = float(st.get("tool_speed", 0.15)); ta = float(st.get("tool_acc", 1.0))
                        ok, why = await do_motion(lambda: shm.send_path(pts, bl, ts, ta), {"target_pose": pts[-1]})
                elif t == "movec":
                    v7, _ = wp_pose7(st.get("via")); e7, _ = wp_pose7(st.get("end"))
                    if not v7 or not e7: ok, why = False, "movec needs taught via/end waypoints"
                    else:
                        ok, why = await do_motion(lambda: shm.send_circular(v7, e7, sp, bool(st.get("full")), ac), {"target_pose": e7})
                elif t == "wait":
                    left = float(st.get("sec", 1.0))
                    while left > 0:
                        await asyncio.sleep(min(0.1, left)); left -= 0.1
                        if not shm.read_state()["enabled"]: ok, why = False, "drives dropped during wait"; break
                elif t == "wait_di":
                    idx = int(st.get("di", 0)); val = 1 if st.get("value", 1) else 0
                    tmo = float(st.get("timeout", 0) or 0); t0 = time.time()
                    while True:
                        if ((shm.read_io()["di"] >> idx) & 1) == val: break
                        if tmo > 0 and time.time() - t0 > tmo: ok, why = False, "wait_di DI%d timeout after %.1fs" % (idx, tmo); break
                        await asyncio.sleep(0.02)
                elif t == "set_do":
                    shm.set_do(index=int(st.get("do", 0)), value=1 if st.get("value", 1) else 0)
                elif t == "set_ao":
                    shm.set_ao(int(st.get("ao", 0)), float(st.get("volts", 0.0)))
                elif t == "set_speed":
                    shm.set_speed_override(float(st.get("frac", 1.0)))
                elif t == "set_payload":
                    shm.set_payload(float(st.get("kg", 0.0)), st.get("cog"))
                elif t == "set_tcp":
                    try:
                        rec = TOOLS.select(st.get("tool", ""))
                        shm.set_tcp(rec["pos"], rec["quat"], rec["payload"], rec["cog"])
                    except Exception as e:
                        ok, why = False, str(e)
                elif t == "comment":
                    pass
                elif t == "halt":
                    await emit_all(ws, {"type": "program", "event": "step_done", "index": i, "name": name, "move": t})
                    raise StopAsyncIteration()
                if not ok:
                    await emit_all(ws, {"type": "program", "event": "error", "index": i, "name": name, "message": why})
                    return
                await emit_all(ws, {"type": "program", "event": "step_done", "index": i, "name": name, "move": t})
                i += 1
            cycle += 1
            PROGRAM_STATUS["cycle"] = cycle
            if not loopf and want_cycles <= 1: break
            if want_cycles and cycle >= want_cycles: break
            await emit_all(ws, {"type": "program", "event": "loop", "cycle": cycle})
        await emit_all(ws, {"type": "program", "event": "done", "id": prog.get("id"), "cycles": cycle})
    except StopAsyncIteration:
        await emit_all(ws, {"type": "program", "event": "done", "id": prog.get("id"), "cycles": cycle, "halted": True})
    except asyncio.CancelledError:
        await emit_all(ws, {"type": "program", "event": "aborted", "id": prog.get("id")})
        raise
    except Exception as e:
        await emit_all(ws, {"type": "program", "event": "error", "message": str(e)})
    finally:
        if prog.get("id"): PROGS.mark_run(prog["id"], cycle)
        PROGRAM_STATUS.update({"running": False, "step": -1})


async def _handle_v2(ws, shm, m, cmd, mid, reply):
    """v2 commands: programs, tools, safety, I/O, speed override. True if handled."""
    global _prog_task
    loop = asyncio.get_event_loop()
    if cmd == "set_speed":
        cfg = shm.set_speed_override(float(m.get("frac", m.get("pct", 100) / 100.0)))
        return await reply({"type": "speed", "ok": True, "speed_override": cfg["speed_override"]}, mid) or True
    if cmd == "get_safety":
        return await reply({"type": "safety", "config": shm.read_safety()}, mid) or True
    if cmd == "set_safety":
        cfg = shm.write_safety(m.get("config") or {})
        save_safety_file(cfg)
        _sink("warn", "SAFETY_CONFIG", "safety configuration changed", cfg)
        return await reply({"type": "safety", "config": cfg, "saved": True}, mid) or True
    if cmd == "io_get":
        return await reply({"type": "io", "io": shm.read_io()}, mid) or True
    if cmd == "io_set":
        if m.get("do") is not None: shm.set_do(index=int(m["do"]), value=1 if m.get("value", 1) else 0)
        elif m.get("mask") is not None: shm.set_do(mask=int(m["mask"]))
        if m.get("ao") is not None: shm.set_ao(int(m["ao"]), float(m.get("volts", 0.0)))
        return await reply({"type": "io", "io": shm.read_io()}, mid) or True
    if cmd == "di_force":
        if m.get("di") is not None: shm.force_di(index=int(m["di"]), value=1 if m.get("value", 1) else 0)
        elif m.get("mask") is not None: shm.force_di(mask=int(m["mask"]))
        return await reply({"type": "io", "io": shm.read_io()}, mid) or True
    if cmd == "tool_list":
        return await reply({"type": "tools", "tools": TOOLS.list(), "active": TCP.load()}, mid) or True
    if cmd == "tool_save":
        _tn = (str(m.get("name", "tool") or "tool").strip()) or "tool"
        if any(str(t.get("name", "")).strip().lower() == _tn.lower() for t in TOOLS.list()):
            return await reply({"type": "tools", "tools": TOOLS.list(), "exists": _tn,
                                "message": "A tool named '%s' already exists" % _tn}, mid) or True
        rec = {"name": _tn, "pos": m.get("pos", [0, 0, 0]),
               "quat": tcp_orient_to_quat(m) if ("quat" in m or "rpy" in m or "rotvec" in m) else (TOOLS.get(_tn) or {}).get("quat", [1, 0, 0, 0]),
               "payload": float(m.get("payload", 0.0)), "cog": m.get("cog", [0, 0, 0])}
        t = TOOLS.save_tool(rec)
        return await reply({"type": "tools", "tools": TOOLS.list(), "saved": t["name"]}, mid) or True
    if cmd == "tool_select":
        try:
            rec = TOOLS.select(m.get("name", ""))
            await loop.run_in_executor(None, lambda: shm.set_tcp(rec["pos"], rec["quat"], rec["payload"], rec["cog"]))
        except Exception as e:
            return await reply({"type": "error", "cmd": cmd, "message": str(e)}, mid) or True
        return await reply({"type": "tools", "tools": TOOLS.list(), "active": rec}, mid) or True
    if cmd == "tool_update":                                            # edit an existing tool IN PLACE (same name)
        _tn = str(m.get("name", "")).strip()
        if not TOOLS.get(_tn):
            return await reply({"type": "tools", "tools": TOOLS.list(), "message": "tool '%s' not found" % _tn}, mid) or True
        rec = {"name": _tn, "pos": m.get("pos", [0, 0, 0]),
               "quat": tcp_orient_to_quat(m) if ("quat" in m or "rpy" in m or "rotvec" in m) else (TOOLS.get(_tn) or {}).get("quat", [1, 0, 0, 0]),
               "payload": float(m.get("payload", 0.0)), "cog": m.get("cog", [0, 0, 0])}
        t = TOOLS.save_tool(rec)
        return await reply({"type": "tools", "tools": TOOLS.list(), "saved": t["name"]}, mid) or True
    if cmd == "tool_rename":
        old = str(m.get("old", "")).strip(); new = str(m.get("new", "")).strip()
        if not new:
            return await reply({"type": "tools", "tools": TOOLS.list(), "message": "new name required"}, mid) or True
        if any(str(t.get("name", "")).strip().lower() == new.lower() and t.get("name") != old for t in TOOLS.list()):
            return await reply({"type": "tools", "tools": TOOLS.list(), "exists": new,
                                "message": "A tool named '%s' already exists" % new}, mid) or True
        try:
            TOOLS.rename(old, new)
        except Exception as e:
            return await reply({"type": "tools", "tools": TOOLS.list(), "message": str(e)}, mid) or True
        return await reply({"type": "tools", "tools": TOOLS.list(), "renamed": new}, mid) or True
    if cmd == "tool_delete":
        TOOLS.delete(m.get("name", ""))
        return await reply({"type": "tools", "tools": TOOLS.list()}, mid) or True
    if cmd == "prog_list":
        return await reply({"type": "programs", "programs": PROGS.list()}, mid) or True
    if cmd == "prog_get":
        return await reply({"type": "program_def", "program": PROGS.get(m.get("id"))}, mid) or True
    if cmd == "prog_save":
        try:
            p = PROGS.save(m.get("program") or {})
        except Exception as e:
            return await reply({"type": "error", "cmd": cmd, "message": str(e)}, mid) or True
        return await reply({"type": "programs", "programs": PROGS.list(), "saved": p["id"]}, mid) or True
    if cmd == "prog_delete":
        PROGS.delete(m.get("id"))
        return await reply({"type": "programs", "programs": PROGS.list()}, mid) or True
    if cmd == "prog_run":
        prog = PROGS.get(m.get("id"))
        if not prog:
            return await reply({"type": "program", "event": "error", "message": "program not found"}, mid) or True
        if not shm.read_state()["enabled"]:
            return await reply({"type": "program", "event": "error", "message": "enable the drives first"}, mid) or True
        if m.get("speed") is not None: prog = dict(prog, speed=float(m["speed"]))
        if m.get("loop") is not None: prog = dict(prog, loop=bool(m["loop"]))
        if _prog_task and not _prog_task.done(): _prog_task.cancel()
        _prog_task = loop.create_task(run_typed_program(ws, shm, prog))
        return await reply({"type": "program", "event": "accepted", "id": prog["id"], "n": prog.get("nsteps", 0)}, mid) or True
    if cmd == "step_validate":
        try:
            validate_step(m.get("step") or {})
            return await reply({"type": "step_ok", "ok": True}, mid) or True
        except Exception as e:
            return await reply({"type": "step_ok", "ok": False, "message": str(e)}, mid) or True
    return False


async def handle(ws, shm, raw):
    async def reply(o, mid):
        if mid is not None:
            o["rid"] = mid              # official request-correlation key
            if "id" not in o:
                o["id"] = mid           # legacy correlation echo (kept for old clients)
        await ws.send(json.dumps(o))
    try:
        m = json.loads(raw)
    except Exception:
        return await ws.send(json.dumps({"type": "error", "message": "invalid JSON"}))
    # "rid" is the request-correlation id; "id" remains a RESOURCE parameter for
    # wp_*/prog_* commands (and doubles as legacy correlation when no rid is given).
    cmd = m.get("cmd"); mid = m.get("rid", m.get("id"))
    global _prog_task, _prog_paused
    if cmd == "get_state":
        return await reply(state_msg(shm.read_state()), mid)
    try:
        if await _handle_v2(ws, shm, m, cmd, mid, reply):
            return
    except Exception as e:
        return await reply({"type": "error", "cmd": cmd, "message": str(e)}, mid)
    # ---- named waypoints (persistent on the robot, shared across UIs) ----
    if cmd == "wp_list":
        return await reply({"type": "waypoints", "waypoints": WP.list()}, mid)
    if cmd == "wp_save":
        st = shm.read_state()
        q = m.get("q") or st["q"]
        pose = m.get("pose") or pose_dict(st)        # capture the live flange pose
        _nm = str(m.get("name", "") or "").strip()
        if _nm and any(str(w.get("name", "")).strip().lower() == _nm.lower() for w in WP.list()):
            return await reply({"type": "waypoints", "waypoints": WP.list(), "exists": _nm,
                                "message": "A waypoint named '%s' already exists" % _nm}, mid)
        try: wp = WP.add(m.get("name", ""), q, pose)
        except Exception as e: return await reply({"type": "error", "message": str(e)}, mid)
        return await reply({"type": "waypoints", "waypoints": WP.list(), "saved": wp["id"]}, mid)
    if cmd == "wp_update":
        _nm = str(m.get("name", "") or "").strip()
        if _nm and any(str(w.get("name", "")).strip().lower() == _nm.lower() and w.get("id") != m.get("id") for w in WP.list()):
            return await reply({"type": "waypoints", "waypoints": WP.list(), "exists": _nm,
                                "message": "A waypoint named '%s' already exists" % _nm}, mid)
        WP.update(m.get("id"), m.get("name"), m.get("q"), m.get("pose"))
        return await reply({"type": "waypoints", "waypoints": WP.list()}, mid)
    if cmd == "wp_delete":
        WP.delete(m.get("id"))
        return await reply({"type": "waypoints", "waypoints": WP.list()}, mid)
    if cmd == "wp_goto":
        wp = WP.get(m.get("id"))
        if not wp: return await reply({"type": "ack", "cmd": "wp_goto", "ok": False, "message": "waypoint not found"}, mid)
        if not shm.read_state()["enabled"]:
            return await reply({"type": "ack", "cmd": "wp_goto", "ok": False, "message": "enable the drives first"}, mid)
        spd = float(m.get("speed", 0.3)); acc = float(m.get("accel", 1.0))
        # If a TCP is applied and the waypoint has a taught pose, send the TOOL TIP to that
        # pose (PTP through IK) so the active TCP governs the landing point; else joint replay.
        if wp.get("pose") and shm.tcp_active():
            p7 = _pose7(wp["pose"])
            res = await asyncio.get_event_loop().run_in_executor(None, lambda: shm.send_command(CMD_MOVE_PTP, target_pose=p7, speed=spd, accel=acc))
        else:
            res = await asyncio.get_event_loop().run_in_executor(None, lambda: shm.send_command(CMD_MOVE_JOINT, target_q=wp["q"], speed=spd, accel=acc))
        return await reply({"type": "ack", "cmd": "wp_goto", "ok": bool(res.get("ok")), "id": wp["id"]}, mid)
    # ---- waypoint PROGRAM: run a saved sequence, each step gated on motion completion ----
    if cmd == "program_run":
        steps = m.get("steps") or []
        if not steps:
            return await reply({"type": "program", "event": "error", "message": "no steps"}, mid)
        if not shm.read_state()["enabled"]:
            return await reply({"type": "program", "event": "error", "message": "enable the drives first"}, mid)
        if _prog_task and not _prog_task.done(): _prog_task.cancel()
        _prog_paused = False
        await asyncio.get_event_loop().run_in_executor(None, lambda: shm.send_command(CMD_RESUME))   # ensure not feed-held from a prior pause
        _prog_task = asyncio.get_event_loop().create_task(
            _run_program(ws, shm, steps, float(m.get("speed", 0.3)), bool(m.get("loop", False)), float(m.get("accel", 1.0))))
        return await reply({"type": "program", "event": "accepted", "n": len(steps)}, mid)
    if cmd == "write_preview":
        try: gen, plane = _make_writing(shm, m)
        except Exception as e: return await reply({"type": "error", "cmd": "write_preview", "message": str(e)}, mid)
        return await reply({"type": "writing", "event": "preview", "strokes": gen["strokes"], "orient": gen["orient"],
                            "up": gen["up"], "into": gen["into"], "tilt_deg": gen["tilt_deg"], "bbox": gen["bbox"],
                            "nstrokes": gen["nstrokes"], "npts": gen["npts"], "plane": plane}, mid)
    if cmd == "write_run":
        if not shm.read_state()["enabled"]:
            return await reply({"type": "program", "event": "error", "message": "enable the drives first"}, mid)
        try: gen, plane = _make_writing(shm, m)
        except Exception as e: return await reply({"type": "program", "event": "error", "message": str(e)}, mid)
        if not gen["strokes"]:
            return await reply({"type": "program", "event": "error", "message": "nothing to write"}, mid)
        if _prog_task and not _prog_task.done(): _prog_task.cancel()
        _prog_task = asyncio.get_event_loop().create_task(_run_writing(ws, shm, gen,
            float(m.get("pen_up", 0.02)), float(m.get("draw_speed", 0.05)),
            float(m.get("travel_speed", 0.3)), float(m.get("accel", 1.0)), float(m.get("blend", 0.0015)),
            float(m.get("press_mm", 1.5)) / 1000.0))
        return await reply({"type": "program", "event": "accepted", "n": gen["nstrokes"], "mode": "write"}, mid)
    if cmd == "probe_plane":
        if _prog_task and not _prog_task.done(): _prog_task.cancel()
        _prog_task = asyncio.get_event_loop().create_task(_run_probe_plane(ws, shm, m))
        return await reply({"type": "probe", "event": "accepted"}, mid)
    if cmd == "save_ready_pose":
        # store the CURRENT joint angles (as shown in the viewer) as the auto-plane ready pose, so it
        # goes to exactly the perpendicular pose you set -- no sign math, it's the robot's own joints.
        q = [round(float(v), 6) for v in shm.read_state()["q"]]
        try:
            os.makedirs(os.path.dirname(_READY_FILE), exist_ok=True)
            with open(_READY_FILE, "w") as f: json.dump({"q": q}, f)
            return await reply({"type": "ready_pose", "ok": True, "q": q}, mid)
        except Exception as e:
            return await reply({"type": "ready_pose", "ok": False, "message": str(e)}, mid)
    if cmd == "get_ready_pose":
        return await reply({"type": "ready_pose", "ok": True, "q": _load_ready()}, mid)
    if cmd == "plane_list":
        return await reply({"type": "planes", "planes": PL.list(), "active": PL.get_active()}, mid)
    if cmd == "plane_select":
        PL.set_active(m.get("name"))
        return await reply({"type": "planes", "planes": PL.list(), "active": PL.get_active()}, mid)
    if cmd == "plane_delete":
        PL.delete(m.get("name"))
        return await reply({"type": "planes", "planes": PL.list(), "active": PL.get_active()}, mid)
    if cmd == "plane_save":
        try:
            if m.get("origin") and m.get("xpt") and m.get("ypt"):
                sol = planes.solve_plane_3pt(m["origin"], m["xpt"], m["ypt"])     # 3-point teach
            else:
                st = shm.read_state()                                            # quick: current tool-tip pose
                pos = st.get("tcp_pos") or st["flange_pos"]; quat = st.get("tcp_quat") or st["flange_quat"]
                sol = planes.plane_from_pose7([pos[0], pos[1], pos[2], quat[0], quat[1], quat[2], quat[3]], m.get("size"))
            sol["name"] = m.get("name", "plane")
            rec = PL.save(sol)
        except Exception as e:
            return await reply({"type": "error", "cmd": "plane_save", "message": str(e)}, mid)
        return await reply({"type": "planes", "planes": PL.list(), "active": PL.get_active(), "saved": rec["name"]}, mid)
    if cmd == "program_pause":                                          # feed-hold: decelerate & hold ON the path (resumable)
        _prog_paused = True
        await asyncio.get_event_loop().run_in_executor(None, lambda: shm.send_command(CMD_PAUSE))
        return await reply({"type": "program", "event": "paused", "running": bool(_prog_task and not _prog_task.done())}, mid)
    if cmd == "program_resume":
        _prog_paused = False
        await asyncio.get_event_loop().run_in_executor(None, lambda: shm.send_command(CMD_RESUME))
        return await reply({"type": "program", "event": "resumed", "running": bool(_prog_task and not _prog_task.done())}, mid)
    if cmd == "program_stop":
        _prog_paused = False
        if _prog_task and not _prog_task.done(): _prog_task.cancel()
        await asyncio.get_event_loop().run_in_executor(None, lambda: shm.send_command(CMD_RESUME))   # clear any feed-hold
        await asyncio.get_event_loop().run_in_executor(None, lambda: shm.send_command(CMD_STOP))
        return await reply({"type": "program", "event": "stopped"}, mid)
    if cmd == "pallet_run":                                              # generate + run a pick/place pallet
        import palletizing
        pick = WP.get(m.get("pick")); corner = WP.get(m.get("corner"))
        if not pick or not pick.get("pose") or not corner or not corner.get("pose"):
            return await reply({"type": "program", "event": "error", "message": "teach PICK and pallet CORNER waypoints (with pose) first"}, mid)
        if not shm.read_state()["enabled"]:
            return await reply({"type": "program", "event": "error", "message": "enable the drives first"}, mid)
        steps, cells = palletizing.generate(pick["pose"], corner["pose"],
            m.get("nx", 1), m.get("ny", 1), m.get("nz", 1),
            float(m.get("dx", 0.0)), float(m.get("dy", 0.0)), float(m.get("dz", 0.0)),
            float(m.get("approach", 0.05)), m.get("order", "row"))
        if _prog_task and not _prog_task.done(): _prog_task.cancel()
        _prog_task = asyncio.get_event_loop().create_task(_run_program(ws, shm, steps, float(m.get("speed", 0.3)), False, float(m.get("accel", 1.0))))
        return await reply({"type": "program", "event": "accepted", "n": len(steps), "cells": cells}, mid)

    # Safety gate: refuse motion unless the drives are enabled and not hand-guiding.
    if cmd in ("move_joint", "move_ptp", "move_lin", "move_p", "move_c", "move_rel", "jog"):
        st = shm.read_state()
        if not st["enabled"]:
            return await reply({"type": "ack", "cmd": cmd, "ok": False,
                                "message": "drives not enabled - send {\"cmd\":\"enable\"} first"}, mid)
        if st["mode_name"] == "FREEDRIVE":
            return await reply({"type": "ack", "cmd": cmd, "ok": False,
                                "message": "in free-drive - send {\"cmd\":\"freedrive\",\"on\":false} first"}, mid)

    loop = asyncio.get_event_loop()
    try:
        if cmd == "move_joint":
            q = m["q"]; sp = float(m.get("speed", 1.0)); ac = float(m.get("accel", 1.0))
            res = await loop.run_in_executor(None, lambda: shm.send_command(CMD_MOVE_JOINT, target_q=q, speed=sp, accel=ac))
        elif cmd in ("move_ptp", "move_lin"):
            pose = pose_from_msg(m); sp = float(m.get("speed", 1.0)); ac = float(m.get("accel", 1.0))
            ct = CMD_MOVE_PTP if cmd == "move_ptp" else CMD_MOVE_LIN
            res = await loop.run_in_executor(None, lambda: shm.send_command(ct, target_pose=pose, speed=sp, accel=ac))
        elif cmd == "stop":
            res = await loop.run_in_executor(None, lambda: shm.send_command(CMD_STOP)); res = {"ok": True}
        elif cmd == "hold":
            res = await loop.run_in_executor(None, lambda: shm.send_command(CMD_HOLD)); res = {"ok": True}
        elif cmd == "estop":
            shm.send_command(CMD_STOP, estop_req=1); res = {"ok": True}
            if EVENT_SINK: EVENT_SINK("alarm", "command", "ESTOP_REQ", "software E-STOP requested")
        elif cmd == "reset":
            shm.send_command(CMD_HOLD, reset_req=1); res = {"ok": True}
            if EVENT_SINK: EVENT_SINK("info", "command", "ESTOP_RESET", "E-STOP reset requested")
        elif cmd == "ecat_reset":                                        # restart the EtherCAT connection
            await loop.run_in_executor(None, lambda: shm.send_command(CMD_ECAT_RESET)); res = {"ok": True}
        elif cmd == "set_collision":                                     # enable/disable self-collision monitor
            on = bool(m.get("on", True))
            await loop.run_in_executor(None, lambda: shm.send_command(CMD_SET_COLLISION, frame=1 if on else 0))
            res = {"ok": True, "collision": on}
        elif cmd == "set_sign":                                          # per-joint direction sign (+/-1), live + persisted
            signs = [1 if float(v) >= 0 else -1 for v in (list(m.get("signs", [1]*6)) + [1]*6)[:6]]
            await loop.run_in_executor(None, lambda: shm.send_command(CMD_SET_SIGN, target_q=[float(s) for s in signs]))
            _save_calib(signs, _load_offsets())                          # persist for the next restart
            res = {"type": "signs", "ok": True, "signs": signs}
            await ws.send(json.dumps(res)); return
        elif cmd == "get_signs":
            await ws.send(json.dumps({"type": "signs", "ok": True, "signs": _load_signs()})); return
        elif cmd == "set_contact":                                       # physical-contact (collision) detector
            on = m.get("on", None); sens = m.get("sensitivity", None)
            await loop.run_in_executor(None, lambda: shm.set_contact(on=on, sensitivity=sens))
            res = {"ok": True, "contact_on": shm._contact_on, "sensitivity": shm._contact_sens}
        elif cmd == "contact_poke":                                      # SIM demo: trip the detector
            j = int(m.get("joint", 2))
            await loop.run_in_executor(None, lambda: shm.contact_poke(j)); res = {"ok": True, "poke": j}
        elif cmd == "enable":
            shm.send_command(CMD_ENABLE); res = {"ok": True}
        elif cmd == "disable":
            shm.send_command(CMD_DISABLE); res = {"ok": True}
        elif cmd == "freedrive":
            on = bool(m.get("on", True))
            shm.send_command(CMD_FREEDRIVE_ON if on else CMD_FREEDRIVE_OFF); res = {"ok": True}
        elif cmd == "set_tcp":
            pos = [float(v) for v in (list(m.get("pos", [0, 0, 0])) + [0, 0, 0])[:3]]
            quat = tcp_orient_to_quat(m)
            payload = float(m.get("payload", TCP.load().get("payload", 0.0)))
            cog = [float(v) for v in (list(m.get("cog", [0, 0, 0])) + [0, 0, 0])[:3]]
            rec = TCP.save({"name": m.get("name", "tool"), "pos": pos, "quat": quat, "payload": payload, "cog": cog})
            await loop.run_in_executor(None, lambda: shm.set_tcp(rec["pos"], rec["quat"], rec["payload"], rec["cog"]))
            res = {"ok": True, "tcp": rec}
        elif cmd == "get_tcp":
            res = {"ok": True, "tcp": TCP.load()}
        elif cmd == "tcp_teach":
            # 4-point: client sends >=4 flange poses [x,y,z,qw,qx,qy,qz] with the tip on one point
            flanges = m.get("flanges", [])
            ok, off, pt, rms = solve_tcp_position(flanges)
            if ok and m.get("apply"):
                cur = TCP.load()
                rec = TCP.save({"name": m.get("name", cur.get("name", "tool")), "pos": off,
                                "quat": cur.get("quat", [1, 0, 0, 0]), "payload": cur.get("payload", 0.0), "cog": off})
                await loop.run_in_executor(None, lambda: shm.set_tcp(rec["pos"], rec["quat"], rec["payload"], rec["cog"]))
            res = {"ok": ok, "offset": off, "point": pt, "rms": rms, "n": len(flanges)}
        elif cmd == "tcp_teach_orient":
            # orientation: keep the flange ORIENTATION FIXED and translate the tip along the tool
            # axes. ref/zdir/xdir are flange poses [x,y,z,qw,qx,qy,qz]; xdir optional (round tool).
            ref = m.get("ref"); zdir = m.get("zdir"); xdir = m.get("xdir")
            if not ref or not zdir:
                res = {"ok": False, "message": "capture Reference and +Z first (+X optional)"}
            else:
                ok2, quat = solve_tcp_orientation(ref, zdir, xdir)
                if ok2 and m.get("apply"):
                    cur = TCP.load()
                    rec = TCP.save({"name": m.get("name", cur.get("name", "tool")), "pos": cur.get("pos", [0, 0, 0]),
                                    "quat": quat, "payload": cur.get("payload", 0.0), "cog": cur.get("cog", [0, 0, 0])})
                    await loop.run_in_executor(None, lambda: shm.set_tcp(rec["pos"], rec["quat"], rec["payload"], rec["cog"]))
                res = {"ok": ok2, "quat": quat, "has_x": xdir is not None}
        elif cmd == "set_payload":
            kg = float(m.get("kg", m.get("payload", 0.0)))
            await loop.run_in_executor(None, lambda: shm.set_payload(kg)); res = {"ok": True, "payload": kg}
        elif cmd == "jog":
            fr = {"joint": 0, "base": 1, "tool": 2}.get(m.get("frame", "joint"), 0)
            vel = m.get("vel", [0]*6); sp = float(m.get("speed", 1.0)); ac = float(m.get("accel", 1.0))
            shm.send_command(CMD_JOG, target_q=vel, frame=fr, speed=sp, accel=ac); res = {"ok": True}
        elif cmd == "move_p":
            pts = [pose_from_msg(w) for w in m.get("waypoints", [])]
            blend = float(m.get("blend", 0.05)); ts = float(m.get("tool_speed", 0.25)); ta = float(m.get("tool_acc", 1.2))
            res = await loop.run_in_executor(None, lambda: shm.send_path(pts, blend, ts, ta))
        elif cmd == "move_c":                                            # circular arc: via + end poses
            via = pose_from_msg(m.get("via", {})); end = pose_from_msg(m.get("end", {})); sp = float(m.get("speed", 1.0)); ac = float(m.get("accel", 1.0))
            res = await loop.run_in_executor(None, lambda: shm.send_circular(via, end, sp, bool(m.get("full", False)), ac))
        elif cmd == "move_rel":                                          # relative/offset move (base or tool frame)
            s = shm.read_state(); fp = s.get("tcp_pos") or s["flange_pos"]; fq = s.get("tcp_quat") or s["flange_quat"]
            d = [float(x) for x in (m.get("delta", [0, 0, 0]) + [0, 0, 0])[:3]]
            if m.get("frame", "base") == "tool": d = quat_rotate(fq, d)
            target = [fp[0]+d[0], fp[1]+d[1], fp[2]+d[2], fq[0], fq[1], fq[2], fq[3]]
            ct = CMD_MOVE_PTP if m.get("ptp") else CMD_MOVE_LIN
            res = await loop.run_in_executor(None, lambda: shm.send_command(ct, target_pose=target, speed=float(m.get("speed", 1.0))))
        else:
            return await reply({"type": "error", "message": f"unknown cmd '{cmd}'"}, mid)
    except Exception as e:
        return await reply({"type": "error", "cmd": cmd, "message": str(e)}, mid)
    ack = {"type": "ack", "cmd": cmd, "ok": bool(res.get("ok"))}
    for _k in ("tcp", "offset", "point", "rms", "n"):
        if _k in res:
            ack[_k] = res[_k]
    if "pos_err" in res:
        ack["pos_err"] = res["pos_err"]
    if "grav_util" in res:
        ack["torque_util"] = round(res["grav_util"], 3)
    if "pos_err" in res and not res.get("ok"):
        if res.get("pos_err", 0) == -2.0:
            ack["message"] = "target is inside a restricted safety zone"
        elif res.get("pos_err", 0) < 0:
            ack["message"] = "straight-line path crosses a singularity — use MoveJ (joint move) instead"
        elif res.get("grav_util", 0) > 0.98:
            ack["message"] = "exceeds actuator torque (%.0f%% of limit) at this payload" % (res.get("grav_util", 0) * 100)
        else:
            ack["message"] = "unreachable / IK failed"
    await reply(ack, mid)


async def broadcaster(shm, rate):
    period = 1.0 / rate
    while True:
        if clients:
            try:
                msg = json.dumps(state_msg(shm.read_state()))
            except Exception as e:
                msg = json.dumps({"type": "error", "message": f"state read failed: {e}"})
            for ws in list(clients):
                try:
                    await ws.send(msg)
                except Exception:
                    clients.discard(ws)
        await asyncio.sleep(period)


def make_handler(shm):
    async def handler(ws, *args):
        clients.add(ws)
        print(f"[bridge] client connected ({len(clients)})")
        await ws.send(json.dumps({"type": "welcome", "robot": "erobo10",
                                  "commands": ["move_joint", "move_ptp", "move_lin", "move_p", "jog", "enable", "disable", "freedrive", "set_payload", "set_tcp", "tcp_teach", "tcp_teach_orient", "set_collision", "set_contact", "set_sign", "stop", "estop", "reset"], "signs": _load_signs()}))
        try:
            async for raw in ws:
                await handle(ws, shm, raw)
        except websockets.ConnectionClosed:
            pass
        finally:
            clients.discard(ws)
            print(f"[bridge] client disconnected ({len(clients)})")
    return handler


async def main_async(args):
    shm = ShmClient(args.shm)
    print(f"[bridge] attached to {args.shm}")
    _sf = load_safety_file()
    if _sf:
        shm.write_safety(_sf)
        print(f"[bridge] applied persisted safety configuration ({len(_sf.get('planes') or [])} plane(s))")
    _t = TCP.load()
    shm.set_tcp(_t["pos"], _t["quat"], _t["payload"], _t["cog"])
    print(f"[bridge] applied saved TCP '{_t.get('name')}' pos={_t['pos']} payload={_t['payload']}kg")
    async with websockets.serve(make_handler(shm), args.host, args.port):
        print(f"[bridge] WebSocket on ws://{args.host}:{args.port}, state @ {args.rate:.0f} Hz")
        await broadcaster(shm, args.rate)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shm", default="/dev/shm/erobo10_shm")
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--rate", type=float, default=50.0)
    args = ap.parse_args()
    try:
        asyncio.run(main_async(args))
    except KeyboardInterrupt:
        print("\n[bridge] shutdown")


if __name__ == "__main__":
    main()
