"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { curtainEnd } from "./curtain";

/**
 * El contenedor del telón (`FooterEpicare`), localizado en el DOM desde el contenido. No se pasa como
 * ref: React asigna las refs de los elementos del padre DESPUÉS de los efectos de los hijos, así que en
 * el efecto del contenido una ref del padre todavía es `null`.
 */
export const findStage = (el: HTMLElement) => el.closest<HTMLElement>("[data-footer-stage]");

/**
 * @description Timeline scrubbed con el telón del footer (desde que asoma hasta que queda destapado).
 * `build` recibe el timeline y el contenido; debe ser estable (función de módulo). Con movimiento
 * reducido no se crea: todo queda visible en su estado final.
 */
export function useCurtainReveal(root: RefObject<HTMLElement | null>, build: (tl: gsap.core.Timeline, el: HTMLElement) => void) {
  useLayoutEffect(() => {
    const el = root.current;
    const trigger = el && findStage(el);
    if (!el || !trigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // `refreshPriority: -1`: el footer va al final → se recalcula después que los pins de la página.
      build(
        gsap.timeline({ scrollTrigger: { trigger, start: "top bottom", end: curtainEnd, scrub: true, invalidateOnRefresh: true, refreshPriority: -1 } }),
        el
      );
    });
    return () => mm.revert();
  }, [root, build]);
}
