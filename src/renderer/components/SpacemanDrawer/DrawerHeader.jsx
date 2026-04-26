import { useState } from 'react';
import SpacemanMark from '../primitives/SpacemanMark.jsx';
import StatusDot from '../primitives/StatusDot.jsx';
import PersonaPanel from './PersonaPanel.jsx';

export default function DrawerHeader({ mode, onToggleMode, projectName, branch, onOpenSettings }) {
  const [personaOpen, setPersonaOpen] = useState(false);
  return (
    <div style={{ flexShrink: 0, background: 'var(--chrome)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ padding: '8px 12px' }}>
      {/* Row 1: mark + label + toggle + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SpacemanMark size={18} mode={mode} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.08em',
          color: mode === 'global' ? 'var(--accent-global)' : 'var(--text)',
        }}>
          SPACEMAN
        </span>

        {/* PROJECT | GLOBAL segmented control */}
        <div
          role="group"
          aria-label="Spaceman scope"
          style={{
            display: 'inline-flex',
            border: `1px solid ${mode === 'global' ? 'var(--accent-global)' : 'var(--border)'}`,
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.1em',
            marginLeft: 4,
          }}
        >
          {['PROJECT', 'GLOBAL'].map((seg) => {
            const active = (seg === 'PROJECT' && mode === 'project') || (seg === 'GLOBAL' && mode === 'global');
            return (
              <button
                key={seg}
                onClick={() => onToggleMode(seg.toLowerCase())}
                aria-pressed={active}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '2px 7px',
                  color: active ? 'var(--bg)' : 'var(--text-muted)',
                  background: active
                    ? seg === 'GLOBAL' ? 'var(--accent-global)' : 'var(--accent)'
                    : 'transparent',
                }}
              >
                {seg}
              </button>
            );
          })}
        </div>

        <span style={{ flex: 1 }} />

        {/* Status indicator */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: '0.1em',
          color: mode === 'global' ? 'var(--accent-global)' : 'var(--accent)',
        }}>
          <StatusDot
            kind={mode === 'global' ? 'idle' : 'run'}
            pulse={mode === 'project'}
            size={5}
          />
          {mode === 'global' ? 'OBSERVING' : 'WATCHING'}
        </span>

        {/* Persona quick-panel toggle */}
        <button
          onClick={() => setPersonaOpen((o) => !o)}
          title="Persona config"
          style={{
            all: 'unset',
            cursor: 'pointer',
            marginLeft: 6,
            color: personaOpen ? 'var(--accent)' : 'var(--text-dim)',
            fontSize: 13,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ⚙
        </button>
      </div>

      {/* Row 2: context strip */}
      <div style={{
        marginTop: 7,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 8px',
        background: 'var(--bg)',
        fontSize: 9.5,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.04em',
        borderLeft: `2px solid ${mode === 'global' ? 'var(--accent-global)' : 'var(--accent)'}`,
      }}>
        {mode === 'project' ? (
          <>
            <StatusDot kind="run" pulse size={5} />
            <span style={{ color: 'var(--text)' }}>{projectName}</span>
            <span style={{ color: 'var(--text-dim)' }}>· {branch}</span>
            <span style={{ flex: 1 }} />
            <span style={{ color: 'var(--text-dim)' }}>senior engineer</span>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--accent-global)', letterSpacing: '0.14em' }}>GLOBAL</span>
            <span style={{ color: 'var(--text-dim)' }}>· 4 projects · read-only · dispatch</span>
            <span style={{ flex: 1 }} />
            <span style={{ color: 'var(--text-dim)' }}>haiku router</span>
          </>
        )}
      </div>
      </div>
      {personaOpen && (
        <PersonaPanel onOpenSettings={() => { setPersonaOpen(false); onOpenSettings?.(); }} />
      )}
    </div>
  );
}
