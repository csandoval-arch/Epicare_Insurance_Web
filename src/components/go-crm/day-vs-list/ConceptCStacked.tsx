"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ConceptCStacked() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Stack cards from bottom natively on scroll
      const cards = gsap.utils.toArray<HTMLElement>(".overlap-card");
      
      cards.forEach((card, i) => {
        if (i === 0) return; // first card is static
        
        gsap.fromTo(card,
          { y: "120%" },
          {
            y: "0%",
            ease: "none",
            scrollTrigger: {
              trigger: cards[i - 1], // Triggered when previous card is scrolled past
              start: "top 20%",
              end: "bottom 20%",
              scrub: 1
            }
          }
        );
      });

    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full bg-gray-50 text-[var(--color-text-primary)] border-t border-[var(--color-border-Strokes-default)] overflow-hidden">
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-64 text-center">
        <h2 className="text-sm font-mono text-[var(--color-brand-blue)] tracking-widest uppercase mb-6">La Diferencia</h2>
        <h3 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1] text-gray-900">
          Otros te dan una lista.<br/>
          <span className="text-[var(--color-brand-blue)]">GO CRM te da un día.</span>
        </h3>
        <p className="text-xl text-gray-500 leading-relaxed mx-auto max-w-2xl">
          Decidir a quién llamar toma más tiempo que hacer las llamadas. Con GO CRM, entras y tu día ya está armado.
        </p>
      </div>

      <div className="relative w-full h-[150vh] max-w-6xl mx-auto px-6 pb-[50vh]">
         
         {/* Card 1: Hoy */}
         <div className="overlap-card absolute top-0 left-6 right-6 h-[60vh] bg-white rounded-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border border-gray-200 flex flex-col md:flex-row p-12 gap-12 origin-bottom z-10">
            <div className="flex-1 flex flex-col justify-center">
               <span className="text-sm font-mono text-blue-500 mb-4 tracking-widest">01</span>
               <h4 className="text-4xl font-medium mb-6">Lo que vence hoy</h4>
               <p className="text-xl text-gray-500">Las tareas con fecha de hoy, arriba y en orden.</p>
            </div>
            <div className="flex-1 flex items-center justify-center bg-blue-50 rounded-2xl border border-blue-100 p-8">
               {/* UI Mockup */}
               <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-blue-200">
                  <div className="text-sm font-bold text-gray-900">Renovación Auto</div>
                  <div className="text-xs text-gray-500">Juan Pérez</div>
               </div>
            </div>
         </div>

         {/* Card 2: Atrasado */}
         <div className="overlap-card absolute top-12 left-6 right-6 h-[60vh] bg-orange-50 rounded-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border border-orange-200 flex flex-col md:flex-row p-12 gap-12 z-20">
            <div className="flex-1 flex flex-col justify-center">
               <span className="text-sm font-mono text-orange-500 mb-4 tracking-widest">02</span>
               <h4 className="text-4xl font-medium mb-6">Lo atrasado</h4>
               <p className="text-xl text-orange-800/60">Lo que prometiste y no hiciste. Visible y separado, no desaparece.</p>
            </div>
            <div className="flex-1 flex items-center justify-center bg-orange-100/50 rounded-2xl border border-orange-200 p-8">
               {/* UI Mockup */}
               <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-orange-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bottom-0 w-2 bg-orange-400" />
                  <div className="text-sm font-bold text-gray-900">Firma Salud</div>
                  <div className="text-xs text-gray-500">Carlos M.</div>
               </div>
            </div>
         </div>

         {/* Card 3: Limbo */}
         <div className="overlap-card absolute top-24 left-6 right-6 h-[60vh] bg-gray-900 text-white rounded-[3rem] shadow-[0_-30px_60px_rgba(0,0,0,0.2)] border border-gray-700 flex flex-col md:flex-row p-12 gap-12 z-30">
            <div className="flex-1 flex flex-col justify-center">
               <span className="text-sm font-mono text-gray-500 mb-4 tracking-widest">03</span>
               <h4 className="text-4xl font-medium mb-6">Sin agendar</h4>
               <p className="text-xl text-gray-400">Los prospectos que quedaron sin nada agendado. Son los que se caen.</p>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 p-8">
               {/* UI Mockup */}
               <div className="w-full bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-700 border-dashed">
                  <div className="text-sm font-bold text-gray-200">Prospecto Vida</div>
                  <div className="text-xs text-gray-500">Laura G.</div>
               </div>
            </div>
         </div>

      </div>
    </section>
  );
}
