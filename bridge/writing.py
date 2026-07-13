#!/usr/bin/env python3
"""writing.py -- text -> single-stroke toolpath for the erobo10 cobot (robot handwriting).

Uses a HERSHEY single-stroke vector font (Allen V. Hershey, 1967) -- the pen-plotter standard
(AxiDraw, Inkscape "Hershey Text"). Single-stroke = one centreline per pen line (NOT TrueType
outlines), which is exactly what a marker needs. Proper letterforms including real lowercase,
curves, and descenders (fonts/futural.jhf, the Sans 1-stroke face).

Pipeline (matches how UR/KUKA pen-writing and pen-plotters do it):
  text  ->  Hershey glyph strokes
        ->  laid out left-to-right, scaled to a cap height, in a 2D writing plane
        ->  placed on a taught 3D writing plane (paper), the marker held PERPENDICULAR to the
            surface (tool Z = plane inward normal -- auto-oriented from the table, RoboDK/UR
            "keep TCP normal to surface"); orientation is FIXED per stroke so the Cartesian
            moves are pure translation (well-conditioned, no wrist spin)
        ->  each stroke curvature-simplified to <= the shm waypoint limit so it draws as ONE
            smooth blended MoveP (no mid-stroke stops), at constant speed, with a small press-in
            for consistent contact.
"""
import math, os

# ---------------------------------------------------------------- Hershey font
_FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
# Hershey vertical metric: +y is DOWN. Caps span ~ -12 (top) .. +9 (baseline) = 21 units.
H_TOP, H_BASE = -12.0, 9.0
H_CAP = H_BASE - H_TOP                       # 21 grid units per cap height

def _load_hershey(path):
    """Parse a .jhf Hershey font -> {char: (left, right, [ [(x,y),...], ... ])} (y DOWN)."""
    glyphs = {}
    with open(path) as f:
        lines = [ln.rstrip("\n") for ln in f]
    for idx, ln in enumerate(lines):
        ch = chr(32 + idx)
        if len(ln) < 10:                     # blank / space -> width only
            glyphs[ch] = (-8.0, 8.0, []); continue
        body = ln[8:]
        left = ord(body[0]) - 82; right = ord(body[1]) - 82
        strokes, cur, i = [], [], 2
        while i + 1 < len(body):
            c1, c2 = body[i], body[i+1]; i += 2
            if c1 == ' ':                    # pen up -> break the stroke
                if cur: strokes.append(cur); cur = []
            else:
                cur.append((ord(c1) - 82, ord(c2) - 82))
        if cur: strokes.append(cur)
        glyphs[ch] = (float(left), float(right), strokes)
    return glyphs

try:
    GLYPHS = _load_hershey(os.path.join(_FONT_DIR, "futural.jhf"))
except Exception:
    GLYPHS = {" ": (-8.0, 8.0, [])}

def _glyph(ch):
    if ch in GLYPHS: return GLYPHS[ch]
    if ch.upper() in GLYPHS: return GLYPHS[ch.upper()]
    return GLYPHS.get(" ", (-8.0, 8.0, []))

# ---------------------------------------------------------------- layout
def text_to_strokes(text, height=0.03, char_gap=3.0, line_gap=11.0, align="left"):
    """text -> (strokes2d[m], width[m], height_total[m]).  Origin bottom-left, +x right, +y up.
    Cap height == `height`. char_gap/line_gap in Hershey units. Lowercase is real (Hershey)."""
    s = height / H_CAP                       # grid units -> metres
    all_lines = []
    for ln in text.split("\n"):
        strokes, x = [], 0.0
        for ch in ln:
            left, right, gs = _glyph(ch)
            for st in gs:
                strokes.append([((x + (hx - left)) * s, (H_BASE - hy) * s) for (hx, hy) in st])
            x += (right - left) + char_gap
        width = max(0.0, x - char_gap)
        all_lines.append((strokes, width * s))
    total_w = max((w for _, w in all_lines), default=0.0)
    line_h = (H_CAP + line_gap) * s
    out = []
    for li, (strokes, w) in enumerate(all_lines):
        dy = -li * line_h
        dx = (total_w - w) / 2.0 if align == "center" else (total_w - w) if align == "right" else 0.0
        for st in strokes:
            out.append([(px + dx, py + dy) for (px, py) in st])
    return out, total_w, len(all_lines) * line_h

# ---------------------------------------------------------------- stroke smoothing
def _pdist(p, a, b):
    """perpendicular distance of point p to segment a-b (2D)."""
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx-ax, by-ay
    L2 = dx*dx + dy*dy
    if L2 < 1e-18: return math.hypot(px-ax, py-ay)
    t = ((px-ax)*dx + (py-ay)*dy) / L2
    t = max(0.0, min(1.0, t))
    return math.hypot(px-(ax+t*dx), py-(ay+t*dy))

def _rdp(pts, eps):
    """Ramer-Douglas-Peucker: drop points that stay within eps of the chord (keeps corners/curves)."""
    if len(pts) < 3: return pts[:]
    dmax, idx = 0.0, 0
    for i in range(1, len(pts)-1):
        d = _pdist(pts[i], pts[0], pts[-1])
        if d > dmax: dmax, idx = d, i
    if dmax > eps:
        left = _rdp(pts[:idx+1], eps); right = _rdp(pts[idx:], eps)
        return left[:-1] + right
    return [pts[0], pts[-1]]

def simplify_2d(stroke, height, max_pts):
    """Curvature-preserving simplify to <= max_pts, so a stroke fits one blended MoveP. eps scales
    with letter height (~1.5% of cap height) so curves stay smooth but points stay few."""
    if len(stroke) <= max_pts: return stroke
    eps = 0.015 * height
    out = _rdp(stroke, eps)
    while len(out) > max_pts:                # relax tolerance until it fits the waypoint limit
        eps *= 1.6; out = _rdp(stroke, eps)
    return out

# ---------------------------------------------------------------- 3D placement
def _quat_to_R(q):
    w, x, y, z = q
    n = math.sqrt(w*w+x*x+y*y+z*z) or 1.0
    w, x, y, z = w/n, x/n, y/n, z/n
    return [[1-2*(y*y+z*z), 2*(x*y-z*w),   2*(x*z+y*w)],
            [2*(x*y+z*w),   1-2*(x*x+z*z), 2*(y*z-x*w)],
            [2*(x*z-y*w),   2*(y*z+x*w),   1-2*(x*x+y*y)]]

def _cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def _dot(a, b): return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
def _norm(a):
    n = math.sqrt(_dot(a, a)) or 1.0
    return [a[0]/n, a[1]/n, a[2]/n]

def _R_to_quat(R):
    t = R[0][0]+R[1][1]+R[2][2]
    if t > 0:
        s2 = math.sqrt(t+1.0)*2; w=0.25*s2; x=(R[2][1]-R[1][2])/s2; y=(R[0][2]-R[2][0])/s2; z=(R[1][0]-R[0][1])/s2
    elif R[0][0] > R[1][1] and R[0][0] > R[2][2]:
        s2 = math.sqrt(1+R[0][0]-R[1][1]-R[2][2])*2; w=(R[2][1]-R[1][2])/s2; x=0.25*s2; y=(R[0][1]+R[1][0])/s2; z=(R[0][2]+R[2][0])/s2
    elif R[1][1] > R[2][2]:
        s2 = math.sqrt(1+R[1][1]-R[0][0]-R[2][2])*2; w=(R[0][2]-R[2][0])/s2; x=(R[0][1]+R[1][0])/s2; y=0.25*s2; z=(R[1][2]+R[2][1])/s2
    else:
        s2 = math.sqrt(1+R[2][2]-R[0][0]-R[1][1])*2; w=(R[1][0]-R[0][1])/s2; x=(R[0][2]+R[2][0])/s2; y=(R[1][2]+R[2][1])/s2; z=0.25*s2
    n = math.sqrt(w*w+x*x+y*y+z*z) or 1.0
    return [w/n, x/n, y/n, z/n]

def _plane_axes(plane):
    """Return (O, Xh, Yh, Zin) unit axes of the writing plane. Xh=right, Yh=up, Zin=into paper."""
    if isinstance(plane, (list, tuple)):
        R = _quat_to_R([float(v) for v in plane[3:7]]); O = [float(v) for v in plane[0:3]]
        Xh = [R[0][0], R[1][0], R[2][0]]; Yh = [R[0][1], R[1][1], R[2][1]]; Zin = [R[0][2], R[1][2], R[2][2]]
    else:
        O = [float(v) for v in plane["pos"]]; Xh = [float(v) for v in plane["xdir"]]
        Yh = [float(v) for v in plane["ydir"]]; Zin = [float(v) for v in plane["zdir"]]
    # Re-orthonormalise from the TABLE NORMAL so the marker is truly perpendicular even if the
    # taught axes are slightly non-orthogonal (RoboDK/UR: keep tool Z normal to the surface).
    Xh = _norm(Xh)
    Zin = _norm(Zin)
    Xh = _norm([Xh[i] - _dot(Xh, Zin)*Zin[i] for i in range(3)])   # X made perpendicular to normal
    Yh = _norm(_cross(Zin, Xh))                                    # right-handed up
    return O, Xh, Yh, Zin

def marker_orientation(plane, tilt_deg=0.0):
    """Quaternion [w,x,y,z] that holds the marker PERPENDICULAR to the plane (tool Z into paper,
    tool X along text-right). Optional tilt_deg leans the pen about the text-right axis (lead
    angle); 0 = straight perpendicular, best for a round marker."""
    O, Xh, Yh, Zin = _plane_axes(plane)
    if abs(tilt_deg) > 1e-6:
        a = math.radians(tilt_deg); c, s = math.cos(a), math.sin(a)
        # rotate approach (Zin) toward -Yh about Xh: pen leans "back" like a hand
        Zin = _norm([c*Zin[i] - s*Yh[i] for i in range(3)])
        Yh = _norm(_cross(Zin, Xh))
    tY = _cross(Zin, Xh)
    return _R_to_quat([[Xh[0], tY[0], Zin[0]], [Xh[1], tY[1], Zin[1]], [Xh[2], tY[2], Zin[2]]])

def generate(text, plane, height=0.03, char_gap=3.0, line_gap=11.0, align="left",
             tilt_deg=0.0, max_stroke_pts=15):
    """Place Hershey text strokes on a writing plane and return the toolpath.

    plane: {pos,xdir(right),ydir(up),zdir(into-paper)} OR a TCP pose7 [x,y,z,qw,qx,qy,qz].
    Returns {orient:[w,x,y,z] (marker perpendicular to plane), up:[..] (pen-up dir = -normal),
    into:[..] (press-in dir = +normal), strokes:[[[x,y,z],...],...] (base frame, simplified),
    bbox:{w,h}, npts, nstrokes, tilt_deg}.
    """
    O, Xh, Yh, Zin = _plane_axes(plane)
    quat = marker_orientation(plane, tilt_deg)
    up = [-Zin[0], -Zin[1], -Zin[2]]                         # pen-up direction
    strokes2d, W, H = text_to_strokes(text, height, char_gap, line_gap, align)
    strokes, npts = [], 0
    for st in strokes2d:
        st = simplify_2d(st, height, max_stroke_pts)         # smooth: fit one blended MoveP
        base = []
        for (u, v) in st:
            base.append([O[0] + u*Xh[0] + v*Yh[0],
                         O[1] + u*Xh[1] + v*Yh[1],
                         O[2] + u*Xh[2] + v*Yh[2]]); npts += 1
        strokes.append(base)
    return {"orient": quat, "up": up, "into": [Zin[0], Zin[1], Zin[2]], "strokes": strokes,
            "bbox": {"w": round(W, 5), "h": round(H, 5)}, "npts": npts,
            "nstrokes": len(strokes), "tilt_deg": tilt_deg}
