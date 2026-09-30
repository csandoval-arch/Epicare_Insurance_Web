"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE } from "@/lib/motion";
import { BirthWords, MapFigure, PANEL_COPY, type PanelKey } from "../shared";
import { birthWords, revealFigure, revealLines } from "./motion";

gsap.registerPlugin(ScrollTrigger);

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
/** Ítems del índice fuera de foco. */
const RAIL_DIM = 0.35;

const STEPS = ["mission", "map", "vision"] as const;

// ── COMPOSICIÓN (fijada con el editor en vivo, 2026-09-30) ──
// Retícula de 12: índice en col 1-2 (ocupa las 3 filas); titulares en col 4-11; mapa en 4-12; bajadas en 4-8.
/** Bloque a todo el ancho que reparte sus hijos en las mismas 12 columnas. */
const BLOCK = "col-span-full grid grid-cols-subgrid";
const TITLE_COLS = "col-start-4 col-span-8";
const BODY_COLS = "col-start-4 col-span-5";
const MAP_COLS = "col-start-4 col-span-9";

function Statement({ id, row }: { id: PanelKey; row: string }) {
  const t = useTranslations(`company.purpose.${id}`);
  const bold = (chunks: ReactNode) => <strong className="font-semibold text-[var(--color-hero-ink)]">{chunks}</strong>;
  return (
    <div className={`pr-step ${BLOCK} ${row} gap-y-static-2xl`} data-step={id}>
      <h2 className={`${TITLE_COLS} text-display`}>
        <BirthWords text={t("title")} />
      </h2>
      <p className={`pr-fade ${BODY_COLS} text-body-lg text-[var(--color-text-secondary)]`}>{t.rich("body", { b: bold })}</p>
    </div>
  );
}

/**
 * @description Misión → mapa → visión en desktop: "índice lateral". Columna izquierda fija (sticky)
 * con el índice — Misión · Presencia · Visión — que marca dónde estás; el contenido va en la misma
 * retícula de 12 (subgrid): misión, el mapa en un marco de hairline, visión. Lectura continua, sin pin;
 * entradas one-shot (Text-Birth por palabra, cortina + parallax en el mapa).
 */
export default function PurposeRail() {
  const t = useTranslations("company.purpose");
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);

    mm.add("(min-width: 1024px)", () => {
      const items = gsap.utils.toArray<HTMLElement>(".pr-item", el);
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]:not(.pr-item)", el);
      let current = "";

      /** Activa el ítem del índice (solo si cambia). */
      const focus = (step: string) => {
        if (step === current) return;
        current = step;
        items.forEach((item) =>
          gsap.to(item, { opacity: item.dataset.step === step ? 1 : RAIL_DIM, duration: DUR.fast, ease: EASE.snap, overwrite: true })
        );
      };

      /** Bloque activo = el último cuyo borde superior ya cruzó la mitad de la pantalla (el primero por
       *  defecto). Se mide en vivo en cada scroll: sin huecos entre bloques, sin posiciones cacheadas que
       *  se desfasan cuando cambian las alturas (fuentes, split de líneas, vídeo), en los dos sentidos. */
      const update = () => {
        const mid = window.innerHeight / 2;
        let active = steps[0]?.dataset.step ?? "";
        for (const step of steps) if (step.getBoundingClientRect().top <= mid) active = step.dataset.step!;
        focus(active);
      };

      gsap.set(items, { opacity: RAIL_DIM });
      ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onUpdate: update, onRefresh: update });
      update();
    });

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll(".pr-step").forEach((step) => {
        birthWords(step);
        // Cada bajada se revela por líneas al asomar ella misma
        step.querySelectorAll<HTMLElement>(".pr-fade").forEach((body) => revealLines(body));
      });
      revealFigure(el);
    });

    return () => mm.revert();
  }, []);

  const label = (step: (typeof STEPS)[number]) => (step === "map" ? t("mapLabel") : t(`${step}.overline`));
  const dot = (step: (typeof STEPS)[number]) => (step === "map" ? "bg-[var(--color-hero-ink)]" : PANEL_COPY[step].dot);

  return (
    <div
      ref={rootRef}
      className="w-full max-w-section-xl mx-auto px-gutter-md py-section-lg grid grid-cols-12 gap-x-[var(--space-fluid-sm)] gap-y-[var(--space-section-md)]"
    >
      {/* ── ÍNDICE (sticky, ocupa las tres filas) ── */}
      <nav className="col-start-1 col-span-2 row-start-1 row-span-3" aria-hidden="true">
        <ol className="sticky top-[var(--space-section-md)] flex flex-col border-t border-[var(--color-border-Strokes-default)]">
          {STEPS.map((step) => (
            <li
              key={step}
              data-step={step}
              className="pr-item flex items-center gap-static-md py-static-md border-b border-[var(--color-border-Strokes-default)]"
            >
              <span className={`w-static-sm h-static-sm rounded-full ${dot(step)}`} />
              <span className="text-overline">{label(step)}</span>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── CONTENIDO ── */}
      <Statement id="mission" row="row-start-1" />
      <div data-step="map" className={`${BLOCK} row-start-2`}>
        {/* Marco 16/10 con hairline; el mapa centrado con un ligero zoom (1.1×). El marco no crece: recorta. */}
        <MapFigure
          className={MAP_COLS}
          frameClass="aspect-[16/10] border border-[var(--color-border-Strokes-default)]"
          zoom={1.1}
        />
      </div>
      <Statement id="vision" row="row-start-3" />
    </div>
  );
}
