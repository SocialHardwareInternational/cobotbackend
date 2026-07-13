# eRoBo 10 — Safety Manual

## 1. Safety architecture (three layers)

1. **Hardware safety chain** — the E-stop / STO circuit cuts drive power
   independently of ALL software. It is the only layer rated for personnel
   protection and must be wired and validated at installation.
2. **Real-time software monitor** (control node, 1 kHz, on measured state):
   TCP/elbow overspeed, joint overspeed, workspace/plane penetration (with 5 mm /
   15 % hysteresis), external-force limit, contact detection, self-collision —
   any trip latches a **protective stop** (drives disabled, brakes engaged, cause
   published and logged).
3. **Planner-side limiting** (before motion happens): the global speed override,
   reduced-zone scaling, deceleration into forbidden boundaries, torque-feasibility
   time-scaling, singular-path rejection and target validation. The planner keeps
   the robot away from the limits so layer 2 rarely has to act.

Additional guarantees: every trajectory is jerk-limited and C²-continuous; the
control nodes hard-clamp the per-cycle setpoint step (2× rated speed) so no upstream
fault can command a jump; e-stop/reset requests travel as edge counters that cannot
be lost or replayed; a failed shared-memory read never moves the setpoint.

## 2. Configuration (Studio → Safety, admin)

Speed limits (hard + reduced), TCP force limit, elbow speed, max reach, floor,
ceiling, base keep-out, up to 6 safety planes (forbidden or reduced). Changes are
applied live, persisted (`safety.json`), logged with the acting user, and included
in backups. Collaborative defaults follow ISO/TS 15066 flavour (250 mm/s reduced).

## 3. Recovery procedures

| Event | Indication | Recovery |
|---|---|---|
| Hardware E-stop | mode ESTOP, drives off | clear hazard → release button → Reset → Enable |
| Software e-stop | mode ESTOP | Reset → Enable |
| Protective stop (safety monitor) | banner names the cause (e.g. “TCP overspeed”, “safety plane”) | remove cause → Enable |
| Contact detected | banner names the joint | clear the obstruction → Enable |
| Self-collision stop | banner + link pair | jog away in joint mode → Enable |
| Drive fault (transient) | status DRIVE-RECOVERY | none — automatic reset + re-enable, motion cancelled |
| Drive fault (persistent, >4/15 s) | status FAULT-LATCHED | fix cause (0x603F code in log) → Enable |
| EtherCAT link degraded | status LINK-RECOVERY | none — automatic re-init after 5 s; check cabling if recurring |

Re-enabling never resumes stale motion: pending trajectories are cancelled on any
drive drop-out and the setpoint re-synchronises to the measured position.

## 4. Residual-risk notice

Software monitors (collision detection, planes, force limits) are *early-warning and
mitigation* features implemented on standard hardware; they are **not** a certified
safety function per ISO 13849 / IEC 62061 and do not replace risk assessment,
guarding, or the hardware E-stop chain. Perform a cell-level risk assessment
(ISO 10218-2 / ISO/TS 15066) before collaborative operation.
