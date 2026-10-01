import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './core/config/environments';

const bddTestDir = defineBddConfig({
  features: 'bdd/features/**/*.feature',
  steps: ['bdd/steps/**/*.ts', 'core/fixtures.ts'],
  outputDir: '.features-gen',
});

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        environmentInfo: { entorno: env.name, web: env.webUrl, api: env.apiUrl },
      },
    ],
  ],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: env.webUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'spec-api', testDir: './spec/tests/api' },
    { name: 'spec-ui', testDir: './spec/tests/ui' },
    { name: 'bdd', testDir: bddTestDir },
  ],
});
