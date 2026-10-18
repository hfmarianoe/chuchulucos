const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

// A5: los arreglos se pasan por referencia a las funciones, como en C.
test('A5 un parámetro arreglo modifica el arreglo del llamador', () => {
  const r = run(`void llena(int a[]){ a[0] = 9; }
int main(){ int v[2] = {1, 2}; llena(v); printf("%d %d\\n", v[0], v[1]); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '9 2\n');
});

test('A5 la referencia sobrevive a varias llamadas encadenadas', () => {
  const r = run(`void dentro(int b[]){ b[1] = 7; }
void fuera(int a[]){ dentro(a); }
int main(){ int v[3] = {0, 0, 0}; fuera(v); printf("%d\\n", v[1]); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '7\n');
});

test('A5 un parámetro escalar sigue pasándose por valor', () => {
  const r = run(`void cambia(int x){ x = 5; }
int main(){ int n = 1; cambia(n); printf("%d\\n", n); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '1\n');
});

test('A5 el arreglo pasado a una función se puede leer completo', () => {
  const r = run(`int suma(int a[], int n){ int s = 0; for (int k = 0; k < n; k++) s += a[k]; return s; }
int main(){ int v[4] = {1, 2, 3, 4}; printf("%d\\n", suma(v, 4)); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '10\n');
});

test('A5 un literal de cadena sigue funcionando como argumento char[]', () => {
  const r = run(`void imprime(char s[]){ printf("%s\\n", s); }
int main(){ imprime("hola"); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, 'hola\n');
});

test('A5 el arreglo del llamador no cambia al leerlo como valor completo', () => {
  const r = run(`int main(){ int v[2] = {4, 5}; int w[2]; w[0] = v[0]; printf("%d %d\\n", w[0], v[1]); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '4 5\n');
});
