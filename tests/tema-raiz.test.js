const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const raiz = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const estilo = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');

// B5: la página principal también tiene interruptor de tema que comparte la clave del compilador.
test('B5 la página principal tiene botón de tema con aria-pressed', () => {
  assert.match(raiz, /id="theme-btn"[^>]*aria-pressed="false"/);
  assert.match(raiz, /aria-label="Tema oscuro"/);
});

test('B5 la página principal lee y guarda la misma clave de tema, dentro de try/catch', () => {
  assert.match(raiz, /localStorage\.getItem\('chuchulucos-tema'\)/);
  assert.match(raiz, /localStorage\.setItem\('chuchulucos-tema', nuevo\)/);
  assert.match(raiz, /try \{\s*localStorage\.setItem/);
});

test('B5 la hoja de estilos define foco visible con tokens', () => {
  assert.match(estilo, /:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--accent-text\)/);
});

// B12: el botón de tema debe mostrar el tema activo, no siempre "Tema oscuro".
for (const [rel, sangria] of [['index.html', '      '], ['compilador-c/index.html', '        ']]) {
  test(`B12 ${rel}: pintarTema() actualiza el texto y el nombre accesible del botón`, () => {
    const html = fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
    const cuerpo = html.match(/function pintarTema\(\) \{([\s\S]*?)\n\s*\}/);
    assert.ok(cuerpo, 'no se encontró pintarTema()');
    assert.match(cuerpo[1], /textContent\s*=/);
    assert.match(cuerpo[1], /setAttribute\('aria-label'/);
  });
}

// B13: el enlace a la app de C debe verse como enlace, con clase propia.
test('B13 el enlace al compilador usa una clase propia con color de acento y subrayado', () => {
  assert.match(raiz, /<a class="enlace-app" href="compilador-c\/index\.html">Abrir el compilador de C<\/a>/);
  assert.match(estilo, /\.enlace-app\s*\{[^}]*color:\s*var\(--accent-text\)/);
  assert.match(estilo, /\.enlace-app\s*\{[^}]*text-decoration:\s*underline/);
});

// B14: cada token de la paleta oscura se escribe una sola vez por archivo.
test('B14 style.css escribe la paleta oscura una sola vez', () => {
  assert.strictEqual((estilo.match(/#161614/g) || []).length, 1);
});

test('B14 compilador-c/index.html escribe la paleta oscura una sola vez', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'compilador-c', 'index.html'), 'utf8');
  assert.strictEqual((html.match(/#1e1e1e/g) || []).length, 1);
});
