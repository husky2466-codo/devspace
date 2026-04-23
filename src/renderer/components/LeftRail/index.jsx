import ResizeHandle from '../primitives/ResizeHandle.jsx';
import RailHeader from './RailHeader.jsx';
import ProjectRow from './ProjectRow.jsx';
import FileTree from './FileTree.jsx';
import StatusDot from '../primitives/StatusDot.jsx';

export default function LeftRail({
  width,
  onResize,
  page,
  onPageChange,
  projects,
  activeProjectId,
  onSelectProject,
  onFileOpen,
}) {
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div style={{
      width,
      flexShrink: 0,
      background: 'var(--chrome)',
      borderRight: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ResizeHandle side="right" onResize={onResize} min={180} max={560} />

      {/* Projects page */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        transform: page === 'projects' ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 240ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <RailHeader label="PROJECTS" onAction={() => {}} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {projects.map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              active={p.id === activeProjectId}
              onSelect={() => onSelectProject(p.id)}
            />
          ))}
        </div>
      </div>

      {/* Files page */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        transform: page === 'files' ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 240ms cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Files page header: back button + project name + dirty dot */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => onPageChange('projects')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            ←
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-dim)',
              letterSpacing: '0.14em',
            }}>
              PROJECT
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text)',
              marginTop: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {activeProject?.name}
            </div>
          </div>
          <StatusDot kind={activeProject?.dirty ? 'warn' : 'ok'} size={5} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {activeProject && activeProject.files.length > 0 ? (
            <FileTree files={activeProject.files} onFileOpen={onFileOpen} />
          ) : (
            <div style={{
              padding: '16px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-dim)',
              letterSpacing: '0.08em',
            }}>
              NO FILES
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
