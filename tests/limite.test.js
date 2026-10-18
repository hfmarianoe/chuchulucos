const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

// A6: 5000 iteraciones de un bucle válido no deben abortar por "bucle infinito".
test('A6 bucle for de 5000 iteraciones completa', () => {
  const r = run(`int main(){ int total=0; for(int i=0;i<5000;i++){ total += 1; } printf("%d\\n", total); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '5000\n');
});

// El límite cubre bucles legítimos con cuerpo de varias sentencias (≈25 000 pasos).
test('A6 bucle de 5000 iteraciones con tres sentencias completa', () => {
  const r = run(`int main(){ int t=0; int u=0; for(int i=0;i<5000;i++){ t+=1; u=t*2; if(u>0) u=u-1; } printf("%d\\n", t); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '5000\n');
});

// Un bucle realmente infinito sí debe detenerse con un mensaje de límite.
test('A6 bucle infinito sigue deteniéndose', () => {
  const r = run(`int main(){ while(1){ } return 0; }`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /paso/i);
});

// La página muestra los pasos usados y el límite: run() los devuelve.
test('run() reporta pasos usados y límite', () => {
  const ok = run('int main(){ int t=0; for(int i=0;i<10;i++){ t+=1; } return 0; }');
  assert.strictEqual(ok.limite, 50000);
  assert.ok(ok.pasos > 0 && ok.pasos < 50000);
  const mal = run('int main(){ while(1){ } return 0; }');
  assert.strictEqual(mal.limite, 50000);
  assert.ok(mal.pasos > 50000);
});
