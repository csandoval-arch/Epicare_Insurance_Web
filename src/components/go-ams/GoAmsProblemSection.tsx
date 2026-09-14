"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";
import { asset } from "@/lib/asset";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GoAmsProblemSection() {
  const t = useTranslations("goAms.problemSection");
  const sectionRef = useRef<HTMLElement>(null);
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);

  const pains = [
    { title: t("pains.0.title"), description: t("pains.0.description") },
    { title: t("pains.1.title"), description: t("pains.1.description") },
    { title: t("pains.2.title"), description: t("pains.2.description") },
    { title: t("pains.3.title"), description: t("pains.3.description") },
    { title: t("pains.4.title"), description: t("pains.4.description") },
    { title: t("pains.5.title"), description: t("pains.5.description") },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.blueprint-cell, .section-eyebrow, .section-subtitle, .card-reveal', {
          opacity: 1, y: 0, scaleY: 1, yPercent: 0, clipPath: "inset(0% 0% 0% 0%)"
        });
        return;
      }

      // 1. Título y Subtítulo de Sección
      gsap.fromTo('.section-subtitle', 
        { opacity: 0, y: REVEAL.md, willChange: 'transform, opacity' },
        { 
          opacity: 1, 
          y: 0, 
          duration: DUR.base, 
          ease: EASE.out, 
          clearProps: 'willChange',
          scrollTrigger: { trigger: el, start: TRIGGER.standard, toggleActions: 'play none none reverse' } 
        }
      );

      const eyebrow = el.querySelector('.section-eyebrow');
      if (eyebrow) {
        gsap.fromTo(eyebrow,
          { opacity: 0, y: REVEAL.sm, willChange: 'transform, opacity' },
          {
            opacity: 0.8,
            y: 0,
            duration: DUR.fast,
            ease: EASE.out,
            clearProps: 'willChange',
            scrollTrigger: { trigger: el, start: TRIGGER.standard, toggleActions: 'play none none reverse' }
          }
        );
      }

      // 2. Reveal of the Blueprint Grid (Borders drawing themselves)
      const cells = gsap.utils.toArray<HTMLElement>('.blueprint-cell', el);
      if (cells.length > 0) {
        gsap.fromTo(cells, 
          { borderColor: "rgba(0,0,0,0)" },
          { 
            borderColor: "var(--color-text-Black-100)", 
            duration: DUR.base, 
            stagger: STAGGER.tight, 
            ease: EASE.out,
            clearProps: "borderColor",
            scrollTrigger: {
              trigger: el.querySelector('.blueprint-grid') || el,
              start: TRIGGER.standard,
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 3. Bento Grid Card Contents (Arquetipo 3 - Wave Stagger)
      const cardContents = gsap.utils.toArray<HTMLElement>('.card-reveal', el);
      if (cardContents.length > 0) {
        gsap.fromTo(cardContents,
          { opacity: 0, y: REVEAL.md, willChange: 'transform, opacity' },
          {
            opacity: 1, 
            y: 0, 
            duration: DUR.base, 
            stagger: STAGGER.wave,
            ease: EASE.out,
            force3D: true,
            clearProps: 'willChange',
            scrollTrigger: {
              trigger: el.querySelector('.blueprint-grid') || el,
              start: TRIGGER.standard,
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

    }, el);

    return () => ctx.revert();
  }, []);

  const getGridSpan = (index: number) => {
    switch(index) {
      case 0: return "md:col-start-3 md:row-start-1 md:col-span-1"; // Item 1
      case 1: return "md:col-start-4 md:row-start-1 md:col-span-1"; // Item 2
      case 2: return "md:col-start-5 md:row-start-1 md:col-span-1"; // Item 3
      case 3: return "md:col-start-3 md:row-start-2 md:col-span-1"; // Item 4
      case 4: return "md:col-start-4 md:row-start-2 md:col-span-1"; // Item 5
      case 5: return "md:col-start-5 md:row-start-2 md:col-span-1"; // Item 6
      default: return "";
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden transition-colors duration-700 bg-[var(--color-surface-BG-1)] dark:bg-[var(--color-surface-BG-black)] py-section-sm md:py-section-md">
      <div 
        className="container mx-auto px-gutter-sm md:px-gutter-md w-full relative z-10" 
        style={{ maxWidth: "1440px" }}
      >
        
        {/* AWWWARDS: THE BLUEPRINT GRID */}
        <div className="blueprint-grid grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 border-t border-l border-[var(--color-text-Black-100)]/10 dark:border-white/10">
          
          {/* CELL 0: Context Header (Left, spans 2 cols and 2 rows) */}
          <div className="blueprint-cell md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2 border-r border-b border-[var(--color-text-Black-100)]/10 dark:border-white/10 p-3.5 md:p-10 flex flex-col justify-between relative overflow-hidden">
            
            {/* Glassmorphic Background Layer (Static, Eppigo configuration) */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              {/* Pure Background Mesh (Brand Blue) */}
              <img 
                src={asset('/Files/Backgrounds/epicare_bg_aura_blue.webp')} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-300"
                style={{ 
                  opacity: 0.45,
                  filter: 'hue-rotate(31deg)',
                  transform: 'scale(2)'
                }}
              />
              
              {/* Clean Frosted Glass Refraction */}
              <div className="absolute inset-0 bg-white/20 dark:bg-white/[0.04] backdrop-blur-[20px] saturate-[1.5] pointer-events-none" />
            </div>

            <div className="bp-content relative z-10">
              {/* Oculto en mobile a petición del usuario */}
              <h2 className="hidden md:block section-eyebrow text-overline text-[var(--color-text-accent-blue)] mb-8 opacity-80">
                {t("title")}
              </h2>
              {/* Mismo token masivo en mobile y desktop */}
              <h3 className="section-subtitle text-display font-medium text-[var(--color-text-primary)] dark:text-white leading-tight tracking-tight">
                {t.rich("subtitle", {
                  blue: (chunks) => <span className="text-[var(--color-text-accent-blue)]">{chunks}</span>
                })}
              </h3>
            </div>
            
            {/* Decoración técnica */}
            <div className="absolute top-4 right-4 w-2 h-2 border border-[var(--color-brand-blue)] opacity-50 z-10 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 border border-[var(--color-brand-blue)] opacity-50 z-10 pointer-events-none"></div>
          </div>

          {/* PAIN CELLS 1-6 */}
          {pains.map((pain, i) => {
            // AWWWARDS: Objeto Digital (Rounded Pill).
            if (i === 5) {
              return (
                <div key={i} className={cn(
                  "blueprint-cell border-r border-b border-[var(--color-text-Black-100)]/10 dark:border-white/10 p-2 md:p-4 flex flex-col group relative overflow-hidden cursor-pointer min-h-[160px] md:min-h-0",
                  getGridSpan(i)
                )}>
                  <div className="relative z-10 w-full h-full bg-[var(--color-brand-blue)] text-white rounded-xl p-3.5 md:p-8 flex flex-col justify-between overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[0.98]">
                    
                    {/* Aura Glow animado */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-white opacity-20 group-hover:opacity-40 rounded-full blur-3xl transition-all duration-1000 ease-out group-hover:scale-150 group-hover:translate-x-4 group-hover:-translate-y-4"></div>
                    
                    <div className="card-reveal relative z-10 flex flex-col justify-between h-full">
                      {/* Botón Circular Glassmórfico */}
                      <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-white group-hover:text-[var(--color-brand-blue)] transition-all duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 transition-transform duration-500 group-hover:translate-y-1">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      </div>
                      
                      <div className="mt-6 md:mt-8 transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                        <h4 className="text-h4 font-medium tracking-tight leading-tight mb-3">
                          {pain.title}
                        </h4>
                        <p className="text-body-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                          {pain.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Ítems estándar (1 al 5)
            const isOpen = openMobileIndex === i;

            return (
              <div 
                key={i} 
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setOpenMobileIndex(isOpen ? null : i);
                  }
                }}
                className={cn(
                  "blueprint-cell border-r border-b border-[var(--color-text-Black-100)]/10 dark:border-white/10 p-3.5 md:p-8 flex flex-col justify-center md:justify-start group relative overflow-hidden cursor-pointer md:cursor-crosshair hover:border-[var(--color-brand-blue)]/30 transition-colors duration-300 min-h-[72px] md:min-h-0 select-none text-left",
                  getGridSpan(i)
                )}
              >
                
                {/* Hover / Tap Kinetics */}
                <div className={cn(
                  "absolute inset-0 bg-[var(--color-brand-blue)] transform origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 md:group-hover:scale-y-100",
                  isOpen ? "scale-y-100" : "scale-y-0"
                )}></div>
                
                <div className="card-reveal relative z-10 w-full h-full flex flex-col justify-center md:justify-start text-left">
                  
                  {/* Número: Oculto en mobile, expulsado hacia arriba en desktop */}
                  <div className="hidden md:block text-meta text-[var(--color-text-accent-blue)] mb-4 transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-8 group-hover:opacity-0 group-hover:text-white/70">
                    [0{i + 1}]
                  </div>
                  
                  {/* Título: Visible tanto en mobile (persistente) como en desktop */}
                  <h4 className={cn(
                    "text-h5 md:text-h4 font-medium tracking-tight leading-tight transform transition-all duration-500 flex items-center justify-between gap-4 w-full text-left",
                    isOpen ? "text-white" : "text-[var(--color-text-primary)] dark:text-white",
                    "md:group-hover:-translate-y-8 md:group-hover:text-white"
                  )}>
                    <span>{pain.title}</span>
                    
                    {/* Affordance táctil en mobile (Icono de barras minimalista que rota al abrir) */}
                    <span className={cn(
                      "md:hidden flex-shrink-0 transition-all duration-300",
                      isOpen ? "text-white opacity-90 rotate-90" : "text-[var(--color-text-primary)] dark:text-white opacity-30"
                    )}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="9" x2="20" y2="9"></line>
                        <line x1="4" y1="15" x2="20" y2="15"></line>
                      </svg>
                    </span>
                  </h4>
                  
                  {/* Descripción: En mobile se expande fluidamente debajo del título haciendo la tarjeta más alta. En desktop aparece abajo */}
                  <div className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none",
                    "md:block md:absolute md:bottom-0 md:left-0 md:w-full md:opacity-0 md:group-hover:opacity-100 md:pointer-events-none md:transition-all md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)]"
                  )}>
                    <div className="overflow-hidden md:overflow-visible">
                      <p className="w-full text-body-md leading-relaxed text-white text-left pt-3 pb-1 md:pt-0 md:pb-0 md:transform md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-700">
                        {pain.description}
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
