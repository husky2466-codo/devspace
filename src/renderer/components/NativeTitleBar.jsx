import StatusDot from './primitives/StatusDot.jsx';

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
      {/* Spacer for native macOS traffic light buttons (positioned at x:12, y:8) */}
      <div style={{ width: 80, flexShrink: 0 }} />

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
              color: 'var(--warn)', letterSpacing: '0.08em',
            }}>
              {modified} MODIFIED
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
