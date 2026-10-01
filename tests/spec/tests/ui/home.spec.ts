import { test, expect } from '../../../core/fixtures';
import { expectedHealth } from '../../../core/data/health.data';

test.describe('UI · Home', () => {
  test('muestra el estado del sistema', { tag: '@smoke' }, async ({ systemStatusFlow, homePage, env }) => {
    await systemStatusFlow.openHome();

    await expect(homePage.title).toBeVisible();
    expect(await systemStatusFlow.readStatusFromUi()).toEqual(expectedHealth(env.name));
  });
});
