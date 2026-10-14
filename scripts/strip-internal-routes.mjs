/**
 * @file strip-internal-routes.mjs
 * @description Borra de `out/` las rutas internas que no deben desplegarse. Se ejecuta como
 * parte de `pnpm build`, así que vale igual en local, en Vercel y en GitHub Actions.
 *
 * Por qué un post-build y no una exclusión en next.config: con `output: "export"` no hay forma
 * de excluir una ruta estática del grafo; o existe en `src/app/` o no existe. Esto deja
 * `/design-system` disponible en `pnpm dev` (es la herramienta de trabajo del design system)
 * y fuera del artefacto publicado.
 *
 * Los chunks JS de la ruta se quedan en `_next/static` — pesan poco y nada los referencia una
 * vez borrado el HTML.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");
const INTERNAL = ["design-system"];

if (!fs.existsSync(OUT)) {
  console.error("[strip-internal-routes] no existe out/ — ¿corriste next build?");
  process.exit(1);
}

let removed = 0;
for (const route of INTERNAL) {
  for (const target of [path.join(OUT, route), path.join(OUT, `${route}.html`), path.join(OUT, `${route}.txt`)]) {
    if (!fs.existsSync(target)) continue;
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`[strip-internal-routes] fuera: ${path.relative(OUT, target)}`);
    removed++;
  }
}

console.log(`[strip-internal-routes] ${removed} entrada(s) eliminada(s) de out/`);
