// SafetyPage -- limits + safety planes + workspace bounds (admin gated by the controller).
import { useEffect, useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

interface Plane { mode: number; p: number[]; n: number[] }
interface Cfg {
  enabled: number; speed_override: number; tcp_speed_max: number; tcp_speed_reduced: number;
  tcp_force_max: number; elbow_speed_max: number; reach_max: number; z_min: number; z_max: number;
  base_cyl_r: number; planes: Plane[];
}

export default function SafetyPage() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [dirty, setDirty] = useState(false);
  const toast = useStore((s) => s.toast);
  const st = useStore((s) => s.state);

  const load = async () => {
    const r = await robot.cmd({ cmd: "get_safety" });
    if (r.config) { setCfg(r.config); setDirty(false); }
  };
  useEffect(() => { load(); }, []);

  const patch = (p: Partial<Cfg>) => { if (cfg) { setCfg({ ...cfg, ...p }); setDirty(true); } };
  const save = async () => {
    if (!cfg) return;
    const r = await robot.cmd({ cmd: "set_safety", config: cfg });
    if (r.config) { setCfg(r.config); setDirty(false); toast("ok", "Safety configuration applied and persisted"); }
    else toast("err", r.message || "failed");
  };
  const addPlaneFromTcp = (mode: number) => {
    if (!cfg || !st) return;
    // horizontal plane at the current TCP height, keep-above by default
    patch({ planes: [...cfg.planes, { mode, p: [0, 0, +st.tcp.pos[2].toFixed(4)], n: [0, 0, 1] }] });
  };
  const num = (v: number, big = false) => (Math.abs(v) > 1e8 ? (big ? "" : "") : String(v));

  if (!cfg) return <p className="dim">Loading safety configuration…</p>;
  const contactOn = true;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
      <div className="panel">
        <div className="ph">Speed & force limits
          <span className="grow" />
          <button className="btn sm primary" disabled={!dirty} onClick={save}>Apply</button>
        </div>
        <div className="pb">
          <div className="grid2">
            <div className="field"><label>TCP speed max (m/s)</label>
              <input className="in mono" value={cfg.tcp_speed_max} onChange={(e) => patch({ tcp_speed_max: +e.target.value })} /></div>
            <div className="field"><label>Reduced-zone speed (m/s)</label>
              <input className="in mono" value={cfg.tcp_speed_reduced} onChange={(e) => patch({ tcp_speed_reduced: +e.target.value })} /></div>
            <div className="field"><label>TCP force limit (N)</label>
              <input className="in mono" value={cfg.tcp_force_max} onChange={(e) => patch({ tcp_force_max: +e.target.value })} /></div>
            <div className="field"><label>Elbow speed max (m/s)</label>
              <input className="in mono" value={cfg.elbow_speed_max} onChange={(e) => patch({ elbow_speed_max: +e.target.value })} /></div>
          </div>
          <p className="dim small">Measured limits trip a protective stop with 15 % hysteresis; the planner limits commanded motion first. The hardware E-stop chain is independent of software.</p>
        </div>
      </div>

      <div className="panel">
        <div className="ph">Workspace bounds</div>
        <div className="pb grid2">
          <div className="field"><label>Max reach (m, 0 = off)</label>
            <input className="in mono" value={cfg.reach_max} onChange={(e) => patch({ reach_max: +e.target.value })} /></div>
          <div className="field"><label>Base keep-out radius (m)</label>
            <input className="in mono" value={cfg.base_cyl_r} onChange={(e) => patch({ base_cyl_r: +e.target.value })} /></div>
          <div className="field"><label>Floor z-min (m)</label>
            <input className="in mono" placeholder="off" value={num(cfg.z_min)} onChange={(e) => patch({ z_min: e.target.value === "" ? -1e9 : +e.target.value })} /></div>
          <div className="field"><label>Ceiling z-max (m)</label>
            <input className="in mono" placeholder="off" value={num(cfg.z_max, true)} onChange={(e) => patch({ z_max: e.target.value === "" ? 1e9 : +e.target.value })} /></div>
        </div>
      </div>

      <div className="panel" style={{ gridColumn: "1 / -1" }}>
        <div className="ph">Safety planes
          <span className="grow" />
          <button className="btn sm" onClick={() => addPlaneFromTcp(2)}>+ Reduced at TCP height</button>
          <button className="btn sm" onClick={() => addPlaneFromTcp(1)}>+ Forbidden at TCP height</button>
        </div>
        <div className="pb">
          <table className="tbl">
            <thead><tr><th>#</th><th>Mode</th><th>Point (m)</th><th>Normal (keep on + side)</th><th /></tr></thead>
            <tbody>
              {cfg.planes.map((pl, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <select className="in" style={{ width: 130 }} value={pl.mode}
                      onChange={(e) => { const planes = cfg.planes.slice(); planes[i] = { ...pl, mode: +e.target.value }; patch({ planes }); }}>
                      <option value={0}>Off</option><option value={1}>Forbidden</option><option value={2}>Reduced</option>
                    </select>
                  </td>
                  {(["p", "n"] as const).map((k) => (
                    <td key={k}>
                      <div className="row" style={{ gap: 4 }}>
                        {[0, 1, 2].map((a) => (
                          <input key={a} className="in mono" style={{ width: 76 }} value={pl[k][a]}
                            onChange={(e) => {
                              const planes = cfg.planes.slice();
                              const arr = pl[k].slice(); arr[a] = +e.target.value;
                              planes[i] = { ...pl, [k]: arr };
                              patch({ planes });
                            }} />
                        ))}
                      </div>
                    </td>
                  ))}
                  <td><button className="btn sm icon" onClick={() => patch({ planes: cfg.planes.filter((_, k) => k !== i) })}>✕</button></td>
                </tr>
              ))}
              {!cfg.planes.length && <tr><td colSpan={5} className="dim">No planes configured. Planes show in the 3-D view (red = forbidden, amber = reduced).</td></tr>}
            </tbody>
          </table>
          <p className="dim small" style={{ marginTop: 8 }}>
            Targets beyond a forbidden boundary are rejected before motion starts; running motion decelerates into the boundary.
            Applying safety changes requires an admin login for remote (REST) clients.
          </p>
        </div>
      </div>

      <div className="panel" style={{ gridColumn: "1 / -1" }}>
        <div className="ph">Contact & collision monitoring</div>
        <div className="pb row" style={{ gap: 22, flexWrap: "wrap" }}>
          <div>
            <div className="dim small">Contact detection (torque residual)</div>
            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn sm" onClick={() => robot.cmd({ cmd: "set_contact", on: 1, sensitivity: 0.5 })}>Enable</button>
              <button className="btn sm" onClick={() => robot.cmd({ cmd: "set_contact", on: 0 })}>Disable</button>
            </div>
          </div>
          <div>
            <div className="dim small">Self-collision monitor</div>
            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn sm" onClick={() => robot.cmd({ cmd: "set_collision", on: true })}>Enable</button>
              <button className="btn sm" onClick={() => robot.cmd({ cmd: "set_collision", on: false })}>Disable</button>
            </div>
          </div>
          <div className="grow" />
          <div>
            <div className="dim small">Live status</div>
            <div className="row" style={{ marginTop: 6, gap: 8 }}>
              <span className={`chip ${st?.safety.zone === 2 ? "err" : st?.safety.zone === 1 ? "warn" : "ok"}`}>
                <span className="dot" />zone: {["normal", "reduced", "forbidden"][st?.safety.zone ?? 0]}
              </span>
              <span className="chip"><span className="dot" />clearance {(st?.coll_dist ?? 0).toFixed(3)} m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
