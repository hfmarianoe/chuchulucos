# Auditoría — chuchulucos.shop

- **Origen:** auditoría del 18 de octubre de 2026 (commit `fbf7813`) y auditoría del 24 de octubre de 2026 (commit `a1d6b9a`).
- **Estado:** 18 pendientes abiertos de la auditoría del 24 de octubre: 6 Medias (M7–M12) y 12 Bajas (B9–B20). Los hallazgos de la auditoría del 18 de octubre siguen resueltos.
- **Líneas:** las referencias de la auditoría del 24 de octubre son del código de `a1d6b9a`. Las del 18 de octubre son de `fbf7813` y ya no coinciden.
- **Informe completo:** [`docs/auditorias/2026-10-24.md`](docs/auditorias/2026-10-24.md).

## Pendientes abiertos — auditoría del 24 de octubre de 2026

| ID | Severidad | Archivo:línea | Hallazgo | Arreglo propuesto |
|---|---|---|---|---|
| M7 | Media | `compilador-c/lexico.js:115` | Los literales con escape (`'\n'`, `'\t'`, `'\0'`) se guardan como texto y valen 0/NaN; `putchar('\n')` imprime NUL. | Mapear a códigos (10, 9, 0, 92, 39, 34) y añadir pruebas. |
| M8 | Media | `compilador-c/interprete.js:294` | `getExprType` devuelve `int` para llamadas y asignaciones; el retorno `float` se pierde en expresiones. | En `Call`, usar `functions[nombre].returnType`; en `Assign`, el tipo del lvalue. |
| M9 | Media | `compilador-c/interprete.js:261` | `applyBinary` decide si es float por el valor, no por el tipo: `float x = 2.0; x /= 3;` da 0. | Pasar el tipo del lvalue a `applyBinary`. |
| M10 | Media | `compilador-c/parser.js:108` | Un prototipo `int f(int);` se acepta como función con cuerpo vacío; al llamarla falla con `block.stmts is not iterable`. | Rechazar el `;` como cuerpo con mensaje claro, o registrar el prototipo y validarlo. |
| M11 | Media | `compilador-c/index.html:405` | El `textarea` del editor no tiene nombre accesible: ni `label` ni `aria-label`. | `<label class="sr-only" for="code">Código C</label>`. |
| M12 | Media | `README.md:11` y `:37` | Dice que el intérprete es `interp.js` y que se suben `index.html` e `interp.js`; faltan tres archivos y la app no arranca. | Listar los cuatro archivos y aclarar que se sube la carpeta completa. |
| B9 | Baja | `compilador-c/interprete.js:573` | Ancho y precisión de `printf` sin validar; `%s` sin argumento imprime `undefined`. | Limitar precisión a 0-100 y ancho a 1000; validar argumentos faltantes. |
| B10 | Baja | `compilador-c/parser.js:45` | Una función repetida sobrescribe a la anterior sin avisar. | Error "función ya definida" con línea. |
| B11 | Baja | `compilador-c/index.html:547` | Al pasar de 100 líneas, el editor revierte todo el contenido y mueve el cursor. | Recortar solo el exceso o avisar antes de revertir. |
| B12 | Baja | `index.html:22`, `compilador-c/index.html:370` | El botón de tema siempre dice "Tema oscuro", aunque ya esté activo. | Actualizar `textContent` en `pintarTema()`. |
| B13 | Baja | `index.html:44` + `style.css:85` | El enlace al compilador usa `.logo`: mismo color que el texto, sin subrayado. | Clase propia con color de acento y subrayado. |
| B14 | Baja | `style.css:16`, `compilador-c/index.html:43` | La paleta oscura está escrita dos veces por archivo. | Definir los tokens una vez y aplicar el selector a ambos casos. |
| B15 | Baja | `plugins/flujo-desarrollo/README.md:3` (+ `configurar.md:4`, `auditar.md:9`, `ejecutar.md:18`) | Remiten a `docs/plugin-flujo/`, que no existe. | Añadir el spec o corregir las rutas; alinear con `docs/auditorias/`. |
| B16 | Baja | `AUDITORIA.md:3` | Sigue la instrucción de borrar tres ramas que ya se borraron en la fase 0. | Quitar el bloque. |
| B17 | Baja | `tests/builtins.test.js:27` | Sin pruebas de `'\n'`/`'\t'`, asignación compuesta float, retorno float, prototipos ni ancho/precisión de `printf`. | Un caso por hallazgo. |
| B18 | Baja | `index.html:29` | "Próximamente" está sobre las tres tarjetas, incluida la de C que ya funciona. | Moverla a las tarjetas de QR y pseudocódigo. |
| B19 | Baja | `README.md:16` | Describe `.claude/` pero no `.opencode/commands/auditoria.md`. | Añadir una línea. |
| B20 | Baja | `compilador-c/interp.js:38` | Ante un error, `run()` devuelve `steps: []` aunque la ejecución tenga pasos. | Devolver los pasos parciales o marcar el último. |

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

## Notas de la tanda 1

- **B6 queda resuelto:** el mensaje ya usa `this.maxSteps`, no un número escrito a mano.
- **Límite de pasos:** la tanda subió el límite a 50 000. La auditoría sugería corregir el mensaje, no el límite. La PR documenta la razón (memoria de la traza). Revisado el 24 de octubre de 2026: 48 004 pasos usan 29 MB y 0,13 s, así que el tope es adecuado.
- **Fuera de la auditoría:** la PR añade barras de medición en el editor y cambia el comportamiento de la tecla Tab. Revisar si se quiere mantener.

## Verificación

- `node --test tests/*.test.js` en `a1d6b9a` (24 de octubre de 2026): 112 pruebas, todas pasan, sin skips.
