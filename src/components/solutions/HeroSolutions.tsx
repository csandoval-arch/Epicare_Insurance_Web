"use client";

/**
 * @file HeroSolutions.tsx
 * @description Hero de /solutions — paradigma editorial (aprobado 13-10-2026, concepto C).
 * Tres franjas horizontales en vez de dos columnas:
 *   1. Titular gigante cruzando las 12 columnas.
 *   2. Banda de imagen panorámica **de borde a borde del viewport**.
 *   3. Bajada + CTA a la izquierda y los datos de contexto a la derecha.
 *
 * Por qué así: la versión anterior ponía la foto en una columna lateral y, al crecer de alto,
 * se descolgaba por debajo del texto dejando un hueco muerto de 400px a la izquierda. En franjas
 * no hay forma de que eso pase: cada bloque ocupa todo el ancho y el orden de lectura es vertical.
 *
 * La banda vive FUERA del contenedor `max-w-section-xl`, no con `w-screen`: con `100vw` el ancho
 * del scrollbar provoca scroll horizontal.
 *
 * Un único CTA ("Únete"), que abre el modal de alta: el de agendar cita espera a la integración
 * de calendario con José (acuerdo de la reunión del 13-10-2026).
 */

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import PrimaryCta from "@/components/go-crm/cta/PrimaryCta";
import { useHeroSolutionsEntrance } from "./hero/useHeroSolutionsEntrance";

/** Contenedor de las franjas de texto. La banda de imagen no lo usa: va a sangre. */
const STRIP = "mx-auto max-w-section-xl w-full px-gutter-sm md:px-gutter-md";

export default function HeroSolutions() {
  const t = useTranslations("solutionsPage.hero");
  const containerRef = useRef<HTMLElement>(null);

  useHeroSolutionsEntrance(containerRef);

  return (
    <section
      ref={containerRef}
      className="w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] relative overflow-x-clip pt-[calc(var(--space-section-md)+var(--spacing-static-lg))] lg:pt-section-md pb-section-sm lg:pb-section-md"
    >
      {/* ── FRANJA 1 · EYEBROW + TITULAR A TODO EL ANCHO ── */}
      <div className={`${STRIP} flex flex-col items-start gap-static-md`}>
        <div className="sol-hero-eyebrow">
          <span className="text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</span>
        </div>

        {/* `pb-2` en cada máscara: a este tamaño los descendientes (g, y) se comen un `pb-1`. */}
        <h1 className="text-display-xl lg:text-display-2xl text-[var(--color-text-primary)] w-full">
          <span className="block overflow-hidden pb-2">
            <span className="sol-hero-title-line block">{t("titleLine1")}</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="sol-hero-title-line block text-[var(--color-brand-blue)]">
              {t("titleLine2")}
            </span>
          </span>
        </h1>
      </div>

      {/* ── FRANJA 2 · BANDA DE IMAGEN DE BORDE A BORDE ── */}
      <div className="sol-hero-panel w-full mt-static-xl lg:mt-static-2xl overflow-hidden">
        <div className="relative w-full h-[34vh] min-h-64 lg:h-[44vh] lg:max-h-[30rem]">
          <img
            src={asset("/Files/Solutions/people-tech-convergence.jpg")}
            alt={t("imageAlt")}
            className="sol-hero-zoom w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* ── FRANJA 3 · BAJADA + CTA | CONTEXTO ── */}
      <div className={`${STRIP} mt-static-xl lg:mt-static-2xl`}>
        <div className="grid-layout gap-y-static-lg items-end">
          <div className="col-span-12 lg:col-span-7 flex flex-col items-start gap-static-lg">
            <p className="sol-hero-subhead text-body-xl text-[var(--color-text-secondary)] max-w-2xl">
              {t("subhead")}
            </p>
            <div className="sol-hero-cta">
              <PrimaryCta label={t("cta")} intent="join" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
