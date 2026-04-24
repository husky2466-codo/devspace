import { useState } from 'react';
import SpacemanMark from '../primitives/SpacemanMark.jsx';

const SCOPE_PROJECTS = ['forge', 'archivist', 'mindcraft', 'routines'];

export default function PromptStrip({ mode, activeTab, onSubmit }) {
  const [val, setVal] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && val.trim()) {
      onSubmit?.(val.trim());
      setVal('');
    }
  };

  const placeholder = mode === 'global'
    ? 'Dispatch or ask across projects…'
    : activeTab === 'editor'
    ? 'Ask about this file…'
    : 'Ask Spaceman to do something…';

  const labelColor = mode === 'global' ? 'var(--accent-global)' : 'var(--accent)';

  return (
    <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--chrome)' }}>
      {mode === 'global' && (
        <div style={{
          padding: '5px 10px 2px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          flexWrap: 'wrap',
        }}>
          <span style={{ color: 'var(--accent-global)', letterSpacing: '0.1em' }}>scope</span>
          {SCOPE_PROJECTS.map((p, i) => (
            <span key={p} style={{
              padding: '2px 6px',
              border: `1px solid ${i < 2 ? 'var(--accent-global)' : 'var(--border)'}`,
              color: i < 2 ? 'var(--accent-global)' : 'var(--text-dim)',
              background: i < 2 ? 'var(--accent-global-soft)' : 'transparent',
              letterSpacing: '0.08em',
            }}>
              {p}
            </span>
          ))}
        </div>
      )}
      <div style={{
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
      }}>
        <SpacemanMark size={18} mode={mode} />
        <span style={{ color: labelColor, letterSpacing: '0.1em' }}>
          ✦ {mode === 'global' ? 'GLOBAL' : 'SPACEMAN'}
        </span>
        <span style={{ color: 'var(--text-dim)' }}>›</span>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
        <span style={{ color: 'var(--text-dim)' }}>⏎</span>
      </div>
    </div>
  );
}
