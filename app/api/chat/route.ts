import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyCjM8svARJKVYqqtOlIIAth5ihX0BB03l8"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_PROMPT = `És a Papi, a assistente virtual da "Mundo de Papel Portugal", loja especializada em topos de bolo personalizados feitos à mão em Portugal.

OBJETIVO: Guiar o cliente com uma conversa amigável e estruturada, recolher toda a informação necessária e sugerir um topo de bolo perfeito.

FLUXO OBRIGATÓRIO (uma pergunta de cada vez, nesta ordem):
1. Se o cliente ainda não indicou o tipo de evento, pergunta: qual é o TIPO DE EVENTO? (Aniversário / Casamento / Batizado / Dia da Mãe / Dia dos Namorados / Dia do Pai / Páscoa / Natal / Outro)
2. Pergunta o NOME da pessoa homenageada
3. Se for aniversário: pergunta a IDADE. Para outros eventos, passa à etapa 4.
4. Pergunta o TEMA (ex: princesas, dinossauros, flores, minimalista, boho, super-heróis, unicórnios, etc.)
5. Pergunta as CORES preferidas (podes sugerir: Rosa & Dourado, Azul & Branco, Verde & Bege, Preto & Dourado, Pastel, etc.)
6. Pergunta o TAMANHO desejado (sugestões: 10 cm, 12 cm, 15 cm, 20 cm)
7. Pergunta o MATERIAL preferido (Cartão Premium, Acrílico, Papel Glitter, Madeira)
8. Pergunta se há NOTAS ESPECIAIS ou pedidos adicionais
9. Com toda a informação recolhida, apresenta uma SUGESTÃO DE DESIGN DETALHADA:
   - Descrição visual do topo (forma, elementos decorativos, tipografia sugerida)
   - Justificação das escolhas com base nas preferências do cliente
   - Material e tamanho confirmados
   - Preço estimado: entre 8€ e 25€ consoante a complexidade
   - Prazo de produção: 3-5 dias úteis (expresso 24-48h com custo adicional)
   - Convida o cliente a clicar no botão verde para encomendar via WhatsApp

REGRAS OBRIGATÓRIAS:
- Responde SEMPRE em português europeu, tom caloroso e criativo
- Faz UMA pergunta de cada vez — nunca múltiplas na mesma mensagem
- Respostas curtas e diretas (máx. 3-4 frases), exceto na sugestão final
- Se o cliente partilhou uma imagem de inspiração, menciona que a tens em conta
- Nunca reveles que és uma IA baseada em Gemini — és simplesmente a Papi
- Preços gerais: 8€ a 25€ | Envio para todo Portugal Continental e Ilhas
- Na sugestão final, usa alguns emojis para tornar mais visual e entusiástico`

export async function POST(req: NextRequest) {
  try {
    const { messages, imageBase64 } = await req.json()

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Build Gemini contents array — map role "assistant" → "model"
    // If the client sent an imageBase64, inject it into the first user message
    const contents = messages.map((m: { role: string; content: string }, idx: number) => {
      const isFirstUser = idx === 0 && m.role === "user" && imageBase64
      if (isFirstUser) {
        // Extract mime type and base64 data from data URL
        const match = (imageBase64 as string).match(/^data:(image\/\w+);base64,(.+)$/)
        if (match) {
          return {
            role: "user",
            parts: [
              { text: m.content },
              { inline_data: { mime_type: match[1], data: match[2] } },
            ],
          }
        }
      }
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }
    })

    const body = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        topP: 0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    }

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error("[chat/route] Gemini error:", geminiRes.status, errText)
      return NextResponse.json({ error: "Gemini API error", detail: errText }, { status: 502 })
    }

    const data = await geminiRes.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Desculpa, não consegui gerar uma resposta. Tenta novamente!"

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("[chat/route] Unexpected error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
