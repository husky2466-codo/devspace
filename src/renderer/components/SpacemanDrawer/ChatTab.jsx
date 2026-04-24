export default function ChatTab({ messages, mode }) {
  if (!messages?.length) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
          marginBottom: 8,
        }}>
          NO MESSAGES YET
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {mode === 'global'
            ? 'Ask across all projects from the prompt below.'
            : 'Type in the prompt strip to start.'}
        </div>
      </div>
    );
  }

  const accentColor = mode === 'global' ? 'var(--accent-global)' : 'var(--accent)';

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 14, fontSize: 12.5, lineHeight: 1.55 }}>
      {messages.map((m, i) => (
        <div key={`${m.role}-${m.meta}-${i}`} style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            color: m.role === 'spaceman' ? accentColor : 'var(--text-dim)',
            marginBottom: 5,
          }}>
            {m.role} · {m.meta}
          </div>
          <div style={{ color: 'var(--text)' }}>{m.text}</div>
          {m.tool && (
            <div style={{
              marginTop: 7,
              padding: 9,
              borderLeft: `2px solid ${accentColor}`,
              background: 'var(--bg-sunken)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
            }}>
              <div style={{ color: 'var(--text)', marginBottom: 3 }}>◢ {m.tool.head}</div>
              <div style={{ color: 'var(--text-muted)' }}>{m.tool.body}</div>
              {m.tool.foot && (
                <div style={{ color: 'var(--text-dim)', marginTop: 4 }}>{m.tool.foot}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
