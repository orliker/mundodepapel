import { site, wa } from '../site'

/** Guion de la encomenda: cuatro preguntas, sin rodeos. */
export type SlotId = 'occasion' | 'name' | 'theme' | 'size'

export interface Slots {
  occasion?: string
  name?: string
  theme?: string
  size?: string
}

export const FLOW_STEPS: { id: SlotId; question: string; chips: string[] }[] = [
  {
    id: 'occasion',
    question: 'Para que ocasião é o topo?',
    chips: ['Aniversário', 'Batizado', 'Casamento', 'Dia da Mãe', 'Natal', 'Outra'],
  },
  {
    id: 'name',
    question: 'Que nome (e idade, se fizer sentido) deve aparecer no topo?',
    chips: ['Sem nome'],
  },
  {
    id: 'theme',
    question: 'Tema e cores? Podes dizer as cores do bolo, um tema ou o nome de uma personagem.',
    chips: ['Rosa e dourado', 'Azul e branco', 'Preto e dourado', 'Ainda não sei'],
  },
  {
    id: 'size',
    question: 'Que tamanho preferes?',
    chips: ['Pequeno (10 cm)', 'Médio (15 cm)', 'Grande (20 cm)', 'Não sei'],
  },
]

const EMPTY = '(a combinar)'

export function summaryLines(s: Slots): [string, string][] {
  return [
    ['Ocasião', s.occasion || EMPTY],
    ['Nome', s.name || EMPTY],
    ['Tema e cores', s.theme || EMPTY],
    ['Tamanho', s.size || EMPTY],
  ]
}

/** Mensaje que llega al WhatsApp de la loja, ya redactado. */
export function buildOrderMessage(s: Slots): string {
  const lines = [
    'Olá! Vim do site e queria um topo de bolo personalizado.',
    '',
    `Ocasião: ${s.occasion || EMPTY}`,
    `Nome no topo: ${s.name || EMPTY}`,
    `Tema e cores: ${s.theme || EMPTY}`,
    `Tamanho: ${s.size || EMPTY}`,
    '',
    `Sei que os topos começam em ${site.priceFromLabel} e que a produção leva ${site.productionDays}.`,
    'Podem confirmar o orçamento e o prazo?',
    '',
    'Obrigado!',
  ]
  return lines.join('\n')
}

export function orderLink(s: Slots): string {
  return wa(buildOrderMessage(s))
}

const flat = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Respuestas que significan "salta esta pergunta". */
export function isSkip(text: string): boolean {
  return /(^|\s)(nao sei|n sei|ainda nao|sem nome|nao tenho|tanto faz|depois digo|nao|skip|passar)(\s|$)/.test(flat(text))
}

/** Salidas del guion: nadie debe quedar preso dentro del cuestionario. */
export function isCancel(text: string): boolean {
  return /(^|\s)(cancela|cancelar|esquece|deixa estar|sair|parar|para com|desisto|desistir|voltar atras|outra coisa)(\s|$)/.test(flat(text))
}

/** Si la primera frase ya diz a ocasiao, nao se volta a perguntar. */
const OCCASION_HINTS: [RegExp, string][] = [
  [/aniversari|anos de idade|festa de anos|birthday/, 'Aniversário'],
  [/batizad|baptizad|batism/, 'Batizado'],
  [/comunha/, 'Comunhão'],
  [/bodas/, 'Bodas'],
  [/casament|noiv|wedding/, 'Casamento'],
  [/dia da mae|dia das mae/, 'Dia da Mãe'],
  [/dia do pai/, 'Dia do Pai'],
  [/pascoa/, 'Páscoa'],
  [/natal/, 'Natal'],
  [/halloween|dia das bruxas/, 'Halloween'],
]

export function detectOccasion(text: string): string | null {
  const t = flat(text)
  for (const [re, label] of OCCASION_HINTS) if (re.test(t)) return label
  return null
}
