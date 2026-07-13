#!/usr/bin/env bash
# eRoBo update -- deploy a new release safely: auto-backup, install, restart.
#   sudo ./deploy/update.sh /path/to/new/release/dir
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "run with sudo"; exit 1; }
NEW="${1:?usage: update.sh <release dir>}"
TS=$(date +%Y%m%d_%H%M%S)
echo "[update] backing up configuration -> /var/lib/erobo/backup_$TS.tar.gz"
tar czf "/var/lib/erobo/backup_$TS.tar.gz" -C /var/lib/erobo --exclude 'backup_*' . 2>/dev/null || true
echo "[update] stopping services"
systemctl stop erobo-controller erobo-ik erobo-planner erobo-control erobo-sim 2>/dev/null || true
echo "[update] installing new release"
bash "$NEW/deploy/install.sh" $( [ -f /etc/systemd/system/erobo-sim.service ] && systemctl is-enabled erobo-sim >/dev/null 2>&1 && echo --sim )
echo "[update] done -- verify with: systemctl status erobo-controller"
