import { useState } from 'react';

const TOGGLES = [
  { key: 'autoSpawn',   label: 'Auto-spawn terminals' },
  { key: 'propose',     label: 'Propose before editing' },
  { key: 'runTests',    label: 'Run tests after edits' },
  { key: 'useMemory',   label: 'Use memory as context' },
];

const TOOLS = ['edit', 'read', 'grep', 'bash', 'spawn', 'git', 'test'];

function MiniSwitch({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 26,
        height: 14,
        background: on ? 'var(--accent)' : 'var(--bg-sunken)',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 1,
        left: on ? 13 : 1,
        width: 10,
        height: 10,
        background: on ? 'var(--bg)' : 'var(--text-muted)',
        transition: 'left 140ms ease',
      }} />
    </div>
  );
}

export default function PersonaPanel({ onOpenSettings }) {
  const [toggles, setToggles] = useState({
    autoSpawn: true,
    propose: false,
    runTests: true,
    useMemory: true,
  });
  const [tools, setTools] = useState(new Set(['edit', 'read', 'grep', 'bash', 'spawn', 'git']));

  const flipToggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));
  const flipTool = (tool) => setTools((prev) => {
    const next = new Set(prev);
    next.has(tool) ? next.delete(tool) : next.add(tool);
    return next;
  });

  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-raised)',
    }}>
      {/* Preset row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 12px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>
            Senior Engineer
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginLeft: 6 }}>
            sonnet-4.5
          </span>
        </div>
        <button
          onClick={onOpenSettings}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--accent)',
            letterSpacing: '0.04em',
          }}
        >
          ⎘ change
        </button>
      </div>

      {/* Toggles */}
      <div style={{ padding: '6px 0' }}>
        {TOGGLES.map(({ key, label }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 12px',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)' }}>
              {label}
            </span>
            <MiniSwitch on={toggles[key]} onChange={() => flipToggle(key)} />
          </div>
        ))}
      </div>

      {/* Tool allow-list */}
      <div style={{
        padding: '0 12px 8px',
        borderTop: '1px solid var(--border)',
        paddingTop: 8,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          color: 'var(--text-dim)',
          letterSpacing: '0.1em',
          marginBottom: 6,
        }}>
          TOOLS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {TOOLS.map((tool) => {
            const enabled = tools.has(tool);
            return (
              <button
                key={tool}
                onClick={() => flipTool(tool)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  padding: '2px 7px',
                  border: `1px solid ${enabled ? 'var(--accent)' : 'var(--border)'}`,
                  background: enabled ? 'var(--accent-soft)' : 'transparent',
                  color: enabled ? 'var(--accent)' : 'var(--text-dim)',
                  textDecoration: enabled ? 'none' : 'line-through',
                  letterSpacing: '0.04em',
                }}
              >
                {tool}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        padding: '6px 12px',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        color: 'var(--text-dim)',
        lineHeight: 1.5,
      }}>
        Quick toggles only. Full config in ⌘, Settings · Spaceman
      </div>
    </div>
  );
}
