'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { site, wa } from '@/lib/site'
import { WhatsAppIcon, Menu, Close } from './icons'

const LINKS = [
  { id: 'categorias', label: 'Categorias' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'trabalhos', label: 'Trabalhos' },
  { id: 'precos', label: 'Preços' },
  { id: 'perguntas', label: 'Perguntas' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // seccion activa: observador, no calculos en cada scroll
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // el menu movil no debe dejar la pagina desplazable por detras
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`header${scrolled ? ' header-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#topo" className="brand" aria-label={`${site.name} — início`}>
          <Image
            src="/images/logo-mundo-de-papel.webp"
            alt=""
            width={44}
            height={44}
            priority
          />
          <span>
            <span className="brand-name">Mundo de Papel</span>
            <span className="brand-sub">Portugal</span>
          </span>
        </a>

        <nav className="nav nav-desktop" aria-label="Navegação principal">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="btn btn-wa btn-sm nav-desktop"
            href={wa('Olá! Vim do site e gostava de encomendar um topo de bolo personalizado.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={16} />
            Encomendar
          </a>

          <button
            type="button"
            className="icon-btn nav-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="menu-panel" id="menu-movel">
          <div className="container">
            <nav aria-label="Navegação principal (menu)">
              {LINKS.map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
            </nav>
            <a
              className="btn btn-wa btn-block"
              style={{ marginTop: 'var(--s-5)' }}
              href={wa('Olá! Vim do site e gostava de encomendar um topo de bolo personalizado.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon size={18} />
              Encomendar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
