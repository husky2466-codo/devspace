import StatusDot from './primitives/StatusDot.jsx';

export default function StatusBar({ branch = 'main', projectName = 'dev-space', modified = 0 }) {
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
      <div style={{ flex: 1 }} />
      <span style={{ color: 'var(--text-dim)' }}>DGX</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>ln 1, col 1</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>utf-8</span>
    </div>
  );
}
