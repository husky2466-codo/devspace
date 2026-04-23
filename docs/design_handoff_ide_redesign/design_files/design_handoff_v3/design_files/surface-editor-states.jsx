// EDITOR STATES — Empty · Dirty Guard · File Too Large · LSP Error
// Each artboard shows the Spaceman drawer in EDITOR tab, in that state.
// The IDE shell is compressed to draw focus to the drawer.

// State accent colors — applied to the caption bar and left border of the drawer
const STATE_COLORS = {
  empty:   { bg: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.55)', text: '#ffffff', label: 'EMPTY' },
  dirty:   { bg: 'rgba(208,88,88,0.18)',   border: '#d05858',                text: '#e87070', label: 'DIRTY GUARD' },
  large:   { bg: 'rgba(201,163,74,0.18)',  border: '#c9a34a',                text: '#e0b84a', label: 'FILE TOO LARGE' },
  split:   { bg: 'transparent',            border: 'var(--border)',           text: 'rgba(255,255,255,0.4)', label: 'SPLIT VIEW' },
  find:    { bg: 'rgba(100,200,140,0.15)', border: '#4ade80',                text: '#6ae89a', label: 'FIND · REPLACE' },
  ghost:   { bg: 'rgba(107,170,230,0.15)', border: '#5a9fd4',                text: '#7ab8e8', label: 'GHOST SUGGESTION' },
};

// ─── Shared drawer shell ─────────────────────────────────────────
function EditorDrawerFrame({ tone, children, stateLabel, stateKey }) {
  const sc = STATE_COLORS[stateKey] || STATE_COLORS.empty;
  return (
    <SurfaceFrame tone={tone}>
      {/* Colored caption bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 28,
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
        background: sc.bg,
        borderBottom: `1px solid ${sc.border}`,
        zIndex: 2,
      }}>
        <span style={{
          display: 'inline-block', width: 8, height: 8, borderRadius: 999,
          background: sc.border, flexShrink: 0,
        }} />
        <span style={{ color: sc.text, fontWeight: 500 }}>{sc.label}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9.5 }}>{stateLabel}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0, paddingTop: 28 }}>
        {/* Left rail — visible but not focal */}
        <div style={{
          width: 130, flexShrink: 0,
          background: 'var(--chrome)',
          borderRight: '1px solid var(--border)',
        }}>
          <MiniRail />
        </div>
        {/* Center terminals — visible but not focal */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--bg-sunken)' }}>
          <MiniTerminalGrid cells={1} />
        </div>
        {/* Drawer — primary focus, colored left border */}
        <div style={{
          width: '54%', flexShrink: 0,
          background: 'var(--bg-pane)',
          borderLeft: `2px solid ${sc.border}`,
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <EditorDrawerHeader stateColor={sc.border} />
          <EditorSharedTabBar stateColor={sc.border} />
          {children}
        </div>
      </div>
      <div style={{
        height: 20, flexShrink: 0,
        background: 'var(--chrome)', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
        fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
        letterSpacing: '0.04em', opacity: 0.6,
      }}>
        <StatusDot kind="ok" size={5} /><span>main · forge</span>
        <span style={{ flex: 1 }} />
        <StatusDot kind="run" pulse size={5} /><span>DGX · 1 running</span>
      </div>
    </SurfaceFrame>
  );
}

function EditorDrawerHeader({ stateColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 12px', height: 34, flexShrink: 0,
      background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
    }}>
      <SpacemanMark size={18} />
      <MonoLabel size={10.5}>SPACEMAN</MonoLabel>
      <div style={{
        marginLeft: 4,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 6px', border: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
        color: 'var(--text-muted)',
      }}>
        <span style={{ color: 'var(--text)' }}>PROJECT</span>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <span style={{ color: 'var(--text-dim)' }}>GLOBAL</span>
      </div>
      <span style={{ flex: 1 }} />
      <StatusDot kind="run" pulse size={5} />
      <MonoLabel size={9} accent>WATCHING</MonoLabel>
    </div>
  );
}

function EditorSharedTabBar({ stateColor }) {
  const tabs = [
    { id: 'chat',    glyph: <TG kind="chat" /> },
    { id: 'browser', glyph: <TG kind="browser" /> },
    { id: 'editor',  glyph: <TG kind="editor" />, label: 'EDITOR' },
    { id: 'chain',   glyph: <TG kind="chain" /> },
    { id: 'memory',  glyph: <TG kind="memory" /> },
  ];
  return (
    <div style={{
      display: 'flex', borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)', fontSize: 10, flexShrink: 0,
    }}>
      {tabs.map(t => {
        const active = t.id === 'editor';
        return (
          <div key={t.id} style={{
            padding: active ? '7px 12px' : '7px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
            color: active ? 'var(--text)' : 'var(--text-muted)',
            borderBottom: active ? `1px solid ${stateColor || 'var(--accent)'}` : '1px solid transparent',
            letterSpacing: '0.08em',
          }}>
            {t.glyph}
            {active && <span>EDITOR</span>}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
    </div>
  );
}

function TG({ kind }) {
  const s = 11;
  const c = 'currentColor';
  if (kind === 'chat')    return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M1.5 2h9v6h-5l-2.5 2V8h-1.5z" stroke={c} /></svg>;
  if (kind === 'browser') return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="8" stroke={c} /><line x1="1" y1="4.5" x2="11" y2="4.5" stroke={c} /></svg>;
  if (kind === 'editor')  return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M2 1.5v9M4 3h6M4 5.5h4M4 8h5" stroke={c} /></svg>;
  if (kind === 'chain')   return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><circle cx="3" cy="3" r="1.5" stroke={c} /><circle cx="9" cy="9" r="1.5" stroke={c} /><path d="M4.2 4.2L7.8 7.8" stroke={c} /></svg>;
  if (kind === 'memory')  return <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2" width="9" height="2" stroke={c} /><rect x="1.5" y="5" width="9" height="2" stroke={c} /><rect x="1.5" y="8" width="9" height="2" stroke={c} /></svg>;
  return null;
}

// ─── STATE 1: EMPTY ──────────────────────────────────────────────
// No file is open. User just opened the editor tab, or closed all file tabs.
function EditorStateEmpty({ tone }) {
  return (
    <EditorDrawerFrame tone={tone} stateKey="empty" stateLabel="no file open">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: 0 }}>
        {/* Empty file tab bar — just the + add button */}
        <div style={{
          height: 26, flexShrink: 0,
          background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 10.5, gap: 0,
        }}>
          <div style={{ flex: 1 }} />
          <div style={{
            padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text-dim)',
            borderLeft: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 10 }}>recently closed</span>
            <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>↺</span>
          </div>
        </div>
        {/* Empty state body */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 16, padding: 24, minHeight: 0,
        }}>
          {/* Glyph: empty doc */}
          <svg width="32" height="38" viewBox="0 0 32 38" fill="none" style={{ opacity: 0.25 }}>
            <rect x="1" y="1" width="22" height="30" stroke="var(--text)" strokeWidth="1.5" />
            <path d="M23 1l8 8H23V1z" stroke="var(--text)" strokeWidth="1.5" />
            <line x1="5" y1="14" x2="19" y2="14" stroke="var(--text)" />
            <line x1="5" y1="19" x2="19" y2="19" stroke="var(--text)" />
            <line x1="5" y1="24" x2="14" y2="24" stroke="var(--text)" />
          </svg>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--text-dim)', letterSpacing: '0.14em',
              marginBottom: 8,
            }}>NO FILE OPEN</div>
            <div style={{
              fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55,
              maxWidth: 220,
            }}>
              Click any file in the left rail to open it here.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 260 }}>
            <RecentFile name="Terminal.jsx" path="src/components/terminal/" git="M" />
            <RecentFile name="variables.css" path="src/styles/" git="M" />
            <RecentFile name="App.jsx" path="src/" git="" />
          </div>
          <div style={{
            marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)',
          }}>
            <span>⌘P</span><span>quick open</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span>⌘E</span><span>recent files</span>
          </div>
        </div>
      </div>
    </EditorDrawerFrame>
  );
}

function RecentFile({ name, path, git }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 10px',
      border: '1px solid var(--border)',
      background: 'var(--bg-raised)',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)', fontSize: 10.5,
    }}>
      <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>◈</span>
      <span style={{ flex: 1, color: 'var(--text)' }}>{name}</span>
      <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>{path}</span>
      {git && <span style={{ color: git === 'M' ? 'var(--warn)' : 'var(--ok)', fontSize: 9 }}>{git}</span>}
    </div>
  );
}

// ─── STATE 2: DIRTY GUARD ────────────────────────────────────────
// User clicks × on a dirty (unsaved) tab. An inline confirmation
// strip slides in below the tab bar. Non-blocking — the rest of
// the editor remains visible behind it.
function EditorStateDirtyGuard({ tone }) {
  const [dismissed, setDismissed] = React.useState(false);
  return (
    <EditorDrawerFrame tone={tone} stateKey="dirty" stateLabel="unsaved changes warning">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: 0 }}>
        {/* File tab bar — tab showing as "about to close" */}
        <div style={{
          height: 26, flexShrink: 0,
          background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'stretch',
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
        }}>
          <div style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text)', background: 'var(--bg)',
            borderRight: '1px solid var(--border)',
            borderTop: '1px solid var(--accent)',
            opacity: dismissed ? 0.4 : 1,
            position: 'relative',
          }}>
            <span>Terminal.jsx</span>
            <span style={{ color: 'var(--warn)', fontSize: 8 }}>●</span>
            <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>×</span>
            {/* strikethrough overlay when dismissed */}
          </div>
          <div style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text-muted)', borderRight: '1px solid var(--border)',
          }}>variables.css <span style={{ color: 'var(--warn)', fontSize: 8 }}>●</span> <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>×</span></div>
          <div style={{ flex: 1 }} />
        </div>

        {/* Dirty guard banner — slides in below tab bar */}
        {!dismissed && (
          <div style={{
            flexShrink: 0,
            background: 'var(--bg-raised)',
            borderBottom: '1px solid var(--border)',
            borderLeft: '2px solid var(--warn)',
          }}>
            <div style={{
              padding: '10px 14px',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <StatusDot kind="warn" size={6} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)',
                  marginBottom: 4,
                }}>
                  Terminal.jsx has unsaved changes.
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Save or discard before closing.
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex', gap: 6,
              padding: '8px 14px',
              background: 'var(--bg-sunken)',
              borderTop: '1px solid var(--border)',
            }}>
              <GuardBtn primary label="⇧⌘S  SAVE" />
              <GuardBtn label="DISCARD" />
              <GuardBtn label="KEEP OPEN" onClick={() => setDismissed(true)} />
              <span style={{ flex: 1 }} />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)',
                alignSelf: 'center', letterSpacing: '0.06em',
              }}>esc to cancel</div>
            </div>
            {/* Diff preview: what changed */}
            <div style={{
              borderTop: '1px solid var(--border)',
              padding: '8px 14px',
              fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1.5,
              color: 'var(--text-muted)',
            }}>
              <div style={{ marginBottom: 4, color: 'var(--text-dim)', fontSize: 9, letterSpacing: '0.1em' }}>UNSAVED DIFF · 3 hunks</div>
              <DiffLine kind="add" text="import { useBlink } from '../hooks/useBlink';" />
              <DiffLine kind="rem" text="const [caret, setCaret] = useState(true);" />
              <DiffLine kind="add" text="const caret = useBlink(true);" />
              <DiffLine kind="ctx" text="..." />
              <DiffLine kind="add" text="export { useBlink };" />
            </div>
          </div>
        )}

        {/* Code continues behind, dimmed */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', opacity: dismissed ? 1 : 0.35 }}>
          <div style={{ padding: '10px 0' }}>
            {[1,2,3,4,5,6,7,8].map(n => (
              <div key={n} style={{
                display: 'flex', gap: 12, padding: '0 14px',
                fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7,
              }}>
                <span style={{ width: 20, textAlign: 'right', color: 'var(--text-dim)', flexShrink: 0 }}>{n}</span>
                <span style={{ color: 'var(--text-muted)', whiteSpace: 'pre' }}>
                  {n === 1 ? "import React, { useState } from 'react';" :
                   n === 2 ? "import { themeVars } from './tokens';" :
                   n === 3 ? "" :
                   n === 4 ? "export default function Terminal({ agent }) {" :
                   n === 5 ? "  const [caret, setCaret] = useState(true);" :
                   n === 6 ? "  const ref = useRef(null);" :
                   n === 7 ? "" :
                   "  useEffect(() => {"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditorDrawerFrame>
  );
}

function GuardBtn({ label, primary, onClick }) {
  return (
    <span onClick={onClick} style={{
      padding: '4px 10px',
      fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em',
      cursor: 'pointer',
      color: primary ? 'var(--bg)' : 'var(--text-muted)',
      background: primary ? 'var(--accent)' : 'transparent',
      border: primary ? 'none' : '1px solid var(--border)',
    }}>{label}</span>
  );
}

function DiffLine({ kind, text }) {
  const bg = kind === 'add' ? 'var(--accent-soft)' : kind === 'rem' ? 'rgba(208,88,88,0.08)' : 'transparent';
  const color = kind === 'add' ? 'var(--ok)' : kind === 'rem' ? 'var(--err)' : 'var(--text-dim)';
  return (
    <div style={{
      display: 'flex', gap: 8,
      background: bg,
      padding: '0 4px',
    }}>
      <span style={{ color, width: 10, flexShrink: 0 }}>
        {kind === 'add' ? '+' : kind === 'rem' ? '−' : ' '}
      </span>
      <span style={{ color: kind === 'ctx' ? 'var(--text-dim)' : 'var(--text-muted)', whiteSpace: 'pre', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
    </div>
  );
}

// ─── STATE 3: FILE TOO LARGE ─────────────────────────────────────
// File exceeds the 2 MB rendering threshold. Can't highlight/render.
// Show file metadata, raw text option, and a "send to Spaceman" action.
function EditorStateFileTooLarge({ tone }) {
  return (
    <EditorDrawerFrame tone={tone} stateKey="large" stateLabel="render fallback">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: 0 }}>
        {/* File tab bar — file is open but in fallback mode */}
        <div style={{
          height: 26, flexShrink: 0,
          background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'stretch',
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
        }}>
          <div style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text)', background: 'var(--bg)',
            borderRight: '1px solid var(--border)',
            borderTop: '1px solid var(--warn)',
          }}>
            <span>training-data.jsonl</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 8,
              padding: '1px 4px', letterSpacing: '0.1em',
              color: 'var(--warn)', border: '1px solid var(--warn)',
            }}>LARGE</span>
            <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>×</span>
          </div>
          <div style={{ flex: 1 }} />
        </div>

        {/* Breadcrumb */}
        <div style={{
          flexShrink: 0, padding: '4px 12px',
          fontFamily: 'var(--font-mono)', fontSize: 9.5,
          color: 'var(--text-dim)', background: 'var(--bg-sunken)',
          borderBottom: '1px solid var(--border)',
        }}>
          data/ · training-data.jsonl
        </div>

        {/* Fallback body */}
        <div style={{
          flex: 1, minHeight: 0, overflow: 'auto',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 20, gap: 16,
        }}>
          <div style={{
            width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--warn)', color: 'var(--warn)',
            background: 'rgba(201,163,74,0.08)',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 3L20 19H2L11 3z" stroke="currentColor" />
              <line x1="11" y1="9" x2="11" y2="14" stroke="currentColor" />
              <circle cx="11" cy="17" r="0.8" fill="currentColor" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
              color: 'var(--warn)', marginBottom: 6,
            }}>FILE TOO LARGE TO RENDER</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Syntax highlighting is disabled above 2 MB.<br />
              The file is readable as raw text.
            </div>
          </div>

          {/* File metadata */}
          <div style={{
            width: '100%', maxWidth: 320,
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
          }}>
            {[
              { k: 'size',     v: '14.2 MB' },
              { k: 'lines',    v: '182,441' },
              { k: 'encoding', v: 'utf-8' },
              { k: 'type',     v: 'application/jsonl' },
              { k: 'modified', v: '2 min ago · main' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '90px 1fr',
                gap: 8, padding: '7px 12px',
                borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>{r.k}</span>
                <span style={{ color: 'var(--text)' }}>{r.v}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <ActionBtn label="OPEN AS RAW TEXT" primary />
            <ActionBtn label="OPEN IN SYSTEM EDITOR" />
            <ActionBtn label="✦ SEND TO SPACEMAN" accent />
          </div>

          {/* Spaceman hint */}
          <div style={{
            padding: '8px 12px',
            border: '1px solid var(--border)',
            borderLeft: '2px solid var(--accent)',
            background: 'var(--accent-soft)',
            fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1.45,
            color: 'var(--text-muted)', width: '100%', maxWidth: 320,
          }}>
            <div style={{ color: 'var(--accent)', marginBottom: 3 }}>◢ spaceman can operate on this file</div>
            <div>grep, slice, summarize, or stream-process large files without loading them into the editor.</div>
          </div>
        </div>
      </div>
    </EditorDrawerFrame>
  );
}

function ActionBtn({ label, primary, accent }) {
  return (
    <span style={{
      padding: '6px 12px',
      fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em',
      cursor: 'pointer',
      color: primary ? 'var(--bg)' : accent ? 'var(--accent)' : 'var(--text-muted)',
      background: primary ? 'var(--text)' : accent ? 'var(--accent-soft)' : 'transparent',
      border: accent ? '1px solid var(--accent)'
            : primary ? 'none'
            : '1px solid var(--border)',
    }}>{label}</span>
  );
}

// ─── STATE 4: LSP ERROR ──────────────────────────────────────────
// TypeScript compiler / ESLint errors appear in three places:
//   1. Error squiggles inline in the gutter (red underline / icon)
//   2. A collapsible error list strip pinned to the bottom of the editor
//   3. A hover tooltip on the cursor's error position
function EditorStateLSPError({ tone }) {
  const [hoverLine, setHoverLine] = React.useState(null);
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [stateLabel] = React.useState("2 errors · 1 warning");

  const errors = [
    { line: 5, col: 12, code: 'TS2304', msg: "Cannot find name 'useBlink'. Did you mean 'useState'?", sev: 'err' },
    { line: 9, col: 4,  code: 'TS6133', msg: "'useEffect' is declared but never read.", sev: 'warn' },
    { line: 12, col: 18, code: 'TS7006', msg: "Parameter 'agent' implicitly has an 'any' type.", sev: 'err' },
  ];

  const lines = [
    { n: 1, t: "import React, { useState } from 'react';", errs: [] },
    { n: 2, t: "import { themeVars } from './tokens';", errs: [] },
    { n: 3, t: "", errs: [] },
    { n: 4, t: "export default function Terminal({ agent, onClose }) {", errs: [] },
    { n: 5, t: "  const caret = useBlink(true);", errs: [0] },
    { n: 6, t: "  const ref = useRef(null);", errs: [] },
    { n: 7, t: "", errs: [] },
    { n: 8, t: "  return (", errs: [] },
    { n: 9, t: "    <div style={{ height: '100%' }}>", errs: [1] },
    { n: 10, t: "      <Header agent={agent} onClose={onClose} />", errs: [] },
    { n: 11, t: "      <Body lines={lines} />", errs: [] },
    { n: 12, t: "    </div>", errs: [2] },
    { n: 13, t: "  );", errs: [] },
    { n: 14, t: "}", errs: [] },
  ];

  return (
    <EditorDrawerFrame tone={tone} stateKey="lsp" stateLabel={stateLabel}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: 0 }}>
        {/* File tab bar */}
        <div style={{
          height: 26, flexShrink: 0,
          background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'stretch',
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
        }}>
          <div style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text)', background: 'var(--bg)',
            borderRight: '1px solid var(--border)',
            borderTop: '1px solid var(--err)',
          }}>
            <span>Terminal.jsx</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 8,
              padding: '1px 4px', letterSpacing: '0.1em',
              color: 'var(--err)', border: '1px solid var(--err)',
            }}>2✗</span>
            <span style={{ color: 'var(--warn)', fontSize: 8 }}>●</span>
            <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>×</span>
          </div>
          <div style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text-muted)', borderRight: '1px solid var(--border)',
          }}>App.jsx</div>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5, borderLeft: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--err)', fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>✗ 2</span>
            <span style={{ color: 'var(--warn)', fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>▲ 1</span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{
          flexShrink: 0, padding: '4px 12px',
          fontFamily: 'var(--font-mono)', fontSize: 9.5,
          color: 'var(--text-dim)', background: 'var(--bg-sunken)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          src/components/terminal/ · Terminal.jsx
          <span style={{ flex: 1 }} />
          <span style={{ color: 'var(--err)', letterSpacing: '0.06em' }}>tsc · 2 errors</span>
        </div>

        {/* Code with gutter and squiggles */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative', paddingBottom: 4 }}>
          {lines.map(l => {
            const hasErr = l.errs.some(ei => errors[ei]?.sev === 'err');
            const hasWarn = l.errs.some(ei => errors[ei]?.sev === 'warn');
            const errIdx = l.errs[0] !== undefined ? l.errs[0] : null;
            const hovering = hoverLine === l.n && errIdx !== null;
            return (
              <div key={l.n} style={{ position: 'relative' }}>
                <div
                  onMouseEnter={() => errIdx !== null && setHoverLine(l.n)}
                  onMouseLeave={() => setHoverLine(null)}
                  style={{
                    display: 'flex', gap: 0,
                    fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7,
                    background: hasErr ? 'rgba(208,88,88,0.06)' : hasWarn ? 'rgba(201,163,74,0.05)' : 'transparent',
                    cursor: errIdx !== null ? 'pointer' : 'default',
                  }}>
                  {/* Gutter: error icon */}
                  <div style={{
                    width: 18, flexShrink: 0, textAlign: 'center',
                    color: hasErr ? 'var(--err)' : hasWarn ? 'var(--warn)' : 'transparent',
                    fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    paddingTop: 1,
                  }}>
                    {hasErr ? '✗' : hasWarn ? '▲' : ''}
                  </div>
                  {/* Line number */}
                  <div style={{
                    width: 24, textAlign: 'right', color: 'var(--text-dim)', flexShrink: 0,
                    paddingRight: 8,
                  }}>{l.n}</div>
                  {/* Code */}
                  <div style={{ flex: 1, paddingRight: 12, whiteSpace: 'pre', minWidth: 0 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{l.t}</span>
                    {(hasErr || hasWarn) && l.t && (
                      <span style={{
                        position: 'absolute',
                        left: 42 + (errors[errIdx]?.col - 1) * 6.6,
                        // simplified underline: just add it to a range after the code
                        bottom: 2,
                        width: 40, height: 1.5,
                        background: hasErr ? 'var(--err)' : 'var(--warn)',
                        borderRadius: 999,
                        pointerEvents: 'none',
                        opacity: 0.7,
                      }} />
                    )}
                  </div>
                </div>
                {/* Hover tooltip */}
                {hovering && errIdx !== null && (
                  <div style={{
                    position: 'absolute', left: 42, top: '100%', zIndex: 10,
                    background: 'var(--bg-raised)',
                    border: `1px solid ${errors[errIdx].sev === 'err' ? 'var(--err)' : 'var(--warn)'}`,
                    padding: '8px 12px',
                    fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1.45,
                    color: 'var(--text-muted)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    maxWidth: 340,
                  }}>
                    <div style={{
                      color: errors[errIdx].sev === 'err' ? 'var(--err)' : 'var(--warn)',
                      marginBottom: 4, fontSize: 9.5, letterSpacing: '0.08em',
                    }}>
                      {errors[errIdx].code} · ln {errors[errIdx].line}, col {errors[errIdx].col}
                    </div>
                    <div style={{ color: 'var(--text)' }}>{errors[errIdx].msg}</div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 10, color: 'var(--text-dim)', fontSize: 9 }}>
                      <span>⏎ quick fix</span>
                      <span>⌘. actions</span>
                      <span style={{ flex: 1 }} />
                      <span style={{ color: 'var(--accent)' }}>✦ ask spaceman</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error list panel */}
        <div style={{
          flexShrink: 0, background: 'var(--bg-pane)',
          borderTop: '1px solid var(--border)',
        }}>
          <div
            onClick={() => setPanelOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px', cursor: 'pointer',
              background: 'var(--chrome)',
              fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}>
            <span style={{ color: 'var(--text-dim)' }}>{panelOpen ? '▾' : '▸'}</span>
            <span style={{ color: 'var(--err)' }}>✗ 2 errors</span>
            <span>·</span>
            <span style={{ color: 'var(--warn)' }}>▲ 1 warning</span>
            <span style={{ flex: 1 }} />
            <span style={{ color: 'var(--accent)', fontSize: 9 }}>✦ fix all with spaceman</span>
          </div>
          {panelOpen && (
            <div style={{ maxHeight: 110, overflow: 'auto' }}>
              {errors.map((e, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '14px 1fr',
                  gap: 8, padding: '5px 10px',
                  borderTop: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}>
                  <span style={{ color: e.sev === 'err' ? 'var(--err)' : 'var(--warn)', fontSize: 10, marginTop: 1 }}>
                    {e.sev === 'err' ? '✗' : '▲'}
                  </span>
                  <div>
                    <div style={{ color: 'var(--text)', marginBottom: 2 }}>{e.msg}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 9 }}>
                      Terminal.jsx · {e.code} · ln {e.line}, col {e.col}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EditorDrawerFrame>
  );
}

// ─── STATE 5: SPLIT VIEW ─────────────────────────────────────────
// Two files open side-by-side inside the drawer. A thin divider with
// a drag handle separates them. Each pane has its own file tab bar,
// breadcrumb, and scroll position. Active pane gets the accent border.
function EditorStateSplitView({ tone }) {
  const [activePane, setActivePane] = React.useState('left');
  return (
    <EditorDrawerFrame tone={tone} stateKey="split" stateLabel="two panes · drag to resize">
      <div style={{ flex: 1, display: 'flex', minHeight: 0, background: 'var(--bg)' }}>
        {/* Left pane */}
        <div style={{
          flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          outline: activePane === 'left' ? '1px solid var(--accent)' : 'none',
          outlineOffset: -1,
        }} onClick={() => setActivePane('left')}>
          <SplitTabBar name="Terminal.jsx" dirty active={activePane === 'left'} />
          <SplitBreadcrumb path="src/components/terminal/" name="Terminal.jsx" git="M" />
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '8px 0' }}>
            <SplitCode side="left" activeLine={activePane === 'left' ? 10 : null} />
          </div>
          <SplitFooter lang="JSX" ln={10} col={12} />
        </div>

        {/* Drag handle */}
        <div style={{
          width: 4, flexShrink: 0, background: 'var(--border)', cursor: 'col-resize',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
        }}>
          <div style={{ width: 2, height: 24, background: 'var(--border-strong)', borderRadius: 1 }} />
        </div>

        {/* Right pane */}
        <div style={{
          flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
          outline: activePane === 'right' ? '1px solid var(--accent)' : 'none',
          outlineOffset: -1,
        }} onClick={() => setActivePane('right')}>
          <SplitTabBar name="useBlink.js" active={activePane === 'right'} />
          <SplitBreadcrumb path="src/hooks/" name="useBlink.js" git="A" />
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '8px 0' }}>
            <SplitCode side="right" activeLine={activePane === 'right' ? 3 : null} />
          </div>
          <SplitFooter lang="JS" ln={3} col={1} />
        </div>
      </div>
    </EditorDrawerFrame>
  );
}

function SplitTabBar({ name, dirty, active }) {
  return (
    <div style={{
      height: 24, flexShrink: 0,
      background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch',
      fontFamily: 'var(--font-mono)', fontSize: 10,
    }}>
      <div style={{
        padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
        color: 'var(--text)', background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
        borderTop: active ? '1px solid var(--accent)' : '1px solid transparent',
      }}>
        {name}
        {dirty && <span style={{ color: 'var(--warn)', fontSize: 7 }}>●</span>}
        <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>×</span>
      </div>
      <div style={{ flex: 1 }} />
      {active && (
        <div style={{ padding: '0 8px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>ACTIVE</span>
        </div>
      )}
    </div>
  );
}

function SplitBreadcrumb({ path, name, git }) {
  return (
    <div style={{
      flexShrink: 0, padding: '3px 10px',
      fontFamily: 'var(--font-mono)', fontSize: 9,
      color: 'var(--text-dim)', background: 'var(--bg-sunken)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <span>{path}</span><span style={{ color: 'var(--text-muted)' }}>{name}</span>
      <span style={{ flex: 1 }} />
      <span style={{ color: git === 'M' ? 'var(--warn)' : 'var(--ok)' }}>{git}</span>
    </div>
  );
}

function SplitFooter({ lang, ln, col }) {
  return (
    <div style={{
      flexShrink: 0, height: 18,
      background: 'var(--chrome)', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
      fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)',
      letterSpacing: '0.04em',
    }}>
      <span>{lang}</span><span>·</span><span>ln {ln}, col {col}</span>
    </div>
  );
}

function SplitCode({ side, activeLine }) {
  const leftLines = [
    { n: 1,  t: "import React, { useState, useEffect, useRef } from 'react';" },
    { n: 2,  t: "import { useBlink } from '../hooks/useBlink';" },
    { n: 3,  t: "" },
    { n: 4,  t: "export default function Terminal({ agent, active, onClose }) {" },
    { n: 5,  t: "  const ref = useRef(null);" },
    { n: 6,  t: "" },
    { n: 7,  t: "  useEffect(() => {" },
    { n: 8,  t: "    if (!active) return;" },
    { n: 9,  t: "    bridge.subscribe(agent.id, setLines);" },
    { n: 10, t: "  }, [active, agent.id]);" },
    { n: 11, t: "" },
    { n: 12, t: "  return (" },
    { n: 13, t: "    <div ref={ref} style={{ height: '100%' }}>" },
  ];
  const rightLines = [
    { n: 1,  t: "import { useState, useEffect } from 'react';" },
    { n: 2,  t: "" },
    { n: 3,  t: "export function useBlink(initial = true, ms = 530) {" },
    { n: 4,  t: "  const [on, setOn] = useState(initial);" },
    { n: 5,  t: "" },
    { n: 6,  t: "  useEffect(() => {" },
    { n: 7,  t: "    const id = setInterval(() => setOn(v => !v), ms);" },
    { n: 8,  t: "    return () => clearInterval(id);" },
    { n: 9,  t: "  }, [ms]);" },
    { n: 10, t: "" },
    { n: 11, t: "  return on;" },
    { n: 12, t: "}" },
  ];
  const lines = side === 'left' ? leftLines : rightLines;
  return (
    <>
      {lines.map(l => (
        <div key={l.n} style={{
          display: 'flex', gap: 8, padding: '0 10px',
          fontFamily: 'var(--font-mono)', fontSize: 10.5, lineHeight: 1.65,
          background: l.n === activeLine ? 'var(--accent-soft)' : 'transparent',
          borderLeft: l.n === activeLine ? '2px solid var(--accent)' : '2px solid transparent',
        }}>
          <span style={{ width: 18, textAlign: 'right', color: 'var(--text-dim)', flexShrink: 0 }}>{l.n}</span>
          <span style={{ color: 'var(--text-muted)', whiteSpace: 'pre' }}>{l.t || '\u00A0'}</span>
        </div>
      ))}
    </>
  );
}

// ─── STATE 6: FIND / REPLACE STRIP ──────────────────────────────
// ⌘F opens a strip pinned below the file tab bar.
// ⌘H opens the replace row beneath it.
// Matches are highlighted inline in the code. Nav arrows jump between.
function EditorStateFindReplace({ tone }) {
  const [replaceOpen, setReplaceOpen] = React.useState(true);
  const query = 'caret';
  const replace = 'blinkOn';
  const matchCount = 4;
  const currentMatch = 2;

  const lines = [
    { n: 1,  t: "import React, { useState } from 'react';" },
    { n: 2,  t: "import { themeVars } from './tokens';" },
    { n: 3,  t: "" },
    { n: 4,  t: "export default function Terminal({ agent }) {" },
    { n: 5,  t: "  const [caret, setCaret] = useState(true);",  match: true, cur: true },
    { n: 6,  t: "  const ref = useRef(null);" },
    { n: 7,  t: "" },
    { n: 8,  t: "  useEffect(() => {" },
    { n: 9,  t: "    if (!caret) return;",                        match: true },
    { n: 10, t: "  }, [caret]);",                                  match: true },
    { n: 11, t: "" },
    { n: 12, t: "  return (" },
    { n: 13, t: "    <div style={{ display: 'flex' }}>" },
    { n: 14, t: "      {caret && <span className='blink' />}",    match: true },
    { n: 15, t: "    </div>" },
    { n: 16, t: "  );" },
    { n: 17, t: "}" },
  ];

  return (
    <EditorDrawerFrame tone={tone} stateKey="find" stateLabel="⌘F · ⌘H replace · 4 matches">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: 0 }}>
        {/* File tab */}
        <div style={{
          height: 24, flexShrink: 0,
          background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'stretch',
          fontFamily: 'var(--font-mono)', fontSize: 10,
        }}>
          <div style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
            color: 'var(--text)', background: 'var(--bg)',
            borderRight: '1px solid var(--border)',
            borderTop: '1px solid var(--accent)',
          }}>Terminal.jsx <span style={{ color: 'var(--warn)', fontSize: 7 }}>●</span> <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>×</span></div>
          <div style={{ flex: 1 }} />
        </div>

        {/* Find / Replace strip */}
        <div style={{
          flexShrink: 0,
          background: 'var(--bg-raised)',
          borderBottom: '1px solid var(--border)',
          padding: '6px 10px',
          display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          {/* Find row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 8px',
              background: 'var(--bg-sunken)',
              border: '1px solid var(--accent)',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)' }}>⌘F</span>
              <span style={{
                flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text)',
              }}>{query}<span style={{
                display: 'inline-block', width: 1.5, height: 12,
                background: 'var(--text)', verticalAlign: 'text-bottom',
                marginLeft: 1, animation: 'smCaret 1s step-end infinite',
              }} /></span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'var(--accent)', letterSpacing: '0.06em',
              }}>{currentMatch}/{matchCount}</span>
            </div>
            {/* Nav + options */}
            <FindBtn label="▲" title="Previous" />
            <FindBtn label="▼" title="Next" />
            <FindBtn label="Aa" title="Case sensitive" />
            <FindBtn label=".*" title="Regex" />
            <FindBtn label="⌘H" title="Toggle replace" active={replaceOpen} onClick={() => setReplaceOpen(o => !o)} />
            <FindBtn label="×" title="Close" />
          </div>
          {/* Replace row */}
          {replaceOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 8px',
                background: 'var(--bg-sunken)',
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)' }}>⌘H</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ok)' }}>{replace}</span>
              </div>
              <FindBtn label="↵ this" title="Replace current" accent />
              <FindBtn label="↵ all" title="Replace all" accent />
            </div>
          )}
        </div>

        {/* Code with match highlights */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '6px 0' }}>
          {lines.map(l => (
            <div key={l.n} style={{
              display: 'flex', gap: 8, padding: '0 10px',
              fontFamily: 'var(--font-mono)', fontSize: 10.5, lineHeight: 1.65,
              background: l.cur ? 'var(--accent-soft)' : 'transparent',
            }}>
              <span style={{ width: 18, textAlign: 'right', color: l.match ? 'var(--text-muted)' : 'var(--text-dim)', flexShrink: 0 }}>{l.n}</span>
              <span style={{ color: 'var(--text-muted)', whiteSpace: 'pre' }}>
                {l.match ? <MatchHighlight text={l.t} query={query} isCurrent={l.cur} replace={replaceOpen ? replace : null} /> : (l.t || '\u00A0')}
              </span>
            </div>
          ))}
        </div>

        {/* Status strip */}
        <div style={{
          flexShrink: 0, height: 20,
          background: 'var(--chrome)', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>{matchCount} matches</span>
          <span>·</span>
          <span>Terminal.jsx</span>
          <span style={{ flex: 1 }} />
          <span>esc close</span>
        </div>
      </div>
    </EditorDrawerFrame>
  );
}

function FindBtn({ label, title, active, accent, onClick }) {
  return (
    <span title={title} onClick={onClick} style={{
      padding: '3px 7px',
      fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.04em',
      cursor: 'pointer', flexShrink: 0,
      color: accent ? 'var(--ok)' : active ? 'var(--text)' : 'var(--text-dim)',
      border: `1px solid ${active ? 'var(--accent)' : accent ? 'var(--ok)' : 'var(--border)'}`,
      background: active ? 'var(--accent-soft)' : 'transparent',
    }}>{label}</span>
  );
}

function MatchHighlight({ text, query, isCurrent, replace }) {
  // Find the query in the text and wrap it.
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  const before = text.slice(0, idx);
  const match  = text.slice(idx, idx + query.length);
  const after  = text.slice(idx + query.length);
  return (
    <span>
      {before}
      <span style={{
        background: isCurrent ? 'var(--warn)' : 'rgba(201,163,74,0.3)',
        color: isCurrent ? 'var(--bg)' : 'var(--text)',
        borderRadius: 2, padding: '0 1px',
        position: 'relative',
      }}>
        {match}
        {isCurrent && replace && (
          <span style={{
            position: 'absolute', left: 0, top: '100%', marginTop: 2,
            background: 'var(--ok)', color: 'var(--bg)',
            padding: '1px 4px', fontSize: 9.5, borderRadius: 2,
            whiteSpace: 'nowrap', zIndex: 5,
            pointerEvents: 'none',
          }}>→ {replace}</span>
        )}
      </span>
      {after}
    </span>
  );
}

// ─── STATE 7: SPACEMAN GHOST SUGGESTIONS ────────────────────────
// While Spaceman is composing an edit, its proposed changes appear
// inline as a "ghost" overlay — dim, italic, strikethrough for removed
// lines, bright for added lines. User can accept (Tab), reject (Esc),
// or accept line-by-line (⌘→). A floating action bar rides above
// the first ghost line.
function EditorStateGhostSuggestion({ tone }) {
  const [accepted, setAccepted] = React.useState(false);

  const lines = accepted ? [
    { n: 1,  t: "import React, { useRef } from 'react';",              kind: 'normal' },
    { n: 2,  t: "import { useBlink } from '../hooks/useBlink';",        kind: 'accepted' },
    { n: 3,  t: "",                                                     kind: 'normal' },
    { n: 4,  t: "export default function Terminal({ agent, active }) {", kind: 'normal' },
    { n: 5,  t: "  const caret = useBlink(true);",                     kind: 'accepted' },
    { n: 6,  t: "  const ref = useRef(null);",                         kind: 'normal' },
    { n: 7,  t: "",                                                     kind: 'normal' },
    { n: 8,  t: "  // ...rest unchanged",                               kind: 'normal' },
  ] : [
    { n: 1,  t: "import React, { useState, useRef } from 'react';",    kind: 'rem' },
    { n: '1b', t: "import React, { useRef } from 'react';",             kind: 'add', first: true },
    { n: '1c', t: "import { useBlink } from '../hooks/useBlink';",       kind: 'add' },
    { n: 2,  t: "",                                                     kind: 'normal' },
    { n: 3,  t: "export default function Terminal({ agent, active }) {", kind: 'normal' },
    { n: 4,  t: "  const [caret, setCaret] = useState(true);",         kind: 'rem' },
    { n: '4b', t: "  const caret = useBlink(true);",                    kind: 'add' },
    { n: 5,  t: "  const ref = useRef(null);",                         kind: 'normal' },
    { n: 6,  t: "",                                                     kind: 'normal' },
    { n: 7,  t: "  // ...rest unchanged",                               kind: 'normal' },
  ];

  return (
    <EditorDrawerFrame tone={tone} stateKey="ghost" stateLabel="Spaceman proposing · Tab accept · Esc reject">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: 0 }}>
        {/* File tab */}
        <div style={{
          height: 24, flexShrink: 0,
          background: 'var(--chrome)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'stretch',
          fontFamily: 'var(--font-mono)', fontSize: 10,
        }}>
          <div style={{
            padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
            color: 'var(--text)', background: 'var(--bg)',
            borderRight: '1px solid var(--border)',
            borderTop: '1px solid var(--accent)',
          }}>
            Terminal.jsx
            {!accepted && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent)', letterSpacing: '0.08em', marginLeft: 2 }}>✦ SPACEMAN</span>}
            {accepted && <span style={{ color: 'var(--ok)', fontSize: 7 }}>●</span>}
            <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>×</span>
          </div>
          <div style={{ flex: 1 }} />
        </div>

        {/* Spaceman composing banner */}
        {!accepted && (
          <div style={{
            flexShrink: 0,
            padding: '6px 12px',
            background: 'var(--accent-soft)',
            borderBottom: '1px solid var(--accent)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 10,
          }}>
            <StatusDot kind="run" pulse size={5} />
            <span style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}>SPACEMAN</span>
            <span style={{ color: 'var(--text-muted)' }}>proposing refactor · extract caret blink into useBlink hook</span>
            <span style={{ flex: 1 }} />
            <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>+3 −2 lines</span>
          </div>
        )}

        {/* Ghost code */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '8px 0', position: 'relative' }}>
          {/* Floating action bar — rides above first ghost add line */}
          {!accepted && (
            <div style={{
              position: 'sticky', top: 0, zIndex: 5,
              display: 'flex', gap: 6, justifyContent: 'flex-end',
              padding: '4px 12px',
              background: 'linear-gradient(to bottom, var(--bg) 70%, transparent)',
            }}>
              <GhostBtn label="⇥ Accept all" primary onClick={() => setAccepted(true)} />
              <GhostBtn label="⌘→ Line by line" />
              <GhostBtn label="Esc Reject" />
            </div>
          )}
          {lines.map((l, i) => {
            const isRem = l.kind === 'rem';
            const isAdd = l.kind === 'add';
            const isAccepted = l.kind === 'accepted';
            return (
              <div key={i} style={{
                display: 'flex', gap: 8, padding: '0 10px',
                fontFamily: 'var(--font-mono)', fontSize: 10.5, lineHeight: 1.65,
                background: isRem ? 'rgba(208,88,88,0.08)'
                           : isAdd ? 'rgba(74,222,128,0.07)'
                           : isAccepted ? 'var(--accent-soft)'
                           : 'transparent',
                borderLeft: isRem ? '2px solid rgba(208,88,88,0.5)'
                           : isAdd ? '2px solid rgba(74,222,128,0.5)'
                           : isAccepted ? '2px solid var(--accent)'
                           : '2px solid transparent',
              }}>
                {/* Gutter marker */}
                <span style={{
                  width: 10, flexShrink: 0, textAlign: 'center',
                  color: isRem ? 'var(--err)' : isAdd ? 'var(--ok)' : 'transparent',
                  fontSize: 10,
                }}>{isRem ? '−' : isAdd ? '+' : ''}</span>
                {/* Line number */}
                <span style={{
                  width: 18, textAlign: 'right', color: 'var(--text-dim)', flexShrink: 0,
                }}>
                  {typeof l.n === 'number' ? l.n : ''}
                </span>
                {/* Code */}
                <span style={{
                  color: isRem ? 'var(--err)' : isAdd ? 'var(--ok)' : isAccepted ? 'var(--text)' : 'var(--text-muted)',
                  textDecoration: isRem ? 'line-through' : 'none',
                  opacity: isAdd && !isRem ? 0.85 : 1,
                  fontStyle: isAdd ? 'italic' : 'normal',
                  whiteSpace: 'pre',
                }}>{l.t || '\u00A0'}</span>
              </div>
            );
          })}
          {accepted && (
            <div style={{
              margin: '12px 10px 4px',
              padding: '8px 12px',
              background: 'var(--accent-soft)',
              border: '1px solid var(--accent)',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--accent)', letterSpacing: '0.08em',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <StatusDot kind="ok" size={5} />
              ACCEPTED · Terminal.jsx updated · 3 lines added · 2 removed
              <span style={{ flex: 1 }} />
              <span style={{ color: 'var(--text-dim)' }}>⌘Z undo</span>
            </div>
          )}
        </div>

        {/* Status */}
        <div style={{
          flexShrink: 0, height: 20,
          background: 'var(--chrome)', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)',
        }}>
          {accepted
            ? <><StatusDot kind="ok" size={4} /><span style={{ color: 'var(--ok)' }}>edit accepted</span></>
            : <><StatusDot kind="run" pulse size={4} /><span style={{ color: 'var(--accent)' }}>spaceman proposing…</span></>}
          <span style={{ flex: 1 }} />
          <span>JSX · spaces 2</span>
        </div>
      </div>
    </EditorDrawerFrame>
  );
}

function GhostBtn({ label, primary, onClick }) {
  return (
    <span onClick={onClick} style={{
      padding: '3px 9px',
      fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.06em',
      cursor: 'pointer',
      color: primary ? 'var(--bg)' : 'var(--text-muted)',
      background: primary ? 'var(--accent)' : 'var(--bg-raised)',
      border: primary ? 'none' : '1px solid var(--border)',
    }}>{label}</span>
  );
}

// Export all states
window.EditorStateEmpty        = EditorStateEmpty;
window.EditorStateDirtyGuard   = EditorStateDirtyGuard;
window.EditorStateFileTooLarge = EditorStateFileTooLarge;
window.EditorStateLSPError     = EditorStateLSPError;
window.EditorStateSplitView    = EditorStateSplitView;
window.EditorStateFindReplace  = EditorStateFindReplace;
window.EditorStateGhostSuggestion = EditorStateGhostSuggestion;
