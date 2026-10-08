"use client";

/**
 * @file HeroTeam.tsx
 * @description Acto 00 de /team — hero fusionado con "The case". Arriba, el texto en dos columnas
 * (eyebrow + titular a la izquierda; subtítulo + CTA a la derecha, alineados a la base del titular);
 * en la parte inferior, el carrusel de las etapas del caso (`case/CaseCoverflow` sin su encabezado:
 * el titular lo pone el hero) y su frase de cierre. El elenco en grupo se retiró: repetía a las mismas
 * personas que las tarjetas justo debajo (versión anterior en `_quarantine/team/hero-cast/`).
 * - Entrada del texto tras el loader: `hero/useHeroTeamMotion`. El carrusel trae la suya.
 * - Móvil: texto apilado y el slider nativo de tarjetas.
 * Fondo papel bimodal (`--color-hero-ivory` / `--color-hero-ink`).
 */

import { useRef } from "react";
import { useTranslations } from "next-intl";
import type Lenis from "lenis";
import SecondaryCta from "@/components/go-crm/cta/SecondaryCta";
import CaseCoverflow from "./case/CaseCoverflow";
import type { CaseStage } from "./case/caseData";
import { useHeroTeamMotion } from "./hero/useHeroTeamMotion";

/** Sección a la que lleva el CTA ("Meet the crew"). */
export const TEAM_CREW_ID = "team-crew";

/** Por Lenis: `window.scrollTo` con smooth pelea con él. Si el destino aún no existe, baja una pantalla. */
function scrollToCrew() {
  const target = document.getElementById(TEAM_CREW_ID);
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  const y = target ? target.getBoundingClientRect().top + window.scrollY : window.innerHeight;
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: "smooth" });
}

export default function HeroTeam() {
  const t = useTranslations("team.hero");
  const tc = useTranslations("team.case");
  const rootRef = useRef<HTMLElement>(null);
  const title = t.raw("title") as string[];
  useHeroTeamMotion(rootRef);

  return (
    <section ref={rootRef} className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] pt-[calc(var(--space-section-md)+var(--spacing-static-lg))]">
      {/* ── EL TEXTO: titular a la izquierda, subtítulo + CTA a la derecha ── */}
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md grid-layout gap-y-static-xl items-end">
        <div className="col-span-full lg:col-span-8 flex flex-col items-start gap-static-lg">
          <div className="overflow-hidden">
            <p className="ht-birth text-overline text-[var(--color-text-accent-blue)]">{t("eyebrow")}</p>
          </div>
          <h1 className="text-display-lg 2xl:text-display-xl">
            {title.map((line) => (
              <span key={line} className="block overflow-hidden pb-static-xs">
                <span className="ht-birth block">{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <div className="col-span-full lg:col-start-9 lg:col-span-4 flex flex-col items-start gap-static-lg lg:pb-static-sm">
          <p className="ht-sub text-body-xl text-[var(--color-text-secondary)]">{t("subtitle")}</p>
          <SecondaryCta tone="light" label={t("cta")} onClick={scrollToCrew} className="ht-cta" />
        </div>
      </div>

      {/* ── EL CARRUSEL en la parte inferior (sin encabezado propio) ── */}
      <CaseCoverflow stages={tc.raw("stages") as CaseStage[]} closing={tc.raw("closing") as string[]} header={false} />
    </section>
  );
}
