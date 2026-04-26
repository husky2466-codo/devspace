export default function RailHeader({ label, onAction }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 14px 7px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      <span style={{
        flex: 1,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: '0.14em',
      }}>
        {label}
      </span>
      <button
        onClick={onAction}
        aria-label="New project"
        style={{
          all: 'unset',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px 6px',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.08em',
        }}
      >
        + NEW
      </button>
    </div>
  );
}
