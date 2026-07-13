// LogsPage -- controller event log (flight recorder) with level filtering.
import { useEffect, useState } from "react";
import { robot } from "../api/robot";

interface Ev { id: number; t: number; level: string; source: string; code: string; message: string }
const LV_COLOR: Record<string, string> = { alarm: "var(--err)", warn: "var(--warn)", info: "var(--text)", debug: "var(--text2)" };

export default function LogsPage() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [level, setLevel] = useState("");
  const [follow, setFollow] = useState(true);

  const load = async () => {
    try {
      const r = await robot.rest("GET", `/api/v1/events?limit=400${level ? `&level=${level}` : ""}`);
      setEvents(r.events || []);
    } catch { /* offline */ }
  };
  useEffect(() => {
    load();
    if (!follow) return;
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, [level, follow]);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="panel" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="ph">System log
        <span className="grow" />
        <select className="in" style={{ width: 140, padding: "5px 8px" }} value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All levels</option>
          <option value="info">Info +</option>
          <option value="warn">Warnings +</option>
          <option value="alarm">Alarms only</option>
        </select>
        <label className="row small dim" style={{ gap: 6 }}>
          <div className={`toggle ${follow ? "on" : ""}`} onClick={() => setFollow(!follow)} />Follow
        </label>
      </div>
      <div className="pb grow" style={{ overflow: "auto" }}>
        <table className="tbl">
          <thead><tr><th style={{ width: 165 }}>Time</th><th style={{ width: 70 }}>Level</th><th style={{ width: 90 }}>Source</th><th style={{ width: 170 }}>Code</th><th>Message</th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td className="mono dim">{new Date(e.t * 1000).toLocaleString()}</td>
                <td><b style={{ color: LV_COLOR[e.level] }}>{e.level.toUpperCase()}</b></td>
                <td className="dim">{e.source}</td>
                <td className="mono">{e.code}</td>
                <td>{e.message}</td>
              </tr>
            ))}
            {!events.length && <tr><td colSpan={5} className="dim">No events.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
