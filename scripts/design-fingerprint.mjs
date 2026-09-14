#!/usr/bin/env node
/**
 * DESIGN FINGERPRINT — red de seguridad para el hardening de producción.
 *
 * Extrae de un HTML generado por `next build` una huella estable del diseño:
 *   - la secuencia de valores de `class` (el layout y los estilos viven ahí)
 *   - la secuencia de texto visible
 *   - la secuencia de estilos inline
 *   - los atributos de media (src/preload/poster/loading)
 *
 * Normaliza lo que cambia en cada build sin que el diseño cambie (hashes de
 * chunks, class names de módulos de next/font) para que el diff solo muestre
 * cambios reales.
 *
 * Uso:
 *   node design-fingerprint.mjs <archivo.html>              -> imprime la huella
 *   node design-fingerprint.mjs <base.html> <nuevo.html>    -> imprime el diff
 */
import { readFileSync } from "node:fs";

function normalize(html) {
  return html
    // Contenido de <script>: payload RSC, ruido puro.
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "<script/>")
    .replace(/<script[^>]*\/>/g, "<script/>")
    // Hashes de chunks de Turbopack.
    .replace(/_next\/static\/(chunks|media)\/[A-Za-z0-9_.-]+\.(js|css|woff2|svg)/g, "_next/static/$1/HASH.$2")
    .replace(/_next\/static\/[A-Za-z0-9_-]{10,}\//g, "_next/static/BUILDID/")
    // Class names generados por next/font (cambian de hash entre builds).
    .replace(/[a-z_]+_[0-9a-f]{8}-module__[A-Za-z0-9_]+__/g, "FONTMODULE__");
}

function fingerprint(file) {
  const html = normalize(readFileSync(file, "utf8"));
  const out = { classes: [], text: [], styles: [], media: [], meta: [] };

  // <html lang>, <title>, y todos los <meta>/<link rel> — la cabecera importa para SEO.
  for (const m of html.matchAll(/<html[^>]*\slang="([^"]*)"/g)) out.meta.push(`html@lang=${m[1]}`);
  for (const m of html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)) out.meta.push(`title=${m[1].trim()}`);
  for (const m of html.matchAll(/<meta\s+([^>]*?)\/?>/g)) out.meta.push(`meta ${m[1].trim()}`);
  for (const m of html.matchAll(/<link\s+([^>]*?)\/?>/g)) out.meta.push(`link ${m[1].trim()}`);

  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) out.classes.push(m[1].trim());
  for (const m of html.matchAll(/\sstyle="([^"]*)"/g)) out.styles.push(m[1].trim());

  // Atributos de carga de media — lo que define el peso de la primera pantalla.
  for (const m of html.matchAll(/<(img|video|source|iframe)\s+([^>]*?)\/?>/g)) {
    const tag = m[1];
    const attrs = m[2];
    const keep = ["src", "srcset", "poster", "preload", "loading", "decoding", "fetchpriority", "alt", "autoplay", "muted", "playsinline", "loop", "width", "height"];
    const picked = keep
      .map((k) => {
        const re = new RegExp(`\\s${k}(?:="([^"]*)")?`, "i");
        const hit = re.exec(" " + attrs);
        return hit ? (hit[1] !== undefined ? `${k}="${hit[1]}"` : k) : null;
      })
      .filter(Boolean);
    out.media.push(`<${tag} ${picked.join(" ")}>`);
  }

  // Texto visible: quita todas las etiquetas y colapsa espacios.
  const stripped = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, " ")
    .replace(/<script\/>/g, " ")
    .replace(/<[^>]+>/g, "\n");
  for (const line of stripped.split("\n")) {
    const t = line.replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, " ").replace(/\s+/g, " ").trim();
    if (t) out.text.push(t);
  }
  return out;
}

function diffLists(a, b, label) {
  // Diff por multiconjunto: qué desapareció y qué apareció.
  const count = (list) => list.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
  const ca = count(a);
  const cb = count(b);
  const removed = [];
  const added = [];
  for (const [k, n] of ca) {
    const d = n - (cb.get(k) || 0);
    for (let i = 0; i < d; i++) removed.push(k);
  }
  for (const [k, n] of cb) {
    const d = n - (ca.get(k) || 0);
    for (let i = 0; i < d; i++) added.push(k);
  }
  if (!removed.length && !added.length) {
    console.log(`  ${label}: sin cambios (${a.length} entradas)`);
    return 0;
  }
  console.log(`\n  ${label}: -${removed.length} / +${added.length}`);
  for (const r of removed.slice(0, 40)) console.log(`    - ${r.slice(0, 200)}`);
  if (removed.length > 40) console.log(`    ... y ${removed.length - 40} más eliminadas`);
  for (const x of added.slice(0, 40)) console.log(`    + ${x.slice(0, 200)}`);
  if (added.length > 40) console.log(`    ... y ${added.length - 40} más añadidas`);
  return removed.length + added.length;
}

const [fileA, fileB] = process.argv.slice(2);
if (!fileA) {
  console.error("uso: node design-fingerprint.mjs <base.html> [nuevo.html]");
  process.exit(2);
}

if (!fileB) {
  const fp = fingerprint(fileA);
  console.log(JSON.stringify(fp, null, 1));
  process.exit(0);
}

const A = fingerprint(fileA);
const B = fingerprint(fileB);
console.log(`DIFF DE HUELLA DE DISEÑO\n  base:  ${fileA}\n  nuevo: ${fileB}`);
let total = 0;
total += diffLists(A.meta, B.meta, "META/HEAD  (esperado que cambie al arreglar SEO)");
total += diffLists(A.classes, B.classes, "CLASES     (cualquier cambio aquí puede mover el diseño)");
total += diffLists(A.styles, B.styles, "INLINE     (estilos inline)");
total += diffLists(A.media, B.media, "MEDIA      (img/video y sus atributos de carga)");
total += diffLists(A.text, B.text, "TEXTO      (copy visible e indexable)");
console.log(`\nTOTAL de diferencias: ${total}`);
console.log(total === 0 ? "IDÉNTICO — el cambio no tocó el output renderizado." : "Revisa cada diferencia arriba: debe ser intencional.");
