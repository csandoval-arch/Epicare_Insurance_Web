"use client";

/**
 * @file TrademarkComparison.tsx
 * @description Sección 4 de /join-us?role=agency-trademark — «Why Build an Epicare Agency vs. Starting From Zero».
 * Versión Bento con 4 tarjetas grandes, fondo blanco nítido sobre el canvas ivory de la página:
 * 1. No franchise price tag (Ahorro $25k–$50k+, cero regalías)
 * 2. Lower risk, higher speed (Lanzamiento en 4–6 semanas, menor fricción)
 * 3. Brand + Stack + Playbook (Marca nacional + Stack GO completo desde el día 1)
 * 4. Faster recruitment & better economics (Comisiones progresivas escalables)
 *
 * - Fondo de la sección unificado con el canvas general (ivory).
 * - Tarjetas altas (min-h-[400px]) con fondo blanco puro (bg-white) y aire generoso.
 * - Móvil: Slider nativo horizontal con tarjetas altas, 100% opacidad y SlideIndicator.
 */

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Buildings,
  Lightning,
  SquaresFour,
  TrendUp,
  type Icon,
} from "@phosphor-icons/react";
import SlideIndicator from "@/components/team/SlideIndicator";
import { keyed } from "@/components/team/case/keyed";
import { RegisterCta } from "./shared/parts";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

interface ComparisonItem {
  key: string;
  n: string;
  badge: string;
  title: string;
  body: string;
}

const ICONS: Record<string, Icon> = {
  "no-franchise-fee": Buildings,
  "lower-risk-speed": Lightning,
  "brand-stack-playbook": SquaresFour,
  "faster-recruitment": TrendUp,
};

const DEFAULT_TITLES: Record<string, string[]> = {
  en: ["Why Build an Epicare Agency", "vs. <k>Starting From Zero</k>"],
  es: ["¿Por qué crear una Agencia Epicare", "vs. <k>empezar desde cero?</k>"],
};

const DEFAULT_SUBTITLES: Record<string, string> = {
  en: "Skip the upfront franchise capital, operational lag, and royalty penalties while launching with a proven national brand and full tech infrastructure.",
  es: "Evita el desembolso inicial de franquicia, los retrasos operativos y las ataduras de regalías, lanzando con una marca nacional consolidada y tecnología integral.",
};

const DEFAULT_ITEMS: Record<string, ComparisonItem[]> = {
  en: [
    {
      key: "no-franchise-fee",
      n: "01",
      badge: "Saves $25k–$50k+",
      title: "No franchise price tag",
      body: "Skips the $25k–$50k+ upfront costs and multi-year royalty hooks typical of traditional franchises.",
    },
    {
      key: "lower-risk-speed",
      n: "02",
      badge: "Fast-Track Launch",
      title: "Lower risk, higher speed",
      body: "You launch quicker, with less capital and operational friction, while keeping upside for high performers.",
    },
    {
      key: "brand-stack-playbook",
      n: "03",
      badge: "Day-One Turnkey",
      title: "Brand + Stack + Playbook",
      body: "Unlike many “no-fee” programs, Epicare licenses the brand and provides the full EPICARE GO stack (CRM/AMS/AI/CALLS) plus bilingual playbooks from day one.",
    },
    {
      key: "faster-recruitment",
      n: "04",
      badge: "Performance Splits",
      title: "Faster recruitment & better economics",
      body: "Recruit using a national brand and keep more net revenue through performance-based split improvements (vs. fixed franchise models).",
    },
  ],
  es: [
    {
      key: "no-franchise-fee",
      n: "01",
      badge: "Ahorro de $25k–$50k+",
      title: "Cero costo de franquicia",
      body: "Elimina los costos iniciales de $25k–$50k+ y las ataduras de regalías plurianuales típicas de las franquicias tradicionales.",
    },
    {
      key: "lower-risk-speed",
      n: "02",
      badge: "Lanzamiento Acelerado",
      title: "Menor riesgo, mayor velocidad",
      body: "Lanzas más rápido, con menor capital y fricción operativa, manteniendo todo el potencial de ingresos para los de alto rendimiento.",
    },
    {
      key: "brand-stack-playbook",
      n: "03",
      badge: "Llave en Mano",
      title: "Marca + Stack + Manuales",
      body: "A diferencia de muchos programas 'sin costo', Epicare licencia la marca y provee el stack completo EPICARE GO (CRM/AMS/AI/CALLS) más manuales bilingües desde el primer día.",
    },
    {
      key: "faster-recruitment",
      n: "04",
      badge: "Comisiones Progresivas",
      title: "Reclutamiento ágil y mejores márgenes",
      body: "Recluta apalancándote en una marca nacional y retén más ingresos netos gracias a esquemas de comisiones progresivas basadas en resultados (vs. modelos rígidos de franquicia).",
    },
  ],
};

export default function TrademarkComparison() {
  const t = useTranslations("joinUs.roles.agency-trademark.comparison");
  const locale = useLocale();

  let title = DEFAULT_TITLES[locale] ?? DEFAULT_TITLES.en;
  try {
    const rawTitle = t.raw("title") as string[];
    if (Array.isArray(rawTitle) && rawTitle.length > 0 && typeof rawTitle[0] === "string" && !rawTitle[0].startsWith("joinUs.")) {
      title = rawTitle;
    }
  } catch {}

  let items = DEFAULT_ITEMS[locale] ?? DEFAULT_ITEMS.en;
  try {
    const rawItems = t.raw("items") as ComparisonItem[];
    if (Array.isArray(rawItems) && rawItems.length > 0 && rawItems[0]?.title && !rawItems[0].title.startsWith("joinUs.")) {
      items = rawItems;
    }
  } catch {}

  let subtitleText = DEFAULT_SUBTITLES[locale] ?? DEFAULT_SUBTITLES.en;
  try {
    const rawSub = t("subtitle");
    if (rawSub && !rawSub.startsWith("joinUs.")) {
      subtitleText = rawSub;
    }
  } catch {}

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
    <section
      data-act="comparison"
      className="relative w-full py-section-sm lg:py-section-lg border-t border-[var(--color-border-Strokes-default)]"
    >
      {/* ── ENCABEZADO EDITORIAL CON CTA A LA DERECHA EN DESKTOP ── */}
      <div className={`${WRAP} flex flex-col lg:flex-row lg:items-end justify-between gap-static-lg lg:gap-static-2xl pb-static-lg md:pb-static-2xl lg:pb-section-xs`}>
        <div className="flex flex-col gap-static-md max-w-4xl lg:max-w-5xl">
          <span className="block overflow-hidden">
            <span className="jb-birth block text-overline text-[var(--color-text-accent-blue)]">
              {t("eyebrow")}
            </span>
          </span>

          <h2 className="text-display lg:text-display-lg text-[var(--color-hero-ink)] [text-wrap:balance]">
            {title.map((line) => (
              <span key={line} className="block overflow-hidden pb-static-xs">
                <span className="jb-birth block font-light">{keyed(line)}</span>
              </span>
            ))}
          </h2>

          <p className="jb-rise text-body-md lg:text-body-lg text-[var(--color-hero-ink)]/75 leading-relaxed max-w-2xl font-normal">
            {subtitleText}
          </p>
        </div>

        <div className="shrink-0 flex items-center pt-static-xs lg:pt-0">
          <RegisterCta label={t("cta")} className="jb-rise" />
        </div>
      </div>

      {/* ── DESKTOP & TABLET: 4 TARJETAS CON PADDING AJUSTADO Y FONDO BLANCO PURO ── */}
      <div className={`hidden md:block ${WRAP}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-static-md items-stretch">
          {items.map((it) => {
            const IconCmp = ICONS[it.key] ?? Buildings;

            return (
              <article
                key={it.key}
                tabIndex={0}
                className="jb-rise min-h-[350px] lg:min-h-[370px] rounded-xl border border-[var(--color-border-Strokes-default)] p-static-md lg:p-static-lg bg-white dark:bg-[var(--color-surface-BG-1)] flex flex-col justify-between gap-static-md group transition-all duration-300 hover:border-[var(--color-brand-blue)]/60 hover:shadow-elevation-2 focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
              >
                {/* Bloque Superior: Icono + Número + Badge + Título */}
                <div className="flex flex-col gap-static-sm">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-lg bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-brand-blue)] group-hover:text-white transition-all duration-300">
                      <IconCmp size={20} weight="duotone" />
                    </span>
                    <span className="font-mono text-caption text-[var(--color-hero-ink)]/60 font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-BG-2)] border border-[var(--color-border-Strokes-default)]">
                      {it.n}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-caption font-mono uppercase tracking-wider bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] font-semibold w-fit">
                    {it.badge}
                  </span>

                  <h3 className="text-h3 lg:text-h2 text-[var(--color-hero-ink)] group-hover:text-[var(--color-brand-blue)] transition-colors duration-200 leading-snug">
                    {it.title}
                  </h3>
                </div>

                {/* Bloque Inferior: Explicación Editorial */}
                <p className="text-body-sm text-[var(--color-hero-ink)]/75 leading-relaxed font-normal">
                  {it.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── MÓVIL: SLIDER HORIZONTAL NATIVO CON PADDING AJUSTADO Y TARJETAS BLANCAS ── */}
      <div className="md:hidden">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-static-md overflow-x-auto snap-x snap-mandatory px-gutter-sm scrollbar-none pb-static-sm"
        >
          {items.map((it) => {
            const IconCmp = ICONS[it.key] ?? Buildings;

            return (
              <li
                key={it.key}
                className="w-[84vw] max-w-[22rem] shrink-0 snap-center opacity-100 flex flex-col"
              >
                <article className="h-full min-h-[320px] rounded-xl border border-[var(--color-border-Strokes-default)] p-static-md lg:p-static-lg bg-white dark:bg-[var(--color-surface-BG-1)] flex flex-col justify-between gap-static-md shadow-elevation-1">
                  <div className="flex flex-col gap-static-sm">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-lg bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
                        <IconCmp size={20} weight="duotone" />
                      </span>
                      <span className="font-mono text-caption text-[var(--color-hero-ink)]/60 font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-BG-2)] border border-[var(--color-border-Strokes-default)]">
                        {it.n}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-caption font-mono uppercase tracking-wider bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] font-semibold w-fit">
                      {it.badge}
                    </span>

                    <h3 className="text-h3 text-[var(--color-hero-ink)] leading-snug">
                      {it.title}
                    </h3>
                  </div>

                  <p className="text-body-sm text-[var(--color-hero-ink)]/75 leading-relaxed font-normal">
                    {it.body}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Indicador de diapositiva y contador de progreso */}
        <div className="pt-static-md flex flex-col items-center gap-static-md">
          <SlideIndicator n={items.length} active={activeSlide} counter />
          <div className="pt-static-xs">
            <RegisterCta label={t("cta")} />
          </div>
        </div>
      </div>
    </section>
  );
}
