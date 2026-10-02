import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { DbCheck } from './db/health.js';

export type AppDeps = {
  appEnv: string;
  corsOrigins: string[];
  dbCheck: DbCheck;
};

export function buildApp(deps: AppDeps) {
  const app = Fastify({ logger: deps.appEnv !== 'test' });

  app.register(cors, { origin: deps.corsOrigins.length ? deps.corsOrigins : true });

  app.get('/api/health', async (_req, reply) => {
    const dbOk = await deps.dbCheck();
    return reply.code(dbOk ? 200 : 503).send({
      status: dbOk ? 'ok' : 'degraded',
      env: deps.appEnv,
      db: dbOk ? 'ok' : 'error',
    });
  });

  return app;
}
