import type { Metadata } from "next";

/**
 * Showcase INTERNO del design system. No es producción: `scripts/strip-internal-routes.mjs`
 * lo borra de `out/` al terminar el build, así que nunca se despliega. El `noindex` queda como
 * segunda línea de defensa (el robots.txt no se honra si el sitio se sirve bajo un subpath).
 */
export const metadata: Metadata = {
  title: "Design System (internal)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
