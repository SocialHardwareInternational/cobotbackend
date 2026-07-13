import { useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState("admin");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const setAuth = useStore((s) => s.setAuth);
  const toast = useStore((s) => s.toast);
  const authUser = useStore((s) => s.authUser);

  const doLogin = async () => {
    try {
      const r = await robot.login(user.trim(), pin);
      setAuth(r.user, r.role);
      toast("ok", `Logged in as ${r.user} (${r.role})`);
      if (r.must_change) toast("warn", "Default PIN in use — change it in Setup → Users.");
      onClose();
    } catch (e: any) {
      setErr(e.message || "login failed");
    }
  };
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="mh">Operator login</div>
        <div className="mb">
          {authUser && <p className="muted small" style={{ marginBottom: 10 }}>Signed in as <b>{authUser}</b>.</p>}
          <div className="field"><label>User</label>
            <input className="in" value={user} onChange={(e) => setUser(e.target.value)} /></div>
          <div className="field"><label>PIN</label>
            <input className="in" type="password" inputMode="numeric" value={pin}
              onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doLogin()} /></div>
          {err && <p className="small" style={{ color: "var(--err)" }}>{err}</p>}
        </div>
        <div className="mf">
          {authUser && <button className="btn" onClick={() => { robot.logout(); setAuth(null, null); onClose(); }}>Log out</button>}
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={doLogin}>Log in</button>
        </div>
      </div>
    </div>
  );
}
