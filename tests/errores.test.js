const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

// A4: los errores de sintaxis deben traer la línea en una propiedad estructurada.
test('A4 error de sintaxis expone errorLine', () => {
  const r = run(`int main() {\n    int x = 1\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.errorLine, 3);
});
