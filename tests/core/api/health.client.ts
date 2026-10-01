import type { APIRequestContext } from '@playwright/test';

export type HealthResponse = { status: string; env: string; db: string };

export class HealthClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly apiUrl: string,
  ) {}

  async get() {
    const response = await this.request.get(`${this.apiUrl}/api/health`);
    return { status: response.status(), body: (await response.json()) as HealthResponse };
  }
}
