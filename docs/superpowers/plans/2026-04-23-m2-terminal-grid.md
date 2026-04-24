# M2 Terminal Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the center workspace — auto-tiling terminal grid, sub-tab bar, empty state, finished-state glow, and Spaceman prompt strip — all driven by seed data with spawn/close/acknowledge wired up.

**Architecture:** The center workspace is a flex column: SubTabBar (28px) → TerminalGrid (flex-1) → SpacemanPromptStrip (44px). Terminal state lives in IDE.jsx as `terminals` + `activeTermId` + `finishedIds`. All terminal components are pure-presentational. No xterm.js yet — terminals render hardcoded `lines[]` from seed data (real pty comes in a later milestone). The finished-state glow (`smFinished` keyframe) is already defined in `base.css`.

**Tech Stack:** React 18, Electron 30, Vite 5, inline styles, CSS custom properties. No new npm packages needed for this milestone.

---

## File map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/renderer/data/seedTerminals.js` | Seed terminal + finished-state data |
| Create | `src/renderer/components/Workspace/SubTabBar.jsx` | 28px agent tab bar with spawn + close |
| Create | `src/renderer/components/Workspace/TerminalCard.jsx` | Single terminal card — header, lines, caret, finished glow |
| Create | `src/renderer/components/Workspace/TerminalGrid.jsx` | Auto-tiling grid (1/2/3 cols by count) + empty state |
| Create | `src/renderer/components/Workspace/SpacemanPromptStrip.jsx` | 44px prompt strip with SpacemanMark |
| Create | `src/renderer/components/Workspace/index.jsx` | Workspace container — composes the above, owns no state |
| Modify | `src/renderer/IDE.jsx` | Add terminal state, wire Workspace into center column |

---

### Task 1: Seed terminal data

**Files:**
- Create: `src/renderer/data/seedTerminals.js`

- [ ] **Step 1: Create the seed data module**

Create `src/renderer/data/seedTerminals.js`:

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/renderer/data/seedTerminals.js
git commit -m "feat: M2 seed terminal data"
```

---

### Task 2: SubTabBar component

**Files:**
- Create: `src/renderer/components/Workspace/SubTabBar.jsx`

The sub-tab bar is 28px tall, `var(--bg-sunken)` background, `1px solid var(--border)` bottom border. One tab per terminal. Active tab: `var(--bg)` bg + `1px solid var(--accent)` top border + `var(--text)` color. Inactive: transparent bg. Each tab has a status dot, name, and `×` close button. `+` spawns a new terminal.

- [ ] **Step 1: Create the component**

Create `src/renderer/components/Workspace/SubTabBar.jsx`:

```jsx
import StatusDot from '../primitives/StatusDot.jsx';

export default function SubTabBar({ terminals, activeId, onSelect, onClose, onSpawn }) {
  return (
    <div style={{
      height: 28,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'stretch',
      background: 'var(--bg-sunken)',
      borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      overflow: 'hidden',
    }}>
      {terminals.map((t) => {
        const isActive = t.id === activeId;
        return (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              background: isActive ? 'var(--bg)' : 'transparent',
              borderRight: '1px solid var(--border)',
              borderTop: isActive ? '1px solid var(--accent)' : '1px solid transparent',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <StatusDot kind={t.status} pulse={t.status === 'run'} size={5} />
            <span>{t.name}</span>
            <span
              onClick={(e) => { e.stopPropagation(); onClose(t.id); }}
              style={{ color: 'var(--text-dim)', cursor: 'pointer', marginLeft: 2 }}
            >
              ×
            </span>
          </div>
        );
      })}

      <div
        onClick={onSpawn}
        style={{
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        +
      </div>

      <div style={{ flex: 1 }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/renderer/components/Workspace/SubTabBar.jsx
git commit -m "feat: M2 SubTabBar component"
```

---

### Task 3: TerminalCard component

**Files:**
- Create: `src/renderer/components/Workspace/TerminalCard.jsx`

The card is a flex column: 26px header + flex-1 body. When `finished=true`: `smFinished` keyframe animates the box-shadow, border becomes `rgba(74,222,128,0.8)`, a 2px green ribbon appears at the top, body background shifts to `rgba(74,222,128,0.03)`, DONE badge appears in header, and `· click to acknowledge ·` hint appears in body. Clicking anywhere on the card calls `onClick` (which both focuses AND acknowledges if finished).

Line `kind` colors: `prompt`=`var(--accent)`, `ok`=`var(--ok)`, `err`=`var(--err)`, `dim`=`var(--text-dim)`, anything else=`var(--text-muted)`.

The blinking caret uses the `tcCaret` keyframe (already in `base.css`): `animation: tcCaret 1s step-end infinite`.

- [ ] **Step 1: Create the component**

Create `src/renderer/components/Workspace/TerminalCard.jsx`:

```jsx
import StatusDot from '../primitives/StatusDot.jsx';

const LINE_COLOR = {
  prompt: 'var(--accent)',
  ok:     'var(--ok)',
  err:    'var(--err)',
  dim:    'var(--text-dim)',
};

export default function TerminalCard({ term, active, finished, onClick }) {
  const border = finished
    ? '1px solid rgba(74,222,128,0.8)'
    : active
    ? '1px solid var(--pane-ring)'
    : '1px solid var(--border)';

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        border,
        cursor: 'default',
        position: 'relative',
        animation: finished ? 'smFinished 1.8s ease-in-out infinite' : 'none',
      }}
    >
      {/* Finished top ribbon */}
      {finished && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: 'var(--ok)',
          opacity: 0.85,
          zIndex: 1,
        }} />
      )}

      {/* Header */}
      <div style={{
        height: 26,
        flexShrink: 0,
        background: 'var(--chrome)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '0 8px',
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
      }}>
        <StatusDot
          kind={finished ? 'ok' : term.status === 'run' ? 'run' : term.status === 'err' ? 'err' : 'ok'}
          pulse={!finished && term.status === 'run'}
          size={5}
        />
        <span style={{ color: finished ? 'var(--ok)' : 'var(--text)', flex: 1 }}>
          {term.name}
        </span>
        {finished && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8.5,
            letterSpacing: '0.1em',
            color: 'var(--ok)',
            border: '1px solid rgba(74,222,128,0.4)',
            padding: '1px 4px',
            marginRight: 4,
          }}>
            DONE
          </span>
        )}
        <span style={{ color: 'var(--text-dim)' }}>{term.model}</span>
        <span style={{ color: 'var(--text-dim)', cursor: 'pointer' }}>_</span>
        <span style={{ color: 'var(--text-dim)', cursor: 'pointer' }}>×</span>
      </div>

      {/* Body */}
      <div style={{
        flex: 1,
        padding: '8px 10px',
        background: finished ? 'rgba(74,222,128,0.03)' : 'var(--bg)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11.5,
        lineHeight: 1.55,
        overflow: 'hidden',
      }}>
        {term.lines.map((l, i) => (
          <div key={i} style={{ color: LINE_COLOR[l.kind] ?? 'var(--text-muted)' }}>
            {l.t}
          </div>
        ))}
        {!finished && (
          <div style={{
            display: 'inline-block',
            width: 8,
            height: 13,
            background: 'var(--text)',
            verticalAlign: 'text-bottom',
            animation: 'tcCaret 1s step-end infinite',
            marginTop: 2,
          }} />
        )}
        {finished && (
          <div style={{
            color: 'rgba(74,222,128,0.5)',
            fontSize: 10,
            marginTop: 4,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
          }}>
            · click to acknowledge ·
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/renderer/components/Workspace/TerminalCard.jsx
git commit -m "feat: M2 TerminalCard with finished-state glow"
```

---

### Task 4: TerminalGrid component

**Files:**
- Create: `src/renderer/components/Workspace/TerminalGrid.jsx`

Column count by terminal count:
- 0 or 1 → 1 col
- 2, 3, 4 → 2 cols
- 5+ → 3 cols

When there are 0 terminals, renders the empty state instead of a grid.

- [ ] **Step 1: Create the component**

Create `src/renderer/components/Workspace/TerminalGrid.jsx`:

```jsx
import TerminalCard from './TerminalCard.jsx';

function colCount(n) {
  if (n <= 1) return 1;
  if (n <= 4) return 2;
  return 3;
}

function EmptyState() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      gap: 12,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: '0.2em',
      }}>
        NO TERMINALS
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        color: 'var(--text-dim)',
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 1.5,
      }}>
        Spawn a terminal or ask Spaceman to start a task. The workspace tiles agents side-by-side.
      </div>
    </div>
  );
}

export default function TerminalGrid({ terminals, activeId, finishedIds, onSelect, onAcknowledge }) {
  if (terminals.length === 0) return <EmptyState />;

  const cols = colCount(terminals.length);

  return (
    <div style={{
      flex: 1,
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 6,
      padding: 6,
      background: 'var(--bg-sunken)',
      minHeight: 0,
    }}>
      {terminals.map((t) => (
        <TerminalCard
          key={t.id}
          term={t}
          active={t.id === activeId}
          finished={finishedIds.has(t.id)}
          onClick={() => {
            onSelect(t.id);
            if (finishedIds.has(t.id)) onAcknowledge(t.id);
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/renderer/components/Workspace/TerminalGrid.jsx
git commit -m "feat: M2 TerminalGrid with auto-tiling and empty state"
```

---

### Task 5: SpacemanPromptStrip component

**Files:**
- Create: `src/renderer/components/Workspace/SpacemanPromptStrip.jsx`

44px strip at the bottom of the center column. `var(--bg)` background, `1px solid var(--border)` top border. Contains SpacemanMark glyph (18px), `SPACEMAN ›` label in accent, borderless text input, and `⏎` hint.

- [ ] **Step 1: Create the component**

Create `src/renderer/components/Workspace/SpacemanPromptStrip.jsx`:

```jsx
import { useState } from 'react';
import SpacemanMark from '../primitives/SpacemanMark.jsx';

export default function SpacemanPromptStrip({ onSubmit }) {
  const [val, setVal] = useState('');

  const handleKey = (e) => {
    if (e.key === 'Enter' && val.trim()) {
      onSubmit?.(val.trim());
      setVal('');
    }
  };

  return (
    <div style={{
      height: 44,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 14px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
    }}>
      <SpacemanMark size={18} />
      <span style={{
        color: 'var(--accent)',
        letterSpacing: '0.1em',
        fontSize: 10,
        flexShrink: 0,
      }}>
        SPACEMAN ›
      </span>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask Spaceman to do something…"
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text)',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
        }}
      />
      <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>⏎</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/renderer/components/Workspace/SpacemanPromptStrip.jsx
git commit -m "feat: M2 SpacemanPromptStrip"
```

---

### Task 6: Workspace container

**Files:**
- Create: `src/renderer/components/Workspace/index.jsx`

Composes SubTabBar → TerminalGrid → SpacemanPromptStrip into a flex column. Owns no state — all props flow from IDE.jsx.

- [ ] **Step 1: Create the component**

Create `src/renderer/components/Workspace/index.jsx`:

```jsx
import SubTabBar from './SubTabBar.jsx';
import TerminalGrid from './TerminalGrid.jsx';
import SpacemanPromptStrip from './SpacemanPromptStrip.jsx';

export default function Workspace({
  terminals,
  activeTermId,
  finishedIds,
  onSelectTerm,
  onCloseTerm,
  onSpawnTerm,
  onAcknowledge,
  onPromptSubmit,
}) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <SubTabBar
        terminals={terminals}
        activeId={activeTermId}
        onSelect={onSelectTerm}
        onClose={onCloseTerm}
        onSpawn={onSpawnTerm}
      />
      <TerminalGrid
        terminals={terminals}
        activeId={activeTermId}
        finishedIds={finishedIds}
        onSelect={onSelectTerm}
        onAcknowledge={onAcknowledge}
      />
      <SpacemanPromptStrip onSubmit={onPromptSubmit} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/renderer/components/Workspace/index.jsx
git commit -m "feat: M2 Workspace container"
```

---

### Task 7: Wire into IDE.jsx

**Files:**
- Modify: `src/renderer/IDE.jsx`

This task adds terminal state to IDE.jsx and replaces the center "NO TERMINALS" div with the real `<Workspace>` component.

New state to add:
- `terminals` — `useState(SEED_TERMINALS)`
- `activeTermId` — `useState('a1')`
- `finishedIds` — `useState(SEED_FINISHED_IDS)` (a `Set`)

New handlers:
- `handleSpawnTerm` — appends `makeTerminal()` to `terminals`, sets it as `activeTermId`
- `handleCloseTerm(id)` — removes terminal by id; if it was active, fall back to the last remaining terminal or `null`
- `handleAcknowledge(id)` — removes `id` from `finishedIds` Set (must create a new Set to trigger re-render)

- [ ] **Step 1: Write the updated IDE.jsx**

Replace the entire contents of `src/renderer/IDE.jsx` with:

```jsx
import { useState, useEffect } from 'react';
import NativeTitleBar from './components/NativeTitleBar.jsx';
import TopBar from './components/TopBar.jsx';
import StatusBar from './components/StatusBar.jsx';
import LeftRail from './components/LeftRail/index.jsx';
import CollapsedRail from './components/LeftRail/CollapsedRail.jsx';
import Workspace from './components/Workspace/index.jsx';
import ResizeHandle from './components/primitives/ResizeHandle.jsx';
import { SEED_PROJECTS } from './data/seedProjects.js';
import { SEED_TERMINALS, SEED_FINISHED_IDS, makeTerminal } from './data/seedTerminals.js';

function loadLayout() {
  try {
    return JSON.parse(localStorage.getItem('ds.v3.layout') || '{}');
  } catch {
    return {};
  }
}

export default function IDE() {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('ds.v3.tone') || 'terminal';
  });

  const [leftCollapsed, setLeftCollapsed]   = useState(() => loadLayout().leftCollapsed ?? false);
  const [rightCollapsed, setRightCollapsed] = useState(() => loadLayout().rightCollapsed ?? false);
  const [leftWidth, setLeftWidth]           = useState(() => loadLayout().leftWidth ?? 220);
  const [rightWidth, setRightWidth]         = useState(() => loadLayout().rightWidth ?? 340);
  const [railPage, setRailPage]             = useState(() => loadLayout().railPage ?? 'projects');

  const [projects]        = useState(SEED_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState('forge');

  const [terminals, setTerminals]     = useState(SEED_TERMINALS);
  const [activeTermId, setActiveTermId] = useState('a1');
  const [finishedIds, setFinishedIds] = useState(SEED_FINISHED_IDS);

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('ds.v3.tone', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('ds.v3.layout', JSON.stringify({
      leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage,
    }));
  }, [leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage]);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0];

  const handleSelectProject = (id) => {
    setActiveProjectId(id);
    setRailPage('files');
  };

  const handleCollapsedDotSelect = (id) => {
    setActiveProjectId(id);
    setLeftCollapsed(false);
    setRailPage('files');
  };

  const handleSpawnTerm = () => {
    const t = makeTerminal();
    setTerminals((prev) => [...prev, t]);
    setActiveTermId(t.id);
  };

  const handleCloseTerm = (id) => {
    setTerminals((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (id === activeTermId) {
        setActiveTermId(next.length > 0 ? next[next.length - 1].id : null);
      }
      return next;
    });
    setFinishedIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };

  const handleAcknowledge = (id) => {
    setFinishedIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };

  const projectTabs = projects.map((p) => ({
    id: p.id,
    name: p.name,
    activity: p.activity,
    dirty: p.dirty,
  }));

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <NativeTitleBar
        projectName={activeProject.name}
        branch={activeProject.branch}
        dirty={activeProject.dirty}
        modified={activeProject.dirty ? 2 : 0}
      />

      <TopBar
        activeThemeId={themeId}
        onThemeChange={setThemeId}
        projectTabs={projectTabs}
        activeProjectId={activeProjectId}
        onProjectSelect={setActiveProjectId}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        onToggleLeft={() => setLeftCollapsed((c) => !c)}
        onToggleRight={() => setRightCollapsed((c) => !c)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {leftCollapsed ? (
          <CollapsedRail
            projects={projects}
            activeProjectId={activeProjectId}
            onExpand={() => setLeftCollapsed(false)}
            onSelectProject={handleCollapsedDotSelect}
          />
        ) : (
          <LeftRail
            width={leftWidth}
            onResize={setLeftWidth}
            page={railPage}
            onPageChange={setRailPage}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelectProject}
            onFileOpen={() => {}}
          />
        )}

        <Workspace
          terminals={terminals}
          activeTermId={activeTermId}
          finishedIds={finishedIds}
          onSelectTerm={setActiveTermId}
          onCloseTerm={handleCloseTerm}
          onSpawnTerm={handleSpawnTerm}
          onAcknowledge={handleAcknowledge}
          onPromptSubmit={() => {}}
        />

        {!rightCollapsed && (
          <div style={{
            width: rightWidth, flexShrink: 0,
            background: 'var(--chrome)',
            borderLeft: '1px solid var(--border)',
            position: 'relative',
          }}>
            <ResizeHandle side="left" onResize={setRightWidth} min={200} max={900} />
            <div style={{
              padding: '10px 12px',
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: 'var(--text-dim)', letterSpacing: '0.14em',
            }}>
              SPACEMAN
            </div>
          </div>
        )}

        {rightCollapsed && (
          <div style={{
            width: 32, flexShrink: 0,
            background: 'var(--chrome)',
            borderLeft: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', paddingTop: 10,
          }}>
            <button
              onClick={() => setRightCollapsed(false)}
              style={{
                all: 'unset', cursor: 'pointer',
                width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                fontSize: 11,
              }}
            >◂</button>
          </div>
        )}
      </div>

      <StatusBar
        branch={activeProject.branch}
        projectName={activeProject.name}
        modified={activeProject.dirty ? 2 : 0}
      />

    </div>
  );
}
```

- [ ] **Step 2: Start the dev server and verify visually**

```bash
npm run dev
```

Check:
1. Two terminal cards visible (agent-1 and agent-2) in a 2-column grid
2. agent-1 has amber pulsing run dot; agent-2 has green ok dot
3. agent-2 card has `smFinished` glow, green ribbon, DONE badge, `· click to acknowledge ·`
4. Clicking agent-2 card removes the glow
5. Sub-tab bar shows two tabs; clicking a tab focuses that card (accent top border)
6. `×` on a tab closes that terminal
7. `+` spawns a new idle terminal
8. With 0 terminals, center shows the empty state text
9. With 3+ terminals, grid becomes 2 columns; with 5+ it goes to 3 columns
10. Spaceman prompt strip visible at bottom, accepts input, clears on Enter
11. All three themes render correctly

- [ ] **Step 3: Commit**

```bash
git add src/renderer/IDE.jsx
git commit -m "feat: M2 wire terminal grid into IDE — spawn, close, acknowledge, prompt strip"
```

---

## Self-Review

### Spec coverage

| Requirement | Task |
|---|---|
| Sub-tab bar with agent tabs, status dots, active accent border, spawn +, close × | Task 2 |
| Terminal grid auto-tiles: 1 col (≤1), 2 cols (2–4), 3 cols (5+) | Task 4 |
| Terminal card: header with status dot, name, model, minimize, close | Task 3 |
| Terminal card: body with colored lines, blinking caret | Task 3 |
| Finished-state glow (`smFinished` keyframe), green ribbon, DONE badge | Task 3 |
| `· click to acknowledge ·` hint; click clears finished state | Task 4 (onClick), Task 3 (render) |
| Empty state: NO TERMINALS + subtitle | Task 4 |
| Spaceman prompt strip: glyph, SPACEMAN label, input, ⏎ | Task 5 |
| Spawn handler: creates new terminal, makes it active | Task 7 |
| Close handler: removes terminal, falls back to last or null | Task 7 |
| Acknowledge handler: removes from finishedIds Set | Task 7 |
| Seed data: 2 terminals, a2 pre-finished | Task 1 |
| `makeTerminal()` factory for spawn | Task 1 |

### Placeholder scan

No TBDs, no "implement later", no "add error handling" phrases. All code is complete.

### Type consistency

- `finishedIds` is always a `Set` — created as `new Set(...)`, spread as `new Set(prev)` in handlers. Passed as `Set` to TerminalGrid which calls `.has(t.id)`. Consistent throughout.
- `term.lines` entries have shape `{ t: string, kind: string }` — used as `l.t` and `l.kind` in TerminalCard. Matches seed data.
- `makeTerminal()` returns the same shape as seed terminals (`id`, `name`, `model`, `status`, `lines`). Consistent.
- `onCloseTerm`, `onSelectTerm`, `onAcknowledge`, `onSpawnTerm`, `onPromptSubmit` prop names in Workspace match what IDE.jsx passes.
