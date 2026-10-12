"use client";

/**
 * @file JoinUsBenefits.tsx
 * @description Sección 2 de /join-us — «Why join Epicare Insurance?».
 * Rediseño Awwwards Bento con fotografía editorial e iconografía holográfica diegética (2026-10-11).
 * - Fila Superior: Fotografía panorámica (7 cols) + Tarjeta Hero Azul 132+ (5 cols).
 * - Fila Inferior: 3 tarjetas Bento (3 cols) con Holographic Tech Visuals e hitos a 2 líneas.
 * - Móvil (4 cols / Zero-Friction):
 *   · Fotografía 16:9 con borde limpio.
 *   · Monolito 132+ azul de marca con tipografía display.
 *   · Slider nativo de 3 beneficios sin opacidades reducidas (100% legibilidad inmediata).
 *   · Scroll-snap sin bloqueo JS con SlideIndicator.
 */

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import SlideIndicator from "@/components/team/SlideIndicator";
import type { JoinPathKey } from "@/components/join/joinData";
import { DEFAULT_ROLE, PHOTOS } from "./joinUsData";
import { RegisterCta, SectionTitle } from "./shared/parts";
import HolographicIcon from "./shared/HolographicIcons";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

interface Item {
  key: "marketing" | "contracting" | "commissions";
  title: string;
  body: string;
}

interface Carriers {
  value: number;
  suffix: string;
  title: string;
  subtitle: string;
  body: string;
}

export default function JoinUsBenefits({ role = DEFAULT_ROLE }: { role?: JoinPathKey }) {
  const t = useTranslations("joinUs.benefits");
  const items = t.raw("items") as Item[];
  const carriers = t.raw("carriers") as Carriers;
  const imageSrc = PHOTOS[role] ?? "/Files/for-who/agent-hero.jpeg";

  // Slider nativo de móvil (sin duplicación de DOM, sin saltos de scroll y con opacidad 100% fija)
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
      {/* ── ENCABEZADO ── */}
      <div className={`${WRAP} grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-[var(--space-fluid-xs)] gap-y-static-lg items-end pb-static-lg md:pb-static-2xl lg:pb-section-xs`}>
        <SectionTitle
          eyebrow={t("eyebrow")}
          title={t("title")}
          className="col-span-full lg:col-span-8"
        />
        <RegisterCta
          label={t("cta")}
          className="jb-rise hidden lg:flex lg:col-start-11 lg:col-span-2 lg:justify-self-end lg:mb-static-sm"
        />
      </div>

      {/* ── DESKTOP: BENTO ARQUITECTÓNICO (GAPS 12PX) ── */}
      <div className={`hidden md:block ${WRAP}`}>
        <div className="flex flex-col gap-3">
          {/* Fila Superior: Foto panorámica (7 cols) + Tarjeta Hero Azul 132+ (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            <div className="lg:col-span-7 relative w-full aspect-[16/9] overflow-hidden rounded-xl border border-[var(--color-border-Strokes-default)]">
              <img
                src={asset(imageSrc)}
                alt="Epicare Agent Workspace"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>

            <article className="lg:col-span-5 rounded-xl bg-[var(--color-brand-blue)] text-white p-static-xl lg:p-static-2xl flex flex-col justify-between shadow-elevation-2">
              <div className="flex flex-col gap-static-sm">
                <span className="text-display-xl lg:text-display-2xl font-light text-white">
                  <span className="jb-count" data-value={carriers.value}>
                    {carriers.value}
                  </span>
                  {carriers.suffix}
                </span>
                <div className="flex flex-col">
                  <span className="text-h1 font-medium text-white">{carriers.title}</span>
                  <span className="text-h1 text-white/80">{carriers.subtitle}</span>
                </div>
              </div>
              <p className="mt-static-md text-body-md text-white/90 max-w-md">{carriers.body}</p>
            </article>
          </div>

          {/* Fila Inferior: 3 Columnas iguales Bento con iconos holográficos y títulos a 2 líneas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {items.map((it) => (
              <article
                key={it.key}
                tabIndex={0}
                className="jb-rise rounded-xl border border-[var(--color-border-Strokes-default)] p-static-lg lg:p-static-xl bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] flex flex-col justify-between gap-static-lg group transition-all duration-300 hover:border-[var(--color-brand-blue)]/60 hover:shadow-elevation-1 focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
              >
                <div className="flex flex-col gap-static-md">
                  <HolographicIcon type={it.key} />
                  <h3 className="text-h2 whitespace-pre-line group-hover:text-[var(--color-brand-blue)] transition-colors">
                    {it.title}
                  </h3>
                </div>
                <p className="text-body-sm text-[var(--color-text-secondary)]">{it.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ── MÓVIL (4 COLUMNAS): MONOLITO AZUL 132+ + SLIDER NATIVO (Foto oculta en mobile) ── */}
      <div className="md:hidden flex flex-col gap-static-lg px-gutter-sm">
        {/* Monolito 132+ en azul de marca */}
        <article className="rounded-xl bg-[var(--color-brand-blue)] text-white p-static-lg flex flex-col gap-static-sm shadow-elevation-2">
          <span className="text-display-xl font-light text-white">
            <span className="jb-count" data-value={carriers.value}>
              {carriers.value}
            </span>
            {carriers.suffix}
          </span>
          <div className="flex flex-col">
            <span className="text-h2 font-medium text-white">{carriers.title}</span>
            <span className="text-h3 text-white/85">{carriers.subtitle}</span>
          </div>
          <p className="text-body-sm text-white/90 pt-static-xs leading-relaxed">{carriers.body}</p>
        </article>

        {/* Slider nativo horizontal (100% opaco, sin desvanecimientos) */}
        <div className="flex flex-col gap-static-md pt-static-xs">
          <ul
            ref={trackRef}
            onScroll={onScroll}
            className="-mx-gutter-sm px-gutter-sm flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-static-xs list-none m-0"
          >
            {items.map((it) => (
              <li
                key={it.key}
                className="w-[82vw] max-w-[320px] shrink-0 snap-start rounded-xl border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] p-static-lg flex flex-col justify-between gap-static-lg shadow-elevation-1 opacity-100"
              >
                <div className="flex flex-col gap-static-md">
                  <HolographicIcon type={it.key} />
                  <span className="text-h3 font-medium text-[var(--color-text-primary)] whitespace-pre-line leading-snug">
                    {it.title}
                  </span>
                </div>
                <p className="text-body-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {it.body}
                </p>
              </li>
            ))}
          </ul>

          <SlideIndicator n={items.length} active={activeSlide} counter />

          <div className="pt-static-sm">
            <RegisterCta label={t("cta")} />
          </div>
        </div>
      </div>
    </section>
  );
}
