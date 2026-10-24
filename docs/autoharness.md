# Autoharness

Capa de skills que se autoaprende: destila skills de tus sesiones reales, fusiona las duplicadas, las actualiza y poda las que dejan de usarse. Solo toca las skills que ella misma generó. Origen: [tigerless-labs/autoharness](https://github.com/tigerless-labs/autoharness) (MIT).

## Instalación: solo en tu equipo (no está en el repo)

Si estuviera en el repo, cualquier sesión escribiría skills nuevas en `.claude/skills/` sin revisión. Requiere Python 3.11 o superior como `python3` en el PATH. En Claude Code, con dos mensajes separados:

```
/plugin marketplace add tigerless-labs/autoharness
/plugin install autoharness@autoharness
```

Luego `/reload-plugins` (o reinicia). `/learn` destila la sesión actual bajo demanda.

## Quitar

`/plugin remove autoharness`.
