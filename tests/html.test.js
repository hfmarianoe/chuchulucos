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
