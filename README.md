# chuchulucos.shop

Sitio estático de presentación de las apps de Chuchulucos. Se publica en HostGator.

## Estructura

- `index.html`: página principal, con la lista de apps y enlaces a ellas.
- `style.css`: estilos de la página principal (modo claro y oscuro).
- `compilador-c/`: app de C (editor y depurador paso a paso).
  - `compilador-c/index.html`: página de la app.
  - `compilador-c/interp.js`: intérprete de C que usa la página.
- `tests/`: pruebas de Node (`*.test.js`) del intérprete y de los HTML.
- `plugins/flujo-desarrollo/`: plugin de Claude Code para el flujo de desarrollo asistido por modelos. No forma parte del sitio.
- `AUDITORIA.md`: pendientes abiertos de la auditoría.
- `herramientas/` y `docs/markitdown.md`: instalador y guía de markitdown (convierte documentos a Markdown), para local y para el chat. Ver `docs/markitdown.md`.
- `.claude/`: hook de inicio de sesión que instala markitdown en la nube.

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
- la carpeta `compilador-c/` completa (`index.html` e `interp.js`)

No subir `tests/`, `plugins/`, `herramientas/`, `docs/`, `.claude/` ni los archivos de control del repo (`AUDITORIA.md`, `CLAUDE.md`).
