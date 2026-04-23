# Dev-Space v3 — Interactions & Animations

## Keyboard Shortcuts (new in v3)

| Shortcut | Action | Context |
|---|---|---|
| ⌘F | Open find strip in editor | Editor tab focused |
| ⌘H | Open find + replace strip | Editor tab focused |
| Esc | Close find/replace strip; dismiss dirty guard; reject ghost suggestion | Editor tab |
| ⇥ Tab | Accept ghost suggestion | Ghost banner visible |
| ⇧⌘S | Save current file | Editor tab, dirty file |
| ⌘→ | Accept ghost suggestion line by line | Ghost banner visible |
| ⌘D | Split editor pane | Editor tab |
| F2 | Rename terminal | Terminal header focused |

## Editor Tab

### Opening a file
1. User clicks a file node in the left rail file tree.
2. `editorFile` state is set with `{ name, path, git, branch, dirty, errors, ghost }`.
3. Spaceman drawer tab switches to `'editor'`.
4. If drawer width < 420px, animate drawer to `Math.round(window.innerWidth * 0.52)`.
5. Drawer width transition: `220ms cubic-bezier(0.2, 0.8, 0.2, 1)`.

### Closing a clean file
1. User clicks `×` on a non-dirty tab.
2. `editorFile` clears, tab switches back to `'chat'`.
3. Drawer width animates back to 340px.

### Closing a dirty file (dirty guard)
1. User clicks `×` on a dirty tab.
2. `dirtyGuard` state set to `'closing'`.
3. A strip slides in below the file tab bar (no drawer resize — stays in place).
4. Strip slides in: `transform: translateY(-100%) → translateY(0)`, `200ms ease-out`.
5. Three actions:
   - `SAVE`: saves file, closes tab, clears editor, resets drawer width.
   - `DISCARD`: discards changes, closes tab, clears editor.
   - `KEEP OPEN`: sets `dirtyGuard` to null, strip slides back out.
6. `Esc` key triggers KEEP OPEN.

### Find / Replace (⌘F / ⌘H)
1. ⌘F: `findOpen` → true. Strip appears below breadcrumb.
2. ⌘H: `findOpen` → true, `replaceOpen` → true. Both rows appear.
3. Esc: both close.
4. Match highlights update as the user types (debounce 150ms recommended).
5. `▲`/`▼` nav buttons cycle through matches.
6. `↵ this`: replaces current match, advances to next.
7. `↵ all`: replaces all matches.

### Ghost suggestion
1. `file.ghost === true` triggers the banner on file open.
2. Banner: `background: var(--accent-soft)`, `border-bottom: 1px solid var(--accent)`.
3. Code shows ghost diff (italic adds, strikethrough removes) immediately.
4. `⇥ Accept all`: `ghostAccepted` → true. Banner clears. Code re-renders as accepted (green highlight). Footer shows `✓ edit accepted`.
5. `Esc` / Reject: `ghost` → false. Diff lines return to normal. Footer clears.
6. `⌘Z` after accepting: undo the acceptance (in production, this is a normal editor undo).

### LSP error panel
1. Panel is pinned to the bottom of the editor, collapsed by default if no errors, expanded if errors exist on file open.
2. Toggle row click: `panelOpen` flips.
3. Clicking an error row: scrolls the code area to that line number and highlights the gutter icon.
4. `✦ fix with spaceman`: sends error list to Spaceman chat and switches drawer tab to `'chat'`.

---

## Global Spaceman

### Toggle
1. User clicks either segment of `PROJECT | GLOBAL` control.
2. `spacedMode` state flips.
3. All downstream changes are immediate (no transition needed — the data change drives the render).
4. EDITOR and BROWSER tab disabled state is applied instantly.
5. If drawer is currently on EDITOR or BROWSER tab and user switches to GLOBAL, auto-switch drawer tab to `'chat'`.

### Scope chips (GLOBAL mode)
1. Rendered above the prompt strip when mode is `'global'`.
2. Clicking a chip toggles whether that project is in-scope for the next message.
3. Active chips: accent-global border + soft bg. Inactive: dim border.
4. The chip state is local to the prompt interaction, not persisted globally.

### Prompt behavior
- PROJECT mode: prompt goes to the active project's Spaceman.
- GLOBAL mode: prompt is dispatched to the global orchestrator with scope-chip context.
- The prompt strip label changes: `✦ SPACEMAN` → `✦ GLOBAL`.
- Placeholder text changes accordingly.

---

## macOS Window Chrome

### Frameless window setup (Electron)
```js
// main process
const win = new BrowserWindow({
  frame: false,
  titleBarStyle: 'hidden',
  trafficLightPosition: { x: 12, y: 8 },
  // OR handle traffic lights manually in renderer
});
```

### Drag region
The native title bar div should have `-webkit-app-region: drag`. All interactive elements inside it (traffic lights, any buttons) need `-webkit-app-region: no-drag`.

### Title updates
When the user switches project tabs, update the window title:
```js
win.setTitle(`${projectName} — Dev-Space.ai`);
win.setRepresentedFilename(projectPath); // shows proxy icon on macOS
win.setDocumentEdited(isDirty); // shows dot in traffic lights when dirty
```

### Traffic light hover
Traffic light glyphs (×, −, +) only appear on hover. This is handled in the `V3TrafficLights` component via React `onMouseEnter`/`onMouseLeave` on the container div.

---

## Terminal Finished-State Glow

### Trigger (production)
```js
// When the agent bridge signals completion:
bridge.on('terminal:done', ({ termId }) => {
  setFinishedIds(prev => new Set([...prev, termId]));
});
```

### Acknowledge
```js
// On card click:
const handleTerminalClick = (termId) => {
  setActiveTermId(termId);
  setFinishedIds(prev => {
    const next = new Set(prev);
    next.delete(termId);
    return next;
  });
};
```

### Animation
```css
@keyframes smFinished {
  0%, 100% {
    box-shadow: 0 0 0 1px rgba(74,222,128,0.5), 0 0 10px rgba(74,222,128,0.15);
  }
  50% {
    box-shadow: 0 0 0 2px rgba(74,222,128,0.9), 0 0 22px rgba(74,222,128,0.35);
  }
}
```
- Duration: 1.8s, ease-in-out, infinite.
- Applied to the outer card container.
- Removed immediately on click (state change causes re-render, no animation cancel needed).

### Multiple simultaneous finished terminals
- Each terminal's finished state is independent.
- A new terminal finishing does not clear other finished terminals.
- The finished set only shrinks when the user explicitly clicks a card.

---

## Drawer Resize

- Drag handle: 6px wide, absolute-positioned on the left edge of the drawer.
- On mousedown: capture mouse globally (`document.addEventListener('mousemove', ...)`) to avoid losing the drag.
- Cursor: `col-resize` during drag (set on `document.body`).
- Min width: 200px. Max width: 900px (or ~80vw in production).
- When EDITOR tab closes, animate back to the prior compact width (340px default).
- Width persists per-tab (EDITOR remembers its wider width, CHAT remembers its narrower width) — store as `{ editor: N, compact: N }`.

---

## Rail Animations

- Projects ↔ Files slide: `transform: translateX(0) ↔ translateX(±100%)`, `240ms cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Left rail collapse: width animates from current to 32px, `200ms`.
- Right drawer collapse: width animates from current to 32px, `200ms`.

---

## Theming

- Theme change is immediate — update CSS variables on `:root` or a wrapper element.
- No transition on theme change (instant swap is intentional, matching terminal aesthetics).
- Persist selected theme to `localStorage` under `'ds.v3.tone'`.

---

## Scrollbar Style

All scrollbars across the app:
```css
*::-webkit-scrollbar { width: 5px; height: 5px; }
*::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.22); border-radius: 3px; }
*::-webkit-scrollbar-track { background: transparent; }
```
Firefox: `scrollbar-width: thin; scrollbar-color: rgba(128,128,128,0.22) transparent;`
