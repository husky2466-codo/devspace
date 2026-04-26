import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export default function XTermPanel({ termId, cwd, active }) {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const fitRef = useRef(null);
  const cleanupRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 12,
      lineHeight: 1.4,
      theme: {
        background: 'transparent',
        foreground: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e0e0e0',
        cursor: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00ff88',
        selectionBackground: 'rgba(255,255,255,0.15)',
      },
      cursorBlink: true,
      scrollback: 5000,
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitRef.current = fitAddon;

    const { cols, rows } = term;

    // Spawn pty
    window.electronAPI?.ptySpawn(termId, cwd, cols, rows);

    // Receive data from pty → write to terminal
    const offData = window.electronAPI?.onPtyData(termId, (data) => {
      term.write(data);
    });

    // Send user input → pty
    term.onData((data) => {
      window.electronAPI?.ptyWrite(termId, data);
    });

    // Handle pty exit
    const offExit = window.electronAPI?.onPtyExit(termId, () => {
      term.write('\r\n\x1b[31m[process exited]\x1b[0m\r\n');
    });

    cleanupRef.current = [offData, offExit];

    // ResizeObserver to fit terminal when container size changes
    const ro = new ResizeObserver(() => {
      try {
        fitAddon.fit();
        const { cols: c, rows: r } = term;
        window.electronAPI?.ptyResize(termId, c, r);
      } catch {}
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      cleanupRef.current.forEach((fn) => fn?.());
      term.dispose();
      window.electronAPI?.ptyKill(termId);
    };
  }, [termId, cwd]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus terminal when it becomes active
  useEffect(() => {
    if (active) termRef.current?.focus();
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '4px 0 0 4px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    />
  );
}
