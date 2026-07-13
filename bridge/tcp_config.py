#!/usr/bin/env python3
"""tcp_config.py -- persistent Tool Center Point (TCP) configuration for the erobo10 cobot.

Stores ONE active tool definition as JSON (run/tcp_config.json) so every UI shares it and
it survives restarts (mirrors waypoints.py). A TCP is a rigid transform T_flange->tcp plus
the payload it carries:

    {"name", "pos":[x,y,z] m, "quat":[w,x,y,z], "payload": kg, "cog":[x,y,z] m, "updated"}

Position/orientation are relative to the tool output flange (UR/ABB/KUKA convention); cog is
the payload centre of gravity in the flange frame. Identity (pos 0, quat [1,0,0,0]) = the bare
flange = "no tool".

Also implements the standard 4-point TCP-position calibration (least squares): touch one fixed
world point with the tool tip from >=4 different flange orientations; solving (R_i - R_j) o =
(t_j - t_i) for the offset o recovers the TCP position in the flange frame. (Ref: control.com /
MDPI Actuators 2023 / Jmeyer1292 tool_point_calibration.)
"""
import json, os, time, threading, math

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_RUN = os.environ.get("EROBO_RUN_DIR") or os.path.join(_ROOT, "run")
DEFAULT_PATH = os.path.join(_RUN, "tcp_config.json")
TOOLS_PATH = os.path.join(_RUN, "tools.json")

IDENTITY = {"name": "flange", "pos": [0.0, 0.0, 0.0], "quat": [1.0, 0.0, 0.0, 0.0],
            "payload": 0.0, "cog": [0.0, 0.0, 0.0]}


def _quat_to_R(q):
    w, x, y, z = q
    n = math.sqrt(w*w + x*x + y*y + z*z) or 1.0
    w, x, y, z = w/n, x/n, y/n, z/n
    return [[1-2*(y*y+z*z), 2*(x*y-z*w),   2*(x*z+y*w)],
            [2*(x*y+z*w),   1-2*(x*x+z*z), 2*(y*z-x*w)],
            [2*(x*z-y*w),   2*(y*z+x*w),   1-2*(x*x+y*y)]]


def _norm(rec):
    try:
        p = [float(v) for v in (list(rec.get("pos", [0, 0, 0])) + [0, 0, 0])[:3]]
        q = [float(v) for v in (list(rec.get("quat", [1, 0, 0, 0])) + [1, 0, 0, 0])[:4]]
        nq = math.sqrt(sum(v*v for v in q)) or 1.0
        q = [v/nq for v in q]
        c = [float(v) for v in (list(rec.get("cog", [0, 0, 0])) + [0, 0, 0])[:3]]
        return {"name": str(rec.get("name", "tool"))[:48],
                "pos": [round(v, 6) for v in p], "quat": [round(v, 8) for v in q],
                "payload": round(max(0.0, float(rec.get("payload", 0.0))), 4),
                "cog": [round(v, 6) for v in c]}
    except (TypeError, ValueError):
        return dict(IDENTITY)


def solve_tcp_position(flanges):
    """flanges: list of >=4 flange poses [x,y,z, qw,qx,qy,qz] taken with the tool tip on one
    fixed point. Returns (ok, offset[3] in flange frame, point[3] in base, rms_residual)."""
    if len(flanges) < 4:
        return False, [0, 0, 0], [0, 0, 0], 0.0
    Rs = [_quat_to_R(f[3:7]) for f in flanges]
    ts = [f[0:3] for f in flanges]
    # Build normal equations (A^T A) o = A^T b from all consecutive pairs.
    ATA = [[0.0]*3 for _ in range(3)]
    ATb = [0.0]*3
    for i in range(len(flanges)):
        for j in range(i+1, len(flanges)):
            for r in range(3):
                # row = R_i[r] - R_j[r]; rhs = t_j[r]-t_i[r]
                row = [Rs[i][r][k]-Rs[j][r][k] for k in range(3)]
                rhs = ts[j][r]-ts[i][r]
                for a in range(3):
                    ATb[a] += row[a]*rhs
                    for b in range(3):
                        ATA[a][b] += row[a]*row[b]
    o = _solve3(ATA, ATb)
    if o is None:
        return False, [0, 0, 0], [0, 0, 0], 0.0
    # fixed point estimate = mean(R_i o + t_i); residual = spread of those estimates
    pts = []
    for R, t in zip(Rs, ts):
        pts.append([R[r][0]*o[0]+R[r][1]*o[1]+R[r][2]*o[2]+t[r] for r in range(3)])
    P = [sum(p[r] for p in pts)/len(pts) for r in range(3)]
    rms = math.sqrt(sum(sum((p[r]-P[r])**2 for r in range(3)) for p in pts)/len(pts))
    return True, [round(v, 6) for v in o], [round(v, 6) for v in P], round(rms, 6)


def _R_to_quat(R):
    t = R[0][0] + R[1][1] + R[2][2]
    if t > 0:
        s = math.sqrt(t + 1.0) * 2; w = 0.25*s; x = (R[2][1]-R[1][2])/s; y = (R[0][2]-R[2][0])/s; z = (R[1][0]-R[0][1])/s
    elif R[0][0] > R[1][1] and R[0][0] > R[2][2]:
        s = math.sqrt(1+R[0][0]-R[1][1]-R[2][2])*2; w = (R[2][1]-R[1][2])/s; x = 0.25*s; y = (R[0][1]+R[1][0])/s; z = (R[0][2]+R[2][0])/s
    elif R[1][1] > R[2][2]:
        s = math.sqrt(1+R[1][1]-R[0][0]-R[2][2])*2; w = (R[0][2]-R[2][0])/s; x = (R[0][1]+R[1][0])/s; y = 0.25*s; z = (R[1][2]+R[2][1])/s
    else:
        s = math.sqrt(1+R[2][2]-R[0][0]-R[1][1])*2; w = (R[1][0]-R[0][1])/s; x = (R[0][2]+R[2][0])/s; y = (R[1][2]+R[2][1])/s; z = 0.25*s
    n = math.sqrt(w*w+x*x+y*y+z*z) or 1.0
    return [w/n, x/n, y/n, z/n]


def _sub(a, b): return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]
def _dot(a, b): return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
def _cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def _unit(a):
    n = math.sqrt(_dot(a, a)) or 1.0
    return [a[0]/n, a[1]/n, a[2]/n]
def _RT_v(R, v):   # R^T * v (express a base-frame vector in the flange frame)
    return [R[0][c]*v[0]+R[1][c]*v[1]+R[2][c]*v[2] for c in range(3)]


def solve_tcp_orientation(ref7, zdir7, xdir7=None):
    """Recover the TCP ORIENTATION (tool frame relative to the flange) by pointing along the tool
    axes. Keep the flange ORIENTATION FIXED and TRANSLATE the tool tip:
      ref7  : flange pose with the tip at a reference point
      zdir7 : flange pose after moving the tip along the tool's +Z (approach/pointing) axis
      xdir7 : (optional) flange pose after moving the tip along the tool's +X axis. If omitted, X
              is chosen perpendicular to Z (fine for a round tool like a marker, where roll is free).
    Because the orientation is unchanged, tip motion == flange translation, so the taught directions
    are just the translation deltas expressed in the flange frame. Returns (ok, quat[w,x,y,z]).
    """
    R = _quat_to_R(ref7[3:7])                       # flange orientation (shared by all captures)
    dz = _RT_v(R, _sub(zdir7[0:3], ref7[0:3]))      # tool +Z in the flange frame
    if _dot(dz, dz) < 1e-8:
        return False, [1.0, 0.0, 0.0, 0.0]
    zhat = _unit(dz)
    if xdir7 is not None:
        dx = _RT_v(R, _sub(xdir7[0:3], ref7[0:3]))
        xhat = _sub(dx, [zhat[i]*_dot(dx, zhat) for i in range(3)])   # remove Z component
        if _dot(xhat, xhat) < 1e-8:
            xdir7 = None
        else:
            xhat = _unit(xhat)
    if xdir7 is None:                                # no X taught -> any axis perpendicular to Z
        seed = [1.0, 0.0, 0.0] if abs(zhat[0]) < 0.9 else [0.0, 1.0, 0.0]
        xhat = _unit(_sub(seed, [zhat[i]*_dot(seed, zhat) for i in range(3)]))
    yhat = _cross(zhat, xhat)
    Rtool = [[xhat[0], yhat[0], zhat[0]],            # columns = tool axes in the flange frame
             [xhat[1], yhat[1], zhat[1]],
             [xhat[2], yhat[2], zhat[2]]]
    return True, [round(v, 8) for v in _R_to_quat(Rtool)]


def _solve3(A, b):
    """Solve 3x3 A x = b by Cramer's rule. Returns None if near-singular."""
    def det3(M):
        return (M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1])
                - M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0])
                + M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]))
    D = det3(A)
    if abs(D) < 1e-12:
        return None
    x = []
    for c in range(3):
        M = [row[:] for row in A]
        for r in range(3):
            M[r][c] = b[r]
        x.append(det3(M)/D)
    return x


def _safe_name(name):
    """Filesystem-safe filename stem from a tool name."""
    t = "".join(c if (c.isalnum() or c in " -_().") else "_" for c in str(name)).strip()
    return (t or "unnamed")[:120]


class TcpStore:
    def __init__(self, path=DEFAULT_PATH):
        self.path = path
        self._lock = threading.Lock()
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def load(self):
        try:
            with open(self.path) as f:
                return _norm(json.load(f))
        except Exception:
            return dict(IDENTITY)

    def save(self, rec):
        rec = _norm(rec)
        rec["updated"] = time.time()
        with self._lock:
            tmp = self.path + ".tmp"
            with open(tmp, "w") as f:
                json.dump(rec, f, indent=2)
            os.replace(tmp, self.path)
        return rec


class ToolLibrary:
    """Named tool library (multi-tool support). run/tools.json holds every defined
    tool; TcpStore keeps the ACTIVE one (compat with everything already using it).
    Selecting a tool copies its record into the active store atomically."""
    def __init__(self, path=TOOLS_PATH, active_store=None):
        self.path = path
        self._lock = threading.Lock()
        self.active = active_store or TcpStore()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.dir = os.path.join(os.path.dirname(path), "tcp_configs")   # one file per tool (name.json)
        os.makedirs(self.dir, exist_ok=True)

    def _item_path(self, name):
        return os.path.join(self.dir, _safe_name(name) + ".json")

    def _write_item(self, rec):
        try:
            with open(self._item_path(rec["name"]), "w") as fh:
                json.dump(rec, fh, indent=2)
        except Exception:
            pass

    def _remove_item(self, name):
        try:
            p = self._item_path(name)
            if os.path.exists(p):
                os.remove(p)
        except Exception:
            pass

    def _read(self):
        try:
            with open(self.path) as f:
                d = json.load(f)
            return d if isinstance(d, list) else []
        except Exception:
            return []

    def _write(self, tools):
        tmp = self.path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(tools, f, indent=1)
        os.replace(tmp, self.path)

    def list(self):
        with self._lock:
            tools = self._read()
        act = self.active.load().get("name")
        for t in tools:
            t["active"] = (t["name"] == act)
        return tools

    def save_tool(self, rec):
        rec = _norm(rec)
        with self._lock:
            tools = self._read()
            out = None
            for t in tools:
                if t["name"] == rec["name"]:
                    t.update(rec); t["updated"] = round(time.time(), 1); out = t
                    break
            if out is None:
                rec["updated"] = round(time.time(), 1)
                tools.append(rec); out = rec
            self._write(tools)
            self._write_item(out)
            return out

    def get(self, name):
        for t in self._read():
            if t["name"] == name:
                return t
        return None

    def select(self, name):
        t = self.get(name)
        if not t:
            raise ValueError("tool '%s' not found" % name)
        return self.active.save(t)

    def delete(self, name):
        with self._lock:
            tools = self._read()
            n = len(tools)
            tools = [t for t in tools if t["name"] != name]
            if len(tools) != n:
                self._write(tools)
                self._remove_item(name)
                return True
            return False

    def rename(self, old, new):
        with self._lock:
            tools = self._read()
            t = next((x for x in tools if x["name"] == old), None)
            if t is None:
                raise ValueError("tool '%s' not found" % old)
            if any(x["name"] == new for x in tools if x is not t):
                raise ValueError("tool '%s' already exists" % new)
            was_active = (self.active.load().get("name") == old)
            t["name"] = new; t["updated"] = round(time.time(), 1)
            self._write(tools)
            self._remove_item(old)          # move the per-item file old.json -> new.json
            self._write_item(t)
            if was_active:
                self.active.save(t)         # keep the active TCP name in sync
            return t
