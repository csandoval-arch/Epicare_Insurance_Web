'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Professional bezier for the slat reveal — smooth ease-in-out (cubic 0.65,0.05,0.36,1).
const REVEAL_EASE = 'M0,0 C0.65,0.05 0.36,1 1,1';

// ── CONFIG (No Magic Inline) ──────────────────────────────────────────────
/** PLACEHOLDER — a fitting people/team photo. Swap for the real one when ready. */
const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80';
/** Times the statement repeats inside one marquee group. */
const REPEATS = Array.from({ length: 5 });
/** Vertical slats in the full-bleed reveal mask. */
const SLATS = Array.from({ length: 9 });

/**
 * @description "Kinetic Marquee Portrait" — a full-bleed people band. Interlocking
 * slats (alternating up/down, from the centre) collapse on scroll to unveil the
 * photo, while the statement runs as an infinite marquee ON TOP, blended into the
 * image and skewing with scroll velocity. Bimodal, reduced-motion aware.
 */
export default function PeopleRevealEpicare() {
  const t = useTranslations('landingV2.peopleReveal');
  const sectionRef = useRef<HTMLElement>(null);

  const Group = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {REPEATS.map((_, i) => (
        <span key={i} className="flex items-center">
          <span className="px-[0.15em]">{t('statement')}</span>
          <span className="px-[0.15em] flex items-center justify-center text-[var(--color-brand-blue)]">
            <svg width="0.8em" height="0.8em" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Square (White) */}
              <path d="M26.9285 2.25869H8.07172C4.86133 2.25869 2.25879 4.86123 2.25879 8.07162V26.9284C2.25879 30.1388 4.86133 32.7413 8.07172 32.7413H26.9285C30.1389 32.7413 32.7414 30.1388 32.7414 26.9284V8.07162C32.7414 4.86123 30.1389 2.25869 26.9285 2.25869Z" fill="white"/>
              {/* Inner Shapes (Brand Blue via currentColor) */}
              <path d="M15.2695 20.88L26.7871 16.2409C27.1128 16.1098 27.2994 15.762 27.2225 15.4189C26.2319 10.9885 22.2717 7.62417 17.5476 7.62417C15.1324 7.62417 12.7487 8.30639 11.201 9.92566C10.9782 10.1591 10.7943 10.4206 10.7943 10.4206C10.6284 10.7096 10.5569 10.8881 10.5007 11.1249C10.4291 11.4272 10.4331 11.7416 10.5027 12.0446C10.601 12.4706 10.7348 12.8913 10.9053 13.3033C11.2344 14.0966 11.6819 14.8149 12.2263 15.441C13.069 13.3548 15.1592 11.8412 17.547 11.8412C19.1609 11.8412 20.5347 12.4312 21.5701 13.5107L17.7476 15.0537C15.4856 15.9647 14.376 18.5738 15.2695 20.8807V20.88Z" fill="currentColor"/>
              <path d="M26.8841 20.8399C26.9289 20.7222 26.8667 20.5911 26.7463 20.5543C25.9891 20.3229 24.511 19.8787 24.3919 19.8433C24.1699 19.7824 23.485 19.5122 22.6215 19.9343C21.7313 20.3516 20.8056 22.3461 18.9924 22.8344C15.6381 23.6744 12.9554 21.5221 12.1989 19.1009C11.8805 18.0802 11.9661 16.9151 11.9909 16.6977C10.193 14.6611 9.5108 12.3603 9.45194 12.0064C8.3838 13.5809 7.75977 15.4811 7.75977 17.5278C7.75977 22.9668 12.1688 27.3758 17.6078 27.3758C21.8169 27.3758 25.4721 24.5613 26.8841 20.8399Z" fill="currentColor"/>
            </svg>
          </span>
        </span>
      ))}
    </div>
  );

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sectionRef.current;
    if (!el) return;

    let ctx: gsap.Context | undefined;

    // CRITICAL FIX: Delay trigger creation so upstream sections (like BentoGrid with its 100ms delay)
    // create their pinned triggers FIRST. If this creates its trigger before the pin is registered,
    // the mathematical start positions will be completely misaligned.
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        if (reduce) {
          gsap.set('.pr-slat', { scaleY: 0, opacity: 0 });
          return;
        }

        // Full-bleed photo — interlocking slat reveal: bars collapse AND fade out.
        // Long scroll window + pro bezier + high scrub = slow, buttery, no jumps.
        const proReveal = CustomEase.create('proReveal', REVEAL_EASE);
        
        // Filtrar sólo los cuadritos (slats) visibles para que el cálculo del centro ('from: center') sea perfecto
        const visibleSlats = gsap.utils.toArray('.pr-slat').filter((el: any) => getComputedStyle(el).display !== 'none');

        gsap.to(visibleSlats, {
          scaleY: 0,
          opacity: 0,
          transformOrigin: (i: number) => (i % 2 === 0 ? 'top center' : 'bottom center'),
          ease: proReveal,
          stagger: { each: 0.07, from: 'center', ease: proReveal },
          scrollTrigger: { trigger: el, start: 'top 88%', end: '+=85%', scrub: 3 },
        });

        // Photo — very gentle parallax drift, smoothed.
        gsap.fromTo('.pr-img',
          { yPercent: -5 },
          {
            yPercent: 5, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 2 },
          }
        );

        // Infinite Marquee — constant subtle drift
        const marqueeTween = gsap.to('.pr-marquee-inner', {
          xPercent: -50,
          ease: 'none',
          duration: 60, // Hyper-slow, majestic constant drift
          repeat: -1,
        });

        // Kinetic Scroll Acceleration & Velocity Skew
        const proxy = { skew: 0, velocity: 0 };
        const setSkew = gsap.quickSetter('.pr-marquee-inner', 'skewX', 'deg');
        const clampSkew = gsap.utils.clamp(-3.5, 3.5);
        
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = self.getVelocity();
            
            // 1. Skew logic (barely perceptible tilt on fast scroll)
            const skewV = clampSkew(v / -1000);
            if (Math.abs(skewV) > Math.abs(proxy.skew)) {
              proxy.skew = skewV;
              gsap.to(proxy, {
                skew: 0, duration: 1, ease: 'power3', overwrite: 'auto',
                onUpdate: () => setSkew(proxy.skew),
              });
            }

            // 2. Acceleration logic: Professional, controlled kinetic push
            // Math.abs ensures it ALWAYS pushes forward, never reversing abruptly.
            // Divisor increased to 1500 for an incredibly subtle, premium acceleration.
            proxy.velocity = Math.abs(v) / 1500;
            gsap.to(proxy, {
              velocity: 0, 
              duration: 2.0, // Extremely buttery deceleration (2 seconds)
              ease: 'power3.out', 
              overwrite: 'auto',
              onUpdate: () => {
                marqueeTween.timeScale(1 + proxy.velocity);
              }
            });
          },
        });

        // Force recalculation in case upstream images (like Product Spotlight) shifted the layout
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        
      }, el);
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] z-20 transition-colors duration-500 h-[72vh] md:h-screen"
    >
      {/* Full-bleed photo (PLACEHOLDER — replace with the real people photo) */}
      <img
        src={PLACEHOLDER_IMG}
        alt={t('imageAlt')}
        loading="lazy"
        decoding="async"
        className="pr-img absolute inset-0 w-full h-full object-cover scale-[1.18] will-change-transform"
      />

      {/* Slat reveal mask — page-coloured bars that collapse to unveil the photo */}
      <div className="absolute inset-0 flex pointer-events-none z-10" aria-hidden="true">
        {SLATS.map((_, i) => (
          <div
            key={i}
            // En móvil solo dejamos 4 columnas vivas. El resto se esconden y GSAP las ignora en el array.
            className={`pr-slat flex-1 h-full bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] will-change-transform ${
              i >= 4 ? 'hidden md:block' : 'block'
            }`}
          />
        ))}
      </div>

      {/* Kinetic marquee ON TOP of the image, along the bottom */}
      <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-20 flex whitespace-nowrap pointer-events-none select-none mix-blend-difference">
        <div className="pr-marquee-inner flex will-change-transform text-display-2xl md:text-display-3xl tracking-tighter leading-none text-white">
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  );
}
