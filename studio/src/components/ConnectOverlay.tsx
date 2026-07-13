// ConnectOverlay -- shown while not connected: enter the robot's address (the PC
// running the eRoBo backend) and connect. Appears automatically on first run and
// whenever the link drops for more than a moment.
import { useEffect, useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

export default function ConnectOverlay() {
  const connected = useStore((s) => s.connected);
  const host = useStore((s) => s.host);
  const setHost = useStore((s) => s.setHost);
  const [draft, setDraft] = useState(host);
  const [show, setShow] = useState(!host);
  const [dialing, setDialing] = useState(false);

  // reveal after a grace period when the link drops; hide instantly when it returns
  useEffect(() => {
    if (connected) { setShow(false); setDialing(false); return; }
    if (!host) { setShow(true); return; }
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, [connected, host]);

  if (!show || connected) return null;

  const go = () => {
    const h = draft.trim();
    if (!h) return;
    setDialing(true);
    setHost(h);
    robot.connect(h);
  };

  return (
    <div className="modal-bg">
      <div className="modal" style={{ width: 430 }}>
        <div className="mh">Connect to robot</div>
        <div className="mb">
          <p className="muted small" style={{ marginBottom: 12 }}>
            Enter the address of the PC running the eRoBo backend
            (the controller service on ports 8080 / 8765).
          </p>
          <div className="field"><label>Robot address (IP or hostname)</label>
            <input className="in mono" autoFocus value={draft} placeholder="e.g. 192.168.1.50"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()} />
          </div>
          {dialing && !connected && (
            <p className="small" style={{ color: "var(--warn)" }}>
              Trying {draft.trim()}… check that the backend is running and ports 8080/8765
              are open on its firewall.
            </p>
          )}
          {!dialing && host && (
            <p className="small dim">Last robot: {host} — reconnecting automatically.</p>
          )}
        </div>
        <div className="mf">
          <button className="btn primary" onClick={go} disabled={!draft.trim()}>Connect</button>
        </div>
      </div>
    </div>
  );
}
