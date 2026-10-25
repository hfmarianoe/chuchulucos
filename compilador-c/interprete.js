(function (g) {
  'use strict';

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
      this.instantaneas = new Map(); // última instantánea de cada variable (clave: función + nombre)
      this.maxSteps = 50000;
      this.maxDepth = 200;
      this.profundidadMax = 0;
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
        steps: this.steps,
        pasos: this.stepCount,
        limite: this.maxSteps,
        profundidad: this.profundidadMax
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
          newVal = this.applyBinary(op, cur, rval, expr.line, lval.ty === 'float');
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

    applyBinary(op, left, right, line, useFloat) {
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
      if (expr.type === 'Call' && expr.callee.type === 'Identifier') {
        const func = this.functions[expr.callee.name];
        return func ? func.returnType : 'int';
      }
      if (expr.type === 'Assign') return this.getExprType(expr.left);
      if (expr.type === 'Index') return this.getExprType(expr.array);
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

    isFloatType(ty) { return ty === 'float'; }

    // ---------- Function calls ----------
    evalArg(arg) {
      if (arg.type === 'Identifier') {
        const v = this.lookupVariable(arg.name);
        if (v && v.arr) return v.value;
      }
      return this.evalExpr(arg);
    }

    evalCall(callExpr) {
      const callee = callExpr.callee;
      let funcName;
      if (callee.type === 'Identifier') {
        funcName = callee.name;
      } else {
        throw new InterpreterError('Llamada a función no válida', this.currentLine);
      }
      // Evaluate arguments
      const args = callExpr.args.map(arg => this.evalArg(arg));
      // Builtins
      if (funcName === 'printf') return this.builtinPrintf(args, callExpr.line);
      if (funcName === 'puts') return this.builtinPuts(args, callExpr.line);
      if (funcName === 'putchar') return this.builtinPutchar(args, callExpr.line);
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
          frame.scopeStack[0].set(p.name, { ty: p.type, arr: true, value: arg });
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
      this.pushScope();
      try {
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
      } finally {
        this.popScope();
      }
    }

    // ---------- Builtins ----------
    builtinPrintf(args, line) {
      if (args.length === 0) return 0;
      const formatArg = args[0];
      // evalArg solo entrega números (código de carácter) o arreglos de códigos (cadenas).
      const formatStr = Array.isArray(formatArg)
        ? this.arrayToString(formatArg)
        : String.fromCharCode(formatArg);
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
        if (width > 1000) throw new InterpreterError('Ancho de printf fuera de rango (máximo 1000)', line);
        if (precision > 100) throw new InterpreterError('Precisión de printf fuera de rango (máximo 100)', line);
        const conv = formatStr[i];
        if (conv === '%') {
          out += '%';
          continue;
        }
        if (argIndex >= args.length) throw new InterpreterError(`printf: falta un argumento para %${conv}`, line);
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
      return ch;
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
    // Instantánea de una variable para la traza. Si su valor no cambió desde la última
    // instantánea de esa misma variable, se reutiliza ese objeto: así no se copia de nuevo el arreglo.
    instantaneaVariable(fn, name, v) {
      const clave = (fn === null ? '' : fn) + '\u0000' + name;
      const previa = this.instantaneas.get(clave);
      if (previa && previa.ty === v.ty && previa.arr === v.arr && this.mismoValor(previa.v, v.value)) {
        return previa;
      }
      const nueva = { name, fn, ty: v.ty, arr: v.arr, v: v.arr ? v.value.slice() : v.value };
      this.instantaneas.set(clave, nueva);
      return nueva;
    }

    // Compara el valor guardado en una instantánea con el valor vivo (número o arreglo).
    mismoValor(guardado, vivo) {
      if (Array.isArray(vivo)) {
        if (!Array.isArray(guardado) || guardado.length !== vivo.length) return false;
        for (let i = 0; i < vivo.length; i++) {
          if (!Object.is(guardado[i], vivo[i])) return false;
        }
        return true;
      }
      return Object.is(guardado, vivo);
    }

    recordStep(line) {
      this.stepCount++;
      if (this.stepCount > this.maxSteps) {
        throw new InterpreterError('Se superó el límite de ' + this.maxSteps + ' pasos (¿bucle infinito?)', this.currentLine || line);
      }
      const fnName = this.callStack.length > 0 ? this.callStack[this.callStack.length - 1].name : null;
      const depth = this.callStack.length;
      if (depth > this.profundidadMax) this.profundidadMax = depth;
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
            vars.push(this.instantaneaVariable(fnName, name, v));
          }
        }
      }
      // Global variables (only if not already seen)
      for (const [name, v] of this.globals) {
        if (seen.has(name)) continue;
        seen.add(name);
        vars.push(this.instantaneaVariable(null, name, v));
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

  g.CInterp = g.CInterp || {};
  g.CInterp.Interpreter = Interpreter;
  g.CInterp.InterpreterError = InterpreterError;
})(typeof globalThis !== 'undefined' ? globalThis : window);
