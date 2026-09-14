"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function DayVsListGoCrm() {
  const t = useTranslations("goCrm.dayVsList");
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Very simple scroll triggers to light up the UI zones
      // We don't hijack the scroll. We just listen to it.
      const steps = gsap.utils.toArray<HTMLElement>(".text-step");
      const zones = [".ui-zone-1", ".ui-zone-2", ".ui-zone-3"];
      const colors = ["var(--color-brand-blue)", "var(--color-brand-orange)", "var(--color-border-Strokes-strong)"];

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%", // When the text step reaches the middle of the screen
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              // Dim the text of other steps
              gsap.to(steps, { opacity: 0.3, duration: 0.4 });
              gsap.to(step, { opacity: 1, duration: 0.4 });

              // Illuminate the corresponding UI Zone
              gsap.to(zones, { backgroundColor: "transparent", color: "var(--color-text-muted)", duration: 0.4 });
              gsap.to(zones[i], { backgroundColor: colors[i], color: "#ffffff", duration: 0.4 });
            }
          }
        });
      });

    }, container);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] border-t border-[var(--color-border-Strokes-default)]">
      
      {/* Valle Section - Generous spacing, calm flow */}
      <div className="max-w-section-lg mx-auto px-gutter-md md:px-gutter-xl py-section-2xl">
        
        {/* Intro - Clean Editorial Typography */}
        <div className="mb-section-xl">
          <h2 className="font-mono text-ui-label tracking-widest uppercase text-[var(--color-text-muted)] mb-8">
            {t("overline")}
          </h2>
          <h3 className="text-display-lg md:text-display-xl font-medium tracking-tight leading-[1.1] mb-12 max-w-4xl">
            {t.rich("h2", { blue: (chunks) => <span className="text-[var(--color-brand-blue)]">{chunks}</span> })}
          </h3>
          <div className="max-w-3xl flex flex-col md:flex-row gap-8 pt-8 border-t border-[var(--color-border-Strokes-default)]">
            <p className="text-body-lg text-[var(--color-text-secondary)] flex-1 leading-relaxed">
              {t("p1")}
            </p>
            <p className="text-body-lg text-[var(--color-text-primary)] font-medium flex-1 leading-relaxed">
              {t("p2")}
            </p>
          </div>
        </div>

        {/* The Split Layout */}
        <div className="flex flex-col md:flex-row items-start gap-fluid-lg relative">
          
          {/* LEFT: Pinned Abstract Swiss UI */}
          <div className="w-full md:w-1/2 sticky top-32 z-10">
            {/* The Swiss Graphic */}
            <div className="w-full aspect-[4/3] md:aspect-square border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col">
               
               {/* Header of graphic */}
               <div className="h-16 md:h-20 border-b border-[var(--color-border-Strokes-default)] flex items-center justify-between px-6 md:px-8">
                  <span className="text-h5 md:text-h4 font-medium tracking-tight">Agenda</span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">14.02.2026</span>
               </div>

               {/* Zone 1: Hoy */}
               <div className="ui-zone-1 flex-1 border-b border-[var(--color-border-Strokes-default)] flex items-center text-[var(--color-text-muted)] transition-colors">
                  <div className="w-16 md:w-24 h-full border-r border-[var(--color-border-Strokes-default)] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest -rotate-90 md:rotate-0">
                     01 / Hoy
                  </div>
                  <div className="flex-1 px-6 md:px-12 flex items-center">
                     <div className="w-full h-px bg-current opacity-30 relative">
                        <div className="absolute top-1/2 left-0 h-[3px] bg-current w-1/3 -translate-y-1/2" />
                        <div className="absolute top-1/2 right-1/4 h-[4px] w-[4px] bg-current rounded-full -translate-y-1/2" />
                     </div>
                  </div>
               </div>

               {/* Zone 2: Atrasado */}
               <div className="ui-zone-2 flex-1 border-b border-[var(--color-border-Strokes-default)] flex items-center text-[var(--color-text-muted)] transition-colors">
                  <div className="w-16 md:w-24 h-full border-r border-[var(--color-border-Strokes-default)] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest -rotate-90 md:rotate-0">
                     02 / Ayer
                  </div>
                  <div className="flex-1 px-6 md:px-12 flex items-center">
                     <div className="w-full h-px bg-current opacity-30 relative">
                        <div className="absolute top-1/2 left-1/4 h-[3px] bg-current w-1/4 -translate-y-1/2" />
                     </div>
                  </div>
               </div>

               {/* Zone 3: Sin Paso */}
               <div className="ui-zone-3 flex-1 flex items-center text-[var(--color-text-muted)] transition-colors">
                  <div className="w-16 md:w-24 h-full border-r border-[var(--color-border-Strokes-default)] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest -rotate-90 md:rotate-0">
                     03 / Limbo
                  </div>
                  <div className="flex-1 px-6 md:px-12 flex items-center">
                     <div className="w-full h-px border-t border-dashed border-current opacity-30 relative">
                        <div className="absolute top-1/2 right-0 h-[6px] w-[6px] border border-current bg-transparent -translate-y-1/2" />
                     </div>
                  </div>
               </div>

            </div>
          </div>

          {/* RIGHT: Flowing Text Steps (Standard Scroll) */}
          <div className="w-full md:w-1/2 flex flex-col pt-[50vh] md:pt-0 pb-[20vh] md:pb-[50vh]">
            
            {/* Step 1 */}
            <div className="text-step mb-[30vh] opacity-30">
               <div className="text-h6 font-mono text-[var(--color-brand-blue)] mb-6 border-b border-[var(--color-border-Strokes-default)] inline-block pb-2 tracking-widest uppercase">
                  Paso 01
               </div>
               <h4 className="text-display-sm font-medium tracking-tight mb-6 uppercase leading-tight text-[var(--color-text-primary)]">
                  {t("step1Title")}
               </h4>
               <p className="text-body-xl leading-relaxed text-[var(--color-text-secondary)]">
                  {t("step1Desc")}
               </p>
            </div>

            {/* Step 2 */}
            <div className="text-step mb-[30vh] opacity-30">
               <div className="text-h6 font-mono text-[var(--color-brand-orange)] mb-6 border-b border-[var(--color-border-Strokes-default)] inline-block pb-2 tracking-widest uppercase">
                  Paso 02
               </div>
               <h4 className="text-display-sm font-medium tracking-tight mb-6 uppercase leading-tight text-[var(--color-text-primary)]">
                  {t("step2Title")}
               </h4>
               <p className="text-body-xl leading-relaxed text-[var(--color-text-secondary)]">
                  {t("step2Desc")}
               </p>
            </div>

            {/* Step 3 */}
            <div className="text-step opacity-30">
               <div className="text-h6 font-mono text-[var(--color-text-muted)] mb-6 border-b border-[var(--color-border-Strokes-default)] inline-block pb-2 tracking-widest uppercase">
                  Paso 03
               </div>
               <h4 className="text-display-sm font-medium tracking-tight mb-6 uppercase leading-tight text-[var(--color-text-primary)]">
                  {t("step3Title")}
               </h4>
               <p className="text-body-xl leading-relaxed text-[var(--color-text-secondary)]">
                  {t("step3Desc")}
               </p>
            </div>

          </div>

        </div>

        {/* Cierre */}
        <div className="border-t border-[var(--color-border-Strokes-default)] pt-section-md mt-section-md">
           <h3 className="text-display-sm font-medium tracking-tight text-[var(--color-text-primary)] max-w-2xl">
             {t("cierre")}
           </h3>
        </div>

      </div>
    </section>
  );
}
