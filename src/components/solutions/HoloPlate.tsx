"use client";

/**
 * @file HoloPlate.tsx
 * @description Ilustraciones "Abstract Diegetic UI" (skill `holographic-tech-visuals`) en formato
 * grande, para presidir una tarjeta. Hermanas de `HoloIcon` —silueta simétrica a stroke fino y una
 * micro-interacción física propia— pero con el doble de lienzo y más detalle dentro.
 *
 * Desviaciones de la skill, declaradas:
 *  1. El stroke es `currentColor`, no blanco fijo: el sitio es bimodal.
 *  2. Nada de `filter: drop-shadow` animado (acción 141, HARDWARE-SYMPHONY). El resplandor es
 *     estático y los bucles solo tocan `transform` y `opacity`.
 *  3. Sin ecos de radar ni resplandor ambiental. La skill los pide como ancla de sistema, pero
 *     tres juegos de ondas expandiéndose a la vez en una fila de tarjetas eran demasiado, y el
 *     halo azul detrás sobraba (13-10-2026). Queda la silueta limpia y su micro-interacción.
 *
 * Esos bucles se pausan cuando la tarjeta sale de pantalla.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type HoloPlateVariant =
  | "flow"
  | "signature"
  | "support"
  /** Las tres de la vitrina del landing (`AgencySolutionsEpicare`), 13-10-2026. */
  | "campaigns"
  | "funnels"
  | "material";

const SVG_BASE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 0.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Siluetas sobre un viewBox de 48, simétricas respecto al eje x=24. Geometría medida, nada a ojo.
 */
function Silhouette({ variant }: { variant: HoloPlateVariant }) {
  if (variant === "flow") {
    // Tres fuentes cableadas en ángulo recto a un único destino: tu agencia. El trazado es
    // dedicado, no un embudo compartido — por eso traza, no converge en cono.
    return (
      <g {...SVG_BASE}>
        <circle cx="7" cy="7" r="2.6" />
        <circle cx="24" cy="7" r="2.6" />
        <circle cx="41" cy="7" r="2.6" />
        <path d="M7 9.6v8.4h17" />
        <path d="M41 9.6v8.4H24" />
        <path d="M24 9.6V30" />
        <rect x="15" y="30" width="18" height="13" rx="2" />
        <path d="M19.5 36.5h9" />
      </g>
    );
  }
  if (variant === "campaigns") {
    // Radar de audiencia: anillos concéntricos, retícula y las tres plataformas como nodos sobre
    // el anillo exterior (equidistantes a 120°, calculados, no a ojo). La aguja los barre.
    return (
      <g {...SVG_BASE}>
        <circle cx="24" cy="24" r="19" />
        <circle cx="24" cy="24" r="12.5" />
        <circle cx="24" cy="24" r="6" />
        <path d="M24 2v4M24 42v4M2 24h4M42 24h4" />
      </g>
    );
  }
  if (variant === "funnels") {
    // Embudo simétrico sobre x=24: tres entradas arriba, un canal, una salida convertida abajo.
    return (
      <g {...SVG_BASE}>
        <path d="M12 6h24M8 13h32" />
        <path d="M6 20h36L28.5 33v9L19.5 46V33z" />
      </g>
    );
  }
  if (variant === "material") {
    // Tres piezas apiladas en planta isométrica, simétricas sobre el eje vertical.
    return (
      <g {...SVG_BASE}>
        <path className="plate-sheet" d="M24 4 44 14 24 24 4 14z" />
        <path d="M4 22 24 32l20-10" />
        <path d="M4 30 24 40l20-10" />
      </g>
    );
  }
  if (variant === "signature") {
    // Una pieza de material con tu firma encima. El escáner la recorre de arriba abajo.
    return (
      <g {...SVG_BASE}>
        <rect x="9" y="6" width="30" height="36" rx="2" />
        <path d="M15 15h18M15 21h18M15 27h12" />
        <path d="M15 35c3-4.5 6 4.5 9 0s6 4.5 9 0" />
      </g>
    );
  }
  // Soporte que no te suelta: diadema simétrica y un nodo de línea abierta debajo.
  return (
    <g {...SVG_BASE}>
      <path d="M12 27v-4a12 12 0 0 1 24 0v4" />
      <rect x="6" y="25" width="7" height="12" rx="3.5" />
      <rect x="35" y="25" width="7" height="12" rx="3.5" />
      <path d="M36 37v1.5a3.5 3.5 0 0 1-3.5 3.5H27" />
      <circle cx="24" cy="42" r="2.2" />
    </g>
  );
}

export default function HoloPlate({ variant }: { variant: HoloPlateVariant }) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const loops: gsap.core.Tween[] = [];

      // La capa tech propia de cada pieza. Lo único que se mueve.

      if (variant === "flow") {
        // Un lead baja por el canal y aterriza en el destino.
        loops.push(
          gsap.fromTo(
            ".plate-drop",
            { y: -9, opacity: 0 },
            {
              keyframes: [
                { opacity: 1, duration: 0.35 },
                { y: 11, duration: 1.6 },
                { opacity: 0, duration: 0.35 },
              ],
              ease: "sine.in",
              repeat: -1,
              repeatDelay: 0.5,
            }
          )
        );
        loops.push(
          gsap.to(".plate-target", {
            opacity: 0.22,
            duration: 2.1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
        );
      } else if (variant === "campaigns") {
        // La aguja del radar barre el círculo; cada plataforma se enciende al ser alcanzada.
        loops.push(
          gsap.to(".plate-sweep", { rotation: 360, duration: 6, ease: "none", repeat: -1, svgOrigin: "24 24" })
        );
        loops.push(
          gsap.to(".plate-sat", {
            opacity: 1,
            duration: 1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 2, repeat: -1 },
          })
        );
      } else if (variant === "funnels") {
        // Un prospecto entra por arriba y sale convertido por el canal.
        loops.push(
          gsap.fromTo(
            ".plate-lead",
            { y: -12, opacity: 0 },
            {
              keyframes: [
                { opacity: 1, duration: 0.3 },
                { y: 20, duration: 1.7 },
                { opacity: 0, duration: 0.3 },
              ],
              ease: "sine.in",
              repeat: -1,
              repeatDelay: 0.45,
            }
          )
        );
      } else if (variant === "material") {
        // La pieza de arriba se despega: es la que lleva tu nombre.
        loops.push(gsap.to(".plate-sheet", { y: -4, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 }));
      } else if (variant === "signature") {
        // El escáner recorre la pieza: así se personaliza antes de salir.
        loops.push(
          gsap.fromTo(
            ".plate-scan",
            { y: 0, opacity: 0 },
            {
              keyframes: [
                { opacity: 1, duration: 0.3 },
                { y: 30, duration: 2.2 },
                { opacity: 0, duration: 0.3 },
              ],
              ease: "sine.inOut",
              repeat: -1,
              repeatDelay: 0.3,
            }
          )
        );
      } else {
        // La línea sigue abierta: el nodo late sin parar.
        loops.push(
          gsap.to(".plate-node", {
            scale: 1.5,
            opacity: 1,
            duration: 1.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            svgOrigin: "24 42",
          })
        );
      }

      // Fuera de pantalla, nada late.
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => loops.forEach((loop) => (isActive ? loop.play() : loop.pause())),
      });
    }, el);

    return () => ctx.revert();
  }, [variant]);

  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      className="relative shrink-0 inline-flex items-center justify-center w-[calc(var(--spacing-static-2xl)*1.2)] h-[calc(var(--spacing-static-2xl)*1.2)] text-[var(--color-text-accent-blue)]"
    >
      <svg viewBox="0 0 48 48" className="relative w-full h-full overflow-visible">
        <Silhouette variant={variant} />

        {variant === "flow" && (
          <>
            <rect
              className="plate-target"
              x="15"
              y="30"
              width="18"
              height="13"
              rx="2"
              fill="currentColor"
              opacity="0.07"
            />
            <circle className="plate-drop" cx="24" cy="18" r="1.6" fill="currentColor" />
          </>
        )}
        {variant === "signature" && (
          <rect className="plate-scan" x="10" y="9" width="28" height="0.8" rx="0.4" fill="currentColor" />
        )}
        {variant === "campaigns" && (
          <>
            {/* Nodos de plataforma a 120° sobre el anillo exterior (r = 19 desde el centro). */}
            <circle className="plate-sat" cx="24" cy="5" r="1.8" fill="currentColor" opacity="0.25" />
            <circle className="plate-sat" cx="40.5" cy="33.5" r="1.8" fill="currentColor" opacity="0.25" />
            <circle className="plate-sat" cx="7.5" cy="33.5" r="1.8" fill="currentColor" opacity="0.25" />
            <line
              className="plate-sweep"
              x1="24"
              y1="24"
              x2="24"
              y2="5"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.55"
            />
          </>
        )}
        {variant === "funnels" && <circle className="plate-lead" cx="24" cy="20" r="1.7" fill="currentColor" />}
        {variant === "support" && (
          <circle className="plate-node" cx="24" cy="42" r="1.1" fill="currentColor" opacity="0.7" />
        )}
      </svg>
    </span>
  );
}
