"use client";

/**
 * @file HeroCompany.tsx
 * @description Hero de /company. Dos capas idénticas de titular + copy: la base en tinta sobre
 * marfil y, encima, una máscara con la imagen de arquitectura y el mismo texto en blanco. Al hacer
 * scroll la máscara sube y el texto "cambia" de color a su paso.
 * - Desktop (≥lg): retícula de 12 columnas, titular en col 2-11, copy + CTA en col 8-11, con pin;
 *   firma (logotipo completo en blanco) en col 2-4 sobre la imagen.
 * - Móvil / tablet: una columna (copy a todo el ancho); entrada de carga (GSAP) + cortina con CSS
 *   scroll-driven (`.hc-stage` en globals.css): sin JS por frame, sin pin.
 * Motion en `hero/useHeroCompanyMotion.ts`. Colores: tokens `--color-hero-*` (bimodales); el texto
 * sobre la imagen va en blanco fijo.
 */

import { useRef } from "react";
import { useTranslations } from "next-intl";
import type Lenis from "lenis";
import { asset } from "@/lib/asset";
import SecondaryCta from "@/components/go-crm/cta/SecondaryCta";
import { MASK_OFFSET, useHeroCompanyMotion } from "./hero/useHeroCompanyMotion";

/** Sección a la que lleva el CTA ("Nuestra historia"). */
export const COMPANY_STORY_ID = "company-story";

// ── RETÍCULA COMPARTIDA POR LAS DOS CAPAS ──
const LAYER = "absolute inset-0 flex flex-col pt-[calc(var(--space-section-md)+var(--spacing-static-lg))] lg:pt-section-md pb-section-xs";
const ROW = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md grid-layout";
const TITLE_COL = "col-span-full lg:col-start-2 lg:col-span-10";
const COPY_COL = "col-span-full md:col-start-3 md:col-span-6 lg:col-start-8 lg:col-span-4 flex flex-col items-start gap-static-lg";
const SUBHEAD = "text-body-xl border-l border-current pl-static-lg";

/** Siempre por Lenis: `window.scrollTo` smooth pelea con él. */
function scrollToStory() {
  const target = document.getElementById(COMPANY_STORY_ID);
  if (!target) return;
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  if (lenis) lenis.scrollTo(target);
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
}

/** Titular línea a línea, cada línea en su máscara (text-birth). */
function Headline({ lines, as: Tag }: { lines: string[]; as: "h1" | "p" }) {
  return (
    <Tag className="text-display-lg md:text-display-xl">
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-static-xs">
          <span className="hc-title-line block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

export default function HeroCompany() {
  const t = useTranslations("company.hero");
  const containerRef = useRef<HTMLElement>(null);
  const title = t.raw("title") as string[];

  useHeroCompanyMotion(containerRef);

  return (
    <section
      ref={containerRef}
      className="hc-stage relative w-full h-svh bg-[var(--color-hero-ivory)] overflow-hidden z-20"
    >
      {/* ── 1 · CAPA BASE: tinta sobre marfil (la que leen los lectores de pantalla) ── */}
      <div className={`${LAYER} text-[var(--color-hero-ink)]`}>
        <div className={ROW}>
          <div className={TITLE_COL}>
            <Headline lines={title} as="h1" />
          </div>
        </div>

        <div className={`${ROW} mt-auto`}>
          <div className={`hc-copy ${COPY_COL}`}>
            <p className={SUBHEAD}>{t("subhead")}</p>
            <div aria-hidden="true" inert>
              <SecondaryCta label={t("cta")} tone="light" onClick={scrollToStory} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2 · MÁSCARA (cortina con transforms): el contenedor baja MASK_OFFSET% y su contenido sube lo
          mismo, así imagen y texto quedan en su sitio y solo asoma el pie. Animarlo es compositor puro. ── */}
      <div
        className="hc-mask absolute inset-0 z-10 overflow-hidden pointer-events-none"
        style={{ transform: `translateY(${MASK_OFFSET}%)` }}
      >
        <div className="hc-mask-inner absolute inset-0" style={{ transform: `translateY(-${MASK_OFFSET}%)` }}>
          <img
            src={asset("/Files/company_hero_arch.jpg")}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="hc-image absolute inset-0 w-full h-full object-cover object-center grayscale-15 contrast-110 brightness-85"
          />
          <div className={`${LAYER} z-20 text-[var(--color-text-White-100)]`}>
            <div className={ROW} aria-hidden="true">
              <div className={TITLE_COL}>
                <Headline lines={title} as="p" />
              </div>
            </div>

            <div className={`${ROW} mt-auto`}>
              {/* Firma (desktop): logotipo completo en blanco, abajo a la izquierda de la imagen. Entra con
                  la bajada (.hc-copy) pero no sale con ella: con la cortina arriba quedan titular + firma. */}
              <div className="hc-copy hidden lg:flex lg:col-start-2 lg:col-span-3 self-end">
                <img src={asset("/epicare_logo.svg")} alt="" aria-hidden="true" decoding="async" className="h-static-2xl w-auto select-none" />
              </div>
              <div className={`hc-copy hc-copy-exit ${COPY_COL}`}>
                <p className={SUBHEAD} aria-hidden="true">{t("subhead")}</p>
                <SecondaryCta label={t("cta")} tone="dark" lite onClick={scrollToStory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
