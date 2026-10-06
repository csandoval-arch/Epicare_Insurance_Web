"use client";

import { useEffect, useRef } from "react";

/**
 * @description Indicador mínimo de "sigue haciendo scroll": una pista de hairline con un tramo en el
 * azul de marca que la recorre de izquierda a derecha en bucle (dirección del scroll horizontal).
 * Hardware Symphony: keyframe CSS solo con `transform` (`.scroll-hint-bar` en globals.css), pausado
 * fuera de pantalla con `.is-offscreen` (IntersectionObserver); con reduced-motion queda quieto.
 * Decorativo: `aria-hidden`.
 */
export default function ScrollHint({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`scroll-hint relative w-16 h-0.5 overflow-hidden rounded-full bg-[var(--color-text-primary)]/15 ${className}`}
    >
      <span className="scroll-hint-bar absolute inset-y-0 left-0 w-2/5 rounded-full bg-[var(--color-brand-blue)]" />
    </div>
  );
}
