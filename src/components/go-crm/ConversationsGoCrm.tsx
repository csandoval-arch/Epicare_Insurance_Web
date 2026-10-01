"use client";

/**
 * @file ConversationsGoCrm.tsx
 * @description Sección 5 de GO CRM — "Conversaciones". Encabezado (overline + titular + CTA) y el
 * Despiece: la consola de GO CRM llega montada y, con el scroll, se separa en sus 3 paneles reales;
 * bajo cada uno nace la feature que explica (llamadas · documentos · automatización).
 * Coreografía y móvil en `conversations/ConvExploded`.
 */

import { useRef } from "react";
import { useTranslations } from "next-intl";
import ConvHeader from "./conversations/ConvHeader";
import ConvExploded from "./conversations/ConvExploded";
import { CARD_KEYS, type ConvFeature } from "./conversations/convData";
import { useConvHeaderMotion } from "./conversations/useConversationsMotion";

export default function ConversationsGoCrm() {
  const t = useTranslations("goCrm.conversations");
  const cards: ConvFeature[] = CARD_KEYS.map((n) => ({ title: t(`card${n}Title`), desc: t(`card${n}Desc`) }));

  const sectionRef = useRef<HTMLElement>(null);
  useConvHeaderMotion(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex flex-col items-center justify-start py-section-md lg:py-section-lg border-y border-[var(--color-border-Strokes-default)]"
    >
      <ConvHeader />
      <ConvExploded cards={cards} />
    </section>
  );
}
