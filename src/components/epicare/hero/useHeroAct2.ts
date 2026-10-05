"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offsetWithin } from "./geometry";

type PushDir = "up" | "down" | "left" | "right";

const DESKTOP_FULL = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
const PIN_LENGTH = "+=130%";
/** Fracción final del pin con el vídeo a pantalla completa, quieto, antes de soltarlo. */
const HOLD = 0.15;
/** Curva del empuje (la de la referencia de Codrops: suave al arrancar y al llegar). */
const PUSH_EASE = gsap.parseEase("power1.inOut");

/**
 * @description Acto 2 del hero (solo desktop, pin + scrub): "el vídeo empuja". Referencia: Codrops,
 * *On-Scroll Expanding Image Animation within Typography* (la imagen crece y aparta el texto).
 * La ventana grande crece hasta la pantalla completa y, al crecer, empuja lo que tiene alrededor.
 * Cada pieza declara por qué borde la empujan con `data-push="up|down|left|right"` (p. ej. el titular
 * sale por arriba; el copy, la prueba y la ventana pequeña por la derecha), pegada a ese borde. Nada
 * se desvanece ni se corta: es un cambio de composición físico.
 *
 * Técnica (Hardware Symphony): solo `transform`. El marco (`.hero-window`, con `overflow: hidden`)
 * escala desde su esquina y `.hero-video-act` aplica la inversa, así que el vídeo no se deforma ni
 * se desplaza respecto a la pantalla. Geometría medida en cada refresh; por frame, 6 transforms.
 */
export function useHeroAct2(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia(el);
    mm.add(DESKTOP_FULL, () => {
      const frames = gsap.utils.toArray<HTMLElement>(".hero-window", el);
      if (!frames.length) return;
      const big = [...frames].sort((a, b) => b.offsetWidth * b.offsetHeight - a.offsetWidth * a.offsetHeight)[0];
      const layer = big.querySelector<HTMLElement>(".hero-video-act");
      if (!layer) return;

      // Empujes declarados en el markup (GSAP combina con la entrada, que anima a los hijos).
      const pushed = gsap.utils.toArray<HTMLElement>("[data-push]", el);
      const pushers = pushed.map((node) => {
        const dir = node.dataset.push as PushDir;
        return { dir, set: gsap.quickSetter(node, dir === "up" || dir === "down" ? "y" : "x", "px") };
      });

      let rect = { x: 0, y: 0, w: 0, h: 0 };
      let W = 0;
      let H = 0;
      let t = 0;

      const measure = () => {
        W = el.clientWidth;
        H = window.innerHeight;
        rect = { ...offsetWithin(big, el), w: big.offsetWidth, h: big.offsetHeight };
      };

      const render = () => {
        const { x, y, w, h } = rect;
        if (!w || !h) return;
        // Marco: de su celda (x, y, w, h) al viewport (0, 0, W, H), con origen en su esquina.
        const tx = -x * t;
        const ty = -y * t;
        const sx = (w + (W - w) * t) / w;
        const sy = (h + (H - h) * t) / h;
        big.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sx}, ${sy})`;
        // Vídeo: la inversa del marco → el plano queda quieto respecto a la pantalla.
        layer.style.transform = `scale(${1 / sx}, ${1 / sy}) translate3d(${-tx}px, ${-ty}px, 0)`;
        // Cuánto se ha movido cada borde del vídeo en este instante → cuánto empuja.
        const moved: Record<PushDir, number> = {
          up: ty,
          left: tx,
          right: x + tx + w * sx - (x + w),
          down: y + ty + h * sy - (y + h),
        };
        pushers.forEach(({ dir, set }) => set(moved[dir]));
      };

      gsap.set([big, layer], { transformOrigin: "0 0", willChange: "transform" });
      gsap.set(pushed, { willChange: "transform" });

      ScrollTrigger.create({
        trigger: el,
        pin: true,
        start: "top top",
        end: PIN_LENGTH,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          render();
        },
        onUpdate: (self) => {
          t = PUSH_EASE(Math.min(1, self.progress / (1 - HOLD)));
          render();
        },
      });

      return () => {
        big.style.transform = "";
        layer.style.transform = "";
      };
    });

    return () => mm.revert();
  }, [sectionRef]);
}
