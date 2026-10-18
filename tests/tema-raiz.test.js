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
