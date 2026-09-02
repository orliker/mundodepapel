'use client'

import { useEffect, useMemo, useState } from 'react'
import { site, wa, eur } from '@/lib/site'
import { MATERIALS, SIZES, PALETTES, OCCASIONS } from '@/lib/content'
import { ArrowRight, Check, WhatsAppIcon, Sparkle } from './icons'

interface Draft {
  occasion: string
  name: string
  age: string
  theme: string
  colors: string
  size: string
  material: string
  notes: string
}

const EMPTY: Draft = {
  occasion: '',
  name: '',
  age: '',
  theme: '',
  colors: '',
  size: 'Médio',
  material: 'Papel couché 250g',
  notes: '',
}

const THEMES = ['Princesas', 'Super-heróis', 'Unicórnios', 'Dinossauros', 'Flores', 'Futebol', 'Minimalista', 'Boho']

const STEPS = ['Ocasião', 'Nome', 'Tema', 'Formato', 'Notas'] as const

export function Configurator({ preset }: { preset?: string }) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>({ ...EMPTY, occasion: preset ?? '' })
  const [items, setItems] = useState<Draft[]>([])
  const [added, setAdded] = useState<string | null>(null)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  // el panel de categorias avisa por evento cual fue elegida
  useEffect(() => {
    const onPreset = (e: Event) => {
      const occasion = (e as CustomEvent<string>).detail
      if (!occasion) return
      setDraft((d) => ({ ...d, occasion }))
      setStep(1)
    }
    window.addEventListener('mdp:preset', onPreset)
    return () => window.removeEventListener('mdp:preset', onPreset)
  }, [])

  const canAdvance = step !== 0 || draft.occasion !== ''
  const hasDraft = draft.occasion !== '' || draft.name !== '' || draft.theme !== ''

  const describe = (d: Draft) => {
    const bits = [d.name && `“${d.name}”`, d.age, d.theme, d.colors, d.size, d.material].filter(Boolean)
    return bits.join(' · ')
  }

  const message = useMemo(() => {
    const all = hasDraft ? [...items, draft] : items
    const lines: string[] = ['Olá! Vim do site e queria encomendar:', '']

    all.forEach((d, i) => {
      if (all.length > 1) lines.push(`— Topo ${i + 1} —`)
      lines.push(`Ocasião: ${d.occasion || '(a combinar)'}`)
      if (d.name) lines.push(`Nome: ${d.name}`)
      if (d.age) lines.push(`Idade: ${d.age}`)
      if (d.theme) lines.push(`Tema: ${d.theme}`)
      if (d.colors) lines.push(`Cores: ${d.colors}`)
      lines.push(`Tamanho: ${d.size}`)
      lines.push(`Papel: ${d.material}`)
      if (d.notes) lines.push(`Notas: ${d.notes}`)
      lines.push('')
    })

    lines.push(
      `Sei que os topos começam em ${site.priceFromLabel} e que a produção leva ${site.productionDays}.`,
      'Podem confirmar o orçamento, os portes e o prazo? Obrigado!',
    )
    return lines.join('\n')
  }, [items, draft, hasDraft])

  const addAnother = () => {
    if (!hasDraft) return
    setItems((prev) => [...prev, draft])
    setAdded(draft.occasion || 'Topo')
    setDraft({ ...EMPTY })
    setStep(0)
    window.setTimeout(() => setAdded(null), 4000)
  }

  const totalItems = items.length + (hasDraft ? 1 : 0)

  return (
    <div className="cfg">
      <div className="card cfg-panel">
        <div className="cfg-progress">
          <span className="cfg-progress-label num">
            Passo {step + 1} de {STEPS.length}
          </span>
          <span className="cfg-progress-track">
            <span className="cfg-progress-bar" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </span>
          <span className="cfg-progress-label">{STEPS[step]}</span>
        </div>

        <div aria-live="polite">
          {step === 0 && (
            <section aria-labelledby="cfg-t0">
              <h3 className="cfg-step-title" id="cfg-t0">Para que ocasião é?</h3>
              <p className="cfg-step-help">Escolhe uma. É a única coisa que precisamos mesmo de saber para começar.</p>
              <div className="opt-row" role="group" aria-labelledby="cfg-t0">
                {OCCASIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className="chip"
                    aria-pressed={draft.occasion === o}
                    onClick={() => { set('occasion', o); setStep(1) }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="cfg-t1">
              <h3 className="cfg-step-title" id="cfg-t1">Que nome vai no topo?</h3>
              <p className="cfg-step-help">Escreve exactamente como queres que apareça, com acentos e maiúsculas.</p>

              <label className="field">
                <span className="field-label">Nome (opcional)</span>
                <input
                  className="input"
                  value={draft.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Ex.: Mariana"
                  autoComplete="off"
                  maxLength={40}
                />
              </label>

              <label className="field">
                <span className="field-label">Idade ou data (opcional)</span>
                <input
                  className="input"
                  value={draft.age}
                  onChange={(e) => set('age', e.target.value)}
                  placeholder="Ex.: 8 anos, 25 anos casados, 3 meses"
                  autoComplete="off"
                  maxLength={40}
                />
              </label>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="cfg-t2">
              <h3 className="cfg-step-title" id="cfg-t2">Tema e cores</h3>
              <p className="cfg-step-help">Escolhe uma sugestão ou escreve a tua. Se não souberes ainda, avança: combinamos depois.</p>

              <span className="field-label" id="cfg-tema">Tema</span>
              <div className="opt-row" role="group" aria-labelledby="cfg-tema" style={{ marginBottom: 'var(--s-4)' }}>
                {THEMES.map((t) => (
                  <button key={t} type="button" className="chip" aria-pressed={draft.theme === t} onClick={() => set('theme', t)}>
                    {t}
                  </button>
                ))}
              </div>
              <label className="field">
                <span className="visually-hidden">Outro tema</span>
                <input
                  className="input"
                  value={draft.theme}
                  onChange={(e) => set('theme', e.target.value)}
                  placeholder="Ou escreve o tema (ex.: K-pop, Frozen, Benfica)"
                  maxLength={60}
                />
              </label>

              <span className="field-label" id="cfg-cores">Cores</span>
              <div className="opt-row" role="group" aria-labelledby="cfg-cores" style={{ marginBottom: 'var(--s-4)' }}>
                {PALETTES.map((p) => (
                  <button key={p.name} type="button" className="chip" aria-pressed={draft.colors === p.name} onClick={() => set('colors', p.name)}>
                    <span className="swatch" style={{ background: p.hex }} aria-hidden />
                    {p.name}
                  </button>
                ))}
              </div>
              <label className="field">
                <span className="visually-hidden">Outras cores</span>
                <input
                  className="input"
                  value={draft.colors}
                  onChange={(e) => set('colors', e.target.value)}
                  placeholder="Ou descreve as cores do bolo"
                  maxLength={60}
                />
              </label>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="cfg-t3">
              <h3 className="cfg-step-title" id="cfg-t3">Tamanho e papel</h3>
              <p className="cfg-step-help">O médio serve a maioria dos bolos de festa. O papel muda o acabamento e o preço final.</p>

              <span className="field-label" id="cfg-tam">Tamanho</span>
              <div className="size-grid" role="group" aria-labelledby="cfg-tam" style={{ marginBottom: 'var(--s-6)' }}>
                {SIZES.map((s) => (
                  <button key={s.id} type="button" className="size-card" aria-pressed={draft.size === s.name} onClick={() => set('size', s.name)}>
                    <span className="size-name">{s.name}</span>
                    <span className="size-dim num">{s.dim}</span>
                  </button>
                ))}
              </div>

              <span className="field-label" id="cfg-papel">Papel</span>
              <div className="opt-list" role="group" aria-labelledby="cfg-papel">
                {MATERIALS.map((m) => (
                  <button key={m.id} type="button" className="opt-card" aria-pressed={draft.material === m.name} onClick={() => set('material', m.name)}>
                    <span>
                      <span className="opt-card-title">{m.name}</span>
                      <br />
                      <span className="opt-card-desc">{m.desc}</span>
                    </span>
                    <span className="opt-check"><Check /></span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section aria-labelledby="cfg-t4">
              <h3 className="cfg-step-title" id="cfg-t4">Mais alguma coisa?</h3>
              <p className="cfg-step-help">Conta-nos o que for útil: a data da festa, uma frase, o que não pode faltar.</p>

              <label className="field">
                <span className="field-label">Notas (opcional)</span>
                <textarea
                  className="textarea"
                  value={draft.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Ex.: a festa é dia 14, o bolo é branco com dourado, queria o nome em letra manuscrita."
                  maxLength={600}
                />
                <span className="field-hint">
                  Tens uma foto de referência? Envia-a no WhatsApp a seguir: é o sítio onde conseguimos ver a imagem.
                </span>
              </label>
            </section>
          )}
        </div>

        <div className="cfg-nav">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Voltar
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canAdvance}
            >
              Continuar <ArrowRight />
            </button>
          ) : (
            <button type="button" className="btn btn-quiet btn-sm" onClick={addAnother} disabled={!hasDraft}>
              Adicionar outro topo
            </button>
          )}
        </div>
      </div>

      <aside className="card cfg-summary" aria-label="Resumo do pedido">
        <h3>O teu pedido</h3>

        {added && (
          <p className="summary-note" role="status">
            <Check size={14} /> {added} adicionado. Podes montar já o próximo.
          </p>
        )}

        {items.map((it, i) => (
          <div className="summary-row" key={i}>
            <span className="summary-key">Topo {i + 1}</span>
            <span className="summary-val">{it.occasion}<br /><span className="opt-card-desc">{describe(it)}</span></span>
          </div>
        ))}

        {items.length > 0 && <hr className="rule" style={{ margin: 'var(--s-4) 0' }} />}

        <div className="summary-row">
          <span className="summary-key">Ocasião</span>
          <span className={`summary-val${draft.occasion ? '' : ' summary-empty'}`}>{draft.occasion || 'por escolher'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-key">Nome</span>
          <span className={`summary-val${draft.name ? '' : ' summary-empty'}`}>{draft.name || 'sem nome'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-key">Tema e cores</span>
          <span className={`summary-val${draft.theme || draft.colors ? '' : ' summary-empty'}`}>
            {[draft.theme, draft.colors].filter(Boolean).join(' · ') || 'a combinar'}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-key">Formato</span>
          <span className="summary-val">{draft.size} · {draft.material}</span>
        </div>

        <p className="summary-note">
          <strong>A partir de {eur(site.priceFrom)}</strong> por topo. O valor final depende do tamanho, do papel e do
          número de recortes, e é confirmado por nós antes de avançares. Não pagas nada aqui.
        </p>

        <a
          className="btn btn-wa btn-block"
          style={{ marginTop: 'var(--s-4)' }}
          href={wa(message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={totalItems === 0}
        >
          <WhatsAppIcon size={18} />
          {totalItems > 1 ? `Enviar ${totalItems} topos` : 'Enviar pedido no WhatsApp'}
        </a>

        <p className="field-hint" style={{ textAlign: 'center' }}>
          <Sparkle size={12} /> Abre o WhatsApp com o pedido já escrito. Podes rever antes de enviar.
        </p>
      </aside>
    </div>
  )
}
