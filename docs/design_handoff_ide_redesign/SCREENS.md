# Screens & Panels

Every view in the design, documented top-to-bottom. Open `design_files/Dev-Space v2.html` alongside this doc — every screen described here is live there.

## Top bar · 38px

A horizontal strip above everything else. From left to right:

| Element | Notes |
|---|---|
| Left-rail collapse toggle | 28×28 button. Shows `◂` when expanded, `▸` when collapsed. |
| **Project tabs** | One per "open" project (not every project in the rail). Active tab: accent top-border + raised bg. Each tab: status dot + name + dirty `•`. |
| `+` new tab | Anchors the new-project picker. |
| Spacer | Flex grow. |
| Theme glyph | Three small dots, current theme highlighted. Click cycles to the next theme. |
| Settings cog | Opens settings modal. |
| Right-drawer collapse toggle | Shows `▸` when expanded, `◂` when collapsed. |

Tab copy: lowercase, single-word ideally (`forge`, `archivist`). Dirty dot appears to the right of the name, same color as `--warn`.

## Left rail

Default 260px, resizable 180–560. Contains a **rail-switcher pill** at the top (`Projects` ⇄ `Files`) and two sliding pages.

### Projects page

```
┌──────────────────────────┐
│ PROJECTS            +    │  ← section header (mono, 10px, 0.14em, uppercase)
├──────────────────────────┤
│ ● forge         main 12m │  ← ProjectRow (active, has accent left-border)
│ ○ archivist  feat/… 2h • │  ← dot idle, dirty marker
│ ○ mindcraft   develop 3d │
│ ○ routines      main  6h │
└──────────────────────────┘
```

- **ProjectRow**: 32px tall, 14px h-padding. Status dot (6px), name (text), branch (text-muted, mono 10.5px), last-activity (text-dim, mono 10.5px, right-aligned), dirty `•` in warn color.
- **Active row**: bg = `--bg-raised`, 2px left-border in accent. Row stays clickable to "re-focus".
- **`+` button**: 20×20, no background, plus glyph in text-muted. Click → opens NewProjectPicker anchored to the button.

### Files page

Same container, same width, slid in horizontally on rail-switch. Shows the file tree for `openProjectId`.

```
┌──────────────────────────┐
│ FILES              +  ⋯  │
├──────────────────────────┤
│ ▾ src/                   │
│   ▾ components/          │
│     ▾ terminal/          │
│       • Terminal.jsx  M  │  ← active file (• = accent dot)
│         Terminal.css     │
│     ▸ bridge/            │
│   ▸ styles/              │
│     App.jsx              │
│     main.jsx             │
│ ▸ electron/              │
│   package.json           │
│   README.md              │
└──────────────────────────┘
```

- Row height 24px. Indent 14px per level. Chevrons `▸`/`▾`.
- Git status letter (`M`, `A`, `D`, `?`) right-aligned, colored: M=warn, A=ok, D=err, ?=dim.
- Active file: accent dot before name, name in text (not text-muted).
- Second `+` button in header opens new-file/folder flow (stub in current design).

### Rail-switcher pill

```
┌────────────────────────┐
│ [Projects] [  Files  ] │   ← two pill tabs, one active
└────────────────────────┘
```

Renders above the page content. Mono, 11px, 0.08em, uppercase. Active has `--bg-raised` background and 1px border; idle is transparent.

### Collapsed rail (36px)

A vertical strip with a single expand button at the top (`▸` glyph) and a column of tiny project glyphs (just status dots, clickable). Clicking a dot expands the rail AND focuses that project.

## Center workspace

Flex column. Top-to-bottom: sub-tab bar, grid (or empty state), minimized dock, prompt strip.

### Sub-tab bar · 28px

One tab per spawned agent in the active project.

```
┌────────────────────────────────────────────────────┐
│ [●agent-1 ×][○agent-2 ×][●agent-3 ×]  +            │
└────────────────────────────────────────────────────┘
```

- Each tab: 12px left-padding, 10px right, 7px gap. Mono 11px. Status dot + name + `×` close.
- Active tab: `--bg` bg (vs sub-bar's `--bg-sunken`), accent top-border (1px).
- `+` button: last in the row, text-dim color, clicks `spawn()`.
- Overflow: `overflow-x: auto`. No clever wrapping.

### Terminal grid

Fills the remaining space. Auto-tiles by count:

| N | Layout |
|---|---|
| 1 | Full |
| 2 | 2 cols × 1 row |
| 3, 4 | 2 × 2 |
| 5, 6 | 3 × 2 |
| 7–9 | 3 × 3 |
| 10+ | 4 × ceil(N/4) |

Gap between cells: 8px. Outer padding: 8px.

### TerminalCard

```
┌──────────────────────────────────────┐
│ ● agent-1  sonnet-4.5    _  ×        │  ← header, 28px
├──────────────────────────────────────┤
│ $ npm run dev                        │
│ > terminal@0.0.1 dev                 │
│ > vite                               │
│  VITE v5.2.0  ready in 412ms        │  ← body, mono 12.5, line-height 1.55
│  ➜  Local:   http://localhost:5173/  │
│                                       │
│ _                                    │  ← blinking caret (tcCaret keyframe)
└──────────────────────────────────────┘
```

- Border: 1px `--border`. Active card: `--pane-ring` border (full 1px, not outline).
- Header: 28px, `--chrome` bg, `--border` bottom-border. Contains status dot, name, model (text-muted), spacer, minimize `_`, close `×`.
- Body: 10px padding, `--bg` bg, scrollable vertically.
- Line colors: `out`=text, `err`=err, `dim`=text-dim, `prompt`=accent, `caret`=blinking text.

### Empty state

When the active project has zero terminals:

```
            NO TERMINALS

     Spawn a terminal or ask Spaceman
    to start a task. The workspace tiles
           agents side-by-side.
```

Centered, mono 11px + 0.2em for the label, sans 14px for body. No CTA button — the user spawns via `+` in the sub-tab bar or via Spaceman.

### Minimized dock

Appears below the grid when any terminal is minimized. Horizontal strip of pill buttons, each shows the agent name and a restore glyph.

### Prompt strip · 44px

Full width (spans between the drawer edges). Bottom of the center column, above the status bar.

```
┌──────────────────────────────────────────────────────────────┐
│ ✦ SPACEMAN ›  Ask Spaceman to do something...          ⏎    │
└──────────────────────────────────────────────────────────────┘
```

- Spaceman glyph (18px), SPACEMAN label (mono 10px, accent, uppercase), `›` separator, then a borderless input with placeholder.
- Enter key submits (wire to append-to-chat in production).
- Active terminal name appears to the right of the input in text-muted when one is focused.

## Right drawer — Spaceman

Default 340px, resizable 180–560, expanded up to 900.

### Header · ~40px

```
┌──────────────────────────────────────┐
│ ◉ SPACEMAN         ● WATCHING        │
└──────────────────────────────────────┘
```

- Glyph + SPACEMAN label (mono 11px, 0.08em, uppercase).
- Right side: pulsing run-status dot + `WATCHING` label in accent color.

### Tab bar

```
│ CHAT  BROWSER  CHAIN  MEMORY │
```

Four equal tabs, mono 11px, 0.08em, uppercase. Active: text color + accent bottom-border (1px).

### CHAT tab

List of messages. Each message:
- Role tag (mono 10px, 0.14em, uppercase). `you` uses text-dim; `spaceman · sonnet` uses accent.
- Body text (ui 12.5px, line-height 1.55).
- Optional tool block: 10px padded, 2px accent left-border, `--bg-sunken` background, mono 11.5px. Shows head (`◢ spawn agent[1]`), body, optional foot (metadata).

Empty state: `NO MESSAGES YET` + subtitle "Type in the prompt strip to start a conversation with Spaceman."

### BROWSER tab

"Recently opened" list. Each item:
- Kind badge (`html` / `file` / `img` / `link`) in mono 10px.
- Name (text), path (text-muted, mono 11px), from-agent tag (text-dim).
- Click → `openItem(it)`:
  - Internal (dev-space://, localhost, project path) → expand drawer, show `ActivePreview`.
  - External (https://) → open in OS browser.

#### ActivePreview (expanded)

Appears when the drawer is "expanded" mode. Contains:
- Header with back button, URL bar, device selector (desktop / tablet / phone).
- Scaled device frame showing `MockDevPage` (in production, iframe the URL).
- Status line: dimensions, scale %, HMR status, HTTP status.

### CHAIN tab

Ordered step list for the active chain. Each step:
- Step number (mono 10.5px, right-aligned, 20px column).
- Name (mono 12px).
- Status dot (6px, colored by status).

Empty state: `NO CHAIN ACTIVE` + "Multi-step plans from Spaceman appear here."

### MEMORY tab

Tagged knowledge entries:

```
DECISION
Sliding rail pages, not dual-panel

PATTERN
Theme = attribute on <html>

CORRECT
File tree lives per-project, not global
```

- Tag: mono 9.5px, 0.14em, uppercase, text-dim.
- Content: ui 12.5px, text, line-height 1.45.
- Divider: 1px `--border` bottom.

Empty state: `NO MEMORIES YET` + subtitle.

### Collapsed drawer (36px)

Same pattern as collapsed left rail — vertical strip with expand button + tiny tab glyphs.

## Status bar · 24px

```
● main  3↑ 1↓ · forge · 2 modified              ● DGX · 1 running · 2 queued ▴ · ln 5, col 32 · utf-8 · lf
```

Mono 10.5px, 0.04em. Hover on `DGX` segment → opens `ComputePopover`. Clicking toggles it open/closed.

## New-project picker

Anchored floating card (~280×200). Appears attached to the `+` button it was triggered from.

```
┌───────────────────────────────┐
│ NEW PROJECT                   │
├───────────────────────────────┤
│ ◉ Local                       │
│   On this machine             │
│ ◉ Remote (SSH)                │
│   Run agents on another box   │
│ ◉ Clone → Local               │
│   Git repo, this machine      │
│ ◉ Clone → Remote              │
│   Git repo, over SSH          │
└───────────────────────────────┘
```

Each option: 44px row, icon/glyph, title (text), subtitle (text-muted, 11.5px). Hover → bg-raised.

## New-project form (takeover)

Replaces the entire center workspace.

### Header · sticky, ~48px

```
┌───────────────────────────────────────────────────┐
│ New local project          [Discard] [ Save  ]    │
└───────────────────────────────────────────────────┘
```

Save disabled (text-dim, bg-sunken) until required fields are valid. Discard always enabled.

### Dirty banner (conditional, slides in)

Appears directly below header when the user tries to navigate away with unsaved changes:

```
┌───────────────────────────────────────────────────┐
│ ⚠ You have unsaved changes.  [Stay] [Discard…]   │
└───────────────────────────────────────────────────┘
```

- Background: soft-err (derived from `--err` at ~12% opacity).
- 1px `--err` bottom-border.
- Slides down on appear (200ms ease-out transform translateY).

### Form body

Centered max-width ~560px, scrollable if tall.

**Local form fields:**
- Name (required, with hint "shown in the project rail & tabs")
- Path (required, file picker)
- Template (radio: Empty / Node / Python / Rust / Custom)
- Startup command (optional)

**Remote form fields:**
- Host (dropdown, pulls from Settings → Hosts)
- User (text, defaults per host)
- Port (number, default 22)
- Key path (file picker, optional)
- Working directory (text)
- Startup command (text)

**Clone variants:** prepend a "Git URL" field, keep the rest of Local/Remote.

Fields use subtle horizontal dividers instead of boxes. Each field:
- Label (ui 12px, 500)
- Hint (ui 11px, text-muted)
- Input (ui 13px, 10px vertical padding, 1px border only on focus)
- Required marker `*` in accent

## Settings modal

Centered, ~640×540. Backdrop: `rgba(0,0,0,0.45)`. Modal itself: `--bg-raised` bg, 1px `--border-strong` border, slight drop shadow.

Header: `SETTINGS` (mono 11px uppercase), close `×`.

Left nav (120px): Theme · Keybindings · Compute · Integrations · Advanced.

Body (active: Theme): three large theme cards in a row, showing a color-preview strip + name + tagline. Click to select. Selected card has accent-ring border.

## Compute popover

Anchored above the status bar's `DGX` segment, 460×~280.

```
┌───────────────────────────────────────────────────┐
│ COMPUTE · DGX SPARK       host: dgx.local · ssh ok│
├───────────────────────────────────────────────────┤
│ j-1042  finetune-llama-7b  4×H100  00:04:12  ●   │
│ j-1041  eval-suite-v3      1×H100  —         ●   │
│ j-1040  embed-index-rebuild 2×H100 —         ●   │
│ j-1039  nightly-bench      1×H100  00:12:48  ●   │
├───────────────────────────────────────────────────┤
│ 4 jobs · 7×H100 committed · last sync 12s ago    │
└───────────────────────────────────────────────────┘
```

Rows: grid `70px 1fr 80px 80px 14px`, mono 12px. Status dot on the right per row.
