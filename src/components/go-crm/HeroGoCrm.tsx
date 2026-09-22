"use client";

/**
 * @file HeroGoCrm.tsx
 * @description Hero de la página de GO CRM. Grid editorial de 12 columnas: titular a la
 * izquierda (col 1-7), bajada + CTA a la derecha (col 9-12) y, debajo, el showcase de la UI
 * sangrando hasta el borde derecho del viewport.
 */

import { useRef } from "react";
import { useTranslations } from "next-intl";
import ArrowUR from "@/components/icons/ArrowUR";
import { loginModalStore } from "@/lib/loginModalStore";
import { useHeroEntrance } from "./hero/useHeroEntrance";
import HeroShowcase from "./hero/HeroShowcase";
import { HERO_WRAPPER_ID, HeroScrollButtonMobile } from "./hero/HeroScrollButtons";

export default function HeroGoCrm() {
  const t = useTranslations("goCrm.hero");
  const containerRef = useRef<HTMLDivElement>(null);

  useHeroEntrance(containerRef);

  return (
    <div
      id={HERO_WRAPPER_ID}
      ref={containerRef}
      className="w-full flex flex-col bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] relative overflow-x-clip pt-[calc(var(--space-section-md)+20px)] lg:pt-section-md pb-section-lg"
    >
      <section className="relative w-full flex-1 px-gutter-sm lg:px-gutter-md">
        <div className="mx-auto max-w-section-xl w-full grid-layout gap-y-static-md lg:gap-y-static-xl">

          {/* ── COL 1-7: EYEBROW + H1 ── */}
          <div className="col-span-12 lg:col-start-1 lg:col-span-7 flex flex-col items-start justify-start gap-static-xs lg:pr-static-md z-10">
            <div className="crm-hero-eyebrow inline-flex items-center gap-static-xs mb-static-xs">
              <span className="w-static-sm h-static-sm rounded-full bg-[var(--color-brand-blue)] animate-pulse" aria-hidden="true" />
              <span className="text-overline text-[var(--color-text-accent-blue)]">
                {t("overline")}
              </span>
            </div>

            <h1 className="text-display-xl text-[var(--color-text-primary)] w-full">
              <span className="block overflow-hidden pb-1">
                <span className="crm-hero-title-line block">
                  {t.rich("title", {
                    blue: (chunks) => <span className="text-[var(--color-brand-blue)]">{chunks}</span>,
                  })}
                </span>
              </span>
            </h1>
          </div>

          {/* ── COL 9-12: BAJADA + CTA ── */}
          <div className="col-span-12 lg:col-start-9 lg:col-span-4 flex flex-col items-start justify-end gap-static-md z-10">
            <p className="crm-hero-subtitle text-body-lg text-[var(--color-text-secondary)] max-w-[400px] leading-relaxed">
              {t.rich("subhead", {
                bold: (chunks) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>,
              })}
            </p>

            <div className="crm-hero-cta flex flex-row items-center gap-3 w-full lg:w-auto mt-static-sm lg:mt-0">
              <button
                type="button"
                onClick={() => loginModalStore.open()}
                className="group w-fit min-w-[220px] md:min-w-0 h-static-2xl pl-static-lg pr-static-sm rounded-full flex justify-between md:justify-start items-center gap-3 bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150 cursor-pointer"
              >
                <span className="text-body-sm font-medium">
                  {t("cta")}
                </span>
                <span className="relative w-static-xl h-static-xl rounded-full bg-[var(--color-surface-BG-white)] text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
                  <ArrowUR className="absolute w-static-md h-static-md transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                  <ArrowUR className="absolute w-static-md h-static-md -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </button>

              <HeroScrollButtonMobile label={t("scrollDown")} />
            </div>
          </div>

          {/* ── SHOWCASE DE LA UI (SANGRA A LA DERECHA) ── */}
          <HeroShowcase scrollLabel={t("scrollDown")} />
        </div>
      </section>
    </div>
  );
}
