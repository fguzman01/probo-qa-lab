# Épicas del MVP — Probo

> Estado: **aprobado** por Felipe (2026-10-01)

Flujo del MVP: **HU → casos con IA → curar → ejecución manual → resumen**.

| # | Épica | Objetivo | HUs candidatas | Sprint |
|---|---|---|---|---|
| E1 | Acceso | Solo el usuario registrado entra a la app | Iniciar sesión · Cerrar sesión · Proteger rutas y API sin sesión | 1 |
| E2 | Historias de usuario | Cargar las HUs sobre las que se diseñan pruebas | Crear HU (Como/Quiero/Para + criterios) · Listar HUs · Ver detalle · Editar HU | 1 |
| E3 | Generación de casos con IA | Obtener una primera versión de casos desde una HU | Generar casos desde una HU (Groq) · Proveedor fake para tests · Manejo de errores y límites del free tier | 1 |
| E4 | Curación de casos | El QA decide qué casos quedan | Editar caso · Aprobar / descartar caso · Agregar caso manual · Filtrar por estado | 1-2 |
| E5 | Ejecuciones | Ejecutar manualmente los casos aprobados | Crear ejecución con casos seleccionados · Marcar resultado (pasó / falló / bloqueado) · Agregar comentario al resultado | 2 |
| E6 | Resumen | Ver el estado de una ejecución de un vistazo | Resumen de ejecución (totales y % por estado) · Listado de ejecuciones por HU | 2-3 |

## Por qué este orden
- El criterio de éxito es **usar Probo para diseñar las pruebas del sprint 2**, así que al cerrar el sprint 1 tienen que funcionar E1 + E2 + E3 + lo básico de E4 (aprobar/descartar).
- E5 y E6 (ejecución) se pueden completar en el sprint 2, antes de ejecutar las pruebas de ese sprint.
- El sprint 3 queda de colchón para bugs, deuda y afinar agentes.

## Riesgo
El sprint 1 viene cargado: 3-4 épicas más el setup de los agentes `qa-analista` y `disenador-casos`. Si no alcanza, se mueve E4 completa al sprint 2 y en el sprint 2 se curan los casos a mano.

## Decisiones de producto
- **Técnica y prioridad:** cada caso guarda la técnica usada (partición, valor límite, negativo, etc.) y su prioridad (alta / media / baja).
- **Regenerar casos:** se reemplazan solo los casos **pendientes**; los aprobados o editados se conservan.
- **HUs de Probo en Probo:** desde el sprint 2 se cargan también en Probo. La fuente de verdad sigue siendo `docs/historias/`.
