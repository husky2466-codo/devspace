import { useState } from 'react';
import StatusDot from './primitives/StatusDot.jsx';

function TrafficLights() {
  const [hovered, setHovered] = useState(false);
  const buttons = [
    { bg: '#ff5f57', glyph: '×' },
    { bg: '#febc2e', glyph: '−' },
    { bg: '#28c840', glyph: '+' },
  ];
  return (
    <div
      className="no-drag"
      style={{ display: 'flex', gap: 8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {buttons.map(({ bg, glyph }) => (
        <div
          key={bg}
          style={{
            width: 12, height: 12, borderRadius: 999,
            background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(0,0,0,0.55)', fontSize: 8, fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {hovered ? glyph : ''}
        </div>
      ))}
    </div>
  );
}

export default function NativeTitleBar({ projectName = 'dev-space', branch = 'main', dirty = false, modified = 0 }) {
  return (
    <div
      className="drag-region"
      style={{
        height: 28,
        flexShrink: 0,
        background: 'var(--chrome)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        position: 'relative',
      }}
    >
      <TrafficLights />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
            color: 'var(--text)',
          }}>
            {projectName}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-dim)', letterSpacing: '0.04em',
          }}>
            ⎇ {branch}
          </span>
          {dirty && <StatusDot kind="warn" size={5} />}
          {modified > 0 && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9.5,
              color: 'var(--text-dim)', letterSpacing: '0.08em',
            }}>
              {modified} MODIFIED
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
