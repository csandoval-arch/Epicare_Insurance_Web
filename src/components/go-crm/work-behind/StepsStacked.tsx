"use client";

import { asset } from "@/lib/asset";
import SmartVideo from "@/components/epicare/SmartVideo";
import { STEP_RATIOS, STEP_VIDEOS, type StepCopy } from "./data";

/**
 * @description Móvil y tablet (<lg) de "El trabajo detrás de una venta": scroll normal, un paso
 * debajo de otro: título, pantallazo a ancho completo (proporción natural) y, debajo, el
 * subtítulo sangrado a las columnas 2-4 de una retícula de 4. El gutter lateral va solo en el
 * texto. Entradas one-shot en `useWorkBehindMotion` (clases `.ws-*`).
 */
export default function StepsStacked({ steps }: { steps: StepCopy[] }) {
  return (
    <div className="lg:hidden flex flex-col gap-static-2xl pb-section-sm">
      {steps.map((step, i) => (
        <article key={step.title} className="ws-step flex flex-col gap-static-lg">
          <h3 className="px-gutter-sm text-display-sm text-[var(--color-text-primary)]">
            <span className="block overflow-hidden pb-1">
              <span className="ws-title block">{step.title}</span>
            </span>
          </h3>

          <SmartVideo
            src={asset(STEP_VIDEOS[i])}
            loop
            muted
            playsInline
            aria-hidden="true"
            className="ws-shot w-full h-auto block border-y border-[var(--color-border-Strokes-default)]"
            style={{ aspectRatio: STEP_RATIOS[i] }}
          />

          {/* Subtítulo debajo del pantallazo, sangrado a las columnas 2-4 de una retícula de 4 */}
          <div className="grid grid-cols-4 gap-x-static-md px-gutter-sm">
            <p className="ws-desc col-start-2 col-span-3 text-body-lg text-[var(--color-text-secondary)]">{step.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
