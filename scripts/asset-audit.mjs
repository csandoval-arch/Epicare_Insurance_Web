#!/usr/bin/env node
/**
 * @description Censo de assets — eje A + parte del eje B del Production Sweep Protocol.
 *
 * Por cada archivo de public/ resuelve: peso, formato, dimensiones/duración/bitrate,
 * qué componentes lo referencian, si está huérfano, y con qué estrategia se carga
 * (loading="lazy", <SmartVideo> vs <video> crudo, poster).
 *
 * Uso:
 *   node scripts/asset-audit.mjs                     # todo public/
 *   node scripts/asset-audit.mjs --component Hero    # solo los que toca ese componente
 *   node scripts/asset-audit.mjs --orphans           # solo huérfanos
 *   node scripts/asset-audit.mjs --json              # vuelca reporte a scripts/reports/
 */
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { probe, hasAudio, fmtBytes } from "./lib/tools.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const RASTER = new Set([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff"]);
const MODERN = new Set([".webp", ".avif"]);
const VIDEO = new Set([".mp4", ".webm", ".mov", ".m4v"]);

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const val = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };

// ── 1 · Índice de código fuente ──────────────────────────────────────────────
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules") walk(p, out); }
    else out.push(p);
  }
  return out;
}

const sourceFiles = [
  ...walk(path.join(ROOT, "src")),
  ...(existsSync(path.join(ROOT, "messages")) ? walk(path.join(ROOT, "messages")) : []),
].filter((f) => /\.(tsx?|jsx?|css|json)$/.test(f));

const sources = sourceFiles.map((f) => ({
  file: path.relative(ROOT, f).replace(/\\/g, "/"),
  text: readFileSync(f, "utf8"),
}));

// ── 2 · Censo ────────────────────────────────────────────────────────────────
const assets = [];
for (const abs of walk(PUBLIC)) {
  const rel = path.relative(PUBLIC, abs).replace(/\\/g, "/");
  const ext = path.extname(abs).toLowerCase();
  const base = path.basename(abs);
  const size = statSync(abs).size;

  const refs = sources.filter((s) => s.text.includes(base)).map((s) => s.file);

  const kind = RASTER.has(ext) ? "raster"
    : MODERN.has(ext) ? "modern"
    : VIDEO.has(ext) ? "video"
    : ext === ".svg" ? "svg" : "other";

  let meta = null, audio = false;
  if (kind === "raster" || kind === "modern" || kind === "video") {
    meta = probe(abs);
    if (kind === "video") audio = hasAudio(abs);
  }

  // Estrategia de carga: se mira el bloque JSX alrededor de cada referencia.
  const loading = new Set();
  for (const s of sources.filter((s) => s.text.includes(base))) {
    if (!/\.tsx?$/.test(s.file)) continue;
    for (const line of s.text.split("\n")) {
      if (!line.includes(base)) continue;
      const i = s.text.indexOf(line);
      const ctx = s.text.slice(Math.max(0, i - 700), i + 700);
      if (/<SmartVideo/.test(ctx)) loading.add("SmartVideo");
      else if (/<video/.test(ctx)) loading.add(/autoPlay/.test(ctx) ? "video autoPlay" : "video");
      if (/loading=["{]?["']?lazy/.test(ctx)) loading.add("lazy");
      if (/poster=/.test(ctx)) loading.add("poster");
    }
    if (kind === "raster" || kind === "modern") {
      const hasImg = /<img/.test(s.text);
      if (hasImg && !loading.has("lazy")) loading.add("eager?");
    }
  }

  assets.push({
    path: `public/${rel}`, base, ext, kind, size,
    width: meta?.width ?? null, height: meta?.height ?? null,
    codec: meta?.codec ?? null, duration: meta?.duration ?? null,
    bitrate: meta?.bitrate ?? null, audio,
    refs, orphan: refs.length === 0,
    loading: [...loading],
  });
}

// ── 3 · Filtros ──────────────────────────────────────────────────────────────
let rows = assets;
const comp = val("--component");
if (comp) rows = rows.filter((a) => a.refs.some((r) => r.toLowerCase().includes(comp.toLowerCase())));
if (flag("--orphans")) rows = rows.filter((a) => a.orphan);
rows.sort((a, b) => b.size - a.size);

// ── 4 · Salida ───────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);

console.log(`\n${"=".repeat(120)}`);
console.log(`CENSO DE ASSETS — ${rows.length} archivos${comp ? ` (componente ~ ${comp})` : ""}${flag("--orphans") ? " (solo huérfanos)" : ""}`);
console.log("=".repeat(120));
console.log(`${pad("ARCHIVO", 58)} ${lpad("PESO", 9)}  ${pad("DIMENSIONES", 12)} ${pad("CARGA", 22)} REFERENCIAS`);
console.log("-".repeat(120));

for (const a of rows) {
  const dims = a.width ? `${a.width}x${a.height}` : "—";
  const dur = a.duration ? ` ${a.duration.toFixed(1)}s` : "";
  const load = a.orphan ? "HUÉRFANO" : (a.loading.join("+") || "—");
  const ref = a.orphan ? "" : `${a.refs.length} archivo(s)`;
  console.log(`${pad(a.path.slice(-58), 58)} ${lpad(fmtBytes(a.size), 9)}  ${pad(dims + dur, 12)} ${pad(load + (a.audio ? " +AUDIO" : ""), 22)} ${ref}`);
}

const sum = (f) => rows.filter(f).reduce((t, a) => t + a.size, 0);
console.log("-".repeat(120));
console.log(`TOTAL              ${fmtBytes(sum(() => true))}`);
console.log(`  huérfanos        ${fmtBytes(sum((a) => a.orphan))}  (${rows.filter((a) => a.orphan).length} archivos)`);
console.log(`  raster sin migrar${fmtBytes(sum((a) => a.kind === "raster" && !a.orphan))}  (${rows.filter((a) => a.kind === "raster" && !a.orphan).length} archivos)`);
console.log(`  vídeo            ${fmtBytes(sum((a) => a.kind === "video" && !a.orphan))}  (${rows.filter((a) => a.kind === "video" && !a.orphan).length} archivos)`);
console.log(`  vídeo con audio  ${fmtBytes(sum((a) => a.audio && !a.orphan))}  (${rows.filter((a) => a.audio && !a.orphan).length} archivos — peso muerto)`);
console.log("=".repeat(120) + "\n");

if (flag("--json")) {
  const dir = path.join(ROOT, "scripts", "reports");
  mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `assets-${new Date().toISOString().slice(0, 10)}.json`);
  writeFileSync(out, JSON.stringify(assets, null, 2));
  console.log(`Reporte JSON: ${path.relative(ROOT, out)}\n`);
}
