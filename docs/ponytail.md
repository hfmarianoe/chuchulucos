# Ponytail

Modo «senior perezoso» para Claude: la solución más corta y simple que funcione (YAGNI, librería estándar primero, sin abstracciones no pedidas). Origen: [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT).

## Instalación

Va como plugin, declarado en `.claude/settings.json` (`extraKnownMarketplaces` + `enabledPlugins`). Al abrir el repo en Claude Code, local o en la nube, Claude Code pide confiar en la carpeta y luego instala el plugin `ponytail@ponytail`. No se copió su código al repo.

Instalación manual (por ejemplo, global en tu equipo), con dos mensajes separados:

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

Requiere `node` en el PATH (los hooks son de Node.js).

## Uso

Skills: `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`. Cambia de nivel con `/ponytail ultra` y similares; `/ponytail-help` lista todo.

## Privacidad

Por defecto el plugin escribe un registro local (`~/.config/ponytail/band/`). El webhook es opcional y vacío por defecto: no envía nada fuera.

## Quitar

`/plugin remove ponytail` y borra la entrada de `.claude/settings.json`.
