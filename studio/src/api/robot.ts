// robot.ts -- typed WebSocket client for the eRoBo controller (ws :8765).
// Auto-reconnects, correlates replies via "rid", streams state at 50 Hz.

export interface SafetyState { zone: number; code: number; stop: number; code_name: string }
export interface ProgramStatus { running: boolean; id: string | null; name: string | null; step: number; nsteps: number; cycle: number }
export interface RobotState {
  type: "state"; t: number; mode: string; estop: boolean; enabled: boolean; moving: boolean;
  freedrive: boolean; progress: number; manip: number;
  q: number[]; qd: number[]; torque: number[]; torque_util: number;
  temp: number[]; current: number[]; voltage: number[]; torque_meas: number[]; brake: number[];
  coll_dist: number; coll_warn: number; coll_stop: number; singular: number; coll_pair: number[];
  flange: { pos: number[]; quat: number[] }; tcp: { pos: number[]; quat: number[] };
  contact: number; contact_joint: number; ext_torque: number[];
  speed_pct: number; tcp_speed: number; elbow_speed: number; ext_force: number;
  safety: SafetyState; jitter_us: number; overruns: number; program: ProgramStatus;
  joint_op: boolean[];
}
export interface ProgramEvent {
  type: "program"; event: string; index?: number; name?: string; message?: string;
  id?: string; n?: number; cycle?: number; cycles?: number; move?: string;
}
type Listener = (s: RobotState) => void;
type EventListener = (e: ProgramEvent) => void;

export class RobotClient {
  ws: WebSocket | null = null;
  host = "127.0.0.1";
  connected = false;
  private rid = 0;
  private pending = new Map<string, { res: (v: any) => void; t: number }>();
  private stateSubs = new Set<Listener>();
  private eventSubs = new Set<EventListener>();
  private connSubs = new Set<(c: boolean) => void>();
  private closing = false;
  private retryMs = 800;

  wsUrl() { return `ws://${this.host}:8765`; }
  httpUrl(path: string) { return `http://${this.host}:8080${path}`; }

  connect(host: string) {
    if (!host) return;               // nothing to dial yet (first run) -- Connect dialog handles it
    this.host = host;
    this.closing = false;
    this.open();
  }
  disconnect() {
    this.closing = true;
    this.ws?.close();
  }
  private open() {
    try { this.ws?.close(); } catch { /* noop */ }
    const ws = new WebSocket(this.wsUrl());
    this.ws = ws;
    ws.onopen = () => {
      this.connected = true;
      this.retryMs = 800;
      this.connSubs.forEach((f) => f(true));
    };
    ws.onclose = () => {
      const was = this.connected;
      this.connected = false;
      if (was) this.connSubs.forEach((f) => f(false));
      this.pending.forEach((p) => p.res({ type: "error", message: "connection lost" }));
      this.pending.clear();
      if (!this.closing) {
        setTimeout(() => this.open(), this.retryMs);
        this.retryMs = Math.min(5000, this.retryMs * 1.6);
      }
    };
    ws.onerror = () => ws.close();
    ws.onmessage = (ev) => {
      let m: any;
      try { m = JSON.parse(ev.data); } catch { return; }
      if (m.rid && this.pending.has(m.rid)) {
        this.pending.get(m.rid)!.res(m);
        this.pending.delete(m.rid);
        if (m.type === "program") this.eventSubs.forEach((f) => f(m));
        return;
      }
      if (m.type === "state") this.stateSubs.forEach((f) => f(m));
      else if (m.type === "program" || m.type === "probe") this.eventSubs.forEach((f) => f(m));
    };
  }

  cmd(obj: Record<string, unknown>, timeoutMs = 15000): Promise<any> {
    return new Promise((res) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
        return res({ type: "error", message: "not connected" });
      const rid = `s${++this.rid}`;
      this.pending.set(rid, { res, t: Date.now() });
      this.ws.send(JSON.stringify({ ...obj, rid }));
      setTimeout(() => {
        if (this.pending.has(rid)) {
          this.pending.delete(rid);
          res({ type: "error", message: "timeout" });
        }
      }, timeoutMs);
    });
  }
  fire(obj: Record<string, unknown>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(obj));
  }

  onState(f: Listener) { this.stateSubs.add(f); return () => { this.stateSubs.delete(f); }; }
  onEvent(f: EventListener) { this.eventSubs.add(f); return () => { this.eventSubs.delete(f); }; }
  onConn(f: (c: boolean) => void) { this.connSubs.add(f); return () => { this.connSubs.delete(f); }; }

  // ---- REST (auth + resources) ------------------------------------------
  token: string | null = null;
  role: string | null = null;
  user: string | null = null;
  async rest(method: string, path: string, body?: unknown): Promise<any> {
    const r = await fetch(this.httpUrl(path), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const ct = r.headers.get("content-type") || "";
    const data = ct.includes("json") ? await r.json() : await r.blob();
    if (!r.ok) throw new Error((data && (data as any).error) || `HTTP ${r.status}`);
    return data;
  }
  async login(user: string, pin: string) {
    const r = await this.rest("POST", "/api/v1/auth/login", { user, pin });
    this.token = r.token; this.role = r.role; this.user = r.user;
    return r;
  }
  logout() {
    if (this.token) this.rest("POST", "/api/v1/auth/logout").catch(() => undefined);
    this.token = this.role = this.user = null;
  }
}

export const robot = new RobotClient();
