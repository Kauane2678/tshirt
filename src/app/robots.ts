import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://styleshooes01.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/api/", "/pedido-confirmado"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
