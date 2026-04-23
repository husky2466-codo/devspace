// Dev-Space v3 — IDE with wired interactions
// New vs v2:
//   • EDITOR tab in Spaceman drawer (5th tab)
//     – icon-only when drawer is narrow, active tab keeps label
//     – clicking a file in the left rail opens it here + expands drawer to 58%
//     – file tab bar, breadcrumb, find/replace (⌘F), LSP error panel
//     – ghost suggestion overlay when Spaceman proposes an edit
//   • PROJECT | GLOBAL toggle in drawer header
//     – GLOBAL mode: cool accent, aggregated CHAT/MEMORY/CHAIN, EDITOR+BROWSER disabled
//   • Dirty guard on file-tab × close
//   • macOS native title bar (28px) with traffic lights + project/branch center title
//   All shared primitives (ResizeHandle, StatusDot, etc.) inline below.

// ─── PRIMITIVES ──────────────────────────────────────────────────

function V3Dot({ kind = 'idle', pulse = false, size = 6 }) {
  const color = { ok:'var(--ok)', run:'var(--running)', err:'var(--err)',
                  warn:'var(--warn)', info:'var(--info)', global:'var(--accent-global)' }[kind] || 'var(--text-dim)';
  return <span style={{ display:'inline-block', width:size, height:size, borderRadius:999,
    background:color, flexShrink:0, animation: pulse ? 'smPulse 1.4s ease-in-out infinite' : 'none' }} />;
}

function V3ResizeHandle({ side, onResize, min=180, max=900 }) {
  const onMouseDown = e => {
    e.preventDefault();
    const startX = e.clientX, startW = e.currentTarget.parentElement.offsetWidth;
    const move = ev => {
      const dx = ev.clientX - startX;
      const raw = side === 'right' ? startW + dx : startW - dx;
      onResize(Math.max(min, Math.min(max, raw)));
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.body.style.cursor = document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  return <div onMouseDown={onMouseDown} style={{ position:'absolute', top:0, bottom:0,
    [side]:-3, width:6, zIndex:20, cursor:'col-resize' }}
    onMouseEnter={e=>e.currentTarget.style.background='var(--accent-soft)'}
    onMouseLeave={e=>e.currentTarget.style.background='transparent'} />;
}

function V3TrafficLights() {
  const [h, setH] = React.useState(false);
  const D = ({ bg, g }) => <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{ width:12, height:12, borderRadius:999, background:bg, display:'flex',
      alignItems:'center', justifyContent:'center', color:'rgba(0,0,0,.55)', fontSize:8, fontWeight:700 }}>
    {h ? g : ''}
  </div>;
  return <div style={{ display:'flex', gap:8 }}><D bg="#ff5f57" g="×" /><D bg="#febc2e" g="−" /><D bg="#28c840" g="+" /></div>;
}

function V3SpacemanMark({ size=22, mode='project' }) {
  const col = mode === 'global' ? 'var(--accent-global)' : 'var(--border-active)';
  return <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ flexShrink:0 }}>
    {mode === 'global' && <ellipse cx="11" cy="11" rx="10.5" ry="3.2"
      stroke={col} strokeWidth="0.6" transform="rotate(-22 11 11)" opacity="0.65" />}
    <circle cx="11" cy="11" r="8.5" stroke={col} strokeWidth="1" />
    <path d="M 3.5 9.5 Q 11 6.5 18.5 9.5 L 18.5 12.5 Q 11 15.5 3.5 12.5 Z" fill={col} opacity="0.25" />
    <circle cx="8.5" cy="10" r="1" fill={col} />
    <line x1="11" y1="2.5" x2="11" y2="0.5" stroke={col} strokeWidth="1" />
    <circle cx="11" cy="0.5" r="0.8" fill={col} />
  </svg>;
}

// Tab glyphs for the 5-tab drawer
const TAB_GLYPHS = {
  chat:    <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><path d="M1.5 2h9v6h-5l-2.5 2V8h-1.5z" stroke="currentColor" /></svg>,
  browser: <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="8" stroke="currentColor" /><line x1="1" y1="4.5" x2="11" y2="4.5" stroke="currentColor" /></svg>,
  editor:  <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><path d="M2 1.5v9M4 3h6M4 5.5h4M4 8h5" stroke="currentColor" /></svg>,
  chain:   <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><circle cx="3" cy="3" r="1.5" stroke="currentColor" /><circle cx="9" cy="9" r="1.5" stroke="currentColor" /><path d="M4.2 4.2L7.8 7.8" stroke="currentColor" /></svg>,
  memory:  <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2" width="9" height="2" stroke="currentColor" /><rect x="1.5" y="5" width="9" height="2" stroke="currentColor" /><rect x="1.5" y="8" width="9" height="2" stroke="currentColor" /></svg>,
};

// ─── LEFT RAIL ────────────────────────────────────────────────────

function V3LeftRail({ width, onResize, page, setPage, projects, activeProjectId, setActiveProjectId, onFileOpen }) {
  const proj = projects.find(p => p.id === activeProjectId);
  return (
    <div style={{ width, flexShrink:0, background:'var(--chrome)', borderRight:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
      <V3ResizeHandle side="right" onResize={onResize} min={160} max={420} />
      {/* Projects page */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
        transform: page === 'projects' ? 'translateX(0)' : 'translateX(-100%)',
        transition:'transform 240ms cubic-bezier(.2,.8,.2,1)' }}>
        <RailHeader label="PROJECTS" onAction={() => {}} />
        <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
          {projects.map(p => (
            <V3ProjectRow key={p.id} project={p} active={p.id === activeProjectId}
              onSelect={() => { setActiveProjectId(p.id); setPage('files'); }} />
          ))}
        </div>
      </div>
      {/* Files page */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
        transform: page === 'files' ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 240ms cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderBottom:'1px solid var(--border)' }}>
          <button onClick={() => setPage('projects')} style={{
            all:'unset', cursor:'pointer', width:22, height:22, display:'flex',
            alignItems:'center', justifyContent:'center',
            color:'var(--text-muted)', border:'1px solid var(--border)', fontSize:12 }}>←</button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-dim)', letterSpacing:'0.14em' }}>PROJECT</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text)', marginTop:1,
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{proj?.name}</div>
          </div>
          <V3Dot kind={proj?.dirty ? 'warn' : 'ok'} size={5} />
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
          {proj && <V3FileTree files={proj.files} onFileOpen={onFileOpen} />}
        </div>
      </div>
    </div>
  );
}

function RailHeader({ label, onAction }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'10px 14px 7px',
      borderBottom:'1px solid var(--border)',
      fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', letterSpacing:'0.14em' }}>
      <span style={{ flex:1 }}>{label}</span>
      <span onClick={onAction} style={{ color:'var(--text-muted)', cursor:'pointer',
        padding:'2px 6px', border:'1px solid var(--border)', fontSize:9 }}>+ NEW</span>
    </div>
  );
}

function V3ProjectRow({ project, active, onSelect }) {
  return (
    <div onClick={onSelect} style={{ display:'flex', alignItems:'center', gap:8,
      padding:'7px 10px 7px 12px',
      background: active ? 'var(--accent-soft)' : 'transparent',
      borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
      cursor:'pointer' }}>
      <V3Dot kind={project.activity === 'run' ? 'run' : 'idle'} pulse={project.activity === 'run'} size={5} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'var(--font-ui)', fontSize:13, color:'var(--text)',
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{project.name}</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', marginTop:1 }}>
          {project.branch} · {project.last}
        </div>
      </div>
      {project.dirty && <span style={{ color:'var(--warn)', fontSize:9 }}>●</span>}
    </div>
  );
}

function V3FileTree({ files, depth = 0, onFileOpen }) {
  return <>{files.map((f,i) => <V3FileNode key={i} node={f} depth={depth} onFileOpen={onFileOpen} />)}</>;
}

function V3FileNode({ node, depth, onFileOpen }) {
  const [open, setOpen] = React.useState(node.open ?? depth < 2);
  const isDir = !!node.children;
  const pad = 10 + depth * 12;
  const handleClick = () => {
    if (isDir) setOpen(o => !o);
    else onFileOpen?.(node);
  };
  return <>
    <div onClick={handleClick} style={{ display:'flex', alignItems:'center', gap:5,
      padding:`2px 8px 2px 0`, paddingLeft:pad,
      fontFamily:'var(--font-mono)', fontSize:11.5,
      color: node.active ? 'var(--text)' : 'var(--text-muted)',
      background: node.active ? 'var(--accent-soft)' : 'transparent',
      borderLeft: node.active ? '2px solid var(--accent)' : '2px solid transparent',
      cursor:'pointer', lineHeight:1.5 }}>
      {isDir
        ? <span style={{ width:10, color:'var(--text-dim)', fontSize:9 }}>{open ? '▾' : '▸'}</span>
        : <span style={{ width:10, color:'var(--text-dim)', fontSize:9 }}>·</span>}
      <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        color: node.active ? 'var(--text)' : (isDir ? 'var(--text)' : 'var(--text-muted)') }}>{node.name}</span>
      {node.git && <span style={{ marginLeft:'auto', fontSize:9,
        color: node.git === 'M' ? 'var(--warn)' : node.git === 'A' ? 'var(--ok)' : 'var(--err)' }}>{node.git}</span>}
      {node.errors && node.errors.length > 0 && <span style={{ marginLeft:'auto', fontSize:9, color:'var(--err)' }}>✗{node.errors.length}</span>}
    </div>
    {isDir && open && <V3FileTree files={node.children} depth={depth+1} onFileOpen={onFileOpen} />}
  </>;
}

// ─── EDITOR IN DRAWER ────────────────────────────────────────────

function V3EditorInDrawer({ file, onClose, drawerWidth }) {
  const [findOpen, setFindOpen] = React.useState(false);
  const [replaceOpen, setReplaceOpen] = React.useState(false);
  const [query, setQuery] = React.useState('caret');
  const [panelOpen, setPanelOpen] = React.useState(file?.errors?.length > 0);
  const [ghost, setGhost] = React.useState(file?.ghost || false);
  const [ghostAccepted, setGhostAccepted] = React.useState(false);
  const [dirtyGuard, setDirtyGuard] = React.useState(null); // null | 'closing'

  // ⌘F listener
  React.useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); setFindOpen(o => !o); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') { e.preventDefault(); setFindOpen(true); setReplaceOpen(true); }
      if (e.key === 'Escape') { setFindOpen(false); setReplaceOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!file) return <EditorEmptyState />;

  const errors = file.errors || [];
  const hasErrors = errors.filter(e => e.sev === 'err').length > 0;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* File tab bar */}
      <div style={{ height:26, flexShrink:0, background:'var(--chrome)',
        borderBottom:'1px solid var(--border)', display:'flex', alignItems:'stretch',
        fontFamily:'var(--font-mono)', fontSize:10.5 }}>
        <div style={{ padding:'0 10px', display:'flex', alignItems:'center', gap:6,
          color:'var(--text)', background:'var(--bg)',
          borderRight:'1px solid var(--border)',
          borderTop: hasErrors ? '1px solid var(--err)' : '1px solid var(--accent)',
          flex:1, minWidth:0 }}>
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</span>
          {file.dirty && <span style={{ color:'var(--warn)', fontSize:8, flexShrink:0 }}>●</span>}
          {hasErrors && <span style={{ color:'var(--err)', fontSize:8, padding:'0 3px',
            border:'1px solid var(--err)', flexShrink:0 }}>✗{errors.filter(e=>e.sev==='err').length}</span>}
          <span style={{ flex:1 }} />
          <span onClick={() => file.dirty ? setDirtyGuard('closing') : onClose()}
            style={{ color:'var(--text-dim)', fontSize:10, cursor:'pointer', flexShrink:0 }}>×</span>
        </div>
        <div style={{ padding:'0 8px', display:'flex', alignItems:'center', gap:6,
          borderLeft:'1px solid var(--border)' }}>
          <ToolBtn label="split" />
          <ToolBtn label="⤢" title="Pop out" />
        </div>
      </div>

      {/* Dirty guard */}
      {dirtyGuard === 'closing' && (
        <div style={{ flexShrink:0, background:'var(--bg-raised)',
          borderBottom:'1px solid var(--border)', borderLeft:'2px solid var(--warn)' }}>
          <div style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:10 }}>
            <V3Dot kind="warn" />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text)' }}>
                {file.name} has unsaved changes.</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>Save or discard before closing.</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:6, padding:'6px 12px',
            background:'var(--bg-sunken)', borderTop:'1px solid var(--border)' }}>
            <GuardBtn primary label="⇧⌘S  SAVE" onClick={() => { setDirtyGuard(null); onClose(); }} />
            <GuardBtn label="DISCARD" onClick={() => { setDirtyGuard(null); onClose(); }} />
            <GuardBtn label="KEEP OPEN" onClick={() => setDirtyGuard(null)} />
            <span style={{ flex:1 }} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-dim)', alignSelf:'center' }}>esc</span>
          </div>
          {/* Compact diff */}
          <div style={{ padding:'6px 12px', fontFamily:'var(--font-mono)', fontSize:10, lineHeight:1.45 }}>
            <div style={{ color:'var(--text-dim)', fontSize:9, letterSpacing:'0.1em', marginBottom:3 }}>UNSAVED DIFF</div>
            <div style={{ color:'var(--ok)' }}>+ import {'{ useBlink }'} from '../hooks/useBlink';</div>
            <div style={{ color:'var(--err)', textDecoration:'line-through', opacity:0.7 }}>- const [caret, setCaret] = useState(true);</div>
            <div style={{ color:'var(--ok)' }}>+ const caret = useBlink(true);</div>
          </div>
        </div>
      )}

      {/* Ghost suggestion banner */}
      {ghost && !ghostAccepted && (
        <div style={{ flexShrink:0, padding:'6px 12px',
          background:'var(--accent-soft)', borderBottom:'1px solid var(--accent)',
          display:'flex', alignItems:'center', gap:8,
          fontFamily:'var(--font-mono)', fontSize:10 }}>
          <V3Dot kind="run" pulse size={5} />
          <span style={{ color:'var(--accent)', letterSpacing:'0.08em' }}>SPACEMAN</span>
          <span style={{ color:'var(--text-muted)' }}>proposing · extract caret blink into useBlink</span>
          <span style={{ flex:1 }} />
          <GhostBtn primary label="⇥ Accept" onClick={() => setGhostAccepted(true)} />
          <GhostBtn label="Esc" onClick={() => setGhost(false)} />
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ flexShrink:0, padding:'3px 12px',
        fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--text-dim)',
        background:'var(--bg-sunken)', borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:6 }}>
        <span>{file.path}</span><span style={{ color:'var(--text-muted)' }}>{file.name}</span>
        <span style={{ flex:1 }} />
        {file.git && <span style={{ color: file.git === 'M' ? 'var(--warn)' : 'var(--ok)' }}>{file.git}</span>}
        {file.branch && <span>{file.branch}</span>}
      </div>

      {/* Find / Replace */}
      {findOpen && (
        <div style={{ flexShrink:0, background:'var(--bg-raised)',
          borderBottom:'1px solid var(--border)', padding:'6px 10px',
          display:'flex', flexDirection:'column', gap:4 }}>
          <div style={{ display:'flex', gap:5, alignItems:'center' }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:6,
              padding:'4px 8px', background:'var(--bg-sunken)',
              border:'1px solid var(--accent)' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-dim)' }}>⌘F</span>
              <span style={{ flex:1, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text)' }}>
                {query}<span style={{ display:'inline-block', width:1.5, height:12,
                  background:'var(--text)', verticalAlign:'text-bottom', marginLeft:1,
                  animation:'smCaret 1s step-end infinite' }} />
              </span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--accent)' }}>2/4</span>
            </div>
            <ToolBtn label="▲" /><ToolBtn label="▼" />
            <ToolBtn label="Aa" /><ToolBtn label=".*" />
            <ToolBtn label="⌘H" active={replaceOpen} onClick={() => setReplaceOpen(o=>!o)} />
            <ToolBtn label="×" onClick={() => { setFindOpen(false); setReplaceOpen(false); }} />
          </div>
          {replaceOpen && (
            <div style={{ display:'flex', gap:5, alignItems:'center' }}>
              <div style={{ flex:1, display:'flex', alignItems:'center', gap:6,
                padding:'4px 8px', background:'var(--bg-sunken)',
                border:'1px solid var(--border)' }}>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-dim)' }}>⌘H</span>
                <span style={{ flex:1, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ok)' }}>blinkOn</span>
              </div>
              <ToolBtn accent label="↵ this" />
              <ToolBtn accent label="↵ all" />
            </div>
          )}
        </div>
      )}

      {/* Code */}
      <div style={{ flex:1, minHeight:0, overflow:'auto', padding:'8px 0' }}>
        <V3EditorCode file={file} ghost={ghost} ghostAccepted={ghostAccepted} query={findOpen ? query : null} />
      </div>

      {/* LSP error panel */}
      {errors.length > 0 && (
        <div style={{ flexShrink:0, background:'var(--bg-pane)', borderTop:'1px solid var(--border)' }}>
          <div onClick={() => setPanelOpen(o=>!o)} style={{
            display:'flex', alignItems:'center', gap:8, padding:'5px 10px',
            cursor:'pointer', background:'var(--chrome)',
            fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.08em', color:'var(--text-muted)' }}>
            <span style={{ color:'var(--text-dim)' }}>{panelOpen ? '▾' : '▸'}</span>
            <span style={{ color:'var(--err)' }}>✗ {errors.filter(e=>e.sev==='err').length} errors</span>
            {errors.filter(e=>e.sev==='warn').length > 0 && <>
              <span>·</span>
              <span style={{ color:'var(--warn)' }}>▲ {errors.filter(e=>e.sev==='warn').length} warnings</span>
            </>}
            <span style={{ flex:1 }} />
            <span style={{ color:'var(--accent)', fontSize:9 }}>✦ fix with spaceman</span>
          </div>
          {panelOpen && <div style={{ maxHeight:100, overflow:'auto' }}>
            {errors.map((e,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'14px 1fr',
                gap:8, padding:'5px 10px', borderTop:'1px solid var(--border)',
                fontFamily:'var(--font-mono)', fontSize:10, cursor:'pointer' }}>
                <span style={{ color: e.sev==='err' ? 'var(--err)' : 'var(--warn)' }}>{e.sev==='err' ? '✗' : '▲'}</span>
                <div>
                  <div style={{ color:'var(--text)' }}>{e.msg}</div>
                  <div style={{ color:'var(--text-dim)', fontSize:9 }}>{file.name} · {e.code} · ln {e.line}</div>
                </div>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* Editor footer */}
      <div style={{ flexShrink:0, height:20, background:'var(--chrome)',
        borderTop:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:8, padding:'0 10px',
        fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-dim)', letterSpacing:'0.04em' }}>
        <span>JSX · spaces 2</span>
        {file.dirty && <><span>·</span><span style={{ color:'var(--warn)' }}>◉ unsaved</span></>}
        <span style={{ flex:1 }} />
        {ghost && !ghostAccepted && <span style={{ color:'var(--accent)' }}>✦ spaceman proposing…</span>}
        {ghostAccepted && <span style={{ color:'var(--ok)' }}>✓ edit accepted</span>}
        <span>⌘F find</span><span>·</span><span>⇧⌘S save</span>
      </div>
    </div>
  );
}

function V3EditorCode({ file, ghost, ghostAccepted, query }) {
  const defaultLines = [
    { n:1,  t:"import React, { useState, useRef } from 'react';" },
    { n:2,  t:ghost && !ghostAccepted ? "import { themeVars } from './tokens';" : "import { useBlink } from '../hooks/useBlink';", kind: ghost && !ghostAccepted ? 'normal' : ghostAccepted ? 'accepted' : 'normal' },
    { n:3,  t:"" },
    { n:4,  t:"export default function Terminal({ agent, active, onClose }) {" },
    { n:5,  t: ghost && !ghostAccepted ? "  const [caret, setCaret] = useState(true);" : "  const caret = useBlink(true);",
      kind: ghost && !ghostAccepted ? 'rem' : ghostAccepted ? 'accepted' : 'normal' },
    { n:6,  t:"  const ref = useRef(null);" },
    { n:7,  t:"" },
    { n:8,  t:"  useEffect(() => {" },
    { n:9,  t:"    if (!active) return;",    err: file?.errors?.[0] },
    { n:10, t:"    bridge.subscribe(agent.id, setLines);", active:true },
    { n:11, t:"  }, [active, agent.id]);" },
    { n:12, t:"" },
    { n:13, t:"  return (" },
    { n:14, t:"    <div ref={ref} style={{ height: '100%' }}>" },
    { n:15, t:"      <Header agent={agent} onClose={onClose} />" },
    { n:16, t:"      <Body lines={lines} />" },
    { n:17, t:"    </div>" },
    { n:18, t:"  );" },
    { n:19, t:"}" },
  ];
  return <>
    {defaultLines.map((l,i) => {
      const isRem = l.kind === 'rem';
      const isAccepted = l.kind === 'accepted';
      const hasErr = !!l.err;
      const matchIdx = query ? l.t.toLowerCase().indexOf(query.toLowerCase()) : -1;
      return (
        <div key={i} style={{ display:'flex', gap:0,
          fontFamily:'var(--font-mono)', fontSize:11, lineHeight:1.7,
          background: isRem ? 'rgba(208,88,88,0.07)' : isAccepted ? 'var(--accent-soft)' : hasErr ? 'rgba(208,88,88,0.05)' : l.active ? 'var(--accent-soft)' : 'transparent',
          borderLeft: isAccepted ? '2px solid var(--accent)' : l.active ? '2px solid var(--accent)' : isRem ? '2px solid rgba(208,88,88,.5)' : '2px solid transparent' }}>
          <span style={{ width:16, textAlign:'center', flexShrink:0,
            color: hasErr ? 'var(--err)' : 'transparent', fontSize:9, paddingTop:3 }}>{hasErr ? '✗' : ''}</span>
          <span style={{ width:24, textAlign:'right', color:'var(--text-dim)', flexShrink:0, paddingRight:8 }}>{l.n}</span>
          <span style={{ whiteSpace:'pre', color: isRem ? 'var(--err)' : isAccepted ? 'var(--text)' : 'var(--text-muted)',
            textDecoration: isRem ? 'line-through' : 'none',
            paddingRight:12, flex:1 }}>
            {matchIdx >= 0 ? <>
              {l.t.slice(0, matchIdx)}
              <span style={{ background:'rgba(201,163,74,0.45)', borderRadius:2, padding:'0 1px' }}>{l.t.slice(matchIdx, matchIdx + query.length)}</span>
              {l.t.slice(matchIdx + query.length)}
            </> : (l.t || '\u00A0')}
          </span>
        </div>
      );
    })}
  </>;
}

function EditorEmptyState() {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:14,
      background:'var(--bg)', padding:24 }}>
      <svg width="28" height="34" viewBox="0 0 32 38" fill="none" style={{ opacity:0.2 }}>
        <rect x="1" y="1" width="22" height="30" stroke="var(--text)" strokeWidth="1.5" />
        <path d="M23 1l8 8H23V1z" stroke="var(--text)" strokeWidth="1.5" />
        <line x1="5" y1="14" x2="19" y2="14" stroke="var(--text)" />
        <line x1="5" y1="19" x2="19" y2="19" stroke="var(--text)" />
        <line x1="5" y1="24" x2="14" y2="24" stroke="var(--text)" />
      </svg>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)',
          letterSpacing:'0.14em', marginBottom:6 }}>NO FILE OPEN</div>
        <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.55 }}>
          Click a file in the left rail<br />to open it here.
        </div>
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--text-dim)' }}>⌘P quick open</div>
    </div>
  );
}

function GuardBtn({ label, primary, onClick }) {
  return <span onClick={onClick} style={{ padding:'4px 10px',
    fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.08em', cursor:'pointer',
    color: primary ? 'var(--bg)' : 'var(--text-muted)',
    background: primary ? 'var(--accent)' : 'transparent',
    border: primary ? 'none' : '1px solid var(--border)' }}>{label}</span>;
}

function GhostBtn({ label, primary, onClick }) {
  return <span onClick={onClick} style={{ padding:'3px 9px',
    fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.06em', cursor:'pointer',
    color: primary ? 'var(--bg)' : 'var(--text-muted)',
    background: primary ? 'var(--accent)' : 'var(--bg-raised)',
    border: primary ? 'none' : '1px solid var(--border)' }}>{label}</span>;
}

function ToolBtn({ label, title, active, accent, onClick }) {
  return <span title={title} onClick={onClick} style={{ padding:'2px 6px',
    fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.04em', cursor:'pointer', flexShrink:0,
    color: accent ? 'var(--ok)' : active ? 'var(--text)' : 'var(--text-dim)',
    border:`1px solid ${active ? 'var(--accent)' : accent ? 'var(--ok)' : 'var(--border)'}`,
    background: active ? 'var(--accent-soft)' : 'transparent' }}>{label}</span>;
}

// ─── SPACEMAN SIDEBAR V3 ─────────────────────────────────────────

function V3SpacemanSidebar({ width, onResize, spacemanState, setSpacemanState, editorFile, onCloseEditor, spacedMode, setSpacedMode }) {
  const tab = spacemanState.tab || 'chat';
  const setTab = t => setSpacemanState(s => ({ ...s, tab: t }));

  // Drawer expands for editor (58%) and browser (auto). We report desired width upward.
  const editorOpen = tab === 'editor';
  const TABS = ['chat','browser','editor','chain','memory'];
  // Compact = narrow enough that labels don't all fit
  const compact = width < 400;

  return (
    <div style={{ width, flexShrink:0, background:'var(--bg-pane)',
      borderLeft:'1px solid var(--border)', display:'flex', flexDirection:'column',
      position:'relative', transition:'width 220ms cubic-bezier(.2,.8,.2,1)' }}>
      <V3ResizeHandle side="left" onResize={onResize} min={200} max={900} />

      {/* Header */}
      <div style={{ flexShrink:0, padding:'8px 12px',
        background:'var(--chrome)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <V3SpacemanMark size={18} mode={spacedMode} />
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10.5, letterSpacing:'0.08em',
            color: spacedMode === 'global' ? 'var(--accent-global)' : 'var(--text)' }}>SPACEMAN</span>
          {/* PROJECT | GLOBAL segmented control */}
          <div onClick={() => setSpacedMode(m => m === 'project' ? 'global' : 'project')}
            style={{ display:'inline-flex', border:`1px solid ${spacedMode==='global' ? 'var(--accent-global)' : 'var(--border)'}`,
              fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.1em', cursor:'pointer', marginLeft:4 }}>
            {['PROJECT','GLOBAL'].map(m => {
              const active = (m === 'PROJECT' && spacedMode === 'project') || (m === 'GLOBAL' && spacedMode === 'global');
              const isGlobal = m === 'GLOBAL';
              return <span key={m} style={{ padding:'2px 7px',
                color: active ? 'var(--bg)' : 'var(--text-muted)',
                background: active ? (isGlobal ? 'var(--accent-global)' : 'var(--accent)') : 'transparent' }}>{m}</span>;
            })}
          </div>
          <span style={{ flex:1 }} />
          <span style={{ display:'inline-flex', alignItems:'center', gap:5,
            fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.1em',
            color: spacedMode === 'global' ? 'var(--accent-global)' : 'var(--accent)' }}>
            <V3Dot kind={spacedMode === 'global' ? 'info' : 'run'} pulse size={5} />
            {spacedMode === 'global' ? 'OBSERVING' : 'WATCHING'}
          </span>
        </div>
        {/* Context row */}
        <div style={{ marginTop:7, display:'flex', alignItems:'center', gap:8,
          padding:'4px 8px', background:'var(--bg)', fontSize:9.5,
          fontFamily:'var(--font-mono)', letterSpacing:'0.04em',
          borderLeft: `2px solid ${spacedMode === 'global' ? 'var(--accent-global)' : 'var(--accent)'}` }}>
          {spacedMode === 'project' ? <>
            <V3Dot kind="run" pulse size={5} />
            <span style={{ color:'var(--text)' }}>forge</span>
            <span style={{ color:'var(--text-dim)' }}>· main · 3↑ 1↓</span>
            <span style={{ flex:1 }} />
            <span style={{ color:'var(--text-dim)' }}>senior engineer</span>
          </> : <>
            <span style={{ color:'var(--accent-global)', letterSpacing:'0.14em' }}>GLOBAL</span>
            <span style={{ color:'var(--text-dim)' }}>· 4 projects · read-only · dispatch</span>
            <span style={{ flex:1 }} />
            <span style={{ color:'var(--text-dim)' }}>haiku router</span>
          </>}
        </div>
      </div>

      {/* 5-tab bar — icon-only when narrow, active keeps label */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--border)',
        fontFamily:'var(--font-mono)', fontSize:10, flexShrink:0, background:'var(--bg-pane)' }}>
        {TABS.map(t => {
          const active = t === tab;
          const disabled = spacedMode === 'global' && (t === 'editor' || t === 'browser');
          const showLabel = !compact || active;
          const accentColor = spacedMode === 'global' ? 'var(--accent-global)' : 'var(--accent)';
          return (
            <div key={t} onClick={() => !disabled && setTab(t)} style={{
              padding: compact && !active ? '7px 9px' : '7px 12px',
              display:'flex', alignItems:'center', gap:5, cursor: disabled ? 'not-allowed' : 'pointer',
              color: disabled ? 'var(--text-dim)' : active ? (spacedMode === 'global' ? 'var(--accent-global)' : 'var(--text)') : 'var(--text-muted)',
              borderBottom: active ? `1px solid ${accentColor}` : '1px solid transparent',
              textDecoration: disabled ? 'line-through' : 'none',
              letterSpacing:'0.08em', textTransform:'uppercase' }}>
              {TAB_GLYPHS[t]}
              {showLabel && <span>{t}</span>}
            </div>
          );
        })}
        <div style={{ flex:1 }} />
      </div>

      {/* Tab content */}
      <div style={{ flex:1, minHeight:0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {tab === 'editor' && (
          <V3EditorInDrawer file={editorFile} onClose={onCloseEditor} drawerWidth={width} />
        )}
        {tab === 'chat' && <V3ChatTab messages={spacemanState.chat} mode={spacedMode} />}
        {tab === 'chain' && <V3ChainTab chain={spacemanState.chain} mode={spacedMode} />}
        {tab === 'memory' && <V3MemoryTab mems={spacemanState.memory} mode={spacedMode} />}
        {tab === 'browser' && spacedMode === 'project' && <V3BrowserTab items={spacemanState.browser?.items || []} />}
      </div>

      {/* Prompt strip (chat + editor) */}
      {(tab === 'chat' || tab === 'editor') && (
        <div style={{ flexShrink:0, borderTop:'1px solid var(--border)', background:'var(--chrome)' }}>
          {spacedMode === 'global' && (
            <div style={{ padding:'5px 10px 2px', display:'flex', alignItems:'center', gap:6,
              fontFamily:'var(--font-mono)', fontSize:9, flexWrap:'wrap' }}>
              <span style={{ color:'var(--accent-global)', letterSpacing:'0.1em' }}>scope</span>
              {['forge','archivist','mindcraft','routines'].map((p,i) => (
                <span key={p} style={{ padding:'2px 6px',
                  border:`1px solid ${i < 2 ? 'var(--accent-global)' : 'var(--border)'}`,
                  color: i < 2 ? 'var(--accent-global)' : 'var(--text-dim)',
                  background: i < 2 ? 'var(--accent-global-soft)' : 'transparent',
                  letterSpacing:'0.08em' }}>{p}</span>
              ))}
            </div>
          )}
          <div style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:8,
            fontFamily:'var(--font-mono)', fontSize:10 }}>
            <span style={{ color: spacedMode === 'global' ? 'var(--accent-global)' : 'var(--accent)', letterSpacing:'0.1em' }}>
              ✦ {spacedMode === 'global' ? 'GLOBAL' : 'SPACEMAN'}</span>
            <span style={{ color:'var(--text-dim)' }}>›</span>
            <span style={{ flex:1, color:'var(--text-muted)', fontFamily:'var(--font-ui)', fontSize:11 }}>
              {spacedMode === 'global' ? 'Dispatch or ask across projects…' : tab === 'editor' ? 'Ask about this file…' : 'Ask Spaceman to do something…'}
            </span>
            <span style={{ color:'var(--text-dim)' }}>⏎</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHAT / CHAIN / MEMORY / BROWSER tabs ───────────────────────

function V3ChatTab({ messages, mode }) {
  if (!messages?.length) return (
    <div style={{ padding:'32px 16px', textAlign:'center' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', letterSpacing:'0.14em', marginBottom:8 }}>NO MESSAGES YET</div>
      <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>
        {mode === 'global' ? 'Ask across all projects from the prompt below.' : 'Type in the prompt strip to start.'}
      </div>
    </div>
  );
  return (
    <div style={{ flex:1, overflow:'auto', padding:14, fontSize:12.5, lineHeight:1.55 }}>
      {messages.map((m,i) => (
        <div key={i} style={{ marginBottom:14 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.14em',
            color: m.role==='spaceman' ? (mode==='global' ? 'var(--accent-global)' : 'var(--accent)') : 'var(--text-dim)',
            marginBottom:5 }}>{m.role} · {m.meta}</div>
          <div style={{ color:'var(--text)' }}>{m.text}</div>
          {m.tool && (
            <div style={{ marginTop:7, padding:9,
              borderLeft:`2px solid ${mode==='global' ? 'var(--accent-global)' : 'var(--accent)'}`,
              background:'var(--bg-sunken)', fontFamily:'var(--font-mono)', fontSize:11 }}>
              <div style={{ color:'var(--text)', marginBottom:3 }}>◢ {m.tool.head}</div>
              <div style={{ color:'var(--text-muted)' }}>{m.tool.body}</div>
              {m.tool.foot && <div style={{ color:'var(--text-dim)', marginTop:4 }}>{m.tool.foot}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function V3ChainTab({ chain, mode }) {
  if (!chain?.steps?.length) return (
    <div style={{ padding:'32px 16px', textAlign:'center' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', letterSpacing:'0.14em', marginBottom:8 }}>NO CHAIN ACTIVE</div>
      <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>Multi-step plans from Spaceman appear here.</div>
    </div>
  );
  return (
    <div style={{ flex:1, overflow:'auto', padding:14 }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', letterSpacing:'0.14em', marginBottom:8 }}>
        CHAIN · {chain.name}
      </div>
      {chain.steps.map(s => (
        <div key={s.n} style={{ display:'grid', gridTemplateColumns:'20px 1fr 14px',
          gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', textAlign:'right' }}>
            {String(s.n).padStart(2,'0')}</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12,
            color: s.status==='idle' ? 'var(--text-muted)' : 'var(--text)' }}>{s.name}</span>
          <V3Dot kind={s.status==='ok' ? 'ok' : s.status==='run' ? 'run' : 'idle'} pulse={s.status==='run'} size={5} />
        </div>
      ))}
    </div>
  );
}

function V3MemoryTab({ mems, mode }) {
  if (!mems?.length) return (
    <div style={{ padding:'32px 16px', textAlign:'center' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', letterSpacing:'0.14em', marginBottom:8 }}>NO MEMORIES YET</div>
      <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>Decisions and patterns Spaceman learns appear here.</div>
    </div>
  );
  return (
    <div style={{ flex:1, overflow:'auto', padding:14 }}>
      {mems.map((m,i) => (
        <div key={i} style={{ padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--text-dim)',
            letterSpacing:'0.14em', marginBottom:4 }}>{m.t}</div>
          <div style={{ fontSize:12.5, color:'var(--text)', lineHeight:1.45 }}>{m.c}</div>
        </div>
      ))}
    </div>
  );
}

function V3BrowserTab({ items }) {
  return (
    <div style={{ flex:1, overflow:'auto', padding:14 }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-dim)',
        letterSpacing:'0.14em', marginBottom:10 }}>RECENTLY OPENED</div>
      {items.map((it,i) => {
        const live = /localhost|dev-space:\/\/|file:\/\//.test(it.path);
        return (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8,
            padding:'7px 0', borderBottom:'1px solid var(--border)', cursor:'pointer' }}>
            <span style={{ color: live ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily:'var(--font-mono)', fontSize:13, width:16, textAlign:'center' }}>
              {it.kind === 'html' ? '◐' : it.kind === 'file' ? '▤' : it.kind === 'img' ? '▣' : '↗'}
            </span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{it.name}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis' }}>{it.path}</div>
            </div>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:8.5, padding:'1px 4px',
              color: live ? 'var(--accent)' : 'var(--text-muted)',
              border:`1px solid ${live ? 'var(--accent)' : 'var(--border)'}`,
              background: live ? 'var(--accent-soft)' : 'transparent' }}>{live ? 'LIVE' : 'WEB'}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── TOP BAR ─────────────────────────────────────────────────────

function V3TopBar({ tone, setTone, projectTabs, activeProject, setActiveProject, setSettingsOpen, leftCollapsed, rightCollapsed, toggleLeft, toggleRight }) {
  return (
    <div style={{ height:38, flexShrink:0, display:'flex', alignItems:'stretch',
      background:'var(--chrome)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ width:leftCollapsed ? 32 : 200, flexShrink:0,
        display:'flex', alignItems:'center', gap:8,
        padding: leftCollapsed ? '0 4px' : '0 14px',
        borderRight:'1px solid var(--border)',
        transition:'width 200ms, padding 200ms', overflow:'hidden' }}>
        <V3SpacemanMark size={18} />
        {!leftCollapsed && <div style={{ fontFamily:'var(--font-ui)', fontSize:13, color:'var(--text)', flex:1,
          whiteSpace:'nowrap', overflow:'hidden' }}>
          Dev-Space<span style={{ color:'var(--text-dim)' }}>.ai</span>
        </div>}
        <button onClick={toggleLeft} style={{ all:'unset', cursor:'pointer', width:22, height:22,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'var(--text-muted)', border:'1px solid var(--border)', flexShrink:0 }}>
          <svg width="13" height="11" viewBox="0 0 14 12" fill="none">
            <rect x="0.5" y="0.5" width="13" height="11" stroke="currentColor" />
            <rect x="0.5" y="0.5" width="4.5" height="11" fill="currentColor" opacity={leftCollapsed ? 0.3 : 0.9} />
          </svg>
        </button>
      </div>
      <div style={{ display:'flex', alignItems:'stretch', flex:1, minWidth:0 }}>
        {projectTabs.map(p => (
          <div key={p.id} onClick={() => setActiveProject(p.id)} style={{
            padding:'0 14px', display:'flex', alignItems:'center', gap:7,
            fontFamily:'var(--font-mono)', fontSize:11,
            color: p.id === activeProject ? 'var(--text)' : 'var(--text-muted)',
            background: p.id === activeProject ? 'var(--bg)' : 'transparent',
            borderRight:'1px solid var(--border)',
            borderTop: p.id === activeProject ? '1px solid var(--accent)' : '1px solid transparent',
            cursor:'pointer' }}>
            <V3Dot kind={p.activity === 'run' ? 'run' : 'idle'} pulse={p.activity === 'run'} size={5} />
            <span>{p.name}</span>
            {p.dirty && <span style={{ color:'var(--warn)', fontSize:8 }}>●</span>}
            <span style={{ color:'var(--text-dim)', marginLeft:4, fontSize:11 }}>×</span>
          </div>
        ))}
        <div style={{ flex:1 }} />
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 12px',
        borderLeft:'1px solid var(--border)' }}>
        {/* Theme dots */}
        {DIRECTIONS.map(d => (
          <span key={d.id} onClick={() => setTone(d)} title={d.name} style={{
            display:'inline-block', width:10, height:10, borderRadius:999,
            background: d.id === 'terminal' ? '#0a0a0a' : d.id === 'graphite' ? '#c7ff3d' : '#f4f1ea',
            border: tone.id === d.id ? '2px solid var(--text)' : '2px solid transparent',
            cursor:'pointer', flexShrink:0 }} />
        ))}
        <button onClick={toggleRight} style={{ all:'unset', cursor:'pointer', width:22, height:22,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'var(--text-muted)', border:'1px solid var(--border)' }}>
          <svg width="13" height="11" viewBox="0 0 14 12" fill="none">
            <rect x="0.5" y="0.5" width="13" height="11" stroke="currentColor" />
            <rect x="9" y="0.5" width="4.5" height="11" fill="currentColor" opacity={rightCollapsed ? 0.3 : 0.9} />
          </svg>
        </button>
        <span onClick={() => setSettingsOpen(true)} style={{
          fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)',
          padding:'3px 7px', border:'1px solid var(--border)', cursor:'pointer',
          letterSpacing:'0.04em' }}>⌘,</span>
      </div>
    </div>
  );
}

// ─── STATUS BAR ──────────────────────────────────────────────────

function V3StatusBar({ computeOpen, setComputeOpen }) {
  return (
    <div style={{ height:24, flexShrink:0, background:'var(--chrome)',
      borderTop:'1px solid var(--border)', display:'flex', alignItems:'center',
      gap:12, padding:'0 12px',
      fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--text-muted)',
      letterSpacing:'0.04em' }}>
      <V3Dot kind="ok" size={5} /><span>main</span>
      <span style={{ color:'var(--text-dim)' }}>·</span><span>forge</span>
      <span style={{ color:'var(--text-dim)' }}>·</span>
      <span style={{ color:'var(--warn)' }}>2 modified</span>
      <span style={{ flex:1 }} />
      <span onClick={() => setComputeOpen(o=>!o)} style={{ cursor:'pointer',
        display:'inline-flex', alignItems:'center', gap:6,
        color: computeOpen ? 'var(--text)' : 'var(--text-muted)' }}>
        <V3Dot kind="run" pulse size={5} />DGX · 1 running · 2 queued
        <span style={{ color:'var(--text-dim)' }}>{computeOpen ? '▾' : '▴'}</span>
      </span>
      <span style={{ color:'var(--text-dim)' }}>·</span>
      <span>ln 10, col 4</span>
      <span style={{ color:'var(--text-dim)' }}>·</span>
      <span>utf-8 · lf</span>
    </div>
  );
}

// ─── TERMINAL GRID (unchanged pattern from v2) ────────────────────

function V3TerminalGrid({ terminals, activeId, setActiveId, finishedIds, onAcknowledge }) {
  const n = terminals.length;
  const cols = n <= 1 ? 1 : n <= 4 ? 2 : 3;
  return (
    <div style={{ flex:1, display:'grid',
      gridTemplateColumns:`repeat(${cols}, 1fr)`,
      gap:6, padding:6, background:'var(--bg-sunken)', minHeight:0 }}>
      {terminals.map(t => (
        <V3TerminalCard key={t.id} term={t} active={t.id === activeId}
          finished={finishedIds.has(t.id)}
          onClick={() => { setActiveId(t.id); onAcknowledge(t.id); }} />
      ))}
    </div>
  );
}

function V3TerminalCard({ term, active, finished, onClick }) {
  const border = finished
    ? '1px solid rgba(74,222,128,0.8)'
    : active ? '1px solid var(--pane-ring)'
    : '1px solid var(--border)';
  return (
    <div onClick={onClick} style={{ display:'flex', flexDirection:'column', minHeight:0,
      border, cursor:'default', position:'relative',
      animation: finished ? 'smFinished 1.8s ease-in-out infinite' : 'none' }}>
      {/* Finished ribbon */}
      {finished && (
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
          background:'var(--ok)', opacity:0.85, zIndex:1 }} />
      )}
      <div style={{ height:26, flexShrink:0, background:'var(--chrome)',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:7, padding:'0 8px',
        fontFamily:'var(--font-mono)', fontSize:10.5 }}>
        <V3Dot kind={finished ? 'ok' : term.status === 'run' ? 'run' : term.status === 'err' ? 'err' : 'ok'}
          pulse={!finished && term.status === 'run'} size={5} />
        <span style={{ color: finished ? 'var(--ok)' : 'var(--text)', flex:1 }}>{term.name}</span>
        {finished && (
          <span style={{ fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.1em',
            color:'var(--ok)', border:'1px solid rgba(74,222,128,0.4)',
            padding:'1px 4px', marginRight:4 }}>DONE</span>
        )}
        <span style={{ color:'var(--text-dim)' }}>{term.model}</span>
        <span style={{ color:'var(--text-dim)', cursor:'pointer' }}>_</span>
        <span style={{ color:'var(--text-dim)', cursor:'pointer' }}>×</span>
      </div>
      <div style={{ flex:1, padding:'8px 10px',
        background: finished ? 'rgba(74,222,128,0.03)' : 'var(--bg)',
        fontFamily:'var(--font-mono)', fontSize:11.5, lineHeight:1.55, overflow:'hidden' }}>
        {term.lines.map((l,i) => (
          <div key={i} style={{ color:
            l.kind==='prompt' ? 'var(--accent)' :
            l.kind==='ok'     ? 'var(--ok)'    :
            l.kind==='err'    ? 'var(--err)'   :
            l.kind==='dim'    ? 'var(--text-dim)' : 'var(--text-muted)' }}>{l.t}</div>
        ))}
        {!finished && <div style={{ display:'inline-block', width:8, height:13, background:'var(--text)',
          verticalAlign:'text-bottom', animation:'smCaret 1s step-end infinite', marginTop:2 }} />}
        {finished && <div style={{ color:'rgba(74,222,128,0.5)', fontSize:10, marginTop:4,
          fontFamily:'var(--font-mono)', letterSpacing:'0.08em' }}>· click to acknowledge ·</div>}
      </div>
    </div>
  );
}

// Sub-tab bar above terminal grid
function V3SubTabBar({ agents, activeId, setActiveId, onSpawn }) {
  return (
    <div style={{ height:28, flexShrink:0, display:'flex', alignItems:'stretch',
      background:'var(--bg-sunken)', borderBottom:'1px solid var(--border)',
      fontFamily:'var(--font-mono)', fontSize:11 }}>
      {agents.map(a => (
        <div key={a.id} onClick={() => setActiveId(a.id)} style={{
          padding:'0 10px', display:'flex', alignItems:'center', gap:6,
          color: a.id === activeId ? 'var(--text)' : 'var(--text-muted)',
          background: a.id === activeId ? 'var(--bg)' : 'transparent',
          borderRight:'1px solid var(--border)',
          borderTop: a.id === activeId ? '1px solid var(--accent)' : '1px solid transparent',
          cursor:'pointer' }}>
          <V3Dot kind={a.status} pulse={a.status==='run'} size={5} />
          <span>{a.name}</span>
          <span style={{ color:'var(--text-dim)' }}>×</span>
        </div>
      ))}
      <div onClick={onSpawn} style={{ padding:'0 10px', display:'flex', alignItems:'center',
        color:'var(--text-dim)', cursor:'pointer', fontSize:14 }}>+</div>
      <div style={{ flex:1 }} />
    </div>
  );
}

// Prompt strip
function V3PromptStrip() {
  const [val, setVal] = React.useState('');
  return (
    <div style={{ height:44, flexShrink:0, display:'flex', alignItems:'center', gap:10,
      padding:'0 14px', borderTop:'1px solid var(--border)', background:'var(--bg)',
      fontFamily:'var(--font-mono)', fontSize:11 }}>
      <V3SpacemanMark size={18} />
      <span style={{ color:'var(--accent)', letterSpacing:'0.1em', fontSize:10 }}>SPACEMAN ›</span>
      <input value={val} onChange={e=>setVal(e.target.value)} placeholder="Ask Spaceman to do something…"
        style={{ flex:1, background:'transparent', border:'none', outline:'none',
          color:'var(--text)', fontFamily:'var(--font-ui)', fontSize:13 }} />
      <span style={{ color:'var(--text-dim)' }}>⏎</span>
    </div>
  );
}

// ─── SETTINGS MODAL ──────────────────────────────────────────────

function V3Settings({ open, onClose, tone, setTone }) {
  const [section, setSection] = React.useState('appearance');
  if (!open) return null;
  const sections = ['Appearance','Editor','Spaceman','Compute','Integrations','Advanced'];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,.55)',
      display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:700, height:520,
        background:'var(--bg-raised)', border:'1px solid var(--border-strong)',
        display:'flex', overflow:'hidden', boxShadow:'0 30px 90px rgba(0,0,0,.6)' }}>
        <div style={{ width:180, flexShrink:0, background:'var(--chrome)',
          borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)',
            fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)',
            letterSpacing:'0.14em' }}>SETTINGS</div>
          {sections.map(s => (
            <div key={s} onClick={() => setSection(s.toLowerCase())} style={{
              padding:'9px 16px', cursor:'pointer', fontSize:13,
              color: section === s.toLowerCase() ? 'var(--text)' : 'var(--text-muted)',
              background: section === s.toLowerCase() ? 'var(--accent-soft)' : 'transparent',
              borderLeft: section === s.toLowerCase() ? '2px solid var(--accent)' : '2px solid transparent' }}>{s}</div>
          ))}
        </div>
        <div style={{ flex:1, padding:24, overflowY:'auto' }}>
          {section === 'appearance' && (
            <div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)',
                letterSpacing:'0.14em', marginBottom:16 }}>THEME</div>
              <div style={{ display:'flex', gap:12 }}>
                {DIRECTIONS.map(d => (
                  <div key={d.id} onClick={() => setTone(d)} style={{
                    flex:1, padding:14, cursor:'pointer',
                    border:`1px solid ${tone.id === d.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: d.bg }}>
                    <div style={{ height:28, marginBottom:8,
                      background: d.accent, opacity:0.3 }} />
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:11,
                      color: d.text, marginBottom:3 }}>{d.name}</div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:9,
                      color: d.textMuted }}>{d.tagline}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {section === 'spaceman' && (
            <div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)',
                letterSpacing:'0.14em', marginBottom:16 }}>SPACEMAN · FORGE</div>
              {[['Preset','Senior Engineer ▾'],['Model','sonnet-4.5 ▾'],['Router','haiku-4.5 ▾'],['Context window','200k tokens']].map(([k,v])=>(
                <div key={k} style={{ display:'grid', gridTemplateColumns:'130px 1fr',
                  gap:8, padding:'8px 0', borderBottom:'1px solid var(--border)',
                  fontFamily:'var(--font-mono)', fontSize:11 }}>
                  <span style={{ color:'var(--text-dim)' }}>{k}</span>
                  <span style={{ color:'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {!['appearance','spaceman'].includes(section) && (
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)',
              letterSpacing:'0.14em', padding:'24px 0' }}>{section.toUpperCase()} · coming soon</div>
          )}
        </div>
        <div onClick={onClose} style={{ position:'absolute', top:12, right:14,
          color:'var(--text-muted)', cursor:'pointer', fontSize:18 }}>×</div>
      </div>
    </div>
  );
}

// ─── SEED DATA ───────────────────────────────────────────────────

const SEED_PROJECTS = [
  {
    id: 'forge', name: 'forge', branch: 'main', last: '12m',
    activity: 'run', dirty: true,
    files: [
      { name: 'src/', children: [
        { name: 'components/', open: true, children: [
          { name: 'terminal/', open: true, children: [
            { name: 'Terminal.jsx', active: true, git: 'M', dirty: true, path: 'src/components/terminal/',
              ghost: true,
              errors: [
                { sev:'warn', code:'TS6133', msg:"'useEffect' is declared but never read.", line:9 },
              ] },
            { name: 'Terminal.css', git: '' },
          ]},
          { name: 'bridge/', children: [{ name: 'bridge.js' }]},
        ]},
        { name: 'hooks/', children: [
          { name: 'useBlink.js', git: 'A', path: 'src/hooks/', errors: [] },
        ]},
        { name: 'styles/', children: [
          { name: 'variables.css', git: 'M', dirty: true, path: 'src/styles/' },
        ]},
        { name: 'App.jsx', path: 'src/' },
        { name: 'main.jsx', path: 'src/' },
      ]},
      { name: 'package.json' },
      { name: 'README.md' },
    ],
  },
  { id: 'archivist', name: 'archivist', branch: 'feat/search', last: '2h', activity: 'idle', dirty: false,
    files: [{ name: 'src/', children: [{ name: 'DiffView.tsx', errors:[{sev:'err',code:'TS2345',msg:'Type mismatch in diff engine',line:44}] }]}]
  },
  { id: 'mindcraft', name: 'mindcraft', branch: 'develop', last: '3d', activity: 'idle', dirty: false, files: [] },
  { id: 'routines', name: 'routines', branch: 'main', last: '6h', activity: 'idle', dirty: false, files: [] },
];

const SEED_SPACEMAN = {
  forge: {
    tab: 'chat',
    chat: [
      { role:'you', meta:'14:22', text:'Refactor the theme variables to use [data-theme] selector.' },
      { role:'spaceman', meta:'sonnet', text:"I'll plan this across tokens.jsx and variables.css. Spawning an agent to survey usages first.",
        tool: { head:'spawn agent[1]', body:'scan usages of themeVars() across /src', foot:'14 files · 420ms' } },
      { role:'spaceman', meta:'sonnet', text:'Survey complete — 14 call sites, 3 clusters. Ready to apply when you are. Click Terminal.jsx in the file tree to see my proposed edit.' },
    ],
    chain: { name:'theme-migration', steps:[
      { n:1, name:'scan_usages', status:'ok' },
      { n:2, name:'plan_migration', status:'run' },
      { n:3, name:'apply_edits', status:'idle' },
      { n:4, name:'verify_tests', status:'idle' },
    ]},
    memory: [
      { t:'DECISION', c:'Sliding rail pages, not dual-panel' },
      { t:'PATTERN',  c:'Theme = attribute on <html>' },
      { t:'CORRECT',  c:'File tree lives per-project, not global' },
    ],
    browser: { url:'', device:'desktop', items:[
      { kind:'html', name:'dev preview · Dashboard', path:'http://localhost:5173/dashboard', from:'agent-1' },
      { kind:'file', name:'Terminal.jsx', path:'src/components/terminal/Terminal.jsx', from:'agent-1' },
      { kind:'link', name:'react docs · useEffect', path:'https://react.dev/reference/react/useEffect', from:'you' },
    ]},
  },
};

// ─── TERMINALS SEED ──────────────────────────────────────────────

const SEED_TERMINALS = [
  { id:'a1', name:'agent-1', model:'sonnet', status:'run', lines:[
    { t:'$ npm run dev', kind:'prompt' },
    { t:'› vite v5.2.0 ready', kind:'dim' },
    { t:'› Local: http://localhost:5173', kind:'dim' },
    { t:'HMR connected · 1,284 modules', kind:'dim' },
  ]},
  { id:'a2', name:'agent-2', model:'haiku', status:'ok', lines:[
    { t:'$ pytest -q', kind:'prompt' },
    { t:'............', kind:'dim' },
    { t:'12 passed in 0.84s', kind:'ok' },
  ]},
];

// ─── IDEV3 ROOT ──────────────────────────────────────────────────

function IDEV3() {
  const [tone, setTone] = React.useState(() => {
    const s = localStorage.getItem('ds.v3.tone');
    return (s && DIRECTIONS.find(d=>d.id===s)) || DIRECTIONS[0];
  });
  const setToneAndStore = t => { setTone(t); localStorage.setItem('ds.v3.tone', t.id); };

  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const [leftWidth, setLeftWidth] = React.useState(220);
  const [rightWidth, setRightWidth] = React.useState(340);

  const [railPage, setRailPage] = React.useState('projects');
  const [projects] = React.useState(SEED_PROJECTS);
  const [activeProjectId, setActiveProjectId] = React.useState('forge');
  const [projectTabs, setProjectTabs] = React.useState([
    { id:'forge', name:'forge', activity:'run', dirty:true },
    { id:'archivist', name:'archivist', activity:'idle', dirty:false },
  ]);

  const [finishedIds, setFinishedIds] = React.useState(() => new Set(['a2']));
  const acknowledgeTerminal = (id) => setFinishedIds(s => { const n = new Set(s); n.delete(id); return n; });
  const [terminals, setTerminals] = React.useState(SEED_TERMINALS);
  const [activeTermId, setActiveTermId] = React.useState('a1');

  const [spacedMode, setSpacedMode] = React.useState('project');
  const [spaceman, setSpaceman] = React.useState(SEED_SPACEMAN);

  const [editorFile, setEditorFile] = React.useState(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [computeOpen, setComputeOpen] = React.useState(false);

  const getSpaceman = () => spaceman[activeProjectId] || { tab:'chat', chat:[], chain:null, memory:[], browser:{url:'',device:'desktop',items:[]} };
  const setProjectSpaceman = upd => setSpaceman(s => ({ ...s, [activeProjectId]: upd(s[activeProjectId] || {}) }));

  const handleFileOpen = (node) => {
    setEditorFile({
      name: node.name,
      path: node.path || '',
      git: node.git,
      branch: 'main',
      dirty: node.dirty || false,
      errors: node.errors || [],
      ghost: node.ghost || false,
    });
    setProjectSpaceman(s => ({ ...s, tab:'editor' }));
    // Expand drawer if needed
    if (rightWidth < 420) setRightWidth(Math.round(window.innerWidth * 0.52));
  };

  const handleCloseEditor = () => {
    setEditorFile(null);
    setProjectSpaceman(s => ({ ...s, tab:'chat' }));
    setRightWidth(340);
  };

  const sm = getSpaceman();

  return (
    <div style={{ ...themeVars(tone), width:'100vw', height:'100vh', display:'flex',
      flexDirection:'column', overflow:'hidden' }}>

      {/* macOS native title bar */}
      <div style={{ height:28, flexShrink:0, background:'var(--chrome)',
        borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center',
        padding:'0 12px', position:'relative' }}>
        <V3TrafficLights />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
          justifyContent:'center', pointerEvents:'none' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:8,
            fontFamily:'var(--font-ui)', fontSize:12, color:'var(--text)' }}>
            <span style={{ fontWeight:500 }}>forge</span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)',
              letterSpacing:'0.04em' }}>⎇ main</span>
            <V3Dot kind="warn" size={5} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--text-dim)',
              letterSpacing:'0.08em' }}>2 MODIFIED</span>
          </span>
        </div>
      </div>

      {/* Top bar */}
      <V3TopBar tone={tone} setTone={setToneAndStore}
        projectTabs={projectTabs} activeProject={activeProjectId} setActiveProject={setActiveProjectId}
        setSettingsOpen={setSettingsOpen}
        leftCollapsed={leftCollapsed} rightCollapsed={rightCollapsed}
        toggleLeft={() => setLeftCollapsed(c=>!c)} toggleRight={() => setRightCollapsed(c=>!c)} />

      {/* Body */}
      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        {/* Left rail */}
        {leftCollapsed ? (
          <div style={{ width:32, flexShrink:0, background:'var(--chrome)',
            borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column',
            alignItems:'center', padding:'10px 0', gap:12 }}>
            <button onClick={() => setLeftCollapsed(false)} style={{ all:'unset', cursor:'pointer',
              width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center',
              color:'var(--text-muted)', border:'1px solid var(--border)', fontSize:11 }}>▸</button>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-dim)',
              letterSpacing:'0.2em', writingMode:'vertical-rl', transform:'rotate(180deg)' }}>PROJECTS</div>
          </div>
        ) : (
          <V3LeftRail width={leftWidth} onResize={setLeftWidth}
            page={railPage} setPage={setRailPage}
            projects={projects} activeProjectId={activeProjectId}
            setActiveProjectId={id => { setActiveProjectId(id); setRailPage('files'); }}
            onFileOpen={handleFileOpen} />
        )}

        {/* Center */}
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
          <V3SubTabBar
            agents={terminals.map(t => ({ id:t.id, name:t.name, status:t.status }))}
            activeId={activeTermId} setActiveId={setActiveTermId}
            onSpawn={() => {}} />
          <V3TerminalGrid terminals={terminals} activeId={activeTermId} setActiveId={setActiveTermId}
            finishedIds={finishedIds} onAcknowledge={acknowledgeTerminal} />
          <V3PromptStrip />
        </div>

        {/* Right drawer */}
        {rightCollapsed ? (
          <div style={{ width:32, flexShrink:0, background:'var(--bg-pane)',
            borderLeft:'1px solid var(--border)', display:'flex', flexDirection:'column',
            alignItems:'center', padding:'10px 0', gap:12 }}>
            <button onClick={() => setRightCollapsed(false)} style={{ all:'unset', cursor:'pointer',
              width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center',
              color:'var(--text-muted)', border:'1px solid var(--border)', fontSize:11 }}>◂</button>
            <V3SpacemanMark size={18} mode={spacedMode} />
          </div>
        ) : (
          <V3SpacemanSidebar
            width={rightWidth} onResize={setRightWidth}
            spacemanState={sm}
            setSpacemanState={upd => setProjectSpaceman(() => typeof upd === 'function' ? upd(sm) : upd)}
            editorFile={editorFile}
            onCloseEditor={handleCloseEditor}
            spacedMode={spacedMode} setSpacedMode={setSpacedMode} />
        )}
      </div>

      <V3StatusBar computeOpen={computeOpen} setComputeOpen={setComputeOpen} />
      {computeOpen && <div style={{ position:'absolute', right:12, bottom:28, width:460, zIndex:50,
        background:'var(--bg-raised)', border:'1px solid var(--border-strong)',
        boxShadow:'0 20px 60px rgba(0,0,0,.5)' }}>
        <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)',
          fontFamily:'var(--font-mono)', fontSize:11, display:'flex', gap:10 }}>
          <span style={{ color:'var(--text)', letterSpacing:'0.08em' }}>COMPUTE · DGX SPARK</span>
          <span style={{ flex:1 }} />
          <span style={{ color:'var(--text-muted)' }}>dgx.local · ssh ok</span>
        </div>
        {[{id:'j-1042',n:'finetune-llama-7b',s:'run',g:'4×H100',e:'00:04:12'},
          {id:'j-1041',n:'eval-suite-v3',s:'queued',g:'1×H100',e:'—'},
          {id:'j-1040',n:'embed-index-rebuild',s:'queued',g:'2×H100',e:'—'}].map((j,i,a) => (
          <div key={j.id} style={{ display:'grid', gridTemplateColumns:'70px 1fr 80px 80px 14px',
            gap:12, padding:'10px 14px', alignItems:'center',
            borderBottom: i<a.length-1 ? '1px solid var(--border)' : 'none',
            fontFamily:'var(--font-mono)', fontSize:12 }}>
            <span style={{ color:'var(--text-dim)' }}>{j.id}</span>
            <span style={{ color:'var(--text)' }}>{j.n}</span>
            <span style={{ color:'var(--text-muted)' }}>{j.g}</span>
            <span style={{ color:'var(--text-muted)' }}>{j.e}</span>
            <V3Dot kind={j.s==='run' ? 'run' : 'idle'} pulse={j.s==='run'} size={5} />
          </div>
        ))}
      </div>}

      <V3Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} tone={tone} setTone={setToneAndStore} />
    </div>
  );
}

Object.assign(window, { IDEV3 });
