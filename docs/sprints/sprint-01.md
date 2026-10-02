# Sprint 1

> Estado: **planning aprobado** por Felipe (2026-10-02). HUs pendientes de diseño técnico para pasar a Ready.

## Objetivo
Que Probo permita **entrar, cargar una historia y obtener casos de prueba generados por IA listos para curar**, para usarlo en el diseño de pruebas del sprint 2.

## HUs comprometidas
| HU | Título | Épica | Prioridad | Pts |
|---|---|---|---|---|
| [HU-001](../historias/HU-001.md) | Iniciar sesión | E1 | alta | 5 |
| [HU-002](../historias/HU-002.md) | Cerrar sesión y proteger el acceso | E1 | alta | 2 |
| [HU-003](../historias/HU-003.md) | Crear una historia de usuario | E2 | alta | 3 |
| [HU-004](../historias/HU-004.md) | Listar y ver el detalle de historias | E2 | alta | 2 |
| [HU-006](../historias/HU-006.md) | Generar casos de prueba con IA | E3 | alta | 5 |
| [HU-007](../historias/HU-007.md) | Aprobar o descartar casos | E4 | alta | 3 |
| [HU-005](../historias/HU-005.md) | Editar una historia *(stretch)* | E2 | media | 2 |

**Total:** 20 pts comprometidos + 2 pts stretch (HU-001 subió de 3 a 5 tras el análisis del `qa-analista`).

## HUs en BDD (1-2)
- **HU-001 Iniciar sesión:** flujo corto con casos positivos y negativos claros; buena para aprender.
- **HU-003 Crear una historia:** formulario con validaciones; buena para practicar `Esquema del escenario` con ejemplos.

## Sistema QA (agentes)
- Crear `qa-analista` (skill `analizar-hu`) y usarlo en el refinamiento de estas HUs.
- Crear `disenador-casos` (skills `disenar-casos`, `escribir-gherkin`) y usarlo para los casos de cada HU.

## Tareas técnicas
- Diseño del sistema: `docs/arquitectura/modelo-datos.md`, `api.md`, `ia.md`.
- Prisma + migraciones + seed de usuarios por entorno.
- Mecanismo de datos de prueba: crear y limpiar datos por API desde las fixtures.

## Diseño UI
[Probo UI](https://claude.ai/artifact/Pe7F1K5x7XrggbH8wmc8fJ): sistema de diseño + Login, Historias, Nueva historia y Detalle y casos.

## Orden sugerido
1. Diseño del sistema + Prisma + seed
2. HU-001 → HU-002 (todo lo demás necesita login)
3. HU-003 → HU-004
4. HU-006 (la más riesgosa, temprano)
5. HU-007
6. HU-005 si sobra tiempo

## Notas del día a día

## Resultados de pruebas (link a Allure)

## Bugs encontrados

## Uso de agentes (qué sirvió, qué corregí)

## Retro
- Qué funcionó:
- Qué mejorar:
- Qué cambio para el próximo sprint:
