"use client";

import { asset } from "@/lib/asset";

export interface DownlineStep {
  title: string;
  desc: string;
  image: string;
  alt: string;
}

/** Aire del zigzag: el gutter de móvil (no hay utilidad `pl/pr-gutter-*`, solo `px-`). */
const ZIG_PAD = "pl-[var(--space-gutter-sm)]";
const ZAG_PAD = "pr-[var(--space-gutter-sm)]";
/**
 * Los .webp traen las esquinas redondeadas y transparentes horneadas (~20px en el original): escalada
 * dentro de un marco que recorta, esas esquinas quedan fuera y el lado a sangre llega recto al borde.
 * 1.05 = lo justo para el lado corto (alto) de la imagen.
 */
const CROP_BAKED_CORNERS = "scale-[1.05]";
/** Borde y esquinas casi cuadradas solo en el lado con aire (el otro va a sangre). */
const ZIG = "border-l rounded-l-md";
const ZAG = "border-r rounded-r-md";

/**
 * @description Móvil (<md) de "Agency Downline": el mismo tratamiento que "El trabajo detrás de una
 * venta" de GO CRM (`go-crm/work-behind/StepsStacked`). Scroll normal, un paso debajo de otro: título,
 * pantallazo en zigzag (aire de gutter en un lado y a sangre por el otro, alternando: sangra por el lado
 * desde el que entra) y, debajo, el subtítulo sangrado a las columnas 2-4
 * de una retícula de 4. El gutter lateral va solo en el texto. Entradas one-shot en `DownlineSection`
 * (clases `.dl-step`, `.dl-step-title`, `.dl-step-shot`, `.dl-step-desc`).
 */
export default function DownlineStacked({ steps }: { steps: DownlineStep[] }) {
  return (
    <div className="md:hidden flex flex-col gap-static-2xl pt-static-lg">
      {steps.map((step, i) => (
        <article key={step.title} className="dl-step flex flex-col gap-static-lg">
          <h3 className="px-gutter-sm text-display-sm text-[var(--color-text-primary)]">
            <span className="block overflow-hidden pb-1">
              <span className="dl-step-title block">{step.title}</span>
            </span>
          </h3>

          {/* Zigzag: pares con aire a la izquierda (sangran a la derecha), impares al revés */}
          <div className={i % 2 === 0 ? ZIG_PAD : ZAG_PAD}>
            <div className={`dl-step-shot overflow-hidden border-y border-[var(--color-border-Strokes-default)] ${i % 2 === 0 ? ZIG : ZAG}`}>
              <img src={asset(step.image)} alt={step.alt} loading="lazy" decoding="async" className={`w-full h-auto block ${CROP_BAKED_CORNERS}`} />
            </div>
          </div>

          {/* Subtítulo debajo del pantallazo, sangrado a las columnas 2-4 de una retícula de 4 */}
          <div className="grid grid-cols-4 gap-x-static-md px-gutter-sm">
            <p className="dl-step-desc col-start-2 col-span-3 text-body-lg text-[var(--color-text-secondary)]">{step.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
