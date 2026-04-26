const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

const KEYCHAIN_SERVICE = 'dev-space-ai';
const KEYCHAIN_ACCOUNT_ANTHROPIC = 'anthropic-api-key';

// Lazy-load keytar and Anthropic — both are native/ESM, handle gracefully
let keytar = null;
let Anthropic = null;

async function getKeytar() {
  if (!keytar) keytar = require('keytar');
  return keytar;
}

async function getAnthropic() {
  if (!Anthropic) {
    const mod = await import('@anthropic-ai/sdk');
    Anthropic = mod.default;
  }
  return Anthropic;
}

// ── Keychain helpers ──────────────────────────────────────────────────────────

async function getApiKey() {
  const kt = await getKeytar();
  return kt.getPassword(KEYCHAIN_SERVICE, KEYCHAIN_ACCOUNT_ANTHROPIC);
}

async function setApiKey(key) {
  const kt = await getKeytar();
  await kt.setPassword(KEYCHAIN_SERVICE, KEYCHAIN_ACCOUNT_ANTHROPIC, key);
}

async function deleteApiKey() {
  const kt = await getKeytar();
  return kt.deletePassword(KEYCHAIN_SERVICE, KEYCHAIN_ACCOUNT_ANTHROPIC);
}

// ── Dialog handlers ───────────────────────────────────────────────────────────

ipcMain.handle('dialog:browse-folder', async (_event, defaultPath) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: defaultPath || app.getPath('home'),
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('dialog:browse-file', async (_event, { defaultPath, filters } = {}) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    defaultPath: defaultPath || app.getPath('home'),
    filters: filters || [],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// ── IPC handlers ──────────────────────────────────────────────────────────────

// Check whether a key is stored
ipcMain.handle('spaceman:key-status', async () => {
  const key = await getApiKey();
  return { hasKey: !!key };
});

// Save a key to keychain (called from Settings)
ipcMain.handle('spaceman:set-key', async (_event, key) => {
  if (!key || typeof key !== 'string' || !key.startsWith('sk-ant-')) {
    throw new Error('Invalid API key format');
  }
  await setApiKey(key.trim());
  return { ok: true };
});

// Delete stored key
ipcMain.handle('spaceman:delete-key', async () => {
  await deleteApiKey();
  return { ok: true };
});

// Stream a chat message — tokens come back as ipcMain events on the sender
ipcMain.handle('spaceman:chat', async (event, { messages, model, systemPrompt }) => {
  const key = await getApiKey();
  if (!key) throw new Error('NO_KEY');

  const AnthropicClass = await getAnthropic();
  const client = new AnthropicClass({ apiKey: key });

  const senderContents = event.sender;

  try {
    const stream = await client.messages.stream({
      model: model || 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt || 'You are Spaceman, a senior engineering AI working inside Dev-Space.ai. Be concise, precise, and practical.',
      messages,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        if (!senderContents.isDestroyed()) {
          senderContents.send('spaceman:token', chunk.delta.text);
        }
      }
    }

    const final = await stream.finalMessage();
    if (!senderContents.isDestroyed()) {
      senderContents.send('spaceman:done', {
        inputTokens: final.usage.input_tokens,
        outputTokens: final.usage.output_tokens,
        stopReason: final.stop_reason,
      });
    }
    return { ok: true };
  } catch (err) {
    if (!senderContents.isDestroyed()) {
      senderContents.send('spaceman:error', err.message);
    }
    throw err;
  }
});

// ── Window + app ──────────────────────────────────────────────────────────────

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
    // Find whichever vite port is active
    const ports = [5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180];
    const tryLoad = (i) => {
      if (i >= ports.length) { win.loadURL('http://localhost:5173'); return; }
      const url = `http://localhost:${ports[i]}`;
      win.loadURL(url).catch(() => tryLoad(i + 1));
    };
    tryLoad(0);
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
        { label: 'Close Terminal', accelerator: 'Ctrl+W', click: () => {} },
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
