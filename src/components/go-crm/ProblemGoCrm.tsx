"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * @file ProblemGoCrm.tsx
 * @description Diseño Simétrico en Scroll Horizontal.
 * Todos los puntos (1 al 5) tienen la misma jerarquía y fluyen como columnas idénticas.
 */
export default function ProblemGoCrm() {
  const t = useTranslations("goCrm.problem");
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Horizontal Scroll
      gsap.to(track.current, {
        x: () => -(track.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          scrub: 0.5, // Reducido de 1 a 0.5 para que se sienta más responsivo
          // Reducimos la distancia de scroll vertical necesaria a la mitad (0.5)
          end: () => "+=" + (track.current!.scrollWidth * 0.5)
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const points = [
    { 
      num: "01", 
      text: <>"{t.rich("p1", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "02", 
      text: <>"{t.rich("p2", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "03", 
      text: <>"{t.rich("p3", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "04", 
      text: <>"{t.rich("p4", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "05", 
      text: <>{t.rich("p5", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })} {t.rich("cierre", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}</> 
    }
  ];

  return (
    <section ref={container} className="h-screen w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex items-center">
      
      {/* Track Horizontal que contiene el Título y las columnas simétricas */}
      <div ref={track} className="flex h-full w-max items-stretch">
        
        {/* Panel 0: Título Masivo (Acto 0 con más margen izquierdo) */}
        <div className="w-[100vw] lg:w-[60vw] h-full flex flex-col justify-center px-8 lg:pr-16 lg:pl-[8vw] xl:pl-[12vw] border-r border-[var(--color-border-Strokes-default)] shrink-0">
          <p className="text-meta uppercase tracking-[0.2em] text-[var(--color-brand-blue)] mb-8">
            {t("overline")}
          </p>
          <h2 className="text-display-md lg:text-[4.5vw] font-medium tracking-tight leading-[1.05] max-w-4xl">
            {t("h2")}
          </h2>
        </div>

        {/* Paneles 1 al 4: Puntos idénticos (excepto el 4 que lleva fondo azul y es más ancho) */}
        {points.map((pt, i) => {
          const isHighlight = i === 4;
          return (
            <div 
              key={i} 
              className={`relative ${isHighlight ? "w-[90vw] lg:w-[35vw]" : "w-[85vw] lg:w-[28vw]"} h-full flex flex-col justify-center px-8 lg:px-16 border-r border-[var(--color-border-Strokes-default)] shrink-0 transition-colors duration-500
                ${isHighlight 
                  ? "bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-brand-blue)]" 
                  : "bg-[var(--color-surface-BG-base)] hover:bg-[var(--color-surface-BG-1)] text-[var(--color-text-primary)]"
                }
              `}
            >
              {!isHighlight && (
                <span className="block text-body-md font-mono mb-12 text-[var(--color-text-muted)]">
                  {pt.num}
                </span>
              )}
              <p className={`leading-relaxed ${isHighlight ? "text-display-sm font-bold text-white tracking-tight" : "text-display-xs font-light text-[var(--color-text-secondary)]"}`}>
                {pt.text}
              </p>

              {/* Flecha minimalista hacia abajo */}
              {isHighlight && (
                <div className="absolute bottom-12 right-12 lg:bottom-16 lg:right-16 text-white/80">
                  <svg width="24" height="60" viewBox="0 0 24 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 lg:h-20 w-auto">
                    <path d="M12 2L12 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M6 52L12 58L18 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* Espacio final (buffer) para que la última tarjeta respire al terminar el scroll */}
        <div className="w-[10vw] lg:w-[20vw] h-full shrink-0 bg-[var(--color-surface-BG-base)]" />

      </div>
    </section>
  );
}
