"use client";

/**
 * @description Encabezado de "Conversaciones" (overline + titular + CTA). Congelado: mismo copy,
 * tokens y orden que la versión aprobada. Sus entradas viven en
 * `useConvHeaderMotion` (clases `.conv-text-reveal` y `.conv-cta`).
 */

import { useTranslations } from "next-intl";
import PrimaryCta from "../cta/PrimaryCta";

export default function ConvHeader() {
  const t = useTranslations("goCrm.conversations");

  return (
    <div className="w-full max-w-6xl mx-auto px-gutter-sm md:px-gutter-md text-left md:text-center relative z-20 flex flex-col items-start md:items-center">
      <div className="overflow-hidden mb-static-md">
        <p className="conv-text-reveal text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] relative" aria-hidden="true">
            <span className="absolute inset-0 bg-[var(--color-brand-blue)] rounded-full animate-ping opacity-75"></span>
          </span>
          {t("overline")}
        </p>
      </div>
      <div className="overflow-hidden pb-static-md w-full max-w-[1100px] mx-auto">
        <h2 className="conv-text-reveal text-display-sm lg:text-display-lg text-[var(--color-text-primary)]">{t("headline")}</h2>
      </div>
      <PrimaryCta label={t("cta")} className="conv-cta mt-static-md mb-static-md md:mb-0" />
    </div>
  );
}
