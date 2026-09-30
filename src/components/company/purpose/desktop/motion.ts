"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DUR, EASE, REVEAL, SCRUB, STAGGER, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
/** Parallax interno del mapa dentro de su marco (2 velocidades: marco a 1×, mapa se asienta). */
const MAP_PARALLAX_SCALE = 1.12;

/** Text-Birth por palabra de un titular (`.pc-bw` dentro de `scope`). */
export function birthWords(scope: Element, trigger: Element = scope) {
  const words = scope.querySelectorAll(".pc-bw");
  if (!words.length) return;
  gsap.fromTo(
    words,
    { yPercent: REVEAL.birthPercent },
    { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.tight, scrollTrigger: { trigger, start: TRIGGER.standard } }
  );
}

/**
 * Bajadas: reveal por líneas — cada línea nace de su máscara (Text-Birth de líneas). Se parte cuando las
 * fuentes están cargadas (si no, los cortes de línea salen mal); el split vive en el contexto de GSAP
 * que lo llama, así que `mm.revert()` lo deshace.
 */
export function revealLines(el: HTMLElement) {
  const split = SplitText.create(el, { type: "lines", mask: "lines", autoSplit: true, onSplit: (self) =>
    gsap.fromTo(
      self.lines,
      { yPercent: 100 },
      { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base, scrollTrigger: { trigger: el, start: TRIGGER.standard } }
    ),
  });
  return split;
}

/** La figura del mapa: cortina desde abajo (one-shot, arranca en cuanto asoma y sin rampa de salida:
 *  reacciona rápido) + el mapa se asienta con el scroll (parallax). */
export function revealFigure(root: Element) {
  const figure = root.querySelector(".pf-figure");
  const frame = root.querySelector(".pf-frame");
  const map = root.querySelector(".pc-map");
  if (!figure || !frame || !map) return;
  gsap.fromTo(
    frame,
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.slow, ease: EASE.out, clearProps: "clipPath", scrollTrigger: { trigger: figure, start: TRIGGER.early } }
  );
  // Zoom base del vídeo (`data-zoom`): GSAP anula la propiedad CSS `scale` al animar, así que el
  // parallax parte de él y termina en él.
  const zoom = parseFloat((map as HTMLElement).dataset.zoom ?? "1") || 1;
  gsap.fromTo(
    map,
    { scale: MAP_PARALLAX_SCALE * zoom },
    { scale: zoom, ease: EASE.none, force3D: true, scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: SCRUB.smooth } }
  );
}
