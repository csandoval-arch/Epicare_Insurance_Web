"use client";

import React, { useRef, useState, useLayoutEffect } from "react";

export interface BleedLeftProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @description Helper para sangrar un contenedor hacia el borde físico izquierdo del viewport (x = 0).
 * Calcula en useLayoutEffect la distancia desde el parent hasta el borde de pantalla y aplica
 * margen negativo y compensación de ancho exacto.
 */
export function BleedLeft({ children, className = "" }: BleedLeftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (ref.current) {
        if (window.innerWidth >= 1024) {
          // En desktop medimos el anclaje del grid layout no transformado por GSAP
          const anchor = ref.current.closest(".grid-layout") || ref.current.closest("section");
          if (anchor) {
            const rect = anchor.getBoundingClientRect();
            setOffset(rect.left > 0 ? rect.left : 0);
            return;
          }
          if (ref.current.parentElement) {
            const rect = ref.current.parentElement.getBoundingClientRect();
            setOffset(rect.left > 0 ? rect.left : 0);
          }
        } else {
          setOffset(0);
        }
      }
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.addEventListener("load", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.removeEventListener("load", update);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Mobile: Pure CSS to offset exactly the container's gutter padding */
        @media (max-width: 1023px) {
          .bleed-left-responsive {
            margin-left: calc(-1 * var(--space-gutter-sm, 16px)) !important;
            width: calc(100% + var(--space-gutter-sm, 16px)) !important;
          }
        }
        /* Desktop: Uses the JS calculated offset */
        @media (min-width: 1024px) {
          .bleed-left-responsive {
            margin-left: calc(-1 * var(--bleed-offset, 0px)) !important;
            width: calc(100% + var(--bleed-offset, 0px)) !important;
          }
        }
      `}} />
      <div
        ref={ref}
        style={{
          "--bleed-offset": offset > 0 ? `${offset}px` : "0px",
        } as React.CSSProperties}
        className={`bleed-left-responsive ${className}`}
      >
        {children}
      </div>
    </>
  );
}
