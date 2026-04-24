const KIND_GLYPH = { html: '◐', file: '▤', img: '▣', link: '↗' };

export default function BrowserTab({ items }) {
  if (!items?.length) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
          marginBottom: 8,
        }}>
          NO ITEMS YET
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Files and links opened by agents appear here.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-dim)',
        letterSpacing: '0.14em',
        marginBottom: 10,
      }}>
        RECENTLY OPENED
      </div>
      {items.map((it, i) => {
        const live = /localhost|dev-space:\/\/|file:\/\//.test(it.path);
        return (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 0',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
          }}>
            <span style={{
              color: live ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              width: 16,
              textAlign: 'center',
              flexShrink: 0,
            }}>
              {KIND_GLYPH[it.kind] ?? '↗'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {it.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-dim)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {it.path}
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8.5,
              padding: '1px 4px',
              color: live ? 'var(--accent)' : 'var(--text-muted)',
              border: `1px solid ${live ? 'var(--accent)' : 'var(--border)'}`,
              background: live ? 'var(--accent-soft)' : 'transparent',
              flexShrink: 0,
            }}>
              {live ? 'LIVE' : 'WEB'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
