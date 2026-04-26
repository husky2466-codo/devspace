import StatusDot from '../primitives/StatusDot.jsx';
import XTermPanel from './XTermPanel.jsx';

export default function TerminalCard({ term, active, finished, onClick }) {
  const border = finished
    ? '1px solid color-mix(in srgb, var(--ok) 80%, transparent)'
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
          kind={finished ? 'ok' : term.status === 'run' ? 'run' : term.status === 'err' ? 'err' : term.status === 'idle' ? 'idle' : 'ok'}
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
            border: '1px solid color-mix(in srgb, var(--ok) 40%, transparent)',
            padding: '1px 4px',
            marginRight: 4,
          }}>
            DONE
          </span>
        )}
        <span style={{ color: 'var(--text-dim)' }}>{term.model}</span>
        <span style={{ color: 'var(--text-dim)' }}>_</span>
        <span style={{ color: 'var(--text-dim)' }}>×</span>
      </div>

      {/* Body */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: finished ? 'color-mix(in srgb, var(--ok) 3%, var(--bg))' : 'var(--bg)',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {!finished && (
          <XTermPanel termId={term.id} cwd={term.cwd} active={active} />
        )}
        {finished && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'color-mix(in srgb, var(--ok) 50%, transparent)',
            fontSize: 10,
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
