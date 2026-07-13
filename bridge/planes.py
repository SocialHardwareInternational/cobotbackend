#!/usr/bin/env python3
"""planes.py -- persistent named WRITING PLANES for the erobo10 cobot.

A writing plane is stored as an origin (bottom-left of the writing area) + three unit axes:
  xdir = right (text +x),  ydir = up on the paper (text +y),  zdir = INTO the paper (marker
approach; pen-up = -zdir).  Text layout uses xdir/ydir; the marker orientation is derived from
zdir (round marker, so its roll is free). Storing explicit axes avoids the left-handed
[right, up, into-paper] reflection problem you get on a flat sheet.

Stored as JSON (run/planes.json) so planes survive restarts and can be listed / selected
("recognized") and reused; the active plane name is remembered in run/planes.json.active.

Define a plane two ways:
  * 3-point teach (accurate): capture the marker-tip TCP pose at the paper's bottom-left,
    bottom-right (+x), and top-left (+y). solve_plane_3pt() builds the axes + size.
  * current pose (quick): use the current tool-tip pose directly (its X=right, Y=up, Z=into).

  plane = {"name","pos":[x,y,z],"xdir":[..],"ydir":[..],"zdir":[..],"size":{"w","h"},"updated"}
"""
import json, os, time, threading, math

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_PATH = os.path.join(os.environ.get("EROBO_RUN_DIR") or os.path.join(_ROOT, "run"), "planes.json")


def _sub(a, b): return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]
def _cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def _dot(a, b): return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
def _neg(a): return [-a[0], -a[1], -a[2]]
def _norm(a):
    n = math.sqrt(_dot(a, a)) or 1.0
    return [a[0]/n, a[1]/n, a[2]/n]


def _quat_to_R(q):
    w, x, y, z = q
    n = math.sqrt(w*w+x*x+y*y+z*z) or 1.0
    w, x, y, z = w/n, x/n, y/n, z/n
    return [[1-2*(y*y+z*z), 2*(x*y-z*w),   2*(x*z+y*w)],
            [2*(x*y+z*w),   1-2*(x*x+z*z), 2*(y*z-x*w)],
            [2*(x*z-y*w),   2*(y*z+x*w),   1-2*(x*x+y*y)]]


def solve_plane_3pt(origin7, xpt7, ypt7):
    """3 TCP poses [x,y,z,qw,qx,qy,qz] at the paper's bottom-left, bottom-right, top-left.
    Returns dict {pos, xdir, ydir, zdir, size:{w,h}}."""
    P0 = [float(v) for v in origin7[0:3]]
    PX = [float(v) for v in xpt7[0:3]]
    PY = [float(v) for v in ypt7[0:3]]
    ex = _sub(PX, P0); ey = _sub(PY, P0)
    width = math.sqrt(_dot(ex, ex)); height = math.sqrt(_dot(ey, ey))
    X = _norm(ex)
    Y = _norm(_sub(ey, [X[0]*_dot(ey, X), X[1]*_dot(ey, X), X[2]*_dot(ey, X)]))   # in-plane up
    N = _norm(_cross(X, Y))                                     # a unit normal
    # zdir = INTO the paper = the side the marker approaches from (tool +Z at the origin capture).
    toolZ = [_quat_to_R([float(v) for v in origin7[3:7]])[r][2] for r in range(3)]
    Z = N if _dot(N, toolZ) >= 0 else _neg(N)
    return {"pos": [round(v, 6) for v in P0],
            "xdir": [round(v, 8) for v in X], "ydir": [round(v, 8) for v in Y],
            "zdir": [round(v, 8) for v in Z], "size": {"w": round(width, 5), "h": round(height, 5)}}


def plane_from_pose7(pose7, size=None):
    """Quick plane from one TCP pose: X=right, Y=up, Z=into-paper (the pose's own axes)."""
    R = _quat_to_R([float(v) for v in pose7[3:7]])
    return {"pos": [round(float(pose7[i]), 6) for i in range(3)],
            "xdir": [R[0][0], R[1][0], R[2][0]], "ydir": [R[0][1], R[1][1], R[2][1]],
            "zdir": [R[0][2], R[1][2], R[2][2]],
            "size": {"w": (size or {}).get("w", 0.25), "h": (size or {}).get("h", 0.15)}}


def _norm_rec(rec):
    try:
        pos = [float(v) for v in (list(rec.get("pos", [0, 0, 0])) + [0, 0, 0])[:3]]
        xd = _norm([float(v) for v in rec.get("xdir", [1, 0, 0])])
        yd = _norm([float(v) for v in rec.get("ydir", [0, 1, 0])])
        zd = _norm([float(v) for v in rec.get("zdir", [0, 0, 1])])
        sz = rec.get("size") or {}
        return {"name": str(rec.get("name", "plane"))[:48], "pos": [round(v, 6) for v in pos],
                "xdir": [round(v, 8) for v in xd], "ydir": [round(v, 8) for v in yd],
                "zdir": [round(v, 8) for v in zd],
                "size": {"w": round(float(sz.get("w", 0.25)), 5), "h": round(float(sz.get("h", 0.15)), 5)}}
    except (TypeError, ValueError):
        return None


class PlaneStore:
    def __init__(self, path=DEFAULT_PATH):
        self.path = path
        self.active_path = path + ".active"
        self._lock = threading.Lock()
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def _read(self):
        try:
            with open(self.path) as f:
                d = json.load(f)
            return d if isinstance(d, list) else []
        except Exception:
            return []

    def _write(self, planes):
        with self._lock:
            tmp = self.path + ".tmp"
            with open(tmp, "w") as f:
                json.dump(planes, f, indent=2)
            os.replace(tmp, self.path)

    def list(self):
        return self._read()

    def get(self, name):
        for p in self._read():
            if p.get("name") == name:
                return p
        return None

    def save(self, rec):
        rec = _norm_rec(rec)
        if not rec:
            raise ValueError("bad plane")
        rec["updated"] = time.time()
        planes = [p for p in self._read() if p.get("name") != rec["name"]]
        planes.append(rec)
        self._write(planes)
        self.set_active(rec["name"])
        return rec

    def delete(self, name):
        self._write([p for p in self._read() if p.get("name") != name])
        if self.get_active() == name:
            self.set_active(None)

    def set_active(self, name):
        try:
            with open(self.active_path, "w") as f:
                f.write(name or "")
        except Exception:
            pass

    def get_active(self):
        try:
            with open(self.active_path) as f:
                return (f.read().strip() or None)
        except Exception:
            return None

    def active_plane(self):
        n = self.get_active()
        return self.get(n) if n else None
