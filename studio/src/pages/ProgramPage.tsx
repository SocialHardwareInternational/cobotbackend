// ProgramPage -- production program editor + runner (list / steps / run console).
import { useEffect, useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

interface Wp { id: string; name: string }
interface Step { type: string; [k: string]: any }
interface Prog { id?: string; name: string; steps: Step[]; speed: number; loop: boolean; nsteps?: number; runs?: number }

const STEP_LABEL: Record<string, string> = {
  movej: "MoveJ", movel: "MoveL", movep: "MoveP", movec: "MoveC", wait: "Wait",
  wait_di: "Wait DI", set_do: "Set DO", set_ao: "Set AO", set_speed: "Speed",
  set_payload: "Payload", set_tcp: "Tool", comment: "Note", halt: "Halt",
};

function stepSummary(st: Step, wps: Wp[]): string {
  const wp = (id: string) => wps.find((w) => w.id === id)?.name || id;
  switch (st.type) {
    case "movej": case "movel": return st.wp ? `to ${wp(st.wp)}` : st.q ? "to joints" : "to pose";
    case "movep": return `${(st.wps || []).length} waypoints, blend ${((st.blend ?? 0.02) * 1000).toFixed(0)} mm`;
    case "movec": return `via ${wp(st.via)} → ${wp(st.end)}`;
    case "wait": return `${st.sec}s`;
    case "wait_di": return `DI${st.di} = ${st.value ?? 1}${st.timeout ? ` (max ${st.timeout}s)` : ""}`;
    case "set_do": return `DO${st.do} = ${st.value ?? 1}`;
    case "set_ao": return `AO${st.ao} = ${st.volts} V`;
    case "set_speed": return `${Math.round((st.frac ?? 1) * 100)}%`;
    case "set_payload": return `${st.kg} kg`;
    case "set_tcp": return st.tool;
    case "comment": return st.text || "";
    default: return "";
  }
}

export default function ProgramPage() {
  const toast = useStore((s) => s.toast);
  const st = useStore((s) => s.state);
  const events = useStore((s) => s.progEvents);
  const [progs, setProgs] = useState<Prog[]>([]);
  const [wps, setWps] = useState<Wp[]>([]);
  const [cur, setCur] = useState<Prog | null>(null);
  const [sel, setSel] = useState(-1);
  const [dirty, setDirty] = useState(false);

  const refresh = async () => {
    const [p, w] = await Promise.all([robot.cmd({ cmd: "prog_list" }), robot.cmd({ cmd: "wp_list" })]);
    setProgs(p.programs || []);
    setWps(w.waypoints || []);
  };
  useEffect(() => { refresh(); }, []);

  const openProg = async (id: string) => {
    const r = await robot.cmd({ cmd: "prog_get", id });
    setCur(r.program);
    setSel(-1);
    setDirty(false);
  };
  const newProg = () => { setCur({ name: "New program", steps: [], speed: 0.5, loop: false }); setDirty(true); };
  const save = async () => {
    if (!cur) return;
    const r = await robot.cmd({ cmd: "prog_save", program: cur });
    if (r.type === "error") return toast("err", r.message);
    toast("ok", "Program saved");
    setDirty(false);
    if (!cur.id && r.saved) setCur({ ...cur, id: r.saved });
    refresh();
  };
  const run = async () => {
    if (!cur?.id) return toast("warn", "Save the program first");
    if (dirty) await save();
    const r = await robot.cmd({ cmd: "prog_run", id: cur.id });
    if (r.event !== "accepted") toast("err", r.message || "could not start");
  };
  const stop = () => robot.cmd({ cmd: "program_stop" });

  const addStep = (type: string) => {
    if (!cur) return;
    const base: Step = { type };
    if (type === "wait") base.sec = 1;
    if (type === "wait_di") { base.di = 0; base.value = 1; base.timeout = 30; }
    if (type === "set_do") { base.do = 0; base.value = 1; }
    if (type === "set_ao") { base.ao = 0; base.volts = 0; }
    if (type === "set_speed") base.frac = 0.5;
    if (type === "set_payload") base.kg = 0;
    if (type === "movep") base.wps = [];
    setCur({ ...cur, steps: [...cur.steps, base] });
    setSel(cur.steps.length);
    setDirty(true);
  };
  const patchStep = (i: number, patch: Partial<Step>) => {
    if (!cur) return;
    const steps = cur.steps.slice();
    steps[i] = { ...steps[i], ...patch };
    setCur({ ...cur, steps });
    setDirty(true);
  };
  const moveStep = (i: number, d: number) => {
    if (!cur) return;
    const j = i + d;
    if (j < 0 || j >= cur.steps.length) return;
    const steps = cur.steps.slice();
    [steps[i], steps[j]] = [steps[j], steps[i]];
    setCur({ ...cur, steps });
    setSel(j);
    setDirty(true);
  };
  const delStep = (i: number) => {
    if (!cur) return;
    setCur({ ...cur, steps: cur.steps.filter((_, k) => k !== i) });
    setSel(-1);
    setDirty(true);
  };
  const teachHere = async () => {
    const name = prompt("Waypoint name", `P${wps.length + 1}`);
    if (!name) return;
    const r = await robot.cmd({ cmd: "wp_save", name });
    if (r.saved) { toast("ok", `Waypoint “${name}” taught`); refresh(); return r.saved; }
  };

  const activeStep = st?.program.running && st.program.id === cur?.id ? st.program.step : -1;
  const selStep = cur && sel >= 0 ? cur.steps[sel] : null;
  const wpOptions = wps.map((w) => <option key={w.id} value={w.id}>{w.name}</option>);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "230px 1fr 330px", gap: 14, height: "100%" }}>
      <div className="panel" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="ph">Programs <span className="grow" /><button className="btn sm" onClick={newProg}>New</button></div>
        <div className="pb grow" style={{ overflow: "auto" }}>
          {progs.map((p) => (
            <div key={p.id} className={`step ${cur?.id === p.id ? "sel" : ""}`} style={{ marginBottom: 6 }}
              onClick={() => openProg(p.id!)}>
              <div className="sname">
                <div>{p.name}</div>
                <div className="dim small">{p.nsteps} steps · {p.runs || 0} runs</div>
              </div>
            </div>
          ))}
          {!progs.length && <p className="dim small">No programs yet — create one, teach waypoints, add steps, run.</p>}
        </div>
      </div>

      <div className="panel" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="ph">
          {cur ? (
            <input className="in" style={{ width: 240, padding: "6px 9px" }} value={cur.name}
              onChange={(e) => { setCur({ ...cur, name: e.target.value }); setDirty(true); }} />
          ) : "Steps"}
          <span className="grow" />
          {cur && (
            <>
              <label className="row small dim" style={{ gap: 5 }}>
                <div className={`toggle ${cur.loop ? "on" : ""}`} onClick={() => { setCur({ ...cur, loop: !cur.loop }); setDirty(true); }} />
                Loop
              </label>
              <button className="btn sm" disabled={!dirty} onClick={save}>Save</button>
              {st?.program.running ? (
                <button className="btn sm danger" onClick={stop}>Stop</button>
              ) : (
                <button className="btn sm good" onClick={run}>▶ Run</button>
              )}
            </>
          )}
        </div>
        <div className="pb grow" style={{ overflow: "auto" }}>
          {!cur && <p className="dim">Select or create a program.</p>}
          {cur && (
            <div className="steps">
              {cur.steps.map((stp, i) => (
                <div key={i}
                  className={`step ${sel === i ? "sel" : ""} ${activeStep === i ? "active" : ""} ${activeStep > i ? "done" : ""}`}
                  onClick={() => setSel(i)}>
                  <span className="dim small mono">{i + 1}</span>
                  <span className="stype">{STEP_LABEL[stp.type] || stp.type}</span>
                  <span className="sname">{stp.name || stepSummary(stp, wps)}</span>
                  <button className="btn sm icon" onClick={(e) => { e.stopPropagation(); moveStep(i, -1); }}>↑</button>
                  <button className="btn sm icon" onClick={(e) => { e.stopPropagation(); moveStep(i, +1); }}>↓</button>
                  <button className="btn sm icon" onClick={(e) => { e.stopPropagation(); delStep(i); }}>✕</button>
                </div>
              ))}
              {!cur.steps.length && <p className="dim small">Empty program — add steps below.</p>}
              <div className="row" style={{ flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {Object.keys(STEP_LABEL).map((t) => (
                  <button key={t} className="btn sm" onClick={() => addStep(t)}>+ {STEP_LABEL[t]}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        <div className="panel">
          <div className="ph">Step parameters</div>
          <div className="pb">
            {!selStep && <p className="dim small">Select a step to edit its parameters.</p>}
            {selStep && (
              <>
                {["movej", "movel"].includes(selStep.type) && (
                  <>
                    <div className="field"><label>Waypoint</label>
                      <select className="in" value={selStep.wp || ""} onChange={(e) => patchStep(sel, { wp: e.target.value })}>
                        <option value="">— choose —</option>{wpOptions}
                      </select></div>
                    <button className="btn sm" onClick={async () => { const id = await teachHere(); if (id) patchStep(sel, { wp: id }); }}>
                      ⊕ Teach current pose as new waypoint
                    </button>
                  </>
                )}
                {selStep.type === "movec" && (
                  <>
                    <div className="field"><label>Via waypoint</label>
                      <select className="in" value={selStep.via || ""} onChange={(e) => patchStep(sel, { via: e.target.value })}>
                        <option value="">— choose —</option>{wpOptions}</select></div>
                    <div className="field"><label>End waypoint</label>
                      <select className="in" value={selStep.end || ""} onChange={(e) => patchStep(sel, { end: e.target.value })}>
                        <option value="">— choose —</option>{wpOptions}</select></div>
                  </>
                )}
                {selStep.type === "movep" && (
                  <>
                    <div className="field"><label>Waypoints (in order)</label>
                      {(selStep.wps || []).map((id: string, k: number) => (
                        <div className="row" key={k}>
                          <select className="in" value={id} onChange={(e) => {
                            const arr = selStep.wps.slice(); arr[k] = e.target.value; patchStep(sel, { wps: arr });
                          }}>{wpOptions}</select>
                          <button className="btn sm icon" onClick={() => patchStep(sel, { wps: selStep.wps.filter((_: any, q: number) => q !== k) })}>✕</button>
                        </div>
                      ))}
                      <button className="btn sm" onClick={() => patchStep(sel, { wps: [...(selStep.wps || []), wps[0]?.id || ""] })}>+ add waypoint</button>
                    </div>
                    <div className="field"><label>Blend radius (mm)</label>
                      <input className="in mono" value={(selStep.blend ?? 0.02) * 1000}
                        onChange={(e) => patchStep(sel, { blend: +e.target.value / 1000 })} /></div>
                    <div className="field"><label>Tool speed (mm/s)</label>
                      <input className="in mono" value={(selStep.tool_speed ?? 0.15) * 1000}
                        onChange={(e) => patchStep(sel, { tool_speed: +e.target.value / 1000 })} /></div>
                  </>
                )}
                {selStep.type === "wait" && (
                  <div className="field"><label>Seconds</label>
                    <input className="in mono" value={selStep.sec} onChange={(e) => patchStep(sel, { sec: +e.target.value })} /></div>
                )}
                {selStep.type === "wait_di" && (
                  <>
                    <div className="field"><label>Input DI</label>
                      <input className="in mono" value={selStep.di} onChange={(e) => patchStep(sel, { di: +e.target.value })} /></div>
                    <div className="field"><label>Wait for value</label>
                      <select className="in" value={selStep.value} onChange={(e) => patchStep(sel, { value: +e.target.value })}>
                        <option value={1}>HIGH (1)</option><option value={0}>LOW (0)</option></select></div>
                    <div className="field"><label>Timeout (s, 0 = forever)</label>
                      <input className="in mono" value={selStep.timeout ?? 0} onChange={(e) => patchStep(sel, { timeout: +e.target.value })} /></div>
                  </>
                )}
                {selStep.type === "set_do" && (
                  <>
                    <div className="field"><label>Output DO</label>
                      <input className="in mono" value={selStep.do} onChange={(e) => patchStep(sel, { do: +e.target.value })} /></div>
                    <div className="field"><label>Value</label>
                      <select className="in" value={selStep.value} onChange={(e) => patchStep(sel, { value: +e.target.value })}>
                        <option value={1}>HIGH (1)</option><option value={0}>LOW (0)</option></select></div>
                  </>
                )}
                {selStep.type === "set_ao" && (
                  <>
                    <div className="field"><label>Output AO</label>
                      <select className="in" value={selStep.ao} onChange={(e) => patchStep(sel, { ao: +e.target.value })}>
                        <option value={0}>AO0</option><option value={1}>AO1</option></select></div>
                    <div className="field"><label>Volts</label>
                      <input className="in mono" value={selStep.volts} onChange={(e) => patchStep(sel, { volts: +e.target.value })} /></div>
                  </>
                )}
                {selStep.type === "set_speed" && (
                  <div className="field"><label>Speed %</label>
                    <input className="in mono" value={Math.round((selStep.frac ?? 1) * 100)}
                      onChange={(e) => patchStep(sel, { frac: +e.target.value / 100 })} /></div>
                )}
                {selStep.type === "set_payload" && (
                  <div className="field"><label>Payload (kg)</label>
                    <input className="in mono" value={selStep.kg} onChange={(e) => patchStep(sel, { kg: +e.target.value })} /></div>
                )}
                {selStep.type === "set_tcp" && (
                  <div className="field"><label>Tool name</label>
                    <input className="in" value={selStep.tool || ""} onChange={(e) => patchStep(sel, { tool: e.target.value })} /></div>
                )}
                {selStep.type === "comment" && (
                  <div className="field"><label>Text</label>
                    <input className="in" value={selStep.text || ""} onChange={(e) => patchStep(sel, { text: e.target.value })} /></div>
                )}
                <div className="field"><label>Step label (optional)</label>
                  <input className="in" value={selStep.name || ""} onChange={(e) => patchStep(sel, { name: e.target.value })} /></div>
                {["movej", "movel", "movec"].includes(selStep.type) && (
                  <div className="field"><label>Speed override (0–1, blank = program)</label>
                    <input className="in mono" value={selStep.speed ?? ""} onChange={(e) => patchStep(sel, { speed: e.target.value === "" ? undefined : +e.target.value })} /></div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="panel grow" style={{ display: "flex", flexDirection: "column", minHeight: 120 }}>
          <div className="ph">Run console</div>
          <div className="pb grow mono small" style={{ overflow: "auto" }}>
            {events.slice(-40).map((e, i) => (
              <div key={i} style={{ color: e.event === "error" ? "var(--err)" : e.event === "done" ? "var(--ok)" : "var(--text1)" }}>
                {e.event}{e.name ? ` · ${e.name}` : ""}{e.message ? ` — ${e.message}` : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
