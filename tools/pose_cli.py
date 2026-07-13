#!/usr/bin/env python3
"""pose_cli.py -- drive the robot through the WebSocket bridge.

  python3 pose_cli.py fk    Q1 Q2 Q3 Q4 Q5 Q6          # determine a reachable pose (offline FK)
  python3 pose_cli.py monitor                          # stream joint angles + pose, live
  python3 pose_cli.py joint Q1 Q2 Q3 Q4 Q5 Q6 [speed]  # MoveJ (joint space)
  python3 pose_cli.py ptp   X Y Z ROLL PITCH YAW [speed]    # MoveJ to a pose (IK)
  python3 pose_cli.py lin   X Y Z ROLL PITCH YAW [speed]    # MoveL (straight line)
  python3 pose_cli.py movep X Y Z R P Y  X Y Z R P Y ...  [--blend b] [--speed v]
                                                       # MoveP (const speed, circular blends)
  python3 pose_cli.py payload KG                       # set tool/payload mass for torque model
  python3 pose_cli.py freedrive on|off                 # hand-guide mode (real hardware)
  python3 pose_cli.py teach                            # drag-teach: record waypoints + replay
  python3 pose_cli.py state                            # one-shot state
  (env EROBO_WS overrides ws://localhost:8765)
"""
import asyncio, json, math, os, sys, time
import websockets

URL = os.environ.get("EROBO_WS", "ws://localhost:8765")
R2D = 57.29577951308232


async def wait_done(ws, endp=None):
    moving_seen = False
    while True:
        m = json.loads(await ws.recv())
        if m.get("type") != "state":
            continue
        if m["moving"]:
            moving_seen = True
        if moving_seen and not m["moving"]:
            fp = m["flange"]["pos"]
            extra = (" | target err %.2f mm" % (math.dist(fp, endp) * 1000)) if endp else ""
            print("reached: flange", [round(v, 4) for v in fp],
                  "| mode", m["mode"], "| manip", round(m["manip"], 4), extra)
            return


async def monitor(ws):
    print("streaming live state (Ctrl-C to stop)...")
    last = 0.0
    while True:
        m = json.loads(await ws.recv())
        if m.get("type") != "state":
            continue
        now = time.time()
        if now - last < 0.1:
            continue
        last = now
        deg = " ".join(f"{q*R2D:7.2f}" for q in m["q"])
        rad = " ".join(f"{q:6.3f}" for q in m["q"])
        fp = m["flange"]["pos"]; fq = m["flange"]["quat"]
        tu = m.get("torque_util", 0.0)
        print(f"t={m['t']:7.2f} {m['mode']:8s} | J deg=[{deg}] | J rad=[{rad}]"
              f" | flange xyz=[{fp[0]:6.3f} {fp[1]:6.3f} {fp[2]:6.3f}]"
              f" | manip={m['manip']:.3f} | torque={tu*100:3.0f}% of limit")


async def freedrive_cmd(ws, on):
    await ws.send(json.dumps({"cmd": "enable", "id": 1})); await ws.recv()
    await ws.send(json.dumps({"cmd": "freedrive", "on": bool(on), "id": 2}))
    while True:
        m = json.loads(await ws.recv())
        if m.get("id") == 2:
            print("free-drive", "ON - hand-guide the robot" if on else "OFF"); return


async def teach(ws):
    latest = {}; acks = {}
    async def reader():
        try:
            while True:
                m = json.loads(await ws.recv())
                if m.get("id") is not None: acks[m["id"]] = m
                elif m.get("type") == "state": latest.clear(); latest.update(m)
        except Exception: pass
    rd = asyncio.ensure_future(reader()); nid = [10]
    async def cmd(d):
        nid[0] += 1; i = nid[0]; d["id"] = i; await ws.send(json.dumps(d))
        for _ in range(3000):
            if i in acks: return acks.pop(i)
            await asyncio.sleep(0.002)
        return {}
    async def wait_idle():
        seen = False
        for _ in range(20000):
            mv = latest.get("moving")
            if mv: seen = True
            if seen and mv is False: return
            await asyncio.sleep(0.002)
    print("DRAG-TEACH  hand-guide the robot.  [Enter]=record waypoint   'play'=replay   'done'=finish")
    await cmd({"cmd": "enable"}); await cmd({"cmd": "freedrive", "on": True})
    wps = []; loop = asyncio.get_event_loop()
    while True:
        line = (await loop.run_in_executor(None, input, "> ")).strip().lower()
        if line == "":
            q = latest.get("q")
            if q: wps.append(list(q)); print(f"  recorded #{len(wps)}: {[round(v,3) for v in q]}")
            else: print("  (no state yet)")
        elif line == "play":
            if not wps: print("  (no waypoints)"); continue
            await cmd({"cmd": "freedrive", "on": False})
            for n, q in enumerate(wps):
                a = await cmd({"cmd": "move_joint", "q": q, "speed": 0.4})
                if a.get("ok"): await wait_idle(); print(f"  -> waypoint #{n+1}")
                else: print(f"  waypoint #{n+1} refused: {a.get('message','')}")
            await cmd({"cmd": "freedrive", "on": True}); print("  replay done; back in free-drive")
        elif line in ("done", "q", "quit"):
            await cmd({"cmd": "freedrive", "on": False}); await cmd({"cmd": "disable"})
            print(f"  finished - {len(wps)} waypoints recorded."); break
    rd.cancel()


def fk_offline(q):
    """Forward kinematics from the URDF -> reachable flange pose (no robot needed).
    Prints X Y Z ROLL PITCH YAW ready to paste into lin / ptp / movep."""
    import xml.etree.ElementTree as ET
    here = os.path.dirname(os.path.abspath(__file__))
    urdf = os.path.join(here, "..", "robot", "erobo10.urdf")
    joints = []
    for j in ET.parse(urdf).getroot().findall("joint"):
        if j.get("type") != "revolute":
            continue
        o = j.find("origin")
        xyz = [float(v) for v in (o.get("xyz") or "0 0 0").split()]
        rpy = [float(v) for v in (o.get("rpy") or "0 0 0").split()]
        ax = [float(v) for v in j.find("axis").get("xyz").split()]
        joints.append((xyz, rpy, ax))

    def matmul(A, B):
        return [[sum(A[i][k]*B[k][j] for k in range(4)) for j in range(4)] for i in range(4)]

    def rpy_mat(r, p, y):
        cr, sr, cp, sp, cy, sy = math.cos(r), math.sin(r), math.cos(p), math.sin(p), math.cos(y), math.sin(y)
        return [[cy*cp, cy*sp*sr-sy*cr, cy*sp*cr+sy*sr, 0],
                [sy*cp, sy*sp*sr+cy*cr, sy*sp*cr-cy*sr, 0],
                [-sp,   cp*sr,          cp*cr,          0],
                [0, 0, 0, 1]]

    def axis_mat(ax, t):
        n = math.sqrt(sum(a*a for a in ax)) or 1.0
        x, yy, z = (a/n for a in ax)
        c, s, C = math.cos(t), math.sin(t), 1-math.cos(t)
        return [[c+x*x*C, x*yy*C-z*s, x*z*C+yy*s, 0],
                [yy*x*C+z*s, c+yy*yy*C, yy*z*C-x*s, 0],
                [z*x*C-yy*s, z*yy*C+x*s, c+z*z*C, 0],
                [0, 0, 0, 1]]

    T = [[1 if i == j else 0 for j in range(4)] for i in range(4)]
    for i, (xyz, rpy, ax) in enumerate(joints):
        O = rpy_mat(*rpy)
        O[0][3], O[1][3], O[2][3] = xyz
        T = matmul(matmul(T, O), axis_mat(ax, q[i]))
    x, yv, z = T[0][3], T[1][3], T[2][3]
    pitch = math.atan2(-T[2][0], math.hypot(T[0][0], T[1][0]))
    yaw = math.atan2(T[1][0], T[0][0])
    roll = math.atan2(T[2][1], T[2][2])
    print("joints (rad):", " ".join(f"{v:.4f}" for v in q))
    print(f"flange xyz (m)   : {x:.5f} {yv:.5f} {z:.5f}")
    print(f"flange rpy (rad) : {roll:.5f} {pitch:.5f} {yaw:.5f}")
    print("-> paste into a Cartesian move, e.g.:")
    print(f"   python3 tools/pose_cli.py lin {x:.5f} {yv:.5f} {z:.5f} {roll:.5f} {pitch:.5f} {yaw:.5f} 0.5")


async def run(argv):
    sub = argv[0]
    async with websockets.connect(URL) as ws:
        await ws.recv()
        if sub == "state":
            await ws.send(json.dumps({"cmd": "get_state", "id": 1}))
            while True:
                m = json.loads(await ws.recv())
                if m.get("id") == 1 or m.get("type") == "state":
                    print(json.dumps(m, indent=2)); return
        if sub == "monitor":
            return await monitor(ws)
        if sub == "payload":
            await ws.send(json.dumps({"cmd":"set_payload","kg":float(argv[1]),"id":1}))
            print("payload set:", json.loads(await ws.recv())); return
        if sub == "freedrive":
            return await freedrive_cmd(ws, not (len(argv) > 1 and argv[1] in ("off", "0", "false")))
        if sub == "teach":
            return await teach(ws)

        if sub == "movep":
            args = argv[1:]; blend = 0.05; ts = 0.25; flat = []; i = 0
            while i < len(args):
                if args[i] == "--blend": blend = float(args[i+1]); i += 2
                elif args[i] in ("--speed", "--tool_speed"): ts = float(args[i+1]); i += 2
                else: flat.append(float(args[i])); i += 1
            if len(flat) < 12 or len(flat) % 6:
                print("movep needs >=2 waypoints of 6 numbers: X Y Z R P Y ..."); return
            W = [{"pos": flat[k:k+3], "rpy": flat[k+3:k+6]} for k in range(0, len(flat), 6)]
            msg = {"cmd": "move_p", "waypoints": W, "blend": blend, "tool_speed": ts, "id": 1}
            endp = flat[-6:-3]
        elif sub in ("ptp", "lin"):
            x, y, z, r, p, yw = [float(v) for v in argv[1:7]]
            sp = float(argv[7]) if len(argv) > 7 else 1.0
            msg = {"cmd": "move_" + sub, "pos": [x, y, z], "rpy": [r, p, yw], "speed": sp, "id": 1}
            endp = [x, y, z]
        elif sub == "joint":
            q = [float(v) for v in argv[1:7]]
            sp = float(argv[7]) if len(argv) > 7 else 1.0
            msg = {"cmd": "move_joint", "q": q, "speed": sp, "id": 1}
            endp = None
        else:
            print("unknown subcommand"); return

        await ws.send(json.dumps(msg))
        ack = None
        while ack is None:
            m = json.loads(await ws.recv())
            if m.get("id") == 1: ack = m
        print("ack:", ack)
        if ack.get("ok"):
            await wait_done(ws, endp)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); raise SystemExit(2)
    if sys.argv[1] == "fk":                       # offline: no robot/bridge needed
        fk_offline([float(v) for v in sys.argv[2:8]]); raise SystemExit(0)
    try:
        asyncio.run(run(sys.argv[1:]))
    except KeyboardInterrupt:
        print()
