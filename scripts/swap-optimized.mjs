#!/usr/bin/env node
/**
 * @description Paso de intercambio del eje A (Production Sweep Protocol §4/§5).
 *
 * Busca los `*.opt.mp4` producidos por optimize-assets.mjs, manda el original a
 * `_quarantine/` conservando su ruta relativa, y renombra el optimizado al nombre
 * original. Conservar el nombre es deliberado: ningún `.tsx` cambia, así que el
 * design-fingerprint no se mueve ni en el eje MEDIA.
 */
import { readdirSync, statSync, renameSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fmtBytes } from "./lib/tools.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

let count = 0, saved = 0;
for (const opt of walk(path.join(ROOT, "public")).filter((f) => f.endsWith(".opt.mp4"))) {
  const orig = opt.replace(/\.opt\.mp4$/, ".mp4");
  const rel = path.relative(path.join(ROOT, "public"), orig).replace(/\\/g, "/");
  const quarantine = path.join(ROOT, "_quarantine", rel);

  const before = statSync(orig).size;
  const after = statSync(opt).size;

  mkdirSync(path.dirname(quarantine), { recursive: true });
  renameSync(orig, quarantine);
  renameSync(opt, orig);

  saved += before - after;
  count++;
  console.log(`swap  ${rel.padEnd(58)} ${fmtBytes(before).padStart(9)} → ${fmtBytes(after).padStart(9)}`);
}

console.log(`\n${count} vídeos intercambiados · ahorro ${fmtBytes(saved)}\n`);
