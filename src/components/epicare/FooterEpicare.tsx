"use client";

/**
 * @file FooterEpicare.tsx
 * @description Footer global de Epicare (landing, GO CRM, GO AMS, company, licensing).
 * Curtain reveal (≥md, con movimiento): mientras el footer entra, un `transform` lo mantiene quieto
 * en pantalla y la página se desliza por encima destapándolo; el `clip-path` del contenedor oculta la
 * parte que queda por encima de su hueco. Si el footer es más alto que la pantalla, al terminar el
 * telón sigue el scroll normal y deja ver lo que falta (geometría en `footer/curtain.ts`).
 * En móvil y con movimiento reducido va en el flujo normal.
 * Contenido: `footer/FooterEditorial.tsx`.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "@/lib/motion";
import FooterEditorial from "./footer/FooterEditorial";
import { curtainEnd, curtainFrom } from "./footer/curtain";

export default function FooterEpicare() {
  const stage = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = stage.current;
    const inner = footer.current;
    if (!el || !inner) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // Telón: desde que el footer asoma hasta que queda destapado, el desplazamiento compensa
      // exactamente el scroll → queda quieto mientras la página se desliza por encima.
      gsap.fromTo(
        inner,
        { y: () => curtainFrom(el) },
        { y: 0, ease: EASE.none, scrollTrigger: { trigger: el, start: "top bottom", end: curtainEnd, scrub: true, invalidateOnRefresh: true } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={stage} className="relative w-full" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      <footer ref={footer} className="relative w-full will-change-transform">
        <FooterEditorial stage={stage} />
      </footer>
    </div>
  );
}
