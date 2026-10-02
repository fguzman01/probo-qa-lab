import { buildApp } from './app.js';
import { config } from './config.js';
import { createPrisma } from './db/client.js';
import { createDbCheck } from './db/health.js';

const db = config.databaseUrl ? createPrisma(config.databaseUrl) : undefined;

const app = buildApp({
  appEnv: config.appEnv,
  corsOrigins: config.corsOrigins,
  dbCheck: createDbCheck(db),
});

app.listen({ port: config.port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
