"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CalendarConcept() {
  const container = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".crm-window", 
        { y: 40, opacity: 0, scale: 0.98 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          ease: "power3.out", 
          scrollTrigger: { 
            trigger: container.current, 
            start: "top 75%" 
          } 
        }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={container} 
      className="relative w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] pt-28 pb-40 md:pt-36 md:pb-52 border-t border-[var(--color-border-Strokes-default)] overflow-hidden transition-colors duration-500"
    >
      {/* AMBIENT AURA GLOWS DE FONDO */}
      <div className="absolute top-[8%] left-[15%] w-[45vw] aspect-square bg-[var(--color-brand-blue)]/10 dark:bg-[var(--color-brand-blue)]/[0.06] rounded-full blur-[140px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen transition-opacity" />
      <div className="absolute top-[25%] right-[15%] w-[35vw] aspect-square bg-[var(--color-brand-orange)]/10 dark:bg-[var(--color-brand-orange)]/[0.05] rounded-full blur-[130px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen transition-opacity" />

      {/* HEADER EDITORIAL SPLIT */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12 lg:mb-14 relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 xl:gap-16">
          
          <div className="max-w-4xl xl:max-w-5xl flex-1">
            <h2 className="text-display-sm md:text-display-lg font-semibold tracking-tight leading-[1.12] text-[var(--color-text-primary)]">
              La mayoría te da una lista. <span className="text-[var(--color-brand-blue)]">GO CRM te arma el día.</span>
            </h2>
          </div>

          <div className="max-w-xs lg:max-w-[320px] shrink-0 lg:pb-1">
            <p className="text-body-sm md:text-body-md text-[var(--color-text-secondary)] leading-relaxed font-normal">
              Cualquier sistema te muestra a quién tienes. Nosotros organizamos a quién llamar primero. Entras y tu día ya está resuelto y en movimiento.
            </p>
          </div>

        </div>
      </div>

      {/* UI WINDOW: THE IMAGE */}
      <div className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="crm-window relative w-full rounded-3xl border border-[var(--color-border-Strokes-strong)] shadow-elevation-4 overflow-hidden transform-gpu bg-[var(--color-surface-BG-1)]">
           <img 
              src="/Files/Go_CRM/Calendar/calendar.png" 
              alt="GO CRM te arma el dia" 
              className="w-full h-auto object-cover block" 
           />
        </div>
      </div>
    </section>
  );
}
