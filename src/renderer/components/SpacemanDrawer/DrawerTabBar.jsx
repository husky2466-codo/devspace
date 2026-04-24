const TAB_GLYPHS = {
  chat:    <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><path d="M1.5 2h9v6h-5l-2.5 2V8h-1.5z" stroke="currentColor" /></svg>,
  browser: <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="8" stroke="currentColor" /><line x1="1" y1="4.5" x2="11" y2="4.5" stroke="currentColor" /></svg>,
  editor:  <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><path d="M2 1.5v9M4 3h6M4 5.5h4M4 8h5" stroke="currentColor" /></svg>,
  chain:   <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><circle cx="3" cy="3" r="1.5" stroke="currentColor" /><circle cx="9" cy="9" r="1.5" stroke="currentColor" /><path d="M4.2 4.2L7.8 7.8" stroke="currentColor" /></svg>,
  memory:  <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2" width="9" height="2" stroke="currentColor" /><rect x="1.5" y="5" width="9" height="2" stroke="currentColor" /><rect x="1.5" y="8" width="9" height="2" stroke="currentColor" /></svg>,
};

const TABS = ['chat', 'browser', 'editor', 'chain', 'memory'];

export default function DrawerTabBar({ activeTab, onSelectTab, mode, drawerWidth }) {
  const compact = drawerWidth < 400;
  const accentColor = mode === 'global' ? 'var(--accent-global)' : 'var(--accent)';

  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      flexShrink: 0,
      background: 'var(--bg-pane)',
    }}>
      {TABS.map((t) => {
        const active = t === activeTab;
        const disabled = mode === 'global' && (t === 'editor' || t === 'browser');
        const showLabel = !compact || active;

        return (
          <div
            key={t}
            onClick={() => !disabled && onSelectTab(t)}
            style={{
              padding: compact && !active ? '7px 9px' : '7px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: disabled
                ? 'var(--text-dim)'
                : active
                ? (mode === 'global' ? 'var(--accent-global)' : 'var(--text)')
                : 'var(--text-muted)',
              borderBottom: active ? `1px solid ${accentColor}` : '1px solid transparent',
              textDecoration: disabled ? 'line-through' : 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {TAB_GLYPHS[t]}
            {showLabel && <span>{t}</span>}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
    </div>
  );
}
