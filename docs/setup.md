# Setup local

## Herramientas
| Herramienta | Para qué |
|---|---|
| Node 22+ | api, web y tests |
| Docker Desktop | Postgres local |
| GitHub CLI (`gh`) | issues, PRs, secrets. En Windows queda en `C:\Program Files\GitHub CLI` |
| Railway CLI (`npm i -g @railway/cli`) | entornos, variables, logs |

## Puertos locales
| Servicio | Puerto |
|---|---|
| Web (Vite) | 5173 |
| API | **4100** (3000 y 3001 los usan otros proyectos de la máquina) |
| Postgres (Docker) | **5433** |

## Levantar todo
```bash
docker compose up -d                 # Postgres local

cd apps/api
cp .env.example .env                 # una sola vez; ajustar SEED_USER_PASSWORD
npm ci
npm run db:migrate                   # aplica migraciones (y crea nuevas si cambió el schema)
npm run db:seed                      # crea/actualiza el usuario local
npm run dev                          # API en http://127.0.0.1:4100

cd ../web
npm ci
npm run dev                          # Web en http://localhost:5173
```

## Tests
Ver `tests/README.md`. Contra local: `TEST_ENV=local`.

## Variables por entorno (Railway, servicio `api`)
| Variable | dev | prod |
|---|---|---|
| `APP_ENV` | `dev` | `prod` |
| `DATABASE_URL` | referencia a su Postgres | referencia a su Postgres |
| `CORS_ORIGINS` | dominio de su web | dominio de su web |
| `JWT_SECRET` | aleatorio | aleatorio (distinto) |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | usuario de tests | usuario de smoke |
| `AI_PROVIDER` | `fake` | `groq` |
| `GROQ_API_KEY` | — | key de Groq |

Secretos de GitHub (por environment): `RAILWAY_TOKEN`, `TEST_USER_PASSWORD`; variable `TEST_USER_EMAIL`.

## Servicio nuevo en Railway (checklist)
1. Crearlo en **dev** (`railway add`) y desplegar.
2. En la web: entorno **production** → **Sync** desde dev → revisar que solo agregue lo esperado.
3. Corregir en prod: `APP_ENV`, dominios (`railway domain`) y variables que apunten a dominios.
4. Tocar production requiere OK de Felipe.
