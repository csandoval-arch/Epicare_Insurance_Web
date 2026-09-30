"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * @description Entrada de la historia de /company (one-shot, todas las anchuras):
 * titular (text-birth) al llegar a la sección · la retícula con su propio disparo, en cuanto asoma:
 * barrido de izquierda a derecha (clip-path, rápido) y el contenido de las celdas casi a la vez.
 * Limpia clip-path/transform al terminar (una capa compuesta se "come" el hairline de 1px).
 * Con reduced-motion no se registra nada.
 */
export function useHistoryMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Titular (text-birth) con su propio disparo
      gsap.fromTo(
        ".hs-title-line",
        { yPercent: REVEAL.birthPercent },
        { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, clearProps: "transform", scrollTrigger: { trigger: el, start: TRIGGER.late } }
      );

      // Retícula: se dispara al asomar ella misma (no espera al titular); barrido rápido y el contenido
      // de las celdas entra casi a la vez
      gsap
        .timeline({ scrollTrigger: { trigger: ".hs-grid", start: TRIGGER.early } })
        .fromTo(
          ".hs-grid",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.base, ease: EASE.out, clearProps: "clipPath" }
        )
        .fromTo(
          ".hs-cell > :not(.hs-line)",
          { opacity: 0, y: REVEAL.sm },
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.tight, clearProps: "transform" },
          0.1
        );
    });

    return () => mm.revert();
  }, [scopeRef]);
}
