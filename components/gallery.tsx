'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GALLERY } from '@/lib/content'
import { Close } from './icons'

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setIndex(null)
    openerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (index === null) return
    document.body.style.overflow = 'hidden'
    boxRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') setIndex((i) => (i === null ? i : (i + 1) % GALLERY.length))
      if (e.key === 'ArrowLeft') setIndex((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length))
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, close])

  const photo = index === null ? null : GALLERY[index]

  return (
    <>
      <ul className="gallery">
        {GALLERY.map((p, i) => (
          <li key={p.src} style={{ display: 'contents' }}>
            <button
              type="button"
              className="gallery-item"
              onClick={(e) => { openerRef.current = e.currentTarget; setIndex(i) }}
              aria-label={`Ver maior: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 260px"
                loading="lazy"
              />
              <span className="gallery-cap" aria-hidden>Ver maior</span>
            </button>
          </li>
        ))}
      </ul>

      {photo && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          onClick={close}
          ref={boxRef}
          tabIndex={-1}
        >
          <button type="button" className="lightbox-close" onClick={close} aria-label="Fechar">
            <Close size={22} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              sizes="(max-width: 900px) 92vw, 820px"
              style={{ width: 'auto', height: 'auto', maxHeight: '78vh', maxWidth: '100%' }}
            />
            <figcaption className="lightbox-cap">{photo.alt}</figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
