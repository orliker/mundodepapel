// ── Shared mock data & types for Topo & Bolo ─────────────────

export type Material = 'acrílico' | 'madeira' | 'cartão' | 'misto'
export type Category = 'casamento' | 'aniversário' | 'batizado' | 'comunhão' | 'baby-shower' | 'corporativo'
export type OrderStatus = 'pending' | 'in-review' | 'in-production' | 'shipped' | 'delivered' | 'cancelled'

export interface Product {
  id: string
  name: string
  slug: string
  category: Category
  price: number
  comparePrice?: number
  images: string[]
  materials: Material[]
  sizes: string[]
  description: string
  tags: string[]
  isNew?: boolean
  isBestseller?: boolean
  rating: number
  reviewCount: number
}

export interface CustomOrder {
  id: string
  clientName: string
  clientPhone: string
  clientEmail: string
  address?: string
  imageUrl: string
  measures: { height: number; width: number; depth?: number; diameter?: number; unit: 'cm' | 'mm' }
  quantity: number
  suggestedPrice: number
  material: Material
  notes: string
  status: OrderStatus
  createdAt: string
  whatsappSentAt?: string
  whatsappConfirmationSentAt?: string
  margin?: 'high' | 'medium' | 'low'
  isRepeatClient?: boolean
  aiVariants?: string[]
}

export interface Review {
  id: string
  author: string
  rating: number
  text: string
  imageUrl?: string
  productName: string
  date: string
}

// ── Products ──────────────────────────────────────────────────
export const products: Product[] = [
  {
    id: 'p1',
    name: 'Topo Clássico Casamento',
    slug: 'topo-classico-casamento',
    category: 'casamento',
    price: 28,
    images: [
      'https://placehold.co/600x700?text=Topo+de+bolo+casamento+elegante+dourado+casal+acrilico+transparente+letras+cursivas',
      'https://placehold.co/600x700?text=Detalhe+topo+casamento+fundo+branco+luz+natural+produto+premium',
    ],
    materials: ['acrílico'],
    sizes: ['15cm', '20cm', '25cm'],
    description: 'Topo elegante em acrílico transparente com letras cursivas douradas. Perfeito para casamentos modernos e clássicos.',
    tags: ['casamento', 'gold', 'clássico', 'acrílico'],
    isBestseller: true,
    rating: 4.9,
    reviewCount: 142,
  },
  {
    id: 'p2',
    name: 'Topo Boho Flores Silvestres',
    slug: 'topo-boho-flores',
    category: 'casamento',
    price: 32,
    comparePrice: 38,
    images: [
      'https://placehold.co/600x700?text=Topo+boho+flores+silvestres+madeira+natural+casamento+rustico+bege',
      'https://placehold.co/600x700?text=Topo+boho+detalhe+flores+secas+textura+natural+premium',
    ],
    materials: ['madeira'],
    sizes: ['18cm', '22cm'],
    description: 'Design boho em madeira cortada a laser com flores silvestres. Acabamento rústico e natural.',
    tags: ['boho', 'flores', 'madeira', 'rústico'],
    isNew: true,
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: 'p3',
    name: 'Topo Aniversário Neon',
    slug: 'topo-aniversario-neon',
    category: 'aniversário',
    price: 22,
    images: [
      'https://placehold.co/600x700?text=Topo+aniversario+neon+cor+rosa+acrílico+colorido+festa+moderno',
      'https://placehold.co/600x700?text=Topo+neon+detalhe+letras+brilhantes+fundo+escuro',
    ],
    materials: ['acrílico'],
    sizes: ['12cm', '16cm', '20cm'],
    description: 'Topo colorido em acrílico espelhado ou neon. Ideal para festas vibrantes e comemorações.',
    tags: ['neon', 'colorido', 'moderno', 'festa'],
    isBestseller: true,
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: 'p4',
    name: 'Topo Batizado Clássico',
    slug: 'topo-batizado-classico',
    category: 'batizado',
    price: 19,
    images: [
      'https://placehold.co/600x700?text=Topo+batizado+branco+acrilico+bebe+delicado+azul+claro+elegante',
    ],
    materials: ['acrílico', 'cartão'],
    sizes: ['10cm', '14cm'],
    description: 'Topo delicado para batizados em tons pastel. Disponível em azul e rosa.',
    tags: ['batizado', 'bebé', 'pastel', 'delicado'],
    rating: 4.9,
    reviewCount: 55,
  },
  {
    id: 'p5',
    name: 'Topo Baby Shower Premium',
    slug: 'topo-baby-shower',
    category: 'baby-shower',
    price: 24,
    comparePrice: 28,
    images: [
      'https://placehold.co/600x700?text=Topo+baby+shower+urso+estrelas+acrilico+bege+dourado+moderno',
    ],
    materials: ['acrílico'],
    sizes: ['14cm', '18cm'],
    description: 'Design premium para baby shower com motivos ursinho, estrelas e balões.',
    tags: ['baby shower', 'ursinho', 'estrelas'],
    isNew: true,
    rating: 4.8,
    reviewCount: 34,
  },
  {
    id: 'p6',
    name: 'Topo Comunhão Minimalista',
    slug: 'topo-comunhao-minimalista',
    category: 'comunhão',
    price: 21,
    images: [
      'https://placehold.co/600x700?text=Topo+comunhao+cruz+acrilico+branco+dourado+minimalista+elegante',
    ],
    materials: ['acrílico'],
    sizes: ['12cm', '16cm'],
    description: 'Design clean e moderno para primeira comunhão. Cruz em acrílico com acabamento dourado.',
    tags: ['comunhão', 'cruz', 'minimalista'],
    rating: 4.7,
    reviewCount: 41,
  },
  {
    id: 'p7',
    name: 'Topo Corporativo Personalizado',
    slug: 'topo-corporativo',
    category: 'corporativo',
    price: 35,
    images: [
      'https://placehold.co/600x700?text=Topo+corporativo+logo+empresa+acrilico+preto+evento+premium',
    ],
    materials: ['acrílico', 'madeira'],
    sizes: ['15cm', '20cm', '30cm'],
    description: 'Topo com logótipo da empresa para eventos corporativos e celebrações de negócio.',
    tags: ['corporativo', 'logo', 'empresa', 'evento'],
    rating: 4.6,
    reviewCount: 22,
  },
  {
    id: 'p8',
    name: 'Topo Aniversário Infantil',
    slug: 'topo-aniversario-infantil',
    category: 'aniversário',
    price: 18,
    images: [
      'https://placehold.co/600x700?text=Topo+aniversario+infantil+dinossauro+colorido+crianca+festa+alegre',
    ],
    materials: ['cartão', 'acrílico'],
    sizes: ['10cm', '14cm'],
    description: 'Topos divertidos para aniversários infantis. Dinossauros, princesas, super-heróis e mais.',
    tags: ['infantil', 'criança', 'colorido', 'divertido'],
    isBestseller: true,
    rating: 4.9,
    reviewCount: 187,
  },
]

// ── Custom Orders (mock) ───────────────────────────────────────
export const customOrders: CustomOrder[] = [
  {
    id: 'CO-12345',
    clientName: 'Alex Ferreira',
    clientPhone: '+351 912 345 678',
    clientEmail: 'alex@exemplo.com',
    imageUrl: 'https://placehold.co/200x200?text=Imagem+cliente+logotipo+personalizado+para+bolo+casamento',
    measures: { height: 10, width: 15, diameter: 12, unit: 'cm' },
    quantity: 3,
    suggestedPrice: 25,
    material: 'acrílico',
    notes: 'Por favor cores pastéis, fonte cursiva elegante',
    status: 'in-review',
    createdAt: '2025-06-01T14:32:00Z',
    whatsappSentAt: '2025-06-01T14:32:45Z',
    whatsappConfirmationSentAt: '2025-06-01T14:33:01Z',
    margin: 'high',
    isRepeatClient: false,
    aiVariants: [
      'https://placehold.co/300x300?text=Variante+IA+1+topo+personalizado+acrílico+pastel+cursivo',
      'https://placehold.co/300x300?text=Variante+IA+2+topo+personalizado+madeira+dourado+moderno',
      'https://placehold.co/300x300?text=Variante+IA+3+topo+personalizado+minimalista+branco+elegante',
    ],
  },
  {
    id: 'CO-12344',
    clientName: 'Maria Silva',
    clientPhone: '+351 963 111 222',
    clientEmail: 'maria@exemplo.com',
    imageUrl: 'https://placehold.co/200x200?text=Imagem+cliente+flores+aniversario+bolo+personalizado',
    measures: { height: 8, width: 12, unit: 'cm' },
    quantity: 1,
    suggestedPrice: 18,
    material: 'madeira',
    notes: 'Tema flores silvestres, tons terracota',
    status: 'in-production',
    createdAt: '2025-05-29T10:10:00Z',
    whatsappSentAt: '2025-05-29T10:10:30Z',
    margin: 'medium',
    isRepeatClient: true,
  },
  {
    id: 'CO-12343',
    clientName: 'João Costa',
    clientPhone: '+351 934 567 890',
    clientEmail: 'joao@exemplo.com',
    imageUrl: 'https://placehold.co/200x200?text=Imagem+cliente+empresa+logotipo+evento+corporativo',
    measures: { height: 12, width: 20, unit: 'cm' },
    quantity: 5,
    suggestedPrice: 40,
    material: 'acrílico',
    notes: 'Logo empresa para aniversário corporativo',
    status: 'shipped',
    createdAt: '2025-05-25T09:00:00Z',
    whatsappSentAt: '2025-05-25T09:00:45Z',
    margin: 'high',
    isRepeatClient: false,
  },
]

// ── Reviews ───────────────────────────────────────────────────
export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Catarina M.',
    rating: 5,
    text: 'Ficou absolutamente lindo! O topo do nosso bolo de casamento era exactamente o que sonhámos. Qualidade premium, entrega super rápida.',
    imageUrl: 'https://placehold.co/200x200?text=Foto+cliente+bolo+casamento+elegante+com+topo+acrilico+dourado',
    productName: 'Topo Clássico Casamento',
    date: '2025-05-10',
  },
  {
    id: 'r2',
    author: 'Pedro A.',
    rating: 5,
    text: 'Encomendei um design completamente personalizado e em menos de 48h tinha os mockups prontos. Serviço incrível!',
    productName: 'Design Personalizado',
    date: '2025-04-28',
  },
  {
    id: 'r3',
    author: 'Sofia R.',
    rating: 5,
    text: 'Os topos para o batizado do meu filho ficaram perfeitos. As cores pastéis eram exactamente o que pedi. Recomendo muito!',
    imageUrl: 'https://placehold.co/200x200?text=Foto+cliente+bolo+batizado+bebe+topo+pastel+azul+branco',
    productName: 'Topo Batizado Clássico',
    date: '2025-05-20',
  },
  {
    id: 'r4',
    author: 'Andreia F.',
    rating: 5,
    text: 'Usei o gerador de IA para criar o topo do aniversário da minha filha. 3 variantes em segundos! Escolhemos a melhor e ficou magnífico.',
    productName: 'Topo Aniversário Infantil',
    date: '2025-05-15',
  },
]

// ── Categories ────────────────────────────────────────────────
export const categories = [
  { id: 'casamento', label: 'Casamento', count: 24, image: 'https://placehold.co/400x500?text=Categoria+casamento+topo+bolo+elegante+acrilico+dourado+casal' },
  { id: 'aniversário', label: 'Aniversário', count: 31, image: 'https://placehold.co/400x500?text=Categoria+aniversario+topo+bolo+colorido+festivo+velas' },
  { id: 'batizado', label: 'Batizado', count: 12, image: 'https://placehold.co/400x500?text=Categoria+batizado+bebe+topo+bolo+delicado+pastel+branco' },
  { id: 'baby-shower', label: 'Baby Shower', count: 8, image: 'https://placehold.co/400x500?text=Categoria+baby+shower+topo+bolo+ursinho+bebe+bege+dourado' },
  { id: 'comunhão', label: 'Comunhão', count: 9, image: 'https://placehold.co/400x500?text=Categoria+comunhao+topo+bolo+cruz+elegante+branco+dourado' },
  { id: 'corporativo', label: 'Corporativo', count: 6, image: 'https://placehold.co/400x500?text=Categoria+corporativo+evento+empresa+topo+bolo+logo+preto' },
]
