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
          while (this.pos < this.src.length && this.src[this.pos] !== '\n') this.pos++;
          continue;
        }
        // Comments
        if (ch === '/' && this.src[this.pos + 1] === '/') {
          while (this.pos < this.src.length && this.src[this.pos] !== '\n') this.pos++;
          continue;
        }
        if (ch === '/' && this.src[this.pos + 1] === '*') {
          this.pos += 2;
          while (this.pos < this.src.length && !(this.src[this.pos] === '*' && this.src[this.pos + 1] === '/')) {
            if (this.src[this.pos] === '\n') this.line++;
            this.pos++;
          }
          this.pos += 2; // skip */
          continue;
        }
        // Identifier or keyword
        if (/[a-zA-Z_]/.test(ch)) {
          let start = this.pos;
          while (this.pos < this.src.length && /[a-zA-Z0-9_]/.test(this.src[this.pos])) this.pos++;
          const word = this.src.slice(start, this.pos);
          const keywords = new Set(['int','char','float','double','void','if','else','while','do','for','break','continue','return','const','static','long','unsigned','short','struct','switch','scanf']);
          tokens.push({ type: keywords.has(word) ? 'keyword' : 'identifier', value: word, line: this.line });
          continue;
        }
        // Number
        if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(this.src[this.pos+1]))) {
          let start = this.pos;
          let isFloat = false;
          while (this.pos < this.src.length && /[0-9]/.test(this.src[this.pos])) this.pos++;
          if (this.pos < this.src.length && this.src[this.pos] === '.') {
            isFloat = true;
            this.pos++;
            while (this.pos < this.src.length && /[0-9]/.test(this.src[this.pos])) this.pos++;
          }
          // exponent? not supported
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
            const map = { 'n': '\n', 't': '\t', '\\': '\\', '"': '"', "'": "'", '0': '\0' };
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

  // ==================== AST Nodes ====================
  // We'll use plain objects with { type, line, ... }

  // ==================== Parser ====================
  class Parser {
    constructor(tokens) {
      this.tokens = tokens;
      this.pos = 0;
    }

    peek() { return this.tokens[this.pos]; }
    next() { return this.tokens[this.pos++]; }
    isOp(val) { const t = this.peek(); return t.type === 'operator' && t.value === val; }
    isKeyword(val) { const t = this.peek(); return t.type === 'keyword' && t.value === val; }
    isTypeKeyword(val) { return this.isKeyword(val) && ['int','char','float','double','void'].includes(val); }
    matchOp(val) { if (this.isOp(val)) { this.next(); return true; } return false; }
    expectOp(val) {
      if (!this.matchOp(val)) {
        throw new Error("Se esperaba '" + val + "' en línea " + this.peek().line);
      }
    }
    expectKeyword(val) {
      if (!this.isKeyword(val)) {
        throw new Error("Se esperaba '" + val + "' en línea " + this.peek().line);
      }
      this.next();
    }

    parseProgram() {
      const globals = [];
      const functions = {};
      while (this.peek().type !== 'eof') {
        const typeInfo = this.parseTypeSpec();
        const nameTok = this.peek();
        if (nameTok.type !== 'identifier') {
          throw new Error('Se esperaba identificador en línea ' + nameTok.line);
        }
        this.next();
        if (this.isOp('(')) {
          // function definition
          const func = this.parseFunctionRest(typeInfo.returnType, nameTok.value, nameTok.line);
          functions[func.name] = func;
        } else {
          // global variable declaration
          const varDecl = this.parseDeclaratorListAfterType(typeInfo, nameTok);
          globals.push(varDecl);
        }
      }
      return { globals, functions };
    }

    parseTypeSpec() {
      let line = this.peek().line;
      // Skip qualifiers
      while (this.isKeyword('const') || this.isKeyword('static') || this.isKeyword('long') || this.isKeyword('unsigned') || this.isKeyword('short')) {
        this.next();
      }
      if (this.isKeyword('struct')) {
        throw new Error('Estructuras no soportadas (línea ' + this.peek().line + ')');
      }
      if (this.isOp('*')) {
        throw new Error('Punteros no soportados (línea ' + this.peek().line + ')');
      }
      let ty;
      if (this.isTypeKeyword('int')) { ty = 'int'; this.next(); }
      else if (this.isTypeKeyword('char')) { ty = 'char'; this.next(); }
      else if (this.isTypeKeyword('float')) { ty = 'float'; this.next(); }
      else if (this.isTypeKeyword('double')) { ty = 'float'; this.next(); }
      else if (this.isTypeKeyword('void')) { ty = 'void'; this.next(); }
      else {
        throw new Error('Tipo no válido en línea ' + line);
      }
      return { ty, line };
    }

    parseFunctionRest(returnType, name, line) {
      this.expectOp('(');
      const params = [];
      if (!this.isOp(')')) {
        // parse params
        while (true) {
          const paramTypeInfo = this.parseTypeSpec();
          if (this.isOp('*')) {
            throw new Error('Punteros no soportados (línea ' + this.peek().line + ')');
          }
          const pname = this.peek();
          if (pname.type !== 'identifier') {
            throw new Error('Se esperaba nombre de parámetro en línea ' + pname.line);
          }
          this.next();
          let isArray = false;
          if (this.isOp('[')) {
            this.expectOp('[');
            this.expectOp(']');
            isArray = true;
          }
          params.push({ name: pname.value, type: paramTypeInfo.ty, isArray });
          if (this.matchOp(',')) continue;
          else break;
        }
        this.expectOp(')');
      } else {
        this.next();
      }
      const body = this.parseStatement(); // should be a Block
      return { type: 'function', name, returnType, params, body, line };
    }

    // After type and first identifier, parse remaining declarators (for globals and locals)
    parseDeclaratorListAfterType(typeInfo, firstDeclarator) {
      const declarators = [];
      let line = firstDeclarator.line;
      // firstDeclarator is the identifier token; we need to parse its array/init parts
      this._parseSingleDeclaratorRest(typeInfo.ty, firstDeclarator, declarators);
      while (this.matchOp(',')) {
        const idTok = this.peek();
        if (idTok.type !== 'identifier') {
          throw new Error('Se esperaba identificador en línea ' + idTok.line);
        }
        this.next();
        this._parseSingleDeclaratorRest(typeInfo.ty, idTok, declarators);
      }
      this.expectOp(';');
      return { type: 'VarDecl', varType: typeInfo.ty, line, declarators };
    }

    _parseSingleDeclaratorRest(varType, idTok, declarators) {
      let isArray = false;
      let arraySize = undefined; // undefined => no array; null => inferred size; number => fixed size
      if (this.matchOp('[')) {
        isArray = true;
        if (this.matchOp(']')) {
          arraySize = null; // inferred later
        } else {
          const expr = this.parseExpression();
          this.expectOp(']');
          // We evaluate size expression later (must be integer)
          arraySize = expr;
        }
      }
      let init = null;
      if (this.matchOp('=')) {
        if (this.isOp('{')) {
          // Array initializer list
          this.next(); // consume {
          const elements = [];
          if (!this.isOp('}')) {
            while (true) {
              elements.push(this.parseAssignment());
              if (this.matchOp(',')) continue;
              else break;
            }
          }
          this.expectOp('}');
          init = { type: 'ArrayInit', elements, line: idTok.line };
        } else {
          init = this.parseAssignment();
        }
      }
      declarators.push({ name: idTok.value, isArray, arraySize, init });
    }

    parseStatement() {
      const tok = this.peek();
      const line = tok.line;
      if (this.isOp(';')) { this.next(); return { type: 'Empty', line }; }
      if (this.isOp('{')) {
        this.next();
        const stmts = [];
        while (!this.isOp('}') && this.peek().type !== 'eof') {
          stmts.push(this.parseStatement());
        }
        this.expectOp('}');
        return { type: 'Block', stmts, line };
      }
      if (this.isKeyword('if')) { return this.parseIf(); }
      if (this.isKeyword('while')) { return this.parseWhile(); }
      if (this.isKeyword('do')) { return this.parseDoWhile(); }
      if (this.isKeyword('for')) { return this.parseFor(); }
      if (this.isKeyword('break')) { this.next(); this.expectOp(';'); return { type: 'Break', line }; }
      if (this.isKeyword('continue')) { this.next(); this.expectOp(';'); return { type: 'Continue', line }; }
      if (this.isKeyword('return')) {
        this.next();
        let expr = null;
        if (!this.isOp(';')) {
          expr = this.parseExpression();
        }
        this.expectOp(';');
        return { type: 'Return', expr, line };
      }
      if (this.isKeyword('switch')) {
        throw new Error('Switch no soportado (línea ' + line + ')');
      }
      // Declaration?
      if (this.isTypeKeyword('int') || this.isTypeKeyword('char') || this.isTypeKeyword('float') || this.isTypeKeyword('double') || this.isTypeKeyword('void') || this.isKeyword('const') || this.isKeyword('static') || this.isKeyword('long') || this.isKeyword('unsigned') || this.isKeyword('short')) {
        const typeInfo = this.parseTypeSpec();
        const idTok = this.peek();
        if (idTok.type !== 'identifier') {
          throw new Error('Se esperaba identificador en línea ' + idTok.line);
        }
        this.next();
        return this.parseDeclaratorListAfterType(typeInfo, idTok);
      }
      // Expression statement
      const expr = this.parseExpression();
      this.expectOp(';');
      return { type: 'Expression', expr, line };
    }

    parseIf() {
      const line = this.peek().line;
      this.expectKeyword('if');
      this.expectOp('(');
      const cond = this.parseExpression();
      this.expectOp(')');
      const thenStmt = this.parseStatement();
      let elseStmt = null;
      if (this.isKeyword('else')) {
        this.next();
        elseStmt = this.parseStatement();
      }
      return { type: 'If', cond, thenStmt, elseStmt, line };
    }

    parseWhile() {
      const line = this.peek().line;
      this.expectKeyword('while');
      this.expectOp('(');
      const cond = this.parseExpression();
      this.expectOp(')');
      const body = this.parseStatement();
      return { type: 'While', cond, body, line };
    }

    parseDoWhile() {
      const line = this.peek().line;
      this.expectKeyword('do');
      const body = this.parseStatement();
      this.expectKeyword('while');
      this.expectOp('(');
      const cond = this.parseExpression();
      this.expectOp(')');
      this.expectOp(';');
      return { type: 'DoWhile', cond, body, line };
    }

    parseFor() {
      const line = this.peek().line;
      this.expectKeyword('for');
      this.expectOp('(');
      let init = null;
      if (!this.isOp(';')) {
        // could be declaration or expression
        if (this.isTypeKeyword('int') || this.isTypeKeyword('char') || this.isTypeKeyword('float') || this.isTypeKeyword('double') || this.isTypeKeyword('void') || this.isKeyword('const') || this.isKeyword('static') || this.isKeyword('long') || this.isKeyword('unsigned') || this.isKeyword('short')) {
          const typeInfo = this.parseTypeSpec();
          const idTok = this.peek();
          if (idTok.type !== 'identifier') {
            throw new Error('Se esperaba identificador en línea ' + idTok.line);
          }
          this.next();
          const varDecl = this.parseDeclaratorListAfterType(typeInfo, idTok);
          // VarDecl already consumed ';', but for for-loop we need to handle ';' differently.
          // We'll adjust: parseDeclaratorListAfterType consumes ';', so we need to undo? Instead, we should not call that.
          // Actually for for-init, declaration list ends with ';'. But our parseDeclaratorListAfterType expects ';'.
          // So it will consume the ';' correctly.
          init = varDecl;
        } else {
          init = { type: 'Expression', expr: this.parseExpression(), line: line };
          this.expectOp(';');
        }
      } else {
        this.next(); // consume ';'
      }
      let cond = null;
      if (!this.isOp(';')) {
        cond = this.parseExpression();
      }
      this.expectOp(';');
      let incr = null;
      if (!this.isOp(')')) {
        incr = this.parseExpression();
      }
      this.expectOp(')');
      const body = this.parseStatement();
      return { type: 'For', init, cond, incr, body, line };
    }

    // Expression parsing
    parseExpression() { return this.parseAssignment(); }

    parseAssignment() {
      const left = this.parseConditional();
      if (this.isOp('=') || this.isOp('+=') || this.isOp('-=') || this.isOp('*=') || this.isOp('/=') || this.isOp('%=')) {
        const op = this.next().value;
        const right = this.parseAssignment();
        return { type: 'Assign', left, op, right, line: left.line || right.line };
      }
      return left;
    }

    parseConditional() {
      const cond = this.parseLogicalOr();
      if (this.matchOp('?')) {
        const thenExpr = this.parseExpression();
        this.expectOp(':');
        const elseExpr = this.parseConditional();
        return { type: 'Conditional', cond, thenExpr, elseExpr, line: cond.line };
      }
      return cond;
    }

    parseLogicalOr() {
      let left = this.parseLogicalAnd();
      while (this.matchOp('||')) {
        const op = '||';
        const right = this.parseLogicalAnd();
        left = { type: 'Binary', left, op, right, line: left.line };
      }
      return left;
    }

    parseLogicalAnd() {
      let left = this.parseEquality();
      while (this.matchOp('&&')) {
        const op = '&&';
        const right = this.parseEquality();
        left = { type: 'Binary', left, op, right, line: left.line };
      }
      return left;
    }

    parseEquality() {
      let left = this.parseRelational();
      while (this.isOp('==') || this.isOp('!=')) {
        const op = this.next().value;
        const right = this.parseRelational();
        left = { type: 'Binary', left, op, right, line: left.line };
      }
      return left;
    }

    parseRelational() {
      let left = this.parseAdditive();
      while (this.isOp('<') || this.isOp('>') || this.isOp('<=') || this.isOp('>=')) {
        const op = this.next().value;
        const right = this.parseAdditive();
        left = { type: 'Binary', left, op, right, line: left.line };
      }
      return left;
    }

    parseAdditive() {
      let left = this.parseMultiplicative();
      while (this.isOp('+') || this.isOp('-')) {
        const op = this.next().value;
        const right = this.parseMultiplicative();
        left = { type: 'Binary', left, op, right, line: left.line };
      }
      return left;
    }

    parseMultiplicative() {
      let left = this.parseUnary();
      while (this.isOp('*') || this.isOp('/') || this.isOp('%')) {
        const op = this.next().value;
        const right = this.parseUnary();
        left = { type: 'Binary', left, op, right, line: left.line };
      }
      return left;
    }

    parseUnary() {
      const line = this.peek().line;
      if (this.matchOp('-')) {
        const operand = this.parseUnary();
        return { type: 'Unary', op: '-', operand, line };
      }
      if (this.matchOp('+')) {
        const operand = this.parseUnary();
        return { type: 'Unary', op: '+', operand, line };
      }
      if (this.matchOp('!')) {
        const operand = this.parseUnary();
        return { type: 'Unary', op: '!', operand, line };
      }
      if (this.matchOp('++')) {
        const operand = this.parseUnary();
        return { type: 'PrefixIncDec', op: '++', operand, line };
      }
      if (this.matchOp('--')) {
        const operand = this.parseUnary();
        return { type: 'PrefixIncDec', op: '--', operand, line };
      }
      return this.parsePostfix();
    }

    parsePostfix() {
      let expr = this.parsePrimary();
      while (true) {
        if (this.matchOp('[')) {
          const index = this.parseExpression();
          this.expectOp(']');
          expr = { type: 'Index', array: expr, index, line: expr.line };
        } else if (this.matchOp('(')) {
          const args = [];
          if (!this.isOp(')')) {
            while (true) {
              args.push(this.parseAssignment());
              if (this.matchOp(',')) continue;
              else break;
            }
          }
          this.expectOp(')');
          expr = { type: 'Call', callee: expr, args, line: expr.line };
        } else if (this.matchOp('++')) {
          expr = { type: 'PostfixIncDec', op: '++', operand: expr, line: expr.line };
        } else if (this.matchOp('--')) {
          expr = { type: 'PostfixIncDec', op: '--', operand: expr, line: expr.line };
        } else {
          break;
        }
      }
      return expr;
    }

    parsePrimary() {
      const tok = this.peek();
      const line = tok.line;
      if (tok.type === 'number') {
        this.next();
        return { type: 'Literal', valueType: tok.isChar ? 'char' : ((tok.isFloat || !Number.isInteger(tok.value)) ? 'float' : 'int'), value: tok.value, line };
      }
      if (tok.type === 'string') {
        this.next();
        return { type: 'StringLiteral', value: tok.value, line };
      }
      if (tok.type === 'identifier') {
        this.next();
        if (tok.value === 'scanf') {
          throw new Error('scanf no soportado (línea ' + line + ')');
        }
        return { type: 'Identifier', name: tok.value, line };
      }
      if (this.matchOp('(')) {
        const expr = this.parseExpression();
        this.expectOp(')');
        return expr;
      }
      throw new Error('Expresión no válida en línea ' + line);
    }
  }

  // ==================== Interpreter ====================
  class InterpreterError extends Error {
    constructor(message, line) {
      super(message);
      this.line = line;
    }
  }

  class BreakSignal {}
  class ContinueSignal {}
  class ReturnSignal {
    constructor(value) { this.value = value; }
  }

  class Interpreter {
    constructor(program) {
      this.program = program;
      this.globals = new Map(); // name -> { ty, arr, value }
      this.functions = program.functions;
      this.callStack = []; // each: { name, scopeStack, returnType }
      this.output = '';
      this.steps = [];
      this.stepCount = 0;
      this.maxSteps = 5000;
      this.maxDepth = 200;
      this.currentLine = 0;
    }

    run() {
      // Execute global declarations
      this.curFnName = null;
      this.curDepth = 0;
      for (const varDecl of this.program.globals) {
        this.executeStatement(varDecl);
      }
      const main = this.functions['main'];
      if (!main) {
        throw new InterpreterError('Falta la función main()', 1);
      }
      // Call main with no args
      this.callUserFunction(main, []);
      return {
        ok: true,
        output: this.output,
        error: null,
        errorLine: null,
        steps: this.steps
      };
    }

    // ---------- Scope management ----------
    currentScopeStack() {
      if (this.callStack.length === 0) return [this.globals];
      return this.callStack[this.callStack.length - 1].scopeStack;
    }

    pushScope() {
      if (this.callStack.length === 0) return;
      this.callStack[this.callStack.length - 1].scopeStack.push(new Map());
    }

    popScope() {
      if (this.callStack.length === 0) return;
      this.callStack[this.callStack.length - 1].scopeStack.pop();
    }

    currentScopes() {
      // returns array of Maps from innermost to outermost, including global as last
      const scopes = [];
      if (this.callStack.length > 0) {
        const stack = this.callStack[this.callStack.length - 1].scopeStack;
        for (let i = stack.length - 1; i >= 0; i--) scopes.push(stack[i]);
      }
      scopes.push(this.globals);
      return scopes;
    }

    declareVariable(name, ty, arr, value) {
      const scope = this.currentScopeStack()[this.currentScopeStack().length - 1];
      if (scope.has(name)) {
        throw new InterpreterError(`'${name}' ya fue declarada en este ámbito`, this.currentLine);
      }
      scope.set(name, { ty, arr, value });
    }

    lookupVariable(name) {
      const scopes = this.currentScopes();
      for (const scope of scopes) {
        if (scope.has(name)) return scope.get(name);
      }
      return null;
    }

    getVariableValue(name) {
      const v = this.lookupVariable(name);
      if (!v) throw new InterpreterError(`'${name}' no está declarada`, this.currentLine);
      if (v.arr) {
        return v.value.slice(); // copy array
      }
      return v.value;
    }

    // ---------- Type conversion ----------
    convertTo(ty, value) {
      if (ty === 'int') return Math.trunc(value) | 0;
      if (ty === 'char') return (Math.trunc(value) % 256 + 256) % 256;
      if (ty === 'float') return Number(value);
      return value;
    }

    // ---------- Evaluation ----------
    evalExpr(expr) {
      if (expr.type === 'Literal') {
        return expr.value;
      }
      if (expr.type === 'StringLiteral') {
        // return array of char codes including null terminator
        const str = expr.value;
        const arr = [];
        for (let i = 0; i < str.length; i++) arr.push(str.charCodeAt(i));
        arr.push(0);
        return arr;
      }
      if (expr.type === 'Identifier') {
        return this.getVariableValue(expr.name);
      }
      if (expr.type === 'Binary') {
        const left = this.evalExpr(expr.left);
        if (expr.op === '&&') {
          return left ? (this.evalExpr(expr.right) ? 1 : 0) : 0;
        }
        if (expr.op === '||') {
          return left ? 1 : (this.evalExpr(expr.right) ? 1 : 0);
        }
        const right = this.evalExpr(expr.right);
        const leftIsFloat = this.getExprType(expr.left) === 'float';
        const rightIsFloat = this.getExprType(expr.right) === 'float';
        const useFloat = leftIsFloat || rightIsFloat;
        const l = Array.isArray(left) ? NaN : left;
        const r = Array.isArray(right) ? NaN : right;
        switch (expr.op) {
          case '+': return useFloat ? l + r : (l + r) | 0;
          case '-': return useFloat ? l - r : (l - r) | 0;
          case '*': return useFloat ? l * r : (l * r) | 0;
          case '/':
            if (r === 0) throw new InterpreterError('División entre cero', this.currentLine);
            if (useFloat) return l / r;
            return Math.trunc(l / r) | 0;
          case '%':
            if (r === 0) throw new InterpreterError('División entre cero', this.currentLine);
            return l % r | 0;
          case '==': return l === r ? 1 : 0;
          case '!=': return l !== r ? 1 : 0;
          case '<': return l < r ? 1 : 0;
          case '>': return l > r ? 1 : 0;
          case '<=': return l <= r ? 1 : 0;
          case '>=': return l >= r ? 1 : 0;
        }
      }
      if (expr.type === 'Unary') {
        const val = this.evalExpr(expr.operand);
        switch (expr.op) {
          case '-': return -val;
          case '+': return +val;
          case '!': return val ? 0 : 1;
        }
      }
      if (expr.type === 'Conditional') {
        const cond = this.evalExpr(expr.cond);
        return cond ? this.evalExpr(expr.thenExpr) : this.evalExpr(expr.elseExpr);
      }
      if (expr.type === 'Assign') {
        const lval = this.evalLVal(expr.left);
        const rval = this.evalExpr(expr.right);
        let newVal;
        if (expr.op === '=') {
          newVal = rval;
        } else {
          const cur = this.getLValValue(lval);
          const op = expr.op.slice(0, -1);
          newVal = this.applyBinary(op, cur, rval, expr.line);
        }
        newVal = this.convertTo(lval.ty, newVal);
        this.setLValValue(lval, newVal);
        return newVal;
      }
      if (expr.type === 'PrefixIncDec') {
        const lval = this.evalLVal(expr.operand);
        let cur = this.getLValValue(lval);
        const delta = expr.op === '++' ? 1 : -1;
        cur = this.convertTo(lval.ty, cur + delta);
        this.setLValValue(lval, cur);
        return cur;
      }
      if (expr.type === 'PostfixIncDec') {
        const lval = this.evalLVal(expr.operand);
        const old = this.getLValValue(lval);
        const delta = expr.op === '++' ? 1 : -1;
        const newVal = this.convertTo(lval.ty, old + delta);
        this.setLValValue(lval, newVal);
        return old;
      }
      if (expr.type === 'Index') {
        const arrVal = this.evalExpr(expr.array);
        if (!Array.isArray(arrVal)) throw new InterpreterError('El operando no es un arreglo', this.currentLine);
        const index = this.evalExpr(expr.index);
        if (index < 0 || index >= arrVal.length) throw new InterpreterError('Índice fuera de rango', this.currentLine);
        return arrVal[index];
      }
      if (expr.type === 'Call') {
        return this.evalCall(expr);
      }
      throw new InterpreterError('Expresión no soportada', this.currentLine);
    }

    evalLVal(expr) {
      if (expr.type === 'Identifier') {
        const v = this.lookupVariable(expr.name);
        if (!v) throw new InterpreterError(`'${expr.name}' no está declarada`, this.currentLine);
        return { type: 'var', obj: v, ty: v.ty, isArray: v.arr };
      }
      if (expr.type === 'Index') {
        const arrLVal = this.evalLVal(expr.array);
        if (!arrLVal.isArray) throw new InterpreterError('El operando no es un arreglo', this.currentLine);
        const index = this.evalExpr(expr.index);
        const arr = arrLVal.obj.value;
        if (index < 0 || index >= arr.length) throw new InterpreterError('Índice fuera de rango', this.currentLine);
        return { type: 'arrayElem', obj: arrLVal.obj, index, ty: arrLVal.ty, isArray: false };
      }
      throw new InterpreterError('No se puede asignar a esta expresión', this.currentLine);
    }

    getLValValue(lval) {
      if (lval.type === 'var') return lval.obj.value;
      if (lval.type === 'arrayElem') return lval.obj.value[lval.index];
      throw new InterpreterError('LValue inválido', this.currentLine);
    }

    setLValValue(lval, value) {
      if (lval.type === 'var') {
        if (lval.obj.arr) {
          // should not happen for assignment to whole array?
          // copy array? not supported
          throw new InterpreterError('Asignación a arreglo no soportada', this.currentLine);
        }
        lval.obj.value = value;
      } else if (lval.type === 'arrayElem') {
        lval.obj.value[lval.index] = value;
      }
    }

    applyBinary(op, left, right, line) {
      const useFloat = typeof left === 'number' && !Number.isInteger(left) || typeof right === 'number' && !Number.isInteger(right);
      switch (op) {
        case '+': return useFloat ? left + right : (left + right) | 0;
        case '-': return useFloat ? left - right : (left - right) | 0;
        case '*': return useFloat ? left * right : (left * right) | 0;
        case '/':
          if (right === 0) throw new InterpreterError('División entre cero', line);
          if (useFloat) return left / right;
          return Math.trunc(left / right) | 0;
        case '%':
          if (right === 0) throw new InterpreterError('División entre cero', line);
          return left % right | 0;
      }
    }

    getExprType(expr) {
      if (expr.type === 'Literal') return expr.valueType;
      if (expr.type === 'Identifier') {
        const v = this.lookupVariable(expr.name);
        if (v) return v.ty;
        return 'int';
      }
      if (expr.type === 'StringLiteral') return 'char';
      if (expr.type === 'Unary') return expr.op === '!' ? 'int' : this.getExprType(expr.operand);
      if (expr.type === 'Binary') {
        if (['==', '!=', '<', '>', '<=', '>=', '&&', '||'].includes(expr.op)) return 'int';
        if (this.getExprType(expr.left) === 'float' || this.getExprType(expr.right) === 'float') return 'float';
        return 'int';
      }
      if (expr.type === 'Conditional') {
        if (this.getExprType(expr.thenExpr) === 'float' || this.getExprType(expr.elseExpr) === 'float') return 'float';
        return 'int';
      }
      return 'int';
    }

    isArray(val) { return Array.isArray(val); }
    isFloatType(ty) { return ty === 'float'; }

    // ---------- Function calls ----------
    evalCall(callExpr) {
      const callee = callExpr.callee;
      let funcName;
      if (callee.type === 'Identifier') {
        funcName = callee.name;
      } else {
        throw new InterpreterError('Llamada a función no válida', this.currentLine);
      }
      // Evaluate arguments
      const args = callExpr.args.map(arg => this.evalExpr(arg));
      // Builtins
      if (funcName === 'printf') return this.builtinPrintf(args, callExpr.line);
      if (funcName === 'puts') return this.builtinPuts(args, callExpr.line);
      if (funcName === 'putchar') return this.builtinPutchar(args, callExpr.line);
      if (funcName === 'scanf') throw new InterpreterError('scanf no soportado', this.currentLine);
      const func = this.functions[funcName];
      if (!func) throw new InterpreterError(`Función '${funcName}' no definida`, this.currentLine);
      return this.callUserFunction(func, args);
    }

    callUserFunction(func, args) {
      if (this.callStack.length >= this.maxDepth) {
        throw new InterpreterError('Demasiadas llamadas anidadas (¿recursión infinita?)', this.currentLine);
      }
      const frame = {
        name: func.name,
        scopeStack: [new Map()],
        returnType: func.returnType
      };
      this.callStack.push(frame);
      // Bind parameters
      const params = func.params;
      for (let i = 0; i < params.length; i++) {
        const p = params[i];
        const arg = args[i];
        if (p.isArray) {
          if (!Array.isArray(arg)) throw new InterpreterError(`El parámetro ${p.name} espera un arreglo`, this.currentLine);
          const arrCopy = arg.slice();
          frame.scopeStack[0].set(p.name, { ty: p.type, arr: true, value: arrCopy });
        } else {
          const val = this.convertTo(p.type, arg);
          frame.scopeStack[0].set(p.name, { ty: p.type, arr: false, value: val });
        }
      }
      let returnValue = 0;
      try {
        this.executeFunctionBody(func.body);
      } catch (e) {
        if (e instanceof ReturnSignal) {
          returnValue = this.convertTo(func.returnType, e.value);
        } else {
          throw e;
        }
      } finally {
        this.callStack.pop();
      }
      return returnValue;
    }

    executeFunctionBody(block) {
      // Execute statements without pushing an extra block scope,
      // because function body shares scope with parameters.
      for (const stmt of block.stmts) {
        this.executeStatement(stmt);
      }
    }

    // ---------- Statements execution ----------
    executeStatement(stmt) {
      // Record step for statements except Block and Empty
      if (stmt.type !== 'Block' && stmt.type !== 'Empty') {
        this.recordStep(stmt.line);
      }
      this.currentLine = stmt.line;
      switch (stmt.type) {
        case 'Block': this.executeBlock(stmt); break;
        case 'Empty': break;
        case 'VarDecl': this.executeVarDecl(stmt); break;
        case 'Expression': this.evalExpr(stmt.expr); break;
        case 'If': this.executeIf(stmt); break;
        case 'While': this.executeWhile(stmt); break;
        case 'DoWhile': this.executeDoWhile(stmt); break;
        case 'For': this.executeFor(stmt); break;
        case 'Break': throw new BreakSignal();
        case 'Continue': throw new ContinueSignal();
        case 'Return': {
          const val = stmt.expr ? this.evalExpr(stmt.expr) : 0;
          throw new ReturnSignal(val);
        }
        default:
          throw new InterpreterError('Sentencia no soportada', stmt.line);
      }
    }

    executeBlock(block) {
      if (this.callStack.length > 0) {
        this.pushScope();
      }
      try {
        for (const stmt of block.stmts) {
          this.executeStatement(stmt);
        }
      } finally {
        if (this.callStack.length > 0) {
          this.popScope();
        }
      }
    }

    executeVarDecl(stmt) {
      const varType = stmt.varType;
      for (const decl of stmt.declarators) {
        let value;
        if (decl.isArray) {
          let size;
          if (decl.arraySize === null) {
            // infer
            if (decl.init && decl.init.type === 'ArrayInit') {
              size = decl.init.elements.length;
            } else if (decl.init && decl.init.type === 'StringLiteral') {
              size = decl.init.value.length + 1;
            } else {
              size = 0;
            }
          } else if (typeof decl.arraySize === 'object') {
            // expression
            const sz = this.evalExpr(decl.arraySize);
            if (!Number.isInteger(sz) || sz < 0) throw new InterpreterError('Tamaño de arreglo no válido', this.currentLine);
            size = sz;
          } else {
            size = decl.arraySize;
          }
          const arr = new Array(size).fill(0);
          if (decl.init) {
            if (decl.init.type === 'ArrayInit') {
              const elems = decl.init.elements;
              for (let i = 0; i < Math.min(size, elems.length); i++) {
                arr[i] = this.convertTo(varType, this.evalExpr(elems[i]));
              }
            } else if (decl.init.type === 'StringLiteral') {
              if (varType !== 'char') {
                throw new InterpreterError('Solo se puede inicializar char[] con cadena', this.currentLine);
              }
              const str = decl.init.value;
              for (let i = 0; i < str.length && i < size; i++) {
                arr[i] = str.charCodeAt(i);
              }
              if (str.length < size) arr[str.length] = 0;
            } else {
              // scalar initializer for array? not allowed
              throw new InterpreterError('Inicialización de arreglo no válida', this.currentLine);
            }
          }
          value = arr;
          this.declareVariable(decl.name, varType, true, value);
        } else {
          if (decl.init) {
            value = this.evalExpr(decl.init);
            if (Array.isArray(value)) {
              throw new InterpreterError('Asignación de arreglo a variable escalar', this.currentLine);
            }
            value = this.convertTo(varType, value);
          } else {
            value = (varType === 'float') ? 0.0 : 0;
          }
          this.declareVariable(decl.name, varType, false, value);
        }
      }
    }

    executeIf(stmt) {
      const cond = this.evalExpr(stmt.cond);
      if (cond) {
        this.executeStatement(stmt.thenStmt);
      } else if (stmt.elseStmt) {
        this.executeStatement(stmt.elseStmt);
      }
    }

    executeWhile(stmt) {
      while (true) {
        this.recordStep(stmt.line); // condition evaluation step
        const cond = this.evalExpr(stmt.cond);
        if (!cond) break;
        try {
          this.executeStatement(stmt.body);
        } catch (e) {
          if (e instanceof BreakSignal) break;
          if (e instanceof ContinueSignal) continue;
          throw e;
        }
      }
    }

    executeDoWhile(stmt) {
      do {
        try {
          this.executeStatement(stmt.body);
        } catch (e) {
          if (e instanceof BreakSignal) break;
          if (e instanceof ContinueSignal) {
            // continue jumps to condition evaluation
          } else throw e;
        }
        this.recordStep(stmt.line); // condition evaluation step
        const cond = this.evalExpr(stmt.cond);
        if (!cond) break;
      } while (true);
    }

    executeFor(stmt) {
      if (stmt.init) {
        if (stmt.init.type === 'VarDecl') this.executeVarDecl(stmt.init);
        else this.evalExpr(stmt.init.expr);
      }
      while (true) {
        if (stmt.cond) {
          this.recordStep(stmt.line); // condition evaluation step
          const cond = this.evalExpr(stmt.cond);
          if (!cond) break;
        } else {
          this.recordStep(stmt.line); // still record condition? spec says once per iteration
        }
        try {
          this.executeStatement(stmt.body);
        } catch (e) {
          if (e instanceof BreakSignal) break;
          if (e instanceof ContinueSignal) {
            // continue goes to increment
          } else throw e;
        }
        if (stmt.incr) {
          this.evalExpr(stmt.incr);
        }
      }
    }

    // ---------- Builtins ----------
    builtinPrintf(args, line) {
      if (args.length === 0) return 0;
      const formatArg = args[0];
      let formatStr;
      if (typeof formatArg === 'number') {
        // assume char code? not useful
        formatStr = String.fromCharCode(formatArg);
      } else if (Array.isArray(formatArg)) {
        formatStr = this.arrayToString(formatArg);
      } else {
        // if it's a string literal? not possible, but maybe from variable
        const v = this.lookupVariable(formatArg);
        if (v) {
          if (v.arr) formatStr = this.arrayToString(v.value);
          else formatStr = String.fromCharCode(v.value);
        } else {
          formatStr = String(formatArg);
        }
      }
      let argIndex = 1;
      let out = '';
      for (let i = 0; i < formatStr.length; i++) {
        const ch = formatStr[i];
        if (ch !== '%') {
          out += ch;
          continue;
        }
        i++;
        if (i >= formatStr.length) break;
        let spec = '';
        let flagMinus = false;
        if (formatStr[i] === '-') { flagMinus = true; i++; }
        while (/[0-9]/.test(formatStr[i])) {
          spec += formatStr[i];
          i++;
        }
        let width = spec ? parseInt(spec, 10) : 0;
        let precision = 6;
        if (formatStr[i] === '.') {
          i++;
          let precStr = '';
          while (/[0-9]/.test(formatStr[i])) {
            precStr += formatStr[i];
            i++;
          }
          precision = precStr ? parseInt(precStr, 10) : 0;
        }
        const conv = formatStr[i];
        if (conv === '%') {
          out += '%';
          continue;
        }
        const val = args[argIndex];
        argIndex++;
        let formatted = '';
        switch (conv) {
          case 'd': case 'i': {
            formatted = String(Math.trunc(val) | 0);
            break;
          }
          case 'f': {
            formatted = Number(val).toFixed(precision);
            break;
          }
          case 'c': {
            formatted = String.fromCharCode(val & 0xFF);
            break;
          }
          case 's': {
            let str;
            if (Array.isArray(val)) str = this.arrayToString(val);
            else if (typeof val === 'number') str = String.fromCharCode(val);
            else str = String(val);
            formatted = str;
            break;
          }
          default:
            throw new InterpreterError('Formato printf no soportado: %' + conv, line);
        }
        if (width > 0 && formatted.length < width) {
          const pad = ' '.repeat(width - formatted.length);
          formatted = flagMinus ? formatted + pad : pad + formatted;
        }
        out += formatted;
      }
      this.output += out;
      return 0;
    }

    builtinPuts(args) {
      if (args.length === 0) return 0;
      const arg = args[0];
      let str;
      if (Array.isArray(arg)) str = this.arrayToString(arg);
      else if (typeof arg === 'number') str = String.fromCharCode(arg);
      else str = String(arg);
      this.output += str + '\n';
      return 0;
    }

    builtinPutchar(args) {
      if (args.length === 0) return 0;
      const ch = Math.trunc(args[0]) & 0xFF;
      this.output += String.fromCharCode(ch);
      return args[0];
    }

    arrayToString(arr) {
      let str = '';
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) break;
        str += String.fromCharCode(arr[i]);
      }
      return str;
    }

    // ---------- Step recording ----------
    recordStep(line) {
      this.stepCount++;
      if (this.stepCount > this.maxSteps) {
        throw new InterpreterError('Más de 5000 pasos: posible bucle infinito', this.currentLine || line);
      }
      const fnName = this.callStack.length > 0 ? this.callStack[this.callStack.length - 1].name : null;
      const depth = this.callStack.length;
      const vars = [];
      const seen = new Set();
      // Collect local scopes (innermost first)
      if (this.callStack.length > 0) {
        const stack = this.callStack[this.callStack.length - 1].scopeStack;
        for (let i = stack.length - 1; i >= 0; i--) {
          const map = stack[i];
          for (const [name, v] of map) {
            if (seen.has(name)) continue;
            seen.add(name);
            vars.push({
              name,
              fn: fnName,
              ty: v.ty,
              arr: v.arr,
              v: v.arr ? v.value.slice() : v.value
            });
          }
        }
      }
      // Global variables (only if not already seen)
      for (const [name, v] of this.globals) {
        if (seen.has(name)) continue;
        seen.add(name);
        vars.push({
          name,
          fn: null,
          ty: v.ty,
          arr: v.arr,
          v: v.arr ? v.value.slice() : v.value
        });
      }
      this.steps.push({
        line,
        fn: fnName,
        depth,
        out: this.output,
        vars
      });
    }
  }

  // ==================== Public API ====================
  function run(source) {
    try {
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const program = parser.parseProgram();
      if (!program.functions['main']) {
        throw new InterpreterError('Falta la función main()', 1);
      }
      const interpreter = new Interpreter(program);
      return interpreter.run();
    } catch (e) {
      let errorMessage = e.message || String(e);
      let errorLine = e.line || null;
      // If it's InterpreterError, line is set; else try to extract line from message
      return {
        ok: false,
        output: '',
        error: errorMessage,
        errorLine: errorLine,
        steps: []
      };
    }
  }

  // Attach to global
  g.CInterp = { run: run };
})(typeof globalThis !== 'undefined' ? globalThis : window);

if (typeof module !== 'undefined') module.exports = { run: globalThis.CInterp.run };
