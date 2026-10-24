# find-skills (Vercel)

Skill que ayuda a descubrir e instalar skills del ecosistema abierto cuando preguntas «cómo hago X» o «¿hay una skill para X?». Origen: [vercel-labs/skills](https://github.com/vercel-labs/skills), carpeta `skills/find-skills`. Equivale a `npx skills add https://github.com/vercel-labs/skills --skill find-skills`.

## Instalación

Copiada tal cual (solo Markdown) a `.claude/skills/find-skills/` y a `~/.claude/skills/` de esta sesión. En el chat (nube) y en local con `git pull` se carga desde el repo. Para tenerla global en tu equipo: el comando `npx` de arriba con `-g`.

## Qué hace

Consulta el ranking de [skills.sh](https://skills.sh/) y usa `npx skills find <consulta>` para buscar; luego propone instalar con `npx skills add`. Instalar sigue requiriendo tu aprobación.

## Quitar

Borra `.claude/skills/find-skills/`.
