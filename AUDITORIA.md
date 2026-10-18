# Pendientes de la auditoría — chuchulucos.shop

- **Origen:** auditoría del 18 de octubre de 2026 (commit `fbf7813`).
- **Estado:** la tanda 1 se fusionó en `main` con la PR [#7](https://github.com/hfmarianoe/chuchulucos/pull/7). Este archivo lista solo lo que sigue abierto.
- **Líneas:** las referencias son del código actual de `main` (`1503a8b`).

## Pendientes

| ID | Severidad | Hallazgo | Ubicación |
|---|---|---|---|
| B1 | Baja | El intérprete sigue en un solo archivo, sin módulos ni build | `compilador-c/interp.js` |
| B2 | Baja | Código muerto: ramas de `builtinPrintf` inalcanzables, `builtinPutchar` devuelve el argumento y no el carácter, y `isArray` es un envoltorio | `compilador-c/interp.js:1136`, `:1231`, `:882` |
| B3 | Baja | La app de C no tiene enlace desde la página principal y el README está desactualizado | `index.html`, `README.md` |
| B4 | Baja | `href="/"` rompe en subcarpeta o con `file://` | `index.html:12` |
| B5 | Baja | Colores fijos mezclados con variables; falta `color-scheme` y no hay interruptor de tema | `style.css`, `compilador-c/index.html` |
| B7 | Baja | `recordStep` copia todas las variables y la salida en cada paso | `compilador-c/interp.js:1246-1290` |
| B8 | Baja | Identidad de git sin configurar en este clon | — |

## Notas de la tanda 1

- **B6 queda resuelto:** el mensaje ya usa `this.maxSteps`, no un número escrito a mano.
- **Límite de pasos:** la tanda subió el límite a 50 000. La auditoría sugería corregir el mensaje, no el límite. La PR documenta la razón (memoria de la traza). Revisar si el valor es el adecuado.
- **Fuera de la auditoría:** la PR añade barras de medición en el editor y cambia el comportamiento de la tecla Tab. Revisar si se quiere mantener.

## Verificación

- `node --test tests/*.test.js`: 67 pruebas, todas pasan.
