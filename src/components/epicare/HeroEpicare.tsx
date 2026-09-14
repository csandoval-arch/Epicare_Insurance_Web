"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import HeaderEpicare from './HeaderEpicare';
import { asset } from "@/lib/asset";

/** Up-right arrow used inside the CTA bubbles. */
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
    
    // Fix para móvil: ignorar el resize de la barra de direcciones
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    const isDarkTheme = document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);

    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // Animación infinita de la línea de scroll
      gsap.fromTo(scrollLineRef.current, 
        { yPercent: -100 }, 
        { yPercent: 100, duration: 1.5, ease: "power2.inOut", repeat: -1 }
      );

      // Ocultar la UI del Hero y el Navbar real al inicio
      gsap.set(heroContentRef.current, { 
        pointerEvents: 'none'
      });
      // AWWWARDS MOTION: The Water Mask (Birth of Typography)
      gsap.set('.hero-anim-item', { 
        opacity: 0, 
        y: 60, // Deeper origin for Layered Unveiling
        clipPath: "inset(0% 0% 100% 0%)", // Invisible horizon mask
        willChange: "transform, opacity, clip-path"
      });
      // The Grow Mask for buttons
      gsap.set('.hero-anim-grow', {
        opacity: 0,
        y: 30,
        scale: 0.92,
        willChange: "transform, opacity"
      });

      // Asegurar que la viñeta oscura empiece invisible
      gsap.set(vignetteRef.current, { opacity: 0 });

      const mm = gsap.matchMedia();

      mm.add({
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)"
      }, (context) => {
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
                if (self.progress >= 0.85) setIsHeaderPill(true);
                else setIsHeaderPill(false);
              } else {
                if (self.progress >= 0.55) setIsHeaderPill(true);
                else setIsHeaderPill(false);
              }
            }
          }
        });

        tl.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.out"
        }, 0);

        tl.to(bigLogoRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.3,
          ease: "power2.out"
        }, 0);

        // Acto 1 -> Expansión del Video a Full Screen
        if (isMobile) {
          // MOBILE: OPTIMIZACIÓN EXTREMA NATIVA (Video Scaler)
          gsap.set(videoWrapperRef.current, {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            margin: "0 auto",
            width: "85%", // Ancho inicial
            height: "85vh", // Alto inicial
            scale: 1, 
            transformOrigin: "bottom center",
            borderRadius: "32px",
            boxShadow: "none",
            force3D: false, // Crucial apagarlo para que no use texturas de capa
            willChange: "width, height, border-radius"
          });

          tl.to(videoWrapperRef.current, {
            width: "100%",
            height: "100vh",
            borderRadius: "0px",
            duration: 1,
            ease: "power2.inOut"
          }, 0);
        } else {
          // DESKTOP: Mantener todo el lujo intacto (Desktop GPU soporta repaints)
          gsap.set(videoWrapperRef.current, { clipPath: "none" });

          tl.to(videoWrapperRef.current, {
            width: "100%", 
            maxWidth: "100%",
            height: "100vh", 
            borderRadius: "0px",
            rotationX: 0,
            rotationY: 0,
            x: 0,
            y: 0,
            borderWidth: "0px",
            boxShadow: "0 0px 0px rgba(0,0,0,0)",
            force3D: true,
            duration: 1,
            ease: "power2.inOut"
          }, 0);
        }

        tl.to(vignetteRef.current, {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut"
        }, 0);

        // Activamos la interactividad del contenedor
        tl.to(heroContentRef.current, { pointerEvents: "auto", duration: 0.1 }, 0.6);
        
        // AWWWARDS MOTION: Layered Unveiling & Birth of Typography
        tl.to('.hero-anim-item', {
          opacity: 1,
          y: 0,
          clipPath: "inset(-20% -10% -20% -10%)", // Margen negativo para no cortar colas de la "g", "j", "p"
          duration: 0.8, // Slightly longer for the dramatic deceleration
          ease: "power4.out", // Start fast, end slow (heavy deceleration)
          stagger: 0.15
        }, 0.6);

        // Los botones entran con un "Grow Pop" suavizado y optimizado
        tl.to('.hero-anim-grow', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out" // Eliminamos el back.out (overshoot) que revienta la GPU de iOS
        }, 0.8);

        tl.to({}, { duration: 0.8 });
      });

    }, el);

    return () => ctx.revert();
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Efecto 3D que sigue al mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isExpanded || !videoWrapperRef.current || window.innerWidth < 768) return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPos = (clientX / innerWidth - 0.5) * 2;
    const yPos = (clientY / innerHeight - 0.5) * 2;
    
    gsap.to(videoWrapperRef.current, {
      rotationY: xPos * 3,
      rotationX: -yPos * 3,
      x: xPos * 8,
      y: yPos * 8,
      ease: 'power2.out',
      duration: 0.6
    });
  };

  const handleMouseLeave = () => {
    if (isExpanded || !videoWrapperRef.current || window.innerWidth < 768) return;
    gsap.to(videoWrapperRef.current, {
      rotationY: 0,
      rotationX: 0,
      x: 0,
      y: 0,
      ease: 'power3.out',
      duration: 1
    });
  };

  return (
    <div className="w-full bg-[var(--color-surface-BG-base)]">
      
      {/* Header Reutilizable y Autogestionado */}
      <HeaderEpicare isHeaderPill={isHeaderPill} isHeaderForcedDark={isHeaderForcedDark} />

      <div ref={containerRef} className="w-full relative z-10 bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)]">
        
        {/* Viewport Fijo para la experiencia cinemática */}
        <div 
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-end bg-[var(--color-surface-BG-base)]"
          style={{ perspective: "1200px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >

          {/* EL VIDEO (ACTO 1: Pequeño y sin viñeta -> ACTO 2: Fullscreen con viñeta) */}
          <div 
            ref={videoWrapperRef} 
            className="relative w-[calc(100vw-64px)] md:w-[85vw] lg:w-[1100px] max-w-[100%] h-[85vh] md:h-[70vh] rounded-t-[2rem] rounded-b-none overflow-hidden shadow-elevation-2 bg-[var(--color-surface-BG-black)] will-change-transform z-0"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom center' }}
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

            {/* GRAN LOGO CENTRAL (DENTRO DEL VIDEO, ACTO 1) */}
            <div 
              ref={bigLogoRef} 
              className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center pointer-events-none"
            >
              <img 
                src={asset("/epicare_logo.svg")}
                alt="Epicare" 
                className="w-[180px] md:w-[240px] filter brightness-0 invert opacity-100 md:mix-blend-difference" 
              />
            </div>

            {/* Overlay gradient que empieza oculto y aparece en pantalla completa */}
            <div ref={vignetteRef} className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none opacity-0 z-[50]" />
          </div>

          {/* INDICADOR DE SCROLL MINIMALISTA (ACTO 1) */}
          <div 
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-static-md z-[60] pointer-events-none drop-shadow-md"
          >
            <span className="text-[0.5625rem] uppercase tracking-[0.4em] text-white font-light">
              {t('scrollDown')}
            </span>
            <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
              <div ref={scrollLineRef} className="w-full h-full bg-white opacity-80" />
            </div>
          </div>

          {/* UI LAYER SUPERPUESTA */}
          <div className="absolute inset-0 w-full h-full z-[200] flex flex-col pointer-events-none">
            
            {/* Hero Content Original */}
            <section ref={heroContentRef} className="w-full flex-1 px-[var(--space-gutter-sm)] lg:px-[var(--space-gutter-md)] flex flex-col pt-[120px] lg:pt-[80px] pb-[40px] md:pb-[60px] relative">
              <div className="grid-layout flex-1 max-w-section-xl w-full mx-auto pointer-events-auto">
                
                {/* Fila 2: Titular Principal */}
                <div className="col-start-1 col-span-full md:col-start-1 md:col-span-7 lg:col-span-9 row-start-2 md:row-start-5 row-span-1 flex flex-row justify-start items-end pb-8">
                  <h1 className="hero-anim-item text-display-lg md:text-display-xl text-white md:drop-shadow-lg leading-none mb-4">
                    {t('title1')}<br/>{t('title2')}
                  </h1>
                </div>

                {/* Fila 3: Subtítulo y CTA */}
                <div className="col-start-1 col-span-full md:col-start-1 md:col-span-5 row-start-3 md:row-start-6 row-span-1 flex flex-col justify-start items-start gap-fluid-sm">
                  <p className="hero-anim-item hidden md:block text-body-lg text-[var(--color-text-White-100)] leading-relaxed font-light">
                    {t.rich('description', {
                      bold: (chunks) => <strong className="font-medium text-white">{chunks}</strong>
                    })}
                  </p>
                  <p className="hero-anim-item md:hidden text-body-md text-[var(--color-text-White-100)] leading-relaxed font-light">
                    {t.rich('descriptionMobile', {
                      bold: (chunks) => <strong className="font-medium text-white">{chunks}</strong>
                    })}
                  </p>
                  
                  <div className="hero-anim-grow flex flex-col md:flex-row gap-static-md md:gap-fluid-xs">
                    {/* Primary CTA */}
                    <button className="group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150">
                      <span className="text-body-sm font-medium">{t('ctaPlans')}</span>
                      <span className="relative w-8 h-8 rounded-full bg-[var(--color-action-primary-text)] text-[var(--color-action-primary-bg)] flex items-center justify-center overflow-hidden shrink-0">
                        <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                        <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                      </span>
                    </button>

                    {/* Secondary CTA */}
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
