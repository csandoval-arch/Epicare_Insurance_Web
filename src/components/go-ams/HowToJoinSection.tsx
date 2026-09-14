"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, DUR, REVEAL } from "@/lib/motion";

const STEPS = [
  { id: "01", titleKey: "step1Title", descKey: "step1Desc" },
  { id: "02", titleKey: "step2Title", descKey: "step2Desc" },
  { id: "03", titleKey: "step3Title", descKey: "step3Desc" },
  { id: "04", titleKey: "step4Title", descKey: "step4Desc" }
];

export default function HowToJoinSection() {
  const t = useTranslations('goAms.howToJoin');
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  // Scroll handler para carrusel táctil en mobile
  const handleMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track || window.innerWidth >= 768) return;
    const scrollLeft = track.scrollLeft;
    const firstCard = cardsRef.current[0];
    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : track.clientWidth * 0.82;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveMobileIndex(Math.min(Math.max(index, 0), STEPS.length - 1));
  };

  const scrollToMobileCard = (index: number) => {
    const card = cardsRef.current[index];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".join-title-line, .join-step-card-desktop", {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1
        });
        return;
      }

      // ── 1. Entrada de Cabecera (Trigger directo sobre el nodo ref) ──
      if (headerRef.current) {
        gsap.fromTo(
          ".join-title-line",
          { 
            yPercent: 120, 
            opacity: 0,
            willChange: "transform, opacity" 
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: DUR.base,
            ease: EASE.dramatic,
            stagger: 0.1,
            force3D: true,
            clearProps: "all",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 92%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // ── 2. Entrada de la Tabla / Carrusel (Wave Stagger) ──
      if (tableRef.current) {
        const mm = gsap.matchMedia(el);
        
        // Desktop: Animación en cascada con escala (no afecta scroll porque no es touch-swipe)
        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(
            ".join-step-card-desktop",
            { 
              opacity: 0, 
              y: 25, 
              scale: 0.97,
              willChange: "transform, opacity" 
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: EASE.out,
              force3D: true,
              clearProps: "all",
              scrollTrigger: {
                trigger: tableRef.current,
                start: "top 92%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        // Mobile: Animamos solo el contenedor completo (mobileTrackRef) con opacidad. 
        // Intervenir 'scale' en los hijos rompe la física de CSS snap-mandatory causando un frenón de scroll.
        mm.add("(max-width: 767px)", () => {
          gsap.fromTo(
            mobileTrackRef.current,
            { opacity: 0, y: 15, willChange: "transform, opacity" },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: EASE.out,
              force3D: true,
              clearProps: "all",
              scrollTrigger: {
                trigger: tableRef.current,
                start: "top 95%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

    }, el);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="how-to-join"
      className="w-full bg-[var(--color-surface-BG-1)] relative py-section-sm md:py-section-md overflow-hidden"
    >
      
      {/* ── CABECERA ── */}
      <div 
        ref={headerRef}
        className="w-full max-w-section-lg mx-auto px-3.5 sm:px-gutter-sm md:px-gutter-md pb-7 md:pb-14 text-left relative z-20"
      >
        <h2 className="text-display-lg md:text-display-xl font-semibold text-[var(--color-text-primary)] leading-[1.05] tracking-tight">
          <span className="block overflow-hidden pb-2">
            <span className="join-title-line block">
              {t('title1')} <span className="text-[var(--color-text-accent-blue)]">{t('title2')}</span>
            </span>
          </span>
        </h2>
      </div>

      {/* ── DATA TABLE & MOBILE CAROUSEL ── */}
      <div 
        ref={tableRef}
        className="w-full max-w-section-lg mx-auto px-0 md:px-gutter-md relative z-10"
      >
        
        {/* ── Mobile Horizontal Swipeable Track (< 768px) ── */}
        <div 
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 px-3.5 sm:px-gutter-sm py-4"
        >
          {STEPS.map((step, idx) => (
            <div 
              key={step.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="shrink-0 w-[78vw] sm:w-[300px] aspect-square snap-center p-6 rounded-2xl border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] shadow-elevation-2 flex flex-col justify-start select-none relative overflow-hidden"
            >
              <span className="text-data font-mono text-[var(--color-brand-blue)] mb-3 block select-none">
                {step.id}
              </span>
              
              <h3 className="text-h4 font-display uppercase tracking-tight text-[var(--color-text-primary)] mb-2.5">
                {t(step.titleKey as any)}
              </h3>
              
              <p className="text-body-sm sm:text-body-md text-[var(--color-text-secondary)] leading-relaxed">
                {t.rich(step.descKey as any, {
                  b: (chunks) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>,
                  bold: (chunks) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>
                })}
              </p>
            </div>
          ))}
        </div>

        {/* ── Puntos de Paginación Táctil (Solo Mobile) ── */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-2">
          {STEPS.map((_, idx) => {
            const isActive = idx === activeMobileIndex;
            return (
              <button
                key={idx}
                onClick={() => scrollToMobileCard(idx)}
                aria-label={`Paso ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-6 h-1.5 bg-[var(--color-brand-blue)] shadow-[0_0_8px_rgba(53,187,253,0.6)]"
                    : "w-1.5 h-1.5 bg-[var(--color-border-Strokes-default)]/40 hover:bg-[var(--color-border-Strokes-default)]"
                }`}
              />
            );
          })}
        </div>

        {/* ── Desktop Swiss Data Table (≥ 768px) ── */}
        <div className="hidden md:grid grid-cols-4 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] shadow-elevation-2 rounded-3xl overflow-hidden">
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className="join-step-card-desktop group relative p-6 md:p-8 flex flex-col justify-between border-r last:border-r-0 border-[var(--color-border-Strokes-default)] hover:bg-[var(--color-surface-BG-2)] transition-colors duration-300 select-none"
            >
              {/* Animación de barra superior al hacer hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--color-brand-blue)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              
              <div>
                <span className="text-data font-mono text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-blue)] transition-colors mb-6 md:mb-12 block select-none">
                  {step.id}
                </span>
                <h3 className="text-h4 font-display uppercase tracking-tight text-[var(--color-text-primary)] mb-3 md:mb-4">
                  {t(step.titleKey as any)}
                </h3>
              </div>
              
              <p className="text-body-sm text-[var(--color-text-secondary)] leading-relaxed">
                {t.rich(step.descKey as any, {
                  b: (chunks) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>,
                  bold: (chunks) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>
                })}
              </p>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
