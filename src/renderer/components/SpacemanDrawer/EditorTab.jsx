import { useState, useEffect } from 'react';
import StatusDot from '../primitives/StatusDot.jsx';

function ToolBtn({ label, title, active, accent, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        all: 'unset',
        padding: '2px 6px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        flexShrink: 0,
        color: accent ? 'var(--ok)' : active ? 'var(--text)' : 'var(--text-dim)',
        border: `1px solid ${active ? 'var(--accent)' : accent ? 'var(--ok)' : 'var(--border)'}`,
        background: active ? 'var(--accent-soft)' : 'transparent',
      }}
    >
      {label}
    </button>
  );
}

function GuardBtn({ label, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        padding: '4px 10px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        letterSpacing: '0.08em',
        cursor: 'pointer',
        color: primary ? 'var(--bg)' : 'var(--text-muted)',
        background: primary ? 'var(--accent)' : 'transparent',
        border: primary ? 'none' : '1px solid var(--border)',
      }}
    >
      {label}
    </button>
  );
}

function CodeArea({ file, ghost, ghostAccepted, query }) {
  const lines = [
    { n: 1,  t: "import React, { useState, useRef } from 'react';" },
    {
      n: 2,
      t: ghost && !ghostAccepted
        ? "import { themeVars } from './tokens';"
        : "import { useBlink } from '../hooks/useBlink';",
      kind: ghostAccepted ? 'accepted' : 'normal',
    },
    { n: 3,  t: '' },
    { n: 4,  t: 'export default function Terminal({ agent, active, onClose }) {' },
    {
      n: 5,
      t: ghost && !ghostAccepted
        ? '  const [caret, setCaret] = useState(true);'
        : '  const caret = useBlink(true);',
      kind: ghost && !ghostAccepted ? 'rem' : ghostAccepted ? 'accepted' : 'normal',
    },
    { n: 6,  t: '  const ref = useRef(null);' },
    { n: 7,  t: '' },
    { n: 8,  t: '  useEffect(() => {' },
    { n: 9,  t: '    if (!active) return;', err: file?.errors?.[0] },
    { n: 10, t: '    bridge.subscribe(agent.id, setLines);', active: true },
    { n: 11, t: '  }, [active, agent.id]);' },
    { n: 12, t: '' },
    { n: 13, t: '  return (' },
    { n: 14, t: "    <div ref={ref} style={{ height: '100%' }}>" },
    { n: 15, t: '      <Header agent={agent} onClose={onClose} />' },
    { n: 16, t: '      <Body lines={lines} />' },
    { n: 17, t: '    </div>' },
    { n: 18, t: '  );' },
    { n: 19, t: '}' },
  ];

  return (
    <>
      {lines.map((l, i) => {
        const isRem = l.kind === 'rem';
        const isAccepted = l.kind === 'accepted';
        const hasErr = !!l.err;
        const matchIdx = query ? l.t.toLowerCase().indexOf(query.toLowerCase()) : -1;
        return (
          <div key={i} style={{
            display: 'flex',
            gap: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            lineHeight: 1.7,
            background: isRem
              ? 'color-mix(in srgb, var(--err) 7%, transparent)'
              : isAccepted
              ? 'var(--accent-soft)'
              : hasErr
              ? 'color-mix(in srgb, var(--err) 5%, transparent)'
              : l.active
              ? 'var(--accent-soft)'
              : 'transparent',
            borderLeft: isAccepted || l.active
              ? '2px solid var(--accent)'
              : isRem
              ? '2px solid color-mix(in srgb, var(--err) 50%, transparent)'
              : '2px solid transparent',
          }}>
            <span style={{
              width: 16, textAlign: 'center', flexShrink: 0,
              color: hasErr ? 'var(--err)' : 'transparent',
              fontSize: 9, paddingTop: 3,
            }}>
              {hasErr ? '✗' : ''}
            </span>
            <span style={{
              width: 24, textAlign: 'right',
              color: 'var(--text-dim)', flexShrink: 0, paddingRight: 8,
            }}>
              {l.n}
            </span>
            <span style={{
              whiteSpace: 'pre',
              color: isRem ? 'var(--err)' : isAccepted ? 'var(--text)' : 'var(--text-muted)',
              textDecoration: isRem ? 'line-through' : 'none',
              paddingRight: 12,
              flex: 1,
            }}>
              {matchIdx >= 0 ? (
                <>
                  {l.t.slice(0, matchIdx)}
                  <span style={{ background: 'color-mix(in srgb, var(--warn) 45%, transparent)', borderRadius: 2, padding: '0 1px' }}>
                    {l.t.slice(matchIdx, matchIdx + query.length)}
                  </span>
                  {l.t.slice(matchIdx + query.length)}
                </>
              ) : (l.t || ' ')}
            </span>
          </div>
        );
      })}
    </>
  );
}

function EmptyState() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      background: 'var(--bg)',
      padding: 24,
    }}>
      <svg width="28" height="34" viewBox="0 0 32 38" fill="none" style={{ opacity: 0.2 }}>
        <rect x="1" y="1" width="22" height="30" stroke="var(--text)" strokeWidth="1.5" />
        <path d="M23 1l8 8H23V1z" stroke="var(--text)" strokeWidth="1.5" />
        <line x1="5" y1="14" x2="19" y2="14" stroke="var(--text)" />
        <line x1="5" y1="19" x2="19" y2="19" stroke="var(--text)" />
        <line x1="5" y1="24" x2="14" y2="24" stroke="var(--text)" />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
          marginBottom: 6,
        }}>
          NO FILE OPEN
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>
          Click a file in the left rail<br />to open it here.
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)' }}>
        ⌘P quick open
      </div>
    </div>
  );
}

export default function EditorTab({ file, onClose }) {
  const [findOpen, setFindOpen] = useState(false);
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [query] = useState('caret');
  const [panelOpen, setPanelOpen] = useState(!!(file?.errors?.length));
  const [ghost, setGhost] = useState(file?.ghost ?? false);
  const [ghostAccepted, setGhostAccepted] = useState(false);
  const [dirtyGuard, setDirtyGuard] = useState(null);

  useEffect(() => {
    setPanelOpen(!!(file?.errors?.length));
    setGhost(file?.ghost ?? false);
    setGhostAccepted(false);
    setDirtyGuard(null);
  }, [file]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); setFindOpen((o) => !o); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') { e.preventDefault(); setFindOpen(true); setReplaceOpen(true); }
      if (e.key === 'Escape') { setFindOpen(false); setReplaceOpen(false); setDirtyGuard(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!file) return <EmptyState />;

  const errors = file.errors ?? [];
  const hasErrors = errors.filter((e) => e.sev === 'err').length > 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* File tab bar */}
      <div style={{
        height: 26,
        flexShrink: 0,
        background: 'var(--chrome)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
      }}>
        <div style={{
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text)',
          background: 'var(--bg)',
          borderRight: '1px solid var(--border)',
          borderTop: hasErrors ? '1px solid var(--err)' : '1px solid var(--accent)',
          flex: 1,
          minWidth: 0,
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </span>
          {file.dirty && <span style={{ color: 'var(--warn)', fontSize: 8, flexShrink: 0 }}>●</span>}
          {hasErrors && (
            <span style={{
              color: 'var(--err)', fontSize: 8,
              padding: '0 3px', border: '1px solid var(--err)', flexShrink: 0,
            }}>
              ✗{errors.filter((e) => e.sev === 'err').length}
            </span>
          )}
          <span style={{ flex: 1 }} />
          <button
            onClick={() => file.dirty ? setDirtyGuard('closing') : onClose?.()}
            aria-label="Close file"
            style={{ all: 'unset', color: 'var(--text-dim)', fontSize: 10, cursor: 'pointer', flexShrink: 0 }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '0 8px', display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--border)' }}>
          <ToolBtn label="split" />
          <ToolBtn label="⤢" title="Pop out" />
        </div>
      </div>

      {/* Dirty guard */}
      {dirtyGuard === 'closing' && (
        <div style={{
          flexShrink: 0,
          background: 'var(--bg-raised)',
          borderBottom: '1px solid var(--border)',
          borderLeft: '2px solid var(--warn)',
        }}>
          <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusDot kind="warn" size={5} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>
                {file.name} has unsaved changes.
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                Save or discard before closing.
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: 6,
            padding: '6px 12px',
            background: 'var(--bg-sunken)',
            borderTop: '1px solid var(--border)',
          }}>
            <GuardBtn primary label="⇧⌘S  SAVE" onClick={() => { setDirtyGuard(null); onClose?.(); }} />
            <GuardBtn label="DISCARD" onClick={() => { setDirtyGuard(null); onClose?.(); }} />
            <GuardBtn label="KEEP OPEN" onClick={() => setDirtyGuard(null)} />
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', alignSelf: 'center' }}>esc</span>
          </div>
          <div style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1.45 }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 9, letterSpacing: '0.1em', marginBottom: 3 }}>UNSAVED DIFF</div>
            <div style={{ color: 'var(--ok)' }}>{"+ import { useBlink } from '../hooks/useBlink';"}</div>
            <div style={{ color: 'var(--err)', textDecoration: 'line-through', opacity: 0.7 }}>- const [caret, setCaret] = useState(true);</div>
            <div style={{ color: 'var(--ok)' }}>+ const caret = useBlink(true);</div>
          </div>
        </div>
      )}

      {/* Ghost suggestion banner */}
      {ghost && !ghostAccepted && (
        <div style={{
          flexShrink: 0,
          padding: '6px 12px',
          background: 'var(--accent-soft)',
          borderBottom: '1px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
        }}>
          <StatusDot kind="run" pulse size={5} />
          <span style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}>SPACEMAN</span>
          <span style={{ color: 'var(--text-muted)' }}>proposing · extract caret blink into useBlink</span>
          <span style={{ flex: 1 }} />
          <ToolBtn label="⇥ Accept" onClick={() => setGhostAccepted(true)} />
          <ToolBtn label="Esc" onClick={() => setGhost(false)} />
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{
        flexShrink: 0,
        padding: '3px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        color: 'var(--text-dim)',
        background: 'var(--bg-sunken)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span>{file.path}</span>
        <span style={{ color: 'var(--text-muted)' }}>{file.name}</span>
        <span style={{ flex: 1 }} />
        {file.git && (
          <span style={{ color: file.git === 'M' ? 'var(--warn)' : 'var(--ok)' }}>{file.git}</span>
        )}
        {file.branch && <span>{file.branch}</span>}
      </div>

      {/* Find / Replace */}
      {findOpen && (
        <div style={{
          flexShrink: 0,
          background: 'var(--bg-raised)',
          borderBottom: '1px solid var(--border)',
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              background: 'var(--bg-sunken)',
              border: '1px solid var(--accent)',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>⌘F</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>
                {query}
                <span style={{
                  display: 'inline-block',
                  width: 1.5, height: 12,
                  background: 'var(--text)',
                  verticalAlign: 'text-bottom',
                  marginLeft: 1,
                  animation: 'smCaret 1s step-end infinite',
                }} />
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)' }}>2/4</span>
            </div>
            <ToolBtn label="▲" />
            <ToolBtn label="▼" />
            <ToolBtn label="Aa" />
            <ToolBtn label=".*" />
            <ToolBtn label="⌘H" active={replaceOpen} onClick={() => setReplaceOpen((o) => !o)} />
            <ToolBtn label="×" onClick={() => { setFindOpen(false); setReplaceOpen(false); }} />
          </div>
          {replaceOpen && (
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                background: 'var(--bg-sunken)',
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>⌘H</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ok)' }}>blinkOn</span>
              </div>
              <ToolBtn accent label="↵ this" />
              <ToolBtn accent label="↵ all" />
            </div>
          )}
        </div>
      )}

      {/* Code area */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '8px 0' }}>
        <CodeArea
          file={file}
          ghost={ghost}
          ghostAccepted={ghostAccepted}
          query={findOpen ? query : null}
        />
      </div>

      {/* LSP error panel */}
      {errors.length > 0 && (
        <div style={{ flexShrink: 0, background: 'var(--bg-pane)', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            style={{
              all: 'unset', boxSizing: 'border-box', width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 10px',
              cursor: 'pointer',
              background: 'var(--chrome)',
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ color: 'var(--text-dim)' }}>{panelOpen ? '▾' : '▸'}</span>
            <span style={{ color: 'var(--err)' }}>
              ✗ {errors.filter((e) => e.sev === 'err').length} errors
            </span>
            {errors.filter((e) => e.sev === 'warn').length > 0 && (
              <>
                <span>·</span>
                <span style={{ color: 'var(--warn)' }}>
                  ▲ {errors.filter((e) => e.sev === 'warn').length} warnings
                </span>
              </>
            )}
            <span style={{ flex: 1 }} />
            <span style={{ color: 'var(--accent)', fontSize: 9 }}>✦ fix with spaceman</span>
          </button>
          {panelOpen && (
            <div style={{ maxHeight: 100, overflow: 'auto' }}>
              {errors.map((e, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '14px 1fr',
                  gap: 8,
                  padding: '5px 10px',
                  borderTop: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  cursor: 'pointer',
                }}>
                  <span style={{ color: e.sev === 'err' ? 'var(--err)' : 'var(--warn)' }}>
                    {e.sev === 'err' ? '✗' : '▲'}
                  </span>
                  <div>
                    <div style={{ color: 'var(--text)' }}>{e.msg}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 9 }}>
                      {file.name} · {e.code} · ln {e.line}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor footer */}
      <div style={{
        flexShrink: 0,
        height: 20,
        background: 'var(--chrome)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 10px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-dim)',
        letterSpacing: '0.04em',
      }}>
        <span>JSX · spaces 2</span>
        {file.dirty && (
          <>
            <span>·</span>
            <span style={{ color: 'var(--warn)' }}>◉ unsaved</span>
          </>
        )}
        <span style={{ flex: 1 }} />
        {ghost && !ghostAccepted && <span style={{ color: 'var(--accent)' }}>✦ spaceman proposing…</span>}
        {ghostAccepted && <span style={{ color: 'var(--ok)' }}>✓ edit accepted</span>}
        <span>⌘F find</span>
        <span>·</span>
        <span>⇧⌘S save</span>
      </div>
    </div>
  );
}
