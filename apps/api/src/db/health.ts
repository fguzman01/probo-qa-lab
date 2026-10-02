import type { Db } from './client.js';

export type DbCheck = () => Promise<boolean>;

export function createDbCheck(db: Db | undefined): DbCheck {
  if (!db) return async () => false;

  return async () => {
    try {
      await db.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  };
}
