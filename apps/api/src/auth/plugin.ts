import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendError } from '../errors.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string };
    user: { sub: string; exp: number };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// Registra JWT y el preHandler `authenticate`: sin token, alterado o expirado → 401 UNAUTHORIZED.
export const authPlugin = fp<{ secret: string }>(async (app, opts) => {
  await app.register(jwt, { secret: opts.secret });

  app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      return sendError(reply, 401, 'UNAUTHORIZED');
    }
    // RFC 7519: el token deja de valer EN el instante de exp (la librería lo acepta ese segundo).
    if (Date.now() >= req.user.exp * 1000) return sendError(reply, 401, 'UNAUTHORIZED');
  });
});
