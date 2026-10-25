# Graphify

Convierte el repo (código, docs, esquemas, PDFs) en un grafo de conocimiento consultable. Origen: [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) (Apache-2.0 / MIT). Paquete de PyPI: `graphifyy` (doble «y»).

## Qué quedó instalado

- La skill `/graphify` en `.claude/skills/graphify/` y `.claude/CLAUDE.md`.
- Una sección «graphify» en `CLAUDE.md`: pide consultar el grafo (`graphify query "..."`) antes de buscar en el código y actualizarlo (`graphify update .`) tras cambiar código.
- Dos hooks `PreToolUse` en `.claude/settings.json` (`graphify hook-guard`), que necesitan el comando `graphify`.
- La CLI la instala `herramientas/instalar-markitdown.sh`, que el hook de inicio de sesión ejecuta en la nube. En local: `./herramientas/instalar-markitdown.sh`.

## Uso

Primera vez: `/graphify .` para construir el grafo (queda en `graphify-out/`). Después: `graphify query "..."`, `graphify path "A" "B"`, `graphify explain "X"`.

## Quitar

`graphify uninstall` (con `--purge` borra también `graphify-out/`) y revierte la sección de `CLAUDE.md` y los hooks.
