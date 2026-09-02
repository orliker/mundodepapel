import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { Categories } from '@/components/categories'
import { Configurator } from '@/components/configurator'
import { Gallery } from '@/components/gallery'
import { Assistant } from '@/components/assistant'
import { Reveal } from '@/components/reveal'
import { site, wa, eur } from '@/lib/site'
import { FAQS, QUOTES, MATERIALS } from '@/lib/content'
import {
  ArrowRight, Check, WhatsAppIcon, Sparkle, Star, MailIcon, InstagramIcon,
  TruckIcon, ScissorsIcon, ClockIcon, Plus,
} from '@/components/icons'

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const productLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Topo de bolo personalizado em papel',
  description:
    'Topo de bolo personalizado, recortado e montado à mão em papel couché 250g, papel glitter, papel texturizado ou papel decorativo. Nome, idade, tema e cores à escolha.',
  image: [
    `${site.url}/images/aniversario-kpop.webp`,
    `${site.url}/images/batizado-pomba-dourada.webp`,
    `${site.url}/images/bodas-ouro-prata.webp`,
  ],
  brand: { '@type': 'Brand', name: site.name },
  material: 'Papel',
  category: 'Decoração de bolos',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'EUR',
    lowPrice: '7.90',
    offerCount: 9,
    availability: 'https://schema.org/InStock',
    areaServed: 'PT',
    seller: { '@id': `${site.url}/#organizacao` },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    reviewCount: String(QUOTES.length),
  },
  review: QUOTES.map((q) => ({
    '@type': 'Review',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    author: { '@type': 'Person', name: q.author },
    reviewBody: q.text,
  })),
}

const ASSURANCES = [
  { icon: ScissorsIcon, title: 'Recortado à mão', text: 'Cada camada é cortada e montada uma a uma, sem produção em série.' },
  { icon: ClockIcon, title: `Pronto em ${site.productionDays}`, text: 'Mais o tempo de envio. Épocas fortes pedem antecedência.' },
  { icon: TruckIcon, title: 'Envio para todo o país', text: `${site.shipping}. Portes confirmados antes de fechares.` },
  { icon: Sparkle, title: 'Orçamento sem compromisso', text: 'Vês o preço final antes de produzirmos seja o que for.' },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />

      <SiteHeader />

      <main id="conteudo">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="section hero" id="topo">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Feito à mão em Portugal</p>

              <h1>Topos de bolo personalizados, recortados à mão em papel</h1>

              <p className="lead">
                Do nome de quem faz anos ao cenário completo da festa. Cortamos e montamos cada camada
                em papel couché, glitter ou texturizado, e enviamos pronto a espetar no bolo.
              </p>

              <div className="hero-cta">
                <a className="btn btn-primary" href="#personalizar">
                  Montar o meu topo <ArrowRight />
                </a>
                <a className="btn btn-ghost" href="#trabalhos">Ver trabalhos</a>
              </div>

              <dl className="hero-facts">
                <div>
                  <dd className="hero-fact-value num">{eur(site.priceFrom)}</dd>
                  <dt className="hero-fact-label">preço de partida</dt>
                </div>
                <div>
                  <dd className="hero-fact-value num">3 a 5</dd>
                  <dt className="hero-fact-label">dias úteis de produção</dt>
                </div>
                <div>
                  <dd className="hero-fact-value">Todo o país</dd>
                  <dt className="hero-fact-label">continente e ilhas</dt>
                </div>
              </dl>
            </div>

            <div className="hero-stack">
              <div className="hero-stack-main frame">
                <div className="photo">
                  {/* imagen mas grande de la primera pantalla: se carga con prioridad */}
                  <Image
                    src="/images/aniversario-kpop.webp"
                    alt="Bolo de aniversário roxo com topo em papel personalizado: o nome Ema, o número 8 e figuras recortadas"
                    width={900}
                    height={1350}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 960px) 90vw, 460px"
                  />
                </div>
              </div>

              <div className="hero-stack-side hero-stack-side-a frame">
                <div className="photo">
                  <Image
                    src="/images/dia-da-mae-rosas-conjunto.webp"
                    alt="Rosas de papel bordô com folhas douradas, montadas pétala a pétala"
                    width={1200}
                    height={800}
                    sizes="190px"
                  />
                </div>
              </div>

              <div className="hero-stack-side hero-stack-side-b frame">
                <div className="photo">
                  <Image
                    src="/images/batizado-pomba-branca.webp"
                    alt="Pomba branca recortada em papel, com asas abertas"
                    width={1024}
                    height={1024}
                    sizes="190px"
                  />
                </div>
              </div>

              <p className="hero-price">
                <strong className="num">{eur(site.priceFrom)}</strong>
                <span>a partir de</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Garantias ────────────────────────────────────────────────── */}
        <div className="container">
          <ul className="assurances">
            {ASSURANCES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span style={{ color: 'var(--gold)', display: 'block', marginBottom: 'var(--s-3)' }}>
                  <Icon size={22} />
                </span>
                <p className="assurance-title">{title}</p>
                <p className="assurance-text">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Categorias ───────────────────────────────────────────────── */}
        <section className="section" id="categorias">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <p className="eyebrow">Categorias</p>
                <h2>Para cada ocasião, uma peça diferente</h2>
                <p className="lead">
                  Nove famílias de trabalhos, todas personalizáveis. Abre uma para ver as fotos, o que
                  se personaliza e a partir de quanto fica.
                </p>
              </div>
            </Reveal>
            <Categories />
          </div>
        </section>

        {/* ── Como funciona ────────────────────────────────────────────── */}
        <section className="section section-sunken" id="como-funciona">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <p className="eyebrow">Como funciona</p>
                <h2>Três passos, sem surpresas no fim</h2>
              </div>
            </Reveal>

            <ol className="steps">
              {[
                {
                  n: 'Passo 01',
                  t: 'Dizes-nos o que imaginas',
                  d: 'Usa o configurador aqui ao lado ou escreve-nos no WhatsApp. O nome, a ocasião e as cores chegam para começarmos. Se tiveres uma foto de referência, ainda melhor.',
                },
                {
                  n: 'Passo 02',
                  t: 'Aprovas o desenho e o preço',
                  d: 'Respondemos em menos de 24 horas com a proposta, o orçamento fechado e o prazo. Só entramos em produção depois de dizeres que sim.',
                },
                {
                  n: 'Passo 03',
                  t: 'Recebes em casa',
                  d: `Cortamos, montamos e embalamos com cuidado. Produção em ${site.productionDays} e envio para ${site.shipping}.`,
                },
              ].map((s, i) => (
                <Reveal as="li" key={s.n} delay={i * 90}>
                  <div className="step">
                    <p className="step-num">{s.n}</p>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Configurador ─────────────────────────────────────────────── */}
        <section className="section" id="personalizar">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <p className="eyebrow">Personalizar</p>
                <h2>Monta o teu topo em cinco passos</h2>
                <p className="lead">
                  Não pagas nada aqui. No fim, abrimos o WhatsApp com o pedido já escrito para que
                  possas rever antes de enviar.
                </p>
              </div>
            </Reveal>
            <Configurator />
          </div>
        </section>

        {/* ── Trabalhos ────────────────────────────────────────────────── */}
        <section className="section section-sunken" id="trabalhos">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <p className="eyebrow">Trabalhos</p>
                <h2>Peças que já saíram daqui</h2>
                <p className="lead">Fotografias reais de encomendas entregues. Carrega numa para a ver maior.</p>
              </div>
            </Reveal>
            <Gallery />
          </div>
        </section>

        {/* ── Preços ───────────────────────────────────────────────────── */}
        <section className="section" id="precos">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <p className="eyebrow">Preços</p>
                <h2>O que custa e porquê</h2>
                <p className="lead">
                  Preferimos dizer-te como se forma o preço a mostrar-te um número que não se cumpre.
                </p>
              </div>
            </Reveal>

            <div className="price-grid">
              <Reveal>
                <div className="card price-card">
                  <span className="badge">Particulares</span>
                  <p className="price-value num">{eur(site.priceFrom)}</p>
                  <p className="price-desc">por topo, a partir de</p>
                  <div className="price-features">
                    {[
                      'Nome, idade e tema à escolha',
                      'Cores combinadas com o teu bolo',
                      'Quatro papéis disponíveis',
                      'Três tamanhos, do pequeno ao grande',
                      'Aceitamos imagem de referência',
                      `Produção em ${site.productionDays}`,
                    ].map((f) => (
                      <p className="price-feature" key={f}><Check size={15} />{f}</p>
                    ))}
                  </div>
                  <a className="btn btn-primary btn-block" href="#personalizar">
                    Montar o meu topo <ArrowRight />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={110}>
                <div className="card price-card price-card-dark">
                  <span className="badge badge-gold">Lojas e empresas</span>
                  <p className="price-value">Tabela por volume</p>
                  <p className="price-desc">a partir de {site.bulkFrom} unidades</p>
                  <div className="price-features">
                    {[
                      'Desconto por quantidade',
                      'Produção prioritária',
                      'Peças com a vossa marca',
                      'Fatura com NIF',
                      'Conjuntos para revenda',
                      'Acompanhamento directo',
                    ].map((f) => (
                      <p className="price-feature" key={f}><Check size={15} />{f}</p>
                    ))}
                  </div>
                  <a
                    className="btn btn-wa btn-block"
                    href={wa('Olá! Sou uma loja/empresa e gostava de receber a tabela de preços por volume.')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon size={17} /> Pedir a tabela
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={80}>
              <div style={{ marginTop: 'var(--s-10)' }}>
                <h3 style={{ marginBottom: 'var(--s-4)' }}>O que faz o preço subir ou descer</h3>
                <div className="table-wrap">
                  <table>
                    <caption className="visually-hidden">
                      Fatores que influenciam o preço final de um topo de bolo personalizado
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Fator</th>
                        <th scope="col">O que muda</th>
                        <th scope="col">Efeito no preço</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Tamanho</td>
                        <td>Pequeno (10 cm), médio (15 cm) ou grande (20 cm)</td>
                        <td>Sobe com o tamanho</td>
                      </tr>
                      <tr>
                        <td>Papel</td>
                        <td>{MATERIALS.map((m) => m.name).join(', ')}</td>
                        <td>O couché é a base; glitter e espelhados sobem</td>
                      </tr>
                      <tr>
                        <td>Detalhe do recorte</td>
                        <td>Um nome simples ou um cenário com várias figuras</td>
                        <td>É o que mais pesa</td>
                      </tr>
                      <tr>
                        <td>Quantidade</td>
                        <td>Peça única ou conjunto</td>
                        <td>Desce a partir de {site.bulkFrom} unidades</td>
                      </tr>
                      <tr>
                        <td>Portes</td>
                        <td>Destino e dimensão da encomenda</td>
                        <td>Confirmados antes de fechares</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Avaliações ───────────────────────────────────────────────── */}
        <section className="section section-sunken" aria-labelledby="avaliacoes-titulo">
          <div className="container">
            <Reveal>
              <div className="section-head section-head-center">
                <p className="eyebrow eyebrow-center">Avaliações</p>
                <h2 id="avaliacoes-titulo">O que dizem quem já encomendou</h2>
                <p className="lead" style={{ marginInline: 'auto' }}>
                  <span className="stars" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
                  </span>{' '}
                  <span className="num">5,0</span> de média nas avaliações dos nossos clientes.
                </p>
              </div>
            </Reveal>

            <ul className="quotes">
              {QUOTES.map((q, i) => (
                <Reveal as="li" key={q.author} delay={i * 70}>
                  <figure className="card quote">
                    <span className="stars" aria-label="5 em 5 estrelas">
                      {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} />)}
                    </span>
                    <blockquote><p>{q.text}</p></blockquote>
                    <figcaption>
                      <span>
                        <span className="quote-author">{q.author}</span>
                        <br />
                        <span className="quote-place">{q.place}</span>
                      </span>
                      <span className="badge">{q.occasion}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Sobre ────────────────────────────────────────────────────── */}
        <section className="section" id="sobre">
          <div className="container hero-grid">
            <Reveal>
              <div className="frame">
                <div className="photo" style={{ aspectRatio: '3 / 2' }}>
                  <Image
                    src="/images/dia-da-mae-moldura.webp"
                    alt="Moldura oval dourada recortada em papel, com a frase Mulher você é especial e rosas de papel"
                    width={1024}
                    height={1024}
                    sizes="(max-width: 960px) 90vw, 520px"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div>
                <p className="eyebrow">Quem somos</p>
                <h2 style={{ marginBlock: 'var(--s-4) var(--s-5)' }}>
                  Papel, tesoura e muita paciência
                </h2>
                <p className="lead" style={{ marginBottom: 'var(--s-4)' }}>
                  A Mundo de Papel Portugal é um atelier pequeno. Não temos loja aberta ao público nem
                  máquinas a produzir em série: cada topo é desenhado para uma festa concreta, cortado
                  camada a camada e montado à mão.
                </p>
                <p className="lead">
                  Trabalhamos por encomenda e enviamos para {site.shipping}. Se a ideia ainda for vaga,
                  escreve à mesma: metade do trabalho é ajudar a decidir.
                </p>

                <div className="hero-facts" style={{ marginTop: 'var(--s-8)' }}>
                  <div>
                    <p className="hero-fact-value">Papel</p>
                    <p className="hero-fact-label">nunca acrílico nem madeira</p>
                  </div>
                  <div>
                    <p className="hero-fact-value num">&lt; 24h</p>
                    <p className="hero-fact-label">para responder</p>
                  </div>
                  <div>
                    <p className="hero-fact-value">Por encomenda</p>
                    <p className="hero-fact-label">nada é feito em série</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Perguntas ────────────────────────────────────────────────── */}
        <section className="section section-sunken" id="perguntas">
          <div className="container">
            <Reveal>
              <div className="section-head section-head-center">
                <p className="eyebrow eyebrow-center">Perguntas frequentes</p>
                <h2>Antes de encomendares</h2>
              </div>
            </Reveal>

            <div className="faq">
              {FAQS.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary className="faq-q">
                    {f.q}
                    <span className="faq-icon" aria-hidden><Plus size={20} /></span>
                  </summary>
                  <div className="faq-a"><p>{f.a}</p></div>
                </details>
              ))}
            </div>

            <p style={{ textAlign: 'center', marginTop: 'var(--s-10)', color: 'var(--text-soft)' }}>
              Ficou alguma dúvida?{' '}
              <a
                href={wa('Olá! Tenho uma dúvida sobre os topos de bolo.')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-text)', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                Pergunta-nos no WhatsApp
              </a>{' '}
              ou usa o assistente aqui em baixo.
            </p>
          </div>
        </section>

        {/* ── Contacto ─────────────────────────────────────────────────── */}
        <section className="section" id="contacto">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <p className="eyebrow">Contacto</p>
                <h2>Falamos?</h2>
                <p className="lead">
                  O WhatsApp é o caminho mais rápido: respondemos em {site.replyTime}.
                </p>
              </div>
            </Reveal>

            <div className="contact-grid">
              <Reveal>
                <div className="card contact-card">
                  <span style={{ color: 'var(--wa)' }}><WhatsAppIcon size={24} /></span>
                  <h3>WhatsApp</h3>
                  <p>{site.whatsappDisplay}. Manda a ideia, uma foto de referência ou só a data da festa.</p>
                  <a
                    className="btn btn-wa"
                    href={wa('Olá! Vim do site e queria falar sobre um topo de bolo personalizado.')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enviar mensagem
                  </a>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="card contact-card">
                  <span style={{ color: 'var(--gold)' }}><MailIcon size={24} /></span>
                  <h3>Email</h3>
                  <p>Para encomendas de lojas, faturação e pedidos mais detalhados.</p>
                  <a className="btn btn-ghost" href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="card contact-card">
                  <span style={{ color: 'var(--accent-text)' }}><InstagramIcon size={24} /></span>
                  <h3>Instagram</h3>
                  <p>Os trabalhos mais recentes, incluindo os que ainda não estão aqui no site.</p>
                  <a className="btn btn-ghost" href={site.instagram} target="_blank" rel="noopener noreferrer">
                    {site.instagramHandle}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ── Rodapé ─────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <p className="brand-name" style={{ fontSize: 'var(--t-21)', color: 'var(--paper-1)' }}>
                Mundo de Papel Portugal
              </p>
              <p style={{ color: 'var(--text-on-dark-soft)', marginTop: 'var(--s-3)', maxWidth: '38ch', lineHeight: 1.6 }}>
                Topos de bolo e decorações personalizadas, recortadas e montadas à mão em papel.
                Feitos por encomenda, enviados para {site.shipping}.
              </p>
              <p style={{ marginTop: 'var(--s-5)' }}>
                <a className="btn btn-wa btn-sm" href={wa('Olá! Vim do site.')} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={16} /> {site.whatsappDisplay}
                </a>
              </p>
            </div>

            <div>
              <h4>Navegar</h4>
              <nav className="footer-links" aria-label="Navegação do rodapé">
                <a href="#categorias">Categorias</a>
                <a href="#como-funciona">Como funciona</a>
                <a href="#personalizar">Personalizar</a>
                <a href="#trabalhos">Trabalhos</a>
                <a href="#precos">Preços</a>
                <a href="#perguntas">Perguntas frequentes</a>
              </nav>
            </div>

            <div>
              <h4>Contacto</h4>
              <div className="footer-links">
                <a href={wa('Olá!')} target="_blank" rel="noopener noreferrer">WhatsApp {site.whatsappDisplay}</a>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram {site.instagramHandle}</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} {site.name}</p>
            <p>Feito à mão em Portugal</p>
          </div>
        </div>
      </footer>

      <Assistant />
    </>
  )
}
