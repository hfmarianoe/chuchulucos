#!/bin/bash
# Instala las herramientas de línea de comandos del repo: markitdown (convierte
# PDF, Office, HTML, etc. a Markdown) y graphify (grafo de conocimiento del código).
# Sirve en local y en sesiones de Claude Code. Es idempotente.
set -euo pipefail

PY=$(command -v python3 || command -v python || true)
if [ -z "$PY" ]; then
  echo "Falta Python 3.10 o superior." >&2
  exit 1
fi

instalar() { # $1 = comando, $2 = paquete de PyPI
  if command -v "$1" >/dev/null 2>&1; then
    echo "$1 ya instalado"
    return
  fi
  if command -v pipx >/dev/null 2>&1 && [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
    pipx install "$2"
  else
    "$PY" -m pip install --quiet "$2"
  fi
  echo "$1 instalado"
}

instalar markitdown 'markitdown[all]'
instalar graphify graphifyy   # el paquete oficial lleva doble "y"
