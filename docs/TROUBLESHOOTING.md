# eRoBo 10 — Troubleshooting Guide

**UI unreachable** — `systemctl status erobo-controller`; verify port 8080 open
(`ufw`), controller logs with `journalctl -u erobo-controller -e`.

**"drives not enabled" on every move** — press Enable; if it drops immediately,
check the Logs page: a latched protective stop or drive fault names the cause.

**Drives dropped out by themselves** — the controller now auto-recovers: transient
drive faults are reset with a proper CiA-402 edge and re-enabled automatically (up to
4 episodes/15 s per joint), and a degraded EtherCAT link triggers an automatic re-init
after 5 s. Motion is cancelled during recovery and the arm returns to service on its
own. Only a PERSISTENT fault latches (status `FAULT-LATCHED`, Logs name the joint) —
fix the physical cause (payload, collision, wiring, 48 V dips), then press Enable.

**Drives won't reach OPERATION-ENABLED** — `ethercat slaves` must list 6 devices;
check 48 V bus, chain order, the E-stop chain (STO held down keeps drives off);
`journalctl -u erobo-control -e` prints per-joint CiA-402 states and 0x603F codes.

**Joint moves the wrong way** — flip its sign (Studio or `calibration.txt`); the
change applies live and persists.

**A straight-line (MoveL) target is rejected** — the line crosses a singularity or
leaves the safety zone; the reply says which. Use MoveJ for that segment or move the
target.

**Robot slows down near a boundary** — by design: motion decelerates into forbidden
planes and scales down in reduced zones. Check the Safety page zone indicator.

**Contact detector nuisance-trips** — lower sensitivity, verify payload/CoG of the
active tool are correct (model mismatch looks like external torque), let the 0.8 s
baseline learn after enabling.

**High jitter / overruns (Diagnostics)** — the control PC must run the RT services
with FIFO scheduling (installed units do); avoid CPU-hungry co-tenants; on shared
NICs isolate EtherCAT.

**Program stops mid-cycle** — the run console + Logs give the step and reason
(unreachable pose after tool change, DI timeout, protective stop…). Fix the cause;
run counts and cycle counters are preserved.

**Forgot admin PIN** — delete the user entry from `/var/lib/erobo/users.json` and
restart the controller: a fresh `admin/1234 (must change)` is created.

**Restore a machine** — install the platform, then Setup → Restore with the backup
archive; restart services.
