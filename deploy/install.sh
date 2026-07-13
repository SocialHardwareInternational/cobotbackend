#!/usr/bin/env bash
# eRoBo platform installer -- installs the control stack as system services.
#   sudo ./deploy/install.sh            # hardware robot (EtherCAT)
#   sudo ./deploy/install.sh --sim      # simulated robot (dev/demo/training)
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "run with sudo"; exit 1; }
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="hw"; [ "${1:-}" = "--sim" ] && MODE="sim"
echo "== eRoBo installer ($MODE) =="

echo "[1/6] dependencies"
apt-get install -y --no-install-recommends g++ make python3 python3-pip >/dev/null
pip3 install --quiet websockets 2>/dev/null || pip3 install --quiet --break-system-packages websockets
if [ "$MODE" = hw ] && ! ldconfig -p | grep -q libethercat; then
  echo "  WARNING: IgH EtherCAT master (libethercat) not found."
  echo "           Install it (see docs/ETHERCAT_INTEGRATION.md), then re-run."
fi

echo "[2/6] build"
make -C "$SRC" -s apps
[ "$MODE" = hw ] && make -C "$SRC" -s HARDWARE=1 apps

echo "[3/6] install to /opt/erobo"
mkdir -p /opt/erobo /var/lib/erobo
rsync -a --delete --exclude node_modules --exclude .git --exclude release \
  "$SRC/bin" "$SRC/bridge" "$SRC/controller" "$SRC/core" "$SRC/robot" \
  "$SRC/studio/dist" "$SRC/docs" /opt/erobo/ 2>/dev/null || {
  # rsync may be absent on a minimal image
  cp -r "$SRC/bin" "$SRC/bridge" "$SRC/controller" "$SRC/core" "$SRC/robot" "$SRC/docs" /opt/erobo/
  mkdir -p /opt/erobo/studio && cp -r "$SRC/studio/dist" /opt/erobo/studio/; }
mkdir -p /opt/erobo/studio
[ -d /opt/erobo/dist ] && { rm -rf /opt/erobo/studio/dist; mv /opt/erobo/dist /opt/erobo/studio/dist; }
[ -f /var/lib/erobo/calibration.txt ] || cp "$SRC/run/calibration.txt" /var/lib/erobo/ 2>/dev/null || true
chmod -R a+rX /opt/erobo

echo "[4/6] services"
cp "$SRC"/deploy/systemd/*.service /etc/systemd/system/
systemctl daemon-reload
if [ "$MODE" = sim ]; then
  systemctl enable --now erobo-sim erobo-planner erobo-ik erobo-controller
else
  systemctl enable --now erobo-control erobo-planner erobo-ik erobo-controller
fi

echo "[5/6] firewall (if ufw active)"
command -v ufw >/dev/null && ufw status | grep -q active && { ufw allow 8080/tcp; ufw allow 8765/tcp; ufw allow 1502/tcp; } || true

echo "[6/6] done"
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
echo
echo "  eRoBo is up.  Open the pendant UI:   http://${IP:-<robot-ip>}:8080/"
echo "  Desktop app:  studio/ -> npm install && npm run package"
echo "  First login:  admin / 1234  (you will be asked to change it)"
