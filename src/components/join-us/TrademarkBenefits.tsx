"use client";

/**
 * @file TrademarkBenefits.tsx
 * @description Sección 2 de /join-us?role=agency-trademark — «Key Benefits of Creating Your Own Epicare Insurance Agency».
 * Arquitectura Bento asimétrica de 7 ventajas estratégicas del modelo licenciatario:
 * 1. National Co-Branding, Zero Fees (Tarjeta Insignia / Col-span-2)
 * 2. Immediate Go-to-Market in All 50 States
 * 3. Operational Stack Included
 * 4. Epicare Hierarchy & Carrier Support
 * 5. Licensee-Friendly Economics
 * 6. Benefit Parity
 * 7. Community & Growth Programs
 *
 * - Desktop: Retícula 12 cols (4 columnas lógicas): Tarjeta 1 ocupa 2 cols en fila 1; tarjetas 2-7 completan la cuadrícula 4x2 simétrica.
 * - Móvil (4 cols / Zero-Friction):
 *   · Slider nativo horizontal con scroll-snap.
 *   · 100% opacidad en todas las tarjetas (sin desvanecimientos).
 *   · SlideIndicator con contador numérico y CTA ergonómico centrado.
 */

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  GlobeHemisphereWest,
  Scales,
  ShieldCheck,
  SquaresFour,
  Trademark,
  TrendUp,
  Trophy,
  type Icon,
} from "@phosphor-icons/react";
import SlideIndicator from "@/components/team/SlideIndicator";
import { RegisterCta, SectionTitle } from "./shared/parts";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

interface BenefitItem {
  key: string;
  title: string;
  body: string;
}

const ICONS: Record<string, Icon> = {
  "co-branding": Trademark,
  "go-to-market": GlobeHemisphereWest,
  "operational-stack": SquaresFour,
  "hierarchy-support": ShieldCheck,
  economics: TrendUp,
  "benefit-parity": Scales,
  "community-growth": Trophy,
};

export default function TrademarkBenefits() {
  const t = useTranslations("joinUs.roles.agency-trademark.benefits");
  const items = t.raw("items") as BenefitItem[];

  const trackRef = useRef<HTMLUListElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const step = first.offsetWidth + 12; // gap-static-md
    const index = Math.round(el.scrollLeft / step);
    setActiveSlide(Math.min(items.length - 1, Math.max(0, index)));
  };

  return (
    <section data-act="benefits" className="relative w-full py-section-sm lg:py-section-md">
      {/* ── ENCABEZADO: ALINEADO LEFT EN MOBILE, CENTRADO EN DESKTOP ── */}
      <div className={`${WRAP} flex flex-col items-start md:items-center text-left md:text-center pb-static-lg md:pb-static-2xl lg:pb-section-xs`}>
        <SectionTitle
          eyebrow={t("eyebrow")}
          title={t("title")}
          className="items-start md:items-center text-left md:text-center max-w-3xl md:mx-auto"
        />
        <div className="flex justify-start md:justify-center pt-static-md md:pt-static-lg">
          <RegisterCta label={t("cta")} className="jb-rise" />
        </div>
      </div>

      {/* ── DESKTOP & TABLET: 7 TARJETAS BENTO (FLAGSHIP COL-SPAN-2 + 6 CARDS) ── */}
      <div className={`hidden md:block ${WRAP}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-static-md items-stretch">
          {items.map((it, i) => {
            const IconCmp = ICONS[it.key] ?? Trademark;
            const isFlagship = i === 0;

            return (
              <article
                key={it.key}
                tabIndex={0}
                className={`jb-rise rounded-xl border border-[var(--color-border-Strokes-default)] p-static-lg lg:p-static-xl bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] flex flex-col justify-between gap-static-lg group transition-all duration-300 hover:border-[var(--color-brand-blue)]/60 hover:shadow-elevation-1 focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)] ${
                  isFlagship ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="flex flex-col gap-static-md">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="w-12 h-12 rounded-lg bg-[var(--color-brand-blue)]/8 dark:bg-[var(--color-brand-blue)]/15 flex items-center justify-center text-[var(--color-brand-blue)] group-hover:scale-105 transition-transform duration-300"
                    >
                      <IconCmp weight="duotone" className="w-6 h-6" />
                    </span>
                    {isFlagship && (
                      <span className="font-mono text-meta uppercase tracking-wider text-[var(--color-brand-blue)] px-2.5 py-1 rounded-full bg-[var(--color-brand-blue)]/10 border border-[var(--color-brand-blue)]/20 font-medium">
                        Zero Royalties
                      </span>
                    )}
                  </div>
                  <h3 className={`font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] transition-colors leading-snug ${isFlagship ? "text-h3" : "text-h4"}`}>
                    {it.title}
                  </h3>
                </div>
                <p className="text-body-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {it.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── MÓVIL (4 COLS): SLIDER NATIVO CON 100% OPACIDAD + INDICADOR ── */}
      <div className="md:hidden flex flex-col gap-static-md px-gutter-sm">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className="-mx-gutter-sm px-gutter-sm flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-static-xs list-none m-0"
        >
          {items.map((it, i) => {
            const IconCmp = ICONS[it.key] ?? Trademark;
            const isFlagship = i === 0;

            return (
              <li
                key={it.key}
                className="w-[82vw] max-w-[320px] shrink-0 snap-start rounded-xl border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] p-static-lg flex flex-col justify-between gap-static-lg shadow-elevation-1 opacity-100"
              >
                <div className="flex flex-col gap-static-md">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="w-10 h-10 rounded-lg bg-[var(--color-brand-blue)]/8 dark:bg-[var(--color-brand-blue)]/15 flex items-center justify-center text-[var(--color-brand-blue)]"
                    >
                      <IconCmp weight="duotone" className="w-5 h-5" />
                    </span>
                    {isFlagship && (
                      <span className="font-mono text-caption uppercase tracking-wider text-[var(--color-brand-blue)] px-2 py-0.5 rounded-full bg-[var(--color-brand-blue)]/10 border border-[var(--color-brand-blue)]/20">
                        0% Fees
                      </span>
                    )}
                  </div>
                  <h3 className="text-h4 font-medium text-[var(--color-text-primary)] leading-snug">
                    {it.title}
                  </h3>
                </div>
                <p className="text-body-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {it.body}
                </p>
              </li>
            );
          })}
        </ul>

        <SlideIndicator n={items.length} active={activeSlide} counter />

        <div className="pt-static-sm flex justify-center">
          <RegisterCta label={t("cta")} />
        </div>
      </div>
    </section>
  );
}
