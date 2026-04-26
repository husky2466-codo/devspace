import { useState } from 'react';

function getDefaultFolder() {
  try {
    return localStorage.getItem('ds.v3.defaultProjectsFolder') || '';
  } catch {
    return '';
  }
}

function Field({ label, value, onChange, placeholder, type = 'text', multiline }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      gap: 12,
      padding: '9px 0',
      borderBottom: '1px solid var(--border)',
      alignItems: multiline ? 'start' : 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-dim)',
        paddingTop: multiline ? 4 : 0,
      }}>
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          style={{
            all: 'unset',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text)',
            background: 'var(--bg-sunken)',
            border: '1px solid var(--border)',
            padding: '5px 8px',
            resize: 'none',
            lineHeight: 1.5,
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            all: 'unset',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text)',
            background: 'var(--bg-sunken)',
            border: '1px solid var(--border)',
            padding: '5px 8px',
          }}
        />
      )}
    </div>
  );
}

function PathField({ label, value, onChange, placeholder, onInspect }) {
  const handleBrowse = async () => {
    const defaultPath = value || getDefaultFolder() || undefined;
    const picked = await window.electronAPI?.browseFolder(defaultPath);
    if (!picked) return;
    onChange(picked);
    if (onInspect) {
      const info = await window.electronAPI?.inspectFolder(picked);
      if (info) onInspect(info);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
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
        {label}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
  );
}

function LocalForm({ fields, onChange }) {
  const handleInspect = (info) => {
    if (!fields.name) onChange('name', info.name);
    if (!fields.branch && info.branch) onChange('branch', info.branch);
  };
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <PathField label="Local path"    value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/Users/you/Projects/my-project" onInspect={handleInspect} />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main" />
      <Field     label="Description"   value={fields.desc}   onChange={(v) => onChange('desc', v)}   placeholder="What is this project?" multiline />
    </>
  );
}

function RemoteForm({ fields, onChange }) {
  const handleInspect = (info) => {
    if (!fields.name) onChange('name', info.name);
    if (!fields.branch && info.branch) onChange('branch', info.branch);
  };
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <Field     label="SSH host"      value={fields.host}   onChange={(v) => onChange('host', v)}   placeholder="user@host or alias from ~/.ssh/config" />
      <PathField label="Remote path"   value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/home/user/projects/my-project" onInspect={handleInspect} />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main" />
    </>
  );
}

function CloneLocalForm({ fields, onChange }) {
  const handleInspect = (info) => {
    if (!fields.name) onChange('name', info.name);
    if (!fields.branch && info.branch) onChange('branch', info.branch);
    if (!fields.url && info.remoteUrl) onChange('url', info.remoteUrl);
  };
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <Field     label="Git URL"       value={fields.url}    onChange={(v) => onChange('url', v)}    placeholder="git@github.com:org/repo.git" />
      <PathField label="Clone into"    value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/Users/you/Projects" onInspect={handleInspect} />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main (default)" />
    </>
  );
}

function CloneRemoteForm({ fields, onChange }) {
  const handleInspect = (info) => {
    if (!fields.name) onChange('name', info.name);
    if (!fields.branch && info.branch) onChange('branch', info.branch);
    if (!fields.url && info.remoteUrl) onChange('url', info.remoteUrl);
  };
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <Field     label="SSH host"      value={fields.host}   onChange={(v) => onChange('host', v)}   placeholder="user@host or alias from ~/.ssh/config" />
      <Field     label="Git URL"       value={fields.url}    onChange={(v) => onChange('url', v)}    placeholder="git@github.com:org/repo.git" />
      <PathField label="Remote path"   value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/home/user/projects" onInspect={handleInspect} />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main (default)" />
    </>
  );
}

const VARIANT_LABELS = {
  'local':        'Local',
  'remote':       'Remote',
  'clone-local':  'Clone → Local',
  'clone-remote': 'Clone → Remote',
};

const EMPTY_FIELDS = { name: '', path: '', branch: '', desc: '', host: '', url: '' };

export default function NewProjectForm({ variant, onCancel, onCreate }) {
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [dirty, setDirty] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const setField = (key, val) => {
    setFields((f) => ({ ...f, [key]: val }));
    setDirty(true);
  };

  const handleCancel = () => {
    if (dirty) { setConfirmDiscard(true); return; }
    onCancel();
  };

  const canCreate = fields.name.trim().length > 0 && fields.path.trim().length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate({
      id: fields.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: fields.name.trim(),
      branch: fields.branch.trim() || 'main',
      last: 'just now',
      activity: 'idle',
      dirty: false,
      files: [],
      _variant: variant,
      _fields: { ...fields },
    });
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      position: 'relative',
    }}>
      {/* Dirty banner */}
      {dirty && (
        <div style={{
          padding: '6px 16px',
          background: 'color-mix(in srgb, var(--warn) 8%, transparent)',
          borderBottom: '1px solid color-mix(in srgb, var(--warn) 30%, transparent)',
          borderLeft: '2px solid var(--warn)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--warn)',
          letterSpacing: '0.06em',
          flexShrink: 0,
        }}>
          Unsaved changes — click CANCEL to discard or CREATE PROJECT to save.
        </div>
      )}

      {/* Form header */}
      <div style={{
        padding: '18px 24px 12px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
          marginBottom: 6,
        }}>
          NEW PROJECT · {VARIANT_LABELS[variant] ?? variant.toUpperCase()}
        </div>
        <div style={{ fontSize: 18, color: 'var(--text)', fontWeight: 500 }}>
          {fields.name.trim() || 'Untitled Project'}
        </div>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px' }}>
        {variant === 'local'        && <LocalForm       fields={fields} onChange={setField} />}
        {variant === 'remote'       && <RemoteForm      fields={fields} onChange={setField} />}
        {variant === 'clone-local'  && <CloneLocalForm  fields={fields} onChange={setField} />}
        {variant === 'clone-remote' && <CloneRemoteForm fields={fields} onChange={setField} />}
      </div>

      {/* Action row */}
      <div style={{
        padding: '12px 24px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        flexShrink: 0,
        background: 'var(--chrome)',
      }}>
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          style={{
            all: 'unset',
            cursor: canCreate ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '6px 16px',
            background: canCreate ? 'var(--accent)' : 'var(--bg-sunken)',
            color: canCreate ? 'var(--bg)' : 'var(--text-dim)',
            letterSpacing: '0.08em',
          }}
        >
          CREATE PROJECT
        </button>
        <button
          onClick={handleCancel}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '6px 16px',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          CANCEL
        </button>
        {!canCreate && fields.name.trim().length === 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
            Name and path required
          </span>
        )}
      </div>

      {/* Discard confirm overlay */}
      {confirmDiscard && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            padding: '20px 24px',
            width: 320,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text)',
              marginBottom: 8,
            }}>
              Discard changes?
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              marginBottom: 16,
              lineHeight: 1.5,
            }}>
              Your new project form will be cleared.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onCancel}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  padding: '5px 14px',
                  background: 'var(--err)',
                  color: 'var(--bg)',
                }}
              >
                DISCARD
              </button>
              <button
                onClick={() => setConfirmDiscard(false)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  padding: '5px 14px',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                KEEP EDITING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
