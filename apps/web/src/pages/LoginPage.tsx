import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { Logo } from '../components/Logo';
import { ApiError } from '../lib/api';

type FieldErrors = { email?: string; password?: string };

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mismas reglas que la API: email con trim y máx. 254; contraseña sin trim, solo "" es vacía.
function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const normalized = email.trim();
  if (!normalized) errors.email = 'Campo obligatorio';
  else if (normalized.length > 254 || !EMAIL_FORMAT.test(normalized)) errors.email = 'Email inválido';
  if (password === '') errors.password = 'Campo obligatorio';
  return errors;
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const expired = (location.state as { expired?: boolean } | null)?.expired === true;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Con sesión activa, /login no tiene sentido (CA12).
  if (status === 'authenticated') return <Navigate to="/historias" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const errors = validate(email, password);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/historias', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError('Email o contraseña incorrectos');
        setPassword('');
      } else if (err instanceof ApiError && err.status === 400 && err.body.details) {
        setFieldErrors(Object.fromEntries(err.body.details.map((d) => [d.field, d.message])));
      } else {
        setFormError('No se pudo conectar. Intentá de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (invalid: boolean) =>
    `h-11 rounded-lg border bg-surface px-3 text-[15px] text-ink outline-none focus:ring-2 focus:ring-primary/30 ${
      invalid ? 'border-[1.5px] border-danger' : 'border-border-strong'
    }`;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-[400px] flex-col gap-7">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size={48} />
          <div className="flex flex-col gap-1">
            <h1 className="m-0 text-[28px] font-bold tracking-tight">Iniciar sesión</h1>
            <p className="m-0 text-[15px] text-muted">Probo · gestión de pruebas AI-First</p>
          </div>
        </div>

        <form
          aria-label="Iniciar sesión"
          noValidate
          onSubmit={onSubmit}
          className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-7"
        >
          {expired && !formError && (
            <div role="status" className="rounded-lg bg-primary-soft px-3.5 py-3 text-sm font-medium text-primary-hover">
              Tu sesión expiró. Iniciá sesión de nuevo.
            </div>
          )}
          {formError && (
            <div role="alert" className="rounded-lg bg-danger-soft px-3.5 py-3 text-sm font-medium text-danger-ink">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
              className={inputClass(!!fieldErrors.email)}
            />
            {fieldErrors.email && (
              <span id="login-email-error" className="text-[13px] text-danger">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-sm font-medium">
              Contraseña
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
              className={inputClass(!!fieldErrors.password)}
            />
            {fieldErrors.password && (
              <span id="login-password-error" className="text-[13px] text-danger">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-lg bg-primary text-[15px] font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-[#E4E6EB] disabled:text-[#6B7280]"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="m-0 text-center text-[13px] text-muted">¿Sin acceso? Pedile una cuenta al administrador.</p>
      </div>
    </main>
  );
}
