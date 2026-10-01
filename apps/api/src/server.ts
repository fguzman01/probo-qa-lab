import { buildApp } from './app.js';
import { config } from './config.js';
import { createDbCheck } from './db.js';

const app = buildApp({
  appEnv: config.appEnv,
  corsOrigins: config.corsOrigins,
  dbCheck: createDbCheck(config.databaseUrl),
});

app.listen({ port: config.port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
