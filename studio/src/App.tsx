import { useEffect, useState } from "react";
import { useStore, PageId } from "./store";
import { robot } from "./api/robot";
import Header from "./components/Header";
import Nav from "./components/Nav";
import StatusBar from "./components/StatusBar";
import Toasts from "./components/Toasts";
import LoginModal from "./components/LoginModal";
import ConnectOverlay from "./components/ConnectOverlay";
import MovePage from "./pages/MovePage";
import ProgramPage from "./pages/ProgramPage";
import IoPage from "./pages/IoPage";
import SafetyPage from "./pages/SafetyPage";
import ToolsPage from "./pages/ToolsPage";
import DiagPage from "./pages/DiagPage";
import LogsPage from "./pages/LogsPage";
import SettingsPage from "./pages/SettingsPage";

const PAGES: Record<PageId, () => JSX.Element> = {
  move: MovePage, program: ProgramPage, io: IoPage, safety: SafetyPage,
  tools: ToolsPage, diag: DiagPage, logs: LogsPage, settings: SettingsPage,
};

export default function App() {
  const page = useStore((s) => s.page);
  const state = useStore((s) => s.state);
  const [login, setLogin] = useState(false);
  const Page = PAGES[page];

  // one-shot recovery banner logic lives in Header; global keyboard: Esc = stop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") robot.cmd({ cmd: "stop" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <Header onLogin={() => setLogin(true)} />
      <div className="main">
        <Nav />
        <div className="page">
          {state?.safety.stop ? (
            <div className="banner err">
              Protective stop — {state.safety.code_name}. Clear the cause, then press Enable to recover.
              <span className="grow" />
              <button className="btn sm good" onClick={() => robot.cmd({ cmd: "enable" })}>Enable</button>
            </div>
          ) : null}
          {state?.estop ? (
            <div className="banner err">
              EMERGENCY STOP engaged. When safe, reset and re-enable the drives.
              <span className="grow" />
              <button className="btn sm" onClick={() => robot.cmd({ cmd: "reset" })}>Reset E-stop</button>
              <button className="btn sm good" onClick={() => robot.cmd({ cmd: "enable" })}>Enable</button>
            </div>
          ) : null}
          {state?.contact ? (
            <div className="banner warn">
              Contact detected on J{(state.contact_joint ?? 0) + 1}. Check the workspace, then Enable to recover.
            </div>
          ) : null}
          <Page />
        </div>
      </div>
      <StatusBar />
      <Toasts />
      <ConnectOverlay />
      {login && <LoginModal onClose={() => setLogin(false)} />}
    </div>
  );
}
