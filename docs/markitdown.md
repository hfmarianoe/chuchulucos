# markitdown

Herramienta de [microsoft/markitdown](https://github.com/microsoft/markitdown) (Python, licencia MIT) que convierte PDF, Word, Excel, PowerPoint, HTML, imágenes, audio y más a Markdown.

## En el chat (sesiones de Claude Code en la nube)

El hook `.claude/hooks/session-start.sh` la instala al iniciar cada sesión. No hay que hacer nada. En el chat basta con pedir, por ejemplo: «convierte `archivo.pdf` a Markdown con markitdown».

## En local

Requiere Python 3.10 o superior. Desde la raíz del repo:

```sh
./herramientas/instalar-markitdown.sh
```

Usa `pipx` si está disponible; si no, `pip`. Es seguro ejecutarlo varias veces.

## Uso

```sh
markitdown archivo.pdf > archivo.md
markitdown archivo.docx -o archivo.md
cat archivo.html | markitdown > archivo.md
```

Desde Python:

```python
from markitdown import MarkItDown
print(MarkItDown().convert("archivo.xlsx").text_content)
```

## Notas

- Se instala con `markitdown[all]` (todos los formatos). Para uno solo: `pip install 'markitdown[pdf]'`.
- No forma parte del sitio: no subir `herramientas/`, `docs/` ni `.claude/` a `public_html/`.
