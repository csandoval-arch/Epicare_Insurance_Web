"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, SCRUB, STAGGER, TRIGGER } from "@/lib/motion";

// ── VALORES FUERA DE TOKEN (margen creativo declarado; idénticos a la versión aprobada) ──
const PIN_LENGTH = "+=200%";
const SLICE_TRAVEL = 105; // yPercent con el que cada franja del Acto 1 sale de pantalla
const SLICE_HIDDEN = 200; // reduced motion: franjas fuera sin animar
const SLICE_OFFSET = 0.1; // desfase entre franjas en el timeline
const PULSE = { scale: 1.8, duration: 2.5, each: 1.25, ease: "sine.out" } as const;
const GLOW_ON = "drop-shadow(0 0 8px rgba(255,255,255,0.9))";
const WHITE = "rgba(255,255,255,1)";

const DESKTOP = "(min-width: 768px)";
const MOBILE = "(max-width: 767px)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const FULL = "(prefers-reduced-motion: no-preference)";

/** Progreso del pin a partir del cual el Acto 2 hace su entrada (las franjas ya casi salieron). */
const ACT2_THRESHOLD = 0.4;

// ── ESTADOS DE ENTRADA (Motion Tokenizer · Sección Híbrida) ──
// willChange solo durante el tween y se limpia al terminar; force3D para ir directo a la GPU.
const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
const BIRTH_TO = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };
const SUB_FROM = { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" };
const SUB_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };
const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
const CARD_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };

/**
 * @description Timeline de header de la Sección Híbrida: titular línea a línea (text-birth),
 * regla que se dibuja y bajada. Arranca en `TRIGGER.standard` y se revierte al volver arriba.
 */
function headerReveal(lines: string, rule: string, subtitle: string | null, trigger: HTMLElement) {
  const tl = gsap
    .timeline({ scrollTrigger: { trigger, start: TRIGGER.standard, toggleActions: "play none none reverse" } })
    .fromTo(lines, BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base })
    .fromTo(
      rule,
      { scaleX: 0, willChange: "transform" },
      { scaleX: 1, duration: DUR.slow, ease: EASE.inOut, force3D: true, clearProps: "willChange" },
      "-=0.9"
    );
  if (subtitle) tl.fromTo(subtitle, SUB_FROM, SUB_TO, "-=0.8");
  return tl;
}

/**
 * @description Vida latente de las ilustraciones de las tarjetas de desktop, pausada fuera de
 * pantalla. (En móvil son keyframes CSS en `MobileContactVsOpp`.)
 * @param pin el ScrollTrigger del pin. El rango de "en pantalla" se calcula a partir de él: un
 *   trigger sobre la sección pineada con `end: "bottom top"` ignora la duración del pin, y
 *   pausaba los loops justo cuando aparecía el Acto 2.
 */
function startArtLoops(el: HTMLElement, pin: ScrollTrigger) {
  const q = (selector: string) => el.querySelectorAll(`.a2-card ${selector}`);
  const pulse = (selector: string) =>
    gsap.to(q(selector), {
      scale: PULSE.scale,
      opacity: 0,
      duration: PULSE.duration,
      ease: PULSE.ease,
      stagger: { each: PULSE.each, repeat: -1 },
    });
  const breathe = { ease: EASE.breath, yoyo: true, repeat: -1 };

  const loops: gsap.core.Animation[] = [
    // Dental: diente + anillos + nodo
    pulse(".art-pulse-circle"),
    gsap.to(q(".art-tooth"), { filter: GLOW_ON, stroke: WHITE, duration: 1.5, ...breathe }),
    gsap.to(q(".art-node"), { scale: 1.6, opacity: 0.3, duration: 1.5, ...breathe }),
    // Health: escudo + cruz que late
    pulse(".art-pulse-health"),
    gsap.to(q(".art-health-silhouette"), { filter: GLOW_ON, stroke: WHITE, duration: 1.5, ...breathe }),
    gsap.fromTo(
      q(".art-health-core"),
      { scale: 0.95, opacity: 0.6, filter: "drop-shadow(0 0 2px rgba(255,255,255,0.3))" },
      { scale: 1.05, opacity: 1, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.9))", duration: 3.5, svgOrigin: "12 12", ...breathe }
    ),
    // Vida: planta que crece + semilla
    pulse(".art-pulse-life"),
    gsap.fromTo(
      q(".art-plant"),
      { scaleY: 0.9, opacity: 0.7, filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))" },
      { scaleY: 1.05, opacity: 1, filter: "drop-shadow(0 0 10px rgba(255,255,255,1))", stroke: WHITE, duration: 2.5, svgOrigin: "12 22", ...breathe }
    ),
    gsap.fromTo(
      q(".art-spore-root"),
      { scale: 0.8, opacity: 0.6, filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))" },
      { scale: 1.3, opacity: 1, filter: "drop-shadow(0 0 12px rgba(255,255,255,1))", duration: 2, ...breathe }
    ),
  ];

  loops.forEach((loop) => loop.pause());
  ScrollTrigger.create({
    // Desde que la sección asoma por abajo hasta que sale por arriba, pin incluido.
    start: () => pin.start - window.innerHeight,
    end: () => pin.end + el.offsetHeight,
    onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.play() : loop.pause())),
  });
}

/**
 * @description Coreografía de ContactVsOpportunity (Motion Tokenizer).
 * - Desktop (≥md): entrada del Acto 1 al llegar (text-birth + regla + fichas en ola) → pin de 200%
 *   que rasga la escena en 3 franjas → al pasar `ACT2_THRESHOLD`, entrada one-shot del Acto 2
 *   (overline, titular, tarjetas en ola y sus textos), que se revierte al volver.
 * - Móvil (<md): sin pin; la transición entre actos es scroll nativo + CSS (`MobileContactVsOpp`).
 *   Aquí solo van las entradas one-shot de los textos de cada acto; GSAP actúa en el instante del
 *   disparo, no en cada frame.
 */
export function useContactVsOppMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia(el);

    // ── DESKTOP · REDUCED MOTION: Acto 2 visible, sin pin ──
    mm.add(`${DESKTOP} and ${REDUCED}`, () => {
      gsap.set([".slice-left", ".slice-center", ".slice-right"], { yPercent: SLICE_HIDDEN });
    });

    // ── DESKTOP · FULL MOTION ──
    mm.add(`${DESKTOP} and ${FULL}`, () => {
      // Entrada del Acto 1, antes del pin (Sección Híbrida: header → contenido)
      headerReveal(".a1-birth", ".a1-rule", null, el)
        .fromTo(".a1-cta", SUB_FROM, SUB_TO, "-=0.8")
        .fromTo(".a1-card", CARD_FROM, { ...CARD_TO, stagger: STAGGER.wave }, "-=0.7");

      // El pin solo mueve las franjas; el Acto 2 tiene su propia entrada one-shot
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          pin: true,
          start: "top top",
          end: PIN_LENGTH,
          scrub: SCRUB.crisp,
          onUpdate: (self) => (self.progress > ACT2_THRESHOLD ? act2.play() : act2.reverse()),
        },
      });
      tl.to(".slice-left", { yPercent: SLICE_TRAVEL, ease: EASE.inOut, duration: DUR.base }, 0);
      tl.to(".slice-center", { yPercent: -SLICE_TRAVEL, ease: EASE.inOut, duration: DUR.base }, SLICE_OFFSET);
      tl.to(".slice-right", { yPercent: SLICE_TRAVEL, ease: EASE.inOut, duration: DUR.base }, SLICE_OFFSET * 2);

      const act2 = gsap
        .timeline({ paused: true })
        .fromTo(".a2-rise", SUB_FROM, SUB_TO)
        .fromTo(".a2-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base }, "-=0.35")
        .fromTo(".a2-card", CARD_FROM, { ...CARD_TO, stagger: STAGGER.wave }, "-=0.9")
        .fromTo(".a2-card .opp-text", SUB_FROM, { ...SUB_TO, stagger: STAGGER.base }, "-=0.6");

      if (tl.scrollTrigger) startArtLoops(el, tl.scrollTrigger);
    });

    // ── MÓVIL · FULL MOTION: entradas one-shot, sin pin (la transición es CSS/scroll nativo) ──
    mm.add(`${MOBILE} and ${FULL}`, () => {
      // Acto 1: titular + regla + bajada, y después la ficha
      headerReveal(".m-title-line", ".m-rule", ".m-body", el)
        .fromTo(".m-cta", SUB_FROM, SUB_TO, "-=0.7")
        .fromTo(".m-profile", CARD_FROM, CARD_TO, "-=0.6");

      // Acto 2: overline + titular, y el slider como bloque (nunca sus tarjetas: Pilar 1 móvil)
      const sheet = el.querySelector<HTMLElement>(".m-sheet");
      gsap
        .timeline({ scrollTrigger: { trigger: sheet, start: TRIGGER.standard, toggleActions: "play none none reverse" } })
        .fromTo(".m2-overline", SUB_FROM, SUB_TO)
        .fromTo(".m2-title-line", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base }, "-=0.35")
        .fromTo(".m2-slider", CARD_FROM, CARD_TO, "-=0.8");
    });

    return () => mm.revert();
  }, [scopeRef]);
}
