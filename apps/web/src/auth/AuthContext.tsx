import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { apiFetch, setUnauthorizedHandler } from '../lib/api';
import { tokenStore } from './tokenStore';

export type User = { id: string; email: string };

type AuthState =
  | { status: 'checking'; user: null }
  | { status: 'authenticated'; user: User }
  | { status: 'anonymous'; user: null };

type AuthContextValue = AuthState & {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => tokenStore.get());
  const [state, setState] = useState<AuthState>(() =>
    tokenStore.get() ? { status: 'checking', user: null } : { status: 'anonymous', user: null },
  );

  // Sesión vencida o inválida: se borra el token y se vuelve al login avisando (CA7).
  const expire = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setState({ status: 'anonymous', user: null });
    navigate('/login', { replace: true, state: { expired: true } });
  }, [navigate]);

  useEffect(() => {
    setUnauthorizedHandler(expire);
    return () => setUnauthorizedHandler(null);
  }, [expire]);

  // Al recargar, se valida el token guardado contra la API (CA6).
  useEffect(() => {
    if (!token || state.status !== 'checking') return;
    apiFetch<User>('/api/auth/me', { token })
      .then((user) => setState({ status: 'authenticated', user }))
      .catch(() => {
        /* el 401 ya lo maneja expire(); ante red caída se trata como sin sesión */
        setState((s) => (s.status === 'checking' ? { status: 'anonymous', user: null } : s));
      });
  }, [token, state.status]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    tokenStore.set(res.token);
    setToken(res.token);
    setState({ status: 'authenticated', user: res.user });
  }, []);

  const value = useMemo(() => ({ ...state, token, login }), [state, token, login]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
