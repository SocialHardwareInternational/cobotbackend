# Auto-detect the table plane by TOUCH PROBING

The cobot finds the writing surface **by itself, fully automated from the joints‑0 home**: it goes
home, moves to a fixed configuration that holds the marker **perpendicular to the base (pen straight
down)** over the front of the robot, descends **straight down until it touches the table** (sensed by
the physical‑contact detector), and builds + activates a **level writing plane** at that height — no
manual teaching.

This is the standard "**move until contact**" / touch‑off used by UR (Polyscope "Until Contact"),
CNC Z‑probing, and robot workpiece calibration. Approach at the lowest speed protects the tip;
coarse‑then‑fine gives a precise height.

> **Why the ready pose is commanded in JOINT space (important):** commanding the pen‑down orientation
> as a *Cartesian* target routed through the wrist‑joint conventions and came out **inverted** on the
> real arm (the marker pointed the wrong way). Instead, the ready pose is now a fixed **joint‑angle**
> configuration — the exact angles the *calibrated* 3D model shows as pen‑straight‑down. Because the
> model matches the physical arm (joint‑sign calibration), those joints make the real marker hold
> perpendicular, with no Cartesian‑orientation command that can flip.

> **Safety:** probing drives the tip toward the table on purpose. It uses the software contact
> detector to stop, moves slowly, and approaches in two stages so the marker isn't damaged — but the
> **hardware E‑STOP / STO is the real guarantee and stays independent**. Keep a hand on the E‑STOP,
> keep the workspace clear, and use a spring‑loaded marker holder so any overshoot is absorbed.

## How it works

```
1. MoveJ to the joints-0 home
2. MoveJ to the fixed READY joint config  [-0.076,-0.442,-2.448,-0.435,1.571,-1.495]
   -> marker perpendicular to the base (tool Z = base -Z), pen straight down, over the front
3. arm the contact detector (high sensitivity), let it learn its baseline while stationary
4. COARSE: descend straight down (guarded MoveL) until the detector trips -> record tip z
5. retract a few mm, re-arm
6. FINE: descend very slowly from just above -> trip -> precise tip z
7. lift back to the safe height
plane = LEVEL plane at the touched point (origin bottom-left so the touch = area centre,
        xdir=+baseX, ydir=+baseY, zdir=into-paper = -baseZ, size = plane W x H)
save & activate the plane; writing now uses it
```

- **Perpendicular to the base**: the ready pose is a joint config whose tool Z = base −Z, so on a
  level table the pen is square to the surface (0° tilt). One touch gives the surface **height**; the
  plane is built **level** (normal up) — the right assumption for a flat, level table. (For a tilted
  table, teach 3 points manually with the ✍ Write → *Writing plane* 3‑point capture, which fits the
  tilt.)
- **Gentle**: high sensitivity trips on the lightest touch; on contact the protective stop disables
  the drives immediately, so the tip stops at the surface. Validated in sim: touches land ~**1 mm**
  past the surface.
- **Two‑stage**: coarse finds the surface quickly; fine re‑approaches slowly for an accurate height
  without ramming the tip. Contact detection is **on only during the descents**, off during
  positioning/retracts (no nuisance trips).

## Using it (✍ Write → 🎯 Auto-detect plane)

1. Configure the marker as the **TCP** (⧉ TCP) so the tip is the tool point.
2. Put your paper on the table **under the front spot** the arm reaches (≈ 0.38 m in front, on the
   robot's centreline). Clear the workspace, hand on the E‑STOP.
3. In ✍ Write → *Auto-detect plane*: set the **plane size** (writing area W×H), **max drop** (how far
   down to search), and **sensitivity**. Press **🎯 Auto-detect plane** — the arm does the rest.
4. It homes, holds the marker perpendicular over the front, descends until it touches, and builds +
   activates a level plane. **Write** writes on it; **Stop** aborts at any time.

## Protocol

```json
{"cmd":"probe_plane","name":"table",
 "width":0.20,"height":0.15,   // writing-area size of the level plane (m); touch point = centre
 "max_drop":0.30,              // search this far straight down (m)
 "coarse_speed":0.03,"fine_speed":0.01,     // descent speeds (fraction of max; slow!)
 "retract":0.010,              // back-off between coarse & fine (m)
 "sensitivity":0.9,            // contact sensitivity 0..1 (high = light touch)
 "ready_joints":[...6...]}     // optional override of the perpendicular ready pose (radians)
-> {"type":"probe","event":"note"|"probing"|"touched"|"done"|"error", ...}
   on "done": the saved level plane; also emits a "planes" list refresh.
{"cmd":"program_stop"}          // aborts probing too
```

The ready pose is a **fixed joint configuration** (not a Cartesian target) so the marker orientation
is exactly what the calibrated model shows — no Cartesian‑orientation inversion. Override it with
`ready_joints` if your table sits at a different spot.

## Testing in simulation

The sim has a **virtual table**: start the control node with `EROBO_SIM_TABLE_Z=<z_metres>` and the
marker pressing below that height injects a contact, so the whole probe runs in sim. Validated end to
end: from joints‑0 → the joint‑space ready pose gives **tool‑Z = [0,0,−1]** (perpendicular, pen down)
with the marker over the front spot, and the straight‑down probe **touches at z ≈ 0.199 m** against a
table at 0.200 m; a level plane is built and saved+activated automatically.

```bash
EROBO_SIM_TABLE_Z=0.21 ./bin/control_node --shm /dev/shm/erobo10_shm   # + motion_planner, ik_solver, ws_bridge
# then send probe_plane from the UI or a WebSocket client
```

## Tuning on the real arm

The touch relies on the contact detector, which needs the friction/model roughly calibrated (see
`docs/CONTACT_DETECTION.md`) so a light marker touch is distinguishable from model error. Start with
**high sensitivity, very slow speeds, small max_drop**, and a **spring-loaded pen holder**. Increase
speed only once touches are repeatable. If the tip is fragile, raise sensitivity and lower fine_speed
further; the coarse/fine split exists precisely to keep the final approach gentle.
