import StatusDot from '../primitives/StatusDot.jsx';

export default function ProjectRow({ project, active, onSelect }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      style={{
        all: 'unset', boxSizing: 'border-box', width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 10px 7px 12px',
        background: active ? 'var(--accent-soft)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
        cursor: 'pointer',
      }}
    >
      <StatusDot
        kind={project.activity === 'run' ? 'run' : 'idle'}
        size={5}
        pulse={project.activity === 'run'}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {project.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          marginTop: 1,
        }}>
          {project.branch} · {project.last}
        </div>
      </div>
      {project.dirty && (
        <span style={{ color: 'var(--warn)', fontSize: 9 }}>●</span>
      )}
    </button>
  );
}
