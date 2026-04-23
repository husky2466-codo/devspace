# Design Tokens

Three complete themes ship. All tokens are CSS variables scoped to `[data-theme="..."]` on `<html>`. Spacing, type scale, and z-index are theme-independent and live on `:root`.

## Themes

### Terminal (default)
```
id:              terminal
tagline:         True black · warm off-white · zero decoration

--bg:            #000000
--bg-raised:     #0a0a0a
--bg-sunken:     #000000
--bg-pane:       #0a0a0a
--chrome:        #050505
--border:        #1c1c1c
--border-strong: #2a2a2a
--border-active: #f5efe0
--text:          #f5efe0    /* warm off-white */
--text-muted:    #8a857a
--text-dim:      #4a463e
--accent:        #f5efe0    /* accent IS text — monochrome */
--accent-soft:   #1a1813
--ok:            #7ab87a
--warn:          #c9a34a
--err:           #d05858
--info:          #6a9ab0
--running:       #c9a34a
--pane-ring:     #f5efe0
--radius:        0px
--radius-lg:     2px
```

### Graphite
```
id:              graphite
tagline:         Warm zinc · electric lime · surgical color use

--bg:            #17171a
--bg-raised:     #1d1d20
--bg-sunken:     #121214
--bg-pane:       #1a1a1d
--chrome:        #0f0f11
--border:        #26262a
--border-strong: #323237
--border-active: #c7ff3d    /* electric lime — active state ONLY */
--text:          #ededf0
--text-muted:    #89898f
--text-dim:      #55555b
--accent:        #c7ff3d
--accent-soft:   #2a3311
--ok:            #4ade80
--warn:          #fbbf24
--err:           #f87171
--info:          #60a5fa
--running:       #c7ff3d
--pane-ring:     #c7ff3d
--radius:        3px
--radius-lg:     4px
```

### Paper
```
id:              paper
tagline:         Bone-white · ink accent · light-mode developer tool

--bg:            #f4f1ea    /* bone / newsprint */
--bg-raised:     #ffffff
--bg-sunken:     #ebe7dd
--bg-pane:       #fbf9f4
--chrome:        #ebe7dd
--border:        #d8d3c6
--border-strong: #b8b3a4
--border-active: #14140f
--text:          #14140f    /* ink */
--text-muted:    #6b6858
--text-dim:      #a8a494
--accent:        #14140f
--accent-soft:   #ebe7dd
--ok:            #2f7a3a
--warn:          #a36c00
--err:           #a8312a
--info:          #2d5f8a
--running:       #a36c00
--pane-ring:     #14140f
--radius:        2px
--radius-lg:     3px
```

## Theme-invariant tokens

```
--font-ui:       'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif
--font-mono:     'JetBrains Mono', 'Geist Mono', ui-monospace, Consolas, monospace
```

## Type scale

Used throughout. Everything is in px (not rem) to stay consistent with the IDE density.

| Role | Font | Size | Weight | Letter-spacing | Notes |
|---|---|---|---|---|---|
| Top-bar project tab | ui | 12px | 500 | normal | active=text, idle=text-muted |
| Sub-tab (terminal) | mono | 11px | 400 | 0.02em | active underline via top-border |
| Terminal body | mono | 12.5px | 400 | 0 | line-height 1.55 |
| File tree row | ui | 12.5px | 400 | 0 | active=text, git M/A in status color |
| Status bar | mono | 10.5px | 400 | 0.04em | |
| Rail section header | mono | 10px | 400 | 0.14em | uppercase |
| Spaceman tab | mono | 11px | 400 | 0.08em | uppercase |
| Memory tag (DECISION / PATTERN) | mono | 9.5px | 400 | 0.14em | uppercase |
| Prompt strip SPACEMAN label | mono | 10px | 500 | 0.14em | uppercase, accent color |
| Form field label | ui | 12px | 500 | 0 | |
| Form heading | ui | 22px | 600 | -0.01em | |
| Dirty banner | ui | 12.5px | 500 | 0 | on err-soft bg |

## Spacing scale

Not a strict scale — the design uses pragmatic values. Common ones:

```
2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 60
```

Rails use 14px horizontal padding, rows use 8–10px vertical padding. Terminal grid gap is 8px. Card inner padding is 10–14px.

## Layout constants

```
Top bar height:            38px
Sub-tab bar height:        28px
Status bar height:         24px
Prompt strip height:       44px
Left rail default:         260px (min 180, max 560)
Right drawer default:      340px (min 180, max 560 normal, up to 900 when expanded)
Collapsed rail width:      36px
```

## Status dot

Universal 6×6 circle. `run` status pulses via the `tcPulse` keyframe (1.4s ease-in-out infinite, scaling 1→1.3 and opacity 1→0.5).

```css
@keyframes tcPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(1.3); }
}
```

## Scrollbar

Minimal, only visible on hover.

```css
*::-webkit-scrollbar       { width: 6px; height: 6px; }
*::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.25); border-radius: 3px; }
*::-webkit-scrollbar-track { background: transparent; }
```

## Accent usage rules

- **Terminal theme**: accent = text color. It's monochrome by design. Active state is conveyed by border, background swap, or semantic color.
- **Graphite theme**: accent is electric lime. Use **only** for active state indicators — never for a background block, never for body text. The rarity is the point.
- **Paper theme**: accent = text color (ink). Same rule as Terminal.

Status colors (`--ok`, `--warn`, `--err`, `--info`, `--running`) are independent of the accent and used freely for their semantic purpose.

## Don'ts

Enforced rejections from the earlier design pass — keep them rejected:

- ❌ No gradient backgrounds
- ❌ No glassmorphism / backdrop-blur
- ❌ No per-module rainbow accents (use `--accent` + semantic status colors only)
- ❌ No rounded corners above 4px
- ❌ No drop shadows except the compute popover (and modal backdrop)
- ❌ No emoji
- ❌ No sans-serif code / no cursive body type
