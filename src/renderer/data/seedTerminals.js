export function makeProjectState() {
  return { terminals: [], activeTermId: null, finishedIds: new Set(), editorFile: null, files: [] };
}

export const SEED_BY_PROJECT = {};

let termCounter = 0;
export function makeTerminal(existingTerminals, cwd) {
  const n = existingTerminals.length + 1;
  termCounter++;
  return {
    id: `term-${termCounter}`,
    name: `terminal-${n}`,
    model: 'sonnet',
    status: 'idle',
    lines: [],
    cwd: cwd || null,
  };
}
