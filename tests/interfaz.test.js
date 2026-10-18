const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'compilador-c', 'index.html'), 'utf8');

// M1: el resaltado y los números de línea deben seguir el scroll del textarea.
test('M1 el editor sincroniza el scroll con la numeración y el resaltado', () => {
  assert.match(html, /addEventListener\('scroll'/);
});

// M2: los colores de error deben venir de variables para que cambien con el tema.
test('M2 no hay colores de error fijos en el CSS', () => {
  // Solo se permite el color en la definición del token, no en las reglas.
  assert.doesNotMatch(html.replace(/--error-line-bg:\s*#[0-9a-f]+;/gi, ''), /#ffcccc/i);
  assert.doesNotMatch(html, /#error\s*\{[^}]*color:\s*#000/);
});

// M3: estructura y accesibilidad del panel de la app.
test('M3 la página tiene h1 y landmark main', () => {
  assert.match(html, /<h1[\s>]/);
  assert.match(html, /<main[\s>]/);
});

test('M3 la salida tiene aria-live', () => {
  assert.match(html, /<pre id="output"[^>]*aria-live=/);
});

test('M3 la página tiene meta description', () => {
  assert.match(html, /<meta name="description"/);
});

test('M3 los botones solo con icono tienen aria-label', () => {
  for (const id of ['play-btn', 'pause-btn', 'prev-btn', 'next-btn', 'reset-btn']) {
    assert.match(html, new RegExp(`<button id="${id}"[^>]*aria-label=`), id);
  }
});

test('M3 existe atajo de teclado para ejecutar desde el editor', () => {
  assert.match(html, /addEventListener\('keydown'/);
});

// A4 (HTML): un errorLine nulo no debe mostrarse como "en línea null".
test('A4 showError no muestra línea nula', () => {
  assert.doesNotMatch(html, /if \(line >= 0\)/);
});
