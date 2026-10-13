"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

const FULL = "(prefers-reduced-motion: no-preference)";
/** Si el loader nunca avisa (navegación SPA sin loader), la entrada del hero arranca igual. */
const LOADER_FALLBACK_MS = 4000;
type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

/**
 * @description Entradas de /join-us, por bloque (`[data-act]`). Clases que anima:
 * - `.jb-birth` — Text-Birth (el padre lleva `overflow-hidden`).
 * - `.jb-rise`  — sube y aparece (párrafos, CTA, filas).
 * - `.jb-curtain` > `.jb-curtain-in` — cortina por transforms (contenedor desde abajo, interior inverso).
 * - `.jb-count[data-value]` — cuenta hasta su valor (el HTML ya trae el valor final: sin motion queda así).
 * El bloque `data-act="hero"` entra tras el loader; el resto, una vez al llegar con el scroll.
 * Solo transform/opacity. Con reduced-motion todo queda estático y visible.
 */
export function useJoinMotion(scopeRef: RefObject<HTMLElement | null>, role?: string) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    let hero: gsap.core.Timeline | undefined;

    mm.add(FULL, () => {
      gsap.utils.toArray<HTMLElement>("[data-act]", el).forEach((act) => {
        const isHero = act.dataset.act === "hero";
        const q = gsap.utils.selector(act);
        const tl = gsap.timeline({
          paused: isHero,
          scrollTrigger: isHero ? undefined : { trigger: act, start: TRIGGER.standard, toggleActions: "play none none none" },
        });
        if (q(".jb-birth").length)
          tl.fromTo(q(".jb-birth"), { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base, force3D: true }, 0);
        if (q(".jb-curtain").length)
          tl.fromTo(q(".jb-curtain"), { yPercent: 100 }, { yPercent: 0, duration: DUR.slow, ease: EASE.inOut, force3D: true }, 0.1)
            .fromTo(q(".jb-curtain-in"), { yPercent: -100, scale: 1.08 }, { yPercent: 0, scale: 1, duration: DUR.slow, ease: EASE.inOut, force3D: true }, 0.1);
        if (q(".jb-rise").length)
          tl.fromTo(q(".jb-rise"), { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base, force3D: true }, 0.4);
        q(".jb-count").forEach((node) => {
          const to = Number(node.dataset.value);
          const n = { v: 0 };
          node.textContent = "0";
          tl.fromTo(n, { v: 0 }, { v: to, duration: DUR.count, ease: EASE.out, onUpdate: () => void (node.textContent = String(Math.round(n.v))) }, 0.3);
        });
        if (isHero) hero = tl;
      });
      // Al revertir (cambio de preferencia, desmontaje) las cifras vuelven a su valor final.
      return () => gsap.utils.toArray<HTMLElement>(".jb-count", el).forEach((node) => void (node.textContent = node.dataset.value ?? ""));
    });

    const play = () => hero?.play();
    if ((window as LoaderWindow).epicareLoaderFinished) play();
    else window.addEventListener("epicareLoaderFinished", play, { once: true });
    const fallbackId = setTimeout(play, LOADER_FALLBACK_MS);

    return () => {
      window.removeEventListener("epicareLoaderFinished", play);
      clearTimeout(fallbackId);
      mm.revert();
    };
  }, [scopeRef, role]);
}
