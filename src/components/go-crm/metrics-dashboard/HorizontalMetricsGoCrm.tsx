"use client";

/**
 * @file HorizontalMetricsGoCrm.tsx
 * @description Sección 6 de GO CRM — "Métricas". Titular + 3 dashboards (calendario, pipeline,
 * velocidad) de la UI.
 * - Desktop (≥lg): una pista horizontal con pin y paralaje por acto.
 * - Móvil (<lg): titular y, debajo, los 3 dashboards en un slider horizontal nativo (scroll-snap):
 *   por slide, título fuera del dashboard, dashboard reducido a lo esencial y subtítulo.
 * Los loops (temporizadores de los carruseles, pulsos) son CSS y se pausan fuera de pantalla.
 */

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SlideCalendar from "./SlideCalendar";
import SlidePipeline from "./SlidePipeline";
import SlideVelocity from "./SlideVelocity";
import { useMetricsMotion } from "./useMetricsMotion";

/**
 * Temporizador de los carruseles (ver `TimerDots`): una barra que se vacía con `scaleX`. Al pausar
 * la sección (`.is-offscreen`) se congela y con ella la rotación.
 */
const METRICS_CSS = `
@keyframes md-timer { from { transform: scaleX(1); } to { transform: scaleX(0); } }
@media (prefers-reduced-motion: no-preference) {
  .md-root .md-timer { animation-name: md-timer; animation-timing-function: linear; animation-fill-mode: forwards; }
  .md-root.is-offscreen * { animation-play-state: paused; }
}
`;

/** Móvil: 86vw para que asome el siguiente dashboard. Desktop: acto de la pista horizontal. */
const SLIDE = "md-slide shrink-0 snap-start w-[86vw] lg:w-[85vw] lg:h-full flex items-center justify-center";

const ACTS = [
  { key: "calendar", Board: SlideCalendar, pad: "lg:px-gutter-md" },
  { key: "pipeline", Board: SlidePipeline, pad: "lg:px-gutter-md" },
  { key: "velocity", Board: SlideVelocity, pad: "lg:px-gutter-xl lg:ml-[50vw]" },
] as const;

export default function HorizontalMetricsGoCrm() {
  const t = useTranslations("goCrm.metricsDash");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  useMetricsMotion(sectionRef, trackRef);

  // Smart Shutdown: los loops CSS solo corren con la sección en pantalla.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Slide activo del slider móvil (medido como mucho una vez por frame).
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const slider = sliderRef.current;
      const first = slider?.firstElementChild as HTMLElement | null;
      if (!slider || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(slider).columnGap || "0");
      const index = Math.min(ACTS.length - 1, Math.max(0, Math.round(slider.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  return (
    <section
      ref={sectionRef}
      className="md-root is-offscreen relative w-full lg:h-screen bg-[var(--color-surface-BG-1)] overflow-hidden border-t border-[var(--color-border-Strokes-default)] py-section-md lg:py-0"
    >
      <style href="go-crm-metrics" precedence="default">{METRICS_CSS}</style>

      {/* Acentos de fondo: solo desktop (blur grande estático; en móvil cuesta GPU sin aportar) */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[var(--color-brand-blue)]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-brand-orange)]/5 blur-[80px]" />
      </div>

      <div ref={trackRef} className="flex flex-col gap-static-2xl lg:gap-0 lg:flex-row lg:h-full lg:w-max">
        {/* ACTO 1: TITULAR */}
        <div className="md-slide shrink-0 w-full lg:w-[45vw] flex flex-col justify-center px-gutter-sm lg:pl-gutter-xl lg:pr-0 lg:ml-[8vw]">
          <div className="relative z-10 w-full max-w-xl">
            <div className="overflow-hidden mb-static-md">
              <p className="md-text-reveal text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</p>
            </div>
            <div className="overflow-hidden pb-static-sm">
              <h2 className="md-text-reveal text-display-sm lg:text-display-lg text-[var(--color-text-primary)]">{t("headline")}</h2>
            </div>
            {/* Rayita azul siempre; el texto "Explora los datos en vivo" solo en desktop (invita al scroll del pin) */}
            <div className="overflow-hidden mt-static-md lg:mt-10">
              <div className="md-text-reveal flex items-center gap-4">
                <div className="w-12 h-1 bg-[var(--color-brand-blue)] rounded-full" aria-hidden="true" />
                <span className="hidden lg:inline text-body-md text-[var(--color-text-muted)]">{t("hint")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTOS 2-4: DASHBOARDS.
            - Móvil (<lg): slider horizontal nativo (scroll-snap, sin JS de arrastre). Cada slide:
              título fuera del dashboard, dashboard y subtítulo. Debajo, el indicador.
            - Desktop (≥lg): `lg:contents` disuelve el slider y los actos quedan como hijos directos
              de la pista del pin, igual que antes. */}
        <div className="md-slider flex flex-col gap-static-md lg:contents">
          <div
            ref={sliderRef}
            onScroll={onScroll}
            className="flex items-start gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm scroll-px-[var(--space-gutter-sm)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:contents"
          >
            {ACTS.map(({ key, Board, pad }) => (
              <div key={key} className={`${SLIDE} ${pad}`}>
                <article className="md-act w-full flex flex-col gap-static-md lg:block">
                  <h3 className="lg:hidden text-display-xs text-[var(--color-text-primary)]">{t(`${key}.title`)}</h3>
                  <div className="md-board w-full">
                    <Board />
                  </div>
                  <p className="lg:hidden text-body-md text-[var(--color-text-secondary)]">{t(`${key}.lead`)}</p>
                </article>
              </div>
            ))}
          </div>
          <div className="lg:hidden px-gutter-sm" aria-hidden="true">
            <div className="relative h-1.5 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden" style={{ width: `${ACTS.length * 2}rem` }}>
              <span
                className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out"
                style={{ translate: `${active * 100}% 0` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
