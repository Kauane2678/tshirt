import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook SigiloPay — recebe notificações de transação
 * Configure em: app.sigilopay.com.br → Configurações → Webhooks
 * URL: https://styleshooes01.com/api/webhook/sigilo
 *
 * Eventos suportados:
 *   TRANSACTION_CREATED      — transação criada (pedido iniciado)
 *   TRANSACTION_PAID         — pagamento confirmado ✅
 *   TRANSACTION_CANCELED     — transação cancelada
 *   TRANSACTION_REFUNDED     — estorno
 *   TRANSACTION_CHARGED_BACK — chargeback
 *
 * Para validar autenticidade, defina SIGILO_WEBHOOK_TOKEN em .env.local
 * com o token gerado pela SigiloPay ao criar o webhook no painel.
 */

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const {
    event,
    token,
    offerCode,
    client,
    transaction,
    subscription,
    orderItems,
    trackProps,
  } = body ?? {};

  // ── Validação opcional do token ──
  const expectedToken = process.env.SIGILO_WEBHOOK_TOKEN;
  if (expectedToken && token !== expectedToken) {
    console.warn("[Sigilo Webhook] Token inválido recebido");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const txId    = transaction?.id ?? transaction?.transactionId ?? "—";
  const txValue = transaction?.amount ?? transaction?.total ?? "—";
  const email   = client?.email ?? "—";

  console.log(`[Sigilo Webhook] event=${event} tx=${txId} value=${txValue} email=${email}`);

  switch (event) {
    case "TRANSACTION_CREATED":
      // pedido iniciado mas ainda não pago — apenas logar
      break;

    case "TRANSACTION_PAID":
      console.log(`✅ PAGAMENTO CONFIRMADO · TX #${txId} · cliente: ${email}`);
      // TODO: persistir pedido como pago no banco
      // TODO: enviar e-mail de confirmação ao cliente
      // TODO: notificar logística para preparar envio
      break;

    case "TRANSACTION_CANCELED":
      console.log(`❌ Cancelada · TX #${txId}`);
      // TODO: marcar como cancelada
      break;

    case "TRANSACTION_REFUNDED":
      console.log(`↩️ Estornada · TX #${txId}`);
      // TODO: marcar como estornada, notificar cliente
      break;

    case "TRANSACTION_CHARGED_BACK":
      console.log(`⚠️ CHARGEBACK · TX #${txId} — investigar imediatamente!`);
      // TODO: bloquear envio, alertar admin
      break;

    default:
      console.log(`[Sigilo Webhook] evento desconhecido: ${event}`);
  }

  // SigiloPay exige status 2XX para confirmar recebimento
  return NextResponse.json({ received: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({
    status:  "Sigilo Pay webhook ativo",
    version: "1.0",
    events:  ["TRANSACTION_CREATED", "TRANSACTION_PAID", "TRANSACTION_CANCELED", "TRANSACTION_REFUNDED", "TRANSACTION_CHARGED_BACK"],
  });
}
