// SURFACE 4 — ORCHESTRATION IN THE CHAIN TAB + PER-PROJECT PERSONA
// ------------------------------------------------------------------
// Chains ARE the pipeline. When Spaceman receives a prompt, a chain
// is materialized in the CHAIN tab showing:
//   prompt → router → agent(s) → tool calls → terminals / files
// Each step is a real chain node with status, duration, and
// expandable detail (tool args, tokens, cost).
//
// Persona config: quick toggles live inline in the drawer (from a ⚙
// in the Spaceman header). Full config lives in Settings → Spaceman.

function SurfaceOrchestration({ tone }) {
  const [view, setView] = React.useState('chain'); // 'chain' | 'persona'
  return (
    <SurfaceFrame tone={tone}>
      <ArtCap4>04 · ORCHESTRATION <span style={{ opacity: 0.6 }}>— pipeline in CHAIN · persona in drawer + settings</span></ArtCap4>
      <div style={{ flex: 1, display: 'flex', paddingTop: 28, minHeight: 0, background: 'var(--bg-sunken)' }}>
        <div style={{ flex: 1, display: 'flex', gap: 12, padding: 12, minHeight: 0 }}>
          {/* Chain tab as the pipeline visualizer */}
          <div style={{
            flex: 1.4, minWidth: 0, display: 'flex', flexDirection: 'column',
            background: 'var(--bg-pane)', border: '1px solid var(--border)',
          }}>
            <SectionHeader label="CHAIN · prompt pipeline" sub="forge · sonnet router · 14:08:22" />
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              <PipelineChain />
            </div>
          </div>
          {/* Right column: persona quick config (drawer-local) */}
          <div style={{
            flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              background: 'var(--bg-pane)', border: '1px solid var(--border)',
              minHeight: 0,
            }}>
              <SectionHeader label="PERSONA · drawer-local ⚙" sub="forge" />
              <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                <PersonaQuickPanel />
              </div>
            </div>
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              background: 'var(--bg-pane)', border: '1px solid var(--border)',
              minHeight: 0,
            }}>
              <SectionHeader label="SETTINGS · spaceman" sub="full config" />
              <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                <PersonaSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SurfaceFrame>
  );
}

function ArtCap4({ children }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 26,
      padding: '6px 12px',
      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
      color: 'var(--text-dim)', background: 'var(--bg-sunken)',
      borderBottom: '1px solid var(--border)', zIndex: 2,
    }}>{children}</div>
  );
}

function SectionHeader({ label, sub }) {
  return (
    <div style={{
      padding: '8px 12px', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--bg-sunken)',
      borderBottom: '1px solid var(--border)',
    }}>
      <MonoLabel size={10}>{label}</MonoLabel>
      <span style={{ flex: 1 }} />
      <MonoLabel size={9} dim>{sub}</MonoLabel>
    </div>
  );
}

function PipelineChain() {
  const steps = [
    { kind: 'prompt',  label: 'prompt',   detail: '"extract caret blink into a shared hook"', status: 'ok',  dur: '—' },
    { kind: 'route',   label: 'router',   detail: 'intent · refactor · 0.91 · model: sonnet-4.5', status: 'ok', dur: '120ms' },
    { kind: 'plan',    label: 'plan',     detail: '4 steps · 2 agents · 1 tool', status: 'ok',  dur: '340ms' },
    { kind: 'agent',   label: 'agent · scout',   detail: 'grep caret usage · 3 files touched', status: 'ok',  dur: '1.2s', agent: 'scout' },
    { kind: 'agent',   label: 'agent · editor',  detail: 'writing src/hooks/useBlink.js + 2 imports', status: 'run', dur: '4.8s', agent: 'editor' },
    { kind: 'tool',    label: 'tool · edit_file', detail: 'src/hooks/useBlink.js · +18 −0', status: 'run', dur: '—' },
    { kind: 'terminal',label: 'terminal · agent-1', detail: 'pnpm lint · exit 0', status: 'idle', dur: '—' },
    { kind: 'verify',  label: 'verify',   detail: 'tests · pnpm test — pending', status: 'idle', dur: '—' },
  ];
  return (
    <div style={{ padding: 10 }}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <div key={i} style={{
            position: 'relative',
            display: 'grid', gridTemplateColumns: '28px 1fr',
            gap: 8, padding: '8px 6px',
          }}>
            {/* Rail line */}
            {!last && (
              <div style={{
                position: 'absolute', left: 18, top: 28, width: 1, bottom: -4,
                background: s.status === 'run' ? 'var(--running)' : 'var(--border)',
              }} />
            )}
            {/* Node */}
            <div style={{
              width: 20, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${s.status === 'run' ? 'var(--running)'
                                 : s.status === 'ok' ? 'var(--ok)'
                                 : 'var(--border)'}`,
              background: 'var(--bg)',
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: s.status === 'idle' ? 'var(--text-dim)' : 'var(--text)',
            }}>
              <NodeGlyph kind={s.kind} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10.5,
                  color: s.status === 'idle' ? 'var(--text-muted)' : 'var(--text)',
                  letterSpacing: '0.04em',
                }}>{s.label}</span>
                <span style={{ flex: 1 }} />
                <StatusDot kind={s.status === 'ok' ? 'ok' : s.status === 'run' ? 'run' : 'idle'} pulse={s.status === 'run'} size={5} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>{s.dur}</span>
              </div>
              <div style={{
                marginTop: 4,
                padding: '6px 8px',
                fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1.45,
                color: s.status === 'idle' ? 'var(--text-dim)' : 'var(--text-muted)',
                background: s.status === 'run' ? 'var(--accent-soft)' : 'var(--bg-sunken)',
                borderLeft: s.status === 'run'
                  ? '2px solid var(--accent)'
                  : s.status === 'ok' ? '2px solid var(--ok)'
                  : '2px solid var(--border)',
              }}>
                {s.detail}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{
        marginTop: 10, padding: '8px 10px',
        border: '1px dashed var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)',
        letterSpacing: '0.08em',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>TOTAL · 6.46s</span>
        <span>·</span>
        <span>4,280 tokens in / 1,117 out</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: 'var(--text-muted)' }}>⎘ copy trace · ⏏ abort</span>
      </div>
    </div>
  );
}

function NodeGlyph({ kind }) {
  const stroke = 'currentColor', s = 10;
  if (kind === 'prompt')   return <svg width={s} height={s} viewBox="0 0 10 10"><path d="M1 1h8v6H4l-2 2V7H1z" stroke={stroke} fill="none" /></svg>;
  if (kind === 'route')    return <svg width={s} height={s} viewBox="0 0 10 10"><path d="M1 2h3l2 3h3M1 8h3l2-3" stroke={stroke} fill="none" /></svg>;
  if (kind === 'plan')     return <svg width={s} height={s} viewBox="0 0 10 10"><path d="M2 2h6M2 5h6M2 8h4" stroke={stroke} fill="none" /></svg>;
  if (kind === 'agent')    return <svg width={s} height={s} viewBox="0 0 10 10"><circle cx="5" cy="4" r="2" stroke={stroke} fill="none" /><path d="M2 9c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" stroke={stroke} fill="none" /></svg>;
  if (kind === 'tool')     return <svg width={s} height={s} viewBox="0 0 10 10"><path d="M1 8l3-3 2 2 3-4" stroke={stroke} fill="none" /></svg>;
  if (kind === 'terminal') return <svg width={s} height={s} viewBox="0 0 10 10"><rect x="1" y="2" width="8" height="6" stroke={stroke} fill="none" /><path d="M3 4l1.5 1L3 6" stroke={stroke} fill="none" /></svg>;
  if (kind === 'verify')   return <svg width={s} height={s} viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke={stroke} fill="none" /></svg>;
  return null;
}

// ─── Persona quick panel (drawer-local) ──────────────────────────
function PersonaQuickPanel() {
  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-ui)', fontSize: 11.5, color: 'var(--text)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <SpacemanMark size={16} />
        <span style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text)' }}>Senior Engineer</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            PRESET · sonnet-4.5
          </div>
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          padding: '2px 6px', border: '1px solid var(--border)', letterSpacing: '0.08em',
        }}>⎘ change</span>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 10 }}>
        <MonoLabel size={9}>toggles</MonoLabel>
        {[
          { label: 'Auto-spawn terminals', on: true },
          { label: 'Propose before editing', on: true },
          { label: 'Run tests after edits',  on: false },
          { label: 'Use memory as context',  on: true },
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 0', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ flex: 1, color: 'var(--text)' }}>{t.label}</span>
            <MiniSwitch on={t.on} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <MonoLabel size={9}>tools · 6 enabled</MonoLabel>
        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {['edit', 'read', 'grep', 'bash', 'browse', 'spawn', 'git', 'test'].map(t => {
            const on = ['edit','read','grep','bash','spawn','git'].includes(t);
            return (
              <span key={t} style={{
                padding: '2px 7px',
                fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.04em',
                color: on ? 'var(--accent)' : 'var(--text-dim)',
                background: on ? 'var(--accent-soft)' : 'transparent',
                border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                textDecoration: on ? 'none' : 'line-through',
              }}>{t}</span>
            );
          })}
        </div>
      </div>
      <div style={{
        marginTop: 12, padding: '8px 10px',
        background: 'var(--bg-sunken)', border: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)',
        letterSpacing: '0.04em',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>Quick toggles only. Full config in</span>
        <span style={{ color: 'var(--accent)' }}>⌘, Settings · Spaceman</span>
      </div>
    </div>
  );
}

function MiniSwitch({ on }) {
  return (
    <span style={{
      display: 'inline-flex', width: 26, height: 14,
      background: on ? 'var(--accent)' : 'var(--bg-sunken)',
      border: '1px solid var(--border)',
      position: 'relative', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 1, left: on ? 13 : 1,
        width: 10, height: 10,
        background: on ? 'var(--bg)' : 'var(--text-muted)',
        transition: 'left 140ms ease',
      }} />
    </span>
  );
}

function PersonaSettings() {
  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-ui)', fontSize: 11.5 }}>
      {/* Per-project dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <MonoLabel size={9}>project</MonoLabel>
        <div style={{
          flex: 1,
          padding: '4px 8px',
          border: '1px solid var(--border)',
          background: 'var(--bg-sunken)',
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
          color: 'var(--text)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <StatusDot kind="run" pulse size={5} />
          <span>forge</span>
          <span style={{ flex: 1 }} />
          <span style={{ color: 'var(--text-dim)' }}>▾</span>
        </div>
      </div>
      {/* Fields */}
      <FormRow label="Preset" value="Senior Engineer ▾" />
      <FormRow label="Model"  value="sonnet-4.5 ▾" />
      <FormRow label="Router" value="haiku-4.5 · fast intent routing ▾" />
      <FormRow label="Context window" value="200k tokens" />
      <div style={{ marginTop: 12 }}>
        <MonoLabel size={9}>system prompt</MonoLabel>
        <div style={{
          marginTop: 6, padding: '8px 10px',
          background: 'var(--bg-sunken)', border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
          lineHeight: 1.5, whiteSpace: 'pre-wrap',
        }}>{'You are Spaceman for the `forge` project. Prefer small,\nreviewable diffs. Always run `pnpm lint` before proposing\na commit. Use JetBrains Mono in any code the user will read.'}</div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
        <span style={{
          padding: '4px 10px',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
          color: 'var(--bg)', background: 'var(--accent)',
        }}>SAVE</span>
        <span style={{
          padding: '4px 10px',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
          color: 'var(--text-muted)', border: '1px solid var(--border)',
        }}>RESET</span>
        <span style={{ flex: 1 }} />
        <span style={{
          padding: '4px 10px',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
          color: 'var(--text-dim)', border: '1px dashed var(--border)',
        }}>EXPORT .spaceman.yml</span>
      </div>
    </div>
  );
}

function FormRow({ label, value }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '110px 1fr',
      gap: 8, padding: '6px 0', alignItems: 'center',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

window.SurfaceOrchestration = SurfaceOrchestration;
