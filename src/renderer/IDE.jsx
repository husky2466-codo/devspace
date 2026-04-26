import { useState, useEffect, useRef } from 'react';
import NativeTitleBar from './components/NativeTitleBar.jsx';
import TopBar from './components/TopBar.jsx';
import StatusBar from './components/StatusBar.jsx';
import LeftRail from './components/LeftRail/index.jsx';
import CollapsedRail from './components/LeftRail/CollapsedRail.jsx';
import Workspace from './components/Workspace/index.jsx';
import SpacemanDrawer from './components/SpacemanDrawer/index.jsx';
import PromptStrip from './components/SpacemanDrawer/PromptStrip.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import ComputePopover from './components/ComputePopover.jsx';
import NewProjectPicker from './components/NewProjectPicker.jsx';
import NewProjectForm from './components/NewProjectForm.jsx';
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

  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem('ds.v3.projects');
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem('ds.v3.projects') || '[]');
      const storedActive = localStorage.getItem('ds.v3.activeProject');
      if (storedActive && storedProjects.find(p => p.id === storedActive)) return storedActive;
    } catch {}
    return null;
  });

  // New-project flow
  const [pickerOpen, setPickerOpen]       = useState(false);
  const [newProjVariant, setNewProjVariant] = useState(null);

  // Per-project workspace state — each slice: { terminals, activeTermId, finishedIds, editorFile }
  const [byProject, setByProject] = useState(SEED_BY_PROJECT);

  // Spaceman state keyed by project id
  const [spacemanMode, setSpacemanMode] = useState('project');
  const [spaceman, setSpaceman]         = useState(SEED_SPACEMAN);

  const [settingsOpen, setSettingsOpen]     = useState(false);
  const [settingsSection, setSettingsSection] = useState('appearance');
  const [computeOpen, setComputeOpen]       = useState(false);
  const [cursorPos, setCursorPos]           = useState({ line: 1, col: 1 });

  // Global prompt strip — ChatTab registers its sendMessage here
  const promptActionRef = useRef(null);
  const handlePromptSubmit = (text) => promptActionRef.current?.(text);

  // Ref for focusing the prompt strip input from keyboard shortcut
  const promptStripFocusRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('ds.v3.tone', themeId);
  }, [themeId]);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (!e.metaKey && !e.ctrlKey) return;
      switch (e.key) {
        case ',': // Settings
          e.preventDefault();
          setSettingsSection('appearance');
          setSettingsOpen(true);
          break;
        case 't': // Spawn terminal
          e.preventDefault();
          handleSpawnTerm();
          break;
        case 'w': // Close active terminal
          e.preventDefault();
          if (activeTermId) handleCloseTerm(activeTermId);
          break;
        case ']': { // Next terminal
          e.preventDefault();
          const terms = byProject[activeProjectId]?.terminals ?? [];
          if (terms.length < 2) break;
          const idx = terms.findIndex((t) => t.id === activeTermId);
          const next = terms[(idx + 1) % terms.length];
          handleSelectTerm(next.id);
          break;
        }
        case '[': { // Previous terminal
          e.preventDefault();
          const terms = byProject[activeProjectId]?.terminals ?? [];
          if (terms.length < 2) break;
          const idx = terms.findIndex((t) => t.id === activeTermId);
          const prev = terms[(idx - 1 + terms.length) % terms.length];
          handleSelectTerm(prev.id);
          break;
        }
        case '\\': // Toggle left rail
          e.preventDefault();
          setLeftCollapsed((o) => !o);
          break;
        case '/': // Toggle Spaceman drawer
          e.preventDefault();
          setRightCollapsed((o) => !o);
          break;
        case 'l': // Focus prompt strip
          e.preventDefault();
          promptStripFocusRef.current?.();
          break;
        case '1': // Switch to CHAT tab
          e.preventDefault();
          handleTabChange('chat');
          break;
        case '2': // Switch to EDITOR tab
          e.preventDefault();
          handleTabChange('editor');
          break;
        case '3': // Switch to CHAIN tab
          e.preventDefault();
          handleTabChange('chain');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeProjectId, activeTermId, byProject, handleSpawnTerm, handleCloseTerm, handleSelectTerm, handleTabChange]);

  useEffect(() => {
    localStorage.setItem('ds.v3.layout', JSON.stringify({
      leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage,
    }));
  }, [leftCollapsed, rightCollapsed, leftWidth, rightWidth, railPage]);

  useEffect(() => {
    try {
      const toSave = projects.map(({ id, name, branch, last, activity, dirty, _variant, _fields, _detected }) => ({
        id, name, branch, last, activity, dirty: false, _variant, _fields, _detected,
      }));
      localStorage.setItem('ds.v3.projects', JSON.stringify(toSave));
    } catch {}
  }, [projects]);

  useEffect(() => {
    if (activeProjectId) localStorage.setItem('ds.v3.activeProject', activeProjectId);
  }, [activeProjectId]);

  // Sync dirty state to macOS traffic light close button dot
  useEffect(() => {
    window.electronAPI?.setDocumentEdited(activeProject?.dirty ?? false);
  }, [activeProject?.dirty]);

  // macOS application menu action handler
  useEffect(() => {
    const off = window.electronAPI?.onMenuAction?.((action) => {
      if (action === 'menu:new-terminal') handleSpawnTerm();
      if (action === 'menu:close-terminal' && activeTermId) handleCloseTerm(activeTermId);
      if (action === 'menu:toggle-rail') setLeftCollapsed((o) => !o);
      if (action === 'menu:toggle-spaceman') setRightCollapsed((o) => !o);
      if (action === 'menu:open-settings') { setSettingsSection('appearance'); setSettingsOpen(true); }
    });
    return () => off?.();
  }, [activeTermId, handleSpawnTerm, handleCloseTerm]);

  // File tree: read + watch when active project changes
  useEffect(() => {
    if (!activeProjectId) return;
    const project = projects.find((p) => p.id === activeProjectId);
    const rootPath = project?._fields?.path;
    if (!rootPath) return;

    window.electronAPI?.readTree(rootPath).then((tree) => {
      setByProject((prev) => {
        const cur = prev[activeProjectId] ?? makeProjectState();
        return { ...prev, [activeProjectId]: { ...cur, files: tree } };
      });
    });

    window.electronAPI?.watchProject(activeProjectId, rootPath);

    return () => {
      window.electronAPI?.unwatchProject(activeProjectId);
    };
  }, [activeProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for live tree updates from chokidar
  useEffect(() => {
    const cleanup = window.electronAPI?.onTreeUpdate(({ projectId, tree }) => {
      setByProject((prev) => {
        const cur = prev[projectId] ?? makeProjectState();
        return { ...prev, [projectId]: { ...cur, files: tree } };
      });
    });
    return () => cleanup?.();
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;

  // Active project workspace slice
  const proj = byProject[activeProjectId] ?? makeProjectState();
  const { terminals, activeTermId, finishedIds, editorFile, files } = proj;

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
    const cwd = activeProject?._fields?.path;
    const t = makeTerminal(terminals, cwd);
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
      branch: activeProject?.branch ?? '',
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

  const handleNewProjectSelect = (variant) => {
    setNewProjVariant(variant);
    setPickerOpen(false);
  };

  const handleCreateProject = (proj) => {
    setProjects((prev) => [...prev, proj]);
    setByProject((prev) => ({ ...prev, [proj.id]: makeProjectState() }));
    setSpaceman((prev) => ({ ...prev, [proj.id]: makeSpacemanState() }));
    setActiveProjectId(proj.id);
    setNewProjVariant(null);
    setRailPage('files');
  };

  const handleCancelNewProject = () => {
    setNewProjVariant(null);
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
        projectName={activeProject?.name ?? 'Dev-Space.ai'}
        branch={activeProject?.branch ?? ''}
        dirty={activeProject?.dirty ?? false}
        modified={activeProject?.dirty ? 2 : 0}
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
        onSettingsOpen={() => { setSettingsSection('appearance'); setSettingsOpen(true); }}
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
            activeFiles={files ?? []}
            onSelectProject={handleSelectProject}
            onFileOpen={handleFileOpen}
            pickerOpen={pickerOpen}
            onNewProject={() => setPickerOpen((o) => !o)}
            onClosePicker={() => setPickerOpen(false)}
            onPickerSelect={handleNewProjectSelect}
          />
        )}

        {newProjVariant ? (
          <NewProjectForm
            variant={newProjVariant}
            onCancel={handleCancelNewProject}
            onCreate={handleCreateProject}
          />
        ) : projects.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
            background: 'var(--bg)',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-dim)', letterSpacing: '0.14em',
            }}>
              NO PROJECTS
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
              Click <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>+ NEW</span> in the left rail<br />to add your first project.
            </div>
          </div>
        ) : (
          <Workspace
            terminals={terminals}
            activeTermId={activeTermId}
            finishedIds={finishedIds}
            onSelectTerm={handleSelectTerm}
            onCloseTerm={handleCloseTerm}
            onSpawnTerm={handleSpawnTerm}
            onAcknowledge={handleAcknowledge}
          />
        )}

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
            projectName={activeProject?.name ?? ''}
            branch={activeProject?.branch ?? ''}
            projectId={activeProjectId}
            projects={projects}
            onOpenSettings={() => setSettingsOpen(true)}
            promptActionRef={promptActionRef}
            onCursorChange={setCursorPos}
            monacoTheme={themeId === 'paper' ? 'vs' : 'vs-dark'}
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

      <PromptStrip
        mode={spacemanMode}
        activeTab={activeSpaceman?.tab ?? 'chat'}
        onSubmit={handlePromptSubmit}
        focusRef={promptStripFocusRef}
      />

      <div style={{ position: 'relative', flexShrink: 0 }}>
        <StatusBar
          branch={activeProject?.branch ?? ''}
          projectName={activeProject?.name ?? ''}
          modified={activeProject?.dirty ? 2 : 0}
          onComputeClick={() => setComputeOpen((o) => !o)}
          cursorLine={cursorPos.line}
          cursorCol={cursorPos.col}
        />
        {computeOpen && (
          <ComputePopover
            onClose={() => setComputeOpen(false)}
            onOpenSettings={(sec) => {
              setComputeOpen(false);
              setSettingsSection(sec ?? 'compute');
              setSettingsOpen(true);
            }}
          />
        )}
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeThemeId={themeId}
        onThemeChange={setThemeId}
        projects={projects}
        activeProjectId={activeProjectId}
        defaultSection={settingsSection}
      />

    </div>
  );
}
