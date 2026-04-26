import { useState, useCallback, useEffect } from 'react';

const SECTIONS = ['Appearance', 'Editor', 'Spaceman', 'Compute', 'Integrations', 'Advanced'];

const THEMES = [
  { id: 'terminal',  name: 'Terminal',  tagline: 'dark · green accent' },
  { id: 'graphite',  name: 'Graphite',  tagline: 'dark · blue accent' },
  { id: 'paper',     name: 'Paper',     tagline: 'light · navy accent' },
];

const SPACEMAN_FIELDS = [
  ['Preset',          'Senior Engineer'],
  ['Model',           'claude-sonnet-4-6'],
  ['Router',          'claude-haiku-4-5'],
  ['Context window',  '200k tokens'],
];

function AppearanceSection({ activeThemeId, onThemeChange }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-dim)',
        letterSpacing: '0.14em',
        marginBottom: 16,
      }}>
        THEME
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {THEMES.map((t) => (
          <div
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            style={{
              flex: 1,
              padding: 14,
              cursor: 'pointer',
              border: `1px solid ${activeThemeId === t.id ? 'var(--accent)' : 'var(--border)'}`,
              background: 'var(--bg)',
            }}
          >
            <div style={{
              height: 24,
              marginBottom: 8,
              background: 'var(--accent)',
              opacity: 0.3,
            }} />
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text)',
              marginBottom: 3,
            }}>
              {t.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
            }}>
              {t.tagline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApiKeyRow() {
  const [status, setStatus] = useState(null); // null=loading, true=has key, false=no key
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    window.spaceman?.getKeyStatus().then(({ hasKey }) => setStatus(hasKey));
  }, []);

  const handleSave = async () => {
    if (!val.startsWith('sk-ant-')) { setErr('Must start with sk-ant-'); return; }
    setSaving(true); setErr(null);
    try {
      await window.spaceman.setKey(val.trim());
      setStatus(true); setEditing(false); setVal('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await window.spaceman.deleteKey();
      setStatus(false); setVal('');
    } catch {}
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '130px 1fr',
      gap: 8,
      padding: '9px 0',
      borderBottom: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
    }}>
      <span style={{ color: 'var(--text-dim)', alignSelf: 'center' }}>API key</span>
      <div>
        {status === null && (
          <span style={{ color: 'var(--text-dim)' }}>checking...</span>
        )}
        {status === true && !editing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: 'var(--ok)', letterSpacing: '0.06em' }}>● STORED</span>
            <button onClick={() => setEditing(true)} style={{
              all: 'unset', cursor: 'pointer', fontSize: 10,
              color: 'var(--text-dim)', border: '1px solid var(--border)', padding: '2px 8px',
            }}>replace</button>
            <button onClick={handleDelete} style={{
              all: 'unset', cursor: 'pointer', fontSize: 10,
              color: 'var(--err)', border: '1px solid color-mix(in srgb, var(--err) 40%, var(--border))', padding: '2px 8px',
            }}>remove</button>
          </div>
        )}
        {(status === false || editing) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="password"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="sk-ant-..."
                style={{
                  all: 'unset', flex: 1,
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text)', background: 'var(--bg-sunken)',
                  border: '1px solid var(--border)', padding: '4px 8px',
                }}
              />
              <button onClick={handleSave} disabled={saving || !val} style={{
                all: 'unset', cursor: saving || !val ? 'default' : 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
                background: saving || !val ? 'var(--bg-sunken)' : 'var(--accent)',
                color: saving || !val ? 'var(--text-dim)' : 'var(--bg)',
                letterSpacing: '0.06em',
              }}>
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
              {editing && (
                <button onClick={() => { setEditing(false); setVal(''); setErr(null); }} style={{
                  all: 'unset', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  fontSize: 10, padding: '4px 8px', border: '1px solid var(--border)',
                  color: 'var(--text-dim)',
                }}>cancel</button>
              )}
            </div>
            {err && <span style={{ color: 'var(--err)', fontSize: 10 }}>{err}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function SpacemanSection({ projects, activeProjectId, onProjectChange }) {
  return (
    <div>
      <ApiKeyRow />

      {/* Per-project selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
        }}>
          SPACEMAN ·
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onProjectChange(p.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                padding: '3px 9px',
                border: `1px solid ${activeProjectId === p.id ? 'var(--accent)' : 'var(--border)'}`,
                background: activeProjectId === p.id ? 'var(--accent-soft)' : 'transparent',
                color: activeProjectId === p.id ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Field rows */}
      {SPACEMAN_FIELDS.map(([key, val]) => (
        <div
          key={key}
          style={{
            display: 'grid',
            gridTemplateColumns: '130px 1fr',
            gap: 8,
            padding: '9px 0',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
          }}
        >
          <span style={{ color: 'var(--text-dim)' }}>{key}</span>
          <span style={{ color: 'var(--text)' }}>{val} ▾</span>
        </div>
      ))}

      {/* System prompt */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '130px 1fr',
        gap: 8,
        padding: '9px 0',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
      }}>
        <span style={{ color: 'var(--text-dim)', paddingTop: 2 }}>System prompt</span>
        <div style={{
          minHeight: 60,
          background: 'var(--bg-sunken)',
          border: '1px solid var(--border)',
          padding: '6px 8px',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>
          You are a senior engineer working in the {activeProjectId} project. Be concise and precise.
        </div>
      </div>

      {/* Action row */}
      <div style={{
        display: 'flex',
        gap: 8,
        paddingTop: 14,
        alignItems: 'center',
      }}>
        <button style={{
          all: 'unset',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          padding: '5px 14px',
          background: 'var(--accent)',
          color: 'var(--bg)',
        }}>
          SAVE
        </button>
        <button style={{
          all: 'unset',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          padding: '5px 14px',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}>
          RESET
        </button>
        <button style={{
          all: 'unset',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          padding: '5px 14px',
          border: '1px dashed var(--border)',
          color: 'var(--text-dim)',
        }}>
          EXPORT .spaceman.yml
        </button>
      </div>
    </div>
  );
}

const KEYBINDINGS = [
  { action: 'Open settings',         keys: '⌘ ,' },
  { action: 'Spawn terminal',        keys: '⌘ T' },
  { action: 'Close terminal',        keys: '⌘ W' },
  { action: 'Next terminal',         keys: '⌘ ]' },
  { action: 'Previous terminal',     keys: '⌘ [' },
  { action: 'Toggle left rail',      keys: '⌘ \\' },
  { action: 'Toggle Spaceman drawer',keys: '⌘ /' },
  { action: 'Find in file',          keys: '⌘ F' },
  { action: 'Find and replace',      keys: '⌘ H' },
  { action: 'Accept ghost edit',     keys: 'Tab' },
  { action: 'Focus prompt strip',    keys: '⌘ L' },
  { action: 'Switch to CHAT tab',    keys: '⌘ 1' },
  { action: 'Switch to EDITOR tab',  keys: '⌘ 2' },
  { action: 'Switch to CHAIN tab',   keys: '⌘ 3' },
];

function KeybindingsSection() {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-dim)',
        letterSpacing: '0.14em',
        marginBottom: 16,
      }}>
        KEYBOARD SHORTCUTS
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        marginBottom: 12,
        lineHeight: 1.5,
      }}>
        Keybindings are view-only in v1. Custom bindings coming soon.
      </div>
      {KEYBINDINGS.map(({ action, keys }) => (
        <div key={action} style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          padding: '7px 0',
          borderBottom: '1px solid var(--border)',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{action}</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text)',
            background: 'var(--bg-sunken)',
            border: '1px solid var(--border)',
            padding: '2px 7px',
            letterSpacing: '0.04em',
          }}>
            {keys}
          </span>
        </div>
      ))}
    </div>
  );
}

const SEED_COMPUTE_HOSTS = [
  { id: 'local',   name: 'Local (this machine)', kind: 'local',  status: 'ok',  cpu: 34, mem: 61 },
  { id: 'dgx1',    name: 'DGX Spark',            kind: 'remote', status: 'ok',  cpu: 12, mem: 44 },
  { id: 'bspark2', name: 'bspark2',              kind: 'remote', status: 'idle',cpu: 0,  mem: 18 },
];

function ComputeSection() {
  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
        }}>
          REMOTE HOSTS
        </div>
        <button style={{
          all: 'unset',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          padding: '3px 10px',
          border: '1px dashed var(--border)',
          color: 'var(--text-dim)',
        }}>
          + add host
        </button>
      </div>
      {SEED_COMPUTE_HOSTS.map((h) => {
        const statusColor = h.status === 'ok' ? 'var(--ok)' : 'var(--text-dim)';
        return (
          <div key={h.id} style={{
            display: 'grid',
            gridTemplateColumns: '10px 1fr auto',
            gap: 10,
            padding: '10px 0',
            borderBottom: '1px solid var(--border)',
            alignItems: 'center',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', marginBottom: 2 }}>
                {h.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                {h.kind} · CPU {h.cpu}% · MEM {h.mem}%
              </div>
            </div>
            <button style={{
              all: 'unset',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-dim)',
              border: '1px solid var(--border)',
              padding: '3px 8px',
            }}>
              edit
            </button>
          </div>
        );
      })}
      <div style={{
        marginTop: 16,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        lineHeight: 1.5,
      }}>
        Remote hosts are used as clone and compute targets in the new-project flow and by Spaceman when dispatching tasks.
      </div>
    </div>
  );
}

function PlaceholderSection({ name }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-dim)',
      letterSpacing: '0.14em',
      padding: '24px 0',
    }}>
      {name.toUpperCase()} · coming soon
    </div>
  );
}

function AdvancedSection() {
  const [defaultFolder, setDefaultFolder] = useState(() => {
    try { return localStorage.getItem('ds.v3.defaultProjectsFolder') || ''; } catch { return ''; }
  });
  const [saved, setSaved] = useState(false);

  const handleBrowse = useCallback(async () => {
    const picked = await window.electronAPI?.browseFolder(defaultFolder || undefined);
    if (picked) {
      setDefaultFolder(picked);
      setSaved(false);
    }
  }, [defaultFolder]);

  const handleSave = () => {
    try {
      localStorage.setItem('ds.v3.defaultProjectsFolder', defaultFolder);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const handleClear = () => {
    setDefaultFolder('');
    try { localStorage.removeItem('ds.v3.defaultProjectsFolder'); } catch {}
    setSaved(false);
  };

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-dim)',
        letterSpacing: '0.14em',
        marginBottom: 20,
      }}>
        ADVANCED
      </div>

      {/* Default projects folder */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: 12,
        padding: '9px 0',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
        }}>
          Default projects folder
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            value={defaultFolder}
            onChange={(e) => { setDefaultFolder(e.target.value); setSaved(false); }}
            placeholder="/Users/you/Projects"
            style={{
              all: 'unset',
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text)',
              background: 'var(--bg-sunken)',
              border: '1px solid var(--border)',
              padding: '5px 8px',
            }}
          />
          <button
            type="button"
            onClick={handleBrowse}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              padding: '5px 10px',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              background: 'var(--chrome)',
              letterSpacing: '0.06em',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            BROWSE
          </button>
        </div>
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        marginTop: 8,
        marginBottom: 20,
        lineHeight: 1.5,
      }}>
        The folder browser opens here by default when adding a new project.
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={handleSave}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '5px 14px',
            background: saved ? 'var(--ok)' : 'var(--accent)',
            color: 'var(--bg)',
            letterSpacing: '0.06em',
          }}
        >
          {saved ? 'SAVED' : 'SAVE'}
        </button>
        {defaultFolder && (
          <button
            onClick={handleClear}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '5px 14px',
              border: '1px solid var(--border)',
              color: 'var(--text-dim)',
              letterSpacing: '0.06em',
            }}
          >
            CLEAR
          </button>
        )}
      </div>
    </div>
  );
}

export default function SettingsModal({ open, onClose, activeThemeId, onThemeChange, projects, activeProjectId, defaultSection }) {
  const [section, setSection] = useState(defaultSection ?? 'appearance');
  const [spacemanProjectId, setSpacemanProjectId] = useState(activeProjectId ?? projects?.[0]?.id ?? 'forge');

  // Update section when defaultSection changes (e.g. opened from Compute popover)
  if (open && defaultSection && section !== defaultSection) setSection(defaultSection);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 700,
          height: 520,
          background: 'var(--bg-raised)',
          border: '1px solid var(--border-strong, var(--border))',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Left nav */}
        <div style={{
          width: 180,
          flexShrink: 0,
          background: 'var(--chrome)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            letterSpacing: '0.14em',
          }}>
            SETTINGS
          </div>
          {SECTIONS.map((s) => {
            const id = s.toLowerCase();
            const active = section === id;
            return (
              <div
                key={s}
                onClick={() => setSection(id)}
                style={{
                  padding: '9px 16px',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                }}
              >
                {s}
              </div>
            );
          })}
        </div>

        {/* Content pane */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {section === 'appearance'  && <AppearanceSection activeThemeId={activeThemeId} onThemeChange={onThemeChange} />}
          {section === 'spaceman'    && <SpacemanSection projects={projects ?? []} activeProjectId={spacemanProjectId} onProjectChange={setSpacemanProjectId} />}
          {section === 'editor'      && <KeybindingsSection />}
          {section === 'compute'     && <ComputeSection />}
          {section === 'integrations'&& <PlaceholderSection name="integrations" />}
          {section === 'advanced'    && <AdvancedSection />}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            all: 'unset',
            position: 'absolute',
            top: 12,
            right: 14,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
