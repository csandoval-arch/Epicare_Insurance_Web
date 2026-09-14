"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";
import { asset } from "@/lib/asset";

const PANELS = [
  { id: 1, titleKey: "panel1Title", descKey: "panel1Desc", img: "/Files/Go_AMS/tour/go-ams-tour-01.webp" },
  { id: 2, titleKey: "panel2Title", descKey: "panel2Desc", img: "/Files/Go_AMS/tour/go-ams-tour-02.webp" },
  { id: 3, titleKey: "panel3Title", descKey: "panel3Desc", img: "/Files/Go_AMS/tour/go-ams-tour-03.webp" },
  { id: 4, titleKey: "panel4Title", descKey: "panel4Desc", img: "/Files/Go_AMS/tour/go-ams-tour-04.webp" },
  { id: 5, titleKey: "panel5Title", descKey: "panel5Desc", img: "/Files/Go_AMS/tour/go-ams-tour-05.webp" },
  { id: 6, titleKey: "panel6Title", descKey: "panel6Desc", img: "/Files/Go_AMS/tour/go-ams-tour-06.webp" },
  { id: 7, titleKey: "panel7Title", descKey: "panel7Desc", img: "/Files/Go_AMS/tour/go-ams-tour-07.webp" },
];

export default function BackOfficeTour() {
  const t = useTranslations('goAms.backOfficeTour');
  const [idx, setIdx] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const [isInViewport, setIsInViewport] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleNext = () => {
    setHasInteracted(true);
    setIdx((prev) => (prev + 1) % PANELS.length);
  };

  const handlePrev = () => {
    setHasInteracted(true);
    setIdx((prev) => (prev - 1 + PANELS.length) % PANELS.length);
  };

  // Auto-Play: corre automáticamente cada 5s mientras está en viewport HASTA que el usuario interactúe por primera vez
  useEffect(() => {
    if (!isInViewport || hasInteracted) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % PANELS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isInViewport, hasInteracted]);

  // Touch Swipe para Mobile (también desactiva el autoplay al interactuar)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffY) > 40) {
      setHasInteracted(true);
      if (diffY > 0) {
        setIdx((prev) => (prev + 1) % PANELS.length);
      } else {
        setIdx((prev) => (prev - 1 + PANELS.length) % PANELS.length);
      }
    }
    touchStartY.current = null;
  };

  // ── ENTRADA CINEMÁTICA CON SCROLLTRIGGER ──
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".tour-text-side, .tour-img-side, .tour-magnet-wrap, .tour-progress-bar", {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1
        });
        return;
      }

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: TRIGGER.standard,
          toggleActions: "play none none reverse"
        }
      });

      // 1. Entrada de Paneles Divididos
      tl.fromTo(
        ".tour-text-side",
        {
          opacity: 0,
          x: isDesktop ? -REVEAL.lg : 0,
          y: isDesktop ? 0 : -REVEAL.md,
          willChange: "transform, opacity"
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: DUR.slow,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "willChange"
        }
      );

      tl.fromTo(
        ".tour-img-side",
        {
          opacity: 0,
          x: isDesktop ? REVEAL.lg : 0,
          y: isDesktop ? 0 : REVEAL.md,
          scale: 0.97,
          willChange: "transform, opacity"
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "willChange"
        },
        "<"
      );

      // 2. Botón Magnético Central (Pop In elástico)
      tl.fromTo(
        ".tour-magnet-wrap",
        {
          scale: 0,
          opacity: 0,
          willChange: "transform, opacity"
        },
        {
          scale: 1,
          opacity: 1,
          duration: DUR.base,
          ease: EASE.snap,
          force3D: true,
          clearProps: "willChange"
        },
        "-=0.4"
      );

      // 3. Barra de Progreso
      tl.fromTo(
        ".tour-progress-bar",
        { opacity: 0 },
        { opacity: 1, duration: DUR.fast, ease: EASE.out },
        "-=0.2"
      );

      // Smart Shutdown Protocol: Solo auto-play cuando la sección está visible
      ScrollTrigger.create({
        trigger: el,
        start: "top 100%",
        end: "bottom 0%",
        onEnter: () => setIsInViewport(true),
        onLeave: () => setIsInViewport(false),
        onEnterBack: () => setIsInViewport(true),
        onLeaveBack: () => setIsInViewport(false),
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // ── QUICKTO PARA BOTÓN MAGNÉTICO (Awwwards Style) ──
  useEffect(() => {
    if (!magnetRef.current || !btnRef.current) return;
    
    // GSAP quickTo para rendimiento a 60fps constantes
    const xTo = gsap.quickTo(btnRef.current, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(btnRef.current, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = magnetRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      xTo(distanceX * 0.35);
      yTo(distanceY * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    const trigger = magnetRef.current;
    trigger.addEventListener("mousemove", handleMouseMove);
    trigger.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      trigger.removeEventListener("mousemove", handleMouseMove);
      trigger.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[85dvh] sm:h-[90dvh] md:h-[90vh] bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden border-y border-white/20 mb-section-lg select-none"
    >
      
      {/* ── BOTÓN CENTRAL MAGNÉTICO (Awwwards Style) ── */}
      <div className="tour-magnet-wrap absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
        
        {/* Zona Magnética (Trigger interactivo) */}
        <div 
           ref={magnetRef}
           className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 pointer-events-auto cursor-pointer flex items-center justify-center rounded-full group"
           onClick={handleNext}
           aria-label="Next slide"
        >
           {/* El Botón Físico */}
           <div 
             ref={btnRef}
             className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border border-white/30 flex items-center justify-center bg-black/70 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-colors duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white text-white"
           >
             <span className="text-lg sm:text-2xl font-bold transition-transform duration-300 group-hover:scale-125 group-hover:translate-x-1">→</span>
           </div>
        </div>
      </div>

      {/* ── BARRA DE PROGRESO INFERIOR ── */}
      <div className="tour-progress-bar absolute bottom-0 left-0 w-full h-[2px] bg-white/10 z-50">
         <div 
           className="h-full bg-[var(--color-brand-blue)] transition-all duration-[1.2s] ease-[cubic-bezier(0.85,0,0.15,1)]"
           style={{ width: `${((idx + 1) / PANELS.length) * 100}%` }}
         />
      </div>

      {/* ── SECCIÓN TEXTO: Arriba en Mobile, Izquierda en Desktop (Sube) ── */}
      <div className="tour-text-side w-full h-1/2 md:w-1/2 md:h-full relative overflow-hidden bg-black border-b md:border-b-0 md:border-r border-white/10">
        <div 
          className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.85,0,0.15,1)] flex flex-col will-change-transform"
          style={{ 
            height: `${PANELS.length * 100}%`,
            transform: `translateY(-${(idx * 100) / PANELS.length}%)` 
          }}
        >
          {PANELS.map((panel) => (
            <div 
              key={panel.id} 
              className="w-full flex-shrink-0 flex flex-col justify-center p-3.5 sm:p-8 md:p-12 lg:p-20"
              style={{ height: `${100 / PANELS.length}%` }}
            >
              <span className="text-h5 sm:text-h4 md:text-h2 font-bold text-white/50 mb-1 sm:mb-2 block select-none tracking-widest font-mono">
                0{panel.id}.
              </span>
              <h2 className="text-display-sm sm:text-display md:text-display-lg lg:text-display-xl font-black uppercase tracking-tighter text-white mb-2 sm:mb-4 lg:mb-6 leading-[1.05]">
                {t(panel.titleKey as any)}
              </h2>
              <p className="text-body-sm sm:text-body md:text-body-lg lg:text-body-xl font-medium text-white/70 max-w-lg leading-relaxed">
                {t(panel.descKey as any)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECCIÓN IMÁGENES: Abajo en Mobile, Derecha en Desktop (Baja) ── */}
      <div className="tour-img-side w-full h-1/2 md:w-1/2 md:h-full relative overflow-hidden bg-[#0A0A0A]">
        <div 
          className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.85,0,0.15,1)] flex flex-col will-change-transform"
          style={{ 
            height: `${PANELS.length * 100}%`,
            transform: `translateY(-${((PANELS.length - 1 - idx) * 100) / PANELS.length}%)` 
          }}
        >
          {[...PANELS].reverse().map((panel) => (
            <div 
              key={`img-${panel.id}`} 
              className="w-full flex-shrink-0 relative overflow-hidden group"
              style={{ height: `${100 / PANELS.length}%` }}
            >
               <div 
                 className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                 style={{ backgroundImage: `url('${panel.img.startsWith('http') ? panel.img : asset(panel.img)}')` }}
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
