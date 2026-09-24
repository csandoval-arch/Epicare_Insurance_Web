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

/**
 * Relevo entre dashboards (desktop): mientras el siguiente le pasa por encima, el anterior se apaga
 * con un velo del color del fondo (`.md-veil`) hasta `VEIL_MAX`; el dashboard sigue opaco. La ventana
 * va de cuando el borde izquierdo del entrante cruza `DIM_START` a cuando cruza `DIM_END` (fracciones
 * del viewport). Margen creativo declarado: opacidad de relevo sin token en el DS.
 */
const VEIL_MAX = 0.75;
const DIM_START = 0.9;
const DIM_END = 0.4;

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
 * - Todos: overline + titular + CTA con text-birth / fade-up al entrar.
 * - Desktop (≥lg): pin + scroll horizontal con paralaje por acto: los dashboards se enciman como un
 *   mazo y el anterior se apaga (velo) mientras el siguiente le pasa por encima. Hardware Symphony:
 *   cada acto en su capa durante el pin (sin re-raster), `scrub: true` (Lenis ya suaviza) y el velo
 *   escrito como `opacity` con `quickSetter` desde las posiciones medidas en cada refresh.
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
      // Relevo: el dashboard i se opaca con la entrada del i+1 (el titular queda fuera).
      const pairs = slides.slice(1, -1).map((slide, i) => ({
        index: i + 2, // acto entrante
        setOpacity: gsap.quickSetter(slide.querySelector(".md-veil"), "opacity"),
      }));
      // Geometría medida en cada refresh: borde izquierdo en reposo y desplazamiento total de cada acto.
      let geo: { left: number; shift: number }[] = [];
      const measure = () => {
        geo = slides.map((s, i) => ({ left: s.offsetLeft, shift: (SLIDE_SPEEDS[i] / 100) * s.offsetWidth }));
      };
      const relay = (progress: number) => {
        const vw = window.innerWidth;
        pairs.forEach(({ index, setOpacity }) => {
          const { left, shift } = geo[index];
          const t = gsap.utils.clamp(0, 1, (DIM_START * vw - (left + shift * progress)) / ((DIM_START - DIM_END) * vw));
          setOpacity(t * VEIL_MAX);
        });
      };

      // Cada acto en su capa mientras dure el pin: moverlos no re-rasteriza (se revierte con mm).
      gsap.set(slides, { willChange: "transform" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          pin: true,
          scrub: true,
          end: () => `+=${track.offsetWidth * PIN_LENGTH}`,
          invalidateOnRefresh: true,
          onRefresh: (self) => { measure(); relay(self.progress); },
          onUpdate: (self) => relay(self.progress),
        },
      });
      slides.forEach((slide, i) => tl.to(slide, { xPercent: SLIDE_SPEEDS[i], ease: EASE.none, force3D: true }, 0));
      return () => pairs.forEach(({ setOpacity }) => setOpacity(0));
    });

    // Móvil: el slider entra como bloque (nunca sus slides por separado: Pilar 1 móvil).
    mm.add(`${MOBILE} and ${FULL}`, () => {
      gsap.fromTo(".md-slider", CARD_FROM, { ...CARD_TO, ...oneShot(el.querySelector(".md-slider")) });
    });

    return () => mm.revert();
  }, [sectionRef, trackRef]);
}
