#!/usr/bin/env python3
"""waypoints.py -- persistent named joint-space waypoints for the erobo10 cobot.

Stored as a JSON file on the robot (run/waypoints.json) so every UI (phone, desktop) shares the
same list and it survives restarts. Each waypoint is {id, name, q[6] radians, pose{pos:{x,y,z}, rot:{roll,pitch,yaw}}, created}.
Every operation re-reads the file so the WebSocket bridge and the HTTP server stay in sync.
"""
import json, os, time, threading

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_RUN = os.environ.get("EROBO_RUN_DIR") or os.path.join(_ROOT, "run")
DEFAULT_PATH = os.path.join(_RUN, "waypoints.json")


def _norm_pose(pose):
    """Normalize a pose dict to {pos:{x,y,z}, rot:{roll,pitch,yaw}} of rounded floats, or None.

    pos in metres, rot (roll/pitch/yaw) in radians -- matches the flange pose in the state."""
    if not pose:
        return None
    try:
        p = pose.get("pos", {}) or {}
        r = pose.get("rot", {}) or {}
        return {"pos": {"x": round(float(p.get("x", 0.0)), 6),
                        "y": round(float(p.get("y", 0.0)), 6),
                        "z": round(float(p.get("z", 0.0)), 6)},
                "rot": {"roll":  round(float(r.get("roll", 0.0)), 6),
                        "pitch": round(float(r.get("pitch", 0.0)), 6),
                        "yaw":   round(float(r.get("yaw", 0.0)), 6)}}
    except (TypeError, ValueError):
        return None


def _safe_name(name):
    """Filesystem-safe filename stem from a user name."""
    s = "".join(c if (c.isalnum() or c in " -_().") else "_" for c in str(name)).strip()
    return (s or "unnamed")[:120]


class WaypointStore:
    def __init__(self, path=DEFAULT_PATH):
        self.path = path
        self._lock = threading.Lock()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.dir = os.path.join(os.path.dirname(path), "waypoints")   # one file per waypoint (name.json)
        os.makedirs(self.dir, exist_ok=True)

    def _item_path(self, name):
        return os.path.join(self.dir, _safe_name(name) + ".json")

    def _write_item(self, wp):
        try:
            with open(self._item_path(wp["name"]), "w") as fh:
                json.dump(wp, fh, indent=2)
        except Exception:
            pass

    def _remove_item(self, name, keep=None):
        # remove <name>.json unless another remaining waypoint maps to the same file
        try:
            stem = _safe_name(name)
            if keep is not None and any(_safe_name(w["name"]) == stem for w in keep):
                return
            p = self._item_path(name)
            if os.path.exists(p):
                os.remove(p)
        except Exception:
            pass

    def _read(self):
        try:
            with open(self.path) as f:
                wps = json.load(f)
            return wps if isinstance(wps, list) else []
        except Exception:
            return []

    def _write(self, wps):
        tmp = self.path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(wps, f, indent=2)
        os.replace(tmp, self.path)

    def list(self):
        with self._lock:
            return self._read()

    def add(self, name, q, pose=None):
        q = [round(float(x), 6) for x in q][:6]
        if len(q) != 6:
            raise ValueError("waypoint needs 6 joint values")
        with self._lock:
            wps = self._read()
            existing = {w["id"] for w in wps}
            base = int(time.time() * 1000); wid = "wp%d" % base; k = 0
            while wid in existing: k += 1; wid = "wp%d_%d" % (base, k)   # guarantee unique id
            wp = {"id": wid,
                  "name": (str(name).strip() or "Waypoint %d" % (len(wps) + 1)),
                  "q": q, "pose": _norm_pose(pose), "created": round(time.time(), 1)}
            wps.append(wp)
            self._write(wps)
            self._write_item(wp)
            return wp

    def update(self, wid, name=None, q=None, pose=None):
        with self._lock:
            wps = self._read()
            for wp in wps:
                if wp["id"] == wid:
                    old_name = wp["name"]
                    if name is not None:
                        wp["name"] = str(name).strip() or wp["name"]
                    if q is not None:
                        qq = [round(float(x), 6) for x in q][:6]
                        if len(qq) == 6:
                            wp["q"] = qq
                    if pose is not None:
                        wp["pose"] = _norm_pose(pose)
                    self._write(wps)
                    if wp["name"] != old_name:
                        self._remove_item(old_name, keep=wps)   # renamed: drop the old file
                    self._write_item(wp)
                    return wp
            return None

    def delete(self, wid):
        with self._lock:
            wps = self._read()
            target = next((w for w in wps if w["id"] == wid), None)
            wps = [w for w in wps if w["id"] != wid]
            if target is not None:
                self._write(wps)
                self._remove_item(target["name"], keep=wps)
                return True
            return False

    def get(self, wid):
        for wp in self.list():
            if wp["id"] == wid:
                return wp
        return None
