const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  getLocalDbPath: () => ipcRenderer.invoke('get-local-db-path'),
  platform: process.platform
})
