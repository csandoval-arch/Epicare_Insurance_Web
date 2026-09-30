"use client";

/**
 * @file HistoryCompany.tsx
 * @description La historia de Epicare en /company: titular + 3 celdas (antes de 2021 · junio 2021 ·
 * hoy). Cada celda: fecha (mono, azul) → título → texto.
 * - Desktop (≥lg): retícula de hairlines de 3 columnas; al hover, línea azul superior en la celda.
 * - Móvil / tablet: slider nativo (`scroll-snap`) de tarjetas con indicador; la siguiente asoma.
 *   Mismo DOM: el track se convierte en la retícula en ≥lg.
 * Destino del CTA "Nuestra historia" del Hero. Motion en `history/useHistoryMotion.ts`.
 */

import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { COMPANY_STORY_ID } from "./HeroCompany";
import { useHistoryMotion } from "./history/useHistoryMotion";

type HistoryItem = { meta: string; title: string; body: string };

/** Énfasis dentro de los párrafos largos: tinta del titular en seminegrita (el azul saturaría). */
const bold = (chunks: ReactNode) => <strong className="font-semibold text-[var(--color-hero-ink)]">{chunks}</strong>;

/** Track: slider en <lg (con aire vertical para que el overflow no recorte la sombra de las tarjetas),
 *  retícula de hairlines en ≥lg. */
const TRACK =
  "hs-grid flex gap-static-sm overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm pt-static-sm pb-[var(--space-section-sm)] -mb-static-2xl lg:mb-0 scroll-px-[var(--space-gutter-sm)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
  "lg:grid lg:grid-cols-3 lg:gap-px lg:overflow-visible lg:p-0 lg:bg-[var(--color-border-Strokes-default)] lg:border lg:border-[var(--color-border-Strokes-default)]";
/** Celda: tarjeta con borde en el slider (la siguiente asoma), celda de la retícula en ≥lg. */
const CELL =
  "hs-cell group relative flex flex-col shrink-0 snap-start w-[86vw] md:w-[60vw] border border-[var(--color-border-Strokes-default)] max-lg:shadow-[var(--shadow-elevation-2)] bg-[var(--color-hero-ivory)] px-gutter-sm py-static-xl md:p-static-lg " +
  "lg:w-auto lg:border-0 lg:p-static-xl";

export default function HistoryCompany() {
  const t = useTranslations("company.history");
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  const items = t.raw("items") as HistoryItem[];

  useHistoryMotion(containerRef);

  /** Slide activo del slider (medido como mucho una vez por frame). */
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      const index = Math.min(items.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  return (
    <section
      id={COMPANY_STORY_ID}
      ref={containerRef}
      className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] z-20 py-section-md lg:py-section-lg"
    >
      {/* ── TITULAR ── */}
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md grid-layout mb-static-2xl lg:mb-[var(--space-section-xs)]">
        <h2 className="col-span-full lg:col-span-8 text-display-lg overflow-hidden pb-static-xs">
          <span className="hs-title-line block">{t("title")}</span>
        </h2>
      </div>

      {/* ── SLIDER (<lg) · RETÍCULA DE 3 COLUMNAS (≥lg) ── */}
      <div className="w-full max-w-section-xl mx-auto lg:px-gutter-md flex flex-col gap-static-xs">
        <div ref={trackRef} onScroll={onScroll} className={TRACK}>
          {items.map((item, i) => (
            <article key={item.meta} className={CELL}>
              {/* Detalle al hover (desktop): línea azul superior */}
              <span
                className="hs-line hidden lg:block absolute inset-x-0 top-0 h-px bg-[var(--color-brand-blue)] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                aria-hidden="true"
              />
              <span className="text-meta text-[var(--color-hero-blue)] mb-static-sm">{item.meta}</span>
              <h3 className="text-h3 mb-static-lg">{item.title}</h3>
              <p className="text-body-md text-[var(--color-text-secondary)]">{t.rich(`items.${i}.body`, { b: bold })}</p>
            </article>
          ))}
        </div>

        {/* Indicador del slider: pista n×2rem, pulgar movido con `translate` (compositor) */}
        <div className="lg:hidden px-gutter-sm md:px-gutter-md" aria-hidden="true">
          <div
            className="relative h-1.5 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden"
            style={{ width: `${items.length * 2}rem` }}
          >
            <span
              className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out"
              style={{ translate: `${active * 100}% 0` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
