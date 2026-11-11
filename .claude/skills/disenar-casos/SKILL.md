---
name: disenar-casos
description: Diseña los casos de prueba de una historia de usuario de Probo ya analizada. Aplica particiones, valores límite, tablas de decisión y negativos; prioriza por riesgo; traza cada caso a los criterios; escribe el Gherkin y genera una vista HTML con pestañas. Usar en el diseño de pruebas (etapa 3 del sprint) o cuando se pida "diseñar los casos de la HU-XXX".
---

# Diseñar casos

Procedimiento para convertir una HU **ya refinada** en casos de prueba. El objetivo es una suite que encuentre bugs, no una lista larga: cada caso tiene que justificar su lugar.

> La IA propone, el QA decide: los casos son una propuesta. Felipe los cura (aprueba, descarta o pide cambios).

## 1. Reunir las fuentes

Leer, en este orden:

| Fuente | Dónde | Para qué |
|---|---|---|
| La HU | `docs/historias/HU-XXX.md` | Criterios a cubrir |
| Análisis de la HU | `docs/testing/analisis/HU-XXX.md` | Riesgos, datos de prueba, "Notas para el diseño de casos" y **Decisiones del PO** |
| Diseño técnico | `docs/arquitectura/api.md`, `modelo-datos.md`, `ia.md` | Endpoints, códigos HTTP, formato de error, campos, límites |
| Diseño UI | artifact de claude.ai (link en la HU) | Textos, controles, estados de la pantalla |
| Historial | `docs/sprints/sprint-*.md`, `gh issue list -R fguzman01/probo-qa-lab --label bug --state all` | Zonas con bugs previos y lecciones |
| Casos existentes | `docs/testing/casos/` | No duplicar; reutilizar estilo y datos |
| Tests y código | `tests/`, `apps/` | Qué flows, pages y clientes existen; qué ya está construido |

**Condición para empezar:** el análisis existe y todas sus preguntas tienen decisión del PO. Si no, frenar y avisar.

Si el diseño UI no se puede abrir, decirlo en el encabezado del archivo y diseñar con lo que dice la HU.

## 2. Numerar los criterios

Numerar los criterios de la HU como **CA1…CAn en el orden en que aparecen**, incluida la sección API. Es la misma numeración que usa Probo (`CA` + `position`). Todos los casos citan estos códigos.

## 3. Diseñar

### Técnicas (enum de `modelo-datos.md`)
| Técnica | Cuándo |
|---|---|
| `HAPPY_PATH` | El flujo principal de cada criterio funciona |
| `EQUIVALENCE_PARTITION` | Clases de entrada que se comportan igual (vacío / solo espacios / válido / inválido) |
| `BOUNDARY_VALUE` | Límites numéricos y de largo: **n-1, n y n+1, siempre el valor exacto** (lección de `sprint-01.md:49`) |
| `DECISION_TABLE` | Varias condiciones que combinadas dan resultados distintos |
| `NEGATIVE` | Entradas inválidas, errores, permisos, red, sesión |
| `OTHER` | Lo que no encaja (ej. seguridad, concurrencia); explicar en el caso |

### Reglas
- **Trazabilidad:** cada caso cubre al menos un criterio y **todo criterio queda cubierto**. Los casos que salen de un riesgo del análisis citan además el riesgo (ej. "Riesgo 5").
- **Alcance:** criterios **más** los riesgos del análisis. Los riesgos sin criterio que los respalde van con prioridad más baja, para que Felipe decida.
- **No inventar requisitos:** un límite, texto o comportamiento que no está en la HU, el diseño o las decisiones del PO no se prueba como requisito. Si parece importante, va a "Fuera de alcance" o a "Dudas".
- **Un caso por regla, con tabla de datos:** las variantes de una misma regla (valores límite, particiones) van en **un caso con tabla** (columnas de entrada y resultado esperado por fila), no en un caso por valor. Calza con el Data Provider Model y con `Esquema del escenario`.
- **Nivel correcto:**
  - **API** para lo exhaustivo: todos los límites, combinaciones, formatos de error, seguridad de datos.
  - **UI** para lo representativo y lo que solo existe en pantalla: navegación, mensajes, contadores, botones habilitados o deshabilitados, que no salga un request. En UI, una o dos filas representativas por regla; el resto lo cubre la API.
- **Resultado esperado exacto:** textos literales entre comillas, códigos HTTP, `error`, campos de `details`, URL. Nunca "funciona bien" ni "muestra un error".
- **Datos de prueba:** usuarios por seed; los datos de negocio los crea cada caso por API y los borra al final (`pipeline.md:44-47`). Ningún caso depende de datos preexistentes ni de valores no deterministas (ej. un código exacto `HU-005`).
- **Prioridad por riesgo** (enum `HIGH` / `MEDIUM` / `LOW`):
  - `HIGH`: flujo principal, integridad de datos, seguridad, zonas con bugs previos.
  - `MEDIUM`: validaciones y comportamientos que generan retrabajo si fallan.
  - `LOW`: cosmético o muy improbable.
- **Automatización:** `spec` (default), `bdd` (si la HU es candidata a BDD y el caso sale de un criterio), `manual` (no se puede automatizar razonablemente) o `exploratoria` (charter, no un caso con pasos). Explicar los dos últimos.
- **Pasos cortos y de negocio:** "Completar el título con 120 caracteres", no "hacer clic en el input #hu-titulo".
- **Ser breve:** sin repetir la HU ni el análisis.

## 4. Entregable 1: `docs/testing/casos/HU-XXX.md` (fuente de verdad)

IDs: `HUXXX-TCnn` (ej. `HU003-TC01`), correlativos. Estado inicial de todos: **Propuesto**. Felipe los pasa a **Aprobado**, **Descartado** o **Cambiar**; en Probo equivalen a `PENDING`, `APPROVED` y `DISCARDED`.

```markdown
# Casos HU-XXX: [título]

> Generado por `disenador-casos` · [fecha] · **Pendiente de curación de Felipe**
> Fuentes: HU, análisis ([fecha de decisiones]), api.md, modelo-datos.md, diseño UI [pantalla y versión | no disponible].
> Vista visual: `HU-XXX.html` (abrir en el browser).

## Criterios
| Código | Criterio (resumen) | Nivel |
|---|---|---|
| CA1 | ... | UI |

## Trazabilidad
| Criterio | Casos |
|---|---|
| CA1 | HUXXX-TC01, HUXXX-TC04 |

## Resumen
| ID | Título | Nivel | Técnica | Prioridad | Cubre | Automatización | Estado |
|---|---|---|---|---|---|---|---|

## Casos

### HUXXX-TC01 · [título]
| Nivel | Técnica | Prioridad | Cubre | Automatización | Estado |
|---|---|---|---|---|---|
| API | `BOUNDARY_VALUE` | `HIGH` | CA5, CA10 | spec | Propuesto |

**Origen:** [criterio | riesgo N del análisis]
**Precondiciones:** ...
**Datos:**
| campo | valor | resultado esperado |
|---|---|---|

**Pasos:**
1. ...

**Resultado esperado:**
- ...

## Gherkin
(según `escribir-gherkin`: un bloque `gherkin` por característica, UI y API)

## Fuera de alcance
| Qué | Motivo |
|---|---|

## Dudas
- (lo que surgió al diseñar y no está definido; "Sin dudas" si no hay)
```

## 5. Entregable 2: `docs/testing/casos/HU-XXX.html` (vista visual)

1. Copiar **tal cual** `.claude/skills/disenar-casos/plantilla.html` a `docs/testing/casos/HU-XXX.html`.
2. Reemplazar **solo** el contenido del bloque `<script type="application/json" id="casos">` con los datos del md, con este esquema:

```json
{
  "hu": { "code": "HU-003", "title": "...", "generated": "AAAA-MM-DD", "status": "Pendiente de curación", "sources": "..." },
  "criteria": [{ "code": "CA1", "text": "...", "level": "UI" }],
  "cases": [{
    "id": "HU003-TC01", "title": "...", "level": "API", "technique": "BOUNDARY_VALUE", "priority": "HIGH",
    "covers": ["CA5"], "automation": "spec", "status": "Propuesto", "origin": "...",
    "preconditions": "...", "data": { "columns": ["campo", "valor", "resultado"], "rows": [["title", "120 caracteres", "201"]] },
    "steps": ["..."], "expected": ["..."]
  }],
  "gherkin": [{ "name": "UI", "content": "# language: es\n..." }],
  "outOfScope": [{ "item": "...", "reason": "..." }],
  "doubts": ["..."]
}
```

- `data` es `null` si el caso no tiene tabla. Los textos van planos (sin markdown).
- **El md es la fuente de verdad.** Cada vez que cambia el md (por ejemplo, tras la curación), se regenera el JSON del HTML. Nunca se edita el HTML a mano ni se cambia la plantilla para una HU puntual.
- Antes de terminar, verificar que el HTML y el md tienen los **mismos IDs, estados y cantidad de casos**.

## 6. Cierre

Terminar con un resumen corto para Felipe:
- Cantidad de casos por nivel (UI / API) y por prioridad.
- Criterios cubiertos (todos o cuáles faltan) y riesgos del análisis cubiertos.
- Dudas abiertas, si hay.
- Los 3 casos que más conviene revisar con detalle, y por qué.
