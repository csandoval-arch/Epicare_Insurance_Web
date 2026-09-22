"use client";

/**
 * @file TheWorkBehindASale.tsx
 * @description Sección 4 de GO CRM — "Seguimiento". Intro con titular que se enciende palabra a
 * palabra con el scroll y, debajo, los 3 pasos del trabajo de una venta:
 * - Desktop (≥lg): split pineado con tira de pantallazos (`work-behind/StepsPinned`).
 * - Móvil/tablet (<lg): scroll normal, título + subtítulo + pantallazo por paso (`StepsStacked`).
 */

import { useRef } from "react";
import { useTranslations } from "next-intl";
import StepsPinned from "./work-behind/StepsPinned";
import StepsStacked from "./work-behind/StepsStacked";
import type { StepCopy } from "./work-behind/data";
import { useWorkBehindMotion } from "./work-behind/useWorkBehindMotion";

export default function TheWorkBehindASale() {
  const t = useTranslations("goCrm.workBehind");
  const steps = t.raw("steps") as StepCopy[];
  const rootRef = useRef<HTMLDivElement>(null);

  useWorkBehindMotion(rootRef);

  return (
    <div ref={rootRef} className="w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)]">
      {/* ── INTRO ── */}
      <section className="v4-intro w-full max-w-4xl mx-auto px-gutter-sm md:px-gutter-md pt-32 pb-32 text-left md:text-center flex flex-col items-start md:items-center">
        <p className="text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest mb-static-md">{t("overline")}</p>
        <h2 className="text-display text-[var(--color-text-primary)]">
          {t("intro")
            .split(" ")
            .map((word, i) => (
              <span key={i} className="scrub-word inline-block mr-[0.25em]">
                {word}
              </span>
            ))}
        </h2>
      </section>

      {/* ── LOS 3 PASOS ── */}
      <div className="hidden lg:block">
        <StepsPinned steps={steps} stepLabel={t("stepLabel")} />
      </div>
      <StepsStacked steps={steps} />
    </div>
  );
}
