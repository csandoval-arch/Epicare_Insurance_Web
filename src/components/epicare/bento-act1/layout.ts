/**
 * Borde izquierdo del contenido de la sección anterior (Métricas: `max-w-section-lg` centrado +
 * `gutter-md`), para que el acto 1 arranque en la misma vertical.
 * Clase completa (Tailwind solo genera literales que encuentra escritos).
 */
export const CONTENT_EDGE_PL = "pl-[calc(max(0px,(100vw_-_var(--max-w-section-lg))/2)_+_var(--space-gutter-md))]";

/** Stroke de las cajas del horizontal: hairline del DS + radio de contenedor. */
export const ACT_FRAME = "rounded-xl border border-[var(--color-border-Strokes-default)]";
/** Caja del acto 1: mismo alto (75vh) que la columna de cada producto, para alinear arriba y abajo. */
export const ACT_BOX = `h-[75vh] ${ACT_FRAME}`;
