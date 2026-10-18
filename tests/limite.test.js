const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

// A6: 5000 iteraciones de un bucle válido no deben abortar por "bucle infinito".
test('A6 bucle for de 5000 iteraciones completa', () => {
  const r = run(`int main(){ int total=0; for(int i=0;i<5000;i++){ total += 1; } printf("%d\\n", total); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '5000\n');
});

// Un bucle realmente infinito sí debe detenerse con un mensaje de límite.
test('A6 bucle infinito sigue deteniéndose', () => {
  const r = run(`int main(){ while(1){ } return 0; }`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /paso/i);
});
