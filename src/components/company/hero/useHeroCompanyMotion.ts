"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, SCRUB, STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
/** Desplazamiento inicial de la cortina (%): la imagen asoma en el 40% inferior del hero. */
export const MASK_OFFSET = 60;
/** Escala de partida de la imagen (reveal cinematográfico) y de salida del bloque de copy. */
const IMAGE_START_SCALE = 1.15;
const COPY_EXIT_SCALE = 0.96;
/** Recorrido del pin en desktop. */
const PIN_LENGTH = "+=150%";
/** Si el loader nunca avisa (navegación SPA sin loader), la entrada arranca igual. */
const LOADER_FALLBACK_MS = 4000;

type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

/**
 * @description Motion del hero de /company.
 * 1 · Entrada de carga (todas las anchuras, tras `epicareLoaderFinished`): la imagen se asienta, el
 *     titular nace de su máscara (text-birth) y los bloques de copy suben.
 * 2 · Scroll (solo desktop ≥lg, pin): la cortina sube hasta cubrir el hero (el texto pasa a blanco a su paso) y el copy
 *     se retira. La cortina es transform puro — el contenedor sube (`yPercent` 60 → 0) y su contenido
 *     hace el movimiento inverso — en lugar de animar `clip-path`, que repintaba la capa a pantalla
 *     completa (con la imagen filtrada) en cada frame.
 * Móvil / tablet: la cortina NO usa GSAP — es una animación CSS scroll-driven (`.hc-stage` en
 *     globals.css) que corre en el compositor; con ScrollTrigger llegaba un frame tarde y "brincaba".
 * Con reduced-motion no se registra nada.
 */
export function useHeroCompanyMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    let intro: gsap.core.Timeline | undefined;
    const mm = gsap.matchMedia(el);

    // ── 1 · ENTRADA (todas las anchuras) ──
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      intro = gsap
        .timeline({ paused: true })
        .fromTo(
          ".hc-image",
          { scale: IMAGE_START_SCALE, opacity: 0, willChange: "transform, opacity" },
          { scale: 1, opacity: 1, duration: DUR.cinematic, ease: EASE.out, force3D: true, clearProps: "willChange" },
          0
        )
        .fromTo(
          ".hc-title-line",
          { yPercent: REVEAL.birthPercent, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base, force3D: true },
          0.2
        )
        .fromTo(
          ".hc-copy",
          { y: REVEAL.md, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.birth, ease: EASE.dramatic, force3D: true },
          0.6
        );
    });

    // ── 2 · SCROLL (solo desktop, pin) ──
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // La posición inicial viene del inline style (SSR); GSAP la toma como yPercent limpio.
      gsap.set([".hc-mask", ".hc-mask-inner"], { clearProps: "transform" });
      gsap
        .timeline({
          defaults: { ease: EASE.none, force3D: true },
          scrollTrigger: { trigger: el, start: "top top", end: PIN_LENGTH, pin: true, scrub: SCRUB.crisp, invalidateOnRefresh: true },
        })
        .fromTo(".hc-mask", { yPercent: MASK_OFFSET }, { yPercent: 0, duration: 2 }, 0)
        .fromTo(".hc-mask-inner", { yPercent: -MASK_OFFSET }, { yPercent: 0, duration: 2 }, 0)
        .fromTo(
          ".hc-copy-exit > *",
          { y: 0, opacity: 1, scale: 1 },
          { y: -REVEAL.lg, opacity: 0, scale: COPY_EXIT_SCALE, stagger: STAGGER.wave, duration: 1.5, immediateRender: false },
          0
        );
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
