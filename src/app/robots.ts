import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

// Obligatorio con output: "export" — sin esto el build falla al recolectar la ruta.
export const dynamic = "force-static";

/**
 * @description Reglas de rastreo. `/design-system` ya no llega a producción (lo borra
 * `scripts/strip-internal-routes.mjs`), pero la regla se mantiene por si alguien despliega
 * un build sin ese paso. `/join-us` y `/team` se controlan con el `robots` de su layout,
 * que viaja en el HTML y funciona aunque el sitio se sirva bajo un subpath.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/design-system/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
