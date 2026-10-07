"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { HUB_PRODUCTS, MARK_SLOTS, type HubProduct } from "./types";

/**
 * @description Titular del ecosistema ("Vende más, / opera mejor / y sigue aprendiendo.") con el glifo
 * de cada producto intercalado tras su palabra (`MARK_SLOTS`). Cada línea va enmascarada para el
 * text-birth: `.hub-line` es la línea interna que anima el GSAP del Bento.
 */
export default function HubTitle({
  className = "",
  renderMark,
}: {
  className?: string;
  renderMark: (product: HubProduct) => React.ReactNode;
}) {
  const t = useTranslations("landingV2.bento");
  const lines = t("sectionTitle").split("\n").map((line) => line.split(" "));
  // Índice global de la primera palabra de cada línea
  const lineStart = lines.map((_, l) => lines.slice(0, l).flat().length);
  const marksAfter = (slot: number) => HUB_PRODUCTS.filter((p) => MARK_SLOTS[p] === slot);

  return (
    <h2 className={`text-[var(--act1-ink,var(--color-text-primary))] ${className}`}>
      {lines.map((words, l) => (
        <span key={l} className="block overflow-hidden pb-1 -mb-1">
          <span className="hub-line block">
            {words.map((word, w) => (
              <React.Fragment key={w}>
                {w > 0 && " "}
                {word}
                {marksAfter(lineStart[l] + w).map((p) => (
                  <React.Fragment key={p}>{renderMark(p)}</React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </span>
        </span>
      ))}
    </h2>
  );
}
