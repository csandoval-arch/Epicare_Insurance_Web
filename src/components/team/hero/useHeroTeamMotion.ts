"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";

const FULL = "(prefers-reduced-motion: no-preference)";
/** Si el loader nunca avisa (navegación SPA sin loader), la entrada arranca igual. */
const LOADER_FALLBACK_MS = 4000;
type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

/**
 * @description Entrada del hero de /team (tras el loader): eyebrow + titular con Text-Birth, después el
 * subtítulo y el CTA. El carrusel de la parte inferior trae su propia entrada (`CaseCoverflow`).
 * Solo transform/opacity. Con reduced-motion todo queda estático y visible.
 */
export function useHeroTeamMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    let intro: gsap.core.Timeline | undefined;

    mm.add(FULL, () => {
      intro = gsap
        .timeline({ paused: true, defaults: { force3D: true } })
        .fromTo(".ht-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base }, 0.3)
        .fromTo(".ht-sub", { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out }, 0.8)
        .fromTo(".ht-cta", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.fast, ease: EASE.snap }, 1.1);
    });

    const play = () => intro?.play();
    if ((window as LoaderWindow).epicareLoaderFinished) play();
    else window.addEventListener("epicareLoaderFinished", play, { once: true });
    const fallbackId = setTimeout(play, LOADER_FALLBACK_MS);

    return () => {
      window.removeEventListener("epicareLoaderFinished", play);
      clearTimeout(fallbackId);
      mm.revert();
    };
  }, [scopeRef]);
}
