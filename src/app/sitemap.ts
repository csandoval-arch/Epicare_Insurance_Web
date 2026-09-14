import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

// Obligatorio con output: "export" — sin esto el build falla al recolectar la ruta.
export const dynamic = "force-static";

/**
 * @description Sitemap estático. Importante aquí: /go-ams es una ruta huérfana
 * (ningún enlace de la landing apunta a ella todavía — los CTA y los links de
 * header/footer son href="#"), así que sin sitemap no hay forma de que se
 * descubra. Las URLs llevan barra final porque next.config usa trailingSlash.
 *
 * Nota de despliegue: en un project site de GitHub Pages el robots.txt solo se
 * honra desde la raíz del dominio, no desde /Epicare/. Registra la URL absoluta
 * de este sitemap directamente en Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/go-ams/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/go-crm/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/licensing/`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
