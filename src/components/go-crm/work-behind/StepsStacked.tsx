"use client";

import { asset } from "@/lib/asset";
import SmartVideo from "@/components/epicare/SmartVideo";
import { STEP_VIDEOS, type StepCopy } from "./data";

/**
 * @description Móvil y tablet (<lg) de "El trabajo detrás de una venta": scroll normal, un paso
 * debajo de otro con título, subtítulo y pantallazo a su proporción natural (sin recortes), a
 * ancho completo: el gutter lateral va solo en los textos.
 * Entradas one-shot en `useWorkBehindMotion` (clases `.ws-*`).
 */
export default function StepsStacked({ steps }: { steps: StepCopy[] }) {
  return (
    <div className="lg:hidden flex flex-col gap-static-2xl pb-section-sm">
      {steps.map((step, i) => (
        <article key={step.title} className="ws-step flex flex-col gap-static-sm">
          <h3 className="px-gutter-sm text-display-sm font-bold text-[var(--color-text-primary)]">
            <span className="block overflow-hidden pb-1">
              <span className="ws-title block">{step.title}</span>
            </span>
          </h3>
          <p className="ws-desc px-gutter-sm text-body-lg text-[var(--color-text-secondary)]">{step.desc}</p>
          <SmartVideo
            src={asset(STEP_VIDEOS[i])}
            loop
            muted
            playsInline
            aria-hidden="true"
            className="ws-shot w-full h-auto block mt-static-md border-y border-[var(--color-border-Strokes-default)]"
          />
        </article>
      ))}
    </div>
  );
}
