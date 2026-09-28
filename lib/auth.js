/**
 * lib/auth.js
 * Funções de autenticação usando JWT assinado com a biblioteca `jose`.
 * O token é guardado num cookie HttpOnly (não acessível pelo JavaScript do navegador).
 */
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'diaconia_admin_session';
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
);
const EXPIRES_IN = '8h'; // Sessão expira em 8 horas

/**
 * Verifica se a senha fornecida é válida.
 */
export function senhaValida(senha) {
  return senha === process.env.ADMIN_PASSWORD;
}

/**
 * Cria um JWT assinado e define o cookie de sessão.
 */
export async function criarSessao() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,   // JavaScript do browser não consegue acessar
    secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 horas em segundos
    path: '/',
  });
}

/**
 * Destrói a sessão atual limpando o cookie.
 */
export async function destruirSessao() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Verifica se o cookie de sessão atual é válido.
 * @returns {boolean}
 */
export async function sessaoValida() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retorna o token da sessão (usado pelo middleware).
 */
export function getTokenDoCookie(request) {
  return request.cookies.get(COOKIE_NAME)?.value;
}
