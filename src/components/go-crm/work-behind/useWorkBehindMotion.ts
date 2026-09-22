"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, SCRUB, TRIGGER } from "@/lib/motion";

// ── VALORES FUERA DE TOKEN (margen creativo declarado; idénticos a la versión aprobada) ──
const INTRO = { unread: 0.15, stagger: 0.1, end: "bottom 50%", scrub: 0.5 } as const; // light-up por palabra
const PIN_LENGTH = "+=300%"; // un tramo de pantalla por paso
const STRIP_TRAVEL = -66.667; // yPercent: la tira sube 2 de sus 3 pantallazos
const TIMELINE_LENGTH = 3;
const CROSSFADE = 0.3; // duración de cada crossfade de títulos en el timeline
const TITLE_SWAPS = [
  { out: 0, in: 1, at: 0.7 },
  { out: 1, in: 2, at: 1.7 },
] as const;

const DESKTOP = "(min-width: 1024px)";
const STACKED = "(max-width: 1023px)";
const FULL = "(prefers-reduced-motion: no-preference)";

// ── ESTADOS DE ENTRADA (Motion Tokenizer · Sección Híbrida) ──
const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
const BIRTH_TO = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };
const SUB_FROM = { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" };
const SUB_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };
const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
const CARD_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };

/**
 * @description Coreografía de "El trabajo detrás de una venta".
 * - Intro (todos los breakpoints): las palabras del titular se encienden con el scroll.
 * - Desktop (≥lg): pin de 300%; la tira de pantallazos sube, los títulos de cada paso hacen
 *   crossfade y la barra de progreso se llena (scaleX).
 * - Móvil/tablet (<lg): scroll normal; cada paso entra one-shot al llegar (titular con
 *   text-birth, subtítulo y pantallazo).
 * Con reduced-motion no corre nada: todo queda visible.
 */
export function useWorkBehindMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia(el);

    // ── INTRO: LIGHT-UP POR PALABRA ──
    mm.add(FULL, () => {
      const intro = el.querySelector<HTMLElement>(".v4-intro");
      gsap.fromTo(
        ".scrub-word",
        { opacity: INTRO.unread },
        {
          opacity: 1,
          stagger: INTRO.stagger,
          ease: EASE.none,
          scrollTrigger: { trigger: intro, start: TRIGGER.late, end: INTRO.end, scrub: INTRO.scrub },
        }
      );
    });

    // ── DESKTOP: SPLIT PINEADO CON TIRA DE PANTALLAZOS ──
    mm.add(`${DESKTOP} and ${FULL}`, () => {
      const pinned = el.querySelector<HTMLElement>(".v4-pinned");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pinned, pin: true, start: "top top", end: PIN_LENGTH, scrub: SCRUB.crisp },
      });

      tl.to(".v4-right-strip", { yPercent: STRIP_TRAVEL, ease: EASE.none, duration: TIMELINE_LENGTH }, 0);
      tl.to(".v4-stepper-progress", { scaleX: 1, ease: EASE.none, duration: TIMELINE_LENGTH }, 0);

      gsap.set(".v4-title-block-0", { opacity: 1, y: 0 });
      gsap.set([".v4-title-block-1", ".v4-title-block-2"], { opacity: 0, y: REVEAL.md });
      TITLE_SWAPS.forEach((swap) => {
        tl.to(`.v4-title-block-${swap.out}`, { opacity: 0, y: -REVEAL.md, duration: CROSSFADE }, swap.at);
        tl.to(`.v4-title-block-${swap.in}`, { opacity: 1, y: 0, duration: CROSSFADE }, swap.at + CROSSFADE);
      });
    });

    // ── MÓVIL / TABLET: ENTRADA DE CADA PASO ──
    mm.add(`${STACKED} and ${FULL}`, () => {
      gsap.utils.toArray<HTMLElement>(".ws-step").forEach((step) => {
        gsap
          .timeline({ scrollTrigger: { trigger: step, start: TRIGGER.standard, toggleActions: "play none none reverse" } })
          .fromTo(step.querySelector(".ws-title"), BIRTH_FROM, BIRTH_TO)
          .fromTo(step.querySelector(".ws-desc"), SUB_FROM, SUB_TO, "-=0.9")
          .fromTo(step.querySelector(".ws-shot"), CARD_FROM, CARD_TO, "-=0.7");
      });
    });

    return () => mm.revert();
  }, [scopeRef]);
}
