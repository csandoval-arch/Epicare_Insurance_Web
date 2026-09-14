"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER, SCRUB } from "@/lib/motion";
import { asset } from "@/lib/asset";

export default function PlatformRevealSection() {
  const t = useTranslations('goAms.platformReveal');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isBoFlipped, setIsBoFlipped] = useState(false);
  const [isQeFlipped, setIsQeFlipped] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".pr-title-line, .pr-subtitle, .shot-bo, .shot-qe", { 
          opacity: 1, 
          y: 0, 
          yPercent: 0, 
          scale: 1
        });
        return;
      }

      // 1. Título con GPU transform reveal (Arquetipo 2: Section Reveal)
      gsap.fromTo(
        ".pr-title-line",
        { yPercent: 120, opacity: 0, willChange: "transform, opacity" },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: STAGGER.base,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse"
          }
        }
      );

      // 2. Subtítulo suave
      gsap.fromTo(
        ".pr-subtitle",
        { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse"
          }
        }
      );

      // 3. Entrada Limpia de Screenshots (Wave Entry con GPU force3D)
      gsap.fromTo(
        ".shot-bo",
        { opacity: 0, scale: 0.96, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE.out,
          force3D: true,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(
        ".shot-qe",
        { opacity: 0, scale: 0.96, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: DUR.slow,
          delay: 0.12,
          ease: EASE.out,
          force3D: true,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse"
          }
        }
      );

      // 4. Parallax Interno de la Imagen (Suave y sin tirones)
      gsap.fromTo(".bg-parallax-inner", 
        { yPercent: -8, scale: 1.05 },
        {
          yPercent: 8,
          scale: 1,
          ease: EASE.none,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: SCRUB.smooth
          }
        }
      );

    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="s04 w-full pt-0 pb-section-md flex justify-center bg-[var(--color-surface-BG-base)] relative z-10 overflow-hidden"
    >
      <div className="w-full flex flex-col gap-static-2xl items-center">
        
        {/* Copy del Reveal */}
        <div className="text-left md:text-center w-full px-gutter-sm md:px-gutter-md max-w-section-lg flex flex-col gap-3 relative z-20">
          <h2 className="text-display-lg font-semibold text-[var(--color-text-primary)] drop-shadow-2xl">
            <span className="block overflow-hidden pb-1">
              <span className="pr-title-line block">{t('title1')}</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="pr-title-line block text-[var(--color-text-accent-blue)]">{t('title2')}</span>
            </span>
          </h2>
          <p className="pr-subtitle text-body-lg text-[var(--color-text-secondary)] mr-auto md:mx-auto max-w-section-xs">
            {t.rich('subtitle', {
              bold: (chunks) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>
            })}
          </p>
        </div>

        {/* 2 Screenshots Gigantes (Strictly Squares touching the edges) */}
        <div className="w-full flex flex-col md:flex-row justify-between gap-y-6 md:gap-y-0 px-gutter-sm md:px-0">
          
          {/* Screenshot Back Office Container */}
          <div className="shot-bo w-full md:w-[calc(50vw-0.5rem)] aspect-square relative shrink-0 [perspective:2000px]">
            
            {/* 3D Flipper Card (Entire card clickable on mobile) */}
            <div 
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setIsBoFlipped(!isBoFlipped);
                }
              }}
              style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transform: isBoFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              className="w-full h-full relative rounded-3xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group cursor-pointer md:cursor-default select-none"
            >
              
              {/* FRONT FACE */}
              <div 
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-[var(--color-surface-BG-black)] border border-[var(--color-border-Strokes-default)] shadow-elevation-2"
              >
                {/* Imagen con parallax interno */}
                <div 
                  className="bg-parallax-inner absolute top-[-10%] left-0 w-full h-[120%] bg-cover bg-center opacity-100" 
                  style={{ backgroundImage: `url('${asset('/Files/Go_AMS/platform/go-ams-backoffice.webp')}')` }}
                />
                
                {/* Pestaña flotante sobre la imagen */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center bg-[var(--color-surface-BG-1)]/90 backdrop-blur-md border border-t-0 border-[var(--color-border-Strokes-default)] rounded-none px-8 py-3 w-auto min-w-[180px] text-body-md font-semibold text-[var(--color-text-primary)] shadow-elevation-2 z-20 transition-transform duration-500 group-hover:-translate-y-full">
                  {t('boTab')}
                </div>

                {/* Desktop Hover Reveal Cards */}
                <div className="hidden md:flex absolute bottom-0 left-0 w-full p-2 gap-2 z-30 pointer-events-none group-hover:pointer-events-auto">
                  
                  {/* Card 1 */}
                  <div className="flex-1 aspect-square relative rounded-2xl lg:rounded-[1.5rem] border border-[var(--color-border-Strokes-default)] shadow-elevation-3 overflow-hidden transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[100ms] group-hover:delay-[0ms] pointer-events-auto flex flex-col hover:-translate-y-1">
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-[var(--color-surface-BG-1)]/80 backdrop-blur-xl" />
                      <div className="absolute inset-0 bg-white/5 saturate-150" />
                    </div>
                    <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[var(--color-brand-blue)]/10 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div>
                        <h3 className="text-body-md lg:text-body-lg font-semibold text-[var(--color-text-primary)] mb-1">{t('boCard1Title')}</h3>
                        <p className="text-body-sm text-[var(--color-text-secondary)] leading-snug">{t('boCard1Desc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex-1 aspect-square relative rounded-2xl lg:rounded-[1.5rem] border border-[var(--color-border-Strokes-default)] shadow-elevation-3 overflow-hidden transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[50ms] group-hover:delay-[75ms] pointer-events-auto flex flex-col hover:-translate-y-1">
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-[var(--color-surface-BG-1)]/80 backdrop-blur-xl" />
                      <div className="absolute inset-0 bg-white/5 saturate-150" />
                    </div>
                    <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[var(--color-brand-blue)]/10 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                      <div>
                        <h3 className="text-body-md lg:text-body-lg font-semibold text-[var(--color-text-primary)] mb-1">{t('boCard2Title')}</h3>
                        <p className="text-body-sm text-[var(--color-text-secondary)] leading-snug">{t('boCard2Desc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 (Visual Icon Card) */}
                  <div className="flex-1 aspect-square relative rounded-2xl lg:rounded-[1.5rem] border border-white/25 shadow-elevation-4 overflow-hidden transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[0ms] group-hover:delay-[150ms] pointer-events-auto hover:-translate-y-1 flex items-center justify-center group/card">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#35BBFD] via-[#0284C7] to-[#0369A1]" />
                    <div className="absolute inset-0 bg-noise opacity-15 mix-blend-overlay" />
                    <div className="relative z-10 flex h-full items-center justify-center">
                      <svg 
                        className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-md transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/card:scale-125 group-hover/card:-translate-y-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating Tilt Bubble for Mobile (Bottom Right) */}
                <div className="md:hidden absolute bottom-4 right-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-BG-1)]/90 backdrop-blur-md border border-[var(--color-border-Strokes-default)] shadow-elevation-3 text-ui-label text-[var(--color-text-primary)]">
                  <span className="text-meta font-mono uppercase tracking-wider font-semibold">{t('tiltLabel')}</span>
                  <div className="w-6 h-6 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 animate-[spin_6s_linear_infinite]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* BACK FACE (Liquid Glass Architecture - 2 Full Height Cards) */}
              <div 
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)' 
                }}
                className="absolute inset-0 w-full h-full p-3.5 sm:p-5 rounded-3xl border border-white/20 dark:border-white/10 shadow-elevation-3 flex items-center justify-center overflow-hidden z-30"
              >
                {/* Liquid Glass Background Layers (Slightly lighter & luminous) */}
                <div className="absolute inset-0 -z-10 bg-[var(--color-surface-BG-1)]">
                  {/* Blurred screenshot in background for authentic depth */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl scale-125 opacity-45" 
                    style={{ backgroundImage: `url('${asset('/Files/Go_AMS/platform/go-ams-backoffice.webp')}')` }}
                  />
                  <div className="absolute inset-0 bg-[var(--color-surface-BG-1)]/60 backdrop-blur-2xl" />
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  {/* Subtle Aura Glow */}
                  <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 bg-[var(--color-brand-blue)]/25 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* 2 Full-Height Cards */}
                <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-4 w-full h-full">
                  
                  {/* Card 1 */}
                  <div className="relative h-full rounded-2xl border border-white/25 dark:border-white/15 bg-white/15 dark:bg-white/[0.07] backdrop-blur-xl shadow-elevation-2 p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[var(--color-brand-blue)]/20 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0 border border-[var(--color-brand-blue)]/30 mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-auto">
                      <h3 className="text-body-md sm:text-body-lg font-semibold text-[var(--color-text-primary)] leading-snug">
                        {t('boCard1Title')}
                      </h3>
                      <p className="text-body-xs sm:text-body-sm text-[var(--color-text-secondary)] leading-normal">
                        {t('boCard1Desc')}
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="relative h-full rounded-2xl border border-white/25 dark:border-white/15 bg-white/15 dark:bg-white/[0.07] backdrop-blur-xl shadow-elevation-2 p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[var(--color-brand-blue)]/20 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0 border border-[var(--color-brand-blue)]/30 mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-auto">
                      <h3 className="text-body-md sm:text-body-lg font-semibold text-[var(--color-text-primary)] leading-snug">
                        {t('boCard2Title')}
                      </h3>
                      <p className="text-body-xs sm:text-body-sm text-[var(--color-text-secondary)] leading-normal">
                        {t('boCard2Desc')}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* Screenshot Quote & Enroll Container */}
          <div className="shot-qe w-full md:w-[calc(50vw-0.5rem)] aspect-square relative shrink-0 [perspective:2000px]">
            
            {/* 3D Flipper Card (Entire card clickable on mobile) */}
            <div 
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setIsQeFlipped(!isQeFlipped);
                }
              }}
              style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transform: isQeFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              className="w-full h-full relative rounded-3xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group cursor-pointer md:cursor-default select-none"
            >
              
              {/* FRONT FACE */}
              <div 
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-[var(--color-surface-BG-black)] border border-[var(--color-border-Strokes-default)] shadow-elevation-2"
              >
                {/* Imagen con parallax interno */}
                <div 
                  className="bg-parallax-inner absolute top-[-10%] left-0 w-full h-[120%] bg-center opacity-100" 
                  style={{ backgroundImage: `url('${asset('/Files/Go_AMS/platform/go-ams-quote-enroll.webp')}')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
                />
                
                {/* Pestaña flotante sobre la imagen */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center bg-[var(--color-surface-BG-1)]/90 backdrop-blur-md border border-t-0 border-[var(--color-border-Strokes-default)] rounded-none px-8 py-3 w-auto min-w-[180px] text-body-md font-semibold text-[var(--color-text-primary)] shadow-elevation-2 z-20 transition-transform duration-500 group-hover:-translate-y-full">
                  {t('qeTab')}
                </div>

                {/* Desktop Hover Reveal Cards */}
                <div className="hidden md:flex absolute bottom-0 left-0 w-full p-2 gap-2 z-30 pointer-events-none group-hover:pointer-events-auto">
                  
                  {/* Card 1 */}
                  <div className="flex-1 aspect-square relative rounded-2xl lg:rounded-[1.5rem] border border-[var(--color-border-Strokes-default)] shadow-elevation-3 overflow-hidden transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[100ms] group-hover:delay-[0ms] pointer-events-auto flex flex-col hover:-translate-y-1">
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-[var(--color-surface-BG-1)]/80 backdrop-blur-xl" />
                      <div className="absolute inset-0 bg-white/5 saturate-150" />
                    </div>
                    <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[var(--color-brand-blue)]/10 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-body-md lg:text-body-lg font-semibold text-[var(--color-text-primary)] mb-1">{t('qeCard1Title')}</h3>
                        <p className="text-body-sm text-[var(--color-text-secondary)] leading-snug">{t('qeCard1Desc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex-1 aspect-square relative rounded-2xl lg:rounded-[1.5rem] border border-[var(--color-border-Strokes-default)] shadow-elevation-3 overflow-hidden transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[50ms] group-hover:delay-[75ms] pointer-events-auto flex flex-col hover:-translate-y-1">
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-[var(--color-surface-BG-1)]/80 backdrop-blur-xl" />
                      <div className="absolute inset-0 bg-white/5 saturate-150" />
                    </div>
                    <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[var(--color-brand-blue)]/10 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-body-md lg:text-body-lg font-semibold text-[var(--color-text-primary)] mb-1">{t('qeCard2Title')}</h3>
                        <p className="text-body-sm text-[var(--color-text-secondary)] leading-snug">{t('qeCard2Desc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 (Visual Icon Card) */}
                  <div className="flex-1 aspect-square relative rounded-2xl lg:rounded-[1.5rem] border border-white/25 shadow-elevation-4 overflow-hidden transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[0ms] group-hover:delay-[150ms] pointer-events-auto hover:-translate-y-1 flex items-center justify-center group/card">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#35BBFD] via-[#0284C7] to-[#0369A1]" />
                    <div className="absolute inset-0 bg-noise opacity-15 mix-blend-overlay" />
                    <div className="relative z-10 flex h-full items-center justify-center">
                      <svg 
                        className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-md transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/card:scale-125 group-hover/card:-translate-y-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating Tilt Bubble for Mobile (Bottom Right) */}
                <div className="md:hidden absolute bottom-4 right-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-BG-1)]/90 backdrop-blur-md border border-[var(--color-border-Strokes-default)] shadow-elevation-3 text-ui-label text-[var(--color-text-primary)]">
                  <span className="text-meta font-mono uppercase tracking-wider font-semibold">{t('tiltLabel')}</span>
                  <div className="w-6 h-6 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 animate-[spin_6s_linear_infinite]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* BACK FACE (Liquid Glass Architecture - 2 Full Height Cards) */}
              <div 
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)' 
                }}
                className="absolute inset-0 w-full h-full p-3.5 sm:p-5 rounded-3xl border border-white/20 dark:border-white/10 shadow-elevation-3 flex items-center justify-center overflow-hidden z-30"
              >
                {/* Liquid Glass Background Layers (Slightly lighter & luminous) */}
                <div className="absolute inset-0 -z-10 bg-[var(--color-surface-BG-1)]">
                  {/* Blurred screenshot in background for authentic depth */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl scale-125 opacity-45" 
                    style={{ backgroundImage: `url('${asset('/Files/Go_AMS/platform/go-ams-quote-enroll.webp')}')` }}
                  />
                  <div className="absolute inset-0 bg-[var(--color-surface-BG-1)]/60 backdrop-blur-2xl" />
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  {/* Subtle Aura Glow */}
                  <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 bg-[var(--color-brand-blue)]/25 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* 2 Full-Height Cards */}
                <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-4 w-full h-full">
                  
                  {/* Card 1 */}
                  <div className="relative h-full rounded-2xl border border-white/25 dark:border-white/15 bg-white/15 dark:bg-white/[0.07] backdrop-blur-xl shadow-elevation-2 p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[var(--color-brand-blue)]/20 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0 border border-[var(--color-brand-blue)]/30 mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-auto">
                      <h3 className="text-body-md sm:text-body-lg font-semibold text-[var(--color-text-primary)] leading-snug">
                        {t('qeCard1Title')}
                      </h3>
                      <p className="text-body-xs sm:text-body-sm text-[var(--color-text-secondary)] leading-normal">
                        {t('qeCard1Desc')}
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="relative h-full rounded-2xl border border-white/25 dark:border-white/15 bg-white/15 dark:bg-white/[0.07] backdrop-blur-xl shadow-elevation-2 p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[var(--color-brand-blue)]/20 flex items-center justify-center text-[var(--color-brand-blue)] shrink-0 border border-[var(--color-brand-blue)]/30 mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-auto">
                      <h3 className="text-body-md sm:text-body-lg font-semibold text-[var(--color-text-primary)] leading-snug">
                        {t('qeCard2Title')}
                      </h3>
                      <p className="text-body-xs sm:text-body-sm text-[var(--color-text-secondary)] leading-normal">
                        {t('qeCard2Desc')}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
