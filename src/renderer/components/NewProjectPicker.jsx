import { useState, useEffect, useRef } from 'react';

const VARIANTS = [
  { id: 'local',         label: 'Local',          sub: 'Open a folder on this machine' },
  { id: 'remote',        label: 'Remote',          sub: 'Connect to a remote host via SSH' },
  { id: 'clone-local',   label: 'Clone → Local',   sub: 'Git clone to this machine' },
  { id: 'clone-remote',  label: 'Clone → Remote',  sub: 'Git clone to a remote host' },
];

export default function NewProjectPicker({ onSelect, onClose }) {
  const ref = useRef(null);
  const [hoverId, setHoverId] = useState(null);

  useEffect(() => {
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="New project type"
      style={{
        position: 'absolute',
        top: 36,
        left: 12,
        zIndex: 100,
        width: 260,
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-strong, var(--border))',
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
      }}
    >
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: '0.14em',
      }}>
        NEW PROJECT
      </div>
      {VARIANTS.map((v) => (
        <button
          key={v.id}
          role="menuitem"
          onClick={() => { onSelect(v.id); onClose(); }}
          onMouseEnter={() => setHoverId(v.id)}
          onMouseLeave={() => setHoverId(null)}
          style={{
            all: 'unset', boxSizing: 'border-box', width: '100%',
            display: 'block',
            padding: '9px 12px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border)',
            background: hoverId === v.id ? 'var(--bg-sunken)' : 'transparent',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', marginBottom: 2 }}>
            {v.label}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
            {v.sub}
          </div>
        </button>
      ))}
    </div>
  );
}
