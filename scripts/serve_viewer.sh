#!/usr/bin/env bash
# Serve the project over http so the 3D viewer can load the STL meshes AND so another PC on the
# same network can open the viewer. Binds all interfaces (0.0.0.0) so it's reachable from the LAN.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; cd "$ROOT"
PORT="${VIEWER_PORT:-8000}"
IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
echo "=========================================================================="
echo " erobo10 viewer server (LAN)"
echo "  On THIS PC (the robot PC):    http://localhost:$PORT/tools/erobo10_viewer.html"
if [ -n "$IP" ]; then
  echo "  From ANOTHER PC (same WiFi):  http://$IP:$PORT/tools/erobo10_viewer.html"
  echo ""
  echo "  When opened from another PC, the viewer auto-targets  ws://$IP:8765"
  echo "  (the bridge). Make sure the bridge is running with --host 0.0.0.0 (default)."
else
  echo "  (could not detect this PC's LAN IP; run 'hostname -I' to find it)"
fi
echo ""
echo "  If it still won't connect, allow the ports through the firewall on THIS PC:"
echo "     sudo ufw allow $PORT/tcp && sudo ufw allow 8765/tcp"
echo "=========================================================================="
python3 -m http.server "$PORT" --bind 0.0.0.0
