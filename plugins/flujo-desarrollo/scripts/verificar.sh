#!/usr/bin/env bash
# Corre lint, typecheck, build y test si existen en package.json. Sin modelos.
# Exit 0 si todo lo que existe pasa; exit 1 si algo falla.
set -uo pipefail
if [ ! -f package.json ]; then
  echo "verificar: no hay package.json. Pide al usuario los comandos de verificación." >&2
  exit 2
fi
FALLOS=0
for script in lint typecheck build test; do
  if node -e "process.exit(require('./package.json').scripts?.['$script'] ? 0 : 1)" 2>/dev/null; then
    echo "== $script"
    if npm run -s "$script"; then
      echo "OK $script"
    else
      echo "FALLO $script"; FALLOS=$((FALLOS+1))
    fi
  else
    echo "omitido $script (no existe en package.json)"
  fi
done
exit $(( FALLOS > 0 ? 1 : 0 ))
