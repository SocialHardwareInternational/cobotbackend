// IoPage -- digital & analog I/O monitor + control, with the Modbus map reference.
import { useEffect, useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

interface Io { do_state: number; do_cmd: number; di: number; ao: number[]; ai: number[] }

export default function IoPage() {
  const [io, setIo] = useState<Io | null>(null);
  const toast = useStore((s) => s.toast);

  const refresh = async () => {
    const r = await robot.cmd({ cmd: "io_get" });
    if (r.io) setIo(r.io);
  };
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 500);
    return () => clearInterval(t);
  }, []);

  const setDo = async (i: number, v: boolean) => {
    await robot.cmd({ cmd: "io_set", do: i, value: v ? 1 : 0 });
    refresh();
  };
  const forceDi = async (i: number, v: boolean) => {
    await robot.cmd({ cmd: "di_force", di: i, value: v ? 1 : 0 });
    refresh();
    toast("warn", `DI${i} forced ${v ? "HIGH" : "LOW"} (controller-level input)`);
  };
  const setAo = async (i: number, volts: number) => {
    await robot.cmd({ cmd: "io_set", ao: i, volts });
    refresh();
  };

  const bit = (word: number, i: number) => ((word >> i) & 1) === 1;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
      <div className="panel">
        <div className="ph">Digital outputs</div>
        <div className="pb io-grid">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="io-cell">
              <span className={`led ${io && bit(io.do_state, i) ? "on" : ""}`} />
              <span className="grow mono">DO{i}</span>
              <div className={`toggle ${io && bit(io.do_cmd, i) ? "on" : ""}`} onClick={() => io && setDo(i, !bit(io.do_cmd, i))} />
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="ph">Digital inputs <span className="dim small">(tap to force — PLC handshake / simulation)</span></div>
        <div className="pb io-grid">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="io-cell" style={{ cursor: "pointer" }} onClick={() => io && forceDi(i, !bit(io.di, i))}>
              <span className={`led ${io && bit(io.di, i) ? "on" : ""}`} />
              <span className="grow mono">DI{i}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="ph">Analog</div>
        <div className="pb">
          {[0, 1].map((i) => (
            <div className="jrow" key={i}>
              <span className="jname">AO{i}</span>
              <input type="range" min={0} max={10} step={0.1} className="grow"
                value={io?.ao[i] ?? 0} onChange={(e) => setAo(i, +e.target.value)} />
              <span className="jval">{(io?.ao[i] ?? 0).toFixed(1)} V</span>
            </div>
          ))}
          {[0, 1].map((i) => (
            <div className="jrow" key={i}>
              <span className="jname">AI{i}</span>
              <div className="grow bar"><i style={{ width: `${((io?.ai[i] ?? 0) / 10) * 100}%` }} /></div>
              <span className="jval">{(io?.ai[i] ?? 0).toFixed(2)} V</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="ph">Fieldbus map (Modbus TCP · port 1502)</div>
        <div className="pb small muted" style={{ lineHeight: 1.7 }}>
          Coils 0–15 = DO · Discrete inputs 0–15 = DI.<br />
          Input regs: 0 mode · 1 enabled · 2 e-stop · 3 moving · 5 speed % · 7 safety code ·
          9 program running · 16–21 q [mrad] · 28–30 TCP xyz [0.1 mm] · 40 TCP speed [mm/s].<br />
          Holding regs: 0 speed ×1000 · 1 command (1 start prog #reg2 · 2 stop · 3 enable ·
          4 disable · 5 reset · 6 E-STOP) · 2 program number.<br />
          Full map: <span className="mono">docs/INTEGRATION_API.md</span>
        </div>
      </div>
    </div>
  );
}
