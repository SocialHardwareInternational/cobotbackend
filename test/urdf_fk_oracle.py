import numpy as np, xml.etree.ElementTree as ET, sys, os
URDF=os.path.join(os.path.dirname(__file__),"..","robot","erobo10.urdf")
J=[]
for j in ET.parse(URDF).getroot().findall("joint"):
    if j.get("type") not in ("revolute","continuous"): continue
    o=j.find("origin")
    J.append((np.array([float(v) for v in o.get("xyz").split()]),
              np.array([float(v) for v in o.get("rpy").split()]),
              np.array([float(v) for v in j.find("axis").get("xyz").split()])))
def Rx(t):c,s=np.cos(t),np.sin(t);return np.array([[1,0,0],[0,c,-s],[0,s,c]])
def Ry(t):c,s=np.cos(t),np.sin(t);return np.array([[c,0,s],[0,1,0],[-s,0,c]])
def Rz(t):c,s=np.cos(t),np.sin(t);return np.array([[c,-s,0],[s,c,0],[0,0,1]])
def H(R,p):
    T=np.eye(4);T[:3,:3]=R;T[:3,3]=p;return T
def rax(a,q):
    a=a/np.linalg.norm(a);K=np.array([[0,-a[2],a[1]],[a[2],0,-a[0]],[-a[1],a[0],0]])
    return np.eye(3)+np.sin(q)*K+(1-np.cos(q))*(K@K)
def fk(q):
    T=np.eye(4)
    for i,(xyz,rpy,ax) in enumerate(J):
        T=T@H(Rz(rpy[2])@Ry(rpy[1])@Rx(rpy[0]),xyz)@H(rax(ax,q[i]),np.zeros(3))
    return T
CFG=[[0,0,0,0,0,0],[0.5,-0.3,0.8,-0.4,0.6,-0.2],[1.2,0.7,-1.1,0.9,-0.5,1.3],
     [-2.0,1.5,2.5,-1.8,0.3,-2.2],[3.0,-3.0,3.0,-3.0,3.0,-3.0],[0.1,0.2,0.3,0.4,0.5,0.6]]
for q in CFG:
    T=fk(np.array(q,float))
    print(" ".join("%.12f"%T[r,c] for r in range(3) for c in range(4)))
