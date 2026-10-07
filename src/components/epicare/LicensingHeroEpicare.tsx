"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type Lenis from 'lenis';
import { useTranslations } from 'next-intl';
import HeaderEpicare from './HeaderEpicare';
import { EASE, DUR, STAGGER, REVEAL } from '@/lib/motion';
import InteractiveGlobeEpicare from './InteractiveGlobeEpicare';
import LegalPlaque from './licensing/LegalPlaque';

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

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
/** Escala de partida del botón circular. */
const ENTRANCE_BTN_SCALE = 0.85;
/** Ancla de la lista de licencias (en `app/licensing/page.tsx`), destino del botón del hero. */
const LICENSES_ANCHOR = 'licensing-grid';
/** Si el loader nunca avisa (navegación SPA sin loader), la entrada arranca igual. */
const LOADER_FALLBACK_MS = 4000;

type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

export default function LicensingHeroEpicare() {
  const t = useTranslations('landingV2.licensingHero');
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Entrada del hero (2026-10-07, rediseño por lag). Mismo patrón que la landing y /company:
   * Text-Birth por palabra desde su máscara (`yPercent`, sin clip-path) → subtexto y placa con fade-up →
   * botón. Solo transform/opacity. Arranca al terminar el loader, SIN esperar al globo: el globo trae su
   * propia entrada (opacidad + escala en compositor) en InteractiveGlobeEpicare. Antes el contenedor del
   * globo animaba `filter: blur()` + scale sobre un canvas WebGL de 1100px (rasterizado en cada frame).
   */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let tl: gsap.core.Timeline | undefined;
    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      tl = gsap
        .timeline({ paused: true, defaults: { force3D: true } })
        .fromTo('.licensing-title-word',
          { yPercent: REVEAL.birthPercent },
          { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base })
        .fromTo('.licensing-text',
          { y: REVEAL.md, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base }, 0.35)
        .fromTo('.licensing-btn',
          { scale: ENTRANCE_BTN_SCALE, opacity: 0 },
          { scale: 1, opacity: 1, duration: DUR.base, ease: EASE.snap }, 0.6);
    });

    const play = () => tl?.play();
    if ((window as LoaderWindow).epicareLoaderFinished) play();
    else window.addEventListener('epicareLoaderFinished', play, { once: true });
    const fallbackId = setTimeout(play, LOADER_FALLBACK_MS);

    return () => {
      window.removeEventListener('epicareLoaderFinished', play);
      clearTimeout(fallbackId);
      mm.revert();
    };
  }, []);

  /** Baja a la lista de licencias. Siempre por Lenis (`window.scrollTo` smooth pelea con él). */
  const handleScrollToLicenses = () => {
    const target = document.getElementById(LICENSES_ANCHOR);
    if (!target) return;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
  };

  const highlight = (chunks: React.ReactNode) => (
    <span className="font-medium text-[var(--color-action-primary-bg)]">{chunks}</span>
  );

  return (
    <div className="w-full bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] transition-colors duration-500">
      
      <HeaderEpicare isHeaderPill={false} isHeaderForcedDark={false} scrollSafeZone={150} />

      <section 
        ref={containerRef} 
        className="relative w-full py-section-md px-gutter-sm md:px-gutter-md"
      >
        <div className="grid-layout max-w-section-xl mx-auto w-full gap-y-static-2xl md:gap-y-static-md">
          
          {/* ROW 1: TITLE */}
          <div className="col-span-12 md:col-start-3 md:col-span-10 md:row-start-1 z-10 flex flex-row justify-start items-start md:pb-section-lg">
            <h1 className="text-display md:text-display-2xl text-left text-[var(--color-text-primary)] font-semibold">
              {/* Text-Birth por palabra: cada palabra nace desde su máscara (el pb evita recortar descendentes) */}
              {t('title').split(' ').map((word, i) => (
                <span key={i}>
                  <span className="inline-block overflow-hidden align-bottom pb-static-sm -mb-static-sm">
                    <span className="licensing-title-word inline-block">{word}</span>
                  </span>{' '}
                </span>
              ))}
            </h1>
          </div>

          {/* ROW 2: TEXT & BUTTONS (Wrapped for mobile flex, contents for desktop grid) */}
          <div className="col-span-12 flex flex-row justify-between items-end gap-static-md pb-section-sm md:contents">
            {/* TEXT */}
            <div className="flex-1 md:col-start-1 md:col-span-4 md:row-start-2 z-10 flex flex-col justify-end md:justify-start items-start gap-static-2xl pb-0 md:pr-static-xl">
              <p className="licensing-text text-subtitle text-left text-[var(--color-text-secondary)] font-light">
                {t.rich('description', { b: highlight })}
              </p>
              {/* Placa legal (obligatoria por ley) bajo el subtexto — desktop. En móvil va a todo el ancho abajo. */}
              <LegalPlaque className="licensing-text hidden md:block w-full" />
            </div>
            
            {/* BUTTONS */}
            <div className="flex-none md:col-start-5 md:col-span-1 md:row-start-2 z-10 flex flex-col justify-end md:justify-start items-end md:items-start pb-0">
              <button 
                onClick={handleScrollToLicenses}
                className="licensing-btn group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-elevation-4 active:scale-95"
                aria-label={t('cta')}
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
          <div className="col-span-12 md:col-start-7 md:col-span-6 md:row-start-2 z-0 relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
            {/* Canvas absoluto masivo (1100px desktop, 800px mobile). Al ser un cuadrado gigantesco absoluto, 
                garantizamos que la esfera 3D JAMÁS toque los bordes del canvas WebGL y se corte abruptamente.
                El overflow-x-hidden de page.tsx se encarga de que simplemente sangre suavemente fuera de la pantalla. */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-y-[40%] md:w-[1100px] md:h-[1100px] w-[800px] h-[800px] pointer-events-auto z-10">
              <InteractiveGlobeEpicare isWidget={true} />
            </div>
          </div>

          {/* Placa legal en móvil: a todo el ancho, debajo del globo */}
          <LegalPlaque className="licensing-text md:hidden col-span-12 mt-static-2xl relative z-10" />
        </div>
      </section>
    </div>
  );
}
