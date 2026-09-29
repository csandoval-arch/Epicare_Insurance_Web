/** Superficie del footer: grafito fijo (`--color-text-Black-100`, elegido por el usuario) con texto blanco, en los dos temas. */
export const BG = "bg-[var(--color-text-Black-100)]";
export const SURFACE = `${BG} text-[var(--color-text-White-100)]`;
export const HAIRLINE = "border-[var(--color-text-White-100)]/15";
export const LINK = "hover:text-[var(--color-brand-blue)]";
/** Márgenes laterales: 14px en móvil; gutter lg en tablet y xl en desktop. */
export const GUTTER = "px-gutter-sm md:px-gutter-lg lg:px-gutter-xl";
/** Aire interior de las celdas de la retícula (a ambos lados: el bloque va enmarcado). */
export const PAD_X = "px-static-md md:px-static-lg";
/** Aire vertical del footer (tablet/desktop con los valores fijados por el usuario; móvil, tokens). */
export const SPACE = {
  top: "pt-section-sm md:pt-[8.875rem]",
  gap: "pb-static-2xl md:pb-[2.625rem]",
  wordmarkTop: "pt-static-lg md:pt-[4.625rem]",
  wordmarkBottom: "pb-static-xl md:pb-[4.5rem]",
  legal: "py-static-lg md:py-static-2xl",
};
