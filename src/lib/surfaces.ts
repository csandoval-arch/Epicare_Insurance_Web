import type { CSSProperties } from "react";

/**
 * @description Texturas de superficie compartidas.
 * `BRAND_GLOW`: halo del azul de marca que nace en la esquina superior derecha y se disuelve antes del
 * texto (tarjetas de "Tu papel" en /team y del modal Join). Solo un gradiente, sin filter.
 * Margen creativo: 16 % de azul, elipse 120×90 %.
 */
export const BRAND_GLOW: CSSProperties = {
  backgroundImage: "radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--color-brand-blue) 16%, transparent), transparent 60%)",
};
