"use client";

/**
 * @description Slider nativo infinito (scroll-snap, sin JS de arrastre) para los carruseles móviles de
 * /team: la lista se repite `COPIES` veces y arranca en la copia central; cuando el swipe se detiene
 * fuera de ella, el scroll salta en silencio a la tarjeta equivalente del centro (mismo encuadre).
 * `active` es la posición real (0…n-1): el indicador y el contador vuelven al inicio al dar la vuelta.
 * Con `infinite` false se comporta como un slider simple (una sola copia).
 * El índice se mide como mucho una vez por frame (rAF), como en MOBILE-PATTERN-LIBRARY §1.
 */

import { useLayoutEffect, useRef, useState } from "react";

/** Copias de la lista en el modo infinito (la del medio es la "real"). */
export const COPIES = 3;
/** Espera tras el último evento de scroll para considerar que el swipe se detuvo (ms). */
const SETTLE_MS = 140;

const stepOf = (track: HTMLElement) => {
  const first = track.firstElementChild as HTMLElement | null;
  return first ? first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0") : 0;
};

export function useInfiniteSnap(n: number, infinite: boolean) {
  const copies = infinite ? COPIES : 1;
  /** Posición inicial en la lista completa: la primera tarjeta de la copia central. */
  const start = infinite ? n : 0;
  const trackRef = useRef<HTMLUListElement>(null);
  const frame = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [current, setCurrent] = useState(start);

  // Arranque: colocar la posición inicial sin animación.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track && start) track.scrollLeft = stepOf(track) * start;
    return () => clearTimeout(settle.current);
  }, [start]);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      const step = stepOf(track);
      if (!step) return;
      const index = Math.min(n * copies - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setCurrent((prev) => (prev === index ? prev : index));
      if (copies === 1) return;
      clearTimeout(settle.current);
      settle.current = setTimeout(() => {
        const now = Math.round(track.scrollLeft / step);
        if (now < n || now >= 2 * n) {
          const target = n + (((now % n) + n) % n);
          track.scrollLeft = target * step;
          setCurrent(target);
        }
      }, SETTLE_MS);
    });
  };

  return { trackRef, onScroll, current, active: current % n, copies };
}
