import { test as base } from 'playwright-bdd';
import { env, type Environment } from './config/environments';
import { HomePage } from './pages/home.page';
import { HealthClient } from './api/health.client';
import { SystemStatusFlow } from '../flows/system-status.flow';

type Fixtures = {
  env: Environment;
  homePage: HomePage;
  healthClient: HealthClient;
  systemStatusFlow: SystemStatusFlow;
};

// Fixtures compartidas por la suite spec y la pista BDD.
export const test = base.extend<Fixtures>({
  env: async ({}, use) => use(env),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  healthClient: async ({ request }, use) => use(new HealthClient(request, env.apiUrl)),
  systemStatusFlow: async ({ homePage, healthClient }, use) =>
    use(new SystemStatusFlow(homePage, healthClient)),
});

export { expect } from '@playwright/test';
