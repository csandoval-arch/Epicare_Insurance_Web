"use client";

import { Fragment, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { WORD_BOLD, WORD_LIGHT, richWords } from "./shared";

const PANELS = [
  { key: "mission", dot: "bg-[var(--color-brand-blue)]", overline: "text-[var(--color-hero-blue)]" },
  { key: "vision", dot: "bg-[var(--color-brand-orange)]", overline: "text-[var(--color-brand-orange)]" },
] as const;

/**
 * @description Misión / Visión en móvil y tablet: misión → `map` (el vídeo, a sangre) → visión.
 * Cada panel: etiqueta + titular, alineados a la izquierda (sin bajada). Cada titular entra al llegar
 * con sus palabras en cascada (en `usePurposeMotion`).
 */
export default function PurposeMobile({ map }: { map: ReactNode }) {
  const t = useTranslations("company.purpose");

  return (
    <div className="flex flex-col gap-static-2xl">
      {PANELS.map(({ key, dot, overline }, index) => (
        <Fragment key={key}>
          {/* El mapa va entre misión y visión */}
          {index === 1 && map}

          <div className="pcm-panel px-gutter-sm md:px-gutter-md flex flex-col">
            <div className="flex items-center gap-static-md mb-static-sm">
              <span className={`w-static-sm h-static-sm rounded-full ${dot}`} aria-hidden="true" />
              <span className={`text-overline ${overline}`}>{t(`${key}.overline`)}</span>
            </div>

            <h2 className="text-display">
              {richWords(t.raw(`${key}.title`) as string).map(({ word, bold }, i) => (
                <span key={i}>
                  <span className={`pcm-word inline-block ${bold ? WORD_BOLD : WORD_LIGHT}`}>{word}</span>{" "}
                </span>
              ))}
            </h2>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
