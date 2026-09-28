'use client';

import { useState }    from 'react';
import { signOut }     from 'next-auth/react';
import styles          from './admin.module.css';

export default function AdminClient({ comprovantes, usuarioNome, usuarioEmail }) {
  const [busca, setBusca]         = useState('');
  const [saindo, setSaindo]       = useState(false);
  const [fotoModal, setFotoModal] = useState(null);


  const filtrados = comprovantes.filter(c =>
    c.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  async function handleLogout() {
    setSaindo(true);
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>Painel Administrativo</h1>
            <p className={styles.headerSub}>Diaconia Territorial São Raimundo Nonato</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{usuarioNome}</span>
              <span className={styles.userEmail}>{usuarioEmail}</span>
            </div>
            <button className={styles.btnLogout} onClick={handleLogout} disabled={saindo}>
              {saindo ? 'Saindo…' : '↩ Sair'}
            </button>
          </div>
        </div>
      </header>


      <main className={styles.main}>
        {/* RESUMO */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{comprovantes.length}</span>
            <span className={styles.statLabel}>Total de registros</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>
              {comprovantes.filter(c => c.foto_url).length}
            </span>
            <span className={styles.statLabel}>Com comprovante</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>
              {comprovantes.filter(c => !c.foto_url).length}
            </span>
            <span className={styles.statLabel}>Sem comprovante</span>
          </div>
        </div>

        {/* BUSCA */}
        <div className={styles.searchWrap}>
          <input
            type="search"
            placeholder="🔍  Buscar por nome…"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* TABELA */}
        <div className={styles.tableWrap}>
          {filtrados.length === 0 ? (
            <p className={styles.empty}>Nenhum registro encontrado.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Nascimento</th>
                  <th>Data do registro</th>
                  <th>Comprovante</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c, i) => (
                  <tr key={c.id}>
                    <td className={styles.tdNum}>{filtrados.length - i}</td>
                    <td className={styles.tdNome}>{c.nome}</td>
                    <td>{c.nascimento || '—'}</td>
                    <td>{c.criado_em}</td>
                    <td>
                      {c.foto_url ? (
                        <button
                          className={styles.btnVerFoto}
                          onClick={() => setFotoModal(c.foto_url)}
                        >
                          Ver foto
                        </button>
                      ) : (
                        <span className={styles.semFoto}>Não enviado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL DE FOTO */}
      {fotoModal && (
        <div className={styles.modalOverlay} onClick={() => setFotoModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setFotoModal(null)}>✕</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fotoModal} alt="Comprovante" className={styles.modalImg} />
            <a href={fotoModal} target="_blank" rel="noopener noreferrer" className={styles.btnDownload}>
              ⬇ Abrir em nova aba
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
