// SettingsPage -- robot identity, connection, users, integrations, backup, theme.
import { useEffect, useRef, useState } from "react";
import { robot } from "../api/robot";
import { useStore } from "../store";

interface User { name: string; role: string; must_change: boolean }

export default function SettingsPage() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const host = useStore((s) => s.host);
  const setHost = useStore((s) => s.setHost);
  const toast = useStore((s) => s.toast);
  const authRole = useStore((s) => s.authRole);
  const [hostDraft, setHostDraft] = useState(host);
  const [sys, setSys] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", pin: "", role: "operator" });
  const [pinDraft, setPinDraft] = useState("");
  const restoreRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      setSys(await robot.rest("GET", "/api/v1/system"));
      setSettings(await robot.rest("GET", "/api/v1/settings"));
      if (authRole === "admin") {
        const u = await robot.rest("GET", "/api/v1/users");
        setUsers(u.users || []);
      }
    } catch { /* not connected / not admin */ }
  };
  useEffect(() => { load(); }, [authRole]);   // eslint-disable-line react-hooks/exhaustive-deps

  const saveSettings = async (patch: any) => {
    try {
      const r = await robot.rest("POST", "/api/v1/settings", patch);
      setSettings(r);
      toast("ok", "Settings saved");
    } catch (e: any) { toast("err", e.message); }
  };
  const addUser = async () => {
    try {
      await robot.rest("POST", "/api/v1/users", newUser);
      setNewUser({ name: "", pin: "", role: "operator" });
      toast("ok", "User created");
      load();
    } catch (e: any) { toast("err", e.message); }
  };
  const changePin = async () => {
    try {
      await robot.rest("POST", "/api/v1/auth/pin", { pin: pinDraft });
      setPinDraft("");
      toast("ok", "PIN changed");
    } catch (e: any) { toast("err", e.message); }
  };
  const backup = async () => {
    try {
      const blob: Blob = await robot.rest("GET", "/api/v1/backup");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `erobo_backup_${new Date().toISOString().slice(0, 10)}.tar.gz`;
      a.click();
      toast("ok", "Backup downloaded");
    } catch (e: any) { toast("err", e.message); }
  };
  const restore = async (f: File) => {
    const b = new Uint8Array(await f.arrayBuffer());
    let bin = "";
    b.forEach((x) => { bin += String.fromCharCode(x); });
    try {
      await robot.rest("POST", "/api/v1/restore", { data: btoa(bin) });
      toast("ok", "Configuration restored — restart the controller to apply");
    } catch (e: any) { toast("err", e.message); }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
      <div className="panel">
        <div className="ph">Connection & appearance</div>
        <div className="pb">
          <div className="field"><label>Robot address</label>
            <div className="row">
              <input className="in mono" value={hostDraft} onChange={(e) => setHostDraft(e.target.value)} />
              <button className="btn" onClick={() => { setHost(hostDraft.trim()); robot.connect(hostDraft.trim()); }}>Connect</button>
            </div>
          </div>
          <div className="field"><label>Theme</label>
            <div className="row">
              <button className={`btn ${theme === "dark" ? "primary" : ""}`} onClick={() => setTheme("dark")}>Dark</button>
              <button className={`btn ${theme === "light" ? "primary" : ""}`} onClick={() => setTheme("light")}>Light</button>
            </div>
          </div>
          {sys && (
            <p className="dim small">
              {sys.model} · controller v{sys.version} · up {(sys.uptime_s / 3600).toFixed(1)} h · host {sys.hostname}
            </p>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="ph">Robot identity & integrations</div>
        <div className="pb">
          {settings ? (
            <>
              <div className="field"><label>Robot name</label>
                <div className="row">
                  <input className="in" defaultValue={settings.robot_name} id="rname" />
                  <button className="btn" onClick={() => saveSettings({ robot_name: (document.getElementById("rname") as HTMLInputElement).value })}>Save</button>
                </div>
              </div>
              <div className="jrow">
                <span className="grow">Modbus TCP slave (port {settings.modbus?.port})</span>
                <div className={`toggle ${settings.modbus?.enabled ? "on" : ""}`}
                  onClick={() => saveSettings({ modbus: { ...settings.modbus, enabled: !settings.modbus.enabled } })} />
              </div>
              <div className="jrow">
                <span className="grow">MQTT publisher ({settings.mqtt?.host}:{settings.mqtt?.port})</span>
                <div className={`toggle ${settings.mqtt?.enabled ? "on" : ""}`}
                  onClick={() => saveSettings({ mqtt: { ...settings.mqtt, enabled: !settings.mqtt.enabled } })} />
              </div>
              <div className="field" style={{ marginTop: 8 }}><label>MQTT broker host</label>
                <div className="row">
                  <input className="in mono" defaultValue={settings.mqtt?.host} id="mqhost" />
                  <button className="btn" onClick={() => saveSettings({ mqtt: { ...settings.mqtt, host: (document.getElementById("mqhost") as HTMLInputElement).value } })}>Save</button>
                </div>
              </div>
              <p className="dim small">Changing integrations requires an admin login. REST API reference: <span className="mono">docs/INTEGRATION_API.md</span></p>
            </>
          ) : <p className="dim small">Connect (and log in) to edit controller settings.</p>}
        </div>
      </div>

      <div className="panel">
        <div className="ph">My account</div>
        <div className="pb">
          <div className="field"><label>Change my PIN</label>
            <div className="row">
              <input className="in" type="password" inputMode="numeric" value={pinDraft} onChange={(e) => setPinDraft(e.target.value)} placeholder="new PIN (4+ digits)" />
              <button className="btn" onClick={changePin} disabled={pinDraft.length < 4}>Change</button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="ph">Backup & restore</div>
        <div className="pb">
          <div className="row">
            <button className="btn" onClick={backup}>Download backup</button>
            <button className="btn" onClick={() => restoreRef.current?.click()}>Restore from file…</button>
            <input ref={restoreRef} type="file" accept=".tar.gz,.tgz" style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])} />
          </div>
          <p className="dim small" style={{ marginTop: 8 }}>
            The archive contains programs, waypoints, tools, safety configuration, users and settings (admin login required).
          </p>
        </div>
      </div>

      {authRole === "admin" && (
        <div className="panel" style={{ gridColumn: "1 / -1" }}>
          <div className="ph">Users & roles</div>
          <div className="pb">
            <table className="tbl">
              <thead><tr><th>User</th><th>Role</th><th /></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.name}>
                    <td><b>{u.name}</b> {u.must_change && <span className="chip warn" style={{ marginLeft: 8, padding: "2px 8px" }}><span className="dot" />default PIN</span>}</td>
                    <td>{u.role}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn sm danger" onClick={async () => {
                        try { await robot.rest("DELETE", `/api/v1/users/${u.name}`); load(); }
                        catch (e: any) { toast("err", e.message); }
                      }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row" style={{ marginTop: 10 }}>
              <input className="in" placeholder="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              <input className="in" placeholder="PIN" type="password" value={newUser.pin} onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })} />
              <select className="in" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option>operator</option><option>programmer</option><option>admin</option>
              </select>
              <button className="btn primary" onClick={addUser}>Add user</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
