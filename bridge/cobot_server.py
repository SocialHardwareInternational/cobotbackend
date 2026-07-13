#!/usr/bin/env python3
"""cobot_server.py -- ONE server, ONE port: serves the phone/desktop UI *and* the
control API from the same origin over plain HTTP.

Why: a phone often can load a page from the robot but still fails to open a second
WebSocket port (8765) -- WS upgrades get blocked by some networks, captive portals,
or it was opened as a file://. This server removes that whole class of problems:

  phone browser --HTTP GET /api/state , POST /api/cmd--> this server --shm--> control plane

If the page loads on the phone, control works, because it is the *exact same origin*
(same host, same port, plain HTTP -- no second connection, no WebSocket, no IP entry).

Run on the robot (after control_node + planner + ik_solver are up):
    python3 bridge/cobot_server.py            # 0.0.0.0:8080
Then open the printed http://<robot-ip>:8080/ on the phone (same Wi-Fi).
"""
import argparse, json, math, os, socket, sys, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))   # find shm_layout
from waypoints import WaypointStore
WP = WaypointStore()
from shm_layout import (ShmClient, CMD_MOVE_JOINT, CMD_MOVE_PTP, CMD_MOVE_LIN,
                        CMD_STOP, CMD_HOLD, CMD_JOG, CMD_MOVE_P, CMD_ENABLE, CMD_DISABLE,
                        CMD_FREEDRIVE_ON, CMD_FREEDRIVE_OFF, JOINT_EFFORT)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # project root
shm = None
shm_lock = threading.Lock()

CT = {".html":"text/html;charset=utf-8", ".js":"application/javascript;charset=utf-8",
      ".css":"text/css;charset=utf-8", ".json":"application/json", ".svg":"image/svg+xml",
      ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".ico":"image/x-icon",
      ".stl":"application/octet-stream", ".STL":"application/octet-stream", ".wasm":"application/wasm"}

def rpy_to_quat(r, p, y):
    cr, sr = math.cos(r/2), math.sin(r/2); cp, sp = math.cos(p/2), math.sin(p/2); cy, sy = math.cos(y/2), math.sin(y/2)
    return [cr*cp*cy + sr*sp*sy, sr*cp*cy - cr*sp*sy, cr*sp*cy + sr*cp*sy, cr*cp*sy - sr*sp*cy]

def pose_from_msg(m):
    pos = m.get("pos", [0,0,0])
    q = m["quat"] if "quat" in m else (rpy_to_quat(*m["rpy"]) if "rpy" in m else [1,0,0,0])
    return [float(pos[0]),float(pos[1]),float(pos[2]),float(q[0]),float(q[1]),float(q[2]),float(q[3])]

def quat_to_rpy(q):
    """[w,x,y,z] -> [roll, pitch, yaw] radians (ZYX)."""
    w, x, y, z = (list(q) + [0,0,0,0])[:4]
    roll  = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw   = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return [roll, pitch, yaw]

def pose_dict(state):
    """Flange pose from a state snapshot -> {pos:{x,y,z} m, rot:{roll,pitch,yaw} rad}."""
    p = state["flange_pos"]; r = quat_to_rpy(state["flange_quat"])
    return {"pos": {"x": round(p[0],6), "y": round(p[1],6), "z": round(p[2],6)},
            "rot": {"roll": round(r[0],6), "pitch": round(r[1],6), "yaw": round(r[2],6)}}

def state_msg(s):
    st = s.get("status", ""); jop = [True]*6
    if "op=" in st:
        for i, ch in enumerate(st.split("op=",1)[1].strip()[:6]): jop[i] = (ch == "1")
    return {"joint_op": jop, "type":"state", "t": round(s["t"],4), "mode": s["mode_name"],
            "estop": s["estop"], "enabled": s["enabled"], "moving": s["moving"],
            "freedrive": s["mode_name"]=="FREEDRIVE", "progress": round(s["progress"],4),
            "manip": round(s["manip"],6), "q":[round(v,6) for v in s["q"]], "qd":[round(v,6) for v in s["qd"]],
            "torque":[round(v,2) for v in s["torque"]],
            "torque_util": round(max(abs(s["torque"][i])/JOINT_EFFORT[i] for i in range(6)),3),
            "temp":[round(v,1) for v in s["temp"]], "current":[round(v,3) for v in s["current"]],
            "voltage":[round(v,1) for v in s["voltage"]], "torque_meas":[round(v,1) for v in s["torque_meas"]],
            "brake":[1 if b else 0 for b in s["brake"]],
            "coll_dist": round(s["coll_dist"],3), "coll_warn": 1 if s["coll_warn"] else 0,
            "coll_stop": 1 if s["coll_stop"] else 0, "singular": 1 if s["singular"] else 0,
            "coll_pair": [s["coll_i"], s["coll_j"]],
            "flange": {"pos":[round(v,6) for v in s["flange_pos"]], "quat":[round(v,6) for v in s["flange_quat"]]}}

def dispatch(m):
    """Same command semantics as ws_bridge.handle(), synchronous, under one lock."""
    cmd = m.get("cmd")
    # ---- named waypoints (persistent on the robot, shared across UIs) ----
    if cmd == "wp_list":
        return {"type": "waypoints", "waypoints": WP.list()}
    if cmd == "wp_save":
        q = m.get("q"); pose = m.get("pose")
        if not q or not pose:
            with shm_lock: stt = shm.read_state()
            if not q: q = stt["q"]
            if not pose: pose = pose_dict(stt)        # capture the live flange pose
        try: wp = WP.add(m.get("name", ""), q, pose)
        except Exception as e: return {"type": "error", "message": str(e)}
        return {"type": "waypoints", "waypoints": WP.list(), "saved": wp["id"]}
    if cmd == "wp_update":
        WP.update(m.get("id"), m.get("name"), m.get("q"), m.get("pose"))
        return {"type": "waypoints", "waypoints": WP.list()}
    if cmd == "wp_delete":
        WP.delete(m.get("id"))
        return {"type": "waypoints", "waypoints": WP.list()}
    if cmd == "wp_goto":
        wp = WP.get(m.get("id"))
        if not wp: return {"type": "ack", "cmd": "wp_goto", "ok": False, "message": "waypoint not found"}
        with shm_lock:
            if not shm.read_state()["enabled"]:
                return {"type": "ack", "cmd": "wp_goto", "ok": False, "message": "enable the drives first"}
            res = shm.send_command(CMD_MOVE_JOINT, target_q=wp["q"], speed=float(m.get("speed", 0.3)))
        return {"type": "ack", "cmd": "wp_goto", "ok": bool(res.get("ok")), "id": wp["id"], "name": wp["name"]}
    with shm_lock:
        if cmd == "get_state":
            return state_msg(shm.read_state())
        if cmd in ("move_joint","move_ptp","move_lin","move_p","jog"):
            stt = shm.read_state()
            if not stt["enabled"]:
                return {"type":"ack","cmd":cmd,"ok":False,"message":"drives not enabled - tap Enable first"}
            if stt["mode_name"] == "FREEDRIVE":
                return {"type":"ack","cmd":cmd,"ok":False,"message":"in free-drive - turn it off first"}
        try:
            if cmd == "move_joint":
                res = shm.send_command(CMD_MOVE_JOINT, target_q=m["q"], speed=float(m.get("speed",1.0)))
            elif cmd in ("move_ptp","move_lin"):
                ct = CMD_MOVE_PTP if cmd=="move_ptp" else CMD_MOVE_LIN
                res = shm.send_command(ct, target_pose=pose_from_msg(m), speed=float(m.get("speed",1.0)))
            elif cmd == "stop":  shm.send_command(CMD_STOP);  res = {"ok":True}
            elif cmd == "hold":  shm.send_command(CMD_HOLD);  res = {"ok":True}
            elif cmd == "estop": shm.send_command(CMD_STOP, estop_req=1); res = {"ok":True}
            elif cmd == "reset": shm.send_command(CMD_HOLD, reset_req=1); res = {"ok":True}
            elif cmd == "enable":  shm.send_command(CMD_ENABLE);  res = {"ok":True}
            elif cmd == "disable": shm.send_command(CMD_DISABLE); res = {"ok":True}
            elif cmd == "freedrive":
                on = bool(m.get("on", True)); shm.send_command(CMD_FREEDRIVE_ON if on else CMD_FREEDRIVE_OFF); res = {"ok":True}
            elif cmd == "set_payload":
                kg = float(m.get("kg", m.get("payload",0.0))); shm.set_payload(kg); res = {"ok":True,"payload":kg}
            elif cmd == "jog":
                fr = {"joint":0,"base":1,"tool":2}.get(m.get("frame","joint"),0)
                shm.send_command(CMD_JOG, target_q=m.get("vel",[0]*6), frame=fr, speed=float(m.get("speed",1.0))); res = {"ok":True}
            elif cmd == "move_p":
                pts = [pose_from_msg(w) for w in m.get("waypoints",[])]
                res = shm.send_path(pts, float(m.get("blend",0.05)), float(m.get("tool_speed",0.25)), float(m.get("tool_acc",1.2)))
            else:
                return {"type":"error","message":f"unknown cmd '{cmd}'"}
        except Exception as e:
            return {"type":"error","cmd":cmd,"message":str(e)}
        ack = {"type":"ack","cmd":cmd,"ok":bool(res.get("ok"))}
        if "pos_err" in res: ack["pos_err"] = res["pos_err"]
        if "message" in res: ack["message"] = res["message"]
        if not res.get("ok") and "pos_err" in res and "message" not in ack:
            ack["message"] = "unreachable / IK failed or not enabled"
        return ack


# Injected into the landscape joystick UI (tools/cobot_mobile.html) so its WebSocket
# client transparently runs over THIS server's same-origin HTTP API -- one port, no WS.
WS_SHIM = """<script>
/* same-origin transport shim: WebSocket UI -> plain HTTP on one port (no 2nd connection) */
(function(){
  function FakeWS(url){ this.url=url; this.readyState=0; this.onopen=this.onclose=this.onerror=this.onmessage=null;
    var self=this; this._alive=true; this._t=null;
    setTimeout(function(){ self.readyState=1; self.onopen&&self.onopen({});
      self.onmessage&&self.onmessage({data:JSON.stringify({type:"welcome",robot:"erobo10"})}); self._loop(); }, 25); }
  FakeWS.prototype._loop=function(){ var self=this; if(!self._alive) return;
    fetch("/api/state",{cache:"no-store"}).then(function(r){return r.json();}).then(function(s){
      if(self.onmessage && s && s.type==="state") self.onmessage({data:JSON.stringify(s)});
    }).catch(function(){}).then(function(){ if(self._alive) self._t=setTimeout(function(){self._loop();},120); }); };
  FakeWS.prototype.send=function(data){ var self=this; try{JSON.parse(data);}catch(e){return;}
    fetch("/api/cmd",{method:"POST",headers:{"Content-Type":"application/json"},body:data})
      .then(function(r){return r.json();}).then(function(a){ if(self.onmessage && a && a.type) self.onmessage({data:JSON.stringify(a)}); }).catch(function(){}); };
  FakeWS.prototype.close=function(){ this._alive=false; if(this._t) clearTimeout(this._t); this.readyState=3; this.onclose&&this.onclose({}); };
  FakeWS.CONNECTING=0; FakeWS.OPEN=1; FakeWS.CLOSING=2; FakeWS.CLOSED=3;
  window.WebSocket=FakeWS;
})();
</script>"""

class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin","*")
        self.send_header("Access-Control-Allow-Methods","GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers","Content-Type")
    def _send(self, body, code=200, ctype="application/json"):
        if isinstance(body, (dict, list)): body = json.dumps(body).encode()
        elif isinstance(body, str): body = body.encode()
        self.send_response(code); self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body))); self._cors(); self.end_headers()
        try: self.wfile.write(body)
        except Exception: pass
    def do_OPTIONS(self): self.send_response(204); self._cors(); self.end_headers()
    def do_GET(self):
        path = self.path.split("?",1)[0]
        if path == "/api/state":
            try:
                with shm_lock: s = shm.read_state()
                return self._send(state_msg(s))
            except Exception as e:
                return self._send({"type":"error","message":str(e)}, 500)
        if path == "/api/ping": return self._send({"ok":True,"robot":"erobo10"})
        if path in ("/","/index.html","/phone","/mobile"): return self._serve_mobile()
        return self._static(path)
    def do_POST(self):
        if self.path.split("?",1)[0] != "/api/cmd":
            return self._send({"type":"error","message":"not found"}, 404)
        try:
            n = int(self.headers.get("Content-Length", 0) or 0)
            m = json.loads(self.rfile.read(n) or b"{}")
        except Exception:
            return self._send({"type":"error","message":"invalid JSON"}, 400)
        return self._send(dispatch(m))
    def _serve_mobile(self):
        path = os.path.join(ROOT, "tools", "cobot_mobile.html")
        try:
            with open(path, encoding="utf-8") as f: html = f.read()
        except Exception as e:
            return self._send("cobot_mobile.html not found: %s" % e, 500, "text/plain")
        html = html.replace("</head>", WS_SHIM + "\n</head>", 1) if "</head>" in html else (WS_SHIM + html)
        self._send(html, 200, "text/html;charset=utf-8")
    def _static(self, path):
        rel = os.path.normpath(path.lstrip("/")).replace("\\","/")
        full = os.path.join(ROOT, rel)
        if (not os.path.abspath(full).startswith(ROOT)) or (not os.path.isfile(full)):
            return self._send("not found", 404, "text/plain")
        ext = os.path.splitext(full)[1]
        try:
            with open(full,"rb") as f: data = f.read()
        except Exception as e:
            return self._send(str(e), 500, "text/plain")
        self._send(data, 200, CT.get(ext, CT.get(ext.lower(), "application/octet-stream")))
    def log_message(self, *a): pass

def lan_ips():
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(("8.8.8.8",80))
        ips.append(s.getsockname()[0]); s.close()
    except Exception: pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith("127.") and ip not in ips: ips.append(ip)
    except Exception: pass
    return ips or ["<this-machine-ip>"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shm", default="/dev/shm/erobo10_shm")
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=8080)
    args = ap.parse_args()
    global shm
    shm = ShmClient(args.shm)
    ThreadingHTTPServer.allow_reuse_address = True
    try:
        srv = ThreadingHTTPServer((args.host, args.port), H)
    except OSError as e:
        print(f"[cobot_server] port {args.port} unavailable ({e}); phone server not started "
              f"(the WebSocket bridge on 8765 is unaffected). Free the port or pass --port.")
        return
    bar = "="*54
    print(bar); print(" erobo10 cobot server -- UI + control on ONE port")
    print(bar); print(f" attached to shm: {args.shm}")
    print(" open ONE of these on your phone (same Wi-Fi as the robot):")
    for ip in lan_ips(): print(f"     http://{ip}:{args.port}/")
    print(" everything (page + control) goes over this one address.")
    print(bar)
    try: srv.serve_forever()
    except KeyboardInterrupt: print("\n[cobot_server] bye")

if __name__ == "__main__":
    main()
