import type { Metadata } from "next";
import { RotateCcw, Truck, Mail, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description: "Política de trocas e devoluções da Style Shooes — 30 dias para trocar ou devolver, sem burocracia.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Política</p>
      <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-foreground mb-3">
        TROCAS &amp; DEVOLUÇÕES
      </h1>
      <p className="text-muted-foreground text-sm mb-12">
        Comprou e não gostou? Troca ou devolução em até 30 dias, simples e sem burocracia.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: RotateCcw, title: "30 dias",         sub: "Para trocar ou devolver" },
          { icon: Truck,     title: "Frete grátis",    sub: "Na primeira troca" },
          { icon: CheckCircle2, title: "Reembolso",   sub: "Em até 7 dias úteis" },
        ].map(({ icon: Icon, title, sub }) => (
          <div key={title} className="bg-card rounded-2xl border border-border p-5 text-center">
            <Icon className="size-8 text-primary mx-auto mb-3" aria-hidden="true" />
            <p className="font-display text-2xl text-foreground tracking-wider">{title}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <article className="prose prose-sm max-w-none flex flex-col gap-8 text-foreground">
        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">Prazo</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            De acordo com o Código de Defesa do Consumidor (Art. 49), você tem o direito de desistir da compra em até <strong className="text-foreground">7 dias corridos</strong> após o recebimento. Para sua comodidade, ampliamos esse prazo para <strong className="text-foreground">30 dias</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">Condições</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside flex flex-col gap-2">
            <li>A peça deve estar <strong className="text-foreground">nova, sem uso</strong> e com a etiqueta original</li>
            <li>Embalagem original preservada</li>
            <li>Não pode haver lavagem, manchas, perfumes ou qualquer alteração</li>
            <li>O comprovante de compra (e-mail de confirmação) deve ser anexado</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">Como solicitar</h2>
          <ol className="text-sm text-muted-foreground leading-relaxed list-decimal list-inside flex flex-col gap-2">
            <li>Envie um WhatsApp ou e-mail com o número do pedido e o motivo</li>
            <li>Aguarde o nosso retorno com o código de postagem (frete por nossa conta)</li>
            <li>Poste a peça nos Correios com o código fornecido</li>
            <li>Após receber e conferir a peça, processamos a troca ou estorno</li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">Reembolso</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">PIX:</strong> reembolso em até 3 dias úteis após aprovação.<br/>
            <strong className="text-foreground">Cartão:</strong> estorno aparece na próxima fatura ou em até 2 faturas, conforme política da operadora.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">Defeito de fabricação</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Se a peça apresentar qualquer defeito, entre em contato em até 90 dias após a compra. A troca ou reembolso é integral e o frete é por nossa conta.
          </p>
        </section>
      </article>

      <div className="mt-12 bg-secondary rounded-2xl p-6 flex items-center gap-4">
        <Mail className="size-8 text-primary flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold text-sm text-foreground">Precisa abrir uma troca ou devolução?</p>
          <p className="text-xs text-muted-foreground">
            Envie um e-mail para <a href="mailto:contato@styleshooes01.com" className="text-primary font-semibold hover:underline">contato@styleshooes01.com</a> ou fale no WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
