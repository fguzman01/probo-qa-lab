# Probo — Contexto para Claude

## Objetivo del proyecto
Construir un **sistema de testing AI-First**: un conjunto de **skills y agentes de Claude Code** que apoyan de punta a punta las labores de un QA Engineer. Todas estas herramientas deben poder leer:
- Historias de usuario (HU)
- Diseños del sistema (arquitectura, flujos, modelos de datos)
- Historial de testing de sprints anteriores (casos, resultados, bugs)

…para generar los casos de prueba más robustos posibles y apoyar la automatización, ejecución y análisis de resultados.

Para tener un proyecto real sobre el cual trabajar, se desarrolla desde cero **Probo**, una app de gestión de pruebas con IA, que es a la vez el **sistema bajo prueba** y un **producto** con potencial de monetizar.

Detalles: `docs/vision.md`, `docs/metodologia.md`, `docs/sistema-qa-ai.md`, `docs/arquitectura/pipeline.md`.

## Roles
Felipe es el **PO y el QA gestor/revisor de agentes**, con experticia en **QA Automation** (~12 años, senior). Es el modelo que piden hoy muchas empresas: el QA no escribe todo a mano, sino que **orquesta, revisa y aprueba** el trabajo de los agentes.

- **Claude y los agentes producen todo:** código de la app (front, API, tests unitarios), análisis de HUs, casos de prueba, tests Playwright (spec y BDD), análisis de fallas y reportes de bugs.
- **Felipe decide y revisa:** prioriza, cura casos, revisa tests y PRs, aprueba el paso a prod.

## Cómo colaboramos
- Idioma: **español**, tono casual y directo.
- Respuestas **cortas y prácticas**, sin sobre-explicar.
- **Claude escribe el código** y lo entrega vía PR con una explicación breve de qué hizo y por qué, para que Felipe pueda revisarlo.
- Los casos de prueba y los tests son lo que Felipe revisa con más detalle: dejarlos claros, trazables a la HU y fáciles de revisar.
- Ir paso a paso; si Felipe pide ir más lento, bajar el ritmo.

## Principio AI-First
**La IA propone, el QA decide.** Los agentes generan todo (análisis, casos, código de la app, tests, reporte); Felipe revisa, corrige y aprueba. Nada se da por terminado sin validación humana.

## Automatización
- **Playwright + TypeScript**, patrón **POM** y **Data Provider Model**.
- **Suite principal (spec):** pages → flows → tests. Cubre toda la regresión de UI y API.
- **Pista BDD (aprendizaje):** Cucumber con Gherkin para **1-2 HUs por sprint**. Los steps **reutilizan los flows** de la suite principal; solo se agregan features y steps encima.
- Ambas comparten `tests/core/` (pages, clientes API, data providers) y `tests/flows/`.
- Cobertura de **front (UI)** y **API**.
- Reportes con **Allure**.
- **Datos de prueba:** usuarios de login precreados por seed en cada entorno; los datos de negocio los crea cada test por API al inicio y los elimina al final (fixtures de Playwright).
- **IA en tests:** la API tiene `AI_PROVIDER=fake|claude`. En tests se usa `fake` (respuestas fijas y predecibles).

## Regla de oro del pipeline
Ningún desarrollo llega a prod sin este orden:
1. Deploy a **dev** (Railway)
2. Tests UI + API contra dev vía **GitHub Actions**
3. Reporte **Allure publicado en GitHub Pages**
4. OK de Felipe (aprobación manual)
5. Recién ahí, deploy a **prod** + smoke test

Detalle en `docs/arquitectura/pipeline.md`.

## Stack
- Repo: **monorepo** (`apps/web`, `apps/api`, `tests/`, `docs/`, `.claude/`), **público**
- Front: React + Vite + TypeScript
- API: Node + Fastify + TypeScript, login con JWT
- Base de datos: Postgres + Prisma (migraciones y seed)
- Tests unitarios: los escribe Claude junto con el código de la app
- Tests: Playwright + TypeScript, Cucumber, Allure
- CI/CD: GitHub Actions
- Hosting: Railway (entornos **dev** y **prod**)
- Reportes: GitHub Pages
- Tablero: GitHub Projects ([Probo](https://github.com/users/fguzman01/projects/1))

## Estado actual
- **Sprint:** 0 (setup)
- **Siguiente paso:** ver `docs/sprints/sprint-00.md`

> Actualizar esta sección al cerrar cada sprint.

## Dónde está cada cosa
- HUs: `docs/historias/HU-XXX.md` (el issue del tablero enlaza al archivo)
- Diseños del sistema: `docs/arquitectura/`
- Casos de prueba: `docs/testing/casos/HU-XXX.md`
- Historial de testing: `docs/sprints/sprint-XX.md` (resultados, bugs, retro)
- Skills: `.claude/skills/<nombre>/SKILL.md`
- Agentes: `.claude/agents/<nombre>.md`

## Convenciones
- Ramas: `feature/<issue>-descripcion`, `fix/<issue>-descripcion`, `test/<issue>-descripcion`
- Commits en español: `tipo: descripción` (ej. `feat: generar casos desde HU`)
- Todo PR referencia su issue (`Closes #12`).
