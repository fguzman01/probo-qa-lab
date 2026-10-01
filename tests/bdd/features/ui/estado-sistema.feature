# language: es
@ui
Característica: Estado del sistema
  Como QA
  Quiero ver el estado de Probo al entrar
  Para saber si el entorno está listo para probar

  Escenario: El sistema está operativo
    Dado que abro la página de inicio de Probo
    Entonces veo la API en estado "ok"
    Y veo la base de datos en estado "ok"
    Y veo el entorno contra el que estoy probando
