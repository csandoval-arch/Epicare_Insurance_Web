"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const ZONE1_IMAGES = [
  asset('/Files/how-to-join/zone1-step1.webp'),
  asset('/Files/how-to-join/zone1-step2.webp'),
  asset('/Files/how-to-join/zone1-step3.webp'),
];

const ZONE2_IMAGES = [
  asset('/Files/how-to-join/zone2-step1.webp'),
  asset('/Files/how-to-join/zone2-step2.webp'),
  asset('/Files/how-to-join/zone2-step3.webp'),
];

function StatusCarousel({ images, id, accentClass }: { images: string[], id: string, accentClass: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <style>{`
        @keyframes status-progress-${id} {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
      {/* Status Bars (Liquid Glass) */}
      <div className="absolute top-6 left-6 right-6 z-20 flex gap-2">
        {images.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden liquid-glass bg-black/20 shadow-sm border border-white/10">
            <div 
              className="h-full bg-white"
              style={{
                width: i < activeIndex ? '100%' : '0%',
                animation: i === activeIndex ? `status-progress-${id} 5s linear forwards` : 'none'
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Images */}
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={`c-img-${id} absolute inset-0 w-full h-full object-cover object-[75%_center] transition-opacity duration-1000 ease-in-out ${
            i === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
      {/* Soft dark overlay for readability */}
      <div className="absolute inset-0 bg-[var(--color-surface-BG-black)]/20 z-20"></div>
      {/* Brand Color Tint */}
      <div className={`absolute inset-0 mix-blend-color opacity-30 z-20 ${accentClass}`}></div>
    </div>
  );
}


export default function HowToJoinEpicare() {
  const t = useTranslations("landingV2.howToJoin");
  
  const STEPS = Array.from({ length: 4 }).map((_, i) => ({
    num: `0${i + 1}`,
    title: t(`step${i + 1}Title`),
    desc: t(`step${i + 1}Desc`),
  }));
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeMobileStep, setActiveMobileStep] = useState(0);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / STEPS.length;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeMobileStep) {
      setActiveMobileStep(newIndex);
    }
  };

  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".htj-head, .htj-head-line, .htj-card, .c-text-block", {
          opacity: 1, y: 0, yPercent: 0, scale: 1
        });
        return;
      }

      const mm = gsap.matchMedia();

      // ── 1. Header Timeline (Sincronizado Título + Subtítulo) ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: TRIGGER.standard,
          toggleActions: "play none none reverse",
        }
      });

      headerTl
        .fromTo(".htj-head-line",
          { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" },
          {
            yPercent: 0,
            opacity: 1,
            duration: DUR.slow,
            ease: EASE.dramatic,
            force3D: true,
            clearProps: "willChange",
          }
        )
        .fromTo(".htj-head",
          { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            force3D: true,
            clearProps: "willChange",
          },
          "-=0.5"
        );

      // ── 2. Desktop Layout Animation ──
      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".c-text-block").forEach((block) => {
          gsap.fromTo(block.children, 
            { opacity: 0, y: REVEAL.sm, willChange: 'transform, opacity' },
            {
              opacity: 1, 
              y: 0,
              duration: DUR.base,
              stagger: STAGGER.base,
              ease: EASE.out,
              clearProps: "willChange",
              scrollTrigger: {
                trigger: block,
                start: TRIGGER.standard,
                toggleActions: "play none none reverse",
              }
            }
          );
        });

        gsap.to(".c-img-1", {
          scale: 1.1,
          scrollTrigger: { trigger: ".c-zone-1", scrub: true, start: "top top", end: "bottom top" }
        });
        gsap.to(".c-img-2", {
          scale: 1.1,
          scrollTrigger: { trigger: ".c-zone-2", scrub: true, start: "top top", end: "bottom top" }
        });
      });

      // ── 3. Mobile Layout: Staggered Cards Entrance ──
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(".htj-card",
          { opacity: 0, y: REVEAL.md, scale: 0.95, willChange: "transform, opacity" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DUR.base,
            stagger: STAGGER.wave,
            ease: EASE.out,
            force3D: true,
            clearProps: "willChange",
            scrollTrigger: {
              trigger: scrollContainerRef.current || el,
              start: TRIGGER.early,
              toggleActions: "play none none reverse",
            }
          }
        );
      });

    }, el);
    return () => ctx.revert();
  }, []);

  return (
    // `unete` es el destino real de los CTA de las secciones de producto
    // (Eppigo / Agency Solutions). Sin este ancla esos botones serían otro
    // href="#" muerto de los 22 que ya arrastra la landing.
    <section id="unete" ref={sectionRef} className="w-full relative bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)]">
      
      {/* ========================================================= */}
      {/* SECTION HEADER                                            */}
      {/* ========================================================= */}
      <header className="relative z-10 max-w-section-lg mx-auto w-full flex flex-col mb-8 md:mb-24 px-[var(--space-gutter-sm)] md:px-[clamp(1.5rem,4vw,3.5rem)] pt-section-sm md:pt-section-md">
        <span className="htj-head block text-overline text-[var(--color-brand-blue)] mb-4 md:mb-6">
          {t("overline")}
        </span>
        <h2 className="overflow-hidden pb-static-xs text-display-xl font-semibold tracking-tight leading-[1] text-[var(--color-text-Black-100)] dark:text-white">
          <span className="htj-head-line block">
            <span className="inline md:block">{t("title1")} </span>
            <span className="inline md:block text-[var(--color-brand-blue)]">{t("title2")}</span>
          </span>
        </h2>
      </header>
      
      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (Sticky Zones)                             */}
      {/* ========================================================= */}
      <div className="hidden md:block">
        {/* ── ZONA 1: Izquierda Fija / Derecha Scrollea (Pasos 1-3) ── */}
        <div className="c-zone-1 flex flex-col md:flex-row w-full relative">
        {/* Panel Izquierdo: Sticky Visual */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 overflow-hidden border-r border-[var(--color-border-Strokes-default)]">
          <StatusCarousel images={ZONE1_IMAGES} id="1" accentClass="bg-[var(--color-brand-blue)]" />
        </div>
        
        {/* Panel Derecho: Scroll de Textos */}
        <div className="w-[92%] md:w-1/2 py-[10vh] px-6 md:py-[20vh] md:px-[8vw] flex flex-col gap-[30vh] bg-[var(--color-surface-BG-white)] dark:bg-[#0D0D0E] md:bg-transparent md:dark:bg-transparent rounded-r-lg md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-none relative z-10 md:z-auto backdrop-blur-md md:backdrop-blur-none border border-white/20 dark:border-white/5 border-l-0 md:border-none">
          {STEPS.slice(0, 3).map((step, idx) => (
            <div key={idx} className="c-text-block max-w-lg mx-auto w-full">
              <span className="text-display-md text-[var(--color-brand-blue)] opacity-50 block mb-4">{step.num}</span>
              <h3 className="text-h2 text-[var(--color-text-primary)] mb-6">{step.title}</h3>
              <p className="text-subtitle text-[var(--color-text-secondary)] font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ZONA 2: EL SWAP - Izquierda Scrollea / Derecha Fija (Pasos 4-5) ── */}
      <div className="c-zone-2 flex flex-col-reverse md:flex-row w-full relative">
        {/* Panel Izquierdo: Scroll de Textos */}
        <div className="w-[92%] md:w-1/2 py-[10vh] px-6 md:py-[20vh] md:px-[8vw] flex flex-col justify-end gap-[30vh] bg-[var(--color-surface-BG-white)] dark:bg-[#0D0D0E] md:bg-transparent md:dark:bg-transparent rounded-r-lg md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-none relative z-10 md:z-auto backdrop-blur-md md:backdrop-blur-none border border-white/20 dark:border-white/5 border-l-0 md:border-none">
          {STEPS.slice(3, 6).map((step, idx) => (
            <div key={idx} className="c-text-block max-w-lg mx-auto w-full">
              <span className="text-display-md text-[var(--color-brand-orange)] opacity-50 block mb-4">{step.num}</span>
              <h3 className="text-h2 text-[var(--color-text-primary)] mb-6">{step.title}</h3>
              <p className="text-subtitle text-[var(--color-text-secondary)] font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Panel Derecho: Sticky Visual */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 overflow-hidden border-l border-[var(--color-border-Strokes-default)]">
          <StatusCarousel images={ZONE2_IMAGES} id="2" accentClass="bg-[var(--color-brand-orange)]" />
        </div>
      </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE LAYOUT (Horizontal Snap Carousel)                  */}
      {/* ========================================================= */}
      <div className="block md:hidden w-full pb-section-sm">
        
        <div 
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-[var(--space-gutter-sm)] gap-[var(--space-gutter-sm)] pb-4"
        >
          {STEPS.map((step, idx) => {
            const imgSrc = idx < 3 ? ZONE1_IMAGES[idx] : ZONE2_IMAGES[idx - 3];
            const isOrange = idx >= 3;
            return (
              <div key={idx} className="htj-card relative min-w-[85vw] h-[48dvh] max-h-[460px] snap-center flex flex-col justify-end rounded-3xl overflow-hidden shadow-elevation-3 border border-white/10 dark:border-white/5">
                {/* Image Background */}
                <img src={imgSrc} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-[75%_center]" />
                
                {/* Vignette / Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div> {/* Extra global darkening for contrast */}
                
                {/* Text Overlay */}
                <div className="relative z-10 px-static-md pt-static-md pb-6 flex flex-col gap-2.5">
                  <span className={`text-display-sm drop-shadow-md opacity-90 ${isOrange ? 'text-[var(--color-brand-orange)]' : 'text-[var(--color-brand-blue)]'}`}>
                    {step.num}
                  </span>
                  <h3 className="text-h3 font-semibold text-white drop-shadow-lg leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-body-sm font-light text-white/90 leading-relaxed drop-shadow-md">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-2 pb-6">
          {STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`transition-all duration-300 rounded-full ${
                idx === activeMobileStep 
                  ? "w-6 h-1.5 bg-[var(--color-brand-blue)] dark:bg-[var(--color-brand-cyan)]" 
                  : "w-1.5 h-1.5 bg-[var(--color-text-muted)] opacity-30"
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
