"use client";

/**
 * @file FooterEpicare.tsx
 * @description Footer global de Epicare (landing, GO CRM, GO AMS, company, licensing).
 * Curtain reveal (todos los tamaños, con movimiento), sin compensar el scroll frame a frame (con Lenis eso llega
 * un frame tarde y el contenido tiembla):
 * - El contenedor reserva el alto del footer y lo recorta con `clip-path`.
 * - Mientras se destapa, el footer va `position: fixed` (arriba si es más alto que la pantalla,
 *   abajo si cabe): no se mueve ni un píxel mientras la página se desliza por encima.
 * - Cuando queda revelado del todo (su top llega arriba), pasa a `absolute` dentro del contenedor —en
 *   ese instante ambas posiciones coinciden— y el scroll normal muestra lo que falta.
 * Con movimiento reducido va en el flujo normal.
 * Contenido: `footer/FooterContent.tsx`.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FooterContent from "./footer/FooterContent";

type Mode = "fixed-top" | "fixed-bottom" | "flow";

const MODES: Record<Mode, Partial<CSSStyleDeclaration>> = {
  "fixed-top": { position: "fixed", top: "0px", bottom: "auto" },
  "fixed-bottom": { position: "fixed", top: "auto", bottom: "0px" },
  flow: { position: "absolute", top: "0px", bottom: "auto" },
};

export default function FooterEpicare() {
  const stage = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = stage.current;
    const inner = footer.current;
    if (!el || !inner) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);

    // Todos los tamaños (también móvil): no es un pin de GSAP, solo alterna `fixed` ↔ flujo según la
    // posición real, sin animar nada frame a frame. Con movimiento reducido, flujo normal.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let mode: Mode | null = null;
      const setMode = (next: Mode) => {
        if (next === mode) return;
        mode = next;
        Object.assign(inner.style, MODES[next], { left: "0px", width: "100%" });
      };

      // El modo se decide con la posición REAL del contenedor en cada scroll, no con `start` precalculado:
      // en páginas con pins que se crean después del footer, ese `start` quedaba desfasado y el footer
      // iba en flujo desde el principio (sin telón).
      const sync = () => {
        const taller = (inner as HTMLElement).offsetHeight > window.innerHeight;
        if (!taller) setMode("fixed-bottom");
        else setMode(el.getBoundingClientRect().top > 0 ? "fixed-top" : "flow");
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        // El footer va al final: se recalcula después que los pins de la página.
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          // El contenedor reserva el alto real del footer (fuera del flujo al ir fixed/absolute).
          el.style.height = `${inner.offsetHeight}px`;
          sync();
        },
        onUpdate: sync,
      });

      return () => {
        st.kill();
        el.style.height = "";
        inner.removeAttribute("style");
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // `data-footer-stage`: el contenido localiza el contenedor del telón en el DOM (ver `useCurtainReveal`).
    <div ref={stage} data-footer-stage="" className="relative w-full" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      <footer ref={footer} className="relative w-full">
        <FooterContent />
      </footer>
    </div>
  );
}
