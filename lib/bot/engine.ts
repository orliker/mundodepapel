/**
 * Motor de comprension determinista. Sin IA, sin red, sin claves.
 *
 * Como funciona:
 *  1. normaliza el texto (minusculas, sin acentos, sin pontuacion)
 *  2. puntua cada intencion por frases completas y por palabras clave
 *  3. tolera erratas con distancia de edicion 1 en palabras de 5+ letras
 *  4. si nadie llega al umbral, devuelve null y quien llama ofrece ayuda
 */

/** Quita acentos, cedilla y puntuacion. "Não é caro?" -> "nao e caro" */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenize(input: string): string[] {
  const norm = normalize(input)
  return norm ? norm.split(' ').filter(Boolean) : []
}

/** Distancia de edicion con corte: solo nos interesa saber si es <= max. */
export function editDistanceWithin(a: string, b: string, max: number): boolean {
  if (a === b) return true
  if (Math.abs(a.length - b.length) > max) return false

  const prev = new Array(b.length + 1)
  const curr = new Array(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    let best = curr[0]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
      if (curr[j] < best) best = curr[j]
    }
    if (best > max) return false
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]
  }
  return prev[b.length] <= max
}

/** Palabras vacias: no deben decidir una intencion por si solas. */
const STOP = new Set([
  'a','o','as','os','um','uma','uns','umas','de','do','da','dos','das','em','no','na','nos','nas',
  'e','ou','que','se','por','para','pra','com','sem','ao','aos','as','me','te','vos','lhe','meu',
  'minha','teu','tua','seu','sua','este','esta','isso','isto','esse','essa','aquele','aquela',
  'ja','mais','muito','muita','tao','como','qual','quais','quanto','quanta','quantos','quantas',
  'onde','quando','porque','porquê','porque','sim','nao','ha','tem','ter','sao','ser','estar','esta',
  'sou','vou','quero','queria','gostava','gostaria','pode','podem','posso','fazer','faz','fazem',
  'the','of','to','is','are','my','i','you','el','la','los','las','y','en','un','una','del','al',
])

export interface Intent {
  id: string
  /** fragmentos que, si aparecen literalmente, casi confirman la intencion */
  phrases?: string[]
  /** palabras sueltas que apuntan a esta intencion */
  keywords: string[]
  /** si aparece alguna de estas, la intencion queda descartada */
  exclude?: string[]
  answer: string
  chips?: string[]
  /** accion sugerida junto a la respuesta */
  cta?: 'whatsapp' | 'configurator' | 'categories' | 'gallery' | 'faq'
  /** desempate cuando dos intenciones puntuan igual */
  priority?: number
}

export interface Match {
  intent: Intent
  score: number
}

const W_PHRASE = 6
const W_EXACT = 2.2
const W_PREFIX = 1.4
const W_FUZZY = 1.1
/** solo cuentan las mejores coincidencias: una intencion con 30 palabras
 *  clave no debe ganar por acumulacion a una con 5 bien elegidas */
const MAX_KEYWORD_HITS = 3
export const THRESHOLD = 2.0

/** Puntua una intencion contra el texto ya normalizado y tokenizado. */
function scoreIntent(intent: Intent, norm: string, tokens: string[]): number {
  if (intent.exclude?.some((x) => norm.includes(normalize(x)))) return 0

  let score = 0

  for (const phrase of intent.phrases ?? []) {
    const p = normalize(phrase)
    if (p && norm.includes(p)) {
      // frases largas pesan mas: distinguen mejor
      score += W_PHRASE + Math.min(p.split(' ').length, 4) * 0.6
    }
  }

  const hits: number[] = []
  // cada palabra del usuario puntua UNA vez: "aniversario" no debe sumar
  // otra vez por la clave "aniversarios", que es la misma palabra
  const used = new Set<number>()

  for (const raw of intent.keywords) {
    const kw = normalize(raw)
    if (!kw) continue

    if (kw.includes(' ')) {
      if (norm.includes(kw)) hits.push(W_EXACT + 1)
      continue
    }

    let best = 0
    let bestIndex = -1
    tokens.forEach((t, i) => {
      if (used.has(i)) return
      let value = 0
      if (t === kw) value = W_EXACT
      else if (kw.length >= 4 && (t.startsWith(kw) || kw.startsWith(t)) && Math.min(t.length, kw.length) >= 4) value = W_PREFIX
      else if (kw.length >= 5 && t.length >= 5 && editDistanceWithin(t, kw, 1)) value = W_FUZZY
      if (value > best) { best = value; bestIndex = i }
    })

    if (best > 0) { hits.push(best); used.add(bestIndex) }
  }

  hits.sort((a, b) => b - a)
  score += hits.slice(0, MAX_KEYWORD_HITS).reduce((sum, v) => sum + v, 0)

  if (intent.priority) score += intent.priority * 0.35
  return score
}

/** Devuelve las mejores coincidencias, de mayor a menor puntuacion. */
export function rank(text: string, intents: Intent[]): Match[] {
  const norm = normalize(text)
  if (!norm) return []
  const tokens = tokenize(text).filter((t) => !STOP.has(t) || tokens0.has(t))
  const all = tokenize(text)
  const useful = tokens.length ? tokens : all

  return intents
    .map((intent) => ({ intent, score: scoreIntent(intent, norm, useful) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}

/** Palabras vacias que si aportan sentido en este dominio. */
const tokens0 = new Set(['nao', 'sim', 'ola', 'como', 'quanto', 'quando', 'onde', 'quais', 'qual'])

export function bestMatch(text: string, intents: Intent[]): Match | null {
  const [top] = rank(text, intents)
  if (!top || top.score < THRESHOLD) return null
  return top
}

/** Extrae una edad del texto: "5 anos", "faz 8", "3" */
export function extractAge(text: string): string | null {
  const norm = normalize(text)
  const m = norm.match(/\b(\d{1,3})\b/)
  if (!m) return null
  const n = Number(m[1])
  if (n < 1 || n > 120) return null
  return norm.includes('mes') ? `${n} meses` : `${n} anos`
}

/**
 * Dentro del guion de encomenda casi todo lo que se escribe son datos, no
 * preguntas. Solo interrumpimos si la frase suena de verdad a pregunta.
 */
export function looksLikeQuestion(text: string): boolean {
  if (text.includes('?')) return true
  return /^(quanto|quantos|quanta|qual|quais|como|onde|quando|porque|posso|podem|pode|fazem|faz|tem|teem|aceitam|existe|ha |da para|e possivel|sera que|voces)/.test(
    normalize(text),
  )
}

/** Detecta afirmacion / negacion sueltas. */
export function polarity(text: string): 'yes' | 'no' | null {
  const t = normalize(text)
  if (/^(sim|s|claro|certo|ok|okay|pode ser|isso|exacto|exato|yes|si|vale|quero)\b/.test(t)) return 'yes'
  if (/^(nao|n|nope|no|nem|nada|deixa|obrigado nao)\b/.test(t)) return 'no'
  return null
}
