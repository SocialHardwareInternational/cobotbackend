// MovePage -- 3D twin + jog panel + move-to + freedrive (the daily-driver screen).
import { useRef, useState } from "react";
import Viewport3D from "../three/Viewport3D";
import { robot } from "../api/robot";
import { useStore } from "../store";

const JN = ["J1", "J2", "J3", "J4", "J5", "J6"];
const R2D = 180 / Math.PI;

function quatToRpy(q: number[]): [number, number, number] {
  const [w, x, y, z] = q;
  const roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
  const pitch = Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - z * x))));
  const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
  return [roll, pitch, yaw];
}

export default function MovePage() {
  const s = useStore((st) => st.state);
  const toast = useStore((st) => st.toast);
  const [tab, setTab] = useState<"jog" | "moveto">("jog");
  const [frame, setFrame] = useState<"joint" | "base" | "tool">("base");
  const [jogSpeed, setJogSpeed] = useState(0.35);
  const jogTimer = useRef<number | null>(null);

  // continuous jog: resend the velocity while pressed (bridge expires jogs at 250 ms)
  const startJog = (vel: number[], fr = frame) => {
    stopJog();
    const send = () => robot.fire({ cmd: "jog", frame: fr, vel, speed: jogSpeed });
    send();
    jogTimer.current = window.setInterval(send, 120);
  };
  const stopJog = () => {
    if (jogTimer.current) { clearInterval(jogTimer.current); jogTimer.current = null; }
    robot.fire({ cmd: "jog", frame, vel: [0, 0, 0, 0, 0, 0], speed: jogSpeed });
  };

  const jogJoint = (i: number, dir: number) => {
    const v = [0, 0, 0, 0, 0, 0];
    v[i] = dir * 0.6;
    startJog(v, "joint");
  };
  const cart = (axis: number, dir: number, rot = false) => {
    const v = [0, 0, 0, 0, 0, 0];
    v[rot ? 3 + axis : axis] = dir * (rot ? 0.5 : 0.12);
    startJog(v);
  };

  const [target, setTarget] = useState({ x: "", y: "", z: "", r: "", p: "", yw: "" });
  const fillCurrent = () => {
    if (!s) return;
    const [r, p, yw] = quatToRpy(s.tcp.quat);
    setTarget({
      x: (s.tcp.pos[0] * 1000).toFixed(1), y: (s.tcp.pos[1] * 1000).toFixed(1), z: (s.tcp.pos[2] * 1000).toFixed(1),
      r: (r * R2D).toFixed(1), p: (p * R2D).toFixed(1), yw: (yw * R2D).toFixed(1),
    });
  };
  const goTarget = async (lin: boolean) => {
    const pos = [+target.x / 1000, +target.y / 1000, +target.z / 1000];
    const rpy = [+target.r / R2D, +target.p / R2D, +target.yw / R2D];
    if (pos.some(isNaN) || rpy.some(isNaN)) return toast("warn", "Fill in all six target fields");
    const r = await robot.cmd({ cmd: lin ? "move_lin" : "move_ptp", pos, rpy, speed: 0.5 });
    if (!r.ok) toast("err", r.message || "Target unreachable");
  };

  const freedrive = s?.freedrive ?? false;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14, height: "100%" }}>
      <Viewport3D />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0, overflow: "auto" }}>
        <div className="panel">
          <div className="ph">
            Hand guiding
            <span className="grow" />
            <div className={`toggle ${freedrive ? "on" : ""}`} onClick={() => robot.cmd({ cmd: "freedrive", on: !freedrive })} />
          </div>
          {freedrive && <div className="pb small muted">Drives in zero-torque mode — guide the arm by hand. Toggle off to hold position.</div>}
        </div>

        <div className="panel grow" style={{ display: "flex", flexDirection: "column" }}>
          <div className="ph">
            <button className={`btn sm ${tab === "jog" ? "primary" : ""}`} onClick={() => setTab("jog")}>Jog</button>
            <button className={`btn sm ${tab === "moveto" ? "primary" : ""}`} onClick={() => setTab("moveto")}>Move to</button>
            <span className="grow" />
            {tab === "jog" && (
              <select className="in" style={{ width: 96, padding: "5px 8px" }} value={frame} onChange={(e) => setFrame(e.target.value as any)}>
                <option value="base">Base</option>
                <option value="tool">Tool</option>
              </select>
            )}
          </div>
          <div className="pb grow" style={{ overflow: "auto" }}>
            {tab === "jog" ? (
              <>
                <h3 className="sect">Cartesian — translate (mm)</h3>
                <div className="row" style={{ justifyContent: "space-around" }}>
                  {["X", "Y", "Z"].map((ax, i) => (
                    <div key={ax} style={{ textAlign: "center" }}>
                      <div className="dim small">{ax}</div>
                      <div className="row" style={{ gap: 6 }}>
                        <button className="jog2" onPointerDown={() => cart(i, -1)} onPointerUp={stopJog} onPointerLeave={stopJog}>−</button>
                        <button className="jog2" onPointerDown={() => cart(i, +1)} onPointerUp={stopJog} onPointerLeave={stopJog}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="sect">Cartesian — rotate</h3>
                <div className="row" style={{ justifyContent: "space-around" }}>
                  {["RX", "RY", "RZ"].map((ax, i) => (
                    <div key={ax} style={{ textAlign: "center" }}>
                      <div className="dim small">{ax}</div>
                      <div className="row" style={{ gap: 6 }}>
                        <button className="jog2" onPointerDown={() => cart(i, -1, true)} onPointerUp={stopJog} onPointerLeave={stopJog}>−</button>
                        <button className="jog2" onPointerDown={() => cart(i, +1, true)} onPointerUp={stopJog} onPointerLeave={stopJog}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="sect">Joints</h3>
                {JN.map((n, i) => (
                  <div className="jrow" key={n}>
                    <span className="jname">{n}</span>
                    <button className="jog2" onPointerDown={() => jogJoint(i, -1)} onPointerUp={stopJog} onPointerLeave={stopJog}>−</button>
                    <div className="grow">
                      <div className="bar"><i style={{ width: `${s ? ((s.q[i] + Math.PI) / (2 * Math.PI)) * 100 : 50}%` }} /></div>
                    </div>
                    <button className="jog2" onPointerDown={() => jogJoint(i, +1)} onPointerUp={stopJog} onPointerLeave={stopJog}>+</button>
                    <span className="jval">{s ? (s.q[i] * R2D).toFixed(1) : "—"}°</span>
                  </div>
                ))}
                <div className="row" style={{ marginTop: 10 }}>
                  <span className="dim small">Jog speed</span>
                  <input type="range" min={5} max={100} value={jogSpeed * 100} className="grow"
                    onChange={(e) => setJogSpeed(+e.target.value / 100)} />
                  <b className="mono small">{Math.round(jogSpeed * 100)}%</b>
                </div>
              </>
            ) : (
              <>
                <div className="grid2">
                  {(["x", "y", "z"] as const).map((k) => (
                    <div className="field" key={k}><label>{k.toUpperCase()} (mm)</label>
                      <input className="in mono" value={target[k]} onChange={(e) => setTarget({ ...target, [k]: e.target.value })} /></div>
                  ))}
                  {(["r", "p", "yw"] as const).map((k, i) => (
                    <div className="field" key={k}><label>{["Roll", "Pitch", "Yaw"][i]} (°)</label>
                      <input className="in mono" value={target[k]} onChange={(e) => setTarget({ ...target, [k]: e.target.value })} /></div>
                  ))}
                </div>
                <div className="row">
                  <button className="btn sm" onClick={fillCurrent}>Use current pose</button>
                  <span className="grow" />
                  <button className="btn primary" onClick={() => goTarget(false)}>MoveJ</button>
                  <button className="btn primary" onClick={() => goTarget(true)}>MoveL</button>
                </div>
              </>
            )}
          </div>
        </div>
        <button className="btn danger" style={{ padding: "12px" }} onClick={() => robot.cmd({ cmd: "stop" })}>
          STOP MOTION (Esc)
        </button>
      </div>
    </div>
  );
}
