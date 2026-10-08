"use client";

/**
 * @file CaseTeam.tsx
 * @description Acto 01 de /team — "The case": un caso recorre sus 6 etapas y cada una la resuelve
 * alguien del equipo (tarjetita clay en primer plano); el agente es el protagonista. Layout centrado:
 * un coverflow 3D centrado (`case/CaseCoverflow`). Fondo papel, el mismo del hero (un solo fondo).
 */

import { useTranslations } from "next-intl";
import type { CaseStage } from "./case/caseData";
import CaseCoverflow from "./case/CaseCoverflow";

export default function CaseTeam() {
  const t = useTranslations("team.case");
  const stages = t.raw("stages") as CaseStage[];

  return (
    <section className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)]">
      <CaseCoverflow stages={stages} closing={t.raw("closing") as string[]} />
    </section>
  );
}
