"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, DUR, STAGGER, REVEAL } from "@/lib/motion";
import { asset } from "@/lib/asset";
import SmartVideo from "@/components/epicare/SmartVideo";

gsap.registerPlugin(ScrollTrigger);

export default function DelegateUsersSection() {
  const t = useTranslations('goAms.delegateUsers');
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Cinematic Architect Tilt (Desktop)
  useEffect(() => {
    if (!sceneRef.current) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const xTo = gsap.quickTo(sceneRef.current, "rotationY", { duration: 0.8, ease: "power3" });
    const yTo = gsap.quickTo(sceneRef.current, "rotationX", { duration: 0.8, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 12; 
      const y = (clientY / window.innerHeight - 0.5) * -12;
      xTo(x);
      yTo(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // ── ENTRADA DEL COPY IZQUIERDO (Timeline directa con trigger en el bloque de texto) ──
      const copyTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".copy-column",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      copyTl
        .fromTo(
          ".delegate-eyebrow",
          { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
          {
            opacity: 1,
            y: 0,
            duration: DUR.fast,
            ease: EASE.out,
            clearProps: "willChange"
          }
        )
        .fromTo(
          ".delegate-title-line",
          {
            yPercent: 120,
            opacity: 0,
            willChange: "transform, opacity"
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: DUR.base,
            stagger: STAGGER.base,
            ease: EASE.dramatic,
            force3D: true,
            clearProps: "all"
          },
          "-=0.2"
        )
        .fromTo(
          ".delegate-subtitle",
          { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            clearProps: "willChange"
          },
          "-=0.4"
        );

    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="delegate-users"
      className="w-full bg-[var(--color-surface-BG-base)] relative z-10 py-section-sm md:py-section-md overflow-hidden"
    >
      <div className="w-full max-w-section-lg mx-auto px-gutter-sm md:px-gutter-md">
        <div className="grid-layout items-center gap-y-8 md:gap-fluid-lg">
          
          {/* ── LADO IZQUIERDO: Copy Simple Permanente ── */}
          <div className="copy-column col-span-12 lg:col-span-6 flex flex-col justify-center relative z-20 text-left">
            <div className="delegate-eyebrow flex items-center gap-2 mb-space-static-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
              <span className="text-overline text-[var(--color-brand-blue)]">
                {t('overline')}
              </span>
            </div>

            <h2 className="text-display-lg font-semibold text-[var(--color-text-primary)] leading-[1.1] tracking-tight mb-space-static-sm max-w-xl">
              <span className="block overflow-hidden pb-2">
                <span className="delegate-title-line block">
                  {t('title1')} <span className="text-[var(--color-text-accent-blue)]">{t('title2')}</span>
                </span>
              </span>
            </h2>
            
            <p className="delegate-subtitle text-body-sm sm:text-body-md md:text-body-lg text-[var(--color-text-secondary)] leading-relaxed max-w-[420px]">
              {t.rich('subtitle', {
                bold: (chunks) => <strong className="text-[var(--color-text-primary)] font-semibold">{chunks}</strong>
              })}
            </p>
          </div>

          {/* ── LADO DERECHO: Tarjeta 3D Completa con Giro 100% Fluido ── */}
          <div className="col-span-12 lg:col-span-6 relative flex justify-center items-center h-[420px] sm:h-[480px] lg:h-[600px] perspective-[1500px]">
            
            <div ref={sceneRef} className="relative w-full h-full flex justify-center items-center transform-style-3d">
              
              {/* VIDEO PLAYER INSTEAD OF 3D SCENE */}
              <div className="w-[320px] sm:w-[360px] lg:w-full max-w-md relative overflow-hidden rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-white/60">
                <SmartVideo
                  src={asset("/Files/Go_AMS/delegate/go-ams-delegate-users.mp4")}
                  poster={asset("/Files/Go_AMS/delegate/posters/go-ams-delegate-users-poster.webp")}
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
