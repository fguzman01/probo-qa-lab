import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'checking') return <p role="status" className="p-8 text-muted">Cargando…</p>;
  if (status === 'anonymous') return <Navigate to="/login" replace />;
  return children;
}
