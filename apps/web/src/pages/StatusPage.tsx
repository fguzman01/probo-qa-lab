import { useEffect, useState } from 'react';

type Health = { status: 'ok' | 'degraded'; env: string; db: 'ok' | 'error' };
type State = { kind: 'loading' } | { kind: 'ready'; health: Health } | { kind: 'error' };

// Página pública de estado del sistema (la usan los smoke tests).
export function StatusPage() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    // El health responde 503 cuando la base no responde: igual trae el detalle.
    fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/health`)
      .then((res) => res.json() as Promise<Health>)
      .then((health) => setState({ kind: 'ready', health }))
      .catch(() => setState({ kind: 'error' }));
  }, []);

  return (
    <main className="p-8">
      <h1 className="m-0 text-[28px] font-bold">Probo</h1>
      <p className="text-muted">Gestión de pruebas AI-First</p>
      <section aria-label="Estado del sistema">
        <h2 className="text-xl font-semibold">Estado del sistema</h2>
        {state.kind === 'loading' && <p role="status">Consultando la API…</p>}
        {state.kind === 'error' && <p role="status">API no disponible</p>}
        {state.kind === 'ready' && (
          <ul>
            <li>
              API: <strong data-testid="api-status">{state.health.status}</strong>
            </li>
            <li>
              Base de datos: <strong data-testid="db-status">{state.health.db}</strong>
            </li>
            <li>
              Entorno: <strong data-testid="app-env">{state.health.env}</strong>
            </li>
          </ul>
        )}
      </section>
    </main>
  );
}
