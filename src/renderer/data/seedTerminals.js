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

export function makeProjectState() {
  return { terminals: [], activeTermId: null, finishedIds: new Set(), editorFile: null };
}

export const SEED_BY_PROJECT = {
  forge: {
    terminals: SEED_TERMINALS,
    activeTermId: 'a1',
    finishedIds: new Set(['a2']),
    editorFile: null,
  },
  archivist: {
    terminals: [
      {
        id: 'b1',
        name: 'agent-1',
        model: 'sonnet',
        status: 'idle',
        lines: [{ t: '$ _', kind: 'prompt' }],
      },
    ],
    activeTermId: 'b1',
    finishedIds: new Set(),
    editorFile: null,
  },
  mindcraft: makeProjectState(),
  routines:  makeProjectState(),
};

export function makeTerminal(existingTerminals) {
  const ids = new Set(existingTerminals.map((t) => t.id));
  let n = existingTerminals.length + 1;
  while (ids.has(`a${n}`)) n++;
  const id = `a${n}`;
  return {
    id,
    name: `agent-${n}`,
    model: 'sonnet',
    status: 'idle',
    lines: [{ t: '$ _', kind: 'prompt' }],
  };
}
