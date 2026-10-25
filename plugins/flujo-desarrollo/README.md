# flujo-desarrollo (v0.1.0)

Plugin del flujo de desarrollo descrito en `docs/plugin-flujo/spec.md`, que todavía no está en el repo.

Comandos: `/flujo-desarrollo:configurar`, `/flujo-desarrollo:ejecutar`, `/flujo-desarrollo:auditar`.

Scripts:
- `scripts/detectar-claves.sh`: muestra qué APIs tienen variable de entorno. No imprime valores.
- `scripts/verificar.sh`: corre lint, typecheck, build y test si existen en `package.json`.

No instalado. Instalar solo después de revisar el spec.
