#!/usr/bin/env bash
set -euo pipefail

echo "[devcontainer] workspace ready"
echo "[devcontainer] DATABASE_URL=${DATABASE_URL:-unset}"
echo "[devcontainer] REDIS_URL=${REDIS_URL:-unset}"

if command -v pg_isready >/dev/null 2>&1; then
  pg_isready -h postgres -p 5432 -U postgres || true
fi

if command -v redis-cli >/dev/null 2>&1; then
  redis-cli -h redis ping || true
fi

if [ -f /home/vscode/.codex/auth.json ]; then
  echo "[devcontainer] Codex auth detected at /home/vscode/.codex/auth.json"
else
  echo "[devcontainer] Codex auth not found."
  echo "[devcontainer] If login is needed inside the container, prefer: codex login --device-auth"
fi

if command -v codex >/dev/null 2>&1; then
  codex login status || true
else
  echo "[devcontainer] Codex CLI not on PATH yet. The OpenAI extension should install automatically in the container."
fi
