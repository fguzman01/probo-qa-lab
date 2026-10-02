import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 4100),
  appEnv: process.env.APP_ENV ?? 'local',
  databaseUrl: process.env.DATABASE_URL,
  // Orígenes permitidos para el front, separados por coma. Vacío = cualquiera (solo local).
  corsOrigins: (process.env.CORS_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
};
