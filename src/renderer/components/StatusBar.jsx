import StatusDot from './primitives/StatusDot.jsx';

export default function StatusBar({
  branch = 'main',
  projectName = '',
  modified = 0,
  onComputeClick,
  cursorLine = 1,
  cursorCol = 1,
  language = '',
}) {
  const hasProject = !!projectName;

  return (
    <div style={{
      height: 24, flexShrink: 0,
      background: 'var(--chrome)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      gap: 12, padding: '0 12px',
      fontFamily: 'var(--font-mono)', fontSize: 10.5,
      color: 'var(--text-muted)',
      letterSpacing: '0.04em',
    }}>
      {hasProject ? (
        <>
          <StatusDot kind="ok" size={5} />
          <span>{branch}</span>
          <span style={{ color: 'var(--text-dim)' }}>·</span>
          <span>{projectName}</span>
          {modified > 0 && (
            <>
              <span style={{ color: 'var(--text-dim)' }}>·</span>
              <span style={{ color: 'var(--warn)' }}>{modified} modified</span>
            </>
          )}
        </>
      ) : (
        <span style={{ color: 'var(--text-dim)' }}>— no project open —</span>
      )}
      <div style={{ flex: 1 }} />
      <button
        onClick={onComputeClick}
        style={{
          all: 'unset',
          cursor: 'pointer',
          color: 'var(--accent)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.04em',
        }}
      >
        COMPUTE
      </button>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      {language && (
        <>
          <span>{language}</span>
          <span style={{ color: 'var(--text-dim)' }}>·</span>
        </>
      )}
      <span>ln {cursorLine}, col {cursorCol}</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>utf-8</span>
    </div>
  );
}
