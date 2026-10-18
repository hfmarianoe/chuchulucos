const test = require('node:test');
const assert = require('node:assert');
const { run, analizar } = require('../compilador-c/interp.js');

test('analizar cuenta variables globales, locales, de for y parámetros', () => {
  const r = analizar('int g = 1;\nint f(int x) { return x; }\nint main(){ int a; int b=1; for(int i=0;i<3;i++){ } return 0; }');
  assert.strictEqual(r.variables, 5); // g, x (parámetro), a, b e i (del for)
});

test('analizar cuenta los niveles de anidamiento de bucles e ifs', () => {
  const r = analizar('int main(){ for(int i=0;i<3;i++){ if(i>0){ while(0){} } } return 0; }');
  assert.strictEqual(r.anidamiento, 3);
});

test('una cadena else if no añade niveles de anidamiento', () => {
  const r = analizar('int main(){ int x=0; if(x==1){ } else if(x==2){ } else if(x==3){ } return 0; }');
  assert.strictEqual(r.anidamiento, 1);
});

test('run reporta la profundidad de llamadas: main más cinco llamadas recursivas', () => {
  const r = run('int fact(int n) { if (n <= 1) return 1; return n * fact(n - 1); }\nint main(){ printf("%d", fact(5)); return 0; }');
  assert.strictEqual(r.profundidad, 6);
});
