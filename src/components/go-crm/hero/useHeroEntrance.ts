"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { DUR, EASE, STAGGER, REVEAL } from "@/lib/motion";

// ── VALORES FUERA DE TOKEN (margen creativo declarado, pendientes de decisión) ──
/** Duración del text-birth del H1: entre DUR.base (0.9) y DUR.fast (0.5). */
const TITLE_BIRTH_DUR = 0.85;
const CTA_START_SCALE = 0.9;
const SHOWCASE_START_SCALE = 0.98;
/** Si el loader nunca avisa (p. ej. navegación SPA sin loader), la entrada arranca igual. */
const LOADER_FALLBACK_MS = 4000;

const TARGETS =
  ".crm-hero-eyebrow, .crm-hero-title-line, .crm-hero-subtitle, .crm-hero-cta, .crm-hero-showcase";

type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

/**
 * @description Coreografía de entrada del Hero de GO CRM. Arranca cuando el loader global
 * emite `epicareLoaderFinished` (o tras un fallback). Con reduced-motion deja todo visible.
 * @param scopeRef contenedor del Hero; los selectores `.crm-hero-*` se resuelven dentro.
 */
export function useHeroEntrance(scopeRef: RefObject<HTMLElement | null>) {
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
      gsap.set(".crm-hero-eyebrow", { opacity: 0, y: REVEAL.sm });
      gsap.set(".crm-hero-title-line", { yPercent: REVEAL.birthPercent, opacity: 0 });
      gsap.set(".crm-hero-subtitle", { opacity: 0, y: REVEAL.md });
      gsap.set(".crm-hero-cta", { opacity: 0, scale: CTA_START_SCALE, y: REVEAL.sm });
      gsap.set(".crm-hero-showcase", { opacity: 0, y: REVEAL.md, scale: SHOWCASE_START_SCALE });

      // ── SECUENCIA ──
      tl = gsap
        .timeline({ paused: true })
        .to(".crm-hero-eyebrow", { opacity: 1, y: 0, duration: DUR.fast, ease: EASE.out })
        .to(
          ".crm-hero-title-line",
          { yPercent: 0, opacity: 1, duration: TITLE_BIRTH_DUR, ease: EASE.dramatic, stagger: STAGGER.base, force3D: true },
          "-=0.2"
        )
        .to(".crm-hero-subtitle", { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out }, "-=0.4")
        .to(".crm-hero-cta", { opacity: 1, scale: 1, y: 0, duration: DUR.base, ease: EASE.snap }, "-=0.3")
        .to(
          ".crm-hero-showcase",
          { opacity: 1, y: 0, scale: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true },
          "-=0.5"
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
