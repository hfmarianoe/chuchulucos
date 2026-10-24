#!/bin/bash
# Instala microsoft/markitdown (convierte PDF, Office, HTML, etc. a Markdown).
# Sirve en local y en sesiones de Claude Code. Es idempotente.
set -euo pipefail

if command -v markitdown >/dev/null 2>&1; then
  echo "markitdown ya instalado: $(markitdown --version)"
  exit 0
fi

PY=$(command -v python3 || command -v python || true)
if [ -z "$PY" ]; then
  echo "Falta Python 3.10 o superior." >&2
  exit 1
fi

if command -v pipx >/dev/null 2>&1 && [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  pipx install 'markitdown[all]'
else
  "$PY" -m pip install --quiet 'markitdown[all]'
fi

echo "markitdown instalado: $(markitdown --version)"
