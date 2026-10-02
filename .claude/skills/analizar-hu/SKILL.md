---
name: analizar-hu
description: Analiza una historia de usuario de Probo antes de desarrollarla o diseñar sus casos. Detecta ambigüedades, criterios no verificables, inconsistencias con el diseño del sistema, riesgos y zonas con bugs previos, y prepara preguntas para el PO. Usar en el refinamiento de una HU (etapa 2 del sprint) o cuando se pida "analizar la HU-XXX".
---

# Analizar HU

Procedimiento para revisar una HU **antes** de que se desarrolle o se diseñen sus casos. El objetivo es encontrar lo que hoy está mal definido, no reescribir la HU.

> La IA propone, el QA decide: el análisis es una propuesta. Felipe decide qué se aclara o cambia.

## 1. Reunir las fuentes

Leer, en este orden:

| Fuente | Dónde | Para qué |
|---|---|---|
| La HU | `docs/historias/HU-XXX.md` | Qué se pide |
| Épica | `docs/epicas.md` | Contexto y alcance |
| Diseño técnico | `docs/arquitectura/` (`modelo-datos.md`, `api.md`, `ia.md`, `pipeline.md`) | Contrastar la HU con lo diseñado |
| HUs relacionadas | `docs/historias/` | Dependencias y solapamientos |
| Historial de testing | `docs/sprints/sprint-*.md` (bugs, notas, retro) | Zonas con problemas previos |
| Bugs abiertos/cerrados | `gh issue list -R fguzman01/probo-qa-lab --label bug --state all` | Zonas con bugs previos |
| Casos existentes | `docs/testing/casos/` | Qué ya está cubierto |
| Código existente | `apps/`, `tests/` | Qué ya está construido y puede chocar |

El diseño UI vive en un artifact de claude.ai (link en la HU). Si no se puede abrir, decirlo en el análisis y analizar con lo que dice la HU sobre la UI.

## 2. Revisar con esta checklist

1. **Formato y DoR:** ¿tiene Como/Quiero/Para, criterios verificables, diseño enlazado, estimación? (Definition of Ready en `docs/metodologia.md`).
2. **Verificabilidad:** cada criterio, ¿tiene un resultado observable y sin palabras vagas ("rápido", "correcto", "amigable", "etc.")?
3. **Ambigüedades:** términos sin definir, valores sin precisar (límites, formatos, mensajes exactos, orden, zonas horarias), comportamientos "obvios" que no están escritos.
4. **Casos borde y negativos no cubiertos:** vacíos, espacios, mayúsculas, máximos, duplicados, concurrencia, sesión expirada a mitad de una acción, red caída.
5. **Consistencia con el diseño:** ¿la HU dice lo mismo que `api.md` (endpoints, códigos HTTP, errores) y `modelo-datos.md` (campos, largos, estados)? Toda diferencia es un hallazgo.
6. **Consistencia entre HUs:** ¿contradice o se solapa con otra HU?
7. **Riesgos:** seguridad (auth, datos sensibles, enumeración de usuarios), datos (pérdida, integridad), integración (IA, terceros), testabilidad (¿se puede automatizar? ¿hace falta controlar el reloj, un fake, datos semilla?).
8. **Historial:** ¿hubo bugs, incidentes o notas de retro en esta zona? Citarlos.
9. **Datos de prueba:** qué datos necesita probar la HU y cómo se crean (seed, API, fixtures).

## 3. Reglas de calidad

- **Citar la fuente** de cada hallazgo: `archivo:línea` o `#issue`.
- **No inventar requisitos.** Si algo no está definido, es una **pregunta**, no una suposición.
- **Proponer, no decidir:** cada pregunta trae una respuesta sugerida que el PO puede aceptar o cambiar.
- **Priorizar:** severidad **alta** (bloquea desarrollo o diseño de casos), **media** (genera retrabajo si no se aclara), **baja** (mejora).
- **Ser breve:** sin repetir la HU, sin relleno. Si una sección no tiene hallazgos, decir "Sin hallazgos".
- Escribir en **español**, tono directo.

## 4. Entregable

Escribir `docs/testing/analisis/HU-XXX.md` con esta plantilla:

```markdown
# Análisis HU-XXX: [título]

> Generado por `qa-analista` · [fecha] · **Pendiente de revisión de Felipe**

## Veredicto
**[Ready | Ready con observaciones | No ready]**: [una línea con el motivo]

## Preguntas para el PO
| # | Severidad | Pregunta | Respuesta sugerida | Fuente |
|---|---|---|---|---|

## Inconsistencias con el diseño
| # | HU dice | Diseño dice | Fuente | Propuesta |
|---|---|---|---|---|

## Criterios a mejorar
| Criterio | Problema | Redacción sugerida |
|---|---|---|

## Riesgos
| # | Tipo | Riesgo | Impacto | Mitigación / foco de prueba |
|---|---|---|---|---|

## Zonas con bugs o incidentes previos
- ...

## Datos de prueba necesarios
- ...

## Notas para el diseño de casos
Pistas para `disenador-casos`: técnicas que aplican y dónde (valores límite, particiones, tablas de decisión, negativos).
```

## 5. Cierre

Terminar con un resumen corto para Felipe: veredicto, cantidad de hallazgos por severidad y las 3 preguntas más importantes.
