const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

const salida = (codigo) => {
  const r = run(codigo);
  assert.strictEqual(r.ok, true, r.error);
  return r.output;
};

test('printf acepta un código de carácter numérico como formato', () => {
  assert.strictEqual(salida('int main(){ printf(65); return 0; }'), 'A');
});

test('printf acepta una variable de tipo char como formato', () => {
  assert.strictEqual(salida('int main(){ char c = 66; printf(c); return 0; }'), 'B');
});

test('printf acepta un arreglo de caracteres como formato', () => {
  assert.strictEqual(salida('int main(){ char s[] = "ab%c\\n"; printf(s, 67); return 0; }'), 'abC\n');
});

test('printf con cadena literal y %s aplicado a un código numérico', () => {
  assert.strictEqual(salida('int main(){ printf("%s|", 65); return 0; }'), 'A|');
});

test('putchar devuelve el código del carácter escrito, no el argumento original', () => {
  assert.strictEqual(salida('int main(){ int x = putchar(321); printf("%d", x); return 0; }'), 'A65');
});

test('putchar con un carácter devuelve su código', () => {
  assert.strictEqual(salida('int main(){ printf("%d", putchar(65)); return 0; }'), 'A65');
});

test('un especificador printf no soportado sigue produciendo error', () => {
  const r = run('int main(){ printf("%x", 1); return 0; }');
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Formato printf no soportado/);
});

// B9: printf valida ancho, precisión y argumentos con mensajes del intérprete, no de JavaScript.
test('B9 una precisión mayor de 100 da error claro del intérprete', () => {
  const r = run('int main(){ printf("%.200f", 1.0); return 0; }');
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Precisión de printf fuera de rango/);
  assert.strictEqual(r.errorLine, 1);
});

test('B9 un ancho mayor de 1000 da error claro del intérprete', () => {
  const r = run('int main(){ printf("%1001d", 1); return 0; }');
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Ancho de printf fuera de rango/);
});

test('B9 precisión 100 y ancho 1000 siguen siendo válidos', () => {
  const r = run('int main(){ printf("%.100f|%1000d", 1.0, 1); return 0; }');
  assert.strictEqual(r.ok, true, r.error);
  assert.strictEqual(r.output.length, 102 + 1000 + 1);
});

test('B9 un %s sin argumento da error claro, no "undefined"', () => {
  const r = run('int main(){ printf("%s"); return 0; }');
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /falta un argumento para %s/);
  assert.strictEqual(r.errorLine, 1);
});
