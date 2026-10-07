"use client";

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { asset } from '@/lib/asset';
import { EASE, DUR, EASE_CSS, REVEAL, STAGGER, TRIGGER } from '@/lib/motion';
import SmartVideo from './SmartVideo';

export type SpotlightVariant = 'eppigo' | 'solutions';

type SpotlightConfig = {
  accentVar: string;
  videoLight: string;
  videoDark: string;
  posterLight: string;
  posterDark: string;
};

const SPOTLIGHTS: Record<SpotlightVariant, SpotlightConfig> = {
  eppigo: {
    accentVar: '--color-brand-blue',
    videoLight: asset('/Files/Features/Eppigo_Light_Final.mp4'),
    videoDark: asset('/Files/Features/Eppigo_Dark_Final.mp4'),
    posterLight: asset('/Files/Features/posters/Eppigo_Light_Final.webp'),
    posterDark: asset('/Files/Features/posters/Eppigo_Dark_Final.webp'),
  },
  solutions: {
    accentVar: '--color-brand-blue',
    videoLight: asset('/Files/Features/Solutions_Light_Final.mp4'),
    videoDark: asset('/Files/Features/Solutions_Dark_Final.mp4'),
    posterLight: asset('/Files/Features/posters/Solutions_Light_Final.webp'),
    posterDark: asset('/Files/Features/posters/Solutions_Dark_Final.webp'),
  },
};

/** Up-right arrow used inside the CTA bubbles. */
const ArrowUR = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

const SPEC_KEYS = ['f1', 'f2', 'f3'] as const;

// ── COMPOSICIÓN DEL FONDO (valores congelados del panel de pruebas) ──
// Antes vivían en useState alimentados por un debug panel que nunca llegó a
// renderizarse (`{false && …}`). Se fijan aquí como constantes: mismo output,
// sin estado muerto ni los 11 fondos alternativos que nadie consumía.
const SPOTLIGHT_BG = '/Files/Backgrounds/epicare_bg_aura_blue.webp';
// Opacidad del aura: 0.45 en claro, 0.25 en oscuro (clases en el <img>; en oscuro brillaba demasiado).
const BG_HUE_ROTATE = 31;
const BG_SCALE = 2;
const VIDEO_WIDTH_PCT = 65;

// Encuadre del vídeo DARK de Eppigo igual al LIGHT. El light es 1:1 y el dark 16:9 con la escena más
// pequeña y a la derecha, así que con object-cover el dark se veía "más lejos". La zona del dark que
// equivale al cuadro light mide ~786 px de lado y empieza en (398, -11) del fuente (1280×720): se
// dibuja el dark de modo que esa zona caiga justo donde cae el cuadrado light (lado S = el mayor
// lado del contenedor, centrado), en cualquier tamaño (unidades de contenedor).
const DARK_FIT = {
  '--s': 'max(100cqw, 100cqh)',
  width: 'calc(var(--s) * 1.6285)',
  height: 'calc(var(--s) * 0.916)',
  left: 'calc(50cqw - var(--s) * 1.0064)',
  top: 'calc(50cqh - var(--s) * 0.4855)',
} as React.CSSProperties;

export default function ProductSpotlightEpicare({ variant }: { variant: SpotlightVariant }) {
  const t = useTranslations(`landingV2.spotlight.${variant}`);
  const { accentVar, videoLight, videoDark, posterLight, posterDark } = SPOTLIGHTS[variant];
    
  const isEppigo = variant === 'eppigo';
  
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoColRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const el = sectionRef.current;
    if (!el) return;

    let ctx: gsap.Context | undefined;
    
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        
        // 1. Video Reveal
        gsap.fromTo(videoColRef.current,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, y: 0,
            duration: 1.2, ease: "power3.out", 
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              toggleActions: "play none none reverse", 
            }
          }
        );

        // 2a. Eppigo · mismo patrón de entrada que el resto de la página: una sola vez, opacity + y (nada de
        //     blur ni escalas, y la tarjeta de cristal quieta para no re-pintar su backdrop-blur en el scroll).
        //     Desktop: los elementos del contenido en cascada · móvil: el contenido como un solo bloque.
        if (isEppigo && contentRef.current) {
          const content = contentRef.current;
          const once = { scrollTrigger: { trigger: content, start: TRIGGER.standard, once: true } };
          const mm = gsap.matchMedia();
          mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
            gsap.from(content.children, {
              opacity: 0, y: REVEAL.sm, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base, clearProps: "transform,opacity", ...once,
            });
          });
          mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
            gsap.from(content, { opacity: 0, y: REVEAL.sm, duration: DUR.base, ease: EASE.out, clearProps: "transform,opacity", ...once });
          });
        }

        // 2b. Solutions · Text Reveal (Staggered perfectly, targeting ONLY content to avoid breaking backdrop-blur performance)
        const textElements = isEppigo ? undefined : contentRef.current?.children;
        if (textElements) {
          gsap.fromTo(textElements,
            { opacity: 0, y: 24 },
            { 
              opacity: 1, y: 0,
              duration: 1.0, stagger: 0.12, ease: "power2.out", delay: 0.2,
              scrollTrigger: {
                trigger: el,
                start: "top 70%",
                toggleActions: "play none none reverse", 
              }
            }
          );
        }

        // 3. Rotator
        const featureItems = gsap.utils.toArray('.feature-item') as HTMLElement[];
        if (featureItems.length > 0) {
          const rotatorTl = gsap.timeline({ repeat: -1 });
          featureItems.forEach((item) => {
            rotatorTl
              .fromTo(item, 
                { yPercent: 100, opacity: 0 }, 
                { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
              )
              .to(item, 
                { yPercent: -100, opacity: 0, duration: 0.6, ease: "power2.in", delay: 3 }
              );
          });
        }
      }, el);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [isEppigo]);

  return (
    <section 
      ref={sectionRef} 
      id={variant} 
      className="relative w-full overflow-x-clip md:overflow-visible flex items-center justify-center py-2 sm:py-4 lg:py-10 max-w-full"
    >
      {/* 
        FULL BLEED ASYMMETRIC SPLIT LAYOUT. 
        Video touches the absolute edge of the screen. 
      */}
      <div className={`relative z-10 w-full max-w-full flex flex-col ${isEppigo ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center justify-between`}>
        
        {/* TEXT COLUMN (Takes 50% viewport) */}
        <div ref={textColRef} className={`relative z-20 shrink-0 w-full lg:w-1/2 flex flex-col justify-center py-2 sm:py-4 lg:py-20 px-3 sm:px-4 md:px-8 ${isEppigo ? 'lg:items-end lg:-translate-y-56' : 'lg:items-start lg:-translate-y-32'}`}>
          
          {/* Alignment Wrapper (Forces content into the max-w-section-lg boundary) */}
          <div className="w-full px-1 sm:px-4 lg:px-8" style={{ maxWidth: 'calc(var(--max-w-section-lg, 1440px) / 2)' }}>
            
            {/* LIQUID GLASS TEXT CARD */}
            <div className={`relative z-10 w-full max-w-[540px] mx-auto lg:mx-0 ${isEppigo ? 'lg:mr-auto' : 'lg:ml-auto'} rounded-lg md:rounded-xl border border-[var(--color-border-Strokes-default)] shadow-[0_40px_80px_rgba(0,0,0,0.05)] transform hover:-translate-y-1 transition-transform duration-500 overflow-hidden`}>
            
            {/* Glassmorphic Background Layer (Static) */}
            <div className="absolute inset-0 rounded-lg md:rounded-xl -z-10">
            {/* Pure Background Mesh (Brand Blue) */}
            <img 
              src={asset(SPOTLIGHT_BG)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.45] dark:opacity-25 transition-all duration-300"
              style={{
                filter: `hue-rotate(${BG_HUE_ROTATE}deg)`,
                transform: `scale(${BG_SCALE})`
              }}
            />
            
            {/* Clean Frosted Glass Refraction */}
            <div className="absolute inset-0 bg-white/20 dark:bg-[var(--color-surface-BG-1)]/60 backdrop-blur-[20px] saturate-[1.5] pointer-events-none" />
            </div>

            {/* CONTENT (Relative to sit above glass) */}
            <div ref={contentRef} className={`relative z-10 flex flex-col items-start gap-3.5 sm:gap-6 lg:gap-8 ${isEppigo ? 'px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14' : 'p-4 sm:p-6 lg:p-10'}`}>
              
              {/* 1. CHIP / BADGE (solo Solutions) */}
              {!isEppigo && (
              <div className="flex items-center gap-2.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: `var(${accentVar})` }} />
                <span className="text-[9px] font-black tracking-[0.25em] uppercase text-gray-500">
                  Equipamiento Clínico
                </span>
              </div>
              )}

            {/* 2. PRODUCT TITLE */}
            {isEppigo ? (
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-start my-1">
                  <img src={asset('/Files/logo-eppigo.svg')} alt="Eppigo" className="h-10 lg:h-12 w-auto object-contain" />
                  <span aria-label="marca registrada" className="-ml-3 lg:-ml-3.5 -mt-1.5 lg:-mt-2 text-h3 lg:text-h2 font-light! leading-none text-[var(--color-brand-orange)]">®</span>
                </div>
                <h2 className="text-display text-[var(--color-text-primary)]">
                  {t('title')}
                </h2>
              </div>
            ) : (
              <h2 className="text-display text-[var(--color-text-primary)]">
                <span className="block" style={{ color: `var(${accentVar})` }}>
                  {t('name')}
                </span>
                {t('title')}
              </h2>
            )}

            <div className="w-16 h-[2px] rounded-full opacity-50" style={{ backgroundColor: `var(${accentVar})` }} />

            {/* 3. Eppigo: subtítulo de 3 líneas (en desktop cada línea entera; en móvil fluye) · Solutions: ROTATOR */}
            {isEppigo ? (
              <p className="text-body-lg lg:text-body-xl text-[var(--color-text-primary)]">
                {String(t.raw('subtitle')).split('\n').map((line) => (
                  <span key={line} className="lg:block lg:whitespace-nowrap">
                    {line.split(/<bold>(.*?)<\/bold>/).map((part, j) =>
                      j % 2 ? <strong key={j} className="font-semibold">{part}</strong> : part,
                    )}{' '}
                  </span>
                ))}
              </p>
            ) : (
            <div ref={rotatorRef} className="relative h-[2.5rem] overflow-hidden w-full">
              {SPEC_KEYS.map((key, i) => (
                <div key={key} className="feature-item absolute top-0 left-0 w-full h-full flex items-center gap-4" style={{ opacity: 0 }}>
                  <span aria-hidden="true" className="text-lg font-mono text-gray-400">
                    0{i + 1}
                  </span>
                  <span className="text-xl font-medium text-gray-700">
                    {t(`${key}Title`)}
                  </span>
                </div>
              ))}
            </div>
            )}

            {/* 4. CTA */}
            {isEppigo ? (
              <div className="mt-2 sm:mt-4 w-full sm:w-auto">
                <a
                  href="#unete"
                  className="group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 text-white shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150"
                  style={{ backgroundColor: `var(${accentVar})` }}
                >
                  <span className="text-sm font-semibold">{t('cta')}</span>
                  <span className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0" style={{ color: `var(${accentVar})` }}>
                    <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                    <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </a>
              </div>
            ) : (
              <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href="#marketing"
                  className="group w-full sm:w-fit h-12 pl-6 pr-2 rounded-full flex items-center justify-between sm:justify-start gap-3 text-white shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150"
                  style={{ backgroundColor: `var(${accentVar})` }}
                >
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">Marketing</span>
                  <span className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0" style={{ color: `var(${accentVar})` }}>
                    <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                    <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </a>
                
                <a
                  href="#technology"
                  className="group w-full sm:w-fit h-12 pl-6 pr-2 rounded-full flex items-center justify-between sm:justify-start gap-3 bg-white border border-gray-200 shadow-elevation-1 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-3 hover:border-transparent active:scale-[0.96] active:opacity-80 active:duration-150"
                >
                  <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: `var(${accentVar})` }}>Technology</span>
                  <span className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 transition-colors duration-300" style={{ backgroundColor: `var(${accentVar})`, color: 'white' }}>
                    <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                    <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </a>
              </div>
            )}

            </div>
          </div>
        </div>
        </div>
      
        {/* VIDEO COLUMN (En mobile sube por debajo de la tarjeta glassmórfica) */}
        <div 
          ref={videoColRef} 
          className={`relative z-0 lg:z-10 w-full lg:absolute lg:top-1/2 lg:-translate-y-1/2 ${isEppigo ? 'lg:right-[var(--space-gutter-md)] justify-end px-2 sm:px-4 lg:px-0' : 'lg:left-[var(--space-gutter-md)] justify-start px-2 sm:px-4 lg:px-0'} lg:w-[var(--video-w)] flex -mt-28 sm:-mt-36 lg:mt-0`}
          style={{ '--video-w': `${VIDEO_WIDTH_PCT}%` } as React.CSSProperties}
        >
          {/* Main Container (No shadow) */}
          <div className={`relative w-full h-[50vh] sm:h-[60vh] lg:h-[75vh] max-h-[1000px] rounded-none transform-gpu`}>
            {/* Mask Container (Overflow-hidden to clip the media) */}
            <div className={`absolute inset-0 w-full h-full rounded-none overflow-hidden [container-type:size]`}>
              {isEppigo ? (
                <>
                  <SmartVideo src={videoLight} poster={posterLight} className="absolute inset-0 w-full h-full object-cover object-center dark:hidden" />
                  <SmartVideo src={videoDark} poster={posterDark} className="absolute max-w-none object-fill hidden dark:block" style={DARK_FIT} />
                </>
              ) : (
                <img src={asset('/Files/Frame 96.webp')} alt="EpiCare Solutions" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center" />
              )}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
