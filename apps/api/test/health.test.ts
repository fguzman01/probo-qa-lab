import { describe, it, expect } from 'vitest';
import { buildTestApp } from './helpers.js';

describe('GET /api/health', () => {
  it('responde 200 y ok cuando la base de datos está disponible', async () => {
    const res = await buildTestApp().inject({ method: 'GET', url: '/api/health' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok', env: 'test', db: 'ok' });
  });

  it('responde 503 y degraded cuando la base de datos no responde', async () => {
    const res = await buildTestApp({ dbCheck: async () => false }).inject({ method: 'GET', url: '/api/health' });

    expect(res.statusCode).toBe(503);
    expect(res.json()).toEqual({ status: 'degraded', env: 'test', db: 'error' });
  });
});
