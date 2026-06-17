#!/bin/bash
set -euo pipefail

# Install Node dependencies so the dev server, build, and any tooling
# work in Claude Code on the web sessions.
cd "$CLAUDE_PROJECT_DIR"
npm install
