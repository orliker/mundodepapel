import type { Metadata } from 'next'
import { Nunito, Playfair_Display } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mundo de Papel Portugal — Topos de Bolo Personalizados',
  description:
    'Topos de bolo personalizados feitos com amor em Portugal. Para aniversários, casamentos, batizados e todas as ocasiões especiais.',
  keywords: ['topo de bolo', 'cake topper', 'personalizado', 'portugal', 'decoração bolo'],
  openGraph: {
    title: 'Mundo de Papel Portugal',
    description: 'Topos de bolo personalizados para tornar cada momento especial.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" className={`${nunito.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
