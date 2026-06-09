import type { Metadata, Viewport } from 'next';
import { Libre_Baskerville, Inter } from 'next/font/google';
import './globals.css';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mural Comunitario BIC01 Guelatao de Juárez',
  description:
    'Tablero colaborativo de documentación cultural — BIC Sierra Norte de Oaxaca',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${libreBaskerville.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
