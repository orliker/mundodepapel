import Link from 'next/link'
import { Instagram, MessageCircle, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <p
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Topo <span className="text-[var(--gold)]">&</span> Bolo
            </p>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--cream)]/50 font-[var(--font-body)] mt-1">
              Cake Toppers Personalizados
            </p>
          </div>
          <p className="text-sm text-[var(--cream)]/60 leading-relaxed font-[var(--font-body)] max-w-xs">
            Transformamos os teus momentos especiais em arte. Design personalizado com IA, materiais premium, entrega rápida.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[var(--cream)]/20 flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://wa.me/351900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[var(--cream)]/20 flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={15} />
            </a>
            <a
              href="mailto:hello@topobolo.pt"
              className="w-9 h-9 border border-[var(--cream)]/20 flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              aria-label="Email"
            >
              <Mail size={15} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--cream)]/50 mb-4 font-[var(--font-body)]">Loja</h3>
          <ul className="space-y-2.5">
            {[
              { href: '/catalogo', label: 'Todos os produtos' },
              { href: '/catalogo?categoria=casamento', label: 'Casamento' },
              { href: '/catalogo?categoria=aniversário', label: 'Aniversário' },
              { href: '/catalogo?categoria=batizado', label: 'Batizado' },
              { href: '/personalizado', label: 'Design Personalizado' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[var(--cream)]/70 hover:text-[var(--gold)] transition-colors font-[var(--font-body)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--cream)]/50 mb-4 font-[var(--font-body)]">Informação</h3>
          <ul className="space-y-2.5">
            {[
              { href: '/sobre', label: 'Sobre nós' },
              { href: '/faq', label: 'FAQ' },
              { href: '/envios', label: 'Envios & Devoluções' },
              { href: '/privacidade', label: 'Política de Privacidade' },
              { href: '/termos', label: 'Termos e Condições' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[var(--cream)]/70 hover:text-[var(--gold)] transition-colors font-[var(--font-body)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--cream)]/50 mb-4 font-[var(--font-body)]">Contacto</h3>
          <div className="space-y-3 text-sm text-[var(--cream)]/70 font-[var(--font-body)]">
            <p>Resposta WhatsApp em menos de 2h</p>
            <a
              href="https://wa.me/351900000000"
              className="inline-flex items-center gap-2 bg-[var(--whatsapp)] text-[var(--cream)] px-4 py-2.5 text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
            <p className="mt-2">hello@topobolo.pt</p>
          </div>

          <div className="mt-6 p-4 border border-[var(--cream)]/10 bg-[var(--cream)]/5">
            <p className="text-xs text-[var(--cream)]/50 font-[var(--font-body)] mb-2 tracking-wide uppercase">Newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="O teu email"
                className="flex-1 bg-transparent border border-[var(--cream)]/20 px-3 py-2 text-sm text-[var(--cream)] placeholder:text-[var(--cream)]/30 outline-none focus:border-[var(--gold)] transition-colors font-[var(--font-body)]"
              />
              <button className="bg-[var(--gold)] text-[var(--charcoal)] px-3 py-2 text-xs font-semibold hover:opacity-90 transition-opacity font-[var(--font-body)]">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--cream)]/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--cream)]/30 font-[var(--font-body)]">
            &copy; {new Date().getFullYear()} Topo & Bolo. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3 text-xs text-[var(--cream)]/30 font-[var(--font-body)]">
            <span>GDPR Compliant</span>
            <span className="text-[var(--gold)]/40">|</span>
            <span>Pagamento seguro</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
