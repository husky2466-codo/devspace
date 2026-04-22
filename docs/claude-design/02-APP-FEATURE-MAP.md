# App Feature Map — AI Command Center

This documents all modules in the app, their purpose, and how they relate. Claude Design should use this to understand what screens need to be designed.

---

## What This App Is

AI Command Center is a **personal agentic workspace** — a desktop application that combines:

1. **Multi-pane terminal environment** — SSH sessions, local terminal, parallel agent terminals
2. **AI orchestration layer** — chain multiple AI calls, spawn agents, oversee tasks
3. **Personal intelligence layer** — memory from AI sessions, projects, knowledge base
4. **Integrated productivity** — email, calendar, contacts, reminders all in one place
5. **GPU compute access** — direct interface to a local DGX Spark AI compute cluster

Think: a developer's command center crossed with a personal AI assistant dashboard.

---

## Core Modules

### Agent / Developer Core
| Module | Purpose | Priority |
|---|---|---|
| **Terminal** | Multi-pane terminal sessions (xterm.js + node-pty), SSH support | Critical |
| **Chain Runner** | Compose and execute multi-step AI agent workflows | Critical |
| **DGX Spark** | Job submission and monitoring for local GPU compute cluster | High |
| **Vision** | Camera/screen capture → Claude Vision analysis | Medium |

### Intelligence / Memory
| Module | Purpose | Priority |
|---|---|---|
| **Memory Viewer** | Extract, browse, and search memories from Claude Code sessions | Critical |
| **Chat** | Conversational AI interface (Claude + OpenAI) | High |
| **Knowledge** | Personal knowledge base with rich text editing | High |

### Project Management
| Module | Purpose | Priority |
|---|---|---|
| **Dashboard** | Overview: active projects, recent activity, quick actions | High |
| **Projects** | Project tracking with tasks, status, energy type | High |
| **Reminders** | Task and reminder management | Medium |
| **Meetings** | Meeting notes and scheduling | Medium |

### Relationships & Communication
| Module | Purpose | Priority |
|---|---|---|
| **Relationships** | Contact relationship tracking with freshness indicators | Medium |
| **Email** | Gmail integration — read, compose, manage | Medium |
| **Calendar** | Google Calendar integration | Medium |
| **Contacts** | Google Contacts sync | Low |

### System
| Module | Purpose | Priority |
|---|---|---|
| **Accounts** | Manage connected Google accounts and API integrations | Medium |
| **Settings** | App configuration, themes, API keys | Medium |
| **Admin** | Developer/debug tools | Low |

---

## Key UI Patterns Needed

### 1. The Command Surface
The primary interaction point — a persistent, always-accessible command input (like Raycast or Linear's command palette) that can:
- Open any module
- Run a terminal command
- Trigger an AI chain
- Navigate the workspace

### 2. The Workspace (Multi-Pane)
The main body of the app. Arbitrary split panes, each running one module. Users configure their own layout. This is the most important surface to design well — it needs to feel like a real workspace, not a dashboard.

### 3. The Agent Terminal
Terminal panes with semantic command blocks — each command is captured as a discrete block with output, exit code, timestamp. Not just a dumb xterm.js terminal — it's structured.

### 4. The Orchestrator / Bridge Layer
An AI that can see and interact with the workspace — spawn terminals, read outputs, coordinate multi-step work. Needs a distinct visual treatment that makes it feel like a supervisor, not just another chat window.

### 5. The Memory / Intelligence Panel
Quick access to extracted AI memories, recent session insights, knowledge base. Persistent intelligence that surfaces contextually.

---

## Navigation Concept

Current: icon sidebar (always visible, left side)

Future direction: minimize chrome, maximize workspace. Navigation should feel like it disappears when not needed. Consider:
- A top-of-screen tab bar (like a browser but for modules)
- A command palette as the primary navigation method
- A thin left rail that expands on hover (not click)
- Workspace "modes" rather than individual module tabs

---

## Screen Hierarchy

For design purposes, the most important screens are:

1. **Workspace view** — the multi-pane layout with terminals and modules active
2. **Terminal pane** — individual terminal session with command block UI
3. **Chain Runner** — the AI orchestration flow builder and executor
4. **Memory Viewer** — memory browsing and search interface
5. **Dashboard** — overview and quick action surface
6. **Command palette** — universal navigation and action surface
