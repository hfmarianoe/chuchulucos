const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../compilador-c/interp.js');

// Programa de referencia: global, arreglo, funciones con locales, bucles, printf y putchar.
const PROGRAMA = `int g = 2;
int suma(int n) { int t = 0; int i; for (i = 1; i <= n; i++) { t = t + i; } return t; }
int main() {
  int a[3];
  int k = 0;
  while (k < 3) {
    a[k] = suma(k) + g;
    k++;
  }
  printf("%d,", a[2]);
  putchar(65);
  do { k--; } while (k > 0);
  return 0;
}`;

// Resumen de cada paso: línea|función|profundidad|salida|variables (función.nombre:tipo=valor).
const resumen = (s) => `${s.line}|${s.fn}|${s.depth}|${JSON.stringify(s.out)}|` +
  s.vars.map(v => `${v.fn ?? '-'}.${v.name}:${v.ty}${v.arr ? '[]' : ''}=${v.arr ? JSON.stringify(v.v) : String(v.v)}`).join(';');

// Traza de referencia, generada con la implementación anterior a la copia reducida de recordStep.
const TRAZA_ESPERADA = [
  "1|null|0|\"\"|",
  "4|main|1|\"\"|-.g:int=2",
  "5|main|1|\"\"|main.a:int[]=[0,0,0];-.g:int=2",
  "6|main|1|\"\"|main.a:int[]=[0,0,0];main.k:int=0;-.g:int=2",
  "6|main|1|\"\"|main.a:int[]=[0,0,0];main.k:int=0;-.g:int=2",
  "7|main|1|\"\"|main.a:int[]=[0,0,0];main.k:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=0;suma.t:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=0;suma.t:int=0;suma.i:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=0;suma.t:int=0;suma.i:int=1;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=0;suma.t:int=0;suma.i:int=1;-.g:int=2",
  "8|main|1|\"\"|main.a:int[]=[2,0,0];main.k:int=0;-.g:int=2",
  "6|main|1|\"\"|main.a:int[]=[2,0,0];main.k:int=1;-.g:int=2",
  "7|main|1|\"\"|main.a:int[]=[2,0,0];main.k:int=1;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=1;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=1;suma.t:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=1;suma.t:int=0;suma.i:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=1;suma.t:int=0;suma.i:int=1;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=1;suma.t:int=0;suma.i:int=1;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=1;suma.t:int=1;suma.i:int=2;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=1;suma.t:int=1;suma.i:int=2;-.g:int=2",
  "8|main|1|\"\"|main.a:int[]=[2,3,0];main.k:int=1;-.g:int=2",
  "6|main|1|\"\"|main.a:int[]=[2,3,0];main.k:int=2;-.g:int=2",
  "7|main|1|\"\"|main.a:int[]=[2,3,0];main.k:int=2;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=0;suma.i:int=0;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=0;suma.i:int=1;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=0;suma.i:int=1;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=1;suma.i:int=2;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=1;suma.i:int=2;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=3;suma.i:int=3;-.g:int=2",
  "2|suma|2|\"\"|suma.n:int=2;suma.t:int=3;suma.i:int=3;-.g:int=2",
  "8|main|1|\"\"|main.a:int[]=[2,3,5];main.k:int=2;-.g:int=2",
  "6|main|1|\"\"|main.a:int[]=[2,3,5];main.k:int=3;-.g:int=2",
  "10|main|1|\"\"|main.a:int[]=[2,3,5];main.k:int=3;-.g:int=2",
  "11|main|1|\"5,\"|main.a:int[]=[2,3,5];main.k:int=3;-.g:int=2",
  "12|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=3;-.g:int=2",
  "12|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=3;-.g:int=2",
  "12|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=2;-.g:int=2",
  "12|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=2;-.g:int=2",
  "12|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=1;-.g:int=2",
  "12|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=1;-.g:int=2",
  "12|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=0;-.g:int=2",
  "13|main|1|\"5,A\"|main.a:int[]=[2,3,5];main.k:int=0;-.g:int=2",
];

test('la traza de pasos no cambia: mismas líneas, salida y valores', () => {
  const r = run(PROGRAMA);
  assert.strictEqual(r.ok, true, r.error);
  assert.deepStrictEqual(r.steps.map(resumen), TRAZA_ESPERADA);
  assert.strictEqual(r.pasos, TRAZA_ESPERADA.length);
});

test('una variable que no cambia comparte la misma instantánea en todos los pasos', () => {
  const r = run(PROGRAMA);
  // El primer paso se registra antes de declarar g: solo se comparan los pasos donde existe.
  const gs = r.steps.map(s => s.vars.find(v => v.fn === null && v.name === 'g')).filter(Boolean);
  assert.ok(gs.length > 1);
  for (const g of gs) assert.strictEqual(g, gs[0]);
});

test('la instantánea de un arreglo conserva el valor de su paso aunque después cambie', () => {
  const r = run('int main(){ int a[2]; a[0]=1; a[1]=1; printf("x"); a[0]=5; a[1]=6; return 0; }');
  const valores = r.steps.map(s => {
    const a = s.vars.find(v => v.name === 'a');
    return a ? JSON.stringify(a.v) : null;
  });
  assert.deepStrictEqual(valores, [null, '[0,0]', '[1,0]', '[1,1]', '[1,1]', '[5,1]', '[5,6]']);
});

test('la salida de cada paso es el texto impreso hasta ese momento', () => {
  const r = run(PROGRAMA);
  let previa = '';
  for (const s of r.steps) {
    assert.ok(s.out.startsWith(previa), 'la salida de un paso no es prefijo del siguiente');
    previa = s.out;
  }
  assert.strictEqual(previa, r.output);
});
