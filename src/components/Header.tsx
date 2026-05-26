"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navLinks = [
  { label: "Camisas",    href: "/produtos?categoria=Camisas" },
  { label: "Brasil",     href: "/produtos?selecao=Brasil" },
  { label: "Promoções",  href: "/produtos?badge=Promoção" },
  { label: "Retrô",      href: "/produtos?badge=Retrô" },
];

/* ─── Mini-cart drawer ───────────────────────────────────── */
function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, subtotal, count, combo } = useCart();
  const shipping = total >= 299 ? 0 : 19.9;
  const finalTotal = total + shipping;
  const toFreeShipping = Math.max(0, 299 - total);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16 px-6 text-center">
        <ShoppingBag className="size-16 text-muted-foreground/20" aria-hidden="true" />
        <p className="font-display text-2xl tracking-wider text-foreground">CARRINHO VAZIO</p>
        <p className="text-sm text-muted-foreground">Adicione produtos e volte aqui.</p>
        <Link
          href="/produtos"
          onClick={onClose}
          className={cn(buttonVariants({ size: "sm" }), "rounded-full bg-primary font-bold px-6 mt-2")}
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Combo progress (3 por R$ 119,99) */}
      {count > 0 && (
        combo.hasCombo ? (
          <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-700">
              🔥 Combo aplicado! Você economizou R$&nbsp;{combo.discount.toFixed(2).replace(".", ",")}
            </span>
            {combo.unitsToNext < 3 && (
              <span className="text-[10px] text-amber-600">
                +{combo.unitsToNext} pra próximo combo
              </span>
            )}
          </div>
        ) : (
          <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-200">
            <p className="text-xs text-amber-800 mb-1.5">
              Falta <strong className="text-amber-700">{combo.unitsToNext} camiseta{combo.unitsToNext > 1 ? "s" : ""}</strong> para o combo <strong>3 por R$ 119,99</strong> 🔥
            </p>
            <div className="h-1.5 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${(count / 3) * 100}%` }}
                role="progressbar"
                aria-valuenow={Math.round((count / 3) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )
      )}

      {/* Free shipping progress */}
      {toFreeShipping > 0 ? (
        <div className="px-5 py-3 bg-secondary/60 border-b border-border">
          <p className="text-xs text-muted-foreground mb-1.5">
            Falta <strong className="text-foreground">R$&nbsp;{toFreeShipping.toFixed(2).replace(".", ",")}</strong> para <span className="text-green-600 font-bold">frete grátis</span>
          </p>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (total / 299) * 100)}%` }}
              role="progressbar"
              aria-valuenow={Math.round((total / 299) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      ) : (
        <div className="px-5 py-2.5 bg-green-50 border-b border-green-200 flex items-center gap-2">
          <span className="text-xs font-bold text-green-700">🎉 Frete grátis desbloqueado!</span>
        </div>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
            {/* Image */}
            <Link href={`/produto/${item.product.id}`} onClick={onClose}
              className="size-20 rounded-xl bg-secondary flex-shrink-0 overflow-hidden relative"
              aria-label={`Ver ${item.product.name}`}>
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <Link href={`/produto/${item.product.id}`} onClick={onClose}
                className="text-xs font-semibold text-foreground leading-tight hover:text-primary transition-colors line-clamp-2">
                {item.product.name}
              </Link>
              <p className="text-[11px] text-muted-foreground">Tam: <span className="font-bold text-foreground">{item.size}</span></p>
              {item.promoLabel && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 self-start">
                  ⚡ {item.promoLabel}
                </span>
              )}

              <div className="flex items-center justify-between mt-auto">
                {/* Qty controls */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                    aria-label="Diminuir"
                    className="size-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                  >
                    <Minus className="size-3" aria-hidden="true" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                    aria-label="Aumentar"
                    className="size-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                  >
                    <Plus className="size-3" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary tabular-nums">
                    R$&nbsp;{((item.promoPrice ?? item.product.price) * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => {
                      removeItem(item.product.id, item.size);
                      toast.info("Item removido");
                    }}
                    aria-label={`Remover ${item.product.name}`}
                    className="text-muted-foreground/40 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 pt-4 pb-5 flex flex-col gap-3 bg-card">
        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal ({count} {count === 1 ? "item" : "itens"})</dt>
            <dd className="tabular-nums">R$&nbsp;{subtotal.toFixed(2).replace(".", ",")}</dd>
          </div>
          {combo.hasCombo && (
            <div className="flex justify-between text-amber-600 font-semibold">
              <dt>🔥 Combo {combo.combos}× (3 por R$ 119,99)</dt>
              <dd className="tabular-nums">−R$&nbsp;{combo.discount.toFixed(2).replace(".", ",")}</dd>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <dt>Frete</dt>
            <dd>{shipping === 0
              ? <span className="text-green-600 font-bold">Grátis</span>
              : <span className="tabular-nums">R$&nbsp;{shipping.toFixed(2).replace(".", ",")}</span>}
            </dd>
          </div>
        </dl>

        <Separator />

        <div className="flex justify-between items-baseline">
          <span className="font-display text-lg tracking-wider text-foreground">TOTAL</span>
          <div className="text-right">
            <span className="font-display text-xl text-primary tabular-nums">
              R$&nbsp;{finalTotal.toFixed(2).replace(".", ",")}
            </span>
            <p className="text-[10px] text-muted-foreground">
              12× de R$&nbsp;{(finalTotal / 12).toFixed(2).replace(".", ",")} sem juros
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/checkout"
          onClick={onClose}
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full h-13 font-bold bg-primary hover:bg-primary/90 rounded-xl text-sm justify-center shadow-lg shadow-primary/25"
          )}
        >
          Finalizar pedido
          <ArrowRight className="size-4 ml-1" aria-hidden="true" />
        </Link>

        <Link
          href="/carrinho"
          onClick={onClose}
          className="text-xs text-center text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Ver carrinho completo
        </Link>
      </div>
    </div>
  );
}

/* ─── Header ─────────────────────────────────────────────── */
export default function Header() {
  const router = useRouter();
  const { count } = useCart();
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [cartOpen,   setCartOpen]     = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/produtos?q=${encodeURIComponent(q)}` : "/produtos");
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-2 px-4 font-medium tracking-wide">
        🔥 <strong className="font-bold">COMPRE JUNTO</strong> · 3 camisetas por R$&nbsp;119,99 · Frete grátis acima de R$&nbsp;299
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-6">
        {/* Logo */}
        <Link href="/" aria-label="Style Shooes — página inicial" className="flex-shrink-0">
          <span className="font-display text-2xl tracking-widest text-primary">
            STYLE<span className="text-accent">SHOOES</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-secondary transition-colors rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <Input
                autoFocus
                placeholder="Buscar camisa, seleção…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 h-9 text-sm rounded-lg"
                aria-label="Buscar produtos"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Fechar busca"
                className="size-8 flex items-center justify-center text-muted-foreground hover:text-primary rounded-md hover:bg-secondary transition-colors"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </form>
          ) : (
            <Tooltip>
              <TooltipTrigger
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar produtos"
                className="size-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Search aria-hidden="true" className="size-5" />
              </TooltipTrigger>
              <TooltipContent>Buscar</TooltipContent>
            </Tooltip>
          )}

          {/* Cart drawer */}
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger
              aria-label={`Carrinho${count > 0 ? ` — ${count} ${count === 1 ? "item" : "itens"}` : " vazio"}`}
              className="relative size-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ShoppingCart aria-hidden="true" className="size-5" />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px] font-bold bg-primary rounded-full pointer-events-none">
                  {count > 9 ? "9+" : count}
                </Badge>
              )}
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col gap-0">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
                <SheetTitle className="font-display text-2xl tracking-wider text-foreground">
                  MEU CARRINHO
                </SheetTitle>
                {count > 0 && (
                  <span className="text-xs font-bold text-muted-foreground">
                    {count} {count === 1 ? "item" : "itens"}
                  </span>
                )}
              </div>

              <CartDrawer onClose={() => setCartOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Abrir menu"
              className="md:hidden size-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu aria-hidden="true" className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <div className="bg-primary text-primary-foreground p-6">
                <span className="font-display text-2xl tracking-widest">
                  STYLE<span className="opacity-70">SHOOES</span>
                </span>
              </div>
              <nav aria-label="Menu mobile" className="p-4 flex flex-col gap-1 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
