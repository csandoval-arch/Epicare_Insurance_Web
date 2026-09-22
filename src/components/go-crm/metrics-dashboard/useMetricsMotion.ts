"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

const DESKTOP = "(min-width: 1024px)";
const MOBILE = "(max-width: 1023px)";
const FULL = "(prefers-reduced-motion: no-preference)";

/** Velocidad de cada acto en el pin horizontal (paralaje mecánico, ease "none"). */
const SLIDE_SPEEDS = [-100, -140, -210, -310];
/** Recorrido del pin en proporción al ancho de la pista. */
const PIN_LENGTH = 0.5;

// ── ESTADOS DE ENTRADA (Motion Tokenizer · Sección Híbrida) ──
const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
const BIRTH_TO = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };
const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
const CARD_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };
const oneShot = (trigger: Element | null, start: string = TRIGGER.standard) => ({
  scrollTrigger: { trigger, start, toggleActions: "play none none reverse" },
});

/**
 * @description Movimiento de "Métricas" (sección 6).
 * - Todos: overline + titular + pista con text-birth al entrar.
 * - Desktop (≥lg): pin + scroll horizontal con paralaje por acto (diseño aprobado, intacto).
 * - Móvil (<lg): sin pin; el slider de dashboards sube como bloque al entrar. Solo transform/opacity.
 */
export function useMetricsMotion(sectionRef: RefObject<HTMLElement | null>, trackRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = sectionRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      gsap.fromTo(".md-text-reveal", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      // El CTA no va en un overflow-hidden (le recortaría hover y sombra): entra con fade-up.
      gsap.fromTo(".md-cta", CARD_FROM, { ...CARD_TO, delay: STAGGER.wave * 2, ...oneShot(el, TRIGGER.late) });
    });

    // El pin va sin condición de movimiento reducido: es navegación, no decoración.
    mm.add(DESKTOP, () => {
      const slides = gsap.utils.toArray<HTMLElement>(".md-slide", el);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, pin: true, scrub: 1, end: () => `+=${track.offsetWidth * PIN_LENGTH}`, invalidateOnRefresh: true },
      });
      slides.forEach((slide, i) => tl.to(slide, { xPercent: SLIDE_SPEEDS[i], ease: "none", force3D: true }, 0));
    });

    // Móvil: el slider entra como bloque (nunca sus slides por separado: Pilar 1 móvil).
    mm.add(`${MOBILE} and ${FULL}`, () => {
      gsap.fromTo(".md-slider", CARD_FROM, { ...CARD_TO, ...oneShot(el.querySelector(".md-slider")) });
    });

    return () => mm.revert();
  }, [sectionRef, trackRef]);
}
