import pg from 'pg';

export type DbCheck = () => Promise<boolean>;

export function createDbCheck(databaseUrl: string | undefined): DbCheck {
  if (!databaseUrl) return async () => false;

  const pool = new pg.Pool({ connectionString: databaseUrl, max: 2 });

  return async () => {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  };
}
