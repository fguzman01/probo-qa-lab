import type { EnvName } from '../config/environments';

export type HealthExpectation = { status: 'ok'; db: 'ok'; env: EnvName };

// Data provider: estado esperado del sistema según el entorno contra el que se corre.
export function expectedHealth(envName: EnvName): HealthExpectation {
  return { status: 'ok', db: 'ok', env: envName };
}
