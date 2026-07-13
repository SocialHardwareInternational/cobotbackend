#!/usr/bin/env python3
"""pose_tester.py -- simple GUI to test MoveJ / MoveL / MoveP poses on the cobot.

  python3 tools/pose_tester.py            # connects to ws://localhost:8765 by default

Tabs for MoveJ (joint angles), MoveL / PTP (Cartesian pose) and MoveP (blended path).
The "Randomize" button on each tab fills every field with a REALISTIC, reachable value:
it picks random joint angles inside the limits and runs forward kinematics, so the pose it
produces is always a pose the arm can actually reach. Needs: python3-tk + websockets.
"""
import tkinter as tk
from tkinter import ttk
import json, threading, asyncio, queue, os, math, random
import xml.etree.ElementTree as ET
import websockets

R2D = 57.29577951308232
HERE = os.path.dirname(os.path.abspath(__file__))
URDF = os.path.join(HERE, "..", "robot", "erobo10.urdf")

# ---------------- URDF forward kinematics (for the realistic randomizer) ----------------
def _load():
    joints, lo, hi = [], [], []
    for j in ET.parse(URDF).getroot().findall("joint"):
        if j.get("type") != "revolute":
            continue
        o = j.find("origin")
        joints.append((
            [float(v) for v in (o.get("xyz") or "0 0 0").split()],
            [float(v) for v in (o.get("rpy") or "0 0 0").split()],
            [float(v) for v in j.find("axis").get("xyz").split()]))
        lim = j.find("limit")
        lo.append(float(lim.get("lower")) if lim is not None else -3.14)
        hi.append(float(lim.get("upper")) if lim is not None else 3.14)
    return joints, lo, hi
JOINTS, LO, HI = _load()

def _matmul(A, B): return [[sum(A[i][k]*B[k][j] for k in range(4)) for j in range(4)] for i in range(4)]
def _rpy(r, p, y):
    cr,sr,cp,sp,cy,sy = math.cos(r),math.sin(r),math.cos(p),math.sin(p),math.cos(y),math.sin(y)
    return [[cy*cp,cy*sp*sr-sy*cr,cy*sp*cr+sy*sr,0],[sy*cp,sy*sp*sr+cy*cr,sy*sp*cr-cy*sr,0],[-sp,cp*sr,cp*cr,0],[0,0,0,1]]
def _axis(ax, t):
    n=math.sqrt(sum(a*a for a in ax)) or 1.0; x,yy,z=(a/n for a in ax); c,s,C=math.cos(t),math.sin(t),1-math.cos(t)
    return [[c+x*x*C,x*yy*C-z*s,x*z*C+yy*s,0],[yy*x*C+z*s,c+yy*yy*C,yy*z*C-x*s,0],[z*x*C-yy*s,z*yy*C+x*s,c+z*z*C,0],[0,0,0,1]]
def fk(q):
    """joint angles (rad) -> (x,y,z, roll,pitch,yaw)."""
    T=[[1 if i==j else 0 for j in range(4)] for i in range(4)]
    for i,(xyz,rpy,ax) in enumerate(JOINTS):
        O=_rpy(*rpy); O[0][3],O[1][3],O[2][3]=xyz
        T=_matmul(_matmul(T,O), _axis(ax,q[i]))
    x,y,z=T[0][3],T[1][3],T[2][3]
    pitch=math.atan2(-T[2][0],math.hypot(T[0][0],T[1][0])); yaw=math.atan2(T[1][0],T[0][0]); roll=math.atan2(T[2][1],T[2][2])
    return x,y,z,roll,pitch,yaw

def rand_q():
    """random joint config, kept in a sensible working range (not at the limits)."""
    q=[random.uniform(max(LO[i],-2.6)*0.85, min(HI[i],2.6)*0.85) for i in range(6)]
    q[1]=random.uniform(-0.2,1.3); q[2]=random.uniform(-1.7,0.2)   # bias shoulder/elbow into the workspace
    return q
def realistic_pose():
    last=None
    for _ in range(60):
        q=rand_q(); x,y,z,r,p,yw=fk(q); last=(x,y,z,r,p,yw)
        if 0.12<z<1.25 and 0.25<math.sqrt(x*x+y*y+z*z)<1.15:
            return last
    return last
def realistic_path(n=3):
    base=rand_q(); out=[fk(base)]; q=base[:]
    for _ in range(n-1):
        q=[min(max(q[i]+random.uniform(-0.28,0.28),LO[i]),HI[i]) for i in range(6)]
        out.append(fk(q))
    return out

# ---------------- WebSocket client (asyncio in a background thread) ----------------
class WS:
    def __init__(self, recv_q):
        self.recv_q=recv_q; self.send_q=queue.Queue(); self.loop=None; self.connected=False; self._stop=False
    def start(self, url):
        self._stop=False
        threading.Thread(target=self._thread, args=(url,), daemon=True).start()
    def _thread(self, url):
        self.loop=asyncio.new_event_loop(); asyncio.set_event_loop(self.loop)
        try: self.loop.run_until_complete(self._run(url))
        except Exception as e: self.recv_q.put({"type":"_status","ok":False,"msg":str(e)})
    async def _run(self, url):
        try:
            async with websockets.connect(url) as ws:
                self.connected=True; self.recv_q.put({"type":"_status","ok":True,"msg":"connected"})
                snd=asyncio.ensure_future(self._sender(ws))
                async for raw in ws:
                    try: self.recv_q.put(json.loads(raw))
                    except Exception: pass
                snd.cancel()
        except Exception as e:
            self.recv_q.put({"type":"_status","ok":False,"msg":str(e)})
        finally:
            self.connected=False; self.recv_q.put({"type":"_status","ok":False,"msg":"disconnected"})
    async def _sender(self, ws):
        while not self._stop:
            try: obj=self.send_q.get_nowait()
            except queue.Empty: await asyncio.sleep(0.02); continue
            try: await ws.send(json.dumps(obj))
            except Exception: break
    def send(self, obj):
        if self.connected: self.send_q.put(obj)

# ---------------- GUI ----------------
class App:
    def __init__(self, root):
        self.root=root; root.title("cobot pose tester — MoveJ / MoveL / MoveP")
        self.recv_q=queue.Queue(); self.ws=WS(self.recv_q)
        top=ttk.Frame(root,padding=8); top.pack(fill="x")
        ttk.Label(top,text="Bridge:").pack(side="left")
        self.url=tk.StringVar(value="ws://localhost:8765")
        ttk.Entry(top,textvariable=self.url,width=24).pack(side="left",padx=4)
        ttk.Button(top,text="Connect",command=self.connect).pack(side="left")
        self.status=ttk.Label(top,text="offline",foreground="#b00"); self.status.pack(side="left",padx=8)
        for txt,cmd in [("Enable",lambda:self.ws.send({"cmd":"enable"})),
                        ("Disable",lambda:self.ws.send({"cmd":"disable"})),
                        ("Stop",lambda:self.ws.send({"cmd":"stop"})),
                        ("Reset",lambda:self.ws.send({"cmd":"reset"})),
                        ("E-STOP",lambda:self.ws.send({"cmd":"estop"}))]:
            ttk.Button(top,text=txt,command=cmd).pack(side="right",padx=2)
        sp=ttk.Frame(root,padding=(8,0)); sp.pack(fill="x")
        ttk.Label(sp,text="speed").pack(side="left")
        self.speed=tk.DoubleVar(value=0.4)
        ttk.Scale(sp,from_=0.05,to=1.0,variable=self.speed,orient="horizontal",length=160).pack(side="left",padx=6)
        self.spv=ttk.Label(sp,text="0.40"); self.spv.pack(side="left")
        self.speed.trace_add("write",lambda *_:self.spv.config(text=f"{self.speed.get():.2f}"))

        nb=ttk.Notebook(root); nb.pack(fill="both",expand=True,padx=8,pady=6)
        self.je=self._tab_movej(nb)
        self.le=self._tab_movel(nb)
        self.pe=self._tab_movep(nb)

        st=ttk.LabelFrame(root,text="Live state",padding=6); st.pack(fill="x",padx=8)
        self.state=ttk.Label(st,text="(connect to see live joints + flange pose)",font=("Consolas",9)); self.state.pack(anchor="w")
        lf=ttk.LabelFrame(root,text="Log",padding=4); lf.pack(fill="both",expand=True,padx=8,pady=(0,8))
        self.log=tk.Text(lf,height=7,font=("Consolas",9),bg="#0e1116",fg="#d6dae2"); self.log.pack(fill="both",expand=True)
        self.root.after(60,self._poll)

    def _grid(self,parent,labels,defaults):
        ents=[]
        for i,(lb,dv) in enumerate(zip(labels,defaults)):
            ttk.Label(parent,text=lb).grid(row=0,column=i,padx=3,pady=3)
            e=ttk.Entry(parent,width=9); e.insert(0,dv); e.grid(row=1,column=i,padx=3); ents.append(e)
        return ents
    def _set(self,ents,vals):
        for e,v in zip(ents,vals): e.delete(0,"end"); e.insert(0,f"{v:.4f}")

    def _tab_movej(self,nb):
        f=ttk.Frame(nb,padding=10); nb.add(f,text="MoveJ (joints)")
        g=ttk.Frame(f); g.pack()
        ents=self._grid(g,["J1","J2","J3","J4","J5","J6"],["0.0"]*6)
        b=ttk.Frame(f); b.pack(pady=8)
        ttk.Button(b,text="🎲 Randomize",command=lambda:self._set(ents,rand_q())).pack(side="left",padx=4)
        ttk.Button(b,text="All → 0",command=lambda:self._set(ents,[0]*6)).pack(side="left",padx=4)
        ttk.Button(b,text="▶ Send MoveJ",command=lambda:self._send_j(ents)).pack(side="left",padx=4)
        ttk.Label(f,text="joint angles in radians",foreground="#888").pack()
        return ents
    def _tab_movel(self,nb):
        f=ttk.Frame(nb,padding=10); nb.add(f,text="MoveL / PTP (pose)")
        g=ttk.Frame(f); g.pack()
        ents=self._grid(g,["X","Y","Z","Roll","Pitch","Yaw"],["-0.4","-0.6","0.9","3.14","0.0","0.0"])
        b=ttk.Frame(f); b.pack(pady=8)
        ttk.Button(b,text="🎲 Randomize",command=lambda:self._set(ents,realistic_pose())).pack(side="left",padx=4)
        ttk.Button(b,text="▶ Send MoveL (line)",command=lambda:self._send_pose(ents,"move_lin")).pack(side="left",padx=4)
        ttk.Button(b,text="▶ Send PTP (MoveJ→pose)",command=lambda:self._send_pose(ents,"move_ptp")).pack(side="left",padx=4)
        ttk.Label(f,text="X Y Z in metres · Roll Pitch Yaw in radians",foreground="#888").pack()
        return ents
    def _tab_movep(self,nb):
        f=ttk.Frame(nb,padding=10); nb.add(f,text="MoveP (blended path)")
        g=ttk.Frame(f); g.pack()
        for j,lb in enumerate(["","X","Y","Z","Roll","Pitch","Yaw"]):
            ttk.Label(g,text=lb).grid(row=0,column=j,padx=3)
        rows=[]
        for r in range(3):
            ttk.Label(g,text=f"WP{r+1}").grid(row=r+1,column=0)
            row=[]
            for c in range(6):
                e=ttk.Entry(g,width=8); e.insert(0,"0"); e.grid(row=r+1,column=c+1,padx=3,pady=2); row.append(e)
            rows.append(row)
        opt=ttk.Frame(f); opt.pack(pady=6)
        ttk.Label(opt,text="blend (m)").pack(side="left"); self.blend=ttk.Entry(opt,width=7); self.blend.insert(0,"0.04"); self.blend.pack(side="left",padx=4)
        ttk.Label(opt,text="tool speed (m/s)").pack(side="left"); self.tspeed=ttk.Entry(opt,width=7); self.tspeed.insert(0,"0.10"); self.tspeed.pack(side="left",padx=4)
        b=ttk.Frame(f); b.pack(pady=6)
        ttk.Button(b,text="🎲 Randomize path",command=lambda:self._rand_path(rows)).pack(side="left",padx=4)
        ttk.Button(b,text="▶ Send MoveP",command=lambda:self._send_p(rows)).pack(side="left",padx=4)
        ttk.Label(f,text="3 reachable waypoints near each other → constant-speed blended path",foreground="#888").pack()
        return rows

    # --- senders ---
    def _flt(self,ents): 
        try: return [float(e.get()) for e in ents]
        except ValueError: self._logln("! invalid number in a field"); return None
    def _send_j(self,ents):
        q=self._flt(ents)
        if q: self.ws.send({"cmd":"move_joint","q":q,"speed":self.speed.get()}); self._logln(f"→ MoveJ {[round(v,3) for v in q]}")
    def _send_pose(self,ents,cmd):
        v=self._flt(ents)
        if v: self.ws.send({"cmd":cmd,"pos":v[:3],"rpy":v[3:],"speed":self.speed.get()}); self._logln(f"→ {cmd} pos={[round(x,3) for x in v[:3]]} rpy={[round(x,3) for x in v[3:]]}")
    def _rand_path(self,rows):
        for row,wp in zip(rows,realistic_path(3)): self._set(row,wp)
    def _send_p(self,rows):
        wps=[]
        for row in rows:
            v=self._flt(row)
            if v is None: return
            wps.append({"pos":v[:3],"rpy":v[3:]})
        try: blend=float(self.blend.get()); ts=float(self.tspeed.get())
        except ValueError: self._logln("! invalid blend/tool speed"); return
        self.ws.send({"cmd":"move_p","waypoints":wps,"blend":blend,"tool_speed":ts}); self._logln(f"→ MoveP {len(wps)} wp, blend={blend}, tool_speed={ts}")

    def connect(self):
        self.status.config(text="connecting…",foreground="#b80"); self.ws.start(self.url.get())
    def _logln(self,t):
        self.log.insert("end",t+"\n"); self.log.see("end")
    def _poll(self):
        try:
            while True:
                m=self.recv_q.get_nowait()
                tp=m.get("type")
                if tp=="_status":
                    self.status.config(text=m["msg"],foreground="#0a0" if m.get("ok") else "#b00")
                    self._logln("· "+m["msg"])
                elif tp=="state":
                    q=m["q"]; fp=m["flange"]["pos"]
                    self.state.config(text="J(deg)= "+" ".join(f"{v*R2D:6.1f}" for v in q)+
                                      f"   flange xyz= {fp[0]:+.3f} {fp[1]:+.3f} {fp[2]:+.3f}   mode={m['mode']}"+
                                      (f"   torque={m.get('torque_util',0)*100:.0f}%" if 'torque_util' in m else ""))
                elif tp=="ack":
                    ok=m.get("ok"); msg=m.get("message","")
                    self._logln(f"  ack {m.get('cmd')}: {'OK' if ok else 'FAIL'} {msg}".rstrip())
        except queue.Empty:
            pass
        self.root.after(60,self._poll)

if __name__=="__main__":
    root=tk.Tk(); root.geometry("760x560"); App(root); root.mainloop()
