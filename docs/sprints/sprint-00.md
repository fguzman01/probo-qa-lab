# Sprint 0 — Setup

## Objetivo
Dejar el proyecto, los entornos y el pipeline base listos para empezar el Sprint 1.

## Tareas
### Repo y tablero
- [x] Crear repo público `probo-qa-lab` en GitHub y subir estos archivos
- [x] Crear tablero en GitHub Projects con columnas y etiquetas ([Probo](https://github.com/users/fguzman01/projects/1))
- [x] Crear carpetas: `docs/historias/`, `docs/testing/casos/`, `.claude/skills/`, `.claude/agents/`

### Decisiones
- [x] Stack de la app (frontend, API, base de datos)

### Entornos y pipeline
- [x] Crear proyecto en Railway con entornos dev y prod (con base de datos cada uno) — proyecto `probo`
- [x] App "hola mundo" (front + API) desplegada en dev y prod (#7)
- [x] Estructura de tests (`core/`, `flows/`, `spec/`, `bdd/`) con un test dummy spec (UI y API) y un feature dummy BDD cuyo step llame a un flow
- [x] `ci.yml` y `deploy.yml` funcionando de punta a punta (#11)
- [x] Allure publicándose en GitHub Pages ([reporte](https://fguzman01.github.io/probo-qa-lab/))
- [x] Aprobación manual antes de prod configurada (environment `production`)

### Producto
- [x] Definir épicas del MVP (issues #1-#6)
- [ ] Escribir HUs del Sprint 1 y dejarlas en `Ready`
- [ ] Actualizar "Estado actual" en `CLAUDE.md`

## Decisiones tomadas
- Suite spec como principal; BDD como pista de aprendizaje (1-2 HUs por sprint), con steps que reutilizan flows. Ver `pipeline.md`.
- **Todo AI-First, incluido el desarrollo:** Claude escribe la app, los tests unitarios y los tests Playwright; Felipe gestiona y revisa (casos, tests, PRs) y aprueba.
- **Stack:** React + Vite + TS (front), Node + Fastify + TS (API, JWT), Postgres + Prisma.
- **Monorepo público:** `apps/web`, `apps/api`, `tests/`, `docs/`, `.claude/`. Público para usar GitHub Pages gratis y como portfolio.
- **IA sin costo:** `AI_PROVIDER=fake|groq|claude`. Tests con `fake`, MVP con `groq` (free tier), `claude` solo en etapa producto con la key del cliente.
- **Datos de prueba:** usuarios por seed; datos de negocio creados y eliminados por cada test vía API.
- **Railway:** se usa la cuenta existente (USD 20/mes). Monitorear consumo la primera semana.

## Notas del día a día
- **2026-10-02:** el primer deploy a prod falló con 404 porque `api`/`web` no existían en el entorno production (la CLI no puede instanciarlos). Se resolvió con **Sync** desde dev en la web de Railway, ajustando luego `APP_ENV=prod`, dominios y variables. Re-run aprobado: deploy prod + smoke OK.

## Entornos
| | Web | API |
|---|---|---|
| dev | https://web-dev-467e.up.railway.app | https://api-dev-12f8.up.railway.app |
| prod | https://web-production-1e8d7.up.railway.app | https://api-production-82b3.up.railway.app |

## Retro
- Qué funcionó:
- Qué mejorar:
- Qué cambio para el próximo sprint:
