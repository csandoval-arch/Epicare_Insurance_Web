import type React from "react";
/**
 * Borde izquierdo del contenido de la sección anterior (Métricas: `max-w-section-lg` centrado +
 * `gutter-md`), para que el acto 1 arranque en la misma vertical.
 * Clase completa (Tailwind solo genera literales que encuentra escritos).
 */
export const CONTENT_EDGE_PL = "pl-[calc(max(0px,(100vw_-_var(--max-w-section-lg))/2)_+_var(--space-gutter-md))]";

/** Stroke de las cajas del horizontal: hairline del DS + radio de contenedor. */
export const ACT_FRAME = "rounded-xl border border-[var(--color-border-Strokes-default)]";
/** Fondo de las tarjetas de producto: un paso más claro que el de la sección (BG-1) para separarlas. */
export const CARD_SURFACE = "bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-2)]";
/** Caja del acto 1: mismo alto (75vh) que la columna de cada producto, para alinear arriba y abajo. */
export const ACT_BOX = `h-[75vh] ${ACT_FRAME}`;

/**
 * Acto 1 sobre AZUL de marca (aprobado 06/10/2026). Clase de fondo + variables que leen el
 * titular, los glifos, el logo GO Hub, su recuadro y las fichas (todas con fallback a su color normal).
 * Para volver al acto 1 claro basta con quitar ACT1_ON_BRAND_CLASS y ACT1_ON_BRAND_VARS de las cajas.
 */
export const ACT1_ON_BRAND_CLASS = "bg-[var(--color-brand-blue)]";
export const ACT1_ON_BRAND_VARS = {
  "--act1-ink": "var(--color-text-White-100)",
  "--act1-ink-soft": "color-mix(in srgb, var(--color-text-White-100) 80%, transparent)",
  "--act1-line": "color-mix(in srgb, var(--color-text-White-100) 35%, transparent)",
  "--act1-tile": "transparent",
  "--hub-glyph": "color-mix(in srgb, var(--color-brand-blue) 35%, var(--color-text-White-100))",
  "--gohub-shape": "var(--color-text-White-100)",
  "--gohub-dark": "var(--color-text-White-100)",
  "--gohub-letter": "var(--color-brand-blue)",
} as React.CSSProperties;
