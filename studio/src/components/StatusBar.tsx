import { useStore } from "../store";

export default function StatusBar() {
  const s = useStore((st) => st.state);
  const connected = useStore((st) => st.connected);
  const host = useStore((st) => st.host);
  const p = s?.tcp.pos ?? [0, 0, 0];
  return (
    <footer className="statusbar">
      <span>{connected ? `● ${host}` : "○ disconnected"}</span>
      <span className="mono">TCP {p.map((v) => (v * 1000).toFixed(1)).join(" / ")} mm</span>
      <span className="mono">v {(s ? s.tcp_speed * 1000 : 0).toFixed(0)} mm/s</span>
      <span className="mono">F {(s?.ext_force ?? 0).toFixed(0)} N</span>
      <span className="grow" />
      <span className="mono">jitter {(s?.jitter_us ?? 0).toFixed(0)} µs</span>
      <span className="mono">overruns {s?.overruns ?? 0}</span>
      <span>eRoBo Controller v2</span>
    </footer>
  );
}
