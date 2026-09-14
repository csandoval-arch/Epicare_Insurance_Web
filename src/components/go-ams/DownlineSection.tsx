"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { 
  TreeStructure, 
  Sparkle,
  Certificate,
  UserPlus,
} from "@phosphor-icons/react";
import { asset } from "@/lib/asset";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER, SCRUB } from "@/lib/motion";

const CARDS_DATA = [
  {
    id: 1,
    titleKey: "card1Title",
    altKey: "card1Alt",
    image: "/Files/Go_AMS/downline/go-ams-downline-overview.webp",
    icon: <TreeStructure weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
  },
  {
    id: 2,
    titleKey: "card2Title",
    altKey: "card2Alt",
    image: "/Files/Go_AMS/downline/go-ams-downline-license-details.webp",
    icon: <Certificate weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
  },
  {
    id: 3,
    titleKey: "card3Title",
    altKey: "card3Alt",
    image: "/Files/Go_AMS/downline/go-ams-downline-invite.webp",
    icon: <UserPlus weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
  }
];

export default function DownlineSection() {
  const t = useTranslations('goAms.downline');
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  // Calcular la alineación fija en desktop sin forzar re-renders (evita hydration mismatch)
  useEffect(() => {
    const updateOffset = () => {
      if (headerRef.current && trackRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(headerRef.current);
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 24;
        const offset = rect.left + paddingLeft > 0 ? rect.left + paddingLeft : 24;
        
        if (window.innerWidth >= 768) {
          trackRef.current.style.paddingLeft = `${offset}px`;
        } else {
          trackRef.current.style.paddingLeft = '';
        }
      }
    };

    // Usar requestAnimationFrame para asegurar que el DOM ya está pintado
    requestAnimationFrame(updateOffset);
    window.addEventListener("resize", updateOffset);
    window.addEventListener("load", updateOffset);

    return () => {
      window.removeEventListener("resize", updateOffset);
      window.removeEventListener("load", updateOffset);
    };
  }, []);

  // Scroll handler para carrusel táctil en mobile
  const handleMobileScroll = () => {
    const track = trackRef.current;
    if (!track || window.innerWidth >= 768) return;
    const scrollLeft = track.scrollLeft;
    const firstCard = cardsRef.current[0];
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : track.clientWidth * 0.88;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveMobileIndex(Math.min(Math.max(index, 0), CARDS_DATA.length - 1));
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
        gsap.set(".dl-title-line, .dl-eyebrow, .dl-hint, .downline-card", {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1
        });
        return;
      }

      // ── 1. Entrada del Header (GPU transform + Eyebrow) ──
      gsap.fromTo(
        ".dl-title-line",
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
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".dl-eyebrow, .dl-hint",
        { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.fast,
          stagger: STAGGER.base,
          ease: EASE.out,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse",
          },
        }
      );

      const mm = gsap.matchMedia();

      // ── 2. DESKTOP & TABLET (≥ 768px): Pinned Horizontal Scrollytelling ──
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const pinSec = pinSectionRef.current;
        if (!track || !pinSec) return;

        const getScrollDistance = () => {
          const offset = parseFloat(track.style.paddingLeft) || 24;
          return track.scrollWidth - window.innerWidth + offset + 80;
        };

        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSec,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            anticipatePin: 1,
            scrub: SCRUB.crisp,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                gsap.set(progressBarRef.current, { scaleX: self.progress });
              }
            },
          }
        });

        horizontalTl.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
        });

        // Entrada sutil de las cards durante el scrub horizontal
        gsap.fromTo(
          ".downline-card",
          { opacity: 0.85, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pinSec,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ── 3. MOBILE (< 768px): Entrada de Cards ──
      mm.add("(max-width: 767px)", () => {
        const validCards = cardsRef.current.filter(Boolean);
        if (validCards.length > 0) {
          gsap.fromTo(
            validCards,
            { opacity: 0, y: 20, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.08,
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
        }
      });

    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="s08-downline" 
      className="w-full bg-[var(--color-surface-BG-base)] relative z-10 py-section-xs md:py-0 mb-section-sm md:mb-section-md"
    >
      <section
        ref={pinSectionRef}
        className="w-full md:h-dvh md:min-h-dvh flex flex-col justify-between overflow-hidden relative pt-2 md:pt-6 pb-4 md:pb-8"
      >
        {/* ── 1. Top Bar de Control & Título ── */}
        <div 
          ref={headerRef}
          className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md flex flex-col md:flex-row justify-between items-start md:items-end relative z-20 shrink-0 pb-3 md:pb-4 gap-3 md:gap-fluid-md"
        >
          {/* Título Principal */}
          <div className="flex flex-col items-start gap-1.5 text-left">
            <div className="dl-eyebrow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
              <span className="text-overline text-[var(--color-brand-blue)]">
                {t('overline')}
              </span>
            </div>
            
            <h2 className="text-display-lg font-semibold text-[var(--color-text-primary)] leading-[1.05] tracking-tight max-w-[800px]">
              <span className="block overflow-hidden pb-2">
                <span className="dl-title-line block">
                  {t('title1')} <span className="text-[var(--color-text-accent-blue)]">{t('title2')}</span>
                </span>
              </span>
            </h2>
          </div>

          {/* Indicador de Desplazamiento (Desktop) */}
          <div className="dl-hint hidden md:flex flex-col items-end gap-2 shrink-0 pb-1">
            <div className="flex items-center gap-2 text-meta text-[var(--color-text-muted)] font-mono">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
              <span>{t('scrollHint')}</span>
            </div>
            <div className="w-40 lg:w-48 h-1 rounded-full bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] overflow-hidden">
              <div 
                ref={progressBarRef} 
                className="w-full h-full bg-[var(--color-brand-blue)] origin-left scale-x-0 transition-transform duration-75"
              />
            </div>
          </div>
        </div>

        {/* ── 2. Track de Tarjetas con Título Encima y Formato Natural de Imagen ── */}
        <div className="w-full flex-1 flex items-center relative z-20 overflow-visible py-2 sm:py-4">
          <div
            ref={trackRef}
            onScroll={handleMobileScroll}
            className="flex items-start gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none -mx-gutter-sm px-gutter-sm md:mx-0 md:px-0 md:pr-[20vw] will-change-transform w-full"
          >
            
            {CARDS_DATA.map((card, idx) => (
              <div
                key={card.id}
                ref={(el) => { cardsRef.current[idx] = el; }}
                className="downline-card relative w-[88vw] sm:w-[78vw] md:w-[68vw] lg:w-[58vw] max-w-[840px] flex flex-col shrink-0 snap-center select-none group"
              >
                {/* Nombre con icono encima de la imagen */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 pb-2.5 sm:pb-4 px-1">
                  <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] border border-[var(--color-brand-blue)]/20 shrink-0">
                    {card.icon}
                  </div>
                  <span className="text-body-md sm:text-h5 md:text-h4 font-semibold text-[var(--color-text-primary)] tracking-tight">
                    {t(card.titleKey as any)}
                  </span>
                </div>

                {/* Screenshot en su formato natural */}
                <div className="relative w-full rounded-2xl md:rounded-[2rem] border border-[var(--color-border-Strokes-default)] shadow-elevation-3 overflow-hidden bg-[var(--color-surface-BG-1)]">
                  <img
                    src={asset(card.image)}
                    alt={t(card.altKey as any)}
                    className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ── 3. Puntos de Paginación Táctil (Solo Mobile) ── */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4">
          {CARDS_DATA.map((_, idx) => {
            const isActive = idx === activeMobileIndex;
            return (
              <button
                key={idx}
                onClick={() => scrollToMobileCard(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-6 h-1.5 bg-[var(--color-brand-blue)] shadow-[0_0_8px_rgba(53,187,253,0.6)]"
                    : "w-1.5 h-1.5 bg-[var(--color-border-Strokes-strong)]/40 hover:bg-[var(--color-border-Strokes-strong)]"
                }`}
              />
            );
          })}
        </div>

      </section>
    </div>
  );
}
