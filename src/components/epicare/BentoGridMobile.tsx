"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EASE, DUR, STAGGER, TRIGGER } from "@/lib/motion";
import HubTitle from "./bento-act1/HubTitle";
import { PANELS } from "./BentoGridDesktop";
import { ProductMedia, lines } from "./bento-act1/ProductScene";
import { HubPlaque, renderHubMark, hubMarksTimeline, observeHubLoop } from "./bento-act1/HubIntro";
// ── INTERNAL ARC: brand accent per card (title + 5 products). The ambient
// orb morphs to the active card's color so the journey has a beginning,
// middle and end instead of being a flat carousel.
/** Velo de profundidad del apilado móvil: opacidad máxima que alcanza la tarjeta que queda debajo
 *  (sobre --color-overlay-backdrop). Margen creativo declarado: no hay token de "sombra de relevo". */
const STACK_SHADE_MAX = 0.08;

const CARD_ACCENT_VARS = [
  '--color-brand-blue',   // title card
  '--color-brand-blue',   // GO AMS (core)
  '--color-brand-cyan',   // GO CRM
  '--color-brand-orange', // Epicare Academy — cierra el arco del hub
];

// ----------------------------------------------------------------------
// LOGO COMPONENTS (Moved to top to prevent Turbopack ReferenceErrors)
// ----------------------------------------------------------------------
const ArrowUR = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);


// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export default function BentoGridMobile() {
  const t = useTranslations('landingV2.bento');
  const th = useTranslations('landingV2.hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressHitRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Fichas del acto 1: lleva el scroll hasta la tarjeta i (Lenis si está). Se usa offsetTop dentro de la
  // pista (posición en el flujo), porque una tarjeta sticky ya pegada mide su posición pegada.
  const goToCard = (i: number) => {
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>(".mobile-stack-card")[i + 1];
    if (!track || !card) return;
    const y = track.getBoundingClientRect().top + window.scrollY + card.offsetTop;
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number) => void } }).lenis;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const section = containerRef.current;
    const track = trackRef.current;

    if (!section || !track) return;
    const stopLoopObserver = observeHubLoop(section);

    // Resolve brand accents from the DS tokens once.
    const styles = getComputedStyle(document.documentElement);
    const accents = CARD_ACCENT_VARS.map(v => styles.getPropertyValue(v).trim() || '#35BBFD');
    let activeIdx = 0;

    const morphOrb = (idx: number) => {
      if (idx === activeIdx || !orbRef.current) return;
      activeIdx = idx;
      gsap.to(orbRef.current, {
        backgroundColor: accents[idx],
        duration: DUR.slow,
        ease: EASE.inOut,
        overwrite: 'auto',
      });
    };

    const mm = gsap.matchMedia();

    // ----------------------------------------------------
    // MOBILE: FREE-SCROLL STACK (the thumb keeps control —
    // no pin toll on touch; cards reveal with the house physics)
    // ----------------------------------------------------
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        // 1. Header Entrance Timeline (Logo Badge + Title + Subtitle)
        const headerTl = gsap.timeline({
          scrollTrigger: {
            // Con el titular en pantalla (no con el borde de la sección): la entrada se ve entera.
            trigger: section.querySelector(".hub-title") ?? section,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse"
          }
        });

        // Selectores acotados a la sección: el árbol de desktop también está en el DOM (oculto).
        headerTl
          .fromTo(section.querySelectorAll(".hub-plaque"),
            { opacity: 0, scale: 0.85, y: 20, willChange: 'transform, opacity' },
            { opacity: 1, scale: 1, y: 0, duration: DUR.fast, ease: EASE.out, clearProps: 'willChange' }
          )
          .fromTo(section.querySelectorAll(".hub-line"),
            { yPercent: 120, willChange: 'transform' },
            { yPercent: 0, duration: DUR.base, ease: EASE.dramatic, stagger: STAGGER.base, force3D: true, clearProps: 'all' },
            0.1
          )
          .add(hubMarksTimeline(section), 0.45);

        // 2. STACKING CARDS EFFECT (Native CSS Sticky + GSAP 3D Shrink)
        // Arquitectura 100% fluida, elimina el gap falso en la parte inferior de la página.
        const stackCards = gsap.utils.toArray(".mobile-stack-card") as HTMLElement[];

        stackCards.forEach((card: any, i) => {
          if (i < stackCards.length - 1) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: stackCards[i + 1],
                start: "top 55%",
                end: "top top",      
                scrub: true,
                invalidateOnRefresh: true,
                onLeave: () => gsap.set(card, { autoAlpha: 0 }), // Smart Shutdown: Elimina overdraw cuando está cubierta
                onEnterBack: () => gsap.set(card, { autoAlpha: 1 }) // Restaura al devolver scroll
              }
            });

            // Animación 3D pura por hardware (transform localizado)
            tl.to(card, {
              y: -60,
              scale: 0.96,
              rotationX: -4, 
              transformPerspective: 1500, // Perspectiva local evita distorsión en las últimas cards
              transformOrigin: "top center",
              force3D: true, 
              ease: "none"
            }, 0);

            // Velo de profundidad: la tarjeta de abajo se oscurece apenas mientras la siguiente le pasa encima.
            const shade = card.querySelector(".stack-shade");
            if (shade) tl.to(shade, { opacity: STACK_SHADE_MAX, ease: "none" }, 0);

            // Morph the ambient orb to match this card's brand accent
            tl.call(() => morphOrb(i + 1), undefined, 0.2);
          }
        });
    });

    return () => {
      stopLoopObserver();
      section.classList.remove('is-live');
      mm.revert();
      stRef.current?.kill();
    };
  }, []);

  return (
      <section
        id="plataforma"
        ref={containerRef}
        className={`relative w-full h-auto md:h-screen overflow-x-clip md:overflow-hidden bg-[var(--color-surface-BG-1)] transition-colors duration-500 z-20 rounded-t-none rounded-b-xl md:rounded-xl max-w-full`}
        style={{ perspective: '2000px' }}
      >
        {/* AMBIENT ORB — the journey's mood: morphs to the active product's accent */}
        <div
          ref={orbRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] md:w-[55vw] md:h-[55vw] rounded-full blur-[120px] opacity-[0.10] dark:opacity-[0.16] z-0 transform-gpu"
          style={{ backgroundColor: 'var(--color-brand-blue)' }}
        ></div>

        {/* SCROLL PROGRESS — clickable scrubber (desktop pin only) */}
        <div
          ref={progressHitRef}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center z-50 cursor-pointer py-3 px-2"
          role="slider"
          aria-label="Ecosystem progress"
        >
          <div className="w-[80px] md:w-[120px] h-[2px] bg-black/10 dark:bg-white/10 relative overflow-hidden rounded-full">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full bg-[var(--color-text-Black-100)] dark:bg-[var(--color-text-White-100)] w-full origin-left transform-gpu scale-x-0"
            ></div>
          </div>
        </div>

        {/* DOM: NATIVE CSS STICKY 3D STACK (Zero-Gap Architecture) */}
        <div
          ref={trackRef}
          className="relative flex flex-col items-center justify-start w-full z-10"
        >
          {/* CARD 0: THE TITLE COMPOSITION */}
          <div className="mobile-stack-card sticky top-0 w-full min-h-fit pb-8 sm:pb-[6vh] flex flex-col justify-start pt-section-sm items-start px-gutter-sm origin-top transform-gpu will-change-transform [backface-visibility:hidden] z-[10] relative">
              {/* Acto 1 (mismo que desktop): caja con stroke con el logo GO Hub en placa + titular con glifos */}
              <div className="relative w-full h-[68dvh] max-h-[528px] flex flex-col justify-start rounded-lg border border-[var(--color-border-Strokes-default)] p-[var(--space-gutter-sm)]">
                <span aria-hidden="true" className="stack-shade pointer-events-none absolute inset-0 z-20 rounded-lg bg-[var(--color-overlay-backdrop)] opacity-0" />
                {/* Recuadro de logo común en móvil (w-32 h-16): igual para el GO Hub y los tres productos */}
                <HubPlaque className="w-32 h-18 mt-static-xl mb-static-lg" logoClassName="w-12 h-12" radiusClass="rounded-md" />
                <HubTitle className="hub-title text-display-lg text-left" renderMark={renderHubMark} />
                {/* Lo que viene (como en desktop): tres fichas en fila; clic = baja hasta esa tarjeta */}
                <div className="mt-auto mb-static-xl grid grid-cols-3 gap-static-sm">
                  {PANELS.map((p, i) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => goToCard(i)}
                      className="h-static-2xl px-static-sm flex items-center justify-center rounded-md border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] text-meta uppercase tracking-[0.05em] text-[var(--color-text-secondary)] whitespace-nowrap active:border-[var(--color-brand-blue)] active:text-[var(--color-text-primary)]"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
          </div>

          {/* TARJETAS DE PRODUCTO — mismo lenguaje que desktop (datos y piezas compartidas: PANELS,
              ProductMedia): caja con stroke, UI a sangre arriba (blend en CRM/Academy) y abajo: una fila con
              el logo en su cajita y, a la derecha, el CTA (círculo azul con flecha; en Academy "Próximamente",
              gris y sin enlace), y debajo gancho (bold) + detalle. Toda la tarjeta enlaza. */}
          {PANELS.map((panel, idx) => {
            const isLastCard = idx === PANELS.length - 1;
            const { Logo, isAcademy, comingSoon } = panel;
            const body = (
              <>
                <span aria-hidden="true" className="stack-shade pointer-events-none absolute inset-0 z-20 rounded-lg bg-[var(--color-overlay-backdrop)] opacity-0" />
                {/* Arriba, antes de la UI: el logo en su recuadro (en Academy, "Próximamente" a la derecha) */}
                <div className="shrink-0 flex items-center justify-between p-[var(--space-gutter-sm)]">
                  <div className="w-32 h-16 flex items-center justify-center rounded-md border border-[var(--color-border-Strokes-default)]">
                    <Logo className={`${isAcademy ? "h-10" : "h-9"} w-auto text-[var(--color-brand-blue)] dark:text-[var(--color-text-White-100)]`} />
                  </div>
                  {comingSoon && (
                    <span className="h-static-xl px-static-md rounded-full flex items-center border border-[var(--color-border-Strokes-default)] text-ui-label text-[var(--color-text-secondary)]">
                      {t(panel.hoverKey)}
                    </span>
                  )}
                </div>
                <ProductMedia panel={panel} framed={false} className="w-full flex-1 min-h-0" />
                {/* Abajo: un solo titular de 2 líneas (gancho + detalle fundidos) y el CTA a su derecha */}
                <div className="shrink-0 p-[var(--space-gutter-sm)] flex items-end justify-between gap-static-md">
                  <p className="text-h4 text-[var(--color-text-primary)]">{lines(t(`products.${panel.key}.mobile`))}</p>
                  {!comingSoon && (
                    <span aria-hidden="true" className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2">
                      <ArrowUR className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </>
            );
            const box = "relative w-full h-full flex flex-col overflow-hidden rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)] shadow-elevation-2";

            return (
              <div
                key={panel.key}
                className={`mobile-stack-card w-full h-[72dvh] max-h-[560px] px-gutter-sm flex flex-col justify-center items-center origin-top transform-gpu will-change-transform [backface-visibility:hidden] mt-static-sm mb-static-md ${!isLastCard ? 'sticky top-5' : 'relative pb-static-xl'}`}
                style={{ zIndex: 11 + idx }}
              >
                {/* Sombra proyectada sobre la tarjeta de abajo: degradado estático (sin animar box-shadow) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[var(--space-gutter-sm)] right-[var(--space-gutter-sm)] -top-static-lg h-static-lg rounded-t-lg bg-gradient-to-t from-[var(--color-overlay-backdrop)]/[0.06] to-transparent"
                />
                {comingSoon || !panel.href ? (
                  <div className={box}>{body}</div>
                ) : (
                  <Link href={panel.href} aria-label={t(panel.hoverKey)} className={box}>{body}</Link>
                )}
              </div>
            );
          })}
        </div>
      </section>
  );
}
