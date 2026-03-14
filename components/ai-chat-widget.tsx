"use client"

import { useState, useRef, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  imagePreview?: string // base64 data URL for uploaded images
}

interface OrderData {
  event?: string
  name?: string
  age?: string
  theme?: string
  colors?: string
  size?: string
  material?: string
  notes?: string
  imageUrl?: string // base64 or hosted URL
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "351910000000"

const STAGE_QUICK_REPLIES: Record<number, string[]> = {
  0: ["Aniversário", "Casamento", "Batizado", "Dia da Mãe", "Dia dos Namorados", "Dia do Pai"],
  3: ["Princesas", "Dinossauros", "Flores", "Boho", "Minimalista", "Super-Heróis", "Unicórnios", "Balões"],
  5: ["10 cm", "12 cm", "15 cm", "20 cm"],
  6: ["Cartão Premium", "Acrílico", "Papel Glitter", "Madeira"],
}

const COLOR_OPTIONS = [
  { label: "Rosa & Dourado", hex: "#f9a8d4" },
  { label: "Azul & Branco", hex: "#93c5fd" },
  { label: "Verde & Bege", hex: "#86efac" },
  { label: "Preto & Dourado", hex: "#1f2937" },
  { label: "Lilás & Prata", hex: "#c4b5fd" },
  { label: "Pastel", hex: "#fde68a" },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SparkleIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    <path d="M19 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" opacity={0.6} />
  </svg>
)

const SendIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CloseIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const UploadIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
)

const ImageIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const CheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ─── Typing Dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#93c5fd",
          display: "inline-block",
          animation: `typingBounce 1.3s ease ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ─── Color Picker Strip ───────────────────────────────────────────────────────
function ColorPicker({ onSelect }: { onSelect: (label: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, padding: "4px 0" }}>
      {COLOR_OPTIONS.map(({ label, hex }) => (
        <button
          key={label}
          title={label}
          onClick={() => { setSelected(label); onSelect(label) }}
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: hex,
            border: selected === label ? "2.5px solid #1e3a5f" : "2px solid rgba(0,0,0,0.12)",
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.15s",
            transform: selected === label ? "scale(1.18)" : "scale(1)",
            flexShrink: 0,
          }}
        >
          {selected === label && (
            <span style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center", color: hex === "#1f2937" ? "#fff" : "#1e3a5f",
            }}>
              <CheckIcon />
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Image Upload Zone ────────────────────────────────────────────────────────
function ImageUploadZone({ onUpload }: { onUpload: (dataUrl: string, fileName: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === "string") onUpload(result, file.name)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f) }}
      style={{
        border: `2px dashed ${dragging ? "#2563eb" : "#bfdbfe"}`,
        borderRadius: 12,
        padding: "16px 12px",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "#dbeafe" : "#f0f7ff",
        transition: "all 0.2s",
        userSelect: "none",
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }}
      />
      <div style={{ color: "#2563eb", marginBottom: 5, display: "flex", justifyContent: "center" }}>
        <UploadIcon />
      </div>
      <div style={{ fontSize: 12.5, color: "#1e3a5f", fontWeight: 600 }}>
        {dragging ? "Soltar imagem aqui" : "Clica ou arrasta uma imagem"}
      </div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>PNG, JPG até 5MB</div>
    </div>
  )
}

// ─── Order Summary Card ───────────────────────────────────────────────────────
function OrderSummaryCard({ order, imagePreview }: { order: OrderData; imagePreview?: string }) {
  const rows = [
    { label: "Evento", value: order.event },
    { label: "Nome", value: order.name },
    { label: "Idade", value: order.age },
    { label: "Tema", value: order.theme },
    { label: "Cores", value: order.colors },
    { label: "Tamanho", value: order.size },
    { label: "Material", value: order.material },
    { label: "Notas", value: order.notes },
  ].filter((r) => r.value)

  return (
    <div style={{
      background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)",
      border: "1.5px solid #bfdbfe",
      borderRadius: 14,
      padding: "12px 14px",
      margin: "6px 0",
      boxShadow: "0 2px 8px rgba(30,58,95,0.07)",
    }}>
      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
        <SparkleIcon />
        Resumo do Pedido
      </div>

      {imagePreview && (
        <div style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden", border: "1.5px solid #bfdbfe" }}>
          <img
            src={imagePreview}
            alt="Imagem de referencia do pedido"
            style={{ width: "100%", maxHeight: 140, objectFit: "cover", display: "block" }}
          />
          <div style={{ fontSize: 10.5, color: "#64748b", padding: "4px 8px", display: "flex", alignItems: "center", gap: 4 }}>
            <ImageIcon /> Imagem de referencia incluida
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", gap: 8, fontSize: 12.5 }}>
            <span style={{ color: "#64748b", minWidth: 62, flexShrink: 0 }}>{label}:</span>
            <span style={{ color: "#1e3a5f", fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState(0)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [orderData, setOrderData] = useState<OrderData>({})

  const [messages, setMessages] = useState<Message[]>([{
    id: "init",
    role: "assistant",
    content: "Olá! Sou o Robertinho, a tua assistente da Mundo de Papel Portugal! ✨\n\nVou ajudar-te a criar o topo de bolo dos teus sonhos.\n\nPrimeiro, podes partilhar uma imagem de inspiração? (opcional) Ou diz-me logo qual é o tipo de evento!",
  }])

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  // Track stage → color picker and order summary display
  useEffect(() => {
    setShowColorPicker(stage === 4)
    if (stage >= 8) setShowOrderSummary(true)
  }, [stage])

  const addAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content }])
  }

  const sendMessage = useCallback(async (text: string, imageDataUrl?: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      imagePreview: imageDataUrl,
    }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    // Update order data based on current stage
    const nextStage = stage + 1
    setStage(nextStage)

    setOrderData((prev) => {
      const update: Partial<OrderData> = {}
      if (stage === 0) update.event = trimmed
      else if (stage === 1) update.name = trimmed
      else if (stage === 2) update.age = trimmed
      else if (stage === 3) update.theme = trimmed
      else if (stage === 4) update.colors = trimmed
      else if (stage === 5) update.size = trimmed
      else if (stage === 6) update.material = trimmed
      else if (stage === 7) update.notes = trimmed
      if (imageDataUrl) update.imageUrl = imageDataUrl
      return { ...prev, ...update }
    })

    try {
      const payload = {
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        ...(uploadedImage ? { imageBase64: uploadedImage } : {}),
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const reply: string = data.reply ?? "Desculpa, ocorreu um erro. Tenta outra vez!"

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: reply },
      ])

      if (nextStage >= 8) setShowOrderSummary(true)
    } catch (err) {
      console.error("[AIChatWidget] fetch error:", err)
      addAssistantMessage("Ocorreu um erro de ligação. Por favor tenta novamente ou contacta-nos diretamente via WhatsApp!")
    } finally {
      setLoading(false)
    }
  }, [messages, loading, stage, uploadedImage])

  const handleImageUpload = (dataUrl: string, fileName: string) => {
    setUploadedImage(dataUrl)
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Partilhei uma imagem de inspiração: ${fileName}`,
      imagePreview: dataUrl,
    }
    setMessages((prev) => [...prev, userMsg])
    setOrderData((prev) => ({ ...prev, imageUrl: dataUrl }))
    setTimeout(() => {
      addAssistantMessage("Que imagem bonita! Vou usar esta referência para criar o teu topo perfeito. 🎨\n\nAgora diz-me: qual é o tipo de evento?")
      setStage(0)
    }, 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const buildWhatsAppMessage = () => {
    const o = orderData
    const lines = [
      "Olá! Quero encomendar um topo de bolo personalizado.",
      "",
      "📋 *RESUMO DO PEDIDO*",
      `• Evento: ${o.event || "—"}`,
      `• Nome: ${o.name || "—"}`,
      `• Idade: ${o.age || "—"}`,
      `• Tema: ${o.theme || "—"}`,
      `• Cores: ${o.colors || "—"}`,
      `• Tamanho: ${o.size || "—"}`,
      `• Material: ${o.material || "—"}`,
      `• Notas: ${o.notes || "Sem notas adicionais"}`,
      o.imageUrl ? `• Imagem de referência: [imagem partilhada no chat]` : "",
      "",
      "Podem confirmar disponibilidade e orçamento? Obrigado/a! 🎂",
    ].filter((l) => l !== undefined)
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`
  }

  const quickReplies = STAGE_QUICK_REPLIES[stage] ?? []

  // ── Inline styles ─────────────────────────────────────────────────────────
  const isMobile = typeof window !== "undefined" && window.innerWidth < 480

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 160,
    right: 16,
    zIndex: 9998,
    width: Math.min(380, typeof window !== "undefined" ? window.innerWidth - 24 : 380),
    maxHeight: "calc(100dvh - 180px)",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    borderRadius: 22,
    boxShadow: "0 12px 48px rgba(30,58,95,0.2), 0 2px 8px rgba(30,58,95,0.08)",
    overflow: "hidden",
    border: "1.5px solid #bfdbfe",
    animation: "chatSlideUp 0.28s cubic-bezier(.22,1,.36,1) forwards",
  }

  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); opacity: 0.45; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes fabPulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
          70%  { box-shadow: 0 0 0 14px rgba(37,99,235,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
        }
        @keyframes fabSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .chat-fab { transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.2s ease; }
        .chat-fab:hover { transform: scale(1.1) !important; box-shadow: 0 8px 32px rgba(37,99,235,0.55) !important; }
        .chat-fab.pulse { animation: fabPulse 2s ease infinite; }
        .wa-fab { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .wa-fab:hover { transform: scale(1.1) !important; box-shadow: 0 8px 32px rgba(37,211,102,0.55) !important; }
        .fab-tooltip { opacity: 0; transition: opacity 0.18s ease; pointer-events: none; }
        div:hover > .fab-tooltip { opacity: 1; }
        .chip-btn { transition: all 0.15s ease; }
        .chip-btn:hover { background: #dbeafe !important; border-color: #2563eb !important; color: #1d4ed8 !important; }
        .send-btn:hover:not(:disabled) { background: #1d4ed8 !important; transform: scale(1.05); }
        .wa-order-btn:hover { background: #1da851 !important; transform: translateY(-1px); }
        .upload-img-btn:hover { background: #dbeafe !important; }
        .msg-bubble { animation: chatSlideUp 0.22s ease forwards; }
        @media (max-width: 480px) {
          .fab-tooltip { display: none !important; }
        }
      `}</style>

      {/* ── Fixed FAB Stack — bottom-right ───────────────────────────────── */}
      <div style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}>
        {/* AI Assistant FAB (top of stack) */}
        <div style={{ position: "relative" }}>
          {/* Tooltip label */}
          {!open && (
            <span className="fab-tooltip" style={{
              position: "absolute",
              right: "calc(100% + 10px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "#1e3a5f",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
              padding: "5px 10px",
              borderRadius: 8,
              pointerEvents: "none",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 14px rgba(30,58,95,0.25)",
            }}>
              Assistente IA
            </span>
          )}
          <button
            className={`chat-fab${showPulse && !open ? " pulse" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fechar assistente" : "Falar com o Robertinho"}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: open
                ? "#1e3a5f"
                : "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: open
                ? "0 6px 24px rgba(30,58,95,0.45)"
                : "0 6px 24px rgba(37,99,235,0.45), 0 2px 6px rgba(30,58,95,0.2)",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {open ? <CloseIcon /> : <SparkleIcon />}
            {/* Notification badge */}
            {!open && showPulse && (
              <span style={{
                position: "absolute",
                top: 2,
                right: 2,
                width: 17,
                height: 17,
                borderRadius: "50%",
                background: "#f59e0b",
                border: "2.5px solid #fff",
                fontSize: 9,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}>1</span>
            )}
          </button>
        </div>

        {/* WhatsApp FAB (bottom of stack) */}
        <div style={{ position: "relative" }}>
          <span className="fab-tooltip" style={{
            position: "absolute",
            right: "calc(100% + 10px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#128c3e",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            padding: "5px 10px",
            borderRadius: 8,
            pointerEvents: "none",
            letterSpacing: "0.01em",
            boxShadow: "0 4px 14px rgba(18,140,62,0.25)",
          }}>
            Encomendar no WhatsApp
          </span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20encomenda%20de%20topo%20de%20bolo%20personalizado.`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Encomendar no WhatsApp"
            className="wa-fab"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#25d366",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 24px rgba(37,211,102,0.45), 0 2px 6px rgba(18,140,62,0.2)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>

      {/* ── Chat Panel ────────────────────────────────────────────────────── */}
      {open && (
        <div style={panelStyle} role="dialog" aria-label="Assistente Robertinho — Mundo de Papel Portugal">

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 11,
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fbbf24",
              flexShrink: 0,
            }}>
              <SparkleIcon />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14.5, lineHeight: 1.2 }}>Robertinho</div>
              <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 11.5, marginTop: 2 }}>
                Assistente Mundo de Papel · Online
              </div>
            </div>

            {/* Status dot */}
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 0 3px rgba(74,222,128,0.3)",
              flexShrink: 0,
            }} />

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "#fff",
                width: 30,
                height: 30,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 2,
                flexShrink: 0,
              }}
              aria-label="Fechar chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Image upload banner (shows before any messages if no image yet) */}
          {!uploadedImage && stage < 1 && (
            <div style={{
              padding: "10px 14px",
              borderBottom: "1px solid #eff6ff",
              background: "#fafcff",
              flexShrink: 0,
            }}>
              <ImageUploadZone onUpload={handleImageUpload} />
            </div>
          )}

          {/* Uploaded image chip */}
          {uploadedImage && stage < 4 && (
            <div style={{
              padding: "7px 14px",
              borderBottom: "1px solid #eff6ff",
              background: "#f0f9ff",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}>
              <img
                src={uploadedImage}
                alt="Imagem de referencia carregada"
                style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "1.5px solid #bfdbfe", flexShrink: 0 }}
              />
              <div style={{ fontSize: 12, color: "#1e3a5f", fontWeight: 600, flex: 1 }}>Imagem de referencia adicionada</div>
              <button
                onClick={() => setUploadedImage(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                aria-label="Remover imagem"
              >
                ×
              </button>
            </div>
          )}

          {/* Messages area */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 14px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="msg-bubble"
                style={{
                  maxWidth: "85%",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {/* Image preview in message bubble */}
                {msg.imagePreview && (
                  <div style={{
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    overflow: "hidden",
                    border: "1.5px solid rgba(191,219,254,0.7)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>
                    <img
                      src={msg.imagePreview}
                      alt="Imagem de referencia do cliente"
                      style={{ width: "100%", maxHeight: 160, objectFit: "cover", display: "block" }}
                    />
                  </div>
                )}

                {/* Text bubble */}
                <div style={{
                  padding: "10px 13px",
                  borderRadius: msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : "#eff6ff",
                  color: msg.role === "user" ? "#fff" : "#1e3a5f",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  boxShadow: msg.role === "user"
                    ? "0 2px 8px rgba(37,99,235,0.22)"
                    : "0 1px 4px rgba(0,0,0,0.06)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{
                alignSelf: "flex-start",
                padding: "11px 16px",
                background: "#eff6ff",
                borderRadius: "16px 16px 16px 4px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                display: "inline-flex",
              }}>
                <TypingDots />
              </div>
            )}

            {/* Order summary card */}
            {showOrderSummary && Object.keys(orderData).length > 0 && (
              <div style={{ alignSelf: "flex-start", width: "100%" }}>
                <OrderSummaryCard order={orderData} imagePreview={uploadedImage ?? undefined} />
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Color picker (stage 4) */}
          {showColorPicker && !loading && (
            <div style={{
              padding: "8px 14px 10px",
              borderTop: "1px solid #eff6ff",
              background: "#fafcff",
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 6, fontWeight: 600 }}>
                Escolhe uma cor (ou escreve a tua):
              </div>
              <ColorPicker onSelect={(label) => sendMessage(label)} />
            </div>
          )}

          {/* Quick reply chips */}
          {quickReplies.length > 0 && !loading && !showColorPicker && (
            <div style={{
              padding: "8px 12px 10px",
              borderTop: "1px solid #eff6ff",
              background: "#fafcff",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              flexShrink: 0,
            }}>
              {quickReplies.map((q) => (
                <button
                  key={q}
                  className="chip-btn"
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  style={{
                    padding: "6px 13px",
                    borderRadius: 20,
                    border: "1.5px solid #bfdbfe",
                    background: "#fff",
                    color: "#1e3a5f",
                    fontSize: 12.5,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp order button */}
          {showOrderSummary && (
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-order-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "13px 16px",
                background: "#25d366",
                color: "#fff",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "inherit",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <WhatsAppIcon />
              Enviar pedido no WhatsApp
            </a>
          )}

          {/* Input area */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid #eff6ff",
            background: "#fff",
            display: "flex",
            gap: 7,
            alignItems: "center",
            flexShrink: 0,
          }}>
            {/* Image upload button */}
            <button
              className="upload-img-btn"
              onClick={() => fileRef.current?.click()}
              title="Adicionar imagem de inspiração"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1.5px solid #bfdbfe",
                background: uploadedImage ? "#dbeafe" : "#f8fafc",
                color: uploadedImage ? "#2563eb" : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
              aria-label="Enviar imagem"
            >
              <ImageIcon />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  const result = ev.target?.result
                  if (typeof result === "string") handleImageUpload(result, f.name)
                }
                reader.readAsDataURL(f)
                e.target.value = ""
              }}
            />

            <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", gap: 7 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreve aqui…"
                disabled={loading}
                autoComplete="off"
                aria-label="Mensagem"
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  borderRadius: 22,
                  border: "1.5px solid #bfdbfe",
                  fontSize: 13.5,
                  outline: "none",
                  fontFamily: "inherit",
                  color: "#1e3a5f",
                  background: "#f8fafc",
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="send-btn"
                aria-label="Enviar"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "#2563eb",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  transition: "all 0.15s",
                }}
              >
                <SendIcon />
              </button>
            </form>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center",
            fontSize: 10.5,
            color: "#94a3b8",
            padding: "4px 8px 8px",
            flexShrink: 0,
            letterSpacing: "0.02em",
          }}>
            Mundo de Papel Portugal · Assistente virtual
          </div>
        </div>
      )}
    </>
  )
}
