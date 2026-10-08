"use client";

/**
 * @file DayTeam.tsx
 * @description Acto C de /team — "Behind the scenes": el trabajo invisible que sostiene al agente.
 * Un reloj recorre un día real (08:00 → 18:00) con lo que el equipo hace mientras el agente vende;
 * en cada hora aparece quien lo hace. Remata en el agente: "Tú vendiste. Nosotros nos encargamos del
 * resto." El mantra interno ("The work behind the work") inspira la idea; no es el título público.
 * Sin encabezado (el usuario lo quitó): la sección abre directo con el reloj.
 * - Con motion (móvil y desktop): el escenario del reloj (`day/DayStage`).
 * - Reduced-motion: línea de tiempo vertical (`day/DayList`); con motion queda solo para lectores de pantalla.
 * Fondo papel (un solo fondo).
 */

import { useTranslations } from "next-intl";
import DayStage from "./day/DayStage";
import DayList from "./day/DayList";
import { CREW, type CrewDept } from "./crew/crewData";
import { TEAM_CREW_ID } from "./HeroTeam";
import type { DayItem } from "./day/dayData";

export default function DayTeam() {
  const t = useTranslations("team.day");
  const depts = useTranslations("team").raw("departments") as Record<CrewDept, string>;
  const items = t.raw("items") as DayItem[];
  const names = (who: DayItem["who"]) => (who === "agent" ? t("agent") : `${CREW[who].name} · ${depts[CREW[who].dept]}`);

  return (
    <section id={TEAM_CREW_ID} className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] pt-section-md motion-safe:pt-0">
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md motion-safe:sr-only">
        <DayList items={items} names={names} />
      </div>
      <div className="hidden motion-safe:block">
        <DayStage items={items} names={names} nextLabel={t("next")} />
      </div>
    </section>
  );
}
