export const SEED_TERMINALS = [
  {
    id: 'a1',
    name: 'agent-1',
    model: 'sonnet',
    status: 'run',
    lines: [
      { t: '$ npm run dev', kind: 'prompt' },
      { t: '› vite v5.2.0 ready', kind: 'dim' },
      { t: '› Local: http://localhost:5173', kind: 'dim' },
      { t: 'HMR connected · 1,284 modules', kind: 'dim' },
    ],
  },
  {
    id: 'a2',
    name: 'agent-2',
    model: 'haiku',
    status: 'ok',
    lines: [
      { t: '$ pytest -q', kind: 'prompt' },
      { t: '............', kind: 'dim' },
      { t: '12 passed in 0.84s', kind: 'ok' },
    ],
  },
];

export const SEED_FINISHED_IDS = new Set(['a2']);

let _nextId = 3;
export function makeTerminal() {
  const id = `a${_nextId++}`;
  return {
    id,
    name: `agent-${_nextId - 1}`,
    model: 'sonnet',
    status: 'idle',
    lines: [{ t: '$ _', kind: 'prompt' }],
  };
}
