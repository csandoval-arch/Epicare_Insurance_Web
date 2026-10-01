"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

// ── PRESETS COMPARTIDOS (Motion Tokenizer · Sección Híbrida) ──
export const DESKTOP = "(min-width: 768px)";
export const MOBILE = "(max-width: 767px)";
export const FULL = "(prefers-reduced-motion: no-preference)";

const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
const BIRTH_TO = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };
export const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
export const CARD_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };
export const oneShot = (trigger: Element | null, start: string = TRIGGER.standard) => ({
  scrollTrigger: { trigger, start, toggleActions: "play none none reverse" },
});

/**
 * @description Entrada del encabezado (overline + titular con text-birth, CTA con fade-up).
 * One-shot, solo transform/opacity. El despiece monta su propia coreografía en `ConvExploded`.
 */
export function useConvHeaderMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia(el);
    mm.add(FULL, () => {
      gsap.fromTo(".conv-text-reveal", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      // CTA bajo el titular: fade-up (fuera de overflow-hidden para no recortar hover ni sombra).
      gsap.fromTo(".conv-cta", CARD_FROM, { ...CARD_TO, delay: STAGGER.wave * 2, ...oneShot(el, TRIGGER.late) });
    });
    return () => mm.revert();
  }, [scopeRef]);
}
