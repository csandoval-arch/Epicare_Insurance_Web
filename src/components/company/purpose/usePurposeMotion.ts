"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, SCRUB, STAGGER, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
/** El mapa entra grande y se asienta (opacidad plena; en dark su contenedor lo deja al 80%). */
const MAP_START_SCALE = 1.25;
/** El panel de misión se aleja al dar paso a la visión. */
const PANEL_EXIT_SCALE = 0.9;
/** Móvil: las palabras del titular nacen del desenfoque casi en su sitio (poco recorrido vertical). */
const WORD_RISE_MOBILE = 8;
/** Recorrido del pin en desktop: entrada misión → pausa → visión → pausa. */
const PIN_LENGTH = "+=400%";

/**
 * @description Motion de Misión / Visión en /company.
 * - Desktop (≥lg): el mapa se asienta al asomar y la sección se pinea con scrub. Sobre el mapa sube
 *   el panel de misión (sus palabras aparecen una a una, después la bajada); luego se aleja y sube el
 *   de visión con el mismo patrón.
 * - Móvil / tablet (sin mapa, paneles apilados): cada panel entra una vez al llegar — palabras del
 *   titular en cascada desde el desenfoque (blur one-shot, se limpia al terminar; sin bajada); el
 *   vídeo del mapa va estático (sin entrada).
 * Transform/opacity; el único blur es el one-shot de los titulares en móvil (pedido por el usuario). Con reduced-motion no se registra nada y
 * el layout de desktop pasa a flujo normal (clases `motion-safe:`).
 */
export function usePurposeMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set([".pc-mission", ".pc-vision"], { yPercent: 100 });
      gsap.set(".pc-word", { opacity: 0, y: REVEAL.sm });
      gsap.set(".pc-body", { opacity: 0, y: REVEAL.md });

      gsap
        .timeline({
          defaults: { ease: EASE.none },
          scrollTrigger: { trigger: el, start: "top top", end: PIN_LENGTH, pin: true, scrub: SCRUB.crisp, invalidateOnRefresh: true },
        })
        .to({}, { duration: 0.5 })
        // Misión
        .to(".pc-mission", { yPercent: 0, duration: 1.5 }, "mission")
        .to(".pc-mission .pc-word", { opacity: 1, y: 0, stagger: STAGGER.tight, duration: 1 }, "mission+=0.8")
        .to(".pc-mission .pc-body", { opacity: 1, y: 0, duration: 1.2 }, "mission+=1.6")
        .to({}, { duration: 1 })
        // Visión
        .to(".pc-mission", { yPercent: -100, scale: PANEL_EXIT_SCALE, opacity: 0, duration: 1.5 }, "vision")
        .to(".pc-vision", { yPercent: 0, duration: 1.5 }, "vision")
        .to(".pc-vision .pc-word", { opacity: 1, y: 0, stagger: STAGGER.tight, duration: 1 }, "vision+=0.8")
        .to(".pc-vision .pc-body", { opacity: 1, y: 0, duration: 1.2 }, "vision+=1.6")
        .to({}, { duration: 1 });
    });

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // ── MAPA: se asienta al asomar ──
      gsap.fromTo(
        ".pc-map",
        { scale: MAP_START_SCALE, opacity: 0 },
        { scale: 1, opacity: 1, duration: DUR.cinematic, ease: EASE.out, force3D: true, scrollTrigger: { trigger: el, start: TRIGGER.late } }
      );
    });

    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".pcm-panel", el).forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll(".pcm-word"),
          { opacity: 0, y: WORD_RISE_MOBILE, filter: `blur(${REVEAL.blurBase}px)` },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: DUR.base,
            ease: EASE.out,
            stagger: STAGGER.tight,
            clearProps: "filter",
            scrollTrigger: { trigger: panel, start: TRIGGER.standard },
          }
        );
      });
    });

    return () => mm.revert();
  }, [scopeRef]);
}
