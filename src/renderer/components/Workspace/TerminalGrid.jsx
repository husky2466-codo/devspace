import TerminalCard from './TerminalCard.jsx';

function colCount(n) {
  if (n <= 1) return 1;
  if (n <= 4) return 2;
  return 3;
}

function EmptyState() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      gap: 12,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: '0.2em',
      }}>
        NO TERMINALS
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        color: 'var(--text-dim)',
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 1.5,
      }}>
        Spawn a terminal or ask Spaceman to start a task. The workspace tiles agents side-by-side.
      </div>
    </div>
  );
}

export default function TerminalGrid({ terminals, activeId, finishedIds, onSelect, onAcknowledge }) {
  if (terminals.length === 0) return <EmptyState />;

  const cols = colCount(terminals.length);

  return (
    <div style={{
      flex: 1,
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 6,
      padding: 6,
      background: 'var(--bg-sunken)',
      minHeight: 0,
    }}>
      {terminals.map((t) => (
        <TerminalCard
          key={t.id}
          term={t}
          active={t.id === activeId}
          finished={finishedIds.has(t.id)}
          onClick={() => {
            onSelect(t.id);
            if (finishedIds.has(t.id)) onAcknowledge(t.id);
          }}
        />
      ))}
    </div>
  );
}
