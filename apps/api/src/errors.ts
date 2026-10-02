import type { FastifyReply } from 'fastify';
import type { ZodError } from 'zod';

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND';

const messages: Record<ErrorCode, string> = {
  VALIDATION_ERROR: 'Hay campos con errores',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  UNAUTHORIZED: 'Sesión inválida o expirada',
  NOT_FOUND: 'Recurso no encontrado',
};

export function sendError(
  reply: FastifyReply,
  status: number,
  error: ErrorCode,
  details?: { field: string; message: string }[],
) {
  return reply.code(status).send({ error, message: messages[error], ...(details ? { details } : {}) });
}

// Un error por campo (el primero), para que el front muestre un solo mensaje.
export function validationDetails(err: ZodError) {
  const byField = new Map<string, string>();
  for (const issue of err.issues) {
    const field = issue.path.join('.') || 'body';
    if (!byField.has(field)) byField.set(field, issue.message);
  }
  return [...byField].map(([field, message]) => ({ field, message }));
}
