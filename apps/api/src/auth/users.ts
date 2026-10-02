import type { Db } from '../db/client.js';

export type UserRecord = { id: string; email: string; passwordHash: string };

export type UserRepo = {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
};

export function createUserRepo(db: Db): UserRepo {
  return {
    findByEmail: (email) => db.user.findUnique({ where: { email } }),
    findById: async (id) => {
      // Un id con formato inválido no es un usuario: evita el error de Postgres por uuid mal formado.
      if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
      return db.user.findUnique({ where: { id } });
    },
  };
}
