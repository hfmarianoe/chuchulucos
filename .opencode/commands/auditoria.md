---
description: Auditoría completa del proyecto (sincroniza, menú, solo lectura)
---
Ejecuta la skill `auditoria` y sigue sus tres fases:

1. Sincroniza con GitHub: fusiona lo que falte y borra ramas ya fusionadas.
2. Muestra el menú de niveles y espera la elección.
3. Audita en solo lectura y entrega el informe.

Alcance o nivel pedido: $ARGUMENTS

Si no se indicó nivel, muestra el menú. Si se indicó, respétalo.
