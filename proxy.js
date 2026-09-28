/**
 * proxy.js  (Next.js 16+ — substitui o antigo middleware.js)
 *
 * O Next.js 16 exige que a função exportada se chame "proxy" (ou default).
 * Usamos o NextAuth com a config edge-safe (auth.config.js) para
 * proteger as rotas /admin/*.
 */
import NextAuth       from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

// ← Deve ser exportada como "proxy" no Next.js 16
export async function proxy(request) {
  return auth(request);
}

export const config = {
  matcher: ['/admin/:path*'],
};
