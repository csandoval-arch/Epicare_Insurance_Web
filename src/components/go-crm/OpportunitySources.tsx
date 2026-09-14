"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function OpportunitySources() {
  const t = useTranslations("goCrm.sources");
  const comp = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Highlight scrub logic for the text spans
      const textSpans = gsap.utils.toArray(".scrub-word") as HTMLElement[];
      
      gsap.fromTo(textSpans, 
        { opacity: 0.15 },
        { 
          opacity: 1, 
          stagger: 0.1, 
          ease: "none",
          scrollTrigger: {
            trigger: ".text-container",
            start: "top 60%",
            end: "bottom 50%",
            scrub: 0.5,
          }
        }
      );

      // Smooth rise for the CRM block
      gsap.fromTo(".crm-block",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", scrollTrigger: {
          trigger: ".crm-block",
          start: "top 85%"
        }}
      );

    }, comp);
    return () => ctx.revert();
  }, []);

  const renderNormal = (chunks: React.ReactNode) => {
    const text = Array.isArray(chunks) ? chunks.join("") : String(chunks);
    return (
      <span className="inline">
        {text.split(" ").map((w, i) => (
          <span key={i} className="scrub-word inline-block mr-[0.25em]">{w}</span>
        ))}
      </span>
    );
  };

  const renderBlue = (chunks: React.ReactNode) => {
    const text = Array.isArray(chunks) ? chunks.join("") : String(chunks);
    return (
      <span className="inline text-[var(--color-brand-blue)]">
        {text.split(" ").map((w, i) => (
          <span key={i} className="scrub-word inline-block mr-[0.25em]">{w}</span>
        ))}
      </span>
    );
  };

  return (
    <section ref={comp} className="relative w-full overflow-hidden bg-[var(--color-surface-BG-base)] text-slate-900 pb-section-md pt-section-md">
      
      {/* Calm Atmospheric Background Orbs (CSS only) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[var(--color-brand-blue)]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[var(--color-brand-orange)]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-gutter-md z-10">
        
        <div className="text-container mb-32 relative">
          <p className="text-meta uppercase font-mono tracking-[0.2em] text-slate-400 mb-12 text-center">
            {t("overline")}
          </p>
          
          <h2 className="text-display-sm md:text-display font-medium tracking-tight text-slate-900 leading-snug">
            {t.rich("description", {
              normal: renderNormal,
              blue: renderBlue
            })}
          </h2>
        </div>

      </div>
    </section>
  );
}
