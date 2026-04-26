import { useState } from 'react';

function getDefaultFolder() {
  try {
    return localStorage.getItem('ds.v3.defaultProjectsFolder') || '';
  } catch {
    return '';
  }
}

// ── Shared field components ───────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = 'text', multiline, readOnly }) {
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
          readOnly={readOnly}
          rows={2}
          style={{
            all: 'unset',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: readOnly ? 'var(--text-muted)' : 'var(--text)',
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
          readOnly={readOnly}
          style={{
            all: 'unset',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: readOnly ? 'var(--text-muted)' : 'var(--text)',
            background: readOnly ? 'transparent' : 'var(--bg-sunken)',
            border: readOnly ? 'none' : '1px solid var(--border)',
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

// ── Detected info badge ───────────────────────────────────────────────────────

function DetectedBadge({ isGit, branch, remoteUrl }) {
  if (!isGit) return null;
  return (
    <div style={{
      margin: '10px 0 2px',
      padding: '8px 10px',
      background: 'color-mix(in srgb, var(--ok) 8%, transparent)',
      border: '1px solid color-mix(in srgb, var(--ok) 25%, transparent)',
      borderLeft: '2px solid var(--ok)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      lineHeight: 1.7,
    }}>
      <span style={{ color: 'var(--ok)', marginRight: 6 }}>git</span>
      {branch && <span>branch: <span style={{ color: 'var(--text)' }}>{branch}</span></span>}
      {branch && remoteUrl && <span style={{ margin: '0 8px', color: 'var(--border)' }}>·</span>}
      {remoteUrl && <span>origin: <span style={{ color: 'var(--text)' }}>{remoteUrl}</span></span>}
    </div>
  );
}

// ── Import forms (existing repos) ─────────────────────────────────────────────

function ImportLocalForm({ fields, onChange, detected, onInspect }) {
  return (
    <>
      <PathField
        label="Folder path"
        value={fields.path}
        onChange={(v) => onChange('path', v)}
        placeholder="/Users/you/Projects/my-project"
        onInspect={onInspect}
      />
      <DetectedBadge isGit={detected.isGit} branch={detected.branch} remoteUrl={detected.remoteUrl} />
      <Field
        label="Display name"
        value={fields.name}
        onChange={(v) => onChange('name', v)}
        placeholder="my-project"
      />
    </>
  );
}

function ImportRemoteForm({ fields, onChange, detected, onInspect }) {
  return (
    <>
      <Field label="SSH host" value={fields.host} onChange={(v) => onChange('host', v)} placeholder="user@host or alias from ~/.ssh/config" />
      <PathField
        label="Remote path"
        value={fields.path}
        onChange={(v) => onChange('path', v)}
        placeholder="/home/user/projects/my-project"
        onInspect={onInspect}
      />
      <DetectedBadge isGit={detected.isGit} branch={detected.branch} remoteUrl={detected.remoteUrl} />
      <Field
        label="Display name"
        value={fields.name}
        onChange={(v) => onChange('name', v)}
        placeholder="my-project"
      />
    </>
  );
}

// ── Create forms (new projects) ───────────────────────────────────────────────

function CreateLocalForm({ fields, onChange }) {
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <PathField label="Local path"    value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/Users/you/Projects/my-project" />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main" />
      <Field     label="Description"   value={fields.desc}   onChange={(v) => onChange('desc', v)}   placeholder="What is this project?" multiline />
    </>
  );
}

function CreateRemoteForm({ fields, onChange }) {
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <Field     label="SSH host"      value={fields.host}   onChange={(v) => onChange('host', v)}   placeholder="user@host or alias from ~/.ssh/config" />
      <PathField label="Remote path"   value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/home/user/projects/my-project" />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main" />
    </>
  );
}

function CloneLocalForm({ fields, onChange }) {
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <Field     label="Git URL"       value={fields.url}    onChange={(v) => onChange('url', v)}    placeholder="git@github.com:org/repo.git" />
      <PathField label="Clone into"    value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/Users/you/Projects" />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main (default)" />
    </>
  );
}

function CloneRemoteForm({ fields, onChange }) {
  return (
    <>
      <Field     label="Project name"  value={fields.name}   onChange={(v) => onChange('name', v)}   placeholder="my-project" />
      <Field     label="SSH host"      value={fields.host}   onChange={(v) => onChange('host', v)}   placeholder="user@host or alias from ~/.ssh/config" />
      <Field     label="Git URL"       value={fields.url}    onChange={(v) => onChange('url', v)}    placeholder="git@github.com:org/repo.git" />
      <PathField label="Remote path"   value={fields.path}   onChange={(v) => onChange('path', v)}   placeholder="/home/user/projects" />
      <Field     label="Branch"        value={fields.branch} onChange={(v) => onChange('branch', v)} placeholder="main (default)" />
    </>
  );
}

// ── Variant metadata ──────────────────────────────────────────────────────────

const VARIANT_META = {
  'import-local':  { label: 'Import · Local',          action: 'IMPORT PROJECT', isImport: true },
  'import-remote': { label: 'Import · Remote',         action: 'IMPORT PROJECT', isImport: true },
  'create-local':  { label: 'Create · Local',          action: 'CREATE PROJECT', isImport: false },
  'create-remote': { label: 'Create · Remote',         action: 'CREATE PROJECT', isImport: false },
  'clone-local':   { label: 'Create · Clone → Local',  action: 'CREATE PROJECT', isImport: false },
  'clone-remote':  { label: 'Create · Clone → Remote', action: 'CREATE PROJECT', isImport: false },
  // legacy ids (from old picker) — map to create variants
  'local':         { label: 'Create · Local',          action: 'CREATE PROJECT', isImport: false },
  'remote':        { label: 'Create · Remote',         action: 'CREATE PROJECT', isImport: false },
};

const EMPTY_FIELDS = { name: '', path: '', branch: '', desc: '', host: '', url: '', remoteUrl: '' };

// ── Main component ────────────────────────────────────────────────────────────

export default function NewProjectForm({ variant, onCancel, onCreate }) {
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [detected, setDetected] = useState({ isGit: false, branch: '', remoteUrl: '' });
  const [dirty, setDirty] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const meta = VARIANT_META[variant] ?? { label: variant, action: 'CREATE PROJECT', isImport: false };

  const onChange = (key, val) => {
    setFields((f) => ({ ...f, [key]: val }));
    if (key === 'branch' || key === 'remoteUrl') {
      setDetected((d) => ({ ...d, [key]: val, isGit: true }));
    }
    setDirty(true);
  };

  // Called by import forms after inspectFolder returns
  const onInspectResult = (info) => {
    setDetected({ isGit: info.isGit, branch: info.branch, remoteUrl: info.remoteUrl });
    setFields((f) => ({
      ...f,
      name:      f.name      || info.name,
      branch:    f.branch    || info.branch,
      remoteUrl: f.remoteUrl || info.remoteUrl,
    }));
    setDirty(true);
  };

  // Proxy onChange that also triggers inspect result for import forms
  const handleFieldChange = (key, val) => onChange(key, val);

  const handleCancel = () => {
    if (dirty) { setConfirmDiscard(true); return; }
    onCancel();
  };

  const isImport = meta.isImport;
  const canSubmit = isImport
    ? fields.path.trim().length > 0
    : fields.name.trim().length > 0 && fields.path.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const name = fields.name.trim() || detected.branch || fields.path.split('/').filter(Boolean).pop() || 'project';

    const result = await window.electronAPI?.createProject({ variant, fields, detected });

    if (result && !result.ok) {
      setSubmitError(result.error || 'Failed to create project');
      setSubmitting(false);
      return;
    }

    // For clone-local, update path to the actual cloned directory
    const finalPath = result?.clonedPath || fields.path;

    onCreate({
      id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name,
      branch: fields.branch.trim() || detected.branch || 'main',
      last: 'just now',
      activity: 'idle',
      dirty: false,
      files: [],
      _variant: variant,
      _fields: { ...fields, path: finalPath },
      _detected: { ...detected },
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
          Unsaved changes — click CANCEL to discard or {meta.action} to save.
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
          {meta.label.toUpperCase()}
        </div>
        <div style={{ fontSize: 18, color: 'var(--text)', fontWeight: 500 }}>
          {fields.name.trim() || (isImport ? 'Select a folder' : 'Untitled Project')}
        </div>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px' }}>
        {variant === 'import-local'  && <ImportLocalForm  fields={fields} onChange={handleFieldChange} detected={detected} onInspect={onInspectResult} />}
        {variant === 'import-remote' && <ImportRemoteForm fields={fields} onChange={handleFieldChange} detected={detected} onInspect={onInspectResult} />}
        {(variant === 'create-local'  || variant === 'local')   && <CreateLocalForm  fields={fields} onChange={handleFieldChange} />}
        {(variant === 'create-remote' || variant === 'remote')  && <CreateRemoteForm fields={fields} onChange={handleFieldChange} />}
        {variant === 'clone-local'   && <CloneLocalForm   fields={fields} onChange={handleFieldChange} />}
        {variant === 'clone-remote'  && <CloneRemoteForm  fields={fields} onChange={handleFieldChange} />}
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
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          style={{
            all: 'unset',
            cursor: (canSubmit && !submitting) ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '6px 16px',
            background: (canSubmit && !submitting) ? 'var(--accent)' : 'var(--bg-sunken)',
            color: (canSubmit && !submitting) ? 'var(--bg)' : 'var(--text-dim)',
            letterSpacing: '0.08em',
          }}
        >
          {submitting
            ? (variant === 'clone-local' || variant === 'clone-remote' ? 'CLONING...' : meta.action + '...')
            : meta.action}
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
        {!canSubmit && !submitting && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
            {isImport ? 'Select a folder to continue' : 'Name and path required'}
          </span>
        )}
        {submitError && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--err)',
            padding: '4px 0',
            flex: 1,
          }}>
            {submitError}
          </div>
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
