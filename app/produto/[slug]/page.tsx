'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, Sparkles, ChevronLeft, ChevronRight, Minus, Plus, Check, MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import ProductCard from '@/components/product-card'
import { CustomDesignModal } from '@/components/custom-design-modal'
import { AIChatWidget } from '@/components/ai-chat-widget'
import { products, reviews } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function ProductPage() {
  const { slug } = useParams()
  const product = products.find((p) => p.slug === slug)

  const [imgIdx, setImgIdx] = useState(0)
  const [selectedMaterial, setSelectedMaterial] = useState(product?.materials[0] ?? 'papel-couche-250g')
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '')
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [tab, setTab] = useState<'info' | 'specs' | 'reviews'>('info')

  const productReviews = reviews.filter((r) => r.productName === product?.name)
  const related = products.filter((p) => p.slug !== slug && p.category === product?.category).slice(0, 4)

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-light mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Produto não encontrado
            </h1>
            <Link href="/catalogo" className="text-sm text-[var(--charcoal-light)] underline font-[var(--font-body)]">
              Voltar ao catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const whatsappHref = `https://wa.me/351900000000?text=${encodeURIComponent(
    `Olá! Quero pedir orçamento para o modelo "${product.name}". Material: ${selectedMaterial}. Tamanho: ${selectedSize}. Quantidade: ${quantity}.`
  )}`

  return (
    <>
      <Navbar cartCount={cartCount} />

      <main className="bg-[var(--cream)] min-h-screen">
        <div className="border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-[var(--charcoal-light)] font-[var(--font-body)]">
              <Link href="/" className="hover:text-[var(--charcoal)] transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/catalogo" className="hover:text-[var(--charcoal)] transition-colors">
                Catálogo
              </Link>
              <span>/</span>
              <Link href={`/catalogo?categoria=${product.category}`} className="hover:text-[var(--charcoal)] transition-colors capitalize">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-[var(--charcoal)]">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-3">
              <div className="relative overflow-hidden bg-[var(--cream-dark)] aspect-square">
                <img
                  src={product.images[imgIdx]}
                  alt={`${product.name} — vista ${imgIdx + 1}`}
                  className="w-full h-full object-cover"
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--cream)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--cream)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {product.isBestseller && (
                  <div className="absolute top-4 left-4 bg-[var(--gold)] text-[var(--charcoal)] text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 font-[var(--font-body)]">
                    Bestseller
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={cn(
                        'w-20 h-20 overflow-hidden border-2 transition-colors',
                        i === imgIdx ? 'border-[var(--charcoal)]' : 'border-transparent hover:border-[var(--border)]'
                      )}
                      aria-label={`Ver imagem ${i + 1}`}
                    >
                      <img src={img} alt={`${product.name} miniatura ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] font-[var(--font-body)] mb-1 capitalize">
                  {product.category}
                </p>

                <h1 className="text-4xl font-light text-[var(--charcoal)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {product.name}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < Math.floor(product.rating) ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-[var(--border)]'}
                        />
                      ))}
                  </div>
                  <span className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                    {product.rating} · {product.reviewCount} avaliações
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p
                  className="text-2xl font-medium text-[var(--charcoal)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Valores desde 7,99€
                </p>

                <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                  O orçamento final será enviado via WhatsApp conforme a personalização e complexidade do trabalho.
                </p>

                <p className="text-xs text-[var(--charcoal-light)] font-[var(--font-body)] uppercase tracking-widest">
                  100% personalizável
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--charcoal-light)] font-[var(--font-body)] mb-2.5">
                  Material: <strong className="text-[var(--charcoal)] capitalize">{selectedMaterial}</strong>
                </p>

                <div className="flex gap-2 flex-wrap">
                  {product.materials.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(m)}
                      className={cn(
                        'px-4 py-2 border text-sm font-[var(--font-body)] capitalize transition-colors',
                        selectedMaterial === m
                          ? 'bg-[var(--charcoal)] text-[var(--cream)] border-[var(--charcoal)]'
                          : 'border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--charcoal)]'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--charcoal-light)] font-[var(--font-body)] mb-2.5">
                  Tamanho: <strong className="text-[var(--charcoal)]">{selectedSize}</strong>
                </p>

                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        'min-w-[56px] py-2 px-3 border text-sm font-[var(--font-body)] transition-colors text-center',
                        selectedSize === s
                          ? 'bg-[var(--charcoal)] text-[var(--cream)] border-[var(--charcoal)]'
                          : 'border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--charcoal)]'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--charcoal-light)] font-[var(--font-body)] mb-2.5">
                  Quantidade
                </p>

                <div className="inline-flex items-center border border-[var(--border)]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[var(--cream-dark)] transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={13} />
                  </button>

                  <span className="w-12 text-center text-sm font-medium font-[var(--font-body)]">{quantity}</span>

                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[var(--cream-dark)] transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <span className="ml-4 text-xs text-[var(--charcoal-light)] font-[var(--font-body)]">
                  Total: <strong className="text-[var(--charcoal)]">Orçamento via WhatsApp</strong>
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase font-[var(--font-body)] transition-all bg-[var(--charcoal)] text-[var(--cream)] hover:bg-[var(--gold)] hover:text-[var(--charcoal)]"
                >
                  <Sparkles size={15} />
                  Personalizar este modelo
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[var(--whatsapp)] text-[var(--whatsapp-fg)] py-4 text-sm font-bold tracking-widest uppercase font-[var(--font-body)] hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={15} />
                  Pedir orçamento no WhatsApp
                </a>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--border)]">
                {[
                  '100% personalizável',
                  'Envio seguro',
                  'Atendimento via WhatsApp',
                  'Feito em Portugal',
                ].map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-xs text-[var(--charcoal-light)] font-[var(--font-body)]">
                    <Check size={11} className="text-[var(--gold)]" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="border-b border-[var(--border)] flex gap-0">
              {[
                { key: 'info', label: 'Descrição' },
                { key: 'specs', label: 'Especificações' },
                { key: 'reviews', label: `Avaliações (${product.reviewCount})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key as typeof tab)}
                  className={cn(
                    'px-6 py-3 text-xs tracking-widest uppercase font-[var(--font-body)] border-b-2 transition-colors',
                    tab === key
                      ? 'border-[var(--charcoal)] text-[var(--charcoal)]'
                      : 'border-transparent text-[var(--charcoal-light)] hover:text-[var(--charcoal)]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="py-8 max-w-2xl">
              {tab === 'info' && (
                <p className="text-sm text-[var(--charcoal)] leading-relaxed font-[var(--font-body)]">
                  {product.description}
                </p>
              )}

              {tab === 'specs' && (
                <div className="space-y-3">
                  {[
                    ['Categoria', product.category],
                    ['Materiais disponíveis', product.materials.join(', ')],
                    ['Tamanhos', product.sizes.join(', ')],
                    ['Tags', product.tags.join(', ')],
                    ['Orçamento', 'Enviado via WhatsApp'],
                    ['Personalização', 'Nome, idade, tema, cores e referências'],
                    ['Acabamento', 'Papelería premium e corte de precisão'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-4 py-2 border-b border-[var(--border)] text-sm font-[var(--font-body)]">
                      <span className="w-40 shrink-0 text-[var(--charcoal-light)] capitalize">{k}</span>
                      <span className="text-[var(--charcoal)] capitalize">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'reviews' && (
                <div className="space-y-4">
                  {productReviews.length > 0 ? (
                    productReviews.map((r) => (
                      <div key={r.id} className="border border-[var(--border)] p-4">
                        <div className="flex gap-0.5 mb-2">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Star key={i} size={11} className="text-[var(--gold)] fill-[var(--gold)]" />
                            ))}
                        </div>
                        <p className="text-sm text-[var(--charcoal)] font-[var(--font-body)] leading-relaxed">{`"${r.text}"`}</p>
                        <p className="text-xs text-[var(--charcoal-light)] font-[var(--font-body)] mt-2">
                          {r.author} · {r.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                      Ainda sem avaliações para este produto. Sê o primeiro!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

                    {related.length > 0 && (
            <div className="mt-16 pt-16 border-t border-[var(--border)]">
              <h2
                className="text-3xl font-light text-[var(--charcoal)] mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Também podes gostar
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produto/${p.slug}`}
                    className="group block bg-white border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-[var(--cream-dark)] overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--gold)] font-[var(--font-body)] capitalize">
                        {p.category}
                      </p>

                      <h3
                        className="text-lg text-[var(--charcoal)]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {p.name}
                      </h3>

                      <p className="text-xs text-[var(--charcoal-light)] font-[var(--font-body)] line-clamp-2">
                        {p.description}
                      </p>

                      <div className="pt-1 space-y-1">
                        <p className="text-sm font-medium text-[var(--charcoal)]">
                          Valores desde 7,99€
                        </p>
                        <p className="text-[11px] text-[var(--charcoal-light)] font-[var(--font-body)]">
                          Orçamento final via WhatsApp
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CustomDesignModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <AIChatWidget />
    </>
  )
}
