const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const carpeta = path.join(__dirname, '..', 'compilador-c');
const pagina = fs.readFileSync(path.join(carpeta, 'index.html'), 'utf8');

// B1: el intérprete se reparte en archivos que la página carga en orden, sin build.
test('B1 cada parte del intérprete existe como archivo', () => {
  for (const f of ['lexico.js', 'parser.js', 'interprete.js', 'interp.js']) {
    assert.ok(fs.existsSync(path.join(carpeta, f)), `falta ${f}`);
  }
});

test('B1 la página carga las partes en el orden de dependencias', () => {
  const orden = ['lexico.js', 'parser.js', 'interprete.js', 'interp.js'];
  const posiciones = orden.map(f => pagina.indexOf(`src="${f}"`));
  posiciones.forEach((p, i) => assert.ok(p > 0, `la página no carga ${orden[i]}`));
  assert.deepStrictEqual([...posiciones].sort((a, b) => a - b), posiciones);
});
