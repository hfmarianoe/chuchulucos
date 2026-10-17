---
name: flujo-desarrollo
description: Flujo de desarrollo asistido por modelos con verificación antes de revisión. Usar al programar una página o app con varios modelos en paralelo, o al configurar ese flujo.
---
# Flujo de desarrollo

Fuente de verdad: `docs/plugin-flujo/spec.md` del proyecto.

Reglas que no se rompen:
- La verificación (lint, typecheck, build, test) corre antes de cualquier revisión por modelo.
- El revisor nunca es un modelo que esté programando en el mismo lote.
- Nunca se imprime el valor de una clave. Solo se detecta si la variable existe.
- No hay merge automático. La integración termina en PR.
- Los hallazgos de una auditoría se verifican contra el código antes de reportarse.
