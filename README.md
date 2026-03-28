<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<h1 align="center">CaudalFlow</h1>

<p align="center">
  <strong>Every idea deserves a side quest. Branch, compare, merge.</strong>
</p>

<p align="center">
  CaudalFlow is a visual canvas for AI conversations that lets you branch, explore, and merge ideas like a mind map — powered by LLMs.
</p>

---

## The Problem

Linear chat interfaces force you into a single thread. You ask a question, get an answer, and when you want to explore a tangent, you lose your original train of thought. Going back means scrolling through walls of text. Comparing two approaches means copy-pasting between tabs.

**Conversations aren't linear. Your tools shouldn't be either.**

## The Solution

CaudalFlow gives you an infinite canvas where every conversation is a node. Select a piece of text, branch into a deeper exploration. See something interesting in two different threads? Select them both and merge — the AI synthesizes context from all parents into a new insight.

It's how research actually works: diverge, explore, converge.

---

## Features

### Infinite Conversation Canvas

Create chat nodes anywhere on an infinite, pannable, zoomable canvas. Each node is a full AI conversation with streaming responses, markdown rendering, and syntax highlighting.

### Branch from Any Text

Select any text in a conversation and branch into a new exploration. The child node inherits the parent's full context — the AI knows what was discussed and builds on it.

### Multi-Node Merge

Hold **Shift + drag** to select multiple nodes, then merge them with a single action. Tell the AI to *"compare these concepts"*, *"find connections"*, or *"summarize together"* — it receives the full context from every selected conversation and synthesizes a unified response.

### Multiple LLM Providers

Plug in your preferred AI backend:

| Provider | Models | Status |
|----------|--------|--------|
| **Anthropic** | Claude Sonnet, Opus, Haiku | Supported |
| **OpenAI** | GPT-4o, GPT-4o-mini, o1, etc. | Supported |
| **Mock** | Simulated responses | Built-in (for development) |

Adding a new provider is four files and zero changes to the rest of the app — see the [Contributing Guide](CONTRIBUTING.md).

### Workspaces

Organize your explorations into separate workspaces. Each workspace persists its full state — nodes, edges, conversations, positions — to localStorage. Export and import workspaces as JSON files.

### Keyboard-Driven Workflow

| Action | How |
|--------|-----|
| New node | Double-click canvas or `+` button |
| Pan canvas | Click & drag |
| Branch from text | Select text, click **Branch** button |
| Multi-select nodes | **Shift** + drag |
| Merge selected nodes | Type action in merge popup |
| Dismiss popups | **Esc** |
| Maximize node | Click maximize in header |

---

## Quick Start

### Run instantly with npx

```bash
npx caudalflow
```

That's it — opens in your browser, runs entirely on your machine. Your API keys never leave localhost.

### Development Setup

**Prerequisites:** Node.js 18+, an API key from [Anthropic](https://console.anthropic.com/) or [OpenAI](https://platform.openai.com/) (optional — mock mode works out of the box)

```bash
git clone https://github.com/caudal-labs/caudalflow.git
cd caudalflow
npm install
npm run dev
```

Open **http://localhost:5173** — you're in. The mock provider is active by default, so you can explore the full UI immediately.

### Connect an LLM

1. Click the **Settings** gear icon (left toolbar)
2. Select **Anthropic** or **OpenAI** from the provider dropdown
3. Paste your API key
4. Start chatting — responses stream in real-time

---

## How It Works

### The Canvas

Built on [@xyflow/react](https://reactflow.dev/), every conversation is a draggable, resizable node on an infinite canvas. Edges connect parent and child nodes, labeled with the branching context.

### Branching

When you select text in a conversation and click **Branch**, CaudalFlow:

1. Creates a new child node to the right of the parent
2. Connects them with a labeled edge
3. Builds a system prompt that includes the parent's conversation summary
4. Auto-sends your prompt and streams the AI's response

The child node "knows" what the parent discussed — follow-up messages continue with that context.

### Merging

When you Shift-drag to select 2+ nodes and submit an action:

1. A new merge node is created, positioned to the right of all parents
2. Edges connect every parent to the merge node
3. The system prompt includes a **full Q&A digest** from each parent conversation
4. The AI synthesizes across all contexts based on your action

This is the killer feature — it lets you run parallel research threads and then converge them into a single, informed analysis.

### State Management

Four Zustand stores keep things clean:

| Store | Responsibility |
|-------|---------------|
| `flowStore` | Nodes, edges, graph mutations |
| `chatStore` | Messages per node, streaming state |
| `settingsStore` | LLM config, UI preferences |
| `workspaceStore` | Multi-workspace management |

Everything persists to localStorage with debounced auto-save.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Canvas                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ ChatNode │──│ ChatNode │──│ ChatNode │  │
│  │ (parent) │  │ (branch) │  │ (merge)  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │flowStore│ │chatStore│ │settings │
  └────┬────┘ └────┬────┘ └────┬────┘
       │           │           │
       ▼           ▼           ▼
  ┌──────────────────────────────────┐
  │         LLM Service Layer        │
  │  ┌──────────┬──────────┬──────┐  │
  │  │Anthropic │  OpenAI  │ Mock │  │
  │  └──────────┴──────────┴──────┘  │
  └──────────────────────────────────┘
```

### Provider System

Every LLM provider implements a single interface:

```typescript
interface LLMProvider {
  id: string;
  name: string;
  streamChat(messages, config, callbacks, signal): void;
}
```

Providers are registered at startup and selected at runtime. The rest of the app is completely provider-agnostic — branching, merging, context building, and streaming all work identically regardless of which AI is behind it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Canvas | @xyflow/react 12 |
| State | Zustand 5 |
| Markdown | react-markdown + remark-gfm |
| Code Highlighting | react-syntax-highlighter (Prism) |
| Icons | Lucide React |
| IDs | nanoid |

Zero backend. Zero database. Runs entirely in your browser.

---

## Development

```bash
npm run dev        # Dev server with HMR
npm run build      # Type-check + production build
npm run lint       # ESLint
npm test           # Run unit tests
npm run test:watch # Tests in watch mode
npm run preview    # Preview production build
```

### Adding a Provider

See the [step-by-step guide in CONTRIBUTING.md](CONTRIBUTING.md#adding-a-new-llm-provider). It's four files:

1. Provider implementation (`services/providers/yourprovider.ts`)
2. Register it (`services/providers/registry.ts`)
3. Settings UI section (`components/ui/SettingsPanel.tsx`)
4. Default config (`stores/settingsStore.ts`)

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Development setup
- Project structure walkthrough
- Architecture decisions
- Code style guide
- PR process

## License

[MIT](LICENSE) — use it, fork it, build on it.

---

<p align="center">
  Built by <a href="https://github.com/caudal-labs">Caudal Labs</a>
</p>
