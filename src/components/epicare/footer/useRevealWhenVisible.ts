"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { findStage } from "./useCurtainReveal";

/**
 * @description Entrada one-shot de un bloque del footer, disparada cuando el bloque es VISIBLE de verdad:
 * dentro de la pantalla y por debajo del borde del telón (mientras se destapa, el footer va `fixed` y el
 * `clip-path` del contenedor lo tapa aunque esté "en pantalla": un IntersectionObserver no sirve).
 * Se mide en vivo en cada scroll y se rearma solo cuando el bloque vuelve a quedar oculto por debajo.
 * `build` recibe un timeline pausado y el bloque; debe ser estable (función de módulo).
 * Con movimiento reducido no se anima (todo queda en su estado final).
 */
export function useRevealWhenVisible(
  boxRef: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline, box: HTMLElement) => void,
  threshold = 0.35
) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    const stage = box && findStage(box);
    if (!box || !stage) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(box);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ paused: true });
      build(tl, box);
      const check = () => {
        const r = box.getBoundingClientRect();
        const top = Math.max(r.top, stage.getBoundingClientRect().top, 0);
        const bottom = Math.min(r.bottom, window.innerHeight);
        const visible = Math.max(0, bottom - top) / r.height;
        if (visible >= threshold) tl.play();
        else if (visible === 0 && r.top > 0) tl.pause(0);
      };
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "bottom top",
        refreshPriority: -1,
        onUpdate: check,
        onRefresh: check,
        onLeaveBack: () => tl.pause(0),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [boxRef, build, threshold]);
}

/**
 * Nacimiento de las letras del logo (`data-logo-letter`) desde abajo: `y` en unidades del viewBox
 * (270 ≥ su alto), así cada letra sale de detrás del borde inferior del propio SVG (que recorta).
 */
export function logoBirth(tl: gsap.core.Timeline, box: HTMLElement, at = 0) {
  tl.fromTo(
    box.querySelectorAll("[data-logo-letter]"),
    { y: 270 },
    { y: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base },
    at
  );
}
