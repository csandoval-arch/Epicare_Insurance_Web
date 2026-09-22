"use client";

import { asset } from "@/lib/asset";
import SmartVideo from "@/components/epicare/SmartVideo";
import { STEP_VIDEOS, stepNumber, type StepCopy } from "./data";

/**
 * @description Desktop (≥lg) de "El trabajo detrás de una venta": split pineado. A la izquierda
 * los títulos de cada paso hacen crossfade; a la derecha una tira de 3 pantallazos sube con el
 * scroll. Coreografía en `useWorkBehindMotion` (clases `.v4-*`). En móvil: `StepsStacked`.
 */
export default function StepsPinned({ steps, stepLabel }: { steps: StepCopy[]; stepLabel: string }) {
  return (
    <section className="v4-pinned relative w-full h-screen overflow-hidden border-y border-[var(--color-border-Strokes-default)]">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
        {/* ── IZQUIERDA: TÍTULOS DE CADA PASO ── */}
        <div className="h-full flex flex-col justify-center relative border-r border-[var(--color-border-Strokes-default)] z-20 bg-[var(--color-surface-BG-base)]">
          <div className="w-full max-w-2xl ml-auto relative h-[400px] flex flex-col justify-center">
            <div className="relative w-full h-[250px]">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`v4-title-block-${i} absolute top-0 left-0 w-full px-gutter-md md:pl-gutter-lg md:pr-16 flex flex-col justify-center h-full`}
                  style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}
                >
                  <p className="text-overline text-[var(--color-text-muted)] font-mono tracking-widest mb-4">
                    {stepLabel} {stepNumber(i)}
                  </p>
                  <h2 className="text-display lg:text-display-lg font-bold tracking-tighter leading-[0.9] text-[var(--color-text-primary)] mb-6 max-w-md">
                    {step.title}
                  </h2>
                  <p className="text-body-lg text-[var(--color-text-secondary)] mb-8 max-w-md">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Barra de progreso (se llena con scaleX, no con width) */}
            <div className="w-full px-gutter-md md:pl-gutter-lg md:pr-16 absolute bottom-10 left-0" aria-hidden="true">
              <div className="w-full max-w-md h-1 bg-[var(--color-border-Strokes-default)] rounded-full relative overflow-hidden">
                <div className="v4-stepper-progress absolute inset-0 bg-[var(--color-text-primary)] rounded-full origin-left scale-x-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DERECHA: TIRA DE PANTALLAZOS ── */}
        <div className="h-full relative overflow-hidden bg-[var(--color-surface-BG-1)] border-l border-[var(--color-border-Strokes-default)] flex flex-col justify-center">
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-brand-blue)]/5 blur-[100px] rounded-full pointer-events-none z-0"
          ></div>

          <div className="v4-right-strip absolute top-0 w-full h-[300vh] flex flex-col z-10">
            {STEP_VIDEOS.map((src) => (
              <div key={src} className="h-[100vh] w-full flex items-center justify-center relative">
                <SmartVideo
                  src={asset(src)}
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                  className="w-full h-auto max-h-[75vh] object-contain object-center block"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
