"use client"

import { useState, useMemo } from "react"

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Category = "todas" | "casamento" | "aniversário" | "batizado" | "baby-shower" | "comunhão" | "corporativo"
type Material = "todos" | "acrílico" | "madeira" | "cartão" | "misto"
type Sort = "featured" | "price-asc" | "price-desc" | "rating" | "newest"

interface Product {
  id: string; name: string; slug: string; category: Exclude<Category, "todas">
  price: number; comparePrice?: number; image: string; material: Exclude<Material, "todos">
  isNew?: boolean; isBestseller?: boolean; rating: number; reviews: number
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Topo Clássico Casamento", slug: "topo-classico-casamento", category: "casamento", price: 28, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Classico+Casamento", material: "acrílico", isBestseller: true, rating: 4.9, reviews: 142 },
  { id: "p2", name: "Topo Boho Flores", slug: "topo-boho-flores", category: "casamento", price: 32, comparePrice: 38, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Boho+Flores", material: "madeira", isNew: true, rating: 4.8, reviews: 67 },
  { id: "p3", name: "Topo Aniversário Neon", slug: "topo-aniversario-neon", category: "aniversário", price: 22, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Aniversario+Neon", material: "acrílico", isBestseller: true, rating: 4.7, reviews: 98 },
  { id: "p4", name: "Topo Batizado Clássico", slug: "topo-batizado-classico", category: "batizado", price: 19, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Batizado+Classico", material: "acrílico", rating: 4.9, reviews: 55 },
  { id: "p5", name: "Topo Baby Shower Premium", slug: "topo-baby-shower", category: "baby-shower", price: 24, comparePrice: 28, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Baby+Shower", material: "acrílico", isNew: true, rating: 4.8, reviews: 34 },
  { id: "p6", name: "Topo Comunhão Minimalista", slug: "topo-comunhao", category: "comunhão", price: 21, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Comunhao+Minimalista", material: "acrílico", rating: 4.7, reviews: 41 },
  { id: "p7", name: "Topo Corporativo Logo", slug: "topo-corporativo", category: "corporativo", price: 35, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Corporativo+Logo", material: "acrílico", rating: 4.6, reviews: 22 },
  { id: "p8", name: "Topo Infantil Divertido", slug: "topo-infantil", category: "aniversário", price: 18, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Infantil+Divertido", material: "cartão", isBestseller: true, rating: 4.9, reviews: 187 },
  { id: "p9", name: "Topo Casamento Espelhado", slug: "topo-casamento-espelhado", category: "casamento", price: 34, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Casamento+Espelhado", material: "acrílico", rating: 4.8, reviews: 89 },
  { id: "p10", name: "Topo Aniversário Madeira", slug: "topo-aniversario-madeira", category: "aniversário", price: 26, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Aniversario+Madeira", material: "madeira", isNew: true, rating: 4.6, reviews: 31 },
  { id: "p11", name: "Topo Batizado Luxo", slug: "topo-batizado-luxo", category: "batizado", price: 29, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Batizado+Luxo", material: "acrílico", rating: 4.9, reviews: 44 },
  { id: "p12", name: "Topo Baby Shower Misto", slug: "topo-baby-shower-misto", category: "baby-shower", price: 27, image: "https://placehold.co/480x580/ede8e0/2a2a35?text=Topo+Baby+Shower+Misto", material: "misto", rating: 4.7, reviews: 19 },
]

const G = {
  cream: "oklch(0.975 0.012 85)",
  creamDark: "oklch(0.945 0.018 78)",
  charcoal: "oklch(0.20 0.008 260)",
  charcoalLight: "oklch(0.38 0.008 260)",
  gold: "oklch(0.72 0.12 72)",
  border: "oklch(0.90 0.010 80)",
  whatsapp: "oklch(0.62 0.18 145)",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? G.gold : "none"}
          stroke={G.gold} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

function CustomDesignModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"upload" | "details" | "contact" | "success">("upload")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = { current: null as HTMLInputElement | null }
  const orderId = `CO-${Math.floor(10000 + Math.random() * 90000)}`
  const [form, setForm] = useState({ height: "", width: "", quantity: "1", price: "", material: "Acrílico", notes: "", name: "", phone: "", email: "", gdpr: false })

  if (!open) return null
  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) return
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }
  const handleSubmit = async () => {
    setSubmitting(true); await new Promise(r => setTimeout(r, 1400)); setSubmitting(false); setStep("success")
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(42,42,53,0.72)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 520, background: "white", display: "flex", flexDirection: "column", maxHeight: "90vh", overflow: "hidden" }}>
        <div style={{ background: G.charcoal, color: G.cream, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: G.gold, marginBottom: 2 }}>Design Personalizado</p>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "19px", fontWeight: 300 }}>{step === "success" ? "Pedido enviado!" : "Criar o meu topo de bolo"}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "white", opacity: 0.6, cursor: "pointer", lineHeight: 1 }} className="hover:opacity-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        {step !== "success" && (
          <div style={{ background: G.creamDark, borderBottom: `1px solid ${G.border}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {(["upload", "details", "contact"] as const).map((s, i) => {
              const idx = ["upload", "details", "contact"].indexOf(step); const done = i < idx; const active = s === step
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: done || active ? G.charcoal : "transparent", color: done || active ? "white" : G.charcoalLight, border: done || active ? "none" : `1px solid ${G.border}` }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: "10px", color: active ? G.charcoal : G.charcoalLight, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s === "upload" ? "Imagem" : s === "details" ? "Medidas" : "Contacto"}</span>
                  {i < 2 && <div style={{ width: 14, height: 1, background: G.border }} />}
                </div>
              )
            })}
          </div>
        )}
        <div style={{ overflowY: "auto", flex: 1, padding: 24 }}>
          {step === "upload" && (
            <div>
              <p style={{ fontSize: "13px", color: G.charcoalLight, marginBottom: 16, lineHeight: 1.6 }}>Carrega uma imagem de inspiração (JPG, PNG) — a IA irá gerar 3 variantes de design.</p>
              <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                onClick={() => fileRef.current?.click()}
                style={{ border: `2px dashed ${dragOver ? G.charcoal : G.border}`, background: G.creamDark, padding: "36px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                {imagePreview
                  ? <img src={imagePreview} alt="Imagem carregada" style={{ maxHeight: 180, margin: "0 auto", objectFit: "contain" }} />
                  : <div>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.5" style={{ margin: "0 auto 12px" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: G.charcoal, marginBottom: 4 }}>Arrasta ou clica para escolher</p>
                    <p style={{ fontSize: "11px", color: G.charcoalLight }}>JPG, PNG — máx. 10MB</p>
                  </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            </div>
          )}
          {step === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Alto (cm)", "height", "ex: 10"], ["Largo (cm)", "width", "ex: 15"], ["Quantidade", "quantity", "1"], ["Orçamento (€)", "price", "ex: 25"]].map(([label, key, ph]) => (
                  <div key={key}>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, display: "block", marginBottom: 4 }}>{label}</label>
                    <input type="number" placeholder={ph} value={form[key as keyof typeof form] as string}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: "100%", border: `1px solid ${G.border}`, padding: "8px 12px", fontSize: "14px", outline: "none", background: "white" }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, display: "block", marginBottom: 8 }}>Material preferido</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Acrílico", "Madeira", "Cartão", "Misto"].map(m => (
                    <button key={m} onClick={() => setForm(f => ({ ...f, material: m }))}
                      style={{ padding: "10px 14px", border: `1.5px solid ${form.material === m ? G.charcoal : G.border}`, background: form.material === m ? G.charcoal : "white", color: form.material === m ? "white" : G.charcoal, fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, display: "block", marginBottom: 4 }}>Notas adicionais</label>
                <textarea placeholder="Cores, fontes, tema..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                  style={{ width: "100%", border: `1px solid ${G.border}`, padding: "8px 12px", fontSize: "13px", outline: "none", resize: "vertical", background: "white" }} />
              </div>
            </div>
          )}
          {step === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Nome completo *", "name", "text", "O teu nome"], ["WhatsApp *", "phone", "tel", "+351 9XX XXX XXX"], ["Email *", "email", "email", "email@exemplo.com"]].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, display: "block", marginBottom: 4 }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key as keyof typeof form] as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", border: `1px solid ${G.border}`, padding: "10px 12px", fontSize: "14px", outline: "none", background: "white" }} />
                </div>
              ))}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.gdpr} onChange={e => setForm(f => ({ ...f, gdpr: e.target.checked }))} style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: G.charcoalLight, lineHeight: 1.5 }}>Autorizo o contacto por WhatsApp com mockups e orçamento. <a href="/privacidade" style={{ textDecoration: "underline" }}>Privacidade</a></span>
              </label>
              <div style={{ background: G.creamDark, border: `1px solid ${G.border}`, padding: "14px 16px" }}>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, marginBottom: 6 }}>Resumo — {orderId}</p>
                <p style={{ fontSize: "12px", color: G.charcoal, lineHeight: 1.8 }}>
                  Material: <strong>{form.material}</strong> · Medidas: <strong>{form.height || "—"}×{form.width || "—"} cm</strong> · Qtd: <strong>{form.quantity}</strong>
                </p>
              </div>
            </div>
          )}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: G.creamDark, border: `2px solid ${G.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: G.charcoal, marginBottom: 10 }}>Pedido {orderId} recebido!</h3>
              <p style={{ fontSize: "13px", color: G.charcoalLight, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 20px" }}>
                Receberás os <strong>mockups e orçamento</strong> no teu WhatsApp em menos de 2h.
              </p>
              <button onClick={() => { setStep("upload"); setImagePreview(null); onClose() }}
                style={{ background: G.charcoal, color: "white", padding: "12px 32px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                Fechar
              </button>
            </div>
          )}
        </div>
        {step !== "success" && (
          <div style={{ borderTop: `1px solid ${G.border}`, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", flexShrink: 0 }}>
            <button onClick={() => { if (step === "upload") onClose(); else if (step === "details") setStep("upload"); else setStep("details") }}
              style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: G.charcoalLight, background: "none", border: "none", cursor: "pointer" }}>
              {step === "upload" ? "Cancelar" : "Voltar"}
            </button>
            <button
              disabled={(step === "upload" && !imagePreview) || (step === "details" && (!form.height || !form.width)) || (step === "contact" && (!form.name || !form.phone || !form.email || !form.gdpr || submitting))}
              onClick={() => { if (step === "upload") setStep("details"); else if (step === "details") setStep("contact"); else handleSubmit() }}
              style={{ background: G.charcoal, color: "white", padding: "11px 28px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer", opacity: (step === "upload" && !imagePreview) ? 0.4 : (step === "details" && (!form.height || !form.width)) ? 0.4 : (step === "contact" && (!form.name || !form.phone || !form.email || !form.gdpr)) ? 0.4 : 1 }}>
              {submitting ? "A enviar…" : step === "contact" ? "Enviar pedido" : "Continuar"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Catalog Page ────────────────────────────────────────────────────────

export default function CatalogPage() {
  const [category, setCategory] = useState<Category>("todas")
  const [material, setMaterial] = useState<Material>("todos")
  const [maxPrice, setMaxPrice] = useState(100)
  const [sort, setSort] = useState<Sort>("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (category !== "todas") list = list.filter(p => p.category === category)
    if (material !== "todos") list = list.filter(p => p.material === material)
    list = list.filter(p => p.price <= maxPrice)
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price)
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price)
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating)
    else if (sort === "newest") list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    else list.sort((a, b) => ((b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)))
    return list
  }, [category, material, maxPrice, sort, search])

  const addToCart = (id: string) => {
    setCartCount(c => c + 1); setAddedId(id); setTimeout(() => setAddedId(null), 1600)
  }

  const CATS: { value: Category; label: string }[] = [
    { value: "todas", label: "Todas" }, { value: "casamento", label: "Casamento" },
    { value: "aniversário", label: "Aniversário" }, { value: "batizado", label: "Batizado" },
    { value: "baby-shower", label: "Baby Shower" }, { value: "comunhão", label: "Comunhão" },
    { value: "corporativo", label: "Corporativo" },
  ]
  const MATS: { value: Material; label: string }[] = [
    { value: "todos", label: "Todos" }, { value: "acrílico", label: "Acrílico" },
    { value: "madeira", label: "Madeira" }, { value: "cartão", label: "Cartão" }, { value: "misto", label: "Misto" },
  ]

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: G.cream, color: G.charcoal, minHeight: "100vh" }}>

      {/* Announcement */}
      <div style={{ background: G.charcoal, color: G.cream, fontSize: "11px", textAlign: "center", padding: "7px 16px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Mockups IA grátis com cada pedido personalizado
        <span style={{ color: G.gold, margin: "0 16px" }}>✦</span>
        Entrega 3-5 dias úteis
      </div>

      {/* Navbar */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: G.cream, borderBottom: `1px solid ${G.border}` }}>
        <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "21px", fontWeight: 700, color: G.charcoal, letterSpacing: "-0.02em", lineHeight: 1 }}>
              Topo <span style={{ color: G.gold }}>&</span> Bolo
            </p>
            <p style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: G.charcoalLight, marginTop: 1 }}>Cake Toppers</p>
          </a>
          <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }} className="hidden md:flex">
            {[["Catálogo", "/catalogo"], ["Casamento", "/catalogo?cat=casamento"], ["Aniversário", "/catalogo?cat=aniversario"], ["Inspiração", "/#galeria"]].map(([l, h]) => (
              <li key={l}><a href={h} style={{ fontSize: "13px", color: G.charcoalLight, textDecoration: "none" }} className="hover:text-gray-900 transition-colors">{l}</a></li>
            ))}
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: G.charcoal, color: G.cream, padding: "8px 16px", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", border: "none", cursor: "pointer" }} className="hidden sm:flex hover:opacity-90">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              Design IA
            </button>
            <a href="/carrinho" style={{ position: "relative", color: G.charcoal, padding: 6 }} aria-label={`Carrinho ${cartCount}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {cartCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, borderRadius: "50%", background: G.gold, color: G.charcoal, fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </a>
            <button onClick={() => setNavOpen(!navOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: G.charcoal, padding: 4 }} className="md:hidden" aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{navOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}</svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Page header */}
      <div style={{ background: G.creamDark, borderBottom: `1px solid ${G.border}`, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: G.gold, marginBottom: 6 }}>Loja completa</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 300, color: G.charcoal, marginBottom: 4 }}>
            Catálogo de Topos de Bolo
          </h1>
          <p style={{ fontSize: "13px", color: G.charcoalLight }}>{filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 32, alignItems: "flex-start" }}>

        {/* ── SIDEBAR FILTERS (desktop) ───────────────────────────── */}
        <aside style={{ width: 220, flexShrink: 0, position: "sticky", top: 84 }} className="hidden lg:block">
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Search */}
            <div>
              <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, display: "block", marginBottom: 8 }}>Pesquisar</label>
              <div style={{ position: "relative" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome do produto…"
                  style={{ width: "100%", border: `1px solid ${G.border}`, padding: "9px 12px 9px 34px", fontSize: "13px", outline: "none", background: "white" }} />
                <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.charcoalLight} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
            </div>

            {/* Category */}
            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, marginBottom: 10 }}>Categoria</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {CATS.map(c => (
                  <button key={c.value} onClick={() => setCategory(c.value)}
                    style={{ textAlign: "left", padding: "7px 10px", fontSize: "13px", border: "none", cursor: "pointer", background: category === c.value ? G.charcoal : "transparent", color: category === c.value ? "white" : G.charcoal, fontWeight: category === c.value ? 600 : 400, transition: "all 0.15s" }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, marginBottom: 10 }}>Material</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {MATS.map(m => (
                  <button key={m.value} onClick={() => setMaterial(m.value)}
                    style={{ textAlign: "left", padding: "7px 10px", fontSize: "13px", border: "none", cursor: "pointer", background: material === m.value ? G.charcoal : "transparent", color: material === m.value ? "white" : G.charcoal, fontWeight: material === m.value ? 600 : 400, transition: "all 0.15s" }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, marginBottom: 10 }}>Preço máximo: <strong style={{ color: G.charcoal }}>{maxPrice}€</strong></p>
              <input type="range" min={10} max={100} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: G.charcoal }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: G.charcoalLight, marginTop: 4 }}>
                <span>10€</span><span>100€</span>
              </div>
            </div>

            {/* Custom CTA */}
            <div style={{ background: G.charcoal, padding: "18px 16px" }}>
              <p style={{ fontSize: "11px", color: G.gold, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Não encontras?</p>
              <p style={{ fontSize: "12px", color: "rgba(240,234,220,0.75)", lineHeight: 1.5, marginBottom: 14 }}>Cria um design personalizado com IA em minutos.</p>
              <button onClick={() => setModalOpen(true)} style={{ width: "100%", background: G.gold, color: G.charcoal, padding: "10px 0", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer", fontWeight: 700 }}>
                Design IA
              </button>
            </div>
          </div>
        </aside>

        {/* ── PRODUCT GRID ────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
            {/* Mobile filter toggle */}
            <button onClick={() => setFiltersOpen(!filtersOpen)} style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${G.border}`, padding: "8px 14px", fontSize: "12px", background: "white", cursor: "pointer", color: G.charcoal }} className="lg:hidden">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
              Filtros
            </button>

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <label style={{ fontSize: "11px", color: G.charcoalLight, textTransform: "uppercase", letterSpacing: "0.1em" }}>Ordenar:</label>
              <select value={sort} onChange={e => setSort(e.target.value as Sort)}
                style={{ border: `1px solid ${G.border}`, padding: "8px 12px", fontSize: "12px", background: "white", color: G.charcoal, outline: "none", cursor: "pointer" }}>
                <option value="featured">Destaque</option>
                <option value="price-asc">Preço: Menor</option>
                <option value="price-desc">Preço: Maior</option>
                <option value="rating">Melhor Avaliação</option>
                <option value="newest">Mais Recente</option>
              </select>
            </div>
          </div>

          {/* Mobile filters drawer */}
          {filtersOpen && (
            <div style={{ background: G.creamDark, border: `1px solid ${G.border}`, padding: "20px", marginBottom: 20 }} className="lg:hidden">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, marginBottom: 8 }}>Categoria</p>
                  {CATS.map(c => (
                    <button key={c.value} onClick={() => setCategory(c.value)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 8px", fontSize: "13px", border: "none", cursor: "pointer", background: category === c.value ? G.charcoal : "transparent", color: category === c.value ? "white" : G.charcoal }}>
                      {c.label}
                    </button>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, marginBottom: 8 }}>Material</p>
                  {MATS.map(m => (
                    <button key={m.value} onClick={() => setMaterial(m.value)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 8px", fontSize: "13px", border: "none", cursor: "pointer", background: material === m.value ? G.charcoal : "transparent", color: material === m.value ? "white" : G.charcoal }}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active filters */}
          {(category !== "todas" || material !== "todos" || maxPrice < 100) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {category !== "todas" && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${G.border}`, padding: "4px 10px", fontSize: "11px", background: "white" }}>
                  {CATS.find(c => c.value === category)?.label}
                  <button onClick={() => setCategory("todas")} style={{ background: "none", border: "none", cursor: "pointer", color: G.charcoalLight, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              )}
              {material !== "todos" && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${G.border}`, padding: "4px 10px", fontSize: "11px", background: "white" }}>
                  {material}
                  <button onClick={() => setMaterial("todos")} style={{ background: "none", border: "none", cursor: "pointer", color: G.charcoalLight, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              )}
              {maxPrice < 100 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${G.border}`, padding: "4px 10px", fontSize: "11px", background: "white" }}>
                  Até {maxPrice}€
                  <button onClick={() => setMaxPrice(100)} style={{ background: "none", border: "none", cursor: "pointer", color: G.charcoalLight, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 300, color: G.charcoal, marginBottom: 12 }}>Nenhum produto encontrado</p>
              <p style={{ fontSize: "14px", color: G.charcoalLight, marginBottom: 24 }}>Tenta outros filtros ou cria um design personalizado.</p>
              <button onClick={() => setModalOpen(true)} style={{ background: G.charcoal, color: "white", padding: "12px 28px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                Design Personalizado
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
              {filtered.map(p => {
                const disc = p.comparePrice ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : null
                return (
                  <div key={p.id} className="group" style={{ cursor: "pointer" }}>
                    <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: G.creamDark, marginBottom: 12 }}>
                      <img src={p.image} alt={`${p.name} — topo de bolo ${p.category}`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} className="group-hover:scale-105" />
                      <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                        {p.isNew && <span style={{ background: G.charcoal, color: G.cream, fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 7px" }}>Novo</span>}
                        {p.isBestseller && <span style={{ background: G.gold, color: G.charcoal, fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 7px" }}>Bestseller</span>}
                        {disc && <span style={{ background: "oklch(0.62 0.10 12)", color: "white", fontSize: "9px", fontWeight: 700, padding: "3px 7px" }}>-{disc}%</span>}
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", gap: 1, transform: "translateY(100%)", transition: "transform 0.25s" }} className="group-hover:translate-y-0">
                        <button onClick={() => addToCart(p.id)}
                          style={{ flex: 1, padding: "10px 0", background: addedId === p.id ? G.gold : G.charcoal, color: addedId === p.id ? G.charcoal : "white", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                          {addedId === p.id ? "Adicionado!" : "Adicionar"}
                        </button>
                        <button onClick={() => setModalOpen(true)}
                          style={{ background: "white", color: G.charcoal, border: "none", padding: "10px 12px", cursor: "pointer" }} aria-label="Personalizar">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: G.charcoalLight, marginBottom: 3 }}>{p.category}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "14px", fontWeight: 400, color: G.charcoal, lineHeight: 1.3, margin: 0 }}>{p.name}</h2>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 600, color: G.charcoal, margin: 0 }}>{p.price}€</p>
                        {p.comparePrice && <p style={{ fontSize: "11px", color: G.charcoalLight, textDecoration: "line-through", margin: 0 }}>{p.comparePrice}€</p>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                      <Stars rating={p.rating} />
                      <span style={{ fontSize: "10px", color: G.charcoalLight }}>({p.reviews})</span>
                      <span style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${G.border}`, padding: "2px 5px", color: G.charcoalLight }}>{p.material}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: G.charcoal, color: G.cream, padding: "24px", textAlign: "center", marginTop: 48, borderTop: `4px solid ${G.gold}` }}>
        <a href="/" style={{ fontFamily: "Georgia,serif", fontSize: "20px", fontWeight: 700, color: G.cream, textDecoration: "none", letterSpacing: "-0.02em" }}>
          Topo <span style={{ color: G.gold }}>&</span> Bolo
        </a>
        <p style={{ fontSize: "11px", color: "rgba(240,234,220,0.4)", marginTop: 8 }}>© {new Date().getFullYear()} Topo & Bolo. Todos os direitos reservados.</p>
      </footer>

      {/* WhatsApp */}
      <a href="https://wa.me/351900000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 50, width: 48, height: 48, borderRadius: "50%", background: G.whatsapp, color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.18)", textDecoration: "none" }} className="hover:scale-110 transition-transform">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
      </a>

      <CustomDesignModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
