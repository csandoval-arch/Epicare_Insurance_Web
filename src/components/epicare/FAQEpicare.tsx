"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  EASE,
  DUR,
  STAGGER,
  REVEAL,
  TRIGGER,
} from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function FAQEpicare() {
  const t = useTranslations("landingV2.faq");
  const FAQS = Array.from({ length: 7 }, (_, i) => ({
    q: t(`q${i + 1}`),
    a: t(`a${i + 1}`),
  }));

  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  // Estado para controlar qué acordeón está abierto. null = todos cerrados.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".faq-item, .anim-head-line, .anim-head-fade", { opacity: 1, x: 0, y: 0, yPercent: 0 });
        return;
      }

      // 1. Header Timeline (Sincronizado Título + Overline)
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: TRIGGER.standard,
          toggleActions: "play none none reverse",
        },
      });

      headerTl
        .fromTo('.anim-head-line',
          { yPercent: REVEAL.birthPercent, opacity: 0, willChange: 'transform, opacity' },
          {
            yPercent: 0,
            opacity: 1,
            duration: DUR.slow,
            ease: EASE.dramatic,
            force3D: true,
            clearProps: 'willChange',
          }
        )
        .fromTo('.anim-head-fade',
          { opacity: 0, y: REVEAL.sm, willChange: 'transform, opacity' },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            force3D: true,
            clearProps: 'willChange',
          },
          "-=0.5"
        );

      // 2. FAQ Items: Animación de entrada diagonal (Horizontal X + Vertical Y) con latencia perceptible
      if (listRef.current) {
        const items = gsap.utils.toArray<HTMLElement>(listRef.current.querySelectorAll(".faq-item"));
        items.forEach((item) => {
          gsap.set(item, { opacity: 0, x: -36, y: 20, willChange: "transform, opacity" });

          ScrollTrigger.create({
            trigger: item,
            start: "top 86%", // Dispara a una altura óptima para apreciar el movimiento
            end: "bottom top",
            onEnter: () => {
              gsap.to(item, {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.95,
                delay: 0.06, // 60ms de latencia
                ease: "power3.out",
                force3D: true,
                clearProps: "willChange",
                overwrite: "auto",
              });
            },
            onLeaveBack: () => {
              gsap.to(item, {
                opacity: 0,
                x: -36,
                y: 20,
                duration: 0.45,
                ease: EASE.snap,
                force3D: true,
                overwrite: "auto",
              });
            },
          });
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full pt-6 pb-section-md md:py-section-lg relative bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] transition-colors duration-500 overflow-hidden"
    >
      <div className="mx-auto max-w-section-md px-[0.875rem] md:px-gutter-md">
        
        {/* Header (Left-aligned on mobile, centered on desktop) */}
        <div className="flex flex-col items-start text-left md:items-center md:text-center mb-8 md:mb-static-2xl">
          <span className="anim-head-fade text-overline text-[var(--color-brand-blue)] dark:text-[var(--color-brand-cyan)] mb-static-md block">
            {t("overline")}
          </span>
          <h2 className="overflow-hidden pb-static-xs text-display-xl font-semibold tracking-tight leading-[1] text-[var(--color-text-Black-100)] dark:text-white">
            <span className="anim-head-line block">
              {t("title")}
            </span>
          </h2>
        </div>

        {/* Premium Accordion List (Awwwards Level) */}
        <div ref={listRef} className="flex flex-col w-full border-t border-[var(--color-border-Strokes-default)]">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const num = (idx + 1).toString().padStart(2, '0');
            return (
              <div 
                key={idx} 
                className="faq-item group cursor-pointer border-b border-[var(--color-border-Strokes-default)] relative overflow-hidden"
                onClick={() => toggleAccordion(idx)}
              >
                {/* Liquid Hover Background (Hardware Accelerated) */}
                <div className={`absolute inset-0 w-full h-full bg-[var(--color-brand-blue)]/[0.02] dark:bg-[var(--color-brand-cyan)]/[0.03] transform origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0 ${
                  isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                }`}></div>

                <div className="py-8 md:py-10 flex flex-row items-center md:items-center justify-between gap-4 md:gap-6 relative z-10">
                  
                  {/* Left Side: Number + Question */}
                  <div className="flex flex-row items-center gap-4 md:gap-12 flex-1">
                    
                    {/* Rolling Text / Slot Machine Animation for Number */}
                    <div className="flex flex-col h-[1.2em] justify-start overflow-hidden relative font-mono text-body-sm md:text-body-lg text-[var(--color-text-muted)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu shrink-0">
                      <div className={`flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${
                        isOpen ? "-translate-y-1/2 delay-100 md:delay-0" : "group-hover:-translate-y-1/2 delay-0"
                      }`}>
                        <span className="leading-tight h-[1.2em]">{num}</span>
                        <span className="leading-tight h-[1.2em]">{num}</span>
                      </div>
                    </div>
                    
                    {/* Massive Typography with Magnetic Shift */}
                    <h3 className={`text-h4 md:text-h3 font-medium tracking-tight leading-[1.15] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu max-w-[90%] md:max-w-[85%] ${
                      isOpen 
                        ? "text-[var(--color-brand-blue)] dark:text-[var(--color-brand-cyan)] translate-x-2 md:translate-x-6" 
                        : "text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] dark:group-hover:text-[var(--color-brand-cyan)] group-hover:translate-x-2 md:group-hover:translate-x-6"
                    }`}>
                      {faq.q}
                    </h3>
                  </div>
                  
                  {/* Brutalist Plus/Cross Icon */}
                  <div className="relative w-6 h-6 md:w-10 md:h-10 flex items-center justify-center shrink-0 overflow-hidden">
                    {/* Horizontal */}
                    <span className={`absolute w-full h-[2px] bg-current transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${
                      isOpen 
                        ? "rotate-[135deg] text-[var(--color-brand-blue)] dark:text-[var(--color-brand-cyan)]" 
                        : "rotate-0 text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] dark:group-hover:text-[var(--color-brand-cyan)] group-hover:rotate-180"
                    }`}></span>
                    {/* Vertical */}
                    <span className={`absolute h-full w-[2px] bg-current transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${
                      isOpen 
                        ? "rotate-[135deg] text-[var(--color-brand-blue)] dark:text-[var(--color-brand-cyan)]" 
                        : "rotate-0 text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] dark:group-hover:text-[var(--color-brand-cyan)] group-hover:rotate-180"
                    }`}></span>
                  </div>
                </div>

                {/* Hardware-Accelerated Accordion Body via CSS Grid + Smooth Typography Reveal */}
                <div 
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative z-10 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* Inner wrapper for parallax/slide up effect */}
                    <div className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu ${
                      isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}>
                       <p className="text-body-md md:text-body-lg text-[var(--color-text-secondary)] font-normal leading-relaxed pb-10 md:pb-12 pl-[3.25rem] md:pl-[5.5rem] max-w-[95%] md:max-w-[75%]">
                         {faq.a}
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
