# Roadmap

Suggested build order for implementing this design in production. Each milestone ships something usable and de-risks the next step.

## Milestone 0 — Foundations (1–2 days)

Groundwork that everything else depends on.

- [ ] Set up the Electron shell + React app (or confirm the existing one).
- [ ] Drop in `tokens/variables.css` — verify all three themes render by toggling `data-theme` on `<html>` in devtools.
- [ ] Load Geist + JetBrains Mono (Google Fonts link or bundled woff2).
- [ ] Add the `tcPulse` + `tcCaret` keyframes, scrollbar styles, base body styles (`overflow: hidden`, color, bg).
- [ ] Stub `<IDE>` root with just the top bar + status bar + empty center.

**Ships**: empty IDE shell that themes correctly.

## Milestone 1 — Left rail (2–3 days)

The project/file navigation.

- [ ] Rail switcher pill (`Projects` ⇄ `Files`) with sliding transition.
- [ ] Projects page: static seed list, `+` button, row active/dirty states.
- [ ] Files page: recursive `<FileTree>` component, git-status letters, active file indication.
- [ ] `<ResizeHandle>` on inner edge, 180–560 clamp.
- [ ] Collapse/expand via top-bar chevron. Collapsed strip shows tiny project dots.
- [ ] Persist `railPage`, `leftWidth`, `leftCollapsed` to `localStorage.devspace.layout`.

**Ships**: working left rail with project selection and file browsing.

## Milestone 2 — Terminal grid (3–5 days)

The heart of the workspace.

- [ ] `<TerminalTabBar>` with active/close/spawn — all fake terminals for now.
- [ ] `<TerminalGrid>` auto-tiling math (1/2/3-4/5-6/7-9 cases).
- [ ] `<TerminalCard>` chrome: header, body with fake line rendering, caret animation, minimize/close.
- [ ] `<MinimizedDock>` with restore.
- [ ] `<EmptyWorkspace>` state.
- [ ] **Integrate xterm.js** into the card body. Hook up pty I/O via Electron's node-pty.
- [ ] Wire real CWD, shell detection, resize events from card → pty.

**Ships**: real terminals you can `ls` in, tiled N-up.

## Milestone 3 — Spaceman drawer (3–4 days)

The orchestrator UI. Build the shell and tabs; the LLM pipeline can be stubbed.

- [ ] Drawer chrome, resize handle, collapse/expand.
- [ ] Tab bar (chat/browser/chain/memory) with persistent active tab.
- [ ] `<SpacemanChat>` rendering from `messages[]`, including tool blocks.
- [ ] `<SpacemanPromptStrip>` input → appends to chat state.
- [ ] `<SpacemanChain>` / `<SpacemanMemory>` / `<SpacemanBrowser>` empty states + rendering.
- [ ] Classify-internal-vs-external URL logic + expand to `<ActivePreview>`.
- [ ] `<ActivePreview>` with iframe, device picker, scale math.

**Ships**: full drawer UI, manually-driven chat (prompt in, echo out).

## Milestone 4 — Per-project state (1 day)

The contract that ties everything together.

- [ ] Lift `terminals`, `activeTermId`, `spaceman` into `byProject` maps keyed on `activeProject`.
- [ ] Wrap setters with `useCallback` so they only mutate the active slice.
- [ ] Seed 2–3 projects with distinct content to prove it works.
- [ ] Persist the full `byProject` state per-project-root (file in `.devspace/state.json` under the project root, NOT globally).

**Ships**: switching top-bar project tabs swaps the whole workspace non-destructively.

## Milestone 5 — New-project flow (2–3 days)

Creating projects from the UI.

- [ ] `<NewProjectPicker>` anchored floating card.
- [ ] Form takeover replacing `<WorkspaceCenter>`.
- [ ] Four form variants (Local / Remote / Clone→Local / Clone→Remote).
- [ ] Dirty-state tracking and banner.
- [ ] Navigation interception when dirty (wrap `setActiveProject` + rail clicks).
- [ ] Actually **create** the project: for Local, `mkdir` + template copy; for Remote, SSH connect + mkdir; for Clone, `git clone`.
- [ ] Add the new project to the `projects` list, switch to it.

**Ships**: full new-project UX, real projects created on disk/remote.

## Milestone 6 — Settings & Compute (2 days)

- [ ] Settings modal shell with left-nav sections.
- [ ] Theme picker section — wire to `setTone` + localStorage.
- [ ] Keybindings section (can be view-only for v1, document the defaults).
- [ ] Compute section — list of remote hosts (dropdown source for new-project Remote form).
- [ ] Integrations & Advanced — placeholders.
- [ ] `<ComputePopover>` anchored to status bar. Live job list from backend.

**Ships**: settings surface, compute visibility.

## Milestone 7 — Polish & accessibility (2–3 days)

- [ ] Real `<button>` / `<a>` elements everywhere clickable.
- [ ] Focus rings (2px `--pane-ring` outline).
- [ ] ARIA tablists, dialogs, aria-pressed toggles.
- [ ] Keyboard shortcuts table from `INTERACTIONS.md`.
- [ ] Contrast check on all three themes; tighten `--text-dim` on `--bg-sunken` if needed.
- [ ] Loading / error states on terminal spawn, project create, remote connect.
- [ ] Reduced-motion support: respect `prefers-reduced-motion` for pulse/caret/slide animations.

**Ships**: keyboard-navigable, accessible, production-feel IDE.

## Milestone 8 — Real Spaceman (separate, ongoing)

Out of scope for design handoff, but the UI anticipates it:

- [ ] Wire prompt strip → actual Spaceman call (Claude API or local model).
- [ ] Tool-use rendering from real assistant responses.
- [ ] Chain runner: plan → step-by-step execution → each step pushed into the chain tab.
- [ ] Memory store: per-project JSON or vector DB, populated by the orchestrator.
- [ ] Browser tab: actual provenance tracking (which agent opened what).

## Deferred / explicit non-goals

- Multi-window support (spawning a second IDE window).
- Split-editor inside a single terminal (Tmux-like panes). Current design handles N terminals; splitting one further is not specified.
- A dedicated code editor. The prototype stubs `editorTabs` but doesn't render an editor. Options:
  - Bring in Monaco and replace `<WorkspaceCenter>` with an editor/terminal tab system.
  - Keep Dev-Space terminal-only; the user runs their editor in a terminal (neovim, helix).
  - **Decision needed before Milestone 2.** The current design assumes terminal-only.
- Mobile / tablet. Design is desktop-only.

## How to pace it

- **Fastest path to dogfood**: M0 → M1 → M2 (real terminals) → M4 (per-project). That's ~1.5 weeks; you can use it as a terminal multiplexer from day one and layer Spaceman on top.
- **Fastest path to demo**: M0 → M2 → M3 (even with stub chat). Terminals + Spaceman drawer = the core pitch.
- Suggested order is M0→M1→M2→M4→M3→M5→M6→M7. Ship M4 early so you're not repeatedly re-plumbing state as new surfaces land.

## Open questions for the team

1. Electron or Tauri? (The prototype assumes Electron but nothing in the design requires it.)
2. xterm.js or a custom terminal renderer? (xterm.js recommended — battle-tested, accessible.)
3. State: plain React + prop drilling (matches prototype), Zustand, or Jotai?
4. Editor: include Monaco, or terminal-only + user's `$EDITOR`?
5. Persistence: per-project file in `.devspace/state.json`, or a global SQLite? Per-project recommended — it follows the user to other machines when the repo moves.
6. Where does the Spaceman orchestrator run? In-process (Node main)? Separate daemon? Remote?
