import { buildApp } from './app.js';
import { config } from './config.js';
import { createPrisma } from './db/client.js';
import { createDbCheck } from './db/health.js';
import { createUserRepo } from './auth/users.js';

if (!config.databaseUrl) throw new Error('Falta DATABASE_URL');
if (!config.jwtSecret) throw new Error('Falta JWT_SECRET');

const db = createPrisma(config.databaseUrl);

const app = buildApp({
  appEnv: config.appEnv,
  corsOrigins: config.corsOrigins,
  dbCheck: createDbCheck(db),
  users: createUserRepo(db),
  jwtSecret: config.jwtSecret,
  jwtTtlSeconds: config.jwtTtlSeconds,
});

app.listen({ port: config.port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
