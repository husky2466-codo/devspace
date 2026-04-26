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
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            aria-pressed={isActive}
            style={{
              all: 'unset', boxSizing: 'border-box',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              background: isActive ? 'var(--bg)' : 'transparent',
              borderRight: '1px solid var(--border)',
              borderTop: isActive ? '1px solid var(--accent)' : '1px solid transparent',
              cursor: 'pointer',
              flexShrink: 0, height: '100%',
            }}
          >
            <StatusDot kind={t.status} pulse={t.status === 'run'} size={5} />
            <span>{t.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(t.id); }}
              aria-label={`Close ${t.name}`}
              style={{
                all: 'unset',
                color: 'var(--text-dim)', cursor: 'pointer', marginLeft: 2,
              }}
            >
              ×
            </button>
          </button>
        );
      })}

      <button
        onClick={onSpawn}
        aria-label="New terminal"
        style={{
          all: 'unset',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          fontSize: 14,
          flexShrink: 0, height: '100%',
        }}
      >
        +
      </button>

      <div style={{ flex: 1 }} />
    </div>
  );
}
