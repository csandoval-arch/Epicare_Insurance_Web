"use client";

import React from "react";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

export default function ConceptABento() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".bento-card", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)", scrollTrigger: { trigger: ".bento-grid", start: "top 80%" } }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="w-full bg-[var(--color-surface-BG-base)] py-32 border-t border-[var(--color-border-Strokes-default)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Encabezado resumido */}
        <div className="text-center max-w-4xl mb-24">
          <h2 className="text-sm font-mono text-[var(--color-brand-blue)] tracking-widest uppercase mb-6">La Diferencia</h2>
          <h3 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1] text-gray-900">
            Otros te dan una lista.<br/>
            <span className="text-[var(--color-brand-blue)]">GO CRM te da un día.</span>
          </h3>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Decidir a quién llamar toma más tiempo que hacer las llamadas. Con GO CRM, entras y tu día ya está perfectamente armado.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid w-full grid grid-cols-1 md:grid-cols-3 gap-6">
           
           {/* Card 1: Hoy */}
           <div className="bento-card flex flex-col bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
              <div className="p-10 flex-1 flex flex-col gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mb-4">01</div>
                 <h4 className="text-2xl font-bold text-gray-900">Vence Hoy</h4>
                 <p className="text-gray-500 leading-relaxed">Las tareas con fecha de hoy, arriba y en orden absoluto.</p>
              </div>
              <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col gap-3">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
                    <div>
                       <div className="text-sm font-bold">Renovación Auto</div>
                       <div className="text-xs text-gray-500">Juan Pérez</div>
                    </div>
                    <span className="text-xs font-bold text-blue-600">10:00</span>
                 </div>
              </div>
           </div>

           {/* Card 2: Atrasado */}
           <div className="bento-card flex flex-col bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500 md:translate-y-12">
              <div className="p-10 flex-1 flex flex-col gap-4">
                 <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold mb-4">02</div>
                 <h4 className="text-2xl font-bold text-gray-900">Atrasado</h4>
                 <p className="text-gray-500 leading-relaxed">Lo que prometiste y no hiciste. Visible y separado, no desaparece.</p>
              </div>
              <div className="bg-orange-50/30 p-6 border-t border-orange-100 flex flex-col gap-3">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 flex justify-between items-center">
                    <div>
                       <div className="text-sm font-bold">Firma Salud</div>
                       <div className="text-xs text-gray-500">Carlos M.</div>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-1 rounded">AYER</span>
                 </div>
              </div>
           </div>

           {/* Card 3: Limbo */}
           <div className="bento-card flex flex-col bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
              <div className="p-10 flex-1 flex flex-col gap-4">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold mb-4">03</div>
                 <h4 className="text-2xl font-bold text-gray-900">Sin Agendar</h4>
                 <p className="text-gray-500 leading-relaxed">Los prospectos que quedaron en el limbo. Son los que se caen.</p>
              </div>
              <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col gap-3 opacity-60">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-dashed flex justify-between items-center">
                    <div>
                       <div className="text-sm font-bold">Prospecto Vida</div>
                       <div className="text-xs text-gray-500">Laura G.</div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold border px-1 rounded">LIMBO</span>
                 </div>
              </div>
           </div>

        </div>

        <div className="mt-32 text-center border-t border-gray-200 pt-12 w-full">
           <h3 className="text-2xl font-medium text-gray-400">Las reglas las defines tú. El orden lo mantiene el sistema.</h3>
        </div>

      </div>
    </section>
  );
}
