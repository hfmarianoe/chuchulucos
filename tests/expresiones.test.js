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

// M8: el tipo de una llamada o de una asignación decide si la división es float (igual que gcc).
test('M8 una llamada a función float divide como float', () => {
  const r = run('float mitad() { return 1.5; }\nint main(){ printf("%f", mitad() / 2); return 0; }');
  assert.strictEqual(r.ok, true, r.error);
  assert.strictEqual(r.output, '0.750000');
});

test('M8 una asignación float divide como float', () => {
  const r = run('int main(){ float x; printf("%f", (x = 3) / 2); return 0; }');
  assert.strictEqual(r.ok, true, r.error);
  assert.strictEqual(r.output, '1.500000');
});
