// Dev-Space v2 — IDE-first clean rebuild
// Left rail with sliding pages: Projects ⇄ Files
// Uses tokens.jsx (three themes, live switchable)

function V2StatusDot({ kind = 'ok', pulse = false }) {
  const color = kind === 'ok' ? 'var(--ok)'
    : kind === 'run' ? 'var(--running)'
    : kind === 'err' ? 'var(--err)'
    : kind === 'warn' ? 'var(--warn)'
    : 'var(--text-dim)';
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: 999,
      background: color, flexShrink: 0,
      animation: pulse ? 'tcPulse 1.4s ease-in-out infinite' : 'none',
    }} />
  );
}

// ============ RESIZE HANDLE ============
function ResizeHandle({ side, onResize, min = 180, max = 560 }) {
  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = e.currentTarget.parentElement.offsetWidth;
    const move = (ev) => {
      const dx = ev.clientX - startX;
      const raw = side === 'right' ? startW + dx : startW - dx;
      onResize(Math.max(min, Math.min(max, raw)));
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute', top: 0, bottom: 0,
        [side]: -3,
        width: 6, zIndex: 20,
        cursor: 'col-resize',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    />
  );
}

// ============ DRAWER TOGGLE ICON ============
function DrawerToggle({ side, collapsed, onClick }) {
  // side: 'left' means this toggles the LEFT drawer (icon lives in top-left area)
  //       'right' means this toggles the RIGHT drawer (icon lives in top-right area)
  // The glyph shows a panel on the corresponding side.
  return (
    <button
      onClick={onClick}
      title={`${collapsed ? 'Show' : 'Hide'} ${side} drawer`}
      style={{
        all: 'unset', cursor: 'pointer',
        width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: collapsed ? 'var(--text-muted)' : 'var(--text)',
        border: '1px solid var(--border)',
        background: collapsed ? 'transparent' : 'var(--bg-sunken)',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
        <rect x="0.5" y="0.5" width="13" height="11" stroke="currentColor" strokeWidth="1" />
        {side === 'left' ? (
          <rect x="0.5" y="0.5" width="4.5" height="11" fill="currentColor" opacity={collapsed ? 0.3 : 0.9} />
        ) : (
          <rect x="9" y="0.5" width="4.5" height="11" fill="currentColor" opacity={collapsed ? 0.3 : 0.9} />
        )}
      </svg>
    </button>
  );
}

// ============ COLLAPSED RAIL STUBS ============
function CollapsedLeftRail({ onExpand }) {
  return (
    <div style={{
      width: 32, flexShrink: 0,
      background: 'var(--chrome)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 0', gap: 12,
    }}>
      <button onClick={onExpand} title="Expand" style={{
        all: 'unset', cursor: 'pointer',
        width: 22, height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)',
        border: '1px solid var(--border)',
      }}>
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><rect x="0.5" y="0.5" width="11" height="9" stroke="currentColor"/><rect x="0.5" y="0.5" width="3" height="9" fill="currentColor"/></svg>
      </button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.2em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        PROJECTS
      </div>
    </div>
  );
}

function CollapsedRightRail({ onExpand }) {
  return (
    <div style={{
      width: 32, flexShrink: 0,
      background: 'var(--bg-pane)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 0', gap: 12,
    }}>
      <button onClick={onExpand} title="Expand" style={{
        all: 'unset', cursor: 'pointer',
        width: 22, height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)',
        border: '1px solid var(--border)',
      }}>
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><rect x="0.5" y="0.5" width="11" height="9" stroke="currentColor"/><rect x="8" y="0.5" width="3.5" height="9" fill="currentColor"/></svg>
      </button>
      <SpacemanGlyphFallback />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.2em', writingMode: 'vertical-rl' }}>
        SPACEMAN
      </div>
    </div>
  );
}

// fallback since SpacemanGlyph is defined later — forward stub
function SpacemanGlyphFallback() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8.5" stroke="var(--text-muted)" strokeWidth="1" />
      <path d="M 3.5 9.5 Q 11 6.5 18.5 9.5 L 18.5 12.5 Q 11 15.5 3.5 12.5 Z" fill="var(--text-muted)" opacity="0.25" />
    </svg>
  );
}

// ============ LEFT RAIL — sliding Projects ⇄ Files ============
function LeftRail({ activePage, setActivePage, openProjectId, setOpenProjectId, projects, width, onResize, onNewProject, onNewFile }) {
  const openProject = projects.find(p => p.id === openProjectId);
  const newProjectBtnRef = React.useRef(null);
  const newFileBtnRef = React.useRef(null);
  return (
    <div style={{
      width: width, flexShrink: 0,
      background: 'var(--chrome)',
      borderRight: '1px solid var(--border)',
      position: 'relative', overflow: 'hidden',
    }}>
      <ResizeHandle side="right" onResize={onResize} />
      {/* Page 1: Projects */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: activePage === 'projects' ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <RailHeader
          label="PROJECTS"
          action="+ NEW"
          actionRef={newProjectBtnRef}
          onAction={() => onNewProject?.(newProjectBtnRef.current?.getBoundingClientRect())}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {projects.map(p => (
            <ProjectRow
              key={p.id}
              project={p}
              isOpen={p.id === openProjectId}
              onSelect={() => { setOpenProjectId(p.id); setActivePage('files'); }}
              onPeek={() => setActivePage('files')}
            />
          ))}
          <div style={{
            padding: '14px 16px 4px', fontFamily: 'var(--font-mono)',
            fontSize: 10, color: 'var(--text-dim)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>recent</div>
          {[
            { id: 'claw', name: 'dgx-openclaw', last: '2d' },
            { id: 'voxel', name: 'Voxel-AI', last: '1w' },
          ].map(p => (
            <div key={p.id} style={{
              padding: '7px 16px', fontFamily: 'var(--font-mono)',
              fontSize: 12, color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
            }}>
              <span style={{ flex: 1 }}>{p.name}</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{p.last}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Page 2: Files */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: activePage === 'files' ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <FilesHeader
          project={openProject}
          onBack={() => setActivePage('projects')}
          onNewFile={(rect) => onNewFile?.(rect)}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {openProject && <FileTree files={openProject.files} />}
        </div>
      </div>
    </div>
  );
}

function RailHeader({ label, action, onAction, actionRef }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '12px 16px 8px',
      borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      color: 'var(--text-dim)', letterSpacing: '0.14em',
    }}>
      <span style={{ flex: 1 }}>{label}</span>
      {action && (
        <span
          ref={actionRef}
          onClick={onAction}
          style={{
            color: 'var(--text-muted)', cursor: 'pointer',
            padding: '2px 6px',
            border: '1px solid var(--border)',
            fontSize: 10,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >{action}</span>
      )}
    </div>
  );
}

function FilesHeader({ project, onBack, onNewFile }) {
  const btnRef = React.useRef(null);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      borderBottom: '1px solid var(--border)',
    }}>
      <button onClick={onBack} style={{
        all: 'unset', cursor: 'pointer',
        width: 22, height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: 14,
        border: '1px solid var(--border)',
      }}>←</button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-dim)', letterSpacing: '0.14em',
        }}>PROJECT</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 13,
          color: 'var(--text)', marginTop: 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{project?.name}</div>
      </div>
      <button
        ref={btnRef}
        onClick={() => onNewFile?.(btnRef.current?.getBoundingClientRect())}
        title="New file or folder"
        style={{
          all: 'unset', cursor: 'pointer',
          width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 14,
          border: '1px solid var(--border)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >+</button>
      <V2StatusDot kind={project?.dirty ? 'warn' : 'ok'} />
    </div>
  );
}

function ProjectRow({ project, isOpen, onSelect, onPeek }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '8px 8px 8px 14px',
      background: isOpen ? 'var(--accent-soft)' : 'transparent',
      borderLeft: isOpen ? '2px solid var(--accent)' : '2px solid transparent',
      cursor: 'pointer',
    }}>
      <div onClick={onSelect} style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <V2StatusDot kind={project.activity === 'run' ? 'run' : project.dirty ? 'warn' : 'idle'} pulse={project.activity === 'run'} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 13.5,
            color: 'var(--text)', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{project.name}</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: 'var(--text-dim)', marginTop: 1,
          }}>{project.branch} · {project.last}</div>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onPeek(); }} title="Browse files" style={{
        all: 'unset', cursor: 'pointer',
        width: 24, height: 24, marginLeft: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: 12,
      }}>▸</button>
    </div>
  );
}

function FileTree({ files, depth = 0 }) {
  return (
    <>
      {files.map((f, i) => <FileNode key={i} node={f} depth={depth} />)}
    </>
  );
}

function FileNode({ node, depth }) {
  const [open, setOpen] = React.useState(node.open ?? depth === 0);
  const isDir = !!node.children;
  const pad = 10 + depth * 14;
  return (
    <>
      <div onClick={() => isDir && setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 10px 3px 0', paddingLeft: pad,
        fontFamily: 'var(--font-mono)', fontSize: 12,
        color: node.active ? 'var(--text)' : (isDir ? 'var(--text-muted)' : 'var(--text-muted)'),
        background: node.active ? 'var(--accent-soft)' : 'transparent',
        borderLeft: node.active ? '2px solid var(--accent)' : '2px solid transparent',
        cursor: 'pointer', lineHeight: 1.5,
      }}>
        {isDir ? (
          <span style={{ width: 10, color: 'var(--text-dim)' }}>{open ? '▾' : '▸'}</span>
        ) : (
          <span style={{ width: 10, color: 'var(--text-dim)', fontSize: 10 }}>·</span>
        )}
        <span style={{
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          color: node.active ? 'var(--text)' : (isDir ? 'var(--text)' : 'var(--text-muted)'),
        }}>{node.name}</span>
        {node.git && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: node.git === 'M' ? 'var(--warn)' : 'var(--ok)' }}>
            {node.git}
          </span>
        )}
      </div>
      {isDir && open && <FileTree files={node.children} depth={depth + 1} />}
    </>
  );
}

// ============ EDITOR ============
function EditorTabs({ tabs, activeIdx, onPick }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      height: 30, flexShrink: 0,
    }}>
      {tabs.map((t, i) => (
        <div key={i} onClick={() => onPick(i)} style={{
          padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          color: i === activeIdx ? 'var(--text)' : 'var(--text-muted)',
          background: i === activeIdx ? 'var(--bg)' : 'transparent',
          borderRight: '1px solid var(--border)',
          cursor: 'pointer',
        }}>
          <span>{t.name}</span>
          {t.dirty && <span style={{ color: 'var(--warn)', fontSize: 10 }}>●</span>}
          <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>×</span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
    </div>
  );
}

function Editor() {
  const code = [
    { n: 1, t: <span><span style={{ color: 'var(--text-dim)' }}>import</span> <span style={{ color: 'var(--text)' }}>React</span><span style={{ color: 'var(--text-dim)' }}>, {`{`} useState {`}`} from</span> <span style={{ color: 'var(--ok)' }}>'react'</span>;</span> },
    { n: 2, t: <span><span style={{ color: 'var(--text-dim)' }}>import</span> <span style={{ color: 'var(--text)' }}>{`{ themeVars, DIRECTIONS }`}</span> <span style={{ color: 'var(--text-dim)' }}>from</span> <span style={{ color: 'var(--ok)' }}>'./tokens'</span>;</span> },
    { n: 3, t: '' },
    { n: 4, t: <span><span style={{ color: 'var(--text-dim)' }}>export default function</span> <span style={{ color: 'var(--text)' }}>Workspace</span>() {`{`}</span> },
    { n: 5, t: <span>  <span style={{ color: 'var(--text-dim)' }}>const</span> [tone, setTone] = <span style={{ color: 'var(--text)' }}>useState</span>(DIRECTIONS[<span style={{ color: 'var(--warn)' }}>0</span>]);</span> },
    { n: 6, t: <span>  <span style={{ color: 'var(--text-dim)' }}>const</span> [activePane, setActivePane] = <span style={{ color: 'var(--text)' }}>useState</span>(<span style={{ color: 'var(--ok)' }}>'chain'</span>);</span> },
    { n: 7, t: '' },
    { n: 8, t: <span>  <span style={{ color: 'var(--text-dim)' }}>return</span> (</span> },
    { n: 9, t: <span>    {'<'}<span style={{ color: 'var(--info)' }}>div</span> style={`{`}{`{`}...themeVars(tone){`}`}{`}`}{'>'}</span> },
    { n: 10, t: <span>      {'<'}<span style={{ color: 'var(--info)' }}>TopTabs</span> active={`{`}activePane{`}`} /{'>'}</span> },
    { n: 11, t: <span>      {'<'}<span style={{ color: 'var(--info)' }}>ChromeRail</span> /{'>'}</span> },
    { n: 12, t: <span>      {'<'}<span style={{ color: 'var(--info)' }}>PaneGrid</span>{'>'}</span> },
    { n: 13, t: <span>        {'<'}<span style={{ color: 'var(--info)' }}>TerminalPane</span> active /{'>'}</span> },
    { n: 14, t: <span>        {'<'}<span style={{ color: 'var(--info)' }}>ChainPane</span> /{'>'}</span> },
    { n: 15, t: <span>      {'</'}<span style={{ color: 'var(--info)' }}>PaneGrid</span>{'>'}</span> },
    { n: 16, t: <span>    {'</'}<span style={{ color: 'var(--info)' }}>div</span>{'>'}</span> },
    { n: 17, t: '  );' },
    { n: 18, t: '}' },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)', padding: '12px 0' }}>
      {code.map(l => (
        <div key={l.n} style={{
          display: 'flex', gap: 16, padding: '0 16px',
          fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7,
          color: 'var(--text)',
          background: l.n === 5 ? 'var(--accent-soft)' : 'transparent',
        }}>
          <span style={{ width: 28, color: 'var(--text-dim)', textAlign: 'right', flexShrink: 0 }}>{l.n}</span>
          <span>{l.t || '\u00A0'}</span>
        </div>
      ))}
    </div>
  );
}

// ============ SPACEMAN — AI ORCHESTRATOR ============
function SpacemanGlyph({ size = 22, active = true }) {
  // minimalist astronaut helmet: circle + visor band
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8.5" stroke="var(--border-active)" strokeWidth="1" fill="transparent" />
      {/* visor band */}
      <path d="M 3.5 9.5 Q 11 6.5 18.5 9.5 L 18.5 12.5 Q 11 15.5 3.5 12.5 Z"
            fill="var(--border-active)" opacity="0.25" />
      {/* visor highlight */}
      <circle cx="8.5" cy="10" r="1" fill="var(--border-active)" opacity={active ? 1 : 0.5} />
      {/* antenna */}
      <line x1="11" y1="2.5" x2="11" y2="0.5" stroke="var(--border-active)" strokeWidth="1" />
      <circle cx="11" cy="0.5" r="0.8" fill="var(--border-active)" />
    </svg>
  );
}

function SpacemanSidebar({ width, onResize, onCollapse, previewExpanded, setPreviewExpanded, state, setState }) {
  const tab = state?.tab || 'chat';
  const setTab = (t) => setState(s => ({ ...s, tab: t }));
  // auto-collapse preview when leaving the browser tab
  React.useEffect(() => { if (tab !== 'browser' && previewExpanded) setPreviewExpanded(false); }, [tab]);
  return (
    <div style={{
      width: width, flexShrink: 0,
      background: 'var(--bg-pane)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <ResizeHandle side="left" onResize={onResize} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--chrome)',
      }}>
        <SpacemanGlyph />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)', letterSpacing: '0.08em' }}>SPACEMAN</div>
        <span style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--accent)', letterSpacing: '0.1em',
        }}>
          <V2StatusDot kind="run" pulse />
          WATCHING
        </span>
      </div>
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 11,
      }}>
        {['chat', 'browser', 'chain', 'memory'].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding: '8px 14px', cursor: 'pointer',
            color: tab === t ? 'var(--text)' : 'var(--text-muted)',
            borderBottom: tab === t ? '1px solid var(--accent)' : '1px solid transparent',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{t}</div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
        {tab === 'chat' && <SpacemanChat messages={state?.chat || []} />}
        {tab === 'chain' && <SpacemanChain chain={state?.chain} />}
        {tab === 'memory' && <SpacemanMemory mems={state?.memory || []} />}
        {tab === 'browser' && (
          <SpacemanBrowser
            width={width}
            expanded={previewExpanded}
            onRequestExpand={() => setPreviewExpanded(true)}
            onExitExpand={() => setPreviewExpanded(false)}
            items={state?.browser?.items || []}
            url={state?.browser?.url || ''}
            device={state?.browser?.device || 'desktop'}
            setUrl={(url) => setState(s => ({ ...s, browser: { ...s.browser, url } }))}
            setDevice={(device) => setState(s => ({ ...s, browser: { ...s.browser, device } }))}
          />
        )}
      </div>
    </div>
  );
}

function SpacemanChat({ messages = [] }) {
  if (messages.length === 0) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-dim)', letterSpacing: '0.1em',
        padding: '24px 0', textAlign: 'center',
      }}>
        NO MESSAGES YET<div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)',
          letterSpacing: 0, textTransform: 'none', marginTop: 8, lineHeight: 1.5,
        }}>Type in the prompt strip to start a conversation with Spaceman.</div>
      </div>
    );
  }
  return (
    <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: m.role === 'spaceman' ? 'var(--accent)' : 'var(--text-dim)',
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6,
          }}>{m.role} · {m.meta || ''}</div>
          <div style={{ color: 'var(--text)' }}>{m.text}</div>
          {m.tool && (
            <div style={{
              marginTop: 8,
              padding: 10, borderLeft: '2px solid var(--accent)',
              background: 'var(--bg-sunken)',
              fontFamily: 'var(--font-mono)', fontSize: 11.5,
              color: 'var(--text-muted)',
            }}>
              <div style={{ color: 'var(--text)' }}>◢ {m.tool.head}</div>
              <div>{m.tool.body}</div>
              {m.tool.foot && <div style={{ marginTop: 4, color: 'var(--text-dim)' }}>{m.tool.foot}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SpacemanChain({ chain }) {
  if (!chain || !chain.steps?.length) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-dim)', letterSpacing: '0.1em',
        padding: '24px 0', textAlign: 'center',
      }}>
        NO CHAIN ACTIVE<div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)',
          letterSpacing: 0, textTransform: 'none', marginTop: 8, lineHeight: 1.5,
        }}>Multi-step plans from Spaceman appear here.</div>
      </div>
    );
  }
  const steps = chain.steps;
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.14em', marginBottom: 8 }}>CHAIN · {chain.name}</div>
      {steps.map(s => (
        <div key={s.n} style={{
          display: 'grid', gridTemplateColumns: '20px 1fr 14px',
          gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)', textAlign: 'right' }}>{String(s.n).padStart(2, '0')}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: s.status === 'idle' ? 'var(--text-muted)' : 'var(--text)' }}>{s.name}</span>
          <V2StatusDot kind={s.status === 'ok' ? 'ok' : s.status === 'run' ? 'run' : 'idle'} pulse={s.status === 'run'} />
        </div>
      ))}
    </div>
  );
}

function SpacemanMemory({ mems = [] }) {
  if (mems.length === 0) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-dim)', letterSpacing: '0.1em',
        padding: '24px 0', textAlign: 'center',
      }}>
        NO MEMORIES YET<div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)',
          letterSpacing: 0, textTransform: 'none', marginTop: 8, lineHeight: 1.5,
        }}>Decisions, patterns, and corrections Spaceman learns about this project will land here.</div>
      </div>
    );
  }
  return (
    <div>
      {mems.map((m, i) => (
        <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', letterSpacing: '0.14em', marginBottom: 3 }}>{m.t}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.45 }}>{m.c}</div>
        </div>
      ))}
    </div>
  );
}

// ============ SPACEMAN BROWSER ============
// Classify a URL/path as internal (dev) or external (web)
function classifyTarget(path) {
  if (!path) return 'unknown';
  const p = path.toLowerCase();
  // External: http(s) on a public hostname
  if (/^https?:\/\//.test(p)) {
    const host = p.replace(/^https?:\/\//, '').split('/')[0];
    // localhost-ish hosts → internal
    if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[?::1\]?|[^.]+\.local|[^.]+\.test|[^.]+\.localhost)(:|$)/.test(host)) return 'internal';
    return 'external';
  }
  // Internal schemes + bare localhost
  if (/^(file:\/\/|dev-space:\/\/|data:|blob:)/.test(p)) return 'internal';
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/.test(p)) return 'internal';
  if (/^[^.\s]+\.(local|test|localhost)(:|\/|$)/.test(p)) return 'internal';
  // Project-relative path
  if (/\.(jsx?|tsx?|css|md|json|html|png|jpe?g|svg|gif|webp)$/.test(p) || p.startsWith('src/') || p.startsWith('tmp/')) return 'internal';
  // Otherwise treat as external domain
  if (/^[^\s]+\.[a-z]{2,}(\/|$)/.test(p)) return 'external';
  return 'unknown';
}

function SpacemanBrowser({ onRequestExpand, expanded, onExitExpand, width, items = [], url, device, setUrl, setDevice }) {

  const openItem = (it) => {
    const kind = classifyTarget(it.path);
    if (kind === 'external') {
      // simulate opening in OS browser — in a real build: shell.openExternal(url)
      window.open(it.path.startsWith('http') ? it.path : `https://${it.path}`, '_blank', 'noopener');
      setUrl(`opened externally → ${it.path}`);
      return;
    }
    // internal → expand the drawer into Active Preview
    setUrl(it.path);
    onRequestExpand?.();
  };

  if (expanded) {
    return <ActivePreview url={url} device={device} setDevice={setDevice} onExit={onExitExpand} width={width} />;
  }

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)',
        letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>recently opened</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>dev expands inline · web opens in a tab</span>
      </div>
      {items.map((it, i) => <BrowserItem key={i} item={it} onClick={() => openItem(it)} />)}

      <div style={{ marginTop: 18 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px',
          border: '1px solid var(--border)',
          background: 'var(--bg-sunken)',
          marginBottom: 10,
        }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>◀</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>▶</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>↻</span>
          <span style={{
            flex: 1, fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{url}</span>
        </div>
        <div style={{
          border: '1px dashed var(--border-strong)',
          background: 'var(--bg-sunken)',
          padding: 14, minHeight: 120,
          fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.55,
          color: 'var(--text-muted)',
        }}>
          <div style={{ color: 'var(--text-dim)', letterSpacing: '0.14em', fontSize: 10 }}>IDLE</div>
          <div style={{ marginTop: 6, color: 'var(--text-muted)' }}>
            Select a result above.
          </div>
          <div style={{ marginTop: 4, color: 'var(--text-dim)' }}>
            ◐ <span style={{ color: 'var(--accent)' }}>LIVE</span> targets (localhost, file://, dev-space://) expand into an interactive preview.
          </div>
          <div style={{ marginTop: 2, color: 'var(--text-dim)' }}>
            ↗ <span style={{ color: 'var(--text-muted)' }}>WEB</span> targets open in your default browser.
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserItem({ item, onClick }) {
  const kind = classifyTarget(item.path);
  const isInternal = kind === 'internal';
  const iconFor = (k) => k === 'file' ? '▤' : k === 'html' ? '◐' : k === 'img' ? '▣' : k === 'link' ? '↗' : '·';
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 6px 8px 2px',
      borderBottom: '1px solid var(--border)',
      cursor: 'pointer',
    }}>
      <span style={{
        color: isInternal ? 'var(--accent)' : 'var(--text-muted)',
        fontFamily: 'var(--font-mono)', fontSize: 14,
        width: 16, textAlign: 'center',
      }}>{iconFor(item.kind)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginTop: 1,
        }}>{item.path}</div>
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
        padding: '2px 5px',
        color: isInternal ? 'var(--accent)' : 'var(--text-muted)',
        border: `1px solid ${isInternal ? 'var(--accent)' : 'var(--border)'}`,
        background: isInternal ? 'var(--accent-soft)' : 'transparent',
      }}>{isInternal ? 'LIVE' : 'WEB'}</span>
    </div>
  );
}

// ============ ACTIVE PREVIEW (expanded dev browser) ============
function ActivePreview({ url, device, setDevice, onExit, width }) {
  const DEVICES = {
    desktop: { w: 1440, h: 900, label: 'Desktop' },
    tablet:  { w: 820,  h: 1180, label: 'Tablet' },
    phone:   { w: 390,  h: 844,  label: 'Phone' },
  };
  const dev = DEVICES[device];
  const scale = Math.min(1, Math.max(0.3, (width - 40) / dev.w));
  const displayW = dev.w * scale;
  const displayH = dev.h * scale;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: -14, minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px',
        background: 'var(--chrome)',
        borderBottom: '1px solid var(--border)',
      }}>
        <button onClick={onExit} title="Exit preview" style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
          color: 'var(--text-muted)',
          padding: '3px 8px',
          border: '1px solid var(--border)',
          letterSpacing: '0.08em',
        }}>← LIST</button>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--font-mono)', fontSize: 9.5,
          color: 'var(--accent)', letterSpacing: '0.14em',
          padding: '3px 6px',
          border: '1px solid var(--accent)',
          background: 'var(--accent-soft)',
        }}>
          <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: 999, animation: 'tcPulse 1.4s ease-in-out infinite' }} />
          LIVE
        </span>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px',
          border: '1px solid var(--border)',
          background: 'var(--bg-sunken)',
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)',
          minWidth: 0,
        }}>
          <span style={{ color: 'var(--text-dim)' }}>◀</span>
          <span style={{ color: 'var(--text-dim)' }}>▶</span>
          <span style={{ color: 'var(--text-dim)' }}>↻</span>
          <span style={{ color: 'var(--text-dim)' }}>·</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{url}</span>
        </div>
        <div style={{ display: 'flex', gap: 1, border: '1px solid var(--border)', padding: 1 }}>
          {Object.entries(DEVICES).map(([key, d]) => (
            <button key={key} onClick={() => setDevice(key)} style={{
              all: 'unset', cursor: 'pointer',
              padding: '3px 8px',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: device === key ? 'var(--bg)' : 'var(--text-muted)',
              background: device === key ? 'var(--text)' : 'transparent',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>{d.label.slice(0, 3)}</button>
          ))}
        </div>
      </div>

      {/* Viewport */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 20, overflow: 'auto',
        background: 'var(--bg-sunken)',
      }}>
        <div style={{
          width: displayW, height: displayH,
          background: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.2)',
          position: 'relative', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* Mock page content in lieu of live iframe */}
          <MockDevPage device={device} />
        </div>
      </div>

      {/* Statusline */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '5px 12px',
        background: 'var(--chrome)',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)',
        letterSpacing: '0.04em',
      }}>
        <span>{dev.w} × {dev.h}</span>
        <span>·</span>
        <span>{Math.round(scale * 100)}%</span>
        <span style={{ flex: 1 }} />
        <span>HMR: connected</span>
        <span>·</span>
        <span style={{ color: 'var(--ok)' }}>200 OK</span>
      </div>
    </div>
  );
}

function MockDevPage({ device }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #fafafa, #f3f3f3)',
      color: '#111',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      padding: device === 'phone' ? 20 : 40,
      display: 'flex', flexDirection: 'column', gap: 16,
      overflow: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, background: '#111', borderRadius: 6 }} />
        <div style={{ fontWeight: 600, fontSize: 15 }}>Your App</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#666' }}>v0.12.1</div>
      </div>
      <div style={{ fontSize: device === 'phone' ? 22 : 34, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 20 }}>
        Live preview of your dev server.
      </div>
      <div style={{ fontSize: 14, color: '#555', maxWidth: 520, lineHeight: 1.5 }}>
        This is a mocked interactive viewport. In the real app, an iframe renders your local server here — clicks, scroll and form inputs all work.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: device === 'phone' ? '1fr' : 'repeat(3, 1fr)', gap: 12, marginTop: 14 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8,
            padding: 16, display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ width: 28, height: 28, background: '#f0f0f0', borderRadius: 6 }} />
            <div style={{ fontWeight: 600, fontSize: 14 }}>Feature {i + 1}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Short description of what this does.</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ BOTTOM TERMINAL PANEL ============
function BottomTerminal({ open, setOpen }) {
  if (!open) return (
    <div onClick={() => setOpen(true)} style={{
      height: 26, background: 'var(--chrome)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: 14,
      fontFamily: 'var(--font-mono)', fontSize: 10.5,
      color: 'var(--text-muted)', cursor: 'pointer',
      letterSpacing: '0.04em',
    }}>
      <span style={{ color: 'var(--text)' }}>▴ terminal</span>
      <span style={{ color: 'var(--text-dim)' }}>bash · main</span>
      <span style={{ flex: 1 }} />
      <V2StatusDot kind="ok" />
      <span>ready</span>
    </div>
  );
  return (
    <div style={{
      height: 220, background: 'var(--bg-pane)',
      borderTop: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 14px', borderBottom: '1px solid var(--border)',
        background: 'var(--chrome)',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-muted)', height: 30, flexShrink: 0,
      }}>
        <span style={{ color: 'var(--text)' }}>TERMINAL</span>
        <span style={{ color: 'var(--text-dim)' }}>· bash · main</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: 'var(--text-dim)', cursor: 'pointer' }}>+</span>
        <button onClick={() => setOpen(false)} style={{
          all: 'unset', cursor: 'pointer', color: 'var(--text-dim)',
        }}>▾</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }}>
        <div style={{ color: 'var(--text-dim)' }}>~/forge $ <span style={{ color: 'var(--text)' }}>pnpm build</span></div>
        <div style={{ color: 'var(--text-muted)' }}>vite v5.4.10 building for production...</div>
        <div style={{ color: 'var(--text-muted)' }}>✓ 1,284 modules transformed.</div>
        <div style={{ color: 'var(--ok)' }}>✓ built in 2.48s</div>
        <div style={{ color: 'var(--text-dim)' }}>~/forge $ <span style={{ color: 'var(--text)' }}>git status</span></div>
        <div><span style={{ color: 'var(--warn)' }}>modified:</span> <span style={{ color: 'var(--text-muted)' }}>src/components/terminal/Terminal.jsx</span></div>
        <div><span style={{ color: 'var(--warn)' }}>modified:</span> <span style={{ color: 'var(--text-muted)' }}>src/styles/variables.css</span></div>
        <div style={{ color: 'var(--text-dim)' }}>~/forge $ <span style={{
          display: 'inline-block', width: 8, height: 13, background: 'var(--text)',
          verticalAlign: 'text-bottom', animation: 'tcCaret 1s step-end infinite',
        }} /></div>
      </div>
    </div>
  );
}

// ============ STATUS BAR — with Compute pulldown ============
function StatusBar({ computeOpen, setComputeOpen }) {
  return (
    <div style={{
      height: 24, background: 'var(--chrome)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 12px',
      fontFamily: 'var(--font-mono)', fontSize: 10.5,
      color: 'var(--text-muted)',
      letterSpacing: '0.04em', flexShrink: 0,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <V2StatusDot kind="ok" /> main
      </span>
      <span>3↑ 1↓</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>forge</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>2 modified</span>
      <span style={{ flex: 1 }} />
      <span
        onClick={() => setComputeOpen(!computeOpen)}
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: computeOpen ? 'var(--text)' : 'var(--text-muted)' }}
      >
        <V2StatusDot kind="run" pulse />
        DGX · 1 running · 2 queued
        <span style={{ color: 'var(--text-dim)' }}>{computeOpen ? '▾' : '▴'}</span>
      </span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>ln 5, col 32</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>utf-8 · lf</span>
    </div>
  );
}

function ComputePopover({ open }) {
  if (!open) return null;
  const jobs = [
    { id: 'j-1042', name: 'finetune-llama-7b', status: 'run', eta: '00:04:12', gpu: '4×H100' },
    { id: 'j-1041', name: 'eval-suite-v3', status: 'queued', eta: '—', gpu: '1×H100' },
    { id: 'j-1040', name: 'embed-index-rebuild', status: 'queued', eta: '—', gpu: '2×H100' },
    { id: 'j-1039', name: 'nightly-bench', status: 'ok', eta: '00:12:48', gpu: '1×H100' },
  ];
  return (
    <div style={{
      position: 'absolute', right: 12, bottom: 28, width: 460, zIndex: 50,
      background: 'var(--bg-raised)',
      border: '1px solid var(--border-strong)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-mono)', fontSize: 11,
      }}>
        <span style={{ color: 'var(--text)', letterSpacing: '0.08em' }}>COMPUTE · DGX SPARK</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: 'var(--text-muted)' }}>host: dgx.local · ssh ok</span>
      </div>
      <div>
        {jobs.map((j, i) => (
          <div key={j.id} style={{
            display: 'grid', gridTemplateColumns: '70px 1fr 80px 80px 14px',
            gap: 12, padding: '10px 14px', alignItems: 'center',
            borderBottom: i < jobs.length - 1 ? '1px solid var(--border)' : 'none',
            fontFamily: 'var(--font-mono)', fontSize: 12,
          }}>
            <span style={{ color: 'var(--text-dim)' }}>{j.id}</span>
            <span style={{ color: 'var(--text)' }}>{j.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>{j.gpu}</span>
            <span style={{ color: 'var(--text-muted)' }}>{j.eta}</span>
            <V2StatusDot kind={j.status === 'ok' ? 'ok' : j.status === 'run' ? 'run' : 'idle'} pulse={j.status === 'run'} />
          </div>
        ))}
      </div>
      <div style={{
        padding: '8px 14px', borderTop: '1px solid var(--border)',
        background: 'var(--chrome)',
        display: 'flex', gap: 18,
        fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)',
      }}>
        <span><span style={{ color: 'var(--text-muted)' }}>↵</span> open</span>
        <span><span style={{ color: 'var(--text-muted)' }}>N</span> new job</span>
        <span><span style={{ color: 'var(--text-muted)' }}>K</span> kill</span>
        <span style={{ flex: 1 }} />
        <span>connection in Settings › Compute</span>
      </div>
    </div>
  );
}

// ============ TOP BAR ============
function TopBar({ tone, setTone, projectTabs, activeProject, setActiveProject, setSettingsOpen, leftCollapsed, rightCollapsed, toggleLeft, toggleRight, leftWidth }) {
  return (
    <div style={{
      height: 38, flexShrink: 0,
      display: 'flex', alignItems: 'stretch',
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: leftCollapsed ? 32 : leftWidth, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: leftCollapsed ? '0 4px' : '0 14px',
        borderRight: '1px solid var(--border)',
        transition: 'width 220ms cubic-bezier(0.2,0.8,0.2,1), padding 220ms',
        overflow: 'hidden',
      }}>
        <div style={{
          width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <SpacemanGlyph size={20} />
        </div>
        {!leftCollapsed && (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '-0.01em', color: 'var(--text)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            Dev-Space<span style={{ color: 'var(--text-dim)' }}>.ai</span>
          </div>
        )}
        <DrawerToggle side="left" collapsed={leftCollapsed} onClick={toggleLeft} />
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {projectTabs.map(p => (
          <div key={p.id} onClick={() => setActiveProject(p.id)} style={{
            padding: '0 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: p.id === activeProject ? 'var(--text)' : 'var(--text-muted)',
            background: p.id === activeProject ? 'var(--bg)' : 'transparent',
            borderRight: '1px solid var(--border)',
            cursor: 'pointer',
          }}>
            <V2StatusDot kind={p.activity === 'run' ? 'run' : 'idle'} pulse={p.activity === 'run'} />
            <span>{p.name}</span>
            {p.dirty && <span style={{ color: 'var(--warn)', fontSize: 9 }}>●</span>}
            <span style={{ color: 'var(--text-dim)', marginLeft: 4 }}>×</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 12px',
        borderLeft: '1px solid var(--border)',
      }}>
        <DrawerToggle side="right" collapsed={rightCollapsed} onClick={toggleRight} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
          color: 'var(--text-dim)', padding: '3px 8px',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}>⌘K command</span>
        <span
          onClick={() => setSettingsOpen(true)}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: 'var(--text-muted)', padding: '3px 8px',
            border: '1px solid var(--border)',
            cursor: 'pointer', letterSpacing: '0.04em',
          }}
        >⌘, settings</span>
      </div>
    </div>
  );
}

// ============ SETTINGS MODAL ============
function SettingsModal({ open, onClose, tone, setTone }) {
  const [section, setSection] = React.useState('appearance');
  if (!open) return null;
  const sections = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'compute', label: 'Compute' },
    { id: 'editor', label: 'Editor' },
    { id: 'spaceman', label: 'Spaceman' },
    { id: 'developer', label: 'Developer' },
  ];
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 880, maxWidth: '100%', height: 560, maxHeight: '100%',
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-strong)',
        display: 'flex', overflow: 'hidden',
        boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          width: 200, flexShrink: 0,
          background: 'var(--chrome)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text)', letterSpacing: '0.14em',
          }}>SETTINGS</div>
          {sections.map(s => (
            <div key={s.id} onClick={() => setSection(s.id)} style={{
              padding: '9px 16px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 12.5,
              color: section === s.id ? 'var(--text)' : 'var(--text-muted)',
              background: section === s.id ? 'var(--accent-soft)' : 'transparent',
              borderLeft: section === s.id ? '2px solid var(--accent)' : '2px solid transparent',
            }}>{s.label}</div>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{
            all: 'unset', cursor: 'pointer',
            padding: '10px 16px',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-dim)',
            borderTop: '1px solid var(--border)',
            letterSpacing: '0.08em',
          }}>esc · close</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {section === 'appearance' && <AppearanceSettings tone={tone} setTone={setTone} />}
          {section !== 'appearance' && (
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10.5,
                color: 'var(--text-dim)', letterSpacing: '0.16em',
                textTransform: 'uppercase', marginBottom: 8,
              }}>{section}</div>
              <div style={{ fontSize: 20, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 16 }}>
                {sections.find(s => s.id === section).label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: 440 }}>
                {section === 'integrations' && 'API keys for Anthropic, OpenAI, and HuggingFace. Tokens are stored in the system keychain.'}
                {section === 'compute' && 'DGX Spark host, SSH key, default GPU allocation, job defaults.'}
                {section === 'editor' && 'Font size, tab width, wrap mode, formatter preferences.'}
                {section === 'spaceman' && 'Default model, context window, agent limits, approval policy.'}
                {section === 'developer' && 'Debug tools, log levels, internal state inspector.'}
              </div>
              <div style={{
                marginTop: 24, padding: 14,
                border: '1px dashed var(--border-strong)',
                fontFamily: 'var(--font-mono)', fontSize: 11.5,
                color: 'var(--text-dim)',
              }}>placeholder · not wired for design pass</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings({ tone, setTone }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10.5,
        color: 'var(--text-dim)', letterSpacing: '0.16em',
        textTransform: 'uppercase', marginBottom: 8,
      }}>Appearance</div>
      <div style={{ fontSize: 20, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>Theme</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 460, lineHeight: 1.5 }}>
        Dev-Space ships with three themes. Your choice is persisted per device.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {DIRECTIONS.map(d => {
          const active = d.id === tone.id;
          return (
            <div key={d.id} onClick={() => setTone(d)} style={{
              cursor: 'pointer',
              border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
              outline: active ? '1px solid var(--accent)' : 'none',
              outlineOffset: '-2px',
              background: d.bg,
              padding: 0, overflow: 'hidden',
            }}>
              <div style={{ background: d.chrome, padding: '8px 10px', borderBottom: `1px solid ${d.border}`, display: 'flex', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: d.success }} />
                <span style={{ fontFamily: d.fontMono, fontSize: 9, color: d.textMuted, letterSpacing: '0.08em' }}>TERM</span>
              </div>
              <div style={{ padding: 12, fontFamily: d.fontMono, fontSize: 10, color: d.text, lineHeight: 1.7 }}>
                <div style={{ color: d.textDim }}>$ pnpm build</div>
                <div style={{ color: d.textMuted }}>✓ 1,284 modules</div>
                <div style={{ color: d.success }}>✓ built in 2.48s</div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ color: d.accent }}>▌</span>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderTop: `1px solid ${d.border}`, background: d.chrome,
              }}>
                <span style={{
                  width: 10, height: 10, border: `1px solid ${active ? d.accent : d.borderStrong}`, borderRadius: 999,
                  background: active ? d.accent : 'transparent',
                }} />
                <span style={{ fontFamily: d.fontUi, fontSize: 12, color: d.text }}>{d.name}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: d.fontMono, fontSize: 9, color: d.textDim, letterSpacing: '0.08em' }}>
                  {d.id === 'terminal' ? '01' : d.id === 'graphite' ? '02' : '03'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10.5,
        color: 'var(--text-dim)', letterSpacing: '0.14em',
        textTransform: 'uppercase', marginBottom: 10,
      }}>More</div>
      <Row label="Follow system dark/light" value="off" />
      <Row label="Monospace font" value="JetBrains Mono" />
      <Row label="UI font" value="Geist" />
      <Row label="Interface density" value="Compact" />
      <Row label="Reduce motion" value="off" last />
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '10px 2px',
      borderBottom: last ? 'none' : '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--text)' }}>{label}</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-muted)' }}>{value}</span>
      <span style={{ marginLeft: 12, color: 'var(--text-dim)', fontSize: 11 }}>→</span>
    </div>
  );
}

// ============ IDE SHELL ============
function IDE() {
  const [tone, setTone] = React.useState(DIRECTIONS[0]);
  const [railPage, setRailPage] = React.useState('files');
  const [openProjectId, setOpenProjectId] = React.useState('forge');
  const [activeProject, setActiveProject] = React.useState('forge');
  const [termOpen, setTermOpen] = React.useState(true);
  const [computeOpen, setComputeOpen] = React.useState(false);
  const [editorTab, setEditorTab] = React.useState(0);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  // Per-project terminal sets. Each project starts empty — the user spawns
  // agents as needed from the "+" in the sub-tab bar or via Spaceman. The
  // currently-seeded `forge` project gets a preload so the initial landing
  // view isn't blank; all others open to the empty "NO TERMINALS" card.
  const [terminalsByProject, setTerminalsByProject] = React.useState(() => ({
    forge: window.seedTerminals(),
    archivist: [],
    mindcraft: [],
    routines: [],
  }));
  const [activeTermByProject, setActiveTermByProject] = React.useState({
    forge: 't-1',
    archivist: null,
    mindcraft: null,
    routines: null,
  });
  // Per-project Spaceman state. Each project carries its own Spaceman
  // conversation, chain, memory, and browser items. Switching the project
  // tab swaps the drawer's contents in and out; coming back restores
  // exactly what was there before.
  const [spacemanByProject, setSpacemanByProject] = React.useState(() => seedSpaceman());
  const spaceman = spacemanByProject[activeProject] || emptySpaceman();
  const setSpaceman = React.useCallback((updater) => {
    setSpacemanByProject(prev => {
      const cur = prev[activeProject] || emptySpaceman();
      const next = typeof updater === 'function' ? updater(cur) : updater;
      return { ...prev, [activeProject]: next };
    });
  }, [activeProject]);
  const terminals = terminalsByProject[activeProject] || [];
  const activeTermId = activeTermByProject[activeProject] || null;
  const setTerminals = React.useCallback((updater) => {
    setTerminalsByProject(prev => {
      const cur = prev[activeProject] || [];
      const next = typeof updater === 'function' ? updater(cur) : updater;
      return { ...prev, [activeProject]: next };
    });
  }, [activeProject]);
  const setActiveTermId = React.useCallback((id) => {
    setActiveTermByProject(prev => ({ ...prev, [activeProject]: id }));
  }, [activeProject]);
  const [leftWidth, setLeftWidth] = React.useState(260);
  const [rightWidth, setRightWidth] = React.useState(340);
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const [previewExpanded, setPreviewExpanded] = React.useState(false);
  // New-project flow
  const [pickerAnchor, setPickerAnchor] = React.useState(null);
  const [newProjectKind, setNewProjectKind] = React.useState(null);
  // when preview expands, swell drawer to ~45% viewport, remembering the old width
  const [savedRightWidth, setSavedRightWidth] = React.useState(null);
  React.useEffect(() => {
    if (previewExpanded) {
      setSavedRightWidth(rightWidth);
      const target = Math.max(640, Math.min(Math.round(window.innerWidth * 0.5), 900));
      setRightWidth(target);
    } else if (savedRightWidth != null) {
      setRightWidth(savedRightWidth);
      setSavedRightWidth(null);
    }
    // eslint-disable-next-line
  }, [previewExpanded]);

  const projects = [
    {
      id: 'forge', name: 'forge', branch: 'main', last: '12m',
      dirty: true, activity: 'run',
      files: [
        { name: 'src/', children: [
          { name: 'components/', open: true, children: [
            { name: 'terminal/', children: [
              { name: 'Terminal.jsx', git: 'M', active: true },
              { name: 'Terminal.css' },
            ]},
            { name: 'bridge/', children: [
              { name: 'Bridge.jsx' },
              { name: 'BridgeChat.jsx' },
            ]},
          ]},
          { name: 'styles/', children: [
            { name: 'variables.css', git: 'M' },
            { name: 'global.css' },
          ]},
          { name: 'App.jsx' },
          { name: 'main.jsx' },
        ]},
        { name: 'electron/', children: [
          { name: 'main.js' },
          { name: 'preload.js' },
        ]},
        { name: 'package.json' },
        { name: 'README.md' },
      ],
    },
    { id: 'archivist', name: 'archivist', branch: 'feat/diff', last: '2h', dirty: false, activity: 'idle', files: [] },
    { id: 'mindcraft', name: 'mindcraft', branch: 'develop', last: '3d', dirty: false, activity: 'idle', files: [] },
    { id: 'routines',  name: 'routines',  branch: 'main',      last: '6h', dirty: false, activity: 'idle', files: [] },
  ];

  const openTabs = [
    { id: 'forge', name: 'forge', activity: 'run', dirty: true },
    { id: 'archivist', name: 'archivist', activity: 'idle', dirty: false },
  ];

  const editorTabs = [
    { name: 'Terminal.jsx', dirty: true },
    { name: 'variables.css', dirty: true },
    { name: 'App.jsx', dirty: false },
  ];

  return (
    <div style={{
      ...themeVars(tone),
      width: '100%', height: '100%',
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>
      <TopBar
        tone={tone} setTone={setTone}
        projectTabs={openTabs}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        setSettingsOpen={setSettingsOpen}
        leftCollapsed={leftCollapsed} rightCollapsed={rightCollapsed}
        toggleLeft={() => setLeftCollapsed(v => !v)}
        toggleRight={() => setRightCollapsed(v => !v)}
        leftWidth={leftWidth}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {leftCollapsed ? (
          <CollapsedLeftRail onExpand={() => setLeftCollapsed(false)} />
        ) : (
          <LeftRail
            activePage={railPage} setActivePage={setRailPage}
            openProjectId={openProjectId} setOpenProjectId={setOpenProjectId}
            projects={projects}
            width={leftWidth} onResize={setLeftWidth}
            onNewProject={(rect) => setPickerAnchor(rect)}
            onNewFile={() => {/* stub — opens file picker, future */}}
          />
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {newProjectKind ? (
            <window.NewProjectForm
              kind={newProjectKind}
              onSave={() => setNewProjectKind(null)}
              onDiscard={() => setNewProjectKind(null)}
            />
          ) : (
            <window.WorkspaceCenter
              terminals={terminals} setTerminals={setTerminals}
              activeTermId={activeTermId} setActiveTermId={setActiveTermId}
            />
          )}
        </div>
        {rightCollapsed ? (
          <CollapsedRightRail onExpand={() => setRightCollapsed(false)} />
        ) : (
          <SpacemanSidebar
            width={rightWidth} onResize={setRightWidth}
            onCollapse={() => setRightCollapsed(true)}
            previewExpanded={previewExpanded}
            setPreviewExpanded={setPreviewExpanded}
            state={spaceman}
            setState={setSpaceman}
          />
        )}
      </div>
      <window.SpacemanPromptStrip activeTerm={terminals.find(t => t.id === activeTermId)} />
      <StatusBar computeOpen={computeOpen} setComputeOpen={setComputeOpen} />
      <ComputePopover open={computeOpen} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} tone={tone} setTone={setTone} />
      <window.NewProjectPicker
        open={!!pickerAnchor}
        anchorRect={pickerAnchor}
        onPick={(kind) => setNewProjectKind(kind)}
        onClose={() => setPickerAnchor(null)}
      />
    </div>
  );
}

Object.assign(window, { IDE });

// ============ SPACEMAN PER-PROJECT SEED ============
// Each project gets its own conversation, chain, memory bank, and browser
// queue. Seeds are opinionated by project so switching tabs is immediately
// visible; in production these would load from persistent storage.
function emptySpaceman() {
  return {
    tab: 'chat',
    chat: [],
    chain: null,
    memory: [],
    browser: { url: '', device: 'desktop', items: [] },
  };
}

function seedSpaceman() {
  return {
    forge: {
      tab: 'chat',
      chat: [
        {
          role: 'you', meta: '14:22',
          text: 'Refactor the theme variables to use the new [data-theme] selector.',
        },
        {
          role: 'spaceman', meta: 'sonnet',
          text: "I'll plan this across tokens.jsx and variables.css. Spawning an agent to survey usages first.",
          tool: {
            head: 'spawn agent[1]',
            body: 'scan usages of themeVars() across /src',
            foot: '14 files · 38kb context · 420ms',
          },
        },
        {
          role: 'spaceman', meta: 'sonnet',
          text: 'Survey complete — 14 call sites, 3 clusters. Drafting migration plan now.',
        },
      ],
      chain: {
        name: 'theme-migration',
        steps: [
          { n: 1, name: 'scan_usages', status: 'ok' },
          { n: 2, name: 'plan_migration', status: 'run' },
          { n: 3, name: 'apply_edits', status: 'idle' },
          { n: 4, name: 'verify_tests', status: 'idle' },
        ],
      },
      memory: [
        { t: 'DECISION', c: 'Sliding rail pages, not dual-panel' },
        { t: 'PATTERN',  c: 'Theme = attribute on <html>' },
        { t: 'CORRECT',  c: 'File tree lives per-project, not global' },
      ],
      browser: {
        url: 'dev-space://preview/Terminal.jsx',
        device: 'desktop',
        items: [
          { kind: 'html',  name: 'dev preview · Dashboard', path: 'http://localhost:5173/dashboard', from: 'agent-2' },
          { kind: 'html',  name: 'storybook · Button', path: 'localhost:6006/iframe.html?id=button--primary', from: 'agent-1' },
          { kind: 'file',  name: 'Terminal.jsx', path: 'src/components/terminal/Terminal.jsx', from: 'agent-1' },
          { kind: 'img',   name: 'diff.png', path: 'tmp/diff.png', from: 'agent-x' },
          { kind: 'html',  name: 'generated · landing-v3', path: 'dev-space://preview/landing-v3.html', from: 'spaceman' },
          { kind: 'link',  name: 'react docs · useSyncExternalStore', path: 'https://react.dev/reference/react/useSyncExternalStore', from: 'you' },
          { kind: 'link',  name: 'MDN · CSS container queries', path: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries', from: 'spaceman' },
        ],
      },
    },
    archivist: {
      tab: 'chat',
      chat: [
        {
          role: 'you', meta: 'yesterday',
          text: 'Index the last 30 days of git history and surface PRs that touched the diff engine.',
        },
        {
          role: 'spaceman', meta: 'haiku',
          text: 'Pulled 412 commits, 18 PRs. 4 of them touch DiffView directly. Want me to summarize them?',
          tool: {
            head: 'git log --since=30d --name-only',
            body: '412 commits scanned',
            foot: 'cached in ~/.spaceman/idx/archivist',
          },
        },
      ],
      chain: {
        name: 'diff-engine-audit',
        steps: [
          { n: 1, name: 'pull_pr_history', status: 'ok' },
          { n: 2, name: 'cluster_touched_files', status: 'ok' },
          { n: 3, name: 'draft_summary', status: 'idle' },
        ],
      },
      memory: [
        { t: 'DECISION', c: 'Diff engine = monaco + custom gutter, not vscode-diff' },
        { t: 'PATTERN',  c: 'Every PR carries a "Spaceman plan" block in the body' },
      ],
      browser: {
        url: '',
        device: 'desktop',
        items: [
          { kind: 'link', name: 'PR #1204 · rewrite diff gutter', path: 'https://github.com/org/archivist/pull/1204', from: 'spaceman' },
          { kind: 'link', name: 'PR #1189 · token-level highlight', path: 'https://github.com/org/archivist/pull/1189', from: 'spaceman' },
          { kind: 'file', name: 'DiffView.tsx', path: 'src/views/DiffView.tsx', from: 'agent-1' },
        ],
      },
    },
    mindcraft: {
      tab: 'memory',
      chat: [],
      chain: null,
      memory: [
        { t: 'DECISION', c: 'Minecraft bot uses LLM planner + BT executor' },
        { t: 'PATTERN',  c: 'Every skill returns {status, evidence, next}' },
        { t: 'CORRECT',  c: 'Inventory snapshots belong in memory, not context' },
      ],
      browser: { url: '', device: 'desktop', items: [] },
    },
    routines: {
      tab: 'chat',
      chat: [],
      chain: null,
      memory: [],
      browser: { url: '', device: 'desktop', items: [] },
    },
  };
}
