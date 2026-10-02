export type EnvName = 'local' | 'dev' | 'prod';

export type Environment = {
  name: EnvName;
  webUrl: string;
  apiUrl: string;
};

const environments: Record<EnvName, Omit<Environment, 'name'>> = {
  local: { webUrl: 'http://localhost:5173', apiUrl: 'http://127.0.0.1:4100' },
  dev: { webUrl: 'https://web-dev-467e.up.railway.app', apiUrl: 'https://api-dev-12f8.up.railway.app' },
  prod: { webUrl: 'https://web-production-1e8d7.up.railway.app', apiUrl: 'https://api-production-82b3.up.railway.app' },
};

function resolveEnvironment(): Environment {
  const name = (process.env.TEST_ENV ?? 'dev') as EnvName;
  const base = environments[name];
  if (!base) throw new Error(`TEST_ENV inválido: "${name}". Usar local, dev o prod.`);

  const env: Environment = {
    name,
    // PROBO_WEB_URL y PROBO_API_URL pisan la config (útil en CI).
    webUrl: process.env.PROBO_WEB_URL ?? base.webUrl,
    apiUrl: process.env.PROBO_API_URL ?? base.apiUrl,
  };
  if (!env.webUrl || !env.apiUrl) {
    throw new Error(`Faltan URLs para "${name}". Definir PROBO_WEB_URL y PROBO_API_URL.`);
  }
  return env;
}

export const env = resolveEnvironment();
