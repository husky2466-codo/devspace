import { useState, useEffect } from 'react';
import NativeTitleBar from './components/NativeTitleBar.jsx';
import TopBar from './components/TopBar.jsx';
import StatusBar from './components/StatusBar.jsx';
import ResizeHandle from './components/primitives/ResizeHandle.jsx';

const SEED_TABS = [
  { id: 'forge',     name: 'forge',     activity: 'run',  dirty: true },
  { id: 'archivist', name: 'archivist', activity: 'idle', dirty: false },
];

export default function IDE() {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('ds.v3.tone') || 'terminal';
  });

  const [leftCollapsed, setLeftCollapsed]   = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftWidth, setLeftWidth]           = useState(220);
  const [rightWidth, setRightWidth]         = useState(340);

  const [projectTabs]      = useState(SEED_TABS);
  const [activeProjectId, setActiveProjectId] = useState('forge');

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply theme to <html data-theme="..."> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('ds.v3.tone', themeId);
  }, [themeId]);

  const activeTab = projectTabs.find((t) => t.id === activeProjectId) ?? projectTabs[0];

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* 28px native title bar */}
      <NativeTitleBar
        projectName={activeTab.name}
        branch="main"
        dirty={activeTab.dirty}
        modified={activeTab.dirty ? 2 : 0}
      />

      {/* 38px app top bar */}
      <TopBar
        activeThemeId={themeId}
        onThemeChange={setThemeId}
        projectTabs={projectTabs}
        activeProjectId={activeProjectId}
        onProjectSelect={setActiveProjectId}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        onToggleLeft={() => setLeftCollapsed((c) => !c)}
        onToggleRight={() => setRightCollapsed((c) => !c)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      {/* Body: left rail stub + center + right drawer stub */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Left rail stub */}
        {!leftCollapsed && (
          <div style={{
            width: leftWidth, flexShrink: 0,
            background: 'var(--chrome)',
            borderRight: '1px solid var(--border)',
            position: 'relative',
          }}>
            <ResizeHandle side="right" onResize={setLeftWidth} min={160} max={420} />
            <div style={{
              padding: '10px 12px',
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: 'var(--text-dim)', letterSpacing: '0.14em',
            }}>
              PROJECTS
            </div>
          </div>
        )}

        {leftCollapsed && (
          <div style={{
            width: 32, flexShrink: 0,
            background: 'var(--chrome)',
            borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', paddingTop: 10,
          }}>
            <button
              onClick={() => setLeftCollapsed(false)}
              style={{
                all: 'unset', cursor: 'pointer',
                width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                fontSize: 11,
              }}
            >▸</button>
          </div>
        )}

        {/* Center workspace — empty for M0 */}
        <div style={{
          flex: 1, minWidth: 0,
          background: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-dim)', letterSpacing: '0.2em',
          }}>
            NO TERMINALS
          </div>
        </div>

        {/* Right drawer stub */}
        {!rightCollapsed && (
          <div style={{
            width: rightWidth, flexShrink: 0,
            background: 'var(--chrome)',
            borderLeft: '1px solid var(--border)',
            position: 'relative',
          }}>
            <ResizeHandle side="left" onResize={setRightWidth} min={200} max={900} />
            <div style={{
              padding: '10px 12px',
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: 'var(--text-dim)', letterSpacing: '0.14em',
            }}>
              SPACEMAN
            </div>
          </div>
        )}

        {rightCollapsed && (
          <div style={{
            width: 32, flexShrink: 0,
            background: 'var(--chrome)',
            borderLeft: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', paddingTop: 10,
          }}>
            <button
              onClick={() => setRightCollapsed(false)}
              style={{
                all: 'unset', cursor: 'pointer',
                width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                fontSize: 11,
              }}
            >◂</button>
          </div>
        )}
      </div>

      {/* 24px status bar */}
      <StatusBar
        branch="main"
        projectName={activeTab.name}
        modified={activeTab.dirty ? 2 : 0}
      />

    </div>
  );
}
