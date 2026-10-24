#!/bin/bash
set -euo pipefail

# Solo en sesiones de Claude Code en la nube.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

"$CLAUDE_PROJECT_DIR/herramientas/instalar-markitdown.sh"
