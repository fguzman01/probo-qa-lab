# Generación de casos con IA

> Estado: **aprobado** por Felipe (2026-10-02) · Sprint 1 · HU-006
> Restricción: **cero gasto** en APIs de IA en el MVP.

## Proveedores
Se elige con `AI_PROVIDER`. Todos implementan la misma interfaz:

```ts
interface CaseGenerator {
  generate(input: GenerationInput): Promise<GeneratedCase[]>;
}
```

| Proveedor | Dónde | Detalle |
|---|---|---|
| `fake` | dev, CI, local | Respuestas fijas y determinísticas. No llama a nada externo |
| `groq` | prod (y dev a mano) | Free tier. API compatible con OpenAI: `https://api.groq.com/openai/v1/chat/completions` |
| `claude` | futuro (etapa producto) | Con la API key del cliente |

Variables: `AI_PROVIDER`, `GROQ_API_KEY` (solo en Railway, nunca en el repo ni en logs), `AI_MODEL` (por defecto `llama-3.3-70b-versatile`), `AI_TIMEOUT_MS` (por defecto `60000`).

## Entrada
```json
{
  "title": "Iniciar sesión",
  "asA": "QA usuario de Probo",
  "iWant": "iniciar sesión con mi email y contraseña",
  "soThat": "acceder a mis historias y casos de forma privada",
  "criteria": [{ "code": "CA1", "text": "..." }, { "code": "CA2", "text": "..." }]
}
```

## Salida esperada (validada con un esquema antes de guardar)
```json
{
  "cases": [
    {
      "title": "Contraseña incorrecta muestra un mensaje genérico",
      "preconditions": "Usuario qa@probo.dev registrado.",
      "steps": ["Abrir /login", "Ingresar email válido y contraseña incorrecta", "Hacer clic en Ingresar"],
      "expectedResult": "Se muestra \"Email o contraseña incorrectos\".",
      "technique": "NEGATIVE",
      "priority": "HIGH",
      "covers": ["CA2"]
    }
  ]
}
```

Reglas del esquema:
- Entre **3 y 15** casos.
- `title` 1–150 · `steps` 1–15 · `technique` y `priority` dentro de los enums de `modelo-datos.md`.
- `covers` tiene al menos un código, y **todos los códigos existen** en la historia.
- **Cobertura completa:** cada criterio queda cubierto por al menos un caso.

## Flujo
1. Armar el prompt con la historia.
2. Llamar al proveedor con timeout de 60 s.
3. Validar la respuesta contra el esquema.
4. Si falta cobertura de algún criterio: **un reintento** indicando qué criterios faltan. Si vuelve a faltar → `INVALID_RESPONSE` (502).
5. En una transacción: borrar los pendientes reemplazables, guardar los casos nuevos con su cobertura y registrar la `AiGeneration`.

| Falla | Resultado | HTTP |
|---|---|---|
| Timeout o error del proveedor | `PROVIDER_ERROR` | 502 |
| Proveedor responde 429 | `RATE_LIMITED` | 429 |
| JSON inválido o fuera del esquema (tras el reintento) | `INVALID_RESPONSE` | 502 |

En **todos** los casos de falla no se modifica ningún caso existente, y se registra la `AiGeneration` con el resultado.

## Prompt (versión `v1`)
Se guarda en código (`apps/api/src/ai/prompt.ts`) con su `PROMPT_VERSION`; cada generación registra qué versión usó. Cambiar el prompt = subir la versión.

Puntos clave del prompt de sistema:
- Rol: QA senior que diseña casos funcionales a partir de criterios de aceptación.
- Usar técnicas: flujo feliz, partición de equivalencia, valores límite, tabla de decisión, negativos.
- **No inventar requisitos**: cada caso debe salir de un criterio. Si un límite no está en la historia, no se prueba (lección del mockup: el caso "contraseña de más de 64 caracteres" se habría descartado).
- Pasos concretos y verificables; resultado esperado observable.
- Responder **solo JSON** con el formato indicado, en español.

Parámetros Groq: `response_format: { type: "json_object" }`, `temperature: 0.2`.

## Proveedor `fake`
- Genera **un caso de flujo feliz por criterio** + **un caso negativo** del primer criterio. Títulos y pasos derivados del texto del criterio, siempre iguales para la misma entrada.
- Con el header `X-Fake-AI-Scenario` se fuerzan escenarios para probar los caminos de error:

| Valor | Simula |
|---|---|
| `provider-error` | falla del proveedor → 502 |
| `rate-limit` | límite alcanzado → 429 |
| `invalid-response` | respuesta fuera del esquema → 502 |
| `missing-coverage` | falta cobertura en ambos intentos → 502 |
| `slow` | tarda 3 s (para probar el indicador de carga) |

En la UI, los tests pueden inyectar el header con `page.route()` de Playwright.

## Qué medimos (retro de cada sprint)
- **Tasa de descarte:** casos `DISCARDED` / casos generados por IA.
- **Tasa de error:** generaciones fallidas / totales, por tipo.
- **Tiempo de generación** (p50, p95).
