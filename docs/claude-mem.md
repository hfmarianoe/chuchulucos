# claude-mem

Memoria persistente para Claude Code: captura lo que pasa en cada sesión, lo comprime y lo inyecta en las sesiones siguientes. Origen: [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) (Apache-2.0).

## Cómo funciona

- Hooks que registran el uso de herramientas en cada sesión.
- Un servicio local (worker, con Bun) con base SQLite, búsqueda con Chroma y un visor web.
- Ajustes en `~/.claude-mem/settings.json`; necesita configurar un proveedor de IA para comprimir las memorias.
- Sincronización con cmem.ai: opcional.

## Instalación (recomendada: en tu equipo)

La memoria vive en `~/.claude-mem/` de la máquina. En las sesiones en la nube el contenedor es temporal y se pierde, así que instalarlo solo en el repo no daría memoria entre sesiones. En tu equipo, con dos mensajes separados:

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

Reinicia Claude Code. (`npm install -g claude-mem` instala solo la librería, no los hooks.)

## Antes de activarlo en el repo

Habilitarlo en `.claude/settings.json` haría que cualquiera que abra este repo registre sus sesiones (comandos y salidas, que pueden incluir claves). Por eso no está habilitado ahí.

## Quitar

`/plugin remove claude-mem` y borra `~/.claude-mem/` si quieres eliminar los datos.
