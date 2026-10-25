const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const readme = fs.readFileSync(path.join(raiz, 'README.md'), 'utf8');
const paginaC = fs.readFileSync(path.join(raiz, 'compilador-c', 'index.html'), 'utf8');

// M12: el README debe listar todos los archivos que la página de C carga para publicarla.
test('M12 el README nombra cada script que carga la página de C', () => {
  const scripts = [...paginaC.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(scripts.length >= 4, 'la página de C debe cargar sus scripts');
  for (const archivo of scripts) {
    assert.match(readme, new RegExp('compilador-c/' + archivo.replace('.', '\\.')));
  }
});

test('M12 la publicación indica que se sube la carpeta compilador-c/ completa', () => {
  assert.match(readme, /la carpeta `compilador-c\/` completa/);
  assert.match(readme, /no basta con `interp\.js`|no solo `interp\.js`/);
});

// B19: el README debe describir el comando de OpenCode, que ahora existe.
test('B19 el README describe .opencode/commands/auditoria.md', () => {
  assert.ok(fs.existsSync(path.join(raiz, '.opencode', 'commands', 'auditoria.md')));
  assert.match(readme, /`\.opencode\/commands\/auditoria\.md`/);
});
