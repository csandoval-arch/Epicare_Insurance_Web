/**
 * @description Geometría de la columna de vídeo del hero ("corte arquitectónico"). Vive en un solo sitio
 * porque la usan la columna, el recorte de la copia blanca y el bloque de CTAs (el JS del acto 2 lee la
 * caja ya colocada por el CSS).
 * - Desktop (≥md), fijada con el panel de debug el 2026-10-05 (retícula de 12 columnas + ajuste en px):
 *   · ES: empieza en la col 5 − 110px, 3 columnas de ancho + 42px.
 *   · EN: empieza en la col 4 + 80px, 3 columnas de ancho − 48px.
 * - Móvil / tablet (<1024px): banda a sangre en el flujo (clases en HeroEpicare, no usa esto).
 */
const COLUMN = {
  es: { left: "calc(33.3333% - 110px)", width: "calc(25% + 42px)" },
  en: { left: "calc(25% + 80px)", width: "calc(25% - 48px)" },
} as const;

/** Breakpoint a partir del cual el hero usa el layout desktop (y el pin del acto 2). Por debajo, móvil y
 *  tablet van en flujo con el vídeo como banda a sangre. */
export const HERO_DESKTOP_MQ = "(min-width: 1024px)";

/** Variables CSS de la columna desktop (colocan la columna y el recorte antes y después del JS). */
export function columnCssVars(isEn: boolean) {
  const c = isEn ? COLUMN.en : COLUMN.es;
  return { "--col-l": c.left, "--col-w": c.width } as Record<string, string>;
}

/** Evento con la caja de la columna en pantalla (lo publica useHeroMotion, lo escucha HeaderEpicare). */
export const HERO_COLUMN_EVENT = "hero-column";
export type HeroColumnDetail = { x0: number; x1: number } | null;
