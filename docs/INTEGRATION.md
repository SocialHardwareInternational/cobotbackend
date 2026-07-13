> **Note:** the canonical, up-to-date system overview — with the full folder/file map and
> the freedrive path — is now [`ARCHITECTURE.md`](ARCHITECTURE.md). This file is kept for detail.

# Integration

## React / Electron pendant
The UI only speaks the WebSocket protocol in `PROTOCOL.md`. Minimal client:

```js
const ws = new WebSocket("ws://localhost:8765");
ws.onmessage = e => { const m = JSON.parse(e.data);
  if (m.type === "state") setRobot(m);            // q, flange, mode, manip
  if (m.type === "ack")   handleAck(m);
};
const moveTo = (pos, rpy, speed=0.5, id=Date.now()) =>
  ws.send(JSON.stringify({ cmd:"move_ptp", pos, rpy, speed, id }));
const estop = () => ws.send(JSON.stringify({ cmd:"estop" }));
```
In Electron, run this from the renderer (or main) like any browser WebSocket; the
bridge runs on the control box. Jogging: send small repeated `move_lin`/`move_joint`
deltas, or add a `jog` command to the bridge/ik/planner following the same pattern.

## EtherCAT (real hardware)
Replace `SimDrives` with an `EthercatInterface` implementation in
`control_node.cpp`. The contract is one `cycle(q_cmd, q_act, qd_act, dt)` per
1 kHz tick.

**SOEM sketch (CiA-402 CSP mode, 0x6060=8):**
```cpp
// init: ec_init(ifname); ec_config_init(FALSE); map PDOs; request OP state.
// per cycle:
void cycle(const JArr& q_cmd, JArr& q_act, JArr& qd_act, double dt) override {
  for (int i=0;i<6;i++) drive[i]->target_position = rad_to_counts(i, q_cmd[i]);
  ec_send_processdata(); ec_receive_processdata(EC_TIMEOUTRET);
  for (int i=0;i<6;i++){ double a=counts_to_rad(i, drive[i]->actual_position);
    qd_act[i]=(a-q_act[i])/dt; q_act[i]=a; }
}
```
Use `rad_to_counts` per drive: `counts = (q - offset_i) * gear_i * enc_counts_per_rev / (2*pi)`.
Provide each joint's gear ratio, encoder resolution, zero offset and direction.
Keep the loop `SCHED_FIFO`, `mlockall(MCL_CURRENT|MCL_FUTURE)`, DC sync on, on a
PREEMPT_RT kernel. IgH EtherLab is the alternative master with the same `cycle()`.

## Tuning for the 10 kg payload
Defaults are conservative (`erobo10_dh.hpp`):
`a_max = [6,5,6,8,8,10] rad/s^2`, `jerk = [120,100,120,160,160,200] rad/s^3`,
`v_max = 1.57 rad/s` (URDF). Raise per joint after validating torque headroom at
full payload against the URDF efforts (140..57 Nm). Cartesian LIN limits live in
`CartLimits` in `trajectory.hpp` (default 0.5 m/s, 2 m/s^2, 20 m/s^3).
