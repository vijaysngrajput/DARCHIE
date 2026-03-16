#!/usr/bin/env bash
set -euo pipefail

echo "[devcontainer] preparing workspace"

mkdir -p services/api apps/web

if [ ! -f services/api/pyproject.toml ]; then
  cat > services/api/pyproject.toml <<'EOF'
[project]
name = "d-archie-api"
version = "0.1.0"
description = "D-ARCHIE backend"
requires-python = ">=3.12"
dependencies = []

[tool.uv]
package = false
EOF
fi

if [ ! -f apps/web/package.json ]; then
  cat > apps/web/package.json <<'EOF'
{
  "name": "d-archie-web",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "next dev -H 0.0.0.0 -p 3000",
    "build": "next build",
    "start": "next start -H 0.0.0.0 -p 3000",
    "lint": "echo \"lint not configured yet\""
  }
}
EOF
fi

if [ ! -f pnpm-workspace.yaml ]; then
  cat > pnpm-workspace.yaml <<'EOF'
packages:
  - apps/*
EOF
fi

echo "[devcontainer] uv version: $(uv --version)"
echo "[devcontainer] node version: $(node --version)"
echo "[devcontainer] pnpm version: $(pnpm --version)"
