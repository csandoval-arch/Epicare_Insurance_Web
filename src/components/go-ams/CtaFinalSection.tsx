"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { CtaPanel, CtaPanelButton } from "@/components/ui/CtaPanel";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";

export default function CtaFinalSection() {
  const t = useTranslations('goAms.ctaFinal');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".cta-monolith, .cta-eyebrow, .cta-title-line, .cta-desc, .cta-btn", {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: TRIGGER.standard,
          toggleActions: "play none none reverse"
        }
      });

      // 1. Contenedor Monolito (Scale up + Fade cinemático)
      tl.fromTo(
        ".cta-monolith",
        { opacity: 0, y: REVEAL.lg, scale: 0.96, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "willChange"
        }
      );

      // 3. Eyebrow
      tl.fromTo(
        ".cta-eyebrow",
        { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.fast,
          ease: EASE.out,
          clearProps: "willChange"
        },
        "<0.3" // Inicia 0.3s después de que empiece el fondo, cortando el delay
      );

      // 4. Título con GPU transform reveal
      tl.fromTo(
        ".cta-title-line",
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
        "<0.15" // Mucho más rápido, casi pegado al eyebrow
      );

      // 5. Descripción
      tl.fromTo(
        ".cta-desc",
        { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          clearProps: "willChange"
        },
        "<0.15"
      );

      // 6. Botones de Acción
      tl.fromTo(
        ".cta-btn",
        { opacity: 0, scale: 0.9, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: DUR.base,
          stagger: STAGGER.tight,
          ease: EASE.snap,
          force3D: true,
          clearProps: "willChange"
        },
        "<0.2"
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="cta-final"
      className="w-full relative bg-[var(--color-surface-BG-1)] pt-0 pb-section-xs md:pb-section-sm overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto pt-8 pb-8 md:pb-12 px-3.5 sm:px-4 md:px-8">
        <CtaPanel className="cta-monolith rounded-lg md:rounded-xl">
          <div className="relative z-10 text-left md:text-center px-3.5 py-10 sm:px-6 sm:py-12 md:py-16 flex flex-col items-start md:items-center">
            
            <span className="cta-eyebrow text-meta font-mono tracking-widest text-white/60 mb-4 uppercase border-b border-white/20 pb-1">
              {t('eyebrow')}
            </span>
            
            {/* Título Line-by-Line */}
            <h2 className="text-display-lg md:text-display-xl font-display font-bold text-white mb-4 drop-shadow-sm">
              <span className="block overflow-hidden pb-2">
                <span className="cta-title-line block">
                  {t('title1')} {t('title2')}
                </span>
              </span>
            </h2>
            
            <p className="cta-desc text-body-md sm:text-body-lg text-white/90 max-w-2xl mb-8 leading-relaxed">
              {t('desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-static-md md:gap-fluid-xs w-full justify-start md:justify-center max-w-md">
              <CtaPanelButton label={t('btnPrimary')} className="cta-btn" />
              <CtaPanelButton label={t('btnSecondary')} kind="secondary" className="cta-btn" />
            </div>

          </div>
        </CtaPanel>
      </div>
    </section>
  );
}
