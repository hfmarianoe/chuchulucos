const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

// A4: los errores de sintaxis deben traer la línea en una propiedad estructurada.
test('A4 error de sintaxis expone errorLine', () => {
  const r = run(`int main() {\n    int x = 1\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.errorLine, 3);
});

// M10: un prototipo no se acepta como función vacía; el error debe venir del intérprete, con su línea.
test('M10 un prototipo con parámetros da error claro con su línea', () => {
  const r = run('int f(int x);\nint main(){ return 0; }');
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Prototipo de 'f' no soportado/);
  assert.strictEqual(r.errorLine, 1);
});

test('M10 un prototipo sin parámetros también da error claro', () => {
  const r = run('int main(){ return g(); }\nint g();');
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Prototipo de 'g' no soportado/);
  assert.strictEqual(r.errorLine, 2);
});

// B10: una función definida dos veces es un error con la línea de la segunda definición.
test('B10 una función definida dos veces da error en la línea de la segunda', () => {
  const r = run('int suma(){ return 1; }\nint suma(){ return 2; }\nint main(){ return suma(); }');
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Función 'suma' ya definida/);
  assert.strictEqual(r.errorLine, 2);
});
