// DiagPage -- per-joint health, RT health, alarms (the maintenance dashboard).
import { useEffect, useRef, useState } from "react";
import { robot } from "../api/robot";
import { useStore, liveState } from "../store";

const JN = ["J1", "J2", "J3", "J4", "J5", "J6"];
const EFFORT = [281, 281, 140, 51, 51, 51];

function Spark({ get, color = "var(--accent)" }: { get: () => number; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const buf: number[] = [];
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 100) return;
      last = t;
      buf.push(get());
      if (buf.length > 120) buf.shift();
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const max = Math.max(1e-9, ...buf.map(Math.abs));
      ctx.strokeStyle = getComputedStyle(cv).getPropertyValue("color") || "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      buf.forEach((v, i) => {
        const x = (i / 119) * w;
        const y = h - ((v / max) * 0.5 + 0.5) * h;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.stroke();
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [get]);
  return <canvas ref={ref} width={220} height={40} style={{ width: "100%", height: 40, color } as any} />;
}

export default function DiagPage() {
  const s = useStore((st) => st.state);
  const [alarms, setAlarms] = useState<{ code: string; count: number }[]>([]);
  useEffect(() => {
    robot.rest("GET", "/api/v1/metrics").then((m) => setAlarms(m.alarms_24h || [])).catch(() => undefined);
  }, []);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {JN.map((n, i) => {
          const util = s ? Math.abs(s.torque[i]) / EFFORT[i] : 0;
          const temp = s?.temp[i] ?? 0;
          return (
            <div className="panel" key={n}>
              <div className="ph">{n}
                <span className="grow" />
                <span className={`chip ${s?.joint_op?.[i] === false ? "err" : "ok"}`} style={{ padding: "3px 9px" }}>
                  <span className="dot" />{s?.joint_op?.[i] === false ? "FAULT" : "OK"}
                </span>
              </div>
              <div className="pb">
                <div className="jrow"><span className="jname dim">pos</span>
                  <span className="grow mono small">{s ? (s.q[i] * 57.2958).toFixed(2) : "—"}°</span>
                  <span className="jname dim">vel</span>
                  <span className="mono small">{s ? (s.qd[i] * 57.2958).toFixed(1) : "—"}°/s</span></div>
                <div className="jrow"><span className="jname dim">τ</span>
                  <div className={`grow bar ${util > 0.85 ? "err" : util > 0.6 ? "warn" : ""}`}><i style={{ width: `${Math.min(100, util * 100)}%` }} /></div>
                  <span className="jval">{s ? s.torque[i].toFixed(1) : "—"} Nm</span></div>
                <div className="jrow"><span className="jname dim">°C</span>
                  <div className={`grow bar ${temp > 70 ? "err" : temp > 55 ? "warn" : ""}`}><i style={{ width: `${Math.min(100, (temp / 85) * 100)}%` }} /></div>
                  <span className="jval">{temp.toFixed(0)} °C</span></div>
                <div className="jrow"><span className="jname dim">A</span>
                  <span className="grow mono small">{s ? s.current[i].toFixed(2) : "—"} A</span>
                  <span className="jname dim">V</span>
                  <span className="mono small">{s ? s.voltage[i].toFixed(0) : "—"} V</span>
                  <span className="jname dim">brk</span>
                  <span className={`led ${s?.brake[i] ? "on" : ""}`} title="brake released" /></div>
                <Spark get={() => liveState.s?.torque[i] ?? 0} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
        <div className="panel">
          <div className="ph">Real-time health</div>
          <div className="pb small">
            <div className="jrow"><span className="grow dim">Control-loop jitter (1 s max)</span><b className="mono">{s?.jitter_us.toFixed(0)} µs</b></div>
            <div className="jrow"><span className="grow dim">Cycle overruns since boot</span><b className="mono">{s?.overruns}</b></div>
            <div className="jrow"><span className="grow dim">Manipulability</span><b className="mono">{s?.manip.toFixed(4)}</b></div>
            <div className="jrow"><span className="grow dim">Self-collision clearance</span><b className="mono">{s?.coll_dist.toFixed(3)} m</b></div>
          </div>
        </div>
        <div className="panel">
          <div className="ph">TCP</div>
          <div className="pb small">
            <div className="jrow"><span className="grow dim">Speed</span><b className="mono">{((s?.tcp_speed ?? 0) * 1000).toFixed(0)} mm/s</b></div>
            <div className="jrow"><span className="grow dim">Elbow speed</span><b className="mono">{((s?.elbow_speed ?? 0) * 1000).toFixed(0)} mm/s</b></div>
            <div className="jrow"><span className="grow dim">External force estimate</span><b className="mono">{(s?.ext_force ?? 0).toFixed(1)} N</b></div>
            <div className="jrow"><span className="grow dim">Torque utilisation</span><b className="mono">{Math.round((s?.torque_util ?? 0) * 100)} %</b></div>
          </div>
        </div>
        <div className="panel">
          <div className="ph">Alarms (24 h)</div>
          <div className="pb small">
            {alarms.length ? alarms.map((a) => (
              <div className="jrow" key={a.code}><span className="grow mono">{a.code}</span><b>{a.count}</b></div>
            )) : <p className="dim">No alarms in the last 24 hours.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
