# Pro Workflow

Flujo de trabajo para Claude Code: ingeniería de contexto, equipos de agentes, 41 skills, 8 agentes, 23 comandos y aprendizajes consultables («cada corrección, una norma»). Origen: [rohitg00/pro-workflow](https://github.com/rohitg00/pro-workflow) (MIT).

## Instalación

Declarado como plugin en `.claude/settings.json` (`pro-workflow` + `pro-workflow@pro-workflow`). Al abrir el repo, Claude Code pide confiar en la carpeta e instala el plugin. No se copió su código.

Manual, con dos mensajes separados:

```
/plugin marketplace add rohitg00/pro-workflow
/plugin install pro-workflow@pro-workflow
```

## Cosas a tener en cuenta

- Trae hooks de inicio y fin de sesión y un módulo de investigación (`research-tick`) que puede hacer peticiones de red; revisa su configuración antes de usarlo.
- Se solapa con Superpowers, Addy Osmani y Octopus (planes, revisión, agentes). Si los comandos chocan, usa la forma con espacio de nombres.
- Quitar: `/plugin remove pro-workflow` y borra la entrada de `.claude/settings.json`.
