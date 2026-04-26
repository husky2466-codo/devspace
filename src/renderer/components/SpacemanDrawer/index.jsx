import { useRef } from 'react';
import ResizeHandle from '../primitives/ResizeHandle.jsx';
import DrawerHeader from './DrawerHeader.jsx';
import DrawerTabBar from './DrawerTabBar.jsx';
import ChatTab from './ChatTab.jsx';
import BrowserTab from './BrowserTab.jsx';
import EditorTab from './EditorTab.jsx';
import ChainTab from './ChainTab.jsx';
import MemoryTab from './MemoryTab.jsx';
import PromptStrip from './PromptStrip.jsx';

export default function SpacemanDrawer({
  width,
  onResize,
  spaceman,
  onTabChange,
  mode,
  onModeChange,
  editorFile,
  onCloseEditor,
  projectName,
  branch,
  onOpenSettings,
}) {
  const tab = spaceman?.tab ?? 'chat';
  // ChatTab registers its sendMessage here; PromptStrip calls it
  const promptActionRef = useRef(null);

  const handlePromptSubmit = (text) => {
    if (promptActionRef.current) {
      promptActionRef.current(text);
    }
  };

  return (
    <div style={{
      width,
      flexShrink: 0,
      background: 'var(--bg-pane)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <ResizeHandle side="left" onResize={onResize} min={200} max={900} />

      <DrawerHeader
        mode={mode}
        onToggleMode={onModeChange}
        projectName={projectName}
        branch={branch}
        onOpenSettings={onOpenSettings}
      />

      <DrawerTabBar
        activeTab={tab}
        onSelectTab={onTabChange}
        mode={mode}
        drawerWidth={width}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'chat'    && (
          <ChatTab
            mode={mode}
            projectName={projectName}
            branch={branch}
            onPromptRef={promptActionRef}
          />
        )}
        {tab === 'browser' && mode === 'project' && <BrowserTab items={spaceman?.browser?.items ?? []} />}
        {tab === 'editor'  && <EditorTab  file={editorFile} onClose={onCloseEditor} />}
        {tab === 'chain'   && <ChainTab   chain={spaceman?.chain} mode={mode} />}
        {tab === 'memory'  && <MemoryTab  mems={spaceman?.memory} mode={mode} />}
      </div>

      {(tab === 'chat' || tab === 'editor') && (
        <PromptStrip
          mode={mode}
          activeTab={tab}
          onSubmit={handlePromptSubmit}
        />
      )}
    </div>
  );
}
