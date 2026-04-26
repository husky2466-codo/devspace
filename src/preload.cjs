const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  browseFolder:    (defaultPath) => ipcRenderer.invoke('dialog:browse-folder', defaultPath),
  browseFile:      (opts)        => ipcRenderer.invoke('dialog:browse-file', opts),
  inspectFolder:   (folderPath)  => ipcRenderer.invoke('project:inspect-folder', folderPath),
  readTree:        (rootPath)    => ipcRenderer.invoke('fs:read-tree', rootPath),
  watchProject:    (projectId, rootPath) => ipcRenderer.invoke('fs:watch', { projectId, rootPath }),
  unwatchProject:  (projectId)   => ipcRenderer.invoke('fs:unwatch', projectId),
  onTreeUpdate:    (cb) => {
    ipcRenderer.on('fs:tree-update', (_e, payload) => cb(payload));
    return () => ipcRenderer.removeAllListeners('fs:tree-update');
  },
  ptySpawn:   (termId, cwd, cols, rows) => ipcRenderer.invoke('pty:spawn', { termId, cwd, cols, rows }),
  ptyWrite:   (termId, data)            => ipcRenderer.invoke('pty:write', { termId, data }),
  ptyResize:  (termId, cols, rows)      => ipcRenderer.invoke('pty:resize', { termId, cols, rows }),
  ptyKill:    (termId)                  => ipcRenderer.invoke('pty:kill', termId),
  onPtyData:  (termId, cb) => {
    const channel = `pty:data:${termId}`;
    ipcRenderer.on(channel, (_e, data) => cb(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
  onPtyExit:  (termId, cb) => {
    const channel = `pty:exit:${termId}`;
    ipcRenderer.once(channel, () => cb());
    return () => ipcRenderer.removeAllListeners(channel);
  },
  readFile:  (filePath) => ipcRenderer.invoke('fs:read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('fs:write-file', filePath, content),
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
