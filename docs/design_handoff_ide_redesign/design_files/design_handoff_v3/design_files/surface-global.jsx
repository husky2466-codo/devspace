// SURFACE 2 — GLOBAL SPACEMAN TOGGLE
// ------------------------------------------------------------------
// PROJECT | GLOBAL segmented control in the drawer header.
// In GLOBAL mode:
//   - Dual-row header: project row is replaced by a GLOBAL row
//     showing scope (count of projects watched).
//   - Accent color shifts to --accent-global (cool tint per theme).
//   - CHAT becomes read-only dispatcher — can observe any project's
//     state + dispatch actions, but cannot itself write code.
//     Project chips sit above the input to scope responses.
//   - MEMORY aggregates across projects (each entry tagged with project).
//   - CHAIN tab is present but cross-project — dispatches to project
//     Spacemen rather than running steps directly.

function SurfaceGlobal({ tone }) {
  const [mode, setMode] = React.useState('global');
  return (
    <SurfaceFrame tone={tone}>
      <ArtCap>02 · GLOBAL SPACEMAN <span style={{ opacity: 0.6 }}>— cool accent · dispatcher · aggregated memory</span></ArtCap>
      <div style={{
        flex: 1, display: 'flex', paddingTop: 28, minHeight: 0,
      }}>
        {/* Two drawer comparisons side-by-side */}
        <div style={{ flex: 1, display: 'flex', gap: 16, padding: 16, minHeight: 0, background: 'var(--bg-sunken)' }}>
          <DrawerCard title="PROJECT MODE" sub="scoped to · forge">
            <GlobalDrawer mode="project" active="chat" />
          </DrawerCard>
          <DrawerCard title="GLOBAL MODE" sub="scope · 4 projects" globalTag>
            <GlobalDrawer mode="global" active="chat" />
          </DrawerCard>
        </div>
        {/* Third column: memory + chain in global mode */}
        <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 16px 0', minHeight: 0, background: 'var(--bg-sunken)' }}>
          <DrawerCard title="GLOBAL · MEMORY" sub="aggregated" globalTag compact>
            <GlobalDrawer mode="global" active="memory" slim />
          </DrawerCard>
          <DrawerCard title="GLOBAL · CHAIN" sub="cross-project dispatch" globalTag compact>
            <GlobalDrawer mode="global" active="chain" slim />
          </DrawerCard>
        </div>
      </div>
    </SurfaceFrame>
  );
}

function ArtCap({ children }) {
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

function DrawerCard({ title, sub, children, globalTag, compact }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column', minHeight: 0,
      background: 'var(--bg-pane)',
      border: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', flexShrink: 0,
        background: 'var(--bg-sunken)',
        borderBottom: '1px solid var(--border)',
      }}>
        <MonoLabel size={9} global={globalTag}>{title}</MonoLabel>
        <span style={{ flex: 1 }} />
        <MonoLabel size={9} dim>{sub}</MonoLabel>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

function GlobalDrawer({ mode, active, slim }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header: glyph + SPACEMAN + segmented toggle */}
      <div style={{
        padding: '8px 10px', flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        background: 'var(--chrome)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SpacemanMark size={18} mode={mode} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: mode === 'global' ? 'var(--accent-global)' : 'var(--text)',
            letterSpacing: '0.08em',
          }}>SPACEMAN</span>
          <SegControl mode={mode} />
          <span style={{ flex: 1 }} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: mode === 'global' ? 'var(--accent-global)' : 'var(--accent)',
            letterSpacing: '0.1em',
          }}>
            <StatusDot kind={mode === 'global' ? 'info' : 'run'} pulse size={5} />
            {mode === 'global' ? 'OBSERVING' : 'WATCHING'}
          </span>
        </div>
        {/* Dual-row header — second row differs by mode */}
        <div style={{
          marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 8px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderLeft: mode === 'global' ? '2px solid var(--accent-global)' : '2px solid var(--accent)',
          fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.04em',
        }}>
          {mode === 'project' ? (
            <>
              <StatusDot kind="run" pulse size={5} />
              <span style={{ color: 'var(--text)' }}>forge</span>
              <span style={{ color: 'var(--text-dim)' }}>·</span>
              <span style={{ color: 'var(--text-muted)' }}>main · 3↑ 1↓</span>
              <span style={{ flex: 1 }} />
              <span style={{ color: 'var(--text-dim)' }}>persona · senior engineer</span>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--accent-global)', letterSpacing: '0.14em' }}>GLOBAL</span>
              <span style={{ color: 'var(--text-dim)' }}>·</span>
              <span style={{ color: 'var(--text-muted)' }}>4 projects · read-only · dispatch-enabled</span>
              <span style={{ flex: 1 }} />
              <span style={{ color: 'var(--text-dim)' }}>sonnet · haiku router</span>
            </>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        letterSpacing: '0.08em', flexShrink: 0,
      }}>
        {['CHAT', 'BROWSER', 'EDITOR', 'CHAIN', 'MEMORY'].map(t => {
          const isActive = t.toLowerCase() === active;
          const disabled = mode === 'global' && (t === 'EDITOR' || t === 'BROWSER');
          const accentVar = mode === 'global' ? 'var(--accent-global)' : 'var(--accent)';
          return (
            <div key={t} style={{
              padding: '6px 9px',
              color: disabled ? 'var(--text-dim)'
                   : isActive ? (mode === 'global' ? 'var(--accent-global)' : 'var(--text)')
                   : 'var(--text-muted)',
              borderBottom: isActive ? `1px solid ${accentVar}` : '1px solid transparent',
              textDecoration: disabled ? 'line-through' : 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}>{t}</div>
          );
        })}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {active === 'chat' && <GlobalChat mode={mode} />}
        {active === 'memory' && <GlobalMemory mode={mode} slim={slim} />}
        {active === 'chain' && <GlobalChain mode={mode} slim={slim} />}
      </div>

      {/* Prompt strip */}
      {active === 'chat' && (
        <div style={{
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          background: 'var(--chrome)',
        }}>
          {mode === 'global' && <ProjectScopeChips />}
          <div style={{
            padding: '8px 10px',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 10,
          }}>
            <span style={{
              color: mode === 'global' ? 'var(--accent-global)' : 'var(--accent)',
              letterSpacing: '0.1em',
            }}>{mode === 'global' ? '✦ GLOBAL' : '✦ SPACEMAN'}</span>
            <span style={{ color: 'var(--text-dim)' }}>›</span>
            <span style={{ flex: 1, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: 11 }}>
              {mode === 'global' ? 'Dispatch or ask across all projects...' : 'Ask Spaceman to do something...'}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>⏎</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SegControl({ mode }) {
  const item = (label, active, isGlobal) => (
    <span style={{
      padding: '2px 7px',
      color: active ? (isGlobal ? 'var(--bg)' : 'var(--bg)') : 'var(--text-muted)',
      background: active ? (isGlobal ? 'var(--accent-global)' : 'var(--accent)') : 'transparent',
      letterSpacing: '0.1em',
    }}>{label}</span>
  );
  return (
    <div style={{
      display: 'inline-flex',
      border: `1px solid ${mode === 'global' ? 'var(--accent-global)' : 'var(--border)'}`,
      fontFamily: 'var(--font-mono)', fontSize: 9,
      letterSpacing: '0.1em',
      marginLeft: 6,
    }}>
      {item('PROJECT', mode === 'project', false)}
      {item('GLOBAL', mode === 'global', true)}
    </div>
  );
}

function ProjectScopeChips() {
  const projs = [
    { name: 'forge', on: true, act: 'run' },
    { name: 'archivist', on: true, act: 'idle' },
    { name: 'mindcraft', on: false, act: 'idle' },
    { name: 'routines', on: false, act: 'idle' },
  ];
  return (
    <div style={{
      padding: '6px 10px 2px',
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)', fontSize: 9,
      flexWrap: 'wrap',
    }}>
      <MonoLabel size={8.5} global>scope</MonoLabel>
      {projs.map(p => (
        <span key={p.name} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 6px',
          border: `1px solid ${p.on ? 'var(--accent-global)' : 'var(--border)'}`,
          background: p.on ? 'var(--accent-global-soft)' : 'transparent',
          color: p.on ? 'var(--accent-global)' : 'var(--text-dim)',
          letterSpacing: '0.08em',
        }}>
          <StatusDot kind={p.act === 'run' ? 'run' : 'idle'} size={4} pulse={p.act === 'run'} />
          {p.name}
        </span>
      ))}
      <span style={{ color: 'var(--text-dim)' }}>+2 more</span>
    </div>
  );
}

function GlobalChat({ mode }) {
  if (mode === 'project') {
    return (
      <div style={{ padding: 12, fontSize: 11, color: 'var(--text)', lineHeight: 1.5 }}>
        <MonoLabel size={9}>you · 2m ago</MonoLabel>
        <div style={{ marginTop: 4, marginBottom: 10 }}>Extract the caret blink into a shared hook.</div>
        <MonoLabel size={9} accent>spaceman · sonnet</MonoLabel>
        <div style={{ marginTop: 4 }}>Moved caret logic into <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>src/hooks/useBlink.js</span>. Terminal.jsx now imports it.</div>
        <div style={{
          marginTop: 8, padding: 8, borderLeft: '2px solid var(--accent)',
          background: 'var(--bg-sunken)',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
        }}>
          <div style={{ color: 'var(--text)' }}>◢ edit_file · src/hooks/useBlink.js</div>
          <div>+18  −0</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: 12, fontSize: 11, color: 'var(--text)', lineHeight: 1.5 }}>
      <MonoLabel size={9}>you · 1m ago</MonoLabel>
      <div style={{ marginTop: 4, marginBottom: 10 }}>Which projects have failing builds right now?</div>
      <MonoLabel size={9} global>global spaceman · sonnet</MonoLabel>
      <div style={{ marginTop: 4 }}>Two projects currently have non-zero exit codes:</div>
      <div style={{
        marginTop: 8, padding: 8, borderLeft: '2px solid var(--accent-global)',
        background: 'var(--accent-global-soft)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
      }}>
        <div style={{ color: 'var(--accent-global)' }}>◢ dispatch · read_build_status</div>
        <div style={{ marginTop: 3, color: 'var(--text)' }}>
          <span style={{ color: 'var(--err)' }}>✗ archivist</span>  tsc · 3 errors · feat/search
        </div>
        <div style={{ color: 'var(--text)' }}>
          <span style={{ color: 'var(--err)' }}>✗ mindcraft</span>  pytest · 1 failure · develop
        </div>
        <div style={{ marginTop: 4, color: 'var(--text-dim)' }}>2 projects · dispatched to their project-Spacemen</div>
      </div>
      <div style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: 11 }}>
        Switch into <span style={{ color: 'var(--accent-global)' }}>archivist</span> to let its Spaceman write a fix, or say <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>dispatch fix</span> to ask both to attempt patches.
      </div>
    </div>
  );
}

function GlobalMemory({ mode, slim }) {
  if (mode === 'project') {
    return <div style={{ padding: 10, fontSize: 10.5, color: 'var(--text-muted)' }}>Project-scoped decisions, patterns, corrections.</div>;
  }
  const mems = [
    { proj: 'forge',     tag: 'DECISION', text: 'Editor lives in drawer; terminals own the center grid.' },
    { proj: 'archivist', tag: 'PATTERN',  text: 'Search index rebuilt on every branch switch — cached under .cache/idx/' },
    { proj: 'mindcraft', tag: 'CORRECT',  text: 'Env var PROMPT_TEMPLATE must not be trimmed; breaks tests.' },
    { proj: 'routines',  tag: 'DECISION', text: 'Cron entries write-once from routines.yml — no drift.' },
    { proj: 'all',       tag: 'GLOBAL',   text: 'Use JetBrains Mono in all terminal cards across all projects.' },
  ];
  return (
    <div style={{ padding: slim ? 8 : 10 }}>
      {mems.map((m, i) => (
        <div key={i} style={{
          padding: slim ? '7px 0' : '9px 0',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <MonoLabel size={9} global={m.proj === 'all'}>{m.tag}</MonoLabel>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: m.proj === 'all' ? 'var(--accent-global)' : 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}>{m.proj}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text)', lineHeight: 1.4 }}>{m.text}</div>
        </div>
      ))}
    </div>
  );
}

function GlobalChain({ mode, slim }) {
  // Global chain = cross-project dispatch workflow
  const steps = [
    { n: 1, name: 'scan · all projects',        proj: 'global',    status: 'ok' },
    { n: 2, name: 'dispatch · archivist : tsc-fix', proj: 'archivist', status: 'run' },
    { n: 3, name: 'dispatch · mindcraft : pytest-fix', proj: 'mindcraft', status: 'idle' },
    { n: 4, name: 'verify · rerun builds',       proj: 'global',    status: 'idle' },
    { n: 5, name: 'summarize',                   proj: 'global',    status: 'idle' },
  ];
  return (
    <div style={{ padding: slim ? 8 : 12 }}>
      <MonoLabel size={9} global>cross-project · rebuild-green</MonoLabel>
      <div style={{ marginTop: 8 }}>
        {steps.map(s => (
          <div key={s.n} style={{
            display: 'grid',
            gridTemplateColumns: '16px 1fr 14px',
            gap: 8, padding: '6px 0',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: 10,
          }}>
            <span style={{ color: 'var(--text-dim)' }}>{String(s.n).padStart(2, '0')}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: s.status === 'idle' ? 'var(--text-muted)' : 'var(--text)' }}>{s.name}</div>
              <div style={{ color: s.proj === 'global' ? 'var(--accent-global)' : 'var(--text-dim)', fontSize: 9, letterSpacing: '0.1em', marginTop: 2 }}>
                {s.proj === 'global' ? '◉ GLOBAL' : `→ ${s.proj}`}
              </div>
            </div>
            <StatusDot kind={s.status === 'ok' ? 'ok' : s.status === 'run' ? 'run' : 'idle'} pulse={s.status === 'run'} size={5} />
          </div>
        ))}
      </div>
    </div>
  );
}

window.SurfaceGlobal = SurfaceGlobal;
