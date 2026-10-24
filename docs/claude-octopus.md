# Claude Octopus

Plugin que ejecuta varios modelos de IA sobre la misma tarea (investigación, diseño, código) y muestra los desacuerdos antes de publicar. Origen: [nyldn/claude-octopus](https://github.com/nyldn/claude-octopus) (MIT). Es grande: 63 skills, 54 comandos, 31 personas, hooks y un servidor MCP.

## Instalación

Declarado como plugin en `.claude/settings.json` (`nyldn-plugins` + `octo@nyldn-plugins`). Al abrir el repo, Claude Code pide confiar en la carpeta e instala el plugin. No se copió su código.

Manual, con dos mensajes separados:

```
/plugin marketplace add nyldn/claude-octopus
/plugin install octo@nyldn-plugins
```

Después ejecuta `/octo:setup` para configurar proveedores y `/octo:guide` para ver los comandos.

## Cosas a tener en cuenta

- Trae varios hooks que corren durante la sesión. El webhook de telemetría solo actúa si defines `OCTOPUS_WEBHOOK_URL`; sin esa variable no envía nada.
- Para usar varios modelos necesita las CLI o claves de cada proveedor (Codex, Gemini, etc.). Respeta las reglas de proveedores de `CLAUDE.md`: no llamar `gpt-*` ni `deepseek/*` desde OmniRoute u OpenRouter.
- Si molesta, quítalo: `/plugin remove octo` y borra la entrada de `.claude/settings.json`.
