import { useEffect, useRef, useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

const MODE_KIND: Record<string, string> = {
  IDLE: "ok", MOVING: "run", STOPPING: "warn", ESTOP: "err", DISABLED: "warn",
  HOLD: "warn", FREEDRIVE: "run",
};

export default function Header({ onLogin }: { onLogin: () => void }) {
  const s = useStore((st) => st.state);
  const connected = useStore((st) => st.connected);
  const user = useStore((st) => st.authUser);
  const [speed, setSpeed] = useState(100);
  const dragging = useRef(false);

  useEffect(() => {
    if (!dragging.current && s) setSpeed(s.speed_pct);
  }, [s?.speed_pct]);   // eslint-disable-line react-hooks/exhaustive-deps

  const mode = s?.mode ?? "OFFLINE";
  const kind = connected ? MODE_KIND[mode] || "" : "err";
  const zone = s?.safety.zone ?? 0;
  const enabled = !!s?.enabled;

  const applySpeed = (v: number) => {
    setSpeed(v);
    robot.cmd({ cmd: "set_speed", frac: v / 100 });
  };

  return (
    <header className="hdr">
      <div className="brand">
        <div className="logo">eR</div>
        <div>eRoBo Studio <small>· eRoBo 10</small></div>
      </div>
      <span className={`chip ${kind}`}><span className="dot" />{connected ? mode : "OFFLINE"}</span>
      {zone === 1 && <span className="chip warn"><span className="dot" />REDUCED ZONE</span>}
      {s?.program.running && <span className="chip run"><span className="dot" />PROGRAM: {s.program.name}</span>}
      <div className="grow" />
      <div className="speedbox" title="Global speed override (applies live to all motion)">
        <span className="dim small">SPEED</span>
        <input
          type="range" min={5} max={100} value={speed} style={{ width: 130 }}
          onMouseDown={() => { dragging.current = true; }}
          onMouseUp={() => { dragging.current = false; }}
          onTouchStart={() => { dragging.current = true; }}
          onTouchEnd={() => { dragging.current = false; }}
          onChange={(e) => applySpeed(+e.target.value)}
        />
        <b>{speed}%</b>
      </div>
      {enabled ? (
        <button className="btn" onClick={() => robot.cmd({ cmd: "disable" })}>Disable</button>
      ) : (
        <button className="btn good" onClick={() => robot.cmd({ cmd: "enable" })}>Enable</button>
      )}
      <button className="btn" onClick={onLogin}>{user ? `${user}` : "Log in"}</button>
      <button
        className="estop" title="Software emergency stop"
        onClick={() => robot.cmd({ cmd: "estop" })}
      >STOP</button>
    </header>
  );
}
