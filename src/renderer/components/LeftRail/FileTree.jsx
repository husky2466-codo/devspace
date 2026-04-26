import { useState } from 'react';

function FileNode({ node, depth, onFileOpen }) {
  const [open, setOpen] = useState(node.open ?? depth < 2);
  const isDir = !!node.children;
  const paddingLeft = 10 + depth * 12;

  const handleClick = () => {
    if (isDir) setOpen((o) => !o);
    else onFileOpen?.(node);
  };

  const gitColor = {
    M: 'var(--warn)',
    A: 'var(--ok)',
    D: 'var(--err)',
    '?': 'var(--text-dim)',
  }[node.git] ?? 'var(--text-dim)';

  return (
    <>
      <button
        onClick={handleClick}
        aria-expanded={isDir ? open : undefined}
        style={{
          all: 'unset', boxSizing: 'border-box', width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          paddingTop: 2,
          paddingBottom: 2,
          paddingRight: 8,
          paddingLeft,
          fontFamily: 'var(--font-mono)',
          fontSize: 11.5,
          color: node.active ? 'var(--text)' : 'var(--text-muted)',
          background: node.active ? 'var(--accent-soft)' : 'transparent',
          borderLeft: node.active ? '2px solid var(--accent)' : '2px solid transparent',
          cursor: 'pointer',
          lineHeight: 1.5,
        }}
      >
        {isDir ? (
          <span style={{ width: 10, color: 'var(--text-dim)', fontSize: 9 }}>
            {open ? '▾' : '▸'}
          </span>
        ) : (
          <span style={{ width: 10, color: 'var(--text-dim)', fontSize: 9 }}>·</span>
        )}
        <span style={{
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: node.active ? 'var(--text)' : (isDir ? 'var(--text)' : 'var(--text-muted)'),
        }}>
          {node.name}
        </span>
        {node.git && (
          <span style={{ fontSize: 9, color: gitColor }}>{node.git}</span>
        )}
      </button>
      {isDir && open && (
        <FileTree files={node.children} depth={depth + 1} onFileOpen={onFileOpen} />
      )}
    </>
  );
}

export default function FileTree({ files, depth = 0, onFileOpen }) {
  return (
    <>
      {files.map((f, i) => (
        <FileNode key={f.name} node={f} depth={depth} onFileOpen={onFileOpen} />
      ))}
    </>
  );
}
