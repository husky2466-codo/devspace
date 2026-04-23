import { useState, useEffect } from 'react';
import NativeTitleBar from './components/NativeTitleBar.jsx';
import TopBar from './components/TopBar.jsx';
import StatusBar from './components/StatusBar.jsx';
import LeftRail from './components/LeftRail/index.jsx';
import CollapsedRail from './components/LeftRail/CollapsedRail.jsx';
import ResizeHandle from './components/primitives/ResizeHandle.jsx';
import { SEED_PROJECTS } from './data/seedProjects.js';

function loadLayout() {
  try {
    return JSON.parse(localStorage.getItem('ds.v3.layout') || '{}');
  } catch {
    return {};
  }
}

export default function IDE() {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('ds.v3.tone') || 'terminal';
  });

  const [leftCollapsed, setLeftCollapsed]   = useState(() => loadLayout().leftCollapsed ?? false);
  const [rightCollapsed, setRightCollapsed] = useState(() => loadLayout().rightCollapsed ?? false);
  const [leftWidth, setLeftWidth]           = useState(() => loadLayout().leftWidth ?? 220);
  const [rightWidth, setRightWidth]         = useState(() => loadLayout().rightWidth ?? 340);
  const [railPage, setRailPage]             = useState(() => loadLayout().railPage ?? 'projects');

  const [projects]       = useState(SEED_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState('forge');

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply theme to <html data-theme="..."> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('ds.v3.tone', themeId);
  }, [themeId]);

  // Persist layout state
  useEffect(() => {
    localStorage.setItem('ds.v3.layout', JSON.stringify({
      leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage,
    }));
  }, [leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage]);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0];

  // Clicking a project row → set active + navigate to files page
  const handleSelectProject = (id) => {
    setActiveProjectId(id);
    setRailPage('files');
  };

  // Clicking expand on a collapsed-rail dot → expand + focus project
  const handleCollapsedDotSelect = (id) => {
    setActiveProjectId(id);
    setLeftCollapsed(false);
    setRailPage('files');
  };

  const projectTabs = projects.map((p) => ({
    id: p.id,
    name: p.name,
    activity: p.activity,
    dirty: p.dirty,
  }));

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* 28px native title bar */}
      <NativeTitleBar
        projectName={activeProject.name}
        branch={activeProject.branch}
        dirty={activeProject.dirty}
        modified={activeProject.dirty ? 2 : 0}
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

      {/* Body: left rail + center + right drawer stub */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Left rail */}
        {leftCollapsed ? (
          <CollapsedRail
            projects={projects}
            activeProjectId={activeProjectId}
            onExpand={() => setLeftCollapsed(false)}
            onSelectProject={handleCollapsedDotSelect}
          />
        ) : (
          <LeftRail
            width={leftWidth}
            onResize={setLeftWidth}
            page={railPage}
            onPageChange={setRailPage}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelectProject}
            onFileOpen={() => {}}
          />
        )}

        {/* Center workspace */}
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
        branch={activeProject.branch}
        projectName={activeProject.name}
        modified={activeProject.dirty ? 2 : 0}
      />

    </div>
  );
}
