---
description: Auditoría general del proyecto (default Opus)
---
Haz una auditoría general del proyecto actual con el modelo configurado en el paso 7 (default Opus). Si no hay configuración, usa Opus.

Reglas:
- Cada hallazgo alto o medio se verifica contra el código antes de reportarse. Cita archivo:línea.
- Marca como "a verificar" lo que dependa de algo fuera del repo.
- Guarda el informe en `docs/auditorias/` con la fecha.
