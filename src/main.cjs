const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

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

// ── Project inspection ───────────────────────────────────────────────────────

function git(cwd, args) {
  return new Promise((resolve) => {
    execFile('git', args, { cwd }, (err, stdout) => {
      resolve(err ? null : stdout.trim());
    });
  });
}

ipcMain.handle('project:inspect-folder', async (_event, folderPath) => {
  const name = path.basename(folderPath);

  const [branch, remoteUrl, topLevel] = await Promise.all([
    git(folderPath, ['rev-parse', '--abbrev-ref', 'HEAD']),
    git(folderPath, ['remote', 'get-url', 'origin']),
    git(folderPath, ['rev-parse', '--show-toplevel']),
  ]);

  const isGit = topLevel !== null;

  return {
    name,
    branch: branch || '',
    remoteUrl: remoteUrl || '',
    isGit,
  };
});

// ── File tree ─────────────────────────────────────────────────────────────────

const ALWAYS_IGNORE = [
  '.git', 'node_modules', '.DS_Store', 'Thumbs.db',
  'dist', 'build', 'out', '.next', '.nuxt', '__pycache__',
  '.venv', 'venv', '.tox', 'coverage', '.nyc_output',
  '*.pyc', '*.pyo', '*.class', '*.o', '*.obj',
];

function loadIgnore(rootPath) {
  let ig = null;
  try {
    const ignoreLib = require('ignore');
    ig = ignoreLib.default ? ignoreLib.default() : ignoreLib();
    ig.add(ALWAYS_IGNORE);
    const gitignorePath = path.join(rootPath, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      ig.add(fs.readFileSync(gitignorePath, 'utf8'));
    }
  } catch {}
  return ig;
}

function readTree(dirPath, rootPath, ig, depth = 0) {
  if (depth > 8) return [];
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes = [];
  for (const entry of entries) {
    const rel = path.relative(rootPath, path.join(dirPath, entry.name));
    if (ig && ig.ignores(rel)) continue;

    if (entry.isDirectory()) {
      const children = readTree(path.join(dirPath, entry.name), rootPath, ig, depth + 1);
      nodes.push({ name: entry.name, path: path.join(dirPath, entry.name), children });
    } else if (entry.isFile()) {
      nodes.push({ name: entry.name, path: path.join(dirPath, entry.name) });
    }
  }

  // Dirs first, then files, both sorted alphabetically
  nodes.sort((a, b) => {
    const aDir = !!a.children;
    const bDir = !!b.children;
    if (aDir !== bDir) return aDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

ipcMain.handle('fs:read-tree', (_event, rootPath) => {
  if (!rootPath || !fs.existsSync(rootPath)) return [];
  const ig = loadIgnore(rootPath);
  return readTree(rootPath, rootPath, ig);
});

// Per-project chokidar watchers: projectId → watcher
const watchers = new Map();

ipcMain.handle('fs:watch', (event, { projectId, rootPath }) => {
  if (!rootPath || !fs.existsSync(rootPath)) return;
  if (watchers.has(projectId)) {
    watchers.get(projectId).close();
    watchers.delete(projectId);
  }

  const chokidar = require('chokidar');
  const ig = loadIgnore(rootPath);

  const watcher = chokidar.watch(rootPath, {
    ignored: (filePath) => {
      if (filePath === rootPath) return false;
      const rel = path.relative(rootPath, filePath);
      return ig ? ig.ignores(rel) : false;
    },
    ignoreInitial: true,
    depth: 8,
    usePolling: false,
  });

  let debounce = null;
  const sendUpdate = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (!event.sender.isDestroyed()) {
        const tree = readTree(rootPath, rootPath, ig);
        event.sender.send('fs:tree-update', { projectId, tree });
      }
    }, 300);
  };

  watcher.on('add', sendUpdate).on('unlink', sendUpdate)
         .on('addDir', sendUpdate).on('unlinkDir', sendUpdate);

  watchers.set(projectId, watcher);
});

ipcMain.handle('fs:unwatch', (_event, projectId) => {
  if (watchers.has(projectId)) {
    watchers.get(projectId).close();
    watchers.delete(projectId);
  }
});

// ── PTY handlers ──────────────────────────────────────────────────────────────

const pty = require('node-pty');
const os = require('os');

// Map of termId -> pty process
const ptyProcesses = new Map();

// Spawn a new pty
ipcMain.handle('pty:spawn', (event, { termId, cwd, cols, rows }) => {
  const shell = process.env.SHELL || (process.platform === 'win32' ? 'powershell.exe' : 'bash');
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: cols || 80,
    rows: rows || 24,
    cwd: cwd || os.homedir(),
    env: { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' },
  });

  ptyProcess.onData((data) => {
    if (!event.sender.isDestroyed()) {
      event.sender.send(`pty:data:${termId}`, data);
    }
  });

  ptyProcess.onExit(() => {
    ptyProcesses.delete(termId);
    if (!event.sender.isDestroyed()) {
      event.sender.send(`pty:exit:${termId}`);
    }
  });

  ptyProcesses.set(termId, ptyProcess);
  return { ok: true };
});

// Write input to pty
ipcMain.handle('pty:write', (_event, { termId, data }) => {
  const p = ptyProcesses.get(termId);
  if (p) p.write(data);
});

// Resize pty
ipcMain.handle('pty:resize', (_event, { termId, cols, rows }) => {
  const p = ptyProcesses.get(termId);
  if (p) p.resize(cols, rows);
});

// Kill pty
ipcMain.handle('pty:kill', (_event, termId) => {
  const p = ptyProcesses.get(termId);
  if (p) { p.kill(); ptyProcesses.delete(termId); }
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

ipcMain.handle('fs:read-file', async (_e, filePath) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    return { ok: true, content };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('fs:write-file', async (_e, filePath, content) => {
  try {
    await fs.promises.writeFile(filePath, content, 'utf8');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('project:create', async (_e, { variant, fields }) => {
  const { promisify } = require('util');
  const execFileP = promisify(execFile);

  try {
    if (variant === 'import-local') {
      await fs.promises.access(fields.path);
      return { ok: true };
    }

    if (variant === 'create-local' || variant === 'local') {
      const dir = fields.path.trim();
      if (!dir) return { ok: false, error: 'No path specified' };
      await fs.promises.mkdir(dir, { recursive: true });
      await execFileP('git', ['init', '-b', fields.branch || 'main'], { cwd: dir });
      return { ok: true };
    }

    if (variant === 'clone-local') {
      const cloneInto = fields.path.trim();
      const url = fields.url.trim();
      if (!url) return { ok: false, error: 'No git URL specified' };
      if (!cloneInto) return { ok: false, error: 'No destination path specified' };
      await fs.promises.mkdir(cloneInto, { recursive: true });
      const targetName = (fields.name || '').trim() || url.split('/').pop().replace(/\.git$/, '');
      const targetDir = path.join(cloneInto, targetName);
      const cloneArgs = ['clone'];
      if ((fields.branch || '').trim()) cloneArgs.push('-b', fields.branch.trim());
      cloneArgs.push(url, targetDir);
      await execFileP('git', cloneArgs, { timeout: 120000 });
      return { ok: true, clonedPath: targetDir };
    }

    // import-remote, create-remote, clone-remote — SSH-based, register only for now
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('window:set-document-edited', (_e, isDirty) => {
  if (win && process.platform === 'darwin') {
    win.setDocumentEdited(isDirty);
  }
});

// ── Window + app ──────────────────────────────────────────────────────────────

let win = null;

function createWindow() {
  win = new BrowserWindow({
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
      webviewTag: true,
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

  buildMenu(win);
}

function buildMenu(mainWin) {
  const isMac = process.platform === 'darwin';
  const send = (ch) => () => mainWin?.webContents.send(ch);
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Terminal',
          accelerator: 'CmdOrCtrl+T',
          click: send('menu:new-terminal'),
        },
        {
          label: 'Close Terminal',
          accelerator: 'CmdOrCtrl+W',
          click: send('menu:close-terminal'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: send('menu:find'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Left Rail',
          accelerator: 'CmdOrCtrl+\\',
          click: send('menu:toggle-rail'),
        },
        {
          label: 'Toggle Spaceman',
          accelerator: 'CmdOrCtrl+/',
          click: send('menu:toggle-spaceman'),
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [{ type: 'separator' }, { role: 'front' }] : []),
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Preferences…',
          accelerator: 'CmdOrCtrl+,',
          click: send('menu:open-settings'),
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
