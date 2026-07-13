# erobo10 — Actuator Hardware Reference (ZeroErr eRob, Manual V3.39)

Every joint of the erobo10 is a ZeroErr **eRob** all‑in‑one rotary actuator (servo driver +
dual absolute encoders + frameless torque motor + armature‑actuated friction brake + strain‑wave
gear, all in one housing). This file captures the hardware facts that matter for the motion
stack, mapped to the three models actually used, and flags where the manual confirms or
contradicts `erobo10_motion`.

## 0. Joint → actuator map

| Joint | Actuator | SWG size | Role |
|---|---|---|---|
| **J1** | eRob**142H** | 32 | base / shoulder yaw |
| **J2** | eRob**142H** | 32 | shoulder pitch |
| **J3** | eRob**110H** | 25 | elbow |
| **J4** | eRob**80H** | 17 | wrist 1 |
| **J5** | eRob**80H** | 17 | wrist 2 |
| **J6** | eRob**80H** | 17 | wrist 3 / flange |

Model code reads `eRob<OD><gear-series><gearRatio><form>-<brake><encoder>-<bore><comm><torqueSensor>`,
e.g. `eRob80H100I-BM-18ET`. **H** = High‑Torque SWG. **Positive rotation = CCW** facing the output
shaft (Manual Ch.4); hardware direction is fixed, only the command sign changes it (→ matches
`JOINT_SIGN` / `MOTOR_DIR` in `ecat_control_node.cpp`).

> ⚠️ **CONFIRM per joint (needed for exact torque/speed numbers):** the **gear ratio** (50/80/100/120/160),
> the **110H version** (Prior vs V6 — different mass/length), the **encoder type** (S / M / HS / HM —
> M/HM need the 3.6 V multi‑turn battery), and the **torque‑sensor variant** (…**T** = has the virtual
> torque sensor, …N = none). All should be the **E = EtherCAT** comm variant (the stack uses EtherCAT).

---

## 1. Torque & speed — per actuator, by gear ratio (Manual Table 2‑1, 12‑1)

All torques in **N·m**. "Max output speed" given as **RPM / °·s⁻¹ / counts·s⁻¹** (output, 19‑bit).
Four torque tiers matter: **Rated** (continuous @ 2000 RPM motor), **Avg‑load max** (permissible
average), **Peak start/stop** (inertial start/stop), **Momentary max** (impact, never exceed).

### eRob80H — J4, J5, J6  (motor 146 W, rated 3.1 k RPM)
| GR | Peak start/stop | Avg‑load max | **Rated (cont.)** | Momentary max | Max speed |
|----|----|----|----|----|----|
| 50  | 44 | 34 | 21 | 91  | 60 / 360 / 524288 |
| 80  | 56 | 35 | 29 | 113 | 37.5 / 225 / 327680 |
| 100 | 70 | 51 | 31 | 143 | 30 / 180 / 262144 |
| 120 | 70 | 51 | 31 | 112 | 25 / 150 / 218453 |

### eRob110H — J3  (motor 750 W Prior / 723 W V6, rated 3.0 k RPM)
| GR | Peak start/stop | Avg‑load max | **Rated (cont.)** | Momentary max | Max speed |
|----|----|----|----|----|----|
| 50  | 127 | 72  | 51 | 242 | 60 / 360 / 524288 |
| 80  | 178 | 113 | 82 | 332 | 37.5 / 225 / 327680 |
| 100 | 204 | 140 | 87 | 369 | 30 / 180 / 262144 |
| 120 | 217 | 140 | 87 | 395 | 25 / 150 / 218453 |
| 160 | 229 | 140 | 87 | 408 | 18.75 / 112.5 / 163840 |

### eRob142H — J1, J2  (motor 1000 W, rated **2.0 k RPM** → lower speeds)
| GR | Peak start/stop | Avg‑load max | **Rated (cont.)** | Momentary max | Max speed |
|----|----|----|----|----|----|
| 50  | 281 | 140 | 99  | 497 | 40 / 240 / 349525 |
| 80  | 395 | 217 | 153 | 738 | 25 / 150 / 218453 |
| 100 | 433 | 281 | 178 | 841 | 20 / 120 / 174763 |
| 120 | 459 | 281 | 178 | 892 | 16.7 / 100.2 / 145927 |
| 160 | 484 | 281 | 178 | 892 | 12.5 / 75 / 109227 |

**Speed conversions (Manual 12.2–12.4, resolution = 524288):**
`RPM = counts·s⁻¹ /524288 ×60` · `°·s⁻¹ = counts·s⁻¹ /524288 ×360` · `rad·s⁻¹ = counts·s⁻¹ /524288 ×2π`.
Output speed `n_o = n_motor /(mG+1)`. Recommended accel/decel time **≥ 0.3 s**.

---

## 2. Physical & inertia (Manual Table 2‑1/2‑2)

| Model | OD × Length (mm) | Total mass no‑brake / brake (kg) | Output‑side inertia (g·mm²) | Output mass (kg) | Input‑side inertia no/brake (g·mm²) |
|---|---|---|---|---|---|
| 80H | 80 × 84.2 | 1.19 / 1.25 | 150 085 | 0.25 | 67 408 / 70 637 |
| 110H (Prior) | 110 × 115.2 | 2.88 / 3.06 | 715 482 | 0.58 | 277 434 / 285 402 |
| 110H (V6) | 110 × 80.2 | 2.57 / 2.68 | 717 286 | 0.56 | 308 632 / 316 600 |
| 142H | 142 × 133.9 | 6.49 / 6.70 | 2 589 596 | 1.21 | 1 244 894 / 1 273 287 |

Hollow bore **18 mm**; **IP54**; brake = armature‑actuated friction.
Approx arm mass (3×142?/… here 2×142H + 1×110H + 3×80H, with brake): 2×6.70 + 3.06 + 3×1.25 ≈ **20.2 kg** of actuators alone.

---

## 3. Power (Manual Ch.3, Table 3‑1/3‑2)

- Nominal **48 V DC ± 10 %**. Bus OK **44–55 V**; >55 V → over‑voltage error; <44 V → under‑voltage error.
- **Absolute max 60 V** (>60 V damages the drive). Add a **1000 µF / 100 V** cap in parallel at power‑on to kill switch‑on overshoot.
- **Rated current @ 48 V:** 80H **3.4 A** · 110H **18.6 A** · 142H **26 A**. → arm aggregate ≈ **2×26 + 18.6 + 3×3.4 = 80.8 A** rated (~3.9 kW); peak much higher → **size the PSU and wiring accordingly** (Manual 6.1 recommends ≥1.5 mm² for the 142H feeds, direct wiring for 110H/142H).
- **Min input voltage (with brake):** 80H **24 V**, 110H **48 V**, 142H **48 V** (without brake 19.5 V). Below rated voltage, max speed scales `n_a = n_r × V_in/48`; **torque is unaffected**.
- **Regen / kinetic‑energy recovery (Ch.8):** hard deceleration turns the motor into a generator and pushes bus voltage up → over‑voltage trip, especially on the heavy 142H joints. The jerk‑limited planner mitigates this; for aggressive moves add a bleeder resistor / super‑cap / battery.

---

## 4. Encoders & position (Manual Ch.9, 12)

- **Motor encoder 17‑bit** (single‑turn), **output encoder 19‑bit** single‑turn = **524288 counts/rev**, value range **0…524287**. Multi‑turn (M/HM) adds **16‑bit** turn count, needs the **3.6 V battery**.
- Position object **0x6064** = `N × 524288 + Ps` (output‑side counts). `angle° = 0x6064 /524288 × 360`.
- Default zero position = **262144** (middle of range). Single‑turn calibrated range ≈ **−175°…+175°** about 262144.
- **Software position limit 0x607D**: `:01h` lower, `:02h` upper; commit with save command **0x65766173** ("save").

> 🔧 **Code reconcile — `ENCODER_RES`:** `ecat_control_node.cpp` uses `524287.0`; the manual's
> resolution is **524288** (2¹⁹). Off by one count (~0.0002 %) — harmless for motion but use **524288**
> to be exact (it's what the angle/speed formulas use).

---

## 5. Brake (Manual Ch.7) — and an e‑stop safety issue

- No separate supply; the brake runs off the DC bus. It's a **static holding brake**.
- **Enable releases the brake; disable engages it.** Brake actuation ≈ **150 ms**. Min enable↔disable interval **300 ms**. **After enabling, wait ≥ 500 ms before sending motion** (Manual 7.1.7).
- Dynamic braking only OK under **<10 % torque and <10 % speed**; avoid frequent dynamic braking.
- ⚠️ **A fault/error/e‑stop at high speed + heavy load can engage the brake and irreversibly damage the eRob** (Manual 7.1.4). The brake is *not* a high‑speed stop.
- Forcible release while **disabled** (manual positioning): SDO **0x4602 = 1** (release) / `0` (close), or the CAN/CANopen brake messages (Manual 7.3). With the brake released and no enable, **gravity will drop the load — support it.**
- Static friction torque at SWG **output** (N·m): 80H GR50/80/100/120 = >62/>75/>89/>89 · 110H GR50…160 = >127/>195/>206/>246/>246 · 142H GR50…160 = >281/>395/>433/>497/>497.

> 🚨 **Code reconcile — software e‑stop:** in `ecat_control_node.cpp` the estop path writes
> `target_velocity=0` **+ brake‑apply** + shutdown in one cycle. Per 7.1.4 that risks slamming the
> brake at speed/load. **Recommend:** software e‑stop should command a fast controlled **decel to 0
> first**, then apply the brake; reserve true emergency cut to the **hardware STO** (Ch.21), which
> drops motor power independently while the drive stays powered.

---

## 6. EtherCAT / CiA‑402 control interface (objects the stack uses)

Standard **CiA‑402 over EtherCAT (CoE)**. Object dictionary entries relevant to `ecat_control_node`:

| Object | Dir | Meaning | Used by us |
|---|---|---|---|
| **0x6040** | Rx | Controlword (state machine) | enable/fault‑reset sequence |
| **0x6041** | Tx | Statusword (state) | state decode (`& 0x6F`) |
| **0x6060** | Rx | **Modes of operation** | 9=CSV normal, **10/0x0A=CST** freedrive (switched by SDO) |
| **0x6061** | Tx | Modes of operation display | (optional readback) |
| **0x6064** | Tx | Position actual (output counts) | joint angle |
| **0x606C** | Tx | Velocity actual (counts/s) | joint velocity |
| **0x6071** | Rx | **Target torque** (‰ of rated) | set **0** in CST → zero‑torque freedrive |
| **0x6075** | – | Rated current (mA) | scales 0x6078 |
| **0x6077** | Tx | Torque actual value | torque readout |
| **0x6078** | Tx | Motor actual current (INT16, ‰ of rated) | `I = 0x6078 × 0x6075 /1000` |
| **0x607A** | Rx | Target position | (PP/CSP modes) |
| **0x607D** | – | Software position limit (01h/02h) | per‑joint travel limits |
| **0x6084** | – | Profile deceleration | limit‑stop ramp |
| **0x60B2** | Rx | **Torque offset (feed‑forward)** | gravity/friction comp for *smooth* freedrive |
| **0x60FE** | Rx | Digital outputs (**brake bit**) | brake release/apply |
| **0x60FF** | Rx | Target velocity | CSV servo command |
| **0x603F** | Tx | Error code | fault reporting |
| **0x2241** | Tx | Dual‑encoder difference Δθ (17‑bit) | torsion (T‑models) |
| **0x3B69** | Tx | **Calculated torque** (mNm) | real joint torque (T‑models) |
| **0x4602** | SDO | Release brake (1/0) | disabled‑state manual release |

**Modes of operation 0x6060 (Manual Table 9‑1):** `0x01` Profile Position · `0x04` Profile Torque ·
`0x08` Cyclic‑Sync Position (CSP) · **`0x0A` Cyclic‑Sync Torque (CST)**. The stack additionally uses
**`0x09` Cyclic‑Sync Velocity (CSV)** for normal motion — standard CiA‑402 but *not enumerated in this
manual's tables* (it's in the separate **eRob CANopen & EtherCAT User Manual**); confirm it there.

**PDO mapping (Manual 16.1):** `0x1600` Rx / `0x1A00` Tx are freely mappable (≤ 80 bytes). ⚠️ **An
8‑bit object (0x6060 / 0x6061) mapped into a PDO needs an empty 8‑bit pad to align to 16 bits.**

> ✅ **Code reconcile — freedrive mode switch:** our freedrive flips `0x6060` between CSV(9) and
> CST(10) **via SDO**, leaving the PDO map untouched. The manual's PDO‑pad rule above is exactly why
> SDO is the safer choice — no re‑mapping/alignment risk to the proven motion PDOs. (If you ever want
> a real‑time PDO‑mapped mode switch, add the pad byte alongside 0x6060.)

**Position‑limit behaviour by mode (Table 9‑1) — matters for freedrive:**
- **CSP (0x08):** at the software limit, decelerate, stop, **hold position torque**, accept only targets inside the range.
- **CST (0x0A):** at the limit, **cut motor power (brake stays off)**, current & torque → 0, **joint stays enabled and may drift under gravity/inertia**; only torque commands pushing *back into range* are executed. → In freedrive at a joint limit the arm goes slack (no holding), so **support it near limits**.

### 6.1 Live telemetry the node publishes (added per `Feedback.cpp`)

`ecat_control_node` reads one set per joint and writes it to `StateRegion`; it then flows through the
bridge `state` JSON to the **📊 Telemetry** panel in both UIs. Everything except torque is read **off
the real‑time path** (async SDO, polled ~2 Hz) so the 1 kHz servo loop is never stalled:

| Quantity | Object | Type | Scaling → unit | Path |
|---|---|---|---|---|
| Temperature | **0x22A2**:00 | UINT16 | **× 1 → °C** (whole degrees on this firmware; ×0.1 from `Feedback.cpp` read 10× low) | async SDO |
| Current | **0x6078**:00 | INT16 | × 0.001 → A | async SDO |
| Voltage (DC link) | **0x6079**:00 | UINT32 | × 0.001 → V | async SDO |
| Torque (measured) | **0x6077**:00 | INT16 | × 0.1 → % of rated | **TxPDO** (cyclic) |
| Brake released | **0x4602**:00 | UINT8 | 1 = released, 0 = held | async SDO |

shm fields: `st.temp / st.current / st.voltage / st.torque_meas / st.brake` (6 each); Python mirror and
the `StateRegion`=496 / `ShmBlock`=1864 byte sizes are updated to match. The current/torque scalings
follow the provided `Feedback.cpp`; if your firmware reports 0x6078 as ‰‑of‑rated rather than mA,
switch to `× 0x6075 / 1000` (rated current). The estimated inverse‑dynamics `st.torque[Nm]` (and the
`torque_util` HUD) are unchanged and independent of this measured readout.

---

## 7. Freedrive / back‑driving — the manual confirms our method (Manual Ch.28)

Manual Chapter 28 "Instructions for Back‑Driving eRob by External Force" lists four methods, in
increasing smoothness — and #2 is **exactly** what `ecat_control_node` now does:

1. **Disabled + brake released:** rotatable, but residual friction + motor back‑EMF drag remain
   (drag rises with speed); needs a lever arm. (= the old/weaker idea.)
2. **CST (or PT) mode, target torque `0x6071 = 0`, then ENABLE:** *"the external force required to
   rotate the actuator… is smaller than releasing the brake alone."* ✅ **This is our freedrive.**
3. **Compensate friction + load gravity:** identify them (drag‑teach), then push **torque feed‑forward
   `0x60B2`** to cancel them → near‑weightless guiding.
4. **Closed loop:** use the **virtual torque sensor** (Ch.22, `0x3B69`) as force feedback, controller
   processes it, drives `0x60B2`. → true admittance/zero‑force guiding.

> ✅ **Validates** the CST + zero‑torque + enable + brake‑released freedrive we built.
> 🔭 **Smoothness roadmap:** to remove gravity sag (the one caveat of zero‑torque freedrive), add
> **0x60B2 torque feed‑forward = RNEA gravity torque** (we already compute it in `dynamics.hpp`!),
> i.e. method #3. If the actuators are the **…T** variant, `0x3B69` gives real joint torque for
> method #4 — and could also replace/validate the estimated `torque[]` we publish today.

---

## 8. Mechanical limits — bearings, moment, ratcheting, rigidity, life

**Cross‑roller bearing (Table 17‑2):**
| Model | Pitch dia d_p (m) | Offset R (m) | Dyn load C (N) | Static C₀ (N) | **Permissible moment M_c (N·m)** |
|---|---|---|---|---|---|
| 80H | 0.060 | 0.0239 | 10 400 | 16 300 | **124** |
| 110H | 0.085 | 0.0296 | 21 800 | 35 800 | **258** |
| 142H | 0.111 | 0.0364 | 38 200 | 65 400 | **580** |
Moment load `M_max = F_r,max(L_r+R) + F_a,max·L_a` must stay **≤ M_c**. Bearing L10 life and static
safety factor f_s = C₀/P₀ per Manual 17.2–17.3 (f_s ≥ 1.5 normal, ≥ 2 with shock, ≥ 3 for precision).
**No external bearings** — the integrated cross‑roller takes radial+axial+moment.

**Ratcheting torque (Table 17‑4, N·m — exceeding this skips SWG teeth and *destroys* the gear):**
80H GR50/80/100/120 = 150/200/160/120 · 110H = 450/680/500/470 · 142H = 980/1400/1000/980.

**Rigidity / spring constant (Table 27‑1, ×10⁴ N·m/rad):** GR50 → K1/K2/K3: 80H 0.81/1.1/1.3 · 110H
2.5/3.4/4.4 · 142H 5.4/7.8/9.8. GR≥80 → 80H 1.0/1.4/1.6 · 110H 3.1/5.0/5.7 · 142H 6.7/11/12. (Used to
estimate joint torsion under load → output‑side compliance; affects positioning under heavy payload.)

**Hysteresis loss** ≈ 2 arcmin (GR50) / 1 arcmin (GR>50). **Backlash** essentially from structural
clearance (SWG tooth backlash ~0). **Life (Table 23‑1):** eRob…H **L10 = 10 000 h**, L50 = 50 000 h
at rated speed+torque (scales with `(T_r/T_avg)³ × (n_t/n_avg)`).

---

## 9. Torque ↔ current (Manual 25.2)

- eRob **module** torque constant: `K_T,eRob = K_T,motor × mG × η_t`, transmission efficiency
  **η_t ≈ 50–70 %**. Output torque `T_out = K_T,eRob × I_a,motor`.
- Motor current via **0x6078** (‰ of rated current 0x6075): `I_motor = 0x6078 × 0x6075 /1000` (A).
- Relationship is **non‑linear** (friction, temperature, churning ∝ speed²): colder + faster + heavier ⇒ more current. Treat published torque/current curves (Manual 25.1/25.4) as guidance.

---

## 10. Environment, STO, maintenance (Manual 0.5, 21, 7)

- IP54; operating **0–60 °C** (extreme −40–70 °C, currents rise when cold); storage −30–60 °C; humidity 20–80 % RH non‑condensing. Surface can exceed **85 °C** — burn risk. Don't run unmounted/suspended for long (no heat sink → thermal trip).
- **STO (Safe Torque Off, Ch.21):** hardware safety stop — cuts motor power and engages the brake while the drive stays powered. 1 branch (STOA) or 2 (STOA+STOB). **This is the correct emergency stop**, independent of software.
- Grease is sealed and **not** user‑serviceable. Brakes rated >100 000 engage cycles, >1000 forced‑drag cycles.

---

## 11. Errors most relevant to the control loop (Manual 26, App.B)

- **0x8400 (33792) Velocity error over limit** — often: commanded speed/accel > Table 12‑1 max, or "Max Motor Speed" set too low in eTuner, or load over the avg‑torque limit.
- **Motor stalling** — output over max torque, mechanical interference, or over the permissible load.
- Battery (M/HM only): **0x730D** warning (<3.15 V), **0x730F** too‑low (<3.05 V), **0x7314** power‑off detected, **0x7374** multi‑turn position error → reset load encoder.
- Over/under‑voltage: bus outside 44–55 V (or your configured Safe‑Power band).

---

## 12. Status / action items for `erobo10_motion`

Confirmed gear ratios: **J1,J2 = 142H120 · J3 = 110H120 · J4,J5,J6 = 80H100.**

- ✅ **`ENCODER_RES` → 524288** (was 524287) — exact counts↔rad.
- ✅ **Per‑joint torque ceilings** set to the eRob **avg‑load max** for these gear ratios:
  `jointEffortMax = JOINT_EFFORT = {281, 281, 140, 51, 51, 51}` N·m (was `{140,110,110,107,87,57}`,
  whose 80H wrist values were *above* the 80H peak of 70 N·m). Rated/peak/momentary tiers in §1.
- ✅ **Per‑joint velocity ceilings** = ~90 % of the actuator max output speed:
  `jointVelMax = {1.57, 1.57, 2.35, 2.80, 2.80, 2.80}` rad/s, and the servo clamps target velocity to
  the hard counts/s ceiling `JOINT_VMAX_C = {145927,145927,218453,262144,262144,262144}`.
- ✅ **Accurate speed control** — the servo now does **velocity feed‑forward (planner `qd_cmd`) +
  position correction** in CSV, instead of a pure‑P law capped at ~0.12 rad/s. Verified on the drive
  sim: commanded vs actual = **100 %** at 0.3 / 0.8 / 1.5 rad/s, zero hold drift.
- ⬜ **E‑stop (recommended):** decel‑to‑zero then brake in software; reserve hard cut to **hardware STO**
  (don't brake at speed/load → irreversible damage, §5). *Not yet applied.*
- ⬜ **Enable sequencing (recommended):** after `enable` wait **≥ 500 ms** before motion; keep
  enable/disable ≥ 300 ms apart. *Not yet enforced in code.*
- 🔭 **Freedrive smoothness (optional):** add **0x60B2 = RNEA gravity torque** feed‑forward (§7) to
  cancel sag — we already compute that torque in `dynamics.hpp`.
- ⬜ **Still confirm:** 110H version (Prior/V6), encoder type (S/M/HS/HM), torque‑sensor variant (…T).

*Refs: ZeroErr eRob Rotary Actuator User Manual V3.39 (2024‑12‑04). Many control details (full object
dictionary, CSV mode, state‑machine timing) live in the companion **eRob CANopen and EtherCAT User
Manual**, referenced throughout.*
