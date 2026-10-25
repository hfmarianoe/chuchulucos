(function (g) {
  'use strict';

  // ==================== Tokenizer ====================
  class Lexer {
    constructor(src) {
      this.src = src;
      this.pos = 0;
      this.line = 1;
    }

    error(msg) {
      throw new Error(msg + ' en línea ' + this.line);
    }

    tokenize() {
      const tokens = [];
      while (this.pos < this.src.length) {
        const ch = this.src[this.pos];
        // Skip whitespace
        if (ch === ' ' || ch === '\t' || ch === '\r') {
          this.pos++;
          continue;
        }
        if (ch === '\n') {
          this.line++;
          this.pos++;
          continue;
        }
        // Preprocessor line
        if (ch === '#') {
          let tempPos = this.pos + 1;
          while (tempPos < this.src.length && (this.src[tempPos] === ' ' || this.src[tempPos] === '\t')) tempPos++;
          const nombre = /^[A-Za-z_][A-Za-z0-9_]*/.exec(this.src.slice(tempPos));
          const directivas = ['include', 'define', 'undef', 'if', 'ifdef', 'ifndef', 'elif', 'else', 'endif', 'pragma', 'error', 'line'];
          if (nombre && directivas.includes(nombre[0])) {
            while (this.pos < this.src.length && this.src[this.pos] !== '\n') this.pos++;
            continue;
          }
          throw new Error("'#' suelto en línea " + this.line + ": solo se admiten directivas como #include o #define");
        }
        // Comments
        if (ch === '/' && this.src[this.pos + 1] === '/') {
          while (this.pos < this.src.length && this.src[this.pos] !== '\n') this.pos++;
          continue;
        }
        if (ch === '/' && this.src[this.pos + 1] === '*') {
          let startLine = this.line;
          this.pos += 2;
          while (this.pos < this.src.length && !(this.src[this.pos] === '*' && this.src[this.pos + 1] === '/')) {
            if (this.src[this.pos] === '\n') this.line++;
            this.pos++;
          }
          if (this.pos >= this.src.length) {
            throw new Error('Comentario sin cerrar en línea ' + startLine);
          }
          this.pos += 2; // skip */
          continue;
        }
        // Identifier or keyword
        if (/[a-zA-Z_]/.test(ch)) {
          let start = this.pos;
          while (this.pos < this.src.length && /[a-zA-Z0-9_]/.test(this.src[this.pos])) this.pos++;
          const word = this.src.slice(start, this.pos);

          if (['enum', 'typedef', 'sizeof'].includes(word)) {
            this.error(`'${word}' no soportado`);
          }
          if (word === 'long' && tokens.length > 0 && tokens[tokens.length - 1].type === 'keyword' && tokens[tokens.length - 1].value === 'long') {
            this.error("'long long' no soportado");
          }

          const keywords = new Set(['int','char','float','double','void','if','else','while','do','for','break','continue','return','const','static','long','unsigned','short','struct','switch']);
          tokens.push({ type: keywords.has(word) ? 'keyword' : 'identifier', value: word, line: this.line });
          continue;
        }
        // Number
        if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(this.src[this.pos+1]))) {
          let start = this.pos;
          let isFloat = false;
          while (this.pos < this.src.length && /[0-9]/.test(this.src[this.pos])) this.pos++;

          if (this.src.slice(start, this.pos) === '0' && this.pos < this.src.length && (this.src[this.pos] === 'x' || this.src[this.pos] === 'X')) {
            this.error("Hexadecimales (0x) no soportados");
          }

          if (this.pos < this.src.length && this.src[this.pos] === '.') {
            isFloat = true;
            this.pos++;
            while (this.pos < this.src.length && /[0-9]/.test(this.src[this.pos])) this.pos++;
          }

          if (this.pos < this.src.length && (this.src[this.pos] === 'e' || this.src[this.pos] === 'E')) {
            let next = this.pos + 1;
            if (next < this.src.length && (/[0-9]/.test(this.src[next]) || ( (this.src[next] === '+' || this.src[next] === '-') && next + 1 < this.src.length && /[0-9]/.test(this.src[next+1]) ))) {
              this.error("Notación exponencial (1e5) no soportada");
            }
          }

          if (this.pos < this.src.length && /[fFlLuU]/.test(this.src[this.pos])) {
            this.error("Sufijos (1.0f, 1L, 1u) no soportados");
          }

          const text = this.src.slice(start, this.pos);
          tokens.push({ type: 'number', value: isFloat ? parseFloat(text) : parseInt(text, 10), line: this.line, isFloat: isFloat });
          continue;
        }
        // Char literal
        if (ch === "'") {
          this.pos++;
          let val;
          if (this.src[this.pos] === '\\') {
            this.pos++;
            const esc = this.src[this.pos];
            const map = { 'n': 10, 't': 9, '\\': 92, '"': 34, "'": 39, '0': 0 };
            val = map[esc] ?? esc.charCodeAt(0);
            this.pos++;
          } else {
            val = this.src.charCodeAt(this.pos);
            this.pos++;
          }
          if (this.src[this.pos] !== "'") this.error("Se esperaba ' en caracter");
          this.pos++;
          tokens.push({ type: 'number', value: val, line: this.line, isChar: true });
          continue;
        }
        // String literal
        if (ch === '"') {
          this.pos++;
          let str = '';
          while (this.pos < this.src.length && this.src[this.pos] !== '"') {
            if (this.src[this.pos] === '\\') {
              this.pos++;
              const esc = this.src[this.pos];
              const map = { 'n': '\n', 't': '\t', '\\': '\\', '"': '"', "'": "'", '0': '\0' };
              str += map[esc] ?? esc;
              this.pos++;
            } else {
              str += this.src[this.pos];
              this.pos++;
            }
          }
          if (this.pos >= this.src.length) this.error('Cadena sin cerrar');
          this.pos++; // closing quote
          tokens.push({ type: 'string', value: str, line: this.line });
          continue;
        }
        // Operators and punctuation
        const twoCharOps = ['==','!=','<=','>=','&&','||','++','--','+=','-=','*=','/=','%='];
        let found = false;
        for (const op of twoCharOps) {
          if (this.src.startsWith(op, this.pos)) {
            tokens.push({ type: 'operator', value: op, line: this.line });
            this.pos += 2;
            found = true;
            break;
          }
        }
        if (found) continue;
        const oneCharOps = ['+','-','*','/','%','=','<','>','!','?',':',';',',','(',')','{','}','[',']','&','.'];
        if (oneCharOps.includes(ch)) {
          tokens.push({ type: 'operator', value: ch, line: this.line });
          this.pos++;
          continue;
        }
        this.error('Carácter inesperado: ' + ch);
      }
      tokens.push({ type: 'eof', line: this.line });
      return tokens;
    }
  }


  g.CInterp = g.CInterp || {};
  g.CInterp.Lexer = Lexer;
})(typeof globalThis !== 'undefined' ? globalThis : window);
