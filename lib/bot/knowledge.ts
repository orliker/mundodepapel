import type { Intent } from './engine'
import { site } from '../site'

/**
 * Base de conocimiento del assistente. Cada intencion cubre la pregunta y las
 * variantes con que la gente a escreve, incluindo erros e mistura com espanhol
 * ou ingles. Regra: nao se inventa nada. O que depende do pedido concreto
 * (portes, pagamento, datas apertadas) remete para o WhatsApp.
 */

const P = site.priceFromLabel
const DAYS = site.productionDays

export const INTENTS: Intent[] = [
  // ── social ───────────────────────────────────────────────────────────────
  {
    id: 'greeting',
    phrases: ['bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'como esta', 'como estas'],
    keywords: ['ola', 'olaa', 'oi', 'hey', 'hello', 'hola', 'buenas', 'viva', 'boas'],
    answer:
      'Olá! Sou o assistente da Mundo de Papel Portugal.\n\nFazemos topos de bolo personalizados, recortados e montados à mão em papel, aqui em Portugal. Posso ajudar com preços, prazos, materiais ou começar já a tua encomenda.',
    chips: ['Quanto custa?', 'Quanto tempo demora?', 'Quero encomendar'],
    priority: 1,
  },
  {
    id: 'thanks',
    phrases: ['muito obrigado', 'muito obrigada', 'thank you'],
    keywords: ['obrigado', 'obrigada', 'obg', 'thanks', 'gracias', 'agradecido'],
    answer: 'De nada! Se precisares de mais alguma coisa, é só dizer. E se quiseres avançar, falamos no WhatsApp.',
    chips: ['Quero encomendar', 'Ver categorias'],
    cta: 'whatsapp',
  },
  {
    id: 'bye',
    phrases: ['ate logo', 'ate breve', 'boa noite adeus'],
    keywords: ['adeus', 'tchau', 'xau', 'bye', 'despedir'],
    answer: 'Até já! Ficamos por aqui sempre que precisares. Bons bolos!',
  },
  {
    id: 'human',
    phrases: ['falar com uma pessoa', 'falar com alguem', 'atendimento humano', 'pessoa real'],
    keywords: ['humano', 'pessoa', 'atendente', 'responsavel', 'dona', 'falar convosco'],
    answer: `Claro. Falas directamente connosco pelo WhatsApp ${site.whatsappDisplay} e respondemos em ${site.replyTime}.`,
    cta: 'whatsapp',
  },

  // ── preco ────────────────────────────────────────────────────────────────
  {
    id: 'price',
    phrases: ['quanto custa', 'qual e o preco', 'qual o preco', 'quanto e', 'quanto fica', 'how much', 'cuanto cuesta', 'tabela de precos', 'lista de precos'],
    keywords: ['preco', 'precos', 'custa', 'custo', 'valor', 'valores', 'orcamento', 'caro', 'barato', 'euros', 'pagar', 'price'],
    exclude: ['empresa', 'revenda', 'grosso', 'atacado'],
    answer:
      `Os topos começam em ${P}.\n\nO valor final depende de três coisas: o tamanho (pequeno, médio ou grande), o papel escolhido e quantas camadas e recortes o desenho leva. Um nome simples fica perto do valor base; um cenário com várias figuras sobe.\n\nMonta o pedido no configurador ou manda-nos a ideia: devolvemos o orçamento fechado antes de confirmares seja o que for.`,
    chips: ['Que tamanhos existem?', 'Quais são os papéis?', 'Quero encomendar'],
    cta: 'configurator',
  },
  {
    id: 'business',
    phrases: ['para empresas', 'para lojas', 'preco de revenda', 'venda a grosso', 'por atacado', 'quantidades grandes', 'desconto por quantidade'],
    keywords: ['empresa', 'empresas', 'revenda', 'revender', 'grosso', 'atacado', 'b2b', 'fatura', 'factura', 'pastelaria', 'confeitaria', 'negocio'],
    answer:
      `Sim, temos condições para lojas e empresas.\n\nA partir de ${site.bulkFrom} unidades trabalhamos com tabela por volume, produção prioritária e fatura. Também fazemos peças com a vossa marca.\n\nPede a tabela pelo WhatsApp com uma ideia das quantidades e do tipo de peça.`,
    cta: 'whatsapp',
    priority: 1,
  },
  {
    id: 'payment',
    phrases: ['como pago', 'formas de pagamento', 'metodos de pagamento', 'aceitam mbway', 'pago como'],
    keywords: ['pagamento', 'pagar', 'mbway', 'multibanco', 'transferencia', 'paypal', 'cartao', 'dinheiro', 'pago'],
    answer:
      'O pagamento combina-se no WhatsApp, depois de fecharmos o orçamento e antes de entrarmos em produção. Dizemos-te nessa altura os métodos disponíveis para o teu caso.',
    cta: 'whatsapp',
  },

  // ── prazos e envio ───────────────────────────────────────────────────────
  {
    id: 'lead_time',
    phrases: ['quanto tempo demora', 'quanto tempo leva', 'qual o prazo', 'quando fica pronto', 'em quantos dias', 'how long'],
    keywords: ['prazo', 'demora', 'tempo', 'dias', 'pronto', 'rapido', 'espera', 'producao'],
    exclude: ['urgente', 'amanha', 'para hoje'],
    answer:
      `A produção leva ${DAYS}, mais o tempo de envio.\n\nEm épocas fortes (Natal, Páscoa, Dia da Mãe) enche depressa, por isso vale a pena encomendar com antecedência. Se tiveres uma data marcada, diz-nos qual é e confirmamos se chega a tempo.`,
    chips: ['É para uma data apertada', 'Para onde enviam?'],
  },
  {
    id: 'urgent',
    phrases: ['e para amanha', 'preciso para hoje', 'e urgente', 'para depois de amanha', 'em cima da hora', 'ultima hora', 'data apertada', 'e para esta semana'],
    keywords: ['urgente', 'urgencia', 'amanha', 'hoje', 'depressa', 'ja'],
    answer:
      `O prazo normal é de ${DAYS}, mas há casos que conseguimos acelerar.\n\nEscreve-nos já no WhatsApp com a data exacta da festa e o que precisas. Dizemos-te em ${site.replyTime} se é possível, sem compromisso.`,
    cta: 'whatsapp',
    priority: 2,
  },
  {
    id: 'shipping',
    phrases: ['para onde enviam', 'fazem envios', 'quanto custa o envio', 'quanto sao os portes', 'enviam para as ilhas', 'enviam para a madeira', 'enviam para os acores', 'posso levantar'],
    keywords: ['envio', 'envios', 'enviam', 'portes', 'entrega', 'entregam', 'ctt', 'correio', 'transportadora', 'ilhas', 'madeira', 'acores', 'levantamento', 'morada', 'shipping'],
    answer:
      `Enviamos para ${site.shipping}.\n\nO custo dos portes depende do destino e do tamanho da encomenda, por isso é confirmado no WhatsApp antes de fechares o pedido. Assim não pagas nada às cegas.`,
    chips: ['Quanto tempo demora?', 'Quero encomendar'],
  },

  // ── produto ──────────────────────────────────────────────────────────────
  {
    id: 'materials',
    phrases: ['que material', 'qual o material', 'que papel usam', 'que tipo de papel', 'e de acrilico', 'e de madeira', 'do que e feito'],
    keywords: ['material', 'materiais', 'papel', 'papeis', 'couche', 'glitter', 'texturizado', 'camurca', 'decorativo', 'espelhado', 'acrilico', 'madeira', 'cartao'],
    answer:
      'Trabalhamos quatro papéis:\n\n• Papel couché 250g, a base premium, com cor sólida e acabamento suave\n• Papel glitter, para nomes e números com brilho\n• Papel texturizado ou camurça, com efeito aveludado\n• Papel decorativo especial, incluindo espelhados dourados e prateados\n\nNão trabalhamos acrílico nem madeira. Tudo o que fazemos é em papel, cortado e montado à mão.',
    chips: ['Que tamanhos existem?', 'Quanto custa?'],
  },
  {
    id: 'sizes',
    phrases: ['que tamanhos', 'qual o tamanho', 'quantos cm', 'que medidas', 'tamanho do topo', 'e grande'],
    keywords: ['tamanho', 'tamanhos', 'medida', 'medidas', 'cm', 'centimetros', 'altura', 'largura', 'pequeno', 'medio', 'grande'],
    answer:
      'Temos três tamanhos:\n\n• Pequeno, cerca de 10 cm\n• Médio, cerca de 15 cm, o mais pedido\n• Grande, cerca de 20 cm, para bolos de festa\n\nSe tiveres uma medida exacta em mente, indica-a no pedido e adaptamos.',
    chips: ['Quanto custa?', 'Quero encomendar'],
  },
  {
    id: 'customization',
    phrases: [
      'posso personalizar', 'pode levar o nome', 'pode ter o nome', 'com o nome', 'escolher as cores',
      'tema a escolha', 'personalizado como', 'por o nome', 'poe o nome', 'colocar o nome',
      'nome da minha', 'nome do meu', 'escrever o nome', 'levar o nome',
    ],
    keywords: ['personalizar', 'personalizado', 'nome', 'idade', 'tema', 'frase', 'letras', 'tipografia', 'logotipo', 'logo', 'marca'],
    answer:
      'Personalizamos tudo: nome, idade, frase, tema, tipografia e cores.\n\nPodes escolher uma paleta (rosa e dourado, azul e branco, preto e dourado...) ou dizer-nos as cores do bolo e da festa, que combinamos. Para empresas, também recortamos o logótipo.',
    chips: ['Posso enviar uma foto?', 'Quero encomendar'],
    cta: 'configurator',
  },
  {
    id: 'reference_photo',
    phrases: ['posso enviar uma foto', 'posso mandar uma imagem', 'enviar referencia', 'tenho uma foto', 'copiar um modelo', 'vi no pinterest', 'vi no instagram'],
    keywords: ['foto', 'fotografia', 'imagem', 'referencia', 'inspiracao', 'exemplo', 'modelo', 'pinterest'],
    answer:
      'Sim, e ajuda muito. Envia a foto do bolo, do convite ou da personagem e recriamos o desenho em papel, à nossa maneira.\n\nPodes anexar a imagem no configurador do site ou mandá-la directamente no WhatsApp.',
    cta: 'whatsapp',
  },
  {
    id: 'colors',
    phrases: ['que cores', 'quais as cores', 'tem em dourado', 'tem em prateado', 'combinar cores'],
    keywords: ['cor', 'cores', 'dourado', 'prateado', 'rosa', 'azul', 'vermelho', 'pastel', 'paleta'],
    answer:
      'As cores são à tua escolha. Trabalhamos muito o dourado e o prateado espelhados, os tons pastel e as combinações clássicas: rosa e dourado, azul e branco, preto e dourado, lilás e prata.\n\nSe já sabes as cores do bolo, diz-nos e combinamos a partir daí.',
    chips: ['Quais são os papéis?', 'Quero encomendar'],
  },
  {
    id: 'care',
    phrases: [
      'pode ir no bolo', 'vai em cima do bolo', 'em cima do bolo', 'ir no bolo', 'toca no bolo',
      'e comestivel', 'pode comer', 'come se', 'como se coloca', 'como se poe', 'estraga se',
      'aguenta o frigorifico', 'em contacto com',
    ],
    keywords: ['comestivel', 'comer', 'higiene', 'natas', 'humidade', 'frigorifico', 'colocar', 'espetar', 'palito', 'guardar', 'reutilizar', 'lavar', 'durar'],
    answer:
      'O topo é decorativo, não é comestível: é papel.\n\nCada peça vai montada num palito ou numa base própria para espetar. Coloca-o pouco antes de servir e evita o contacto prolongado com natas ou humidade. Depois da festa, é só limpar o palito e guardar: muita gente fica com a peça de recordação.',
    chips: ['Que tamanhos existem?', 'Quero encomendar'],
  },
  {
    id: 'not_cakes',
    phrases: ['fazem bolos', 'vendem bolos', 'fazem o bolo', 'fazem doces', 'fazem cupcakes'],
    keywords: ['bolos', 'bolo pronto', 'pastelaria', 'doces', 'cupcake'],
    exclude: ['topo', 'topos'],
    answer:
      'Nós não fazemos os bolos: fazemos os topos e as decorações em papel que vão em cima deles.\n\nO bolo encomendas onde costumas, e nós tratamos da peça que o torna diferente.',
    chips: ['Quanto custa?', 'Ver categorias'],
  },
  {
    id: 'quantity',
    phrases: ['quantidade minima', 'tenho de levar quantos', 'posso encomendar so um', 'apenas um'],
    keywords: ['quantidade', 'minimo', 'minima', 'unidades', 'varios', 'conjunto'],
    answer:
      `Não há quantidade mínima: fazemos peças únicas. A partir de ${site.bulkFrom} unidades entramos na tabela de preços por volume, com condições melhores.`,
    chips: ['Preços para empresas', 'Quero encomendar'],
  },

  // ── ocasioes ─────────────────────────────────────────────────────────────
  {
    id: 'occasion_birthday',
    phrases: ['topo de aniversario', 'para um aniversario', 'faz anos', 'festa de aniversario'],
    keywords: ['aniversario', 'aniversarios', 'anos', 'birthday', 'cumpleanos', 'parabens'],
    answer:
      `Aniversários são o que mais fazemos. Recortamos o nome e a idade e trabalhamos o tema que quiseres: personagens, bandas, super-heróis, unicórnios, futebol.\n\nDesde ${P}. Diz-me o nome, a idade e o tema e começamos.`,
    chips: ['Quero encomendar', 'Ver exemplos'],
  },
  {
    id: 'occasion_baptism',
    phrases: ['topo de batizado', 'para um batizado', 'para a comunhao', 'primeira comunhao'],
    keywords: ['batizado', 'baptizado', 'batismo', 'comunhao', 'anjo', 'pomba', 'cruz', 'padrinho'],
    answer:
      'Para batizados e comunhões fazemos anjos, pombas e cruzes em papel, em tons suaves com dourado leve, com o nome em letra manuscrita.\n\nDesde 9€, conforme o detalhe do recorte.',
    chips: ['Quero encomendar', 'Ver exemplos'],
  },
  {
    id: 'occasion_wedding',
    phrases: ['topo de casamento', 'para o meu casamento', 'bodas de prata', 'bodas de ouro', 'anos de casados'],
    keywords: ['casamento', 'casar', 'noivos', 'bodas', 'aniversario de casamento', 'wedding'],
    answer:
      'Para casamentos recortamos os dois nomes na mesma peça, com a data se quiseres, e podemos acompanhar com rosas de papel montadas pétala a pétala. Também fazemos bodas de prata e de ouro.\n\nDesde 12€: é o trabalho mais demorado que fazemos.',
    chips: ['Quero encomendar', 'Ver exemplos'],
  },
  {
    id: 'occasion_seasonal',
    phrases: ['para o natal', 'para a pascoa', 'para o halloween', 'dia da mae', 'dia do pai', 'meu primeiro natal'],
    keywords: ['natal', 'pascoa', 'halloween', 'mae', 'pai', 'sazonal', 'christmas', 'easter'],
    answer:
      'Fazemos as épocas todas: Natal, Páscoa, Halloween, Dia da Mãe e Dia do Pai.\n\nPara o Natal e a Páscoa, encomenda com antecedência: são as alturas em que a agenda enche mais depressa.',
    chips: ['Ver categorias', 'Quero encomendar'],
    cta: 'categories',
  },

  // ── logistica do negocio ─────────────────────────────────────────────────
  {
    id: 'contact',
    phrases: ['qual o contacto', 'qual o vosso numero', 'tem whatsapp', 'qual o email', 'tem instagram', 'como falo convosco'],
    keywords: ['contacto', 'contactos', 'whatsapp', 'telefone', 'numero', 'email', 'mail', 'instagram', 'redes'],
    answer:
      `Falamos por aqui:\n\n• WhatsApp ${site.whatsappDisplay}, resposta em ${site.replyTime}\n• Email ${site.email}\n• Instagram ${site.instagramHandle}\n\nO WhatsApp é o mais rápido.`,
    cta: 'whatsapp',
  },
  {
    id: 'location',
    phrases: ['onde ficam', 'onde estao', 'tem loja fisica', 'posso ir ai', 'qual a morada', 'de que cidade sao'],
    keywords: ['loja', 'morada', 'endereco', 'localizacao', 'cidade', 'fisica', 'visitar', 'atelier'],
    answer:
      `Trabalhamos por encomenda, à mão, e enviamos para ${site.shipping}. Não temos loja aberta ao público.\n\nTodo o processo se faz pelo WhatsApp: mostras a ideia, aprovamos juntos e enviamos para tua casa.`,
    cta: 'whatsapp',
  },
  {
    id: 'hours',
    phrases: ['qual o horario', 'a que horas', 'estao abertos', 'quando respondem'],
    keywords: ['horario', 'horarios', 'aberto', 'abrem', 'fecham'],
    answer: `Recebemos mensagens a qualquer hora e respondemos em ${site.replyTime}, normalmente bem antes disso.`,
    cta: 'whatsapp',
  },
  {
    id: 'returns',
    phrases: ['posso cancelar', 'posso devolver', 'tem devolucao', 'e se nao gostar', 'se vier partido', 'chegou danificado'],
    keywords: ['devolucao', 'devolver', 'troca', 'trocar', 'cancelar', 'reembolso', 'partido', 'danificado', 'errado'],
    answer:
      'Como cada peça é feita de raiz para ti, o desenho é aprovado por ti antes de entrarmos em produção: é aí que se muda o que for preciso.\n\nSe a encomenda chegar danificada ou diferente do aprovado, fala connosco no WhatsApp com uma foto e resolvemos.',
    cta: 'whatsapp',
  },

  // ── intencao de compra ───────────────────────────────────────────────────
  {
    id: 'start_order',
    phrases: ['quero encomendar', 'quero fazer uma encomenda', 'como encomendo', 'como faco a encomenda', 'quero comprar', 'fazer um pedido', 'quero um topo', 'preciso de um topo', 'gostaria de encomendar'],
    keywords: ['encomendar', 'encomenda', 'comprar', 'pedido', 'pedir', 'quero'],
    answer: 'Boa. Faço-te quatro perguntas rápidas e no fim envias o pedido já escrito para o nosso WhatsApp.',
    priority: 3,
  },
]

/** Sugerencias iniciales del assistente. */
export const OPENING_CHIPS = ['Quanto custa?', 'Quanto tempo demora?', 'Quais são os papéis?', 'Quero encomendar']

/** Cuando nada casa, damos saidas concretas en vez de un "nao percebi" seco. */
export const FALLBACK = {
  answer:
    'Não tenho a certeza de ter percebido. Posso ajudar com estes temas:\n\n• Preços e orçamentos\n• Prazos e envios\n• Papéis, tamanhos e personalização\n• Encomendas para lojas e empresas\n\nEscolhe um, escreve a pergunta de outra maneira, ou fala connosco no WhatsApp.',
  chips: ['Quanto custa?', 'Quanto tempo demora?', 'Para onde enviam?', 'Quero encomendar'],
}
