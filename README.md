# eRoBo 10 — Collaborative Robot Platform

A complete, deployable 6-DOF collaborative robot platform (10 kg class, ZeroErr eRob
actuators, EtherCAT) — real-time motion control, a configurable safety system, a
production controller with programs/users/fieldbus, and **eRoBo Studio**, the
Electron + React pendant & desktop software.

```
 eRoBo Studio (desktop / browser / tablet)      PLC / MES / SCADA
        │  WebSocket :8765   REST + UI :8080     │  Modbus TCP :1502   MQTT (opt)
        ▼                                        ▼
              erobo_controld  — programs · safety config · users · tools ·
                                event log · backup · Modbus · MQTT
        │ POSIX shared memory (seqlock, /dev/shm/erobo10_shm)
        ▼
 ik_solver ─▶ motion_planner ─▶ ecat_control_node (1 kHz RT) ─EtherCAT▶ 6 × ZeroErr eRob
                  ▲  jerk-limited S-curves · MoveJ/L/P/C · speed override · zones
                  └─ safety monitor · contact detection · self-collision · telemetry
```

## Quick start (no hardware — full simulator)
```bash
make && make test                 # build + unit suites (FK/IK/trajectory/safety)
./scripts/run.sh                  # sim robot + controller
# open http://localhost:8080  →  Enable → jog / teach / program / run
python3 test/integration_test.py # 40+ end-to-end acceptance checks
```
Or in Docker: `docker build -f deploy/Dockerfile.sim -t erobo-sim . && docker run -p 8080:8080 -p 8765:8765 -p 1502:1502 erobo-sim`

## Real robot
```bash
make HARDWARE=1 apps              # needs the IgH EtherCAT master
sudo ./deploy/install.sh          # installs + enables systemd services
```
See `docs/INSTALLATION.md` (commissioning), `docs/USER_MANUAL.md` (operation),
`docs/SAFETY.md`, `docs/INTEGRATION_API.md` (WS/REST/Modbus/MQTT),
`docs/TROUBLESHOOTING.md`, `docs/FAT_SAT.md` (acceptance tests).

## Repository map
`core/include/erm/` header-only motion library (URDF-exact FK validated to 1.7 µm,
no-fail LM IK, jerk-limited S-curve PTP/LIN/CIRC/blended MoveP, RNEA dynamics +
payload, contact detection, self-collision, safety monitor) · `apps/` real-time
nodes (sim + EtherCAT CiA-402/DC driver) · `bridge/` + `controller/` the production
controller service · `studio/` eRoBo Studio (Electron + React + TS; `dist/` is the
served pendant build) · `robot/` URDF + STL meshes · `deploy/` installer, systemd,
Docker, updater · `test/` unit + integration suites · `docs/` manuals & references.

## Engineering notes
The real-time plane is deliberately ROS-free (deterministic shared-memory IPC, like
commercial cobot controllers); external systems integrate through the documented
APIs, and a ROS 2 driver can sit on the WebSocket interface exactly as vendor ROS
drivers do. The motion stack is validated by unit tests (IK 3000/3000 poses ≤ 1 µm,
Jacobian vs finite-diff 2.4e-10, trajectory limit compliance) and the full-stack
integration suite; MoveL accuracy in the loop test is ≤ 0.2 mm in simulation —
physical repeatability (±0.05 mm target) is set by the 19-bit encoders and verified
per `docs/FAT_SAT.md`.
