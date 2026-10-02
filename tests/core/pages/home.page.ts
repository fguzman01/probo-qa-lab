import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly title: Locator;
  readonly systemStatus: Locator;
  readonly apiStatus: Locator;
  readonly dbStatus: Locator;
  readonly appEnv: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByRole('heading', { level: 1, name: 'Probo' });
    this.systemStatus = page.getByRole('region', { name: 'Estado del sistema' });
    this.apiStatus = page.getByTestId('api-status');
    this.dbStatus = page.getByTestId('db-status');
    this.appEnv = page.getByTestId('app-env');
  }

  async goto() {
    await this.page.goto('/estado');
  }
}
