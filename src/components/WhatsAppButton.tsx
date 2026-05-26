"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PHONE = "5500000000000"; // ⚠️ trocar pelo número real (formato: 55 + DDD + número)

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Esconde no checkout (não atrapalha conversão)
  const hidden = pathname?.startsWith("/checkout") || pathname?.startsWith("/pedido-confirmado");

  // Aparece após 2s pra não pular na cara do visitante
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (hidden || !visible) return null;

  const message = encodeURIComponent("Olá! Vim do site Style Shooes e gostaria de tirar uma dúvida.");
  const link = `https://wa.me/${PHONE}?text=${message}`;

  return (
    <>
      {/* Tooltip */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 bg-card rounded-2xl shadow-2xl border border-border p-4 max-w-[260px] animate-in slide-in-from-bottom-2 fade-in duration-300">
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="absolute top-2 right-2 size-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle aria-hidden="true" className="size-4 text-white" />
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-foreground mb-0.5">Atendimento Style Shooes</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Olá! 👋 Tem dúvida sobre tamanho, prazo ou pagamento? Fala com a gente!
              </p>
            </div>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full block text-center bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-xl transition-colors"
          >
            Iniciar conversa
          </a>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Falar no WhatsApp"
        className={cn(
          "fixed bottom-5 right-5 z-40 size-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl shadow-green-500/40 flex items-center justify-center transition-all hover:scale-110",
          "ring-4 ring-green-500/20",
          open ? "rotate-90" : ""
        )}
      >
        {open ? <X aria-hidden="true" className="size-6" /> : <MessageCircle aria-hidden="true" className="size-6" />}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-green-500/40" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
