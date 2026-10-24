# Task Observer

Meta-skill que vigila tus sesiones, registra correcciones, preferencias y huecos, y propone mejoras a tus otras skills y candidatas a skills nuevas. Origen: [rebelytics/one-skill-to-rule-them-all](https://github.com/rebelytics/one-skill-to-rule-them-all) (CC BY 4.0).

No modifica tus skills por sí sola: tú apruebas cada cambio y nada se aplica hasta que instalas el paquete actualizado.

## Instalación: solo en tu equipo (no está en el repo)

Necesita Node.js. En tu equipo:

```bash
npx skills add rebelytics/one-skill-to-rule-them-all --skill task-observer -g
```

(`-g` la instala para todos tus proyectos.) Instalar solo `SKILL.md` funciona degradado; el paquete incluye referencias y cinco scripts de Python.

## Activarla

Instalar no basta: la coincidencia por descripción casi no la dispara. Añade la instrucción de activación de `references/environments.md` del repo original a tu `CLAUDE.md` global (`~/.claude/CLAUDE.md`), o instala el hook de inicio de sesión. Verifícalo en una sesión nueva con trabajo normal que no mencione la skill: debe aparecer `skill-observations/observation-log/`.

## Por qué no está en el repo

Escribiría registros de tus sesiones en `skill-observations/` y `skill-updates/` dentro del proyecto, que podrían subirse a GitHub. Requiere además editar `CLAUDE.md`.

## Quitar

Borra la skill de `~/.claude/skills/task-observer/`.
