"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function ConceptBAccordion() {
  const [active, setActive] = useState(1);
  const container = useRef<HTMLDivElement>(null);

  const zones = [
    {
      id: 1,
      num: "01",
      title: "Vence Hoy",
      desc: "Las tareas con fecha de hoy, arriba y en orden. Decidir cada mañana a quién llamar primero sigue siendo tu trabajo, y con ochenta prospectos armar ese día toma más tiempo que hacer las llamadas. Al entrar, ese día ya está armado.",
      color: "var(--color-brand-blue)",
      ui: (
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl flex flex-col gap-3 ml-auto">
           <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-blue)]">Hoy</span>
           </div>
           <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
              <div>
                 <div className="text-sm font-bold text-gray-900">Renovación Auto</div>
                 <div className="text-xs text-gray-500">Juan Pérez</div>
              </div>
              <span className="text-xs font-bold text-blue-600">10:00</span>
           </div>
        </div>
      )
    },
    {
      id: 2,
      num: "02",
      title: "Atrasado",
      desc: "Lo que se pasó de fecha. Lo que prometiste y no hiciste, separado y visible. No desaparece.",
      color: "var(--color-brand-orange)",
      ui: (
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl flex flex-col gap-3 ml-auto">
           <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-orange)]">Atrasado</span>
           </div>
           <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex justify-between items-center">
              <div>
                 <div className="text-sm font-bold text-gray-900">Firma Salud</div>
                 <div className="text-xs text-gray-500">Carlos M.</div>
              </div>
              <span className="text-xs font-bold text-orange-600 uppercase bg-white px-2 py-1 rounded">Ayer</span>
           </div>
        </div>
      )
    },
    {
      id: 3,
      num: "03",
      title: "Sin Agendar",
      desc: "Lo que no tiene siguiente paso. Los prospectos que quedaron sin nada agendado. Son los que se caen.",
      color: "#9ca3af",
      ui: (
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl flex flex-col gap-3 ml-auto opacity-70 border-dashed">
           <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Limbo</span>
           </div>
           <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                 <div className="text-sm font-bold text-gray-900">Prospecto Vida</div>
                 <div className="text-xs text-gray-500">Laura G.</div>
              </div>
           </div>
        </div>
      )
    }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Animamos el acordeón activo.
      zones.forEach((zone) => {
        const el = document.getElementById(`acc-content-${zone.id}`);
        if (el) {
          if (active === zone.id) {
            gsap.to(el, { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" });
          } else {
            gsap.to(el, { height: 0, opacity: 0, duration: 0.5, ease: "power2.out" });
          }
        }
      });
    }, container);
    return () => ctx.revert();
  }, [active]);

  return (
    <section ref={container} className="w-full bg-[var(--color-surface-BG-base)] pt-32 pb-12 border-t border-[var(--color-border-Strokes-default)] min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col">
        
        {/* Intro Texto Resumido */}
        <div className="max-w-4xl mb-24">
          <h2 className="text-sm font-mono text-[var(--color-brand-blue)] tracking-widest uppercase mb-6">La Diferencia</h2>
          <h3 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1] text-gray-900">
            Un CRM te muestra a quién tienes.<br/>
            GO CRM te da <span className="text-[var(--color-brand-blue)]">tu día armado.</span>
          </h3>
        </div>

        {/* Accordion */}
        <div className="w-full border-t border-gray-200">
           {zones.map((zone) => {
              const isActive = active === zone.id;
              return (
                 <div 
                   key={zone.id} 
                   className="border-b border-gray-200 overflow-hidden transition-colors duration-500 cursor-pointer hover:bg-gray-50/50"
                   onClick={() => setActive(zone.id)}
                 >
                    <div className="py-8 flex items-center gap-8">
                       <span className="text-sm font-mono text-gray-400">{zone.num}</span>
                       <span className={`text-3xl md:text-5xl font-medium tracking-tight transition-colors duration-500 ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                          {zone.title}
                       </span>
                    </div>
                    
                    <div id={`acc-content-${zone.id}`} className="overflow-hidden" style={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}>
                       <div className="pb-12 pt-4 flex flex-col md:flex-row gap-12 items-start justify-between">
                          <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
                             {zone.desc}
                          </p>
                          <div className="w-full md:w-1/2 flex justify-end">
                             {zone.ui}
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
