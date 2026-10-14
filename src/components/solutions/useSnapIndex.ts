"use client";

import { useEffect, useRef, useState } from "react";

/**
 * @description Índice del cuadrado activo en un slider móvil con `snap-x` (patrón "slider de
 * cuadrados", MOBILE-PATTERN-LIBRARY §1). Mide como mucho una vez por frame y no reescribe el
 * estado si el índice no cambió. El track es el elemento que recibe `ref` y `onScroll`.
 */
export function useSnapIndex(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  // El rAF pendiente muere con el componente: si no, mide un track ya desmontado.
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      if (!step) return;
      const index = Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  return { trackRef, onScroll, active };
}
