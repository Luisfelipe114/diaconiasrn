import { auth }                             from '@/auth';
import { redirect }                         from 'next/navigation';
import { listarComprovantes, initDb }       from '@/lib/db';
import AdminClient                          from './AdminClient';

export const metadata = {
  title: 'Painel Admin – Diaconia',
};

export default async function AdminPage() {
  // Verifica sessão no servidor (dupla proteção além do proxy.js)
  const session = await auth();
  if (!session?.user) redirect('/login');

  await initDb();
  const comprovantes = await listarComprovantes();

  return (
    <AdminClient
      comprovantes={comprovantes}
      usuarioNome={session.user.name}
      usuarioEmail={session.user.email}
    />
  );
}
