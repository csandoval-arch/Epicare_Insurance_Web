"use client";

import React, { useEffect, useRef, useState } from "react";

/** Desde este ancho el contenedor sangra hasta el borde derecho del viewport. */
const BLEED_MIN_WIDTH = 1024;

interface BleedRightProps {
  children: React.ReactNode;
  className?: string;
  /** Clases del sangrado en móvil/tablet (p. ej. `min-w-[150%] w-[150%] -mr-[50%]`). */
  mobileBleedClassName: string;
}

/**
 * @description Rompe el grid por la derecha y hace que el contenido toque el borde del viewport
 * en desktop (≥1024px). Mide la distancia real al borde y la compensa con `right` negativo.
 * Re-mide en resize y cuando cambia el tamaño del documento (p. ej. aparece el scrollbar al
 * terminar el loader), agrupado en un rAF para no medir más de una vez por frame.
 * @example
 * <BleedRight className="relative w-full" mobileBleedClassName="min-w-[150%] w-[150%] -mr-[50%]">…</BleedRight>
 */
export default function BleedRight({ children, className = "", mobileBleedClassName }: BleedRightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const measure = () => {
      if (window.innerWidth < BLEED_MIN_WIDTH) {
        setOffset(0);
        return;
      }
      const originalRight = el.style.right;
      el.style.right = "0px";
      const dist = document.documentElement.clientWidth - el.getBoundingClientRect().right;
      el.style.right = originalRight;
      setOffset(dist > 0 ? dist : 0);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("load", schedule);
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ right: offset > 0 ? `-${offset}px` : undefined }}
      className={`${className} ${mobileBleedClassName} lg:min-w-0 lg:w-full lg:mr-0`}
    >
      {children}
    </div>
  );
}
