/**
 * upload-images.mjs
 * ─────────────────────────────────────────────────────────────
 * Faz upload de todas as imagens de public/ROUPAS/ para o Supabase Storage
 * e depois atualiza o catálogo com as URLs da nuvem.
 *
 * Como usar:
 *   npm run upload-images
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, "..");
const ROUPAS_DIR = path.join(ROOT, "public", "ROUPAS");

// Lê as variáveis do .env.local manualmente
const envPath = path.join(ROOT, ".env.local");
const env = {};
fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
});

const SUPABASE_URL      = env["NEXT_PUBLIC_SUPABASE_URL"];
const SUPABASE_ANON_KEY = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const IMAGES_BASE_URL   = env["NEXT_PUBLIC_SUPABASE_IMAGES_URL"];
const BUCKET            = "roupas";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidos no .env.local");
  process.exit(1);
}

const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcmpheWp3dGxnbm5hbnBtZG1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc2NjI1NywiZXhwIjoyMDkxMzQyMjU3fQ.qpVXsFN46pC4XP8KBr5nrBpD4V6WhXGVDIOFEGTKVdY";
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// Normaliza o caminho removendo acentos, caracteres especiais e espaços
function sanitizePath(p) {
  return p
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9/_.\-]/g, "_") // substitui caracteres inválidos por _
    .replace(/__+/g, "_"); // remove underscores duplos
}

function getAllImages(dir, base = "") {
  const results = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath   = path.join(dir, entry);
    const relativePath = base ? `${base}/${entry}` : entry;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllImages(fullPath, relativePath));
    } else if (IMAGE_EXT.has(path.extname(entry).toLowerCase())) {
      results.push({ fullPath, storagePath: relativePath });
    }
  }
  return results;
}

console.log("📂 Escaneando imagens...");
const images = getAllImages(ROUPAS_DIR);
console.log(`🖼  ${images.length} imagens encontradas\n`);

let uploaded = 0;
let skipped  = 0;
let errors   = 0;

for (const { fullPath, storagePath } of images) {
  const fileBuffer = fs.readFileSync(fullPath);
  const ext        = path.extname(storagePath).toLowerCase().replace(".", "");
  const mimeMap    = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
  const contentType = mimeMap[ext] ?? "image/jpeg";

  const safeStoragePath = sanitizePath(storagePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(safeStoragePath, fileBuffer, { contentType, upsert: false });

  if (error) {
    if (error.message?.includes("already exists") || error.statusCode === "409") {
      process.stdout.write(".");
      skipped++;
    } else {
      console.error(`\n❌ Erro ao enviar ${storagePath}: ${error.message}`);
      errors++;
    }
  } else {
    process.stdout.write("↑");
    uploaded++;
  }

  // Pequena pausa para não sobrecarregar a API
  await new Promise(r => setTimeout(r, 30));
}

console.log(`\n\n✅ Upload concluído!`);
console.log(`   ↑ ${uploaded} enviadas`);
console.log(`   . ${skipped} já existiam (puladas)`);
if (errors) console.log(`   ❌ ${errors} erros`);
console.log(`\n🔗 URL base: ${IMAGES_BASE_URL}`);
console.log(`\n🚀 Agora rode: npm run sync-products`);
