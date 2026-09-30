"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * @description Entradas de la promesa de /company (one-shot, todas las anchuras):
 * - Text-birth: cada texto dentro de una máscara (`.pr-birth` → `.pr-birth-in`) nace desde abajo.
 * - Layered unveiling: los bloques de resultado + texto (`.pr-unveil`) suben con desaceleración.
 * El loop de la cruz es CSS (se detiene con reduced-motion). Con reduced-motion no se registra nada.
 */
export function usePromiseMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".pr-birth", el).forEach((mask) => {
        gsap.fromTo(
          mask.querySelector(".pr-birth-in"),
          { yPercent: REVEAL.birthPercent },
          { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, scrollTrigger: { trigger: mask, start: TRIGGER.standard } }
        );
      });

      gsap.utils.toArray<HTMLElement>(".pr-unveil", el).forEach((block) => {
        gsap.fromTo(
          block,
          { y: REVEAL.lg, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.cinematic, ease: EASE.dramatic, scrollTrigger: { trigger: block, start: TRIGGER.standard } }
        );
      });
    });

    return () => mm.revert();
  }, [scopeRef]);
}
