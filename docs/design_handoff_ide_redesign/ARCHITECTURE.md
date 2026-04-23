# Architecture

## Component tree

```
<IDE>                                   // root — owns global + per-project state
├── <TopBar>                            // project tabs, theme, rail toggles
├── <LeftRail> | <CollapsedLeftRail>
│   ├── <RailSwitcher>                  // Projects ⇄ Files pill tabs
│   ├── <ProjectsPage>                  // slides in/out
│   │   ├── <ProjectRow> × N
│   │   └── <NewProjectButton>          // opens <NewProjectPicker>
│   └── <FilesPage>                     // slides in/out
│       ├── <FileTree>
│       └── <NewFileButton>
├── <center>                            // flex column
│   ├── <NewProjectForm>                // takeover when creating
│   │   OR
│   ├── <WorkspaceCenter>               // the normal view
│   │   ├── <TerminalTabBar>            // 28px, per-agent tabs
│   │   ├── <TerminalGrid>              // auto-tiling
│   │   │   └── <TerminalCard> × N      // or <EmptyWorkspace>
│   │   └── <MinimizedDock>             // if any minimized
│   └── <SpacemanPromptStrip>           // bottom-of-center, full-width input
├── <SpacemanSidebar> | <CollapsedRightRail>
│   ├── <SpacemanHeader>                // glyph + WATCHING status
│   ├── <TabBar>                        // chat / browser / chain / memory
│   └── <TabBody>
│       ├── <SpacemanChat messages={...} />
│       ├── <SpacemanBrowser items={...} url device />
│       │   └── <ActivePreview>         // when expanded
│       ├── <SpacemanChain chain={...} />
│       └── <SpacemanMemory mems={...} />
├── <StatusBar>                         // 24px bottom bar
├── <ComputePopover>                    // conditional, anchored to status bar
├── <SettingsModal>                     // conditional, centered
└── <NewProjectPicker>                  // conditional, anchored to + button
```

## State model

All global state lives in the `<IDE>` root. There is no context provider; state is passed down as props. Three reasons this works:

1. The tree is shallow (≤4 levels deep for any interactive element).
2. Most child components are pure-presentational and re-render cheaply.
3. It makes the state model legible — every piece of state is declared in one place.

In production you may prefer a store (Zustand, Jotai, Redux Toolkit, or React context with reducers). The state *shape* below is what matters; where you put it is up to the codebase.

### Top-level state

```ts
// Visual / layout
tone: Direction                         // active theme object
railPage: 'projects' | 'files'
leftCollapsed: boolean
rightCollapsed: boolean
leftWidth: number                       // 180–560
rightWidth: number                      // 260–900
previewExpanded: boolean                // Spaceman browser preview takeover
savedRightWidth: number | null          // remembered width when previewExpanded

// Project / selection
activeProject: string                   // id of top-bar tab
openProjectId: string                   // which row is "expanded" in the rail
projects: Project[]                     // static seed for now

// Modals / overlays
settingsOpen: boolean
computeOpen: boolean
pickerAnchor: DOMRect | null            // for <NewProjectPicker>
newProjectKind: 'local' | 'remote' | 'clone-local' | 'clone-remote' | null

// Per-project state (the important part)
terminalsByProject: Record<ProjectId, Terminal[]>
activeTermByProject: Record<ProjectId, string | null>
spacemanByProject: Record<ProjectId, SpacemanState>
```

### Derived state

```ts
terminals     = terminalsByProject[activeProject] ?? []
activeTermId  = activeTermByProject[activeProject] ?? null
spaceman      = spacemanByProject[activeProject] ?? emptySpaceman()
```

Setters use `useCallback` and close over `activeProject`, so calling `setTerminals([...])` only mutates the active project's slice.

### Type shapes

```ts
type Terminal = {
  id: string
  name: string                          // 'agent-1', 'forge', etc.
  cwd: string
  status: 'ok' | 'run' | 'err' | 'idle'
  model?: string                        // 'claude-sonnet-4.5'
  minimized: boolean
  lines: TerminalLine[]                 // for now, hardcoded; swap for xterm in prod
}

type TerminalLine = {
  kind: 'out' | 'err' | 'dim' | 'prompt' | 'caret'
  text: string
}

type Project = {
  id: string
  name: string
  branch: string
  last: string                          // '12m', '2h', '3d'
  dirty: boolean
  activity: 'run' | 'idle' | 'err'
  files: FileNode[]
}

type FileNode = {
  name: string
  children?: FileNode[]
  open?: boolean
  git?: 'M' | 'A' | 'D' | '?'
  active?: boolean
}

type SpacemanState = {
  tab: 'chat' | 'browser' | 'chain' | 'memory'
  chat: ChatMessage[]
  chain: Chain | null
  memory: Memory[]
  browser: {
    url: string
    device: 'desktop' | 'tablet' | 'phone'
    items: BrowserItem[]
  }
}

type ChatMessage = {
  role: 'you' | 'spaceman' | string
  meta?: string                         // '14:22', 'sonnet', 'yesterday'
  text: string
  tool?: {
    head: string                        // 'spawn agent[1]'
    body: string                        // 'scan usages of themeVars()'
    foot?: string                       // '14 files · 38kb · 420ms'
  }
}

type Chain = {
  name: string                          // 'theme-migration'
  steps: { n: number; name: string; status: 'ok' | 'run' | 'idle' | 'err' }[]
}

type Memory = {
  t: 'DECISION' | 'PATTERN' | 'CORRECT'
  c: string
}

type BrowserItem = {
  kind: 'html' | 'file' | 'img' | 'link'
  name: string
  path: string                          // url or project-relative path
  from: string                          // 'agent-1', 'spaceman', 'you'
}

type Direction = {                      // theme
  id: 'terminal' | 'graphite' | 'paper'
  name: string
  tagline: string
  bg / bgRaised / bgSunken / bgPane / chrome: hex
  border / borderStrong / borderActive: hex
  text / textMuted / textDim: hex
  accent / accentSoft: hex
  success / warn / error / info / running: hex
  paneActiveRing: hex
  fontUi / fontMono: css stack
  radius / radiusLg: css length
}
```

## Data flow

### Spawning a terminal
```
TerminalTabBar [+ click]
  → WorkspaceCenter.spawn()
  → makeTerminal(id, n)                 // utility, factors the shape
  → setTerminals([...cur, newTerminal]) // via the active-project-keyed setter
  → setActiveTermId(newId)
```

### Switching projects
```
TopBar [project tab click]
  → setActiveProject(id)
  → derived: terminals, activeTermId, spaceman all swap
  → SpacemanSidebar re-renders with new state (no remount — state persists)
```

### Opening an internal preview
```
SpacemanBrowser [item click]
  → classifyTarget(path) → 'internal' | 'external' | 'unknown'
  → internal: setUrl(path) + onRequestExpand() → previewExpanded=true
    → savedRightWidth = rightWidth
    → rightWidth = clamp(640, viewportWidth * 0.5, 900)
  → external: shell.openExternal(url) — in prototype this is window.open()
```

### Creating a new project
```
LeftRail [+ click]
  → setPickerAnchor(buttonRect)
  → <NewProjectPicker anchorRect={rect} /> renders
  → user picks kind
  → setPickerAnchor(null); setNewProjectKind(kind)
  → <WorkspaceCenter> unmounts; <NewProjectForm kind={kind} /> mounts in its place
  → form tracks dirtiness internally
  → Save / Discard / attempted-navigation-with-dirty → dirty banner shown
  → onSave / onDiscard → setNewProjectKind(null) → workspace returns
```

### Theme switching
```
SettingsModal [theme click]
  → setTone(direction)
  → themeVars(tone) returns CSS var object
  → applied to root <div> style={} — cascades via CSS vars
  → (in production) also set document.documentElement.setAttribute('data-theme', id)
    and persist to localStorage
```

## Resize handle contract

`<ResizeHandle side="left|right" onResize={setWidth} min max>` is a 6px-wide invisible strip absolutely-positioned on the pane's edge. Mouse-down → tracks deltaX → clamps to min/max → calls `onResize`. Body cursor and user-select are locked during drag.

## Dirty-state contract (new-project form)

The form owns its own `dirty` flag. When the user:
- clicks Save with valid input → `onSave()` (parent clears `newProjectKind`).
- clicks Discard → if dirty, show banner; else `onDiscard()`.
- tries to navigate away (e.g. clicks a project tab) → **the parent should intercept**. In the current prototype, navigation is not trapped — project tab clicks still work. In production, wire this via a navigation guard (React Router blocker, or manual intercept on `setActiveProject`).

## Key / focus handling

- **Escape** in new-project form → triggers Discard flow.
- **Escape** in expanded Spaceman preview → collapses back to drawer width.
- **Click outside** of `NewProjectPicker` or `ComputePopover` → closes it.
- No keyboard shortcuts are wired in the prototype. Production should add:
  - `Cmd+N` → new project picker
  - `Cmd+P` → quick file open
  - `Cmd+\\` → split terminal
  - `Cmd+W` → close active terminal
  - `Cmd+,` → settings

## Persistence

Nothing persists in the prototype. In production, persist:

- `tone.id` in `localStorage.devspace.theme`
- `railPage`, `leftWidth`, `rightWidth`, `leftCollapsed`, `rightCollapsed` in `localStorage.devspace.layout`
- `terminalsByProject`, `spacemanByProject` — **per-workspace**, not global. Store under a project-root-scoped key (e.g. `.devspace/state.json` in each project). They're large enough to warrant JSON files over `localStorage`.
- `activeProject` in `sessionStorage` (re-opening the app should restore the last-active project).

## Naming conventions to keep

- `Spaceman` is the proper noun for the orchestrator. Never "the AI", "Claude", or "assistant".
- Agents are lowercase nouns: `agent-1`, `forge-worker`, etc. The terminal tab shows the agent name.
- Status dots are universal: `ok` (green), `run` (amber, pulsing), `err` (red), `warn` (amber), `idle` (dim).
- Badges / tags in all-caps mono: `DECISION`, `PATTERN`, `CORRECT`, `WATCHING`, `NO TERMINALS`.
