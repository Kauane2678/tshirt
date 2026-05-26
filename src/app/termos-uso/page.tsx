import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso da loja online Style Shooes.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Loja online</p>
      <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-foreground mb-3">
        TERMOS DE USO
      </h1>
      <p className="text-muted-foreground text-sm mb-10">
        Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
      </p>

      <article className="flex flex-col gap-8 text-foreground">
        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">1. Aceitação dos termos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ao acessar e utilizar o site Style Shooes (styleshooes01.com), você concorda integralmente com estes Termos de Uso. Caso não concorde, recomendamos não utilizar o site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">2. Cadastro e conta</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As informações fornecidas no checkout (nome, CPF, endereço, contato) devem ser verdadeiras, completas e atualizadas. Você é o único responsável pela veracidade dos dados informados.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">3. Produtos e preços</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside flex flex-col gap-2">
            <li>Os preços são em Reais (BRL) e válidos por tempo determinado</li>
            <li>Imagens são meramente ilustrativas — pode haver pequena variação de cor entre o produto físico e a foto</li>
            <li>Reservamo-nos o direito de cancelar pedidos em casos comprovados de erro flagrante de preço (exemplo: R$ 1,00 ao invés de R$ 100,00)</li>
            <li>Estoque limitado às unidades disponíveis no momento da compra</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">4. Pagamento</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aceitamos PIX, cartão de crédito (até 12× sem juros) e boleto bancário. O processamento é feito pela <strong className="text-foreground">SigiloPay</strong>, gateway certificado PCI DSS. O pedido só é confirmado após aprovação do pagamento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">5. Entrega</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Prazo: 3 a 7 dias úteis após confirmação do pagamento, para a maioria das regiões. O pedido é enviado para o endereço informado no cadastro. Não nos responsabilizamos por entregas frustradas devido a endereço incompleto ou ausência de pessoa para recebimento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">6. Trocas e devoluções</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Conforme nossa <a href="/trocas-devolucoes" className="text-primary font-semibold hover:underline">Política de Trocas e Devoluções</a>, você tem 30 dias para trocar ou devolver, garantindo direitos previstos no Código de Defesa do Consumidor.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">7. Propriedade intelectual</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Todo o conteúdo do site (logo, textos, imagens, layout) é protegido por direitos autorais. É proibida a reprodução sem autorização prévia. Marcas de terceiros (CBF, AFA, Nike, Adidas, etc.) pertencem aos seus respectivos titulares.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">8. Limitação de responsabilidade</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Style Shooes não se responsabiliza por danos indiretos decorrentes do uso do site, falhas técnicas pontuais ou interrupções de terceiros (operadoras de internet, gateways, etc.).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">9. Foro e legislação</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estes termos são regidos pelas leis brasileiras. Fica eleito o foro do domicílio do consumidor para dirimir eventuais conflitos, conforme o Código de Defesa do Consumidor.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">10. Contato</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <a href="mailto:contato@styleshooes01.com" className="text-primary font-semibold hover:underline">contato@styleshooes01.com</a>
          </p>
        </section>
      </article>
    </div>
  );
}
