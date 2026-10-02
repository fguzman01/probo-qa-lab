# Modelo de datos

> Estado: **aprobado** por Felipe (2026-10-02) · Sprint 1
> Postgres + Prisma. Nombres de tablas y campos en inglés; la UI en español.

## Diagrama

```
User 1 ──── * Story 1 ──── * AcceptanceCriterion
                │                     │
                │ 1                   │ *
                * TestCase * ─────────┘   (TestCaseCoverage: qué criterios cubre cada caso)
                │
                1 ──── * AiGeneration   (registro de cada generación)
```

## Entidades

### User
| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| email | string | único, minúsculas |
| passwordHash | string | bcrypt; nunca se devuelve por API |
| createdAt | datetime | |

Se crean **solo por seed** (no hay registro en el MVP): `qa@probo.dev` en dev (tests) y un usuario de smoke en prod. Las contraseñas vienen de variables de entorno, nunca del repo.

### Story (historia de usuario)
| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| number | int | autoincremental, único |
| code | — | **calculado**: `HU-` + `number` con 3 dígitos (`HU-001`). No se guarda ni se edita |
| title | string | obligatorio, máx. 120 |
| asA | string | "Como", obligatorio, máx. 200 |
| iWant | string | "Quiero", obligatorio, máx. 500 |
| soThat | string | "Para", obligatorio, máx. 500 |
| ownerId | uuid | FK → User (preparado para multiusuario) |
| createdAt / updatedAt | datetime | |

`number` usa una secuencia de Postgres: nunca se repite ni se reutiliza (si en el futuro se borra una historia, queda el hueco).

### AcceptanceCriterion (criterio de aceptación)
| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| storyId | uuid | FK → Story, borrado en cascada |
| position | int | orden dentro de la historia (1, 2, 3…) |
| text | string | obligatorio, máx. 500 |
| code | — | **calculado**: `CA` + `position` (`CA1`) |

Una historia tiene **al menos 1** criterio. Al editar una historia (HU-005), los criterios que llegan con `id` se actualizan, los que llegan sin `id` se crean y los que no llegan se borran (y con ellos su cobertura).

### TestCase (caso de prueba)
| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| storyId | uuid | FK → Story, borrado en cascada |
| title | string | obligatorio, máx. 150 |
| preconditions | string | puede ser vacío |
| steps | string[] | entre 1 y 15 pasos |
| expectedResult | string | obligatorio |
| technique | enum | `HAPPY_PATH`, `EQUIVALENCE_PARTITION`, `BOUNDARY_VALUE`, `DECISION_TABLE`, `NEGATIVE`, `OTHER` |
| priority | enum | `HIGH`, `MEDIUM`, `LOW` |
| status | enum | `PENDING`, `APPROVED`, `DISCARDED` — inicial `PENDING` |
| origin | enum | `AI`, `MANUAL` (manual llega en sprint 2) |
| editedAt | datetime? | se completa cuando el QA edita el caso (sprint 2) |
| generationId | uuid? | FK → AiGeneration que lo creó |
| createdAt / updatedAt | datetime | |

### TestCaseCoverage
Tabla intermedia `TestCase * — * AcceptanceCriterion`. Todo caso generado por IA cubre **al menos un** criterio.

### AiGeneration (registro de generaciones)
| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| storyId | uuid | FK → Story |
| provider | string | `fake` / `groq` |
| model | string | ej. `llama-3.3-70b-versatile` |
| promptVersion | string | versión del prompt usado (ver `ia.md`) |
| result | enum | `SUCCESS`, `PROVIDER_ERROR`, `RATE_LIMITED`, `INVALID_RESPONSE` |
| casesCreated | int | |
| casesReplaced | int | pendientes reemplazados |
| durationMs | int | |
| createdAt | datetime | |

**Por qué existe:** para medir a la IA (tasa de error, tiempos, y junto con `TestCase.status`, **cuántos casos generados se descartan**). Es el dato que alimenta la retro de cada sprint.

## Estados del caso

```
           Aprobar              
 PENDING ───────────► APPROVED
    │  ▲                  │
    │  └── Volver a ──────┤
    │      pendiente      │
    └──────────────► DISCARDED
           Descartar
```

- Descartar **no borra** el caso.
- "Aprobar pendientes" pasa todos los `PENDING` de una historia a `APPROVED`.

## Regla de regeneración (HU-006)
Al regenerar casos de una historia, se borran **solo** los casos con `status = PENDING` **y** `origin = AI` **y** `editedAt = null`. Se conservan los aprobados, los descartados, los editados y los manuales. Todo dentro de una transacción: si la IA falla, no se borra nada.

## Datos de prueba
- **Seed** (por entorno): solo usuarios.
- **Tests**: cada test crea sus historias por API y las borra al final (`DELETE /api/stories/:id`, en cascada borra criterios, casos y generaciones). Ningún test depende de datos preexistentes.
