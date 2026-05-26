import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, Shield, RotateCcw, CreditCard, Star, BadgeCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
import { testimonials } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const featured = products.filter((p) => p.badge).slice(0, 4);
const newArrivals = products.slice(0, 8);

// Imagem principal do hero — escolhida da Brasil Home 2024 (flagship)
const HERO_PRIMARY = products.find(p => p.name.includes("Brasil Home 2024")) ?? products[0];
// Imagens secundárias do colagem (à direita)
const HERO_GALLERY = products
  .filter(p => p.image && p.id !== HERO_PRIMARY.id)
  .slice(0, 3);

const benefits = [
  { icon: <Truck aria-hidden="true" className="size-5" />, title: "Frete Grátis", desc: "Acima de R$\u00a0299" },
  { icon: <RotateCcw aria-hidden="true" className="size-5" />, title: "Troca Fácil", desc: "30 dias para trocar" },
  { icon: <Shield aria-hidden="true" className="size-5" />, title: "Tailandesa Premium", desc: "Qualidade altíssima" },
  { icon: <CreditCard aria-hidden="true" className="size-5" />, title: "12× Sem Juros", desc: "No cartão de crédito" },
];

export default function Home() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-900 min-h-[92vh] flex items-center">
        {/* Background — radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,221,0,0.15),transparent_45%)]"
        />

        {/* Background — diagonal accent stripes (Brazil colors) */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-20 h-[120%] w-[35%] bg-accent/8 skew-x-[-12deg]" />
          <div className="absolute -left-10 -top-10 h-[120%] w-[2px] bg-accent/40 skew-x-[-12deg]" />
          <div className="absolute right-1/2 top-1/2 h-[120%] w-[1px] bg-white/5 skew-x-[-12deg]" />
        </div>

        {/* Background — giant editorial number */}
        <span
          aria-hidden="true"
          className="absolute right-[-8%] top-1/2 -translate-y-1/2 font-display text-[42vw] lg:text-[32vw] leading-none text-white/[0.04] select-none pointer-events-none"
        >
          10
        </span>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-6 z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 animate-card">
              <div className="h-px w-12 bg-accent" aria-hidden="true" />
              <span className="text-accent font-semibold text-xs tracking-[0.2em] uppercase">
                Coleção Tailandesa 2024 · 25
              </span>
            </div>

            <h1 className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.85] tracking-wider text-white mb-6 animate-card" style={{ animationDelay: "100ms" }}>
              VISTA<br/>
              SUA <span className="text-accent">PAIXÃO</span>
            </h1>

            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-md animate-card" style={{ animationDelay: "200ms" }}>
              Camisas oficiais das maiores seleções do mundo.
              <span className="text-white font-semibold"> 164 modelos</span> · Frete grátis acima de R$ 119,97.
            </p>

            <div className="flex flex-wrap gap-3 mb-10 animate-card" style={{ animationDelay: "300ms" }}>
              <Link
                href="/produtos"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-8 h-13 text-sm rounded-full shadow-2xl shadow-accent/40"
                )}
              >
                Ver coleção completa
                <ArrowRight data-icon="inline-end" aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/produtos?badge=Promoção"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 text-white hover:bg-white/10 h-13 px-8 text-sm rounded-full bg-white/5 backdrop-blur-sm"
                )}
              >
                🔥 Promoções
              </Link>
            </div>

            {/* Mini trust row */}
            <div className="flex items-center gap-5 text-white/60 text-xs animate-card" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-1.5">
                <div className="flex" aria-hidden="true">
                  {[1,2,3,4,5].map(i => <Star key={i} className="size-3 fill-accent text-accent"/>)}
                </div>
                <span><strong className="text-white">4.9</strong> · 12k+ clientes</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <BadgeCheck className="size-3.5 text-accent" aria-hidden="true"/>
                <span>Tailandesa premium</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Shield className="size-3.5 text-accent" aria-hidden="true"/>
                <span>Compra segura</span>
              </div>
            </div>
          </div>

          {/* Right: jersey collage */}
          <div className="lg:col-span-6 relative h-[500px] lg:h-[600px] hidden lg:block">
            {/* Glow behind */}
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px]" aria-hidden="true" />

            {/* Main jersey — large center */}
            <Link
              href={`/produto/${HERO_PRIMARY.id}`}
              aria-label={`Ver ${HERO_PRIMARY.name}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              <div className="relative w-[380px] h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={HERO_PRIMARY.image}
                  alt={HERO_PRIMARY.name}
                  fill
                  priority
                  sizes="380px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <Badge className="bg-accent text-accent-foreground font-bold mb-2">
                    {HERO_PRIMARY.badge ?? "Destaque"}
                  </Badge>
                  <p className="font-display text-2xl tracking-wider leading-tight">
                    {HERO_PRIMARY.name.toUpperCase()}
                  </p>
                  <p className="text-sm text-white/80 mt-1">
                    a partir de <strong className="text-accent">R$ {HERO_PRIMARY.price.toFixed(2).replace(".", ",")}</strong>
                  </p>
                </div>
              </div>
            </Link>

            {/* Side jerseys — floating cards */}
            {HERO_GALLERY[0] && (
              <Link
                href={`/produto/${HERO_GALLERY[0].id}`}
                aria-label={`Ver ${HERO_GALLERY[0].name}`}
                className="absolute top-[8%] right-[2%] z-10 w-[180px] h-[230px] rounded-2xl overflow-hidden shadow-2xl rotate-[8deg] hover:rotate-0 transition-transform duration-500 ring-1 ring-white/10"
              >
                <Image src={HERO_GALLERY[0].image} alt={HERO_GALLERY[0].name} fill sizes="180px" className="object-cover" />
              </Link>
            )}
            {HERO_GALLERY[1] && (
              <Link
                href={`/produto/${HERO_GALLERY[1].id}`}
                aria-label={`Ver ${HERO_GALLERY[1].name}`}
                className="absolute bottom-[5%] left-[0%] z-10 w-[160px] h-[210px] rounded-2xl overflow-hidden shadow-2xl rotate-[-10deg] hover:rotate-0 transition-transform duration-500 ring-1 ring-white/10"
              >
                <Image src={HERO_GALLERY[1].image} alt={HERO_GALLERY[1].name} fill sizes="160px" className="object-cover" />
              </Link>
            )}
            {HERO_GALLERY[2] && (
              <Link
                href={`/produto/${HERO_GALLERY[2].id}`}
                aria-label={`Ver ${HERO_GALLERY[2].name}`}
                className="absolute bottom-[15%] right-[8%] z-10 w-[140px] h-[180px] rounded-2xl overflow-hidden shadow-2xl rotate-[12deg] hover:rotate-0 transition-transform duration-500 ring-1 ring-white/10"
              >
                <Image src={HERO_GALLERY[2].image} alt={HERO_GALLERY[2].name} fill sizes="140px" className="object-cover" />
              </Link>
            )}

            {/* Floating stats badge */}
            <div className="absolute top-[2%] left-[8%] z-30 bg-white text-foreground rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-card" style={{ animationDelay: "500ms" }}>
              <div className="size-9 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display font-bold text-sm leading-none">3×</span>
              </div>
              <div>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">🔥 Combo Especial</p>
                <p className="text-xs font-bold">3 camisetas por <span className="text-amber-500">R$&nbsp;119,99</span></p>
              </div>
            </div>

            <div className="absolute bottom-[2%] right-[2%] z-30 bg-accent text-accent-foreground rounded-2xl px-4 py-3 shadow-2xl animate-card" style={{ animationDelay: "600ms" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">12× sem</p>
              <p className="font-display text-xl tracking-wider leading-none">JUROS</p>
            </div>
          </div>

          {/* Mobile: single jersey image */}
          <div className="lg:hidden relative h-[400px]">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-[80px]" aria-hidden="true" />
            <Link
              href={`/produto/${HERO_PRIMARY.id}`}
              className="relative block w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image src={HERO_PRIMARY.image} alt={HERO_PRIMARY.name} fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <Badge className="bg-accent text-accent-foreground font-bold mb-2">
                  {HERO_PRIMARY.badge ?? "Destaque"}
                </Badge>
                <p className="font-display text-2xl tracking-wider leading-tight">{HERO_PRIMARY.name.toUpperCase()}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom marquee — quick stats */}
        <div className="absolute bottom-0 inset-x-0 bg-foreground/40 backdrop-blur-sm border-t border-white/10 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            {[
              { num: "164+", label: "Camisas" },
              { num: "15",   label: "Seleções" },
              { num: "12k+", label: "Clientes" },
              { num: "4.9★", label: "Avaliação" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <span className="font-display text-2xl text-accent tracking-wider">{s.num}</span>
                <span className="text-white/60 text-[11px] font-medium ml-2">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────── */}
      <section aria-label="Benefícios da loja" className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-center gap-3 py-2">
              <div className="size-10 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTAQUES ────────────────────────────────── */}
      <section aria-labelledby="destaques-title" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">
              Mais vendidos
            </p>
            <h2
              id="destaques-title"
              className="font-display text-5xl sm:text-6xl tracking-wider text-foreground"
            >
              DESTAQUES
            </h2>
          </div>
          <Link
            href="/produtos"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            Ver todos
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product, i) => (
            <div
              key={product.id}
              className="animate-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto px-4 sm:px-6" />

      {/* ── BANNER SELEÇÃO DE OFERTAS ─────────────────── */}
      <section aria-label="Seleção de Ofertas" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/produtos?badge=Promoção" className="block group">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/20 group-hover:shadow-black/30 transition-shadow duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Banner.jpeg"
              alt="Seleção de Ofertas - 3 camisas por R$129,90"
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-8 z-10">
              <span className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-yellow-600 hover:bg-yellow-300 hover:text-yellow-800 font-bold px-6 sm:px-8 rounded-full shadow-2xl text-sm"
              )}>
                Ver ofertas
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── TODOS OS PRODUTOS ────────────────────────── */}
      <section aria-labelledby="colecao-title" className="bg-secondary/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">
                Coleção completa
              </p>
              <h2
                id="colecao-title"
                className="font-display text-5xl sm:text-6xl tracking-wider text-foreground"
              >
                BRASIL
              </h2>
            </div>
            <Link
              href="/produtos"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              Ver todos <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product, i) => (
              <div
                key={product.id}
                className="animate-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/produtos"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-12 h-12 rounded-full transition-colors"
              )}
            >
              Ver coleção completa ({products.length} produtos)
            </Link>
          </div>
        </div>
      </section>

      {/* ── NÚMEROS / PROVA SOCIAL ───────────────────── */}
      <section aria-labelledby="social-proof-title" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Números que falam</p>
          <h2 id="social-proof-title" className="font-display text-5xl sm:text-6xl tracking-wider text-foreground">
            A CONFIANÇA DE<br />
            <span className="text-primary">MILHARES</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "12.000+", label: "Pedidos entregues", sub: "em todo o Brasil" },
            { num: "4.8★", label: "Avaliação média", sub: "de 2.400+ clientes" },
            { num: "98%", label: "Clientes satisfeitos", sub: "recomendam a loja" },
            { num: "48h", label: "Entrega express", sub: "para capitais" },
          ].map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl bg-secondary/50 border border-border">
              <div className="font-display text-4xl sm:text-5xl text-primary tracking-wider mb-1">{s.num}</div>
              <div className="font-semibold text-sm text-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEPOIMENTOS ─────────────────────────────── */}
      <section aria-labelledby="testimonials-title" className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-accent uppercase tracking-[0.15em] mb-2">Clientes reais</p>
            <h2 id="testimonials-title" className="font-display text-5xl sm:text-6xl tracking-wider text-white">
              O QUE ESTÃO<br />FALANDO
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/10 transition-colors"
              >
                {/* Stars */}
                <div className="flex gap-0.5" aria-label={`${t.rating} de 5 estrelas`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={cn("size-4", i < t.rating ? "fill-accent text-accent" : "fill-none text-white/20")}
                    />
                  ))}
                </div>

                <blockquote>
                  <p className="text-white/80 text-sm leading-relaxed">"{t.body}"</p>
                </blockquote>

                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="size-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0"
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <figcaption className="text-white font-semibold text-sm">{t.author}</figcaption>
                      <p className="text-white/40 text-xs">{t.city}</p>
                    </div>
                  </div>
                  <BadgeCheck aria-label="Compra verificada" className="size-5 text-accent flex-shrink-0" />
                </div>

                <Link
                  href={`/produto/${t.productId}`}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors truncate"
                >
                  Comprou: {t.product}
                </Link>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
