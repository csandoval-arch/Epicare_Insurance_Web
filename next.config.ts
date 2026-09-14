import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Base path for the GitHub Pages project site (chrisbeep98.github.io/Epicare).
// Driven by env so local dev stays at root ("").
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
