import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Dirent } from "node:fs";
import * as fs from "node:fs";

// Custom APIs for renderer
const api = {
  readdirS: async (path: string): Promise<Dirent[]> =>
    fs.readdirSync(path, { encoding: "utf-8", withFileTypes: true }),
  isDirectory: (path: string): boolean => fs.lstatSync(path).isDirectory(),
  readFile: async (path: string): Promise<Uint8Array> =>
    fs.promises.readFile(path),

  maximize: () => ipcRenderer.send("maximize_app"),
  minimize: () => ipcRenderer.send("minimize_app"),
  close: () => ipcRenderer.send("close_app"),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
