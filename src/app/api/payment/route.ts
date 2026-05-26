import { NextRequest, NextResponse } from "next/server";

/**
 * Payment API — 100% SigiloPay
 *   PIX           → /gateway/pix/receive  (QR Code direto no nosso site)
 *   credit_card   → /gateway/checkout     (redireciona para página hospedada)
 */

const SIGILO_BASE_URL = "https://app.sigilopay.com.br/api/v1";
const FETCH_TIMEOUT   = 15_000; // 15s — Sigilo pode demorar pra responder

interface Customer {
  firstName?: string; lastName?: string; email?: string; cpf?: string; phone?: string;
  zipCode?: string; street?: string; number?: string; complement?: string;
  neighborhood?: string; city?: string; state?: string;
}
interface Cart   { total?: number; discount?: number; freight?: number }
interface Item   { id: string | number; name: string; quantity: number; price: number; size?: string }

/* ─── Helpers ─────────────────────────────────────────────── */

const onlyDigits = (s: string | undefined) => (s ?? "").replace(/\D/g, "");

/** Valida CPF pelo algoritmo oficial dos 2 dígitos verificadores */
function isValidCPF(cpf: string): boolean {
  const c = onlyDigits(cpf);
  if (c.length !== 11)        return false;
  if (/^(\d)\1{10}$/.test(c)) return false; // todos iguais (000.000.000-00 etc.)

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(c[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(c[10]);
}

function getSigiloAuth() {
  const pub = process.env.SIGILO_PUBLIC_KEY ?? "";
  const sec = process.env.SIGILO_SECRET_KEY ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return { pub, sec, site };
}

function sigiloHeaders(pub: string, sec: string) {
  return {
    "x-public-key": pub,
    "x-secret-key": sec,
    "Content-Type": "application/json",
    "Accept":       "application/json",
  };
}

async function fetchWithTimeout(url: string, init: RequestInit, ms = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function validate(customer: Customer, cart: Cart, items: Item[]) {
  const issues: string[] = [];
  if (!customer?.firstName) issues.push("Nome ausente");
  if (!customer?.lastName)  issues.push("Sobrenome ausente");
  if (!customer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) issues.push("E-mail inválido");
  if (!isValidCPF(customer?.cpf ?? "")) issues.push("CPF inválido");
  if (onlyDigits(customer?.phone).length < 10) issues.push("Telefone inválido");
  if (!cart?.total || cart.total <= 0) issues.push("Valor do carrinho inválido");
  if (!items || items.length === 0) issues.push("Carrinho vazio");
  return issues;
}

/* ─── Route handler ──────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const { pub, sec, site } = getSigiloAuth();

  if (!pub || !sec) {
    console.error("[Payment] Credenciais SigiloPay não configuradas");
    return NextResponse.json(
      { error: { message: "Gateway de pagamento não configurado. Contate o suporte." } },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: "Requisição inválida" } }, { status: 400 });
  }

  const { method, customer, cart, items = [] } = body ?? {};

  const issues = validate(customer, cart, items);
  if (issues.length > 0) {
    return NextResponse.json(
      { error: { message: "Dados incompletos ou inválidos", issues } },
      { status: 400 }
    );
  }

  if (method === "pix")         return chargePix({ customer, cart, items, pub, sec, site });
  if (method === "credit_card") return createCheckout({ customer, cart, items, pub, sec, site });

  return NextResponse.json({ error: { message: "Método de pagamento inválido" } }, { status: 400 });
}

/* ─── PIX direto ─────────────────────────────────────────── */

async function chargePix({
  customer, cart, items, pub, sec, site,
}: {
  customer: Customer; cart: Cart; items: Item[];
  pub: string; sec: string; site: string;
}) {
  const identifier = `SS${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

  const payload = {
    identifier,
    amount:      Number(cart.total!.toFixed(2)),
    shippingFee: Number((cart.freight  ?? 0).toFixed(2)),
    discount:    Number((cart.discount ?? 0).toFixed(2)),
    client: {
      name:     `${customer.firstName} ${customer.lastName}`.trim(),
      email:    customer.email!,
      phone:    onlyDigits(customer.phone),
      document: onlyDigits(customer.cpf),
    },
    products: items.map((i, idx) => ({
      id:       `${i.id}${i.size ? "-" + i.size : ""}-${idx}`, // unique per cart line
      name:     i.name,
      quantity: i.quantity,
      price:    Number(i.price.toFixed(2)),
    })),
    metadata: { provider: "Style Shooes", orderId: identifier },
    ...(site ? { callbackUrl: `${site}/api/webhook/sigilo` } : {}),
  };

  try {
    const res  = await fetchWithTimeout(`${SIGILO_BASE_URL}/gateway/pix/receive`, {
      method:  "POST",
      headers: sigiloHeaders(pub, sec),
      body:    JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[Sigilo PIX] erro HTTP", res.status, data);
      return NextResponse.json(
        {
          error: {
            message: data?.message ?? "Não foi possível gerar o PIX",
            errorCode: data?.errorCode,
            details:   data?.details,
          },
        },
        { status: res.status }
      );
    }

    if (!data?.pix?.code) {
      console.error("[Sigilo PIX] resposta sem QR code", data);
      return NextResponse.json(
        { error: { message: "Resposta inválida do gateway PIX" } },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success:  true,
      orderId:  data.transactionId,
      status:   data.status,
      pix: {
        qrCode:        data.pix.code,
        qrCodeBase64:  data.pix.base64,
        qrCodeImage:   data.pix.image,
      },
    });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error("[Sigilo PIX] erro:", err);
    return NextResponse.json(
      { error: { message: isAbort ? "Tempo esgotado ao gerar PIX. Tente novamente." : "Erro de conexão com gateway PIX." } },
      { status: 504 }
    );
  }
}

/* ─── Checkout hospedado (cartão) ────────────────────────── */

async function createCheckout({
  customer, cart, items, pub, sec, site,
}: {
  customer: Customer; cart: Cart; items: Item[];
  pub: string; sec: string; site: string;
}) {
  const externalId = `SS${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  const productName = items.length === 1
    ? items[0].name
    : `Pedido Style Shooes (${items.reduce((s, i) => s + i.quantity, 0)} itens)`;

  // Endpoint de checkout espera price em REAIS (decimal)
  const priceInReais = Number(cart.total!.toFixed(2));

  const hasFullAddress = Boolean(
    customer.zipCode && customer.street && customer.number &&
    customer.city    && customer.state  && customer.neighborhood
  );

  const payload = {
    product: {
      externalId,
      name:   productName,
      photos: [],
      offer: {
        name:      "Compra Style Shooes",
        price:     priceInReais,
        offerType: "NATIONAL",
        currency:  "BRL",
        lang:      "pt-BR",
      },
    },
    settings: {
      // Mantemos PIX e BOLETO como fallback caso CREDIT_CARD não esteja
      // ativado na conta SigiloPay (evita "Sem método de pagamento").
      paymentMethods: ["CREDIT_CARD", "PIX", "BOLETO"],
      acceptedDocs:   ["CPF"],
      askForAddress:  !hasFullAddress, // só pede endereço se ainda não temos
      thankYouPage:   site ? `${site}/pedido-confirmado?id=${externalId}&method=credit_card` : "",
      colors: {
        primaryColor:             "#1d4fd6",
        purchaseButtonBackground: "#1d4fd6",
        purchaseButtonText:       "#FFFFFF",
      },
    },
    customer: {
      name:     `${customer.firstName} ${customer.lastName}`.trim(),
      email:    customer.email!,
      phone:    onlyDigits(customer.phone),
      document: onlyDigits(customer.cpf),
      ...(hasFullAddress ? {
        address: {
          street:       customer.street!,
          number:       customer.number!,
          city:         customer.city!,
          state:        customer.state!,
          zipCode:      onlyDigits(customer.zipCode),
          neighborhood: customer.neighborhood!,
          complement:   customer.complement ?? "",
        },
      } : {}),
    },
    trackProps: { external_id: externalId, source: "Style Shooes" },
  };

  try {
    const res  = await fetchWithTimeout(`${SIGILO_BASE_URL}/gateway/checkout`, {
      method:  "POST",
      headers: sigiloHeaders(pub, sec),
      body:    JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.checkoutUrl) {
      console.error("[Sigilo Checkout] erro HTTP", res.status, data);
      return NextResponse.json(
        {
          error: {
            message:   data?.message ?? "Não foi possível abrir o checkout",
            errorCode: data?.errorCode,
            details:   data?.details,
          },
        },
        { status: res.status || 502 }
      );
    }

    return NextResponse.json({
      success:     true,
      orderId:     externalId,
      checkoutUrl: data.checkoutUrl,
    });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error("[Sigilo Checkout] erro:", err);
    return NextResponse.json(
      { error: { message: isAbort ? "Tempo esgotado. Tente novamente." : "Erro de conexão com gateway." } },
      { status: 504 }
    );
  }
}
