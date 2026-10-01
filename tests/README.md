# Tests de Probo

Playwright + TypeScript. Suite **spec** (principal) y pista **BDD** (playwright-bdd), compartiendo `core/` y `flows/`.

```
core/      pages, clientes API, data providers, config de entornos y fixtures
flows/     flujos de negocio (los usan spec y BDD)
spec/      suite principal: tests/api y tests/ui
bdd/       features Gherkin (en español) + steps que llaman a flows
```

## Correr

```bash
npm ci
npx playwright install chromium

npm test              # todo (spec + BDD) contra dev
npm run test:spec     # solo spec
npm run test:bdd      # solo BDD
npm run test:smoke    # solo @smoke
npm run report        # genera el reporte Allure en allure-report/
```

## Entornos
`TEST_ENV=local|dev|prod` (por defecto `dev`). `PROBO_WEB_URL` y `PROBO_API_URL` pisan las URLs configuradas en `core/config/environments.ts`.

## Reglas
- Los tests y steps usan **flows**; los flows usan **pages** y **clientes API**.
- Los steps BDD no tocan selectores ni pages.
- Los datos esperados salen de **data providers** (`core/data/`), no van hardcodeados en el test.
- `@smoke` marca el subconjunto que corre en prod.
