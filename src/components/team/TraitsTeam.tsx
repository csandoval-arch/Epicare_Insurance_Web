"use client";

/**
 * @file TraitsTeam.tsx
 * @description Acto F de /team — "Five traits, signed.": la personalidad de marca del brandbook
 * (Modern, Trustworthy, Supportive, Accessible, Empowering), cada rasgo firmado por una persona del
 * equipo con un ejemplo real de cómo lo vive con los agentes. Una sección de valores es genérica
 * cuando nadie la firma.
 * - Desktop: los cinco rasgos en `text-display`, un paso por debajo del titular (col 1-7); el scroll enciende uno a la vez (los
 *   demás quedan en penumbra) y el panel fijo de la derecha (`traits/TraitSignature`, sticky CSS,
 *   sin pin) cambia de firma. Hover/foco en una palabra también la enciende.
 * - Móvil: cada rasgo es un bloque — palabra, ejemplo y firma con avatar —; sin sticky.
 *
 * ⚠️ PLACEHOLDER — los ejemplos son provisionales hasta tener los 5 ejemplos reales del equipo.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, TRIGGER } from "@/lib/motion";
import CaseHeader from "./case/CaseHeader";
import TraitSignature from "./traits/TraitSignature";
import CrewPortrait from "./crew/CrewPortrait";
import { CREW, type CrewKey, type CrewDept } from "./crew/crewData";

interface TraitItem {
  trait: string;
  who: CrewKey;
  quote: string;
}

export default function TraitsTeam() {
  const t = useTranslations("team.traits");
  const depts = useTranslations("team").raw("departments") as Record<CrewDept, string>;
  const items = t.raw("items") as TraitItem[];
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const item = items[active];

  const light = (i: number) => {
    setTouched(true);
    setActive((prev) => (prev === i ? prev : i));
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    // ── DESKTOP: la palabra que cruza el centro de la pantalla es la que firma ──
    mm.add("(min-width: 1024px)", () => {
      gsap.utils.toArray<HTMLElement>(".tt-row", el).forEach((row, i) =>
        ScrollTrigger.create({ trigger: row, start: "top center", end: "bottom center", onToggle: (self) => self.isActive && light(i) })
      );
    });
    // ── MÓVIL: cada bloque entra al llegar ──
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".tt-row", el).forEach((row) =>
        gsap.fromTo(row, { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, scrollTrigger: { trigger: row, start: TRIGGER.early } })
      );
    });
    return () => mm.revert();
  }, []);

  // Fondo azul de marca y texto blanco (pedido del usuario), igual en claro y oscuro.
  return (
    <section ref={ref} className="relative w-full bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] py-section-md lg:py-section-lg">
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md">
        <CaseHeader ns="team.traits" inverse large className="max-w-3xl" />

        <div className="grid-layout items-start pt-static-2xl lg:pt-section-sm">
          {/* ── LOS CINCO RASGOS ── */}
          <ol className="col-span-full lg:col-span-7">
            {items.map((it, i) => {
              const on = i === active;
              // Cada rasgo es una celda con stroke completo; -mt-px solapa los bordes contiguos (una sola línea).
              return (
                <li key={it.trait} className="tt-row border border-[var(--color-text-White-100)]/30 -mt-px first:mt-0 px-gutter-sm md:px-static-lg py-static-xl lg:py-section-xs">
                  <button
                    type="button"
                    onMouseEnter={() => light(i)}
                    onFocus={() => light(i)}
                    className="hidden lg:block w-full text-left cursor-default focus-visible:outline-2 focus-visible:outline-[var(--color-text-White-100)]"
                  >
                    <span className={`block text-display transition-opacity duration-500 ease-out ${on ? "opacity-100" : "opacity-20"}`}>{it.trait}</span>
                  </button>

                  {/* Móvil: palabra, ejemplo y firma */}
                  <div className="lg:hidden flex flex-col gap-static-md">
                    <h3 className="text-display">{it.trait}</h3>
                    <p className="text-body-lg text-[var(--color-text-White-100)]/80">“{it.quote}”</p>
                    <p className="flex items-center gap-static-md pt-static-xs">
                      <CrewPortrait who={it.who} round className="w-14 shrink-0" />
                      <span className="flex flex-col gap-static-xs rounded-md border border-[var(--color-text-White-100)]/40 px-static-lg py-static-md">
                        <span className="text-body-md">{CREW[it.who].name}</span>
                        <span className="text-body-sm text-[var(--color-text-White-100)]/80">{depts[CREW[it.who].dept]}</span>
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ── LA FIRMA (desktop, fija mientras pasan los rasgos) ── */}
          <div className="hidden lg:block lg:col-start-9 lg:col-span-4 lg:sticky lg:top-[var(--space-section-md)] pt-section-xs">
            <TraitSignature key={active} who={item.who} quote={item.quote} dept={depts[CREW[item.who].dept]} animate={touched} />
          </div>
        </div>
      </div>
    </section>
  );
}
