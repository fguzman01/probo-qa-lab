import bcrypt from 'bcryptjs';
import { buildApp, type AppDeps } from '../src/app.js';
import type { UserRecord, UserRepo } from '../src/auth/users.js';

export const TEST_USER = { id: '6f1c2b1e-7a4d-4c1e-9b8a-1d2e3f4a5b6c', email: 'qa@probo.dev', password: 'Clave Segura 123' };

export function memoryUsers(users: UserRecord[]): UserRepo {
  return {
    findByEmail: async (email) => users.find((u) => u.email === email) ?? null,
    findById: async (id) => users.find((u) => u.id === id) ?? null,
  };
}

export function buildTestApp(overrides: Partial<AppDeps> = {}) {
  const passwordHash = bcrypt.hashSync(TEST_USER.password, 4);
  return buildApp({
    appEnv: 'test',
    corsOrigins: [],
    dbCheck: async () => true,
    users: memoryUsers([{ id: TEST_USER.id, email: TEST_USER.email, passwordHash }]),
    jwtSecret: 'test-secret',
    jwtTtlSeconds: 8 * 60 * 60,
    ...overrides,
  });
}
