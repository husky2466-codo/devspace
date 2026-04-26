import { useEffect, useRef } from 'react';

const SECTIONS = [
  {
    heading: 'IMPORT',
    items: [
      { id: 'import-local',  label: 'Local',   sub: 'Register an existing folder on this machine' },
      { id: 'import-remote', label: 'Remote',  sub: 'Register an existing folder on a remote host' },
    ],
  },
  {
    heading: 'CREATE',
    items: [
      { id: 'create-local',   label: 'Local',          sub: 'Scaffold a new project on this machine' },
      { id: 'create-remote',  label: 'Remote',         sub: 'Scaffold a new project on a remote host' },
      { id: 'clone-local',    label: 'Clone → Local',  sub: 'Git clone to this machine' },
      { id: 'clone-remote',   label: 'Clone → Remote', sub: 'Git clone to a remote host' },
    ],
  },
];

export default function NewProjectPicker({ onSelect, onClose }) {
  const ref = useRef(null);

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
      style={{
        position: 'absolute',
        top: 36,
        left: 12,
        zIndex: 100,
        width: 280,
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-strong, var(--border))',
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
      }}
    >
      {SECTIONS.map((section, si) => (
        <div key={section.heading}>
          <div style={{
            padding: '7px 12px 5px',
            borderTop: si > 0 ? '1px solid var(--border)' : 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-dim)',
            letterSpacing: '0.16em',
          }}>
            {section.heading}
          </div>
          {section.items.map((v) => (
            <div
              key={v.id}
              onClick={() => { onSelect(v.id); onClose(); }}
              style={{
                padding: '8px 12px 8px 20px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-sunken)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', marginBottom: 2 }}>
                {v.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                {v.sub}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
