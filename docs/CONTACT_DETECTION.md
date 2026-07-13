# Physical‑contact (collision) detection — sensorless, model‑based

On physical contact the arm applies a **protective stop** (drives disabled / hold) and the
sensitivity is adjustable. This is the "the robot touched something → stop" behaviour, built the
way industrial cobots do it, **without** any added force/torque sensor.

> **OFF by default (opt‑in).** On an uncalibrated arm the dynamic model doesn't match the drives
> well enough to distinguish a light touch from model error, so leaving it on nuisance‑stops the
> drives. It ships **disabled**; turn it on (🖐 Contact → Detector) only after tuning friction/
> thresholds on your arm. Thresholds are also **conservative** now (higher base, longer debounce/
> warm‑up) so a trip means a real, firm contact.
>
> **Safety boundary (unchanged):** this is a **software** monitor. It does **not** replace the
> hardware E‑STOP / STO, which stays fully independent of software. Contact detection is a
> convenience/quality layer on top of the independent hardware safety chain, never a substitute.

## How the credible systems do it (research)

There is no strain gauge or skin on this arm, so contact is inferred from the **motor torque the
drives already measure**. This is the standard sensorless approach:

- **Universal Robots** — UR arms have no joint torque sensors. They estimate the external force/
  torque from the **motor currents** (current → motor torque) compared against the robot's dynamic
  model, and trip a *protective stop* when the estimated external effort exceeds a user‑set limit.
  UR exposes this to the user as an adjustable **force/power/momentum** limit in the safety config;
  our **sensitivity** slider is the same idea. (UR "collision detection" / e‑Series force
  estimation; UR support notes on protective stops.)
- **De Luca & Mattone; De Luca, Albu‑Schäffer, Haddadin (DLR)** — the **generalized‑momentum
  residual** observer: `r = K·(p − ∫(τ + Cᵀq̇ − g + r) dt)`, where `p = M(q)q̇`. `r` estimates the
  external joint torque **without** measuring acceleration (no noisy `q̈`), and each component maps
  to the joint the contact acts on. This is the canonical collision‑detection/isolation method.
- **UR current‑residual case studies** (e.g. UR10 papers) — validate that motor‑current →
  torque → residual, with a **friction model** and a **velocity‑dependent threshold**, detects
  contacts reliably while rejecting false positives from model error at speed.

The three requirements those sources emphasise, and which we implemented:
1. a **friction term** (Coulomb + viscous) — otherwise stiction/damping looks like contact,
2. **filtering** (motor torque and any finite‑difference `q̈` are noisy),
3. a **velocity‑dependent threshold** — model error grows with speed, so a fast free move must not
   nuisance‑trip.

## What we implemented (this project)

`core/include/erm/contact.hpp` — `ContactDetector`:

```
residual_i = τ_measured_i − ( τ_model_i + τ_friction_i )          # external‑torque estimate
τ_model    = RNEA inverse dynamics  M(q)q̈ + C(q,q̇)q̇ + g(q) + payload   (erobo10_dyn model)
τ_friction = Coulomb·sign(q̇) + viscous·q̇                          (per‑joint, joint‑size scaled)
residual_filtered += 0.20·(residual − residual_filtered)          # low‑pass (EMA)
threshold_i(q̇) = base_i·(0.15 + (1−sensitivity)·1.85) + kv_i·|q̇_i| # sensitivity + speed term
contact  when |residual_filtered_i| ≥ threshold_i for `debounce` (4) consecutive cycles
```

- Per‑joint base thresholds and speed slopes are scaled to actuator size (J1/J2 ≫ wrist), using
  the real eRob ratings already in `erobo10_dh.hpp` (`jointEffortMax`).
- **Sensitivity 0..1** maps threshold ×2.0 (rugged, fewer false trips) → ×0.15 (trips on a light
  touch) — the UR‑style adjustable limit.
- Returns the residual per joint (published as **external torque**), the worst joint, and a margin.

### Where the measured torque comes from

- **Real hardware** (`apps/ecat_control_node.cpp`): the drives' **0x6077 actual‑torque** PDO (read
  every cycle, % of rated) → N·m via the rated torque, fed straight into the detector.
- **Simulation** (`apps/control_node.cpp`): the "measured" torque = model + friction (+ an optional
  injected test torque), so the sim is faithful and the detector can be exercised offline.

### Protective stop + recovery

On contact, in **both** control nodes: `want_enable = false` (drives disabled / hold),
`contact = 1`, `contact_joint = j` published in state. **Re‑enable** (or freedrive) clears the
contact stop — exactly like clearing a UR protective stop. If you re‑enable while still pushing on
the arm, it trips again (correct: the contact is still there). The self‑collision monitor and this
contact monitor are independent and both feed the same protective‑stop path.

## Using it (🖐 Contact panel in the viewer)

- **🖐 Contact** button opens the panel. **Detector ON/OFF** toggles it (turning it off leaves the
  hardware E‑STOP/STO in charge). **Sensitivity** slider: left = rugged (fewer false trips), right =
  sensitive (trips on a lighter touch).
- **External torque (N·m)** shows the live per‑joint model residual — near 0 in free motion, spikes
  on the contacted joint.
- On contact a red **"Physical contact — protective stop"** toast appears with a **Re‑enable**
  button.
- **Test (simulator only):** pick a joint and **Poke** to inject a fake external torque and confirm
  the protective stop fires. No effect on real hardware.

### Turning it off, and writing

- **Manual off:** the **Detector ON/OFF** button in the 🖐 Contact panel turns the whole function
  off (the hardware E‑STOP/STO still protects the arm). Protocol: `{"cmd":"set_contact","on":false}`.
- **Automatic during writing:** the marker pressing on the paper is an *expected* contact, which
  would otherwise trip the protective stop and abort the write. The writing runner therefore
  **pauses contact detection for the duration of the write and restores your setting when it
  finishes** (or is stopped / errors). You'll see "contact detection paused while writing" and
  "contact detection restored" in the log. No action needed — writing just works with the detector
  on. The same pattern can be applied to any program that intentionally touches a surface.

## Protocol

```json
{"cmd":"set_contact","on":true,"sensitivity":0.5}   // enable/disable + sensitivity 0..1
{"cmd":"contact_poke","joint":3}                     // SIM only: inject external torque to test
```
State broadcast adds: `"contact":0|1`, `"contact_joint":i`, `"ext_torque":[6]` (N·m residual).

shm: `CmdRegion.contact_sens/contact_on/contact_test`, `StateRegion.ext_torque[6]/contact/
contact_joint`, `CMD_SET_CONTACT=17`.

## Validation

Headless sim + full WebSocket path (`bin/control_node` + `ws_bridge`):

- **Baseline** free motion: residual ≈ 0 on all joints, no trip.
- **Poke J3** → residual spikes on J3, `contact=1`, `contact_joint=2`, drives disabled
  (protective stop fires within a few ms).
- Residual **decays** (EMA) after the impulse ends; **Re‑enable** clears the stop and stays
  enabled.
- **Detector OFF** → poke does not trip (monitor bypassed; hardware safety still independent).
- Broadcast carries `contact` / `contact_joint` / `ext_torque[6]`; UI toast + external‑torque
  readout driven from it.

## Tuning on the real arm

The friction constants (`fc`,`fv`) and base thresholds are coarse first estimates. On hardware,
record 0x6077 vs. the model over slow and fast free moves per joint, fit friction to null the
residual, then set `base` a margin above the residual noise floor. Raise `debounce`/`lp_res` if the
current signal is noisy; keep the velocity term so fast moves don't nuisance‑trip.
