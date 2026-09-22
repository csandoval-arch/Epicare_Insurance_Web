/**
 * @description Superficies compartidas de los dashboards de métricas, bimodales: blanco sobre el
 * fondo claro de la sección y un gris elevado en tema oscuro (BG-white no cambia con el tema).
 */
export const SURFACE = "bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)]";
export const SURFACE_MUTED = "bg-[var(--color-surface-BG-1)] dark:bg-[var(--color-surface-BG-2)]";

/**
 * Contenedor de cada dashboard (tarjeta). El alto lo pone cada slide: fijo en desktop, natural en móvil.
 * Sombra: una sola elevación del DS, y solo en desktop. En móvil va dentro del slider (overflow-x) y el
 * contenedor de scroll recortaba la sombra en su borde inferior, pintando una franja de fondo.
 */
export const SHELL = `${SURFACE} relative z-10 w-full max-w-5xl mx-auto flex flex-col overflow-hidden rounded-2xl lg:rounded-4xl lg:shadow-elevation-2 border border-[var(--color-border-Strokes-default)]`;

/**
 * Escala tipográfica única de los dashboards. Todo en sentence case (sin `uppercase` forzado) y los
 * números con cifras tabulares. Cada rol tiene UN tamaño en todos los dashboards:
 * - title / subtitle: cabecera del dashboard.
 * - heading: título de una tarjeta interna. label: nombre de una métrica.
 * - hero: la cifra principal de un panel. value: cifra secundaria (KPIs, velocidad…).
 * - num: cifras pequeñas (leyendas, centro de donut). caption: ejes, notas, "Total".
 * - badge: tendencia (se combina con `trendClass`).
 */
export const TYPE = {
  title: "text-display-xs text-[var(--color-text-primary)]",
  subtitle: "text-body-sm text-[var(--color-text-secondary)]",
  heading: "text-body-sm font-medium text-[var(--color-text-primary)]",
  label: "text-body-sm text-[var(--color-text-muted)]",
  hero: "text-display-sm tabular-nums text-[var(--color-text-primary)]",
  value: "text-h5 tabular-nums text-[var(--color-text-primary)]",
  num: "text-body-sm font-medium tabular-nums text-[var(--color-text-primary)]",
  caption: "text-caption text-[var(--color-text-muted)]",
  badge: "text-caption font-medium tabular-nums px-1.5 py-0.5 rounded",
} as const;

/** Etiqueta de tendencia (↑ verde / ↓ rojo) con los pares de estado del DS. */
export const trendClass = (down: boolean) =>
  down
    ? "bg-[var(--color-status-red-surface-subtle)] text-[var(--color-status-red-text-Medium)]"
    : "bg-[var(--color-status-green-surface-subtle)] text-[var(--color-status-green-text-Medium)]";
