'use client';

import { useState } from 'react';
import { signIn }   from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [email,   setEmail]   = useState('');
  const [senha,   setSenha]   = useState('');
  const [erro,    setErro]    = useState('');
  const [loading, setLoading] = useState(false);
  const router                = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    // signIn() do NextAuth chama POST /api/auth/signin internamente,
    // verifica as credenciais via authorize() em auth.js,
    // e cria o cookie JWT se válido.
    const result = await signIn('credentials', {
      email,
      password: senha,
      redirect: false, // não redireciona automaticamente — tratamos aqui
    });

    setLoading(false);

    if (result?.error) {
      setErro('Email ou senha incorretos.');
    } else {
      router.push('/admin');
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.icon}><Lock size={32} /></div>
        <h1 className={styles.title}>Painel Administrativo</h1>
        <p className={styles.subtitle}>Diaconia Territorial São Raimundo Nonato</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {erro && <p className={styles.erro}>{erro}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
