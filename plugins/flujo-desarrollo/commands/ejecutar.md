---
description: Ejecuta un lote del flujo (preflight, estudio, plan, programación, verificación, corrección, revisión, integración, lote siguiente)
---
Corre un lote del flujo con la configuración de `.flujo/config.json`. Si no existe, pide `/flujo-desarrollo:configurar`.

Secuencia:
0. Preflight: repo limpio, claves de los modelos elegidos presentes (`scripts/detectar-claves.sh`), comandos de verificación existentes. Si falta algo, detente y di qué.
1. Estudio con el modelo del paso 1.
2. Plan con el modelo del paso 2. Tareas independientes; si dos tocan los mismos archivos, ejecútalas en secuencia y avisa.
3. Programación en paralelo, un slot por tarea, cada uno en su rama, con el modelo de su slot.
4. Verificación sin modelo: `bash "${CLAUDE_PLUGIN_ROOT}/scripts/verificar.sh"` en cada rama. Si falla, pasa a corrección.
5. Corrección: el mismo slot recibe el error. Máximo 2 intentos. Si agota, marca la tarea y sigue.
6. Revisión con el modelo del paso 5, distinto de los modelos de programación. Si rechaza, vuelve a corrección (cuenta como intento).
7. Integración: abre PR por rama aprobada. Espera CI y preview. No hagas merge.
8. Lote siguiente: el modelo del paso 6 lee resultados y propone la siguiente tanda; vuelve al paso 2.
9. Auditoría: según la frecuencia configurada.

Escribe el informe del lote en `docs/plugin-flujo/lotes/`.
