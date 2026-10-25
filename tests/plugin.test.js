const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const archivos = [
  'plugins/flujo-desarrollo/README.md',
  'plugins/flujo-desarrollo/commands/configurar.md',
  'plugins/flujo-desarrollo/commands/auditar.md',
  'plugins/flujo-desarrollo/commands/ejecutar.md',
];

// B15: cada ruta docs/ citada por el plugin debe existir, o decir que todavía no existe.
for (const rel of archivos) {
  test(`B15 ${rel}: las rutas docs/ existen o se marcan como pendientes`, () => {
    const lineas = fs.readFileSync(path.join(raiz, rel), 'utf8').split('\n');
    for (const linea of lineas) {
      for (const [, ruta] of linea.matchAll(/`(docs\/[^`]+?)\/?`/g)) {
        const existe = fs.existsSync(path.join(raiz, ruta));
        const marcada = /todavía no (está|existe)/.test(linea);
        assert.ok(existe || marcada, `${rel}: ${ruta} no existe y no está marcada como pendiente`);
      }
    }
  });
}

test('B15 auditar.md guarda en docs/auditorias/, que sí existe', () => {
  const auditar = fs.readFileSync(path.join(raiz, 'plugins/flujo-desarrollo/commands/auditar.md'), 'utf8');
  assert.match(auditar, /`docs\/auditorias\/`/);
  assert.ok(fs.existsSync(path.join(raiz, 'docs', 'auditorias')));
});
