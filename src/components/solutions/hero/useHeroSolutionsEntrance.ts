"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { DUR, EASE, STAGGER, REVEAL } from "@/lib/motion";

const TITLE_BIRTH_DUR = 0.85;
const CTA_START_SCALE = 0.92;
/** La banda entra asentándose: la foto arranca ampliada y vuelve a su tamaño. */
const BAND_START_ZOOM = 1.08;
const LOADER_FALLBACK_MS = 2500;

const TARGETS =
  ".sol-hero-eyebrow, .sol-hero-title-line, .sol-hero-subhead, .sol-hero-cta, .sol-hero-panel, .sol-hero-zoom";

type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

/**
 * @description Coreografía de entrada del Hero de Solutions & Marketing.
 * Sincronizado con la finalización del Loader global (o fallback si se navega vía SPA).
 * Hardware Symphony: animación en GPU exclusiva sobre `transform` y `opacity`.
 */
export function useHeroSolutionsEntrance(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tl: gsap.core.Timeline | undefined;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(TARGETS, { opacity: 1, y: 0, yPercent: 0, scale: 1, filter: "none" });
        return;
      }

      // ── ESTADO INICIAL ──
      gsap.set(".sol-hero-eyebrow", { opacity: 0, y: REVEAL.sm });
      gsap.set(".sol-hero-title-line", { yPercent: REVEAL.birthPercent, opacity: 0 });
      gsap.set(".sol-hero-subhead", { opacity: 0, y: REVEAL.md });
      gsap.set(".sol-hero-cta", { opacity: 0, scale: CTA_START_SCALE, y: REVEAL.sm });
      // La banda va a sangre: un `scale` sobre ella dejaría ver el fondo por los bordes.
      // Se atenúa el contenedor y el zoom vive en la imagen, dentro del `overflow-hidden`.
      gsap.set(".sol-hero-panel", { opacity: 0 });
      gsap.set(".sol-hero-zoom", { scale: BAND_START_ZOOM, transformOrigin: "center center" });

      // ── SECUENCIA MAESTRA ──
      tl = gsap
        .timeline({ paused: true })
        .to(".sol-hero-eyebrow", {
          opacity: 1,
          y: 0,
          duration: DUR.fast,
          ease: EASE.out,
        })
        .to(
          ".sol-hero-title-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: TITLE_BIRTH_DUR,
            ease: EASE.dramatic,
            stagger: STAGGER.base,
            force3D: true,
          },
          "-=0.2"
        )
        .to(
          ".sol-hero-subhead",
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
          },
          "-=0.4"
        )
        .to(
          ".sol-hero-panel",
          { opacity: 1, duration: DUR.slow, ease: EASE.out },
          "-=0.5"
        )
        .to(
          ".sol-hero-zoom",
          { scale: 1, duration: DUR.cinematic, ease: EASE.out, force3D: true },
          "<"
        )
        .to(
          ".sol-hero-cta",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.snap,
            stagger: STAGGER.tight,
          },
          "-=0.4"
        );
    }, el);

    let frame = 0;
    const play = () => {
      frame = requestAnimationFrame(() => {
        if (tl?.paused()) tl.play();
      });
    };

    if ((window as LoaderWindow).epicareLoaderFinished) {
      play();
    } else {
      window.addEventListener("epicareLoaderFinished", play, { once: true });
    }
    const fallbackId = setTimeout(play, LOADER_FALLBACK_MS);

    return () => {
      window.removeEventListener("epicareLoaderFinished", play);
      clearTimeout(fallbackId);
      cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, [scopeRef]);
}
