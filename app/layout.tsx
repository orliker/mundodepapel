import type { Metadata, Viewport } from 'next'
import { Fraunces, Instrument_Sans } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

/**
 * next/font descarga y sirve las fuentes desde o proprio dominio (sin llamadas
 * a Google en el navegador) y genera el fallback con metricas ajustadas, asi
 * que no hay salto de texto al cargar.
 */
const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

const sans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
})

const description =
  'Topos de bolo personalizados, recortados e montados à mão em papel, em Portugal. Aniversários, batizados, casamentos e datas especiais. Desde 7,90€, produção em 3 a 5 dias úteis.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Topos de bolo personalizados em papel | Mundo de Papel Portugal',
    template: '%s | Mundo de Papel Portugal',
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    'topo de bolo personalizado',
    'topos de bolo',
    'cake topper Portugal',
    'topo de bolo aniversário',
    'topo de bolo batizado',
    'topo de bolo casamento',
    'decoração de bolo em papel',
    'topo de bolo com nome',
    'bodas de prata',
    'bodas de ouro',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: site.url,
    siteName: site.name,
    title: 'Topos de bolo personalizados, feitos à mão em papel',
    description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Topos de bolo personalizados, recortados à mão em papel. Desde 7,90€, produção em 3 a 5 dias úteis.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Topos de bolo personalizados | Mundo de Papel Portugal',
    description,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/logo-mundo-de-papel.png', type: 'image/png' }],
    apple: [{ url: '/logo-mundo-de-papel.png' }],
  },
  category: 'shopping',
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#F7F4ED',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

/** Datos estructurados de la marca y del sitio. */
const orgLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organizacao`,
      name: site.name,
      url: site.url,
      description,
      email: site.email,
      telephone: `+${site.whatsapp}`,
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}/logo-mundo-de-papel.png`,
        width: 500,
        height: 500,
      },
      image: `${site.url}/images/aniversario-kpop.webp`,
      sameAs: [site.instagram],
      areaServed: { '@type': 'Country', name: 'Portugal' },
      knowsLanguage: ['pt-PT'],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: `+${site.whatsapp}`,
          email: site.email,
          areaServed: 'PT',
          availableLanguage: ['Portuguese'],
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#site`,
      url: site.url,
      name: site.name,
      inLanguage: 'pt-PT',
      publisher: { '@id': `${site.url}/#organizacao` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // el contenido es constante y no proviene del usuario
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#conteudo">Saltar para o conteúdo</a>
        {children}
      </body>
    </html>
  )
}
