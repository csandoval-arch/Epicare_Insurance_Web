"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";

const FAQ_ITEMS = [
  { qKey: "q1", aKey: "a1" },
  { qKey: "q2", aKey: "a2" },
  { qKey: "q3", aKey: "a3" },
  { qKey: "q4", aKey: "a4" },
  { qKey: "q5", aKey: "a5" },
  { qKey: "q6", aKey: "a6" },
];

export default function FaqSection() {
  const t = useTranslations('goAms.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".faq-title-line, .faq-subtitle, .faq-row", {
          opacity: 1,
          x: 0,
          y: 0,
          yPercent: 0,
          scale: 1
        });
        return;
      }

      // ── 1. Entrada y Salida de Cabecera (Trigger directo sobre el nodo) ──
      if (headerRef.current) {
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 92%",
            toggleActions: "play reverse play reverse"
          }
        });

        headerTl
          .fromTo(
            ".faq-title-line",
            {
              yPercent: 120,
              opacity: 0,
              willChange: "transform, opacity"
            },
            {
              yPercent: 0,
              opacity: 1,
              duration: DUR.base,
              ease: EASE.dramatic,
              clearProps: "willChange"
            }
          )
          .fromTo(
            ".faq-subtitle",
            { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
            {
              opacity: 1,
              y: 0,
              duration: DUR.fast,
              ease: EASE.out,
              clearProps: "willChange"
            },
            "-=0.3"
          );
      }

      // ── 2. Entrada y Salida INDIVIDUAL para CADA FILA (Desplazamiento Diagonal + Latencia 60ms) ──
      const rows = gsap.utils.toArray<HTMLElement>(".faq-row", el);
      rows.forEach((row) => {
        gsap.set(row, { opacity: 0, x: -36, y: 20, willChange: "transform, opacity" });

        ScrollTrigger.create({
          trigger: row,
          start: "top 86%",
          end: "bottom top",
          onEnter: () => {
            gsap.to(row, {
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
            gsap.to(row, {
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
    }, el);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="faq"
      className="w-full py-section-sm md:py-section-md bg-[var(--color-surface-BG-1)] relative border-t border-[var(--color-border-Strokes-strong)] overflow-hidden"
    >
      <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-gutter-sm md:px-gutter-md">
        
        {/* ── CABECERA ── */}
        <div 
          ref={headerRef}
          className="faq-header-wrapper mb-12 sm:mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 text-left"
        >
          <div>
            <h2 className="text-display-lg font-display uppercase tracking-tighter text-[var(--color-text-primary)] leading-[0.9]">
              <span className="block overflow-hidden pb-1">
                <span className="faq-title-line block">{t('title')}</span>
              </span>
            </h2>
          </div>
          <p className="faq-subtitle text-body-md sm:text-body-lg text-[var(--color-text-secondary)] max-w-sm md:max-w-[200px] text-left md:text-right pb-2">
            {t('subtitle')}
          </p>
        </div>

        {/* ── LISTA DE ACORDEÓN ── */}
        <div 
          ref={listRef}
          className="faq-list-wrapper border-t border-[var(--color-border-Strokes-default)]"
        >
          {FAQ_ITEMS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="faq-row border-b border-[var(--color-border-Strokes-strong)] group">
                
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full py-6 md:py-10 flex items-center justify-between gap-6 md:gap-8 text-left outline-none cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <h3 className={`text-h5 md:text-h4 font-display tracking-tight transition-colors duration-300 ${isOpen ? 'text-[var(--color-brand-blue)]' : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)]'}`}>
                    {t(faq.qKey as any)}
                  </h3>
                  
                  {/* Icono animado (+ a -) */}
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center relative">
                    {/* Línea horizontal */}
                    <span className={`absolute w-full h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-180 bg-[var(--color-brand-blue)]' : 'bg-[var(--color-text-muted)] group-hover:bg-[var(--color-brand-blue)]'}`} />
                    {/* Línea vertical */}
                    <span className={`absolute h-full w-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-90 scale-0 bg-[var(--color-brand-blue)]' : 'rotate-0 scale-100 bg-[var(--color-text-muted)] group-hover:bg-[var(--color-brand-blue)]'}`} />
                  </div>
                </button>
                
                {/* Contenedor colapsable (CSS Grid dinámico) */}
                <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="pb-8 pt-2 md:pb-10 text-body-lg md:text-body-xl text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
                      {t(faq.aKey as any)}
                    </p>
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
