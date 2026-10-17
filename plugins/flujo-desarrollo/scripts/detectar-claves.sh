#!/usr/bin/env bash
# Lista qué APIs tienen su variable de entorno definida. Nunca imprime valores.
set -uo pipefail
VARS=(
  "DEEPSEEK_API_KEY:DeepSeek"
  "OPENAI_API_KEY:OpenAI"
  "ORCAROUTER_API_KEY:OrcaRouter"
  "OPENROUTER_API_KEY:OpenRouter"
  "NVIDIA_API_KEY:NVIDIA"
  "OMNIROUTE_API_KEY:OmniRoute"
)
for entrada in "${VARS[@]}"; do
  var="${entrada%%:*}"; nombre="${entrada#*:}"
  if [ -n "${!var:-}" ]; then
    echo "disponible  $nombre  ($var)"
  else
    echo "no-config   $nombre  ($var)"
  fi
done
