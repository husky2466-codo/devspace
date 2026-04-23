// Workspace v2 — terminal grid center
// Sub-tab bar (per-terminal) + auto-tiling grid + minimized dock + Spaceman prompt

function WorkspaceCenter({ terminals, setTerminals, activeTermId, setActiveTermId }) {
  const open = terminals.filter(t => !t.minimized);
  const minimized = terminals.filter(t => t.minimized);

  const minimize = (id) => setTerminals(terminals.map(t => t.id === id ? { ...t, minimized: true } : t));
  const restore  = (id) => setTerminals(terminals.map(t => t.id === id ? { ...t, minimized: false } : t));
  const close    = (id) => {
    const next = terminals.filter(t => t.id !== id);
    setTerminals(next);
    if (activeTermId === id && next.length) setActiveTermId(next[0].id);
  };
  const spawn = () => {
    const n = terminals.length + 1;
    const id = `t-${Date.now()}`;
    const newT = makeTerminal(id, n);
    setTerminals([...terminals, newT]);
    setActiveTermId(id);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg)' }}>
      <TerminalTabBar
        terminals={terminals}
        activeId={activeTermId}
        setActiveId={setActiveTermId}
        onSpawn={spawn}
        onClose={close}
      />
      <TerminalGrid
        terminals={open}
        activeId={activeTermId}
        setActiveId={setActiveTermId}
        onMinimize={minimize}
        onClose={close}
      />
      {minimized.length > 0 && <MinimizedDock terminals={minimized} onRestore={restore} onClose={close} />}
    </div>
  );
}

// ============ SUB-TAB BAR ============
function TerminalTabBar({ terminals, activeId, setActiveId, onSpawn, onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      height: 28, flexShrink: 0,
      background: 'var(--bg-sunken)',
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto',
    }}>
      {terminals.map(t => {
        const active = t.id === activeId;
        return (
          <div key={t.id} onClick={() => setActiveId(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '0 10px 0 12px',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: active ? 'var(--text)' : 'var(--text-muted)',
            background: active ? 'var(--bg)' : 'transparent',
            borderRight: '1px solid var(--border)',
            borderTop: active ? '1px solid var(--accent)' : '1px solid transparent',
            cursor: 'pointer', flexShrink: 0,
            letterSpacing: '0.02em',
          }}>
            <V2StatusDot kind={t.status === 'run' ? 'run' : t.status === 'err' ? 'err' : 'ok'} pulse={t.status === 'run'} />
            <span>{t.name}</span>
            {t.minimized && <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>▬</span>}
            <span onClick={(e) => { e.stopPropagation(); onClose(t.id); }} style={{
              color: 'var(--text-dim)', marginLeft: 2, fontSize: 11,
              width: 14, textAlign: 'center',
            }}>×</span>
          </div>
        );
      })}
      <div onClick={onSpawn} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 12px',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-muted)',
        cursor: 'pointer',
        letterSpacing: '0.02em',
      }}>
        <span style={{ color: 'var(--accent)' }}>+</span>
        <span>spawn</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 12px',
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--text-dim)', letterSpacing: '0.1em',
      }}>
        <span>{terminals.filter(t => !t.minimized).length} open · {terminals.filter(t => t.minimized).length} min</span>
      </div>
    </div>
  );
}

// ============ GRID ============
function TerminalGrid({ terminals, activeId, setActiveId, onMinimize, onClose }) {
  // Auto-tile. 1=full, 2=2cols, 3=2x2 with one big, 4=2x2, 5-6=3x2, 7-9=3x3
  const n = terminals.length;
  if (n === 0) return <EmptyWorkspace />;

  const gridTemplate = (() => {
    if (n === 1) return { cols: 1, rows: 1 };
    if (n === 2) return { cols: 2, rows: 1 };
    if (n <= 4) return { cols: 2, rows: 2 };
    if (n <= 6) return { cols: 3, rows: 2 };
    if (n <= 9) return { cols: 3, rows: 3 };
    return { cols: 4, rows: Math.ceil(n / 4) };
  })();

  return (
    <div style={{
      flex: 1, minHeight: 0, padding: 8,
      display: 'grid',
      gridTemplateColumns: `repeat(${gridTemplate.cols}, 1fr)`,
      gridTemplateRows: `repeat(${gridTemplate.rows}, 1fr)`,
      gap: 8,
    }}>
      {terminals.map(t => (
        <TerminalCard
          key={t.id}
          term={t}
          active={t.id === activeId}
          onFocus={() => setActiveId(t.id)}
          onMinimize={() => onMinimize(t.id)}
          onClose={() => onClose(t.id)}
        />
      ))}
    </div>
  );
}

function EmptyWorkspace() {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12,
      color: 'var(--text-muted)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-dim)', letterSpacing: '0.2em',
      }}>NO TERMINALS</div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 360, textAlign: 'center', lineHeight: 1.5 }}>
        Spawn a terminal or ask Spaceman to start a task. The workspace tiles agents side-by-side.
      </div>
    </div>
  );
}

// ============ TERMINAL CARD ============
function TerminalCard({ term, active, onFocus, onMinimize, onClose }) {
  return (
    <div onClick={onFocus} style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-pane)',
      border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
      minHeight: 0, minWidth: 0,
      overflow: 'hidden',
      boxShadow: active ? '0 0 0 1px var(--accent-soft) inset' : 'none',
    }}>
      <TerminalCardHeader term={term} active={active} onMinimize={onMinimize} onClose={onClose} />
      <TerminalCardBody term={term} />
    </div>
  );
}

function TerminalCardHeader({ term, active, onMinimize, onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 8px 6px 10px',
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)', fontSize: 10.5,
      color: 'var(--text-muted)',
      height: 26, flexShrink: 0,
    }}>
      <V2StatusDot kind={term.status === 'run' ? 'run' : term.status === 'err' ? 'err' : 'ok'} pulse={term.status === 'run'} />
      <span style={{ color: 'var(--text)', letterSpacing: '0.02em' }}>{term.name}</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>{term.cwd}</span>
      {term.model && (<>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <span style={{ color: 'var(--accent)' }}>{term.model}</span>
      </>)}
      <span style={{ flex: 1 }} />
      <WindowButton label="—" onClick={onMinimize} title="Minimize" />
      <WindowButton label="×" onClick={onClose} title="Close" danger />
    </div>
  );
}

function WindowButton({ label, onClick, title, danger }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      title={title}
      style={{
        all: 'unset', cursor: 'pointer',
        width: 18, height: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 12,
        color: 'var(--text-muted)',
        border: '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = danger ? 'var(--err)' : 'var(--text)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-muted)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >{label}</button>
  );
}

function TerminalCardBody({ term }) {
  return (
    <div style={{
      flex: 1, minHeight: 0, overflowY: 'auto',
      padding: '10px 12px',
      fontFamily: 'var(--font-mono)', fontSize: 11.5, lineHeight: 1.55,
      background: 'var(--bg-pane)',
    }}>
      {term.lines.map((ln, i) => <TerminalLine key={i} line={ln} />)}
      {term.status === 'run' && (
        <div style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--text)' }}>$</span>{' '}
          <span style={{
            display: 'inline-block', width: 7, height: 12, background: 'var(--text)',
            verticalAlign: 'text-bottom', animation: 'tcCaret 1s step-end infinite',
          }} />
        </div>
      )}
    </div>
  );
}

function TerminalLine({ line }) {
  const color = {
    prompt: 'var(--text-dim)',
    cmd: 'var(--text)',
    out: 'var(--text-muted)',
    ok: 'var(--ok)',
    warn: 'var(--warn)',
    err: 'var(--err)',
    info: 'var(--accent)',
    dim: 'var(--text-dim)',
  }[line.kind] || 'var(--text-muted)';
  return (
    <div style={{ color, whiteSpace: 'pre-wrap' }}>
      {line.prompt && <span style={{ color: 'var(--text-dim)' }}>{line.prompt} $ </span>}
      {line.text}
    </div>
  );
}

// ============ MINIMIZED DOCK ============
function MinimizedDock({ terminals, onRestore, onClose }) {
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex', flexWrap: 'wrap', gap: 6,
      padding: '8px 10px',
      background: 'var(--bg-sunken)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        color: 'var(--text-dim)', letterSpacing: '0.2em',
        padding: '4px 6px 4px 0',
      }}>MIN</div>
      {terminals.map(t => (
        <div key={t.id} onClick={() => onRestore(t.id)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 4px 4px 10px',
          background: 'linear-gradient(180deg, var(--chrome), var(--bg-pane))',
          border: '1px solid var(--border)',
          borderLeft: `2px solid ${t.status === 'run' ? 'var(--running)' : t.status === 'err' ? 'var(--err)' : 'var(--ok)'}`,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text)',
          cursor: 'pointer',
          height: 24,
        }}>
          <V2StatusDot kind={t.status === 'run' ? 'run' : t.status === 'err' ? 'err' : 'ok'} pulse={t.status === 'run'} />
          <span>{t.name}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>{t.cwd}</span>
          <span onClick={(e) => { e.stopPropagation(); onClose(t.id); }} style={{
            color: 'var(--text-dim)', marginLeft: 4, padding: '0 6px',
            fontSize: 11, cursor: 'pointer',
          }}>×</span>
        </div>
      ))}
    </div>
  );
}

// ============ SPACEMAN PROMPT STRIP ============
function SpacemanPromptStrip({ activeTerm }) {
  return (
    <div style={{
      flexShrink: 0,
      borderTop: '1px solid var(--border)',
      background: 'var(--chrome)',
      padding: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px 8px 12px',
        border: '1px solid var(--border-strong)',
        background: 'var(--bg-raised)',
      }}>
        <SpacemanGlyph size={18} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--accent)', letterSpacing: '0.14em',
        }}>SPACEMAN</span>
        <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>›</span>
        <span style={{
          flex: 1,
          fontFamily: 'var(--font-mono)', fontSize: 12.5,
          color: 'var(--text-muted)',
        }}>
          spawn terminal, run task, or ask — routes to
          <span style={{ color: 'var(--text)' }}> {activeTerm ? activeTerm.name : 'the workspace'}</span>
        </span>
        <span style={{
          fontSize: 10, color: 'var(--text-dim)',
          border: '1px solid var(--border)', padding: '1px 5px',
          fontFamily: 'var(--font-mono)',
        }}>⌘↵</span>
      </div>
    </div>
  );
}

// ============ SEED DATA ============
function makeTerminal(id, n) {
  return {
    id, name: `agent-${n}`, cwd: '~/forge', status: 'run',
    model: 'sonnet',
    minimized: false,
    lines: [
      { kind: 'prompt', prompt: '~/forge', text: 'claude-code --agent' },
      { kind: 'dim', text: 'Claude Code v2.1.72' },
      { kind: 'out', text: 'Opus 4.6 with high effort' },
      { kind: 'dim', text: 'spawned by Spaceman' },
    ],
  };
}

function seedTerminals() {
  return [
    {
      id: 't-1', name: 'agent-x', cwd: '~/forge', status: 'run', model: 'sonnet',
      minimized: false,
      lines: [
        { kind: 'prompt', prompt: 'mattheww@Mac-Studio dev-space', text: 'claude-code' },
        { kind: 'dim', text: 'Claude Code v2.1.72' },
        { kind: 'out', text: 'Opus 4.6 with high effort' },
        { kind: 'dim', text: '~/Desktop/dev-space' },
        { kind: 'out', text: '' },
        { kind: 'info', text: '◢ planning: refactor theme variables' },
        { kind: 'out', text: '  scanning 14 files across /src/styles…' },
        { kind: 'ok', text: '  ✓ located 38 usages' },
        { kind: 'out', text: '  drafting migration plan' },
      ],
    },
    {
      id: 't-2', name: 'agent-1', cwd: '~/forge', status: 'run', model: 'sonnet',
      minimized: false,
      lines: [
        { kind: 'prompt', prompt: 'mattheww@Mac-Studio dev-space', text: 'claude-code' },
        { kind: 'dim', text: 'Claude Code v2.1.72' },
        { kind: 'out', text: 'Claude Max' },
        { kind: 'dim', text: '~/Desktop/dev-space' },
        { kind: 'out', text: '' },
        { kind: 'info', text: '◢ writing: src/components/terminal/Terminal.jsx' },
        { kind: 'ok', text: '  ✓ applied 4 edits' },
        { kind: 'out', text: '  running: pnpm test terminal' },
      ],
    },
    {
      id: 't-3', name: 'agent-2', cwd: '~/forge', status: 'ok', model: 'haiku',
      minimized: false,
      lines: [
        { kind: 'prompt', prompt: 'mattheww@Mac-Studio dev-space', text: 'pnpm build' },
        { kind: 'out', text: 'vite v5.4.10 building for production...' },
        { kind: 'out', text: '✓ 1,284 modules transformed.' },
        { kind: 'ok', text: '✓ built in 2.48s' },
        { kind: 'prompt', prompt: 'mattheww@Mac-Studio dev-space', text: 'git status' },
        { kind: 'warn', text: 'modified:  src/styles/variables.css' },
        { kind: 'warn', text: 'modified:  src/components/terminal/Terminal.jsx' },
      ],
    },
    {
      id: 't-4', name: 'agent-3', cwd: '~/forge', status: 'run', model: 'sonnet',
      minimized: true,
      lines: [
        { kind: 'prompt', prompt: '~/forge', text: 'claude-code --dev' },
        { kind: 'info', text: '◢ watching: src/**/*.jsx' },
      ],
    },
  ];
}

Object.assign(window, {
  WorkspaceCenter, TerminalTabBar, TerminalGrid, TerminalCard, MinimizedDock,
  SpacemanPromptStrip, makeTerminal, seedTerminals,
});
