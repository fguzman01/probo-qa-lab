import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import { sendError, validationDetails } from '../errors.js';
import type { UserRepo } from './users.js';

// Hash fijo para comparar aunque el email no exista: el tiempo de respuesta no delata si la cuenta existe.
const DUMMY_HASH = bcrypt.hashSync('probo-dummy-password', 10);

const loginSchema = z.object({
  email: z
    .string({ error: 'Campo obligatorio' })
    .trim()
    .toLowerCase()
    .min(1, 'Campo obligatorio')
    .max(254, 'Email inválido')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido'),
  // La contraseña no se recorta: los espacios son parte de ella.
  password: z.string({ error: 'Campo obligatorio' }).min(1, 'Campo obligatorio'),
});

export function authRoutes(app: FastifyInstance, deps: { users: UserRepo; jwtTtlSeconds: number }) {
  app.post('/api/auth/login', async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body ?? {});
    if (!parsed.success) return sendError(reply, 400, 'VALIDATION_ERROR', validationDetails(parsed.error));

    const { email, password } = parsed.data;
    const user = await deps.users.findByEmail(email);
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) return sendError(reply, 401, 'INVALID_CREDENTIALS');

    const token = app.jwt.sign({ sub: user.id }, { expiresIn: deps.jwtTtlSeconds });
    return reply.send({ token, user: { id: user.id, email: user.email } });
  });

  app.get('/api/auth/me', { preHandler: app.authenticate }, async (req, reply) => {
    const user = await deps.users.findById(req.user.sub);
    if (!user) return sendError(reply, 401, 'UNAUTHORIZED');
    return reply.send({ id: user.id, email: user.email });
  });
}
