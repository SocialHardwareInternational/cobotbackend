#!/usr/bin/env python3
"""integration_test.py -- full-stack acceptance test for the eRoBo platform.

Boots the complete simulated stack (control_node + motion_planner + ik_solver +
erobo_controld) and exercises every API surface end-to-end:

  1.  state stream sanity (WS + REST agree)
  2.  enable / disable / e-stop / reset state machine
  3.  MoveJ / MoveL round trip with completion + accuracy check
  4.  global speed override (live, from the safety region)
  5.  safety plane: target rejection + zone reporting
  6.  digital I/O: set DO, force DI, AI loopback
  7.  typed program: save -> run (movej + set_do + wait_di + wait) -> events
  8.  REST auth: login, role gates, program CRUD
  9.  Modbus TCP: input registers, coils, speed override write, program start
 10.  event log + metrics + backup archive
Exit code 0 = all pass. Run: python3 test/integration_test.py
"""
import asyncio
import json
import math
import os
import signal
import struct
import subprocess
import sys
import tempfile
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "bridge"))

SHM = os.environ.get("EROBO_TEST_SHM", "/dev/shm/erobo10_itest")
WS_PORT, HTTP_PORT, MB_PORT = 18765, 18080, 11502
FAILS = []


def check(cond, name):
    print(("  PASS  " if cond else "  FAIL  ") + name)
    if not cond:
        FAILS.append(name)


def http(method, path, body=None, token=None, raw=False):
    req = urllib.request.Request("http://127.0.0.1:%d%s" % (HTTP_PORT, path), method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    data = json.dumps(body).encode() if body is not None else None
    try:
        with urllib.request.urlopen(req, data=data, timeout=10) as r:
            payload = r.read()
            return r.status, (payload if raw else json.loads(payload or b"{}"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


def modbus(sock_reqs):
    """Send raw Modbus TCP requests on one connection, return response PDUs."""
    import socket as sk
    s = sk.create_connection(("127.0.0.1", MB_PORT), timeout=5)
    out = []
    tid = 0
    for pdu in sock_reqs:
        tid += 1
        s.sendall(struct.pack(">HHHB", tid, 0, len(pdu) + 1, 1) + pdu)
        hdr = b""
        while len(hdr) < 7:
            hdr += s.recv(7 - len(hdr))
        _, _, ln, _ = struct.unpack(">HHHB", hdr)
        body = b""
        while len(body) < ln - 1:
            body += s.recv(ln - 1 - len(body))
        out.append(body)
    s.close()
    return out


async def ws_session(test):
    import websockets
    async with websockets.connect("ws://127.0.0.1:%d" % WS_PORT, ping_interval=None) as ws:
        await test(ws)


class WsClient:
    """Small helper: request/response with id correlation + event collection."""

    def __init__(self, ws):
        self.ws = ws
        self.events = []
        self._id = 0

    async def cmd(self, obj, timeout=20.0):
        self._id += 1
        obj = dict(obj, rid="t%d" % self._id)
        await self.ws.send(json.dumps(obj))
        t0 = time.time()
        while time.time() - t0 < timeout:
            m = json.loads(await asyncio.wait_for(self.ws.recv(), timeout))
            if m.get("rid") == obj["rid"]:
                return m
            if m.get("type") in ("program", "probe"):
                self.events.append(m)
        raise TimeoutError("no reply to %s" % obj.get("cmd"))

    async def drain(self, seconds, want=None):
        t0 = time.time()
        while time.time() - t0 < seconds:
            try:
                m = json.loads(await asyncio.wait_for(self.ws.recv(), 0.5))
            except asyncio.TimeoutError:
                continue
            if m.get("type") in ("program", "probe"):
                self.events.append(m)
                if want and m.get("event") == want:
                    return m
        return None

    async def wait_state(self, pred, timeout=30.0, desc="condition"):
        t0 = time.time()
        last = None
        while time.time() - t0 < timeout:
            m = json.loads(await asyncio.wait_for(self.ws.recv(), 5.0))
            if m.get("type") == "program":
                self.events.append(m)
            if m.get("type") == "state":
                last = m
                if pred(m):
                    return m
        print("  DEBUG last state:", json.dumps({k: last.get(k) for k in
              ("mode", "enabled", "estop", "moving", "safety", "speed_pct", "q", "tcp")} if last else {}))
        raise TimeoutError("timeout waiting for " + desc)


async def run_tests():
    import websockets
    ws_raw = await websockets.connect("ws://127.0.0.1:%d" % WS_PORT, ping_interval=None)
    c = WsClient(ws_raw)
    hello = json.loads(await ws_raw.recv())
    check(hello.get("type") == "welcome", "WS welcome message")

    # [1] state sanity, WS vs REST ------------------------------------------
    st = await c.cmd({"cmd": "get_state"})
    check(st["type"] == "state" and len(st["q"]) == 6, "WS get_state returns 6 joints")
    code, rst = http("GET", "/api/v1/state")
    check(code == 200 and len(rst["q"]) == 6, "REST /state returns 6 joints")
    check(abs(rst["q"][1] - st["q"][1]) < 0.2, "WS and REST agree on joint state")
    check("safety" in st and "speed_pct" in st and "program" in st, "v2 state fields present")

    # [2] enable / estop state machine ---------------------------------------
    await c.cmd({"cmd": "enable"})
    s = await c.wait_state(lambda m: m["enabled"], desc="enabled")
    check(s["enabled"], "drives enable")
    await c.cmd({"cmd": "estop"})
    s = await c.wait_state(lambda m: m["estop"], desc="estop")
    check(s["estop"] and s["mode"] == "ESTOP", "e-stop engages")
    await c.cmd({"cmd": "reset"})
    await c.cmd({"cmd": "enable"})
    s = await c.wait_state(lambda m: m["enabled"] and not m["estop"], desc="recovered")
    check(True, "e-stop reset + recovery")

    # [3] MoveJ / MoveL round trip -------------------------------------------
    home = [0.0, 0.6, -1.2, 0.0, 0.9, 0.0]
    r = await c.cmd({"cmd": "move_joint", "q": home, "speed": 0.9})
    check(r["ok"], "MoveJ accepted")
    s = await c.wait_state(lambda m: not m["moving"] and max(abs(m["q"][i] - home[i]) for i in range(6)) < 1e-3,
                           60, "MoveJ done")
    check(True, "MoveJ completes at target (<0.06 deg)")
    tcp0 = s["tcp"]["pos"]
    tgt = [tcp0[0], tcp0[1] + 0.10, tcp0[2] - 0.05]
    r = await c.cmd({"cmd": "move_lin", "pos": tgt, "quat": s["tcp"]["quat"], "speed": 0.6})
    check(r["ok"], "MoveL accepted")
    s = await c.wait_state(lambda m: not m["moving"] and
                           math.dist(m["tcp"]["pos"], tgt) < 2e-4, 60, "MoveL done")
    check(True, "MoveL lands within 0.2 mm")

    # [4] speed override -------------------------------------------------------
    r = await c.cmd({"cmd": "set_speed", "frac": 0.31})
    check(abs(r["speed_override"] - 0.31) < 1e-9, "speed override set")
    s = await c.wait_state(lambda m: abs(m["speed_pct"] - 31) <= 2, 10, "override applied")
    check(True, "planner applies override (speed_pct ~31)")
    await c.cmd({"cmd": "set_speed", "frac": 1.0})

    # [5] safety plane rejection ------------------------------------------------
    cfg = {"planes": [{"mode": 1, "p": [0, 0, 0.9], "n": [0, 0, -1]}]}   # forbid z > 0.9
    r = await c.cmd({"cmd": "set_safety", "config": cfg})
    check(len(r["config"]["planes"]) == 1, "safety plane configured")
    r = await c.cmd({"cmd": "move_ptp", "pos": [0.3, -0.4, 1.1], "rpy": [3.14, 0, 0]})
    check(not r["ok"] and "zone" in (r.get("message") or ""), "target above plane rejected: %s" % r.get("message"))
    r = await c.cmd({"cmd": "set_safety", "config": {"planes": []}})
    check(len(r["config"]["planes"]) == 0, "safety plane cleared")

    # [6] digital / analog I/O ---------------------------------------------------
    r = await c.cmd({"cmd": "io_set", "do": 3, "value": 1})
    await asyncio.sleep(0.1)
    r = await c.cmd({"cmd": "io_get"})
    check((r["io"]["do_state"] >> 3) & 1, "DO3 set and applied by control node")
    r = await c.cmd({"cmd": "di_force", "di": 5, "value": 1})
    await asyncio.sleep(0.1)
    r = await c.cmd({"cmd": "io_get"})
    check((r["io"]["di"] >> 5) & 1, "DI5 forced and published")
    r = await c.cmd({"cmd": "io_set", "ao": 0, "volts": 4.2})
    await asyncio.sleep(0.1)
    r = await c.cmd({"cmd": "io_get"})
    check(abs(r["io"]["ai"][0] - 4.2) < 1e-6, "AO0 -> AI0 sim loopback")

    # [7] typed program: save + run + events --------------------------------------
    r = await c.cmd({"cmd": "wp_save", "name": "itest-home", "q": home})
    wid = r["saved"]
    prog = {"name": "itest cycle", "speed": 0.9, "steps": [
        {"type": "set_do", "do": 7, "value": 1},
        {"type": "movej", "wp": wid},
        {"type": "wait", "sec": 0.3},
        {"type": "wait_di", "di": 7, "value": 0, "timeout": 8},
        {"type": "set_do", "do": 7, "value": 0},
    ]}
    r = await c.cmd({"cmd": "prog_save", "program": prog})
    pid = r["saved"]
    check(bool(pid), "program saved (%s)" % pid)
    r = await c.cmd({"cmd": "prog_run", "id": pid})
    check(r.get("event") == "accepted", "program accepted (reply: %s)" % json.dumps(r)[:160])
    # while it waits on DI7, flip the input (PLC handshake simulation)
    await asyncio.sleep(1.2)
    await c.cmd({"cmd": "di_force", "di": 7, "value": 0})
    done = await c.drain(20, want="done")
    if done is None:
        done = next((e for e in c.events if e.get("event") == "done"), None)
    check(done is not None, "program ran to completion (movej + IO handshake)")
    evs = [e.get("event") for e in c.events]
    check("step_start" in evs and "step_done" in evs, "program step events emitted")

    # [8] REST auth + program CRUD --------------------------------------------------
    code, r = http("POST", "/api/v1/auth/login", {"user": "admin", "pin": "1234"})
    check(code == 200 and r.get("token"), "REST login (default admin)")
    tok = r["token"]
    code, r = http("POST", "/api/v1/programs", {"name": "rest prog", "steps": [{"type": "wait", "sec": 0.1}]})
    check(code in (401, 403), "program create without token rejected")
    code, r = http("POST", "/api/v1/programs", {"name": "rest prog", "steps": [{"type": "wait", "sec": 0.1}]}, token=tok)
    check(code == 200 and r.get("id"), "program create with token")
    rest_pid = r.get("id")
    code, r = http("GET", "/api/v1/programs")
    check(code == 200 and any(p["id"] == rest_pid for p in r["programs"]), "program listed via REST")
    code, r = http("DELETE", "/api/v1/programs/" + rest_pid, token=tok)
    check(code == 200 and r.get("deleted"), "program delete via REST")
    code, r = http("GET", "/api/v1/system")
    check(code == 200 and r.get("joints") == 6, "system info endpoint")

    # [9] Modbus TCP -------------------------------------------------------------------
    #   FC4 read input regs 0..8 ; FC1 read coils ; FC6 write speed ; FC5 set DO0
    resp = modbus([
        struct.pack(">BHH", 4, 0, 9),           # input regs 0..8
        struct.pack(">BHH", 1, 0, 16),          # coils (DO)
        struct.pack(">BHH", 6, 0, 500),         # speed override -> 0.5
        struct.pack(">BHH", 5, 0, 0xFF00),      # DO0 on
        struct.pack(">BHH", 2, 0, 16),          # discrete inputs (DI)
    ])
    check(resp[0][0] == 4 and resp[0][1] == 18, "Modbus FC4 input registers")
    regs = struct.unpack(">9H", resp[0][2:])
    check(regs[1] == 1, "Modbus reports enabled=1")
    check(resp[2][:1] == b"\x06", "Modbus FC6 speed write acknowledged")
    await asyncio.sleep(0.8)
    s = await c.wait_state(lambda m: abs(m["speed_pct"] - 50) <= 2, 10, "modbus speed 50%")
    check(True, "Modbus speed override applied (50%)")
    r = await c.cmd({"cmd": "io_get"})
    check(r["io"]["do_state"] & 1, "Modbus FC5 set DO0")
    await c.cmd({"cmd": "set_speed", "frac": 1.0})

    # [10] events, metrics, backup ---------------------------------------------------
    code, r = http("GET", "/api/v1/events?limit=50")
    codes = [e["code"] for e in r["events"]]
    check(code == 200 and "PROGRAM_DONE" in codes, "event log captured program completion")
    check("ESTOP" in codes or "ESTOP_REQ" in codes, "event log captured e-stop alarm")
    code, r = http("GET", "/api/v1/metrics")
    check(code == 200 and "alarms_24h" in r, "metrics endpoint")
    code, raw = http("GET", "/api/v1/backup", token=tok, raw=True)
    check(code == 200 and raw[:2] == b"\x1f\x8b", "backup downloads gzip archive (%d bytes)" % len(raw))

    await ws_raw.close()


def main():
    os.environ["EROBO_SHM"] = SHM
    run_dir = tempfile.mkdtemp(prefix="erobo_itest_run_")
    os.environ["EROBO_RUN_DIR"] = run_dir
    print("run dir:", run_dir)
    if os.path.exists(SHM):
        os.unlink(SHM)
    procs = []

    def spawn(cmd, cwd=ROOT):
        p = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
        procs.append(p)
        return p

    try:
        print("== booting simulated stack ==")
        spawn([os.path.join(ROOT, "bin", "control_node"), "--shm", SHM])
        time.sleep(0.6)
        spawn([os.path.join(ROOT, "bin", "motion_planner"), "--shm", SHM])
        spawn([os.path.join(ROOT, "bin", "ik_solver"), "--shm", SHM])
        time.sleep(0.6)
        spawn([sys.executable, os.path.join(ROOT, "controller", "erobo_controld.py"),
               "--shm", SHM, "--host", "127.0.0.1", "--modbus-port", str(MB_PORT),
               "--ws-port", str(WS_PORT), "--http-port", str(HTTP_PORT)])
        deadline = time.time() + 20
        while time.time() < deadline:
            try:
                urllib.request.urlopen("http://127.0.0.1:%d/api/v1/state" % HTTP_PORT, timeout=1)
                break
            except Exception:
                time.sleep(0.4)
        else:
            print("controller failed to come up")
            sys.exit(2)
        print("== running acceptance tests ==")
        asyncio.get_event_loop().run_until_complete(run_tests())
    finally:
        for p in procs:
            try:
                p.send_signal(signal.SIGINT)
            except Exception:
                pass
        time.sleep(0.8)
        for p in procs:
            try:
                p.kill()
            except Exception:
                pass
        if os.path.exists(SHM):
            os.unlink(SHM)
    print()
    if FAILS:
        print("INTEGRATION: %d FAILURES:" % len(FAILS))
        for f in FAILS:
            print("  - " + f)
        sys.exit(1)
    print("INTEGRATION OK -- full stack (sim control plane + controller + WS + REST + Modbus) passes")
    sys.exit(0)


if __name__ == "__main__":
    main()
