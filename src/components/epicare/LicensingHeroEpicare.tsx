"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import HeaderEpicare from './HeaderEpicare';
import { EASE, DUR, STAGGER, REVEAL } from '@/lib/motion';
import InteractiveGlobeEpicare from './InteractiveGlobeEpicare';

/** Minimalist Down Arrow for the CTA buttons */
const ArrowDownMinimal = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

/** Minimalist Info Icon for the secondary button */
const InfoIcon = ({ className = '' }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default function LicensingHeroEpicare() {
  const t = useTranslations('landingV2.licensingHero');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    let tl: gsap.core.Timeline;

    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set('.licensing-title-line', {
        yPercent: REVEAL.birthPercent,
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)",
      });

      gsap.set('.licensing-text', { opacity: 0, y: REVEAL.md });

      gsap.set('.licensing-globe-wrap', {
        opacity: 0,
        y: REVEAL.lg,
        scale: 0.96,
        filter: `blur(${REVEAL.blurBase}px)`
      });
      
      gsap.set('.licensing-btn', { opacity: 0, scale: 0.8, x: -REVEAL.sm });

      // 2. Entrance Timeline (Synced with Globe & Loader)
      tl = gsap.timeline({ paused: true });

      tl.to('.licensing-title-line', {
        yPercent: 0,
        opacity: 1,
        clipPath: "inset(-20% -10% -20% -10%)",
        duration: 0.8,
        ease: EASE.dramatic,
        willChange: "transform, opacity, clip-path",
        clearProps: "clipPath,willChange"
      });

      tl.to('.licensing-text', {
        opacity: 1,
        y: 0,
        duration: DUR.base,
        ease: EASE.out,
        willChange: "transform, opacity",
        clearProps: "willChange"
      }, "-=0.6");

      tl.to('.licensing-globe-wrap', {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: DUR.slow,
        ease: EASE.dramatic,
        willChange: "transform, opacity, filter",
        clearProps: "filter,willChange"
      }, "-=0.8");

      tl.to('.licensing-btn', {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: DUR.base,
        ease: EASE.snap,
        stagger: STAGGER.base,
        willChange: "transform, opacity",
        clearProps: "willChange"
      }, "-=0.8");

    }, el);

    const playHeroEntrance = () => {
      requestAnimationFrame(() => {
        if (tl && tl.paused()) tl.play();
      });
    };

    if ((window as any).epicareGlobeIsReady) {
      playHeroEntrance();
    } else {
      window.addEventListener('epicareGlobeReady', playHeroEntrance, { once: true });
    }

    // Safety fallback: If something fails, play anyway after 5 seconds
    const fallbackId = setTimeout(playHeroEntrance, 5000);

    return () => {
      window.removeEventListener('epicareGlobeReady', playHeroEntrance);
      clearTimeout(fallbackId);
      ctx.revert();
    };
  }, []);

  const handleScrollToLicenses = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo('#interactive-globe', { offset: -80, duration: 1.2 });
    }
  };

  return (
    <div className="w-full bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] transition-colors duration-500">
      
      <HeaderEpicare isHeaderPill={false} isHeaderForcedDark={false} />

      <section 
        ref={containerRef} 
        className="relative w-full py-section-md px-gutter-sm md:px-gutter-md"
      >
        <div className="grid-layout max-w-section-xl mx-auto w-full gap-y-static-2xl md:gap-y-static-md">
          
          {/* ROW 1: TITLE */}
          <div className="col-span-12 md:col-start-5 md:col-span-9 md:row-start-1 z-10 flex flex-row justify-start items-start md:pb-section-lg">
            <h1 className="licensing-title-line text-display-2xl md:text-display-3xl text-left text-[var(--color-text-primary)] font-semibold leading-[0.9] tracking-tight">
              {t('title')}
            </h1>
          </div>

          {/* ROW 2: TEXT & BUTTONS (Wrapped for mobile flex, contents for desktop grid) */}
          <div className="col-span-12 flex flex-row justify-between items-end gap-5 md:contents">
            {/* TEXT */}
            <div className="flex-1 md:col-start-1 md:col-span-4 md:row-start-2 z-10 flex flex-row justify-start items-end md:items-start pb-0 md:pr-8">
              <p className="licensing-text text-subtitle text-left text-[var(--color-text-secondary)] font-light">
                Epicare Insurance holds the necessary <span className="font-medium text-[var(--color-action-primary-bg)]">state licenses</span> to conduct insurance business. All insurance transactions are carried out through <span className="font-medium text-[var(--color-action-primary-bg)]">licensed agents</span> in compliance with state regulations.
              </p>
            </div>
            
            {/* BUTTONS */}
            <div className="flex-none md:col-start-5 md:col-span-1 md:row-start-2 z-10 flex flex-col justify-end md:justify-start items-end md:items-start pb-0">
              <button 
                onClick={handleScrollToLicenses}
                className="licensing-btn group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-elevation-4 active:scale-95"
                aria-label="Scroll to Licenses"
              >
                <div className="absolute inset-0 rounded-full border border-white/20 scale-100 group-hover:scale-[1.15] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
                <span className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
                  {/* Arrow Leaving (Down) */}
                  <ArrowDownMinimal className="absolute w-5 h-5 transition-transform duration-[600ms] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:translate-y-10" />
                  {/* Arrow Entering (From Top) */}
                  <ArrowDownMinimal className="absolute w-5 h-5 -translate-y-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:translate-y-0" />
                </span>
              </button>
            </div>
          </div>

          {/* ROW 2: VISUAL (3D Globe) */}
          {/* start: 7, span: 6 */}
          {/* Contenedor relativo que toma el espacio del grid sin cortar */}
          <div className="licensing-globe-wrap col-span-12 md:col-start-7 md:col-span-6 md:row-start-2 z-0 relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
            {/* Canvas absoluto masivo (1100px desktop, 800px mobile). Al ser un cuadrado gigantesco absoluto, 
                garantizamos que la esfera 3D JAMÁS toque los bordes del canvas WebGL y se corte abruptamente.
                El overflow-x-hidden de page.tsx se encarga de que simplemente sangre suavemente fuera de la pantalla. */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-y-[40%] md:w-[1100px] md:h-[1100px] w-[800px] h-[800px] pointer-events-auto z-10">
              <InteractiveGlobeEpicare isWidget={true} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
