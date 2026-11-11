---
name: escribir-gherkin
description: Escribe escenarios Gherkin en español para los casos de prueba de una HU de Probo. Es documentación viva en todas las HUs y la base de la pista BDD (playwright-bdd) en las HUs marcadas como BDD. Usar al diseñar casos (desde disenar-casos) o cuando se pida "escribir el Gherkin de la HU-XXX".
---

# Escribir Gherkin

Los escenarios describen **qué** hace el sistema en lenguaje de negocio, no **cómo** se prueba. En todas las HUs son documentación; en las HUs BDD, `automatizador` los pasa a `tests/bdd/features/` y cada step llama a un flow existente (`docs/arquitectura/pipeline.md:81`).

## Formato
- Primera línea `# language: es`. Keywords en español: `Característica`, `Antecedentes`, `Escenario`, `Esquema del escenario`, `Ejemplos`, `Dado`, `Cuando`, `Entonces`, `Y`, `Pero`.
- **Una característica por nivel:** una para UI y otra para API (van a `features/ui/` y `features/api/`).
- La cabecera repite el Como / Quiero / Para de la HU.
- Estilo de referencia: `tests/bdd/features/ui/estado-sistema.feature`.

## Tags
- En la característica: `@ui` o `@api` y `@HU-XXX`.
- En cada escenario: el ID del caso (`@HU003-TC01`) y los criterios que cubre (`@CA1 @CA9`). Agregar `@smoke` solo si el caso entra en el smoke de prod (flujo principal, sin datos destructivos).

## Reglas
- **Declarativo:** pasos de negocio en primera persona ("Cuando guardo la historia"), nunca selectores, clics sobre elementos técnicos, esperas ni URLs internas de la API en los steps de UI.
- **Un comportamiento por escenario.** Si aparece un segundo `Cuando`, probablemente son dos escenarios.
- **`Antecedentes`** para lo común a todos (ej. "Dado que inicié sesión como QA").
- **`Esquema del escenario` + `Ejemplos`** para los casos con tabla de datos. Las columnas de `Ejemplos` son las mismas que la tabla del caso.
- **Textos y valores exactos** entre comillas, igual que en el resultado esperado del caso ("Campo obligatorio", `400`).
- **Pasos reutilizables:** la misma frase para la misma acción en todos los escenarios y HUs ("Dado que inicié sesión como QA", "Cuando creo una historia por API con…"). Pocas frases parametrizadas son mejores que muchas frases fijas: cada frase es un step a mantener.
- Los datos se crean "por API" en los `Dado`; el escenario no depende de datos preexistentes.
- Los casos `manual` o `exploratoria` **no** llevan Gherkin.

## Ejemplo
```gherkin
# language: es
@ui @HU-003
Característica: Crear una historia de usuario
  Como QA
  Quiero cargar una historia de usuario con sus criterios de aceptación
  Para usarla como base para diseñar sus casos de prueba

  Antecedentes:
    Dado que inicié sesión como QA
    Y estoy en el formulario de nueva historia

  @HU003-TC02 @CA3
  Esquema del escenario: No se guarda con un campo obligatorio vacío
    Cuando dejo el campo "<campo>" <valor> y guardo la historia
    Entonces veo "Campo obligatorio" en el campo "<campo>"
    Y no se envía la historia

    Ejemplos:
      | campo  | valor             |
      | Título | vacío             |
      | Como   | con solo espacios |
```
