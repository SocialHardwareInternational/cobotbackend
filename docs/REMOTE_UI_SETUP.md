# Running the Backend and eRoBo Studio on Separate PCs

The Studio frontend is a pure network client — it talks to the backend only over
WebSocket (port **8765**) and HTTP/REST (port **8080**). Nothing else is shared, so
the two machines just need to reach each other on the same network.

```
 PC A (backend / robot PC, Linux)            PC B (frontend PC, Win/Linux/mac)
 ┌──────────────────────────────┐            ┌──────────────────────────────┐
 │ control node (sim or EtherCAT)│  :8765 WS  │  eRoBo Studio (Electron app) │
 │ motion_planner · ik_solver    │◀──────────▶│        — or —                │
 │ erobo_controld                │  :8080 HTTP│  any browser → http://A:8080 │
 └──────────────────────────────┘            └──────────────────────────────┘
```

## PC A — start the backend (robot PC, Linux)

1. Get the project onto PC A and prepare it (copying from Windows/zip strips the
   Linux execute bits — restore them first):
   ```bash
   cd erobo10_motion
   chmod +x scripts/*.sh deploy/*.sh
   sudo apt install -y g++ make python3-pip
   pip3 install websockets        # Ubuntu 23+/Debian 12: add --break-system-packages
   make apps                      # simulator build
   # real robot instead:  make HARDWARE=1 apps   (needs the IgH EtherCAT master)
   ```
2. Start the whole backend with one command:
   ```bash
   ./scripts/run.sh               # SIMULATED robot  (control_node + planner + ik + controller)
   # real robot instead:
   sudo bash scripts/run_hardware.sh
   ```
   You should see `eRoBo controller v2.0.0 ready`. Both servers listen on
   `0.0.0.0`, i.e. on every network interface — nothing to configure.

   *(Permanent installation instead of a terminal: `sudo ./deploy/install.sh --sim`
   or `sudo ./deploy/install.sh` — installs systemd services that start at boot.)*

3. Find PC A's address and open its firewall (if one is active):
   ```bash
   hostname -I                    # e.g. 192.168.1.50
   sudo ufw allow 8080/tcp && sudo ufw allow 8765/tcp    # only if ufw is enabled
   ```

4. Sanity check from PC A itself: `curl http://localhost:8080/api/v1/state`
   should print JSON.

## PC B — run eRoBo Studio (frontend PC)

**Option 1 — desktop application (Electron):**

1. Install Node.js 18+ (https://nodejs.org).
2. Copy the `studio/` folder from the project to PC B (any location).
3. In a terminal inside that folder:
   ```bash
   npm install
   npm start                      # builds and launches the desktop app
   ```
4. On first launch the **Connect to robot** dialog appears — enter PC A's address
   (e.g. `192.168.1.50`) and press **Connect**. The header goes green (IDLE),
   the 3-D model loads, and you're driving the robot on PC A.
5. To make a proper installer instead of `npm start`:
   ```bash
   npm run package:win            # Windows .exe installer  (run on Windows)
   npm run package:linux          # AppImage + .deb         (run on Linux)
   ```
   The installer lands in `studio/release/`; installed apps launch from the
   Start menu like any other program.

**Option 2 — zero-install (any browser or tablet):**

Open `http://192.168.1.50:8080/` (PC A's address). This is the *same* Studio UI,
served by the backend itself — nothing to install on PC B at all.

## Notes

- The robot address is remembered (change it any time in **Setup → Robot address**).
  If the link drops, Studio auto-reconnects and shows the connect dialog after a
  few seconds.
- Several PCs/tablets can be connected at once; they all see the same live state
  and program execution.
- Both machines must be on the same network (or routed); verify with
  `ping <PC A address>` from PC B if the dialog says it can't connect, then check
  PC A's firewall for ports **8080** and **8765**.
- Windows backend note: the backend control plane targets Linux (real-time +
  EtherCAT). For a Windows "backend PC" run it under WSL2 — inside WSL:
  `./scripts/run.sh`, then on other machines use the Windows host's IP after
  forwarding the ports:
  `netsh interface portproxy add v4tov4 listenport=8080 connectaddress=$(wsl hostname -I) connectport=8080`
  (and the same for 8765) in an elevated PowerShell.
