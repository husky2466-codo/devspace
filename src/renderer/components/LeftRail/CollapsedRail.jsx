import StatusDot from '../primitives/StatusDot.jsx';

export default function CollapsedRail({ projects, activeProjectId, onExpand, onSelectProject }) {
  return (
    <div style={{
      width: 32,
      flexShrink: 0,
      background: 'var(--chrome)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 10,
      gap: 10,
    }}>
      <button
        onClick={onExpand}
        style={{
          all: 'unset',
          cursor: 'pointer',
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        ▸
      </button>

      {projects.map((p) => (
        <button
          key={p.id}
          title={p.name}
          onClick={() => onSelectProject(p.id)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            background: p.id === activeProjectId ? 'var(--accent-soft)' : 'transparent',
            borderLeft: p.id === activeProjectId ? '2px solid var(--accent)' : '2px solid transparent',
          }}
        >
          <StatusDot
            kind={p.activity === 'run' ? 'run' : 'idle'}
            size={5}
            pulse={p.activity === 'run'}
          />
        </button>
      ))}
    </div>
  );
}
