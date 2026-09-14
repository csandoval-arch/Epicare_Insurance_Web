"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";

export default function CtaFinalSection() {
  const t = useTranslations('goAms.ctaFinal');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".cta-monolith, .cta-bg-img, .cta-eyebrow, .cta-title-line, .cta-desc, .cta-btn", {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: TRIGGER.standard,
          toggleActions: "play none none reverse"
        }
      });

      // 1. Contenedor Monolito (Scale up + Fade cinemático)
      tl.fromTo(
        ".cta-monolith",
        { opacity: 0, y: REVEAL.lg, scale: 0.96, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "willChange"
        }
      );

      // 2. Fondo (Zoom sutil cinemático)
      tl.fromTo(
        ".cta-bg-img",
        { scale: 1.12, willChange: "transform" },
        {
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "willChange"
        },
        "<"
      );

      // 3. Eyebrow
      tl.fromTo(
        ".cta-eyebrow",
        { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.fast,
          ease: EASE.out,
          clearProps: "willChange"
        },
        "<0.3" // Inicia 0.3s después de que empiece el fondo, cortando el delay
      );

      // 4. Título con GPU transform reveal
      tl.fromTo(
        ".cta-title-line",
        {
          yPercent: 120,
          opacity: 0,
          willChange: "transform, opacity"
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: DUR.base,
          stagger: STAGGER.base,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "all"
        },
        "<0.15" // Mucho más rápido, casi pegado al eyebrow
      );

      // 5. Descripción
      tl.fromTo(
        ".cta-desc",
        { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          clearProps: "willChange"
        },
        "<0.15"
      );

      // 6. Botones de Acción
      tl.fromTo(
        ".cta-btn",
        { opacity: 0, scale: 0.9, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: DUR.base,
          stagger: STAGGER.tight,
          ease: EASE.snap,
          force3D: true,
          clearProps: "willChange"
        },
        "<0.2"
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="cta-final"
      className="w-full relative bg-[var(--color-surface-BG-1)] pt-0 pb-section-xs md:pb-section-sm overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto pt-8 pb-8 md:pb-12 px-3.5 sm:px-4 md:px-8">
        <div className="cta-monolith relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-elevation-4 border border-white/10">
          
          {/* Fondo de Imagen con Parallax / Zoom Cinemático */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={asset("/Files/S14_cta_swiss_blue.webp")}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="cta-bg-img absolute inset-0 w-full h-full object-cover"
            />
            {/* Oscurecimiento para contraste óptimo */}
            <div className="absolute inset-0 bg-black/15" />
          </div>

          <div className="relative z-10 text-left md:text-center px-3.5 py-10 sm:px-6 sm:py-12 md:py-16 flex flex-col items-start md:items-center">
            
            <span className="cta-eyebrow text-meta font-mono tracking-widest text-white/60 mb-4 uppercase border-b border-white/20 pb-1">
              {t('eyebrow')}
            </span>
            
            {/* Título Line-by-Line */}
            <h2 className="text-display-lg md:text-display-xl font-display font-bold text-white leading-[0.92] tracking-tighter mb-4 drop-shadow-sm">
              <span className="block overflow-hidden pb-2">
                <span className="cta-title-line block">
                  {t('title1')} {t('title2')}
                </span>
              </span>
            </h2>
            
            <p className="cta-desc text-body-md sm:text-body-lg text-white/90 max-w-2xl mb-8 leading-relaxed">
              {t('desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-static-md md:gap-fluid-xs w-full justify-start md:justify-center max-w-md">
              {/* Primary CTA (Epicare Hero Style) */}
              <button className="cta-btn group w-full md:w-fit mr-auto md:mx-0 h-12 pl-6 pr-2 rounded-full flex items-center justify-between md:justify-start gap-3 bg-[var(--color-brand-blue)] text-[var(--color-surface-BG-base)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150">
                <span className="text-body-sm font-medium">{t('btnPrimary')}</span>
                <span className="relative w-8 h-8 rounded-full bg-[var(--color-surface-BG-base)] text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </span>
              </button>

              {/* Secondary CTA (Epicare Hero Style) */}
              <button className="cta-btn group w-full md:w-fit mr-auto md:mx-0 h-12 pl-6 pr-2 rounded-full flex items-center justify-between md:justify-start gap-3 bg-white/10 border border-white/20 text-white shadow-elevation-1 md:backdrop-blur-sm transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/20 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.96] active:opacity-80 active:duration-150">
                <span className="text-body-sm font-medium">{t('btnSecondary')}</span>
                <span className="relative w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center overflow-hidden shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </span>
              </button>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
}
