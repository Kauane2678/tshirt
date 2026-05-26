"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, CreditCard, QrCode, Lock,
  Copy, Check, ShieldCheck, RotateCcw, Truck,
  Star, Users, BadgeCheck, ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Types ──────────────────────────────────────────────── */
type PayMethod = "pix" | "credit_card";

interface PersonalData {
  firstName: string; lastName: string;
  email: string; cpf: string; phone: string;
}
interface AddressData {
  zipCode: string; street: string; number: string;
  complement: string; neighborhood: string; city: string; state: string;
}
/* ─── Masks ──────────────────────────────────────────────── */
const maskCPF   = (v: string) => v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");
const maskPhone = (v: string) => v.replace(/\D/g,"").slice(0,11).replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d{1,4})$/,"$1-$2");
const maskZip   = (v: string) => v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d)/,"$1-$2");

/* ─── Recent buyers (social proof) ───────────────────────── */
const BUYERS = [
  { name: "Lucas M.",    city: "São Paulo, SP",    product: "Camisa Brasil Home 2024",     time: 2  },
  { name: "Ana C.",      city: "Rio de Janeiro, RJ",product: "Camisa Brasil Away 2024",    time: 5  },
  { name: "Pedro R.",    city: "Belo Horizonte, MG",product: "Camisa Brasil 3rd 2024",     time: 8  },
  { name: "Julia S.",    city: "Curitiba, PR",      product: "Camisa Brasil Home 2022",    time: 11 },
  { name: "Marcos T.",   city: "Salvador, BA",      product: "Camisa Brasil Retrô 1970",   time: 14 },
  { name: "Fernanda L.", city: "Fortaleza, CE",     product: "Camisa Brasil Home 2024",    time: 18 },
];

/* ─── Payment brand SVGs ─────────────────────────────────── */
function VisaIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="Visa">
      <rect width="38" height="24" rx="4" fill="#1A1F71"/>
      <path d="M15.9 7.8l-2.6 8.4h-2L8.7 9.5c-.1-.4-.3-.5-.6-.7C7.5 8.6 6.7 8.3 6 8.2l.1-.4h3.2c.4 0 .8.3.9.7l.8 4.4 2.1-5.1h2zm4.1 8.4h-1.9l1.2-8.4h1.9zm8.3-5.5c0-2.1-2.9-2.2-2.9-3.1 0-.3.3-.6.9-.7.3 0 1.1-.1 2 .4l.4-1.6c-.5-.2-1.1-.3-1.8-.3-1.9 0-3.3 1-3.3 2.5 0 1.1 1 1.7 1.7 2.1.8.4 1 .7 1 1 0 .6-.6.8-1.2.8-.9 0-1.5-.2-2-.5l-.4 1.7c.5.2 1.3.4 2.2.4 2.1 0 3.5-1 3.5-2.7zm5.2 5.5h1.7l-1.5-8.4h-1.6c-.4 0-.7.2-.8.6l-2.9 7.8h2l.4-1.1h2.4l.3 1.1zm-2-2.7l1-2.7.6 2.7h-1.6z" fill="white"/>
    </svg>
  );
}
function MasterIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="Mastercard">
      <rect width="38" height="24" rx="4" fill="#252525"/>
      <circle cx="15" cy="12" r="7" fill="#EB001B"/>
      <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
      <path d="M19 7.2a7 7 0 0 1 0 9.6A7 7 0 0 1 19 7.2z" fill="#FF5F00"/>
    </svg>
  );
}
function EloIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="Elo">
      <rect width="38" height="24" rx="4" fill="#FFD700"/>
      <text x="19" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000">ELO</text>
    </svg>
  );
}
function PixIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="PIX">
      <rect width="38" height="24" rx="4" fill="#32BCAD"/>
      <text x="19" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">PIX</text>
    </svg>
  );
}

/* ─── Field ──────────────────────────────────────────────── */
function Field({ label, id, required, className, hint, ...props }:
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; required?: boolean; hint?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input id={id} required={required} className="h-11 rounded-xl border-border focus:border-primary" {...props} />
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ─── Step bar ───────────────────────────────────────────── */
function StepBar({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "Identificação" },
    { n: 2, label: "Entrega" },
    { n: 3, label: "Pagamento" },
  ];
  return (
    <nav aria-label="Etapas" className="flex items-start gap-0 mb-8">
      {steps.map(({ n, label }, i) => {
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 min-w-[56px]">
              <div className={cn(
                "size-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 transition-all",
                done   ? "bg-green-500 text-white ring-green-500"
                       : active ? "bg-primary text-primary-foreground ring-primary"
                       : "bg-background text-muted-foreground ring-border"
              )}>
                {done ? <Check className="size-4" aria-hidden="true"/> : n}
              </div>
              <span className={cn("text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap",
                active ? "text-primary" : done ? "text-green-600" : "text-muted-foreground"
              )}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-0.5 mt-4 mx-1 transition-all",
                done ? "bg-green-500" : "bg-border"
              )} aria-hidden="true"/>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Live buyer notification ─────────────────────────────── */
function LiveBuyer() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % BUYERS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const b = BUYERS[idx];
  return (
    <div className={cn(
      "flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 transition-opacity duration-300",
      visible ? "opacity-100" : "opacity-0"
    )} aria-live="polite" aria-atomic="true">
      <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-primary">{b.name[0]}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">
          {b.name} <span className="font-normal text-muted-foreground">de {b.city}</span>
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          comprou <span className="text-foreground font-medium">{b.product}</span> há {b.time} min
        </p>
      </div>
      <BadgeCheck className="size-4 text-green-500 flex-shrink-0" aria-hidden="true"/>
    </div>
  );
}

/* ─── Order sidebar ──────────────────────────────────────── */
function OrderSidebar({
  subtotal, discount, shipping, finalTotal,
}: { subtotal: number; discount: number; shipping: number; finalTotal: number }) {
  const { items } = useCart();
  const [open, setOpen] = useState(true);

  return (
    <aside aria-label="Resumo do pedido" className="flex flex-col gap-4">

      {/* Active buyers */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
        <div className="flex -space-x-2">
          {["L","A","P","M"].map((l,i) => (
            <div key={i} className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold ring-2 ring-background">
              {l}
            </div>
          ))}
        </div>
        <p className="text-xs font-semibold text-amber-800">
          <span className="text-amber-600 font-bold">47 pessoas</span> comprando agora
        </p>
      </div>

      {/* Items */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between p-4 text-sm font-bold text-foreground hover:bg-secondary/50 transition-colors"
          aria-expanded={open}
        >
          <span>Seu pedido ({items.reduce((s,i)=>s+i.quantity,0)} {items.reduce((s,i)=>s+i.quantity,0)===1?"item":"itens"})</span>
          <div className="flex items-center gap-2">
            <span className="font-display text-primary tabular-nums">
              R$&nbsp;{finalTotal.toFixed(2).replace(".",",")}
            </span>
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden="true"/>
          </div>
        </button>

        {open && (
          <div className="border-t border-border divide-y divide-border">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-3 p-4">
                <div className="size-14 rounded-xl bg-secondary flex-shrink-0 overflow-hidden relative">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                  <span className="absolute -top-1 -right-1 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">{item.product.name}</p>
                  <p className="text-[11px] text-muted-foreground">Tam: {item.size}</p>
                  {item.promoLabel && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 inline-block mt-0.5">
                      ⚡ {item.promoLabel}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums whitespace-nowrap">
                  R$&nbsp;{((item.promoPrice ?? item.product.price) * item.quantity).toFixed(2).replace(".",",")}
                </span>
              </div>
            ))}

            <div className="p-4 flex flex-col gap-2 text-sm bg-secondary/30">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">R$&nbsp;{subtotal.toFixed(2).replace(".",",")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>🔥 Combo (3 por R$ 119,99)</span>
                  <span className="tabular-nums">−R$&nbsp;{discount.toFixed(2).replace(".",",")}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>{shipping===0 ? <span className="text-green-600 font-semibold">Grátis</span> : <span className="tabular-nums">R$&nbsp;{shipping.toFixed(2).replace(".",",")}</span>}</span>
              </div>
              <Separator className="my-1"/>
              <div className="flex justify-between font-bold text-foreground">
                <span className="font-display text-lg tracking-wider">TOTAL</span>
                <span className="font-display text-xl text-primary tabular-nums">R$&nbsp;{finalTotal.toFixed(2).replace(".",",")}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">em até 12× de R$&nbsp;{(finalTotal/12).toFixed(2).replace(".",",")} sem juros</p>
            </div>
          </div>
        )}
      </div>

      {/* Guarantees */}
      <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
        {[
          { icon: ShieldCheck, color: "text-green-600", title: "Compra 100% Segura", sub: "Criptografia SSL de 256-bits" },
          { icon: RotateCcw,   color: "text-blue-600",  title: "30 dias para trocar", sub: "Devolução grátis sem burocracia" },
          { icon: Truck,       color: "text-primary",   title: "Frete grátis acima de R$ 119,97", sub: "Entrega em 3–7 dias úteis" },
        ].map(({ icon: Icon, color, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className={cn("size-5 flex-shrink-0", color)} aria-hidden="true"/>
            <div>
              <p className="text-xs font-bold text-foreground">{title}</p>
              <p className="text-[11px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live buyer */}
      <LiveBuyer />

      {/* Rating */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true"/>)}
        </div>
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">4.9</strong> de 5 · +12.000 clientes satisfeitos
        </p>
      </div>

      {/* Payment icons */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Pagamentos aceitos</p>
        <div className="flex flex-wrap gap-2 items-center">
          <VisaIcon/><MasterIcon/><EloIcon/><PixIcon/>
        </div>
      </div>
    </aside>
  );
}

/* ─── PIX screen ─────────────────────────────────────────── */
function PixScreen({ code, orderId, base64, image, onNewPurchase }: { code: string; orderId: string; base64?: string; image?: string; onNewPurchase: () => void }) {
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(900);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 flex flex-col gap-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
          <div className="size-2 rounded-full bg-green-500 animate-pulse"/>
          Aguardando pagamento
        </div>
        <h1 className="font-display text-5xl tracking-wider text-foreground mb-2">PAGUE COM PIX</h1>
        <p className="text-sm text-muted-foreground">Escaneie o QR Code ou copie o código abaixo</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center gap-5">
        {/* QR Code */}
        <div className="size-52 rounded-2xl bg-white border-2 border-primary/20 p-3 flex items-center justify-center overflow-hidden">
          {(base64 || image) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                base64
                  ? (base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`)
                  : image
              }
              alt="QR Code PIX"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <QrCode className="size-28 text-primary/30" aria-label="QR Code PIX"/>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">QR Code</p>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-5 py-2.5">
          <div className="size-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true"/>
          <p className="text-sm font-bold text-amber-800 tabular-nums">
            Expira em <span className="font-display text-amber-600">{mm}:{ss}</span>
          </p>
        </div>

        {/* Copy code */}
        <div className="w-full flex gap-2">
          <Input readOnly value={code} className="font-mono text-xs h-10 rounded-xl" aria-label="Código PIX"/>
          <Button type="button" onClick={copy} variant="outline"
            className="h-10 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl flex-shrink-0">
            {copied ? <Check className="size-4" aria-hidden="true"/> : <Copy className="size-4" aria-hidden="true"/>}
          </Button>
        </div>

        <div className="bg-secondary rounded-xl px-5 py-3 text-center w-full">
          <p className="text-[11px] text-muted-foreground mb-0.5">Número do pedido</p>
          <p className="font-display text-2xl tracking-widest text-primary">#{orderId}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Como pagar:</p>
        <ol className="flex flex-col gap-3">
          {[
            "Abra o app do seu banco",
            "Escolha pagar via PIX → QR Code ou Copia e Cola",
            "Escaneie o código ou cole o texto copiado",
            "Confirme o valor e autorize o pagamento",
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="size-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
              <span className="text-sm text-foreground">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Você receberá um e-mail de confirmação assim que o pagamento for processado.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/produtos"
          onClick={onNewPurchase}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-xl font-bold")}
        >
          <ArrowLeft className="size-4" aria-hidden="true"/> Continuar comprando
        </Link>
        <button
          onClick={onNewPurchase}
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-xl text-muted-foreground")}
        >
          Novo pedido
        </button>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function CheckoutPage() {
  const { items, total, subtotal, count, combo, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>("pix");
  const [pixData, setPixData]   = useState<{ code: string; orderId: string; base64?: string; image?: string } | null>(null);

  // Hidrata pixData de sessionStorage (refresh na tela do PIX não perde o QR)
  // Se há itens no carrinho = nova compra, ignora o PIX salvo
  useEffect(() => {
    try {
      if (items.length > 0) {
        sessionStorage.removeItem("style-shooes-pix");
        return;
      }
      const saved = sessionStorage.getItem("style-shooes-pix");
      if (saved) setPixData(JSON.parse(saved));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (pixData) sessionStorage.setItem("style-shooes-pix", JSON.stringify(pixData));
      else         sessionStorage.removeItem("style-shooes-pix");
    } catch {}
  }, [pixData]);

  const [personal, setPersonal] = useState<PersonalData>({ firstName:"", lastName:"", email:"", cpf:"", phone:"" });
  const [address, setAddress]   = useState<AddressData>({ zipCode:"", street:"", number:"", complement:"", neighborhood:"", city:"", state:"" });

  // total = subtotal − combo.discount  (já vem do CartContext)
  const discount   = combo.discount;
  const shipping   = total >= 119.97 ? 0 : 19.9;
  const finalTotal = total + shipping;

  async function fetchCep(zip: string) {
    const clean = zip.replace(/\D/g,"");
    if (clean.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const d = await r.json();
      if (!d.erro) setAddress(a => ({ ...a, street: d.logradouro??a.street, neighborhood: d.bairro??a.neighborhood, city: d.localidade??a.city, state: d.uf??a.state }));
    } catch {}
  }

  async function pay() {
    setLoading(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: payMethod,
          customer: { ...personal, ...address },
          // SigiloPay valida: amount = sum(produtos × qty) + freight − discount
          // Subtotal sem desconto = sum(produtos), discount = combo.discount, total = subtotal + frete − desconto
          cart: {
            total:    finalTotal,        // já com combo aplicado e frete somado
            discount: discount,          // valor do combo
            freight:  shipping,
          },
          items: items.map(i => ({
            id:       i.product.id,
            name:     `${i.product.name} (Tam ${i.size})${i.promoLabel ? ` · ${i.promoLabel}` : ""}`,
            quantity: i.quantity,
            price:    i.promoPrice ?? i.product.price,  // preço CHEIO (combo é descontado em cart.discount)
            size:     i.size,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg     = data?.error?.message ?? "Tente novamente em alguns instantes.";
        const issues  = data?.error?.issues as string[] | undefined;
        toast.error("Erro no pagamento", {
          description: issues?.length ? issues.join(" · ") : msg,
        });
        return;
      }

      if (payMethod === "pix") {
        if (!data.pix?.qrCode) {
          toast.error("Erro no PIX", { description: "Não foi possível gerar o QR Code. Tente novamente." });
          return;
        }
        clearCart();
        setPixData({
          code:    data.pix.qrCode,
          base64:  data.pix.qrCodeBase64,
          image:   data.pix.qrCodeImage,
          orderId: data.orderId ?? "SS" + Date.now().toString().slice(-6),
        });
      } else if (data.checkoutUrl) {
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Erro inesperado", { description: "Resposta inválida do gateway." });
      }
    } catch (err) {
      console.error("[Checkout] pay error:", err);
      toast.error("Erro de conexão", { description: "Verifique sua internet e tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !pixData) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
      <h1 className="font-display text-4xl tracking-wider">CARRINHO VAZIO</h1>
      <Link href="/produtos" className="inline-flex items-center gap-2 font-bold text-primary hover:underline">Ver produtos <ArrowRight className="size-4" aria-hidden="true"/></Link>
    </div>
  );

  if (pixData) return <PixScreen
    code={pixData.code}
    orderId={pixData.orderId}
    base64={pixData.base64}
    image={pixData.image}
    onNewPurchase={() => {
      setPixData(null);
      sessionStorage.removeItem("style-shooes-pix");
    }}
  />;

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Trust header */}
      <div className="bg-primary text-primary-foreground py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1.5"><Lock className="size-3.5" aria-hidden="true"/> Ambiente 100% Seguro</span>
          <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="size-3.5" aria-hidden="true"/> Certificado SSL</span>
          <span className="hidden sm:flex items-center gap-1.5"><BadgeCheck className="size-3.5" aria-hidden="true"/> Certificado PCI DSS</span>
          <span className="flex items-center gap-1.5"><Users className="size-3.5" aria-hidden="true"/> +12.000 pedidos entregues</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/carrinho" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="size-3" aria-hidden="true"/> Carrinho
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-semibold">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Left: form */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <StepBar current={step} />

            {/* ── Step 1 ── */}
            {step === 1 && (
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="font-display text-2xl tracking-wider text-foreground mb-1">IDENTIFICAÇÃO</h2>
                <p className="text-xs text-muted-foreground mb-6">Seus dados são criptografados e nunca compartilhados</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nome" id="fn" required autoComplete="given-name" value={personal.firstName} onChange={e=>setPersonal(p=>({...p,firstName:e.target.value}))} />
                  <Field label="Sobrenome" id="ln" required autoComplete="family-name" value={personal.lastName} onChange={e=>setPersonal(p=>({...p,lastName:e.target.value}))} />
                  <Field label="E-mail" id="em" type="email" required autoComplete="email" className="sm:col-span-2" placeholder="seu@email.com" value={personal.email} onChange={e=>setPersonal(p=>({...p,email:e.target.value}))} hint="Confirmação do pedido será enviada por e-mail"/>
                  <Field label="CPF" id="cpf" required inputMode="numeric" placeholder="000.000.000-00" value={personal.cpf} onChange={e=>setPersonal(p=>({...p,cpf:maskCPF(e.target.value)}))} />
                  <Field label="WhatsApp / Telefone" id="ph" type="tel" required autoComplete="tel" placeholder="(00) 00000-0000" value={personal.phone} onChange={e=>setPersonal(p=>({...p,phone:maskPhone(e.target.value)}))} />
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="button" className="h-12 px-8 font-bold bg-primary hover:bg-primary/90 rounded-xl"
                    onClick={() => {
                      const { firstName, lastName, email, cpf, phone } = personal;
                      if (!firstName||!lastName||!email||!cpf||!phone) { toast.error("Preencha todos os campos"); return; }
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("E-mail inválido"); return; }
                      if (cpf.replace(/\D/g, "").length !== 11) { toast.error("CPF inválido — digite 11 números"); return; }
                      if (phone.replace(/\D/g, "").length < 10)   { toast.error("Telefone inválido"); return; }
                      setStep(2);
                    }}>
                    Continuar para entrega
                    <ArrowRight data-icon="inline-end" aria-hidden="true"/>
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="font-display text-2xl tracking-wider text-foreground mb-1">ENDEREÇO DE ENTREGA</h2>
                <p className="text-xs text-muted-foreground mb-6">Digite o CEP para preencher automaticamente</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="CEP" id="zip" required inputMode="numeric" placeholder="00000-000" className="sm:col-span-2"
                    value={address.zipCode} onChange={e=>{const v=maskZip(e.target.value);setAddress(a=>({...a,zipCode:v}));fetchCep(v);}}/>
                  <Field label="Rua / Avenida" id="st" required autoComplete="address-line1" className="sm:col-span-2"
                    value={address.street} onChange={e=>setAddress(a=>({...a,street:e.target.value}))}/>
                  <Field label="Número" id="num" required value={address.number} onChange={e=>setAddress(a=>({...a,number:e.target.value}))}/>
                  <Field label="Complemento" id="comp" placeholder="Apto, bloco…" value={address.complement} onChange={e=>setAddress(a=>({...a,complement:e.target.value}))}/>
                  <Field label="Bairro" id="nb" required value={address.neighborhood} onChange={e=>setAddress(a=>({...a,neighborhood:e.target.value}))}/>
                  <Field label="Cidade" id="ci" required autoComplete="address-level2" value={address.city} onChange={e=>setAddress(a=>({...a,city:e.target.value}))}/>
                  <Field label="Estado (UF)" id="uf" required maxLength={2} placeholder="SP" className="uppercase"
                    value={address.state} onChange={e=>setAddress(a=>({...a,state:e.target.value.toUpperCase().slice(0,2)}))}/>
                </div>

                {shipping === 0 && (
                  <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700">
                    <Truck className="size-4 flex-shrink-0" aria-hidden="true"/>
                    <span className="font-semibold">Frete Grátis</span> para o seu pedido!
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" className="h-12 px-6 font-bold rounded-xl" onClick={()=>setStep(1)}>
                    <ArrowLeft data-icon="inline-start" aria-hidden="true"/> Voltar
                  </Button>
                  <Button type="button" className="h-12 px-8 font-bold bg-primary hover:bg-primary/90 rounded-xl"
                    onClick={()=>{
                      const {zipCode,street,number,neighborhood,city,state}=address;
                      if (!zipCode||!street||!number||!neighborhood||!city||!state) { toast.error("Preencha todos os campos"); return; }
                      if (zipCode.replace(/\D/g, "").length !== 8) { toast.error("CEP inválido — digite os 8 números"); return; }
                      if (state.length !== 2) { toast.error("UF inválida — use a sigla com 2 letras (SP, RJ...)"); return; }
                      setStep(3);
                    }}>
                    Continuar para pagamento
                    <ArrowRight data-icon="inline-end" aria-hidden="true"/>
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                {/* Method selector */}
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <h2 className="font-display text-2xl tracking-wider text-foreground mb-5">FORMA DE PAGAMENTO</h2>
                  <fieldset>
                    <legend className="sr-only">Escolha o método de pagamento</legend>
                    <div className="flex flex-col gap-3">
                      {([
                        { id:"pix",         icon: QrCode,      label:"PIX",                 sub:"Aprovação instantânea · 5% de desconto",        badge:"Mais rápido",  badgeColor:"bg-green-500" },
                        { id:"credit_card", icon: CreditCard,  label:"Cartão de Crédito",   sub:"Visa, Mastercard, Elo · Até 12× sem juros",     badge:"Parcelado",    badgeColor:"bg-primary"  },
                      ] as const).map(({ id, icon: Icon, label, sub, badge, badgeColor }) => (
                        <label key={id} htmlFor={`m-${id}`} className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          payMethod===id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-background"
                        )}>
                          <input type="radio" id={`m-${id}`} name="pm" value={id} checked={payMethod===id} onChange={()=>setPayMethod(id)} className="sr-only"/>
                          <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                            payMethod===id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                          )}>
                            <Icon className="size-5" aria-hidden="true"/>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-foreground">{label}</p>
                              <span className={cn("text-[10px] font-bold text-white rounded-full px-2 py-0.5", badgeColor)}>{badge}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                          </div>
                          <div className={cn("size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            payMethod===id ? "border-primary" : "border-border"
                          )}>
                            {payMethod===id && <div className="size-2.5 rounded-full bg-primary"/>}
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* PIX info */}
                {payMethod==="pix" && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <QrCode className="size-8 text-green-600 flex-shrink-0" aria-hidden="true"/>
                      <div>
                        <p className="font-bold text-sm text-green-800">Pague com PIX e economize 5%!</p>
                        <p className="text-xs text-green-700">O QR Code será gerado na próxima tela. Pagamento confirmado em segundos.</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-green-700">
                      <span className="flex items-center gap-1"><Check className="size-3"/> Aprovação imediata</span>
                      <span className="flex items-center gap-1"><Check className="size-3"/> Disponível 24h</span>
                      <span className="flex items-center gap-1"><Check className="size-3"/> 100% seguro</span>
                    </div>
                  </div>
                )}

                {/* Cartão — checkout hospedado SigiloPay */}
                {payMethod==="credit_card" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Lock className="size-8 text-blue-600 flex-shrink-0" aria-hidden="true"/>
                      <div>
                        <p className="font-bold text-sm text-blue-900">Pagamento seguro com cartão</p>
                        <p className="text-xs text-blue-800">Você será redirecionado para a página segura da SigiloPay para inserir os dados do seu cartão. Após a confirmação, volta automaticamente para o site.</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-blue-200 pt-3">
                      <div className="flex flex-wrap gap-3 text-xs text-blue-800">
                        <span className="flex items-center gap-1"><Check className="size-3"/> Até 12× sem juros</span>
                        <span className="flex items-center gap-1"><Check className="size-3"/> SSL 256-bit</span>
                        <span className="flex items-center gap-1"><Check className="size-3"/> PCI DSS</span>
                      </div>
                      <div className="flex gap-1.5"><VisaIcon/><MasterIcon/><EloIcon/></div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-4">
                  <Button type="button" disabled={loading}
                    className="w-full h-14 font-bold text-base bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25"
                    onClick={pay}>
                    {loading ? (
                      <span className="flex items-center gap-2"><div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>Processando…</span>
                    ) : payMethod==="pix" ? (
                      <><QrCode data-icon="inline-start" aria-hidden="true"/> Gerar QR Code PIX</>
                    ) : (
                      <><Lock data-icon="inline-start" aria-hidden="true"/> Continuar para pagamento — R$&nbsp;{finalTotal.toFixed(2).replace(".",",")}</>
                    )}
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><ShieldCheck className="size-3 text-green-600" aria-hidden="true"/> Compra segura</span>
                    <span className="flex items-center gap-1"><Lock className="size-3 text-blue-600" aria-hidden="true"/> SSL 256-bit</span>
                    <span className="flex items-center gap-1"><RotateCcw className="size-3 text-primary" aria-hidden="true"/> 30 dias para trocar</span>
                    <span className="flex items-center gap-1"><BadgeCheck className="size-3 text-amber-500" aria-hidden="true"/> PCI DSS</span>
                  </div>
                </div>

                <Button type="button" variant="ghost" className="self-start font-bold text-muted-foreground" onClick={()=>setStep(2)}>
                  <ArrowLeft data-icon="inline-start" aria-hidden="true"/> Voltar
                </Button>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="lg:col-span-2">
            <OrderSidebar subtotal={subtotal} discount={discount} shipping={shipping} finalTotal={finalTotal}/>
          </div>
        </div>
      </div>
    </div>
  );
}
