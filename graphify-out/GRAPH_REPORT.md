# Graph Report - chuchulucos  (2026-10-25)

## Corpus Check
- 157 files · ~63,418 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .toml 1, .css 1)

## Summary
- 706 nodes · 866 edges · 135 communities (53 shown, 82 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d062147`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_node_assert
- re
- Interpreter
- Parser
- Fase 2 — Auditoría (solo lectura)
- Rules
- 5. Re-render Optimization
- Auditoría de chuchulucos.shop — 24 de octubre de 2026
- 7. JavaScript Performance
- Quick Reference
- Find Skills
- 6. Rendering Performance
- 3. Server-Side Performance
- Sections
- /router
- voice.md
- interface
- 1. Eliminating Waterfalls
- 2. Bundle Size Optimization
- yt-comment
- yt-seo
- chuchulucos.shop
- Karpathy Guidelines
- React Best Practices
- yt-audit
- yt-package
- yt-plan
- yt-script
- claude-code-setup
- claude-mem
- markitdown
- Ponytail
- Task Observer
- YouTube Agent Skill
- chuchulucos.shop
- React Best Practices
- 4. Client-Side Data Fetching
- 8. Advanced Patterns
- yt-chapters
- yt-edit
- yt-retention
- yt-shorts
- yt-viral
- Lexer
- Agent Skills (Addy Osmani)
- find-skills (Vercel)
- Graphify
- react-best-practices (Vercel)
- chuchulucos.shop
- async-cheap-condition-before-await.md
- Prefer Statically Analyzable Paths
- server-hoist-static-io.md
- Autoharness
- Claude Octopus
- i-have-adhd
- Reglas de Karpathy
- Pro Workflow
- Ars Contexta
- instalar-markitdown.sh
- .claude/CLAUDE.md
- session-start.sh
- advanced-effect-event-deps.md
- advanced-event-handler-refs.md
- advanced-init-once.md
- advanced-use-latest.md
- async-api-routes.md
- async-dependencies.md
- async-parallel.md
- async-suspense-boundaries.md
- bundle-barrel-imports.md
- bundle-conditional.md
- bundle-defer-third-party.md
- bundle-dynamic-imports.md
- bundle-preload.md
- client-event-listeners.md
- client-localstorage-schema.md
- client-passive-event-listeners.md
- client-swr-dedup.md
- js-batch-dom-css.md
- js-cache-function-results.md
- js-cache-property-access.md
- js-cache-storage.md
- js-combine-iterations.md
- js-early-exit.md
- js-flatmap-filter.md
- js-hoist-regexp.md
- js-index-maps.md
- js-length-check-first.md
- js-min-max-loop.md
- js-request-idle-callback.md
- js-set-map-lookups.md
- js-tosorted-immutable.md
- rendering-activity.md
- rendering-animate-svg-wrapper.md
- rendering-conditional-render.md
- rendering-content-visibility.md
- rendering-hoist-jsx.md
- rendering-hydration-no-flicker.md
- rendering-hydration-suppress-warning.md
- rendering-resource-hints.md
- rendering-script-defer-async.md
- rendering-svg-precision.md
- rendering-usetransition-loading.md
- rerender-defer-reads.md
- rerender-dependencies.md
- rerender-derived-state.md
- rerender-derived-state-no-effect.md
- rerender-functional-setstate.md
- rerender-lazy-state-init.md
- rerender-memo.md
- rerender-memo-with-default-value.md
- rerender-move-effect-to-event.md
- rerender-no-inline-components.md
- rerender-simple-expression-in-memo.md
- rerender-split-combined-hooks.md
- rerender-transitions.md
- rerender-use-deferred-value.md
- rerender-use-ref-transient-values.md
- server-after-nonblocking.md
- server-auth-actions.md
- server-cache-lru.md
- server-dedup-props.md
- server-parallel-fetching.md
- server-parallel-nested-fetching.md
- server-serialization.md
- _template.md
- flujo-desarrollo/README.md
- detectar-claves.sh
- verificar.sh
- flujo-desarrollo/SKILL.md

## God Nodes (most connected - your core abstractions)
1. `Interpreter` - 36 edges
2. `Parser` - 32 edges
3. `InterpreterError` - 16 edges
4. `5. Re-render Optimization` - 16 edges
5. `7. JavaScript Performance` - 15 edges
6. `run()` - 12 edges
7. `React Best Practices` - 12 edges
8. `6. Rendering Performance` - 12 edges
9. `Fase 2 — Auditoría (solo lectura)` - 11 edges
10. `Rules` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Estructura` --references--> `analizar()`  [INFERRED]
  README.md → compilador-c/interp.js
- `salida()` --calls--> `run()`  [EXTRACTED]
  tests/builtins.test.js → compilador-c/interp.js
- `codigoDe()` --calls--> `run()`  [EXTRACTED]
  tests/lexico.test.js → compilador-c/interp.js
- `main()` --calls--> `load()`  [INFERRED]
  .claude/skills/yt-chapters/chapters.py → .claude/skills/yt-edit/deadair.py

## Import Cycles
- None detected.

## Communities (135 total, 82 thin omitted)

### Community 0 - "ref_node_assert"
Cohesion: 0.08
Nodes (27): analizar(), run(), salida(), expresiones, programas, archivos, estilosRaiz, htmlCompilador (+19 more)

### Community 1 - "re"
Cohesion: 0.11
Nodes (24): keywords(), main(), mmss(), load(), main(), norm(), parse_ts(), check() (+16 more)

### Community 2 - "Interpreter"
Cohesion: 0.12
Nodes (5): BreakSignal, ContinueSignal, Interpreter, InterpreterError, ReturnSignal

### Community 4 - "Fase 2 — Auditoría (solo lectura)"
Cohesion: 0.11
Nodes (17): 1. Corrección del intérprete, 2. Seguridad, 3. Rendimiento, 4. Accesibilidad y UX, 5. HTML, CSS y enlaces, 6. Pruebas, 7. Documentación contra realidad, 8. Publicación (+9 more)

### Community 5 - "Rules"
Cohesion: 0.12
Nodes (16): 10. No preamble, no recap, no closing pleasantries, 1. Lead with the next action, 2. Number multi-step tasks, 3. End with one concrete next action, 4. Suppress tangents, 5. Restate state every turn, 6. Give specific time estimates, 7. Make completed work visible (+8 more)

### Community 6 - "5. Re-render Optimization"
Cohesion: 0.12
Nodes (16): 5.10 Subscribe to Derived State, 5.11 Use Functional setState Updates, 5.12 Use Lazy State Initialization, 5.13 Use Transitions for Non-Urgent Updates, 5.14 Use useDeferredValue for Expensive Derived Renders, 5.15 Use useRef for Transient Values, 5.1 Calculate Derived State During Rendering, 5.2 Defer State Reads to Usage Point (+8 more)

### Community 7 - "Auditoría de chuchulucos.shop — 24 de octubre de 2026"
Cohesion: 0.13
Nodes (13): Auditoría — chuchulucos.shop, Notas de la tanda 1, Resueltos, Verificación, 1. Resumen, 2. Hallazgos, 3. Top 5 por urgencia, 4. Victorias rápidas (+5 more)

### Community 8 - "7. JavaScript Performance"
Cohesion: 0.13
Nodes (15): 7.10 Hoist RegExp Creation, 7.11 Use flatMap to Map and Filter in One Pass, 7.12 Use Loop for Min/Max Instead of Sort, 7.13 Use Set/Map for O(1) Lookups, 7.14 Use toSorted() Instead of sort() for Immutability, 7.1 Avoid Layout Thrashing, 7.2 Build Index Maps for Repeated Lookups, 7.3 Cache Property Access in Loops (+7 more)

### Community 9 - "Quick Reference"
Cohesion: 0.13
Nodes (14): 1. Eliminating Waterfalls (CRITICAL), 2. Bundle Size Optimization (CRITICAL), 3. Server-Side Performance (HIGH), 4. Client-Side Data Fetching (MEDIUM-HIGH), 5. Re-render Optimization (MEDIUM), 6. Rendering Performance (MEDIUM), 7. JavaScript Performance (LOW-MEDIUM), 8. Advanced Patterns (LOW) (+6 more)

### Community 10 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 11 - "6. Rendering Performance"
Cohesion: 0.17
Nodes (12): 6.10 Use React DOM Resource Hints, 6.11 Use useTransition Over Manual Loading States, 6.1 Animate SVG Wrapper Instead of SVG Element, 6.2 CSS content-visibility for Long Lists, 6.3 Hoist Static JSX Elements, 6.4 Optimize SVG Precision, 6.5 Prevent Hydration Mismatch Without Flickering, 6.6 Suppress Expected Hydration Mismatches (+4 more)

### Community 12 - "3. Server-Side Performance"
Cohesion: 0.18
Nodes (10): 3.10 Use after() for Non-Blocking Operations, 3.1 Authenticate Server Actions Like API Routes, 3.2 Avoid Duplicate Serialization in RSC Props, 3.3 Avoid Shared Module State for Request Data, 3.4 Cross-Request LRU Caching, 3.5 Hoist Static I/O to Module Level, 3.6 Minimize Serialization at RSC Boundaries, 3.7 Parallel Data Fetching with Component Composition (+2 more)

### Community 13 - "Sections"
Cohesion: 0.20
Nodes (9): 1. Eliminating Waterfalls (async), 2. Bundle Size Optimization (bundle), 3. Server-Side Performance (server), 4. Client-Side Data Fetching (client), 5. Re-render Optimization (rerender), 6. Rendering Performance (rendering), 7. JavaScript Performance (js), 8. Advanced Patterns (advanced) (+1 more)

### Community 14 - "/router"
Cohesion: 0.25
Nodes (7): Modelo y esfuerzo, Paso 1: leer los pendientes, Paso 2: clasificar, Paso 3: separar por archivo, Paso 4: generar el prompt, Reglas de salida, /router

### Community 15 - "voice.md"
Cohesion: 0.25
Nodes (6): How I actually talk, My format, What I will not claim, Who I am talking to, Words I do use, Words I never use

### Community 16 - "interface"
Cohesion: 0.29
Nodes (6): interface, default_prompt, display_name, short_description, policy, allow_implicit_invocation

### Community 17 - "1. Eliminating Waterfalls"
Cohesion: 0.29
Nodes (7): 1.1 Check Cheap Conditions Before Async Flags, 1.2 Defer Await Until Needed, 1.3 Dependency-Based Parallelization, 1.4 Prevent Waterfall Chains in API Routes, 1.5 Promise.all() for Independent Operations, 1.6 Strategic Suspense Boundaries, 1. Eliminating Waterfalls

### Community 18 - "2. Bundle Size Optimization"
Cohesion: 0.29
Nodes (7): 2.1 Avoid Barrel File Imports, 2.2 Conditional Module Loading, 2.3 Defer Non-Critical Third-Party Libraries, 2.4 Dynamic Imports for Heavy Components, 2.5 Prefer Statically Analyzable Paths, 2.6 Preload Based on User Intent, 2. Bundle Size Optimization

### Community 19 - "yt-comment"
Cohesion: 0.29
Nodes (6): Before you write, The gate, The heart and the pin, Triage first, always, Writing the reply, yt-comment

### Community 20 - "yt-seo"
Cohesion: 0.29
Nodes (6): Before you write, Tags, honestly, The description, The gate, The query test, yt-seo

### Community 21 - "chuchulucos.shop"
Cohesion: 0.33
Nodes (5): chuchulucos.shop, Configuración de proveedores (vigente), graphify, OrcaRouter `orcarouter/auto`: configuración y pruebas (2026-10-19), Proveedores y modelos: cada modelo se llama solo desde su proveedor directo

### Community 22 - "Karpathy Guidelines"
Cohesion: 0.33
Nodes (5): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, Karpathy Guidelines

### Community 23 - "React Best Practices"
Cohesion: 0.33
Nodes (5): Creating a New Rule, Getting Started, React Best Practices, Rule File Structure, Structure

### Community 24 - "yt-audit"
Cohesion: 0.33
Nodes (5): Before you write, The gate, What to hand back, What to look at, in this order, yt-audit

### Community 25 - "yt-package"
Cohesion: 0.33
Nodes (5): Before you write, Rules the tool enforces, and why, The gate, Write ten, keep two, yt-package

### Community 26 - "yt-plan"
Cohesion: 0.33
Nodes (5): Before you write, The gate, The shape of a week, What to hand back, yt-plan

### Community 27 - "yt-script"
Cohesion: 0.33
Nodes (5): Before you write, The gate, The shape, What to hand back, yt-script

### Community 28 - "claude-code-setup"
Cohesion: 0.33
Nodes (5): claude-code-setup, Instalación, Nota, Quitar, Uso

### Community 29 - "claude-mem"
Cohesion: 0.33
Nodes (5): Antes de activarlo en el repo, claude-mem, Cómo funciona, Instalación (recomendada: en tu equipo), Quitar

### Community 30 - "markitdown"
Cohesion: 0.33
Nodes (5): En el chat (sesiones de Claude Code en la nube), En local, markitdown, Notas, Uso

### Community 31 - "Ponytail"
Cohesion: 0.33
Nodes (5): Instalación, Ponytail, Privacidad, Quitar, Uso

### Community 32 - "Task Observer"
Cohesion: 0.33
Nodes (5): Activarla, Instalación: solo en tu equipo (no está en el repo), Por qué no está en el repo, Quitar, Task Observer

### Community 33 - "YouTube Agent Skill"
Cohesion: 0.33
Nodes (5): Comandos, Dónde está, Notas, Primer paso, YouTube Agent Skill

### Community 34 - "chuchulucos.shop"
Cohesion: 0.33
Nodes (5): Apps, chuchulucos.shop, Estructura, Pruebas, Publicar en HostGator

### Community 35 - "React Best Practices"
Cohesion: 0.40
Nodes (4): Abstract, React Best Practices, References, Table of Contents

### Community 36 - "4. Client-Side Data Fetching"
Cohesion: 0.40
Nodes (5): 4.1 Deduplicate Global Event Listeners, 4.2 Use Passive Event Listeners for Scrolling Performance, 4.3 Use SWR for Automatic Deduplication, 4.4 Version and Minimize localStorage Data, 4. Client-Side Data Fetching

### Community 37 - "8. Advanced Patterns"
Cohesion: 0.40
Nodes (5): 8.1 Do Not Put Effect Events in Dependency Arrays, 8.2 Initialize App Once, Not Per Mount, 8.3 Store Event Handlers in Refs, 8.4 useEffectEvent for Stable Callback Refs, 8. Advanced Patterns

### Community 38 - "yt-chapters"
Cohesion: 0.40
Nodes (4): Retitle every line, The gate, The rules, which are not optional, yt-chapters

### Community 39 - "yt-edit"
Cohesion: 0.40
Nodes (4): The gate, What it finds, What it will not do, yt-edit

### Community 40 - "yt-retention"
Cohesion: 0.40
Nodes (4): The gate, Three different problems, What to hand back, yt-retention

### Community 41 - "yt-shorts"
Cohesion: 0.40
Nodes (4): Picking, The gate, Writing each one, yt-shorts

### Community 42 - "yt-viral"
Cohesion: 0.40
Nodes (4): Collecting the input, Reading the output, The gate, yt-viral

### Community 44 - "Agent Skills (Addy Osmani)"
Cohesion: 0.40
Nodes (4): Agent Skills (Addy Osmani), Comandos, Instalación, Quitar

### Community 45 - "find-skills (Vercel)"
Cohesion: 0.40
Nodes (4): find-skills (Vercel), Instalación, Quitar, Qué hace

### Community 46 - "Graphify"
Cohesion: 0.40
Nodes (4): Graphify, Quitar, Qué quedó instalado, Uso

### Community 47 - "react-best-practices (Vercel)"
Cohesion: 0.40
Nodes (4): Instalación, Nota, Quitar, react-best-practices (Vercel)

### Community 48 - "chuchulucos.shop"
Cohesion: 0.50
Nodes (3): chuchulucos.shop, Configuración de proveedores (vigente), Proveedores y modelos: cada modelo se llama solo desde su proveedor directo

### Community 50 - "Prefer Statically Analyzable Paths"
Cohesion: 0.50
Nodes (3): File-System Paths, Import Paths, Prefer Statically Analyzable Paths

### Community 52 - "Autoharness"
Cohesion: 0.50
Nodes (3): Autoharness, Instalación: solo en tu equipo (no está en el repo), Quitar

### Community 53 - "Claude Octopus"
Cohesion: 0.50
Nodes (3): Claude Octopus, Cosas a tener en cuenta, Instalación

### Community 54 - "i-have-adhd"
Cohesion: 0.50
Nodes (3): i-have-adhd, Instalación, Quitar

### Community 55 - "Reglas de Karpathy"
Cohesion: 0.50
Nodes (3): Instalación, Nota, Reglas de Karpathy

### Community 56 - "Pro Workflow"
Cohesion: 0.50
Nodes (3): Cosas a tener en cuenta, Instalación, Pro Workflow

## Knowledge Gaps
- **82 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React Best Practices` connect `React Best Practices` to `4. Client-Side Data Fetching`, `8. Advanced Patterns`, `5. Re-render Optimization`, `7. JavaScript Performance`, `6. Rendering Performance`, `3. Server-Side Performance`, `1. Eliminating Waterfalls`, `2. Bundle Size Optimization`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Should `ref_node_assert` be split into smaller, more focused modules?**
  _Cohesion score 0.07616892911010557 - nodes in this community are weakly interconnected._
- **Why does `5. Re-render Optimization` connect `5. Re-render Optimization` to `React Best Practices`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Should `re` be split into smaller, more focused modules?**
  _Cohesion score 0.10505050505050505 - nodes in this community are weakly interconnected._
- **Why does `7. JavaScript Performance` connect `7. JavaScript Performance` to `React Best Practices`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Should `Interpreter` be split into smaller, more focused modules?**
  _Cohesion score 0.12292358803986711 - nodes in this community are weakly interconnected._
- **Should `Fase 2 — Auditoría (solo lectura)` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._