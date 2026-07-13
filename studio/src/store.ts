// store.ts -- application state (zustand). The 50 Hz robot state lives here;
// components subscribe to the slices they render.
import { create } from "zustand";
import { robot, RobotState, ProgramEvent } from "./api/robot";

export type PageId = "move" | "program" | "io" | "safety" | "tools" | "diag" | "logs" | "settings";

export interface Toast { id: number; kind: "ok" | "err" | "warn" | "info"; text: string }

interface Store {
  page: PageId;
  theme: "dark" | "light";
  host: string;
  connected: boolean;
  state: RobotState | null;
  progEvents: ProgramEvent[];
  toasts: Toast[];
  authRole: string | null;
  authUser: string | null;
  setPage: (p: PageId) => void;
  setTheme: (t: "dark" | "light") => void;
  setHost: (h: string) => void;
  toast: (kind: Toast["kind"], text: string) => void;
  dismissToast: (id: number) => void;
  setAuth: (u: string | null, r: string | null) => void;
}

let toastId = 0;

export const useStore = create<Store>((set) => ({
  page: "move",
  theme: (localStorage.getItem("erobo.theme") as "dark" | "light") || "dark",
  host: localStorage.getItem("erobo.host") || window.location.hostname || "",
  connected: false,
  state: null,
  progEvents: [],
  toasts: [],
  authRole: null,
  authUser: null,
  setPage: (page) => set({ page }),
  setTheme: (theme) => {
    localStorage.setItem("erobo.theme", theme);
    document.documentElement.dataset.theme = theme;
    set({ theme });
  },
  setHost: (host) => {
    localStorage.setItem("erobo.host", host);
    set({ host });
  },
  toast: (kind, text) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts.slice(-4), { id, kind, text }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 5200);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setAuth: (authUser, authRole) => set({ authUser, authRole }),
}));

// latest state at full rate for the 3D loop (no React re-render)
export const liveState: { s: RobotState | null } = { s: null };

export function bootRobotLink() {
  document.documentElement.dataset.theme = useStore.getState().theme;
  // First run on a separate PC (Electron: no location hostname, nothing saved):
  // stay disconnected and let the Connect dialog take over instead of dialling nowhere.
  robot.onState((s) => {
    liveState.s = s;
    useStore.setState({ state: s });
  });
  robot.onConn((c) => {
    useStore.setState({ connected: c });
    useStore.getState().toast(c ? "ok" : "warn", c ? "Connected to robot" : "Connection lost — reconnecting…");
  });
  robot.onEvent((e) => {
    useStore.setState((st) => ({ progEvents: [...st.progEvents.slice(-199), e] }));
    if (e.event === "error") useStore.getState().toast("err", `Program: ${e.message || "error"}`);
    if (e.event === "done") useStore.getState().toast("ok", "Program completed");
  });
  const h = useStore.getState().host;
  if (h) robot.connect(h);
}
