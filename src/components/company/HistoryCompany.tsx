"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HistoryCompany() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });

      // Animación de la caja (se revela de izquierda a derecha sin distorsionar los bordes)
      tl.fromTo(".history-box", 
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut", stagger: 0.2 }
      );

      // Fade in suave del contenido (los párrafos inferiores)
      tl.fromTo(".history-text", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power2.out", stagger: 0.2 },
        "-=1.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#F1EEE5] text-[#111111] z-20 flex flex-col py-[20vh]"
    >
      <div className="w-full px-[12vw] grid grid-cols-12 gap-[24px]">
        
        {/* Título */}
        <div className="col-start-1 col-end-10 mb-[8vh]">
          <h2 className="text-[clamp(3rem,4.5vw,5rem)] leading-[1.05] tracking-tight font-medium" style={{ fontFamily: 'var(--font-display-stack)' }}>
            The story behind the foundation.
          </h2>
        </div>

      </div>

      {/* Tres Columnas Editoriales Simétricas */}
      <div className="w-full px-[12vw] grid grid-cols-12 gap-[24px]">
        
        {/* 01: BEFORE 2021 */}
        <div className="col-start-1 col-end-5 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="w-full max-w-[92%] border border-[#111111]/10 py-3 px-4 history-box will-change-[clip-path]">
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#111111]/50">01 · BEFORE 2021 · THE PROBLEM</p>
            </div>
            <p className="text-[18px] leading-[1.6] text-[#4A5258] font-medium max-w-[92%] history-text will-change-[transform,opacity] transform-gpu" style={{ fontFamily: 'var(--font-body-stack)' }}>
              Insurance has always had a door, and not everyone gets the key. Jargon, small print, layers of middlemen. For an independent agent, that means competing against agencies many times their size, with fewer carriers, fewer tools and no marketing team behind them. For the client, it means coverage often depends on knowing someone, or speaking the right language. The market rewards big agencies. We didn't think it had to stay that way.
            </p>
          </div>
        </div>

        {/* 02: JUNE 2021 */}
        <div className="col-start-5 col-end-9 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="w-full max-w-[92%] border border-[#111111]/10 py-3 px-4 history-box will-change-[clip-path]">
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#111111]/50">02 · JUNE 2021 · THE DECISION</p>
            </div>
            <p className="text-[18px] leading-[1.6] text-[#4A5258] font-medium max-w-[92%] history-text will-change-[transform,opacity] transform-gpu" style={{ fontFamily: 'var(--font-body-stack)' }}>
              In June 2021, Epicare Insurance Corp started operating as a licensed insurance agency in Miami, Florida. The bet was simple: give the independent agent what only big agencies had. Technology that replaces a scattered stack. Marketing in English and Spanish that brings qualified opportunities. And industry support: carriers, contracting, compliance and training, with an expert team behind every case. Not as separate services, but as one foundation to build a book of business on, on the agent's terms.
            </p>
          </div>
        </div>

        {/* 03: TODAY */}
        <div className="col-start-9 col-end-13 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="w-full max-w-[92%] border border-[#111111]/10 py-3 px-4 history-box will-change-[clip-path]">
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#111111]/50">03 · TODAY · THE FOUNDATION</p>
            </div>
            <p className="text-[18px] leading-[1.6] text-[#4A5258] font-medium max-w-[92%] history-text will-change-[transform,opacity] transform-gpu" style={{ fontFamily: 'var(--font-body-stack)' }}>
              Today we serve all 50 states, the District of Columbia and Puerto Rico, with 130+ active carriers and a trademark registered with the USPTO. What started as one agency is now one system of five books: Insurance Corp, Plans, B2C Verticals, Epicare GO and Academy. Each has its own audience. All share the same standard. And the rule hasn't changed: we back the agent, we don't compete with them. We keep building.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
