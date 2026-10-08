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
 * - Móvil (4 cols): la misma lista de palabras (cols 1-3) que se ilumina al cruzar el centro, y una imagen
 *   cuadrada flotante (sticky) en la col 4 con el retrato y el nombre de quien firma; deriva con scrub suave.
 *
 * ⚠️ PLACEHOLDER — los ejemplos son provisionales hasta tener los 5 ejemplos reales del equipo.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, REVEAL, SCRUB } from "@/lib/motion";
import CaseHeader from "./case/CaseHeader";
import TraitSignature from "./traits/TraitSignature";
import CrewPortrait from "./crew/CrewPortrait";
import { TEAM_GRID } from "./grid";
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
    // ── MÓVIL Y DESKTOP: la palabra que cruza el centro de la pantalla es la que firma (sin scrub:
    //    un toggle por fila, barato) ──
    mm.add("all", () => {
      gsap.utils.toArray<HTMLElement>(".tt-row", el).forEach((row, i) =>
        ScrollTrigger.create({ trigger: row, start: "top center", end: "bottom center", onToggle: (self) => self.isActive && light(i) })
      );
    });
    // ── MÓVIL: la imagen flotante deriva un poco con el scroll (scrub de un solo transform) ──
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".tt-float", { y: REVEAL.md }, { y: -REVEAL.md, ease: EASE.none, force3D: true, scrollTrigger: { trigger: el.querySelector(".tt-list"), start: "top bottom", end: "bottom top", scrub: SCRUB.smooth } });
    });
    return () => mm.revert();
  }, []);

  // Fondo azul de marca y texto blanco (pedido del usuario), igual en claro y oscuro.
  return (
    <section ref={ref} className="relative w-full bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] py-section-md lg:py-section-lg">
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md">
        <CaseHeader ns="team.traits" inverse large className="max-w-3xl" />

        <div className="grid-layout items-start pt-static-2xl lg:pt-section-sm">
          {/* ── MÓVIL: imagen cuadrada flotante (sticky, alto 0 para no ocupar sitio) en la col 4 (8 rem; el texto deja pr-static-xl para no pasar por debajo): los 5
              retratos apilados, solo cambia la opacidad (sin remontar). Encima, el nombre y el área. ── */}
          <div aria-hidden="true" className="lg:hidden col-span-full sticky top-[38svh] h-0 z-10 flex items-start justify-end pointer-events-none">
            <div className="tt-float w-32 shrink-0 flex flex-col gap-static-xs">
              {/* El nombre y el área, encima de la imagen */}
              <span className="text-body-sm leading-tight">{CREW[item.who].name}</span>
              <span className="text-body-sm leading-tight text-[var(--color-text-White-100)]/80 -mt-static-xs mb-static-xs">{depts[CREW[item.who].dept]}</span>
              <div className="relative w-full shrink-0 aspect-square rounded-lg overflow-hidden shadow-elevation-3 bg-[var(--color-surface-BG-2)]">
                {items.map((it, i) => (
                  <CrewPortrait
                    key={it.trait}
                    who={it.who}
                    className={`absolute inset-0 w-full h-full rounded-none transition-[opacity,scale] duration-500 ease-out ${i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── LOS CINCO RASGOS ── */}
          <ol className="tt-list col-span-full lg:col-span-7">
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

                  {/* Móvil (4 cols): palabra y ejemplo en las cols 1-3 (la 4 es de la imagen flotante); se
                      iluminan cuando la fila cruza el centro. La altura no cambia: sin saltos. */}
                  <div className={`lg:hidden ${TEAM_GRID} gap-y-static-sm transition-opacity duration-500 ease-out ${on ? "opacity-100" : "opacity-20"}`}>
                    <h3 className="col-span-3 pr-static-xl text-display-sm">{it.trait}</h3>
                    <p className="col-span-3 pr-static-xl text-body-md text-[var(--color-text-White-100)]/85">“{it.quote}”</p>
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
