"use client";

import { Fragment, useLayoutEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "@/lib/motion";

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
/** Suavizado del scroll horizontal: más ágil que SCRUB.crisp (1). */
const TRACK_SCRUB = 0.5;
/** Scroll vertical necesario = ancho de la pista × este factor. */
const TRACK_DISTANCE_FACTOR = 0.5;

/** Frases de la historia, en orden. La última lleva el cierre y va resaltada en azul. */
const STORY_KEYS = ["p1", "p2", "p3", "p4"] as const;

const bold = (chunks: ReactNode) => <strong className="font-semibold">{chunks}</strong>;

/**
 * @file ProblemGoCrm.tsx
 * @description "El problema" de GO CRM. Pista horizontal pineada: panel de título + 4 frases de
 * la historia de una venta + panel azul de cierre. El scroll vertical la desplaza en X.
 */
export default function ProblemGoCrm() {
  const t = useTranslations("goCrm.problem");
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = container.current;
    const trackEl = track.current;
    if (!section || !trackEl) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(trackEl, {
        x: () => -(trackEl.scrollWidth - window.innerWidth),
        ease: EASE.none,
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: TRACK_SCRUB,
          end: () => "+=" + trackEl.scrollWidth * TRACK_DISTANCE_FACTOR,
          // Recalcula x y end al cambiar el viewport (sin esto, un resize deja la pista desfasada).
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const points = [
    ...STORY_KEYS.map((key) => <Fragment key={key}>&quot;{t.rich(key, { b: bold })}&quot;</Fragment>),
    <Fragment key="cierre">
      {t.rich("p5", { b: bold })} {t.rich("cierre", { b: bold })}
    </Fragment>,
  ];

  return (
    <section ref={container} className="h-screen w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex items-center">
      <div ref={track} className="flex h-full w-max items-stretch">

        {/* ── PANEL 0: TÍTULO ── */}
        <div className="w-[100vw] lg:w-[60vw] h-full flex flex-col justify-center px-static-xl lg:pr-16 lg:pl-[8vw] xl:pl-[12vw] border-r border-[var(--color-border-Strokes-default)] shrink-0">
          <p className="text-meta uppercase tracking-[0.2em] text-[var(--color-brand-blue)] mb-static-xl">
            {t("overline")}
          </p>
          <h2 className="text-display lg:text-[4.5vw] font-medium tracking-tight leading-[1.05] max-w-4xl">
            {t("h2")}
          </h2>
        </div>

        {/* ── PANELES 1-5: LA HISTORIA (el último, azul y más ancho, es el cierre) ── */}
        {points.map((text, i) => {
          const isHighlight = i === points.length - 1;
          return (
            <div
              key={i}
              className={`relative ${isHighlight ? "w-[90vw] lg:w-[35vw]" : "w-[85vw] lg:w-[28vw]"} h-full flex flex-col justify-center px-static-xl lg:px-16 border-r border-[var(--color-border-Strokes-default)] shrink-0 transition-colors duration-500
                ${isHighlight
                  ? "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)]"
                  : "bg-[var(--color-surface-BG-base)] hover:bg-[var(--color-surface-BG-1)] text-[var(--color-text-primary)]"
                }
              `}
            >
              {!isHighlight && (
                <span className="block text-body-md font-mono mb-static-2xl text-[var(--color-text-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <p className={`leading-relaxed ${isHighlight ? "text-display-sm font-bold text-[var(--color-text-White-100)] tracking-tight" : "text-display-xs font-light text-[var(--color-text-secondary)]"}`}>
                {text}
              </p>

              {isHighlight && (
                <div className="absolute bottom-static-2xl right-static-2xl lg:bottom-16 lg:right-16 text-white/80" aria-hidden="true">
                  <svg width="24" height="60" viewBox="0 0 24 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 lg:h-20 w-auto">
                    <path d="M12 2L12 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6 52L12 58L18 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* Respiro final para que el último panel no quede pegado al borde al terminar el scroll */}
        <div className="w-[10vw] lg:w-[20vw] h-full shrink-0 bg-[var(--color-surface-BG-base)]" />
      </div>
    </section>
  );
}
