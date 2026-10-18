const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

// M4: scanf no está soportado y debe decirlo con su línea, no un error de parseo.
test('M4 scanf da "scanf no soportado" en su línea', () => {
  const r = run(`int main(){\n    int x = 0;\n    scanf("%d", &x);\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /scanf no soportado/);
  assert.strictEqual(r.errorLine, 3);
});
