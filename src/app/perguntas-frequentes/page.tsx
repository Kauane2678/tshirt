import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Tire suas dúvidas sobre prazos de entrega, formas de pagamento, trocas e tamanhos das camisas Style Shooes.",
};

const faqs = [
  {
    q: "Em quanto tempo recebo meu pedido?",
    a: "O prazo de entrega é de 3 a 7 dias úteis após a confirmação do pagamento. Para regiões mais distantes, pode chegar a 10 dias úteis. Você recebe o código de rastreio por e-mail assim que o pedido for despachado.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "PIX (com 5% de desconto e confirmação imediata), cartão de crédito em até 12× sem juros (Visa, Mastercard, Elo) e boleto bancário. Todos processados em ambiente 100% seguro com criptografia SSL.",
  },
  {
    q: "Como funciona o frete grátis?",
    a: "Pedidos acima de R$ 299,00 têm frete GRÁTIS para todo o Brasil. Abaixo disso, o frete é calculado em R$ 19,90 fixo.",
  },
  {
    q: "Posso trocar ou devolver a camisa?",
    a: "Sim! Você tem 30 dias após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. A peça precisa estar nova, sem uso e na embalagem original.",
  },
  {
    q: "Como saber meu tamanho?",
    a: "Na página de cada produto há a tabela de medidas. Em geral: P (38-40), M (40-42), G (42-44), GG (44-46), XGG (46-48). Em caso de dúvida, escolha um tamanho acima do habitual.",
  },
  {
    q: "Que tipo de camisa vocês vendem?",
    a: "Trabalhamos com camisetas tailandesas premium — réplicas de altíssima qualidade dos uniformes das principais seleções. Tecido com tecnologia de absorção de suor, costura reforçada, escudos bordados e detalhes idênticos aos modelos de campo. Custam uma fração do preço das versões de loja, mas com qualidade impressionante.",
  },
  {
    q: "Vocês entregam em todo o Brasil?",
    a: "Sim, entregamos em todo o território nacional via Correios e transportadoras parceiras.",
  },
  {
    q: "Como rastrear meu pedido?",
    a: "Após o despacho, você recebe um e-mail com o código de rastreio e link direto para acompanhar a entrega. Também é possível consultar pelo WhatsApp.",
  },
  {
    q: "Posso parcelar mesmo com pagamento via PIX?",
    a: "O PIX é apenas à vista, mas com 5% de desconto adicional. Para parcelar, escolha cartão de crédito (até 12× sem juros).",
  },
  {
    q: "É seguro comprar no site?",
    a: "Totalmente. Usamos criptografia SSL de 256 bits e nossos pagamentos são processados pela SigiloPay (certificada PCI DSS). Seus dados nunca são compartilhados.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Atendimento</p>
      <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-foreground mb-3">
        PERGUNTAS FREQUENTES
      </h1>
      <p className="text-muted-foreground text-sm mb-12">
        Tudo que você precisa saber antes (e depois) da sua compra.
      </p>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-card rounded-2xl border border-border p-5 transition-colors hover:border-primary/30 [&[open]]:border-primary/40"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-foreground">
              <span>{faq.q}</span>
              <span className="text-primary text-2xl font-light group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-12 bg-secondary rounded-2xl p-6 text-center">
        <p className="font-display text-2xl tracking-wider text-foreground mb-2">Não achou sua dúvida?</p>
        <p className="text-sm text-muted-foreground mb-4">Fale com a gente no WhatsApp — respondemos em até 1h</p>
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
