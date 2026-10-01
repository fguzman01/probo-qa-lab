import { test, expect } from '../../../core/fixtures';
import { expectedHealth } from '../../../core/data/health.data';

test.describe('API · Health', () => {
  test('responde ok con la base de datos conectada', { tag: '@smoke' }, async ({ systemStatusFlow, env }) => {
    const health = await systemStatusFlow.readStatusFromApi();

    expect(health.httpStatus).toBe(200);
    expect(health).toMatchObject(expectedHealth(env.name));
  });
});
