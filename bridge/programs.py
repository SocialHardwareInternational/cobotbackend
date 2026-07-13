#!/usr/bin/env python3
"""programs.py -- persistent robot-program store for the erobo10 controller.

A PROGRAM is a named, versioned sequence of typed steps (the on-robot job format,
equivalent to a UR .urp). Stored as atomic JSON (run/programs.json) so it survives
restarts and is shared by every API surface (WebSocket, REST, Modbus job select).

Step schema (validated on save; unknown fields are preserved):
  {"type":"movej","wp":"<waypoint id>"}                    joint move to a taught waypoint
  {"type":"movej","q":[6 rad],"name":...}                  joint move to inline joints
  {"type":"movel","wp"/"pose":...}                         straight-line move (TCP)
  {"type":"movep","wps":[ids...],"blend":m,"tool_speed":}  blended continuous path
  {"type":"movec","via":wp,"end":wp}                       circular arc
  {"type":"wait","sec":1.5}                                dwell
  {"type":"wait_di","di":0,"value":1,"timeout":30}         wait for a digital input
  {"type":"set_do","do":0,"value":1}                       set a digital output
  {"type":"set_ao","ao":0,"volts":5.0}                     set an analog output
  {"type":"set_speed","frac":0.5}                          program speed change
  {"type":"set_payload","kg":2.0,"cog":[x,y,z]}            payload change (tool pick/drop)
  {"type":"set_tcp","tool":"gripper"}                      activate a tool from the library
  {"type":"comment","text":"..."}                          no-op annotation
  {"type":"halt"}                                          end program immediately
Programs also carry: speed (0..1 default), accel, loop (bool), cycles (0 = forever).
"""
import json, os, time, threading

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_RUN = os.environ.get("EROBO_RUN_DIR") or os.path.join(_ROOT, "run")
DEFAULT_PATH = os.path.join(_RUN, "programs.json")

STEP_TYPES = ("movej", "movel", "movep", "movec", "wait", "wait_di", "set_do", "set_ao",
              "set_speed", "set_payload", "set_tcp", "comment", "halt")


def validate_step(st):
    if not isinstance(st, dict):
        raise ValueError("step must be an object")
    t = st.get("type")
    if t not in STEP_TYPES:
        raise ValueError("unknown step type '%s'" % t)
    if t in ("movej", "movel"):
        if not (st.get("wp") or st.get("q") or st.get("pose")):
            raise ValueError("%s step needs a waypoint id, joints, or pose" % t)
    if t == "movep" and len(st.get("wps") or []) < 2:
        raise ValueError("movep needs at least 2 waypoints")
    if t == "movec" and not (st.get("via") and st.get("end")):
        raise ValueError("movec needs 'via' and 'end' waypoints")
    if t == "wait" and float(st.get("sec", 0)) <= 0:
        raise ValueError("wait needs sec > 0")
    if t == "wait_di" and st.get("di") is None:
        raise ValueError("wait_di needs a di index")
    if t == "set_do" and st.get("do") is None:
        raise ValueError("set_do needs a do index")
    return st


class ProgramStore:
    def __init__(self, path=DEFAULT_PATH):
        self.path = path
        self._lock = threading.Lock()
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def _read(self):
        try:
            with open(self.path) as f:
                d = json.load(f)
            return d if isinstance(d, list) else []
        except Exception:
            return []

    def _write(self, progs):
        tmp = self.path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(progs, f, indent=1)
        os.replace(tmp, self.path)

    def list(self, full=False):
        with self._lock:
            progs = self._read()
        if full:
            return progs
        return [{k: p.get(k) for k in ("id", "name", "description", "nsteps", "speed",
                                       "loop", "cycles", "version", "modified", "runs", "cycles_done")}
                for p in progs]

    def get(self, pid):
        for p in self.list(full=True):
            if p["id"] == pid:
                return p
        return None

    def save(self, rec):
        """Create (no id) or update (id) a program. Bumps version on update."""
        steps = [validate_step(s) for s in (rec.get("steps") or [])]
        with self._lock:
            progs = self._read()
            now = round(time.time(), 1)
            pid = rec.get("id")
            body = {
                "name": (str(rec.get("name", "")).strip() or "Program %d" % (len(progs) + 1))[:64],
                "description": str(rec.get("description", ""))[:256],
                "steps": steps, "nsteps": len(steps),
                "speed": max(0.05, min(1.0, float(rec.get("speed", 0.5)))),
                "accel": max(0.05, min(1.0, float(rec.get("accel", 1.0)))),
                "loop": bool(rec.get("loop", False)),
                "cycles": max(0, int(rec.get("cycles", 0))),
                "modified": now,
            }
            if pid:
                for p in progs:
                    if p["id"] == pid:
                        p.update(body)
                        p["version"] = int(p.get("version", 1)) + 1
                        self._write(progs)
                        return p
                raise ValueError("program '%s' not found" % pid)
            base = int(time.time() * 1000)
            new_id = "pg%d" % base
            existing = {p["id"] for p in progs}
            k = 0
            while new_id in existing:
                k += 1
                new_id = "pg%d_%d" % (base, k)
            p = dict(body, id=new_id, created=now, version=1, runs=0, cycles_done=0)
            progs.append(p)
            self._write(progs)
            return p

    def delete(self, pid):
        with self._lock:
            progs = self._read()
            n = len(progs)
            progs = [p for p in progs if p["id"] != pid]
            if len(progs) != n:
                self._write(progs)
                return True
            return False

    def mark_run(self, pid, cycles=0):
        with self._lock:
            progs = self._read()
            for p in progs:
                if p["id"] == pid:
                    p["runs"] = int(p.get("runs", 0)) + 1
                    p["cycles_done"] = int(p.get("cycles_done", 0)) + int(cycles)
                    p["last_run"] = round(time.time(), 1)
                    self._write(progs)
                    return p
        return None

    def by_number(self, num):
        """Modbus/PLC job select: programs ordered by creation, 1-based index."""
        progs = self.list(full=True)
        if 1 <= int(num) <= len(progs):
            return progs[int(num) - 1]
        return None
