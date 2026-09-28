'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';

const PIX_KEY       = process.env.NEXT_PUBLIC_PIX_KEY       || '86995982235';
const WHATSAPP_NUM  = process.env.NEXT_PUBLIC_WHATSAPP_NUM  || '5586994032800';

export default function Home() {
  const [nome, setNome]             = useState('');
  const [nascimento, setNascimento] = useState('');
  const [fotoFile, setFotoFile]     = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [salvando, setSalvando]     = useState(false);
  const [feedback, setFeedback]     = useState({ msg: '', tipo: '' });
  const [toastMsg, setToastMsg]     = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [fallbackMsg, setFallbackMsg]   = useState('');
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

  /* ── MÁSCARA DE DATA ── */
  function handleNascimentoChange(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
    setNascimento(v.slice(0, 8));
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
    setSalvando(true);
    try {
      const fd = new FormData();
      fd.append('nome', nome.trim());
      fd.append('nascimento', nascimento);
      if (fotoFile) fd.append('foto', fotoFile);

      const res = await fetch('/api/comprovantes', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.erro || 'Erro ao salvar');
      setFeedback({ msg: '✓ Informações salvas com sucesso!', tipo: 'success' });
      showToast('Informações salvas!');
    } catch (err) {
      setFeedback({ msg: err.message, tipo: 'error' });
    } finally {
      setSalvando(false);
    }
  }

  /* ── MONTAR MENSAGEM WHATSAPP ── */
  function buildWaMsg() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let msg = 'Olá! Segue meu comprovante de devolução do dízimo. 🙏\n\n';
    if (nome) msg += `👤 Nome: ${nome}\n`;
    if (nascimento) msg += `🎂 Nascimento: ${nascimento}\n`;
    msg += `📅 Data: ${hoje}\n`;
    msg += `💠 Chave Pix: ${PIX_KEY}\n`;
    if (!fotoFile) msg += '\n📎 (Comprovante em anexo)';
    return msg;
  }

  /* ── ENVIAR COMPROVANTE ── */
  async function enviarComprovante() {
    setFallbackMsg('');
    const msg    = buildWaMsg();
    const waUrl  = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;

    // Mobile + arquivo → Web Share API
    if (fotoFile && navigator.canShare?.({ files: [fotoFile] })) {
      try {
        await navigator.share({ title: 'Comprovante de Dízimo', text: msg, files: [fotoFile] });
        showToast('Comprovante enviado!');
        return;
      } catch (err) { if (err.name === 'AbortError') return; }
    }

    // Mobile sem arquivo
    if (navigator.share && !fotoFile) {
      try {
        await navigator.share({ title: 'Comprovante de Dízimo', text: msg });
        return;
      } catch (err) { if (err.name === 'AbortError') return; }
    }

    // Desktop + imagem → copia para clipboard
    if (fotoFile?.type.startsWith('image/')) {
      try {
        const buf  = await fotoFile.arrayBuffer();
        const blob = new Blob([buf], { type: fotoFile.type });
        await navigator.clipboard.write([new ClipboardItem({ [fotoFile.type]: blob })]);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        showToast('📋 Imagem copiada! Cole no WhatsApp com Ctrl+V', 5000);
        setFallbackMsg('✅ Imagem copiada! No WhatsApp Web, clique no campo de texto e pressione Ctrl+V para colar o comprovante.');
        return;
      } catch {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        setFallbackMsg('⚠️ Não foi possível copiar a imagem. No WhatsApp, clique no clipe 📎 e anexe manualmente.');
        return;
      }
    }

    // Sem arquivo ou PDF → só texto
    window.open(waUrl, '_blank', 'noopener,noreferrer');
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
          <button className={styles.btnHeaderPix} onClick={() => document.getElementById('pix-section').scrollIntoView({ behavior: 'smooth', block: 'center' })}>
            <span>♥</span> Devolva seu dízimo
          </button>
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

          {/* PASSOS */}
          <section className={styles.stepsSection}>
            <h2 className={styles.cardTitle}>Como realizar a devolução</h2>
            <div className={styles.stepsGrid}>
              {[
                'Registre suas informações',
                'Copie a chave Pix',
                'Abra o app do seu banco e faça o Pix',
                'Salve o comprovante',
                'Volte ao site e envie o comprovante',
              ].map((label, i) => (
                <div key={i} className={styles.stepItem}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <p className={styles.stepLabel}>{label}</p>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.divider} />

          {/* FORMULÁRIO DE REGISTRO */}
          <section className={styles.registerSection}>
            <h2 className={styles.registerTitle}>Registrar informações</h2>
            <p className={styles.registerDesc}>
              Preencha seus dados para salvar nesta experiência.
              O acesso aos dados fica restrito ao administrador.
            </p>
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
                  <label htmlFor="r-nasc">Data de nascimento</label>
                  <input
                    id="r-nasc"
                    type="text"
                    placeholder="dd/mm/aa"
                    value={nascimento}
                    onChange={handleNascimentoChange}
                    maxLength={8}
                  />
                </div>
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
          </section>

          <div className={styles.divider} />

          {/* SEÇÃO PIX */}
          <section className={styles.pixSection} id="pix-section">
            {/* Caixa da chave Pix */}
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

            {/* Upload do comprovante */}
            <div className={styles.uploadWrap}>
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

            {/* Botões de ação */}
            <div className={styles.pixActions}>
              <button className={styles.btnCopiarPix} onClick={copyPix}>
                Copiar chave Pix
              </button>
              <button className={styles.btnEnviar} onClick={enviarComprovante}>
                <span>📱</span> Enviar comprovante
              </button>
            </div>

            {fallbackMsg && (
              <p className={styles.fallbackNote}>{fallbackMsg}</p>
            )}

            <div className={styles.footerDeco} aria-hidden="true">
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
