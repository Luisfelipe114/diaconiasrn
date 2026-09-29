import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoginLayout({ children }) {
  const session = await auth();
  
  // Se o usuário já estiver logado, redireciona direto para o painel admin
  if (session?.user) {
    redirect('/admin');
  }

  return children;
}
