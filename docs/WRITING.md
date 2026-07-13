# Robot writing (text → toolpath) — integrated with the TCP

This is the KUKA‑style "robot writing" pipeline (text → vector strokes → Cartesian tool‑paths →
execute) built on the project's existing MoveL/MoveP + TCP layer. The marker configured as the
TCP traces the letters.

## Pipeline

```
text  ->  single-stroke vector font        (bridge/writing.py)
      ->  laid out, scaled to a letter height, in a 2D writing plane
      ->  placed on a 3D writing plane = a taught TCP pose (paper origin)
      ->  drawn at the marker TCP: pen-up travel (PTP) -> pen-down (MoveL)
          -> stroke (blended MoveP) -> pen-up (MoveL), each completion-gated
```

- **Font** (`bridge/writing.py`): a hand‑made **single‑stroke** font (A–Z, 0–9, space, common
  punctuation; lowercase → uppercase). Single‑stroke = one pen line per stroke, ideal for a marker
  (verified legible — see `font_preview.png`). `text_to_strokes()` lays the text out; `generate()`
  places it on the writing plane and returns base‑frame stroke polylines + the fixed pen
  orientation + the pen‑up direction.
- **Writing plane** = the plane through a **taught TCP pose** (default: the *current* tool‑tip
  pose). Plane X = tool X (right), Y = tool Y (up on the paper), and the marker points **into** the
  paper along +tool Z (so pen‑up = −tool Z). The whole stroke keeps this fixed orientation, so the
  Cartesian moves are pure translation on the plane — well‑conditioned, no singularity spinning.
- **Runner** (`bridge/ws_bridge.py:_run_writing`): per stroke — PTP above the start (pen up) →
  MoveL down (pen down) → blended **MoveP** through the stroke (slow, small blend, chunked to the
  16‑waypoint shm limit) → MoveL up (pen up). Every move is completion‑gated and runs at the
  **marker TCP**, so the tip only touches paper while drawing. Reuses the singularity‑safe MoveL/
  MoveP + the LIN path pre‑check.

## How to use (⧉ TCP first, then ✍ Write)

1. **Configure the marker as the TCP** (⧉ TCP panel — numeric offset `[0,0,L]` or 4‑point teach).
   Now the tool‑tip readout is the marker tip.
2. Jog the marker tip to the **bottom‑left corner** of your paper, held **perpendicular** to it.
   That pose defines the writing plane (its X = right, Y = up).
3. Open **✍ Write**: type the text, set **letter height** (mm), **pen‑up** clearance (mm), and
   **draw speed** (mm/s). **Preview** draws the strokes in the 3D view and reports size + stroke/
   point counts (and rejects unreachable points). **Write** runs it (enable the drives first).
   **Stop** aborts.

## WebSocket protocol

```json
{"cmd":"write_preview","text":"HELLO","height":0.025,"pen_up":0.015,"align":"left"}
   -> {"type":"writing","event":"preview","strokes":[[[x,y,z],…],…],"orient":[w,x,y,z],
       "up":[ux,uy,uz],"bbox":{"w","h"},"nstrokes","npts"}
{"cmd":"write_run","text":"HELLO","height":0.025,"pen_up":0.015,
   "draw_speed":0.04,"travel_speed":0.4}     // draw_speed m/s ; travel_speed 0..1
{"cmd":"program_stop"}                        // stops writing too
```
Optional `"plane":[x,y,z,qw,qx,qy,qz]` overrides "use current tool‑tip pose".

## Validation

`writing.generate("HELLO 12", …)` on a table plane → 11 strokes / 39 points, **all IK‑reachable**
at the marker TCP (100%). The font was rendered and checked for legibility. Cartesian writing
moves keep a fixed orientation, so they stay well away from wrist singularities.

## Writing planes (add / recognize / set up)

Instead of "the current pose," you can **define, save, and select named writing planes**
(`bridge/planes.py`, persisted in `run/planes.json`; the active plane is remembered):

- **3‑point teach** (accurate): in ✍ Write → *Writing plane*, jog the marker tip to the paper's
  **bottom‑left**, **bottom‑right (+X)**, and **top‑left (+Y)** corners, capturing each. `Save 3‑pt`
  solves the plane frame (origin + right/up/into‑paper axes) **and its size** and stores it.
- **Quick**: `Save pose` stores the current tool‑tip pose as a plane.
- **Select / delete**: pick a saved plane from the dropdown (`Use` = make active); ✕ deletes it.
  The selected/active plane is what `write_run`/`write_preview` draw on.
- **3D preview** shows the plane **rectangle + X(red)/Y(green) axes** and the strokes, so you can
  see and confirm the paper before writing.

Storing explicit axes (`xdir`,`ydir`,`zdir`) rather than one quaternion avoids the left‑handed
`[right, up, into‑paper]` reflection you hit on a flat sheet, so text is never mirrored.

Protocol: `plane_save` (with `origin`/`xpt`/`ypt` pose7s for 3‑point, or none for current pose),
`plane_list`, `plane_select`, `plane_delete`. `write_run`/`write_preview` accept `"plane_name"`.

Validated: a 3‑point plane "deskA" (200×140 mm) → "INTEGRA" laid out on it, **100% IK‑reachable**
at the marker TCP.

## Quality upgrade (research-based)

Rebuilt from how pen-plotters and robot-writing systems actually do it:

- **Font → Hershey single-stroke** (`bridge/fonts/futural.jhf`, the Sans 1-stroke face; Allen
  Hershey 1967 — the pen-plotter standard used by AxiDraw / Inkscape "Hershey Text"). Single-stroke
  centrelines (not TrueType outlines) are exactly what a marker needs. Proper letterforms with
  **real lowercase, curves and descenders** (vs. the old hand-made caps-only font).
- **Auto pen orientation to the surface** — the marker is held **perpendicular to the writing
  plane** (tool Z = plane inward normal), re-orthonormalised from the table normal so it's truly
  square even if the taught axes are slightly off (RoboDK/UR "keep TCP normal to the surface").
  Orientation is **fixed per stroke** → pure translation, no wrist spin. Optional `tilt_deg` leans
  the pen (lead angle); 0 = perpendicular (best for a round marker).
- **Smooth strokes** — each stroke is curvature-simplified (Ramer–Douglas–Peucker) to fit the shm
  waypoint limit and drawn as **ONE blended MoveP** at constant speed, **no mid-stroke stops** (the
  old chunked runner stopped every 15 points → jerky). Verified the simplified path is visually
  identical to the raw Hershey glyph.
- **Consistent contact** — a small **press-in** (`press_mm`, default 1.5 mm) keeps the tip in
  contact despite minor plane/height error. On the real arm pair it with a **spring-loaded pen
  holder** (~0.4 N/mm passive compliance) for even pressure without a force sensor.

Protocol: `write_run`/`write_preview` accept `tilt_deg` and `press_mm`; preview returns `into` and
`tilt_deg`.

## Extending

- **SVG / images**: swap the font layer for `svgpathtools` to sample arbitrary vector paths into
  the same stroke list — the plane placement + runner are unchanged.
- **3‑point plane teach** (origin + X + Y) for a more accurate paper frame than the single taught
  pose (handles a paper not perpendicular to the marker).
- Per‑stroke direction‑aligned orientation (calligraphy) — currently fixed perpendicular, which is
  correct for a round marker.
