import type React from "react";
/**
 * Borde izquierdo del contenido de la sección anterior (Métricas: `max-w-section-lg` centrado +
 * `gutter-md`), para que el acto 1 arranque en la misma vertical.
 * Clase completa (Tailwind solo genera literales que encuentra escritos).
 */
export const CONTENT_EDGE_PL = "pl-[calc(max(0px,(100vw_-_var(--max-w-section-lg))/2)_+_var(--space-gutter-md))]";

/**
 * Stroke de las cajas del horizontal: hairline del DS + radio de contenedor.
 *
 * El color va CONGELADO en su versión clara (pedido de dirección 15/10/2026). La caja del acto 1
 * está siempre sobre el azul de marca, que NO invierte con el tema; con el token bimodal el stroke
 * saltaba de gris claro (#E0E4E6) a gris oscuro (#383B3D) sin que su fondo cambiara. Mismo recurso
 * que `CARD_LIGHT`: se reconstruye con los dos tokens que no invierten (`Black-100` 12% sobre
 * `BG-white` ≈ #E0E4E6, el valor claro de `--color-border-Strokes-default`).
 */
export const ACT_FRAME = "rounded-xl border border-[color-mix(in_srgb,var(--color-text-Black-100)_12%,var(--color-surface-BG-white))]";
/** Fondo de las tarjetas de producto: un paso más claro que el de la sección (BG-1) para separarlas. */
export const CARD_SURFACE = "bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-2)]";
/** Caja del acto 1: mismo alto (75vh) que la columna de cada producto, para alinear arriba y abajo. */
export const ACT_BOX = `h-[75vh] ${ACT_FRAME}`;

/**
 * Acto 1 sobre AZUL de marca (aprobado 06/10/2026), un escalón MÁS CLARO que el azul de la sección
 * (12% de blanco, pedido de dirección 15/10/2026) para que la caja se despegue del fondo. Clase de fondo + variables que leen el
 * titular, los glifos, el logo GO Hub, su recuadro y las fichas (todas con fallback a su color normal).
 * Para volver al acto 1 claro basta con quitar ACT1_ON_BRAND_CLASS y ACT1_ON_BRAND_VARS de las cajas.
 */
export const ACT1_ON_BRAND_CLASS = "bg-[color-mix(in_srgb,var(--color-text-White-100)_12%,var(--color-brand-blue))]";
export const ACT1_ON_BRAND_VARS = {
  "--act1-ink": "var(--color-text-White-100)",
  "--act1-ink-soft": "color-mix(in srgb, var(--color-text-White-100) 80%, transparent)",
  "--act1-line": "color-mix(in srgb, var(--color-text-White-100) 35%, transparent)",
  "--act1-tile": "color-mix(in srgb, var(--color-text-White-100) 14%, transparent)",
  "--hub-glyph": "color-mix(in srgb, var(--color-brand-blue) 35%, var(--color-text-White-100))",
  "--gohub-shape": "var(--color-text-White-100)",
  "--gohub-dark": "var(--color-text-White-100)",
  "--gohub-letter": "var(--color-brand-blue)",
} as React.CSSProperties;

/**
 * Las tarjetas de producto del Bento son SIEMPRE claras, también en modo oscuro (pedido de dirección
 * 14/10/2026, desktop y móvil): el producto se ve como se ve en la app. Por eso no sirven los tokens
 * que invierten con el tema; estos se construyen con `color-mix` a partir de los dos que NO invierten
 * (`BG-white` = #FFFFFF y `Black-100` = #1A1E21). Reporte de margen creativo: los porcentajes
 * reproducen los valores del DS en claro — hairline ≈ #E0E4E6, caja del logo ≈ #F7F7F7,
 * texto secundario ≈ #60707C.
 */
export const CARD_LIGHT = {
  /** Superficie de la tarjeta. */
  surface: "bg-[var(--color-surface-BG-white)]",
  /** Stroke de la tarjeta. */
  hairline: "border border-[color-mix(in_srgb,var(--color-text-Black-100)_12%,var(--color-surface-BG-white))]",
  /** Caja del logo: sin stroke, separada por un escalón de superficie. */
  logoSurface: "bg-[color-mix(in_srgb,var(--color-text-Black-100)_4%,var(--color-surface-BG-white))]",
  /** Texto principal. */
  ink: "text-[var(--color-text-Black-100)]",
  /** Texto secundario. */
  inkSoft: "text-[color-mix(in_srgb,var(--color-text-Black-100)_62%,var(--color-surface-BG-white))]",
  /** Ancla el trazo bimodal de los logos SVG (ver `--logo-ink` en BentoGridDesktop). */
  logoInk: { "--logo-ink": "var(--color-text-Black-100)" } as React.CSSProperties,
} as const;
