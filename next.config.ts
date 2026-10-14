import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Producción (Vercel) sirve desde la raíz, así que esto queda vacío. Se mantiene por env para
// poder desplegar bajo un subpath (p. ej. un project site de GitHub Pages) sin tocar código:
// exporta NEXT_PUBLIC_BASE_PATH y actualiza SITE_URL en src/app/layout.tsx a la vez.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
  // Permite conectarse desde el celular (Next.js 16/Turbopack lo bloquea por defecto por seguridad)
  allowedDevOrigins: ['192.168.18.221'],
  // Silencia el warning de múltiples lockfiles — establece esta carpeta como raíz de Turbopack
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
