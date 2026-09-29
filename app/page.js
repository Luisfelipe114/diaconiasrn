// eslint-disable-next-line @next/next/no-img-element
import Link from 'next/link';
import styles from './home.module.css';

export const metadata = {
  title: 'Diaconia Territorial São Raimundo Nonato — Curralinhos, PI',
  description:
    'A Diaconia Territorial São Raimundo Nonato é uma organização católica que serve as comunidades de Curralinhos e região, promovendo a fé, a solidariedade e o cuidado com os mais vulneráveis.',
};

const PILARES = [
  {
    icon: '✝️',
    titulo: 'Fé e Evangelização',
    desc: 'Animação das comunidades católicas com formação, liturgia e vida sacramental.',
  },
  {
    icon: '🤝',
    titulo: 'Solidariedade',
    desc: 'Ações concretas de assistência às famílias em vulnerabilidade social na região.',
  },
  {
    icon: '🌿',
    titulo: 'Comunidade',
    desc: 'Fortalecimento dos laços entre as comunidades do território diocesano.',
  },
  {
    icon: '🕊️',
    titulo: 'Paz e Bem',
    desc: 'Promoção da dignidade humana e da justiça social inspirada no Evangelho.',
  },
];

const LINKS = [
  {
    href: '/comprovante',
    icon: '💸',
    titulo: 'Devolução do Dízimo',
    desc: 'Faça sua contribuição via Pix e registre o comprovante aqui.',
    destaque: true,
    externo: false,
  },
  {
    href: 'https://www.instagram.com/diaconiasaoraimundononato/',
    icon: '📸',
    titulo: 'Instagram',
    desc: 'Acompanhe as novidades, eventos e missões da Diaconia.',
    externo: true,
    destaque: false,
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navBrand}>
            <img src="/logo-diaconia.png" alt="Logo Diaconia" className={styles.navLogo} />
            <div>
              <span className={styles.navEyebrow}>Diaconia Territorial</span>
              <span className={styles.navName}>São Raimundo Nonato</span>
            </div>
          </div>
          <Link href="/comprovante" className={styles.navCta}>
            ♥ Devolva seu dízimo
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.heroEyebrow}>Curralinhos — PI</span>
            <h1 className={styles.heroTitle}>
              Servindo com fé,<br />
              <em>construindo comunidade</em>
            </h1>
            <p className={styles.heroDesc}>
              A Diaconia Territorial São Raimundo Nonato reúne as comunidades católicas
              de Curralinhos e região em torno da fé, da solidariedade e do serviço ao próximo.
            </p>
            <div className={styles.heroBtns}>
              <Link href="/comprovante" className={styles.btnPrimary}>
                💸 Devolver o Dízimo
              </Link>
              <a
                href="https://www.instagram.com/diaconiasaoraimundononato/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                📸 Ver no Instagram
              </a>
            </div>
          </div>
          <div className={styles.heroLogo}>
            <div className={styles.logoGlow} />
            <img src="/logo-diaconia.png" alt="Brasão da Diaconia Territorial São Raimundo Nonato" className={styles.logoImg} />
          </div>
        </div>
        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      {/* ── PILARES ── */}
      <section className={styles.pilares}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Nossa missão</span>
          <h2 className={styles.sectionTitle}>O que nos move</h2>
          <p className={styles.sectionDesc}>
            Guiados pelo Evangelho e pelo cuidado com as pessoas, atuamos em quatro pilares fundamentais.
          </p>
          <div className={styles.pilaresGrid}>
            {PILARES.map((p) => (
              <div key={p.titulo} className={styles.pilarCard}>
                <div className={styles.pilarIcon}>{p.icon}</div>
                <h3 className={styles.pilarTitulo}>{p.titulo}</h3>
                <p className={styles.pilarDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIZIMO CTA ── */}
      <section className={styles.dizimoCta}>
        <div className={styles.dizimoInner}>
          <div className={styles.dizimoText}>
            <span className={styles.dizimoEyebrow}>Participe</span>
            <h2 className={styles.dizimoTitle}>Devolva seu dízimo</h2>
            <p className={styles.dizimoDesc}>
              O dízimo é um ato de fé e generosidade. Com ele, sustentamos as missões,
              ajudamos famílias e animamos as comunidades de todo o território.
            </p>
            <Link href="/comprovante" className={styles.dizimoBtnLink}>
              Fazer minha contribuição →
            </Link>
          </div>
          <div className={styles.dizimoCard}>
            <div className={styles.dizimoCardInner}>
              <span className={styles.dizimoCardIcon}>🙏</span>
              <p className={styles.dizimoCardText}>
                &ldquo;Trazei todos os dízimos à casa do tesouro, e haja mantimento na minha casa.&rdquo;
              </p>
              <span className={styles.dizimoCardRef}>Malaquias 3:10</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LINKS RÁPIDOS ── */}
      <section className={styles.links}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Acesse rapidamente</h2>
          <div className={styles.linksGrid}>
            {LINKS.map((l) =>
              l.externo ? (
                <a
                  key={l.titulo}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.linkCard} ${l.destaque ? styles.linkCardDestaque : ''}`}
                >
                  <span className={styles.linkCardIcon}>{l.icon}</span>
                  <div>
                    <strong className={styles.linkCardTitulo}>{l.titulo}</strong>
                    <p className={styles.linkCardDesc}>{l.desc}</p>
                  </div>
                  <span className={styles.linkCardArrow}>→</span>
                </a>
              ) : (
                <Link
                  key={l.titulo}
                  href={l.href}
                  className={`${styles.linkCard} ${l.destaque ? styles.linkCardDestaque : ''}`}
                >
                  <span className={styles.linkCardIcon}>{l.icon}</span>
                  <div>
                    <strong className={styles.linkCardTitulo}>{l.titulo}</strong>
                    <p className={styles.linkCardDesc}>{l.desc}</p>
                  </div>
                  <span className={styles.linkCardArrow}>→</span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <img src="/logo-diaconia.png" alt="Logo Diaconia" className={styles.footerLogo} />
        <p className={styles.footerName}>Diaconia Territorial São Raimundo Nonato</p>
        <p className={styles.footerSub}>Curralinhos — PI</p>
        <div className={styles.footerLinks}>
          <a
            href="https://www.instagram.com/diaconiasaoraimundononato/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <Link href="/comprovante">Devolução do Dízimo</Link>
          <Link href="/login">Área Admin</Link>
        </div>
        <p className={styles.footerCopy}>© {new Date().getFullYear()} Diaconia Territorial São Raimundo Nonato. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}

