# Miyabi Design

Project repo for Miyabi Design (雅) — brand reference, Claude Code project skills, and future project files.

## What's here

- **`docs/MIYABI-BRAND.md`** — the brand reference (colors, type, voice, layout, CTA decisions). Any Claude Code session opened in this repo should read this before doing branding, copy, or design work for Miyabi Design.
- **`.claude/skills/`** — 62 project-level Claude Code skills from [wondelai/skills](https://github.com/wondelai/skills) (MIT licensed — see `.claude/skills/LICENSE-wondelai-skills.md`). Because these live under `.claude/skills/` in this repo, any Claude Code session opened here picks them up automatically — no separate install step. Highlights for this project: `top-design`, `refactoring-ui`, `web-typography`, `ux-heuristics`, `design-everyday-things`, `storybrand-messaging`, `cro-methodology`, `one-page-marketing`.
- **`.claude/skills/remotion/`** — a condensed skill for [Remotion](https://www.remotion.dev) (React-based programmatic video: compositions, `useCurrentFrame`/`interpolate` animation, Remotion Studio, captions, rendering/Lambda). Sourced from the community pack at [remotion-dev/skills](https://github.com/remotion-dev/skills). Useful here for turning Premiere Pro exports/assets into code-driven video compositions.
- **`.mcp.json`** — project-scoped MCP server config. Configures [premiere-pro-mcp](https://github.com/leancoderkavy/premiere-pro-mcp), which lets an AI assistant control Adobe Premiere Pro programmatically (media import, timeline editing, effects, keyframes, export). Any Claude Code session opened in this repo picks it up automatically.

## Usage

Open this repo in Claude Code (or point a Cowork session at it) and the skills in `.claude/skills/` are available by name automatically. Reference `docs/MIYABI-BRAND.md` for anything touching the Miyabi Design brand.

### Premiere Pro MCP setup

The `premiere-pro` MCP server in `.mcp.json` runs via `npx` on demand, but it only works where **Adobe Premiere Pro is installed locally** (Windows/macOS, Premiere 2020–2026) alongside its CEP connector plugin:

1. Install the signed Premiere connector (`.zxp`) from the [premiere-pro-mcp releases](https://github.com/leancoderkavy/premiere-pro-mcp/releases).
2. Restart Premiere and confirm the "MCP Bridge" panel appears.
3. Open this repo in a local Claude Code session (not a cloud/remote one — Premiere, the MCP client, and the CEP plugin must all run on the same machine) and approve the `premiere-pro` server when prompted.

Optional environment variables (set in `.mcp.json` or your shell): `PREMIERE_TEMP_DIR` (bridge directory), `PREMIERE_TIMEOUT_MS` (command timeout, default `30000`), `PREMIERE_MCP_CAPABILITIES` (authority profile), `MCP_AUTH_TOKEN` (required only for HTTP transport).

## Attribution

The skills under `.claude/skills/` are sourced from [wondelai/skills](https://github.com/wondelai/skills), MIT licensed, © Wondel.ai.

The `.claude/skills/remotion/` skill is a condensed version of the community pack at [remotion-dev/skills](https://github.com/remotion-dev/skills).
