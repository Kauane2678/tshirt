"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fbq } from "@/components/MetaPixel";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, subtotal, count, combo } = useCart();

  // O `total` do contexto já vem com o combo aplicado.
  const shipping   = total >= 119.99 ? 0 : 19.9;
  const finalTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center flex flex-col items-center gap-6">
        <span className="font-display text-[8rem] leading-none text-muted-foreground/10 select-none" aria-hidden="true">0</span>
        <ShoppingCart aria-hidden="true" className="size-16 text-muted-foreground/30 -mt-12" />
        <h1 className="font-display text-4xl tracking-wider text-foreground">CARRINHO VAZIO</h1>
        <p className="text-muted-foreground text-sm">Você ainda não adicionou nenhum produto.</p>
        <Link
          href="/produtos"
          className={cn(buttonVariants({ size: "lg" }), "bg-primary rounded-full font-bold px-10 mt-2")}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Seu pedido</p>
      <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-foreground mb-2">CARRINHO</h1>
      <p className="text-muted-foreground text-sm mb-10">
        {count} item{count !== 1 ? "s" : ""}
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <article
              key={`${item.product.id}-${item.size}`}
              aria-label={`${item.product.name}, tamanho ${item.size}`}
              className="flex gap-4 bg-card rounded-2xl border border-border p-4 hover:border-primary/30 transition-colors"
            >
              {/* Thumbnail */}
              <Link
                href={`/produto/${item.product.id}`}
                aria-label={`Ver ${item.product.name}`}
                className="size-24 rounded-xl bg-secondary flex-shrink-0 overflow-hidden relative"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wider">{item.product.team}</p>
                  <h2 className="font-semibold text-sm text-foreground truncate">{item.product.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    Tamanho: <span className="font-semibold text-foreground">{item.size}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  {/* Quantity */}
                  <div
                    role="group"
                    aria-label="Quantidade"
                    className="flex items-center gap-0 border border-border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                      aria-label="Diminuir quantidade"
                      className="size-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    >
                      <Minus aria-hidden="true" className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                      aria-label="Aumentar quantidade"
                      className="size-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    >
                      <Plus aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary tabular-nums">
                      R$&nbsp;{((item.promoPrice ?? item.product.price) * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                    <button
                      onClick={() => {
                        removeItem(item.product.id, item.size);
                        toast.info("Item removido do carrinho");
                      }}
                      aria-label={`Remover ${item.product.name} do carrinho`}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 mt-2"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Continuar comprando
          </Link>
        </div>

        {/* Summary */}
        <aside aria-label="Resumo do pedido">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-display text-2xl tracking-wider text-foreground mb-6">RESUMO</h2>

            {/* Combo info — promo principal */}
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-1">
                <Tag aria-hidden="true" className="size-4" />
                COMPRE JUNTO
              </p>
              <p className="text-xs text-amber-800">
                Leve <strong>3 camisetas por R$ 119,99</strong> — desconto aplicado automaticamente!
              </p>
            </div>

            <Separator className="mb-5" />

            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal ({count} {count === 1 ? "item" : "itens"})</dt>
                <dd className="tabular-nums">R$&nbsp;{subtotal.toFixed(2).replace(".", ",")}</dd>
              </div>
              {combo.hasCombo && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <dt>🔥 Combo {combo.combos}× (3 por R$&nbsp;119,99)</dt>
                  <dd className="tabular-nums">−R$&nbsp;{combo.discount.toFixed(2).replace(".", ",")}</dd>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <dt>Frete</dt>
                <dd>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold">Grátis</span>
                  ) : (
                    <span className="tabular-nums">R$&nbsp;{shipping.toFixed(2).replace(".", ",")}</span>
                  )}
                </dd>
              </div>
              {!combo.hasCombo && combo.unitsToNext > 0 && combo.unitsToNext < 3 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  🔥 Adicione <strong>+{combo.unitsToNext} camiseta{combo.unitsToNext > 1 ? "s" : ""}</strong> para o combo <strong>3 por R$ 119,99</strong>
                </div>
              )}
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Falta R$&nbsp;{(119.97 - total).toFixed(2).replace(".", ",")} para frete grátis
                </p>
              )}
            </dl>

            <Separator className="my-5" />

            <div className="flex justify-between items-baseline font-bold text-foreground mb-6">
              <span className="font-display text-xl tracking-wider">TOTAL</span>
              <span className="font-display text-2xl text-primary tracking-wider tabular-nums">
                R$&nbsp;{finalTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={() =>
                fbq("track", "InitiateCheckout", {
                  content_ids: items.map((i) => String(i.product.id)),
                  num_items: count,
                  value: finalTotal,
                  currency: "BRL",
                })
              }
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full h-12 font-bold bg-primary hover:bg-primary/90 rounded-xl text-sm justify-center"
              )}
            >
              Finalizar Compra
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v2h12v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3z" /><rect x="3" y="13" width="18" height="8" rx="2" /></svg>
              Pagamento 100% seguro · AppMax
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
