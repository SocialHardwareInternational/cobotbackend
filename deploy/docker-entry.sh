#!/bin/sh
set -e
rm -f /dev/shm/erobo10_shm
/erobo/bin/control_node --shm /dev/shm/erobo10_shm &
sleep 0.6
/erobo/bin/motion_planner --shm /dev/shm/erobo10_shm &
/erobo/bin/ik_solver --shm /dev/shm/erobo10_shm &
sleep 0.5
exec python3 /erobo/controller/erobo_controld.py --shm /dev/shm/erobo10_shm
