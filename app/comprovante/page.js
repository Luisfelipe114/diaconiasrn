'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || '86995982235';

export default function ComprovantePage() {
  const [nome, setNome]             = useState('');
  const [telefone, setTelefone]     = useState('');
  const [fotoFile, setFotoFile]     = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [salvando, setSalvando]     = useState(false);
  const [enviado, setEnviado]       = useState(false);
  const [feedback, setFeedback]     = useState({ msg: '', tipo: '' });
  const [toastMsg, setToastMsg]     = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const fileInputRef = useRef(null);

  /* ── TOAST ── */
  function showToast(msg, duration = 3200) {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), duration);
  }

  /* ── COPIAR PIX ── */
  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = PIX_KEY;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('Chave Pix copiada!');
  }

  /* ── MÁSCARA DE TELEFONE ── */
  function handleTelefoneChange(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 0) v = '(' + v;
    if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
    if (v.length > 9) v = v.slice(0, 10) + '-' + v.slice(10);
    setTelefone(v.slice(0, 15));
  }

  /* ── SELEÇÃO DE FOTO ── */
  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFotoPreview('pdf');
    }
    showToast('Comprovante selecionado!');
  }

  function removerFoto(e) {
    e.preventDefault();
    e.stopPropagation();
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  /* ── SALVAR REGISTRO ── */
  async function handleSalvar(e) {
    e.preventDefault();
    setFeedback({ msg: '', tipo: '' });
    if (!nome.trim()) {
      setFeedback({ msg: 'Por favor, informe seu nome completo.', tipo: 'error' });
      return;
    }
    if (!fotoFile) {
      setFeedback({ msg: 'Por favor, anexe o comprovante (foto ou PDF).', tipo: 'error' });
      return;
    }
    setSalvando(true);
    try {
      const fd = new FormData();
      fd.append('nome', nome.trim());
      if (telefone) fd.append('telefone', telefone);
      fd.append('foto', fotoFile);

      const res = await fetch('/api/comprovantes', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar');
      
      // Limpa os campos
      setNome('');
      setTelefone('');
      setFotoFile(null);
      setFotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setEnviado(true);
      showToast('Informações salvas!');
    } catch (err) {
      setFeedback({ msg: err.message, tipo: 'error' });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logoCircle}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div className={styles.brandText}>
              <span className={styles.eyebrow}>Devolução do Dízimo</span>
              <span className={styles.brandName}>Diaconia Territorial</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" className={styles.btnHeaderPix} style={{ textDecoration: 'none' }}>← Início</Link>
            <button className={styles.btnHeaderPix} onClick={() => document.getElementById('pix-section').scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              <span>♥</span> Devolva seu dízimo
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Um gesto de comunhão</p>
        <h1 className={styles.heroTitle}>Diaconia Territorial São Raimundo Nonato</h1>
        <p className={styles.heroDesc}>
          Copie a chave Pix abaixo para realizar a devolução do dízimo.
          Depois, envie o comprovante pelo WhatsApp.
        </p>
      </section>

      {/* CARD PRINCIPAL */}
      <main className={styles.container}>
        <div className={styles.card}>

          {/* CHAVE PIX NO TOPO */}
          <section className={styles.pixTopSection} id="pix-section" style={{ marginBottom: 24 }}>
            <div className={styles.pixBox}>
              <div className={styles.pixBoxInner}>
                <div>
                  <p className={styles.pixLabel}>Chave Pix</p>
                  <p className={styles.pixValue}>{PIX_KEY}</p>
                </div>
                <button className={styles.btnToqueCopiar} onClick={copyPix}>
                  📋 Toque para copiar
                </button>
              </div>
            </div>
          </section>

          {/* PASSOS */}
          <section className={styles.stepsSection}>
            <h2 className={styles.cardTitle}>Como realizar a devolução</h2>
            <div className={styles.stepsGrid}>
              {[
                'Copiar a chave Pix',
                'Abrir o app do seu banco e fazer o Pix',
                'Registrar suas informações',
                'Salvar o comprovante',
                'Voltar ao site',
              ].map((label, i) => (
                <div key={i} className={styles.stepItem}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <p className={styles.stepLabel}>{label}</p>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.divider} />

          {/* FORMULÁRIO DE REGISTRO E UPLOAD */}
          <section className={styles.registerSection}>
            <h2 className={styles.registerTitle}>Registrar informações</h2>
            <p className={styles.registerDesc}>
              Preencha seus dados para salvar nesta experiência.
              O acesso aos dados fica restrito ao administrador.
            </p>

            {enviado ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3>Comprovante salvo com sucesso!</h3>
                <button 
                  type="button" 
                  className={styles.btnSecondary} 
                  onClick={() => {
                    setEnviado(false);
                    setFeedback({ msg: '', tipo: '' });
                  }}
                >
                  Enviar outro comprovante
                </button>
              </div>
            ) : (
              <form onSubmit={handleSalvar} className={styles.form} noValidate>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="r-nome">Nome completo</label>
                    <input
                      id="r-nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="r-tel">Telefone (opcional)</label>
                    <input
                      id="r-tel"
                      type="tel"
                      placeholder="(86) 90000-0000"
                      value={telefone}
                      onChange={handleTelefoneChange}
                      maxLength={15}
                    />
                  </div>
                </div>
                
                {/* Upload do comprovante */}
                <div className={styles.uploadWrap} style={{ marginTop: 24, marginBottom: 12 }}>
                  <span className={styles.uploadLabel}>Anexar comprovante</span>
                  <label
                    className={`${styles.uploadArea} ${fotoFile ? styles.uploadHasFile : ''}`}
                    htmlFor="r-foto"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fileInputRef.current?.click(); }}}
                  >
                    {!fotoFile ? (
                      <div className={styles.uploadPlaceholder}>
                        <span className={styles.uploadIcon}>☁</span>
                        <span>Toque para selecionar a foto</span>
                        <small>JPG, PNG ou PDF</small>
                      </div>
                    ) : fotoPreview === 'pdf' ? (
                      <div className={styles.uploadPdf}>
                        <span style={{ fontSize: 42, color: '#c0392b' }}>📄</span>
                        <span>{fotoFile.name}</span>
                      </div>
                    ) : (
                      <div className={styles.uploadPreview}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fotoPreview} alt="Prévia do comprovante" />
                        <button
                          type="button"
                          className={styles.btnRemoveImg}
                          onClick={removerFoto}
                          aria-label="Remover imagem"
                        >✕</button>
                      </div>
                    )}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="r-foto"
                    accept="image/*,application/pdf"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={handleFotoChange}
                  />
                </div>

                {feedback.msg && (
                  <p className={`${styles.feedback} ${feedback.tipo === 'error' ? styles.feedbackError : styles.feedbackSuccess}`}>
                    {feedback.msg}
                  </p>
                )}
                <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                  {salvando ? 'Salvando…' : 'Salvar informações'}
                </button>
              </form>
            )}
            
            <div className={styles.footerDeco} aria-hidden="true" style={{ marginTop: 36, marginBottom: 8 }}>
              <span className={styles.decoLine} />
              <span className={styles.decoHeart}>♥</span>
              <span className={styles.decoLine} />
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato — Curralinhos, PI</p>
      </footer>

      {/* TOAST */}
      <div className={`${styles.toast} ${toastVisible ? styles.toastShow : ''}`} role="status" aria-live="polite">
        ✅ <span>{toastMsg}</span>
      </div>
    </>
  );
}
