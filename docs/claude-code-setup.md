# claude-code-setup

Plugin oficial de Anthropic (marketplace `claude-plugins-official`) que analiza el repo en modo solo lectura y recomienda automatizaciones: hooks, skills, servidores MCP, subagentes y comandos. Recomienda, no reescribe.

## Instalación

Habilitado en `.claude/settings.json` (`claude-code-setup@claude-plugins-official`). El marketplace oficial viene disponible por defecto en Claude Code. Al abrir el repo y confiar en la carpeta se instala solo.

Manual: `/plugin install claude-code-setup@claude-plugins-official` y luego `/reload-plugins`.

## Uso

Pídele a Claude: «recomienda automatizaciones para este proyecto».

## Nota

Estos pasos vienen de guías de terceros, no de la documentación de Anthropic; confirma el nombre exacto con `/plugin` si falla.

## Quitar

`/plugin remove claude-code-setup` y borra la entrada de `.claude/settings.json`.
