"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * @description Entrada de la historia de /company (one-shot, todas las anchuras):
 * titular (text-birth) → la retícula se descubre de izquierda a derecha (clip-path) → el contenido
 * de cada celda sube en cascada. Limpia clip-path/transform al terminar (una capa compuesta se
 * "come" el hairline de 1px). Con reduced-motion no se registra nada.
 */
export function useHistoryMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: TRIGGER.late } })
        .fromTo(
          ".hs-title-line",
          { yPercent: REVEAL.birthPercent },
          { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, clearProps: "transform" }
        )
        .fromTo(
          ".hs-grid",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.slow, ease: EASE.inOut, clearProps: "clipPath" },
          "-=0.9"
        )
        .fromTo(
          ".hs-cell > :not(.hs-line)",
          { opacity: 0, y: REVEAL.md },
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base, clearProps: "transform" },
          "-=0.6"
        );
    });

    return () => mm.revert();
  }, [scopeRef]);
}
