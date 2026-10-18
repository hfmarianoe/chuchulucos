const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const archivos = ['index.html', 'compilador-c/index.html'];

function leer(rel) { return fs.readFileSync(path.join(raiz, rel), 'utf8'); }

for (const rel of archivos) {
  test(`${rel}: ids únicos`, () => {
    const ids = [...leer(rel).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepStrictEqual(repetidos, []);
  });

  test(`${rel}: recursos locales existen`, () => {
    const refs = [...leer(rel).matchAll(/(?:src|href)="([^"#?:]+)"/g)].map((m) => m[1]);
    const locales = refs.filter((r) => !r.startsWith('/') && !r.startsWith('//'));
    const faltan = locales.filter((r) => !fs.existsSync(path.join(path.dirname(path.join(raiz, rel)), r)));
    assert.deepStrictEqual(faltan, []);
  });

  test(`${rel}: script inline con sintaxis válida`, () => {
    const scripts = [...leer(rel).matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    for (const code of scripts) {
      assert.doesNotThrow(() => new Function(code));
    }
  });
}

// B5: colores en variables, color-scheme declarado e interruptor de tema.
const estilosRaiz = leer('style.css');
const htmlCompilador = leer('compilador-c/index.html');
const bloqueEstilo = htmlCompilador.match(/<style>([\s\S]*?)<\/style>/)[1];

test('B5 style.css y el compilador declaran color-scheme light dark en :root', () => {
  assert.match(estilosRaiz, /:root\s*\{[^}]*color-scheme:\s*light dark;/);
  assert.match(bloqueEstilo, /:root\s*\{[^}]*color-scheme:\s*light dark;/);
});

test('B5 los dos archivos tienen el modo oscuro guardado por data-theme', () => {
  for (const css of [estilosRaiz, bloqueEstilo]) {
    assert.match(css, /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)/);
    assert.match(css, /:root\[data-theme="dark"\]\s*\{/);
  }
});

test('B5 los estilos no usan colores fijos fuera de los tokens de :root', () => {
  // Solo se permiten colores en las líneas que declaran una variable (--nombre: valor).
  for (const css of [estilosRaiz, bloqueEstilo]) {
    const lineas = css.split('\n').filter((l) => /#[0-9a-f]{3,6}\b|rgba?\(/i.test(l));
    const fijos = lineas.filter((l) => !/^\s*--[\w-]+:/.test(l));
    assert.deepStrictEqual(fijos, []);
  }
});

test('B5 el compilador tiene un interruptor de tema con aria-pressed y aria-label', () => {
  assert.match(htmlCompilador, /<button id="theme-btn"[^>]*aria-pressed="false"/);
  assert.match(htmlCompilador, /<button id="theme-btn"[^>]*aria-label="Tema oscuro"/);
});

test('B5 la elección de tema se guarda dentro de try/catch', () => {
  assert.match(htmlCompilador, /try\s*\{\s*localStorage\.setItem\('chuchulucos-tema'/);
  assert.match(htmlCompilador, /try\s*\{\s*const temaGuardado = localStorage\.getItem\('chuchulucos-tema'/);
});
