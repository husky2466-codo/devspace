# Dev-Space.ai v3 — Feature Handoff

## Overview

This handoff covers four new surfaces designed and prototyped in the v3 session, plus a fully wired interactive prototype (`Dev-Space v3.html`). All work builds on the v2 IDE redesign — see `design_handoff_ide_redesign/` for the base layout, tokens, and architecture.

**New in v3:**
1. **Editor tab in the Spaceman drawer** — a 5th tab (EDITOR) that opens files inline with full syntax highlighting, file tabs, LSP error panel, dirty guard, find/replace, and ghost suggestion overlay.
2. **Global Spaceman mode** — a `PROJECT | GLOBAL` toggle in the drawer header that shifts Spaceman into a cross-project orchestrator with a distinct visual treatment and aggregated state.
3. **macOS native window chrome** — a 28px frameless title bar above the existing 38px top bar, with traffic lights, document title, and a full menu bar spec.
4. **Orchestration pipeline in the CHAIN tab** — the CHAIN tab becomes a real-time pipeline visualizer (prompt → router → plan → agents → tools → verify), plus per-project persona config in the drawer and in Settings.

**Additional refinements:**
- Terminal finished-state glow: when a terminal completes its job, it pulses green and shows a `DONE` badge until the user clicks to acknowledge.
- 7 editor states specced and designed (see `SCREENS_V3.md`).
- New `--accent-global` design token.

---

## About the Design Files

Everything in `design_files/` is a **runnable HTML/JSX prototype** — not production code. Treat it as executable specification:

- Open `Dev-Space v3.html` in a browser to interact with every feature.
- Click files in the left rail to open them in the EDITOR tab.
- Toggle PROJECT | GLOBAL in the drawer header.
- Use ⌘F / ⌘H for find/replace.
- Click × on a dirty tab for the dirty guard.
- Click a terminal card to acknowledge its finished glow.
- Use the theme dots (top bar, top-right) to switch themes live.

The JSX source (`ide-v3.jsx`) is the spec. Read it for component structure, prop shapes, and state transitions. Rebuild in your codebase's conventions — don't ship the raw JSX.

## Fidelity

**High-fidelity.** Every interaction, color, spacing, and copy string has been settled in the prototype. Three themes (Terminal, Graphite, Paper) are live-switchable. All measurements below are exact.

---

## New Design Token

One new token was introduced this session:

| Token | Terminal | Graphite | Paper | Usage |
|---|---|---|---|---|
| `--accent-global` | `#8fb3c9` | `#7dd3fc` | `#1f3a5f` | Global Spaceman mode only — replaces `--accent` when drawer is in GLOBAL mode |
| `--accent-global-soft` | `#0e1418` | `#0f1e26` | `#dde4ee` | Soft fill for Global-mode accented elements |

All other tokens are unchanged from v2 (`design_handoff_ide_redesign/TOKENS.md`).

---

## Screens & Components

### 1. Editor Tab in Spaceman Drawer

**Location:** Right drawer, 5th tab (`EDITOR`), sits between `BROWSER` and `CHAIN`.

**Tab bar behavior:**
- When drawer is narrow (`< 400px`): all tabs condense to icon-only. Active tab always keeps its label.
- At wider widths: all tabs show icon + label.
- Tab glyphs: SVG icons, 11×11px, `currentColor` stroke, 1px.
- Tab active state: `color: var(--text)`, `border-bottom: 1px solid var(--accent)`.
- Disabled tabs in GLOBAL mode (EDITOR, BROWSER): `color: var(--text-dim)`, `text-decoration: line-through`, `cursor: not-allowed`.

**Drawer width:**
- Default collapsed width: 340px.
- Editor open: expands to `~52%` of viewport width.
- Browser expanded (live preview): expands to `~50%` of viewport width.
- These two expanded states are independent — switching from EDITOR to BROWSER resets to Browser's own width; Editor does not cancel Browser's expansion.
- Drawer width is resizable at all times via drag handle on the left edge.

**Trigger:** Clicking any file in the left rail:
1. Sets `editorFile` state with `{ name, path, git, branch, dirty, errors, ghost }`.
2. Switches Spaceman tab to `'editor'`.
3. Expands drawer to 52% if it's narrower.

**Editor pane layout (top to bottom):**
```
┌─────────────────────────────────────────────────────┐
│ [filename ● ✗2 ×]  [filename2 ×]  ...  [split] [⤢] │  ← file tab bar, 26px, var(--chrome) bg
├─────────────────────────────────────────────────────┤
│ dirty guard strip (conditional, slides in)           │  ← 26px caption bar, borderLeft 2px warn
├─────────────────────────────────────────────────────┤
│ ghost suggestion banner (conditional)                │  ← 32px, var(--accent-soft) bg
├─────────────────────────────────────────────────────┤
│ path/breadcrumb + git status                        │  ← 22px, var(--bg-sunken), mono 9.5px
├─────────────────────────────────────────────────────┤
│ find/replace strip (conditional, ⌘F)                │  ← var(--bg-raised)
├─────────────────────────────────────────────────────┤
│                                                     │
│   code area (scrollable)                            │  ← var(--bg), flex 1
│                                                     │
├─────────────────────────────────────────────────────┤
│ LSP error panel (conditional, collapsible)          │  ← pinned bottom
├─────────────────────────────────────────────────────┤
│ editor footer: lang · spaces · unsaved · shortcuts  │  ← 20px, var(--chrome)
└─────────────────────────────────────────────────────┘
```

**File tab bar:**
- Height: 26px. Background: `var(--chrome)`. Font: `var(--font-mono)` 10.5px.
- Active tab: `background: var(--bg)`, `border-top: 1px solid var(--accent)` (or `var(--err)` if file has errors), `border-right: 1px solid var(--border)`.
- Inactive tabs: transparent bg, `color: var(--text-muted)`.
- Dirty indicator: `●` in `var(--warn)`, 8px, to the right of the filename.
- Error badge: `✗N` in `var(--err)`, 8px font, 1px `var(--err)` border, 1px padding, to the right of dirty dot.
- Close `×`: `color: var(--text-dim)`, 10px. Clicking a dirty file × shows dirty guard instead of closing immediately.
- Right side of tab bar: `[split]` and `[⤢]` tool buttons (see ToolBtn spec below).

**Dirty guard strip:**
- Appears below the file tab bar when user clicks × on a dirty file.
- Background: `var(--bg-raised)`. Left border: `2px solid var(--warn)`.
- Header row (padding 8px 12px): `V3Dot warn` + message text (11px) + subtext (11px muted).
- Action row (padding 6px 12px): `background: var(--bg-sunken)`, `border-top: 1px solid var(--border)`.
  - `SAVE` button: primary (accent bg, dark text).
  - `DISCARD` button: secondary (transparent, border).
  - `KEEP OPEN` button: secondary. Clicking dismisses the guard.
  - `esc` hint: `color: var(--text-dim)`, 9px, right-aligned.
- Diff preview below action row: font-mono 10px. Lines prefixed with `+` (ok color) or `−` (err color). No full gutter — just the prefix char.

**Ghost suggestion banner:**
- Appears when `file.ghost === true` and Spaceman has a pending proposal.
- Background: `var(--accent-soft)`. Bottom border: `1px solid var(--accent)`. Height: ~32px.
- Left: pulsing status dot + `SPACEMAN` label (accent, mono, 0.08em) + description text (text-muted).
- Right: `[⇥ Accept]` (primary btn) + `[Esc]` (secondary btn). Clicking Accept shows accepted state (green dot + "edit accepted" footer).
- Ghost diff in code area: added lines are italic, `color: var(--ok)`, `opacity: 0.85`, `background: rgba(74,222,128,0.07)`, `border-left: 2px solid rgba(74,222,128,.5)`. Removed lines: `color: var(--err)`, `text-decoration: line-through`, `background: rgba(208,88,88,.07)`.
- Accepted state: normal lines with `background: var(--accent-soft)` and `border-left: 2px solid var(--accent)`.

**Breadcrumb:**
- Height: ~22px. Background: `var(--bg-sunken)`. Border-bottom: `1px solid var(--border)`.
- Font: `var(--font-mono)` 9.5px. Path in `var(--text-dim)`, filename in `var(--text-muted)`.
- Right side: git status letter in `var(--warn)`/`var(--ok)` + branch name.

**Find / Replace strip (⌘F / ⌘H):**
- Opens below breadcrumb (or dirty guard if present).
- Background: `var(--bg-raised)`. Bottom border: `1px solid var(--border)`. Padding: 6px 10px.
- Find row: search input (flex 1, `var(--bg-sunken)`, `border: 1px solid var(--accent)`) + match count badge + nav buttons + option toggles + toggle-replace button + close.
- Replace row (shown when ⌘H or replace toggled): replace input (flex 1, `var(--bg-sunken)`, no accent border) + `↵ this` + `↵ all` buttons (accent/ok color).
- Input font: `var(--font-mono)` 11px. Blinking caret inline in the input text.
- Match highlight in code: `background: rgba(201,163,74,0.45)`, `border-radius: 2px`. Current match: `background: var(--warn)`, `color: var(--bg)`.
- ToolBtn spec: `padding: 2px 6px`, mono 9.5px, `border: 1px solid var(--border)`, active state gets `var(--accent-soft)` bg + accent border.

**LSP error panel:**
- Pinned to the bottom of the editor pane, above the footer.
- Toggle row (30px): `background: var(--chrome)`. Error count in `var(--err)`, warning count in `var(--warn)`. Right side: `✦ fix with spaceman` in `var(--accent)`, 9px.
- Item rows: `display: grid; grid-template-columns: 14px 1fr`. Glyph `✗`/`▲` in appropriate color. Message in `var(--text)`, code + location in `var(--text-dim)` 9px.
- Max height when expanded: 100px (scrollable).

**Editor footer:**
- Height: 20px. Background: `var(--chrome)`. Font: `var(--font-mono)` 9px. Color: `var(--text-dim)`.
- Left: `JSX · spaces 2`. Middle: `◉ unsaved` in `var(--warn)` when dirty. Right: keyboard hints.

**Empty state (no file open):**
- Centered in the editor area. SVG document glyph at 20% opacity.
- `NO FILE OPEN` in mono 10px dim. Subtext in 12px muted.
- Recent files list: bordered rows, `var(--bg-raised)` bg, file icon glyph + name + path + git marker.
- Keyboard hint: `⌘P quick open` in dim.

---

### 2. Global Spaceman Mode

**Toggle location:** Spaceman drawer header, between the SPACEMAN label and the WATCHING status.

**Control:** Segmented control, `PROJECT | GLOBAL`. Two segments side by side.
- Container: `border: 1px solid var(--border)` (project) or `var(--accent-global)` (global). No border-radius.
- Active segment: `background: var(--accent)` (project) or `var(--accent-global)` (global), `color: var(--bg)`.
- Inactive segment: transparent, `color: var(--text-muted)`.
- Font: `var(--font-mono)` 9px, `letter-spacing: 0.1em`.
- Clicking toggles the mode and all downstream visual changes.

**Header changes in GLOBAL mode:**

The drawer header has two rows:

Row 1 (always visible):
```
[SpacemanMark glyph, mode=global]  SPACEMAN  [PROJECT|GLOBAL toggle]  [OBSERVING · pulsing dot]
```
- `SpacemanMark` in global mode draws an additional orbit ellipse (`rx=10.5, ry=3.2, rotate=-22deg`) in `var(--accent-global)`, opacity 0.65.
- `SPACEMAN` label: `color: var(--accent-global)`.
- Status dot: `kind='info'` (uses `var(--info)`). Label: `OBSERVING` in `var(--accent-global)`.

Row 2 (context row, changes by mode):
```
Project mode: [run dot] forge · main · 3↑ 1↓                  persona: senior engineer
Global mode:  GLOBAL · 4 projects · read-only · dispatch-enabled          haiku router
```
- Container: `background: var(--bg)`, `padding: 4px 8px`, `margin-top: 7px`.
- Left border: `2px solid var(--accent)` (project) or `2px solid var(--accent-global)` (global).
- Font: `var(--font-mono)` 9.5px.
- Global label: `color: var(--accent-global)`, `letter-spacing: 0.14em`.

**Tab bar changes:**
- EDITOR and BROWSER tabs: `color: var(--text-dim)`, `text-decoration: line-through`, `cursor: not-allowed`, not clickable.
- Active tab accent: uses `var(--accent-global)` instead of `var(--accent)` for `border-bottom`.
- Active tab color: `var(--accent-global)` instead of `var(--text)`.

**CHAT tab in GLOBAL mode:**
- Spaceman role label: `color: var(--accent-global)`.
- Tool-use block: `border-left: 2px solid var(--accent-global)`, `background: var(--accent-global-soft)`.
- Tool-use head: `color: var(--accent-global)`.
- Prompt strip label: `✦ GLOBAL` in `var(--accent-global)`.
- Placeholder: `"Dispatch or ask across all projects…"`.

**Scope chips (prompt strip, GLOBAL mode only):**
- Appear above the prompt input, `padding: 5px 10px 2px`.
- Label: `scope` in `var(--accent-global)`, mono 8.5px.
- Active project chip: `border: 1px solid var(--accent-global)`, `background: var(--accent-global-soft)`, `color: var(--accent-global)`.
- Inactive chip: `border: 1px solid var(--border)`, `color: var(--text-dim)`.
- Font: `var(--font-mono)` 9px.

**MEMORY tab in GLOBAL mode:**
- Entries show an additional `· projectname` tag next to the type tag.
- Cross-project entries: tag in `var(--accent-global)`.

**CHAIN tab in GLOBAL mode:**
- Chain header: `color: var(--accent-global)`, prefixed with `◉ GLOBAL`.
- Steps that dispatch to a specific project: show `→ projectname` below the step name in `var(--text-dim)`.
- Steps owned by global context: show `◉ GLOBAL` in `var(--accent-global)`.

---

### 3. macOS Native Window Chrome

**Layout (top to bottom):**
```
┌─────────────────────────────────────────────────────┐
│ ● ● ●  [         forge ⎇ main ● 2 MODIFIED        ] │  ← native title bar, 28px
├─────────────────────────────────────────────────────┤
│ [logo] [forge ×] [archivist ×]   ...  [⌘K] [⌘,]   │  ← existing app top bar, 38px
```

**Native title bar:**
- Height: 28px. Background: `var(--chrome)`. Border-bottom: `1px solid var(--border)`.
- Traffic lights: standard macOS circles, left-aligned, 12px diameter, 8px gap. Colors: `#ff5f57`, `#febc2e`, `#28c840`. Hover shows glyphs (×, −, +) in `rgba(0,0,0,0.55)` 8px bold.
- Title (centered, `position: absolute`, `pointer-events: none`):
  - Project name: `var(--font-ui)` 12px, `font-weight: 500`, `color: var(--text)`.
  - Branch: `⎇ main`, `var(--font-mono)` 10px, `color: var(--text-dim)`, `letter-spacing: 0.04em`.
  - Dirty dot: `V3Dot kind='warn'` size 5.
  - Modified count: `2 MODIFIED`, mono 9.5px, `color: var(--text-dim)`, `letter-spacing: 0.08em`.
- This title bar is frameless (no native OS decoration) — the window is set `frame: false` in Electron.

**App top bar** (unchanged from v2, sits directly below native title bar):
- Height: 38px. No changes to structure or content.
- Logo section width adjusts to account for the absence of traffic lights (they're in the title bar above).

**Total chrome height:** 28 + 38 = 66px above the body.

**Menu bar:**
The menu bar lives at the OS level (macOS menu bar at top of screen). Dev-Space app menu items:
- **Dev-Space**: About, Preferences (⌘,), Hide (⌘H), Quit (⌘Q).
- **File**: New Project (⌘N), Open (⌘O), Close (⌘W).
- **View**: Theme cycle (⌃1–3), Toggle Left Rail (⌘B), Toggle Right Drawer (⌘J), Toggle Bottom Terminal (⌘\`), Zoom In/Out/Reset (⌘=/−/0).
- **Session**: New Terminal (⌘T), Close Terminal (⌘W), Next/Prev Terminal (⌘]/[), Split Right (⌘D), Split Down (⇧⌘D), Rename (F2).
- **Scripts**: Run Script (⌘R), Run Last (⇧⌘R), Saved Scripts submenu, Edit Scripts.
- **Window**: Minimize (⌘M), Zoom, Fullscreen (⌃⌘F), Bring All to Front, Project Switcher (⌃⌘P), open-project list.
- **Help**: Documentation, Keyboard Shortcuts.

---

### 4. Orchestration — CHAIN Tab Pipeline Visualizer

**CHAIN tab becomes the primary pipeline visualizer.** When Spaceman receives a prompt, a chain is materialized showing each step as a vertical node list.

**Pipeline node structure:**
Each node is a `display: grid; grid-template-columns: 28px 1fr` row:

```
[node glyph 20×20]  [label + status dot + duration]
                    [detail block]
```

- Node glyph: 20×20px box, `border: 1px solid` (ok=`var(--ok)`, run=`var(--running)`, idle=`var(--border)`), `background: var(--bg)`.
- Rail line: 1px vertical line connecting nodes, `left: 18px`, `background: var(--border)` (ok/idle) or `var(--running)` (run).
- Label: `var(--font-mono)` 10.5px. Color: `var(--text-muted)` when idle, `var(--text)` when run/ok.
- Status dot: right-aligned in label row.
- Duration: mono 9px, `var(--text-dim)`.
- Detail block: `padding: 6px 8px`, mono 10px, `line-height: 1.45`.
  - Run: `background: var(--accent-soft)`, `border-left: 2px solid var(--accent)`.
  - Ok: `background: var(--bg-sunken)`, `border-left: 2px solid var(--ok)`.
  - Idle: `background: var(--bg-sunken)`, `border-left: 2px solid var(--border)`, `color: var(--text-dim)`.

**Node kinds and glyphs (11×11 SVG, `currentColor` stroke):**
- `prompt`: speech bubble outline.
- `route`: branching path.
- `plan`: horizontal lines (list).
- `agent`: person silhouette (circle head + arc body).
- `tool`: checkmark path.
- `terminal`: terminal rectangle with `>` caret.
- `verify`: checkmark.

**Pipeline summary footer:**
- Dashed border `1px dashed var(--border)`. Padding: 8px 10px. Mono 9.5px.
- Left: total time, token counts (in/out).
- Right: `⎘ copy trace · ⏏ abort` in `var(--text-muted)`.

**Canonical pipeline steps:**
```
prompt → router → plan → agent(s) → tool calls → terminal(s) → verify
```
Any step can be `ok`, `run`, or `idle`. Multiple agent steps appear as separate nodes.

---

### 5. Persona Config

**In the Spaceman drawer (quick access):**
- Triggered by a `⚙` icon in the drawer header (future — currently accessible via the CHAT tab).
- Panel shows:
  - Current preset (name + model), with a `⎘ change` button.
  - Toggle list: `Auto-spawn terminals`, `Propose before editing`, `Run tests after edits`, `Use memory as context`. Each row: label + mini switch.
  - Mini switch: 26×14px, square corners. On: accent bg, white thumb. Off: `var(--bg-sunken)` bg, muted thumb. Thumb is 10×10px, transition `left 140ms ease`.
  - Tool allow-list: pills for `edit, read, grep, bash, spawn, git, test`. Enabled: accent border + soft bg + accent text. Disabled: `var(--border)` + `text-decoration: line-through` + dim text.
  - Footer note: `"Quick toggles only. Full config in ⌘, Settings · Spaceman"`.

**In Settings → Spaceman:**
- Per-project dropdown at the top (project selector).
- Field rows: `display: grid; grid-template-columns: 130px 1fr`. Mono 11px. Dividers at each row.
- Fields: Preset, Model, Router, Context window, System prompt (multiline textarea-style).
- Action row: `SAVE` (primary), `RESET` (secondary), `EXPORT .spaceman.yml` (dashed border).

---

### 6. Terminal Finished-State Glow

**Trigger:** When a terminal session completes its job (exit code 0 or explicit done signal from the agent bridge), it enters the `finished` state.

**Visual treatment:**
- Border: `1px solid rgba(74,222,128,0.8)` (replaces normal border, also replaces active `--pane-ring` border).
- Box shadow animation (`smFinished` keyframe):
  ```css
  @keyframes smFinished {
    0%, 100% { box-shadow: 0 0 0 1px rgba(74,222,128,0.5), 0 0 10px rgba(74,222,128,0.15); }
    50%       { box-shadow: 0 0 0 2px rgba(74,222,128,0.9), 0 0 22px rgba(74,222,128,0.35); }
  }
  animation: smFinished 1.8s ease-in-out infinite;
  ```
- Top ribbon: 2px green line across the very top of the card, `background: var(--ok)`, opacity 0.85.
- Header: agent name turns `color: var(--ok)`. Status dot shows `kind='ok'` (not pulsing). A `DONE` badge appears: mono 8.5px, `letter-spacing: 0.1em`, `color: var(--ok)`, `border: 1px solid rgba(74,222,128,0.4)`, `padding: 1px 4px`.
- Body: `background: rgba(74,222,128,0.03)`.
- Footer hint: `"· click to acknowledge ·"` in `rgba(74,222,128,0.5)`, 10px mono, below the last line of output.
- Caret: hidden when in finished state.

**Persistence:** The finished state persists until the user clicks the card. Multiple terminals can be in the finished state simultaneously — clicking one does not affect others.

**State model:**
```js
const [finishedIds, setFinishedIds] = useState(new Set());
// Add when terminal exits:
setFinishedIds(s => new Set([...s, termId]));
// Remove on click:
setFinishedIds(s => { const n = new Set(s); n.delete(termId); return n; });
```

---

## Editor States Reference

Seven editor states were designed (see `Spaceman Surfaces.html`, second canvas section):

| State | Color | Trigger |
|---|---|---|
| Empty | White/neutral | No file open in editor tab |
| Dirty Guard | Red | User clicks × on a file with unsaved changes |
| File Too Large | Yellow | File exceeds 2 MB render threshold |
| LSP Errors | Red | TypeScript/ESLint errors detected in open file |
| Split View | Neutral | User triggers split (⌘D) |
| Find / Replace | Green | ⌘F / ⌘H keyboard shortcut |
| Ghost Suggestion | Blue (accent-global) | Spaceman proposes an edit to the open file |

Full layout specs for each state are in `SCREENS_V3.md`.

---

## Files in This Handoff

| File | Description |
|---|---|
| `README.md` | This file |
| `SCREENS_V3.md` | Per-screen layout specs for all 4 new surfaces + 7 editor states |
| `INTERACTIONS_V3.md` | All new interactions, keyboard shortcuts, animations |
| `design_files/Dev-Space v3.html` | Fully interactive prototype — **start here** |
| `design_files/ide-v3.jsx` | JSX source for the v3 IDE (~1,250 lines) |
| `design_files/tokens.jsx` | Design tokens — all 3 themes + new accent-global token |

---

## What's NOT in This Design

- Real pty/xterm terminal I/O (use xterm.js inside the card shell)
- Real LSP server integration (wire language server protocol; the error panel shape is specced)
- Real filesystem watcher for the file tree
- Real Spaceman LLM pipeline (the CHAIN tab shape is specced; wire your orchestration backend)
- Split terminal view (specced in menu bar; UX not yet designed)
- Command palette / ⌘P quick-open
- Notification system
- Multi-window support

---

## Build Order Recommendation

1. **Token system** — implement `--accent-global` / `--accent-global-soft` alongside existing tokens.
2. **Terminal finished glow** — isolated, self-contained, highest impact/effort ratio.
3. **macOS title bar** — Electron `frame: false` + drag region + title component. Low risk.
4. **Editor tab** — build the drawer tab first (icon-only condensing), then the editor pane states one by one: empty → file open → dirty guard → LSP panel → find/replace → ghost suggestion.
5. **Global Spaceman toggle** — add toggle control + mode-aware styling; wire aggregated state last.
6. **CHAIN pipeline visualizer** — replace the existing step list with the node-rail layout; add node glyphs.
7. **Persona config** — drawer quick panel first, Settings section second.
