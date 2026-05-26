import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://styleshooes01.com"),
  title: {
    default: "Style Shooes — Camisetas Tailandesas de Seleções de Futebol",
    template: "%s · Style Shooes",
  },
  description: "Camisetas tailandesas das melhores seleções do mundo: Brasil, Argentina, França, Portugal e mais. Combo 3 por R$ 119,99. Frete grátis acima de R$ 299, 12× sem juros.",
  keywords: ["camisa tailandesa", "camisetas tailandesas", "seleção brasileira", "camisa brasil", "camisa argentina", "camisa retrô", "futebol", "copa do mundo"],
  authors: [{ name: "Style Shooes" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Style Shooes",
    title: "Style Shooes — Camisetas Tailandesas de Seleções",
    description: "Camisetas tailandesas das maiores seleções do mundo. 3 por R$ 119,99. Frete grátis acima de R$ 299.",
    images: [{ url: "/ROUPAS/Brasil/2024 Brasil Home.jpg", width: 1200, height: 630, alt: "Style Shooes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Style Shooes — Camisetas Tailandesas",
    description: "Camisetas tailandesas das maiores seleções de futebol do mundo.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebas.variable} ${dmSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <TooltipProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <Toaster position="bottom-right" richColors />
          </CartProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
