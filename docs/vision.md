# Visión

## El proyecto tiene dos piezas

### 1. Sistema QA AI-First (objetivo principal)
Skills y agentes de Claude Code que acompañan al QA en todo su trabajo: analizar HUs, diseñar casos, automatizar, analizar resultados y reportar bugs. Se alimentan de las HUs, los diseños del sistema y el historial de testing, así que **mejoran sprint a sprint** a medida que ese historial crece.

Ver `docs/sistema-qa-ai.md`.

### 2. Probo (la app)
Una herramienta de gestión de pruebas con IA, desarrollada desde cero. Cumple dos roles:
- **Sistema bajo prueba:** una app real con front, API, base de datos y reglas de negocio, desplegada en dev y prod, sobre la cual el sistema QA trabaja de verdad.
- **Producto:** a futuro, Probo puede ofrecer en una interfaz lo mismo que hacen los agentes (generar y gestionar casos), para otros QA.

Así se cierra el círculo: los agentes testean Probo, y Probo termina siendo la cara visible de los agentes.

## Elevator pitch de Probo
**Para** QA engineers en equipos chicos y medianos **que** pierden tiempo escribiendo casos de prueba a mano y no tienen conectadas sus historias de usuario, casos y tests automatizados, **Probo** es una herramienta de gestión de pruebas AI-First **que** genera casos desde una HU, permite curarlos, ejecutarlos y vincularlos con la automatización. **A diferencia de** TestRail, Xray o una planilla Excel, **la IA propone y el QA decide**, con trazabilidad de punta a punta en una herramienta liviana.

## Objetivo del desarrollo
Construir Probo como una app web con:
- **Frontend** web (para tests de UI)
- **API REST** separada (para tests de API)
- **Base de datos** (Postgres en Railway)
- **Login simple** (un usuario en el MVP)
- **Generación de casos con IA** vía un proveedor intercambiable (`AI_PROVIDER`), **sin costo** en el MVP

Desplegada en **Railway** con entornos **dev** y **prod**, cada uno con su propia base de datos. TypeScript de punta a punta, para mantener un solo lenguaje con Playwright:
- Front: React + Vite
- API: Node + Fastify, login con JWT
- DB: Postgres + Prisma
- Monorepo público (app, tests, docs y agentes juntos)

Proveedores de IA (`AI_PROVIDER`):
- `fake`: respuestas fijas, para que los tests sean determinísticos.
- `groq`: **proveedor del MVP**, free tier sin tarjeta (modelos abiertos, API compatible con OpenAI). Alternativa: `gemini` (ojo: en su free tier los prompts se usan para entrenar).
- `claude`: etapa producto, con la **API key del cliente** (el costo lo asume quien usa Probo).

Restricción: el MVP **no genera gasto** en APIs de IA.

## Alcance del MVP de Probo
**Dentro:**
- Login
- Ingresar una HU con criterios de aceptación
- Generar casos de prueba con IA
- Editar, aprobar o descartar casos
- Crear una ejecución con casos seleccionados
- Marcar resultados (pasó / falló / bloqueado)
- Ver resumen de la ejecución

**Fuera (por ahora):** generación de código de tests, integración con CI, multiusuario, pagos.

**Criterio de éxito:** usar Probo para diseñar las pruebas de las HUs del sprint 2.

## Roadmap de Probo
1. **MVP:** HU → casos con IA → curar → ejecución manual → resumen.
2. **Etapa 2:** desde un caso aprobado, generar escenario Gherkin o esqueleto de test Playwright.
3. **Etapa 3:** disparar ejecuciones automatizadas (GitHub Actions), recibir el reporte y asociar resultados a los casos. Probo no construye su propio runner: orquesta Playwright.

Objetivo final: trazabilidad **HU → caso → test automatizado → resultado**.
