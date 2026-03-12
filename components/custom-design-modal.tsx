'use client'

import { useState, useRef } from 'react'
import { X, Upload, Sparkles, Loader2, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Material } from '@/lib/data'

interface CustomDesignModalProps {
  open: boolean
  onClose: () => void
}

type Step = 'upload' | 'details' | 'contact' | 'preview' | 'success'

const SELLER_WHATSAPP = '351000000000' // <- troca pelo número real da loja

const MATERIALS: { value: Material; label: string; desc: string }[] = [
  { value: 'papel-couche-250g', label: 'Papel couché 250g', desc: 'Acabamento de alta qualidade, elegante e resistente' },
  { value: 'papel-glitter', label: 'Papel glitter', desc: 'Ideal para um efeito brilhante e festivo' },
  { value: 'papel-texturizado', label: 'Papel texturizado', desc: 'Papéis especiais com textura e acabamento premium' },
  { value: 'papel-decorativo', label: 'Papel decorativo', desc: 'Outras opções de papelaria sob consulta' },
]

export function CustomDesignModal({ open, onClose }: CustomDesignModalProps) {
  const [step, setStep] = useState<Step>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [aiVariants, setAiVariants] = useState<string[]>([])
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [orderId] = useState(() => `CO-${Math.floor(10000 + Math.random() * 90000)}`)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    height: '',
    width: '',
    depth: '',
    diameter: '',
    quantity: '1',
    material: 'papel-couche-250g' as Material,
    notes: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    gdprConsent: false,
    whatsappConsent: false,
  })

  if (!open) return null

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)|application\/pdf/)) return
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const getMaterialLabel = (value: Material) =>
    MATERIALS.find((m) => m.value === value)?.label ?? value

  const generateVariants = async () => {
    setGenerating(true)

    try {
      const measureText = form.diameter
        ? `diâmetro de ${form.diameter}cm`
        : `${form.height || '?'}×${form.width || '?'}cm${form.depth ? ` com profundidade de ${form.depth}cm` : ''}`

      const materialLabel = getMaterialLabel(form.material)
      const noteText = form.notes?.trim() || 'sem notas adicionais'

      const variants = [
        `Variante Clássica Elegante: composição equilibrada, tipografia delicada e acabamento sofisticado em ${materialLabel}. Ideal para um visual intemporal. Medidas previstas: ${measureText}.`,
        `Variante Moderna Minimalista: design limpo, elegante e focado no nome e nos detalhes personalizados. Excelente para um topo moderno em ${materialLabel}. Medidas previstas: ${measureText}.`,
        `Variante Decorativa Personalizada: proposta com mais elementos visuais e acabamento criativo, pensada com base nas notas do cliente (${noteText}). Desenvolvida em ${materialLabel}.`,
      ]

      await new Promise((r) => setTimeout(r, 900))
      setAiVariants(variants)
    } catch {
      setAiVariants([
        'Variante Clássica Elegante: composição equilibrada, tipografia delicada e acabamento sofisticado.',
        'Variante Moderna Minimalista: design limpo, elegante e com foco no nome e nos detalhes personalizados.',
        'Variante Decorativa Personalizada: opção criativa com mais elementos visuais e acabamento premium.',
      ])
    } finally {
      setGenerating(false)
      setStep('preview')
    }
  }

  const buildWhatsAppMessage = () => {
    const selectedVariantText =
      selectedVariant !== null ? `Variante ${selectedVariant + 1}` : 'Ainda sem variante selecionada'

    const base = `Olá! Gostaria de pedir um orçamento para um topo personalizado.

Pedido: ${orderId}
Cliente: ${form.name}
WhatsApp do cliente: ${form.phone}
Email: ${form.email || 'Não indicado'}

Medidas:
- Altura: ${form.height || 'Não indicado'} cm
- Largura: ${form.width || 'Não indicado'} cm
- Profundidade: ${form.depth || 'Não indicado'} cm
- Diâmetro: ${form.diameter || 'Não indicado'} cm

Quantidade: ${form.quantity || '1'}
Tipo de papel: ${getMaterialLabel(form.material)}
Variante escolhida: ${selectedVariantText}
Notas: ${form.notes || 'Sem notas adicionais'}

Preço: orçamento final enviado pela loja via WhatsApp.
Valores desde 7,99€.
`

    return encodeURIComponent(base)
  }

  const handleSubmit = async () => {
    if (!form.gdprConsent) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    setStep('success')
  }

  const steps: Step[] = ['upload', 'details', 'contact', 'preview', 'success']
  const stepIdx = steps.indexOf(step)
  const progress = (stepIdx / (steps.length - 1)) * 100

  const stepLabels = ['Imagem', 'Detalhes', 'Contacto', 'Variantes', 'Confirmação']

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(32,28,23,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-[var(--cream)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
        <div className="bg-[var(--charcoal)] text-[var(--cream)] px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2
              className="text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Design Personalizado
            </h2>
            <p className="text-xs text-[var(--cream)]/60 font-[var(--font-body)] mt-0.5">
              Sugestões automáticas • orçamento final via WhatsApp
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors">
            <X size={20} />
          </button>
        </div>

        {step !== 'success' && (
          <div className="shrink-0 px-6 py-3 border-b border-[var(--border)] bg-[var(--cream)]">
            <div className="flex justify-between mb-1.5">
              {stepLabels.slice(0, 4).map((l, i) => (
                <span
                  key={l}
                  className={cn(
                    'text-[9px] tracking-widest uppercase font-[var(--font-body)]',
                    i <= stepIdx ? 'text-[var(--charcoal)]' : 'text-[var(--charcoal-light)]/40'
                  )}
                >
                  {l}
                </span>
              ))}
            </div>
            <div className="h-0.5 bg-[var(--border)]">
              <div
                className="h-full bg-[var(--gold)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 'upload' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Mostra-nos a tua inspiração
                </h3>
                <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                  Carrega uma imagem de referência (jpg, png, pdf). Com base nela, geramos sugestões para o teu topo.
                </p>
              </div>

              <div
                className={cn(
                  'border-2 border-dashed rounded-none p-10 text-center cursor-pointer transition-colors',
                  dragOver ? 'border-[var(--gold)] bg-[var(--gold-light)]' : 'border-[var(--border)] hover:border-[var(--charcoal)]'
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Zona de upload de imagem"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Pré-visualização da imagem carregada"
                      className="max-h-48 mx-auto object-contain"
                    />
                    <p className="text-xs text-[var(--charcoal-light)] mt-3 font-[var(--font-body)]">
                      Clica para substituir
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[var(--charcoal-light)]">
                    <Upload size={32} className="opacity-40" />
                    <div>
                      <p className="text-sm font-medium font-[var(--font-body)]">Arrasta ou clica para carregar</p>
                      <p className="text-xs mt-1 font-[var(--font-body)]">JPG, PNG, PDF — máx. 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep('details')}
                className={cn(
                  'w-full py-4 text-sm font-bold tracking-widest uppercase font-[var(--font-body)] transition-colors',
                  imagePreview
                    ? 'bg-[var(--charcoal)] text-[var(--cream)] hover:bg-[var(--gold)] hover:text-[var(--charcoal)]'
                    : 'bg-[var(--border)] text-[var(--charcoal-light)] cursor-not-allowed'
                )}
                disabled={!imagePreview}
              >
                Continuar
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Especificações do topo
                </h3>
                <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                  Preenche as medidas e preferências do teu pedido.
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--charcoal-light)] mb-3 font-[var(--font-body)]">
                  Medidas (cm)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'height', label: 'Alto *' },
                    { key: 'width', label: 'Largo *' },
                    { key: 'depth', label: 'Profundidade' },
                    { key: 'diameter', label: 'Diâmetro (Ø)' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs text-[var(--charcoal-light)] mb-1 font-[var(--font-body)]">{label}</label>
                      <input
                        type="number"
                        min="1"
                        value={form[key as keyof typeof form] as string}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm text-[var(--charcoal)] outline-none focus:border-[var(--charcoal)] transition-colors font-[var(--font-body)]"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[var(--charcoal-light)] mb-1 font-[var(--font-body)]">Quantidade *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="w-full border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm text-[var(--charcoal)] outline-none focus:border-[var(--charcoal)] transition-colors font-[var(--font-body)]"
                  />
                </div>

                <p className="text-xs text-[var(--charcoal-light)] font-[var(--font-body)]">
                  Valores desde 7,99€. O orçamento final será enviado via WhatsApp conforme a personalização, tipo de papel e nível de detalhe.
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--charcoal-light)] mb-3 font-[var(--font-body)]">Tipo de papel *</p>
                <div className="grid grid-cols-2 gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setForm({ ...form, material: m.value })}
                      className={cn(
                        'text-left p-3 border transition-colors',
                        form.material === m.value
                          ? 'border-[var(--charcoal)] bg-[var(--charcoal)] text-[var(--cream)]'
                          : 'border-[var(--border)] hover:border-[var(--charcoal)]'
                      )}
                    >
                      <p className="text-sm font-semibold font-[var(--font-body)]">{m.label}</p>
                      <p
                        className={cn(
                          'text-xs mt-0.5 font-[var(--font-body)]',
                          form.material === m.value ? 'text-[var(--cream)]/70' : 'text-[var(--charcoal-light)]'
                        )}
                      >
                        {m.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-[var(--charcoal-light)] mb-2 font-[var(--font-body)]">
                  Notas adicionais
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ex: cores pastéis, fonte cursiva, tema específico, data, nome..."
                  className="w-full border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm text-[var(--charcoal)] outline-none focus:border-[var(--charcoal)] transition-colors resize-none font-[var(--font-body)] placeholder:text-[var(--charcoal-light)]/50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('upload')}
                  className="px-6 py-3 border border-[var(--border)] text-sm font-bold tracking-widest uppercase font-[var(--font-body)] hover:border-[var(--charcoal)] transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep('contact')}
                  disabled={!form.height || !form.width}
                  className={cn(
                    'flex-1 py-3 text-sm font-bold tracking-widest uppercase font-[var(--font-body)] transition-colors',
                    form.height && form.width
                      ? 'bg-[var(--charcoal)] text-[var(--cream)] hover:bg-[var(--gold)] hover:text-[var(--charcoal)]'
                      : 'bg-[var(--border)] text-[var(--charcoal-light)] cursor-not-allowed'
                  )}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Os teus dados
                </h3>
                <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                  Para enviarmos o pedido e o orçamento final via WhatsApp.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'name', label: 'Nome completo *', type: 'text', placeholder: 'Maria Silva' },
                  { key: 'phone', label: 'WhatsApp (com indicativo) *', type: 'tel', placeholder: '+351 9XX XXX XXX' },
                  { key: 'email', label: 'Email *', type: 'email', placeholder: 'nome@exemplo.com' },
                  { key: 'address', label: 'Morada (opcional)', type: 'text', placeholder: 'Para cálculo de envio' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-[var(--charcoal-light)] mb-1.5 font-[var(--font-body)]">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form] as string}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm text-[var(--charcoal)] outline-none focus:border-[var(--charcoal)] transition-colors font-[var(--font-body)] placeholder:text-[var(--charcoal-light)]/40"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3 p-4 bg-[var(--cream-dark)] border border-[var(--border)]">
                <p className="text-xs tracking-widest uppercase text-[var(--charcoal-light)] font-[var(--font-body)]">Consentimentos</p>

                {[
                  { key: 'gdprConsent', label: 'Autorizo o tratamento dos meus dados pessoais para processamento do pedido (obrigatório) *' },
                  { key: 'whatsappConsent', label: 'Autorizo o contacto por WhatsApp para envio de orçamento e confirmação da encomenda' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key as keyof typeof form] as boolean}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="mt-0.5 accent-[var(--charcoal)]"
                    />
                    <span className="text-xs text-[var(--charcoal-light)] font-[var(--font-body)] leading-relaxed">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="px-6 py-3 border border-[var(--border)] text-sm font-bold tracking-widest uppercase font-[var(--font-body)] hover:border-[var(--charcoal)] transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={generateVariants}
                  disabled={!form.name || !form.phone || !form.email || !form.gdprConsent || generating}
                  className={cn(
                    'flex-1 py-3 text-sm font-bold tracking-widest uppercase font-[var(--font-body)] transition-colors flex items-center justify-center gap-2',
                    form.name && form.phone && form.email && form.gdprConsent && !generating
                      ? 'bg-[var(--charcoal)] text-[var(--cream)] hover:bg-[var(--gold)] hover:text-[var(--charcoal)]'
                      : 'bg-[var(--border)] text-[var(--charcoal-light)] cursor-not-allowed'
                  )}
                >
                  {generating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      A gerar sugestões…
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Ver Sugestões
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Sugestões para o teu topo
                </h3>
                <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                  Escolhe a opção que preferes para enviar junto com o pedido.
                </p>
              </div>

              <div className="space-y-3">
                {aiVariants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={cn(
                      'w-full text-left p-4 border transition-all',
                      selectedVariant === i
                        ? 'border-[var(--charcoal)] bg-[var(--charcoal)] text-[var(--cream)]'
                        : 'border-[var(--border)] hover:border-[var(--charcoal)]'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-6 h-6 border-2 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                          selectedVariant === i ? 'border-[var(--gold)] bg-[var(--gold)]' : 'border-[var(--border)]'
                        )}
                      >
                        {selectedVariant === i && <div className="w-2 h-2 bg-[var(--charcoal)] rounded-full" />}
                      </div>
                      <div>
                        <p
                          className="text-xs tracking-widest uppercase mb-1 font-[var(--font-body)]"
                          style={{ color: selectedVariant === i ? 'var(--gold)' : 'var(--charcoal-light)' }}
                        >
                          Variante {i + 1}
                        </p>
                        <p className={cn('text-sm leading-relaxed font-[var(--font-body)]', selectedVariant === i ? 'text-[var(--cream)]' : 'text-[var(--charcoal)]')}>
                          {v}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[var(--gold-light)] border border-[var(--gold)]/30 flex gap-3">
                <AlertCircle size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--charcoal)] font-[var(--font-body)] leading-relaxed">
                  O orçamento final será enviado diretamente pela loja via WhatsApp, conforme o nível de detalhe, tipo de papel e personalização do trabalho.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('contact')}
                  className="px-6 py-3 border border-[var(--border)] text-sm font-bold tracking-widest uppercase font-[var(--font-body)] hover:border-[var(--charcoal)] transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 text-sm font-bold tracking-widest uppercase font-[var(--font-body)] bg-[var(--charcoal)] text-[var(--cream)] hover:bg-[var(--gold)] hover:text-[var(--charcoal)] transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      A preparar pedido…
                    </>
                  ) : (
                    'Enviar para WhatsApp'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[var(--gold-light)] border border-[var(--gold)] rounded-full flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-[var(--gold)]" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Pedido Preparado!
                </h3>
                <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                  Pedido <strong className="text-[var(--charcoal)]">{orderId}</strong> pronto para envio por WhatsApp.
                </p>
              </div>

              <div className="bg-[var(--cream-dark)] border border-[var(--border)] p-5 text-left space-y-2">
                <p className="text-xs tracking-widest uppercase text-[var(--charcoal-light)] font-[var(--font-body)] mb-3">Resumo</p>
                {[
                  ['Pedido', orderId],
                  ['Cliente', form.name],
                  ['Tipo de papel', getMaterialLabel(form.material)],
                  ['Medidas', form.diameter ? `Ø ${form.diameter}cm` : `${form.height}×${form.width}cm`],
                  ['Quantidade', form.quantity],
                  ['Variante', selectedVariant !== null ? `#${selectedVariant + 1}` : 'Sem variante definida'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm font-[var(--font-body)]">
                    <span className="text-[var(--charcoal-light)]">{k}</span>
                    <span className="text-[var(--charcoal)] font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-[var(--charcoal-light)] font-[var(--font-body)]">
                  O valor final será confirmado pela loja via WhatsApp. Valores desde 7,99€.
                </p>

                <a
                  href={`https://wa.me/${SELLER_WHATSAPP}?text=${buildWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[var(--whatsapp)] text-[var(--whatsapp-fg)] py-3.5 text-sm font-bold tracking-widest uppercase font-[var(--font-body)] hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={15} />
                  Pedir orçamento no WhatsApp
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-3 border border-[var(--border)] text-sm font-bold tracking-widest uppercase font-[var(--font-body)] hover:border-[var(--charcoal)] transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}