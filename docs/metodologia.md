# Metodología de trabajo — AI-First

## Principio
**La IA propone, el QA decide.** La IA produce todo (código de la app, casos, tests, reportes); yo actúo como **gestor y revisor de agentes**. Cada etapa define qué produce la IA, qué decido yo y qué entregable queda.

## Sprint
- Duración: **1 semana**
- Alcance del MVP: 3-4 sprints
- Todo queda en el repo y en GitHub Projects

## Tablero (GitHub Projects)
Columnas: `Backlog` → `Ready` → `In Progress` → `In QA` → `Done`

Etiquetas: `epica`, `historia`, `bug`, `tarea-tecnica`, `automatizacion`, `bdd`, `sistema-qa`, `prioridad-alta`, `prioridad-media`, `prioridad-baja`

## Ciclo del sprint

| Etapa | Apoyo IA | Qué decido yo | Entregable |
|---|---|---|---|
| 1. Planning | Claude propone HUs y estimación | Qué entra al sprint y cuáles 1-2 HUs van a BDD | `sprint-XX.md` con objetivo y HUs |
| 2. Refinamiento | `qa-analista` detecta ambigüedades y riesgos | Qué se aclara o cambia | HU en `Ready` |
| 3. Diseño de pruebas | `disenador-casos` propone casos y Gherkin | Curar y priorizar | `docs/testing/casos/HU-XXX.md` |
| 4. Desarrollo | Claude escribe el código de la app y sus tests unitarios | Reviso y apruebo el PR | PR vinculado al issue |
| 5. Deploy a dev | Pipeline | — | App en dev |
| 6. Testing funcional | Charters exploratorios | Ejecuto y registro hallazgos | Resultados + bugs |
| 7. Automatización | `automatizador` escribe los tests UI/API | Qué se automatiza; reviso y apruebo los tests | Tests spec; features + steps para las HUs BDD |
| 8. CI y reporte | `analista-resultados` analiza fallas | Acción a tomar | Allure en GitHub Pages |
| 9. Paso a prod | — | Apruebo o no | App en prod + smoke OK |
| 10. Review y retro | Claude resume calidad y métricas | Qué mejorar (incluidos los agentes) | Retro en `sprint-XX.md` |

## Definition of Ready (HU)
- Formato "Como / Quiero / Para"
- Criterios de aceptación claros y verificables
- Diseño de sistema actualizado si la HU lo afecta
- Sin dudas abiertas
- Estimada

## Definition of Done (HU)
- Código mergeado vía PR
- Desplegado en dev
- Casos diseñados y ejecutados
- Casos priorizados automatizados (UI y/o API) en la suite spec
- Si la HU tiene etiqueta `bdd`: criterios de aceptación automatizados en Gherkin (playwright-bdd)
- Pipeline verde y reporte Allure publicado
- Sin bugs críticos o altos abiertos
- Aprobado y desplegado en prod, smoke OK

## Plantilla de HU (`docs/historias/HU-XXX.md`)
```
# HU-XXX: [título]
**Como** [rol]
**Quiero** [acción]
**Para** [beneficio]

## Criterios de aceptación
- [ ] Dado ... cuando ... entonces ...

## Diseño relacionado
## Notas
```

## Plantilla de bug
```
**Resumen:**
**Pasos para reproducir:**
1.
**Resultado esperado:**
**Resultado actual:**
**Severidad:** crítica / alta / media / baja
**Evidencia:** (link a Allure si aplica)
**Entorno:** dev / prod
**HU relacionada:** #
```

## Plantilla de sprint (`docs/sprints/sprint-XX.md`)
```
# Sprint XX
## Objetivo
## HUs comprometidas
## HUs en BDD (1-2)
## Notas del día a día
## Resultados de pruebas (link a Allure)
## Bugs encontrados
## Uso de agentes (qué sirvió, qué corregí)
## Retro
- Qué funcionó:
- Qué mejorar:
- Qué cambio para el próximo sprint:
```
