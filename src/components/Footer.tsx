"use client";

import Link from "next/link";
import { Share2, MessageCircle, Mail, MapPin, Lock, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { teams } from "@/lib/data";
import { useState } from "react";
import { toast } from "sonner";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("E-mail inválido");
      return;
    }
    setSubmitting(true);
    // TODO: integrar com serviço real de e-mail (Mailchimp, Brevo, Resend, etc.)
    await new Promise(r => setTimeout(r, 600));
    toast.success("Inscrito!", { description: "Confira seu e-mail para o cupom de 10% off." });
    setEmail("");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/10 border-background/20 text-background placeholder:text-background/40 h-10 rounded-xl"
        />
        <Button
          type="submit"
          disabled={submitting}
          className="h-10 px-5 font-bold bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl whitespace-nowrap"
        >
          {submitting ? "..." : "Quero!"}
        </Button>
      </div>
      <p className="text-[11px] text-background/40">
        Cadastre-se e ganhe <strong className="text-background">10% off</strong> na primeira compra
      </p>
    </form>
  );
}

const socials = [
  { icon: Share2,        label: "Instagram", href: "https://instagram.com/styleshooes01" },
  { icon: MessageCircle, label: "WhatsApp",  href: "https://wa.me/5500000000000" },
];

export default function Footer() {
  const featuredTeams = teams.filter((t) => t !== "Todos").slice(0, 8);

  return (
    <footer className="bg-foreground text-background mt-20">
      {/* Trust strip */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck,       title: "Frete Grátis",      sub: "Acima de R$ 119,97" },
            { icon: RotateCcw,   title: "30 Dias para Trocar", sub: "Devolução grátis" },
            { icon: ShieldCheck, title: "Compra Segura",     sub: "SSL 256-bit" },
            { icon: Lock,        title: "Pagamento Seguro",  sub: "PIX, Cartão, Boleto" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="size-7 text-accent flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-background">{title}</p>
                <p className="text-xs text-background/50">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Style Shooes — página inicial">
              <span className="font-display text-3xl tracking-widest text-background">
                STYLE<span className="opacity-40">SHOOES</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-background/50 leading-relaxed max-w-sm">
              A sua loja de camisas oficiais das maiores seleções de futebol do mundo. Qualidade, autenticidade e paixão.
            </p>

            <div className="mt-6 max-w-sm">
              <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-3 text-background/70">📩 Receba ofertas exclusivas</h3>
              <NewsletterForm />
            </div>

            <nav aria-label="Redes sociais" className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="size-9 flex items-center justify-center rounded-full bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:ring-2 focus-visible:ring-background/40"
                >
                  <s.icon aria-hidden="true" className="size-4" />
                </a>
              ))}
            </nav>
          </div>

          {/* Seleções */}
          <nav aria-label="Seleções">
            <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-background/50">Seleções</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-background/60">
              {featuredTeams.map((t) => (
                <li key={t}>
                  <Link href={`/produtos?selecao=${encodeURIComponent(t)}`} className="hover:text-background transition-colors">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Suporte */}
          <nav aria-label="Atendimento">
            <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-background/50">Atendimento</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-background/60">
              <li><Link href="/perguntas-frequentes"  className="hover:text-background transition-colors">Perguntas Frequentes</Link></li>
              <li><Link href="/trocas-devolucoes"     className="hover:text-background transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/politica-privacidade"  className="hover:text-background transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/termos-uso"            className="hover:text-background transition-colors">Termos de Uso</Link></li>
            </ul>
            <div className="mt-6 flex flex-col gap-2 text-xs text-background/50">
              <a href="https://wa.me/5500000000000" className="flex items-center gap-2 hover:text-background transition-colors">
                <MessageCircle aria-hidden="true" className="size-3.5" /> WhatsApp
              </a>
              <a href="mailto:contato@styleshooes01.com" className="flex items-center gap-2 hover:text-background transition-colors">
                <Mail aria-hidden="true" className="size-3.5" /> contato@styleshooes01.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-3.5" /> Brasil
              </span>
            </div>
          </nav>

          {/* Pagamento */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-background/50">Pagamento</h3>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {/* Visa */}
              <span className="px-2 py-1 rounded bg-white text-blue-700 text-[10px] font-bold">VISA</span>
              {/* Mastercard */}
              <span className="px-2 py-1 rounded bg-white text-orange-600 text-[10px] font-bold">MC</span>
              {/* Elo */}
              <span className="px-2 py-1 rounded bg-yellow-400 text-black text-[10px] font-bold">ELO</span>
              {/* PIX */}
              <span className="px-2 py-1 rounded bg-teal-500 text-white text-[10px] font-bold">PIX</span>
              {/* Boleto */}
              <span className="px-2 py-1 rounded bg-background/20 text-background text-[10px] font-bold">BOLETO</span>
            </div>
            <p className="text-xs text-background/40 leading-relaxed">
              Em até <strong className="text-background">12×</strong> sem juros no cartão.<br/>
              <strong className="text-accent">5% off</strong> pagando via PIX.
            </p>
          </div>
        </div>

        <Separator className="bg-background/10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/30">
          <p>
            © {new Date().getFullYear()} Style Shooes · CNPJ XX.XXX.XXX/0001-XX · Todos os direitos reservados
          </p>
          <p className="text-background/40">
            Site seguro com <strong className="text-background/70">criptografia SSL</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
