# chuchulucos.shop

Sitio estático de presentación y apps (compilador C, pseudocódigo, QR). Se sube a HostGator como carpeta `public_html/`.

## Configuración de proveedores (vigente)

Esta tabla manda sobre las reglas de abajo donde haya conflicto.

| Proveedor | Modelo | Uso |
|---|---|---|
| DeepSeek API | `deepseek-v4-pro` | Auditoría semanal |
| OpenAI API | `gpt-5.3-codex` | Revisión de código |
| OrcaRouter API | `orcarouter/auto` | Programar, primer agente; hasta terminar crédito |
| OpenRouter | todos los modelos gratuitos | 2 subagentes |
| OmniRoute API | solo modelos de manejo de imágenes (p. ej. `nano-banana`, `grok-imagine`) | hasta terminar crédito |

## Proveedores y modelos: cada modelo se llama solo desde su proveedor directo

Para evitar duplicados y cobros dobles, cada modelo se llama únicamente desde el proveedor que lo sirve directamente:

Reglas:
- No llamar `deepseek/*` desde OpenRouter. Usar DeepSeek directo.
- No llamar `gpt-*` desde OmniRoute ni OpenRouter. Usar OpenAI directo.
- Los duplicados (`gpt-5-nano`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano`, `deepseek-v4-flash`, `deepseek-v4-pro`) se quitan de OmniRoute cuando se configure esa lista.
- Los modelos de OrcaRouter distintos de `orcarouter/auto` (`orcarouter/free`, `fusion*`, `z-ai/*`, `tencent/*`, `orca/*`) están bloqueados por la clave. No se usan.

## OrcaRouter `orcarouter/auto`: configuración y pruebas (2026-10-19)

- Modelo elegido: `deepseek/deepseek-v4.1-flash-free`. Responde como `deepseek-v4-1-flash-261017`.
- Estrategia del router: **calidad**. Con la estrategia adaptativa mandó todo a `glm-5.3-flash`, incluso problemas difíciles, y las respuestas salieron vacías.
- Con varios modelos permitidos, la estrategia calidad escoge uno favorito para todo (con `v4.0` y `v4.1` juntos prefería `v4.0`). Para usar `v4.1`, dejarlo como único modelo permitido.
- Comparación `v4.0` contra `v4.1` (6 problemas difíciles): `v4.1` tardó 341 s y 55 661 tokens; `v4.0`, 2 366 s y 120 445 tokens. La calidad solo se comprobó en 2 de los 6 problemas y fue correcta en ambos.
- Usar `max_tokens` de 16 000 o más. `v4.1` respeta el límite y con 6 000 se cortó en pleno razonamiento, con la respuesta vacía.
- Sin streaming hay un tope de ~30 s en el upstream: las respuestas largas devuelven 502. Usar `stream: true`.
- Hay 502 intermitentes (~1 de cada 10 llamadas). Reintentar una vez.
- El modelo real de cada respuesta está en el campo `model` de la respuesta. El ID `deepseek-v4-flash-ga-260731` es `v4.0`.
- Los encabezados `X-OrcaRouter-Tier` y `X-OrcaRouter-Escalate` no cambiaron el modelo en las pruebas.
- Las llamadas directas a los modelos `-free` con esta clave dan 403 `model_access_denied`: solo funciona `orcarouter/auto`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
