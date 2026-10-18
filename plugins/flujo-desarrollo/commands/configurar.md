---
description: Configura el flujo de desarrollo (wizard de 7 pasos)
---
Configura el flujo en el orden del spec (`docs/plugin-flujo/spec.md`). Antes de preguntar, corre `bash "${CLAUDE_PLUGIN_ROOT}/scripts/detectar-claves.sh"` para saber qué APIs están disponibles. Nunca muestres valores de claves.

Pasos y defaults:
1. Estudio: solo Claude (Haiku, Sonnet, Opus). Default **Haiku**.
2. Plan: Claude + APIs disponibles. Default **Sonnet**.
3. Slots en paralelo: default **3**. Máximo 5 (local) o 3 (nube).
4. Modelo por slot: Claude + APIs disponibles. Default **Sonnet**. Repetir modelo está permitido.
5. Revisión: Claude + APIs disponibles. Default **Sonnet**.
6. Administrador del lote siguiente: solo Claude. Default **Sonnet**.
7. Auditoría general: Claude + APIs disponibles. Default **Opus**. Frecuencia: semanal por default, en ambos proyectos.

Regla de paralelo: los modelos distintos usados en programación deben dejar al menos uno libre para revisión. Con solo Claude, como máximo 2 modelos distintos en programación. Bloquea en el paso 5 los modelos ya usados en programación con la leyenda "en uso en programación".

Al terminar, escribe la configuración en `.flujo/config.json` del proyecto y confirma antes de ejecutar.
