const KIND_GLYPHS = {
  prompt: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1"/>
      <path d="M3 4h5M3 5.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  route: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 1v9M1 5.5l4.5-4.5 4.5 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plan: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2h7M2 5h7M2 8h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  agent: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1"/>
      <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  tool: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 1.5L9.5 3.5l-5 5-2 .5.5-2 5-5z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  ),
  terminal: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1.5" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
      <path d="M3 4.5l1.5 1.5L3 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 7.5h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  verify: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function statusColor(status) {
  if (status === 'ok')  return 'var(--ok)';
  if (status === 'run') return 'var(--running)';
  return 'var(--border)';
}

function detailBg(status) {
  if (status === 'ok')  return 'color-mix(in srgb, var(--ok) 6%, transparent)';
  if (status === 'run') return 'color-mix(in srgb, var(--running) 8%, transparent)';
  return 'transparent';
}

function detailColor(status) {
  if (status === 'run') return 'var(--text)';
  if (status === 'ok')  return 'var(--text-muted)';
  return 'var(--text-dim)';
}

function NodeGlyph({ kind, status }) {
  const color = statusColor(status);
  const glyph = KIND_GLYPHS[kind] ?? KIND_GLYPHS.tool;
  const isPulsing = status === 'run';

  return (
    <div style={{
      width: 20,
      height: 20,
      border: `1px solid ${color}`,
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color,
      flexShrink: 0,
      animation: isPulsing ? 'smPulse 1.4s ease-in-out infinite' : 'none',
    }}>
      {glyph}
    </div>
  );
}

function PipelineNode({ step, isLast, mode }) {
  const color = statusColor(step.status);
  const msLabel = step.ms != null ? `${step.ms}ms` : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', minHeight: 36 }}>
      {/* Rail + glyph column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <NodeGlyph kind={step.kind} status={step.status} />
        {!isLast && (
          <div style={{
            flex: 1,
            width: 1,
            background: step.status === 'run'
              ? 'var(--running)'
              : step.status === 'ok'
                ? 'color-mix(in srgb, var(--ok) 40%, transparent)'
                : 'var(--border)',
            minHeight: 10,
            marginTop: 1,
          }} />
        )}
      </div>

      {/* Content column */}
      <div style={{ paddingLeft: 8, paddingBottom: isLast ? 0 : 10, paddingTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: step.status === 'idle' ? 'var(--text-muted)' : 'var(--text)',
            fontWeight: step.status === 'run' ? 500 : 400,
          }}>
            {step.name}
          </span>
          {msLabel && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              color: 'var(--text-dim)',
            }}>
              {msLabel}
            </span>
          )}
          {mode === 'global' && step.project && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--accent-global)' }}>
              → {step.project}
            </span>
          )}
        </div>
        {step.detail && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: detailColor(step.status),
            background: detailBg(step.status),
            padding: '3px 6px',
            lineHeight: 1.5,
            borderLeft: `2px solid ${color}`,
          }}>
            {step.detail}
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 0 14px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: headerColor,
        letterSpacing: '0.14em',
        marginBottom: 14,
      }}>
        {mode === 'global' && '◉ GLOBAL · '}CHAIN · {chain.name}
      </div>

      <div>
        {chain.steps.map((s, i) => (
          <PipelineNode
            key={s.n}
            step={s}
            isLast={i === chain.steps.length - 1}
            mode={mode}
          />
        ))}
      </div>

      {/* Pipeline summary footer */}
      <div style={{
        marginTop: 14,
        marginBottom: 14,
        border: '1px dashed var(--border)',
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {chain.totalMs != null ? `${chain.totalMs}ms` : '—'}
          {chain.tokensIn != null && (
            <> · ↑{chain.tokensIn.toLocaleString()} ↓{chain.tokensOut.toLocaleString()}</>
          )}
        </span>
        <span style={{ color: 'var(--text-dim)', display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigator.clipboard?.writeText(JSON.stringify(chain.steps, null, 2))}
            style={{
              all: 'unset', cursor: 'pointer', color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)', fontSize: 9.5,
            }}
          >
            ⎘ copy trace
          </button>
          <span>·</span>
          <button style={{
            all: 'unset', cursor: 'pointer', color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
          }}>
            ⏏ abort
          </button>
        </span>
      </div>
    </div>
  );
}
