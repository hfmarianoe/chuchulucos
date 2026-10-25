# Agent Skills (Addy Osmani)

25 skills de ingeniería para todo el ciclo: especificar, planear, construir, probar, revisar y publicar. Origen: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## Instalación

Va como plugin declarado en `.claude/settings.json` (`addy-agent-skills` + `agent-skills@addy-agent-skills`). Al abrir el repo, Claude Code pide confiar en la carpeta e instala el plugin. No se copió su código.

Manual, con dos mensajes separados:

```
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

## Comandos

`/spec`, `/plan`, `/build`, `/test`, `/constraints`, `/review`, `/webperf`, `/code-simplify`, `/ship`. Si el nombre choca con uno integrado (`/review`), usa `/agent-skills:review`.

## Quitar

`/plugin remove agent-skills` y borra la entrada de `.claude/settings.json`.
