/**
 * Contenido de la pagina. Las categorias y las fotos estan emparejadas con lo
 * que cada imagen muestra realmente (se revisaron una a una).
 */

export interface Photo {
  src: string
  alt: string
  /** proporcion real del archivo, para reservar espacio y evitar saltos */
  w: number
  h: number
  /** encuadre cuando la foto se recorta (object-position); por defecto, centro */
  focus?: string
}

export interface Category {
  id: string
  name: string
  eyebrow: string
  blurb: string
  /** texto largo del panel lateral */
  detail: string
  priceFrom: number
  badge?: string
  cover: Photo
  gallery: Photo[]
  /** que se puede personalizar en esta categoria */
  highlights: string[]
  materials: string[]
}

export const MATERIALS = [
  { id: 'couche', name: 'Papel couché 250g', desc: 'A base premium. Cor sólida e acabamento suave.' },
  { id: 'glitter', name: 'Papel glitter', desc: 'Brilho fino, para nomes e números com destaque.' },
  { id: 'texturizado', name: 'Papel texturizado / camurça', desc: 'Efeito aveludado, discreto e elegante.' },
  { id: 'decorativo', name: 'Papel decorativo especial', desc: 'Papéis de papelaria com padrão ou espelhados.' },
] as const

export const SIZES = [
  { id: 'pequeno', name: 'Pequeno', dim: '≈ 10 cm', note: 'Bolos de 1 a 2 andares pequenos' },
  { id: 'medio', name: 'Médio', dim: '≈ 15 cm', note: 'A escolha mais pedida' },
  { id: 'grande', name: 'Grande', dim: '≈ 20 cm', note: 'Bolos de festa e mesas grandes' },
] as const

export const PALETTES = [
  { name: 'Rosa e dourado', hex: '#E8A0B4' },
  { name: 'Azul e branco', hex: '#8FC3DE' },
  { name: 'Verde e bege', hex: '#A8BE96' },
  { name: 'Preto e dourado', hex: '#2B2622' },
  { name: 'Lilás e prata', hex: '#B3A6D4' },
  { name: 'Tons pastel', hex: '#F0D9A8' },
  { name: 'Vermelho e dourado', hex: '#C0453F' },
] as const

export const OCCASIONS = [
  'Aniversário',
  'Batizado',
  'Comunhão',
  'Casamento',
  'Bodas',
  'Dia da Mãe',
  'Dia do Pai',
  'Páscoa',
  'Natal',
  'Halloween',
  'Outro',
] as const

const ALL_MATERIALS = MATERIALS.map((m) => m.name)

export const CATEGORIES: Category[] = [
  {
    id: 'aniversario',
    name: 'Aniversário',
    eyebrow: 'O mais pedido',
    blurb: 'Nome, idade e tema à escolha, do primeiro ano aos 100.',
    detail:
      'Trabalhamos o tema que a criança (ou o adulto) escolher: personagens, banda favorita, super-heróis, unicórnios ou algo só vosso. Recortamos o nome e a idade em papel, montamos as camadas à mão e entregamos pronto a espetar no bolo.',
    priceFrom: 7.9,
    badge: 'Mais pedido',
    cover: { src: '/images/aniversario-kpop.webp', alt: 'Topo de bolo de aniversário com o nome Ema e o número 8 recortados em papel lilás, sobre bolo roxo com glitter', w: 900, h: 1350 },
    gallery: [
      { src: '/images/aniversario-kpop.webp', alt: 'Topo de aniversário com personagens e o nome Ema recortado em papel lilás', w: 900, h: 1350 },
      { src: '/images/aniversario-unicornio.webp', alt: 'Topo de unicórnio em papel com arco-íris, nuvens, estrelas e o nome Maria em glitter rosa', w: 1024, h: 1024 },
      { src: '/images/aniversario-super-herois.webp', alt: 'Topo de super-heróis com o nome Rael e o número 4 em papel espelhado prateado', w: 1075, h: 1061 },
    ],
    highlights: ['Nome e idade recortados', 'Tema à escolha', 'Cores combinadas com o bolo', 'Aceitamos imagem de referência'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'batizado',
    name: 'Batizado e Comunhão',
    eyebrow: 'Delicado',
    blurb: 'Anjos, pombas e cruzes em tons suaves, com o nome da criança.',
    detail:
      'Peças pensadas para bolos claros: branco, bege, dourado leve e rosa suave. Recortamos o anjo ou a pomba camada a camada e acrescentamos o nome em letra manuscrita. É a categoria onde o detalhe do recorte mais se nota.',
    priceFrom: 9,
    cover: { src: '/images/batizado-anjo.webp', alt: 'Topo de batizado com anjo em papel branco, asas cor-de-rosa e moldura dourada, ao lado de um terço', w: 900, h: 1350 },
    gallery: [
      { src: '/images/batizado-anjo.webp', alt: 'Anjo em papel com vestido branco e detalhe dourado, para topo de batizado', w: 900, h: 1350 },
      { src: '/images/batizado-pomba-dourada.webp', alt: 'Bolo branco com topo de pomba branca sobre resplendor dourado e o nome Mariana em letra manuscrita', w: 900, h: 1350 },
      { src: '/images/batizado-pomba-branca.webp', alt: 'Pomba branca recortada em papel, com asas abertas e detalhe vazado', w: 1024, h: 1024 },
    ],
    highlights: ['Nome em letra manuscrita', 'Anjo, pomba ou cruz', 'Tons pastel e dourado', 'Também para comunhão'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'casamento',
    name: 'Casamento e Bodas',
    eyebrow: 'Premium',
    blurb: 'Nomes, data e anos de casados, com flores de papel feitas uma a uma.',
    detail:
      'Para casamentos e para bodas de prata ou de ouro. Recortamos os dois nomes na mesma peça, com a data ou os anos de casados, e podemos acompanhar com rosas de papel montadas pétala a pétala. É o trabalho mais demorado que fazemos, e nota-se.',
    priceFrom: 12,
    badge: 'Premium',
    cover: { src: '/images/bodas-prata-25-anos.webp', alt: 'Topo de bodas de prata com os nomes Fátima e Manuel, 25 anos casados, rodeado de rosas de papel prateadas', w: 900, h: 1350, focus: '50% 35%' },
    gallery: [
      { src: '/images/bodas-ouro-prata.webp', alt: 'Topos Bodas de Ouro e Bodas de Prata em papel espelhado com letra manuscrita', w: 1200, h: 1200 },
      { src: '/images/bodas-prata-25-anos.webp', alt: 'Topo prateado com os nomes Fátima e Manuel, 25 anos casados, rodeado de rosas de papel prateadas', w: 900, h: 1350 },
    ],
    highlights: ['Dois nomes na mesma peça', 'Data ou anos de casados', 'Flores de papel opcionais', 'Acabamento espelhado'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'coroas',
    name: 'Coroas e letras',
    eyebrow: 'Novo',
    blurb: 'Frases e nomes soltos para pousar ou espetar no bolo.',
    detail:
      'Letras e frases recortadas que podem ir espetadas no topo ou encostadas à lateral do bolo. Escolhe a frase, a tipografia e o acabamento: dourado, prateado ou cor sólida.',
    priceFrom: 8,
    badge: 'Novo',
    cover: { src: '/images/coroa-birthday-queen.webp', alt: 'Bolo branco com pérolas, coroa dourada e a frase Birthday Queen recortada em dourado', w: 900, h: 1350 },
    gallery: [
      { src: '/images/coroa-birthday-queen.webp', alt: 'Frase Birthday Queen recortada em papel dourado sobre bolo branco com pérolas', w: 900, h: 1350 },
      { src: '/images/dia-da-mae-letras.webp', alt: 'Conjunto de topos com as frases Amo-te Mãe, MOM e Mãe em vermelho, dourado e branco', w: 1200, h: 800 },
    ],
    highlights: ['Frase à tua escolha', 'Tipografia manuscrita ou display', 'Dourado, prateado ou cor sólida', 'Vários tamanhos'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'dia-da-mae',
    name: 'Dia da Mãe',
    eyebrow: 'Sazonal',
    blurb: 'Rosas de papel e frases para o bolo (ou para oferecer sozinhas).',
    detail:
      'As rosas são montadas pétala a pétala e aguentam muito depois do bolo acabar. Podem ir com uma frase recortada, com moldura ou soltas, para decorar a mesa.',
    priceFrom: 7.9,
    cover: { src: '/images/dia-da-mae-rosas.webp', alt: 'Rosas de papel bordô com folhas douradas e a frase De repente mais linda recortada em dourado', w: 1200, h: 800 },
    gallery: [
      { src: '/images/dia-da-mae-rosas.webp', alt: 'Rosas de papel bordô e frase dourada De repente mais linda', w: 1200, h: 800 },
      { src: '/images/dia-da-mae-rosas-conjunto.webp', alt: 'Quatro rosas de papel bordô com folhas douradas em palitos, prontas a espetar no bolo', w: 1200, h: 800 },
      { src: '/images/dia-da-mae-moldura.webp', alt: 'Moldura oval dourada com a frase Mulher você é especial e rosas de papel verdes e cor-de-rosa', w: 1024, h: 1024 },
      { src: '/images/dia-da-mae-letras.webp', alt: 'Topos com as frases Amo-te Mãe, MOM e Dia da Mãe em vermelho e dourado', w: 1200, h: 800 },
    ],
    highlights: ['Rosas montadas à mão', 'Frase personalizada', 'Cores à escolha', 'Fica bem depois da festa'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'dia-do-pai',
    name: 'Dia do Pai',
    eyebrow: 'Sazonal',
    blurb: 'Frases com carácter, em tons sóbrios ou nas cores dele.',
    detail:
      'Recorte limpo, tipografia forte e uma cor sólida. Podemos trocar a frase por uma piada interna, pelo nome ou pelo clube.',
    priceFrom: 7.9,
    cover: { src: '/images/dia-do-pai.webp', alt: 'Topo de bolo com a frase Feliz Dia do Pai recortada em papel azul-petróleo com gravata', w: 1200, h: 800 },
    gallery: [
      { src: '/images/dia-do-pai.webp', alt: 'Frase Feliz Dia do Pai recortada em papel azul-petróleo, com detalhe de gravata', w: 1200, h: 800 },
    ],
    highlights: ['Frase à tua escolha', 'Cores sóbrias ou do clube', 'Recorte limpo', 'Também com nome'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'natal',
    name: 'Natal',
    eyebrow: 'Época',
    blurb: 'Do primeiro Natal do bebé à mesa de consoada.',
    detail:
      'Renas, ursos, pinguins e frases de Natal recortadas em papel, com contorno dourado. Encomenda com antecedência: dezembro esgota cedo.',
    priceFrom: 8,
    cover: { src: '/images/natal-primeiro-natal.webp', alt: 'Conjunto de topos de Natal em papel: frase Meu primeiro Natal, rena, urso polar e pinguim com contorno dourado', w: 1024, h: 1024 },
    gallery: [
      { src: '/images/natal-primeiro-natal.webp', alt: 'Topos de Natal em papel com rena, urso polar, pinguim e a frase Meu primeiro Natal', w: 1024, h: 1024 },
    ],
    highlights: ['Meu primeiro Natal', 'Figuras com contorno dourado', 'Conjunto ou peça única', 'Encomenda antecipada'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'pascoa',
    name: 'Páscoa',
    eyebrow: 'Época',
    blurb: 'Placas e apliques para bolos, caixas e folares.',
    detail:
      'Além do topo, fazemos a placa que acompanha a caixa ou o folar. Útil para quem vende doçaria e quer entregar tudo a condizer.',
    priceFrom: 7.9,
    cover: { src: '/images/pascoa-caixa.webp', alt: 'Caixa de bolo em cartão kraft com laço branco e placa Feliz Páscoa recortada em papel com orelhas de coelho', w: 1200, h: 800, focus: '70% 50%' },
    gallery: [
      { src: '/images/pascoa-caixa.webp', alt: 'Placa Feliz Páscoa em papel, aplicada numa caixa de bolo kraft com laço branco', w: 1200, h: 800 },
    ],
    highlights: ['Placas para caixa', 'Apliques para folar', 'Tons pastel', 'Conjuntos para revenda'],
    materials: ALL_MATERIALS,
  },
  {
    id: 'halloween',
    name: 'Halloween',
    eyebrow: 'Edição especial',
    blurb: 'Castelos, morcegos e abóboras, com o nome de quem faz anos.',
    detail:
      'Cenários recortados em várias camadas que dão profundidade ao bolo: castelo, lua, morcegos, teia e abóbora. O nome vai em laranja ou branco, conforme o bolo.',
    priceFrom: 8,
    cover: { src: '/images/halloween-castelo.webp', alt: 'Bolo de Halloween com topo em papel: castelo negro, lua, morcegos, abóbora e o nome Mateus em laranja', w: 900, h: 1350 },
    gallery: [
      { src: '/images/halloween-castelo.webp', alt: 'Topo de Halloween em papel com castelo, morcegos, fantasmas, teia de aranha e o nome Mateus', w: 900, h: 1350 },
    ],
    highlights: ['Cenário em várias camadas', 'Nome e idade', 'Laranja, preto e roxo', 'Também para meses do bebé'],
    materials: ALL_MATERIALS,
  },
]

/** Galeria de trabalhos: todas las fotos reales, sin repetir. */
export const GALLERY: Photo[] = [
  { src: '/images/aniversario-kpop.webp', alt: 'Bolo roxo com glitter e topo de aniversário em papel com o nome Ema e o número 8', w: 900, h: 1350 },
  { src: '/images/dia-da-mae-rosas-conjunto.webp', alt: 'Quatro rosas de papel bordô com folhas douradas, montadas pétala a pétala', w: 1200, h: 800 },
  { src: '/images/batizado-pomba-dourada.webp', alt: 'Bolo de batizado branco com pomba dourada e o nome Mariana em papel', w: 900, h: 1350 },
  { src: '/images/aniversario-unicornio.webp', alt: 'Topo de unicórnio em papel com arco-íris, estrelas e o nome Maria', w: 1024, h: 1024 },
  { src: '/images/bodas-prata-25-anos.webp', alt: 'Topo de bodas de prata com os nomes Fátima e Manuel e rosas de papel prateadas', w: 900, h: 1350 },
  { src: '/images/halloween-castelo.webp', alt: 'Topo de Halloween em papel com castelo, morcegos e o nome Mateus', w: 900, h: 1350 },
  { src: '/images/dia-da-mae-moldura.webp', alt: 'Moldura oval dourada em papel com a frase Mulher você é especial', w: 1024, h: 1024 },
  { src: '/images/natal-primeiro-natal.webp', alt: 'Topos de Natal em papel: rena, urso polar, pinguim e a frase Meu primeiro Natal', w: 1024, h: 1024 },
  { src: '/images/batizado-anjo.webp', alt: 'Anjo de papel com asas cor-de-rosa e moldura dourada, para topo de batizado', w: 900, h: 1350 },
  { src: '/images/coroa-birthday-queen.webp', alt: 'Frase Birthday Queen em papel dourado sobre bolo branco com pérolas', w: 900, h: 1350 },
  { src: '/images/bodas-ouro-prata.webp', alt: 'Topos Bodas de Ouro e Bodas de Prata em papel espelhado', w: 1200, h: 1200 },
  { src: '/images/pascoa-caixa.webp', alt: 'Placa Feliz Páscoa em papel aplicada numa caixa de bolo kraft', w: 1200, h: 800 },
]

export interface Quote {
  text: string
  author: string
  place: string
  occasion: string
}

/** Avaliações confirmadas pela loja. */
export const QUOTES: Quote[] = [
  { text: 'Ficou mesmo lindo! Qualidade incrível e chegou super rápido. Recomendo a todas as mamãs!', author: 'Ana Sousa', place: 'Lisboa', occasion: 'Aniversário' },
  { text: 'Encomendei para o meu casamento e superou todas as expectativas. Muito obrigada!', author: 'Margarida Costa', place: 'Porto', occasion: 'Casamento' },
  { text: 'Adorei a atenção ao detalhe. O topo ficou exatamente como eu queria!', author: 'Rita Ferreira', place: 'Braga', occasion: 'Batizado' },
  { text: 'Serviço impecável, resposta rápida e produto de qualidade premium. Voltarei certamente!', author: 'Joana Melo', place: 'Faro', occasion: 'Aniversário' },
]

export interface Faq {
  q: string
  a: string
}

/**
 * Solo se afirma lo que la loja confirmo. Lo que depende del pedido concreto
 * (portes, pagamento, prazos urgentes) remite al WhatsApp en vez de inventar.
 */
export const FAQS: Faq[] = [
  {
    q: 'Quanto custa um topo de bolo personalizado?',
    a: 'Os topos começam em 7,90€. O valor final depende do tamanho, do papel escolhido e de quantas camadas e recortes o desenho leva. Envias-nos a ideia pelo WhatsApp e recebes o orçamento fechado antes de confirmares.',
  },
  {
    q: 'Quanto tempo demora a ficar pronto?',
    a: 'A produção leva 3 a 5 dias úteis, mais o tempo de envio. Em épocas como o Natal, a Páscoa ou o Dia da Mãe, encomenda com mais antecedência. Se a data for apertada, diz-nos logo: confirmamos no WhatsApp se conseguimos.',
  },
  {
    q: 'Para onde enviam?',
    a: 'Enviamos para Portugal Continental e Ilhas. O custo dos portes depende do destino e do tamanho da encomenda, e é confirmado no WhatsApp antes de fechares o pedido.',
  },
  {
    q: 'Em que papéis são feitos os topos?',
    a: 'Trabalhamos papel couché 250g, papel glitter, papel texturizado ou camurça e papéis decorativos de papelaria, incluindo espelhados. Não trabalhamos acrílico nem madeira: tudo o que fazemos é em papel, cortado e montado à mão.',
  },
  {
    q: 'Que tamanhos existem?',
    a: 'Pequeno (cerca de 10 cm), médio (cerca de 15 cm) e grande (cerca de 20 cm). O médio é o mais pedido e serve a maioria dos bolos de festa. Se tiveres uma medida exacta, indica-a no pedido.',
  },
  {
    q: 'Posso enviar uma imagem de referência?',
    a: 'Sim, e ajuda muito. Envia a foto do bolo, do convite ou da personagem e recriamos o desenho em papel. Também podemos partir de uma paleta de cores ou do tema da festa.',
  },
  {
    q: 'O topo pode ir directamente em cima do bolo?',
    a: 'Sim. Cada peça vai montada num palito ou numa base própria para espetar. Como é papel, deve ser colocado pouco antes de servir e não deve ficar em contacto prolongado com natas ou com humidade.',
  },
  {
    q: 'Fazem preços para lojas e empresas?',
    a: 'Fazemos. A partir de 10 unidades temos tabela por volume, produção prioritária e fatura. Pede a tabela pelo WhatsApp e dizemos-te as condições para o teu caso.',
  },
  {
    q: 'Como faço a encomenda?',
    a: 'Podes usar o configurador aqui do site, que monta o pedido e o envia para o nosso WhatsApp, ou escrever-nos directamente. Respondemos em menos de 24 horas com o orçamento e o prazo.',
  },
  {
    q: 'Como pago a encomenda?',
    a: 'Combinamos o pagamento no WhatsApp, depois de fechado o orçamento e antes de começarmos a produção. Dizemos-te nessa altura os métodos disponíveis.',
  },
]
