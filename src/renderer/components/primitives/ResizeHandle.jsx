export default function ResizeHandle({ side = 'right', onResize, min = 180, max = 900 }) {
  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = e.currentTarget.parentElement.offsetWidth;

    const move = (ev) => {
      const dx = ev.clientX - startX;
      const raw = side === 'right' ? startW + dx : startW - dx;
      onResize(Math.max(min, Math.min(max, raw)));
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side === 'right' ? 'right' : 'left']: -3,
        width: 6,
        zIndex: 20,
        cursor: 'col-resize',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-soft)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    />
  );
}
