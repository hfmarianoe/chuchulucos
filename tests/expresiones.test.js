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

// M9: en una asignación compuesta, float lo decide el tipo de la variable, no el valor (igual que gcc).
test('M9 x /= 3 con x float da 0.666667 aunque el valor sea entero', () => {
  const r = run('int main(){ float x = 2.0; x /= 3; printf("%f", x); return 0; }');
  assert.strictEqual(r.ok, true, r.error);
  assert.strictEqual(r.output, '0.666667');
});

test('M9 las compuestas sobre enteros siguen siendo enteras', () => {
  const r = run('int main(){ float y = 2.5; y /= 2; int i = 7; i /= 2; printf("%f|%d", y, i); return 0; }');
  assert.strictEqual(r.ok, true, r.error);
  assert.strictEqual(r.output, '1.250000|3');
});

// M9: un lvalue int sigue siendo entero aunque el lado derecho sea float (igual que gcc: 7|2|-6|4).
test('M9 un lvalue int con lado derecho float se trunca como en gcc', () => {
  const r = run('int main(){ int i = 7; i += 0.5; int j = 5; j /= 2.5; int k = -7; k += 0.5; int m = 3; m *= 1.5; printf("%d|%d|%d|%d", i, j, k, m); return 0; }');
  assert.strictEqual(r.ok, true, r.error);
  assert.strictEqual(r.output, '7|2|-6|4');
});
