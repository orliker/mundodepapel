'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { site, wa } from '@/lib/site'
import { bestMatch, rank, THRESHOLD, extractAge, polarity, looksLikeQuestion } from '@/lib/bot/engine'
import { INTENTS, OPENING_CHIPS, FALLBACK } from '@/lib/bot/knowledge'
import { FLOW_STEPS, isSkip, isCancel, detectOccasion, orderLink, summaryLines, type Slots } from '@/lib/bot/flow'
import { ChatIcon, Close, Send, WhatsAppIcon, Sparkle, ArrowRight } from './icons'

type Cta = 'whatsapp' | 'configurator' | 'categories' | 'gallery' | 'faq' | 'order'

interface Msg {
  id: number
  role: 'bot' | 'user'
  text: string
  chips?: string[]
  cta?: Cta
  summary?: Slots
}

const HELLO: Msg = {
  id: 0,
  role: 'bot',
  text:
    'Olá! Sou o assistente da Mundo de Papel Portugal.\n\nRespondo a perguntas sobre preços, prazos, papéis e envios, e posso montar já a tua encomenda. Em que posso ajudar?',
  chips: OPENING_CHIPS,
}

let uid = 1

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([HELLO])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [flowStep, setFlowStep] = useState<number | null>(null)
  const [slots, setSlots] = useState<Slots>({})

  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [msgs, typing])

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const push = useCallback((m: Omit<Msg, 'id'>) => {
    setMsgs((prev) => [...prev, { ...m, id: uid++ }])
  }, [])

  /** Responde con un retardo corto: se lee mejor que una respuesta instantanea. */
  const reply = useCallback((m: Omit<Msg, 'id' | 'role'>) => {
    setTyping(true)
    const t = window.setTimeout(() => {
      setTyping(false)
      push({ role: 'bot', ...m })
    }, 340)
    timers.current.push(t)
  }, [push])

  const startFlow = useCallback(() => {
    setSlots({})
    setFlowStep(0)
    reply({ text: FLOW_STEPS[0].question, chips: FLOW_STEPS[0].chips })
  }, [reply])

  const advanceFlow = useCallback((step: number, next: Slots) => {
    const following = step + 1
    if (following < FLOW_STEPS.length) {
      setFlowStep(following)
      reply({ text: FLOW_STEPS[following].question, chips: FLOW_STEPS[following].chips })
      return
    }
    setFlowStep(null)
    reply({
      text:
        'Perfeito, é tudo o que preciso. Este é o teu pedido:\n\nCarrega no botão e abre o WhatsApp com a mensagem já escrita. Podes rever e alterar antes de enviar.',
      summary: next,
      cta: 'order',
    })
  }, [reply])

  const handle = useCallback((raw: string) => {
    const text = raw.trim()
    if (!text) return

    push({ role: 'user', text })
    setInput('')

    // 1. dentro del guion de encomenda
    if (flowStep !== null) {
      const step = FLOW_STEPS[flowStep]

      // nadie queda preso dentro del cuestionario
      if (isCancel(text)) {
        setFlowStep(null)
        reply({
          text: 'Sem problema, ficamos por aqui. Se quiseres perguntar outra coisa, é só escrever.',
          chips: OPENING_CHIPS,
        })
        return
      }

      // una pregunta clara (o un cumprimento) interrumpe: responde-se e retoma-se
      const question = bestMatch(text, INTENTS)
      const social = !!question && ['thanks', 'bye', 'greeting'].includes(question.intent.id)
      const asking = !!question && looksLikeQuestion(text) && question.score >= THRESHOLD
      if (question && (social || asking) && question.intent.id !== 'start_order') {
        reply({ text: question.intent.answer, cta: question.intent.cta })
        const t = window.setTimeout(() => {
          push({ role: 'bot', text: `Voltando ao pedido: ${step.question}`, chips: step.chips })
        }, 900)
        timers.current.push(t)
        return
      }

      const value = isSkip(text) ? '' : text
      const next: Slots = { ...slots, [step.id]: value }

      // "8 anos" tambien se guarda con el nombre
      if (step.id === 'name' && value) {
        const age = extractAge(value)
        if (age && !/\d/.test(value.replace(/\d+\s*(anos|meses)/gi, ''))) next.name = value
      }

      setSlots(next)
      advanceFlow(flowStep, next)
      return
    }

    // 2. conversacion normal
    const match = bestMatch(text, INTENTS)

    if (match?.intent.id === 'start_order') {
      // si a frase ja diz a ocasiao ("quero um topo para batizado"), nao se repergunta
      const known = detectOccasion(text)
      reply({ text: match.intent.answer })
      const t = window.setTimeout(() => {
        const from = known ? 1 : 0
        setSlots(known ? { occasion: known } : {})
        setFlowStep(from)
        setMsgs((prev) => [
          ...prev,
          {
            id: uid++,
            role: 'bot',
            text: known ? `Fica anotado: ${known}. ${FLOW_STEPS[1].question}` : FLOW_STEPS[0].question,
            chips: FLOW_STEPS[from].chips,
          },
        ])
      }, 700)
      timers.current.push(t)
      return
    }

    if (match) {
      reply({ text: match.intent.answer, chips: match.intent.chips, cta: match.intent.cta })
      return
    }

    // 3. nada encaja: si hay un segundo candidato cercano, se ofrece
    const [near] = rank(text, INTENTS)
    const yesNo = polarity(text)
    if (yesNo === 'yes') {
      startFlow()
      return
    }
    if (near && near.score >= THRESHOLD - 0.9) {
      reply({
        text: `Não tenho a certeza de ter percebido. Querias saber sobre isto?\n\n${near.intent.answer}`,
        chips: FALLBACK.chips,
      })
      return
    }
    reply({ text: FALLBACK.answer, chips: FALLBACK.chips, cta: 'whatsapp' })
  }, [flowStep, slots, push, reply, advanceFlow, startFlow])

  const goTo = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const renderCta = (m: Msg) => {
    if (!m.cta) return null
    if (m.cta === 'order') {
      return (
        <a className="btn btn-wa btn-block btn-sm" href={orderLink(m.summary ?? slots)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={16} /> Abrir WhatsApp com o pedido
        </a>
      )
    }
    if (m.cta === 'whatsapp') {
      return (
        <a
          className="btn btn-wa btn-block btn-sm"
          href={wa('Olá! Vim do site e tenho uma questão sobre topos de bolo personalizados.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={16} /> Falar no WhatsApp
        </a>
      )
    }
    const targets: Record<string, [string, string]> = {
      configurator: ['personalizar', 'Abrir o configurador'],
      categories: ['categorias', 'Ver as categorias'],
      gallery: ['trabalhos', 'Ver trabalhos'],
      faq: ['perguntas', 'Ver perguntas frequentes'],
    }
    const t = targets[m.cta]
    if (!t) return null
    return (
      <button type="button" className="btn btn-quiet btn-block btn-sm" onClick={() => goTo(t[0])}>
        {t[1]} <ArrowRight size={15} />
      </button>
    )
  }

  return (
    <>
      {!open && (
        <button type="button" className="fab" onClick={() => setOpen(true)} aria-expanded={false} aria-controls="assistente">
          <ChatIcon size={19} />
          Tirar uma dúvida
        </button>
      )}

      {open && (
        <div className="chat" id="assistente" role="dialog" aria-label="Assistente da Mundo de Papel">
          <div className="chat-head">
            <Image src="/images/logo-mundo-de-papel.webp" alt="" width={36} height={36} />
            <div>
              <div className="chat-title">Assistente Mundo de Papel</div>
              <div className="chat-status"><span className="chat-dot" aria-hidden />Respostas automáticas</div>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Fechar assistente">
              <Close size={18} />
            </button>
          </div>

          <div className="chat-log" ref={logRef} role="log" aria-live="polite" aria-atomic="false">
            {msgs.map((m) => (
              <div key={m.id} style={{ display: 'contents' }}>
                <div className={`msg ${m.role === 'bot' ? 'msg-bot' : 'msg-user'}`}>{m.text}</div>

                {m.summary && (
                  <div className="chat-summary msg-bot" style={{ alignSelf: 'flex-start', maxWidth: '86%' }}>
                    <strong>Resumo</strong>
                    <dl>
                      {summaryLines(m.summary).map(([k, v]) => (
                        <div key={k} style={{ display: 'contents' }}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {m.cta && (
                  <div style={{ alignSelf: 'flex-start', maxWidth: '86%', width: '100%' }}>{renderCta(m)}</div>
                )}
              </div>
            ))}

            {typing && (
              <div className="msg msg-bot" aria-hidden>
                <Sparkle size={13} /> a escrever…
              </div>
            )}
          </div>

          {!typing && msgs.length > 0 && msgs[msgs.length - 1].chips && (
            <div className="chat-chips">
              {msgs[msgs.length - 1].chips!.map((c) => (
                <button key={c} type="button" className="chat-chip" onClick={() => handle(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat-form"
            onSubmit={(e) => { e.preventDefault(); handle(input) }}
          >
            <label className="visually-hidden" htmlFor="chat-input">Escreve a tua pergunta</label>
            <input
              id="chat-input"
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreve a tua pergunta…"
              autoComplete="off"
              maxLength={300}
            />
            <button type="submit" className="chat-send" disabled={!input.trim()} aria-label="Enviar">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
