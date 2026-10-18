const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');
const { expresiones } = require('./casos.js');

for (const [expr, esperado] of expresiones) {
  test(`${expr} = ${esperado}`, () => {
    const r = run(`int main(){ printf("%d", (${expr})); return 0; }`);
    assert.strictEqual(r.ok, true, `falló: ${r.error}`);
    assert.strictEqual(r.output, esperado);
  });
}
