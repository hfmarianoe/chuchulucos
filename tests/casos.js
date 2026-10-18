// Casos de referencia para el intérprete de compilador-c/interp.js.
// La salida esperada de los programas se obtuvo compilando cada caso con gcc
// (y ejecutándolo) para que coincida con el comportamiento real de C.
// Los casos con `error` esperan que el intérprete falle con ese texto.

const programas = [
  { id: 'P01', nombre: 'factorial recursiva', salida: '120\n', codigo: `int fact(int n) { if (n <= 1) return 1; return n * fact(n - 1); }
int main() { printf("%d\\n", fact(5)); return 0; }` },
  { id: 'P02', nombre: 'while con acumulador', salida: '10\n', codigo: `int main(){ int i=0; int s=0; while(i<5){ s+=i; i++; } printf("%d\\n", s); return 0; }` },
  { id: 'P03', nombre: 'do-while', salida: '3 2 1 \n', codigo: `int main(){ int i=3; do { printf("%d ", i); i--; } while(i>0); printf("\\n"); return 0; }` },
  { id: 'P04', nombre: 'break y continue', salida: '1\n3\n5\n', codigo: `int main(){ for(int i=0;i<10;i++){ if(i%2==0) continue; if(i>6) break; printf("%d\\n", i);} return 0; }` },
  { id: 'P05', nombre: 'cadena en char[]', salida: 'hola\n', codigo: `int main(){ char s[] = "hola"; printf("%s\\n", s); return 0; }` },
  { id: 'P06', nombre: 'suma de arreglo con for', salida: '10\n', codigo: `int main(){ int a[4] = {1,2,3,4}; int s=0; for(int k=0;k<4;k++) s += a[k]; printf("%d\\n", s); return 0; }` },
  { id: 'P07', nombre: 'ámbito de bloques anidados', salida: '2\n1\n', codigo: `int main(){ int x=1; { int x=2; printf("%d\\n", x);} printf("%d\\n", x); return 0; }` },
  { id: 'P08', nombre: 'división float', salida: '0.750000\n', codigo: `int main(){ printf("%f\\n", 1.5 / 2); return 0; }` },
  { id: 'P09', nombre: 'suma double', salida: '1.750000\n', codigo: `int main(){ double d = 1.5; d = d + 0.25; printf("%f\\n", d); return 0; }` },
  { id: 'P10', nombre: 'condición con &&', salida: 'aprobado\n', codigo: `int main(){ int nota = 7; if (nota >= 6 && nota <= 10) printf("aprobado\\n"); else printf("no\\n"); return 0; }` },
  { id: 'P11', nombre: 'condición con ||', salida: 'si\n', codigo: `int main(){ int x = 0; if (x == 0 || x == 5) printf("si\\n"); return 0; }` },
  { id: 'P12', nombre: 'cortocircuito protege índice', salida: 'bien\n', codigo: `int main(){ int a[3] = {1,2,3}; int i = 3; if (i < 3 && a[i] == 0) printf("mal\\n"); else printf("bien\\n"); return 0; }` },
  { id: 'P13', nombre: 'cortocircuito protege división', salida: 'ok\n', codigo: `int main(){ int n = 0; if (n != 0 && 10 / n > 1) printf("raro\\n"); else printf("ok\\n"); return 0; }` },
  { id: 'P14', nombre: 'for reutiliza i', salida: '010\n', codigo: `int main(){ for(int i=0;i<2;i++) printf("%d", i); for(int i=0;i<1;i++) printf("%d", i); printf("\\n"); return 0; }` },
  // En C este caso falla en tiempo de ejecución (SIGFPE). Debe conservar la salida previa.
  { id: 'P15', nombre: 'salida parcial antes de error', salida: 'uno\ndos\n', error: 'División entre cero', codigo: `int main(){ printf("uno\\n"); printf("dos\\n"); int z = 0; int x = 5 % z; return 0; }` },
  { id: 'P16', nombre: '2000 iteraciones', salida: '2000\n', codigo: `int main(){ int total=0; for(int i=0;i<2000;i++){ total += 1; } printf("%d\\n", total); return 0; }` },
  { id: 'P17', nombre: 'formatos printf', salida: '   42|7    |3.14\n', codigo: `int main(){ printf("%5d|%-5d|%.2f\\n", 42, 7, 3.14159); return 0; }` },
  { id: 'P18', nombre: 'operador ternario', salida: '10\n', codigo: `int main(){ int a=5; int b = a > 3 ? 10 : 20; printf("%d\\n", b); return 0; }` },
];

// 22 expresiones del operador. Valores obtenidos con gcc.
const expresiones = [
  ['2 + 3', '5'], ['7 - 10', '-3'], ['3 * 4', '12'], ['7 / 2', '3'], ['-7 / 2', '-3'],
  ['7 % 3', '1'], ['-7 % 2', '-1'], ['3 == 3', '1'], ['3 != 3', '0'], ['2 < 3', '1'],
  ['3 > 2', '1'], ['2 <= 2', '1'], ['3 >= 4', '0'], ['1 && 1', '1'], ['1 && 0', '0'],
  ['0 || 1', '1'], ['0 || 0', '0'], ['!5', '0'], ['!0', '1'], ['1 ? 10 : 20', '10'],
  ['0 ? 10 : 20', '20'], ['2 + 3 * 4', '14'],
];

module.exports = { programas, expresiones };
