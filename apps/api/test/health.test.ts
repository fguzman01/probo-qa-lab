import { describe, it, expect } from 'vitest';
import { buildApp } from '../src/app.js';

const build = (dbOk: boolean) =>
  buildApp({ appEnv: 'test', corsOrigins: [], dbCheck: async () => dbOk });

describe('GET /api/health', () => {
  it('responde 200 y ok cuando la base de datos está disponible', async () => {
    const res = await build(true).inject({ method: 'GET', url: '/api/health' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok', env: 'test', db: 'ok' });
  });

  it('responde 503 y degraded cuando la base de datos no responde', async () => {
    const res = await build(false).inject({ method: 'GET', url: '/api/health' });

    expect(res.statusCode).toBe(503);
    expect(res.json()).toEqual({ status: 'degraded', env: 'test', db: 'error' });
  });
});
