/**
 * @file shared.ts
 * @description Vocabulario común de las secciones de /solutions: clases de sección, retícula de
 * hairlines y estados de entrada de GSAP. Mismo idioma visual que `/go-crm` (`ProblemGoCrm` es la
 * implementación de referencia), para que la página no invente su propio sistema.
 */

import { DUR, EASE, REVEAL, TRIGGER } from "@/lib/motion";

// ── MEDIA QUERIES (gsap.matchMedia) ──
export const DESKTOP = "(min-width: 1024px)";
export const MOBILE = "(max-width: 1023px)";
export const FULL = "(prefers-reduced-motion: no-preference)";

// ── CARCASAS ──
/**
 * Sección estándar de la página: un solo fondo, sin franjas entre bloques.
 * **Un solo dueño del espacio** (`vertical-spacing-protocol`): cada sección solo paga el aire que
 * va DEBAJO de ella. El de arriba lo pone la anterior; el de la primera, el `pb` del hero. Sin
 * esto, `py` + `py` suman dos veces y dejan un vacío de hasta 320px entre bloques.
 */
export const SECTION =
  "relative w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] pb-section-sm lg:pb-section-md";

/** Contenedor centrado con los gutters del DS (14px en móvil). */
export const CONTAINER = "max-w-section-xl px-gutter-sm md:px-gutter-md";

/**
 * Retícula de hairlines: el `gap-px` deja ver el color de borde del fondo, así las celdas quedan
 * separadas por una línea de 1px sin dibujar bordes en cada una.
 * El marco exterior va aparte (`GRID_FRAME`): una sección con slider móvil dentro lo quiere solo
 * desde `md`, o queda una caja dentro de otra caja.
 */
export const HAIRLINE_GRID = "grid gap-px bg-[var(--color-border-Strokes-default)]";

/** Marco exterior de la retícula. */
export const GRID_FRAME = "border border-[var(--color-border-Strokes-default)]";

/** Relleno de celda: 14px laterales en móvil, 24px en tablet, 32px en desktop. */
export const CELL =
  "bg-[var(--color-surface-BG-base)] px-gutter-sm py-static-lg md:px-static-lg lg:p-static-xl";

/** Acento superior que se extiende al hover de la celda (que debe ser `group/tile`). */
export const HOVER_RULE =
  "absolute top-0 inset-x-0 h-0.5 bg-[var(--color-brand-blue)] origin-left scale-x-0 group-hover/tile:scale-x-100 transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

// ── ESTADOS DE ENTRADA ──
export const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
export const BIRTH_TO = {
  yPercent: 0,
  opacity: 1,
  duration: DUR.slow,
  ease: EASE.dramatic,
  force3D: true,
  clearProps: "willChange",
};

export const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
/** `clearProps` del transform: una celda en capa propia se come el hairline de 1px del `gap-px`. */
export const CARD_TO = {
  opacity: 1,
  y: 0,
  duration: DUR.base,
  ease: EASE.out,
  force3D: true,
  clearProps: "transform,willChange",
};

/** Entrada de una sola pasada (no se repite al volver a bajar). */
export const oneShot = (trigger: Element | null, start: string = TRIGGER.standard) => ({
  scrollTrigger: { trigger, start, toggleActions: "play none none reverse" },
});
