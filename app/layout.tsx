import './globals.css';
import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans_Arabic, Noto_Sans_SC } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-ibm-arabic',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sc',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'AlTony tex - Premium Yarn & Fabric B2B Platform',
  description: 'AlTony tex - Premium B2B textile and yarn platform for high-end fabric collections and quality yarn products.',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ibmPlexArabic.variable} ${notoSansSC.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
