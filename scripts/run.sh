#!/usr/bin/env bash
# Start the SIMULATED erobo10 stack: control_node(sim) + planner + ik + controller.
# UI:  http://localhost:8080/  (Studio web build)   WS API: ws://localhost:8765
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; cd "$ROOT"
SHM="${EROBO_SHM:-/dev/shm/erobo10_shm}"

# ---- preflight: catch a fresh/copied checkout with clear messages ----
chmod +x scripts/*.sh deploy/*.sh 2>/dev/null || true   # exec bits are lost when copied via Windows/zip
command -v g++ >/dev/null && command -v make >/dev/null || {
  echo "[run] missing build tools. Install them first:  sudo apt install -y g++ make"; exit 1; }
command -v python3 >/dev/null || { echo "[run] python3 not found:  sudo apt install -y python3 python3-pip"; exit 1; }
python3 -c "import websockets" 2>/dev/null || {
  echo "[run] python 'websockets' package missing. Install it:"
  echo "        pip3 install websockets"
  echo "        (Ubuntu 23+/Debian 12: pip3 install websockets --break-system-packages)"; exit 1; }
[[ -x bin/control_node ]] || { echo "[run] building the control plane..."; make apps; }
rm -f "$SHM"
./bin/control_node   --shm "$SHM" & C=$!
sleep 0.5
./bin/motion_planner --shm "$SHM" & P=$!
./bin/ik_solver      --shm "$SHM" & I=$!
cleanup(){ echo; echo "[run] stopping"; kill $C $P $I 2>/dev/null || true; }
trap cleanup EXIT INT TERM
sleep 0.5
echo "[run] control plane up -- starting the controller service"
exec python3 controller/erobo_controld.py --shm "$SHM"
