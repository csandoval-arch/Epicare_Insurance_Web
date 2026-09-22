'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedTitle, AnimatedTitleLine } from '@/components/AnimatedTitle';
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

// Contador fluido optimizado para 60fps (Hardware Symphony: ticker de un solo pase con once:true)
const AnimatedNumber = ({ value }: { value: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    const match = value.match(/([\d,\.]+)(.*)/);
    if (!match) return;

    const targetValue = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2] || '';
    if (isNaN(targetValue)) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      if (nodeRef.current) nodeRef.current.innerText = value;
      return;
    }

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: targetValue,
        duration: 1.6,
        ease: EASE.out,
        scrollTrigger: {
          trigger: nodeRef.current,
          start: TRIGGER.early,
          once: true, // Libera CPU y tickers inmediatamente al terminar
        },
        onUpdate: () => {
          if (nodeRef.current) {
            const currentVal = Math.floor(obj.val);
            const formatted = currentVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            nodeRef.current.innerText = `${formatted}${suffix}`;
          }
        }
      });
    });

    return () => ctx.revert();
  }, [value]);

  return <span ref={nodeRef} className="tabular-nums font-mono inline-block">{value}</span>;
};

export default function MetricsEpicare() {
  const t = useTranslations('landingV2.metrics');
  const sectionRef = useRef<HTMLDivElement>(null);

  const metricsData = [
    { value: "130+", label: t('carriers') },
    { value: "6,000+", label: t('years') },
    { value: "100+", label: t('agents') },
    { value: "2021", label: t('platform') }
  ];

  // ── GSAP: Hardware Symphony GPU Wave Reveal (Zero-Blur, Pure Transform + Opacity) ──
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".metric-bento-reveal", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(".metric-bento-reveal", 
        { 
          opacity: 0, 
          y: REVEAL.md, 
          scale: 0.96,
          willChange: "transform, opacity"
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DUR.base,
          stagger: STAGGER.base,
          ease: EASE.out,
          force3D: true,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: ".metric-grid-container",
            start: TRIGGER.early,
            toggleActions: "play none none reverse"
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full relative z-20 bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] transition-colors duration-500 pt-0 pb-section-sm md:pb-section-md">
      <div className="max-w-section-lg px-gutter-sm md:px-gutter-md">
        
        {/* ── Header Section ── */}
        <div className="pb-section-xs max-w-4xl">
          <AnimatedTitle className="text-display-lg text-[var(--color-text-Black-100)] dark:text-white">
            <AnimatedTitleLine>{t('titleLine1')}</AnimatedTitleLine>
            <AnimatedTitleLine>{t('titleLine2')}</AnimatedTitleLine>
            <AnimatedTitleLine className="text-[var(--color-brand-blue)]">{t('titleLine3')}</AnimatedTitleLine>
          </AnimatedTitle>
        </div>

        {/* ── Layout: Responsive Bento Box Grid (2x2 Mobile, 4-Cols Desktop) ── */}
        <div className="metric-grid-container grid grid-cols-2 lg:grid-cols-4 gap-static-sm">
          {metricsData.map((metric, idx) => (
            <div 
              key={idx} 
              className="metric-bento-reveal group relative 
                         p-static-md md:p-static-lg rounded-[12px] 
                         bg-[#ffffff] shadow-elevation-2 dark:bg-[#0a0a0a] 
                         border border-black/5 dark:border-white/10 dark:shadow-none dark:hover:border-white/20 
                         transition-transform duration-300 overflow-hidden"
            >
              {/* Blue Gradient Dots with Radial Diffusion (Desktop only for zero mobile raster lag) */}
              <div 
                className="hidden md:block absolute inset-0 pointer-events-none dark:hidden"
                style={{
                  maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
                }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-purple)]"
                  style={{
                    opacity: 0.20,
                    maskImage: 'radial-gradient(black 1.5px, transparent 1.5px)',
                    maskSize: '16px 16px',
                    WebkitMaskImage: 'radial-gradient(black 1.5px, transparent 1.5px)',
                    WebkitMaskSize: '16px 16px',
                  }}
                />
              </div>
              
              {/* Dark Mode Hover Glow */}
              <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-transparent to-[var(--color-brand-blue)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-4 md:gap-6 lg:gap-12">
                <div className="text-display-xs md:text-display-sm lg:text-display text-[var(--color-text-Black-100)] dark:text-white">
                  <AnimatedNumber value={metric.value} />
                </div>
                <div>
                  <div className="text-body-xs md:text-body-lg text-[var(--color-text-Black-100)] dark:text-white/90 leading-snug whitespace-pre-line">
                    {metric.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
