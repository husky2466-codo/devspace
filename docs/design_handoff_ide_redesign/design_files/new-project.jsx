// New Project flow — picker + takeover forms
// Exposes: NewProjectPicker, NewProjectForm, useDirtyState
// All components read CSS vars from tokens.jsx — theme-agnostic.

// ---------- small UI primitives ----------
function NPField({ label, hint, children, required }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6,
      }}>
        <label style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
          color: 'var(--text)', letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>{label}</label>
        {required && <span style={{ color: 'var(--accent)', fontSize: 10 }}>*</span>}
        {hint && <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
          color: 'var(--text-dim)', letterSpacing: '0.02em', textTransform: 'none',
        }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function NPInput({ value, onChange, placeholder, mono, prefix, suffix }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      border: '1px solid var(--border)',
      background: 'var(--bg-sunken)',
    }}>
      {prefix && (
        <span style={{
          padding: '8px 10px',
          fontFamily: 'var(--font-mono)', fontSize: 11.5,
          color: 'var(--text-dim)',
          borderRight: '1px solid var(--border)',
          background: 'var(--chrome)',
          whiteSpace: 'nowrap',
        }}>{prefix}</span>
      )}
      <input
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{
          all: 'unset', flex: 1,
          padding: '8px 12px',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
          fontSize: mono ? 12 : 13,
          color: 'var(--text)',
          minWidth: 0,
        }}
      />
      {suffix && (
        <span style={{
          padding: '8px 10px',
          fontFamily: 'var(--font-mono)', fontSize: 11.5,
          color: 'var(--text-dim)',
          borderLeft: '1px solid var(--border)',
          background: 'var(--chrome)',
        }}>{suffix}</span>
      )}
    </div>
  );
}

function NPSelect({ value, onChange, options, placeholder }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      background: 'var(--bg-sunken)',
      position: 'relative',
    }}>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          all: 'unset', display: 'block', width: '100%',
          padding: '8px 12px', paddingRight: 30,
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: value ? 'var(--text)' : 'var(--text-muted)',
          cursor: 'pointer',
        }}
      >
        {placeholder && <option value="" style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}>{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: 'var(--bg-raised)', color: 'var(--text)' }}>
            {o.label}
          </option>
        ))}
      </select>
      <span style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-dim)', fontSize: 10, pointerEvents: 'none',
      }}>▾</span>
    </div>
  );
}

function NPRadioGroup({ value, onChange, options }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <div key={o.value} onClick={() => onChange(o.value)} style={{
            padding: '10px 12px',
            border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
            background: active ? 'var(--accent-soft)' : 'var(--bg-sunken)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 12, height: 12, borderRadius: 999,
              border: `1px solid ${active ? 'var(--accent)' : 'var(--border-strong)'}`,
              background: active ? 'var(--accent)' : 'transparent',
              flexShrink: 0,
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{o.label}</div>
              {o.hint && <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10.5,
                color: 'var(--text-dim)', marginTop: 2,
              }}>{o.hint}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- picker (small floating menu from + NEW) ----------
function NewProjectPicker({ open, anchorRect, onPick, onClose }) {
  if (!open || !anchorRect) return null;
  const options = [
    { id: 'local',         label: 'Local project',         hint: 'blank workspace on this machine',     icon: '▤' },
    { id: 'remote',        label: 'Remote project',        hint: 'blank workspace over SSH',            icon: '◉' },
    { id: 'repo-local',    label: 'Clone repo → Local',    hint: 'git clone on this machine',           icon: '⇣' },
    { id: 'repo-remote',   label: 'Clone repo → Remote',   hint: 'git clone on an SSH host',            icon: '⇅' },
  ];
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 90,
      }} />
      <div style={{
        position: 'fixed', zIndex: 91,
        top: anchorRect.bottom + 4, left: anchorRect.left,
        width: 320,
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-strong)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-dim)', letterSpacing: '0.16em',
        }}>NEW PROJECT</div>
        {options.map(o => (
          <div key={o.id} onClick={() => { onPick(o.id); onClose(); }} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{
              width: 22, textAlign: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 14,
              color: 'var(--accent)',
            }}>{o.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{o.label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10.5,
                color: 'var(--text-dim)', marginTop: 1,
              }}>{o.hint}</div>
            </div>
            <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>↵</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- takeover form (replaces center pane) ----------
function NewProjectForm({ kind, onSave, onDiscard }) {
  // default state per kind
  const defaults = React.useMemo(() => {
    if (kind === 'local') {
      return { name: '', path: '~/projects/', template: 'empty', startup: '' };
    }
    if (kind === 'remote') {
      return { name: '', host: '', user: '', port: '22', keyPath: '~/.ssh/id_ed25519', workdir: '~/', startup: '' };
    }
    if (kind === 'repo-local') {
      return { name: '', repoUrl: '', branch: '', path: '~/projects/', shallow: false, submodules: false, auth: 'github-app', startup: '' };
    }
    return { name: '', repoUrl: '', branch: '', host: '', user: '', port: '22', keyPath: '~/.ssh/id_ed25519', path: '~/', shallow: false, submodules: false, auth: 'github-app', startup: '' };
  }, [kind]);

  const [form, setForm] = React.useState(defaults);
  const [leaveIntent, setLeaveIntent] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);

  // dirty check
  const dirty = React.useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(defaults);
  }, [form, defaults]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const tryDiscard = () => {
    if (dirty) { setShowBanner(true); return; }
    onDiscard();
  };

  const headerTitle = {
    'local':       'New local project',
    'remote':      'New remote project',
    'repo-local':  'Clone repo · Local',
    'repo-remote': 'Clone repo · Remote',
  }[kind];

  const kindChip = {
    'local':       { label: 'LOCAL', icon: '▤' },
    'remote':      { label: 'REMOTE', icon: '◉' },
    'repo-local':  { label: 'REPO → LOCAL', icon: '⇣' },
    'repo-remote': { label: 'REPO → REMOTE', icon: '⇅' },
  }[kind];

  return (
    <div style={{
      flex: 1, minWidth: 0, minHeight: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
    }}>
      {/* HEADER — either Save/Discard pair, or the red dirty-exit banner */}
      {showBanner ? (
        <div style={{
          padding: '10px 16px',
          background: 'var(--err-bg, rgba(220, 80, 60, 0.12))',
          borderBottom: '1px solid var(--err, #E06666)',
          display: 'flex', alignItems: 'center', gap: 14,
          flexShrink: 0,
        }}>
          <div style={{
            width: 20, height: 20, flexShrink: 0,
            border: '1px solid var(--err, #E06666)',
            color: 'var(--err, #E06666)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
          }}>!</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: 'var(--err, #E06666)', letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}>UNSAVED CHANGES</div>
            <div style={{
              fontSize: 12.5, color: 'var(--text)', marginTop: 2,
            }}>You'll lose your config for this new {kindChip.label.toLowerCase()} project if you leave now.</div>
          </div>
          <button onClick={() => setShowBanner(false)} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text)',
            padding: '6px 12px',
            border: '1px solid var(--border-strong)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Stay</button>
          <button onClick={() => { setShowBanner(false); onDiscard(); }} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: '#fff',
            padding: '6px 12px',
            background: 'var(--err, #E06666)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Discard & leave</button>
        </div>
      ) : (
        <div style={{
          padding: '10px 16px',
          background: 'var(--chrome)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 14,
          flexShrink: 0,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--accent)', letterSpacing: '0.14em',
            padding: '3px 7px',
            border: '1px solid var(--accent)',
            background: 'var(--accent-soft)',
          }}>
            <span>{kindChip.icon}</span>
            <span>{kindChip.label}</span>
          </span>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 14,
            color: 'var(--text)', letterSpacing: '-0.01em',
          }}>{headerTitle}</div>
          {dirty && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--warn)', letterSpacing: '0.12em',
            }}>● UNSAVED</span>
          )}
          <span style={{ flex: 1 }} />
          <button onClick={tryDiscard} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-muted)',
            padding: '6px 12px',
            border: '1px solid var(--border)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Discard</button>
          <button
            disabled={!dirty || !form.name}
            onClick={() => onSave({ kind, ...form })}
            style={{
              all: 'unset', cursor: (!dirty || !form.name) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: (!dirty || !form.name) ? 'var(--text-dim)' : 'var(--bg)',
              padding: '6px 14px',
              background: (!dirty || !form.name) ? 'var(--bg-sunken)' : 'var(--accent)',
              border: `1px solid ${(!dirty || !form.name) ? 'var(--border)' : 'var(--accent)'}`,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >Save project</button>
        </div>
      )}

      {/* BODY — scrolls independently */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: 'auto',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 720, padding: '32px 40px 80px' }}>
          {kind === 'local' && <LocalForm form={form} set={set} />}
          {kind === 'remote' && <RemoteForm form={form} set={set} />}
          {kind === 'repo-local' && <RepoLocalForm form={form} set={set} />}
          {kind === 'repo-remote' && <RepoRemoteForm form={form} set={set} />}
        </div>
      </div>
    </div>
  );
}

// ---------- per-kind bodies ----------
function LocalForm({ form, set }) {
  return (
    <>
      <FormIntro
        heading="Create a local project"
        sub="A folder on this machine. Terminals, files, and Spaceman runs locally against it."
      />
      <NPField label="Name" required hint="shown in the project rail & tabs">
        <NPInput value={form.name} onChange={v => set('name', v)} placeholder="forge, archivist, …" />
      </NPField>
      <NPField label="Location" required hint="parent directory — the project folder is created here">
        <NPInput value={form.path} onChange={v => set('path', v)} mono prefix="◎" suffix="browse…" />
      </NPField>
      <NPField label="Starter">
        <NPRadioGroup
          value={form.template}
          onChange={v => set('template', v)}
          options={[
            { value: 'empty',   label: 'Empty',       hint: 'just the folder' },
            { value: 'node',    label: 'Node + pnpm', hint: 'package.json, .gitignore' },
            { value: 'python',  label: 'Python',      hint: 'pyproject.toml, venv/' },
            { value: 'clone',   label: 'From clipboard URL', hint: 'detects git repo on paste' },
          ]}
        />
      </NPField>
      <NPField label="Startup command" hint="runs once on open — optional">
        <NPInput value={form.startup} onChange={v => set('startup', v)} mono placeholder="e.g. pnpm dev" />
      </NPField>
    </>
  );
}

function RemoteForm({ form, set }) {
  // SSH hosts are managed in Settings → Compute. Here we either pick from that list,
  // or enter ad-hoc values. We show both to make the relationship legible.
  const hosts = [
    { value: '', label: '— new connection —' },
    { value: 'dgx.local',     label: 'dgx.local · dgx@dgx.local:22' },
    { value: 'lambda-a100',   label: 'lambda-a100 · ubuntu@10.12.4.1:22' },
    { value: 'runpod-staging',label: 'runpod-staging · root@pod-xxx.runpod.io:2222' },
  ];
  return (
    <>
      <FormIntro
        heading="Create a remote project"
        sub={<>Opens a workspace over SSH. Manage saved hosts in <span style={{ color: 'var(--text)' }}>Settings › Compute</span>.</>}
      />
      <NPField label="Name" required>
        <NPInput value={form.name} onChange={v => set('name', v)} placeholder="dgx-finetune" />
      </NPField>
      <NPField label="Saved host" hint="or enter details below">
        <NPSelect
          value={form.host}
          onChange={v => {
            // prefill when picking a known host
            const preset = {
              'dgx.local':        { host: 'dgx.local', user: 'dgx', port: '22' },
              'lambda-a100':      { host: 'lambda-a100.int', user: 'ubuntu', port: '22' },
              'runpod-staging':   { host: 'pod-xxx.runpod.io', user: 'root', port: '2222' },
            }[v];
            if (preset) { Object.entries(preset).forEach(([k, val]) => set(k, val)); }
            else set('host', v);
          }}
          options={hosts}
          placeholder="— new connection —"
        />
      </NPField>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px', gap: 12 }}>
        <NPField label="Host" required>
          <NPInput value={form.host} onChange={v => set('host', v)} mono placeholder="dgx.local or 10.0.0.12" />
        </NPField>
        <NPField label="User">
          <NPInput value={form.user} onChange={v => set('user', v)} mono placeholder="ubuntu" />
        </NPField>
        <NPField label="Port">
          <NPInput value={form.port} onChange={v => set('port', v)} mono placeholder="22" />
        </NPField>
      </div>

      <NPField label="SSH key" hint="path to private key">
        <NPInput value={form.keyPath} onChange={v => set('keyPath', v)} mono prefix="🔑" suffix="browse…" />
      </NPField>
      <NPField label="Working directory" hint="cd here on connect">
        <NPInput value={form.workdir} onChange={v => set('workdir', v)} mono placeholder="~/projects/my-app" />
      </NPField>
      <NPField label="Startup command" hint="runs once on connect — optional">
        <NPInput value={form.startup} onChange={v => set('startup', v)} mono placeholder="e.g. tmux attach -t dev || tmux new -s dev" />
      </NPField>

      <div style={{
        marginTop: 24, padding: 14,
        border: '1px dashed var(--border-strong)',
        background: 'var(--bg-sunken)',
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)',
        lineHeight: 1.55,
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>CONNECTION TEST</div>
        ssh {form.user || 'user'}@{form.host || 'host'} -p {form.port || '22'} -i {form.keyPath || '~/.ssh/key'}
        <div style={{ marginTop: 6, color: 'var(--text-dim)' }}>
          ◇ will run on save · latency, auth method and server fingerprint shown after connect
        </div>
      </div>
    </>
  );
}

function RepoLocalForm({ form, set }) {
  return (
    <>
      <FormIntro
        heading="Clone a repo locally"
        sub="Git URL plus a destination on this machine."
      />
      <NPField label="Repo URL" required>
        <NPInput value={form.repoUrl} onChange={v => set('repoUrl', v)} mono placeholder="https://github.com/you/app.git" />
      </NPField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <NPField label="Name" required>
          <NPInput value={form.name} onChange={v => set('name', v)} placeholder="auto from repo" />
        </NPField>
        <NPField label="Branch" hint="default if blank">
          <NPInput value={form.branch} onChange={v => set('branch', v)} mono placeholder="main" />
        </NPField>
      </div>
      <NPField label="Clone into" required>
        <NPInput value={form.path} onChange={v => set('path', v)} mono prefix="◎" suffix="browse…" />
      </NPField>
      <NPField label="Auth">
        <NPRadioGroup
          value={form.auth}
          onChange={v => set('auth', v)}
          options={[
            { value: 'github-app',  label: 'GitHub App',       hint: 'token from linked account' },
            { value: 'ssh-agent',   label: 'SSH agent',        hint: 'uses loaded keys' },
            { value: 'token',       label: 'Personal token',   hint: 'from Settings › Integrations' },
            { value: 'public',      label: 'Public / no auth', hint: 'anonymous clone' },
          ]}
        />
      </NPField>
      <NPField label="Clone options">
        <NPToggles
          values={{ shallow: form.shallow, submodules: form.submodules }}
          onChange={(k, v) => set(k, v)}
          items={[
            { key: 'shallow',    label: 'Shallow clone (--depth=1)' },
            { key: 'submodules', label: 'Recurse submodules' },
          ]}
        />
      </NPField>
      <NPField label="Startup command" hint="runs after clone — optional">
        <NPInput value={form.startup} onChange={v => set('startup', v)} mono placeholder="e.g. pnpm i && pnpm dev" />
      </NPField>
    </>
  );
}

function RepoRemoteForm({ form, set }) {
  return (
    <>
      <FormIntro
        heading="Clone a repo on a remote host"
        sub="Runs the clone over SSH on the chosen host."
      />
      <NPField label="Repo URL" required>
        <NPInput value={form.repoUrl} onChange={v => set('repoUrl', v)} mono placeholder="git@github.com:you/app.git" />
      </NPField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <NPField label="Name" required>
          <NPInput value={form.name} onChange={v => set('name', v)} placeholder="auto from repo" />
        </NPField>
        <NPField label="Branch" hint="default if blank">
          <NPInput value={form.branch} onChange={v => set('branch', v)} mono placeholder="main" />
        </NPField>
      </div>

      <div style={{
        padding: 12, marginBottom: 18,
        border: '1px solid var(--border)',
        background: 'var(--bg-sunken)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-dim)', letterSpacing: '0.14em',
          marginBottom: 8,
        }}>SSH TARGET</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px', gap: 10, marginBottom: 10 }}>
          <NPInput value={form.host} onChange={v => set('host', v)} mono placeholder="host" />
          <NPInput value={form.user} onChange={v => set('user', v)} mono placeholder="user" />
          <NPInput value={form.port} onChange={v => set('port', v)} mono placeholder="22" />
        </div>
        <NPInput value={form.keyPath} onChange={v => set('keyPath', v)} mono prefix="🔑" />
      </div>

      <NPField label="Clone into (remote path)" required>
        <NPInput value={form.path} onChange={v => set('path', v)} mono prefix="◎" placeholder="~/projects/" />
      </NPField>
      <NPField label="Auth (on remote)">
        <NPRadioGroup
          value={form.auth}
          onChange={v => set('auth', v)}
          options={[
            { value: 'agent-forward', label: 'Forward SSH agent', hint: 'use your local keys' },
            { value: 'remote-keys',   label: 'Remote host keys',  hint: 'key lives on the box' },
            { value: 'token',         label: 'Personal token',    hint: 'passed via env' },
            { value: 'public',        label: 'Public / no auth',  hint: 'anonymous clone' },
          ]}
        />
      </NPField>
      <NPField label="Clone options">
        <NPToggles
          values={{ shallow: form.shallow, submodules: form.submodules }}
          onChange={(k, v) => set(k, v)}
          items={[
            { key: 'shallow',    label: 'Shallow clone (--depth=1)' },
            { key: 'submodules', label: 'Recurse submodules' },
          ]}
        />
      </NPField>
      <NPField label="Startup command" hint="runs on remote after clone — optional">
        <NPInput value={form.startup} onChange={v => set('startup', v)} mono placeholder="e.g. pnpm i" />
      </NPField>
    </>
  );
}

function FormIntro({ heading, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 22, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4,
        fontFamily: 'var(--font-ui)',
      }}>{heading}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

function NPToggles({ items, values, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map(it => {
        const on = !!values[it.key];
        return (
          <div key={it.key} onClick={() => onChange(it.key, !on)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px',
            border: '1px solid var(--border)',
            background: on ? 'var(--accent-soft)' : 'var(--bg-sunken)',
            cursor: 'pointer',
          }}>
            <span style={{
              width: 14, height: 14,
              border: `1px solid ${on ? 'var(--accent)' : 'var(--border-strong)'}`,
              background: on ? 'var(--accent)' : 'transparent',
              color: on ? 'var(--bg)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}>✓</span>
            <span style={{ fontSize: 12.5, color: 'var(--text)' }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { NewProjectPicker, NewProjectForm });
