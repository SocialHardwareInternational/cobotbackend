# eRoBo Controller — Integration API Reference

Three surfaces, one controller. All examples use the robot's IP.

## 1. WebSocket API — ws://robot:8765
JSON messages; add `"rid":"<any id>"` to correlate replies. A 50 Hz `{"type":"state"}`
stream is broadcast to every client (joints, TCP pose, mode, safety, I/O-relevant
fields, program status, RT health).

Motion & control: `enable` `disable` `estop` `reset` `stop` `hold`
`move_joint {q[6],speed,accel}` · `move_ptp / move_lin {pos[3], quat[4]|rpy[3], speed}`
· `move_p {waypoints[], blend, tool_speed}` · `move_c {via, end}` · `move_rel {delta[3],
frame}` · `jog {frame: joint|base|tool, vel[6], speed}` (expires after 250 ms —
resend while held) · `freedrive {on}`.

Configuration: `set_speed {frac}` · `get_safety` / `set_safety {config}` ·
`set_payload {kg,cog}` · `set_tcp {pos,quat|rpy,payload,cog}` · `tcp_teach {flanges[],
apply}` · `tool_list/save/select/delete` · `set_contact {on,sensitivity}` ·
`set_collision {on}` · `set_sign {signs[6]}`.

Data: `get_state` · `wp_list/save/update/delete/goto` · `prog_list/get/save/delete` ·
`prog_run {id,speed,loop}` · `program_stop` · `io_get` · `io_set {do,value | ao,volts}`
· `di_force {di,value}` · plus the application layer (`write_run`, `probe_plane`,
`pallet_run`, `plane_*`) documented in `docs/PROTOCOL.md`.

Program/step events are broadcast as `{"type":"program","event":"start|step_start|
step_done|loop|done|error|aborted", ...}`.

## 2. REST API — http://robot:8080/api/v1
Auth: `POST /auth/login {user,pin}` → `{token}`; send `Authorization: Bearer <token>`.
Reads are open; writes need operator+; safety/users/settings/backup need admin.

`GET /state · /system · /metrics · /events?since&level&limit · /programs[/{id}] ·
/waypoints · /tools · /safety · /io · /settings · /backup`
`POST /programs · /programs/{id}/run · /run/stop · /command {any WS command} ·
/safety · /io · /settings · /restore {data: base64 tar.gz} · /auth/pin · /users`
`PUT /programs/{id}` · `DELETE /programs/{id} · /users/{name} · /tools/{name}`

Legacy phone endpoints `/api/state` and `/api/cmd` remain for the mobile UI.

## 3. Modbus TCP — robot:1502 (unit id 1)
| Area | Address | Meaning |
|---|---|---|
| Coils (FC1/5/15) | 0–15 | digital outputs DO0–15 |
| Discrete in (FC2) | 0–15 | digital inputs DI0–15 |
| Input regs (FC4) | 0–12 | mode, enabled, e-stop, moving, progress‰, speed %, safety zone, safety code, stop-bits, prog running, prog cycles, uptime s, jitter µs |
| | 16–27 | q1–6 [mrad], qd1–6 [mrad/s] |
| | 28–33 | TCP x,y,z [0.1 mm], roll,pitch,yaw [mrad] |
| | 34–47 | τ1–6 [0.1 Nm], TCP speed [mm/s], ext force [0.1 N], temp1–6 [0.1 °C] |
| Holding (FC3/6/16) | 0 | speed override ×1000 (50–1000) |
| | 1 | command: 1 start prog(reg 2) · 2 stop · 3 enable · 4 disable · 5 reset · 6 E-STOP · 7/8 freedrive on/off |
| | 2 | program number (1-based, creation order) |
| | 3 | last command result (1 ok / 2 error) |

## 4. MQTT (opt-in, Settings)
Publishes retained JSON state to `<prefix>/state` at the configured interval and
events to `<prefix>/events`. MQTT 3.1.1, QoS 0.

## 5. Cameras & vision
Register MJPEG/HTTP camera streams in settings (`cameras: [{name,url}]`); vision
systems integrate through the REST/WS motion API — `move_rel` with a measured offset
is the standard visual-servo primitive, and `probe_plane`/`plane_*` provide taught
work-plane management.
