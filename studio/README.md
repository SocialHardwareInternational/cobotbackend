# eRoBo Studio

Industrial desktop application (Electron + React + TypeScript) for the eRoBo 10 cobot.

The same build runs three ways:
1. **Desktop app** — `npm install && npm run package` produces installers (`release/`)
   for Windows (NSIS), Linux (AppImage/deb) and macOS (dmg). `npm start` runs it directly.
2. **On-robot web UI** — the controller serves `studio/dist/` on `http://<robot>:8080/`.
   The committed `dist/` is a production build; rebuild with `npm run build`.
3. **Development** — `npm run dev` (Vite, hot reload) then
   `EROBO_STUDIO_DEV_URL=http://localhost:5173 npm run electron`.

The app is a pure network client of the controller (WebSocket :8765, REST :8080) —
point it at any robot from Settings → Robot address.
