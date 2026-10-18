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

// M5: un comentario de bloque sin cerrar se reporta en la línea donde empieza.
test('M5 comentario de bloque sin cerrar da error en su línea de inicio', () => {
  const r = run(`int main(){\n    int x = 1;\n    /* sin cerrar\n    x = 2;\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Comentario sin cerrar/);
  assert.strictEqual(r.errorLine, 3);
});

test('M5 comentario de bloque bien cerrado sigue funcionando', () => {
  const r = run(`int main(){ /* uno\n dos */ printf("ok\\n"); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, 'ok\n');
});

// M5: un # que no es directiva no debe desaparecer en silencio.
test('M5 un # suelto da aviso en su línea', () => {
  const r = run(`int main(){\n    #\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /'#' suelto/);
  assert.strictEqual(r.errorLine, 2);
});

test('M5 las directivas #include y #define se siguen ignorando', () => {
  const r = run(`#include <stdio.h>\n#define N 3\nint main(){ printf("ok\\n"); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, 'ok\n');
});
