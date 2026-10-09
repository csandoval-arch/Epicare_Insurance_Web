/**
 * @description Hover de luz para tiles de vidrio líquido (desktop). Lo comparten los modales Join y Login.
 * El puntero escribe --mx/--my en el tile (`trackPointer`, sin re-render de React); dos capas leen esa posición:
 * - SPOTLIGHT: luz neutra (el relleno del vidrio, `--glass-liquid-tile`) que sigue al cursor: aclara el fondo
 *   bajo el texto en vez de teñirlo → el contraste no baja.
 * - RING: el mismo foco recortado a 1px de borde (máscara content-box exclude) → el canto se ilumina en azul
 *   solo cerca del cursor.
 * Ambas entran solo con opacity. El tile necesita `group/tile relative overflow-hidden` y su contenido `relative`.
 * Margen creativo: 85 % de azul en el canto, radios 260/200px.
 */

import type { CSSProperties, PointerEvent } from "react";

const SPOTLIGHT: CSSProperties = {
  background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), var(--glass-liquid-tile), transparent 70%)",
};
const RING: CSSProperties = {
  padding: 1,
  background: "radial-gradient(200px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--color-brand-blue) 85%, transparent), transparent 70%)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};
const LIGHT_LAYER = "hidden lg:block absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 transition-opacity duration-300 ease-out group-hover/tile:opacity-100";

/** Clases base de un tile con luz: vidrio, grupo, recorte y elevación al hover. */
export const LIGHT_TILE =
  "glass-liquid-tile group/tile relative overflow-hidden text-left rounded-lg cursor-pointer transition-[translate,scale] duration-300 ease-out hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]";

export const trackPointer = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/** Las dos capas de luz; van como primeros hijos del tile. */
export function GlassLight() {
  return (
    <>
      <span aria-hidden="true" className={LIGHT_LAYER} style={SPOTLIGHT} />
      <span aria-hidden="true" className={LIGHT_LAYER} style={RING} />
    </>
  );
}
