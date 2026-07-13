# eRoBo 10 — Installation & Commissioning Guide

## 1. Mechanical & electrical
1. Bolt the base to a rigid surface (M8×4, torque 20 Nm; flatness < 0.1 mm).
2. Wire each eRob actuator's power (48 V DC bus) and the EtherCAT chain
   J1→J2→…→J6 (IN/OUT daisy chain), per `docs/HARDWARE_BRINGUP.md`.
3. Wire the **hardware E-stop chain** (STO inputs) — mandatory before any motion.
4. Controller PC: Linux (Ubuntu 22.04 recommended), wired NIC dedicated to EtherCAT,
   second NIC/Wi-Fi for the plant network.

## 2. EtherCAT master
Install the IgH EtherCAT master and bind it to the robot NIC
(`docs/ETHERCAT_INTEGRATION.md`). Verify with `ethercat slaves` → six ZeroErr
devices in PREOP.

## 3. Software install
```bash
sudo ./deploy/install.sh          # hardware robot
sudo ./deploy/install.sh --sim    # simulator (training/dev PC)
```
This builds the stack, installs to `/opt/erobo`, persists configuration in
`/var/lib/erobo`, and enables the systemd services `erobo-control` (or `erobo-sim`),
`erobo-planner`, `erobo-ik`, `erobo-controller`. The pendant UI is then served at
`http://<robot>:8080/`. Updates: `sudo ./deploy/update.sh <new release dir>`
(auto-backs-up configuration first). A complete simulated robot is also available as
a container: `docker build -f deploy/Dockerfile.sim -t erobo-sim . && docker run -p
8080:8080 -p 8765:8765 -p 1502:1502 erobo-sim`.

## 4. First commissioning
1. Open Studio → header should show DISABLED with live joint values.
2. **Joint directions**: jog each joint a few degrees; if a joint moves opposite to
   the 3-D model, flip its sign (persisted in `calibration.txt`, applied live).
3. **Zero offsets**: drive the arm to the mechanical reference pose and set offsets
   (degrees) in the calibration file so model = machine.
4. Verify the E-stop chain drops the drives; verify software STOP decelerates smoothly.
5. Configure safety: reach, floor, planes around fixtures; set collaborative speed
   limits; enable contact detection; test with the built-in poke test (sim) or a
   gentle push (hardware, reduced speed).
6. Change the admin PIN; create operator/programmer users.
7. Teach a 3-point test program, run 10 cycles at 30 %, then full speed.
8. Record the acceptance results (`docs/FAT_SAT.md`).

## 5. Desktop application
On any engineering PC: `cd studio && npm install && npm run package` → installers in
`studio/release/` (Windows NSIS, Linux AppImage/deb, macOS dmg). The app connects to
any robot by address (Setup → Robot address).
