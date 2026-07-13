#!/usr/bin/env bash
# Start the REAL erobo10 stack: ecat_control_node (root) + planner + ik + controller.
# UI:  http://<robot-ip>:8080/    WS API: ws://<robot-ip>:8765    Modbus: 1502
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; cd "$ROOT"
SHM="${EROBO_SHM:-/dev/shm/erobo10_shm}"
chmod +x scripts/*.sh deploy/*.sh 2>/dev/null || true
python3 -c "import websockets" 2>/dev/null || {
  echo "[run] python 'websockets' package missing:  pip3 install websockets  (--break-system-packages on Ubuntu 23+)"; exit 1; }
[ -x bin/ecat_control_node ] || {
  echo "[run] the REAL-ROBOT driver is not built yet. This needs the IgH EtherCAT master installed"
  echo "      (docs/ETHERCAT_INTEGRATION.md), then:   make HARDWARE=1 apps"
  echo "      For the SIMULATED robot use:            ./scripts/run.sh"
  exit 1; }
sudo rm -f "$SHM"
echo "[run] starting EtherCAT control node (root)..."
sudo ./bin/ecat_control_node --shm "$SHM" ${EROBO_NODC:+--no-dc} & EC=$!
for i in $(seq 1 100); do [ -e "$SHM" ] && break; sleep 0.05; done
[ -e "$SHM" ] || { echo "[run] shm never appeared -- EtherCAT master up?"; sudo kill $EC 2>/dev/null; exit 1; }
sudo chmod 666 "$SHM"
./bin/motion_planner --shm "$SHM" & MP=$!
./bin/ik_solver      --shm "$SHM" & IK=$!
cleanup(){ echo; echo "[run] stopping"; kill $MP $IK 2>/dev/null; sudo kill $EC 2>/dev/null; }
trap cleanup EXIT INT TERM
sleep 0.4
exec python3 controller/erobo_controld.py --shm "$SHM"
