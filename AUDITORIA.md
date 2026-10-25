# Auditoría — chuchulucos.shop

- **Origen:** auditoría del 18 de octubre de 2026 (commit `fbf7813`) y auditoría del 24 de octubre de 2026 (commit `a1d6b9a`).
- **Estado:** sin pendientes abiertos. Los 18 hallazgos de la auditoría del 24 de octubre están resueltos en la [PR #21](https://github.com/hfmarianoe/chuchulucos/pull/21) (rama `fix/pendientes-auditoria-2026-10-24`).
- **Líneas:** las referencias de la auditoría del 24 de octubre son del código de `a1d6b9a`. Las del 18 de octubre son de `fbf7813` y ya no coinciden.
- **Informe completo:** [`docs/auditorias/2026-10-24.md`](docs/auditorias/2026-10-24.md).

## Resueltos

| ID | Severidad | Hallazgo | Resuelto en |
|---|---|---|---|
| A5 | Alta | Los arreglos se pasaban por copia a las funciones | PR [#8](https://github.com/hfmarianoe/chuchulucos/pull/8) |
| M4 | Media | `scanf` daba un mensaje engañoso | PR [#8](https://github.com/hfmarianoe/chuchulucos/pull/8) |
| M5 | Media | Un `/*` sin cerrar y un `#` suelto pasaban sin aviso | PR [#8](https://github.com/hfmarianoe/chuchulucos/pull/8) |
| M6 | Media | El léxico no avisaba de hexadecimales, exponentes, sufijos y palabras no soportadas | PR [#8](https://github.com/hfmarianoe/chuchulucos/pull/8) |
| B1 | Baja | El intérprete estaba en un solo archivo | PR [#11](https://github.com/hfmarianoe/chuchulucos/pull/11) |
| B2 | Baja | Código muerto en `builtinPrintf`, `builtinPutchar` e `isArray` | PR [#10](https://github.com/hfmarianoe/chuchulucos/pull/10) |
| B3 | Baja | Sin enlace a la app de C desde la página principal; README desactualizado | PR [#10](https://github.com/hfmarianoe/chuchulucos/pull/10) |
| B4 | Baja | `href="/"` rompía en subcarpeta o con `file://` | PR [#10](https://github.com/hfmarianoe/chuchulucos/pull/10) |
| B5 | Baja | Colores fijos, falta `color-scheme` y sin interruptor de tema | PR [#10](https://github.com/hfmarianoe/chuchulucos/pull/10) |
| B6 | Baja | Mensaje de límite de pasos con un número escrito a mano | Tanda 1, PR [#7](https://github.com/hfmarianoe/chuchulucos/pull/7) |
| B7 | Baja | `recordStep` copiaba todas las variables en cada paso | PR [#10](https://github.com/hfmarianoe/chuchulucos/pull/10) |
| B8 | Baja | Identidad de git sin configurar en el clon | Configuración local del clon (no versionada) |
| M7 | Media | Los literales con escape (`'\n'`, `'\t'`, `'\0'`) se guardan como texto y valen 0/NaN; `putchar('\n')` imprime NUL. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| M8 | Media | `getExprType` devuelve `int` para llamadas y asignaciones; el retorno `float` se pierde en expresiones. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| M9 | Media | `applyBinary` decide si es float por el valor, no por el tipo: `float x = 2.0; x /= 3;` da 0. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| M10 | Media | Un prototipo `int f(int);` se acepta como función con cuerpo vacío; al llamarla falla con `block.stmts is not iterable`. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| M11 | Media | El `textarea` del editor no tiene nombre accesible: ni `label` ni `aria-label`. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| M12 | Media | Dice que el intérprete es `interp.js` y que se suben `index.html` e `interp.js`; faltan tres archivos y la app no arranca. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B9 | Baja | Ancho y precisión de `printf` sin validar; `%s` sin argumento imprime `undefined`. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B10 | Baja | Una función repetida sobrescribe a la anterior sin avisar. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B11 | Baja | Al pasar de 100 líneas, el editor revierte todo el contenido y mueve el cursor. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B12 | Baja | El botón de tema siempre dice "Tema oscuro", aunque ya esté activo. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B13 | Baja | El enlace al compilador usa `.logo`: mismo color que el texto, sin subrayado. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B14 | Baja | La paleta oscura está escrita dos veces por archivo. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B15 | Baja | Remiten a `docs/plugin-flujo/`, que no existe. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B16 | Baja | Sigue la instrucción de borrar tres ramas que ya se borraron en la fase 0. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B17 | Baja | Sin pruebas de `'\n'`/`'\t'`, asignación compuesta float, retorno float, prototipos ni ancho/precisión de `printf`. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B18 | Baja | "Próximamente" está sobre las tres tarjetas, incluida la de C que ya funciona. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B19 | Baja | Describe `.claude/` pero no `.opencode/commands/auditoria.md`. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |
| B20 | Baja | Ante un error, `run()` devuelve `steps: []` aunque la ejecución tenga pasos. | [#21](https://github.com/hfmarianoe/chuchulucos/pull/21) |

## Notas de la tanda 1

- **B6 queda resuelto:** el mensaje ya usa `this.maxSteps`, no un número escrito a mano.
- **Límite de pasos:** la tanda subió el límite a 50 000. La auditoría sugería corregir el mensaje, no el límite. La PR documenta la razón (memoria de la traza). Revisado el 24 de octubre de 2026: 48 004 pasos usan 29 MB y 0,13 s, así que el tope es adecuado.
- **Fuera de la auditoría:** la PR añade barras de medición en el editor y cambia el comportamiento de la tecla Tab. Revisar si se quiere mantener.

## Verificación

- `node --test tests/*.test.js` en `a1d6b9a` (24 de octubre de 2026): 112 pruebas, todas pasan, sin skips.
