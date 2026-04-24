import { useState, useEffect } from 'react';
import NativeTitleBar from './components/NativeTitleBar.jsx';
import TopBar from './components/TopBar.jsx';
import StatusBar from './components/StatusBar.jsx';
import LeftRail from './components/LeftRail/index.jsx';
import CollapsedRail from './components/LeftRail/CollapsedRail.jsx';
import Workspace from './components/Workspace/index.jsx';
import SpacemanDrawer from './components/SpacemanDrawer/index.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { SEED_PROJECTS } from './data/seedProjects.js';
import { SEED_BY_PROJECT, makeProjectState, makeTerminal } from './data/seedTerminals.js';
import { SEED_SPACEMAN, makeSpacemanState } from './data/seedSpaceman.js';

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

  const [projects]        = useState(SEED_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState('forge');

  // Per-project workspace state — each slice: { terminals, activeTermId, finishedIds, editorFile }
  const [byProject, setByProject] = useState(SEED_BY_PROJECT);

  // Spaceman state keyed by project id
  const [spacemanMode, setSpacemanMode] = useState('project');
  const [spaceman, setSpaceman]         = useState(SEED_SPACEMAN);

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('ds.v3.tone', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('ds.v3.layout', JSON.stringify({
      leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage,
    }));
  }, [leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage]);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0];

  // Active project workspace slice
  const proj = byProject[activeProjectId] ?? makeProjectState();
  const { terminals, activeTermId, finishedIds, editorFile } = proj;

  const setProj = (updater) => {
    setByProject((prev) => {
      const cur = prev[activeProjectId] ?? makeProjectState();
      return { ...prev, [activeProjectId]: updater(cur) };
    });
  };

  // Project navigation
  const handleSelectProject = (id) => {
    setActiveProjectId(id);
    setRailPage('files');
  };

  const handleCollapsedDotSelect = (id) => {
    setActiveProjectId(id);
    setLeftCollapsed(false);
    setRailPage('files');
  };

  // Terminal handlers — all mutate only the active project's slice
  const handleSpawnTerm = () => {
    const t = makeTerminal(terminals);
    setProj((cur) => ({
      ...cur,
      terminals: [...cur.terminals, t],
      activeTermId: t.id,
    }));
  };

  const handleCloseTerm = (id) => {
    setProj((cur) => {
      const next = cur.terminals.filter((t) => t.id !== id);
      const nextActiveId = id === cur.activeTermId
        ? (next.length > 0 ? next[next.length - 1].id : null)
        : cur.activeTermId;
      const nextFinished = new Set(cur.finishedIds);
      nextFinished.delete(id);
      return { ...cur, terminals: next, activeTermId: nextActiveId, finishedIds: nextFinished };
    });
  };

  const handleAcknowledge = (id) => {
    setProj((cur) => {
      const n = new Set(cur.finishedIds);
      n.delete(id);
      return { ...cur, finishedIds: n };
    });
  };

  const handleSelectTerm = (id) => {
    setProj((cur) => ({ ...cur, activeTermId: id }));
  };

  // Spaceman handlers
  const activeSpaceman = spaceman[activeProjectId] ?? makeSpacemanState();

  const handleTabChange = (tab) => {
    setSpaceman((prev) => ({
      ...prev,
      [activeProjectId]: { ...(prev[activeProjectId] ?? makeSpacemanState()), tab },
    }));
  };

  const handleFileOpen = (node) => {
    const file = {
      name:   node.name,
      path:   node.path ?? '',
      git:    node.git,
      branch: activeProject.branch,
      dirty:  node.dirty ?? false,
      errors: node.errors ?? [],
      ghost:  node.ghost ?? false,
    };
    setProj((cur) => ({ ...cur, editorFile: file }));
    handleTabChange('editor');
    if (rightWidth < 420) setRightWidth(Math.round(window.innerWidth * 0.52));
  };

  const handleCloseEditor = () => {
    setProj((cur) => ({ ...cur, editorFile: null }));
    handleTabChange('chat');
    setRightWidth(340);
  };

  const handleModeChange = (newMode) => {
    setSpacemanMode(newMode);
    if (newMode === 'global') {
      const cur = spaceman[activeProjectId]?.tab;
      if (cur === 'browser' || cur === 'editor') handleTabChange('chat');
    }
  };

  const projectTabs = projects.map((p) => ({
    id: p.id,
    name: p.name,
    activity: p.activity,
    dirty: p.dirty,
  }));

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <NativeTitleBar
        projectName={activeProject.name}
        branch={activeProject.branch}
        dirty={activeProject.dirty}
        modified={activeProject.dirty ? 2 : 0}
      />

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

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

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
            onFileOpen={handleFileOpen}
          />
        )}

        <Workspace
          terminals={terminals}
          activeTermId={activeTermId}
          finishedIds={finishedIds}
          onSelectTerm={handleSelectTerm}
          onCloseTerm={handleCloseTerm}
          onSpawnTerm={handleSpawnTerm}
          onAcknowledge={handleAcknowledge}
          onPromptSubmit={() => {}}
        />

        {!rightCollapsed ? (
          <SpacemanDrawer
            width={rightWidth}
            onResize={setRightWidth}
            spaceman={activeSpaceman}
            onTabChange={handleTabChange}
            mode={spacemanMode}
            onModeChange={handleModeChange}
            editorFile={editorFile}
            onCloseEditor={handleCloseEditor}
            projectName={activeProject.name}
            branch={activeProject.branch}
            onPromptSubmit={() => {}}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        ) : (
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

      <StatusBar
        branch={activeProject.branch}
        projectName={activeProject.name}
        modified={activeProject.dirty ? 2 : 0}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeThemeId={themeId}
        onThemeChange={setThemeId}
        projects={projects}
        activeProjectId={activeProjectId}
      />

    </div>
  );
}
