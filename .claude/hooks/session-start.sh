#!/bin/bash
set -euo pipefail

# Install Node dependencies so the dev server, build, and any tooling
# work in Claude Code on the web sessions.
cd "$CLAUDE_PROJECT_DIR"

# Use the package manager pinned in package.json via Corepack, falling back to
# a global pnpm if Corepack is unavailable.
corepack enable >/dev/null 2>&1 || true
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile
else
  corepack pnpm install --frozen-lockfile
fi
