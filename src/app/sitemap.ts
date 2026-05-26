import type { MetadataRoute } from "next";
import { products, teams } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://styleshooes01.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: SITE,                              priority: 1.0, changeFrequency: "daily"   as const },
    { url: `${SITE}/produtos`,                priority: 0.9, changeFrequency: "daily"   as const },
    { url: `${SITE}/carrinho`,                priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${SITE}/perguntas-frequentes`,    priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${SITE}/trocas-devolucoes`,       priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${SITE}/politica-privacidade`,    priority: 0.4, changeFrequency: "yearly"  as const },
    { url: `${SITE}/termos-uso`,              priority: 0.4, changeFrequency: "yearly"  as const },
  ];

  const productPages = products.map((p) => ({
    url:             `${SITE}/produto/${p.id}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  const teamPages = teams
    .filter((t) => t !== "Todos")
    .map((t) => ({
      url:             `${SITE}/produtos?selecao=${encodeURIComponent(t)}`,
      lastModified:    now,
      changeFrequency: "weekly" as const,
      priority:        0.7,
    }));

  return [
    ...staticPages.map(p => ({ ...p, lastModified: now })),
    ...productPages,
    ...teamPages,
  ];
}
