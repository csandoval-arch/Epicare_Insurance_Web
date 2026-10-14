"use client";

/**
 * @file HoloIcon.tsx
 * @description Iconografía "Abstract Diegetic UI" (skill `holographic-tech-visuals`) adaptada a
 * Epicare: siluetas de geometría simétrica a stroke, ancladas por pulsos de radar, con una
 * micro-interacción propia cada una.
 *
 * Dos desviaciones deliberadas de la skill, declaradas:
 *  1. La skill fija `stroke="rgba(255,255,255,0.4)"` porque nace de un fondo oscuro. Aquí el sitio
 *     es bimodal, así que el stroke es `currentColor` y el color lo pone un token.
 *  2. La plantilla GSAP de la skill anima `filter: drop-shadow` en bucle infinito. En este repo los
 *     filtros animados se purgaron por rendimiento (acción 141, HARDWARE-SYMPHONY): aquí los bucles
 *     son solo `transform` y `opacity`. El resplandor existe, pero estático.
 *
 * Los bucles corren **solo en el icono activo**: los demás quedan quietos y no gastan compositor.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export type HoloVariant = "campaigns" | "funnels" | "material";

const SVG_BASE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 0.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Siluetas simétricas sobre un viewBox de 24. Nada dibujado "a ojo". */
function Silhouette({ variant }: { variant: HoloVariant }) {
  if (variant === "campaigns") {
    // Diana: anillos concéntricos + retícula. Simetría perfecta sobre (12,12).
    return (
      <g className="holo-art" {...SVG_BASE}>
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 0.5v3M12 20.5v3M0.5 12h3M20.5 12h3" />
      </g>
    );
  }
  if (variant === "funnels") {
    // Embudo: trapecio simétrico que converge en un canal central.
    return (
      <g className="holo-art" {...SVG_BASE}>
        <path d="M2.5 3.5h19l-7.25 8.5v7.5l-4.5 2.5v-10z" />
        <path d="M7 7.5h10" />
      </g>
    );
  }
  // Material: tres planos apilados, simétricos sobre el eje vertical.
  return (
    <g className="holo-art" {...SVG_BASE}>
      <path className="holo-sheet" d="M12 2.5 22 7.5 12 12.5 2 7.5z" />
      <path d="M2 12 12 17l10-5" />
      <path d="M2 16.5 12 21.5l10-5" />
    </g>
  );
}

export default function HoloIcon({ variant, active }: { variant: HoloVariant; active: boolean }) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1 · Ancla de sistema: los ecos de radar (transform + opacity).
      gsap.fromTo(
        ".holo-pulse",
        { scale: 0.75, opacity: 0.55 },
        {
          scale: 1.8,
          opacity: 0,
          duration: 2.5,
          ease: "sine.out",
          stagger: { each: 1.25, repeat: -1 },
          force3D: true,
        }
      );

      // 2 · Micro-interacción propia de cada silueta.
      if (variant === "campaigns") {
        // El centro de la diana late: es el impacto.
        gsap.to(".holo-core", { scale: 1.35, opacity: 1, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "center" });
      } else if (variant === "funnels") {
        // Una gota de dato cae por el canal y sale convertida.
        gsap.fromTo(
          ".holo-drop",
          { yPercent: -260, opacity: 0 },
          { keyframes: [{ opacity: 1, duration: 0.3 }, { yPercent: 120, duration: 1.5 }, { opacity: 0, duration: 0.3 }], ease: "sine.in", repeat: -1, repeatDelay: 0.4 }
        );
      } else {
        // El plano superior se despega: la pieza que se personaliza.
        gsap.to(".holo-sheet", { yPercent: -9, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    }, el);

    return () => ctx.revert();
  }, [variant, active]);

  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      className={`relative shrink-0 inline-flex items-center justify-center w-static-2xl h-static-2xl transition-colors duration-500 ${
        active ? "text-[var(--color-brand-blue)]" : "text-[var(--color-text-muted)]"
      }`}
    >
      {/* Resplandor ambiental: estático, nunca animado */}
      <span className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--color-brand-blue)_14%,transparent)] blur-md" />

      {/* Ecos de radar */}
      {active && (
        <>
          <span className="holo-pulse absolute inset-0 rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_45%,transparent)]" />
          <span className="holo-pulse absolute inset-0 rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_45%,transparent)]" />
        </>
      )}

      <svg viewBox="0 0 24 24" className="relative w-static-lg h-static-lg overflow-visible">
        <Silhouette variant={variant} />
        {variant === "campaigns" && (
          <circle className="holo-core" cx="12" cy="12" r="1.2" fill="currentColor" opacity="0.7" />
        )}
        {variant === "funnels" && (
          <circle className="holo-drop" cx="12" cy="11" r="1.1" fill="currentColor" />
        )}
      </svg>
    </span>
  );
}
