# Current Design System — AI Command Center

This documents the existing design tokens, layout system, and visual identity currently in use. Claude Design should read this to understand what exists — and what we are moving away from.

---

## Current Tech Stack

- **Framework:** Electron 33 + React 18 + Vite
- **Styling:** Plain CSS with CSS custom properties (no Tailwind, no CSS modules)
- **Icons:** Lucide React
- **Typography:** Inter / Outfit (sans-serif), JetBrains Mono (monospace)
- **Terminal:** xterm.js with WebGL GPU rendering
- **Layout:** react-resizable-panels (arbitrary split panes)

---

## Current Color Palette (to be replaced)

The current palette is a standard "AI app" dark theme — navy backgrounds, gold accent, indigo secondary. This is exactly the pattern we are breaking.

```
Background primary:    #1a1a2e  (dark navy)
Background secondary:  #16213e  (deeper navy)
Background tertiary:   #0f1419  (near black)
Accent primary:        #ffd700  (gold)
Accent secondary:      #6366f1  (indigo)
Text primary:          #ffffff
Text secondary:        #a0a0a0
Border:                #2a2a3e
Sidebar background:    #0f0f1e
Card background:       #16213e
Brand gradient:        #ec4899 → #8b5cf6 → #3b82f6  (pink-purple-blue diagonal)
```

**Status colors:** green #10b981, amber #f59e0b, red #ef4444, blue #3b82f6

---

## Current Spacing System

Base unit: 4px

```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
2xl:  48px
3xl:  64px
```

---

## Current Typography Scale

```
xs:    11px
sm:    12px
base:  14px
md:    16px
lg:    18px
xl:    20px
2xl:   24px
3xl:   30px
```

Font weights: 400, 500, 600, 700

---

## Current Layout Structure

```
┌─────────────────────────────────────────────┐
│  Sidebar (64px collapsed / 240px expanded)  │
│  + Main content area                         │
│    └── SplitLayout (1–N resizable panes)     │
│         └── Each pane renders one app module │
└─────────────────────────────────────────────┘
```

- Sidebar is icon-only when collapsed, icon + label when expanded
- Each module has a per-module accent color
- Panes can be split horizontally or vertically, resized freely
- Tab height: 40px
- Border radius scale: 4px / 6px / 8px / 12px

---

## Current Module Accent Colors

Each module has a distinct accent color applied to its header/tab:

```
Dashboard:     #ffd700  (gold)
Projects:      #8b5cf6  (purple)
Reminders:     #22c55e  (green)
Relationships: #ec4899  (pink)
Meetings:      #3b82f6  (blue)
Knowledge:     #06b6d4  (cyan)
Chat:          #8b5cf6  (purple)
Memory Viewer: #f87171  (red)
Vision:        #8b5cf6  (purple)
Chain Runner:  #3b82f6  (blue)
Terminal:      #22c55e  (green)
DGX Spark:     #22c55e  (green)
Email:         #ea4335  (Google red)
Calendar:      #4285f4  (Google blue)
Contacts:      #0f9d58  (Google green)
Admin:         #64748b  (slate)
Settings:      #64748b  (slate)
```

---

## What We Are Moving Away From

- Dark navy + gold accent — overused in AI tools
- Pink-purple-blue brand gradient — generic "AI startup" look
- Per-module rainbow accent colors — visually noisy
- Heavy card-based layouts with rounded corners everywhere
- Glowing/neon effects (shadow-gold, border-gold glow)
- Standard left sidebar with icon grid navigation

The new design should feel like a **precision developer tool**, not an AI consumer app.
