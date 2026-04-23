const KIND_COLORS = {
  ok:     'var(--ok)',
  run:    'var(--running)',
  err:    'var(--err)',
  warn:   'var(--warn)',
  info:   'var(--info)',
  global: 'var(--accent-global)',
  idle:   'var(--text-dim)',
};

export default function StatusDot({ kind = 'idle', pulse = false, size = 6 }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: 999,
      background: KIND_COLORS[kind] ?? 'var(--text-dim)',
      flexShrink: 0,
      animation: pulse ? 'smPulse 1.4s ease-in-out infinite' : 'none',
    }} />
  );
}
