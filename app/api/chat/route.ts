import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `És o Robertinho, o assistente virtual da "Mundo de Papel Portugal", loja especializada em topos de bolo personalizados feitos à mão em Portugal.

OBJETIVO:
Guiar o cliente com uma conversa amigável e estruturada, recolher a informação necessária e sugerir um topo de bolo adequado.

REGRAS:
- Responde sempre em português europeu
- Faz uma pergunta de cada vez
- Respostas curtas e claras, exceto na sugestão final
- Nunca digas que és uma IA
- Se o cliente já deu informação suficiente, resume o pedido de forma organizada

INFORMAÇÃO DO NEGÓCIO:
- Preço base desde 7,90€
- Materiais disponíveis:
  - papel couché 250g
  - papel glitter
  - papel texturizado / decorativo de papelaria
- Não menciones acrílico nem madeira
- Envio para Portugal Continental e Ilhas

ORDEM DAS PERGUNTAS:
1. Tipo de evento
2. Nome
3. Idade (se fizer sentido)
4. Tema
5. Cores
6. Tamanho
7. Tipo de papel
8. Notas extra

Quando tiveres informação suficiente, apresenta:
- resumo do pedido
- sugestão visual do topo
- tipo de papel recomendado
- tamanho confirmado
- preço estimado
- prazo estimado
- convite para encomendar via WhatsApp
`

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      )
    }

    const body = await req.json()

    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : typeof body?.message === "string"
      ? [{ role: "user", content: body.message }]
      : []

    const imageBase64: string | undefined = body?.imageBase64

    if (!messages.length) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      )
    }

    const contents = messages.map((m, idx) => {
      const isFirstUser = idx === 0 && m.role === "user" && imageBase64

      if (isFirstUser && typeof imageBase64 === "string") {
        const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)

        if (match) {
          return {
            role: "user",
            parts: [
              { text: m.content || "" },
              {
                inline_data: {
                  mime_type: match[1],
                  data: match[2],
                },
              },
            ],
          }
        }
      }

      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }],
      }
    })

    const GEMINI_URL =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

    const geminiBody = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        topP: 0.9,
      },
    }

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiBody),
    })

    const rawText = await geminiRes.text()

    if (!geminiRes.ok) {
      console.error("[chat/route] Gemini error:", geminiRes.status, rawText)

      return NextResponse.json(
        {
          error: "Gemini API error",
          detail: rawText,
        },
        { status: 502 }
      )
    }

    const data = JSON.parse(rawText)

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Desculpa, não consegui gerar uma resposta. Tenta novamente!"

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("[chat/route] Unexpected error:", err)

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}