'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  cartCount?: number
}

export function Navbar({ cartCount = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/catalogo?categoria=casamento', label: 'Casamento' },
    { href: '/catalogo?categoria=aniversário', label: 'Aniversário' },
    { href: '/#inspiracao', label: 'Inspiração' },
  ]

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[var(--charcoal)] text-[var(--cream)] text-xs font-[var(--font-body)] text-center py-2 px-4 tracking-wider uppercase overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap gap-16">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8">
              <span>Entrega em 3-5 dias úteis</span>
              <span className="text-[var(--gold)] opacity-60">✦</span>
              <span>Mockups IA grátis com cada pedido personalizado</span>
              <span className="text-[var(--gold)] opacity-60">✦</span>
              <span>Resposta WhatsApp em menos de 2h</span>
              <span className="text-[var(--gold)] opacity-60">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[var(--cream)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm'
            : 'bg-[var(--cream)]'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="text-2xl font-bold tracking-tight text-[var(--charcoal)]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Topo <span className="text-[var(--gold)]">&</span> Bolo
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--charcoal-light)] font-[var(--font-body)]">
              Cake Toppers
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-[var(--font-body)] text-[var(--charcoal-light)] hover:text-[var(--charcoal)] transition-colors tracking-wide"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/personalizado"
              className="hidden sm:inline-flex items-center gap-2 bg-[var(--charcoal)] text-[var(--cream)] text-xs font-[var(--font-body)] tracking-widest uppercase px-4 py-2.5 hover:bg-[var(--gold)] hover:text-[var(--charcoal)] transition-all duration-200"
            >
              <Sparkles size={13} />
              Design IA
            </Link>

            <Link
              href="/carrinho"
              className="relative p-2 text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors"
              aria-label={`Carrinho com ${cartCount} itens`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--gold)] text-[var(--charcoal)] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-[var(--charcoal)]"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--cream)] px-4 pb-6 pt-4">
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block text-base font-[var(--font-body)] text-[var(--charcoal)] py-1"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/personalizado"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 bg-[var(--charcoal)] text-[var(--cream)] text-xs font-[var(--font-body)] tracking-widest uppercase px-4 py-3 mt-2"
                >
                  <Sparkles size={13} />
                  Criar Design Personalizado
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  )
}
