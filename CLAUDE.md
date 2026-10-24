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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
