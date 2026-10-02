// En dev/prod la URL de la API se inyecta en el build (VITE_API_URL). En local se usa el proxy de Vite.
const API_URL = import.meta.env.VITE_API_URL ?? '';

export type ApiErrorBody = { error: string; message?: string; details?: { field: string; message: string }[] };

/** Error HTTP de la API (status >= 400). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.message ?? body.error);
  }
}

/** La API no respondió (red caída, CORS, timeout). */
export class NetworkError extends Error {}

let onUnauthorized: (() => void) | null = null;

/** Lo registra la sesión: cualquier 401 de un request autenticado cierra la sesión. */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

type Options = { method?: string; body?: unknown; token?: string | null };

export async function apiFetch<T>(path: string, { method = 'GET', body, token }: Options = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new NetworkError('No se pudo conectar');
  }

  if (res.status === 401 && token) onUnauthorized?.();

  const data = res.status === 204 ? undefined : await res.json().catch(() => ({ error: 'INVALID_RESPONSE' }));
  if (!res.ok) throw new ApiError(res.status, data as ApiErrorBody);
  return data as T;
}
