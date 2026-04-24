export function makeSpacemanState() {
  return { tab: 'chat', chat: [], chain: null, memory: [], browser: { items: [] } };
}

export const SEED_SPACEMAN = {
  forge: {
    tab: 'chat',
    chat: [
      {
        role: 'you',
        meta: '14:22',
        text: 'Refactor the theme variables to use [data-theme] selector.',
      },
      {
        role: 'spaceman',
        meta: 'sonnet',
        text: "I'll plan this across tokens.jsx and variables.css. Spawning an agent to survey usages first.",
        tool: {
          head: 'spawn agent[1]',
          body: 'scan usages of themeVars() across /src',
          foot: '14 files · 420ms',
        },
      },
      {
        role: 'spaceman',
        meta: 'sonnet',
        text: 'Survey complete — 14 call sites, 3 clusters. Ready to apply. Click Terminal.jsx to see proposed edit.',
      },
    ],
    chain: {
      name: 'theme-migration',
      totalMs: 1420,
      tokensIn: 4200,
      tokensOut: 1100,
      steps: [
        { n: 1, kind: 'prompt',   name: 'prompt',       status: 'ok',   ms: 0,    detail: 'Refactor theme variables to [data-theme] selector.' },
        { n: 2, kind: 'route',    name: 'router',       status: 'ok',   ms: 80,   detail: 'Routed to: plan + agent[1] · model: sonnet' },
        { n: 3, kind: 'plan',     name: 'plan',         status: 'ok',   ms: 340,  detail: '4 steps · tokens.jsx → variables.css · 14 call sites' },
        { n: 4, kind: 'agent',    name: 'agent[1]',     status: 'ok',   ms: 620,  detail: 'scan_usages complete — 14 files, 3 clusters' },
        { n: 5, kind: 'tool',     name: 'grep · read',  status: 'ok',   ms: 180,  detail: 'grep themeVars · read tokens.jsx · read variables.css' },
        { n: 6, kind: 'plan',     name: 'plan_migration', status: 'run', ms: null, detail: 'Generating migration plan…' },
        { n: 7, kind: 'agent',    name: 'agent[2]',     status: 'idle', ms: null, detail: 'apply_edits — pending' },
        { n: 8, kind: 'terminal', name: 'terminal[1]',  status: 'idle', ms: null, detail: 'npm test — pending' },
        { n: 9, kind: 'verify',   name: 'verify',       status: 'idle', ms: null, detail: 'Awaiting test results' },
      ],
    },
    memory: [
      { t: 'DECISION', c: 'Sliding rail pages, not dual-panel' },
      { t: 'PATTERN',  c: 'Theme = attribute on <html>' },
      { t: 'CORRECT',  c: 'File tree lives per-project, not global' },
    ],
    browser: {
      items: [
        { kind: 'html', name: 'dev preview · Dashboard', path: 'http://localhost:5173/dashboard', from: 'agent-1' },
        { kind: 'file', name: 'Terminal.jsx', path: 'src/components/terminal/Terminal.jsx', from: 'agent-1' },
        { kind: 'link', name: 'react docs · useEffect', path: 'https://react.dev/reference/react/useEffect', from: 'you' },
      ],
    },
  },
  archivist: makeSpacemanState(),
  mindcraft:  makeSpacemanState(),
  routines:   makeSpacemanState(),
};
