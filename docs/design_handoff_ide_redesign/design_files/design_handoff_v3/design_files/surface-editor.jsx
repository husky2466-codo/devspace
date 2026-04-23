// SURFACE 1 — EDITOR TAB IN THE SPACEMAN DRAWER
// ------------------------------------------------------------------
// The drawer gains a 5th tab: CHAT · BROWSER · EDITOR · CHAIN · MEMORY
// - At default drawer width (340px) the tab bar condenses to glyph-only
//   with the active tab keeping its label. Labels return at ~420px+.
// - Opening any file from the left rail forces the drawer to 58% vw
//   and focuses EDITOR. Browser expand (50% vw) is separate state, and
//   only triggers when an HTML/preview-able artifact is opened.
// - Editor surface: file-tab bar with dirty markers, line numbers,
//   active-line highlight, a compact status strip inside the drawer.

function SurfaceEditor({ tone }) {
  const [drawerTab, setDrawerTab] = React.useState('editor');
  // Three drawer widths: compact (340), browser-expand (50%), editor-expand (58%)
  const mode = drawerTab === 'editor' ? 'editor' : drawerTab === 'browser' ? 'browser' : 'compact';
  const widthPct = mode === 'editor' ? 58 : mode === 'browser' ? 50 : 26;

  return (
    <SurfaceFrame tone={tone}>
      <ArtboardCaption>
        01 · EDITOR TAB <span style={{ opacity: 0.6 }}>— forced expand · 5th tab · sibling of BROWSER</span>
      </ArtboardCaption>
      <div style={{
        flex: 1, display: 'flex', minHeight: 0,
        paddingTop: 28, /* caption */
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <MiniTopBar />
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <div style={{ width: 180, flexShrink: 0, background: 'var(--chrome)', borderRight: '1px solid var(--border)' }}>
              <MiniRailWithOpenFile />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <MiniTerminalGrid cells={2} />
            </div>
            <div style={{
              width: `${widthPct}%`, flexShrink: 0,
              background: 'var(--bg-pane)',
              borderLeft: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', minWidth: 0,
              transition: 'width 220ms cubic-bezier(0.2,0.8,0.2,1)',
            }}>
              <DrawerHeader />
              <DrawerTabBar tab={drawerTab} setTab={setDrawerTab} compact={mode === 'compact'} />
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                {drawerTab === 'editor' && <EditorInDrawer />}
                {drawerTab === 'browser' && <BrowserStub />}
                {drawerTab === 'chat' && <ChatStub />}
                {drawerTab === 'chain' && <ChainStub />}
                {drawerTab === 'memory' && <MemoryStub />}
              </div>
            </div>
          </div>
          <MiniStatusBar />
        </div>
      </div>
    </SurfaceFrame>
  );
}

function ArtboardCaption({ children }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 26,
      padding: '6px 12px',
      fontFamily: 'var(--font-mono)', fontSize: 10,
      letterSpacing: '0.12em',
      color: 'var(--text-dim)', background: 'var(--bg-sunken)',
      borderBottom: '1px solid var(--border)',
      zIndex: 2,
    }}>{children}</div>
  );
}

function MiniTopBar() {
  return (
    <div style={{
      height: 30, flexShrink: 0,
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch',
    }}>
      <div style={{ width: 180, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', borderRight: '1px solid var(--border)' }}>
        <SpacemanMark size={14} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11.5, color: 'var(--text)' }}>
          Dev-Space<span style={{ color: 'var(--text-dim)' }}>.ai</span>
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
        <div style={{
          padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text)',
          background: 'var(--bg)', borderRight: '1px solid var(--border)',
          borderTop: '1px solid var(--accent)',
        }}>
          <StatusDot kind="run" pulse size={5} /><span>forge</span><span style={{ color: 'var(--warn)', fontSize: 8, marginLeft: 2 }}>●</span>
        </div>
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}

function MiniRailWithOpenFile() {
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ padding: '4px 12px 6px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--text-dim)' }}>FILES · forge</div>
      {[
        { n: '▾ src/', depth: 0, active: false },
        { n: '▾ components/', depth: 1, active: false },
        { n: '▾ terminal/', depth: 2, active: false },
        { n: 'Terminal.jsx', depth: 3, active: true, git: 'M' },
        { n: 'Terminal.css', depth: 3, git: '' },
        { n: 'bridge/', depth: 2, chev: '▸' },
        { n: '▸ styles/', depth: 1 },
        { n: 'App.jsx', depth: 1 },
        { n: 'main.jsx', depth: 1 },
        { n: 'package.json', depth: 0 },
      ].map((f, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '2px 8px 2px 0', paddingLeft: 8 + f.depth * 10,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: f.active ? 'var(--text)' : 'var(--text-muted)',
          background: f.active ? 'var(--accent-soft)' : 'transparent',
          borderLeft: f.active ? '2px solid var(--accent)' : '2px solid transparent',
        }}>
          {f.active && <span style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: 999, flexShrink: 0 }} />}
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.n}</span>
          {f.git && <span style={{ marginLeft: 'auto', fontSize: 9, color: f.git === 'M' ? 'var(--warn)' : 'var(--ok)' }}>{f.git}</span>}
        </div>
      ))}
    </div>
  );
}

function MiniStatusBar() {
  return (
    <div style={{
      height: 20, flexShrink: 0,
      background: 'var(--chrome)', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
      fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
      letterSpacing: '0.04em',
    }}>
      <StatusDot kind="ok" size={5} /><span>main</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>forge</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span style={{ color: 'var(--warn)' }}>Terminal.jsx · modified</span>
      <span style={{ flex: 1 }} />
      <span>ln 47, col 12</span>
      <span style={{ color: 'var(--text-dim)' }}>·</span>
      <span>lf · utf-8</span>
    </div>
  );
}

// ─── Drawer pieces ──────────────────────────────────────────────

function DrawerHeader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', height: 34, flexShrink: 0,
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SpacemanMark size={18} />
      <MonoLabel size={10.5}>SPACEMAN</MonoLabel>
      <div style={{
        marginLeft: 6,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 6px',
        border: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
        color: 'var(--text-muted)',
      }}>
        <span style={{ color: 'var(--text)' }}>PROJECT</span>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <span style={{ color: 'var(--text-dim)' }}>GLOBAL</span>
      </div>
      <span style={{ flex: 1 }} />
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        color: 'var(--accent)', letterSpacing: '0.1em',
      }}>
        <StatusDot kind="run" pulse size={5} /> WATCHING
      </span>
    </div>
  );
}

function DrawerTabBar({ tab, setTab, compact }) {
  const tabs = [
    { id: 'chat',    label: 'CHAT',    glyph: <TabGlyph kind="chat" /> },
    { id: 'browser', label: 'BROWSER', glyph: <TabGlyph kind="browser" /> },
    { id: 'editor',  label: 'EDITOR',  glyph: <TabGlyph kind="editor" /> },
    { id: 'chain',   label: 'CHAIN',   glyph: <TabGlyph kind="chain" /> },
    { id: 'memory',  label: 'MEMORY',  glyph: <TabGlyph kind="memory" /> },
  ];
  return (
    <div style={{
      display: 'flex', borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)', fontSize: 10,
      background: 'var(--bg-pane)',
      flexShrink: 0,
    }}>
      {tabs.map(t => {
        const active = t.id === tab;
        const showLabel = !compact || active;
        return (
          <div key={t.id} onClick={() => setTab(t.id)} style={{
            padding: compact && !active ? '7px 10px' : '7px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer',
            color: active ? 'var(--text)' : 'var(--text-muted)',
            borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
            letterSpacing: '0.08em',
          }}>
            {t.glyph}
            {showLabel && <span>{t.label}</span>}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
    </div>
  );
}

function TabGlyph({ kind }) {
  const s = 12;
  const stroke = 'currentColor';
  if (kind === 'chat') return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M1.5 2h9v6h-5l-2.5 2V8h-1.5z" stroke={stroke} /></svg>;
  if (kind === 'browser') return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="8" stroke={stroke} /><line x1="1" y1="4.5" x2="11" y2="4.5" stroke={stroke} /></svg>;
  if (kind === 'editor') return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M2 1.5v9M4 3h6M4 5.5h4M4 8h5" stroke={stroke} /></svg>;
  if (kind === 'chain') return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><circle cx="3" cy="3" r="1.5" stroke={stroke} /><circle cx="9" cy="9" r="1.5" stroke={stroke} /><path d="M4.2 4.2 L 7.8 7.8" stroke={stroke} /></svg>;
  if (kind === 'memory') return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2" width="9" height="2" stroke={stroke} /><rect x="1.5" y="5" width="9" height="2" stroke={stroke} /><rect x="1.5" y="8" width="9" height="2" stroke={stroke} /></svg>;
  return null;
}

// ─── Editor surface inside the drawer ──────────────────────────

function EditorInDrawer() {
  const [active, setActive] = React.useState(0);
  const files = [
    { name: 'Terminal.jsx', dirty: true, path: 'src/components/terminal/' },
    { name: 'variables.css', dirty: true, path: 'src/styles/' },
    { name: 'App.jsx',       dirty: false, path: 'src/' },
    { name: 'package.json',  dirty: false, path: '' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* File tab bar */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: 'var(--chrome)',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 10.5,
        height: 26, flexShrink: 0, overflow: 'hidden',
      }}>
        {files.map((f, i) => (
          <div key={i} onClick={() => setActive(i)} style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6,
            color: i === active ? 'var(--text)' : 'var(--text-muted)',
            background: i === active ? 'var(--bg)' : 'transparent',
            borderRight: '1px solid var(--border)',
            borderTop: i === active ? '1px solid var(--accent)' : '1px solid transparent',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <span>{f.name}</span>
            {f.dirty
              ? <span style={{ color: 'var(--warn)', fontSize: 8 }}>●</span>
              : <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>×</span>}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{
          padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--text-muted)',
          borderLeft: '1px solid var(--border)',
        }}>
          <GlyphBtn label="split" />
          <GlyphBtn label="wrap" />
          <GlyphBtn label="⤢" title="Pop out to center pane" />
        </div>
      </div>

      {/* Breadcrumb + branch */}
      <div style={{
        flexShrink: 0,
        padding: '4px 12px',
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        color: 'var(--text-dim)', letterSpacing: '0.04em',
        background: 'var(--bg-sunken)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', gap: 6,
      }}>
        <span>{files[active].path}</span>
        <span style={{ color: 'var(--text-muted)' }}>{files[active].name}</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: 'var(--warn)' }}>M</span>
        <span style={{ color: 'var(--text-dim)' }}>main</span>
      </div>

      {/* Code */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg)', padding: '8px 0' }}>
        <EditorCode />
      </div>

      {/* Minimap + scrollbar hint, editor strip */}
      <div style={{
        flexShrink: 0,
        height: 20,
        background: 'var(--chrome)',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 10px',
        fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)',
        letterSpacing: '0.04em',
      }}>
        <span>JSX · react</span>
        <span>·</span>
        <span>spaces 2</span>
        <span>·</span>
        <span style={{ color: 'var(--warn)' }}>◉ unsaved</span>
        <span style={{ flex: 1 }} />
        <span>⇧⌘S save all</span>
        <span>·</span>
        <span>⌘⏎ send to spaceman</span>
      </div>
    </div>
  );
}

function GlyphBtn({ label, title }) {
  return (
    <span title={title} style={{
      fontFamily: 'var(--font-mono)', fontSize: 9,
      padding: '2px 5px', border: '1px solid var(--border)',
      letterSpacing: '0.08em', cursor: 'pointer',
      color: 'var(--text-muted)',
    }}>{label}</span>
  );
}

// Hand-authored "syntax highlighted" snippet — JSX sample.
function EditorCode() {
  const T = (c) => ({ color: c });
  const kw = 'var(--text-dim)';
  const name = 'var(--text)';
  const str = 'var(--ok)';
  const num = 'var(--warn)';
  const comp = 'var(--info)';
  const com = 'var(--text-dim)';
  const lines = [
    { n:  1, parts: [{ c: com, t: '// Terminal.jsx — renders a single agent terminal card' }] },
    { n:  2, parts: [{ c: kw, t: 'import' }, { c: name, t: ' React, ' }, { c: kw, t: '{ ' }, { c: name, t: 'useState, useEffect, useRef' }, { c: kw, t: ' } from ' }, { c: str, t: "'react'" }, { c: kw, t: ';' }] },
    { n:  3, parts: [{ c: kw, t: 'import' }, { c: kw, t: ' { ' }, { c: name, t: 'themeVars' }, { c: kw, t: ' } from ' }, { c: str, t: "'./tokens'" }, { c: kw, t: ';' }] },
    { n:  4, parts: [] },
    { n:  5, parts: [{ c: kw, t: 'export default function ' }, { c: name, t: 'Terminal' }, { c: kw, t: '({ ' }, { c: name, t: 'agent, active, onClose' }, { c: kw, t: ' }) {' }] },
    { n:  6, parts: [{ c: kw, t: '  const' }, { c: name, t: ' [lines, setLines] ' }, { c: kw, t: '= ' }, { c: name, t: 'useState' }, { c: kw, t: '([]);' }] },
    { n:  7, parts: [{ c: kw, t: '  const' }, { c: name, t: ' ref ' }, { c: kw, t: '= ' }, { c: name, t: 'useRef' }, { c: kw, t: '(' }, { c: kw, t: 'null' }, { c: kw, t: ');' }] },
    { n:  8, parts: [] },
    { n:  9, parts: [{ c: name, t: '  useEffect' }, { c: kw, t: '(() => {' }] },
    { n: 10, parts: [{ c: kw, t: '    if ' }, { c: kw, t: '(!' }, { c: name, t: 'active' }, { c: kw, t: ') ' }, { c: kw, t: 'return' }, { c: kw, t: ';' }], active: true },
    { n: 11, parts: [{ c: name, t: '    bridge' }, { c: kw, t: '.' }, { c: name, t: 'subscribe' }, { c: kw, t: '(' }, { c: name, t: 'agent.id' }, { c: kw, t: ', setLines);' }] },
    { n: 12, parts: [{ c: kw, t: '  }, [' }, { c: name, t: 'active, agent.id' }, { c: kw, t: ']);' }] },
    { n: 13, parts: [] },
    { n: 14, parts: [{ c: kw, t: '  return (' }] },
    { n: 15, parts: [{ c: kw, t: '    <' }, { c: comp, t: 'div' }, { c: name, t: ' ref' }, { c: kw, t: '={' }, { c: name, t: 'ref' }, { c: kw, t: '} ' }, { c: name, t: 'style' }, { c: kw, t: '={{ ' }, { c: name, t: 'height' }, { c: kw, t: ': ' }, { c: num, t: '100' }, { c: str, t: "'%'" }, { c: kw, t: ' }}>' }] },
    { n: 16, parts: [{ c: kw, t: '      <' }, { c: comp, t: 'Header' }, { c: kw, t: ' ' }, { c: name, t: 'agent' }, { c: kw, t: '={' }, { c: name, t: 'agent' }, { c: kw, t: '} ' }, { c: name, t: 'onClose' }, { c: kw, t: '={' }, { c: name, t: 'onClose' }, { c: kw, t: '} />' }] },
    { n: 17, parts: [{ c: kw, t: '      <' }, { c: comp, t: 'Body' }, { c: kw, t: ' ' }, { c: name, t: 'lines' }, { c: kw, t: '={' }, { c: name, t: 'lines' }, { c: kw, t: '} />' }] },
    { n: 18, parts: [{ c: kw, t: '    </' }, { c: comp, t: 'div' }, { c: kw, t: '>' }] },
    { n: 19, parts: [{ c: kw, t: '  );' }] },
    { n: 20, parts: [{ c: kw, t: '}' }] },
  ];
  return (
    <>
      {lines.map(l => (
        <div key={l.n} style={{
          display: 'flex', gap: 12, padding: '0 12px',
          fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7,
          background: l.active ? 'var(--accent-soft)' : 'transparent',
          borderLeft: l.active ? '2px solid var(--accent)' : '2px solid transparent',
          marginLeft: l.active ? -2 : 0,
        }}>
          <span style={{ width: 20, textAlign: 'right', color: l.active ? 'var(--text-muted)' : 'var(--text-dim)', flexShrink: 0 }}>{l.n}</span>
          <span style={{ whiteSpace: 'pre', minWidth: 0 }}>
            {l.parts.length === 0 ? '\u00A0' : l.parts.map((p, i) => <span key={i} style={{ color: p.c }}>{p.t}</span>)}
          </span>
        </div>
      ))}
    </>
  );
}

// Small stubs for the other tabs so toggling them works
function ChatStub() {
  return (
    <div style={{ padding: 14, fontFamily: 'var(--font-ui)', fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>
      <MonoLabel>you · just now</MonoLabel>
      <div style={{ color: 'var(--text)', marginTop: 4, marginBottom: 10 }}>Open Terminal.jsx in the editor.</div>
      <MonoLabel accent>spaceman · sonnet</MonoLabel>
      <div style={{ color: 'var(--text)', marginTop: 4 }}>Done — <span style={{ color: 'var(--accent)' }}>EDITOR</span> tab now shows src/components/terminal/Terminal.jsx. Drawer expanded to 58%.</div>
    </div>
  );
}
function BrowserStub() {
  return (
    <div style={{ padding: 14, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)' }}>
      <MonoLabel>recently opened</MonoLabel>
      <div style={{ marginTop: 10, padding: '6px 8px', border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}>
        ◐ localhost:5173 <span style={{ color: 'var(--accent)' }}>LIVE</span>
      </div>
      <div style={{ marginTop: 6, color: 'var(--text-dim)', fontFamily: 'var(--font-ui)', fontSize: 11 }}>
        Switching to BROWSER collapses drawer back to 50% (its own width).
      </div>
    </div>
  );
}
function ChainStub() {
  return (
    <div style={{ padding: 14 }}>
      <MonoLabel>chain · refactor-ui</MonoLabel>
      <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)' }}>
        {['scan', 'propose', 'apply', 'test'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-dim)' }}>0{i+1}</span>
            <span style={{ color: 'var(--text)', flex: 1 }}>{s}</span>
            <StatusDot kind={i === 1 ? 'run' : i < 1 ? 'ok' : 'idle'} pulse={i === 1} size={5} />
          </div>
        ))}
      </div>
    </div>
  );
}
function MemoryStub() {
  return (
    <div style={{ padding: 14, fontSize: 11.5, color: 'var(--text)' }}>
      <MonoLabel>decision</MonoLabel>
      <div style={{ marginTop: 3, marginBottom: 10 }}>Editor lives in drawer, not center grid — keeps terminals prime.</div>
      <MonoLabel>pattern</MonoLabel>
      <div style={{ marginTop: 3 }}>Opening a file switches to EDITOR tab automatically.</div>
    </div>
  );
}

window.SurfaceEditor = SurfaceEditor;
