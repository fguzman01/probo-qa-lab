import { useEffect, useState } from 'react';
import { getHealth, type Health } from './api';

type State = { kind: 'loading' } | { kind: 'ready'; health: Health } | { kind: 'error' };

export function App() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    getHealth()
      .then((health) => setState({ kind: 'ready', health }))
      .catch(() => setState({ kind: 'error' }));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Probo</h1>
      <p>Gestión de pruebas AI-First</p>

      <section aria-label="Estado del sistema">
        <h2>Estado del sistema</h2>
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
