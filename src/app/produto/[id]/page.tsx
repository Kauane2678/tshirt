"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Truck, Shield, RotateCcw, Check, ArrowLeft, ThumbsUp, BadgeCheck, Heart, Ruler, X } from "lucide-react";
import { products } from "@/lib/data";
import { getProductReviews, getRatingBreakdown } from "@/lib/reviews";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/lib/useWishlist";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fbq } from "@/components/MetaPixel";

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <span className="font-display text-8xl text-muted-foreground/20 block mb-6" aria-hidden="true">404</span>
        <h1 className="font-display text-4xl tracking-wider text-foreground mb-4">PRODUTO NÃO ENCONTRADO</h1>
        <Link href="/produtos" className={cn(buttonVariants({ size: "lg" }), "bg-primary font-bold rounded-full px-8 mt-4")}>
          <ArrowLeft data-icon="inline-start" aria-hidden="true" /> Ver produtos
        </Link>
      </div>
    );
  }

  // Relacionados: prioriza mesma seleção, fallback pra produtos com mesmo badge ou mais vendidos
  const sameTeam   = products.filter((p) => p.id !== product.id && p.team  === product.team);
  const sameBadge  = products.filter((p) => p.id !== product.id && product.badge && p.badge === product.badge && p.team !== product.team);
  const bestSellers = [...products].filter((p) => p.id !== product.id).sort((a,b) => b.soldCount - a.soldCount);
  const related     = [...sameTeam, ...sameBadge, ...bestSellers]
    .filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)
    .slice(0, 4);
  const liked = has(product.id);
  useEffect(() => {
    fbq("track", "ViewContent", {
      content_ids:  [String(product.id)],
      content_name: product.name,
      content_type: "product",
      value:        product.price,
      currency:     "BRL",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem(product!, selectedSize);
    setAdded(true);
    toast.success("Adicionado ao carrinho!", {
      description: `${product!.name} — Tamanho ${selectedSize}`,
    });
    fbq("track", "AddToCart", {
      content_ids:   [String(product!.id)],
      content_name:  product!.name,
      content_type:  "product",
      value:         product!.price,
      currency:      "BRL",
    });
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Navegação estrutural" className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/produtos" className="hover:text-primary transition-colors">Produtos</Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl bg-secondary overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[10rem] text-muted-foreground/20 leading-none" aria-hidden="true">
                {product.team.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && <Badge className="bg-primary font-bold">{product.badge}</Badge>}
            {discount && <Badge className="bg-green-600 font-bold">-{discount}%</Badge>}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">
            {product.team} · {product.category}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wider text-foreground mb-4 leading-tight">
            {product.name.toUpperCase()}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-6" aria-label={`Avaliação ${product.rating} de 5 — ${product.reviews} avaliações`}>
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("size-4", i < Math.round(product.rating) ? "fill-accent text-accent" : "text-border")} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">{product.rating} ({product.reviews} avaliações)</span>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl tracking-wider text-primary">
                R$&nbsp;{product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  R$&nbsp;{product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
            <p className="text-sm text-green-600 font-semibold mt-1">
              em 12× de R$&nbsp;{(product.price / 12).toFixed(2).replace(".", ",")} sem juros
            </p>
          </div>

          {/* Sizes */}
          <fieldset className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <legend className="font-semibold text-sm text-foreground">
                Tamanho
                {selectedSize && <span className="text-primary ml-2">— {selectedSize}</span>}
              </legend>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-4"
                aria-label="Ver guia de tamanhos"
              >
                <Ruler aria-hidden="true" className="size-3.5" />
                Guia de tamanhos
              </button>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Selecione o tamanho">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  aria-label={`Tamanho ${size}`}
                  className={cn(
                    "size-12 rounded-xl text-sm font-bold border-2 transition-all focus-visible:ring-2 focus-visible:ring-ring",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p role="alert" className="text-xs text-destructive mt-2 font-medium">
                Selecione um tamanho para continuar
              </p>
            )}
          </fieldset>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button
              className={cn(
                "flex-1 h-13 text-sm font-bold rounded-xl",
                "bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40"
              )}
              disabled={!selectedSize}
              onClick={handleAddToCart}
              aria-label={selectedSize ? `Adicionar ${product.name} tamanho ${selectedSize} ao carrinho` : "Selecione um tamanho primeiro"}
            >
              {added ? (
                <><Check data-icon="inline-start" aria-hidden="true" /> Adicionado!</>
              ) : (
                <><ShoppingCart data-icon="inline-start" aria-hidden="true" /> Adicionar ao carrinho</>
              )}
            </Button>
            <button
              onClick={() => {
                toggle(product.id);
                toast.success(liked ? "Removido dos favoritos" : "Adicionado aos favoritos");
              }}
              aria-pressed={liked}
              aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className={cn(
                "h-13 px-4 rounded-xl border-2 transition-colors flex items-center justify-center",
                liked
                  ? "border-rose-500 bg-rose-50 text-rose-500"
                  : "border-border text-muted-foreground hover:border-rose-500 hover:text-rose-500"
              )}
            >
              <Heart aria-hidden="true" className={cn("size-5", liked && "fill-rose-500")} />
            </button>
          </div>

          <Separator className="mb-6" />

          {/* Benefits */}
          <ul className="flex flex-col gap-3">
            {[
              { icon: <Truck aria-hidden="true" className="size-4" />, text: "Frete grátis acima de R$\u00a0299" },
              { icon: <RotateCcw aria-hidden="true" className="size-4" />, text: "Troca gratuita em até 30 dias" },
              { icon: <Shield aria-hidden="true" className="size-4" />, text: "Versão tailandesa premium" },
            ].map((b) => (
              <li key={b.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="text-primary">{b.icon}</span>
                {b.text}
              </li>
            ))}
          </ul>

          <Separator className="my-6" />

          {/* Description */}
          <div>
            <h2 className="font-semibold text-sm text-foreground mb-3">Sobre este produto</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Features */}
          {"features" in product && Array.isArray((product as { features?: string[] }).features) && (
            <div className="mt-5">
              <h2 className="font-semibold text-sm text-foreground mb-3">Características</h2>
              <ul className="flex flex-col gap-2">
                {(product as { features: string[] }).features.map((f: string) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span aria-hidden="true" className="mt-1 size-1.5 rounded-full bg-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sold count */}
          {"soldCount" in product && (
            <p className="mt-5 text-xs text-muted-foreground font-medium">
              🔥 <span className="text-foreground font-bold">{(product as { soldCount: number }).soldCount.toLocaleString("pt-BR")}</span> unidades vendidas
            </p>
          )}
        </div>
      </div>

      {/* ── AVALIAÇÕES ───────────────────────────────── */}
      <ReviewsSection productId={product.id} rating={product.rating} totalReviews={product.reviews} />

      {/* ── RELACIONADOS ─────────────────────────────── */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-20">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Você também vai gostar</p>
          <h2 id="related-title" className="font-display text-4xl tracking-wider text-foreground mb-8">
            {sameTeam.length > 0 ? `MAIS DA SELEÇÃO ${product.team.toUpperCase()}` : "PRODUTOS RELACIONADOS"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── GUIA DE TAMANHOS (modal) ─────────────────── */}
      {sizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSizeGuideOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-5">
              <h2 id="size-guide-title" className="font-display text-2xl tracking-wider text-foreground flex items-center gap-2">
                <Ruler aria-hidden="true" className="size-5 text-primary" />
                GUIA DE TAMANHOS
              </h2>
              <button
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Fechar guia"
                className="size-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Meça o seu tórax e a largura na altura do peito (axila a axila) para encontrar o tamanho ideal. Em caso de dúvida entre 2 tamanhos, escolha o maior.
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Tamanho</th>
                      <th className="text-center px-4 py-3 font-bold text-foreground">Tórax (cm)</th>
                      <th className="text-center px-4 py-3 font-bold text-foreground">Largura (cm)</th>
                      <th className="text-center px-4 py-3 font-bold text-foreground">Altura (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: "P",   torax: "92-96",   largura: 50, altura: 70 },
                      { size: "M",   torax: "96-100",  largura: 53, altura: 72 },
                      { size: "G",   torax: "100-104", largura: 56, altura: 74 },
                      { size: "GG",  torax: "104-108", largura: 59, altura: 76 },
                      { size: "XGG", torax: "108-112", largura: 62, altura: 78 },
                    ].map((row) => (
                      <tr key={row.size} className="border-t border-border">
                        <td className="px-4 py-3 font-bold text-primary">{row.size}</td>
                        <td className="text-center px-4 py-3 text-muted-foreground tabular-nums">{row.torax}</td>
                        <td className="text-center px-4 py-3 text-muted-foreground tabular-nums">{row.largura}</td>
                        <td className="text-center px-4 py-3 text-muted-foreground tabular-nums">{row.altura}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 bg-secondary rounded-xl p-4">
                <p className="text-xs font-bold text-foreground mb-2">Como medir:</p>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li><strong className="text-foreground">Tórax:</strong> mede toda a circunferência do peito</li>
                  <li><strong className="text-foreground">Largura:</strong> de uma axila à outra com a camisa esticada na mesa</li>
                  <li><strong className="text-foreground">Altura:</strong> da gola até a barra inferior</li>
                </ul>
              </div>

              <p className="mt-4 text-xs text-muted-foreground text-center">
                Ainda em dúvida? Fala com a gente no WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reviews Section ──────────────────────────────────────
function ReviewsSection({ productId, rating, totalReviews }: { productId: number; rating: number; totalReviews: number }) {
  const productReviews = getProductReviews(productId);
  const breakdown = getRatingBreakdown(productId);

  return (
    <section aria-labelledby="reviews-title" className="mt-20 border-t border-border pt-16">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Summary */}
        <div>
          <h2 id="reviews-title" className="font-display text-4xl tracking-wider text-foreground mb-6">
            AVALIAÇÕES
          </h2>

          {/* Overall rating */}
          <div className="flex items-end gap-4 mb-6">
            <span className="font-display text-7xl text-primary leading-none tracking-wider">
              {rating.toFixed(1)}
            </span>
            <div className="pb-2">
              <div className="flex gap-1 mb-1" aria-label={`${rating} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} aria-hidden="true" className={cn("size-5", i < Math.round(rating) ? "fill-accent text-accent" : "text-border")} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{totalReviews.toLocaleString("pt-BR")} avaliações</p>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="flex flex-col gap-2" aria-label="Distribuição das avaliações">
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground w-4 text-right">{star}</span>
                <Star aria-hidden="true" className="size-3 fill-accent text-accent flex-shrink-0" />
                <div
                  role="progressbar"
                  aria-valuenow={breakdown[star]}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${star} estrelas — ${breakdown[star]}%`}
                  className="flex-1 h-2 bg-secondary rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${breakdown[star]}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 tabular-nums">{breakdown[star]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-2">
          {productReviews.length > 0 ? (
            <ol className="flex flex-col gap-6" aria-label="Lista de avaliações">
              {productReviews.map((review) => (
                <li key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="size-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-foreground flex-shrink-0"
                      >
                        {review.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{review.author}</span>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                              <BadgeCheck aria-hidden="true" className="size-3.5" />
                              Compra verificada
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{review.city} · {review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0" aria-label={`${review.rating} de 5 estrelas`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} aria-hidden="true" className={cn("size-3.5", i < review.rating ? "fill-accent text-accent" : "text-border")} />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm text-foreground mb-1.5">{review.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>

                  <button
                    className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`${review.helpful} pessoas acharam útil`}
                  >
                    <ThumbsUp aria-hidden="true" className="size-3.5" />
                    Útil ({review.helpful})
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Star aria-hidden="true" className="size-12 text-muted-foreground/20 mb-4" />
              <p className="font-semibold text-foreground mb-1">Ainda sem avaliações escritas</p>
              <p className="text-sm text-muted-foreground">
                Com base em {totalReviews.toLocaleString("pt-BR")} avaliações — nota {rating.toFixed(1)}/5
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
