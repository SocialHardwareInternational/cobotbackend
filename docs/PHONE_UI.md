# Phone control — one port, no WebSocket

The phone kept failing because it had to open a **second** port (`:8765`, a WebSocket)
to the robot. Even when the page loaded, that second connection got blocked — some
Wi‑Fi networks block WebSocket upgrades, a captive portal/proxy gets in the way, or the
page was opened as a `file://`.

`bridge/cobot_server.py` removes that whole problem. It serves the **UI and the control
API from one port over plain HTTP**:

```
phone browser ──HTTP GET /api/state , POST /api/cmd──▶ cobot_server.py ──shm──▶ control plane
```

The phone page served at `/` is `tools/cobot_mobile.html`, wrapped by a transport shim so its
client talks to the **same origin it was loaded from** (`fetch('/api/state')`, `fetch('/api/cmd')`).
So **if the page loads on the phone, control works** — there is no second port, no WebSocket,
and nothing to type in.

## Run it

After the control node + planner + ik_solver are up (the usual stack), either run the
whole thing with one command:

```bash
bash scripts/run_hardware.sh         # starts everything incl. the phone server on :8080
```

…or just the phone server if the rest is already running:

```bash
python3 bridge/cobot_server.py       # 0.0.0.0:8080  (override with --port)
```

It prints the exact address(es) to open. On the **phone** (same Wi‑Fi as the robot),
open one of them, e.g.:

```
http://192.168.1.24:8080/
```

That page is the **landscape joystick UI** — the same one as `tools/cobot_mobile.html`
(translate/rotate joysticks, per‑joint D‑pads, mode toggle, teach, payload, view presets,
3D view, big STOP). Hold the phone in landscape. It works because the server injects a tiny
transport shim that makes that UI's WebSocket client run over this same‑origin HTTP API —
so there is still only one port and one connection.

The page includes a **Waypoints** panel (☆, bottom‑right): save the current pose, rename it,
edit its six joint angles, send the arm to it, or delete it. Waypoints are stored on the robot
(`run/waypoints.json`) and shared with the desktop viewer.

## If the page itself won't load on the phone

Then it's a **network** problem, not the app — no UI or app can get around it:

- Phone and robot must be on the **same Wi‑Fi** (not guest network, not cellular).
- Turn off **AP isolation / client isolation** on the router (it blocks phone↔robot).
- If the robot has a firewall: `sudo ufw allow 8080`.
- Quick test from the phone browser: open `http://<robot-ip>:8080/api/ping` — you should
  see `{"ok":true,"robot":"erobo10"}`. If that loads, the UI will work.

## Notes

- The desktop viewers (`erobo10_viewer.html`, `cobot_mobile.html`) still use the
  WebSocket bridge on `:8765`; that keeps running too. The phone UI does **not** need it.
- Software STOP here is a convenience stop. The hardware E‑stop / STO must stay
  independent of any software.
