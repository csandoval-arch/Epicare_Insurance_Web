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

export type HoloVariant = "campaigns" | "funnels" | "material" | "metrics" | "build" | "tools";

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
  if (variant === "metrics") {
    // Lectura: instrumento con su onda de datos y una línea de escaneo que lo recorre.
    return (
      <g className="holo-art" {...SVG_BASE} strokeWidth={1.1}>
        <rect x="2" y="4" width="20" height="16" rx="1.5" />
        <path d="M5 15.5l3.5-4 3 3 3.5-5.5 3 4" />
        <path className="holo-scan" d="M12 4.5v15" opacity="0.5" />
      </g>
    );
  }
  if (variant === "build") {
    // Emisión: nodo central y arcos concéntricos saliendo a los dos lados. Simetría sobre x=12.
    return (
      <g className="holo-art" {...SVG_BASE} strokeWidth={1.1}>
        <circle cx="12" cy="12" r="2" />
        <path className="holo-wave" d="M7.4 7.4a6.5 6.5 0 0 0 0 9.2M16.6 7.4a6.5 6.5 0 0 1 0 9.2" />
        <path className="holo-wave" d="M4.2 4.2a11 11 0 0 0 0 15.6M19.8 4.2a11 11 0 0 1 0 15.6" />
      </g>
    );
  }
  if (variant === "tools") {
    // Puesta a punto: tres carriles con su mando. Cada mando se desplaza por su carril.
    return (
      <g className="holo-art" {...SVG_BASE} strokeWidth={1.1}>
        <path d="M3 6.5h18M3 12h18M3 17.5h18" opacity="0.55" />
        <circle className="holo-knob" cx="8" cy="6.5" r="2.1" />
        <circle className="holo-knob" cx="15" cy="12" r="2.1" />
        <circle className="holo-knob" cx="10" cy="17.5" r="2.1" />
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

/**
 * `chrome`: el ancla de sistema de la skill (resplandor difuminado + ecos de radar). Sobre una
 * superficie opaca unifica los iconos; sobre VIDRIO se convierte en una mancha azul difusa, así
 * que las tarjetas de Business Intelligence lo apagan y se quedan solo con la silueta, más grande
 * y con el trazo más firme. Desviación declarada de `holographic-tech-visuals` §2.
 */
export default function HoloIcon({
  variant,
  active,
  chrome = true,
}: {
  variant: HoloVariant;
  active: boolean;
  chrome?: boolean;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1 · Ancla de sistema: los ecos de radar (transform + opacity). Solo existen con `chrome`.
      if (chrome) {
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
      }

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
      } else if (variant === "metrics") {
        // La línea de escaneo barre el instrumento de lado a lado: es la lectura de la métrica.
        gsap.fromTo(
          ".holo-scan",
          { x: -7.5, opacity: 0.25 },
          { x: 7.5, opacity: 0.85, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 }
        );
      } else if (variant === "build") {
        // Los arcos se encienden hacia fuera: la campaña saliendo a sus canales.
        gsap.fromTo(
          ".holo-wave",
          { opacity: 0.2 },
          { opacity: 1, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.55, repeat: -1 } }
        );
      } else if (variant === "tools") {
        // Cada mando recorre su carril: la herramienta que nunca deja de ajustarse.
        gsap.to(".holo-knob", {
          x: (i) => (i % 2 === 0 ? 5 : -5),
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.3, repeat: -1, yoyo: true },
        });
      } else {
        // El plano superior se despega: la pieza que se personaliza.
        gsap.to(".holo-sheet", { yPercent: -9, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    }, el);

    return () => ctx.revert();
  }, [variant, active, chrome]);

  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      className={`relative shrink-0 inline-flex items-center justify-center w-static-2xl h-static-2xl transition-colors duration-500 ${
        active ? "text-[var(--color-brand-blue)]" : "text-[var(--color-text-muted)]"
      }`}
    >
      {chrome && (
        <>
          {/* Resplandor ambiental: estático, nunca animado */}
          <span className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--color-brand-blue)_14%,transparent)] blur-md" />

          {/* Ecos de radar */}
          {active && (
            <>
              <span className="holo-pulse absolute inset-0 rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_45%,transparent)]" />
              <span className="holo-pulse absolute inset-0 rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_45%,transparent)]" />
            </>
          )}
        </>
      )}

      <svg
        viewBox="0 0 24 24"
        className={`relative overflow-visible ${chrome ? "w-static-lg h-static-lg" : "w-static-xl h-static-xl"}`}
      >
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
