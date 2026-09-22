"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

/** Escala inicial de la consola de vídeo (margen creativo declarado). */
const CONSOLE_START_SCALE = 0.95;

const DESKTOP = "(min-width: 768px)";
const MOBILE = "(max-width: 767px)";
const FULL = "(prefers-reduced-motion: no-preference)";

// ── ESTADOS DE ENTRADA (Motion Tokenizer · Sección Híbrida) ──
const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
const BIRTH_TO = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };
const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
const CARD_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };
const oneShot = (trigger: Element | null, start: string = TRIGGER.standard) => ({
  scrollTrigger: { trigger, start, toggleActions: "play none none reverse" },
});

/**
 * @description Entradas de "Conversaciones" (Motion Tokenizer). Todas one-shot, solo
 * transform/opacity: GSAP actúa al disparar, no en cada frame. La consola ya no entra con
 * `filter: blur()` (prohibido por Hardware Symphony). Los loops de las ilustraciones NO van aquí:
 * son keyframes CSS en `ConversationsGoCrm`.
 * - Todos: overline + titular con text-birth, consola que sube.
 * - Desktop (≥md): tarjetas flotantes entran desde su lado (izquierda / derecha / abajo).
 * - Móvil (<md): el slider de tarjetas entra como bloque (nunca sus hijos: Pilar 1 móvil).
 */
export function useConversationsMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia(el);
    const q = (s: string) => el.querySelector(s);

    mm.add(FULL, () => {
      gsap.fromTo(".conv-text-reveal", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      // CTA bajo el titular: fade-up (fuera de overflow-hidden para no recortar hover ni sombra).
      gsap.fromTo(".conv-cta", CARD_FROM, { ...CARD_TO, delay: STAGGER.wave * 2, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(
        ".conv-console",
        { ...CARD_FROM, scale: CONSOLE_START_SCALE },
        { ...CARD_TO, scale: 1, duration: DUR.slow, ease: EASE.dramatic, ...oneShot(q(".conv-console")) }
      );
    });

    mm.add(`${DESKTOP} and ${FULL}`, () => {
      const side = (s: string, xPercent: number) =>
        gsap.fromTo(
          s,
          { xPercent, opacity: 0, willChange: "transform, opacity" },
          { xPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.out, force3D: true, clearProps: "willChange", ...oneShot(q(s), TRIGGER.early) }
        );
      side(".card-left", -100);
      side(".card-right", 100);
      gsap.fromTo(".card-bottom", CARD_FROM, { ...CARD_TO, duration: DUR.slow, ...oneShot(q(".card-bottom"), TRIGGER.early) });
    });

    mm.add(`${MOBILE} and ${FULL}`, () => {
      gsap.fromTo(".conv-slider", CARD_FROM, { ...CARD_TO, ...oneShot(q(".conv-slider")) });
    });

    return () => mm.revert();
  }, [scopeRef]);
}
