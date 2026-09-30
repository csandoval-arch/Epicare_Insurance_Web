"use client";

/**
 * @file PurposeCompany.tsx
 * @description Misión y visión de /company sobre el mapa de EE. UU.
 * - Desktop (≥lg): una pantalla pineada con GSAP; el mapa llena el fondo y los dos paneles se
 *   relevan (misión a la izquierda, visión alineada a la derecha). Reduced-motion: en flujo normal.
 * - Móvil / tablet: misión → vídeo del mapa a sangre → visión (`purpose/PurposeMobile`).
 * Motion en `purpose/usePurposeMotion.ts`. Colores: tokens `--color-hero-*` (bimodales); el fondo
 * horneado del vídeo se elimina con `MAP_BLEND` en los dos temas.
 */

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import SmartVideo from "@/components/epicare/SmartVideo";
import PurposeMobile from "./purpose/PurposeMobile";
import { usePurposeMotion } from "./purpose/usePurposeMotion";

// ── RETÍCULA (misma que el Hero) ──
const ROW = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md grid-layout gap-y-0";

// ── ESCENARIO DESKTOP (con motion: una pantalla; con reduced-motion: flujo normal) ──
const STAGE = "hidden lg:flex flex-col gap-static-2xl py-section-md relative w-full overflow-hidden motion-safe:lg:block motion-safe:h-screen motion-safe:py-0";
/** Con motion los paneles se apilan sobre el mapa. */
const PANEL = "pc-panel relative z-10 motion-safe:absolute motion-safe:inset-0 motion-safe:pt-section-md";
const MAP_WRAP = "relative order-2 w-full aspect-video pointer-events-none dark:opacity-80 motion-safe:absolute motion-safe:inset-0 motion-safe:aspect-auto";

const MAP_SRC = "/Files/About_Company/Pins_fading_on_US_map_20260929131832.mp4";
/** Blend bimodal del mapa: el vídeo trae su fondo beige horneado y se elimina igual en los dos temas.
 *  - Light: brillo 0.9 + contraste 1.6 lleva su fondo a blanco (MÁS CLARO que el marfil) sin aclarar
 *    los puntos, y se funde en `darken` (gana el más oscuro): el fondo desaparece, puntos y pins quedan.
 *    Opacidad plena; en dark el contenedor lo deja al 80%.
 *  - Dark: se invierte (hue-rotate mantiene los pins azules), se oscurece hasta quedar MÁS OSCURO que
 *    el marfil oscuro y se funde en `lighten` (gana el más claro). */
const MAP_BLEND =
  "[filter:brightness(0.9)_contrast(1.6)] mix-blend-darken dark:[filter:invert(1)_hue-rotate(180deg)_brightness(0.6)] dark:mix-blend-lighten";

const PANELS = {
  mission: {
    key: "mission",
    order: "order-1",
    dot: "bg-[var(--color-brand-blue)]",
    overlineColor: "text-[var(--color-hero-blue)]",
    overlineCol: "col-span-full",
    titleCol: "col-span-full lg:col-span-11",
    titleAlign: "",
    bodyCol: "col-span-full md:col-span-5 lg:col-start-9 lg:col-span-3",
  },
  vision: {
    key: "vision",
    order: "order-3",
    dot: "bg-[var(--color-brand-orange)]",
    overlineColor: "text-[var(--color-brand-orange)]",
    overlineCol: "col-span-full lg:col-start-4 lg:col-span-9 lg:flex-row-reverse",
    titleCol: "col-span-full lg:col-start-4 lg:col-span-9 lg:flex lg:justify-end",
    titleAlign: "lg:text-right",
    bodyCol: "col-span-full md:col-span-5 lg:col-start-2 lg:col-span-3 lg:mt-static-2xl",
  },
} as const;

type PanelConfig = (typeof PANELS)[keyof typeof PANELS];

/** Titular partido en palabras (cada una anima por separado) sin romper el wrap natural. */
function WordTitle({ text, align }: { text: string; align: string }) {
  return (
    <h2 className={`text-display max-w-3xl ${align}`}>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span className="pc-word inline-block">{word}</span>{" "}
        </span>
      ))}
    </h2>
  );
}

function Panel({ config }: { config: PanelConfig }) {
  const t = useTranslations(`company.purpose.${config.key}`);
  const bold = (chunks: ReactNode) => <strong className="font-semibold text-[var(--color-hero-blue)]">{chunks}</strong>;

  return (
    <div className={`${PANEL} pc-${config.key} ${config.order}`}>
      <div className={ROW}>
        <div className={`${config.overlineCol} flex items-center gap-static-md mb-static-sm`}>
          <span className={`w-static-sm h-static-sm rounded-full ${config.dot}`} aria-hidden="true" />
          <span className={`text-overline ${config.overlineColor}`}>{t("overline")}</span>
        </div>

        <div className={`${config.titleCol} mb-static-xl`}>
          <WordTitle text={t("title")} align={config.titleAlign} />
        </div>

        <div className={config.bodyCol}>
          <p className="pc-body text-body-lg text-[var(--color-text-secondary)]">{t.rich("body", { b: bold })}</p>
        </div>
      </div>
    </div>
  );
}

export default function PurposeCompany() {
  const containerRef = useRef<HTMLElement>(null);

  usePurposeMotion(containerRef);

  return (
    <section ref={containerRef} className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] z-10">
      {/* ── DESKTOP: escenario pineado ── */}
      <div className={STAGE}>
        <div className={MAP_WRAP} aria-hidden="true">
          <SmartVideo src={asset(MAP_SRC)} className={`pc-map w-full h-full object-cover ${MAP_BLEND}`} />
        </div>
        <Panel config={PANELS.mission} />
        <Panel config={PANELS.vision} />
      </div>

      {/* ── MÓVIL / TABLET: misión · mapa · visión ── */}
      <div className="lg:hidden py-section-md">
        <PurposeMobile
          map={
            // Máscara y opacidad de dark van en el propio vídeo: en el contenedor aislarían el blend (franja).
            // `scale-130` (propiedad `scale`, independiente del transform de GSAP): el mapa llena el ancho.
            <div className="w-full aspect-video pointer-events-none" aria-hidden="true">
              <SmartVideo
                src={asset(MAP_SRC)}
                className={`pcm-map w-full h-full object-cover scale-130 dark:opacity-80 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] ${MAP_BLEND}`}
              />
            </div>
          }
        />
      </div>
    </section>
  );
}
