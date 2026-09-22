"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import SlideCalendar from "./SlideCalendar";
import SlidePipeline from "./SlidePipeline";
import SlideVelocity from "./SlideVelocity";
import SlideOmnichannel from "./SlideOmnichannel";

export default function HorizontalMetricsGoCrm() {
  const containerRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      const sections = gsap.utils.toArray(".horizontal-slide");
      
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + wrapperRef.current!.offsetWidth,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[var(--color-surface-BG-1)] overflow-hidden border-t border-[var(--color-border-Strokes-default)]"
    >
      {/* Subtle Background Accent using Brand Tokens */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[var(--color-brand-blue)]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-brand-orange)]/5 blur-[80px]" />
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div ref={wrapperRef} className="flex h-full w-max">
        
        {/* ACT 1: TITLE (FLOATING) */}
        <div className="horizontal-slide w-[90vw] md:w-[45vw] shrink-0 flex flex-col justify-center px-gutter-md md:pl-gutter-xl pr-0">
           <div className="relative z-10 w-full max-w-xl">
             <span className="text-ui-label text-[var(--color-text-accent-blue)] uppercase tracking-widest mb-6 block">
               Real-Time Metrics & Control
             </span>
             <h2 className="text-display-lg font-bold text-[var(--color-text-primary)] leading-tight tracking-tight">
               Todo el pulso de tus ventas en un solo ecosistema.
             </h2>
             <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-1 bg-[var(--color-brand-blue)] rounded-full" />
                <span className="text-body-md text-[var(--color-text-muted)]">Explora los datos en vivo</span>
             </div>
           </div>
        </div>

        {/* ACT 2: CALENDAR */}
        <div className="horizontal-slide w-[95vw] md:w-[85vw] h-full shrink-0 flex items-center justify-center px-gutter-sm md:px-gutter-md">
           <SlideCalendar />
        </div>

        {/* ACT 3: PIPELINE */}
        <div className="horizontal-slide w-[95vw] md:w-[85vw] h-full shrink-0 flex items-center justify-center px-gutter-sm md:px-gutter-md">
           <SlidePipeline />
        </div>

        {/* ACT 4: VELOCITY */}
        <div className="horizontal-slide w-[95vw] md:w-[85vw] h-full shrink-0 flex items-center justify-center px-gutter-sm md:px-gutter-md">
           <SlideVelocity />
        </div>

        {/* ACT 5: OMNICHANNEL */}
        <div className="horizontal-slide w-[95vw] md:w-[85vw] h-full shrink-0 flex items-center justify-center px-gutter-sm md:px-gutter-xl pr-gutter-xl">
           <SlideOmnichannel />
        </div>
      </div>
    </section>
  );
}
