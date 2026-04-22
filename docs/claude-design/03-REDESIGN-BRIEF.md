# Redesign Brief — AI Command Center

This is the creative brief for the redesign. Read this carefully — it defines what we want and what we are explicitly avoiding.

---

## The Goal

Redesign AI Command Center to be a **precision developer workspace** with a distinct, opinionated visual identity that stands apart from every other AI tool on the market.

The reference product is **BridgeSpace** (bridgemind.ai) — an agentic development environment that combines multi-terminal workspaces, AI orchestration, and voice control. We are building our own version of this concept, but with a completely different visual language.

---

## The Problem We Are Solving Aesthetically

AI tools all look the same:
- Dark navy or near-black backgrounds
- Gold, cyan, or purple neon accents
- Glowing borders and shadow effects
- Rounded card grids
- Left sidebar with icon navigation
- Pink-purple-blue gradients as "brand"

This is the **AI app design pattern** — and we are explicitly rejecting it.

---

## Design Direction

### What It Should Feel Like

Reference tools for the aesthetic direction — NOT the layout, but the **feeling**:

- **Zed editor** — dense, information-rich, fast, zero chrome
- **Linear** — opinionated, precise, monochromatic with surgical color use
- **Raycast** — clean, confident, uses whitespace like a weapon
- **Warp terminal** — modern terminal aesthetic, structured, not generic
- **Vercel dashboard** — sharp, high-contrast, minimal decoration

### Keywords

Precise. Dense. Fast. Confident. Structured. Intentional. Minimal chrome. Information-forward.

### What This Is NOT

- Not a consumer app
- Not a "dashboard" with KPI cards
- Not soft, rounded, or approachable
- Not glowing or neon
- Not navy + gold

---

## Color Direction

We want 3 distinct visual directions explored. Constraints for all of them:

1. **No navy blue backgrounds** — already everywhere
2. **No gold accents** — the current system, needs to go
3. **No neon/glow effects** — too cyberpunk/generic AI
4. **Monochromatic or near-monochromatic** — use one accent color surgically, not a rainbow

Possible directions to explore (but not limited to):
- **True black + warm off-white** — like a high-end terminal. Zero color except functional status indicators.
- **Deep warm gray + a single cold accent** — zinc/slate base with one precise electric color for active state only
- **Inverted / light mode** — almost nobody does a proper light-mode developer tool. This could be the differentiation.
- **Desaturated green or amber terminal aesthetic** — but done with restraint, not retro kitsch

---

## Layout Principles

### Maximize Workspace Surface
- The terminal/module panes should occupy as much screen as possible
- Navigation chrome should minimize aggressively when not in use
- No persistent header bars that eat vertical space

### Command-First Navigation
- A command palette (keyboard shortcut, always available) is the primary way to open modules and run actions
- The sidebar/nav should be a secondary, collapsible surface

### The Orchestrator Is Distinct
- The AI "Bridge" layer (overseer agent) needs a visual treatment that differentiates it from terminal panes
- It feels like a supervisor watching the workspace, not another chat window
- Consider a persistent but minimal presence — maybe a floating element, a bottom bar, or a distinct pane type

### Pane Identity
- When multiple panes are open, it should be immediately clear what each pane is and what state it's in
- Active pane vs. inactive pane should be visually distinct
- Running/processing states should be immediately readable

---

## Typography Direction

- Keep **JetBrains Mono** or similar for terminals and code — this is non-negotiable
- The UI chrome (labels, navigation, metadata) should use a **variable font** with tight tracking
- Font sizes should skew smaller and denser than typical — this is a power-user tool
- No decorative type. No gradient text. No oversized hero text.

---

## What We Want From Claude Design

1. **3 visual direction explorations** — different color systems, different overall moods. All must break the AI app pattern.

2. **Workspace layout concept** — the multi-pane environment with 2-3 panes open. Show how navigation chrome is minimized.

3. **Terminal pane design** — a single terminal pane showing command blocks with structured output, status indicators, and the active/inactive pane distinction.

4. **Command palette** — the universal navigation surface. Should feel fast and keyboard-native.

5. **Orchestrator / Bridge element** — the AI overseer layer. How does it exist in the workspace without getting in the way?

---

## Handoff Target

This design will be implemented in Electron + React, rendered as HTML/CSS. No native OS widgets — everything is web-rendered. The output will be handed off to Claude Code for implementation.

The CSS architecture uses custom properties (CSS variables) for all design tokens. The new design system should produce a clean `variables.css` replacement as part of the handoff.
