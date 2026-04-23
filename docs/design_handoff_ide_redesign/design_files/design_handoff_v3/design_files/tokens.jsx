// Three visual directions — distinct token sets
// Each is deliberately different, all break the AI-app pattern

const DIRECTION_A = {
  // "Terminal" — true black + warm off-white, zero color except status
  id: 'terminal',
  name: 'Terminal',
  tagline: 'True black · warm off-white · zero decoration',
  bg: '#000000',
  bgRaised: '#0a0a0a',
  bgSunken: '#000000',
  bgPane: '#0a0a0a',
  border: '#1c1c1c',
  borderStrong: '#2a2a2a',
  borderActive: '#f5efe0',
  text: '#f5efe0',        // warm off-white
  textMuted: '#8a857a',
  textDim: '#4a463e',
  accent: '#f5efe0',      // accent IS the text color — monochrome
  accentSoft: '#1a1813',
  success: '#7ab87a',
  warn:    '#c9a34a',
  error:   '#d05858',
  info:    '#6a9ab0',
  running: '#c9a34a',
  chrome: '#050505',
  paneActiveRing: '#f5efe0',
  fontUi: "'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Geist Mono', ui-monospace, Consolas, monospace",
  radius: '0px',
  radiusLg: '2px',
};

const DIRECTION_B = {
  // "Graphite" — warm zinc base + single surgical electric accent
  id: 'graphite',
  name: 'Graphite',
  tagline: 'Warm zinc · electric lime · surgical color use',
  bg: '#17171a',
  bgRaised: '#1d1d20',
  bgSunken: '#121214',
  bgPane: '#1a1a1d',
  border: '#26262a',
  borderStrong: '#323237',
  borderActive: '#c7ff3d',
  text: '#ededf0',
  textMuted: '#89898f',
  textDim: '#55555b',
  accent: '#c7ff3d',      // electric lime — used ONLY for active state
  accentSoft: '#2a3311',
  success: '#4ade80',
  warn:    '#fbbf24',
  error:   '#f87171',
  info:    '#60a5fa',
  running: '#c7ff3d',
  chrome: '#0f0f11',
  paneActiveRing: '#c7ff3d',
  fontUi: "'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Geist Mono', ui-monospace, Consolas, monospace",
  radius: '3px',
  radiusLg: '4px',
};

const DIRECTION_C = {
  // "Paper" — light-mode precision, bone-white with ink accents
  id: 'paper',
  name: 'Paper',
  tagline: 'Bone-white · ink accent · light-mode developer tool',
  bg: '#f4f1ea',          // bone / newsprint
  bgRaised: '#ffffff',
  bgSunken: '#ebe7dd',
  bgPane: '#fbf9f4',
  border: '#d8d3c6',
  borderStrong: '#b8b3a4',
  borderActive: '#14140f',
  text: '#14140f',        // ink
  textMuted: '#6b6858',
  textDim: '#a8a494',
  accent: '#14140f',
  accentSoft: '#ebe7dd',
  success: '#2f7a3a',
  warn:    '#a36c00',
  error:   '#a8312a',
  info:    '#2d5f8a',
  running: '#a36c00',
  chrome: '#ebe7dd',
  paneActiveRing: '#14140f',
  fontUi: "'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Geist Mono', ui-monospace, Consolas, monospace",
  radius: '2px',
  radiusLg: '3px',
};

const DIRECTIONS = [DIRECTION_A, DIRECTION_B, DIRECTION_C];

// Status colors are consistent across directions; they just look at the token
function themeVars(t) {
  return {
    '--bg': t.bg, '--bg-raised': t.bgRaised, '--bg-sunken': t.bgSunken,
    '--bg-pane': t.bgPane, '--chrome': t.chrome,
    '--border': t.border, '--border-strong': t.borderStrong, '--border-active': t.borderActive,
    '--text': t.text, '--text-muted': t.textMuted, '--text-dim': t.textDim,
    '--accent': t.accent, '--accent-soft': t.accentSoft,
    '--ok': t.success, '--warn': t.warn, '--err': t.error, '--info': t.info, '--running': t.running,
    '--pane-ring': t.paneActiveRing,
    '--font-ui': t.fontUi, '--font-mono': t.fontMono,
    '--radius': t.radius, '--radius-lg': t.radiusLg,
    color: t.text, background: t.bg,
    fontFamily: t.fontUi,
  };
}

window.DIRECTIONS = DIRECTIONS;
window.themeVars = themeVars;
