// En dev/prod la URL de la API se inyecta en el build (VITE_API_URL). En local se usa el proxy de Vite.
const API_URL = import.meta.env.VITE_API_URL ?? '';

export type Health = { status: 'ok' | 'degraded'; env: string; db: 'ok' | 'error' };

export async function getHealth(): Promise<Health> {
  const res = await fetch(`${API_URL}/api/health`);
  return res.json();
}
