import SubTabBar from './SubTabBar.jsx';
import TerminalGrid from './TerminalGrid.jsx';

export default function Workspace({
  terminals,
  activeTermId,
  finishedIds,
  onSelectTerm,
  onCloseTerm,
  onSpawnTerm,
  onAcknowledge,
}) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <SubTabBar
        terminals={terminals}
        activeId={activeTermId}
        onSelect={onSelectTerm}
        onClose={onCloseTerm}
        onSpawn={onSpawnTerm}
      />
      <TerminalGrid
        terminals={terminals}
        activeId={activeTermId}
        finishedIds={finishedIds}
        onSelect={onSelectTerm}
        onAcknowledge={onAcknowledge}
      />
    </div>
  );
}
