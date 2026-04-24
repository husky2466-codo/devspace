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
      steps: [
        { n: 1, name: 'scan_usages',    status: 'ok'   },
        { n: 2, name: 'plan_migration', status: 'run'  },
        { n: 3, name: 'apply_edits',    status: 'idle' },
        { n: 4, name: 'verify_tests',   status: 'idle' },
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
