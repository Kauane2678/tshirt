"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState, useEffect } from "react";
import {
  CheckCircle2, Home, Package, Sparkles, Gift, Clock,
  ShoppingBag, ArrowRight, Star, BadgeCheck, Zap,
} from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fbq } from "@/components/MetaPixel";

const UPSELL_PRICE = 40.00;
const UPSELL_LABEL = "OFERTA EXCLUSIVA · R$ 40";

/* ─── Countdown urgência ─────────────────────────────────── */
function Countdown() {
  const [seconds, setSeconds] = useState(15 * 60); // 15 min

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 rounded-full px-4 py-1.5 text-xs font-bold">
      <Clock className="size-3.5" aria-hidden="true" />
      Oferta expira em <span className="font-display tabular-nums">{mm}:{ss}</span>
    </div>
  );
}

/* ─── Card de upsell ─────────────────────────────────────── */
function UpsellCard({
  product,
  onAdd,
}: {
  product: (typeof products)[number];
  onAdd: (size: string) => void;
}) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <article className="group relative bg-card rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg shadow-amber-100 hover:shadow-2xl hover:-translate-y-1 transition-all">
      {/* Badge "Você foi escolhido" */}
      <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[10px] font-bold rounded-full px-2.5 py-1 shadow-lg flex items-center gap-1">
        <Sparkles className="size-3" aria-hidden="true" /> EXCLUSIVO
      </div>

      {/* Image */}
      <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Discount tag */}
        <div className="absolute bottom-3 left-3 bg-amber-400 text-amber-950 rounded-xl px-3 py-2 shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">de R$ {product.price.toFixed(2).replace(".", ",")}</p>
          <p className="font-display text-2xl tracking-wider leading-none">por R$&nbsp;40</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
            {product.team}
          </p>
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>

        {/* Size selector */}
        <fieldset>
          <legend className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
            Escolha o tamanho:
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                aria-label={`Tamanho ${s}`}
                className={cn(
                  "size-9 rounded-lg text-xs font-bold border-2 transition-all",
                  size === s
                    ? "border-amber-500 bg-amber-500 text-white shadow-md"
                    : "border-border text-muted-foreground hover:border-amber-500"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        {/* CTA */}
        <Button
          disabled={!size}
          onClick={() => size && onAdd(size)}
          className={cn(
            "w-full h-11 font-bold rounded-xl text-sm transition-all",
            size
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          )}
        >
          {size ? (
            <>
              <Zap data-icon="inline-start" aria-hidden="true" />
              Quero por R$ 40!
            </>
          ) : (
            "Selecione o tamanho"
          )}
        </Button>
      </div>
    </article>
  );
}

function ConfirmationContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { addItem, total } = useCart();
  const orderId = params.get("id");
  const method = params.get("method");

  useEffect(() => {
    if (!orderId) return;
    fbq("track", "Purchase", {
      value: total,
      currency: "BRL",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const methodLabel =
    method === "pix"          ? "PIX" :
    method === "credit_card"  ? "Cartão de Crédito" :
                                "Confirmado";

  // Seleciona 3 produtos pra upsell — prioriza badge "Promoção" e mais vendidos
  const upsellProducts = useMemo(() => {
    const candidates = [...products]
      .filter((p) => p.image)                  // só com imagem
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 12);
    // Embaralha pra rotacionar a oferta
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  function handleAddUpsell(product: (typeof products)[number], size: string) {
    addItem(product, size, {
      promoPrice: UPSELL_PRICE,
      promoLabel: UPSELL_LABEL,
    });
    toast.success("Adicionado ao pedido!", {
      description: `${product.name} · Tam ${size} · R$ 40,00`,
    });
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen bg-secondary/20 pb-20">
      {/* ── Hero confirmação ────────────────────── */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center flex flex-col items-center gap-5">
          <div className="size-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-300/50">
            <CheckCircle2 className="size-12 text-white" aria-hidden="true" />
          </div>

          <div>
            <p className="text-xs font-bold text-green-700 uppercase tracking-[0.15em] mb-2">
              Pedido realizado com sucesso
            </p>
            <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-foreground mb-3">
              CONFIRMADO!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              Seu pagamento via <strong className="text-foreground">{methodLabel}</strong> foi processado.
              {method === "pix"
                ? " O PIX foi confirmado e seu pedido está sendo preparado."
                : " Você receberá um e-mail com a confirmação."}
            </p>
          </div>

          {orderId && (
            <div className="bg-white rounded-2xl border border-green-200 px-6 py-3 shadow-sm">
              <p className="text-[11px] text-muted-foreground mb-0.5 uppercase tracking-wider">Número do pedido</p>
              <p className="font-display text-xl tracking-widest text-primary tabular-nums">#{orderId}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 w-full max-w-md mt-2">
            <div className="bg-white rounded-xl border border-border p-3 flex items-center gap-3">
              <Package className="size-5 text-primary flex-shrink-0" aria-hidden="true" />
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Entrega</p>
                <p className="text-[11px] text-muted-foreground">3–7 dias úteis</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border p-3 flex items-center gap-3">
              <BadgeCheck className="size-5 text-green-600 flex-shrink-0" aria-hidden="true" />
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Rastreamento</p>
                <p className="text-[11px] text-muted-foreground">Por e-mail</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upsell exclusivo ───────────────────── */}
      <section aria-labelledby="upsell-title" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden">
          {/* Glow */}
          <div aria-hidden="true" className="absolute -top-20 -right-20 size-64 bg-yellow-300/40 rounded-full blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-20 -left-20 size-64 bg-rose-300/30 rounded-full blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-rose-500 text-white rounded-full px-5 py-2 text-xs font-bold tracking-wider mb-4 shadow-lg shadow-rose-300/50">
              <Gift className="size-4" aria-hidden="true" />
              VOCÊ FOI ESCOLHIDO!
            </div>

            <h2 id="upsell-title" className="font-display text-4xl sm:text-5xl tracking-wider text-foreground mb-3 leading-[0.95]">
              OFERTA EXCLUSIVA<br/>
              <span className="text-rose-600">PARA VOCÊ</span>
            </h2>

            <p className="text-foreground/80 text-base sm:text-lg leading-relaxed mb-2 font-medium">
              Por completar seu pedido, ganhou o direito de adicionar
            </p>
            <p className="text-foreground text-2xl sm:text-3xl font-bold mb-4">
              <strong className="text-rose-600">+ 1 camiseta tailandesa</strong> por apenas
            </p>

            <div className="flex items-baseline justify-center gap-2 mb-5">
              <span className="font-display text-7xl sm:text-8xl tracking-wider text-rose-600 leading-none drop-shadow-md">
                R$&nbsp;40
              </span>
              <span className="text-2xl text-rose-600/70 line-through font-bold">R$&nbsp;299</span>
            </div>

            <Countdown />
          </div>
        </div>

        {/* 3 cards de upsell */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {upsellProducts.map((p) => (
            <UpsellCard
              key={p.id}
              product={p}
              onAdd={(size) => handleAddUpsell(p, size)}
            />
          ))}
        </div>

        {/* Trust mini-row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-green-600" aria-hidden="true"/>
            Mesmo endereço de entrega
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-amber-500" aria-hidden="true"/>
            Vai junto do seu pedido
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true"/>
            +12.000 clientes satisfeitos
          </span>
        </div>
      </section>

      {/* ── Skip / continue ─────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center bg-card rounded-2xl border border-border p-6 sm:p-8">
          <p className="text-sm text-muted-foreground mb-4">
            Não quer aproveitar? Sem problemas. Seu pedido principal já está confirmado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/produtos"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl font-bold"
              )}
            >
              <ShoppingBag data-icon="inline-start" aria-hidden="true" />
              Ver mais produtos
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-xl font-bold bg-primary hover:bg-primary/90"
              )}
            >
              <Home data-icon="inline-start" aria-hidden="true" />
              Página inicial
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
