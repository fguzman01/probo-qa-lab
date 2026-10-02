import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createPrisma } from './client.js';

// Crea o actualiza el usuario del entorno. Idempotente: corre en cada deploy.
// Las credenciales vienen de variables; si no están, no hace nada.
async function main() {
  const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_USER_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL;

  if (!email || !password || !databaseUrl) {
    console.log('[seed] SEED_USER_EMAIL / SEED_USER_PASSWORD / DATABASE_URL no definidos: se omite el seed');
    return;
  }

  const db = createPrisma(databaseUrl);
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.user.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });
    console.log(`[seed] usuario listo: ${email}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((err) => {
  console.error('[seed] error', err);
  process.exit(1);
});
