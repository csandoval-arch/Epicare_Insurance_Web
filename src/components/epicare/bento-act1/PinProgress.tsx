"use client";

import React from "react";

/**
 * @description Indicador flotante de "sigue haciendo scroll" para el pin horizontal del Bento.
 * Vive dentro de la sección pineada (absolute), así que se ve durante TODO el recorrido, centrado a
 * 6vh del borde inferior; su tramo azul (`.pin-progress-bar`) se llena con el progreso del pin — lo
 * escala el GSAP del Bento con scrub (solo transform: scaleX desde la izquierda). Decorativo.
 */
export default function PinProgress() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute z-20 bottom-[6vh] left-1/2 -translate-x-1/2">
      <div className="relative w-40 h-0.5 overflow-hidden rounded-full bg-[var(--color-text-primary)]/20">
        <span className="pin-progress-bar absolute inset-0 origin-left scale-x-0 rounded-full bg-[var(--color-brand-blue)] will-change-transform" />
      </div>
    </div>
  );
}
