"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function OpportunityJourneyGoCrm() {
  const containerRef = useRef<HTMLElement>(null);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    { id: "01", title: "Origen", desc: "El primer contacto (Meta, Google, WhatsApp)." },
    { id: "02", title: "Contacto", desc: "Se crea el registro centralizado." },
    { id: "03", title: "Oportunidad", desc: "Nace un proceso de venta específico." },
    { id: "04", title: "Pipeline", desc: "Avanza por las etapas configuradas." },
    { id: "05", title: "Actividad", desc: "Notas, correos y contexto acumulado." },
    { id: "06", title: "Seguimiento", desc: "Tareas programadas para no olvidar." },
    { id: "07", title: "Cita", desc: "Reunión agendada en el calendario." },
    { id: "08", title: "Resultado", desc: "Conversión a póliza o cliente ganado." },
  ];

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
   if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx = gsap.context(() => {
      
      if (prefersReducedMotion) return;

      // Animación de entrada arquitectónica (Curtain Reveal desde arriba)
      gsap.fromTo(cellsRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
        opacity: 0
      }, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });

      // Animación del título
      gsap.fromTo(".architectural-title", {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[var(--color-surface-BG-white)] py-24 md:py-32"
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col">
        
        {/* HEADER MINIMALISTA EDITORIAL */}
        <div className="mb-16 md:mb-24 flex flex-col items-center justify-center text-center architectural-title w-full">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-[var(--color-text-primary)] leading-tight">
            Sigue todo el viaje.
          </h2>
        </div>

        {/* GRID ARQUITECTÓNICO (1px borders, no gaps) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-black/10">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            
            // La celda final rompe el patrón con el color de marca (A1, A4)
            const bgClass = isLast ? "bg-[#35BBFD]" : "bg-transparent hover:bg-black/[0.02]";
            const textMain = isLast ? "text-white" : "text-[var(--color-text-primary)]";
            const textSub = isLast ? "text-white/80" : "text-black/50";
            const numClass = isLast ? "text-white/60" : "text-black/30";

            return (
              <div 
                key={idx}
                ref={el => { cellsRef.current[idx] = el }}
                className={`relative flex flex-col justify-between h-[220px] md:h-[280px] p-8 border-r border-b border-black/10 transition-colors duration-300 ${bgClass} group`}
              >
                {/* Número Monoespaciado Top */}
                <div className={`font-mono text-xs tracking-widest ${numClass}`}>
                  {step.id}
                </div>
                
                {/* Contenido Bottom */}
                <div className="mt-auto">
                  <h3 className={`text-xl md:text-2xl font-medium tracking-tight mb-3 transition-colors duration-300 ${textMain} ${!isLast && 'group-hover:text-[#35BBFD]'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm font-light leading-relaxed ${textSub}`}>
                    {step.desc}
                  </p>
                </div>
                
                {/* Micro-interacción: Línea de progreso sutil en hover (C1) */}
                {!isLast && (
                  <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#35BBFD] transition-all duration-500 ease-out group-hover:w-full"></div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

