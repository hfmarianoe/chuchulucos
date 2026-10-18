if (typeof require === 'function' && typeof module !== 'undefined') {
  // En Node los módulos de compilador-c se cargan aquí; en el navegador los carga index.html.
  require('./lexico.js');
  require('./parser.js');
  require('./interprete.js');
}

(function (g) {
  'use strict';
  const { Lexer, Parser, Interpreter, InterpreterError } = g.CInterp;


  // ==================== Public API ====================
  function run(source) {
    let interpreter = null;
    try {
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const program = parser.parseProgram();
      if (!program.functions['main']) {
        throw new InterpreterError('Falta la función main()', 1);
      }
      interpreter = new Interpreter(program);
      return interpreter.run();
    } catch (e) {
      let errorMessage = e.message || String(e);
      let errorLine = e.line || null;
      if (errorLine === null) {
        const match = errorMessage.match(/en línea (\d+)/);
        if (match) errorLine = Number(match[1]);
      }
      return {
        ok: false,
        output: interpreter ? interpreter.output : '',
        error: errorMessage,
        errorLine: errorLine,
        steps: [],
        pasos: interpreter ? interpreter.stepCount : 0,
        limite: interpreter ? interpreter.maxSteps : null,
        profundidad: interpreter ? interpreter.profundidadMax : 0
      };
    }
  }

  // Mide un programa sin ejecutarlo: variables declaradas y niveles de anidamiento.
  function analizar(source) {
    const program = new Parser(new Lexer(source).tokenize()).parseProgram();
    let variables = program.globals.reduce((n, d) => n + d.declarators.length, 0);
    let anidamiento = 0;
    const recorrer = (stmt, nivel) => {
      if (!stmt) return;
      if (stmt.type === 'VarDecl') {
        variables += stmt.declarators.length;
      } else if (stmt.type === 'Block') {
        stmt.stmts.forEach((s) => recorrer(s, nivel));
      } else if (stmt.type === 'If') {
        const n = nivel + 1;
        anidamiento = Math.max(anidamiento, n);
        recorrer(stmt.thenStmt, n);
        // Un else if no añade nivel: la cadena se lee como una sola decisión.
        const esElseIf = stmt.elseStmt && stmt.elseStmt.type === 'If';
        recorrer(stmt.elseStmt, esElseIf ? nivel : n);
      } else if (stmt.type === 'While' || stmt.type === 'DoWhile' || stmt.type === 'For') {
        const n = nivel + 1;
        anidamiento = Math.max(anidamiento, n);
        if (stmt.type === 'For' && stmt.init && stmt.init.type === 'VarDecl') {
          variables += stmt.init.declarators.length;
        }
        recorrer(stmt.body, n);
      }
    };
    for (const nombre of Object.keys(program.functions)) {
      const f = program.functions[nombre];
      variables += f.params.length;
      recorrer(f.body, 0);
    }
    return { variables, anidamiento };
  }


  g.CInterp = Object.assign(g.CInterp || {}, { run: run, analizar: analizar });
})(typeof globalThis !== 'undefined' ? globalThis : window);

if (typeof module !== 'undefined') module.exports = { run: globalThis.CInterp.run, analizar: globalThis.CInterp.analizar };
