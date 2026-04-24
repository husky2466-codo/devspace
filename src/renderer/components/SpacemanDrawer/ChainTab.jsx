import StatusDot from '../primitives/StatusDot.jsx';

export default function ChainTab({ chain, mode }) {
  if (!chain?.steps?.length) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
          marginBottom: 8,
        }}>
          NO CHAIN ACTIVE
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Multi-step plans from Spaceman appear here.
        </div>
      </div>
    );
  }

  const headerColor = mode === 'global' ? 'var(--accent-global)' : 'var(--text-dim)';

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: headerColor,
        letterSpacing: '0.14em',
        marginBottom: 8,
      }}>
        {mode === 'global' && '◉ GLOBAL · '}CHAIN · {chain.name}
      </div>
      {chain.steps.map((s) => (
        <div key={s.n} style={{
          display: 'grid',
          gridTemplateColumns: '20px 1fr 14px',
          gap: 10,
          padding: '8px 0',
          borderBottom: '1px solid var(--border)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-dim)',
            textAlign: 'right',
          }}>
            {String(s.n).padStart(2, '0')}
          </span>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: s.status === 'idle' ? 'var(--text-muted)' : 'var(--text)',
          }}>
            {s.name}
            {mode === 'global' && s.project && (
              <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>→ {s.project}</div>
            )}
          </div>
          <StatusDot
            kind={s.status === 'ok' ? 'ok' : s.status === 'run' ? 'run' : 'idle'}
            pulse={s.status === 'run'}
            size={5}
          />
        </div>
      ))}
    </div>
  );
}
