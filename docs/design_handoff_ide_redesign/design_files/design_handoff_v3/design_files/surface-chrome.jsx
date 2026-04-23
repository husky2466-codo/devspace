// SURFACE 3 — macOS NATIVE WINDOW CHROME INTEGRATION
// ------------------------------------------------------------------
// Native title bar (~28px) sits above the existing 38px top bar.
// Traffic lights stay where every Mac user expects them: top-left.
// Title bar center shows project name + branch (macOS document convention).
// Menu bar lives at OS level (rendered above the window for reference).

function SurfaceChrome({ tone }) {
  return (
    <SurfaceFrame tone={tone}>
      <ArtCap3>03 · macOS NATIVE CHROME <span style={{ opacity: 0.6 }}>— traffic lights top-left · document title · OS menu bar</span></ArtCap3>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        paddingTop: 28, minHeight: 0, background: 'var(--bg-sunken)',
      }}>
        {/* OS-level menu bar mock */}
        <OSMenuBar />
        {/* App window */}
        <div style={{
          flex: 1, margin: '12px 16px 16px',
          border: '1px solid var(--border-strong)',
          background: 'var(--bg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          display: 'flex', flexDirection: 'column', minHeight: 0,
          overflow: 'hidden',
        }}>
          <NativeTitleBar />
          <AppTopBar />
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <div style={{ width: 170, flexShrink: 0, background: 'var(--chrome)', borderRight: '1px solid var(--border)' }}>
              <MiniRail />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <MiniTerminalGrid cells={2} />
            </div>
            <div style={{ width: 220, flexShrink: 0, background: 'var(--bg-pane)', borderLeft: '1px solid var(--border)' }}>
              <DrawerStub />
            </div>
          </div>
          <div style={{
            height: 22, flexShrink: 0,
            background: 'var(--chrome)', borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
            fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            <StatusDot kind="ok" size={5} /> <span>main</span>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span>forge</span>
            <span style={{ flex: 1 }} />
            <StatusDot kind="run" pulse size={5} /> <span>DGX · 1 running</span>
          </div>
        </div>

        {/* Menu-item expansion panel */}
        <MenuItemsPanel />
      </div>
    </SurfaceFrame>
  );
}

function ArtCap3({ children }) {
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

function OSMenuBar() {
  const items = ['', 'Dev-Space', 'File', 'Edit', 'View', 'Session', 'Scripts', 'Window', 'Help'];
  return (
    <div style={{
      height: 22, flexShrink: 0,
      background: 'rgba(0,0,0,0.35)', // OS chrome, not themed
      color: '#ededef',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 10px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 12,
    }}>
      <span style={{ fontSize: 13 }}></span>
      {items.slice(1).map((m, i) => (
        <span key={i} style={{
          padding: '2px 6px', borderRadius: 3,
          fontWeight: m === 'Dev-Space' ? 600 : 400,
          background: m === 'View' ? 'rgba(100,140,200,0.55)' : 'transparent',
        }}>{m}</span>
      ))}
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 11, opacity: 0.75 }}>▲ ◔ ⌘  100%  Tue 10:42 AM</span>
    </div>
  );
}

function NativeTitleBar() {
  return (
    <div style={{
      height: 28, flexShrink: 0,
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 12px',
      position: 'relative',
    }}>
      <TrafficLights />
      {/* Title centered absolutely */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0,
        height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-ui)', fontSize: 12,
          color: 'var(--text)',
        }}>
          <span style={{ fontWeight: 500 }}>forge</span>
          <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.04em' }}>⎇ main</span>
          <StatusDot kind="warn" size={5} />
          <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em' }}>2 MODIFIED</span>
        </div>
      </div>
      <span style={{ flex: 1 }} />
      {/* Window-level accessory: fullscreen arrow stays native so nothing here */}
    </div>
  );
}

function AppTopBar() {
  // The existing 38px top bar — unchanged; just sits BELOW the native title bar now.
  return (
    <div style={{
      height: 34, flexShrink: 0,
      background: 'var(--chrome)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch',
    }}>
      <div style={{ width: 170, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', borderRight: '1px solid var(--border)' }}>
        <SpacemanMark size={15} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text)' }}>
          Dev-Space<span style={{ color: 'var(--text-dim)' }}>.ai</span>
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
        <div style={{
          padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text)',
          background: 'var(--bg)', borderRight: '1px solid var(--border)',
          borderTop: '1px solid var(--accent)',
        }}><StatusDot kind="run" pulse size={5} /> forge <span style={{ color: 'var(--warn)', fontSize: 8 }}>●</span></div>
        <div style={{
          padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)',
          borderRight: '1px solid var(--border)',
        }}><StatusDot kind="idle" size={5} /> archivist</div>
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
          padding: '2px 6px', border: '1px solid var(--border)', letterSpacing: '0.08em',
        }}>⌘K</span>
      </div>
    </div>
  );
}

function DrawerStub() {
  return (
    <div style={{ padding: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <SpacemanMark size={14} />
        <span style={{ color: 'var(--text)', letterSpacing: '0.08em' }}>SPACEMAN</span>
      </div>
      <MonoLabel size={9}>chat</MonoLabel>
      <div style={{ marginTop: 4, fontSize: 10.5, color: 'var(--text)', lineHeight: 1.4 }}>
        Watching Terminal.jsx. Ready when you are.
      </div>
    </div>
  );
}

// Expanded "View" menu — shows the menu items we've specced.
function MenuItemsPanel() {
  const col = (title, items) => (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'var(--bg-pane)',
      border: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
    }}>
      <div style={{
        padding: '6px 10px',
        background: 'var(--bg-sunken)',
        borderBottom: '1px solid var(--border)',
        color: 'var(--text)', letterSpacing: '0.14em',
      }}>{title}</div>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', gap: 8, padding: '4px 10px',
          borderBottom: it.sep ? '1px solid var(--border)' : 'none',
          color: it.dim ? 'var(--text-dim)' : 'var(--text)',
        }}>
          <span style={{ flex: 1 }}>{it.label}</span>
          <span style={{ color: 'var(--text-dim)' }}>{it.kbd || ''}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '0 16px 16px',
      flexShrink: 0,
    }}>
      {col('VIEW', [
        { label: 'Theme — Terminal', kbd: '⌃1' },
        { label: 'Theme — Graphite', kbd: '⌃2' },
        { label: 'Theme — Paper', kbd: '⌃3', sep: true },
        { label: 'Toggle Left Rail', kbd: '⌘B' },
        { label: 'Toggle Right Drawer', kbd: '⌘J' },
        { label: 'Toggle Bottom Terminal', kbd: '⌘`', sep: true },
        { label: 'Zoom In', kbd: '⌘=' },
        { label: 'Zoom Out', kbd: '⌘−' },
        { label: 'Actual Size', kbd: '⌘0' },
      ])}
      {col('SESSION', [
        { label: 'New Terminal', kbd: '⌘T' },
        { label: 'Close Terminal', kbd: '⌘W' },
        { label: 'Next Terminal', kbd: '⌘]' },
        { label: 'Prev Terminal', kbd: '⌘[', sep: true },
        { label: 'Split Right', kbd: '⌘D', dim: true },
        { label: 'Split Down', kbd: '⇧⌘D', dim: true },
        { label: 'Rename…', kbd: 'F2' },
      ])}
      {col('SCRIPTS', [
        { label: 'Run Script…', kbd: '⌘R' },
        { label: 'Run Last', kbd: '⇧⌘R', sep: true },
        { label: 'Saved Scripts', dim: true },
        { label: '  build-all', kbd: '' },
        { label: '  deploy-preview', kbd: '' },
        { label: '  reset-db', kbd: '', sep: true },
        { label: 'Edit Scripts…', kbd: '' },
      ])}
      {col('WINDOW', [
        { label: 'Minimize', kbd: '⌘M' },
        { label: 'Zoom', kbd: '' },
        { label: 'Fullscreen', kbd: '⌃⌘F', sep: true },
        { label: 'Bring All to Front', kbd: '' },
        { label: 'Project Switcher…', kbd: '⌃⌘P', sep: true },
        { label: '✓ forge' },
        { label: '  archivist' },
        { label: '  mindcraft' },
      ])}
    </div>
  );
}

window.SurfaceChrome = SurfaceChrome;
