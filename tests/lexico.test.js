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

// M6: el léxico avisa de lo que no se soporta, con la línea.
test('M6 hexadecimal 0x da aviso explícito', () => {
  const r = run(`int main(){\n    int x = 0x1F;\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Hexadecimales \(0x\) no soportados/);
  assert.strictEqual(r.errorLine, 2);
});

test('M6 exponente 1e5 da aviso explícito', () => {
  const r = run(`int main(){\n    double d = 1e5;\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Notación exponencial \(1e5\) no soportada/);
  assert.strictEqual(r.errorLine, 2);
});

test('M6 exponente con signo 2.5E-3 da aviso explícito', () => {
  const r = run(`int main(){ double d = 2.5E-3; return 0; }`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Notación exponencial/);
});

test('M6 sufijo f en 1.0f da aviso explícito', () => {
  const r = run(`int main(){\n    float f = 1.0f;\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Sufijos \(1\.0f, 1L, 1u\) no soportados/);
  assert.strictEqual(r.errorLine, 2);
});

test('M6 sufijo L en 1L da aviso explícito', () => {
  const r = run(`int main(){ long x = 1L; return 0; }`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /Sufijos/);
});

test('M6 long long da aviso explícito', () => {
  const r = run(`int main(){\n    long long x = 1;\n    return 0;\n}`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /'long long' no soportado/);
  assert.strictEqual(r.errorLine, 2);
});

test('M6 enum, typedef, sizeof y strlen dan aviso explícito', () => {
  const casos = [
    ['enum', `int main(){ enum c { R }; return 0; }`],
    ['typedef', `typedef int entero;\nint main(){ return 0; }`],
    ['sizeof', `int main(){ int n = sizeof(int); return 0; }`],
    ['strlen', `int main(){ int n = strlen("ab"); return 0; }`],
  ];
  for (const [palabra, src] of casos) {
    const r = run(src);
    assert.strictEqual(r.ok, false, palabra);
    assert.match(r.error, new RegExp(`'${palabra}' no soportado`), palabra);
    assert.ok(r.errorLine, `${palabra} sin línea`);
  }
});

test('M6 los números decimales y enteros normales siguen funcionando', () => {
  const r = run(`int main(){ int x = 10; double d = 1.5; printf("%d %f\\n", x, d); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '10 1.500000\n');
});

// scanf y strlen son funciones de biblioteca, no palabras reservadas: como variable son válidos.
test('M4 una variable llamada scanf sigue siendo válida', () => {
  const r = run(`int main(){ int scanf = 4; printf("%d\\n", scanf); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '4\n');
});

test('M6 una variable llamada strlen sigue siendo válida', () => {
  const r = run(`int main(){ int strlen = 5; printf("%d\\n", strlen); return 0; }`);
  assert.strictEqual(r.ok, true, `falló: ${r.error}`);
  assert.strictEqual(r.output, '5\n');
});

// M5: un nombre que no es una directiva conocida no debe ignorarse en silencio.
test('M5 un # con nombre que no es directiva da aviso', () => {
  const r = run(`#estoNoEsUnaDirectiva\nint main(){ return 0; }`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /'#' suelto/);
  assert.strictEqual(r.errorLine, 1);
});

// M5: el nombre de la directiva es el identificador completo; #include123 no es #include.
test('M5 #include123 no se acepta como directiva', () => {
  const r = run(`#include123\nint main(){ return 0; }`);
  assert.strictEqual(r.ok, false);
  assert.match(r.error, /'#' suelto/);
  assert.strictEqual(r.errorLine, 1);
});

// M7: los literales de carácter con escape valen su código numérico.
const codigoDe = (lit) => run(`int main(){ char c = ${lit}; printf("%d", c); return 0; }`).output;
test('M7 los escapes de carácter valen su código', () => {
  assert.strictEqual(codigoDe("'\\n'"), '10');
  assert.strictEqual(codigoDe("'\\t'"), '9');
  assert.strictEqual(codigoDe("'\\0'"), '0');
  assert.strictEqual(codigoDe("'\\\\'"), '92');
  assert.strictEqual(codigoDe("'\\''"), '39');
  assert.strictEqual(codigoDe("'\\\"'"), '34');
});

test('M7 putchar con el escape de salto de línea escribe un salto real', () => {
  const r = run('int main(){ putchar(\'\\n\'); return 0; }');
  assert.strictEqual(r.ok, true, r.error);
  assert.strictEqual(r.output, '\n');
});

test('M7 las cadenas con escapes siguen funcionando', () => {
  const r = run('int main(){ printf("a\\tb\\n"); return 0; }');
  assert.strictEqual(r.output, 'a\tb\n');
});
