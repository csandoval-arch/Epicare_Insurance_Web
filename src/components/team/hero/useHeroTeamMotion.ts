"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";
import { DEPTHS, type Depth } from "../cast";

const FULL = "(prefers-reduced-motion: no-preference)";
const DESKTOP = "(min-width: 1024px)";
const POINTER = "(hover: hover) and (pointer: fine)";
/** Si el loader nunca avisa (navegación SPA sin loader), la entrada arranca igual. */
const LOADER_FALLBACK_MS = 4000;
type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

// ── MARGEN CREATIVO DECLARADO (física del elenco) ──
/**
 * "La cámara atraviesa el grupo": desplazamiento de cada capa durante el scroll del hero, en
 * fracción de su alto. Atrás se queda (0.55×), en medio acompaña (0.78×), delante se adelanta (1.12×).
 */
const SCROLL_DRIFT: Record<Depth, number> = { back: 0.45, mid: 0.22, front: -0.12 };
const FRONT_SCALE = 1.06;
const COPY_DRIFT = 0.18;
/** Deriva de cada capa con el cursor (px) y giro máximo de cada figura (grados). */
const CURSOR_SHIFT: Record<Depth, number> = { back: 8, mid: 16, front: 30 };
const TILT = 6;
/** Primer gesto del elenco: se giran hacia el centro de la pantalla (grados por ancho de escenario). */
const LOOK_AT_CENTER = 10;

/**
 * @description Coreografía del Acto 00 "The cast" (hero de /team).
 * 1 · Entrada (tras el loader): eyebrow + titular con Text-Birth, el elenco entra por capas
 *     (atrás → medio → delante, Layered Unveiling), todos miran al centro y aparece el CTA.
 * 2 · Scroll (desktop): las capas se separan a 3 velocidades y el texto se queda atrás.
 * 3 · Cursor (desktop con ratón): cada capa deriva según su profundidad y cada figura se inclina.
 * Solo transform/opacity. Con reduced-motion todo queda estático y visible.
 */
export function useHeroTeamMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    let intro: gsap.core.Timeline | undefined;
    let cursorOn = false;

    // ── 1 · ENTRADA ──
    mm.add(FULL, () => {
      const stage = el.querySelector<HTMLElement>(".ht-stage");
      // Ángulo hacia el centro del escenario según dónde está cada figura.
      const lookAtCenter = (_: number, fig: Element) => {
        if (!stage) return 0;
        const s = stage.getBoundingClientRect();
        const f = fig.getBoundingClientRect();
        const offset = (s.left + s.width / 2 - (f.left + f.width / 2)) / s.width;
        return gsap.utils.clamp(-TILT, TILT, offset * LOOK_AT_CENTER * 2);
      };

      intro = gsap.timeline({ paused: true, defaults: { force3D: true } });
      intro.fromTo(".ht-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base }, 0.3);
      DEPTHS.forEach((depth, i) => {
        intro?.fromTo(
          `.ht-layer-${depth} .ht-fig`,
          { opacity: 0, scale: 0.94, y: REVEAL.md, transformOrigin: "50% 100%" },
          { opacity: 1, scale: 1, y: 0, duration: DUR.slow, ease: EASE.out, stagger: STAGGER.wave },
          0.8 + i * 0.2
        );
      });
      intro
        .fromTo(".ht-sub", { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out }, 1.0)
        .to(".ht-tilt", { rotateY: lookAtCenter, duration: DUR.base, ease: EASE.inOut }, 1.8)
        .fromTo(".ht-cta", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.fast, ease: EASE.snap }, 2.2)
        .call(() => {
          cursorOn = true;
        });
    });

    // ── 2 · SCROLL: la cámara atraviesa el grupo (desktop) ──
    mm.add(`${DESKTOP} and ${FULL}`, () => {
      const tl = gsap.timeline({
        defaults: { ease: EASE.none, force3D: true },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
      DEPTHS.forEach((depth) => {
        tl.to(`.ht-layer-${depth}`, { y: () => el.offsetHeight * SCROLL_DRIFT[depth], ...(depth === "front" ? { scale: FRONT_SCALE } : {}) }, 0);
      });
      tl.to(".ht-copy", { y: () => el.offsetHeight * COPY_DRIFT }, 0);
    });

    // ── 3 · CURSOR: deriva por profundidad + inclinación de cada figura ──
    mm.add(`${DESKTOP} and ${POINTER} and ${FULL}`, () => {
      const drift = DEPTHS.map((depth) => {
        const layer = el.querySelector(`.ht-layer-${depth} .ht-drift`);
        return {
          depth,
          x: layer ? gsap.quickTo(layer, "x", { duration: DUR.slow, ease: EASE.out }) : null,
          y: layer ? gsap.quickTo(layer, "y", { duration: DUR.slow, ease: EASE.out }) : null,
        };
      });
      const tilts = gsap.utils.toArray<HTMLElement>(".ht-tilt", el).map((t) => ({
        ry: gsap.quickTo(t, "rotateY", { duration: DUR.base, ease: EASE.out }),
        rx: gsap.quickTo(t, "rotateX", { duration: DUR.base, ease: EASE.out }),
      }));

      const onMove = (e: PointerEvent) => {
        if (!cursorOn) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        drift.forEach(({ depth, x, y }) => {
          x?.(-nx * CURSOR_SHIFT[depth]);
          y?.(-ny * CURSOR_SHIFT[depth] * 0.5);
        });
        tilts.forEach(({ ry, rx }) => {
          ry(nx * TILT);
          rx(-ny * TILT * 0.5);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });

    // Respiración del elenco (keyframe CSS) solo con el hero a la vista.
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
    io.observe(el);

    const play = () => intro?.play();
    if ((window as LoaderWindow).epicareLoaderFinished) play();
    else window.addEventListener("epicareLoaderFinished", play, { once: true });
    const fallbackId = setTimeout(play, LOADER_FALLBACK_MS);

    return () => {
      window.removeEventListener("epicareLoaderFinished", play);
      clearTimeout(fallbackId);
      io.disconnect();
      mm.revert();
    };
  }, [scopeRef]);
}
