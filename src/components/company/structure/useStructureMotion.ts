"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, SCRUB, STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// ── VALORES FUERA DE TOKEN (margen creativo declarado; idénticos a la versión original) ──
/** La máscara de la imagen se abre de arriba abajo mientras la sección cruza la mitad superior. */
const MASK_START = "inset(0% 0% 100% 0%)";
const MASK_END = "inset(0% 0% 0% 0%)";
const IMAGE_START_SCALE = 1.1;
const TEXT_TRIGGER = "top 70%";
/** 2026-10-07: la cortina "caía de golpe" (ease none + solo 48% de pantalla para abrir 120svh: el borde
 *  arrancaba a 1.5× la velocidad del scroll). Ahora arranca antes (más recorrido = borde más lento) y
 *  con curva suave: entra despacio, acelera y se asienta. Excepción a "scrub sin ease" declarada. */
const SCRUB_START = "top 80%";
const SCRUB_END = "top 0%";
const SCRUB_CURVE = "sine.inOut";

/**
 * @description Motion de la estructura de /company (todas las anchuras, sin pin):
 * 1 · Entrada del texto (one-shot): etiqueta y titular suben con fade.
 * 2 · Scrub: la máscara con la imagen se abre de arriba abajo y la imagen se asienta; a su paso el
 *     texto pasa de tinta a blanco (capa duplicada dentro de la máscara).
 * Solo transform/opacity/clip-path. Con reduced-motion: la imagen queda descubierta, estática.
 */
export function useStructureMotion(scopeRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".st-mask", { clipPath: MASK_START });

      gsap.fromTo(
        ".st-reveal",
        { y: REVEAL.sm, opacity: 0 },
        { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out, stagger: STAGGER.wave, scrollTrigger: { trigger: el, start: TEXT_TRIGGER } }
      );

      gsap
        .timeline({ defaults: { ease: SCRUB_CURVE }, scrollTrigger: { trigger: el, start: SCRUB_START, end: SCRUB_END, scrub: SCRUB.crisp } })
        .to(".st-mask", { clipPath: MASK_END }, 0)
        .fromTo(".st-image", { scale: IMAGE_START_SCALE }, { scale: 1, force3D: true }, 0);
    });

    return () => mm.revert();
  }, [scopeRef]);
}
