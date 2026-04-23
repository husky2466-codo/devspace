# Interactions & Behavior

Anything with moving parts. Read alongside `SCREENS.md`.

## Project switching

- Clicking a project tab in the top bar → `setActiveProject(id)`.
- The **workspace swaps**: terminals, active-terminal, and entire Spaceman state (chat, chain, memory, browser, active tab) switch to the newly-active project's slice.
- **State is persistent, not reset**: switching to `archivist`, then back to `forge`, restores forge's exact previous state.
- No animation on swap — instant. (Adding a 120ms cross-fade is acceptable; more than that feels sluggish in an IDE.)

### Seeded project states

The prototype seeds four projects with deliberately distinct states to demonstrate the system:

- **forge**: 3 spawned terminals, mid-conversation about theme refactor, active `theme-migration` chain (4 steps, step 2 running), 3 memories, 7 browser items. Opens on `chat`.
- **archivist**: 0 terminals, conversation about git indexing, `diff-engine-audit` chain (3 steps, step 3 idle), 2 memories, PR-focused browser items. Opens on `chat`.
- **mindcraft**: 0 terminals, empty chat, no chain, 3 memories about bot architecture. Opens on `memory` (showing the tab choice is per-project too).
- **routines**: fully empty across every tab. Demonstrates empty states.

## Terminal lifecycle

### Spawn
- `+` in sub-tab bar or programmatically from Spaceman.
- `makeTerminal(id, n)` creates: `{id, name: 'agent-{n}', cwd: '~/forge', status: 'run', ...}`.
- Appended to active project's `terminals`, becomes `activeTermId`.

### Focus
- Click a sub-tab OR click inside a card → that terminal becomes active.
- Active card gets `--pane-ring` border.

### Minimize
- `_` in card header → `minimized: true`.
- Card disappears from grid; icon chip appears in `MinimizedDock`.
- Grid re-tiles based on remaining visible count.

### Restore
- Click the chip in `MinimizedDock` → `minimized: false`.
- Card re-appears in its original slot (new slot, actually — grid just re-tiles).

### Close
- `×` in sub-tab OR in card header → `setTerminals(prev.filter(t => t.id !== id))`.
- If closing the active one, activeTermId falls back to the first remaining.
- If closing the last one, activeTermId becomes `null` and the empty state shows.

## Sidebar expand / collapse

- Click the chevron in the top bar (`◂ / ▸`) → toggles `leftCollapsed` / `rightCollapsed`.
- Collapsed pane shows a 36px-wide strip with expand affordance.
- Widths are preserved on re-expand.

## Rail page switching (Projects ⇄ Files)

- Click a pill in the rail switcher → `setRailPage(...)`.
- Pages slide horizontally (200ms ease-out, transform translateX).
- The offscreen page stays mounted; state is retained.

## Resize

- Each rail has a 6px-wide invisible `<ResizeHandle>` on its inner edge.
- Cursor changes to `col-resize` on the strip.
- Mouse-down → track deltaX → clamp to min/max (per-rail) → update width.
- Body `cursor` and `user-select` are locked during drag.
- No snapping in the default; snapping to 260 / 340 is acceptable if added.

## Spaceman drawer expansion

Triggered when clicking an **internal** browser item:

- Save current `rightWidth` to `savedRightWidth`.
- Set `rightWidth = clamp(640, innerWidth * 0.5, 900)`.
- Render `<ActivePreview>` instead of the normal browser list.

Collapse is triggered by:
- Explicit back-button in `ActivePreview`.
- Leaving the `browser` tab (auto-collapse via `useEffect`).
- Escape key (should be wired — stub in prototype).

On collapse: restore `rightWidth = savedRightWidth`, null out `savedRightWidth`.

## New-project flow

### 1. Open picker

- Click `+` in Projects rail header.
- Capture the button's `getBoundingClientRect()` → `setPickerAnchor(rect)`.
- `<NewProjectPicker>` renders, absolutely positioned near the anchor.

### 2. Pick a kind

- Click a kind → `setPickerAnchor(null)` + `setNewProjectKind(kind)`.
- Picker closes, center workspace unmounts, `<NewProjectForm kind={kind}>` mounts.

### 3. Fill the form

- Form owns its own `values` state + `dirty` flag.
- Any field change sets `dirty = true`.
- Save button enables when all required fields are filled.

### 4. Save or discard

- **Save**: validates → calls `onSave()` → parent sets `newProjectKind = null` → workspace returns. In production, this also adds the project to the list and switches to it.
- **Discard**:
  - If `!dirty`: call `onDiscard()` immediately.
  - If `dirty`: show the dirty banner. User picks:
    - `Stay` → dismiss banner, keep editing.
    - `Discard & leave` → call `onDiscard()`, workspace returns.

### 5. Dirty banner

- Slides down from the top of the form (200ms ease-out, `translateY(-12px)` → `0`).
- Auto-dismisses on `Stay`.
- Keyboard: `Esc` = Stay, `Enter` on the Discard button = confirm.

### 6. Navigation interception (not in prototype)

The current prototype doesn't intercept project-tab clicks while the form is dirty. In production:

- When the form is mounted and `dirty`, wrap `setActiveProject` and any other navigation calls in a check.
- If dirty, show the banner and defer the navigation. On `Discard & leave`, perform the deferred navigation.

## Theme switching

- Settings modal → Theme section → click a theme card.
- `setTone(direction)` updates active theme object.
- `themeVars(tone)` produces a CSS-variables object, applied to the IDE root `<div style={}>`.
- Cascades to every descendant via `var(--*)`.
- **In production**: also do `document.documentElement.setAttribute('data-theme', id)` and write to `localStorage.devspace.theme`. On app boot, read back and set the attribute **before React hydrates** to prevent flash.

## Compute popover

- Click `DGX · N running · N queued` segment in status bar → toggle popover.
- Popover is absolutely positioned, bottom-aligned to the status bar.
- Click outside → closes.
- Shows live job rows (mock in prototype; in production, read from the remote-compute service over IPC or websocket).

## Spaceman prompt strip

- The input sits full-width between drawer edges, at the bottom of the center column above the status bar.
- `Enter` → submit.
- In the prototype: not wired to state. The input just clears.
- **In production**: append to `spaceman.chat` with `role: 'you'`, timestamp in `meta`, clear input, fire the Spaceman request, append the response as `role: 'spaceman'`.

## Keyboard shortcuts (production)

Not wired in the prototype. Recommended:

| Shortcut | Action |
|---|---|
| `Cmd+N` | Open new-project picker |
| `Cmd+P` | Quick-open file (future) |
| `Cmd+,` | Settings modal |
| `Cmd+T` | Spawn terminal |
| `Cmd+W` | Close active terminal |
| `Cmd+\\` | Toggle right drawer |
| `Cmd+B` | Toggle left rail |
| `Cmd+1/2/3/4` | Spaceman tabs (chat/browser/chain/memory) |
| `Cmd+K, Cmd+T` | Cycle theme |
| `Escape` | Close modal / popover / expanded preview; in dirty form = Stay |

## Animations & timing

| Trigger | Animation | Duration | Easing |
|---|---|---|---|
| Rail page switch | translateX (0 → 100% / 0 → -100%) | 200ms | ease-out |
| Dirty banner show | translateY + fade | 200ms | ease-out |
| Status dot (running) | scale + opacity pulse | 1.4s loop | ease-in-out |
| Terminal caret | opacity blink | 1.0s loop | step(2) |
| Drawer expand for preview | width change (no animation) | instant | — |
| Modal open | fade backdrop + scale(0.96→1) | 160ms | ease-out |
| Popover open | fade + translateY(4px→0) | 120ms | ease-out |

**Principle**: short durations (≤200ms) for state changes. No entrance flourishes on routine actions. Terminal-density UI should feel instant; motion is used for clarity, not delight.

## Empty states (catalog)

Every pane handles emptiness deliberately:

| Pane | Empty copy |
|---|---|
| Terminal grid (no agents) | `NO TERMINALS` + "Spawn a terminal or ask Spaceman to start a task." |
| Spaceman chat | `NO MESSAGES YET` + "Type in the prompt strip to start a conversation with Spaceman." |
| Spaceman chain | `NO CHAIN ACTIVE` + "Multi-step plans from Spaceman appear here." |
| Spaceman memory | `NO MEMORIES YET` + "Decisions, patterns, and corrections Spaceman learns about this project will land here." |
| Spaceman browser | (not currently shown — list just renders 0 items. Add: `NOTHING OPENED YET`.) |
| Files rail (new project) | (not currently shown — add: `NO FILES` + "Open a folder to start.") |
| Minimized dock | Hidden entirely when none minimized. |

Copy style: lead with a `UPPERCASE MONO LABEL`, follow with a single-sentence sans subtitle in text-muted. No CTAs in empty states — the action is already somewhere nearby (the `+` button, the prompt strip, etc.).

## Accessibility notes

Not implemented in the prototype. Required for production:

- All interactive elements should be real `<button>` / `<a>` elements (the prototype uses `<div onClick>` for brevity).
- Focus rings on tab navigation (2px `--pane-ring` outline).
- ARIA: role="tablist" + role="tab" on tab bars; role="dialog" + aria-labelledby on modals; aria-pressed on toggles.
- Status dots should have an `aria-label` ("running", "ok", "error").
- The prompt strip input needs a real `<label>` (visually hidden is fine).
- Color contrast: Paper theme passes WCAG AA for text. Terminal/Graphite have been eyeballed — re-verify with a contrast checker before ship, particularly `--text-dim` on `--bg-sunken`.
