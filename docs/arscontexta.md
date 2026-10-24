# Ars Contexta

«Un segundo cerebro»: plugin que genera un sistema de conocimiento (carpetas, archivos de contexto, hooks, plantillas de notas) a partir de una conversación. Origen: [agenticnotetaking/arscontexta](https://github.com/agenticnotetaking/arscontexta) (MIT).

## Instalación: solo en tu equipo (no está en el repo)

Genera archivos y hooks propios del proyecto, así que se instala en tu carpeta de notas, no en este sitio. En Claude Code, desde esa carpeta:

```
/plugin marketplace add agenticnotetaking/arscontexta
/plugin install arscontexta@agenticnotetaking
```

Reinicia y ejecuta `/arscontexta:setup`: son 2 a 4 preguntas sobre tu dominio (unos 20 minutos, consume muchos tokens). Reinicia otra vez para activar lo generado y usa `/arscontexta:help`.
