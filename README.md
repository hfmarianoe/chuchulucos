# chuchulucos.shop

Sitio estático de presentación de las apps de Chuchulucos. Se publica en HostGator.

## Estructura

- `index.html`: página principal, con la lista de apps y enlaces a ellas.
- `style.css`: estilos de la página principal (modo claro y oscuro).
- `compilador-c/`: app de C (editor y depurador paso a paso).
  - `compilador-c/index.html`: página de la app.
  - `compilador-c/lexico.js`, `compilador-c/parser.js` e `compilador-c/interprete.js`: intérprete de C, en tres partes.
  - `compilador-c/interp.js`: API que usa la página (`run` y `analizar`).
- `tests/`: pruebas de Node (`*.test.js`) del intérprete y de los HTML.
- `plugins/flujo-desarrollo/`: plugin de Claude Code para el flujo de desarrollo asistido por modelos. No forma parte del sitio.
- `AUDITORIA.md`: pendientes abiertos de la auditoría.
- `.opencode/commands/auditoria.md`: comando `/auditoria` de OpenCode, que ejecuta la skill `auditoria` (sincroniza con GitHub, menú de niveles y auditoría en solo lectura).
- `herramientas/` y `docs/`: instalador y guías de markitdown, YouTube Agent Skill, Ponytail, Graphify y Agent Skills, para local y para el chat.
- `.claude/`: hook de inicio de sesión (instala markitdown en la nube), skills `yt-*` de YouTube el plugin Ponytail, las skills de Addy Osmani, Graphify, las reglas de Karpathy, i-have-adhd y Claude Octopus. Ver `docs/`.

## Apps

- Programación en C: en el repo, en `compilador-c/`.
- Generador de códigos QR y pseudocódigo: previstas, todavía no están en el repo.

## Pruebas

Requiere Node.js. Desde la raíz del repo:

```sh
node --test tests/*.test.js
```

## Publicar en HostGator

El sitio es estático. Subir a `public_html/` (por cPanel o FTP):

- `index.html`
- `style.css`
- la carpeta `compilador-c/` completa: `index.html`, `lexico.js`, `parser.js`, `interprete.js` e `interp.js`. Subir la carpeta entera; no solo `interp.js`.

No subir `tests/`, `plugins/`, `herramientas/`, `docs/`, `.claude/` ni los archivos de control del repo (`AUDITORIA.md`, `CLAUDE.md`).
