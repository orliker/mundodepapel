'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Star, ShoppingBag, Sparkles } from 'lucide-react'
import { type Product } from '@/lib/data'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    setAdded(true)
    onAddToCart?.(product)
    setTimeout(() => setAdded(false), 1800)
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative overflow-hidden bg-[var(--cream-dark)] aspect-[4/5]">
        <img
          src={product.images[imgIdx]}
          alt={`${product.name} — topo de bolo ${product.category}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onMouseEnter={() => product.images[1] && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-[var(--charcoal)] text-[var(--cream)] text-[9px] font-bold tracking-widest uppercase px-2 py-1 font-[var(--font-body)]">
              Novo
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[var(--gold)] text-[var(--charcoal)] text-[9px] font-bold tracking-widest uppercase px-2 py-1 font-[var(--font-body)]">
              Bestseller
            </span>
          )}
          {discount && (
            <span className="bg-[var(--rose-dark)] text-[var(--cream)] text-[9px] font-bold tracking-widest uppercase px-2 py-1 font-[var(--font-body)]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-px">
          <button
            onClick={handleAdd}
            className={cn(
              'flex-1 py-3 text-xs font-bold tracking-widest uppercase font-[var(--font-body)] transition-colors',
              added
                ? 'bg-[var(--gold)] text-[var(--charcoal)]'
                : 'bg-[var(--charcoal)] text-[var(--cream)] hover:bg-[var(--gold)] hover:text-[var(--charcoal)]'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={12} />
              {added ? 'Adicionado!' : 'Adicionar'}
            </span>
          </button>
          <Link
            href={`/personalizado?base=${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--cream)] text-[var(--charcoal)] hover:bg-[var(--gold)] transition-colors py-3 px-4 flex items-center justify-center"
            aria-label="Personalizar"
          >
            <Sparkles size={13} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-[var(--charcoal-light)] font-[var(--font-body)] mb-0.5">
              {product.category}
            </p>
            <h3
              className="text-base font-medium text-[var(--charcoal)] leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {product.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p
              className="text-lg font-semibold text-[var(--charcoal)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {product.price}€
            </p>
            {product.comparePrice && (
              <p className="text-xs text-[var(--charcoal-light)] line-through font-[var(--font-body)]">
                {product.comparePrice}€
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex">
            {Array(5).fill(null).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-[var(--border)]'}
              />
            ))}
          </div>
          <span className="text-[10px] text-[var(--charcoal-light)] font-[var(--font-body)]">
            ({product.reviewCount})
          </span>
        </div>

        {/* Materials */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {product.materials.map((m) => (
            <span
              key={m}
              className="text-[9px] tracking-wider uppercase border border-[var(--border)] px-2 py-0.5 text-[var(--charcoal-light)] font-[var(--font-body)]"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
