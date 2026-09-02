import type { Metadata } from 'next'
import { wa } from '@/lib/site'
import { ArrowRight, WhatsAppIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="section" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
      <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <p className="eyebrow eyebrow-center">Erro 404</p>
        <h1 style={{ marginBlock: 'var(--s-4) var(--s-5)' }}>Esta página não existe</h1>
        <p className="lead" style={{ marginInline: 'auto', marginBottom: 'var(--s-8)' }}>
          O endereço pode ter mudado. Volta ao início para ver as categorias e montar o teu topo,
          ou fala connosco directamente.
        </p>
        <div style={{ display: 'flex', gap: 'var(--s-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn-primary" href="/">Voltar ao início <ArrowRight /></a>
          <a className="btn btn-ghost" href={wa('Olá! Estava no site e não encontrei o que procurava.')} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={17} /> Falar no WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
