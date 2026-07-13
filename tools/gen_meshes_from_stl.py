#!/usr/bin/env python3
"""gen_meshes_from_stl.py -- bake the robot STL meshes into the viewer's embedded mesh blob.

For each link it: reads the binary STL (mm), scales to metres, applies the URDF <visual><origin>
so the geometry lives in that link's frame (the viewers set mesh.matrix = linkFrame, so the
buffer must already be in the link frame), decimates by vertex clustering (keeping < 65536
unique vertices so a Uint16 index works), and base64-encodes position+index buffers in the
COBOT_MESHES format consumed by erobo10_viewer.html / cobot_mobile.html.

Usage: python3 tools/gen_meshes_from_stl.py <urdf> <base.stl> <j1.stl> ... <j6.stl>
"""
import sys, os, struct, base64, math
import numpy as np
import xml.etree.ElementTree as ET

STL_OUT = os.environ.get("STL_OUT")
KEYS = ["base_link","link1","link2","link3","link4","link5","link6"]
LINKS = ["base","j1","j2","j3","j4","j5","j6"]
TARGET_TRIS = 5000   # per mesh after decimation

def Rx(t): c,s=math.cos(t),math.sin(t); return np.array([[1,0,0],[0,c,-s],[0,s,c]])
def Ry(t): c,s=math.cos(t),math.sin(t); return np.array([[c,0,s],[0,1,0],[-s,0,c]])
def Rz(t): c,s=math.cos(t),math.sin(t); return np.array([[c,-s,0],[s,c,0],[0,0,1]])
def rpyR(r,p,y): return Rz(y)@Ry(p)@Rx(r)

def read_stl(path):
    with open(path,"rb") as f: data=f.read()
    n=struct.unpack("<I",data[80:84])[0]
    tris=np.zeros((n,3,3),np.float64); off=84
    for i in range(n):
        vals=struct.unpack("<12f", data[off:off+48]); off+=50
        tris[i,0]=vals[3:6]; tris[i,1]=vals[6:9]; tris[i,2]=vals[9:12]
    return tris   # (n,3,3) in mm

def write_stl(path, tris):
    """Write a binary STL (metres). tris: (n,3,3)."""
    n=len(tris); out=bytearray(b"\0"*80); out+=struct.pack("<I",n)
    v0=tris[:,0]; v1=tris[:,1]; v2=tris[:,2]
    nrm=np.cross(v1-v0,v2-v0); ln=np.linalg.norm(nrm,axis=1,keepdims=True); ln[ln==0]=1; nrm=nrm/ln
    for i in range(n):
        out+=struct.pack("<12fH", *nrm[i], *tris[i,0], *tris[i,1], *tris[i,2], 0)
    open(path,"wb").write(out)

def visual_origins(urdf):
    root=ET.parse(urdf).getroot(); out={}
    for L in root.findall("link"):
        v=L.find("visual")
        if v is None: out[L.get("name")]=(np.eye(3),np.zeros(3)); continue
        o=v.find("origin")
        xyz=np.array([float(x) for x in (o.get("xyz") or "0 0 0").split()])
        rpy=[float(x) for x in (o.get("rpy") or "0 0 0").split()]
        out[L.get("name")]=(rpyR(*rpy), xyz)
    return out

def cluster_decimate(tris, target_tris):
    V=tris.reshape(-1,3)                       # all triangle corners (metres)
    mn=V.min(0); mx=V.max(0); diag=float(np.linalg.norm(mx-mn)) or 1.0
    # choose grid so triangle count lands near target; iterate a few times
    G=40
    for _ in range(8):
        cell=diag/G
        idx=np.floor((V-mn)/cell).astype(np.int64)
        keys=idx[:,0]*73856093 ^ idx[:,1]*19349663 ^ idx[:,2]*83492791
        uniq,inv=np.unique(keys,return_inverse=True)
        # representative position = mean of members
        reps=np.zeros((len(uniq),3)); cnt=np.zeros(len(uniq))
        np.add.at(reps,inv,V); np.add.at(cnt,inv,1.0); reps/=cnt[:,None]
        f=inv.reshape(-1,3)
        good=(f[:,0]!=f[:,1])&(f[:,1]!=f[:,2])&(f[:,0]!=f[:,2])
        f=f[good]
        # drop duplicate faces
        fs=np.sort(f,axis=1); _,uf=np.unique(fs,axis=0,return_index=True); f=f[np.sort(uf)]
        if len(f)<=target_tris*1.3 and len(reps)<65500: break
        G=int(G*0.8) if (len(f)>target_tris*1.3) else G
        if G<6: break
    # compact used vertices
    used=np.unique(f); remap=-np.ones(len(reps),np.int64); remap[used]=np.arange(len(used))
    return reps[used].astype(np.float32), remap[f].astype(np.uint16)

def main():
    urdf=sys.argv[1]; stls=sys.argv[2:9]
    vo=visual_origins(urdf)
    out=["// erobo10 cobot meshes (decimated from the corrected URDF STLs, baked to link frames,",
         "// metres). Self-contained fallback so the 3D viewers show the real arm from any folder.",
         "window.COBOT_MESHES = {"]
    total=0
    for key,link,stl in zip(KEYS,LINKS,stls):
        tris=read_stl(stl)/1000.0                      # mm -> m
        R,p=vo[link]
        V=(tris.reshape(-1,3)@R.T+p).reshape(-1,3,3)   # bake visual origin -> link frame
        if STL_OUT:
            write_stl(os.path.join(STL_OUT, key+".STL"), V)
        pos,faces=cluster_decimate(V,TARGET_TRIS)
        pb=base64.b64encode(pos.tobytes()).decode()
        ib=base64.b64encode(faces.tobytes()).decode()
        total+=len(pb)+len(ib)
        out.append('  "%s":{"p":"%s","i":"%s"},'%(key,pb,ib))
        print("%-9s verts=%5d tris=%5d"%(link,len(pos),len(faces)))
    out.append("};")
    js="\n".join(out)
    dst=os.path.join(os.path.dirname(os.path.abspath(__file__)),"cobot_meshes.js")
    open(dst,"w").write(js)
    print("wrote",dst,"(%.0f KB)"%(len(js)/1024))

if __name__=="__main__": main()
