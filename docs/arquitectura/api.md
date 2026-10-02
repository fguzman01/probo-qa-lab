# API REST

> Estado: **aprobado** por Felipe (2026-10-02) · Sprint 1

## Convenciones
- Base: `/api`. JSON en request y response. Fechas en ISO 8601 (UTC).
- IDs: uuid. Un id con formato inválido responde **404** (igual que uno inexistente).
- Nombres de campos en inglés (`camelCase`).

### Autenticación
- `Authorization: Bearer <token>` en todos los endpoints salvo los marcados como **públicos**.
- Token **JWT HS256**, expira a las **8 horas** (`exp`). Secreto en la variable `JWT_SECRET`, distinto por entorno.
- Sin token, token alterado, mal formado o expirado → **401** `UNAUTHORIZED`.

### Formato de error
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Hay campos con errores",
  "details": [{ "field": "title", "message": "Máximo 120 caracteres" }]
}
```

| HTTP | `error` | Cuándo |
|---|---|---|
| 400 | `VALIDATION_ERROR` | body inválido (con `details` por campo) |
| 401 | `INVALID_CREDENTIALS` | login con email o contraseña incorrectos (mismo error en ambos casos) |
| 401 | `UNAUTHORIZED` | falta token o no es válido |
| 404 | `NOT_FOUND` | recurso inexistente |
| 429 | `AI_RATE_LIMITED` | se alcanzó el límite del proveedor de IA |
| 502 | `AI_PROVIDER_ERROR` | la IA falló, tardó más de 60 s o respondió algo inválido |

## Endpoints

### Sistema
| Método | Ruta | Auth | Respuesta |
|---|---|---|---|
| GET | `/api/health` | pública | `200 { status, env, db }` · `503` si la base no responde |

### Auth (HU-001, HU-002)
| Método | Ruta | Auth | Body | Respuesta |
|---|---|---|---|---|
| POST | `/api/auth/login` | pública | `{ email, password }` | `200 { token, user: { id, email } }` · 400 · 401 `INVALID_CREDENTIALS` |
| GET | `/api/auth/me` | sí | — | `200 { id, email }` · 401 |

`/me` lo usa el front al recargar para saber si el token sigue vigente.

### Historias (HU-003, HU-004, HU-005)
| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/api/stories` | — | `200 [{ id, code, title, casesCount, createdAt }]`, de la más nueva a la más vieja |
| POST | `/api/stories` | `{ title, asA, iWant, soThat, criteria: [{ text }] }` | `201` historia completa · 400 |
| GET | `/api/stories/:id` | — | `200` historia completa · 404 |
| PUT | `/api/stories/:id` | igual que POST; `criteria: [{ id?, text }]` | `200` · 400 · 404 |
| DELETE | `/api/stories/:id` | — | `204` · 404 |

- **Historia completa:** `{ id, code, title, asA, iWant, soThat, criteria: [{ id, code, position, text }], createdAt, updatedAt }`.
- **`casesCount`:** casos **no descartados**.
- **Validaciones:** `title` 1–120 · `asA` 1–200 · `iWant` y `soThat` 1–500 · `criteria` 1–30 ítems, cada `text` 1–500. Se aplica `trim`: un texto de solo espacios cuenta como vacío.
- **`DELETE`** no tiene UI en el MVP; existe para limpiar datos de prueba (y para el futuro).

### Casos (HU-006, HU-007)
| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/api/stories/:id/cases` | — · filtro opcional `?status=PENDING\|APPROVED\|DISCARDED` | `200 [caso]` · 404 |
| POST | `/api/stories/:id/generate-cases` | — | `201 { generated, replaced, cases: [caso] }` · 404 · 429 · 502 |
| PATCH | `/api/cases/:id` | `{ status }` | `200` caso · 400 · 404 |
| POST | `/api/stories/:id/cases/approve-pending` | — | `200 { approved }` · 404 |

- **Caso:** `{ id, title, preconditions, steps, expectedResult, technique, priority, status, origin, covers: ["CA1", "CA3"], createdAt, updatedAt }`.
- **`generate-cases`** aplica la regla de regeneración de `modelo-datos.md`; `cases` devuelve **todos** los casos actuales de la historia.

## Solo en entornos de prueba
Con `AI_PROVIDER=fake`, `generate-cases` acepta el header `X-Fake-AI-Scenario` para forzar escenarios (ver `ia.md`). En `groq` el header se ignora.
