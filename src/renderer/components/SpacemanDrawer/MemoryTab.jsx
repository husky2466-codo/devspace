export default function MemoryTab({ mems, mode }) {
  if (!mems?.length) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
          marginBottom: 8,
        }}>
          NO MEMORIES YET
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Decisions and patterns Spaceman learns appear here.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
      {mems.map((m, i) => (
        <div key={i} style={{ padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: mode === 'global' ? 'var(--accent-global)' : 'var(--text-dim)',
            letterSpacing: '0.14em',
            marginBottom: 4,
          }}>
            {m.t}
            {mode === 'global' && m.project && (
              <span style={{ color: 'var(--accent-global)', marginLeft: 6 }}>· {m.project}</span>
            )}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.45 }}>{m.c}</div>
        </div>
      ))}
    </div>
  );
}
