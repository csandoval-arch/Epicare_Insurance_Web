"use client";

/**
 * @file OpportunityJourneyGoCrm.tsx
 * @description Sección 7 de GO CRM — "Sigue todo el viaje". Los 8 pasos de una venta, comprimidos
 * con el mismo patrón que el blueprint de GO AMS (`GoAmsProblemSection`):
 * - Desktop (≥lg): rejilla blueprint de 6×2. El titular ocupa la celda izquierda (2 cols × 2 filas)
 *   y los pasos las 4 columnas restantes; la descripción aparece al hover con un relleno azul que
 *   sube (scaleY, compositor). El último paso (Resultado) queda siempre destacado en azul.
 * - Móvil (<lg): acordeón compacto (número + título); cada fila se abre al tocarla. El último paso
 *   va como tarjeta azul abierta: es el destino del viaje.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

interface JourneyStep {
  title: string;
  desc: string;
}

const DESKTOP = "(min-width: 1024px)";
const MOBILE = "(max-width: 1023px)";
const FULL = "(prefers-reduced-motion: no-preference)";

const BIRTH_FROM = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
const BIRTH_TO = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };
const CARD_FROM = { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" };
const CARD_TO = { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, force3D: true, clearProps: "willChange" };
const oneShot = (trigger: Element | null, start: string = TRIGGER.standard) => ({
  scrollTrigger: { trigger, start, toggleActions: "play none none reverse" },
});

const LINE = "border-[var(--color-border-Strokes-default)]";
const EASE_CSS = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const stepNumber = (i: number) => String(i + 1).padStart(2, "0");

export default function OpportunityJourneyGoCrm() {
  const t = useTranslations("goCrm.journey");
  const steps = t.raw("steps") as JourneyStep[];
  const last = steps.length - 1;
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      gsap.fromTo(".jr-reveal", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
    });
    // Desktop: las celdas entran en ola. Móvil: el acordeón entra como bloque (Pilar 1 móvil).
    mm.add(`${DESKTOP} and ${FULL}`, () => {
      gsap.fromTo(".jr-cell", CARD_FROM, { ...CARD_TO, stagger: STAGGER.wave, ...oneShot(el.querySelector(".jr-grid")) });
    });
    mm.add(`${MOBILE} and ${FULL}`, () => {
      gsap.fromTo(".jr-list", CARD_FROM, { ...CARD_TO, ...oneShot(el.querySelector(".jr-list")) });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--color-surface-BG-base)] py-section-sm lg:py-section-md">
      <div className="w-full max-w-[1440px] mx-auto px-gutter-sm md:px-gutter-md">
        <div className={`jr-grid grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-2 lg:border-t lg:border-l ${LINE}`}>
          {/* ── TITULAR (celda izquierda en desktop; encabezado en móvil) ── */}
          <div className={`lg:col-span-2 lg:row-span-2 lg:border-r lg:border-b ${LINE} pb-static-lg lg:p-static-xl flex flex-col justify-between`}>
            <div>
              <div className="overflow-hidden mb-static-md">
                <p className="jr-reveal text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</p>
              </div>
              <div className="overflow-hidden pb-1">
                <h2 className="jr-reveal text-display-sm lg:text-display text-[var(--color-text-primary)]">{t("headline")}</h2>
              </div>
            </div>
          </div>

          {/* ── DESKTOP: CELDAS BLUEPRINT ── */}
          {steps.map((step, i) =>
            i === last ? (
              <div key={step.title} className={`jr-cell hidden lg:flex border-r border-b ${LINE} p-static-sm`}>
                <div className="w-full flex flex-col justify-between rounded-xl bg-[var(--color-brand-blue)] p-static-md text-[var(--color-text-White-100)]">
                  <span className="text-meta opacity-70">{stepNumber(i)}</span>
                  <div>
                    <h3 className="text-h4">{step.title}</h3>
                    <p className="text-body-sm opacity-90 mt-static-sm">{step.desc}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={step.title} className={`jr-cell group hidden lg:flex relative overflow-hidden flex-col justify-between min-h-56 border-r border-b ${LINE} p-static-lg`}>
                {/* Relleno azul al hover: scaleY desde abajo (compositor) */}
                <span aria-hidden="true" className={`absolute inset-0 bg-[var(--color-brand-blue)] origin-bottom scale-y-0 group-hover:scale-y-100 transition-[scale] duration-500 ${EASE_CSS}`} />
                <span className="relative text-meta text-[var(--color-text-accent-blue)] group-hover:text-[var(--color-text-White-100)] transition-colors duration-300">{stepNumber(i)}</span>
                <div className="relative">
                  <h3 className="text-h4 text-[var(--color-text-primary)] group-hover:text-[var(--color-text-White-100)] transition-colors duration-300">{step.title}</h3>
                  {/* Alto fijo de 3 líneas: todas las celdas alinean el título aunque sus descripciones midan distinto */}
                  <p className={`h-[4.8em] text-body-sm text-[var(--color-text-White-100)] mt-static-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,translate] duration-500 ${EASE_CSS}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* ── MÓVIL: ACORDEÓN COMPACTO ── */}
        <div className={`jr-list lg:hidden border-t ${LINE}`}>
          {steps.slice(0, last).map((step, i) => {
            const isOpen = open === i;
            return (
              <div key={step.title} className={`border-b ${LINE}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-static-md py-static-md text-left cursor-pointer"
                >
                  <span className="w-6 shrink-0 text-meta text-[var(--color-text-accent-blue)]">{stepNumber(i)}</span>
                  <span className="flex-1 text-h5 text-[var(--color-text-primary)]">{step.title}</span>
                  {/* + que rota a × al abrir */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className={`w-5 h-5 shrink-0 text-[var(--color-text-muted)] transition-[rotate] duration-300 ${isOpen ? "rotate-45" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${EASE_CSS} ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="pl-[calc(1.5rem+var(--spacing-static-md))] pb-static-md text-body-md text-[var(--color-text-secondary)]">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Destino del viaje: tarjeta azul, siempre abierta */}
          <div className="mt-static-md rounded-xl bg-[var(--color-brand-blue)] p-static-md text-[var(--color-text-White-100)] flex gap-static-md">
            <span className="w-6 shrink-0 text-meta opacity-70 pt-1">{stepNumber(last)}</span>
            <div>
              <h3 className="text-h5">{steps[last].title}</h3>
              <p className="text-body-md opacity-90 mt-1">{steps[last].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
