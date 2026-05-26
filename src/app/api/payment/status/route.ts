import { NextRequest, NextResponse } from "next/server";

const SIGILO_BASE_URL = "https://app.sigilopay.com.br/api/v1";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId obrigatório" }, { status: 400 });
  }

  const pub = process.env.SIGILO_PUBLIC_KEY ?? "";
  const sec = process.env.SIGILO_SECRET_KEY ?? "";

  if (!pub || !sec) {
    return NextResponse.json({ error: "Gateway não configurado" }, { status: 500 });
  }

  try {
    const res = await fetch(`${SIGILO_BASE_URL}/gateway/transaction/${orderId}`, {
      headers: {
        "x-public-key": pub,
        "x-secret-key": sec,
        "Accept": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ status: "PENDING" });
    }

    // SigiloPay retorna status: PENDING, PAID, CANCELED, REFUNDED
    return NextResponse.json({ status: data?.status ?? "PENDING" });
  } catch {
    return NextResponse.json({ status: "PENDING" });
  }
}
