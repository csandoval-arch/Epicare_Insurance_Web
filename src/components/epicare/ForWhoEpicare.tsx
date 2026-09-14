'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

gsap.registerPlugin(ScrollTrigger);

// ── CONFIG (No Magic Inline) ──────────────────────────────────────────────
type AudienceKey = 'agent' | 'agency';

const AUDIENCE_ORDER: AudienceKey[] = ['agent', 'agency'];

/** Brand accent per panel — Agent = blue, Agency = orange. */
const ACCENT: Record<AudienceKey, string> = {
  agent: 'var(--color-brand-blue)',
  agency: 'var(--color-brand-orange)',
};

/** Panel background image (cover). */
const HERO: Record<AudienceKey, string> = {
  agent: asset('/Files/for-who/agent-hero.jpeg'),
  agency: asset('/Files/for-who/agency-hero.jpeg'),
};

/**
 * @description "Choose your path" — an immersive dual-panel audience split. Two full-bleed
 * cinematic panels (Agent = blue, Agency = orange) sit side by side; each is a cover image
 * under a scrim with oversized kinetic type. Hovering a panel expands it and reveals its
 * capabilities in a glass sheet over the image; the other yields. A centered headline is
 * born through a mask, panels rise with a clip-path curtain and their giant numerals
 * parallax on scroll. Bimodal, tokenized, 60fps, reduced-motion aware; stacks on mobile.
 */
const MobileAccordion = ({ aud, accent, HERO, isOpen, onClick }: any) => {
  return (
    <article className="fw-mobile-curtain w-full border-b border-black/10 dark:border-white/20 flex flex-col group cursor-pointer" onClick={onClick}>
       {/* Header (Always visible) */}
       <div className="w-full flex items-center justify-between py-6 px-[var(--space-gutter-sm)]">
          <div className="flex items-center gap-4">
             <span className={`text-display-sm font-semibold tabular-nums transition-[transform,opacity,color] duration-500 ${isOpen ? 'bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-cyan)] bg-clip-text text-transparent scale-110 origin-left' : 'text-black/30 dark:text-white/30'}`}>
               {aud.index}
             </span>
             <h3 className="text-display-sm font-semibold tracking-tighter text-[var(--color-text-Black-100)] dark:text-white">
               {aud.title}
             </h3>
          </div>
          {/* Animated Plus/Minus */}
          <div className="w-8 h-8 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center shrink-0">
             <span className="relative w-full h-full flex items-center justify-center">
                <span className="absolute w-3 h-[1.5px] bg-[var(--color-text-Black-100)] dark:bg-white transition-transform duration-500" />
                <span className={`absolute w-3 h-[1.5px] bg-[var(--color-text-Black-100)] dark:bg-white transition-transform duration-500 ${isOpen ? 'rotate-0' : 'rotate-90'}`} />
             </span>
          </div>
       </div>

       {/* Body (Collapsible via CSS Grid) */}
       <div className={`grid transition-[grid-template-rows,opacity,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0 pb-0'}`}>
          <div className="overflow-hidden flex flex-col gap-4">
             {/* Kicker */}
             <div className="flex items-center gap-3 mt-2 px-[var(--space-gutter-sm)]">
                <span className="w-6 h-[1px] bg-black/40 dark:bg-white/40" />
                <span className="text-overline text-[var(--color-text-Black-100)]/80 dark:text-white/80 tracking-widest uppercase">
                   {aud.kicker}
                </span>
             </div>
             
             <div 
               className="relative h-[28vh] overflow-hidden mt-4 shadow-[var(--shadow-elevation-2)] dark:shadow-none bg-[#050505]"
               style={{ width: '100vw', marginLeft: 'calc(var(--space-gutter-sm) * -1)' }}
             >
                <div className="fw-mobile-cover absolute inset-0 w-full h-full will-change-transform">
                   <img
                     src={HERO[aud.key]}
                     alt={aud.heroAlt}
                     loading="lazy"
                     decoding="async"
                     className={`absolute inset-0 w-full h-full object-cover origin-center transition-[transform,opacity] duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'scale-100 opacity-100' : 'scale-[1.15] opacity-0'}`} 
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 pointer-events-none" />
                <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isOpen ? 'opacity-20' : 'opacity-0'}`} style={{ backgroundColor: accent }} />
             </div>
             
             {/* Capabilities List */}
             <ul className="flex flex-col gap-0 mt-4 px-[var(--space-gutter-sm)]">
               {aud.items.map((item: string, i: number) => (
                 <li key={item} 
                     style={{ transitionDelay: `${i * 80}ms` }}
                     className={`flex items-start gap-4 py-4 border-b border-black/10 dark:border-white/10 last:border-b-0 transition-[transform,opacity] duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                     className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }}>
                     <path d="m5 12 5 5L20 7" />
                   </svg>
                   <span className="text-body-md font-light text-[var(--color-text-Black-100)]/90 dark:text-white/90 leading-relaxed">{item}</span>
                 </li>
               ))}
             </ul>

             {/* Action Link */}
             <div className="pt-2 pb-4 px-[var(--space-gutter-sm)] flex justify-end">
                <a href="#" 
                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                   onTouchStart={() => {}} // Forzar :active state en iOS Safari
                   style={{ transitionDelay: `${aud.items.length * 80}ms` }}
                   className={`group/link inline-flex items-center gap-2 text-body-md font-semibold text-[var(--color-brand-blue)] transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                   <span className="relative">
                      Explore features
                      <span className="absolute left-0 -bottom-[2px] w-full h-[1.5px] bg-[var(--color-brand-blue)] origin-right transition-transform duration-300 ease-out group-hover/link:scale-x-0 group-hover/link:origin-left group-active/link:scale-x-0 group-active/link:origin-left" />
                   </span>
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} 
                        className="w-4 h-4 transition-transform duration-300 ease-out group-hover/link:translate-x-1 group-active/link:translate-x-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                   </svg>
                </a>
             </div>
          </div>
       </div>
    </article>
  );
};

const MobileAccordionGroup = ({ audiences, HERO, ACCENT }: any) => {
  // Independent toggle state prevents the scroll-jump UX issue
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({
    [audiences[0].key]: true
  });

  const toggle = (key: string) => {
    setOpenStates(prev => ({ ...prev, [key]: !prev[key] }));
    
    // Altera la altura del documento, obligando a GSAP a recalcular sus disparadores 
    // de Parallax. El acordeón tarda 500ms en abrirse.
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }, 550);
  };

  return (
    <div className="fw-stage mt-6 flex lg:hidden flex-col w-full border-t border-black/10 dark:border-white/20">
      {audiences.map((aud: any) => (
         <MobileAccordion 
            key={aud.key} 
            aud={aud} 
            accent={ACCENT[aud.key]} 
            HERO={HERO} 
            isOpen={!!openStates[aud.key]}
            onClick={() => toggle(aud.key)}
         />
      ))}
    </div>
  );
};

export default function ForWhoEpicare() {
  const t = useTranslations('landingV2.forWho');
  const sectionRef = useRef<HTMLElement>(null);

  const audiences = AUDIENCE_ORDER.map((key, i) => ({
    key,
    index: `0${i + 1}`,
    title: t(`${key}Title`),
    kicker: t(`${key}Kicker`),
    items: t.raw(`${key}Items`) as string[],
    heroAlt: t(`${key}Img1Alt`),
  }));

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sectionRef.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)"
    }, (context) => {
      if (reduce) {
        gsap.set('.fw-head, .fw-line, .fw-panel, .fw-num, .fw-mobile-curtain', { opacity: 1, y: 0, yPercent: 0 });
        gsap.set('.fw-curtain', { clipPath: 'inset(0% 0% 0% 0%)' });
        return;
      }

      // Headline text-birth (All screens)
      gsap.fromTo('.fw-line', { yPercent: 118, willChange: 'transform' },
        { yPercent: 0, duration: 1.15, stagger: 0.12, ease: 'power4.out', clearProps: 'willChange',
          scrollTrigger: { trigger: el, start: 'top 82%' } });
      gsap.fromTo('.fw-head', { opacity: 0, y: 26, willChange: 'transform, opacity' },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'willChange',
          scrollTrigger: { trigger: el, start: 'top 80%' } });

      // Giant numerals — parallax (All screens)
      gsap.utils.toArray<HTMLElement>('.fw-num').forEach((num) => {
        gsap.fromTo(num, { yPercent: 20, willChange: 'transform' }, { yPercent: -20, ease: 'none', clearProps: 'willChange',
          scrollTrigger: { trigger: '.fw-stage', start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      if (context.conditions?.isDesktop) {
        // Desktop Panels — Safe Reveal
        gsap.utils.toArray<HTMLElement>('.fw-curtain').forEach((panel) => {
          gsap.fromTo(panel, { opacity: 0, y: 60, willChange: 'transform, opacity' },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', clearProps: 'willChange',
              scrollTrigger: { trigger: panel, start: 'top 85%' } });
        });
        
        // Desktop Cover Parallax
        gsap.utils.toArray<HTMLElement>('.fw-cover').forEach((img) => {
          gsap.fromTo(img, { yPercent: -8, willChange: 'transform' }, { yPercent: 8, ease: 'none', clearProps: 'willChange',
            scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }

      if (context.conditions?.isMobile) {
        // Mobile Accordions — Reveal
        gsap.utils.toArray<HTMLElement>('.fw-mobile-curtain').forEach((acc) => {
          gsap.fromTo(acc, { opacity: 0, y: 30, willChange: 'transform, opacity' },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', clearProps: 'willChange',
              scrollTrigger: { trigger: acc, start: 'top 90%' } });
        });

        // Mobile Image Parallax (Precise 52px vertical drift)
        gsap.utils.toArray<HTMLElement>('.fw-mobile-cover').forEach((cover) => {
          gsap.fromTo(cover, { y: -52, scale: 1.2, willChange: 'transform' }, { y: 52, scale: 1.2, ease: 'none', clearProps: 'willChange',
            scrollTrigger: { trigger: cover.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] pt-0 pb-section-sm md:pb-section-lg transition-colors duration-500"
    >
      {/* ── CENTERED HEADER ── */}
      <div className="max-w-section-lg mx-auto w-full px-[var(--space-gutter-sm)] md:px-[var(--space-gutter-md)] pt-section-sm md:pt-section-md">
        <header className="text-left md:text-center max-w-7xl mx-auto">
          <span className="fw-head block text-overline text-[var(--color-brand-blue)] mb-6">
            {t('overline')}
          </span>
          <h2 className="text-display-xl font-semibold tracking-tight leading-[1] text-[var(--color-text-Black-100)] dark:text-white">
            <span className="block overflow-hidden pb-static-xs">
              <span className="fw-line inline-block">{t('titleLine1')}</span>
            </span>
            <span className="block overflow-hidden pb-static-xs">
              <span className="fw-line inline-block text-[var(--color-text-muted)]">{t('titleLine2')}</span>
            </span>
          </h2>
        </header>
      </div>

      {/* ── DUAL PANELS (DESKTOP: Hover to Expand) ── */}
      <div className="fw-stage mt-8 md:mt-10 hidden lg:flex flex-row w-full max-w-section-lg mx-auto gap-[var(--spacing-static-sm)] px-[var(--space-gutter-md)]">
        {audiences.map((aud) => {
          const accent = ACCENT[aud.key];
          return (
            <article
              key={aud.key}
              className="fw-panel fw-curtain group relative overflow-hidden rounded-3xl h-[70vh] flex flex-col flex-1 grow basis-0 hover:grow-[1.9] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[flex-grow]"
            >
              {/* Cover image + parallax */}
              <img src={HERO[aud.key]} alt={aud.heroAlt} loading="lazy"
                className="fw-cover absolute inset-0 w-full h-full object-cover object-center scale-[1.15]" />

              {/* Scrims — dark base + brand tint that intensifies on hover */}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
              <div aria-hidden="true"
                className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 mix-blend-soft-light"
                style={{ background: `linear-gradient(160deg, ${accent} 0%, transparent 60%)` }} />

              {/* Giant index numeral — top */}
              <span aria-hidden="true"
                className="fw-num absolute top-6 right-7 z-10 text-display-2xl font-semibold tabular-nums leading-none text-[var(--color-text-White-100)]/15">
                {aud.index}
              </span>

              {/* Content — anchored bottom */}
              <div className="relative z-20 mt-auto p-static-2xl flex flex-col w-full">
                <span className="inline-flex items-center gap-2 text-overline text-[var(--color-text-White-100)]/70 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  {aud.kicker}
                </span>
                <h3 className="text-display font-semibold tracking-tight text-[var(--color-text-White-100)]">
                  {aud.title}
                </h3>

                {/* Capabilities — Visible by default on mobile, hidden behind hover on desktop */}
                <ul className="mt-6 max-w-xl grid gap-y-0 opacity-0 translate-y-6 max-h-0 overflow-hidden
                  group-hover:opacity-100 group-hover:translate-y-0 group-hover:max-h-[34rem]
                  transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  {aud.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 py-2.5 border-t border-[var(--color-text-White-100)]/15">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                        className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accent }}>
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      <span className="text-body-sm font-light text-[var(--color-text-White-100)]/85">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover hint (fades out on hover) */}
                <span className="mt-5 text-caption text-[var(--color-text-White-100)]/50 opacity-100 group-hover:opacity-0 transition-opacity duration-300 hidden lg:block">
                  {t('hoverHint')}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── DUAL PANELS (MOBILE: Concept B - Accordion) ── */}
      <MobileAccordionGroup audiences={audiences} HERO={HERO} ACCENT={ACCENT} />
    </section>
  );
}
