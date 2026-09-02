'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CATEGORIES, type Category } from '@/lib/content'
import { site, wa, eur } from '@/lib/site'
import { ArrowRight, Check, Close, WhatsAppIcon } from './icons'

/** Que ocasion del configurador corresponde a cada categoria. */
const OCCASION: Record<string, string> = {
  aniversario: 'Aniversário',
  batizado: 'Batizado',
  casamento: 'Casamento',
  coroas: 'Outro',
  'dia-da-mae': 'Dia da Mãe',
  'dia-do-pai': 'Dia do Pai',
  natal: 'Natal',
  pascoa: 'Páscoa',
  halloween: 'Halloween',
}

export function Categories() {
  const [open, setOpen] = useState<Category | null>(null)
  const [shot, setShot] = useState(0)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const show = (cat: Category, el: HTMLButtonElement) => {
    openerRef.current = el
    setShot(0)
    setOpen(cat)
  }

  const close = useCallback(() => {
    setOpen(null)
    openerRef.current?.focus()
  }, [])

  // Esc para cerrar y foco atrapado dentro del panel
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || !focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  const personalizar = (cat: Category) => {
    window.dispatchEvent(new CustomEvent('mdp:preset', { detail: OCCASION[cat.id] ?? 'Outro' }))
    setOpen(null)
    document.getElementById('personalizar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <ul className="cat-grid">
        {CATEGORIES.map((cat, i) => (
          <li key={cat.id} style={{ display: 'contents' }}>
            <button
              type="button"
              className="cat-card"
              onClick={(e) => show(cat, e.currentTarget)}
              aria-haspopup="dialog"
            >
              <span className="cat-media">
                <Image
                  src={cat.cover.src}
                  alt={cat.cover.alt}
                  width={cat.cover.w}
                  height={cat.cover.h}
                  sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 280px"
                  loading={i < 3 ? 'eager' : 'lazy'}
                  style={cat.cover.focus ? { objectPosition: cat.cover.focus } : undefined}
                />
                <span className="cat-tag num">desde {eur(cat.priceFrom)}</span>
              </span>
              <span className="cat-body">
                <h3>{cat.name}</h3>
                <span className="cat-desc">{cat.blurb}</span>
                <span className="cat-foot">
                  <span>{cat.gallery.length} {cat.gallery.length === 1 ? 'foto' : 'fotos'}</span>
                  <span className="cat-more">Ver detalhe</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <>
          <div className="overlay" onClick={close} aria-hidden />
          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            ref={panelRef}
            tabIndex={-1}
          >
            <div className="drawer-head">
              <div>
                <p className="eyebrow eyebrow-center">{open.eyebrow}</p>
                <h2 id="drawer-title" style={{ fontSize: 'var(--t-26)', marginTop: 'var(--s-2)' }}>{open.name}</h2>
              </div>
              <button type="button" className="icon-btn" onClick={close} aria-label="Fechar detalhe">
                <Close />
              </button>
            </div>

            <div className="drawer-body">
              {/* sin proporcion fija: cada foto se ve inteira, sem bandas */}
              <div className="photo" style={{ background: 'var(--paper-2)' }}>
                <Image
                  src={open.gallery[shot].src}
                  alt={open.gallery[shot].alt}
                  width={open.gallery[shot].w}
                  height={open.gallery[shot].h}
                  sizes="(max-width: 560px) 92vw, 520px"
                  style={{ width: '100%', height: 'auto', maxHeight: '46vh', objectFit: 'contain' }}
                />
              </div>

              {open.gallery.length > 1 && (
                <div className="thumbs" role="group" aria-label="Outras fotos desta categoria">
                  {open.gallery.map((g, i) => (
                    <button
                      key={g.src}
                      type="button"
                      className="thumb"
                      aria-pressed={shot === i}
                      aria-label={`Ver foto ${i + 1} de ${open.gallery.length}`}
                      onClick={() => setShot(i)}
                    >
                      <Image src={g.src} alt="" width={120} height={120} sizes="120px" />
                    </button>
                  ))}
                </div>
              )}

              <p style={{ color: 'var(--text-soft)', lineHeight: 1.65 }}>{open.detail}</p>

              <div>
                <h3 style={{ fontSize: 'var(--t-16)', marginBottom: 'var(--s-3)' }}>O que personalizamos</h3>
                <ul className="spec-list">
                  {open.highlights.map((h) => (
                    <li className="spec" key={h}><Check size={15} />{h}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: 'var(--t-16)', marginBottom: 'var(--s-3)' }}>Papéis disponíveis</h3>
                <div className="opt-row">
                  {open.materials.map((m) => <span className="badge" key={m}>{m}</span>)}
                </div>
              </div>

              <p className="summary-note">
                <strong className="num">Desde {eur(open.priceFrom)}.</strong> O valor final depende do tamanho, do papel e
                do detalhe do recorte. Confirmamos o orçamento antes de produzires seja o que for. Produção em {site.productionDays}.
              </p>
            </div>

            <div className="drawer-foot">
              <button type="button" className="btn btn-primary btn-block" onClick={() => personalizar(open)}>
                Personalizar este modelo <ArrowRight />
              </button>
              <a
                className="btn btn-ghost btn-block"
                href={wa(`Olá! Vi a categoria "${open.name}" no site e queria um orçamento.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={17} /> Perguntar no WhatsApp
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
