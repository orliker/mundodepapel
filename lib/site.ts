/**
 * Datos del negocio. Fuente unica: si cambia el numero o o email, cambia aqui.
 * Nada de esto se inventa; todo sale de la informacion facilitada por la loja.
 */

export const site = {
  name: 'Mundo de Papel Portugal',
  shortName: 'Mundo de Papel',
  tagline: 'Topos de bolo personalizados, feitos à mão em papel',
  url: 'https://www.mundodepapelportugal.com',
  locale: 'pt-PT',
  country: 'PT',

  whatsapp: '351965716782',
  whatsappDisplay: '+351 965 716 782',
  email: 'mundodepapel.portugal@gmail.com',
  instagram: 'https://instagram.com/mundodepapelportugal',
  instagramHandle: '@mundodepapelportugal',

  priceFrom: 7.9,
  priceFromLabel: '7,90€',
  productionDays: '3 a 5 dias úteis',
  replyTime: 'menos de 24 horas',
  shipping: 'Portugal Continental e Ilhas',
  bulkFrom: 10,
} as const

/** Enlace de WhatsApp con mensaje previamente escrito. */
export function wa(text: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}

/** Precio en formato portugues: 7,90€ */
export function eur(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}€`
}
