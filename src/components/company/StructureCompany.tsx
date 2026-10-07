"use client";

/**
 * @file StructureCompany.tsx
 * @description La estructura de Epicare en /company: etiqueta + titular largo sobre el marfil; al
 * hacer scroll una máscara con la imagen de arquitectura se abre de arriba abajo y el texto pasa a
 * blanco a su paso (dos capas idénticas: tinta abajo, blanco dentro de la máscara).
 * - Desktop (≥lg): texto en las columnas 4-9 de la retícula.
 * - Móvil / tablet: texto a todo el ancho con el margen de 14px.
 * Motion en `structure/useStructureMotion.ts`. Colores: tokens `--color-hero-*` (bimodales); el texto
 * sobre la imagen va en blanco fijo.
 */

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import { useStructureMotion } from "./structure/useStructureMotion";

// ── ESCENA (margen creativo declarado: alto y arranque del texto de la versión original) ──
const SECTION = "relative w-full h-[120svh] bg-[var(--color-hero-ivory)] overflow-hidden z-20";
const LAYER = "absolute inset-0 flex flex-col pt-[40svh] pb-section-xs";
const ROW = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md grid-layout";

/** Etiqueta + titular. Se pinta dos veces (tinta / blanco); la copia de la máscara va oculta a lectores. */
function StructureText({ ns, decorative = false }: { ns: string; decorative?: boolean }) {
  const t = useTranslations(ns);
  const Title = decorative ? "p" : "h2";
  return (
    <div className={ROW} aria-hidden={decorative || undefined}>
      <div className="col-span-full lg:col-start-4 lg:col-span-6 flex flex-col">
        <div className="st-reveal flex items-center gap-static-md mb-static-lg">
          <span className="w-static-sm h-static-sm rounded-full bg-current" aria-hidden="true" />
          <span className="text-overline">{t("overline")}</span>
        </div>
        <Title className="st-reveal text-display">{t("title")}</Title>
      </div>
    </div>
  );
}

/** `ns`: namespace de los textos (overline + title). La landing la reutiliza con su propio mensaje. */
export default function StructureCompany({ ns = "company.structure", id }: { ns?: string; id?: string }) {
  const containerRef = useRef<HTMLElement>(null);

  useStructureMotion(containerRef);

  return (
    <section ref={containerRef} id={id} className={SECTION}>
      {/* ── 1 · CAPA BASE: tinta sobre marfil ── */}
      <div className={`${LAYER} text-[var(--color-hero-ink)]`}>
        <StructureText ns={ns} />
      </div>

      {/* ── 2 · MÁSCARA: imagen + el mismo texto en blanco ── */}
      <div className="st-mask absolute inset-0 z-10 pointer-events-none">
        <img
          src={asset("/Files/company_structure_arch.jpg")}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="st-image absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125"
        />
        <div className={`${LAYER} z-20 text-[var(--color-text-White-100)]`}>
          <StructureText ns={ns} decorative />
        </div>
      </div>
    </section>
  );
}
