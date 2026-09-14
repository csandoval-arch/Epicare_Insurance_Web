import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

// Obligatorio con output: "export" — sin esto el build falla al recolectar la ruta.
export const dynamic = "force-static";

/**
 * @description Bloquea /design-system, que es el showcase interno del sistema de
 * diseño y no debe indexarse. Ver la nota del sitemap: en GitHub Pages project
 * sites este archivo se sirve bajo /Epicare/robots.txt, donde los crawlers NO lo
 * leen. Sirve como documentación de intención y funcionará tal cual si el sitio
 * migra a un dominio propio.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/design-system/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
