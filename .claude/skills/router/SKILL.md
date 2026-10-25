---
name: router
description: Clasifica los pendientes de AUDITORIA.md en fáciles, intermedios y difíciles, y genera un prompt copiable para resolverlos en una sesión en la nube con los proveedores de CLAUDE.md. Úsala cuando se pida /router, repartir los pendientes de la auditoría, o preparar la sesión en línea que los resuelve.
---

# /router

Lee `AUDITORIA.md`, clasifica cada pendiente abierto y entrega un prompt listo para copiar en una sesión en la nube.

## Modelo y esfuerzo

- Esta skill corre en **Haiku, esfuerzo alto**. Si la sesión no está en Haiku, avisa al usuario que cambie con `/model claude-haiku-5-5` antes de continuar; no puedes cambiarlo tú.
- Los trabajadores del prompt usan: fáciles → **Sonnet, esfuerzo medio** (`claude-sonnet-5-5`); difíciles → **Opus** (`claude-opus-5-5`); intermedios → modelos gratuitos de OrcaRouter, NVIDIA y OpenRouter en paralelo.

## Paso 1: leer los pendientes

1. Lee `AUDITORIA.md` completo.
2. Toma solo las filas de la tabla **"Pendientes abiertos"**. Ignora las de "Resueltos" y las notas.
3. Si no hay pendientes, dilo y termina. No inventes pendientes.
4. Lee `CLAUDE.md` para confirmar los proveedores y modelos vigentes. Si algún proveedor pedido no aparece ahí (por ejemplo NVIDIA), dilo en la salida y no inventes IDs de modelo: deja el paso como "elegir un modelo gratuito vigente de ese proveedor" y marca la pregunta.

## Paso 2: clasificar

Usa esta regla para cada pendiente:

- **Fácil**: un solo archivo, cambio de texto, enlace, configuración, documentación o CSS sin lógica. No cambia comportamiento de programa. Ejemplos: un texto de botón, mover un aviso, quitar un bloque, añadir una línea a un README.
- **Intermedio**: cambio de lógica en un archivo o dos, con pruebas nuevas, sin cambiar tipos ni la gramática. Ejemplos: un mapa de escapes en el léxico, validar argumentos de `printf`, un error por función repetida.
- **Difícil**: cambia reglas del lenguaje entre módulos (sistema de tipos, parser, semántica de llamadas), o exige una decisión de diseño. Ejemplos: propagar el tipo de retorno y el tipo del lvalue por el intérprete, rechazar o registrar prototipos en el parser.

Si dudas entre dos niveles, sube al más alto y escribe por qué. Si dos pendientes tocan las mismas funciones, ponlos en el mismo nivel y en la misma tanda, para que un solo trabajador los haga en orden.

## Paso 3: separar por archivo

Los intermedios que tocan el mismo archivo no pueden ir en paralelo con el mismo archivo. Asigna cada uno a un trabajador distinto solo si sus archivos no se cruzan; si se cruzan, van al mismo trabajador y en orden.

## Paso 4: generar el prompt

Muestra primero una tabla con ID, severidad, nivel, archivos y trabajador asignado. Después muestra el prompt dentro de **un bloque de código con la etiqueta `text`**, para que el usuario lo copie con un clic.

El prompt debe incluir, en este orden:

1. **Contexto:** repo `hfmarianoe/chuchulucos`, base `main`, qué es el sitio, que `AUDITORIA.md` es la fuente de verdad.
2. **Alcance exacto:** solo los IDs listados. Nada de refactors ni de pendientes de otras tandas.
3. **Orden:** primero fáciles, luego intermedios en paralelo, luego difíciles. Los difíciles arrancan cuando los intermedios de sus mismos archivos terminen.
4. **Por cada pendiente:** ID, archivo:línea, hallazgo, arreglo propuesto, nivel, modelo asignado y criterio de aceptación (qué prueba debe pasar).
5. **Revisión:** cada cambio lo revisa Codex (`gpt-5.3-codex`, OpenAI directo), DeepSeek (`deepseek-v4-pro`, directo) y OpenAI. Un cambio no entra si cualquier revisor marca un problema sin resolver.
6. **Pruebas:** `node --test tests/*.test.js` debe pasar entero, más las pruebas nuevas. Sin `skip` ni `todo`.
7. **Entrega:** rama `fix/pendientes-auditoria-2026-10-24`, un commit por pendiente en español, terminando con `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`. Abrir una PR contra `main`. **No fusionar.** Quitar de `AUDITORIA.md` los pendientes resueltos.
8. **Reporte:** en la sesión, al terminar cada etapa: qué se corrigió, qué pruebas pasan, qué dijo cada revisor y el enlace a la PR.
9. **Reglas de proveedores:** cada modelo se llama solo desde su proveedor directo (CLAUDE.md). No llamar `deepseek/*` desde OpenRouter. No llamar `gpt-*` desde OpenRouter. Usar OpenRouter solo con modelos `:free`.
10. **Grafo:** si existe `graphify-out/graph.json`, consultarlo con `graphify query` antes de leer archivos, y ejecutar `graphify update .` al terminar.

## Reglas de salida

- No ejecutes cambios en el repo ni lances sesiones desde esta skill. Solo clasificas y generas el prompt.
- Si un pendiente no es claro o le falta criterio de aceptación, márcalo y pregunta antes de incluirlo.
- Si hay una pregunta abierta sobre proveedores, muéstrala al final, fuera del bloque de prompt.
