"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations, useLocale } from 'next-intl';
import HeaderEpicare from './HeaderEpicare';
import { asset } from "@/lib/asset";

const ArrowUR = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

export default function HeroEpicare() {
  const t = useTranslations('landingV2.hero');
  const locale = useLocale();
  const [activeVersion, setActiveVersion] = useState<'v1' | 'v2'>('v2'); // Inicia en v2 para ver el rediseño inmediatamente

  return (
    <>
      {/* Debug Panel para cambiar entre versiones (Minimizado / Shrinked) */}
      <div className="fixed bottom-2 left-2 z-[9999] opacity-20 hover:opacity-100 transition-all duration-300 scale-[0.6] hover:scale-100 origin-bottom-left">
        <div className="bg-[#151617]/90 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center gap-1 shadow-2xl">
          <button 
            onClick={() => setActiveVersion('v1')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide transition-all ${activeVersion === 'v1' ? 'bg-[#35BBFD] text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            V1 (Original)
          </button>
          <button 
            onClick={() => setActiveVersion('v2')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide transition-all ${activeVersion === 'v2' ? 'bg-[#35BBFD] text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            V2 (Cut)
          </button>
        </div>
      </div>

      {activeVersion === 'v1' ? <HeroEpicareV1 t={t} /> : <HeroEpicareV2 t={t} locale={locale} />}
    </>
  );
}

function HeroEpicareV1({ t }: { t: any }) {
  const [isDark, setIsDark] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHeaderForcedDark, setIsHeaderForcedDark] = useState(false);
  const [isHeaderPill, setIsHeaderPill] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const bigLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    const isDarkTheme = document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);

    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(scrollLineRef.current, 
        { yPercent: -100 }, 
        { yPercent: 100, duration: 1.5, ease: "power2.inOut", repeat: -1 }
      );

      gsap.set(heroContentRef.current, { pointerEvents: 'none' });
      gsap.set('.hero-anim-item', { opacity: 0, y: 60, clipPath: "inset(0% 0% 100% 0%)", willChange: "transform, opacity, clip-path" });
      gsap.set('.hero-anim-grow', { opacity: 0, y: 30, scale: 0.92, willChange: "transform, opacity" });
      gsap.set(vignetteRef.current, { opacity: 0 });

      const mm = gsap.matchMedia();
      mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" }, (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=250%", 
            pin: true,
            scrub: 1, 
            onUpdate: (self) => {
              setIsExpanded(self.progress > 0.05);
              setIsHeaderForcedDark(self.progress >= 0.35 && self.progress < 0.95);
              const isMobileCheck = window.innerWidth < 768;
              if (isMobileCheck) {
                setIsHeaderPill(self.progress >= 0.85);
              } else {
                setIsHeaderPill(self.progress >= 0.55);
              }
            }
          }
        });

        tl.to(scrollIndicatorRef.current, { opacity: 0, y: 20, duration: 0.3, ease: "power2.out" }, 0);
        tl.to(bigLogoRef.current, { opacity: 0, y: -30, duration: 0.3, ease: "power2.out" }, 0);

        if (isMobile) {
          gsap.set(videoWrapperRef.current, {
            position: "absolute", bottom: 0, left: 0, right: 0, margin: "0 auto",
            width: "85%", height: "85vh", scale: 1, transformOrigin: "bottom center",
            borderRadius: "32px", boxShadow: "none", force3D: false, willChange: "width, height, border-radius"
          });
          tl.to(videoWrapperRef.current, { width: "100%", height: "100vh", borderRadius: "0px", duration: 1, ease: "power2.inOut" }, 0);
        } else {
          gsap.set(videoWrapperRef.current, { clipPath: "none" });
          tl.to(videoWrapperRef.current, {
            width: "100%", maxWidth: "100%", height: "100vh", borderRadius: "0px",
            rotationX: 0, rotationY: 0, x: 0, y: 0, borderWidth: "0px", boxShadow: "0 0px 0px rgba(0,0,0,0)",
            force3D: true, duration: 1, ease: "power2.inOut"
          }, 0);
        }

        tl.to(vignetteRef.current, { opacity: 1, duration: 1, ease: "power2.inOut" }, 0);
        tl.to(heroContentRef.current, { pointerEvents: "auto", duration: 0.1 }, 0.6);
        tl.to('.hero-anim-item', { opacity: 1, y: 0, clipPath: "inset(-20% -10% -20% -10%)", duration: 0.8, ease: "power4.out", stagger: 0.15 }, 0.6);
        tl.to('.hero-anim-grow', { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 0.8);
        tl.to({}, { duration: 0.8 });
      });

    }, el);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isExpanded || !videoWrapperRef.current || window.innerWidth < 768) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPos = (clientX / innerWidth - 0.5) * 2;
    const yPos = (clientY / innerHeight - 0.5) * 2;
    gsap.to(videoWrapperRef.current, { rotationY: xPos * 3, rotationX: -yPos * 3, x: xPos * 8, y: yPos * 8, ease: 'power2.out', duration: 0.6 });
  };

  const handleMouseLeave = () => {
    if (isExpanded || !videoWrapperRef.current || window.innerWidth < 768) return;
    gsap.to(videoWrapperRef.current, { rotationY: 0, rotationX: 0, x: 0, y: 0, ease: 'power3.out', duration: 1 });
  };

  return (
    <div className="w-full bg-[var(--color-surface-BG-base)]">
      <HeaderEpicare isHeaderPill={isHeaderPill} isHeaderForcedDark={isHeaderForcedDark} scrollSafeZone={150} />
      <div ref={containerRef} className="w-full relative z-10 bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)]">
        <div 
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-end bg-[var(--color-surface-BG-base)]"
          style={{ perspective: "1200px" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={videoWrapperRef} 
            className="relative w-[calc(100vw-64px)] md:w-[85vw] lg:w-[1100px] max-w-[100%] h-[85vh] md:h-[70vh] rounded-t-[2rem] rounded-b-none overflow-hidden shadow-elevation-2 bg-[var(--color-surface-BG-black)] will-change-transform z-0"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom center' }}
          >
            <video autoPlay loop muted playsInline poster={asset("/Files/Epicare_Landing/Hero/posters/Hero_02.webp")} aria-hidden="true" className="absolute inset-0 w-full h-full object-cover md:mix-blend-screen scale-[1.05]">
              <source src={asset("/Files/Epicare_Landing/Hero/Hero_02.mp4")} type="video/mp4" />
            </video>
            <div ref={bigLogoRef} className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center pointer-events-none">
              <img src={asset("/epicare_logo.svg")} alt="Epicare" className="w-[180px] md:w-[240px] filter brightness-0 invert opacity-100 md:mix-blend-difference" />
            </div>
            <div ref={vignetteRef} className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none opacity-0 z-[50]" />
          </div>
          <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-static-md z-[60] pointer-events-none drop-shadow-md">
            <span className="text-[0.5625rem] uppercase tracking-[0.4em] text-white font-light">{t('scrollDown')}</span>
            <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
              <div ref={scrollLineRef} className="w-full h-full bg-white opacity-80" />
            </div>
          </div>
          <div className="absolute inset-0 w-full h-full z-[200] flex flex-col pointer-events-none">
            <section ref={heroContentRef} className="w-full flex-1 px-[var(--space-gutter-sm)] lg:px-[var(--space-gutter-md)] flex flex-col pt-[120px] lg:pt-[80px] pb-[40px] md:pb-[60px] relative">
              <div className="grid-layout flex-1 max-w-section-xl w-full mx-auto pointer-events-auto">
                <div className="col-start-1 col-span-full md:col-start-1 md:col-span-7 lg:col-span-9 row-start-2 md:row-start-5 row-span-1 flex flex-row justify-start items-end pb-8">
                  <h1 className="hero-anim-item text-display-lg md:text-display-xl text-white md:drop-shadow-lg leading-none mb-4">
                    {t('title1')}<br/>{t('title2')}
                  </h1>
                </div>
                <div className="col-start-1 col-span-full md:col-start-1 md:col-span-5 row-start-3 md:row-start-6 row-span-1 flex flex-col justify-start items-start gap-fluid-sm">
                  <p className="hero-anim-item hidden md:block text-body-lg text-[var(--color-text-White-100)] leading-relaxed font-light">
                    {t.rich('description', { bold: (chunks: React.ReactNode) => <strong className="font-medium text-white">{chunks}</strong> })}
                  </p>
                  <p className="hero-anim-item md:hidden text-body-md text-[var(--color-text-White-100)] leading-relaxed font-light">
                    {t.rich('descriptionMobile', { bold: (chunks: React.ReactNode) => <strong className="font-medium text-white">{chunks}</strong> })}
                  </p>
                  <div className="hero-anim-grow flex flex-col md:flex-row gap-static-md md:gap-fluid-xs">
                    <button className="group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150">
                      <span className="text-body-sm font-medium">{t('ctaPlans')}</span>
                      <span className="relative w-8 h-8 rounded-full bg-[var(--color-action-primary-text)] text-[var(--color-action-primary-bg)] flex items-center justify-center overflow-hidden shrink-0">
                        <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                        <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                      </span>
                    </button>
                    <button className="group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 bg-white/10 border border-[var(--color-border-Strokes-White-100)] text-[var(--color-text-White-100)] shadow-elevation-1 md:backdrop-blur-sm transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/20 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.96] active:opacity-80 active:duration-150">
                      <span className="text-body-sm font-medium">{t('ctaAgents')}</span>
                      <span className="relative w-8 h-8 rounded-full bg-white/20 text-[var(--color-text-White-100)] flex items-center justify-center overflow-hidden shrink-0">
                        <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                        <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroEpicareV2({ t, locale }: { t: any, locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollBadgeRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  
  const [isHeaderPill, setIsHeaderPill] = useState(false);
  const [isHeaderForcedDark, setIsHeaderForcedDark] = useState(true);

  const isEn = locale === 'en';
  const tMetrics = useTranslations('landingV2.metrics');

  const metricsData = [
    { value: "130+", label: tMetrics('carriers') },
    { value: "6,000+", label: tMetrics('years') },
    { value: "100+", label: tMetrics('agents') },
    { value: "2021", label: tMetrics('platform') }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = containerRef.current;
    if (!el) return;
    
    // Check for reduced motion (Hardware Symphony accessibility rule)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let ctx: gsap.Context;
    
    let forcePlay: (() => void) | null = null;
    
    const initTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        
        // 1. INTRO ANIMATION (On Load)
        // We use fromTo so it's immune to cached states and strict mode
        const isLoaderFinished = (window as any).epicareLoaderFinished;
        const introTl = gsap.timeline({
          paused: !isLoaderFinished
        });

        if (!prefersReducedMotion) {
          introTl.fromTo(videoWrapperRef.current, 
            { scaleY: 0, transformOrigin: "bottom center" },
            { scaleY: 1, duration: 1.4, ease: "power4.inOut" }
          )
          .fromTo(".hero-act1-left", 
            { opacity: 0, x: -40, filter: "blur(10px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.1, ease: "power3.out" }, 
            "-=0.8"
          )
          .fromTo(".hero-act1-right", 
            { opacity: 0, x: 40, filter: "blur(10px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, 
            "-=1.0"
          )
          .fromTo([ctaWrapperRef.current, scrollBadgeRef.current], 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, 
            "-=0.8"
          );
        } else {
          introTl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1 });
        }

        forcePlay = () => { if (introTl.paused() || introTl.progress() === 0) introTl.play(0); };
        window.addEventListener('epicareLoaderFinished', forcePlay, { once: true });

        // Act 2: Cinematic Tunnel Transition (ScrollTrigger)
        // Mantenemos el pin estructural para BrandsCarousel
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=250%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true, // Recalcula los calc() en caso de resize para evitar saltos
            onUpdate: (self) => {
              // Same smart pill logic as V1
              const isMobileCheck = window.innerWidth < 768;
              if (isMobileCheck) {
                setIsHeaderPill(self.progress >= 0.85);
              } else {
                setIsHeaderPill(self.progress >= 0.55);
              }
              // Dark mode changes depending on scroll
              setIsHeaderForcedDark(self.progress < 0.95);
            }
          }
        });

      if (!prefersReducedMotion) {
        // 1. Animate UI and Text OUT (Smart Shutdown: fade and translate)
        // Separamos los elementos para que salgan hacia los lados como un telón abriéndose
        
        // Elementos de la izquierda (Textos: GO, VE MÁS, GROWTH, CRECIMIENTO)
        tl.fromTo(".hero-act1-left", 
          { opacity: 1, x: "0vw" },
          { opacity: 0, x: "-25vw", duration: 1.5, stagger: 0.05, ease: "power2.inOut", immediateRender: false }, 
          0
        );

        // Elementos de la derecha (Textos: BEYOND, ALLÁ DEL, y el bloque de CTAs)
        tl.fromTo([".hero-act1-right", ctaWrapperRef.current], 
          { opacity: 1, x: "0vw" },
          { opacity: 0, x: "25vw", duration: 1.5, stagger: 0.05, ease: "power2.inOut", immediateRender: false }, 
          0
        );

        // El Scroll Badge central se hunde suavemente
        tl.fromTo(scrollBadgeRef.current, 
          { opacity: 1, y: 0, scale: 1 },
          { opacity: 0, y: 60, scale: 0.8, duration: 1.5, ease: "power2.inOut", immediateRender: false }, 
          0
        );

        // 2. Expand the Architectural Cut to Fullscreen using width/left
        tl.to(videoWrapperRef.current, {
          left: "0%",
          width: "100vw",
          maxWidth: "100vw", 
          minWidth: "100vw", 
          duration: 2,
          ease: "power3.inOut"
        }, 0);

        // 3. Fade out the dark architectural shadows/tints
        tl.fromTo(".hero-video-shadow", 
          { opacity: 1 },
          { opacity: 0, duration: 1.5, ease: "power2.inOut", immediateRender: false }, 
          0.5
        );

        // 4. Act 2: Slide up the Solid Metrics Bar
        // La barra sube desde abajo (yPercent: 100 -> 0)
        tl.fromTo(".act2-metrics-grid", {
          opacity: 0,
          yPercent: 100
        }, {
          opacity: 1,
          yPercent: 0,
          duration: 1.2,
          ease: "power3.out"
        }, 1.0);
        
        // Efecto cascada (stagger) para el contenido dentro de cada columna
        tl.fromTo(".act2-metric-content", {
          y: 20,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }, 1.2);
      }
    }, el);

    }, 100); // 100ms Hydration Delay

    return () => {
      clearTimeout(initTimer);
      if (forcePlay) window.removeEventListener('epicareLoaderFinished', forcePlay);
      if (ctx) ctx.revert();
    };
  }, [locale]);

  return (
    <>
      <HeaderEpicare isHeaderPill={isHeaderPill} isHeaderForcedDark={isHeaderForcedDark} scrollSafeZone={150} />
      <div ref={containerRef} className="relative w-full h-[100vh] min-h-[700px] bg-[#16181A] overflow-hidden flex flex-col font-sans">
        
        {/* Invisible 12-column grid background to structure the space */}
        <div className="absolute inset-0 z-0 grid grid-cols-12 gap-0 pointer-events-none opacity-[0.03]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-[#F4F4F0] h-full w-full" />
          ))}
        </div>

        {/* Vertical Architectural Cut (Video) - Movido 1 columna extra a la izquierda solo en inglés */}
      {/* 
        EL SECRETO: key={locale}
        Fuerza a React a destruir y crear un elemento DOM completamente nuevo al cambiar de idioma.
        Esto impide que el ctx.revert() de GSAP pueda sobreescribir el estilo de la nueva caja 
        con sus valores cacheados de la caja anterior.
      */}
      <div 
        key={`hero-video-${locale}`}
        ref={videoWrapperRef} 
        className="absolute top-0 bottom-0 max-w-[240px] min-w-[140px] h-full z-20 overflow-hidden bg-black shadow-2xl"
        style={{ 
          left: isEn ? 'calc(25% + 84px)' : 'calc(33.333% + 84px)', 
          width: 'calc(16.666% - 24px)' 
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={asset("/Files/Epicare_Landing/Hero/posters/Hero_02.webp")}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover md:mix-blend-screen scale-[1.05]"
        >
          <source src={asset("/Files/Epicare_Landing/Hero/Hero_02.mp4")} type="video/mp4" />
        </video>
        
        {/* Subtle physical depth shadows and blue architectural tint inside the cut */}
        <div className="hero-video-shadow absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none"></div>
        <div className="hero-video-shadow absolute inset-0 bg-[#35BBFD]/10 mix-blend-color pointer-events-none"></div>
      </div>

      {/* Massive Editorial Typography crossing the vertical axis */}
      <div className="absolute inset-0 pointer-events-none -mt-8 md:mt-0">
        <h1 
          className="w-full h-full text-[9.5vw] xl:text-[130px] text-[#F4F4F0] uppercase font-bold leading-[1.05] tracking-[-0.04em] whitespace-nowrap" 
          style={{ fontFamily: 'var(--font-inter-display)' }}
        >
          {isEn ? (
            <>
              {/* ENGLISH LAYOUT: GO BEYOND GROWTH */}
              <div className="hero-act1-left absolute top-[45%] -translate-y-[100%] z-30 flex flex-col items-start gap-2 md:gap-4" style={{ left: '17.666vw' }}>
                <div 
                  className="text-[9px] lg:text-[11px] font-semibold tracking-[0.2em] text-[#35BBFD] uppercase opacity-90 flex items-center" 
                  style={{ fontFamily: 'var(--font-jetbrains-mono)', letterSpacing: '0.2em' }}
                >
                  INSURANCE PLATFORM<sup className="ml-1 text-[13px] lg:text-[15px] -translate-y-[2px]" style={{ fontFamily: 'Arial, sans-serif' }}>&reg;</sup>
                </div>
                <div>GO</div>
              </div>
              
              <div className="hero-act1-right absolute top-[45%] -translate-y-[100%] z-10" style={{ left: 'calc(41.666% + 66px)' }}>
                BEYOND
              </div>
              <div className="hero-act1-left absolute top-[45%] z-30" style={{ left: '17.666vw' }}>
                GROWTH.
              </div>
            </>
          ) : (
            <>
              {/* SPANISH LAYOUT */}
              <div className="hero-act1-left absolute top-[45%] -translate-y-[100%] left-[10vw] z-30 flex flex-col items-start gap-2 md:gap-4">
                <div 
                  className="text-[9px] lg:text-[11px] font-semibold tracking-[0.2em] text-[#35BBFD] uppercase opacity-90 flex items-center" 
                  style={{ fontFamily: 'var(--font-jetbrains-mono)', letterSpacing: '0.2em' }}
                >
                  INSURANCE PLATFORM<sup className="ml-1 text-[13px] lg:text-[15px] -translate-y-[2px]" style={{ fontFamily: 'Arial, sans-serif' }}>&reg;</sup>
                </div>
                <div>VE MÁS</div>
              </div>

              {/* Parte 2: ALLÁ DEL (Detrás del video -> z-10). Gap ajustado -6px para simetría milimétrica. */}
              <div className="hero-act1-right absolute top-[45%] -translate-y-[100%] z-10" style={{ left: 'calc(50% + 66px)' }}>
                ALLÁ DEL
              </div>
              
              {/* Fila 2: CRECIMIENTO. (Por encima del video -> z-30) */}
              <div className="hero-act1-left absolute top-[45%] left-[10vw] z-30">
                CRECIMIENTO.
              </div>
            </>
          )}
        </h1>
      </div>

      {/* Ultra-Minimalist Circular Scroll to Explore (Center Bottom) */}
      <div ref={scrollBadgeRef} className="absolute bottom-[3vh] lg:bottom-[4vh] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-16 h-16 lg:w-[85px] lg:h-[85px] opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <style>{`
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
        `}</style>
        
        {/* Rotating Circular Text */}
        <div className="absolute inset-0" style={{ animation: 'spin-slow 14s linear infinite' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white">
            <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="transparent" />
            <text fontSize="10.5" className="uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              <textPath href="#circlePath" startOffset="0%">
                SCROLL TO EXPLORE &bull; SCROLL TO EXPLORE &bull; 
              </textPath>
            </text>
          </svg>
        </div>
        
        {/* Animated Minimalist Arrow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}>
            <svg width="8" height="18" viewBox="0 0 12 28" fill="none" stroke="currentColor" className="text-white">
              <path d="M6 0V26M6 26L1 20M6 26L11 20" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Secondary Information & Interface Controls */}
      <div ref={ctaWrapperRef} className="absolute bottom-[10vh] right-[5vw] lg:right-[16.33vw] z-30 w-full max-w-[380px] pointer-events-auto flex flex-col gap-5">
        
        {/* Minimal Social Proof Component */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[32, 12, 47, 43].map((id, i) => (
              <div key={i} className="w-[34px] h-[34px] rounded-full border-2 border-[#16181A] shadow-md overflow-hidden bg-[#2a2c2e] relative z-0 hover:z-10 transition-zIndex">
                <img src={`https://i.pravatar.cc/100?img=${id}`} alt="Agente" className="w-full h-full object-cover saturate-50 opacity-90 hover:saturate-100 hover:opacity-100 transition-all duration-300" />
              </div>
            ))}
          </div>
          <div className="text-[10px] font-semibold tracking-[0.06em] text-[#d0d0c8]/60 uppercase" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            Únete a <span className="text-[#35BBFD]">2,400+</span> agentes
          </div>
        </div>

        <p 
          className="text-[13px] lg:text-[15px] text-[#d0d0c8] font-light leading-[1.65]" 
          style={{ fontFamily: 'var(--font-inter-tight)' }}
        >
          <strong className="text-white font-medium text-[14px] lg:text-[16px]">130+ carrier appointments</strong> en un solo contrato, el sistema para operarlos y el <strong className="text-white font-medium text-[14px] lg:text-[16px]">equipo que lo sostiene</strong>. Tu book of business <strong className="text-[#35BBFD] font-medium text-[14px] lg:text-[16px]">sigue siendo tuyo</strong>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-static-md sm:gap-fluid-xs">
          <button className="group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150">
            <span className="text-body-sm font-medium">{t('ctaPlans')}</span>
            <span className="relative w-8 h-8 rounded-full bg-[var(--color-action-primary-text)] text-[var(--color-action-primary-bg)] flex items-center justify-center overflow-hidden shrink-0">
              <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
              <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </button>
          
          <button className="group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 bg-white/10 border border-[var(--color-border-Strokes-White-100)] text-[var(--color-text-White-100)] shadow-elevation-1 backdrop-blur-sm transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/20 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.96] active:opacity-80 active:duration-150">
            <span className="text-body-sm font-medium">{t('ctaAgents')}</span>
            <span className="relative w-8 h-8 rounded-full bg-white/20 text-[var(--color-text-White-100)] flex items-center justify-center overflow-hidden shrink-0">
              <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
              <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </button>
        </div>
      </div>

      {/* ACT 2: Architectural Footer Metrics (Flush to bottom, high transparency) */}
      <div className="act2-metrics-grid absolute bottom-0 inset-x-0 z-40 pointer-events-none opacity-0 border-t border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="w-full mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          
          {metricsData.map((metric, idx) => {
            const hoverAccent = idx === 0 ? 'group-hover:bg-[#35BBFD]' : idx === 1 ? 'group-hover:bg-[#F26023]' : 'group-hover:bg-white/50';

            return (
              <div 
                key={idx}
                className="p-6 md:p-8 lg:p-12 flex flex-col justify-end relative overflow-hidden pointer-events-auto group h-[180px] md:h-[220px] lg:h-[280px] transition-colors duration-500 hover:bg-white/[0.03]"
              >
                {/* Thin animated accent bar at the very top of the column */}
                <div className={`absolute top-0 left-0 w-0 h-[2px] ${hoverAccent} transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full`} />
                
                {/* Subtle bottom glow on hover */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="act2-metric-content relative z-10 flex flex-col items-start mt-auto">
                  <div className="text-5xl lg:text-7xl font-medium tracking-tighter text-white mb-2 lg:mb-4 drop-shadow-lg" style={{ fontFamily: 'var(--font-inter-display)' }}>
                    {metric.value}
                  </div>
                  <div className="text-[10px] lg:text-[13px] text-white/60 font-medium uppercase tracking-[0.15em] group-hover:text-white transition-colors duration-300 drop-shadow-md" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {metric.label}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
    </>
  );
}
