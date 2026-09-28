/**
 * app/api/auth/[...nextauth]/route.js
 * Rota catch-all que o NextAuth usa para tratar:
 *   GET/POST /api/auth/signin
 *   GET/POST /api/auth/signout
 *   GET      /api/auth/session
 *   GET      /api/auth/csrf
 *   GET      /api/auth/providers
 */
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
