import { useEffect, useRef } from 'react';

const SEED_HOSTS = [
  { id: 'local',  name: 'Local (this machine)', kind: 'local',  status: 'ok',  jobs: 2, cpu: 34, mem: 61 },
  { id: 'dgx1',   name: 'DGX Spark',            kind: 'remote', status: 'ok',  jobs: 1, cpu: 12, mem: 44 },
  { id: 'bspark2',name: 'bspark2',              kind: 'remote', status: 'idle',jobs: 0, cpu: 0,  mem: 18 },
];

function Bar({ pct, color }) {
  return (
    <div style={{ height: 3, background: 'var(--border)', flex: 1 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color }} />
    </div>
  );
}

function HostRow({ host }) {
  const statusColor = host.status === 'ok' ? 'var(--ok)' : host.status === 'err' ? 'var(--err)' : 'var(--text-dim)';

  return (
    <div style={{
      padding: '8px 12px',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)', flex: 1 }}>
          {host.name}
        </span>
        {host.jobs > 0 && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '1px 5px',
            letterSpacing: '0.06em',
          }}>
            {host.jobs} JOB{host.jobs !== 1 ? 'S' : ''}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', width: 28 }}>
          CPU
        </span>
        <Bar pct={host.cpu} color="var(--accent)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', width: 28, textAlign: 'right' }}>
          {host.cpu}%
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', width: 28 }}>
          MEM
        </span>
        <Bar pct={host.mem} color="var(--running, var(--accent))" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', width: 28, textAlign: 'right' }}>
          {host.mem}%
        </span>
      </div>
    </div>
  );
}

export default function ComputePopover({ onClose, onOpenSettings }) {
  const ref = useRef(null);

  useEffect(() => {
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 28,
        right: 140,
        zIndex: 100,
        width: 280,
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-strong, var(--border))',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: '0.14em',
        }}>
          COMPUTE
        </span>
        <button
          onClick={() => { onClose(); onOpenSettings('compute'); }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            color: 'var(--accent)',
          }}
        >
          manage ›
        </button>
      </div>

      {SEED_HOSTS.map((h) => <HostRow key={h.id} host={h} />)}

      <div style={{
        padding: '7px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        color: 'var(--text-dim)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>3 hosts · 3 active jobs</span>
        <button
          onClick={() => { onClose(); onOpenSettings('compute'); }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
          }}
        >
          + add host
        </button>
      </div>
    </div>
  );
}
