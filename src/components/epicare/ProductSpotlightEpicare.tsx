"use client";

/**
 * @file ProductSpotlightEpicare.tsx
 * @description Spotlight de Eppigo en el landing: tarjeta de vidrio a la izquierda y el vídeo del
 * producto a sangre por la derecha.
 *
 * Hasta el 13-10-2026 este archivo servía también a `variant="solutions"` (tarjeta de vidrio sobre
 * una ilustración isométrica, con rotador numerado). Esa variante se retiró — su sección vive ahora
 * en `AgencySolutionsEpicare.tsx` con otro paradigma — y el archivo con las dos ramas queda en
 * `_quarantine/epicare/ProductSpotlightEpicare_withSolutionsVariant.tsx`. El render de Eppigo no
 * cambió: las ramas eliminadas eran las del `else`.
 */

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { asset } from '@/lib/asset';
import { loginModalStore } from '@/lib/loginModalStore';
import { EASE, DUR, REVEAL, STAGGER, TRIGGER } from '@/lib/motion';
import SmartVideo from './SmartVideo';

const ACCENT_VAR = '--color-brand-blue';
const VIDEO_LIGHT = asset('/Files/Features/Eppigo_Light_Final.mp4');
const VIDEO_DARK = asset('/Files/Features/Eppigo_Dark_Final.mp4');
const POSTER_LIGHT = asset('/Files/Features/posters/Eppigo_Light_Final.webp');
const POSTER_DARK = asset('/Files/Features/posters/Eppigo_Dark_Final.webp');

/** Up-right arrow used inside the CTA bubbles. */
const ArrowUR = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

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

export default function ProductSpotlightEpicare() {
  const t = useTranslations('landingV2.spotlight.eppigo');

  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoColRef = useRef<HTMLDivElement>(null);

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

        // 2. Mismo patrón de entrada que el resto de la página: una sola vez, opacity + y (nada de
        //    blur ni escalas, y la tarjeta de cristal quieta para no re-pintar su backdrop-blur en el
        //    scroll). Desktop: los elementos del contenido en cascada · móvil: el contenido como un
        //    solo bloque.
        if (contentRef.current) {
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
      }, el);
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="eppigo"
      className="relative w-full overflow-x-clip md:overflow-visible flex items-center justify-center py-2 sm:py-4 lg:py-10 max-w-full"
    >
      {/*
        FULL BLEED ASYMMETRIC SPLIT LAYOUT.
        Video touches the absolute edge of the screen.
      */}
      <div className="relative z-10 w-full max-w-full flex flex-col lg:flex-row items-center justify-between">

        {/* TEXT COLUMN (Takes 50% viewport) */}
        <div ref={textColRef} className="relative z-20 shrink-0 w-full lg:w-1/2 flex flex-col justify-center py-2 sm:py-4 lg:py-20 px-3 sm:px-4 md:px-8 lg:items-end lg:-translate-y-56">

          {/* Alignment Wrapper (Forces content into the max-w-section-lg boundary) */}
          <div className="w-full px-1 sm:px-4 lg:px-8" style={{ maxWidth: 'calc(var(--max-w-section-lg, 1440px) / 2)' }}>

            {/* LIQUID GLASS TEXT CARD */}
            <div className="relative z-10 w-full max-w-[540px] mx-auto lg:mx-0 lg:mr-auto rounded-lg md:rounded-xl border border-[var(--color-border-Strokes-default)] shadow-[0_40px_80px_rgba(0,0,0,0.05)] transform hover:-translate-y-1 transition-transform duration-500 overflow-hidden">

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
            <div ref={contentRef} className="relative z-10 flex flex-col items-start gap-3.5 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">

            {/* 1. PRODUCT TITLE */}
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-start my-1">
                <img src={asset('/Files/logo-eppigo.svg')} alt="Eppigo" className="h-10 lg:h-12 w-auto object-contain" />
                <span aria-label={t('trademark')} className="-ml-3 lg:-ml-3.5 -mt-1.5 lg:-mt-2 text-h3 lg:text-h2 font-light! leading-none text-[var(--color-brand-orange)]">®</span>
              </div>
              <h2 className="text-display text-[var(--color-text-primary)]">
                {t('title')}
              </h2>
            </div>

            <div className="w-16 h-[2px] rounded-full opacity-50" style={{ backgroundColor: `var(${ACCENT_VAR})` }} />

            {/* 2. Subtítulo de 3 líneas (en desktop cada línea entera; en móvil fluye) */}
            <p className="text-body-lg lg:text-body-xl text-[var(--color-text-primary)]">
              {String(t.raw('subtitle')).split('\n').map((line) => (
                <span key={line} className="lg:block lg:whitespace-nowrap">
                  {line.split(/<bold>(.*?)<\/bold>/).map((part, j) =>
                    j % 2 ? <strong key={j} className="font-semibold">{part}</strong> : part,
                  )}{' '}
                </span>
              ))}
            </p>

            {/* 3. CTA */}
            <div className="mt-2 sm:mt-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => loginModalStore.open()}
                className="group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 text-white shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150 cursor-pointer"
                style={{ backgroundColor: `var(${ACCENT_VAR})` }}
              >
                <span className="text-sm font-semibold">{t('cta')}</span>
                <span className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0" style={{ color: `var(${ACCENT_VAR})` }}>
                  <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                  <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </button>
            </div>

            </div>
          </div>
        </div>
        </div>

        {/* VIDEO COLUMN (En mobile sube por debajo de la tarjeta glassmórfica) */}
        <div
          ref={videoColRef}
          className="relative z-0 lg:z-10 w-full lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-[var(--space-gutter-md)] justify-end px-2 sm:px-4 lg:px-0 lg:w-[var(--video-w)] flex -mt-28 sm:-mt-36 lg:mt-0"
          style={{ '--video-w': `${VIDEO_WIDTH_PCT}%` } as React.CSSProperties}
        >
          {/* Main Container (No shadow) */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[75vh] max-h-[1000px] rounded-none transform-gpu">
            {/* Mask Container (Overflow-hidden to clip the media) */}
            <div className="absolute inset-0 w-full h-full rounded-none overflow-hidden [container-type:size]">
              <SmartVideo src={VIDEO_LIGHT} poster={POSTER_LIGHT} className="absolute inset-0 w-full h-full object-cover object-center dark:hidden" />
              <SmartVideo src={VIDEO_DARK} poster={POSTER_DARK} className="absolute max-w-none object-fill hidden dark:block" style={DARK_FIT} />
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
