// Isolation boundary: the UI talks to the robot over the network only; nothing
// from Node needs to be exposed. Version info is handy for the About panel.
const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("eroboDesktop", {
  desktop: true,
  versions: { electron: process.versions.electron, chrome: process.versions.chrome },
});
