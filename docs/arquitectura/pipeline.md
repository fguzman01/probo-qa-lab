# Pipeline CI/CD

## Flujo

```
PR → checks (lint, build, tests unitarios)
  ↓ merge a main
Deploy a DEV (Railway)
  ↓
Tests contra DEV: UI + API (BDD y spec)
  ↓
Reporte Allure → GitHub Pages (con historial)
  ↓
Aprobación manual de Felipe (environment "production")
  ↓
Deploy a PROD (Railway)
  ↓
Smoke tests en PROD
```

## Reglas
- Nada llega a prod sin pasar por dev + tests + reporte publicado.
- Si los tests fallan en dev, el pipeline se detiene y no se ofrece la aprobación.
- El reporte Allure se publica **siempre** (también cuando falla), para poder analizarlo.
- Cada entorno tiene su propia base de datos y sus propios secretos.

## Workflows (en `.github/workflows/`)
- `ci.yml`: checks en cada PR
- `deploy.yml`: deploy dev → tests → Allure → aprobación → deploy prod → smoke

## Estructura del repo (monorepo)

```
probo-qa-lab/
├── apps/web      (React + Vite)
├── apps/api      (Fastify + Prisma, con tests unitarios)
├── tests/        (Playwright: core, flows, spec, bdd)
├── docs/
└── .claude/      (skills y agentes)
```

Por qué monorepo: los agentes leen HU, código y tests en un solo lugar; un PR trae el cambio y sus tests juntos; un solo pipeline.

## Datos de prueba
- **Usuarios de login:** precreados con seed de Prisma. Dev tiene usuario de tests; prod tiene un usuario de smoke aparte.
- **Datos de negocio:** cada test los crea por API al inicio y los elimina al final (fixtures de Playwright). Ningún test depende de datos preexistentes.
- **IA:** en dev los tests corren con `AI_PROVIDER=fake`. A futuro, un test de contrato aparte contra el proveedor real (Groq) que valide solo la estructura, cuidando el límite del free tier.
- **Secretos:** en GitHub Secrets y variables de Railway, nunca en el repo ni en los reportes (el repo y Allure son públicos).

## Estructura de tests

```
tests/
├── core/              ← base compartida
│   ├── pages/         (Page Objects)
│   ├── api/           (clientes de API)
│   ├── data/          (providers, models, JSON)
│   └── config/        (entornos: dev, prod)
├── flows/             ← flujos de negocio, compartidos
├── spec/              ← SUITE PRINCIPAL (regresión completa)
│   └── tests/         (ui/, api/)
└── bdd/               ← PISTA BDD (1-2 HUs por sprint)
    ├── features/      (ui/, api/)
    ├── steps/         (llaman a los flows)
    └── support/       (hooks, world)
```

## Cómo se relacionan

```
Tests spec                 Features Gherkin
    │                            │
    │                          Steps
    └────────► Flows ◄───────────┘
                 │
               Pages / API clients
                 │
            Data providers
```

**Decisión tomada:** la suite spec es la principal y cubre toda la regresión. BDD es una pista de aprendizaje: se automatizan en Gherkin (con **playwright-bdd**, dentro del runner de Playwright) los criterios de aceptación de 1-2 HUs por sprint. Los steps no tocan selectores ni pages directamente; solo traducen Gherkin a llamadas a flows existentes.

**Por qué:** el valor real de BDD es la colaboración con negocio y la documentación viva. En este proyecto (una persona) el valor es aprender, así que duplicar toda la suite sería puro costo de mantenimiento.

## En el pipeline
- Ambas suites corren contra dev en cada deploy.
- Los resultados de ambas van al mismo reporte Allure.
- Smoke en prod: subconjunto de la suite spec.

## Implementación
- **Reporte:** Allure 3 (`allure` npm, sin Java). El historial (`history.jsonl`) se guarda en la rama `gh-pages` y se recupera en cada corrida.
- **Deploy:** `railway up` por servicio (`apps/api`, `apps/web`) con el `RAILWAY_TOKEN` del environment de GitHub correspondiente.
- **Smoke en prod:** usa las variables de repo `PROD_WEB_URL` y `PROD_API_URL` y corre los tests `@smoke`.
