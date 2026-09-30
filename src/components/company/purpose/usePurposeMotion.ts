"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
/** Las palabras de los titulares nacen del desenfoque casi en su sitio (poco recorrido vertical). */
const WORD_RISE = 8;

/**
 * @description Motion de Misión / Visión en MÓVIL / TABLET (<lg): cada titular entra una vez al llegar,
 * palabras en cascada desde el desenfoque (blur one-shot, se limpia al terminar). El vídeo del mapa va
 * estático. Desktop: cada variante de `purpose/desktop/` gestiona su propio motion.
 * Con reduced-motion no se registra nada.
 */
export function usePurposeMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".pcm-panel", el).forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll(".pcm-word"),
          { opacity: 0, y: WORD_RISE, filter: `blur(${REVEAL.blurBase}px)` },
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
