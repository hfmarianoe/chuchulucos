const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');
const { programas } = require('./casos.js');

for (const caso of programas) {
  test(`${caso.id} ${caso.nombre}`, () => {
    const r = run(caso.codigo);
    if (caso.error) {
      assert.strictEqual(r.ok, false, 'debía fallar');
      assert.match(r.error, new RegExp(caso.error));
      assert.strictEqual(r.output, caso.salida, 'debe conservar la salida previa al error');
    } else {
      assert.strictEqual(r.ok, true, `falló: ${r.error}`);
      assert.strictEqual(r.output, caso.salida);
    }
  });
}
