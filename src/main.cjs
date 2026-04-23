const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 8 },
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/renderer/index.html'));
  }

  buildMenu();
}

function buildMenu() {
  const template = [
    {
      label: 'Dev-Space',
      submenu: [
        { label: 'About Dev-Space.ai', role: 'about' },
        { type: 'separator' },
        { label: 'Preferences', accelerator: 'Cmd+,', click: () => {} },
        { type: 'separator' },
        { label: 'Hide Dev-Space', role: 'hide' },
        { label: 'Quit', role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [
        { label: 'New Project', accelerator: 'Cmd+N', click: () => {} },
        { label: 'Open', accelerator: 'Cmd+O', click: () => {} },
        { label: 'Close', accelerator: 'Cmd+W', role: 'close' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Terminal Theme', accelerator: 'Ctrl+1', click: () => {} },
        { label: 'Graphite Theme', accelerator: 'Ctrl+2', click: () => {} },
        { label: 'Paper Theme', accelerator: 'Ctrl+3', click: () => {} },
        { type: 'separator' },
        { label: 'Toggle Left Rail', accelerator: 'Cmd+B', click: () => {} },
        { label: 'Toggle Right Drawer', accelerator: 'Cmd+J', click: () => {} },
        { type: 'separator' },
        { label: 'Zoom In', role: 'zoomIn' },
        { label: 'Zoom Out', role: 'zoomOut' },
        { label: 'Reset Zoom', role: 'resetZoom' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Session',
      submenu: [
        { label: 'New Terminal', accelerator: 'Cmd+T', click: () => {} },
        { label: 'Close Terminal', accelerator: 'Cmd+W', click: () => {} },
        { type: 'separator' },
        { label: 'Next Terminal', accelerator: 'Cmd+]', click: () => {} },
        { label: 'Previous Terminal', accelerator: 'Cmd+[', click: () => {} },
        { type: 'separator' },
        { label: 'Rename', accelerator: 'F2', click: () => {} },
      ],
    },
    {
      label: 'Scripts',
      submenu: [
        { label: 'Run Script', accelerator: 'Cmd+R', click: () => {} },
        { label: 'Run Last Script', accelerator: 'Shift+Cmd+R', click: () => {} },
        { type: 'separator' },
        { label: 'Edit Scripts', click: () => {} },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { label: 'Project Switcher', accelerator: 'Ctrl+Cmd+P', click: () => {} },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => {} },
        { label: 'Keyboard Shortcuts', click: () => {} },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
