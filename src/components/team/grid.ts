/**
 * @description Retícula de /team: 4 columnas en móvil (más juego compositivo que las 6 de
 * `grid-layout`), 8 en tablet y 12 en desktop — desktop idéntico a `grid-layout` (mismas columnas y
 * gap). Local a /team para no mover las páginas ya aprobadas que usan `grid-layout`.
 */
export const TEAM_GRID = "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-[var(--space-fluid-xs)]";
