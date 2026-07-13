# WebSocket Protocol (UI <-> control box)

Endpoint `ws://<host>:8765`. JSON text. SI units (m, rad, rad/s). Orientation as
`quat` [w,x,y,z] or `rpy` [roll,pitch,yaw]. Any client command may include an
`"id"` which is echoed on the matching `ack`.

## Client -> server
| Command | Example |
|---|---|
| Joint move (synchronized jerk-limited) | `{"cmd":"move_joint","q":[q1..q6],"speed":0.5}` |
| PTP to pose (IK, then joint move) | `{"cmd":"move_ptp","pos":[x,y,z],"rpy":[r,p,y],"speed":0.5}` |
| LIN to pose (straight line) | `{"cmd":"move_lin","pos":[x,y,z],"quat":[w,x,y,z]}` |
| Smooth stop (cosine-eased decel) | `{"cmd":"stop"}` |
| Hold current setpoint | `{"cmd":"hold"}` |
| Protective stop | `{"cmd":"estop"}` |
| Clear protective stop | `{"cmd":"reset"}` |
| One-shot state | `{"cmd":"get_state"}` |

`speed` (0.05..1.0) scales the nominal limits. Move commands return an `ack`
with `ok` and (for pose moves) the IK residual `pos_err`; unreachable poses
return `ok:false`.

## Server -> client
`state` is broadcast ~50 Hz:
```json
{ "type":"state", "t":12.3, "mode":"IDLE|MOVING|STOPPING|ESTOP|HOLD",
  "estop":false, "enabled":true, "moving":false, "progress":0.0, "manip":0.18,
  "q":[6], "qd":[6], "flange":{ "pos":[x,y,z], "quat":[w,x,y,z] } }
```
`ack`: `{"type":"ack","cmd":"move_ptp","ok":true,"pos_err":2.4e-8,"id":1}`.
Also `welcome` and `error`.

`manip` is the Yoshikawa manipulability (≈0 near singularities) — useful to grey
out unreachable jog directions in the UI.

## Motion types (MoveJ / MoveL / MoveP) and jogging
| Command | Meaning | Example |
|---|---|---|
| `move_joint` | **MoveJ** in joint space | `{"cmd":"move_joint","q":[q1..q6],"speed":0.5}` |
| `move_ptp` | **MoveJ** to a Cartesian pose (IK once) | `{"cmd":"move_ptp","pos":[x,y,z],"rpy":[r,p,y],"speed":0.5}` |
| `move_lin` | **MoveL** straight line | `{"cmd":"move_lin","pos":[x,y,z],"rpy":[r,p,y],"speed":0.5}` |
| `move_p` | **MoveP** constant tool speed + circular blends | `{"cmd":"move_p","waypoints":[{"pos":[..],"rpy":[..]}, ...],"blend":0.04,"tool_speed":0.1,"tool_acc":1.0}` |
| `jog` | real-time velocity jog | `{"cmd":"jog","frame":"joint|base|tool","vel":[6],"speed":1.0}` |

- `move_p` takes up to 16 waypoints; `blend` (m) is the corner-rounding distance
  (smaller = sharper, larger = smoother); `tool_speed` (m/s) is held constant on
  the straight parts; the robot does not stop at blended waypoints.
- `jog` continues only while messages arrive (0.25 s watchdog); send `stop` on
  release. `frame` joint = 6 joint rad/s; base/tool = twist [vx,vy,vz,wx,wy,wz].

## Continuous state readout (terminal)
The `state` broadcast (~50 Hz) carries `q`, `qd`, `flange.pos/quat`, `mode`,
`manip`. To watch joint angles + pose live in a terminal:
```
python3 tools/pose_cli.py monitor
```
prints joint angles (deg + rad), flange xyz + quaternion, mode and manipulability
continuously. See docs/MOTION_TYPES.md for the research-backed motion definitions.

## Drive power & hand-guiding (hardware)
| Command | Meaning |
|---|---|
| `{"cmd":"enable"}` / `{"cmd":"disable"}` | power-enable / disable the drives (CiA-402). Motion is refused until enabled. |
| `{"cmd":"freedrive","on":true/false}` | hand-guide mode: brakes off, zero-velocity, no servo. Motion refused while on. |

State adds `"enabled"`, `"estop"`, and `"freedrive"` booleans; `mode` includes `DISABLED`
and `FREEDRIVE`. Bring-up tools: `control_node --hardware --selftest [--allow-motion]` and
`--set-home <q0..q5>`; runtime calibration in `config/ecat_calib.conf`. See
docs/ETHERCAT_INTEGRATION.md.
