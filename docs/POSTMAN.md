# Driving the cobot from Postman (joint values & pose values)

The cobot is controlled over a **WebSocket** (the bridge `ws_bridge.py`). Postman talks to
it with a **WebSocket request** (not the normal HTTP request). You send JSON; the bridge
sends back an `ack` for each command and streams `state` ~50 times/sec.

## 0. Start the stack first
On the robot, the four processes must be running so the bridge is up:
```
sudo ./bin/ecat_control_node --shm /dev/shm/erobo10_shm     # (or ./bin/control_node for sim)
./bin/motion_planner --shm /dev/shm/erobo10_shm
./bin/ik_solver      --shm /dev/shm/erobo10_shm
cd bridge && python3 ws_bridge.py --port 8765
```

## 1. Connect in Postman
- New → **WebSocket Request**.
- URL: `ws://<robot-ip>:8765`  (e.g. `ws://192.168.1.24:8765`, or `ws://localhost:8765` on the robot itself).
- Click **Connect**. You get a `welcome` message listing the commands.

## 2. Enable the drives (motion is refused until you do)
```json
{"cmd":"enable"}
```

## 3. Give JOINT values  (MoveJ — q in RADIANS, 6 joints)
```json
{"cmd":"move_joint","q":[0.10,0.45,-0.75,0.30,0.70,-0.20],"speed":0.4}
```
- `q` = the 6 joint angles in **radians**.
- `speed` = 0..1 scale of the max speed.
- Send `q:[0,0,0,0,0,0]` to drive all joints to zero.

## 4. Give POSE values  (X Y Z in METRES, roll/pitch/yaw in RADIANS)
MoveJ to a Cartesian pose (IK solved once, fastest path):
```json
{"cmd":"move_ptp","pos":[-0.4207,-0.8479,0.8364],"rpy":[0.8828,0.4646,0.8643],"speed":0.4}
```
Straight-line move to the same pose (MoveL):
```json
{"cmd":"move_lin","pos":[-0.4207,-0.8479,0.8364],"rpy":[0.8828,0.4646,0.8643],"speed":0.3}
```
- `pos` = tool position [x, y, z] in **metres**.
- Orientation: either `"rpy":[roll,pitch,yaw]` (radians) **or** `"quat":[w,x,y,z]`.
- The pose must be reachable; if not, the ack comes back `ok:false`.

## 5. Constant-speed path through several poses (MoveP)
```json
{"cmd":"move_p","blend":0.04,"tool_speed":0.10,
 "waypoints":[
   {"pos":[-0.42,-0.85,0.84],"rpy":[0.88,0.46,0.86]},
   {"pos":[-0.30,-0.85,0.84],"rpy":[0.88,0.46,0.86]},
   {"pos":[-0.30,-0.73,0.84],"rpy":[0.88,0.46,0.86]}]}
```

## 6. Other useful commands
```json
{"cmd":"get_state"}                                  // one snapshot (q, flange pose, mode, torque)
{"cmd":"jog","frame":"joint","vel":[1,0,0,0,0,0],"speed":0.3}   // nudge J1 (+); send {"cmd":"stop"} to stop
{"cmd":"jog","frame":"base","vel":[0,0,0.05,0,0,0],"speed":0.3} // jog tool +Z in base frame
{"cmd":"stop"}        {"cmd":"estop"}        {"cmd":"reset"}
{"cmd":"disable"}     {"cmd":"freedrive","on":true}            {"cmd":"set_payload","kg":2.0}
```

## 7. Reading the replies
- Every command returns an ack, e.g. `{"type":"ack","cmd":"move_joint","ok":true}`.
  - `ok:false` + `"message"` tells you why (not enabled / unreachable / exceeds actuator torque).
- The bridge also streams `{"type":"state", "q":[...], "flange":{"pos":[...],"quat":[...]},
  "mode":"...", "enabled":true, ...}` continuously — that's your live feedback.

## Tips
- Units: **joints = radians, position = metres, angles = radians.**
- Always `enable` first; `estop` then `reset` to clear a stop.
- To get a guaranteed-reachable pose to type in, run `python3 tools/pose_cli.py fk <q1..q6>`
  on the robot — it prints the exact `pos` and `rpy` for that joint configuration.
