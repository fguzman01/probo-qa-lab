import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { DbCheck } from './db/health.js';
import { authPlugin } from './auth/plugin.js';
import { authRoutes } from './auth/routes.js';
import type { UserRepo } from './auth/users.js';
import { sendError } from './errors.js';

export type AppDeps = {
  appEnv: string;
  corsOrigins: string[];
  dbCheck: DbCheck;
  users: UserRepo;
  jwtSecret: string;
  jwtTtlSeconds: number;
};

export function buildApp(deps: AppDeps) {
  const app = Fastify({ logger: deps.appEnv !== 'test' });

  app.register(cors, { origin: deps.corsOrigins.length ? deps.corsOrigins : true });
  app.register(authPlugin, { secret: deps.jwtSecret });

  app.get('/api/health', async (_req, reply) => {
    const dbOk = await deps.dbCheck();
    return reply.code(dbOk ? 200 : 503).send({
      status: dbOk ? 'ok' : 'degraded',
      env: deps.appEnv,
      db: dbOk ? 'ok' : 'error',
    });
  });

  app.register(async (instance) => authRoutes(instance, deps));

  app.setNotFoundHandler((_req, reply) => sendError(reply, 404, 'NOT_FOUND'));

  return app;
}
