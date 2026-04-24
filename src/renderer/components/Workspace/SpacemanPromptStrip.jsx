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
