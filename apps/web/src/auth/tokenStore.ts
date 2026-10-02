const KEY = 'probo.token';

// localStorage puede fallar (modo privado, almacenamiento bloqueado): sin token = sin sesión.
export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(KEY, token);
    } catch {
      /* sin persistencia: la sesión dura lo que la pestaña */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* nada que limpiar */
    }
  },
};
