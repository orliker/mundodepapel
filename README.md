# Mundo de Papel Portugal

Sitio de [mundodepapelportugal.com](https://www.mundodepapelportugal.com): topos de bolo
personalizados, recortados y montados a mano en papel.

Una sola página, estática, sin base de datos y sin servicios externos. Todo el trabajo de
conversión termina en WhatsApp, que es donde el negocio cierra realmente los pedidos.

## Stack

- **Next.js 16** (App Router), React 19, TypeScript. Versiones fijadas, sin `latest`.
- **CSS propio con design tokens** en [`app/globals.css`](app/globals.css). Sin Tailwind ni
  librerías de UI: la paleta sale del logotipo (papel hueso, tinta, destello azul) y todos
  los pares de color están verificados contra WCAG 2.1 AA.
- **Fuentes**: Fraunces (titulares) e Instrument Sans (texto), servidas desde el propio
  dominio con `next/font`.
- **Cero dependencias de runtime** más allá de React y Next.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera la versión estática
```

## Estructura

```
app/
  layout.tsx        metadatos, fuentes y JSON-LD de la organización
  page.tsx          la página (Server Component: el contenido va en el HTML servido)
  globals.css       tokens y estilos
  robots.ts         robots.txt
  sitemap.ts        sitemap.xml
components/
  site-header.tsx   cabecera con navegación y sección activa
  categories.tsx    rejilla de categorías + panel lateral de detalle
  configurator.tsx  configurador de 5 pasos que termina en WhatsApp
  gallery.tsx       galería con visor a pantalla completa
  assistant.tsx     asistente de respuestas automáticas
  reveal.tsx        aparición al hacer scroll
  icons.tsx         iconos SVG en línea
lib/
  site.ts           datos del negocio (teléfono, email, precio base, plazos)
  content.ts        categorías, fotos, avaliações y preguntas frecuentes
  bot/              motor del asistente
```

## El asistente

No usa IA ni llama a ningún servicio. Es un motor determinista en
[`lib/bot/engine.ts`](lib/bot/engine.ts):

1. normaliza el texto (minúsculas, sin acentos ni puntuación),
2. puntúa cada intención por frases completas y palabras clave,
3. tolera erratas con distancia de edición 1 en palabras de 5 o más letras,
4. si nada supera el umbral, ofrece temas concretos en vez de un "no entendí".

Las respuestas viven en [`lib/bot/knowledge.ts`](lib/bot/knowledge.ts) y el guion de
encomenda en [`lib/bot/flow.ts`](lib/bot/flow.ts). Una pregunta a mitad del guion se
responde y luego se retoma donde iba.

**Para añadir una respuesta nueva**: añade una intención a `INTENTS` con sus `phrases` y
`keywords`. No hace falta tocar nada más.

**Regla del contenido**: el asistente no inventa. Lo que depende de cada pedido (portes,
métodos de pago, fechas urgentes) remite al WhatsApp en vez de dar un dato inventado.

## Datos del negocio

Todo lo editable está en [`lib/site.ts`](lib/site.ts) y [`lib/content.ts`](lib/content.ts):
número de WhatsApp, email, Instagram, precio de partida, plazos, categorías y preguntas
frecuentes. Cambiar el número de teléfono es editar una línea.

## Imágenes

Las fotos están en `public/images/` en WebP, redimensionadas al uso real (retratos a
900×1350, apaisadas a 1200 de ancho). Los PNG originales, de entre 1 y 2,5 MB cada uno,
quedaron en el historial de git: `git show 9f1ed26:public/images/...`

Al añadir una foto nueva: conviértela a WebP, añádela a `lib/content.ts` con su `alt`
descriptivo y sus dimensiones reales (necesarias para reservar el espacio y evitar saltos
de diseño).

## Despliegue

Push a `main` despliega en Vercel.
