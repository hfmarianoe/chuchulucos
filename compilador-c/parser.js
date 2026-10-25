(function (g) {
  'use strict';

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
          const func = this.parseFunctionRest(typeInfo.ty, nameTok.value, nameTok.line);
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
      if (this.isOp(';')) {
        throw new Error(`Prototipo de '${name}' no soportado en línea ${line}: escribe la función completa`);
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
          if (expr.type === 'Identifier' && (expr.name === 'scanf' || expr.name === 'strlen')) {
            const aviso = expr.name === 'scanf' ? 'scanf no soportado' : "'strlen' no soportado";
            throw new Error(aviso + ' en línea ' + expr.line);
          }
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


  g.CInterp = g.CInterp || {};
  g.CInterp.Parser = Parser;
})(typeof globalThis !== 'undefined' ? globalThis : window);
