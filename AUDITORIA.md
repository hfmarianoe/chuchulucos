# Auditoría — chuchulucos.shop

> **Instrucción para la próxima sesión en la nube:** antes de cualquier otra tarea, borra en GitHub estas ramas remotas, que ya están fusionadas en `main`: `fix/pendientes-b2-b7`, `fix/pendientes-b3-b4` y `fix/pendientes-b5`. Verifica primero con `git branch -r --merged origin/main` que cada una aparece, y no toques ninguna otra rama. Reporta el resultado en la sesión.

- **Origen:** auditoría del 18 de octubre de 2026 (commit `fbf7813`).
- **Estado:** no quedan pendientes abiertos. Todos los hallazgos de la auditoría están resueltos en `main`.
- **Líneas:** las referencias de la auditoría son del código de `fbf7813`; el código cambió al resolverse, así que ya no coinciden.

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
- **Límite de pasos:** la tanda subió el límite a 50 000. La auditoría sugería corregir el mensaje, no el límite. La PR documenta la razón (memoria de la traza). Revisar si el valor es el adecuado.
- **Fuera de la auditoría:** la PR añade barras de medición en el editor y cambia el comportamiento de la tecla Tab. Revisar si se quiere mantener.

## Verificación

- `node --test tests/*.test.js`: 112 pruebas, todas pasan, sin skips.
