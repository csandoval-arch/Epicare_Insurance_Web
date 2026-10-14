import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

// Obligatorio con output: "export" — sin esto el build falla al recolectar la ruta.
export const dynamic = "force-static";

/**
 * @description Sitemap estático. Solo rutas públicas, indexables y terminadas: lo que declara
 * aquí tiene que coincidir con lo que la navegación enlaza y con el `robots` de su layout.
 *
 * Fuera a propósito:
 * - `/team` — deshabilitada en header y footer ("coming soon") hasta sustituir el elenco
 *   provisional por el equipo real. Su layout la marca `noindex`.
 * - `/join-us` — formulario de alta, `noindex`: se indexa el marketing, no el embudo.
 * - `/design-system` — showcase interno; `strip-internal-routes.mjs` lo borra del build.
 *
 * Las URLs llevan barra final porque next.config usa trailingSlash.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/go-ams/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/go-crm/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/solutions/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/company/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/licensing/`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
