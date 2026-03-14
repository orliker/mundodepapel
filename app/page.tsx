
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AIChatWidget } from "@/components/ai-chat-widget"

// ─── Constants ────────────────────────────────────────────────────────────────
const WA_NUMBER = "351965716782"
const WA_BASE = `https://wa.me/${WA_NUMBER}`
const waLink = (text: string) => `${WA_BASE}?text=${encodeURIComponent(text)}`

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductReference {
  id: string
  slug: string
  name: string
  emoji: string
  image: string
  desc: string
  badge: string | null
  price: number
  materials: string[]
  aiContext: string
}

interface CartItem {
  id: string
  event: string
  name: string
  age: string
  theme: string
  colors: string
  size: string
  material: string
  notes: string
  imagePreview?: string
  price: number
  referenceName?: string
  referenceSlug?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const EVENTS = ["Aniversário", "Batizado", "Casamento", "Dia da Mãe", "Dia do Pai", "Dia dos Namorados", "Páscoa", "Natal", "Outro"]

const CATEGORIES: ProductReference[] = [
  {
    id: "aniversario",
    slug: "aniversario",
    name: "Aniversário",
    emoji: "🎂",
    image: "/images/categorias/aniversario.png",
    desc: "Do 1.º ano ao que quiser. Nome, idade e tema à escolha.",
    badge: "Mais popular",
    price: 8,
    materials: ["Papel Couché 250g", "Papel Glitter", "Papel Texturizado / Camurça"],
    aiContext:
      "Topo de bolo para aniversário, alegre, personalizado, artesanal premium, com nome, idade, tema infantil ou elegante, cores definidas pelo cliente e acabamento delicado.",
  },
  {
    id: "halloween",
    slug: "halloween",
    name: "Halloween",
    emoji: "🎃",
    image: "/images/categorias/halloween.png",
    desc: "Topos de bolo assustadores e divertidos para festas de Halloween. Personalize com nome e idade.",
    badge: "Edição especial",
    price: 8,
    materials: ["Papel Couché 250g", "Papel Glitter", "Papel Decorativo Especial"],
    aiContext:
      "Topo de bolo para Halloween, criativo, divertido, temático, com abóboras, morcegos, teias, laranja, preto e roxo, feito em papel premium e totalmente personalizado.",
  },
  {
    id: "batizado",
    slug: "batizado",
    name: "Batizado",
    emoji: "🕊️",
    image: "/images/categorias/batizado.png",
    desc: "Um momento único que merece um topo único.",
    badge: null,
    price: 9,
    materials: ["Papel Couché 250g", "Papel Texturizado / Camurça", "Papel Decorativo Especial"],
    aiContext:
      "Topo de bolo para batizado, delicado, elegante, religioso, artesanal, com anjinho, pomba, cruz, tons suaves, branco, bege, dourado claro e acabamento premium.",
  },
  {
    id: "casamento",
    slug: "casamento",
    name: "Casamento",
    emoji: "💍",
    image: "/images/categorias/casamento.png",
    desc: "Elegância artesanal para o vosso dia mais especial.",
    badge: "Premium",
    price: 12,
    materials: ["Papel Couché 250g", "Papel Glitter", "Papel Texturizado / Camurça"],
    aiContext:
      "Topo de bolo para casamento, elegante, delicado, artesanal, romântico, acabamento premium, tons suaves, flores, dourado opcional, personalização com nomes e data.",
  },
  {
    id: "dia-mae",
    slug: "dia-mae",
    name: "Dia da Mãe",
    emoji: "🌷",
    image: "/images/categorias/dia-mae.png",
    desc: "Surpreende a mulher mais especial da tua vida.",
    badge: null,
    price: 7,
    materials: ["Papel Couché 250g", "Papel Glitter", "Papel Decorativo Especial"],
    aiContext:
      "Topo de bolo para Dia da Mãe, feminino, delicado, floral, carinhoso, elegante, com cores suaves, rosas, dourado leve e visual artesanal premium.",
  },
  {
    id: "dia-pai",
    slug: "dia-pai",
    name: "Dia do Pai",
    emoji: "👔",
    image: "/images/categorias/dia-pai.png",
    desc: "Celebra o herói da família com estilo próprio.",
    badge: null,
    price: 7,
    materials: ["Papel Couché 250g", "Papel Texturizado / Camurça", "Papel Decorativo Especial"],
    aiContext:
      "Topo de bolo para Dia do Pai, elegante, masculino, carinhoso, artesanal, com estilo moderno, cores sóbrias ou personalizadas e acabamento premium.",
  },
  {
    id: "namorados",
    slug: "namorados",
    name: "Dia dos Namorados",
    emoji: "❤️",
    image: "/images/categorias/namorados.png",
    desc: "Amor em cada detalhe, feito à mão com carinho.",
    badge: null,
    price: 8,
    materials: ["Papel Couché 250g", "Papel Glitter", "Papel Decorativo Especial"],
    aiContext:
      "Topo de bolo para Dia dos Namorados, romântico, delicado, com corações, nomes, frases curtas, vermelho, rosa, branco ou dourado, visual premium e artesanal.",
  },
  {
    id: "pascoa",
    slug: "pascoa",
    name: "Páscoa",
    emoji: "🐣",
    image: "/images/categorias/pascoa.png",
    desc: "Alegria e renovação para toda a família.",
    badge: null,
    price: 7,
    materials: ["Papel Couché 250g", "Papel Glitter", "Papel Decorativo Especial"],
    aiContext:
      "Topo de bolo para Páscoa, alegre, familiar, delicado, com coelhinhos, ovos, flores, cores pastel e acabamento artesanal premium.",
  },
  {
    id: "natal",
    slug: "natal",
    name: "Natal",
    emoji: "🎄",
    image: "/images/categorias/natal.png",
    desc: "Magia natalícia para momentos inesquecíveis.",
    badge: null,
    price: 8,
    materials: ["Papel Couché 250g", "Papel Glitter", "Papel Decorativo Especial"],
    aiContext:
      "Topo de bolo para Natal, mágico, elegante, festivo, com estrelas, pinheiro, dourado, vermelho, branco, visual artesanal premium e personalizado.",
  },
]

const HERO_IMAGES = [
  "/images/categorias/aniversario.png",
  "/images/categorias/halloween.png",
  "/images/categorias/batizado.png",
  "/images/categorias/casamento.png",
  "/images/categorias/cha-de-bebe.png",
]

const GALLERY = [
  {
    id: "g1",
    title: "Topo Clássico",
    tag: "Casamento",
    image: "/images/galeria/classico.jpg",
  },
  {
    id: "g2",
    title: "Topo Boho",
    tag: "Casamento",
    image: "/images/galeria/boho.jpg",
  },
  {
    id: "g3",
    title: "Super-Heróis",
    tag: "Aniversário",
    image: "/images/galeria/super-herois.jpg",
  },
  {
    id: "g4",
    title: "Unicórnio",
    tag: "Aniversário",
    image: "/images/galeria/unicornio.jpg",
  },
  {
    id: "g5",
    title: "Pomba Branca",
    tag: "Batizado",
    image: "/images/galeria/pomba-branca.jpg",
  },
  {
    id: "g6",
    title: "Flores Rosa",
    tag: "Dia da Mãe",
    image: "/images/galeria/flores-rosa.jpg",
  },
]

const REVIEWS = [
  { name: "Ana Sousa",       location: "Lisboa", text: "Ficou mesmo lindo! Qualidade incrível e chegou super rápido. Recomendo a todas as mamãs!", tag: "Aniversário" },
  { name: "Margarida Costa", location: "Porto",  text: "Encomendei para o meu casamento e superou todas as expectativas. Muito obrigada!",           tag: "Casamento" },
  { name: "Rita Ferreira",   location: "Braga",  text: "Adorei a atenção ao detalhe. O topo ficou exatamente como eu queria!",                       tag: "Batizado" },
  { name: "Joana Melo",      location: "Faro",   text: "Serviço impecável, resposta rápida e produto de qualidade premium. Voltarei certamente!",     tag: "Aniversário" },
]

const SIZES = [
  { label: "Pequeno",  desc: "~10 cm" },
  { label: "Médio",    desc: "~15 cm" },
  { label: "Grande",   desc: "~20 cm" },
]

const MATERIALS = [
  {
    label: "Papel Couché 250g",
    desc: "Base premium, acabamento suave",
    image: "/images/materiais/couche.jpg",
  },
  {
    label: "Papel Glitter",
    desc: "Brilho e sofisticação especial",
    image: "/images/materiais/glitter.jpg",
  },
  {
    label: "Papel Texturizado / Camurça",
    desc: "Efeito aveludado e elegante",
    image: "/images/materiais/texturizado.jpg",
  },
  {
    label: "Papel Decorativo Especial",
    desc: "Papéis de papelaria de alta qualidade",
    image: "/images/materiais/decorativo.jpg",
  },
]

const COLOR_PRESETS = [
  { label: "Rosa & Dourado",  value: "Rosa e Dourado",  hex: "#f472b6" },
  { label: "Azul & Branco",   value: "Azul e Branco",   hex: "#60a5fa" },
  { label: "Verde & Bege",    value: "Verde e Bege",    hex: "#4ade80" },
  { label: "Preto & Dourado", value: "Preto e Dourado", hex: "#374151" },
  { label: "Lilás & Prata",   value: "Lilás e Prata",   hex: "#a78bfa" },
  { label: "Tons Pastel",     value: "Tons Pastel",     hex: "#fde68a" },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
function WaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function StarIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
}

function MenuIcon() {
  return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
}

function XIcon() {
  return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
}

function SparkIcon() {
  return <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" /></svg>
}

function CartIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
}

function TrashIcon() {
  return <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
}

// ─── Reveal animation ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8, height: 8,
          borderRadius: 4,
          background: i < current ? "#3b82f6" : i === current ? "#1e3a5f" : "#bfdbfe",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  )
}
// ─── SVG Live Preview ─────────────────────────────────────────────────────────
function SVGPreview({ name, age, theme, colorHex, size, material }: {
  name: string; age: string; theme: string; colorHex: string; size: string; material: string
}) {
  const w = 300, h = 200
  const col = colorHex || "#3b82f6"
  const colLight = col + "28"
  const displayName = name || "Maria"
  const displayAge  = age  ? `${age} anos` : ""
  const displayTheme = theme || "Tema Personalizado"

  const shapesBySize: Record<string, number> = { Pequeno: 0.7, Médio: 1, Grande: 1.3 }
  const scale = shapesBySize[size] ?? 1

  const matLabel: Record<string, string> = {
    "Papel Couché 250g": "Couché 250g",
    "Papel Glitter": "Glitter",
    "Papel Texturizado / Camurça": "Texturizado",
    "Papel Decorativo Especial": "Decorativo",
  }

  return (
    <div style={{ background: "#f8faff", borderRadius: 20, padding: 16, border: "1.5px solid #e0effe", textAlign: "center" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Pré-visualização</div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        style={{ maxWidth: 300, display: "block", margin: "0 auto" }}
        aria-label={`Pré-visualização do topo: ${displayName} ${displayAge}`}
        role="img"
      >
        {/* Background card */}
        <rect x="20" y="16" width={w - 40} height={h - 32} rx="18" fill="white" stroke={col} strokeWidth="2" />
        <rect x="20" y="16" width={w - 40} height="44" rx="18" fill={col} />
        <rect x="20" y="42" width={w - 40} height="18" fill={col} />

        {/* Decorative circles */}
        {[-1, 0, 1].map(offset => (
          <circle
            key={offset}
            cx={w / 2 + offset * 60 * scale}
            cy={70}
            r={8 * scale}
            fill={colLight}
            stroke={col}
            strokeWidth="1.5"
          />
        ))}

        {/* Stars */}
        {[-1, 1].map((side, i) => (
          <text key={i} x={w / 2 + side * 110} y={76} textAnchor="middle" fontSize={14 * scale} fill={col} opacity="0.6">★</text>
        ))}

        {/* Name */}
        <text
          x={w / 2} y={110}
          textAnchor="middle"
          fontSize={Math.min(24, Math.max(14, 220 / Math.max(displayName.length, 1))) * scale}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fill={col}
        >
          {displayName}
        </text>

        {/* Age */}
        {displayAge && (
          <text x={w / 2} y={136} textAnchor="middle" fontSize={15 * scale} fontFamily="Nunito, sans-serif" fontWeight="600" fill="#475569">
            {displayAge}
          </text>
        )}

        {/* Theme */}
        <text x={w / 2} y={155} textAnchor="middle" fontSize={11} fontFamily="Nunito, sans-serif" fill="#94a3b8">
          {displayTheme.slice(0, 30)}
        </text>

        {/* Bottom material badge */}
        <rect x={w / 2 - 36} y={h - 36} width={72} height={20} rx="10" fill={colLight} />
        <text x={w / 2} y={h - 22} textAnchor="middle" fontSize={9} fontFamily="Nunito, sans-serif" fontWeight="700" fill={col}>
          {matLabel[material] ?? material}
        </text>

        {/* Stick */}
        <rect x={w / 2 - 3} y={h - 16} width={6} height={14} rx="3" fill={col} opacity="0.4" />
      </svg>
      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Pré-visualização ilustrativa. Design final pode variar.</p>
    </div>
  )
}

// ─── AI Design Generator ──────────────────────────────────────────────────────
function AIDesignPanel({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  const [prompt, setPrompt]   = useState("")
  const [result, setResult]   = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true); setError(""); setResult("")
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Sou um cliente da Mundo de Papel Portugal. Descreve em detalhes um design de topo de bolo para: "${prompt}". Inclui: cores recomendadas, formas decorativas, tipografia sugerida, material ideal e layout. Responde em português, de forma criativa e detalhada.`
          }]
        }),
      })
      if (!res.ok) throw new Error("Erro de rede")
      const data = await res.json()
      const text = data.reply ?? "Sem resposta."
      setResult(text)
      onSuggestion(text)
    } catch {
      setError("Não foi possível gerar sugestão. Tenta novamente.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", border: "2px solid #bfdbfe", borderRadius: 12,
    fontSize: 15, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1e3a5f",
  }

  return (
    <div style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: 20, padding: "24px 22px", border: "1.5px solid #bfdbfe", marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <SparkIcon />
        <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16, color: "#1e3a5f" }}>Sugestão por IA</span>
        <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em" }}>IA</span>
      </div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
        Descreve o teu topo (ex: &ldquo;Topo Frozen 5 anos azul&rdquo;) e a IA sugere cores, formas e layout.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
          placeholder="Ex: Topo Frozen 5 anos azul e branco..."
          style={inputStyle}
        />
        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          style={{
            padding: "12px 20px", borderRadius: 12, border: "none",
            background: loading || !prompt.trim() ? "#bfdbfe" : "#3b82f6",
            color: loading || !prompt.trim() ? "#94a3b8" : "#fff",
            fontWeight: 700, fontSize: 14, cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
            whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0,
          }}
        >
          {loading ? "..." : "Gerar"}
        </button>
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 10 }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1.5px solid #bfdbfe", fontSize: 14, color: "#1e3a5f", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 200, overflowY: "auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sugestão da IA</div>
          {result}
        </div>
      )}
    </div>
  )
}

  function CategoryDetailsDrawer({
  item,
  open,
  onClose,
  onCustomize,
}: {
  item: ProductReference | null
  open: boolean
  onClose: () => void
  onCustomize: (item: ProductReference) => void
}) {
  const [aiDescription, setAiDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !item) return

    const currentItem = item
    let cancelled = false

    async function loadDescription() {
      setLoading(true)
      setAiDescription("")

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `
Cria uma descrição curta e comercial em português de Portugal para uma página de produto da Mundo de Papel Portugal.

Categoria: ${currentItem.name}
Descrição base: ${currentItem.desc}
Materiais: ${currentItem.materials.join(", ")}
Contexto visual: ${currentItem.aiContext}

Regras:
- tom delicado, elegante, premium e artesanal
- no máximo 90 palavras
- não inventar materiais fora da lista
- não mencionar preços fechados
- reforçar personalização
                `.trim(),
              },
            ],
          }),
        })

        const data = await res.json()
        const text = data?.reply?.trim() || currentItem.desc

        if (!cancelled) setAiDescription(text)
      } catch {
        if (!cancelled) setAiDescription(currentItem.desc)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDescription()

    return () => {
      cancelled = true
    }
  }, [open, item])

  if (!open || !item) return null

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", justifyContent: "flex-end" }}>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
      />
      <div
  style={{
    position: "relative",
    width: "100%",
    maxWidth: 520,
    height: "100vh",
    background: "#fff",
    overflowY: "auto",
    boxShadow: "-12px 0 40px rgba(0,0,0,0.18)",
    padding: 24,
    transform: "translateX(0)",
    animation: "drawerSlideIn 0.28s ease",
  }}
>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Categoria
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, color: "#1e3a5f" }}>
              {item.emoji} {item.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
            aria-label="Fechar"
          >
            <XIcon />
          </button>
        </div>

        <div
  style={{
    borderRadius: 20,
    overflow: "hidden",
    border: "1.5px solid #dbeafe",
    marginBottom: 18,
    background: "#f8fbff",
  }}
>
  <img
    src={item.image}
    alt={item.name}
    style={{
      width: "100%",
      maxHeight: "70vh",
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
      background: "#f8fbff",
    }}
  />
</div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <span
            style={{
              background: "#eff6ff",
              color: "#1e3a5f",
              borderRadius: 100,
              padding: "7px 12px",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Valores desde {item.price}€
          </span>

          {item.badge && (
            <span
              style={{
                background: "#3b82f6",
                color: "#fff",
                borderRadius: 100,
                padding: "7px 12px",
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              {item.badge}
            </span>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#1e3a5f",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Descrição
          </h3>
          <p style={{ color: "#475569", lineHeight: 1.7, fontSize: 15 }}>
            {loading ? "A gerar descrição com IA..." : aiDescription || item.desc}
          </p>
        </div>

        

        <div style={{ display: "grid", gap: 12 }}>
          <button
            onClick={() => onCustomize(item)}
            style={{
              padding: "15px 18px",
              borderRadius: 100,
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Personalizar este modelo
          </button>

          <a
            href={waLink(`Olá! Gostaria de pedir orçamento para o modelo "${item.name}".`)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "14px 18px",
              borderRadius: 100,
              border: "2px solid #25d366",
              color: "#25d366",
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Enviar referência no WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
// ─── Configurator ─────────────────────────────────────────────────────────────
function Configurator({
  onAddToCart,
  initialReference,
}: {
  onAddToCart: (item: CartItem) => void
  initialReference?: ProductReference | null
}) {
  const [step, setStep] = useState(0)
  const [event, setEvent] = useState(initialReference?.name || "")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [theme, setTheme] = useState(initialReference?.name || "")
  const [colors, setColors] = useState("")
  const [size, setSize] = useState("Médio")
  const [material, setMaterial] = useState(initialReference?.materials?.[0] || "Papel Couché 250g")
  const [notes, setNotes] = useState(
    initialReference
      ? `Referência base selecionada: ${initialReference.name}. ${initialReference.desc}`
      : ""
  )
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialReference?.image)
  const [submitted, setSubmitted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!initialReference) return
    setEvent(initialReference.name)
    setTheme((prev) => prev || initialReference.name)
    setMaterial(initialReference.materials?.[0] || "Papel Couché 250g")
    setImagePreview(initialReference.image)
    setNotes(`Referência base selecionada: ${initialReference.name}. ${initialReference.desc}`)
  }, [initialReference])

  const TOTAL_STEPS = 6
  const price = 7.9
  const colorHex = COLOR_PRESETS.find((c) => c.value === colors)?.hex ?? "#3b82f6"

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const buildWaMessage = () => {
    const lines = [
      "Olá! Gostaria de encomendar um topo personalizado.",
      "",
      `Referência base: ${initialReference?.name || "Sem referência específica"}`,
      `Slug da referência: ${initialReference?.slug || "—"}`,
      `Evento: ${event}`,
      `Nome: ${name || "—"}`,
      `Idade: ${age || "—"}`,
      `Tema: ${theme || "—"}`,
      `Cores: ${colors || "—"}`,
      `Tamanho: ${size}`,
      `Material: ${material}`,
      `Imagem de referência: ${imagePreview ? "(Imagem incluída)" : "Sem imagem"}`,
      `Notas: ${notes || "—"}`,
      "",
      "Valores desde 7,90€.",
      "O orçamento final será enviado via WhatsApp conforme a personalização e complexidade do trabalho.",
      "",
      "Obrigado!",
    ]
    return lines.join("\n")
  }

  const handleSend = () => {
    window.open(waLink(buildWaMessage()), "_blank")
    setSubmitted(true)
  }

  const handleAddToCart = () => {
    onAddToCart({
      id: Date.now().toString(),
      event,
      name,
      age,
      theme,
      colors,
      size,
      material,
      notes,
      imagePreview,
      price,
      referenceName: initialReference?.name,
      referenceSlug: initialReference?.slug,
    })
    setSubmitted(true)
  }

  const reset = () => {
    setStep(0)
    setEvent(initialReference?.name || "")
    setName("")
    setAge("")
    setTheme(initialReference?.name || "")
    setColors("")
    setSize("Médio")
    setMaterial(initialReference?.materials?.[0] || "Papel Couché 250g")
    setNotes(initialReference ? `Referência base selecionada: ${initialReference.name}. ${initialReference.desc}` : "")
    setImagePreview(initialReference?.image)
    setSubmitted(false)
    if (fileRef.current) fileRef.current.value = ""
  }

  const canNext = () => {
    if (step === 0) return !!event
    if (step === 1) return !!name
    return true
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #bfdbfe",
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    color: "#1e3a5f",
    transition: "border-color 0.2s",
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "9px 18px",
    borderRadius: 100,
    border: `2px solid ${active ? "#3b82f6" : "#bfdbfe"}`,
    background: active ? "#eff6ff" : "#fff",
    color: active ? "#1e3a5f" : "#64748b",
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.18s",
  })

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 24px" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 32,
          }}
        >
          ✅
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, color: "#1e3a5f", marginBottom: 10 }}>
          Pedido Enviado!
        </h3>
        <p style={{ color: "#475569", marginBottom: 28, lineHeight: 1.6 }}>
          O teu pedido foi enviado para o WhatsApp. Entraremos em contacto em breve com confirmação e prazo de produção.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "12px 28px",
            borderRadius: 100,
            border: "2px solid #3b82f6",
            background: "#fff",
            color: "#3b82f6",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Fazer Nova Encomenda
        </button>
      </div>
    )
  }

  return (
    <div>
      {initialReference && (
        <div
          style={{
            background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
            border: "1.5px solid #bfdbfe",
            borderRadius: 18,
            padding: 16,
            marginBottom: 20,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <img
            src={initialReference.image}
            alt={initialReference.name}
            style={{ width: 72, height: 72, borderRadius: 14, objectFit: "cover", flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Referência base
            </div>
            <div style={{ fontWeight: 800, color: "#1e3a5f", fontSize: 18 }}>
              {initialReference.emoji} {initialReference.name}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{initialReference.desc}</div>
          </div>
        </div>
      )}

      {step === 0 && (
        <AIDesignPanel
          onSuggestion={(text) => {
            const lower = text.toLowerCase()
            if (!theme) {
              const themes = ["frozen", "princesa", "unicórnio", "dinossauro", "flores", "boho", "minimalista", "super-herói"]
              const found = themes.find((t) => lower.includes(t))
              if (found) setTheme(found.charAt(0).toUpperCase() + found.slice(1))
            }
            if (initialReference && !notes.includes("IA")) {
              setNotes((prev) =>
                `${prev}\n\nSugestão IA baseada em ${initialReference.name}:\n${text}`.trim()
              )
            }
          }}
        />
      )}

      {step >= 1 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={() => setShowPreview((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 100,
              border: "1.5px solid #bfdbfe",
              background: showPreview ? "#eff6ff" : "#fff",
              color: "#3b82f6",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {showPreview ? "Ocultar pré-visualização" : "Ver pré-visualização"}
          </button>
        </div>
      )}

      {showPreview && step >= 1 && (
        <div style={{ marginBottom: 24 }}>
          <SVGPreview name={name} age={age} theme={theme} colorHex={colorHex} size={size} material={material} />
        </div>
      )}

      <StepDots total={TOTAL_STEPS} current={step} />

      {step === 0 && (
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: "#1e3a5f", marginBottom: 8 }}>
            Qual é o evento?
          </h3>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
            Escolhe o tipo de celebração para o teu topo de bolo.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {EVENTS.map((e) => (
              <button key={e} onClick={() => setEvent(e)} style={chipStyle(event === e)}>
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: "#1e3a5f", marginBottom: 8 }}>
              Personalização
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              Indica os dados que devem aparecer no topo.
            </p>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 6 }}>
              Nome *
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Maria" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 6 }}>
              Idade
            </label>
            <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ex: 5 anos" style={inputStyle} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: "#1e3a5f", marginBottom: 8 }}>
              Tema e Cores
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 4 }}>
              Define o estilo do teu topo de bolo.
            </p>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>
              Tema
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {["Princesas", "Dinossauros", "Flores", "Boho", "Minimalista", "Super-Heróis", "Unicórnios", "Balões", "Estrelas"].map((t) => (
                <button key={t} onClick={() => setTheme(t)} style={chipStyle(theme === t)}>
                  {t}
                </button>
              ))}
            </div>
            <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ou escreve o teu tema..." style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>
              Cores
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColors(c.value)}
                  style={{ ...chipStyle(colors === c.value), display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: c.hex,
                      display: "inline-block",
                      border: "1.5px solid rgba(0,0,0,0.08)",
                    }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
            <input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Ou descreve as cores..." style={inputStyle} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: "#1e3a5f", marginBottom: 8 }}>
              Tamanho e Material
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 4 }}>
              Escolhe as opções para o teu topo.
            </p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 12 }}>
              Tamanho
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {SIZES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSize(s.label)}
                  style={{
                    padding: "14px 10px",
                    borderRadius: 14,
                    border: `2px solid ${size === s.label ? "#3b82f6" : "#bfdbfe"}`,
                    background: size === s.label ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 12 }}>
              Material
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MATERIALS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMaterial(m.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: `2px solid ${material === m.label ? "#3b82f6" : "#bfdbfe"}`,
                    background: material === m.label ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={m.image}
                      alt={m.label}
                      style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14 }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{m.desc}</div>
                    </div>
                  </div>
                  {material === m.label && (
                    <span style={{ color: "#3b82f6" }}>
                      <CheckIcon />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: "#1e3a5f", marginBottom: 8 }}>
            Imagem de Inspiração
          </h3>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
            Podes enviar uma foto ou imagem de inspiração.
          </p>

          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} style={{ display: "none" }} id="cfg-upload" />

          {!imagePreview ? (
            <label
              htmlFor="cfg-upload"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                border: "2px dashed #bfdbfe",
                borderRadius: 16,
                padding: "40px 24px",
                cursor: "pointer",
                background: "#f8faff",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40 }}>🖼️</div>
              <div style={{ fontWeight: 700, color: "#3b82f6", fontSize: 15 }}>Clica para carregar imagem</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>PNG, JPG ou WEBP até 10 MB</div>
            </label>
          ) : (
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "2px solid #bfdbfe" }}>
              <img src={imagePreview} alt="Imagem de inspiração" style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }} />
              <button
                onClick={() => {
                  setImagePreview(undefined)
                  if (fileRef.current) fileRef.current.value = ""
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {step === 5 && (
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: "#1e3a5f", marginBottom: 8 }}>
            Notas Extras
          </h3>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
            Algum pedido especial? Conta-nos tudo.
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Ex: quero o nome em letra cursiva..."
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />

          <div style={{ marginTop: 24, marginBottom: 20 }}>
            <SVGPreview name={name} age={age} theme={theme} colorHex={colorHex} size={size} material={material} />
          </div>

          <div style={{ background: "#eff6ff", borderRadius: 16, padding: "20px 22px", border: "1.5px solid #bfdbfe" }}>
            <div style={{ fontWeight: 800, color: "#1e3a5f", fontSize: 15, marginBottom: 14, fontFamily: "'Playfair Display',Georgia,serif" }}>
              Resumo do pedido
            </div>

            {initialReference && (
              <div style={{ display: "flex", gap: 12, fontSize: 14, marginBottom: 7 }}>
                <span style={{ fontWeight: 700, color: "#3b82f6", minWidth: 100 }}>Referência:</span>
                <span style={{ color: "#1e3a5f" }}>{initialReference.name}</span>
              </div>
            )}

            {[
              ["Evento", event],
              ["Nome", name || "—"],
              ["Idade", age || "—"],
              ["Tema", theme || "—"],
              ["Cores", colors || "—"],
              ["Tamanho", size],
              ["Material", material],
              ["Notas", notes || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 12, fontSize: 14, marginBottom: 7, alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, color: "#3b82f6", minWidth: 100 }}>{label}:</span>
                <span style={{ color: "#1e3a5f" }}>{val}</span>
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              <button
                onClick={handleSend}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "15px 24px",
                  borderRadius: 100,
                  background: "#25d366",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <WaIcon size={20} />
                Enviar pedido no WhatsApp
              </button>

              <button
                onClick={handleAddToCart}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 100,
                  background: "#fff",
                  color: "#3b82f6",
                  fontWeight: 700,
                  fontSize: 15,
                  border: "2px solid #3b82f6",
                  cursor: "pointer",
                }}
              >
                <CartIcon size={17} />
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {step < TOTAL_STEPS - 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              padding: "10px 20px",
              borderRadius: 100,
              border: "2px solid #bfdbfe",
              background: "#fff",
              color: "#475569",
              fontWeight: 600,
              fontSize: 14,
              cursor: step === 0 ? "not-allowed" : "pointer",
              opacity: step === 0 ? 0.4 : 1,
            }}
          >
            Voltar
          </button>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
            Passo {step + 1} de {TOTAL_STEPS}
          </span>
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            style={{
              padding: "10px 24px",
              borderRadius: 100,
              border: "none",
              background: canNext() ? "#3b82f6" : "#bfdbfe",
              color: canNext() ? "#fff" : "#94a3b8",
              fontWeight: 700,
              fontSize: 14,
              cursor: canNext() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Continuar <ArrowRight />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────
function CartPanel({ items, onRemove, onClose }: { items: CartItem[]; onRemove: (id: string) => void; onClose: () => void }) {
  const total = items.reduce((s, i) => s + i.price, 0)

  const buildCartWa = () => {
    const lines = [
      "Olá! Gostaria de encomendar os seguintes topos de bolo:",
      "",
      ...items.flatMap((item, i) => [
        `--- Topo ${i + 1} ---`,
        `Evento: ${item.event}`,
        `Nome: ${item.name || "—"}`,
        `Idade: ${item.age || "—"}`,
        `Tema: ${item.theme || "—"}`,
        `Cores: ${item.colors || "—"}`,
        `Tamanho: ${item.size}`,
        `Material: ${item.material}`,
        `Notas: ${item.notes || "—"}`,
        "Valores desde 7,90€.",
        "",
      ]),
      "O orçamento final será confirmado via WhatsApp.",
      "",
      "Obrigado!",
    ]
    return lines.join("\n")
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "relative", background: "#fff", width: "100%", maxWidth: 420, height: "100vh", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 24px", borderBottom: "1.5px solid #eff6ff", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CartIcon size={22} />
            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 18, color: "#1e3a5f" }}>O meu carrinho</span>
            {items.length > 0 && <span style={{ background: "#3b82f6", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{items.length}</span>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }} aria-label="Fechar carrinho"><XIcon /></button>
        </div>

        <div style={{ flex: 1, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🛒</div>
              <p style={{ fontWeight: 600, fontSize: 16 }}>O carrinho está vazio</p>
              <p style={{ fontSize: 14, marginTop: 6 }}>Adiciona um topo personalizado para começar.</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ background: "#f8faff", borderRadius: 14, padding: "16px 18px", border: "1.5px solid #e0effe", display: "flex", gap: 14, alignItems: "flex-start" }}>
              {item.imagePreview && <img src={item.imagePreview} alt="Miniatura do topo personalizado" style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14 }}>{item.event} — {item.name || "Sem nome"}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{item.size} · {item.material} · {item.theme || "Sem tema"}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#3b82f6", marginTop: 6 }}>Desde 7,90€</div>
              </div>
              <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4, flexShrink: 0 }} aria-label="Remover do carrinho"><TrashIcon /></button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1.5px solid #eff6ff", background: "#fff", position: "sticky", bottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, color: "#475569" }}>Valores desde</span>
              <span style={{ fontWeight: 800, fontSize: 22, color: "#1e3a5f", fontFamily: "'Playfair Display',Georgia,serif" }}>Orçamento via WhatsApp</span>
            </div>
            <a href={waLink(buildCartWa())} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "15px 24px", borderRadius: 100, background: "#25d366", color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 24px rgba(37,211,102,0.35)" }}>
              <WaIcon size={20} />
              Enviar carrinho no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
const [selectedCategory, setSelectedCategory] = useState<ProductReference | null>(null)
const [detailsOpen, setDetailsOpen] = useState(false)
const [configReference, setConfigReference] = useState<ProductReference | null>(null)
const [heroImageIndex, setHeroImageIndex] = useState(0)
const [heroVisible, setHeroVisible] = useState(true)
const [heroAnimating, setHeroAnimating] = useState(false)
const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleCustomizeFromCategory = (item: ProductReference) => {
    setConfigReference(item)
    setDetailsOpen(false)
    setTimeout(() => {
      document.getElementById("personalizar")?.scrollIntoView({ behavior: "smooth" })
    }, 120)
  }

  const WA_BUSINESS = waLink("Olá, gostaria de receber a tabela de preços para empresas.")

useEffect(() => {
  const interval = setInterval(() => {
    setHeroAnimating(true)
    setHeroVisible(false)

    setTimeout(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
      setHeroVisible(true)
    }, 320)

    setTimeout(() => {
      setHeroAnimating(false)
    }, 900)
  }, 5000)

  return () => clearInterval(interval)
}, [])
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = ["home", "personalizar", "categorias", "galeria", "precos", "sobre", "contacto"]

      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) setActiveSection(id)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item])
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }
  const navLinks = [
    { id: "home",        label: "Início" },
    { id: "personalizar",label: "Personalizar" },
    { id: "categorias",  label: "Categorias" },
    { id: "galeria",     label: "Galeria" },
    { id: "precos",      label: "Preços" },
    { id: "sobre",       label: "Sobre Nós" },
    { id: "contacto",    label: "Contacto" },
  ]

  return (
    <div style={{ fontFamily: "'Nunito', system-ui, sans-serif", background: "#ffffff", color: "#1e3a5f" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
          .hero-grid   { grid-template-columns: 1fr !important; }
          .cat-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .gallery-grid { grid-template-columns: repeat(2,1fr) !important; }
          .price-grid  { grid-template-columns: 1fr !important; }
          .steps-grid  { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .cat-grid    { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
        .hero-visual-wrap {
  overflow: visible;
}

@media (max-width: 768px) {
  .hero-visual-wrap {
    width: 100% !important;
    max-width: 420px !important;
    padding-top: 16px !important;
    padding-left: 14px !important;
    padding-right: 14px !important;
    padding-bottom: 110px !important;
    margin: 0 auto !important;
  }

  .hero-badge-right {
    top: 10px !important;
    right: 10px !important;
    min-width: 104px !important;
    padding: 10px 14px !important;
  }

  .hero-badge-left {
    left: 50% !important;
    bottom: 0 !important;
    transform: translateX(-50%) !important;
    width: calc(100% - 28px) !important;
    max-width: 320px !important;
    text-align: center !important;
  }
}
        button:focus-visible, a:focus-visible { outline: 3px solid #3b82f6; outline-offset: 2px; }
        .hover-lift { transition: transform 0.22s ease, box-shadow 0.22s ease !important; }
        .hover-lift:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 40px rgba(59,130,246,0.18) !important; }
        .cat-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .cat-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(59,130,246,0.16); }
        .wa-btn:hover { filter: brightness(1.07); transform: translateY(-2px) !important; }
        .blue-btn:hover { background: #1d4ed8 !important; transform: translateY(-2px); }
        input:focus, textarea:focus, select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        @keyframes drawerSlideIn {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: scrolled ? "1px solid #bfdbfe" : "1px solid transparent", boxShadow: scrolled ? "0 2px 24px rgba(59,130,246,0.10)" : "none", transition: "all 0.3s ease" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#1e3a5f)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🎂</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 15, color: "#1e3a5f", lineHeight: 1.1 }}>Mundo de Papel</div>
              <div style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Portugal</div>
            </div>
          </button>

          <nav className="nav-desktop" style={{ display: "flex", gap: 2 }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "7px 11px", borderRadius: 8, fontWeight: 600, fontSize: 13.5, color: activeSection === l.id ? "#3b82f6" : "#475569", borderBottom: `2px solid ${activeSection === l.id ? "#3b82f6" : "transparent"}`, transition: "all 0.2s" }}>
                {l.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Cart button */}
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "2px solid #bfdbfe", borderRadius: 100, padding: "7px 14px", cursor: "pointer", color: "#1e3a5f", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
              <CartIcon size={17} />
              <span className="nav-desktop" style={{ display: "inline" }}>Carrinho</span>
              {cartItems.length > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: "#3b82f6", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{cartItems.length}</span>}
            </button>
            <a href={waLink("Olá! Gostaria de fazer uma encomenda de topo de bolo personalizado.")} target="_blank" rel="noopener noreferrer" className="nav-desktop wa-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "#25d366", color: "#fff", borderRadius: 100, padding: "8px 18px", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 2px 12px rgba(37,211,102,0.3)", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              <WaIcon size={15} /> Encomendar
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#1e3a5f", padding: 4 }} aria-label="Abrir menu">
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #bfdbfe", padding: "16px 20px 24px" }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "12px 0", fontSize: 16, fontWeight: 600, color: activeSection === l.id ? "#3b82f6" : "#1e3a5f", borderBottom: "1px solid #eff6ff", cursor: "pointer" }}>
                {l.label}
              </button>
            ))}
            <a href={waLink("Olá! Gostaria de fazer uma encomenda de topo de bolo personalizado.")} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, background: "#25d366", color: "#fff", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              <WaIcon size={18} /> Encomendar no WhatsApp
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────────────────────── */}
      <section id="home" style={{ minHeight: "100vh", background: "linear-gradient(155deg,#eff6ff 0%,#dbeafe 50%,#bfdbfe 100%)", display: "flex", alignItems: "center", paddingTop: 68, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "rgba(59,130,246,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -140, left: -100, width: 560, height: 560, borderRadius: "50%", background: "rgba(30,58,95,0.05)", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(59,130,246,0.12)", borderRadius: 100, padding: "6px 16px", marginBottom: 22, fontSize: 13, fontWeight: 700, color: "#2563eb" }}>
              <SparkIcon /> Feito à mão em Portugal
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(34px,4.5vw,60px)", fontWeight: 700, color: "#1e3a5f", lineHeight: 1.1, marginBottom: 18 }}>
              Topos de Bolo<br />
              <span style={{ background: "linear-gradient(90deg,#3b82f6,#1e3a5f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Personalizados</span><br />
              com Qualidade Premium
            </h1>
            <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "#475569", lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>
              Criamos topos personalizados com papel couché 250g, papel glitter e outros papéis especiais de alta qualidade, com acabamento cuidado e preços desde 7,90€.
            </p>

            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
              {["Qualidade Premium", "Papelaria de Alta Qualidade", "100% Personalizado", "Desde 7,90€"].map(b => (
                <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff", border: "1.5px solid #bfdbfe", borderRadius: 100, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: "#1e3a5f", boxShadow: "0 2px 8px rgba(59,130,246,0.10)" }}>
                  <span style={{ color: "#3b82f6" }}><CheckIcon size={13} /></span>{b}
                </span>
              ))}
            </div>

            {/* Price highlight */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(90deg,#1e3a5f,#3b82f6)", color: "#fff", borderRadius: 16, padding: "12px 24px", marginBottom: 32, boxShadow: "0 6px 24px rgba(30,58,95,0.25)" }}>
              <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display',Georgia,serif" }}>Desde 7,90€</span>
              <span style={{ fontSize: 14, opacity: 0.85, borderLeft: "1px solid rgba(255,255,255,0.35)", paddingLeft: 12, lineHeight: 1.4 }}>por topo<br />personalizado</span>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("personalizar")} className="blue-btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 100, background: "#3b82f6", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(59,130,246,0.35)", transition: "all 0.2s" }}>
                Personalizar o meu topo <ArrowRight size={17} />
              </button>
              <button onClick={() => scrollTo("galeria")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 100, background: "rgba(255,255,255,0.8)", color: "#1e3a5f", fontWeight: 700, fontSize: 16, border: "2px solid #bfdbfe", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}>
                Ver exemplos
              </button>
            </div>
          </div>

          {/* Hero visual */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
  <div
    className="hero-visual-wrap"
    style={{
      position: "relative",
      width: "min(460px, 100%)",
      paddingBottom: 80,
      paddingTop: 28,
      paddingLeft: 28,
      paddingRight: 28,
    }}
  >
    <div
  style={{
    position: "relative",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 24px 64px rgba(30,58,95,0.18), 0 8px 24px rgba(59,130,246,0.10)",
    border: "4px solid rgba(255,255,255,0.88)",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
    backdropFilter: "blur(4px)",
  }}
>
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle at top left, rgba(255,255,255,0.65), transparent 42%)",
      pointerEvents: "none",
      zIndex: 2,
    }}
  />

  <div
    style={{
      position: "absolute",
      inset: 0,
      boxShadow: "inset 0 0 40px rgba(255,255,255,0.22)",
      pointerEvents: "none",
      zIndex: 2,
    }}
  />

  <img
    src={HERO_IMAGES[heroImageIndex]}
    alt="Topos de bolo artesanais personalizados feitos em Portugal"
    style={{
      width: "100%",
      height: 460,
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
      opacity: heroVisible ? 1 : 0,
      transform: heroAnimating ? "scale(1.02)" : "scale(1)",
      filter: heroVisible ? "blur(0px)" : "blur(6px)",
      transition: "opacity 0.9s ease, transform 1s ease, filter 0.s ease",
      position: "relative",
      zIndex: 1,
      padding: 16,
    }}
  />
</div>

    <div
      className="hero-badge-left"
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        background: "#fff",
        borderRadius: 18,
        padding: "14px 18px",
        boxShadow: "0 12px 36px rgba(30,58,95,0.18)",
        border: "1.5px solid #bfdbfe",
        maxWidth: 220,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        Pronto em
      </div>
      <div
        style={{
          fontWeight: 800,
          color: "#1e3a5f",
          fontSize: 18,
          fontFamily: "'Playfair Display',Georgia,serif",
        }}
      >
        3-5 dias
      </div>
      <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>
        Envio para todo Portugal
      </div>
    </div>

    <div
      className="hero-badge-right"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        background: "linear-gradient(135deg,#3b82f6,#1e3a5f)",
        borderRadius: 18,
        padding: "12px 16px",
        boxShadow: "0 10px 30px rgba(59,130,246,0.35)",
        color: "#fff",
        textAlign: "center",
        minWidth: 118,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800 }}>7,90€</div>
      <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.9 }}>A PARTIR DE</div>
    </div>
  </div>
</div>
  
        </div>
      </section>

      {/* ── TRUST TICKER ──────────────────────────────────────────────────────────────────── */}
      <div style={{ background: "#1e3a5f", color: "#bfdbfe", padding: "13px 0", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }} className="animate-ticker">
          {Array.from({ length: 3 }).flatMap(() => ["100% Personalizado", "Feito à Mão em Portugal", "Papel de Alta Qualidade", "Qualidade Premium", "Desde 7,90€", "Resposta em 24h", "Mais de 1000 topos entregues"].map(t => (
            <span key={t + Math.random()} style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ color: "#60a5fa" }}>★</span> {t}
            </span>
          )))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Como funciona</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#1e3a5f", marginBottom: 12 }}>Personaliza o teu topo em 3 passos</h2>
              <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>Rápido, fácil e com resultado profissional — mesmo sem experiência em design.</p>
            </div>
          </Reveal>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              { num: "1", emoji: "🎉", title: "Escolhe o evento", desc: "Aniversário, casamento, batizado, Natal… qualquer ocasião especial merece um topo único.", color: "#dbeafe" },
              { num: "2", emoji: "✏️", title: "Personaliza ao detalhe", desc: "Nome, idade, tema, cores e material. Podes ainda enviar uma imagem de inspiração.", color: "#eff6ff" },
              { num: "3", emoji: "🚀", title: "Recebe o teu topo", desc: "Produzimos e enviamos para qualquer ponto de Portugal em 3-5 dias úteis.", color: "#e0f2fe" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="hover-lift" style={{ background: s.color, borderRadius: 22, padding: "36px 28px", textAlign: "center", border: "1.5px solid rgba(59,130,246,0.15)", cursor: "default" }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, boxShadow: "0 4px 16px rgba(59,130,246,0.15)" }}>{s.emoji}</div>
                  <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 56, fontWeight: 700, color: "rgba(30,58,95,0.08)", lineHeight: 1, marginBottom: -12 }}>{s.num}</div>
                  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, color: "#1e3a5f", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div style={{ textAlign: "center", marginTop: 44 }}>
              <button onClick={() => scrollTo("personalizar")} className="blue-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 100, background: "#3b82f6", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(59,130,246,0.35)", transition: "all 0.2s" }}>
                Começar a personalizar <ArrowRight />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONFIGURATOR ─────────────────────────────────────────────────────────────────── */}
      <section id="personalizar" style={{ padding: "96px 24px", background: "linear-gradient(180deg,#f8faff 0%,#eff6ff 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Configurador</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#1e3a5f", marginBottom: 12 }}>Personalizar o meu topo</h2>
              <p style={{ color: "#64748b", fontSize: 17 }}>Preenche os dados passo a passo e envia o pedido diretamente para o WhatsApp.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ background: "#fff", borderRadius: 28, padding: "clamp(28px,5vw,52px)", boxShadow: "0 16px 56px rgba(30,58,95,0.10)", border: "1.5px solid #e0effe" }}>
              <Configurator onAddToCart={addToCart} initialReference={configReference} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────────────────────── */}
      <section id="categorias" style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Categorias</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#1e3a5f", marginBottom: 12 }}>Topos para cada momento</h2>
              <p style={{ color: "#64748b", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>Cada celebração é única. Escolhe a categoria e cria o topo dos teus sonhos.</p>
            </div>
          </Reveal>
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {CATEGORIES.map((cat) => (
  <div
  key={cat.id}
  className="cat-card"
  onClick={() => {
    setSelectedCategory(cat)
    setDetailsOpen(true)
  }}
  style={{
  background: "#fff",
  borderRadius: 24,
  border: "1.5px solid #dbeafe",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(30,58,95,0.08)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  cursor: "pointer",
}}
>
  <div style={{ position: "relative" }}>
    <img
  src={cat.image}
  alt={cat.name}
  style={{
    width: "100%",
    height: 220,
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
    transition: "transform 0.35s ease",
  }}
/>

    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        background: "rgba(255,255,255,0.95)",
        color: "#3b82f6",
        borderRadius: 100,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      Desde {cat.price}€
    </div>

    {cat.badge && (
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "#3b82f6",
          color: "#fff",
          borderRadius: 100,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {cat.badge}
      </div>
    )}
  </div>

  <div style={{ padding: 22 }}>
    <h3
      style={{
        fontFamily: "'Playfair Display',Georgia,serif",
        fontSize: 20,
        color: "#1e3a5f",
        marginBottom: 8,
      }}
    >
      {cat.emoji} {cat.name}
    </h3>

    <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, minHeight: 74 }}>
      {cat.desc}
    </p>

    <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleCustomizeFromCategory(cat)
        }}
        style={{
          padding: "13px 18px",
          borderRadius: 14,
          border: "none",
          background: "#3b82f6",
          color: "#fff",
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Personalizar este modelo
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          setSelectedCategory(cat)
          setDetailsOpen(true)
        }}
        style={{
          padding: "13px 18px",
          borderRadius: 14,
          border: "2px solid #bfdbfe",
          background: "#fff",
          color: "#3b82f6",
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Ver detalhes
      </button>
    </div>
  </div>
</div>
))}
          </div>
          <Reveal delay={200}>
            <div style={{ marginTop: 36, background: "#eff6ff", borderRadius: 18, padding: "20px 28px", textAlign: "center", border: "1.5px solid #bfdbfe" }}>
              <p style={{ color: "#475569", fontSize: 15, marginBottom: 12 }}>
                <strong style={{ color: "#1e3a5f" }}>Não encontras o que procuras?</strong> Envia-nos uma referência e criamos um design personalizado para ti.
              </p>
              <a href={waLink("Olá! Não encontrei o que procuro no catálogo. Podem criar um topo personalizado para mim?")} target="_blank" rel="noopener noreferrer" className="wa-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 100, background: "#25d366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.3)", transition: "all 0.2s" }}>
                <WaIcon size={16} /> Pedir design personalizado
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────────────────────── */}
      <section id="galeria" style={{ padding: "96px 24px", background: "linear-gradient(180deg,#f8faff 0%,#eff6ff 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Galeria</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#1e3a5f", marginBottom: 12 }}>Exemplos reais dos nossos topos</h2>
              <p style={{ color: "#64748b", fontSize: 17 }}>Inspiração para o teu próximo topo de bolo.</p>
            </div>
          </Reveal>
          <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {GALLERY.map((item, i) => (
              <Reveal key={item.id} delay={i * 70}>
                <div className="hover-lift" style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(30,58,95,0.09)", border: "1.5px solid #e0effe", background: "#fff", cursor: "pointer" }}>
                  <img
  src={item.image}
  alt={`${item.title} — exemplo de topo de bolo para ${item.tag} feito artesanalmente em Portugal`}
  style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
/>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600, marginTop: 2 }}>{item.tag}</div>
                    </div>
                    <button onClick={() => scrollTo("personalizar")} style={{ padding: "7px 14px", borderRadius: 100, border: "none", background: "#3b82f6", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      Personalizar
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI ASSISTANT PROMO ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: 13, fontWeight: 700, color: "#bfdbfe" }}>
              <SparkIcon /> Assistente IA disponível
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,3.5vw,44px)", color: "#fff", marginBottom: 16 }}>Cria o teu topo com ajuda da nossa IA</h2>
            <p style={{ color: "#bfdbfe", fontSize: 17, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 32px" }}>
              Envia uma foto ou descreve o teu topo ideal e o assistente vai ajudar-te a criar o design perfeito — com sugestões de cores, tema e material.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button id="open-ai-chat" onClick={() => { const btn = document.getElementById("ai-fab-btn"); if (btn) btn.click() }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 100, background: "#fff", color: "#1e3a5f", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(0,0,0,0.25)", transition: "all 0.2s" }}>
                <SparkIcon /> Experimentar assistente
              </button>
              <button onClick={() => scrollTo("personalizar")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 100, background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: 16, border: "2px solid rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.2s" }}>
                Usar o configurador
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────────────────── */}
      <section id="precos" style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Preços</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#1e3a5f", marginBottom: 12 }}>Qualidade premium sem pagar caro</h2>
              <p style={{ color: "#64748b", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>Topos artesanais acessíveis para qualquer orçamento. Temos também preços especiais para empresas.</p>
            </div>
          </Reveal>

          <div className="price-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {/* Private customers */}
            <Reveal delay={0}>
              <div style={{ background: "linear-gradient(160deg,#eff6ff,#dbeafe)", borderRadius: 24, padding: "40px 36px", border: "1.5px solid #bfdbfe", boxShadow: "0 8px 32px rgba(59,130,246,0.10)" }}>
                <div style={{ display: "inline-block", background: "#3b82f6", color: "#fff", borderRadius: 100, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Clientes Particulares</div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 48, fontWeight: 700, color: "#1e3a5f", marginBottom: 4, lineHeight: 1 }}>7,90€</div>
                <div style={{ color: "#64748b", fontSize: 15, marginBottom: 28 }}>por topo personalizado</div>
                {[
                  "Nome, idade e tema à escolha",
                  "Cores personalizadas",
                  "Papel couché 250g, glitter ou texturizado",
                  "Envio para todo Portugal",
                  "Produção em 3-5 dias úteis",
                  "Imagem de inspiração aceite",
                ].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11, fontSize: 14, color: "#475569" }}>
                    <span style={{ color: "#3b82f6", flexShrink: 0 }}><CheckIcon size={15} /></span>{f}
                  </div>
                ))}
                <button onClick={() => scrollTo("personalizar")} className="blue-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginTop: 28, padding: "13px 0", borderRadius: 100, background: "#3b82f6", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.3)", transition: "all 0.2s" }}>
                  Personalizar agora <ArrowRight />
                </button>
              </div>
            </Reveal>

            {/* Business */}
            <Reveal delay={120}>
              <div style={{ background: "linear-gradient(160deg,#1e3a5f,#2563eb)", borderRadius: 24, padding: "40px 36px", boxShadow: "0 8px 32px rgba(30,58,95,0.25)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 100, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Empresas & Lojas</div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>Preços especiais</div>
                <div style={{ color: "#93c5fd", fontSize: 15, marginBottom: 28 }}>para lojas e empresas</div>
                {[
                  "Descontos a partir de 10 unidades",
                  "Tabela de preços por volume",
                  "Branding personalizado",
                  "Conta dedicada com suporte",
                  "Produção prioritária",
                  "Fatura disponível",
                ].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11, fontSize: 14, color: "#bfdbfe" }}>
                    <span style={{ color: "#60a5fa", flexShrink: 0 }}><CheckIcon size={15} /></span>{f}
                  </div>
                ))}
                <a href={WA_BUSINESS} target="_blank" rel="noopener noreferrer" className="wa-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginTop: 28, padding: "13px 0", borderRadius: 100, background: "#25d366", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", textDecoration: "none", transition: "all 0.2s" }}>
                  <WaIcon size={17} /> Solicitar preços para empresas
                </a>
              </div>
            </Reveal>
          </div>

          {/* Price table */}
          <Reveal delay={160}>
            <div style={{ marginTop: 44, background: "#f8faff", borderRadius: 20, padding: "28px 32px", border: "1.5px solid #e0effe" }}>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 18, color: "#1e3a5f", marginBottom: 20 }}>Como funciona o orçamento</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#dbeafe" }}>
                      {["Tipo", "Material", "Tamanho", "Preço"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#1e3a5f", fontWeight: 700, fontSize: 13, borderRadius: 0 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
  {[
    ["Base", "Papel Couché 250g", "Modelos personalizados", "Desde 7,90€"],
    ["Acabamento especial", "Papel Glitter", "Conforme o pedido", "Orçamento via WhatsApp"],
    ["Detalhe premium", "Papel Texturizado", "Conforme o pedido", "Orçamento via WhatsApp"],
    ["Papeleria especial", "Papel Decorativo", "Conforme o pedido", "Orçamento via WhatsApp"],
  ].map(([tipo, mat, tam, preco], i) => (
    <tr
      key={i}
      style={{
        borderBottom: "1px solid #e0effe",
        background: i % 2 === 0 ? "#fff" : "#f8faff",
      }}
    >
      <td style={{ padding: "11px 16px", color: "#1e3a5f", fontWeight: 600 }}>{tipo}</td>
      <td style={{ padding: "11px 16px", color: "#475569" }}>{mat}</td>
      <td style={{ padding: "11px 16px", color: "#475569" }}>{tam}</td>
      <td style={{ padding: "11px 16px", color: "#3b82f6", fontWeight: 700 }}>{preco}</td>
    </tr>
  ))}
</tbody>
                </table>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>Como funciona o orçamento. O valor final depende da complexidade do design e dos materiais escolhidos.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg,#f8faff 0%,#eff6ff 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Avaliações</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,3.5vw,40px)", color: "#1e3a5f", marginBottom: 8 }}>O que dizem as nossas clientes</h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {Array(5).fill(0).map((_, i) => <StarIcon key={i} />)}
                <span style={{ color: "#475569", fontSize: 15, marginLeft: 6, fontWeight: 600 }}>5.0 · +200 avaliações</span>
              </div>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {REVIEWS.map((r, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="hover-lift" style={{ background: "#fff", borderRadius: 18, padding: "24px 22px", boxShadow: "0 4px 20px rgba(30,58,95,0.08)", border: "1.5px solid #e0effe" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{Array(5).fill(0).map((_, j) => <StarIcon key={j} />)}</div>
                  <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.65, marginBottom: 16, fontStyle: "italic" }}>&ldquo;{r.text}&rdquo;</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.location}</div>
                    </div>
                    <span style={{ background: "#eff6ff", color: "#3b82f6", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{r.tag}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────────────────────── */}
      <section id="sobre" style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hero-grid">
          <Reveal>
            <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 16px 48px rgba(30,58,95,0.14)", border: "3px solid rgba(59,130,246,0.12)" }}>
              <img src="https://placehold.co/480x380?text=Atelier+artesanal+Portugal+maos+criativas+papel+cores+azul+branco" alt="Atelier artesanal da Mundo de Papel Portugal — mãos a criar topos de bolo personalizados com papel e cores" style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Sobre Nós</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,3vw,40px)", color: "#1e3a5f", marginBottom: 18 }}>Feito com amor, entregue com carinho</h2>
              <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.75, marginBottom: 16 }}>
                A Mundo de Papel Portugal nasceu da paixão por criar decorações únicas e memoráveis. Cada topo de bolo é feito artesanalmente, com atenção ao detalhe e materiais de qualidade.
              </p>
              <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
                Com sede em Portugal, enviamos para todo o país e ilhas. O nosso objetivo é tornar cada celebração ainda mais especial — do batizado ao casamento, do aniversário ao Natal.
              </p>
              {[["1000+", "Topos entregues"], ["5★", "Avaliação média"], ["3-5 dias", "Prazo de produção"]].map(([val, label]) => (
                <div key={label} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", marginRight: 28, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 26, fontWeight: 700, color: "#3b82f6" }}>{val}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────────────────────── */}
      <section id="contacto" style={{ padding: "96px 24px", background: "linear-gradient(180deg,#eff6ff 0%,#dbeafe 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", borderRadius: 100, padding: "5px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Contacto</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#1e3a5f", marginBottom: 12 }}>Fala connosco</h2>
              <p style={{ color: "#64748b", fontSize: 17 }}>Estamos aqui para ajudar a criar o topo perfeito para o teu evento.</p>
            </div>
          </Reveal>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { icon: "💬", title: "WhatsApp", desc: "Resposta em menos de 24h. Envia-nos uma mensagem agora!", action: waLink("Olá! Gostaria de saber mais sobre os vossos topos de bolo personalizados."), label: "Enviar mensagem", color: "#25d366", isWa: true },
              { icon: "📧", title: "Email", desc: "mundodepapel.portugal@gmail.com", action: "mailto:mundodepapel.portugal@gmail.com", label: "Enviar email", color: "#3b82f6", isWa: false },
              { icon: "📸", title: "Instagram", desc: "Segue-nos para mais inspiração e novidades.", action: "https://instagram.com/mundodepapelportugal", label: "Ver Instagram", color: "#e1306c", isWa: false },
              { icon: "🏭", title: "Empresas", desc: "Preços especiais para lojas e empresas. Tabela de preços disponível.", action: WA_BUSINESS, label: "Solicitar tabela de preços", color: "#1e3a5f", isWa: true },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="hover-lift" style={{ background: "#fff", borderRadius: 20, padding: "28px 26px", boxShadow: "0 4px 20px rgba(30,58,95,0.08)", border: "1.5px solid #e0effe", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, color: "#1e3a5f", marginBottom: 8 }}>{c.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>{c.desc}</p>
                  <a href={c.action} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 100, background: c.color, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: `0 4px 16px ${c.color}44`, transition: "all 0.2s" }}>
                    {c.isWa && <WaIcon size={15} />}{c.label}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#1e3a5f", color: "#93c5fd", padding: "40px 24px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎂</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>Mundo de Papel Portugal</div>
                <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 600 }}>Topos de Bolo Artesanais</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#93c5fd", fontSize: 13, fontWeight: 500, padding: "4px 8px" }}>{l.label}</button>
              ))}
            </div>
            <a href={waLink("Olá! Gostaria de fazer uma encomenda.")} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 100, background: "#25d366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              <WaIcon size={16} /> Encomendar
            </a>
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "#60a5fa" }}>
            © {new Date().getFullYear()} Mundo de Papel Portugal · Feito com amor em Portugal
          </div>
        </div>
      </footer>

      {/* ── CART PANEL ───────────────────────────────────────────────────────────────────── */}
      {cartOpen && <CartPanel items={cartItems} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />}
<CategoryDetailsDrawer
  item={selectedCategory}
  open={detailsOpen}
  onClose={() => setDetailsOpen(false)}
  onCustomize={handleCustomizeFromCategory}
/>
      {/* ── AI CHAT WIDGET ───────────────────────────────────────────────────────────────── */}
      <AIChatWidget/>
      
    </div>
  )
}
