# Sistema QA AI-First — Skills y agentes

## Idea
- **Skill:** un procedimiento reutilizable ("cómo se hace X"): pasos, plantillas, criterios de calidad. Vive en `.claude/skills/<nombre>/SKILL.md`.
- **Agente:** un rol especializado con su propio contexto, que usa una o más skills. Vive en `.claude/agents/<nombre>.md`.

Claude (sesión principal) coordina y desarrolla la app; los agentes hacen el trabajo especializado de QA; **Felipe gestiona y revisa**: decide qué se hace, cura los casos, revisa los tests y aprueba.

El rol del QA en este modelo no es escribir casos ni código a mano, sino **orquestar agentes y ser el control de calidad de lo que producen**.

## Fuentes que leen todos los agentes
| Fuente | Ubicación |
|---|---|
| Historias de usuario | `docs/historias/` |
| Diseños del sistema | `docs/arquitectura/` |
| Casos de prueba existentes | `docs/testing/casos/` |
| Historial de testing (resultados, bugs, retros) | `docs/sprints/` |
| Código de tests existente | `tests/` |

El historial es clave: un agente que sabe dónde hubo bugs antes, prioriza mejor.

## Agentes (propuesta inicial)

| Agente | Qué hace | Skills |
|---|---|---|
| `qa-analista` | Lee HU + diseño + historial. Detecta ambigüedades, riesgos y zonas con bugs previos. Prepara preguntas para el PO. | `analizar-hu` |
| `disenador-casos` | Genera casos robustos (particiones, valores límite, tablas de decisión, negativos), priorizados por riesgo. Escribe los escenarios en **Gherkin como documentación** en todas las HUs, aunque se automaticen en spec. | `disenar-casos`, `escribir-gherkin` |
| `automatizador` | Convierte casos aprobados en tests UI/API. Por defecto en la suite spec (pages → flows → tests); para las HUs marcadas como BDD, crea features y steps que **reutilizan los flows**. Respeta POM y data providers. | `crear-page-object`, `crear-flow`, `crear-test-spec`, `crear-test-api`, `crear-test-bdd` |
| `analista-resultados` | Lee resultados de CI y Allure, clasifica fallas (bug real / flaky / ambiente) y redacta bugs. | `analizar-fallas`, `reportar-bug` |

## Cómo se construyen
No se crean todos de una. Se van construyendo sprint a sprint, cuando se necesitan:
- Sprint 1: `qa-analista`, `disenador-casos`
- Sprint 2: `automatizador`
- Sprint 3: `analista-resultados`

Cada agente se evalúa en la retro: ¿sus propuestas fueron útiles? ¿qué tuve que corregir? Eso alimenta la mejora de su skill.
