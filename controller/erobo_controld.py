#!/usr/bin/env python3
"""erobo_controld.py -- the eRoBo production controller service.

ONE daemon owning every non-real-time controller duty (the real-time motion stays
in the C++ control plane over shared memory):

  * WebSocket API  (:8765)  -- live state stream + full command set (pendant/Studio)
  * REST API + UI  (:8080)  -- /api/v1/* for integrations, serves the Studio web build,
                               plus the legacy /api/state & /api/cmd (phone UI compat)
  * Modbus TCP     (:1502)  -- PLC/SCADA register map (see bridge/modbus_server.py)
  * MQTT publisher (opt-in) -- state + events to a broker (settings.json)
  * Event log / flight recorder (SQLite), usage counters, alarm summaries
  * Users, roles and API sessions;  settings; backup & restore

Run:  python3 controller/erobo_controld.py [--shm /dev/shm/erobo10_shm]
      (after the C++ control plane is up; see scripts/ and deploy/)
"""
import argparse
import asyncio
import base64
import io
import json
import mimetypes
import os
import socket
import struct
import sys
import tarfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "bridge"))

import websockets  # noqa: E402

import ws_bridge  # noqa: E402  (the proven command layer -- reused, not duplicated)
from ws_bridge import (WP, TCP, TOOLS, PROGS, PL, state_msg, run_typed_program,  # noqa: E402
                       load_safety_file, save_safety_file)
from shm_layout import ShmClient, CMD_ENABLE, CMD_DISABLE, CMD_STOP, CMD_HOLD  # noqa: E402
from eventlog import EventLog  # noqa: E402
from users import UserStore  # noqa: E402
from modbus_server import ModbusServer  # noqa: E402

RUN_DIR = os.environ.get("EROBO_RUN_DIR") or os.path.join(ROOT, "run")
SETTINGS_FILE = os.path.join(RUN_DIR, "settings.json")
STUDIO_DIST = os.path.join(ROOT, "studio", "dist")
VERSION = "2.0.0"

DEFAULT_SETTINGS = {
    "robot_name": "eRoBo 10",
    "modbus": {"enabled": True, "port": 1502},
    "mqtt": {"enabled": False, "host": "127.0.0.1", "port": 1883,
             "topic_prefix": "erobo", "interval_s": 1.0},
    "ui": {"default_theme": "dark"},
    "cameras": [],           # [{"name":"cell cam","url":"http://.../mjpeg"}]
}


# --------------------------------------------------------------------------
class Settings:
    def __init__(self, path=SETTINGS_FILE):
        self.path = path
        self._lock = threading.Lock()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self._data = dict(DEFAULT_SETTINGS)
        try:
            with open(path) as f:
                stored = json.load(f)
            for k, v in stored.items():
                if isinstance(v, dict) and isinstance(self._data.get(k), dict):
                    self._data[k] = {**self._data[k], **v}
                else:
                    self._data[k] = v
        except Exception:
            pass

    def get(self):
        with self._lock:
            return json.loads(json.dumps(self._data))

    def update(self, patch):
        with self._lock:
            for k, v in (patch or {}).items():
                if k not in DEFAULT_SETTINGS:
                    continue
                if isinstance(v, dict) and isinstance(self._data.get(k), dict):
                    self._data[k].update(v)
                else:
                    self._data[k] = v
            tmp = self.path + ".tmp"
            with open(tmp, "w") as f:
                json.dump(self._data, f, indent=1)
            os.replace(tmp, self.path)
            return json.loads(json.dumps(self._data))


# --------------------------------------------------------------------------
class MqttPublisher:
    """Minimal MQTT 3.1.1 QoS-0 publisher (CONNECT + PUBLISH + PINGREQ), asyncio.
    Publishes retained state at a fixed interval and events as they happen."""

    def __init__(self, settings, get_state, log):
        self.settings, self.get_state, self.log = settings, get_state, log
        self._w = None
        self._events = asyncio.Queue(maxsize=256)

    @staticmethod
    def _mqtt_str(s):
        b = s.encode()
        return struct.pack(">H", len(b)) + b

    @staticmethod
    def _remlen(n):
        out = b""
        while True:
            d = n % 128
            n //= 128
            out += bytes([d | (0x80 if n else 0)])
            if not n:
                return out

    def push_event(self, ev):
        try:
            self._events.put_nowait(ev)
        except asyncio.QueueFull:
            pass

    async def _connect(self, host, port):
        r, w = await asyncio.wait_for(asyncio.open_connection(host, port), timeout=5)
        var = self._mqtt_str("MQTT") + bytes([4, 0x02]) + struct.pack(">H", 30) + self._mqtt_str("erobo-controller")
        w.write(bytes([0x10]) + self._remlen(len(var)) + var)
        await w.drain()
        ack = await asyncio.wait_for(r.readexactly(4), timeout=5)
        if ack[0] != 0x20 or ack[3] != 0:
            raise ConnectionError("MQTT CONNACK refused (%d)" % ack[3])
        return r, w

    def _publish(self, topic, payload, retain=False):
        if not self._w:
            return
        var = self._mqtt_str(topic) + (payload if isinstance(payload, bytes) else payload.encode())
        self._w.write(bytes([0x30 | (1 if retain else 0)]) + self._remlen(len(var)) + var)

    async def run(self):
        while True:
            cfg = self.settings.get().get("mqtt", {})
            if not cfg.get("enabled"):
                await asyncio.sleep(3.0)
                continue
            try:
                r, self._w = await self._connect(cfg.get("host", "127.0.0.1"), int(cfg.get("port", 1883)))
                self.log("info", "mqtt", "MQTT_UP", "connected to %s:%s" % (cfg.get("host"), cfg.get("port")))
                prefix = cfg.get("topic_prefix", "erobo")
                t_state = 0.0
                while True:
                    now = time.time()
                    if now - t_state >= float(cfg.get("interval_s", 1.0)):
                        t_state = now
                        self._publish(prefix + "/state", json.dumps(self.get_state()), retain=True)
                        self._w.write(bytes([0xC0, 0x00]))  # PINGREQ keeps the session alive
                    while not self._events.empty():
                        self._publish(prefix + "/events", json.dumps(self._events.get_nowait()))
                    await self._w.drain()
                    if not self.settings.get().get("mqtt", {}).get("enabled"):
                        break
                    await asyncio.sleep(0.1)
            except Exception as e:
                self._w = None
                self.log("warn", "mqtt", "MQTT_DOWN", str(e))
                await asyncio.sleep(5.0)


# --------------------------------------------------------------------------
class Controller:
    """Shared context: shm client, stores, event log, alarms-from-state watcher."""

    def __init__(self, shm_path):
        self.shm = ShmClient(shm_path)
        self.events = EventLog()
        self.users = UserStore()
        self.settings = Settings()
        self.loop = None            # asyncio loop (set in main)
        self.t_boot = time.time()
        self.mqtt = None
        ws_bridge.EVENT_SINK = self.log_event
        sf = load_safety_file()
        if sf:
            self.shm.write_safety(sf)
        t = TCP.load()
        self.shm.set_tcp(t["pos"], t["quat"], t["payload"], t["cog"])
        self.log_event("info", "controller", "BOOT", "controller service v%s started" % VERSION)

    def log_event(self, level, source, code, message, data=None):
        self.events.log(level, source, code, message, data)
        if self.mqtt:
            self.mqtt.push_event({"t": round(time.time(), 3), "level": level,
                                  "source": source, "code": code, "message": message})

    def state(self):
        return state_msg(self.shm.read_state())

    # ---- alarm watcher: turn state transitions into logged events ---------
    async def watch_alarms(self):
        prev = {}
        while True:
            try:
                s = self.state()
            except Exception:
                await asyncio.sleep(0.5)
                continue
            def rose(key, path=None):
                cur = s[key] if path is None else s[key][path]
                was = prev.get((key, path), 0)
                prev[(key, path)] = cur
                return cur and not was
            if rose("estop"):
                self.log_event("alarm", "safety", "ESTOP", "emergency stop engaged")
            if rose("safety", "stop"):
                self.log_event("alarm", "safety", "PROTECTIVE_STOP",
                               "protective stop: %s" % s["safety"]["code_name"], s["safety"])
            if rose("contact"):
                self.log_event("alarm", "safety", "CONTACT",
                               "physical contact detected on J%d" % (s.get("contact_joint", 0) + 1))
            if rose("coll_stop"):
                self.log_event("alarm", "safety", "SELF_COLLISION", "self-collision auto-stop")
            mode = s.get("mode")
            if prev.get("mode") != mode:
                if prev.get("mode") is not None:
                    self.log_event("info", "robot", "MODE", "mode -> %s" % mode)
                prev["mode"] = mode
            self.events.bump("state_polls")
            await asyncio.sleep(0.02)     # 50 Hz: even a one-cycle e-stop pulse is recorded

    # ---- Modbus command hook ----------------------------------------------
    def modbus_command(self, code, arg):
        try:
            if code == 1:
                prog = PROGS.by_number(arg)
                if not prog or not self.shm.read_state()["enabled"]:
                    return False
                fut = asyncio.run_coroutine_threadsafe(self._start_program(prog), self.loop)
                fut.result(timeout=2.0)
                return True
            if code == 2:
                if ws_bridge._prog_task and not ws_bridge._prog_task.done():
                    self.loop.call_soon_threadsafe(ws_bridge._prog_task.cancel)
                self.shm.send_command(CMD_STOP)
                return True
            if code == 3:
                self.shm.send_command(CMD_ENABLE); return True
            if code == 4:
                self.shm.send_command(CMD_DISABLE); return True
            if code == 5:
                self.shm.send_command(CMD_HOLD, reset_req=1); return True
            if code == 6:
                self.shm.send_command(CMD_STOP, estop_req=1)
                self.log_event("alarm", "modbus", "ESTOP_REQ", "E-stop via Modbus")
                return True
            if code == 7:
                self.shm.send_command(10); return True   # CMD_FREEDRIVE_ON
            if code == 8:
                self.shm.send_command(11); return True   # CMD_FREEDRIVE_OFF
        except Exception as e:
            self.log_event("warn", "modbus", "CMD_FAIL", str(e))
        return False

    async def _start_program(self, prog):
        if ws_bridge._prog_task and not ws_bridge._prog_task.done():
            ws_bridge._prog_task.cancel()
        ws_bridge._prog_task = self.loop.create_task(run_typed_program(None, self.shm, prog))
        self.log_event("info", "modbus", "PROGRAM_START", "program '%s' via fieldbus" % prog.get("name"))


# --------------------------------------------------------------------------
CTL = None  # set in main; the HTTP handler class needs module-level access


class Api(BaseHTTPRequestHandler):
    server_version = "eRoBoController/" + VERSION
    protocol_version = "HTTP/1.1"

    # ---- plumbing ----------------------------------------------------------
    def log_message(self, fmt, *args):
        pass

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def _bytes(self, code, body, ctype, extra=None):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")   # desktop app / remote UI origins
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0:
            return {}
        try:
            return json.loads(self.rfile.read(n) or b"{}")
        except Exception:
            return {}

    def _auth(self, min_role):
        tok = (self.headers.get("Authorization") or "").replace("Bearer ", "").strip()
        ses = CTL.users.check(tok, min_role)
        if not ses:
            self._json(401 if not tok else 403,
                       {"error": "login required (role %s+)" % min_role})
            return None
        return ses

    def _q(self):
        from urllib.parse import urlparse, parse_qs
        u = urlparse(self.path)
        return u.path.rstrip("/") or "/", {k: v[0] for k, v in parse_qs(u.query).items()}

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization,Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    # ---- websocket-command passthrough (single execution path) ------------
    def _dispatch_ws(self, msg, timeout=6.0):
        out = []

        class FakeWs:
            async def send(self, raw):
                out.append(json.loads(raw))
        fut = asyncio.run_coroutine_threadsafe(
            ws_bridge.handle(FakeWs(), CTL.shm, json.dumps(msg)), CTL.loop)
        fut.result(timeout=timeout)
        return out[-1] if out else {"type": "ack", "ok": True}

    # ---- GET ----------------------------------------------------------------
    def do_GET(self):
        path, q = self._q()
        try:
            if path == "/api/v1/state":
                return self._json(200, CTL.state())
            if path == "/api/v1/system":
                s = CTL.settings.get()
                return self._json(200, {
                    "name": s["robot_name"], "version": VERSION, "model": "eRoBo 10 (6-DOF, ZeroErr eRob)",
                    "uptime_s": round(time.time() - CTL.t_boot, 1),
                    "hostname": socket.gethostname(),
                    "counters": CTL.events.counters(),
                    "payload_max_kg": 10.0, "reach_m": 1.3, "joints": 6,
                })
            if path == "/api/v1/metrics":
                st = CTL.state()
                return self._json(200, {
                    "uptime_s": round(time.time() - CTL.t_boot, 1),
                    "jitter_us": st.get("jitter_us"), "overruns": st.get("overruns"),
                    "speed_pct": st.get("speed_pct"), "mode": st.get("mode"),
                    "counters": CTL.events.counters(),
                    "alarms_24h": CTL.events.alarm_summary(),
                    "programs": PROGS.list(),
                })
            if path == "/api/v1/events":
                return self._json(200, {"events": CTL.events.query(
                    since=float(q.get("since", 0)), level=q.get("level"),
                    source=q.get("source"), limit=int(q.get("limit", 200)))})
            if path == "/api/v1/programs":
                return self._json(200, {"programs": PROGS.list()})
            if path.startswith("/api/v1/programs/"):
                p = PROGS.get(path.split("/")[-1])
                return self._json(200 if p else 404, p or {"error": "not found"})
            if path == "/api/v1/waypoints":
                return self._json(200, {"waypoints": WP.list()})
            if path == "/api/v1/tools":
                return self._json(200, {"tools": TOOLS.list(), "active": TCP.load()})
            if path == "/api/v1/safety":
                return self._json(200, {"config": CTL.shm.read_safety()})
            if path == "/api/v1/io":
                return self._json(200, {"io": CTL.shm.read_io()})
            if path == "/api/v1/planes":
                return self._json(200, {"planes": PL.list(), "active": PL.get_active()})
            if path == "/api/v1/users":
                if not self._auth("admin"):
                    return
                return self._json(200, {"users": CTL.users.list()})
            if path == "/api/v1/settings":
                return self._json(200, CTL.settings.get())
            if path == "/api/v1/backup":
                if not self._auth("admin"):
                    return
                buf = io.BytesIO()
                with tarfile.open(fileobj=buf, mode="w:gz") as tar:
                    for fn in sorted(os.listdir(RUN_DIR)):
                        fp = os.path.join(RUN_DIR, fn)
                        if os.path.isfile(fp) and not fn.endswith((".tmp", "-wal", "-shm")):
                            tar.add(fp, arcname=fn)
                CTL.log_event("info", "api", "BACKUP", "configuration backup downloaded")
                return self._bytes(200, buf.getvalue(), "application/gzip",
                                   {"Content-Disposition": "attachment; filename=erobo_backup.tar.gz"})
            if path == "/api/state":   # legacy phone UI
                return self._json(200, CTL.state())
            return self._static(path)
        except BrokenPipeError:
            pass
        except Exception as e:
            try:
                self._json(500, {"error": str(e)})
            except Exception:
                pass

    # ---- POST/PUT/DELETE ----------------------------------------------------
    def do_POST(self):
        path, _ = self._q()
        b = self._body()
        try:
            if path == "/api/v1/auth/login":
                r = CTL.users.login(str(b.get("user", "")), str(b.get("pin", "")))
                if not r:
                    CTL.log_event("warn", "api", "LOGIN_FAIL", "failed login for '%s'" % b.get("user"))
                    return self._json(401, {"error": "invalid user or PIN"})
                CTL.log_event("info", "api", "LOGIN", "user '%s' logged in" % r["user"])
                return self._json(200, r)
            if path == "/api/v1/auth/logout":
                tok = (self.headers.get("Authorization") or "").replace("Bearer ", "").strip()
                CTL.users.logout(tok)
                return self._json(200, {"ok": True})
            if path == "/api/v1/auth/pin":
                ses = self._auth("operator")
                if not ses:
                    return
                if not CTL.users.set_pin(ses["user"], str(b.get("pin", ""))):
                    return self._json(400, {"error": "PIN unchanged"})
                return self._json(200, {"ok": True})
            if path == "/api/v1/users":
                if not self._auth("admin"):
                    return
                try:
                    u = CTL.users.add(b.get("name"), b.get("pin"), b.get("role"))
                except ValueError as e:
                    return self._json(400, {"error": str(e)})
                return self._json(200, u)
            if path == "/api/v1/programs":
                if not self._auth("programmer"):
                    return
                try:
                    p = PROGS.save(b)
                except ValueError as e:
                    return self._json(400, {"error": str(e)})
                return self._json(200, p)
            if path.startswith("/api/v1/programs/") and path.endswith("/run"):
                if not self._auth("operator"):
                    return
                pid = path.split("/")[-2]
                r = self._dispatch_ws({"cmd": "prog_run", "id": pid, "speed": b.get("speed"),
                                       "loop": b.get("loop")})
                return self._json(200 if r.get("event") == "accepted" else 409, r)
            if path == "/api/v1/run/stop":
                r = self._dispatch_ws({"cmd": "program_stop"})
                return self._json(200, r)
            if path == "/api/v1/command":
                # generic bridge command passthrough for integrations: {"cmd": ...}
                if not self._auth("operator"):
                    return
                if b.get("cmd") in ("set_safety", "set_sign"):
                    if not self._auth("admin"):
                        return
                return self._json(200, self._dispatch_ws(b))
            if path == "/api/v1/safety":
                if not self._auth("admin"):
                    return
                r = self._dispatch_ws({"cmd": "set_safety", "config": b.get("config") or b})
                return self._json(200, r)
            if path == "/api/v1/io":
                if not self._auth("operator"):
                    return
                return self._json(200, self._dispatch_ws({"cmd": "io_set", **b}))
            if path == "/api/v1/settings":
                if not self._auth("admin"):
                    return
                out = CTL.settings.update(b)
                CTL.log_event("info", "api", "SETTINGS", "settings updated", b)
                return self._json(200, out)
            if path == "/api/v1/restore":
                if not self._auth("admin"):
                    return
                raw = base64.b64decode(b.get("data", ""))
                with tarfile.open(fileobj=io.BytesIO(raw), mode="r:gz") as tar:
                    for m in tar.getmembers():
                        if not m.isfile() or "/" in m.name or ".." in m.name:
                            continue
                        tar.extract(m, RUN_DIR)
                CTL.log_event("warn", "api", "RESTORE", "configuration restored from backup")
                return self._json(200, {"ok": True, "note": "restart the controller to apply everything"})
            if path == "/api/cmd":    # legacy phone UI command endpoint
                return self._json(200, self._dispatch_ws(b))
            return self._json(404, {"error": "unknown endpoint"})
        except Exception as e:
            try:
                self._json(500, {"error": str(e)})
            except Exception:
                pass

    def do_PUT(self):
        path, _ = self._q()
        b = self._body()
        if path.startswith("/api/v1/programs/"):
            if not self._auth("programmer"):
                return
            b["id"] = path.split("/")[-1]
            try:
                return self._json(200, PROGS.save(b))
            except ValueError as e:
                return self._json(400, {"error": str(e)})
        return self._json(404, {"error": "unknown endpoint"})

    def do_DELETE(self):
        path, _ = self._q()
        if path.startswith("/api/v1/programs/"):
            if not self._auth("programmer"):
                return
            return self._json(200, {"deleted": PROGS.delete(path.split("/")[-1])})
        if path.startswith("/api/v1/users/"):
            if not self._auth("admin"):
                return
            try:
                return self._json(200, {"deleted": CTL.users.delete(path.split("/")[-1])})
            except ValueError as e:
                return self._json(400, {"error": str(e)})
        if path.startswith("/api/v1/tools/"):
            if not self._auth("programmer"):
                return
            return self._json(200, {"deleted": TOOLS.delete(path.split("/")[-1])})
        return self._json(404, {"error": "unknown endpoint"})

    # ---- static files: Studio web build, robot meshes, legacy tools --------
    def _static(self, path):
        if path == "/":
            path = "/index.html"
        candidates = []
        if os.path.isdir(STUDIO_DIST):
            candidates.append(os.path.join(STUDIO_DIST, path.lstrip("/")))
        if path.startswith("/robot/") or path.startswith("/tools/"):
            candidates.append(os.path.join(ROOT, path.lstrip("/")))
        for fp in candidates:
            fp = os.path.realpath(fp)
            if not fp.startswith(os.path.realpath(ROOT)):
                continue
            if os.path.isfile(fp):
                ctype = mimetypes.guess_type(fp)[0] or "application/octet-stream"
                with open(fp, "rb") as f:
                    return self._bytes(200, f.read(), ctype,
                                       {"Cache-Control": "no-cache"} if fp.endswith(".html") else
                                       {"Cache-Control": "max-age=3600"})
        # SPA fallback: any unknown non-API path serves the Studio index
        idx = os.path.join(STUDIO_DIST, "index.html")
        if os.path.isfile(idx) and not path.startswith("/api"):
            with open(idx, "rb") as f:
                return self._bytes(200, f.read(), "text/html")
        return self._json(404, {"error": "not found"})


# --------------------------------------------------------------------------
async def amain(args):
    global CTL
    CTL = Controller(args.shm)
    CTL.loop = asyncio.get_event_loop()

    # WebSocket server (full ws_bridge protocol + v2)
    ws_srv = await websockets.serve(ws_bridge.make_handler(CTL.shm), args.host, args.ws_port)
    print("[controld] WebSocket API on ws://%s:%d" % (args.host, args.ws_port))

    # REST + static UI (threaded, shares the asyncio loop via run_coroutine_threadsafe)
    httpd = ThreadingHTTPServer((args.host, args.http_port), Api)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    print("[controld] REST API + Studio UI on http://%s:%d" % (args.host, args.http_port))

    # Modbus TCP slave
    st = CTL.settings.get()
    modbus = None
    mb_port = args.modbus_port if args.modbus_port is not None else int(st["modbus"]["port"])
    if st["modbus"]["enabled"] and mb_port > 0:
        modbus = ModbusServer(args.host, mb_port,
                              logger=lambda m: print("[controld] " + m))
        modbus.bind(get_state=lambda: CTL.shm.read_state(), get_io=lambda: CTL.shm.read_io(),
                    set_do=lambda i, v: CTL.shm.set_do(index=i, value=v),
                    set_speed=lambda f: CTL.shm.set_speed_override(f),
                    command=CTL.modbus_command,
                    get_prog=lambda: ws_bridge.PROGRAM_STATUS)
        await modbus.start()

    # MQTT publisher (opt-in via settings)
    CTL.mqtt = MqttPublisher(CTL.settings, lambda: CTL.state(), CTL.log_event)

    tasks = [
        asyncio.ensure_future(ws_bridge.broadcaster(CTL.shm, args.rate)),
        asyncio.ensure_future(CTL.watch_alarms()),
        asyncio.ensure_future(CTL.mqtt.run()),
    ]
    print("[controld] eRoBo controller v%s ready (robot: %s)" % (VERSION, st["robot_name"]))
    try:
        await asyncio.gather(*tasks)
    finally:
        ws_srv.close()
        httpd.shutdown()
        if modbus:
            await modbus.stop()


def main():
    ap = argparse.ArgumentParser(description="eRoBo production controller service")
    ap.add_argument("--shm", default="/dev/shm/erobo10_shm")
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--ws-port", type=int, default=8765)
    ap.add_argument("--http-port", type=int, default=8080)
    ap.add_argument("--rate", type=float, default=50.0, help="state broadcast rate [Hz]")
    ap.add_argument("--modbus-port", type=int, default=None, help="override Modbus TCP port (0 = off)")
    args = ap.parse_args()
    try:
        asyncio.run(amain(args))
    except KeyboardInterrupt:
        print("\n[controld] shutdown")


if __name__ == "__main__":
    main()
