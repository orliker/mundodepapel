"use client"

import { useState } from "react"

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type OrderStatus = "pending" | "in-review" | "in-production" | "shipped" | "delivered" | "cancelled"
type Margin = "high" | "medium" | "low"

interface Order {
  id: string
  type: "standard" | "custom"
  clientName: string
  clientPhone: string
  clientEmail: string
  product: string
  material: string
  quantity: number
  price: number
  status: OrderStatus
  createdAt: string
  whatsappSent: boolean
  whatsappSentAt?: string
  confirmationSent?: boolean
  margin: Margin
  isRepeatClient: boolean
  notes?: string
  imageUrl?: string
  measures?: string
  aiVariants?: string[]
}

const ORDERS: Order[] = [
  {
    id: "CO-12345", type: "custom", clientName: "Alex Ferreira", clientPhone: "+351 912 345 678", clientEmail: "alex@exemplo.com",
    product: "Design Personalizado — Topo de Bolo", material: "Acrílico transparente", quantity: 3, price: 25,
    status: "in-review", createdAt: "2025-06-01T14:32:00Z", whatsappSent: true, whatsappSentAt: "2025-06-01T14:32:45Z",
    confirmationSent: true, margin: "high", isRepeatClient: false, notes: "Cores pastéis, fonte cursiva elegante",
    measures: "Ø12cm / Alto 10cm", imageUrl: "https://placehold.co/80x80/ede8e0/c8b89a?text=IMG",
    aiVariants: ["https://placehold.co/120x120/ede8e0/2a2a35?text=V1", "https://placehold.co/120x120/ede8e0/2a2a35?text=V2", "https://placehold.co/120x120/ede8e0/2a2a35?text=V3"],
  },
  {
    id: "CO-12344", type: "custom", clientName: "Maria Silva", clientPhone: "+351 963 111 222", clientEmail: "maria@exemplo.com",
    product: "Topo Boho Flores — Personalizado", material: "Madeira", quantity: 1, price: 32,
    status: "in-production", createdAt: "2025-05-29T10:10:00Z", whatsappSent: true, whatsappSentAt: "2025-05-29T10:10:30Z",
    margin: "medium", isRepeatClient: true, notes: "Tema flores silvestres, tons terracota", measures: "18x12cm",
    imageUrl: "https://placehold.co/80x80/ede8e0/c8b89a?text=IMG",
  },
  {
    id: "ST-00891", type: "standard", clientName: "João Costa", clientPhone: "+351 934 567 890", clientEmail: "joao@exemplo.com",
    product: "Topo Clássico Casamento × 2", material: "Acrílico", quantity: 2, price: 56,
    status: "shipped", createdAt: "2025-05-25T09:00:00Z", whatsappSent: false,
    margin: "high", isRepeatClient: false,
  },
  {
    id: "CO-12343", type: "custom", clientName: "Beatriz Santos", clientPhone: "+351 910 999 888", clientEmail: "bia@exemplo.com",
    product: "Topo Corporativo — Logo Empresa", material: "Acrílico espelhado", quantity: 5, price: 40,
    status: "delivered", createdAt: "2025-05-20T09:00:00Z", whatsappSent: true, whatsappSentAt: "2025-05-20T09:00:45Z",
    confirmationSent: true, margin: "high", isRepeatClient: true, measures: "20×12cm",
    imageUrl: "https://placehold.co/80x80/ede8e0/c8b89a?text=IMG",
  },
  {
    id: "ST-00887", type: "standard", clientName: "Rui Mendes", clientPhone: "+351 966 444 333", clientEmail: "rui@exemplo.com",
    product: "Topo Aniversário Neon × 1", material: "Acrílico", quantity: 1, price: 22,
    status: "pending", createdAt: "2025-06-02T08:44:00Z", whatsappSent: false,
    margin: "low", isRepeatClient: false,
  },
  {
    id: "CO-12342", type: "custom", clientName: "Carla Pinto", clientPhone: "+351 924 777 555", clientEmail: "carla@exemplo.com",
    product: "Topo Batizado Personalizado", material: "Cartão premium", quantity: 2, price: 19,
    status: "cancelled", createdAt: "2025-05-18T16:00:00Z", whatsappSent: true,
    margin: "low", isRepeatClient: false, notes: "Cliente cancelou — alteração de data",
  },
]

const G = {
  cream: "oklch(0.975 0.012 85)",
  creamDark: "oklch(0.945 0.018 78)",
  charcoal: "oklch(0.20 0.008 260)",
  charcoalLight: "oklch(0.38 0.008 260)",
  gold: "oklch(0.72 0.12 72)",
  border: "oklch(0.90 0.010 80)",
  sidebar: "oklch(0.18 0.008 260)",
  sidebarBorder: "oklch(0.28 0.008 260)",
  green: "oklch(0.62 0.18 145)",
  red: "oklch(0.58 0.20 25)",
  blue: "oklch(0.55 0.15 240)",
  amber: "oklch(0.72 0.15 72)",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendente", "in-review": "Em análise", "in-production": "Em produção",
  shipped: "Enviado", delivered: "Entregue", cancelled: "Cancelado",
}
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: G.amber, "in-review": G.blue, "in-production": G.gold,
  shipped: G.green, delivered: G.green, cancelled: G.red,
}
const MARGIN_LABEL: Record<Margin, string> = { high: "Alto", medium: "Médio", low: "Baixo" }
const MARGIN_COLOR: Record<Margin, string> = { high: G.green, medium: G.amber, low: G.red }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}
function totalRevenue(orders: Order[]) { return orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.price * o.quantity, 0) }
function avgResponse() { return "1h 42m" }

// ─── WhatsApp Message Preview ─────────────────────────────────────────────────

function WAPreview({ order }: { order: Order }) {
  const vendorMsg = `📩 Novo pedido ${order.type === "custom" ? "PERSONALIZADO" : "STANDARD"} — ${order.id}
Cliente: ${order.clientName}
Tel: ${order.clientPhone}
Email: ${order.clientEmail}
Produto: ${order.product}
${order.measures ? `Medidas: ${order.measures}` : ""}
Quantidade: ${order.quantity}
Preço unit.: ${order.price}€
Material: ${order.material}
${order.notes ? `Notas: ${order.notes}` : ""}
Vista previa: https://admin.topobolo.pt/pedidos/${order.id}`

  const clientMsg = `✅ A tua solicitação foi recebida. Pedido ${order.id} — Contactar-te-emos por este WhatsApp em menos de 2h com mockups e orçamento final. Obrigado!`

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, marginBottom: 8 }}>Mensagem ao vendedor</p>
        <div style={{ background: "#ECF5E3", border: "1px solid #C5E1A5", borderRadius: 8, padding: "12px 14px", fontFamily: "monospace", fontSize: "12px", color: "#1B4332", whiteSpace: "pre-line", lineHeight: 1.7 }}>
          {vendorMsg}
        </div>
      </div>
      <div>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: G.charcoalLight, marginBottom: 8 }}>Confirmação ao cliente</p>
        <div style={{ background: "#E3F2FD", border: "1px solid #90CAF9", borderRadius: 8, padding: "12px 14px", fontFamily: "monospace", fontSize: "12px", color: "#1565C0", lineHeight: 1.7 }}>
          {clientMsg}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const [activeTab, setActiveTab] = useState<"all" | "custom" | "standard" | "pending">("all")
  const [selected, setSelected] = useState<Order | null>(null)
  const [detailTab, setDetailTab] = useState<"info" | "whatsapp" | "ai">("info")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filtered = orders.filter(o => {
    if (activeTab === "custom") return o.type === "custom"
    if (activeTab === "standard") return o.type === "standard"
    if (activeTab === "pending") return o.status === "pending" || o.status === "in-review"
    return true
  })

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const stats = [
    { label: "Pedidos totais", value: orders.length, icon: <rect x="3" y="3" width="18" height="18" rx="2" />, color: G.blue },
    { label: "Receita total", value: `${totalRevenue(orders)}€`, icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>, color: G.green },
    { label: "Personalizados", value: orders.filter(o => o.type === "custom").length, icon: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />, color: G.gold },
    { label: "Tempo médio resposta", value: avgResponse(), icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, color: G.amber },
    { label: "Clientes recorrentes", value: `${orders.filter(o => o.isRepeatClient).length}`, icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>, color: G.blue },
    { label: "WhatsApp enviados", value: orders.filter(o => o.whatsappSent).length, icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />, color: G.green },
  ]

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter',system-ui,sans-serif", background: G.creamDark, color: G.charcoal, overflow: "hidden" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside style={{ width: sidebarOpen ? 220 : 64, background: G.sidebar, color: G.cream, display: "flex", flexDirection: "column", transition: "width 0.25s", flexShrink: 0, overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${G.sidebarBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <div>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "17px", fontWeight: 700, color: G.cream, letterSpacing: "-0.01em", lineHeight: 1 }}>
                Topo <span style={{ color: G.gold }}>&</span> Bolo
              </p>
              <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,234,220,0.4)", marginTop: 2 }}>Admin</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,234,220,0.5)", padding: 4, flexShrink: 0 }} className="hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Pedidos", icon: <rect x="3" y="3" width="18" height="18" rx="2" />, active: true },
            { label: "Produtos", icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>, active: false },
            { label: "Clientes", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></>, active: false },
            { label: "Analytics", icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>, active: false },
            { label: "Configurações", icon: <><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></>, active: false },
          ].map(item => (
            <button key={item.label}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 4, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: item.active ? "rgba(200,184,154,0.15)" : "transparent", color: item.active ? G.gold : "rgba(240,234,220,0.65)", transition: "all 0.15s", flexShrink: 0 }}
              className="hover:bg-white/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}>{item.icon}</svg>
              {sidebarOpen && <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${G.sidebarBorder}` }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", color: "rgba(240,234,220,0.5)", textDecoration: "none", fontSize: "12px" }} className="hover:text-white transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            {sidebarOpen && "Ver loja"}
          </a>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ background: "white", borderBottom: `1px solid ${G.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: G.charcoal, lineHeight: 1 }}>Painel de Pedidos</h1>
            <p style={{ fontSize: "12px", color: G.charcoalLight, marginTop: 2 }}>{new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: G.green, color: "white", border: "none", padding: "8px 14px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontWeight: 600 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
              WhatsApp
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: G.gold, color: G.charcoal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>A</div>
          </div>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "white", border: `1px solid ${G.border}`, padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: G.charcoalLight }}>{s.label}</p>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2">{s.icon}</svg>
                </div>
                <p style={{ fontSize: "24px", fontFamily: "Georgia,serif", fontWeight: 600, color: G.charcoal, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Main panel: list + detail */}
          <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>

            {/* Orders list */}
            <div style={{ flex: selected ? "0 0 55%" : "1", minWidth: 0, background: "white", border: `1px solid ${G.border}`, display: "flex", flexDirection: "column", transition: "flex 0.2s" }}>
              {/* List header */}
              <div style={{ borderBottom: `1px solid ${G.border}`, padding: "0 16px", display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
                {(["all", "custom", "standard", "pending"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ padding: "12px 14px", fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: activeTab === tab ? G.charcoal : G.charcoalLight, borderBottom: `2px solid ${activeTab === tab ? G.charcoal : "transparent"}`, fontWeight: activeTab === tab ? 600 : 400, transition: "all 0.15s", whiteSpace: "nowrap" }}>
                    {tab === "all" ? "Todos" : tab === "custom" ? "Personalizados" : tab === "standard" ? "Standard" : "Pendentes"}
                    <span style={{ marginLeft: 6, fontSize: "10px", background: activeTab === tab ? G.gold : G.creamDark, color: activeTab === tab ? G.charcoal : G.charcoalLight, padding: "1px 6px", borderRadius: 10 }}>
                      {tab === "all" ? orders.length : tab === "custom" ? orders.filter(o => o.type === "custom").length : tab === "standard" ? orders.filter(o => o.type === "standard").length : orders.filter(o => o.status === "pending" || o.status === "in-review").length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Table */}
              <div style={{ overflowY: "auto", flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${G.border}`, background: G.creamDark }}>
                      {["Pedido", "Cliente", "Produto", "Valor", "Margem", "Estado", "WA", ""].map(h => (
                        <th key={h} style={{ padding: "9px 12px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(o => (
                      <tr key={o.id}
                        onClick={() => setSelected(selected?.id === o.id ? null : o)}
                        style={{ borderBottom: `1px solid ${G.border}`, cursor: "pointer", background: selected?.id === o.id ? "oklch(0.96 0.015 80)" : "white", transition: "background 0.15s" }}
                        className="hover:bg-amber-50">
                        <td style={{ padding: "11px 12px" }}>
                          <p style={{ fontSize: "12px", fontWeight: 600, color: G.charcoal, marginBottom: 1 }}>{o.id}</p>
                          <p style={{ fontSize: "10px", color: G.charcoalLight }}>{formatDate(o.createdAt).split(",")[0]}</p>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <p style={{ fontSize: "12px", color: G.charcoal }}>{o.clientName}</p>
                          {o.isRepeatClient && <span style={{ fontSize: "9px", background: "oklch(0.90 0.06 82)", color: G.charcoal, padding: "1px 5px", borderRadius: 2, fontWeight: 600 }}>Recorrente</span>}
                        </td>
                        <td style={{ padding: "11px 12px", maxWidth: 160 }}>
                          <p style={{ fontSize: "12px", color: G.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</p>
                          <p style={{ fontSize: "10px", color: G.charcoalLight }}>Qtd: {o.quantity} · {o.material}</p>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <p style={{ fontSize: "13px", fontFamily: "Georgia,serif", fontWeight: 600, color: G.charcoal }}>{o.price * o.quantity}€</p>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: MARGIN_COLOR[o.margin], textTransform: "uppercase", letterSpacing: "0.08em" }}>{MARGIN_LABEL[o.margin]}</span>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "10px", fontWeight: 600, color: STATUS_COLORS[o.status], background: STATUS_COLORS[o.status] + "22", padding: "3px 8px", borderRadius: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLORS[o.status] }} />
                            {STATUS_LABELS[o.status]}
                          </span>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          {o.whatsappSent
                            ? <span title={o.whatsappSentAt} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: G.green + "22" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                            </span>
                            : <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: G.red + "22" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={G.red} strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </span>}
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.charcoalLight} strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ flex: "0 0 44%", background: "white", border: `1px solid ${G.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Detail header */}
                <div style={{ borderBottom: `1px solid ${G.border}`, padding: "14px 18px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
                  <div>
                    <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: G.charcoalLight, marginBottom: 2 }}>
                      {selected.type === "custom" ? "Pedido Personalizado" : "Pedido Standard"}
                    </p>
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 400, color: G.charcoal, lineHeight: 1 }}>{selected.id}</h2>
                    <p style={{ fontSize: "11px", color: G.charcoalLight, marginTop: 3 }}>{formatDate(selected.createdAt)}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: G.charcoalLight, padding: 4 }} className="hover:text-gray-900">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>

                {/* Status changer */}
                <div style={{ borderBottom: `1px solid ${G.border}`, padding: "12px 18px", background: G.creamDark, display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight }}>Estado:</p>
                  {(["pending", "in-review", "in-production", "shipped", "delivered", "cancelled"] as OrderStatus[]).map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 8px", border: `1.5px solid ${selected.status === s ? STATUS_COLORS[s] : G.border}`, background: selected.status === s ? STATUS_COLORS[s] + "20" : "white", color: selected.status === s ? STATUS_COLORS[s] : G.charcoalLight, cursor: "pointer", transition: "all 0.15s" }}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>

                {/* Detail tabs */}
                <div style={{ borderBottom: `1px solid ${G.border}`, padding: "0 18px", display: "flex", gap: 0, flexShrink: 0 }}>
                  {(["info", "whatsapp", "ai"] as const).map(t => (
                    <button key={t} onClick={() => setDetailTab(t)}
                      style={{ padding: "10px 14px", fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: detailTab === t ? G.charcoal : G.charcoalLight, borderBottom: `2px solid ${detailTab === t ? G.charcoal : "transparent"}`, fontWeight: detailTab === t ? 600 : 400, transition: "all 0.15s" }}>
                      {t === "info" ? "Detalhes" : t === "whatsapp" ? "WhatsApp" : "Variantes IA"}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div style={{ overflowY: "auto", flex: 1, padding: "18px" }}>
                  {detailTab === "info" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Client */}
                      <div style={{ background: G.creamDark, border: `1px solid ${G.border}`, padding: "14px 16px" }}>
                        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: G.charcoalLight, marginBottom: 10 }}>Cliente</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: G.charcoal }}>{selected.clientName}
                            {selected.isRepeatClient && <span style={{ marginLeft: 8, fontSize: "9px", background: "oklch(0.90 0.06 82)", color: G.charcoal, padding: "2px 6px", fontWeight: 600 }}>Recorrente</span>}
                          </p>
                          <a href={`tel:${selected.clientPhone}`} style={{ fontSize: "13px", color: G.blue, textDecoration: "none" }}>{selected.clientPhone}</a>
                          <a href={`mailto:${selected.clientEmail}`} style={{ fontSize: "13px", color: G.blue, textDecoration: "none" }}>{selected.clientEmail}</a>
                        </div>
                      </div>
                      {/* Product */}
                      <div style={{ background: G.creamDark, border: `1px solid ${G.border}`, padding: "14px 16px" }}>
                        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: G.charcoalLight, marginBottom: 10 }}>Produto</p>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          {selected.imageUrl && <img src={selected.imageUrl} alt="Imagem do pedido" style={{ width: 64, height: 64, objectFit: "cover", flexShrink: 0 }} />}
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: G.charcoal, marginBottom: 4 }}>{selected.product}</p>
                            <p style={{ fontSize: "12px", color: G.charcoalLight, lineHeight: 1.6 }}>
                              Material: {selected.material}<br />
                              {selected.measures && <>Medidas: {selected.measures}<br /></>}
                              Quantidade: {selected.quantity}<br />
                              Preço unit.: <strong style={{ color: G.charcoal }}>{selected.price}€</strong><br />
                              Total: <strong style={{ color: G.charcoal, fontSize: "14px" }}>{selected.price * selected.quantity}€</strong>
                            </p>
                          </div>
                        </div>
                        {selected.notes && (
                          <div style={{ marginTop: 10, padding: "10px 12px", background: "oklch(0.90 0.06 82 / 0.3)", borderLeft: `3px solid ${G.gold}` }}>
                            <p style={{ fontSize: "11px", color: G.charcoalLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Notas do cliente</p>
                            <p style={{ fontSize: "13px", color: G.charcoal, fontStyle: "italic" }}>{selected.notes}</p>
                          </div>
                        )}
                      </div>
                      {/* Analytics tags */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, border: `1px solid ${MARGIN_COLOR[selected.margin]}`, color: MARGIN_COLOR[selected.margin], padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          Margem {MARGIN_LABEL[selected.margin]}
                        </span>
                        {selected.isRepeatClient && <span style={{ fontSize: "10px", fontWeight: 700, border: `1px solid ${G.blue}`, color: G.blue, padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Cliente Recorrente</span>}
                        <span style={{ fontSize: "10px", fontWeight: 700, border: `1px solid ${selected.type === "custom" ? G.gold : G.border}`, color: selected.type === "custom" ? G.gold : G.charcoalLight, padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          {selected.type === "custom" ? "Personalizado" : "Standard"}
                        </span>
                      </div>
                    </div>
                  )}

                  {detailTab === "whatsapp" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Status */}
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 1, background: G.creamDark, border: `1px solid ${G.border}`, padding: "12px 14px" }}>
                          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, marginBottom: 4 }}>Msg. vendedor</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {selected.whatsappSent
                              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg><span style={{ fontSize: "12px", color: G.green, fontWeight: 600 }}>Enviada</span></>
                              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.red} strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg><span style={{ fontSize: "12px", color: G.red, fontWeight: 600 }}>Não enviada</span></>}
                          </div>
                          {selected.whatsappSentAt && <p style={{ fontSize: "10px", color: G.charcoalLight, marginTop: 3 }}>{formatDate(selected.whatsappSentAt)}</p>}
                        </div>
                        <div style={{ flex: 1, background: G.creamDark, border: `1px solid ${G.border}`, padding: "12px 14px" }}>
                          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: G.charcoalLight, marginBottom: 4 }}>Confirmação cliente</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {selected.confirmationSent
                              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg><span style={{ fontSize: "12px", color: G.green, fontWeight: 600 }}>Enviada</span></>
                              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.charcoalLight} strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg><span style={{ fontSize: "12px", color: G.charcoalLight }}>Pendente</span></>}
                          </div>
                        </div>
                      </div>
                      <WAPreview order={selected} />
                      {!selected.whatsappSent && (
                        <button onClick={() => setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, whatsappSent: true, whatsappSentAt: new Date().toISOString() } : o))}
                          style={{ background: G.green, color: "white", border: "none", padding: "12px 0", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontWeight: 600, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
                          Enviar agora via WhatsApp
                        </button>
                      )}
                    </div>
                  )}

                  {detailTab === "ai" && (
                    <div>
                      {selected.aiVariants && selected.aiVariants.length > 0 ? (
                        <div>
                          <p style={{ fontSize: "13px", color: G.charcoalLight, marginBottom: 16, lineHeight: 1.6 }}>Variantes geradas pela IA com base na imagem e especificações do cliente.</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                            {selected.aiVariants.map((v, i) => (
                              <div key={i} style={{ border: `1px solid ${G.border}`, overflow: "hidden" }}>
                                <img src={v} alt={`Variante IA ${i + 1}`} style={{ width: "100%", display: "block" }} />
                                <div style={{ padding: "8px 10px", background: G.creamDark }}>
                                  <p style={{ fontSize: "10px", fontWeight: 600, color: G.charcoal }}>Variante {i + 1}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ flex: 1, background: G.charcoal, color: "white", border: "none", padding: "10px", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                              Enviar variantes ao cliente
                            </button>
                            <button style={{ background: G.creamDark, color: G.charcoal, border: `1px solid ${G.border}`, padding: "10px 14px", fontSize: "10px", cursor: "pointer" }}>
                              Gerar novas
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={G.border} strokeWidth="1.5" style={{ margin: "0 auto 12px" }}>
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <p style={{ fontSize: "14px", color: G.charcoalLight, marginBottom: 16 }}>Sem variantes IA para este pedido</p>
                          <button style={{ background: G.charcoal, color: "white", border: "none", padding: "10px 20px", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                            Gerar variantes IA
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
