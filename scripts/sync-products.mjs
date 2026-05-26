/**
 * sync-products.mjs
 * ─────────────────────────────────────────────────────────────
 * Escaneia public/ROUPAS/ e gera automaticamente o catálogo de produtos.
 *
 * ESTRUTURA SUPORTADA:
 *
 *   public/ROUPAS/
 *     Brasil/
 *       Camisa Home 2024/        ← subpasta = 1 produto com CARROSSEL de imagens
 *         frente.jpg
 *         costas.jpg
 *         detalhe.jpg
 *       22_23 Brasil Away.jpg    ← arquivo solto = 1 produto, 1 imagem
 *
 * DEDUPLICAÇÃO AUTOMÁTICA:
 *   - Arquivos com MD5 idêntico são agrupados no mesmo produto (carrossel)
 *   - Nunca cria produto duplicado por arquivo igual
 *
 * Como usar:
 *   npm run sync-products
 *
 * Customizar preços/nomes/badges:
 *   Edite src/lib/products-overrides.json
 *   A chave é o caminho da PRIMEIRA imagem do produto: "/ROUPAS/Brasil/arquivo.jpg"
 */

import fs     from "node:fs";
import path   from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, "..");
const ROUPAS_DIR = path.join(ROOT, "public", "ROUPAS");
const OVERRIDES  = path.join(ROOT, "src", "lib", "products-overrides.json");
const CATALOG    = path.join(ROOT, "src", "lib", "products-catalog.ts");

const IMAGE_EXT     = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const SIZES_DEFAULT = ["P", "M", "G", "GG", "XGG"];

/* ── Helpers ──────────────────────────────────────────────── */

function md5(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(buf).digest("hex");
}

function isHashName(name) {
  return /^[0-9a-f]{6,}$/i.test(name);
}

function filenameToProductName(filename, team) {
  const base = path.basename(filename, path.extname(filename))
    .replace(/[_]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (isHashName(base)) return `Camisa ${team}`;

  const clean = base.replace(/[_\-]+$/, "").trim();
  if (/^(camisa|retro|retrô|jersey|training)/i.test(clean)) return clean;
  return `Camisa ${clean}`;
}

function folderToProductName(folderName, team) {
  const clean = folderName.replace(/[_\-]+$/, "").trim();
  if (/^(camisa|retro|retrô|jersey|training)/i.test(clean)) return clean;
  return `Camisa ${clean}`;
}

function autoDescription(name, team) {
  return `${name} — versão tailandesa da seleção de ${team}. Tecido de alta qualidade com tecnologia de absorção de suor. Perfeita para usar nos estádios ou no dia a dia com muito estilo e identidade.`;
}

function autoBadge(name) {
  const n = name.toLowerCase();
  if (n.includes("retrô") || n.includes("retro"))                          return "Retrô";
  if (n.includes("2026"))                                                   return "Pré-venda";
  if (n.includes("2024") || n.includes("2025") || n.includes("lançamento")) return "Lançamento";
  if (n.includes("especial") || n.includes("limited") || n.includes("edição")) return "Edição Limitada";
  if (n.includes("goleiro") || n.includes("goalkeeper"))                   return "Goleiro";
  if (n.includes("training") || n.includes("treino"))                      return "Treino";
  return undefined;
}

function isImageFile(name) {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

/* ── Load overrides ──────────────────────────────────────── */
let overrides = {};
if (fs.existsSync(OVERRIDES)) {
  overrides = JSON.parse(fs.readFileSync(OVERRIDES, "utf8"));
  console.log(`📋 Overrides carregados: ${Object.keys(overrides).length} entradas\n`);
}

/* ── Scan ROUPAS dir ──────────────────────────────────────── */
if (!fs.existsSync(ROUPAS_DIR)) {
  console.error(`❌ Pasta não encontrada: ${ROUPAS_DIR}`);
  process.exit(1);
}

const teamFolders = fs.readdirSync(ROUPAS_DIR)
  .filter(f => fs.statSync(path.join(ROUPAS_DIR, f)).isDirectory())
  .sort();

console.log(`📂 Times encontrados: ${teamFolders.join(", ")}\n`);

const products   = [];
const teams      = new Set();
let   idCounter  = 1;
let   totalAdded = 0;
let   totalDedup = 0;

for (const teamFolder of teamFolders) {
  const teamDir  = path.join(ROUPAS_DIR, teamFolder);
  const teamName = teamFolder.replace(/_+$/, "").trim();
  teams.add(teamName);

  const entries = fs.readdirSync(teamDir).sort();

  // ── MD5 map: hash → first imagePath seen (for dedup across loose files) ──
  const md5Map = new Map(); // hash → "/ROUPAS/team/file.jpg"
  let teamAdded = 0;
  let teamDedup = 0;

  // ── Group entries ──────────────────────────────────────────
  // Pass 1: collect subfolders (each = multi-image product)
  // Pass 2: collect loose image files (each = single-image product, with dedup)

  const subfolderProducts = []; // { folderName, images: ["/ROUPAS/..."] }
  const looseImages       = []; // "/ROUPAS/team/file.jpg"

  for (const entry of entries) {
    const entryPath = path.join(teamDir, entry);
    const stat      = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Subfolder = one product with multiple images
      const subImages = fs.readdirSync(entryPath)
        .filter(isImageFile)
        .sort()
        .map(f => `/ROUPAS/${teamFolder}/${entry}/${f}`);

      if (subImages.length > 0) {
        subfolderProducts.push({ folderName: entry, images: subImages });
      }
    } else if (isImageFile(entry)) {
      looseImages.push({ file: entry, absPath: entryPath });
    }
  }

  // ── Process subfolder products ────────────────────────────
  for (const { folderName, images } of subfolderProducts) {
    const firstImage = images[0];
    const override   = overrides[firstImage] ?? {};
    const name       = override.name ?? folderToProductName(folderName, teamName);
    const badge      = override.badge ?? autoBadge(name);

    products.push(buildProduct({
      id:       idCounter++,
      name,
      images,
      image:    firstImage,
      team:     teamName,
      badge,
      override,
    }));
    teamAdded++;
  }

  // ── Process loose files (with MD5 dedup) ─────────────────
  for (const { file, absPath } of looseImages) {
    const hash      = md5(absPath);
    const imagePath = `/ROUPAS/${teamFolder}/${file}`;

    if (md5Map.has(hash)) {
      // Duplicate detected — add as extra image to existing product
      const existingPath = md5Map.get(hash);
      const existing     = products.find(p => p.image === existingPath);
      if (existing && !existing.images.includes(imagePath)) {
        existing.images.push(imagePath);
        console.log(`  🔄 Duplicata detectada — agrupando "${file}" com "${path.basename(existingPath)}"`);
        teamDedup++;
      }
      continue;
    }

    md5Map.set(hash, imagePath);
    const override = overrides[imagePath] ?? {};
    const name     = override.name ?? filenameToProductName(file, teamName);
    const badge    = override.badge ?? autoBadge(name);

    products.push(buildProduct({
      id:    idCounter++,
      name,
      images: [imagePath],
      image:  imagePath,
      team:   teamName,
      badge,
      override,
    }));
    teamAdded++;
  }

  console.log(`  [${teamName}] ${teamAdded} produtos · ${teamDedup} duplicatas agrupadas`);
  totalAdded += teamAdded;
  totalDedup += teamDedup;
}

function buildProduct({ id, name, images, image, team, badge, override }) {
  return {
    id,
    name,
    price:         override.price       ?? 80.00,
    ...(override.originalPrice ? { originalPrice: override.originalPrice } : {}),
    image,
    images,
    category:      override.category    ?? "Camisas",
    team,
    sizes:         override.sizes       ?? SIZES_DEFAULT,
    ...(badge ? { badge } : {}),
    description:   override.description ?? autoDescription(name, team),
    features:      override.features    ?? [
      "Versão tailandesa premium",
      "Tecido com tecnologia de absorção de suor",
      "Escudo bordado em alta qualidade",
      "Corte moderno e costura reforçada",
      "Material: 100% poliéster",
    ],
    rating:    override.rating    ?? parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
    reviews:   override.reviews   ?? Math.floor(50  + Math.random() * 300),
    soldCount: override.soldCount ?? Math.floor(100 + Math.random() * 2000),
  };
}

/* ── Build metadata ───────────────────────────────────────── */
const teamsList      = ["Todos", ...Array.from(teams).sort()];
const categoriesList = ["Todos", "Camisas"];

/* ── Write catalog ────────────────────────────────────────── */
const ts = `// ⚠️  ARQUIVO GERADO AUTOMATICAMENTE — não edite manualmente
// Execute: npm run sync-products para atualizar
// Para customizar preços/descrições, edite: src/lib/products-overrides.json
// Gerado em: ${new Date().toLocaleString("pt-BR")} · ${totalAdded} produtos · ${totalDedup} duplicatas agrupadas

import type { Product } from "./data";

export const catalogProducts: Product[] = ${JSON.stringify(products, null, 2)};

export const catalogCategories = ${JSON.stringify(categoriesList)} as const;
export const catalogTeams      = ${JSON.stringify(teamsList)}      as const;
`;

fs.writeFileSync(CATALOG, ts, "utf8");

console.log(`
✅ Catálogo gerado!
   📦 ${totalAdded} produtos únicos
   🔄 ${totalDedup} imagens duplicadas agrupadas em carrossel
   📄 src/lib/products-catalog.ts atualizado

Times: ${teamsList.filter(t => t !== "Todos").join(", ")}

💡 Para agrupar manualmente várias fotos de um produto:
   Crie uma subpasta: public/ROUPAS/Brasil/Camisa Home 2024/
   E coloque as imagens dentro dela.

🚀 Rode: npm run dev`);
