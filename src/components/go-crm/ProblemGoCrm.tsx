"use client";

/**
 * @file ProblemGoCrm.tsx
 * @description Sección 2 de GO CRM — "El problema". Grid minimalista y controlado, scroll normal.
 * Retícula con hairlines (`gap-px` sobre el color de borde), leída en el orden de la historia:
 * - Desktop (≥lg), 4×2: [titular ×2][frase 1][frase 2] / [frase 3][frase 4][resolución azul ×2].
 * - Tablet (md): 2 columnas (titular y resolución a lo ancho). Móvil: 1 columna.
 * Cada frase lleva su canal arriba (el día aparece al hover) y la frase abajo, con el lugar donde se
 * perdió en negrita. En móvil (<md) las 4 frases van en un slider horizontal de cuadrados.
 * Historial de paradigmas descartados: `project-context/sections/go-crm/context.md` §4.
 */

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

interface ProblemRow {
  channel: string;
  when: string;
}

const STORY_KEYS = ["p1", "p2", "p3", "p4"] as const;

const DESKTOP = "(min-width: 1024px)";
const MOBILE = "(max-width: 1023px)";
const FULL = "(prefers-reduced-motion: no-preference)";

const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
const BIRTH_TO = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };
const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
// clearProps también limpia el transform: una celda compuesta en capa propia se come el hairline de 1px (gap-px).
const CARD_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "transform,willChange" };
const oneShot = (trigger: Element | null, start: string = TRIGGER.standard) => ({
  scrollTrigger: { trigger, start, toggleActions: "play none none reverse" },
});

/** Relleno de celda: 14px laterales en móvil (gutter-sm), 24px en tablet, 32px en desktop. */
const CELL = "bg-[var(--color-surface-BG-base)] px-gutter-sm py-static-lg md:px-static-lg lg:p-static-xl";

export default function ProblemGoCrm() {
  const t = useTranslations("goCrm.problem");
  const rows = t.raw("rows") as ProblemRow[];
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  // Cuadrado activo del slider móvil (medido como mucho una vez por frame).
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      const index = Math.min(STORY_KEYS.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  const strong = (chunks: ReactNode) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>;
  const plain = (chunks: ReactNode) => <>{chunks}</>;

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      gsap.fromTo(".pg-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
    });
    // Desktop: las celdas entran en ola al llegar la retícula. Móvil: cada celda al entrar.
    mm.add(`${DESKTOP} and ${FULL}`, () => {
      gsap.fromTo(".pg-cell", CARD_FROM, { ...CARD_TO, stagger: STAGGER.wave, ...oneShot(el.querySelector(".pg-grid")) });
    });
    mm.add(`${MOBILE} and ${FULL}`, () => {
      gsap.utils.toArray<HTMLElement>(".pg-cell", el).forEach((cell) => gsap.fromTo(cell, CARD_FROM, { ...CARD_TO, ...oneShot(cell, TRIGGER.early) }));
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] py-section-sm lg:py-section-md">
      <div className="w-full max-w-[1440px] mx-auto px-gutter-sm md:px-gutter-md">
        <div className="pg-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border-Strokes-default)] border border-[var(--color-border-Strokes-default)]">
          {/* Titular */}
          <div className={`${CELL} pt-static-2xl md:pt-static-lg lg:pt-static-xl md:col-span-2 flex flex-col justify-between gap-static-2xl lg:min-h-80`}>
            <div className="overflow-hidden">
              <p className="pg-birth text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</p>
            </div>
            <div className="overflow-hidden pb-1">
              <h2 className="pg-birth text-display lg:text-display-lg text-[var(--color-text-primary)] max-w-2xl">{t("h2")}</h2>
            </div>
          </div>

          {/* ≥md — Las 4 frases: canal arriba (el día aparece al hover), la frase abajo */}
          {STORY_KEYS.map((key, i) => (
            <article key={key} className={`pg-cell group relative ${CELL} hidden md:flex flex-col justify-between gap-static-xl lg:min-h-80`}>
              {/* Acento al hover: línea azul que se extiende (scaleX, compositor) */}
              <span aria-hidden="true" className="absolute top-0 inset-x-0 h-0.5 bg-[var(--color-brand-blue)] origin-left scale-x-0 group-hover:scale-x-100 transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <div className="flex items-center justify-between gap-static-md">
                <span className="text-overline text-[var(--color-text-primary)] group-hover:text-[var(--color-text-accent-blue)] transition-colors duration-200">{rows[i].channel}</span>
                <span className="text-meta text-[var(--color-text-muted)] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  {rows[i].when}
                </span>
              </div>
              <p className="text-body-lg text-[var(--color-text-secondary)]">{t.rich(key, { b: strong })}</p>
            </article>
          ))}

          {/* <md — Slider horizontal nativo de cuadrados (scroll-snap): solo la frase, alineada arriba */}
          {/* -mt-px tapa el hairline con el titular: en móvil los cuadrados ya hacen de separador */}
          <div className="pg-cell pg-slider md:hidden -mt-px bg-[var(--color-surface-BG-base)] pb-static-lg flex flex-col gap-static-md">
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="flex gap-static-sm overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm scroll-px-[var(--space-gutter-sm)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {STORY_KEYS.map((key) => (
                <article key={key} className="w-[58vw] max-w-60 aspect-square shrink-0 snap-start flex flex-col justify-start p-static-md border border-[var(--color-border-Strokes-default)]">
                  <p className="text-body-lg text-[var(--color-text-secondary)]">{t.rich(key, { b: strong })}</p>
                </article>
              ))}
            </div>
            <div className="px-gutter-sm" aria-hidden="true">
              <div className="relative h-1.5 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden" style={{ width: `${STORY_KEYS.length * 2}rem` }}>
                <span
                  className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out"
                  style={{ translate: `${active * 100}% 0` }}
                />
              </div>
            </div>
          </div>

          {/* Resolución */}
          <div className={`pg-cell md:col-span-2 bg-[var(--color-brand-blue)] px-gutter-sm py-static-lg md:px-static-lg lg:p-static-xl flex flex-col justify-between gap-static-2xl lg:min-h-80`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="w-static-xl h-static-xl text-[var(--color-text-White-100)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <p className="text-display-sm lg:text-display text-[var(--color-text-White-100)] max-w-2xl">
              {t.rich("p5", { b: plain })}
              {t.rich("cierre", { b: plain })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
