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

test('M3 la salida anuncia el estado por una región role=status, no en cada paso', () => {
  assert.match(html, /<p id="status"[^>]*role="status"/);
  assert.doesNotMatch(html, /<pre id="output"[^>]*aria-live=/);
});

test('Tab no se captura en el editor (no atrapa el teclado)', () => {
  assert.doesNotMatch(html, /e\.key === 'Tab'/);
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

// Barra de capacidad: el editor tiene un tope de líneas y lo muestra como medidor.
test('la barra de pasos es un role=meter con el límite de ejecución', () => {
  assert.match(html, /role="meter"[^>]*aria-valuemax="50000"/);
  assert.match(html, /id="steps-fill"/);
});

test('la barra de capacidad es un role=meter y el tope es de 100 líneas', () => {
  assert.match(html, /role="meter"[^>]*aria-valuemax="100"/);
  assert.match(html, /const MAX_LINEAS = 100;/);
});

// Medidores de variables, anidamiento y profundidad de llamadas.
test('hay medidores de variables, anidamiento y profundidad con sus topes', () => {
  assert.match(html, /role="meter"[^>]*aria-valuemax="20"[\s\S]*?id="vars-fill"/);
  assert.match(html, /role="meter"[^>]*aria-valuemax="3"[\s\S]*?id="anid-fill"/);
  assert.match(html, /role="meter"[^>]*aria-valuemax="200"[\s\S]*?id="prof-fill"/);
});

// M11: el textarea del editor debe tener nombre accesible para lectores de pantalla.
test('M11 el textarea del editor tiene etiqueta accesible', () => {
  assert.match(html, /<label class="sr-only" for="code">Código C<\/label>/);
  assert.match(html, /<textarea id="code"/);
});
