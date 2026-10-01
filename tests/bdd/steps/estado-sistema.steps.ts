import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../core/fixtures';

// Los steps solo traducen Gherkin a llamadas a flows: no tocan selectores ni pages.
const { Given, Then } = createBdd(test);

Given('que abro la página de inicio de Probo', async ({ systemStatusFlow }) => {
  await systemStatusFlow.openHome();
});

Then('veo la API en estado {string}', async ({ systemStatusFlow }, estado: string) => {
  expect((await systemStatusFlow.readStatusFromUi()).status).toBe(estado);
});

Then('veo la base de datos en estado {string}', async ({ systemStatusFlow }, estado: string) => {
  expect((await systemStatusFlow.readStatusFromUi()).db).toBe(estado);
});

Then('veo el entorno contra el que estoy probando', async ({ systemStatusFlow, env }) => {
  expect((await systemStatusFlow.readStatusFromUi()).env).toBe(env.name);
});
