// ToolsPage -- tool library (multi-TCP), payload, and the 4-point TCP teach wizard.
import { useEffect, useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

interface Tool { name: string; pos: number[]; quat: number[]; payload: number; cog: number[]; active?: boolean }

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [active, setActive] = useState<Tool | null>(null);
  const [edit, setEdit] = useState<Tool | null>(null);
  const [teach, setTeach] = useState<{ flanges: number[][]; rms?: number; offset?: number[] } | null>(null);
  const toast = useStore((s) => s.toast);
  const st = useStore((s) => s.state);

  const load = async () => {
    const r = await robot.cmd({ cmd: "tool_list" });
    setTools(r.tools || []);
    setActive(r.active || null);
  };
  useEffect(() => { load(); }, []);

  const select = async (name: string) => {
    const r = await robot.cmd({ cmd: "tool_select", name });
    if (r.type === "error") return toast("err", r.message);
    toast("ok", `Tool “${name}” active`);
    load();
  };
  const saveEdit = async () => {
    if (!edit) return;
    const r = await robot.cmd({
      cmd: "tool_save", name: edit.name, pos: edit.pos, quat: edit.quat,
      payload: edit.payload, cog: edit.cog,
    });
    if (r.type === "error") return toast("err", r.message);
    toast("ok", "Tool saved");
    setEdit(null);
    load();
  };
  const capture = () => {
    if (!st) return;
    const f = [...st.flange.pos, ...st.flange.quat];
    setTeach((t) => ({ flanges: [...(t?.flanges || []), f] }));
  };
  const solve = async (apply: boolean) => {
    if (!teach || teach.flanges.length < 4) return toast("warn", "Capture at least 4 poses (tip on the same fixed point)");
    const r = await robot.cmd({ cmd: "tcp_teach", flanges: teach.flanges, apply, name: active?.name || "tool" });
    if (!r.ok) return toast("err", "solve failed — poses too similar?");
    setTeach({ ...teach, rms: r.rms, offset: r.offset });
    if (apply) { toast("ok", `TCP applied (RMS ${(r.rms * 1000).toFixed(2)} mm)`); load(); }
  };
  const mm = (v: number[]) => v.map((x) => (x * 1000).toFixed(1)).join(", ");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
      <div className="panel">
        <div className="ph">Tool library
          <span className="grow" />
          <button className="btn sm" onClick={() => setEdit({ name: "new tool", pos: [0, 0, 0.1], quat: [1, 0, 0, 0], payload: 0, cog: [0, 0, 0.05] })}>+ New tool</button>
        </div>
        <div className="pb">
          <table className="tbl">
            <thead><tr><th>Name</th><th>Offset (mm)</th><th>Payload</th><th /></tr></thead>
            <tbody>
              {tools.map((t) => (
                <tr key={t.name}>
                  <td><b>{t.name}</b> {t.active && <span className="chip ok" style={{ marginLeft: 6, padding: "2px 8px" }}><span className="dot" />active</span>}</td>
                  <td className="mono">{mm(t.pos)}</td>
                  <td className="mono">{t.payload} kg</td>
                  <td className="row" style={{ gap: 4, justifyContent: "flex-end" }}>
                    {!t.active && <button className="btn sm" onClick={() => select(t.name)}>Activate</button>}
                    <button className="btn sm" onClick={() => setEdit({ ...t })}>Edit</button>
                  </td>
                </tr>
              ))}
              {!tools.length && <tr><td colSpan={4} className="dim">No tools defined — the bare flange is active.</td></tr>}
            </tbody>
          </table>
          {active && <p className="dim small" style={{ marginTop: 8 }}>Active TCP: <b>{active.name}</b> · offset {mm(active.pos)} mm · payload {active.payload} kg</p>}
        </div>
      </div>

      <div className="panel">
        <div className="ph">TCP teach — 4-point method</div>
        <div className="pb">
          <p className="muted small">Touch the SAME fixed point with the tool tip from different orientations (freedrive or jog), pressing <b>Capture</b> each time. 4+ poses solve the tool offset.</p>
          <div className="row" style={{ margin: "10px 0" }}>
            <button className="btn" onClick={capture}>⊕ Capture pose ({teach?.flanges.length || 0})</button>
            <button className="btn" onClick={() => setTeach(null)}>Reset</button>
            <span className="grow" />
            <button className="btn" onClick={() => solve(false)}>Solve</button>
            <button className="btn primary" onClick={() => solve(true)}>Solve & apply</button>
          </div>
          {teach?.offset && (
            <p className="small mono">offset = [{mm(teach.offset)}] mm · RMS {(1000 * (teach.rms || 0)).toFixed(2)} mm</p>
          )}
        </div>
      </div>

      {edit && (
        <div className="modal-bg" onClick={() => setEdit(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="mh">Edit tool</div>
            <div className="mb">
              <div className="field"><label>Name</label>
                <input className="in" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div className="grid2">
                {["x", "y", "z"].map((ax, i) => (
                  <div className="field" key={ax}><label>Offset {ax.toUpperCase()} (mm)</label>
                    <input className="in mono" value={edit.pos[i] * 1000}
                      onChange={(e) => { const pos = edit.pos.slice(); pos[i] = +e.target.value / 1000; setEdit({ ...edit, pos }); }} /></div>
                ))}
                <div className="field"><label>Payload (kg)</label>
                  <input className="in mono" value={edit.payload} onChange={(e) => setEdit({ ...edit, payload: +e.target.value })} /></div>
                {["x", "y", "z"].map((ax, i) => (
                  <div className="field" key={ax}><label>CoG {ax.toUpperCase()} (mm)</label>
                    <input className="in mono" value={edit.cog[i] * 1000}
                      onChange={(e) => { const cog = edit.cog.slice(); cog[i] = +e.target.value / 1000; setEdit({ ...edit, cog }); }} /></div>
                ))}
              </div>
              <p className="dim small">Orientation is set by TCP teach (orientation method) or kept as-is; payload + CoG feed gravity compensation and contact detection.</p>
            </div>
            <div className="mf">
              <button className="btn" onClick={() => setEdit(null)}>Cancel</button>
              <button className="btn primary" onClick={saveEdit}>Save tool</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
