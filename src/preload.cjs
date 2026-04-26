const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});

contextBridge.exposeInMainWorld('spaceman', {
  // Key management — renderer never sees the actual key value
  getKeyStatus: () => ipcRenderer.invoke('spaceman:key-status'),
  setKey: (key) => ipcRenderer.invoke('spaceman:set-key', key),
  deleteKey: () => ipcRenderer.invoke('spaceman:delete-key'),

  // Chat — sends message array, receives streaming tokens via onToken/onDone/onError
  chat: (payload) => ipcRenderer.invoke('spaceman:chat', payload),
  onToken: (cb) => {
    ipcRenderer.on('spaceman:token', (_e, token) => cb(token));
    return () => ipcRenderer.removeAllListeners('spaceman:token');
  },
  onDone: (cb) => {
    ipcRenderer.on('spaceman:done', (_e, stats) => cb(stats));
    return () => ipcRenderer.removeAllListeners('spaceman:done');
  },
  onError: (cb) => {
    ipcRenderer.on('spaceman:error', (_e, msg) => cb(msg));
    return () => ipcRenderer.removeAllListeners('spaceman:error');
  },
});
