"use client";

/**
 * @file JoinUsTraining.tsx
 * @description Sección 3 de /join-us — «On-Demand Training».
 * - Desktop: Split Editorial Dossier (5 cols sticky + 7 cols módulos bento).
 * - Mobile (Awwwards Opción B / Hairline Accordion):
 *   · Filas minimalistas de 1px con índice de fase mono (01–05).
 *   · Apertura reactiva fluida (CSS grid 1fr/0fr) que revela el icono y la explicación sin scroll overload.
 *   · Desktop 100% intocable en `hidden lg:grid`.
 */

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ChartLineUp,
  Megaphone,
  Database,
  Compass,
  AppWindow,
  CaretDown,
  type Icon,
} from "@phosphor-icons/react";
import { RegisterCta, SectionTitle } from "./shared/parts";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

const ICONS: Icon[] = [ChartLineUp, Megaphone, Database, Compass, AppWindow];

const TOPIC_SUBTITLES: Record<string, string[]> = {
  es: [
    "Técnicas de prospección comercial, argumentarios y cierre de pólizas de alto impacto.",
    "Estrategias de atracción digital, campañas a tu medida y captación constante de prospectos.",
    "Dominio operativo de GO AMS, automatización de pipelines y gestión centralizada de clientes.",
    "Planificación táctica, escalamiento de tu cartera de asegurados y visión a largo plazo.",
    "Cotizadores multicarrier, portales de autoservicio y operación de la suite Eppigo™.",
  ],
  en: [
    "High-impact prospecting techniques, sales pitches, and policy closing strategies.",
    "Digital acquisition strategies, tailored campaigns, and consistent client generation.",
    "Full operational mastery of GO AMS, automated pipelines, and centralized client management.",
    "Tactical planning, scaling your book of business, and long-term agency vision.",
    "Multicarrier quoting platforms, self-service portals, and the Eppigo™ digital suite.",
  ],
};

export default function JoinUsTraining() {
  const t = useTranslations("joinUs.training");
  const locale = useLocale();
  const topics = t.raw("topics") as string[];
  const subtitles = TOPIC_SUBTITLES[locale] ?? TOPIC_SUBTITLES.es;

  // Estado para el acordeón móvil (el primer tema abierto por defecto)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section data-act="training" className="relative w-full py-section-sm lg:py-section-lg border-t border-[var(--color-border-Strokes-default)]">
      {/* ── DESKTOP & TABLET: SPLIT EDITORIAL DOSSIER (5 COLS + 7 COLS) ── */}
      <div className={`hidden lg:grid ${WRAP} grid-cols-12 gap-static-2xl items-start`}>
        {/* Columna Izquierda (5 cols, sticky): Encabezado + Copy + CTA */}
        <div className="col-span-5 flex flex-col gap-static-xl sticky top-[calc(var(--space-section-xs)+var(--spacing-static-xl))]">
          <div className="flex flex-col gap-static-md">
            <SectionTitle eyebrow={t("eyebrow")} title={t("title")} />
            <p className="jb-rise text-body-lg lg:text-body-xl text-[var(--color-text-secondary)] max-w-md">
              {t("body")}
            </p>
          </div>

          <RegisterCta label={t("cta")} className="jb-rise" />
        </div>

        {/* Columna Derecha (7 cols): 5 Módulos Horizontales Editoriales */}
        <div className="col-span-7 flex flex-col gap-3">
          {topics.map((topic, i) => {
            const IconComp = ICONS[i];
            return (
              <article
                key={topic}
                className="jb-rise group relative rounded-xl border border-[var(--color-border-Strokes-default)] bg-transparent p-static-xl flex items-start gap-static-lg transition-all duration-300 hover:border-[var(--color-brand-blue)]/50"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 mt-0.5">
                  <IconComp size={24} weight="regular" />
                </div>
                <div className="flex flex-col gap-static-xs">
                  <h3 className="text-h2 font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] transition-colors duration-300">
                    {topic}
                  </h3>
                  <p className="text-body-md text-[var(--color-text-secondary)] max-w-md leading-relaxed">
                    {subtitles[i]}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── MÓVIL (4 COLUMNAS): ACORDEÓN MINIMALISTA HAIRLINE (Opción B) ── */}
      <div className={`lg:hidden ${WRAP} flex flex-col gap-static-lg`}>
        {/* Encabezado Mobile */}
        <div className="flex flex-col gap-static-xs">
          <SectionTitle eyebrow={t("eyebrow")} title={t("title")} />
          <p className="jb-rise text-body-sm text-[var(--color-text-secondary)] leading-relaxed pt-static-xs">
            {t("body")}
          </p>
        </div>

        {/* Acordeón Hairline */}
        <div className="flex flex-col border-y border-[var(--color-border-Strokes-default)]">
          {topics.map((topic, i) => {
            const IconComp = ICONS[i];
            const isOpen = openIndex === i;
            const indexStr = String(i + 1).padStart(2, "0");

            return (
              <div
                key={topic}
                className="border-b border-[var(--color-border-Strokes-default)] last:border-b-0"
              >
                {/* Botón de la fila (Header táctil compacto) */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-static-lg flex items-center justify-between text-left gap-static-md transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-static-md min-w-0">
                    <span
                      className={`font-mono text-meta font-semibold transition-colors duration-200 shrink-0 ${
                        isOpen
                          ? "text-[var(--color-brand-blue)]"
                          : "text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {indexStr}
                    </span>
                    <h3
                      className={`text-h3 font-medium transition-colors duration-200 truncate ${
                        isOpen
                          ? "text-[var(--color-brand-blue)]"
                          : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {topic}
                    </h3>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 border-[var(--color-brand-blue)]/30 text-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5"
                        : "border-[var(--color-border-Strokes-default)] text-[var(--color-text-secondary)]"
                    }`}
                    aria-hidden="true"
                  >
                    <CaretDown size={14} weight="bold" />
                  </span>
                </button>

                {/* Contenido desplegable con transición suave de CSS grid */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out overflow-hidden ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-static-lg"
                      : "grid-rows-[0fr] opacity-0 pb-0"
                  }`}
                >
                  <div className="overflow-hidden flex items-start gap-static-md pl-static-xl">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp size={20} weight="regular" />
                    </div>
                    <p className="text-body-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {subtitles[i]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA centrado de tamaño normal */}
        <div className="pt-static-sm flex justify-center">
          <RegisterCta label={t("cta")} />
        </div>
      </div>
    </section>
  );
}
