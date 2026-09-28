/**
 * auth.js
 * Configuração completa do NextAuth com o Credentials Provider.
 * Roda apenas no ambiente Node.js (não no Edge), portanto pode usar bcrypt.
 *
 * Exporta: handlers (rotas HTTP), auth (lê sessão), signIn, signOut.
 */
import NextAuth          from 'next-auth';
import Credentials       from 'next-auth/providers/credentials';
import bcrypt            from 'bcryptjs';
import { authConfig }    from './auth.config';
import { buscarUsuarioPorEmail, initDb } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // Campos que o formulário de login vai enviar
      credentials: {
        email:    { label: 'Email',  type: 'email'    },
        password: { label: 'Senha',  type: 'password' },
      },

      /**
       * authorize() — chamada a cada tentativa de login.
       * Retorna o objeto do usuário se válido, ou null se inválido.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Garante que o banco e as tabelas existem
        await initDb();

        // Busca o usuário pelo email
        const usuario = await buscarUsuarioPorEmail(String(credentials.email));
        if (!usuario) return null;

        // Compara a senha digitada com o hash bcrypt armazenado
        const senhaValida = await bcrypt.compare(
          String(credentials.password),
          usuario.senha_hash
        );
        if (!senhaValida) return null;

        // Retorna o objeto que vai para o token/sessão
        return {
          id:    String(usuario.id),
          name:  usuario.nome,
          email: usuario.email,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',    // sessão guardada em JWT no cookie (sem tabela de sessões no DB)
    maxAge:   8 * 3600, // 8 horas
  },
});
