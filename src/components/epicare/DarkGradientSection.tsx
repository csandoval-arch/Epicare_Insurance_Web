"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { asset } from "@/lib/asset";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";
import SmartVideo from "./SmartVideo";

gsap.registerPlugin(ScrollTrigger);

const FEATURES_DIR = '/Files/Epicare_Landing/Features';

/**
 * @description Resuelve el asset de una card. Acepta tanto una ruta absoluta
 * (`/Files/...`) como un nombre suelto relativo a la carpeta de features.
 */
const cardAsset = (name: string) =>
  asset(name.startsWith('/') ? name : `${FEATURES_DIR}/${name}`);

/**
 * @description Poster derivado del vídeo: mismo nombre bajo `posters/` en `.webp`.
 * Sin poster, `SmartVideo` (preload="none") deja el hueco vacío hasta decodificar
 * el primer frame.
 */
const cardPoster = (name: string) => {
  const full = name.startsWith('/') ? name : `${FEATURES_DIR}/${name}`;
  const slash = full.lastIndexOf('/');
  return asset(`${full.slice(0, slash)}/posters/${full.slice(slash + 1).replace(/\.mp4$/, '.webp')}`);
};

const FlipCard = ({ card, t }: { card: any, t: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="card-reveal shrink-0 w-[82vw] sm:w-[50vw] md:w-auto min-h-[430px] md:min-h-[492px] snap-start md:snap-none group cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ 
          transformStyle: 'preserve-3d', 
          WebkitTransformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* FRONT */}
        <div 
          className="absolute inset-0 w-full h-full flex flex-col rounded-[12px] bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-[var(--color-border-Strokes-default)] dark:border-white/10 hover:border-[var(--color-border-Strokes-Hover)] dark:hover:border-white/20 transition-all duration-300 shadow-elevation-2 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-elevation-4 overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Bloque de Texto Superior */}
          <div className="flex flex-col p-static-md md:p-static-lg w-full gap-2 md:gap-3 text-left">
            <span className="text-overline text-[var(--color-brand-blue)]">
              {card.step}
            </span>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-h2 text-[var(--color-text-Black-100)] dark:text-white leading-tight tracking-tight transition-colors duration-300 pr-2">
                {card.title}
              </h3>
            </div>
          </div>

          {/* Contenedor Visual (Medio, flex-1, Transparente) */}
          <div className="w-full flex-1 min-h-[220px] relative bg-transparent overflow-hidden rounded-b-[12px]">
            {/* Elemento para Light Mode */}
            {card.isVideo || card.isVideoLight ? (
              <SmartVideo
                disablePictureInPicture
                src={cardAsset(card.imgLight || card.img)}
                poster={cardPoster(card.imgLight || card.img)}
                className={`absolute inset-0 w-full h-full block dark:hidden ${card.imgClassLight || card.imgClass || "object-cover"}`}
              />
            ) : (
              <img
                src={cardAsset(card.imgLight || card.img)}
                alt={card.title}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full opacity-90 block dark:hidden ${card.imgClass || "object-contain p-6"}`} 
              />
            )}

            {/* Elemento para Dark Mode */}
            {card.isVideo || card.isVideoDark ? (
              <SmartVideo
                disablePictureInPicture
                src={cardAsset(card.img)}
                poster={cardPoster(card.img)}
                className={`absolute inset-0 w-full h-full hidden dark:block ${card.imgClassDark || card.imgClass || "object-cover"}`}
              />
            ) : (
              <img
                src={cardAsset(card.img)}
                alt={card.title}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full opacity-90 hidden dark:block ${card.imgClassDark || card.imgClass || "object-contain p-6"}`} 
              />
            )}
            
            {/* Footer Overlay: Label (Left) and Icon (Right) */}
            <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 flex items-center justify-end gap-2 z-20 pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-300">
               <span className="text-meta text-[var(--color-text-Black-100)] dark:text-white uppercase tracking-wider font-semibold">
                  {t('tiltCard')}
               </span>
               
               {/* Icon */}
               <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/5 dark:bg-white/10 border border-[var(--color-border-Strokes-default)] dark:border-white/10 flex items-center justify-center text-[var(--color-text-Black-100)] dark:text-white group-hover:bg-[var(--color-brand-blue)] group-hover:text-white group-hover:border-[var(--color-brand-blue)] group-hover:rotate-180 transition-all duration-500 shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 md:w-4 md:h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
               </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div 
          className="absolute inset-0 w-full h-full flex flex-col items-start justify-start p-static-md md:p-static-lg rounded-[12px] bg-white/90 dark:bg-[#0c0d0e]/95 backdrop-blur-xl border border-[var(--color-border-Strokes-default)] dark:border-white/10 shadow-elevation-3 overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
           <p className="text-body md:text-body-lg text-[var(--color-text-Black-100)]/80 dark:text-white/70 font-light leading-relaxed text-left">
              {card.body}
           </p>
           {/* Boton volver animado - Bottom Right */}
           <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[var(--color-text-Black-100)] dark:text-white/80 hover:bg-[var(--color-brand-blue)] hover:text-white transition-colors duration-300 shadow-sm cursor-pointer hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 md:w-4 md:h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
           </div>
        </div>
      </div>
    </div>
  );
};

export default function DarkGradientSection() {
  const t = useTranslations('landingV2.darkGradient');
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.dg-head-line, .dg-head-fade, .card-reveal', {
          opacity: 1, y: 0, yPercent: 0, scale: 1
        });
        return;
      }

      // 1. Synchronized Header Entrance Timeline (Title + Subtitle)
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: TRIGGER.standard,
          toggleActions: 'play none none reverse'
        }
      });

      headerTl
        .fromTo('.dg-head-line', 
          { yPercent: REVEAL.birthPercent, opacity: 0, willChange: 'transform, opacity' },
          { 
            yPercent: 0, 
            opacity: 1,
            duration: DUR.slow, 
            ease: EASE.dramatic, 
            force3D: true,
            clearProps: 'willChange'
          }
        )
        .fromTo('.dg-head-fade', 
          { opacity: 0, y: REVEAL.sm, willChange: 'transform, opacity' },
          { 
            opacity: 1, 
            y: 0, 
            duration: DUR.base, 
            ease: EASE.out, 
            clearProps: 'willChange'
          },
          "-=0.45"
        );

      // 2. Hardware Symphony: Pure GPU Wave Reveal for Cards
      gsap.fromTo(".card-reveal", 
        { opacity: 0, y: REVEAL.md, scale: 0.96, willChange: 'transform, opacity' },
        {
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: DUR.base,
          stagger: STAGGER.base,
          ease: EASE.out,
          force3D: true,
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: scrollContainerRef.current || el,
            start: TRIGGER.early,
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const renderRichBody = (key: any) => t.rich(key, { 
    b: (chunks) => <span className="font-semibold text-[var(--color-text-Black-100)] dark:text-white">{chunks}</span> 
  });

  const features = [
    { 
      step: t('feature1_step'), 
      title: t('feature1_title'), 
      subtitle: t('feature1_subtitle'), 
      body: renderRichBody('feature1_body'),
      img: "Card_01_INNOVATION-Dark.mp4",
      imgLight: "Innovation_card_Light.mp4",
      isVideo: true,
      imgClassDark: "object-cover scale-[1.15] origin-top"
    },
    { 
      step: t('feature2_step'), 
      title: t('feature2_title'), 
      subtitle: t('feature2_subtitle'), 
      body: renderRichBody('feature2_body'),
      img: "support_dark.mp4",
      imgLight: "Card 2_Support_light.mp4",
      isVideo: true,
      imgClass: "object-cover",
      imgClassDark: "object-contain scale-[1.4]"
    },
    { 
      step: t('feature3_step'), 
      title: t('feature3_title'), 
      subtitle: t('feature3_subtitle'), 
      body: renderRichBody('feature3_body'),
      img: "Earnings_V3_Dark.mp4",
      imgLight: "Earnings_V3_Ligh.mp4",
      isVideo: true,
      imgClass: "object-contain scale-[1.15]"
    },
    { 
      step: t('feature4_step'), 
      title: t('feature4_title'), 
      subtitle: t('feature4_subtitle'), 
      body: renderRichBody('feature4_body'),
      img: "Variety_dark.mp4",
      imgLight: "Variety_light.mp4",
      isVideo: true,
      imgClass: "object-cover"
    }
  ];

  // Throttled scroll listener with requestAnimationFrame to prevent scroll jank
  const handleScroll = useCallback(() => {
    if (!tickingRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const scrollLeft = container.scrollLeft;
          const index = Math.round(scrollLeft / (container.scrollWidth / features.length));
          setActiveIndex(index);
        }
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, [features.length]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] pt-0 pb-section-sm md:pb-section-md z-20 overflow-hidden transition-colors duration-500 px-gutter-sm md:px-gutter-md"
    >
      <div className="max-w-section-lg mx-auto w-full">
        
        <div className="relative w-full min-h-0 h-auto md:min-h-[75vh] rounded-[12px] border border-[var(--color-border-Strokes-default)] overflow-hidden flex flex-col justify-center items-start md:items-center text-left md:text-center px-static-md pt-static-xl pb-static-md sm:p-static-lg md:p-static-2xl bg-transparent transition-colors duration-500">
          
          {/* Resplandor Azul (Pure GPU Radial Gradient sin CSS Filter Blur) */}
          <div 
            className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[100%] h-[120%] opacity-40 z-0 pointer-events-none transition-opacity duration-500 hidden dark:block"
            style={{
              background: "radial-gradient(ellipse at top, rgba(53, 187, 253, 0.25) 0%, rgba(5, 72, 235, 0.15) 30%, transparent 70%)"
            }}
          />

          {/* Contenido Central */}
          <div className="relative z-10 flex flex-col items-start md:items-center gap-4 md:gap-6 max-w-4xl w-full md:mx-auto pb-6 md:pb-8">
            
            <h2 className="overflow-hidden pb-static-xs text-display text-left md:text-center text-[var(--color-text-Black-100)] dark:text-white tracking-tighter leading-[1.05] transition-colors duration-500">
              <span className="dg-head-line block">
                {t.rich('sectionTitle', {
                  span: (chunks) => <span className="text-[var(--color-brand-blue)]">{chunks}</span>
                })}
              </span>
            </h2>

            <p className="hidden md:block dg-head-fade text-body md:text-body-lg text-left md:text-center text-[var(--color-text-Black-100)]/70 dark:text-white/70 max-w-2xl font-light transition-colors duration-500">
              {t('sectionDesc')}
            </p>

          </div>

          {/* Grid de Cards: Scroll Snap en Mobile / 4-Cols Grid en Desktop */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="dg-cards-container relative z-10 flex md:grid md:grid-cols-4 overflow-x-auto overflow-y-hidden md:overflow-x-visible md:overflow-y-visible scrollbar-none snap-x snap-mandatory md:snap-none gap-static-md md:gap-fluid-xs w-full md:mt-8 md:perspective-[1000px] py-4 md:py-0"
          >
            {features.map((card, idx) => (
              <FlipCard key={idx} card={card} t={t} />
            ))}
          </div>

          {/* Dots Indicator (Mobile Only) */}
          <div className="flex md:hidden justify-center gap-2 mt-4 z-10 w-full">
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const targetCard = container.children[idx] as HTMLElement;
                    if (targetCard) {
                      gsap.to(container, {
                        scrollLeft: targetCard.offsetLeft - 16,
                        duration: DUR.fast,
                        ease: EASE.out
                      });
                    }
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx 
                    ? 'bg-[var(--color-brand-blue)] w-5' 
                    : 'bg-black/15 dark:bg-white/20 w-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
