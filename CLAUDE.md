# chuchulucos.shop

Sitio estático de presentación y apps (compilador C, pseudocódigo, QR). Se sube a HostGator como carpeta `public_html/`.

## Proveedores y modelos: cada modelo se llama solo desde su proveedor directo

Para evitar duplicados y cobros dobles, cada modelo se llama únicamente desde el proveedor que lo sirve directamente:

| Modelo | Proveedor (endpoint) | Uso |
|---|---|---|
| `deepseek-v4-pro`, `deepseek-flash` | DeepSeek directo (`api.deepseek.com`) | revisiones |
| `gpt-5.4-nano`, `gpt-5.3-codex`, `gpt-5.4-pro` | OpenAI directo (`api.openai.com`) | revisiones: diaria (codex), simple (nano), difícil (pro) |
| Modelos `:free` de la lista de OpenRouter | OpenRouter (`openrouter.ai`) | escribir código de forma continua |
| `qwen3.8-flash`, `glm-5`, `gemma-4-26b-a4b-it`, `claude-haiku-4.5`, `nano-banana`, `grok-imagine` | OmniRoute (`api.cheaperinference.com`) | respaldo y generación de imágenes |
| `gemini-3.1-flash-lite`, `gemini-2.5-flash`, `gemini-3-flash`, `gemini-3.8-flash` | OmniRoute (`api.cheaperinference.com`) | respaldo de texto; gasta el crédito de OmniRoute |
| `orcarouter/auto` | OrcaRouter (`api.orcarouter.ai`) | uso medido: límite de $2 por semana |

Reglas:
- No llamar `deepseek/*` desde OpenRouter. Usar DeepSeek directo.
- No llamar `gpt-*` desde OmniRoute ni OpenRouter. Usar OpenAI directo.
- Los duplicados (`gpt-5-nano`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano`, `deepseek-v4-flash`, `deepseek-v4-pro`) se quitan de OmniRoute cuando se configure esa lista.
- Los modelos de OrcaRouter distintos de `orcarouter/auto` (`orcarouter/free`, `fusion*`, `z-ai/*`, `tencent/*`, `orca/*`) están bloqueados por la clave. No se usan.
