import { afterEach, describe, it, expect, vi } from 'vitest';
import { buildTestApp, TEST_USER } from './helpers.js';

const login = (app: ReturnType<typeof buildTestApp>, body: unknown) =>
  app.inject({ method: 'POST', url: '/api/auth/login', payload: body as object });

describe('POST /api/auth/login', () => {
  it('con credenciales válidas responde 200 con token y usuario', async () => {
    const res = await login(buildTestApp(), { email: TEST_USER.email, password: TEST_USER.password });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ token: expect.any(String), user: { id: TEST_USER.id, email: TEST_USER.email } });
  });

  it('normaliza el email: espacios y mayúsculas no impiden el login (CA8)', async () => {
    const res = await login(buildTestApp(), { email: '  QA@Probo.DEV ', password: TEST_USER.password });

    expect(res.statusCode).toBe(200);
  });

  it('no recorta la contraseña: con espacios extra es incorrecta (CA9)', async () => {
    const res = await login(buildTestApp(), { email: TEST_USER.email, password: ` ${TEST_USER.password} ` });

    expect(res.statusCode).toBe(401);
  });

  it('con contraseña incorrecta y con email inexistente responde el mismo 401 (CA2, CA3)', async () => {
    const app = buildTestApp();
    const wrongPassword = await login(app, { email: TEST_USER.email, password: 'incorrecta' });
    const unknownEmail = await login(app, { email: 'noexiste@probo.dev', password: 'incorrecta' });

    expect(wrongPassword.statusCode).toBe(401);
    expect(unknownEmail.statusCode).toBe(401);
    expect(wrongPassword.json()).toEqual(unknownEmail.json());
    expect(wrongPassword.json().error).toBe('INVALID_CREDENTIALS');
  });

  it.each([
    ['body vacío', {}, ['email', 'password']],
    ['email vacío', { email: '', password: 'x' }, ['email']],
    ['email sin formato', { email: 'qa@probo', password: 'x' }, ['email']],
    ['email de 255 caracteres', { email: `${'a'.repeat(242)}@probo.dev.cl`, password: 'x' }, ['email']],
    ['contraseña vacía', { email: TEST_USER.email, password: '' }, ['password']],
  ])('con %s responde 400 VALIDATION_ERROR indicando los campos', async (_caso, body, fields) => {
    const res = await login(buildTestApp(), body);

    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('VALIDATION_ERROR');
    expect(res.json().details.map((d: { field: string }) => d.field).sort()).toEqual(fields);
  });

  it('acepta un email de exactamente 254 caracteres como formato válido (valor límite)', async () => {
    const email = `${'a'.repeat(241)}@probo.dev.cl`;
    expect(email.length).toBe(254);

    const res = await login(buildTestApp(), { email, password: 'x' });

    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  afterEach(() => vi.useRealTimers());

  const tokenFor = async (app: ReturnType<typeof buildTestApp>) =>
    (await login(app, { email: TEST_USER.email, password: TEST_USER.password })).json().token as string;

  it('con token válido responde 200 con el usuario', async () => {
    const app = buildTestApp();
    const token = await tokenFor(app);

    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { authorization: `Bearer ${token}` } });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ id: TEST_USER.id, email: TEST_USER.email });
  });

  it.each([
    ['sin token', undefined],
    ['con token mal formado', 'Bearer no-es-un-jwt'],
  ])('%s responde 401 UNAUTHORIZED', async (_caso, authorization) => {
    const res = await buildTestApp().inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: authorization ? { authorization } : {},
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().error).toBe('UNAUTHORIZED');
  });

  it('con token alterado responde 401', async () => {
    const app = buildTestApp();
    const token = await tokenFor(app);
    const tampered = token.slice(0, -2) + (token.endsWith('aa') ? 'bb' : 'aa');

    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { authorization: `Bearer ${tampered}` } });

    expect(res.statusCode).toBe(401);
  });

  it('el token sigue válido 1 segundo antes de las 8 h y expira a las 8 h (CA7, valor límite)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-02T10:00:00Z'));
    const app = buildTestApp();
    const token = await tokenFor(app);
    const me = () => app.inject({ method: 'GET', url: '/api/auth/me', headers: { authorization: `Bearer ${token}` } });

    vi.setSystemTime(new Date('2026-10-02T17:59:59Z'));
    expect((await me()).statusCode).toBe(200);

    vi.setSystemTime(new Date('2026-10-02T18:00:00Z'));
    expect((await me()).statusCode).toBe(401);
  });

  it('si el usuario del token ya no existe responde 401', async () => {
    const app = buildTestApp();
    await app.ready();
    const token = app.jwt.sign({ sub: '00000000-0000-4000-8000-000000000000' });

    const res = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { authorization: `Bearer ${token}` } });

    expect(res.statusCode).toBe(401);
  });
});
