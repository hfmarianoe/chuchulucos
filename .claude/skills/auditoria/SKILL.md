---
name: auditoria
description: Auditoría de chuchulucos.shop en tres fases — sincroniza con GitHub (fusiona PR abiertos y borra ramas ya fusionadas), muestra un menú de niveles y ejecuta la auditoría elegida en solo lectura con informe priorizado y archivo:línea. Úsala cuando se pida auditar, revisar a fondo, buscar problemas, evaluar el estado del proyecto, limpiar ramas o preparar una publicación, aunque no se diga "auditoría" ni se nombre la skill.
---

# Auditoría del proyecto

Tres fases, en este orden:

0. **Sincronizar** con GitHub (la única fase que escribe en git).
1. **Elegir** el nivel de auditoría en un menú.
2. **Auditar** en solo lectura y entregar el informe.

La fase 0 existe porque auditar una copia vieja desperdicia el informe entero:
los números de línea no coinciden y los hallazgos ya pueden estar resueltos. La
fase 2 es de solo lectura porque una auditoría que arregla lo que encuentra deja
de ser verificable: nadie puede confirmar el estado original.

## Fase 0 — Sincronizar con GitHub

Trabaja en `main` y con el árbol limpio de archivos modificados. Los archivos
sin seguimiento no estorban salvo que choquen con un merge.

1. **Trae el estado remoto.**

   ```sh
   git fetch --all --prune
   gh auth status
   ```

   Si `gh` no está disponible o no hay sesión, salta los pasos que dependen de
   GitHub, dilo en el informe y sigue con `git`.

2. **Compara local con remoto.**

   ```sh
   git status --short --branch
   git rev-list --left-right --count HEAD...origin/main
   ```

   - Limpio y atrasado → `git pull --ff-only`.
   - Limpio y al día → nada que hacer.
   - Con archivos modificados → **detente y pregunta**. No hagas `stash` ni
     `reset` por tu cuenta: puedes borrar trabajo de la persona.
   - Divergido (commits locales y remotos) → pregunta antes de tocar nada.

3. **Fusiona lo que falta.** Lista los PR abiertos:

   ```sh
   gh pr list --state open --json number,title,headRefName,mergeable,files
   ```

   Para cada uno, enseña título y tamaño del cambio. Fusiónalo con
   `gh pr merge <número> --merge --delete-branch` solo si:

   - está en `main` y no tiene conflictos,
   - el cambio es acotado o está descrito con claridad (documentación, un
     arreglo puntual), y
   - después de fusionar corren las pruebas.

   Si hay conflicto, el cambio es grande o no entiendes qué hace, no lo fusiones:
   anótalo como pendiente y sigue. Una fusión a ciegas convierte la auditoría en
   una fuente de errores nuevos.

4. **Borra ramas ya fusionadas.** Solo las que están contenidas en `main`:

   ```sh
   git branch -r --merged origin/main
   git branch -r --no-merged origin/main
   git push origin --delete <rama>
   ```

   Requisitos para borrar: su PR figura como `MERGED` (o sus commits están en
   `main`), no es `main` ni `HEAD`, no es la rama actual y no tiene trabajo sin
   fusionar. Nunca borres una rama de `--no-merged`: ahí puede haber trabajo que
   solo existe en ese remoto.

   Las ramas `claude/*` suelen ser sesiones en la nube que pueden seguir vivas:
   si están fusionadas, menciónalas y borra solo si la persona lo confirma.

5. **Verifica después de fusionar.** Corre `node --test tests/*.test.js`. Si
   quedan en rojo por la fusión, para y repórtalo antes de auditar: si no, el
   informe culpará al código de un daño que hizo el merge.

6. **Reporta la sincronización** en un bloque corto antes del menú:

   ```text
   Sincronización
   - Local: <al día | actualizado de X a Y>
   - PR fusionados: #15 <título>
   - Ramas borradas: fix/pendientes-b2-b7, ...
   - Pendiente: #12 <título> (conflicto)
   ```

Si no hay nada que sincronizar, dilo en una línea y pasa al menú. No conviertas
la fase 0 en una investigación: es un trámite, no el informe.

## Fase 1 — Menú de niveles

Pregunta una sola vez, con la herramienta de preguntas del entorno, y ofrece
estos niveles:

| Nivel | Qué revisa | Cuándo |
|---|---|---|
| **Completa** | Las 9 dimensiones de la fase 2 | Primera auditoría, o duda de qué elegir |
| **Código** | Corrección, seguridad, rendimiento y pruebas | Toca el intérprete o la lógica |
| **Front** | Accesibilidad, HTML/CSS, enlaces y publicación | Toca la página o los estilos |
| **Pruebas** | Cobertura, calidad y huecos de `tests/` | Antes de confiar en la suite |
| **Rápida** | Todo, pero solo reporta severidad Alta | Antes de publicar, con prisa |
| **Documentación** | README y AUDITORIA.md contra la realidad | Después de mover archivos o cerrar pendientes |

Reglas del menú:

- Si el usuario ya eligió nivel (`/auditoria codigo`, «auditoría rápida»), no
  preguntes: respétalo.
- Si el entorno no tiene herramienta de preguntas, imprime el menú como texto y
  espera la respuesta.
- Una pregunta, no un interrogatorio. El nivel ya define el resto.

## Fase 2 — Auditoría (solo lectura)

No modifiques código, no hagas commits y no abras PR en esta fase. Si piden
arreglar algo a mitad, termina el informe y luego pregunta qué corregir.

Cada afirmación se comprueba en el código antes de escribirse y cita
`archivo:línea`. Un falso positivo cuesta más que un hallazgo que falte: obliga
a investigar algo que no existe. Lo que dependa de algo fuera del repo va a
"a verificar", no a hallazgo.

Antes de empezar:

1. `git status --short --branch` y `git log --oneline -1`: anota rama y commit,
   porque los números de línea solo valen para ese estado.
2. Lee `AUDITORIA.md`. Lo que figura como resuelto no se vuelve a reportar. Si
   encuentras una regresión, dilo como regresión y cita el ID original.
3. Corre `node --test tests/*.test.js` y guarda el resultado real. Si no puedes
   correrlas, dilo; nunca inventes el número.
4. Lee completos los archivos en alcance. Nada de muestreo: los errores del
   intérprete viven en los caminos raros.
5. Si existe `graphify-out/graph.json`, usa `graphify query` antes de explorar a
   ciegas.

### Alcance por nivel

| Nivel | Dimensiones |
|---|---|
| Completa | 1 a 9, más la fase 0 |
| Código | 1, 2, 3 y 6 |
| Front | 4, 5 y 8 |
| Pruebas | 6 |
| Rápida | Las 9, pero solo se reportan las Altas |
| Documentación | 7 y 9 |

Archivos en alcance: `index.html`, `style.css`, `compilador-c/` (`index.html`,
`interp.js`, `lexico.js`, `parser.js`, `interprete.js`), `tests/`, `README.md` y
`plugins/flujo-desarrollo/`.

Fuera de alcance: `docs/` y `herramientas/` (guías e instalador de terceros),
`.claude/`, `.opencode/`, `.omc/`, `graphify-out/`, `node_modules/` y
`.claude/worktrees/`. Si algo de ahí afecta al sitio, menciónalo en una línea.

### 1. Corrección del intérprete

Errores reales en léxico, parser y evaluación: precedencia, promoción de tipos,
alcance de variables, arreglos y punteros, retorno de funciones, `scanf` y
`printf`, división por cero, desbordes. Si dudas de un caso, ejecútalo en Node
antes de reportarlo.

### 2. Seguridad

El código del usuario corre en el navegador de quien visita la página:

- ¿Se usa `eval`, `new Function` o `innerHTML` con texto del programa?
- ¿Hay bucles o recursión sin tope que congelen la pestaña?
- ¿Se puede agotar la memoria con arreglos o cadenas grandes?
- ¿Los errores exponen rutas, claves o detalles internos?

### 3. Rendimiento

Copias innecesarias, trabajo repetido en cada paso, crecimiento sin control de
la traza, tamaño de lo que se carga al abrir la página.

### 4. Accesibilidad y UX

Teclado (Tab, Enter, Escape), foco visible, contraste en tema claro y oscuro,
`aria` en editor y traza, etiquetas de botones, anuncio de errores a lectores de
pantalla, comportamiento en móvil.

### 5. HTML, CSS y enlaces

Enlaces relativos que rompan en subcarpeta o con `file://`, `meta`, `title`,
jerarquía de encabezados, HTML inválido, CSS duplicado o muerto, `color-scheme`
y `prefers-color-scheme`.

### 6. Pruebas

Qué cubren y qué no: errores del parser, límites, entradas vacías, pruebas que
pasan por azar y pruebas atadas a detalles internos. No pidas cobertura alta;
pide que atrapen lo que de verdad se puede romper.

### 7. Documentación contra realidad

¿`README.md` describe la estructura, los comandos y la publicación tal como
están hoy? Señala lo que ya no es cierto, con la línea.

### 8. Publicación

Qué archivos hay que subir a `public_html/` y si la lista del README sigue
siendo correcta. Si algo se publica sin querer (o falta), dilo. Lo que dependa
de HostGator va a "a verificar".

### 9. Consistencia y deuda

Nombres y estilo entre archivos, idioma de los textos, comentarios obsoletos,
código muerto y duplicación que ya duela.

## Severidad

- **Alta:** rompe la app, pierde datos, expone a quien la usa o impide publicar.
- **Media:** comportamiento incorrecto en casos normales, riesgo de seguridad
  acotado, o algo que confunde a quien usa la app.
- **Baja:** mantenimiento, estilo, documentación, comodidad.

Ante la duda entre dos niveles, elige el menor y explica el riesgo real.

## Formato del informe

En el chat, en español:

1. **Resumen** en 5 líneas: estado general, riesgo principal, qué haría primero.
2. **Hallazgos** en tabla por severidad: `ID | Severidad | Archivo:línea | Qué
   pasa | Por qué importa | Arreglo propuesto`.
3. **Top 5 por urgencia**, con el motivo en una línea.
4. **Victorias rápidas**: arreglos de menos de 15 minutos.
5. **Lo que está bien**: máximo 5 puntos.
6. **A verificar fuera del repo**: qué, dónde y cómo.
7. **Pruebas**: resultado tal cual salió, con el comando usado.

En nivel Rápida omite las secciones 3 a 5 y deja solo Altas, pruebas y
"a verificar". En nivel Documentación, la tabla reemplaza las dimensiones por
archivo y línea del README.

## Cierre

Pregunta si quiere:

- guardar el informe en `docs/auditorias/<AAAA-MM-DD>.md` (crea la carpeta si
  acepta), y
- actualizar `AUDITORIA.md` con los pendientes abiertos y sus IDs.

No corrijas nada en la misma sesión salvo que lo pida después de leer el
informe. Los IDs nuevos continúan la serie de `AUDITORIA.md`.
