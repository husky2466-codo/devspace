import SpacemanMark from './primitives/SpacemanMark.jsx';
import StatusDot from './primitives/StatusDot.jsx';

const THEME_DOTS = [
  { id: 'terminal',  bg: '#0a0a0a' },
  { id: 'graphite',  bg: '#c7ff3d' },
  { id: 'paper',     bg: '#f4f1ea' },
];

export default function TopBar({
  activeThemeId,
  onThemeChange,
  projectTabs,
  activeProjectId,
  onProjectSelect,
  leftCollapsed,
  rightCollapsed,
  onToggleLeft,
  onToggleRight,
  onSettingsOpen,
}) {
  return (
    <div style={{
      height: 38, flexShrink: 0,
      display: 'flex', alignItems: 'stretch',
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Logo + left rail toggle */}
      <div style={{
        width: leftCollapsed ? 32 : 200,
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: leftCollapsed ? '0 4px' : '0 14px',
        borderRight: '1px solid var(--border)',
        transition: 'width 200ms, padding 200ms',
        overflow: 'hidden',
      }}>
        <SpacemanMark size={18} />
        {!leftCollapsed && (
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 13,
            color: 'var(--text)', flex: 1,
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            Dev-Space<span style={{ color: 'var(--text-dim)' }}>.ai</span>
          </div>
        )}
        <button
          onClick={onToggleLeft}
          style={{
            all: 'unset', cursor: 'pointer',
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <svg width="13" height="11" viewBox="0 0 14 12" fill="none">
            <rect x="0.5" y="0.5" width="13" height="11" stroke="currentColor" />
            <rect x="0.5" y="0.5" width="4.5" height="11" fill="currentColor"
              opacity={leftCollapsed ? 0.3 : 0.9} />
          </svg>
        </button>
      </div>

      {/* Project tabs */}
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
        {projectTabs.map((tab) => {
          const isActive = tab.id === activeProjectId;
          return (
            <button
              key={tab.id}
              onClick={() => onProjectSelect(tab.id)}
              aria-pressed={isActive}
              style={{
                all: 'unset', boxSizing: 'border-box',
                padding: '0 14px',
                display: 'flex', alignItems: 'center', gap: 7,
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
                background: isActive ? 'var(--bg)' : 'transparent',
                borderRight: '1px solid var(--border)',
                borderTop: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                cursor: 'pointer', height: '100%',
              }}
            >
              <StatusDot
                kind={tab.activity === 'run' ? 'run' : 'idle'}
                pulse={tab.activity === 'run'}
                size={5}
              />
              <span>{tab.name}</span>
              {tab.dirty && (
                <span style={{ color: 'var(--warn)', fontSize: 8 }}>●</span>
              )}
              <span style={{ color: 'var(--text-dim)', marginLeft: 4, fontSize: 11 }}>×</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
      </div>

      {/* Right controls */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px',
        borderLeft: '1px solid var(--border)',
      }}>
        {THEME_DOTS.map(({ id, bg }) => (
          <button
            key={id}
            onClick={() => onThemeChange(id)}
            aria-label={`${id} theme`}
            aria-pressed={activeThemeId === id}
            style={{
              all: 'unset',
              display: 'inline-block',
              width: 10, height: 10, borderRadius: 999,
              background: bg,
              border: activeThemeId === id ? '2px solid var(--text)' : '2px solid transparent',
              cursor: 'pointer', flexShrink: 0,
            }}
          />
        ))}
        <button
          onClick={onToggleRight}
          style={{
            all: 'unset', cursor: 'pointer',
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
        >
          <svg width="13" height="11" viewBox="0 0 14 12" fill="none">
            <rect x="0.5" y="0.5" width="13" height="11" stroke="currentColor" />
            <rect x="9" y="0.5" width="4.5" height="11" fill="currentColor"
              opacity={rightCollapsed ? 0.3 : 0.9} />
          </svg>
        </button>
        <button
          onClick={onSettingsOpen}
          aria-label="Open settings"
          style={{
            all: 'unset',
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-muted)',
            padding: '3px 7px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          ⌘,
        </button>
      </div>
    </div>
  );
}
