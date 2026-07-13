#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; cd "$ROOT"
make all
echo "[build] running unit tests..."; ./bin/test_fk && ./bin/test_ik && ./bin/test_traj
echo "[build] OK. Binaries in bin/."
