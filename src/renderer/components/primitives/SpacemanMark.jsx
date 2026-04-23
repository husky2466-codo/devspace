export default function SpacemanMark({ size = 22, mode = 'project' }) {
  const col = mode === 'global' ? 'var(--accent-global)' : 'var(--border-active)';
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
      {mode === 'global' && (
        <ellipse
          cx="11" cy="11" rx="10.5" ry="3.2"
          stroke={col} strokeWidth="0.6"
          transform="rotate(-22 11 11)" opacity="0.65"
        />
      )}
      <circle cx="11" cy="11" r="8.5" stroke={col} strokeWidth="1" />
      <path d="M 3.5 9.5 Q 11 6.5 18.5 9.5 L 18.5 12.5 Q 11 15.5 3.5 12.5 Z" fill={col} opacity="0.25" />
      <circle cx="8.5" cy="10" r="1" fill={col} />
      <line x1="11" y1="2.5" x2="11" y2="0.5" stroke={col} strokeWidth="1" />
      <circle cx="11" cy="0.5" r="0.8" fill={col} />
    </svg>
  );
}
