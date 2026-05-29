import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import './passreg.css';

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Password Generator — Strong & Memorable Passwords Free',
  description:
    'Generate strong random or memorable passwords instantly. Free online tool. ' +
    'Passwords are created in your browser — we never see them.',
  metadataBase: new URL('https://passwordgen.vercel.app'),
  openGraph: {
    title: 'Password Generator — Strong & Memorable Passwords Free',
    description:
      'Generate strong random or memorable passwords instantly. Free online tool. ' +
      'Passwords are created in your browser — we never see them.',
    type: 'website',
    url: 'https://passwordgen.vercel.app',
    siteName: 'Password Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Generator — Strong & Memorable Passwords Free',
    description:
      'Generate strong random or memorable passwords instantly. Free online tool.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Password Generator',
  description: 'Generate strong random or memorable passwords instantly. Free online tool.',
  url: 'https://passwordgen.vercel.app',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
