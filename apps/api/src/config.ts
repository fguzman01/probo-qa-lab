import 'dotenv/config';

const EIGHT_HOURS = 8 * 60 * 60;

export const config = {
  port: Number(process.env.PORT ?? 4100),
  appEnv: process.env.APP_ENV ?? 'local',
  databaseUrl: process.env.DATABASE_URL,
  // Orígenes permitidos para el front, separados por coma. Vacío = cualquiera (solo local).
  corsOrigins: (process.env.CORS_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
  jwtSecret: process.env.JWT_SECRET ?? '',
  // Duración de la sesión en segundos (8 h absolutas). Configurable para tests.
  jwtTtlSeconds: Number(process.env.JWT_TTL ?? EIGHT_HOURS),
};
