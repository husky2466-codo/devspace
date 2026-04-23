# Dev-Space.ai — IDE Redesign Handoff

## Overview

Dev-Space.ai is an agentic IDE: a single workspace where a human, an orchestrator ("Spaceman"), and a fleet of coding agents collaborate on a codebase. This redesign replaces the earlier "AI Command Center" concept with an **IDE-first** layout — the developer sits at the center of the screen, agents are tiled terminals in the workspace, and the orchestrator lives in a right-hand drawer.

The core shift: **Dev-Space is an IDE that happens to be agent-native**, not a dashboard that happens to run code. Everything a developer expects (file tree, tabs, terminals, status bar, keyboard-first nav) is present; everything an agent workflow requires (spawn/minimize/kill terminals, per-agent prompt strip, chain runner, memory, live preview) is folded in without fighting the IDE metaphor.

This bundle is the design reference. Rebuild the UI in the target codebase (React / Electron, most likely) using the patterns in this folder as the source of truth.

## About the design files

Everything in `design_files/` is a **runnable HTML/JSX prototype** — not production code. Treat it as executable specification:

- Read the JSX to understand component boundaries, props, and state shape.
- Open `Dev-Space v2.html` in a browser to see every interaction live.
- Switch themes, spawn terminals, open Spaceman tabs — every behavior the real app should have is demonstrated.
- Copy the **intent** (structure, tokens, behavior) — not the literal JSX. The real app should use the codebase's routing, state store, IPC, and styling conventions.

## Fidelity

**High-fidelity.** Every screen, color, spacing value, font choice, and interaction has been settled. The prototype is pixel-intentional — if the mock uses 28px sub-tabs with a 2px top border indicating active state, that is the spec. Three complete themes ship (Terminal, Graphite, Paper) and are live-switchable in the prototype; they are also the production theme set.

There are two deliberate exceptions where lower fidelity is appropriate in the real app:

1. **Real terminal rendering** — the prototype draws fake terminal output as flat divs. In production, use `xterm.js` (or equivalent) inside the `<TerminalCard>` shell. Keep the card chrome; swap the body.
2. **Live file tree** — the prototype uses hardcoded nested arrays. In production, wire it to the real filesystem via IPC. Keep the visual design (indentation, git-status markers, row heights).

## Structure of this handoff

| File | What's in it |
|---|---|
| `README.md` | This file — overview, fidelity statement, pointers. |
| `ARCHITECTURE.md` | Component tree, state model, data contracts. Read before writing code. |
| `TOKENS.md` | Design tokens (colors, spacing, type, radii) for all three themes. |
| `SCREENS.md` | Every screen / panel documented with layout, copy, components. |
| `INTERACTIONS.md` | Behaviors, flows, animations, keyboard shortcuts, dirty-state handling. |
| `ROADMAP.md` | Suggested build order — what to ship first, what can wait. |
| `design_files/` | The runnable HTML/JSX prototype. Open `Dev-Space v2.html`. |
| `tokens/variables.css` | Drop-in CSS variables for all three themes. |
| `tokens/tokens.json` | Machine-readable token export (for Style Dictionary or similar). |

## What's shipped in this design

### Layout
- **Three-pane IDE shell**: left rail (Projects ⇄ Files), center workspace (terminal grid), right drawer (Spaceman).
- **Top bar** with project tabs, theme selector, collapse toggles, settings.
- **Bottom status bar** with git info, compute usage (clickable popover), cursor pos, encoding.
- **Spaceman prompt strip** spans the full width between the drawer and status bar.
- Every rail is resizable and collapsible; collapsed state shows a narrow affordance with expand button.

### Left rail
- **Projects page**: list of all known projects with status dot, dirty indicator, last-activity. `+` button opens new-project picker.
- **Files page**: file tree for the currently-open project. Second `+` button for new file/folder.
- Pages slide between each other horizontally (single-axis transition).
- Active page tab is indicated by an accent top-border.

### Center workspace
- **Per-terminal sub-tab bar** (28px tall) — one tab per spawned agent, with `×` close and `+` spawn.
- **Auto-tiling terminal grid** — 1=full, 2=2cols, 3-4=2x2, 5-6=3x2, 7-9=3x3, 10+=4xN. Each cell is a `<TerminalCard>` with header (agent name, model, status, minimize, close) and body (scrollback).
- **Minimized dock** at the bottom for minimized terminals.
- **"NO TERMINALS" empty state** when the active project has no agents spawned.
- **New-project form takeover** — when creating a project, this whole region becomes a full-height form.

### Right drawer — Spaceman
Four tabs:
- **CHAT** — conversation with the orchestrator. Messages have role tags (`you`, `spaceman · sonnet`), tool-use blocks, optional tool metadata.
- **BROWSER** — "recently opened" list of dev previews, files, images, and external links. Dev items expand the drawer into a device-frame preview; external links open in the OS browser.
- **CHAIN** — multi-step plans with per-step status (ok / run / idle).
- **MEMORY** — tagged knowledge bank (DECISION / PATTERN / CORRECT).

Drawer can expand to ~50% viewport when browsing a dev preview; remembers prior width.

### Per-project state
- Every project has its own terminal set, active-terminal id, and Spaceman state (conversation, chain, memory, browser items, active tab).
- Switching the top-bar project tab swaps all of this in and out **non-destructively** — state is preserved across switches.
- Seeded projects (`forge`, `archivist`, `mindcraft`, `routines`) demonstrate four distinct states.

### Theming
- **Terminal** (default): true black, warm off-white, monochrome, zero radii.
- **Graphite**: warm zinc + electric lime accent for active state only. 3–4px radii.
- **Paper**: bone-white light mode with ink accents. 2–3px radii.
- Theme is `data-theme` attribute on `<html>`. Tokens cascade via CSS vars.

### New-project flow
- `+` on Projects rail opens an anchored picker with four kinds: Local, Remote (SSH), Clone→Local, Clone→Remote.
- Picking a kind replaces the center workspace with a full-height form.
- Form has a sticky header with Save / Discard. Save is disabled until required fields are filled.
- If the user tries to navigate away with unsaved changes, a red dirty-state banner slides in at the top of the form with Stay / Discard & Leave buttons.

### Settings modal
- Centered modal covering workspace. Currently lists theme selector + placeholder sections (Keybindings, Compute, Integrations, Advanced).

## Target platform

Most likely **Electron + React** (the `02-SOURCE-CODE/` folder in the source project confirms a React/JSX component model). If the team chooses a different stack (Tauri, SwiftUI, native), the architecture still holds — the state model in `ARCHITECTURE.md` is framework-agnostic.

## What's not in this design

- Real terminal I/O (pty, xterm wiring)
- Real filesystem watcher / git integration
- Real SSH remote execution
- Real LLM orchestration (Spaceman's actual prompt pipeline)
- Authentication, user accounts, billing
- Notification system
- Command palette / quick-open (`Cmd+P`)
- Multi-window / split-editor within a single terminal

These are all production concerns. The design anticipates them (the status bar has a compute popover; the browser tab has external-link handling; project tabs can be many) but does not specify their UX. Flag them in `ROADMAP.md`.

## Assets

- **Fonts**: Geist (UI), JetBrains Mono (code). Load via Google Fonts in `index.html`, or self-host.
- **Icons**: None. The design uses glyphs (`◢ ▴ ▾ × +`) and SVG shapes drawn inline. When icons are needed in production, use Lucide or Phosphor; keep 1.5px stroke; avoid filled icons.
- **Logos**: Spaceman glyph is inline SVG (`SpacemanGlyph` in `ide-v2.jsx`). Reuse it directly.

## Questions?

Start with `ARCHITECTURE.md` if you're building, `SCREENS.md` if you're reviewing, and `TOKENS.md` if you're theming. The runnable prototype at `design_files/Dev-Space v2.html` is the tiebreaker for anything ambiguous.
