import { useState } from 'react';

const SECTIONS = ['Appearance', 'Editor', 'Spaceman', 'Compute', 'Integrations', 'Advanced'];

const THEMES = [
  { id: 'terminal',  name: 'Terminal',  tagline: 'dark · green accent' },
  { id: 'graphite',  name: 'Graphite',  tagline: 'dark · blue accent' },
  { id: 'paper',     name: 'Paper',     tagline: 'light · navy accent' },
];

const SPACEMAN_FIELDS = [
  ['Preset',          'Senior Engineer'],
  ['Model',           'claude-sonnet-4-5'],
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

function SpacemanSection({ projects, activeProjectId, onProjectChange }) {
  return (
    <div>
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

export default function SettingsModal({ open, onClose, activeThemeId, onThemeChange, projects, activeProjectId }) {
  const [section, setSection] = useState('appearance');
  const [spacemanProjectId, setSpacemanProjectId] = useState(activeProjectId ?? projects?.[0]?.id ?? 'forge');

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
          {section === 'appearance' && (
            <AppearanceSection activeThemeId={activeThemeId} onThemeChange={onThemeChange} />
          )}
          {section === 'spaceman' && (
            <SpacemanSection
              projects={projects ?? []}
              activeProjectId={spacemanProjectId}
              onProjectChange={setSpacemanProjectId}
            />
          )}
          {!['appearance', 'spaceman'].includes(section) && (
            <PlaceholderSection name={section} />
          )}
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
