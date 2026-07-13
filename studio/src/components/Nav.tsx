import { PageId, useStore } from "../store";

const items: { id: PageId; label: string; d: string }[] = [
  { id: "move", label: "Move", d: "M12 2v6m0 8v6M2 12h6m8 0h6" },
  { id: "program", label: "Program", d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  { id: "io", label: "I/O", d: "M7 7h.01M7 12h.01M7 17h.01M12 7h5M12 12h5M12 17h5M3 3h18v18H3z" },
  { id: "safety", label: "Safety", d: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" },
  { id: "tools", label: "Tools", d: "M14.7 6.3a4 4 0 105.6 5.6L22 10l-2-2-1.7 1.7-2-2L18 6l-2-2-1.3 2.3zM3 21l7.5-7.5" },
  { id: "diag", label: "Health", d: "M22 12h-4l-3 8-4-16-3 8H2" },
  { id: "logs", label: "Logs", d: "M4 4h16v16H4zM8 9h8M8 13h8M8 17h5" },
  { id: "settings", label: "Setup", d: "M12 8a4 4 0 100 8 4 4 0 000-8zM19 12h3M2 12h3M12 2v3M12 19v3M17 7l2-2M5 19l2-2M17 17l2 2M5 5l2 2" },
];

export default function Nav() {
  const page = useStore((s) => s.page);
  const setPage = useStore((s) => s.setPage);
  return (
    <nav className="nav">
      {items.map((it) => (
        <button key={it.id} className={page === it.id ? "on" : ""} onClick={() => setPage(it.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={it.d} /></svg>
          {it.label}
        </button>
      ))}
      <div className="sep" />
    </nav>
  );
}
