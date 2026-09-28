import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata = {
  title: 'Devolução do Dízimo – Diaconia Territorial São Raimundo Nonato',
  description:
    'Realize a devolução do seu dízimo de forma simples e rápida. Copie a chave Pix e envie o comprovante.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
