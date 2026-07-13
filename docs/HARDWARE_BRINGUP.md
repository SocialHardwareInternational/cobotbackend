# erobo10 — hardware bring-up: information needed

Already done from your URDF (NOT needed from you): kinematics/DH, IK, motion
planning, joint position/vel limits structure. The only missing layer is the
EtherCAT drive interface behind `EthercatInterface::cycle()` in hal.hpp. Fill in
the blanks below and I can write the real driver.

## TIER 1 — minimum to make it move
**EtherCAT master & PC**
- [ ] Master stack: SOEM / IgH EtherLab / Acontis / vendor? ............
- [ ] Control PC + OS (PREEMPT_RT kernel strongly recommended for 1 kHz): ......
- [ ] Dedicated NIC interface name for EtherCAT (e.g. enp3s0): ............
- [ ] Bus order: list slaves in physical order (drive1..drive6, IO, …): ........

**Each drive (x6) — CiA-402 servo**
- [ ] Drive make/model: ............  (e.g. Elmo Gold, Synapticon, Copley, Leadshine)
- [ ] ESI / EtherCAT XML file for the drive (attach it) — gives the PDO map.
- [ ] Operation mode available: CSP (0x6060=8, position) confirmed? ..... (we use CSP)
- [ ] RxPDO objects: control word 0x6040, modes 0x6060, target position 0x607A — confirm
- [ ] TxPDO objects: status word 0x6041, actual position 0x6064, actual velocity 0x606C — confirm
- [ ] Encoder resolution: counts per **motor** rev: ......  (and is it on motor or output side?)

**Each joint (x6) — mechanics (this is the counts<->radian calibration)**
- [ ] Gear ratio (motor turns : joint turn): J1 ... J2 ... J3 ... J4 ... J5 ... J6 ...
- [ ] Direction sign vs the URDF axis (+1 if motor+ = URDF q+, else -1): ......
- [ ] **Zero offset:** the raw encoder count (or absolute reading) when the joint is at URDF q = 0: ......
      (this is the single most important number — it maps drive counts to URDF radians)

With Tier 1 I can implement `rad_to_counts` / `counts_to_rad` per joint and the
CSP `cycle()`, and the robot will track the (already-verified) jerk-limited
setpoints.

## TIER 2 — needed for safe, correct operation
**Safety (the software e-stop is NOT a safety function)**
- [ ] Hardware E-stop / STO (Safe Torque Off) wiring on the drives — how is it triggered?
- [ ] Safety relay / safety PLC, light curtains, door switches — what gates drive power?
- [ ] Holding brakes: which joints have them, and how are they released (digital output / drive object 0x6040 bit)?

**Drive enable / homing**
- [ ] CiA-402 enable sequence specifics (any vendor quirks beyond the standard transition)?
- [ ] Encoders absolute (multi-turn) or incremental? If incremental: homing method per joint
      (index pulse / limit switch / hard-stop torque) ............
- [ ] Real mechanical joint limits and any hard stops / limit-switch inputs (confirm/replace the URDF ±3.14).

## TIER 3 — tuning for the 10 kg payload (improves smoothness/safety, optional to start)
- [ ] Real max velocity, acceleration and rated/peak torque (or current) per joint at full payload
      (URDF has v=1.57 rad/s and tau 140..57 Nm — confirm against the drives/motors).
- [ ] Tool/payload: mass, center of gravity, inertia (refines accel/jerk limits; link inertias
      already come from the URDF).
- [ ] Desired control cycle (default 1000 Hz) and whether Distributed Clocks (DC) sync is enabled.

## What I do with it
1. Implement `class EthercatMaster : public EthercatInterface` (SOEM or IgH) with the PDO map.
2. Per-joint `counts = (q - offset)*dir*gear*counts_per_rev/(2*pi)` and inverse.
3. CiA-402 enable/fault-reset state machine + brake release; map STO to the e-stop path.
4. Run control_node SCHED_FIFO + mlockall, DC-synced, on the RT kernel.
Nothing above the HAL (kinematics, IK, planner, bridge, UI) changes.
