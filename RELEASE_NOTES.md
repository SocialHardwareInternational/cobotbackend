# eRoBo Platform 2.0 — Release Notes

The platform grew from a motion stack into a complete, deployable cobot product.

**Safety** — configurable safety system (planes, zones, workspace bounds, TCP/elbow
speed + force limits) enforced twice: planner-side limiting and a 1 kHz measured-state
monitor with latched protective stops; live global speed override; edge-safe e-stop
protocol; per-cycle setpoint clamp; alarm flight-recorder.

**Controller** — new production service `erobo_controld`: WebSocket + REST APIs,
program store & typed-step executor (motion, I/O, tool, speed, payload steps; loops,
cycle counters), tool library with active-TCP switching, users/roles/sessions,
settings, SQLite event log, metrics, backup/restore, Modbus TCP slave for PLCs,
opt-in MQTT publisher, and it serves the Studio web UI.

**eRoBo Studio** — new Electron + React + TypeScript application replacing the HTML
tools: live 3-D digital twin (real STL meshes, TCP trace, safety-plane rendering,
ghost preview rig), jog + hand-guiding + move-to, full program editor with live step
tracking, I/O panel, safety configuration, tool/TCP teach wizard, per-joint health
dashboards with sparklines, system log viewer, dark/light themes, touch-friendly
industrial design. Same build runs as the desktop app and as the on-robot pendant UI.

**Deployment** — installer, systemd services (RT-scheduled), safe updater with
auto-backup, Docker simulator image, refreshed run scripts.

**Reliability** — drive-dropout root causes fixed: CiA-402 fault reset now generates
a true rising edge (a constant reset word could never clear a re-latched fault);
transient drive faults auto-recover with a strike budget instead of silently disabling
the arm; EtherCAT link supervision with automatic staged re-initialisation; published
`enabled` reflects functional availability so the planner always cancels motion during
recovery and never replays stale trajectories.

**Verification** — new safety unit suite and a 40+ check full-stack integration test
(state machine, motion accuracy, override, zones, I/O, programs, auth, Modbus,
events, backup). Two latent defects found and fixed by the new tests: a torn-read
setpoint jump in the planner idle path, and lost e-stop/reset edges under back-to-back
commands.
