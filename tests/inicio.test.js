const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const hero = html.match(/<section class="hero">([\s\S]*?)<\/section>/);
const tarjetas = [...html.matchAll(/<article class="card">([\s\S]*?)<\/article>/g)].map((m) => m[1]);
const tarjeta = (titulo) => tarjetas.find((t) => t.includes(`<h2>${titulo}</h2>`));

// B18: "Próximamente" va en las apps que no existen, no sobre la de C que ya funciona.
test('B18 "Próximamente" no está en la cabecera de la página', () => {
  assert.ok(hero, 'no se encontró la sección hero');
  assert.doesNotMatch(hero[1], /class="soon"/);
});

test('B18 "Próximamente" está en las tarjetas de QR y pseudocódigo', () => {
  assert.match(tarjeta('Generador de QR'), /<p class="soon">Próximamente<\/p>/);
  assert.match(tarjeta('Pseudocódigo'), /<p class="soon">Próximamente<\/p>/);
});

test('B18 la tarjeta de C no lleva "Próximamente"', () => {
  assert.doesNotMatch(tarjeta('Programación en C'), /class="soon"/);
});
