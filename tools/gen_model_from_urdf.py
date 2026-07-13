#!/usr/bin/env python3
"""gen_model_from_urdf.py -- regenerate the erobo10 kinematic + dynamic model headers
from a URDF. URDF-native (no DH fitting): each joint is a fixed origin transform
(R,p) + a rotation about `axis`; the flange is the last link frame. This is exact and
matches the URDF FK to machine precision.

Usage:  python3 tools/gen_model_from_urdf.py <robot.urdf>
Writes: core/include/erm/erobo10_dh.hpp  and  core/include/erm/erobo10_dyn.hpp
"""
import sys, os, math
import xml.etree.ElementTree as ET

def Rx(t): c,s=math.cos(t),math.sin(t); return [[1,0,0],[0,c,-s],[0,s,c]]
def Ry(t): c,s=math.cos(t),math.sin(t); return [[c,0,s],[0,1,0],[-s,0,c]]
def Rz(t): c,s=math.cos(t),math.sin(t); return [[c,-s,0],[s,c,0],[0,0,1]]
def mm(A,B): return [[sum(A[i][k]*B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
def rpyR(r,p,y): return mm(Rz(y),mm(Ry(p),Rx(r)))   # URDF fixed-axis XYZ
def flat(R): return [R[i][j] for i in range(3) for j in range(3)]

def parse(urdf):
    root=ET.parse(urdf).getroot()
    links={}
    for L in root.findall("link"):
        ine=L.find("inertial")
        if ine is None:
            links[L.get("name")]=None; continue
        m=float(ine.find("mass").get("value"))
        com=[float(v) for v in ine.find("origin").get("xyz").split()]
        I=ine.find("inertia"); g=lambda k:float(I.get(k))
        Itensor=[g("ixx"),g("ixy"),g("ixz"), g("ixy"),g("iyy"),g("iyz"), g("ixz"),g("iyz"),g("izz")]
        links[L.get("name")]=dict(mass=m,com=com,I=Itensor)
    joints=[]
    for j in root.findall("joint"):
        if j.get("type") not in ("revolute","continuous"): continue
        o=j.find("origin")
        xyz=[float(v) for v in o.get("xyz").split()]
        rpy=[float(v) for v in (o.get("rpy") or "0 0 0").split()]
        ax=[float(v) for v in j.find("axis").get("xyz").split()]
        n=math.sqrt(sum(a*a for a in ax)) or 1.0; ax=[a/n for a in ax]
        ax=[0.0 if abs(a)<1e-9 else round(a) if abs(abs(a)-1)<1e-9 else a for a in ax]
        lim=j.find("limit")
        lo=hi=None
        if lim is not None and lim.get("lower") is not None:
            lo=float(lim.get("lower")); hi=float(lim.get("upper"))
        joints.append(dict(name=j.get("name"),type=j.get("type"),child=j.find("child").get("link"),
                           R=flat(rpyR(*rpy)),p=xyz,axis=ax,lower=lo,upper=hi))
    return links,joints

def fnum(x): return "%+.12e"%x

def gen_dh(urdf,joints):
    rows=[]
    for J in joints:
        R=", ".join(fnum(v) for v in J["R"]); p=", ".join(fnum(v) for v in J["p"]); a=", ".join(fnum(v) for v in J["axis"])
        rows.append("    { {%s}, {%s}, {%s} },  // %s -> %s"%(R,p,a,J["name"],J["child"]))
    # limits: revolute -> URDF limit; continuous -> +/- pi software cap
    lo=[]; hi=[]
    for J in joints:
        if J["lower"] is not None: lo.append(J["lower"]); hi.append(J["upper"])
        else: lo.append(-math.pi); hi.append(math.pi)
    los=", ".join("%.6f"%v for v in lo); his=", ".join("%.6f"%v for v in hi)
    return f"""// erobo10_dh.hpp -- AUTO-GENERATED from {os.path.basename(urdf)} by tools/gen_model_from_urdf.py.
// URDF-NATIVE kinematic chain (no DH fitting): joint i is a fixed origin transform
// (R row-major + translation p) followed by a rotation q_i about `axis`. FK to the flange:
//   T_base_flange(q) = PROD_i [ H(R_i, p_i) * Rot(axis_i, q_i) ]   (flange == last link frame)
// Used by kinematics.hpp (FK + geometric Jacobian).
#pragma once
namespace erm {{
constexpr int NJ = 6;
// One joint: fixed parent->joint origin (R row-major, p) and the rotation axis (unit).
struct UrdfJoint {{ double R[9]; double p[3]; double axis[3]; }};
inline const UrdfJoint* urdfChain() {{
  static const UrdfJoint J[NJ] = {{
{chr(10).join(rows)}
  }};
  return J;
}}
// Flange == last URDF link frame, so the legacy "tool offset" is identity (kept for API compat).
inline const double* toolOffset() {{ static const double T[16]={{1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1}}; return T; }}

// ---- joint limits (rad): revolute from URDF; continuous joints software-capped at +/- pi ----
inline const double* jointLower(){{ static const double v[NJ]={{{los}}}; return v; }}
inline const double* jointUpper(){{ static const double v[NJ]={{{his}}}; return v; }}
// ---- per-joint actuator limits from the eRob Rotary Actuator User Manual V3.39 ----
// Joint -> module -> gear ratio:  J1,J2 = eRob 142H (GR 120) | J3 = eRob 110H (GR 120) | J4,J5,J6 = eRob 80H (GR 100).
// jointEffortMax = "Permissible Max Torque with Average Load" (Manual Table 2-1, the safe sustained
//   operating limit): 142H120=281, 110H120=140, 80H100=51 Nm.  For reference -- rated/continuous:
//   178/87/31 Nm; peak start-stop: 459/217/70 Nm; NEVER-EXCEED momentary: 892/395/143 Nm.
// jointVelMax = 0.9 x "Max Output Angular Velocity" (Manual Table 12-1): ceilings 1.749/2.618/3.1416 rad/s.
// jointAccMax = velMax / 0.3 s (Manual "recommended acc/dec time >= 0.3 s", Table 12-1).
inline const double* jointVelMax(){{ static const double v[NJ]={{1.574, 1.574, 2.356, 2.827, 2.827, 2.827}}; return v; }}
inline const double* jointAccMax(){{ static const double v[NJ]={{5.25, 5.25, 7.85, 9.42, 9.42, 9.42}}; return v; }}
inline const double* jointJerkMax(){{ static const double v[NJ]={{105.0, 105.0, 157.0, 188.0, 188.0, 188.0}}; return v; }}
inline const double* jointEffortMax(){{ static const double v[NJ]={{281.0, 281.0, 140.0, 51.0, 51.0, 51.0}}; return v; }}
}}  // namespace erm
"""

def gen_dyn(urdf,links,joints,target_total=36.5):
    # The URDF CAD inertials use uncalibrated densities (total ~80.5 kg); the real arm is
    # ~target_total kg. Scale every link mass+inertia by k so the absolute scale is right while
    # the trustworthy CAD distribution (relative masses, CoM, inertia shape) is preserved.
    allmass=sum(L["mass"] for L in links.values() if L)
    k = target_total/allmass if allmass>0 else 1.0
    rows=[]
    total=0.0
    for J in joints:
        ln=links[J["child"]]; m=ln["mass"]*k; total+=m
        R=", ".join(fnum(v) for v in J["R"]); p=", ".join(fnum(v) for v in J["p"]); a=", ".join(fnum(v) for v in J["axis"])
        com=", ".join(fnum(v) for v in ln["com"]); I=", ".join(fnum(v) for v in ln["I"])
        Iscaled=[v*k for v in ln["I"]]; I=", ".join(fnum(v) for v in Iscaled)
        rows.append("    { {%s}, {%s}, {%s}, %s, {%s}, {%s} },  // %s"%(R,p,a,fnum(m),com,I,J["child"]))
    base=links.get("base")
    bm = base["mass"]*k if base else 0.0
    return f"""// erobo10_dyn.hpp -- AUTO-GENERATED from {os.path.basename(urdf)} by tools/gen_model_from_urdf.py.
// Per-joint URDF frame (parent->joint rotation R row-major + translation p + axis) and the
// CHILD link's rigid-body inertial (mass, CoM, inertia tensor about the CoM, link frame).
// Used by erm/dynamics.hpp (RNEA inverse dynamics).
//
// Masses are taken DIRECTLY from the URDF (CAD inertials), not hand-calibrated:
// CAD masses SCALED by k={k:.4f} to a real total of {target_total:.1f} kg (CAD was ~{allmass:.1f} kg,
// uncalibrated density). Distribution/CoM/inertia shape preserved; absolute scale corrected.
//   moving links j1..j6 total = {total:.3f} kg ; fixed base = {bm:.3f} kg (loads no joint, excluded).
#pragma once
namespace erm {{
struct DynLink {{ double R[9]; double p[3]; double axis[3]; double mass; double com[3]; double I[9]; }};
inline const DynLink* dynModel() {{
  static const DynLink M[6] = {{
{chr(10).join(rows)}
  }};
  return M;
}}
}}  // namespace erm
"""

def main():
    urdf=sys.argv[1]
    root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    links,joints=parse(urdf)
    assert len(joints)==6, "expected 6 joints, got %d"%len(joints)
    dh=os.path.join(root,"core","include","erm","erobo10_dh.hpp")
    dy=os.path.join(root,"core","include","erm","erobo10_dyn.hpp")
    open(dh,"w").write(gen_dh(urdf,joints))
    open(dy,"w").write(gen_dyn(urdf,links,joints))
    print("wrote", dh); print("wrote", dy)
    print("joints:", [J["type"] for J in joints])
    allm=sum(L["mass"] for L in links.values() if L); k=36.5/allm
    print("CAD total %.1f kg -> scaled k=%.4f -> moving links %.2f kg (real 36.5 kg total)"%(allm,k,sum(links[J["child"]]["mass"] for J in joints)*k))

if __name__=="__main__": main()
