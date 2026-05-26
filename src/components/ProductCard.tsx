"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/lib/useWishlist";
import { Product } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, product.sizes[0]);
    toast.success("Adicionado ao carrinho!", {
      description: `${product.name} — ${product.sizes[0]}`,
    });
  }

  return (
    <article className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      {/* Image */}
      <Link
        href={`/produto/${product.id}`}
        aria-label={`Ver detalhes de ${product.name}`}
        className="block relative aspect-[4/5] bg-secondary overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30">
            <span className="font-display text-6xl tracking-widest">
              {product.team.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <Badge className="text-[10px] font-bold px-2 py-0.5 bg-primary">
              {product.badge}
            </Badge>
          )}
          {discount && (
            <Badge className="text-[10px] font-bold px-2 py-0.5 bg-green-600">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
            toast.success(liked ? "Removido dos favoritos" : "Adicionado aos favoritos");
          }}
          aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={liked}
          className={cn(
            "absolute top-3 right-3 size-8 rounded-full flex items-center justify-center transition-all backdrop-blur-sm",
            liked
              ? "bg-rose-500 text-white shadow-lg scale-110"
              : "bg-white/90 text-muted-foreground hover:text-rose-500 hover:scale-110"
          )}
        >
          <Heart aria-hidden="true" className={cn("size-4 transition-all", liked && "fill-white")} />
        </button>

        {/* Quick add — slide up on hover */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <Button
            size="sm"
            className="w-full bg-primary/95 hover:bg-primary text-primary-foreground font-semibold text-xs rounded-xl backdrop-blur-sm"
            onClick={handleQuickAdd}
            tabIndex={-1}
          >
            <ShoppingCart data-icon="inline-start" aria-hidden="true" />
            Adicionar rápido
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
          {product.team}
        </p>
        <Link href={`/produto/${product.id}`} className="group/link">
          <h3 className="font-semibold text-sm text-foreground group-hover/link:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mt-2" aria-label={`Avaliação: ${product.rating} de 5`}>
          <div className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3",
                  i < Math.round(product.rating)
                    ? "fill-accent text-accent"
                    : "fill-none text-border"
                )}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            R$&nbsp;{product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              R$&nbsp;{product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          em até 12× sem juros
        </p>
      </div>
    </article>
  );
}
