import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade da Style Shooes — saiba como tratamos seus dados pessoais conforme a LGPD.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">LGPD · Lei 13.709/2018</p>
      <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-foreground mb-3">
        POLÍTICA DE PRIVACIDADE
      </h1>
      <p className="text-muted-foreground text-sm mb-10">
        Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
      </p>

      <article className="flex flex-col gap-8 text-foreground">
        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">1. Quem somos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Style Shooes (CNPJ XX.XXX.XXX/0001-XX) é uma empresa brasileira dedicada à comercialização de camisas oficiais de seleções de futebol. Tratamos dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">2. Quais dados coletamos</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside flex flex-col gap-2">
            <li><strong className="text-foreground">Cadastro:</strong> nome completo, e-mail, CPF, telefone</li>
            <li><strong className="text-foreground">Entrega:</strong> endereço completo (CEP, rua, número, bairro, cidade, estado)</li>
            <li><strong className="text-foreground">Pagamento:</strong> dados do cartão são processados diretamente pelo gateway SigiloPay (não armazenamos)</li>
            <li><strong className="text-foreground">Navegação:</strong> cookies, IP, páginas visitadas (apenas para melhorar a experiência)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">3. Como usamos seus dados</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside flex flex-col gap-2">
            <li>Processar pedidos, pagamentos e entregas</li>
            <li>Emitir nota fiscal</li>
            <li>Enviar confirmações, códigos de rastreio e atualizações sobre o pedido</li>
            <li>Atendimento ao cliente em casos de troca ou devolução</li>
            <li>Enviar ofertas e novidades (apenas com seu consentimento explícito)</li>
            <li>Cumprir obrigações legais e fiscais</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">4. Com quem compartilhamos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Compartilhamos dados apenas quando estritamente necessário para concluir sua compra:
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside flex flex-col gap-2">
            <li><strong className="text-foreground">Gateway de pagamento (SigiloPay):</strong> para processar PIX, cartão e boleto</li>
            <li><strong className="text-foreground">Transportadoras (Correios e parceiros):</strong> para entregar seu pedido</li>
            <li><strong className="text-foreground">Receita Federal:</strong> para emissão de nota fiscal</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground">Nunca vendemos seus dados</strong> para terceiros.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">5. Seus direitos (LGPD)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            A qualquer momento você pode:
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside flex flex-col gap-2">
            <li>Confirmar a existência de tratamento dos seus dados</li>
            <li>Acessar uma cópia dos seus dados</li>
            <li>Corrigir dados incompletos ou inexatos</li>
            <li>Solicitar a exclusão dos dados (exceto os exigidos por lei fiscal)</li>
            <li>Revogar o consentimento para envio de comunicações</li>
            <li>Solicitar a portabilidade dos dados</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            Para exercer qualquer um desses direitos, envie um e-mail para <a href="mailto:contato@styleshooes01.com" className="text-primary font-semibold hover:underline">contato@styleshooes01.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">6. Segurança</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Usamos criptografia SSL de 256 bits em todas as páginas. Dados de cartão são processados via SigiloPay (certificada PCI DSS) e nunca trafegam ou são armazenados pelos nossos servidores.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">7. Cookies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Usamos cookies para manter seu carrinho ativo, lembrar suas preferências e medir o tráfego do site. Você pode desativar cookies no seu navegador, mas algumas funcionalidades podem deixar de funcionar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wider mb-3">8. Contato</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dúvidas, sugestões ou reclamações: <a href="mailto:contato@styleshooes01.com" className="text-primary font-semibold hover:underline">contato@styleshooes01.com</a>
          </p>
        </section>
      </article>
    </div>
  );
}
