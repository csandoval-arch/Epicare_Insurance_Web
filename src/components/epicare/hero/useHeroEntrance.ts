"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";

// ── VALORES FUERA DE TOKEN (margen creativo declarado; idénticos a la versión aprobada) ──
/** Distancia (px) con la que cada ventana de vídeo entra desde su lado. */
const VIDEO_SLIDE = 100;
const CTA_START_SCALE = 0.9;
/** Si el loader nunca avisa (p. ej. navegación SPA sin loader), la entrada arranca igual. */
const LOADER_FALLBACK_MS = 4000;

const TARGETS = ".hero-title-line, .hero-subtitle, .hero-proof, .hero-visual-left, .hero-visual-right, .hero-video-counter, .hero-cta";

type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

/**
 * @description Entrada del hero editorial de la landing (Motion Tokenizer · archetype 1):
 * titular (text-birth) → subtítulo línea a línea → bloque de prueba → ventanas de vídeo desde sus
 * lados (el plano de dentro hace el movimiento inverso y queda quieto) → CTAs. Arranca cuando el
 * loader global emite `epicareLoaderFinished`. Con reduced-motion deja todo visible.
 */
export function useHeroEntrance(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tl: gsap.core.Timeline | undefined;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(TARGETS, { opacity: 1, x: 0, y: 0, yPercent: 0, scale: 1 });
        return;
      }

      const slideIn = (from: number) => [
        { opacity: 0, x: from, willChange: "transform, opacity" },
        { opacity: 1, x: 0, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" },
      ] as const;
      const counter = (from: number) => [
        { x: -from },
        { x: 0, duration: DUR.slow, ease: EASE.dramatic, force3D: true },
      ] as const;

      tl = gsap
        .timeline({ paused: true })
        // 1 · Titular
        .fromTo(
          ".hero-title-line",
          { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" },
          { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" }
        )
        // 2 · Subtítulo grande, línea a línea
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.tight, clearProps: "willChange" },
          "-=0.5"
        )
        // 3 · Bloque de prueba (avatares + copy)
        .fromTo(
          ".hero-proof",
          { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, clearProps: "willChange" },
          "-=0.4"
        )
        // 4 · Ventanas de vídeo: la izquierda desde la izquierda, la derecha desde la derecha
        .fromTo(".hero-visual-left", ...slideIn(-VIDEO_SLIDE), "-=0.4")
        .fromTo(".hero-visual-left .hero-video-counter", ...counter(-VIDEO_SLIDE), "<")
        .fromTo(".hero-visual-right", ...slideIn(VIDEO_SLIDE), "<")
        .fromTo(".hero-visual-right .hero-video-counter", ...counter(VIDEO_SLIDE), "<")
        // 5 · CTAs, durante el final de las ventanas
        .fromTo(
          ".hero-cta",
          { opacity: 0, scale: CTA_START_SCALE, willChange: "transform, opacity" },
          { opacity: 1, scale: 1, duration: DUR.base, ease: EASE.snap, stagger: STAGGER.wave, clearProps: "willChange" },
          "-=0.5"
        );
    }, el);

    const play = () => tl?.play();
    if ((window as LoaderWindow).epicareLoaderFinished) play();
    else window.addEventListener("epicareLoaderFinished", play, { once: true });
    const fallbackId = setTimeout(play, LOADER_FALLBACK_MS);

    return () => {
      window.removeEventListener("epicareLoaderFinished", play);
      clearTimeout(fallbackId);
      ctx.revert();
    };
  }, [scopeRef]);
}
