import type { HomePage } from '../core/pages/home.page';
import type { HealthClient } from '../core/api/health.client';

export type SystemStatus = { status: string; db: string; env: string };

// Flujo de negocio: consultar el estado del sistema por UI o por API.
export class SystemStatusFlow {
  constructor(
    private readonly homePage: HomePage,
    private readonly healthClient: HealthClient,
  ) {}

  async openHome() {
    await this.homePage.goto();
    await this.homePage.apiStatus.waitFor();
  }

  async readStatusFromUi(): Promise<SystemStatus> {
    return {
      status: await this.homePage.apiStatus.innerText(),
      db: await this.homePage.dbStatus.innerText(),
      env: await this.homePage.appEnv.innerText(),
    };
  }

  async readStatusFromApi(): Promise<{ httpStatus: number } & SystemStatus> {
    const { status, body } = await this.healthClient.get();
    return { httpStatus: status, ...body };
  }
}
