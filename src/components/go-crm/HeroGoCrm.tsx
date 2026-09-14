"use client";

/**
 * @file HeroGoCrm.tsx
 * @description Master Hero component for the GO CRM product page.
 * Implements a 12-column editorial grid, masked line-by-line text reveal,
 * BleedRight container for the video showcase, and strict Zero Px Policy.
 */

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, STAGGER, REVEAL } from "@/lib/motion";
import { asset } from "@/lib/asset";

/** Up-right arrow used inside the CTA button bubble */
const ArrowUR = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

/** 
 * Helper to make a container break out of the right side 
 * of the grid and touch the viewport edge 
 */
function BleedRight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024 && ref.current) {
        const originalRight = ref.current.style.right;
        ref.current.style.right = "0px";
        const rect = ref.current.getBoundingClientRect();
        const dist = document.documentElement.clientWidth - rect.right;
        ref.current.style.right = originalRight;
        setOffset(dist > 0 ? dist : 0);
      } else {
        setOffset(0);
      }
    };

    update();
    window.addEventListener("load", update);
    window.addEventListener("resize", update);

    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("load", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ right: offset > 0 ? `-${offset}px` : undefined }}
      className={`${className} min-w-[150%] w-[150%] -mr-[50%] lg:min-w-0 lg:w-full lg:mr-0`}
    >
      {children}
    </div>
  );
}

export default function HeroGoCrm() {
  const t = useTranslations("goCrm.hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tl: gsap.core.Timeline;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ".crm-hero-eyebrow, .crm-hero-title-line, .crm-hero-subtitle, .crm-hero-cta, .crm-hero-microcopy, .crm-hero-showcase",
          {
            opacity: 1,
            y: 0,
            yPercent: 0,
            scale: 1,
            filter: "none",
          }
        );
        return;
      }

      // Initial state
      gsap.set(".crm-hero-eyebrow", { opacity: 0, y: REVEAL.sm });
      gsap.set(".crm-hero-title-line", { yPercent: 120, opacity: 0 });
      gsap.set(".crm-hero-subtitle", { opacity: 0, y: REVEAL.md });
      gsap.set(".crm-hero-cta", { opacity: 0, scale: 0.9, y: REVEAL.sm });
      gsap.set(".crm-hero-microcopy", { opacity: 0, y: 10 });
      gsap.set(".crm-hero-showcase", { opacity: 0, y: 40, scale: 0.98 });

      tl = gsap.timeline({ paused: true });

      tl.to(".crm-hero-eyebrow", {
        opacity: 1,
        y: 0,
        duration: DUR.fast,
        ease: EASE.out,
      })
        .to(
          ".crm-hero-title-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: EASE.dramatic,
            stagger: STAGGER.base,
            force3D: true,
          },
          "-=0.2"
        )
        .to(
          ".crm-hero-microcopy",
          {
            opacity: 1,
            y: 0,
            duration: DUR.fast,
            ease: EASE.out,
          },
          "-=0.5"
        )
        .to(
          ".crm-hero-subtitle",
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
          },
          "-=0.4"
        )
        .to(
          ".crm-hero-cta",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.snap,
          },
          "-=0.3"
        )
        .to(
          ".crm-hero-showcase",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DUR.slow,
            ease: EASE.dramatic,
            force3D: true,
          },
          "-=0.5"
        );
    }, el);

    const playHeroEntrance = () => {
      requestAnimationFrame(() => {
        if (tl && tl.paused()) tl.play();
      });
    };

    if ((window as unknown as { epicareLoaderFinished?: boolean }).epicareLoaderFinished) {
      playHeroEntrance();
    } else {
      window.addEventListener("epicareLoaderFinished", playHeroEntrance, { once: true });
    }

    const fallbackId = setTimeout(playHeroEntrance, 4000);

    return () => {
      window.removeEventListener("epicareLoaderFinished", playHeroEntrance);
      clearTimeout(fallbackId);
      ctx.revert();
    };
  }, []);

  const handleCtaClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="hero-wrapper"
      ref={containerRef}
      className="w-full flex flex-col bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] relative overflow-x-clip pt-[calc(var(--space-section-md)+20px)] lg:pt-section-md pb-section-lg"
    >

      {/* ── 12-COLUMN UNIFIED HERO GRID ── */}
      <section className="relative w-full flex-1 px-gutter-sm lg:px-gutter-md">
        <div className="mx-auto max-w-section-xl w-full grid-layout gap-y-static-md lg:gap-y-static-xl">
          
          {/* ── TOP EDITORIAL ROW ── */}
          
          {/* Col 1-7: Eyebrow + Headline */}
          <div className="col-span-12 lg:col-start-1 lg:col-span-7 flex flex-col items-start justify-start gap-static-xs lg:pr-4 z-10">
            {/* Eyebrow */}
            <div className="crm-hero-eyebrow inline-flex items-center gap-static-xs mb-static-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
              <span className="text-overline text-[var(--color-text-accent-blue)]">
                {t("overline")}
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-display-xl text-[var(--color-text-primary)] w-full">
              <span className="block overflow-hidden pb-1">
                <span className="crm-hero-title-line block">
                  {t.rich("title", {
                    blue: (chunks) => (
                      <span className="text-[var(--color-brand-blue)]">
                        {chunks}
                      </span>
                    ),
                  })}
                </span>
              </span>
            </h1>
          </div>

          {/* Col 9-12: Subhead + CTA + Microcopy (Right Side) */}
          <div className="col-span-12 lg:col-start-9 lg:col-span-4 flex flex-col items-start justify-end gap-static-md z-10">
            
            {/* Construction Announcement Badge */}
            <div className="crm-hero-microcopy inline-flex items-center gap-2.5 px-4 py-2 mt-2 rounded-full border border-[var(--color-border-Strokes-default)] bg-transparent">
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)] animate-pulse shrink-0" />
              <span className="text-body-sm text-[var(--color-text-secondary)] font-medium">
                {t.rich("microcopy", {
                  muted: (chunks) => <span className="text-[var(--color-text-muted)] font-normal">{chunks}</span>
                })}
                {" "}
                <a
                  href="https://go.epicare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-brand-blue)] hover:underline font-semibold transition-colors"
                >
                  go.epicare.com
                </a>
              </span>
            </div>

            {/* Subtitle */}
            <p className="crm-hero-subtitle text-body-lg text-[var(--color-text-secondary)] max-w-[400px] leading-relaxed">
              {t.rich("subhead", {
                bold: (chunks) => (
                  <strong className="font-semibold text-[var(--color-text-primary)]">
                    {chunks}
                  </strong>
                ),
              })}
            </p>

            {/* Primary CTA & Mobile Scroll Bubble */}
            <div className="crm-hero-cta flex flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <button
                type="button"
                onClick={handleCtaClick}
                className="group w-fit min-w-[220px] md:min-w-0 h-12 pl-6 pr-2 rounded-full flex justify-between md:justify-start items-center gap-3 bg-[var(--color-brand-blue)] text-white shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150 cursor-pointer"
              >
                <span className="text-body-sm font-medium">
                  {copied ? "✓ Registrado" : t("cta")}
                </span>
                <span className="relative w-8 h-8 rounded-full bg-white text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
                  <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                  <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </button>
              
              {/* Mobile Scroll Bubble */}
              <button 
                onClick={() => {
                  const nextSection = document.getElementById("hero-wrapper")?.nextElementSibling;
                  if (nextSection) {
                    const top = nextSection.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="lg:hidden shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-brand-blue)] text-white shadow-elevation-2 active:scale-95 transition-transform cursor-pointer"
                aria-label="Scroll down"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
              </button>
            </div>
          </div>

          {/* ── LOWER PART: UI SHOWCASE PANEL (BLEED-RIGHT TO VIEWPORT EDGE) ── */}
          <div className="col-span-12 lg:col-start-2 lg:col-span-11 w-full mt-static-md lg:mt-static-lg">
            <BleedRight className="relative w-full h-auto">
              
              {/* Scroll Down Button (Desktop Only) */}
              <div className="absolute top-[140px] left-[-24px] -translate-x-full z-20 hidden lg:flex">
                <button 
                  onClick={() => {
                    const nextSection = document.getElementById("hero-wrapper")?.nextElementSibling;
                    if (nextSection) {
                      const top = nextSection.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[var(--color-brand-blue)] text-white shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-elevation-4 active:scale-95 cursor-pointer"
                  aria-label="Scroll down"
                >
                  <div className="absolute inset-0 rounded-full border border-white/20 scale-100 group-hover:scale-[1.15] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
                  <span className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="absolute w-5 h-5 transition-transform duration-[600ms] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:translate-y-10" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="absolute w-5 h-5 -translate-y-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:translate-y-0" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  </span>
                </button>
              </div>

              <div className="crm-hero-showcase relative w-full rounded-l-2xl lg:rounded-l-[24px] rounded-r-none border border-[var(--color-border-Strokes-default)] border-r-0 bg-[#0A0A0A] shadow-elevation-3 overflow-hidden p-0 flex flex-col">
                
                {/* ── APPLE WINDOW HEADER ── */}
                <div className="w-full h-[26px] lg:h-[34px] bg-[var(--color-surface-BG-1)] border-b border-[var(--color-border-Strokes-default)] flex items-center px-3 lg:px-4 shrink-0 z-10">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#FF5F56]" />
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#FFBD2E]" />
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#27C93F]" />
                  </div>
                  {/* Subtle url bar / drag handle */}
                  <div className="flex-1 flex justify-center ml-[-60px]">
                    <div className="h-3 lg:h-4 w-1/3 max-w-[240px] bg-white/5 rounded-md border border-white/5" />
                  </div>
                </div>

                {/* ── VIDEO CONTAINER (NATURAL ASPECT RATIO) ── */}
                <div className="relative w-full overflow-hidden bg-[#0A0A0A] flex justify-center items-center">
                  <video
                    src={asset("/Files/Go_CRM/Hero/crm_UI_Hero_video.mp4")}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto block origin-center"
                  />
                </div>

              </div>
            </BleedRight>
          </div>

        </div>
      </section>
    </div>
  );
}
