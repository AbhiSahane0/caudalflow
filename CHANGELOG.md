# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-28

### Added

- Infinite canvas for AI conversations with pan, zoom, and node resizing
- Branch from any selected text to explore tangents with full parent context
- Multi-node merge: Shift+drag to select 2+ nodes and synthesize insights
- Anthropic provider (Claude Sonnet, Opus, Haiku) with streaming responses
- OpenAI provider (GPT-4o, GPT-4o-mini, o1) with streaming responses
- Mock provider for development and demos
- Workspace management with localStorage persistence and JSON export/import
- Markdown rendering with syntax highlighting in chat messages
- Minimize, maximize, and collapse node states
- `npx caudalflow` CLI for running locally without cloning the repo
- GitHub Actions CI (lint + test + build on PRs, Node 20/22 matrix)
- GitHub Actions release workflow with npm Trusted Publishing (OIDC)

[1.0.0]: https://github.com/caudal-labs/caudalflow/releases/tag/v1.0.0
