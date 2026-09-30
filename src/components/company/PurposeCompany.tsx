"use client";

/**
 * @file PurposeCompany.tsx
 * @description Misión → mapa → visión en /company.
 * - Desktop (≥lg): índice lateral fijo (Misión · Presencia · Visión) que marca dónde estás; el contenido
 *   fluye a la derecha, el mapa como figura con pie de foto (`purpose/desktop/PurposeRail`).
 * - Móvil / tablet: misión → vídeo del mapa a sangre → visión (`purpose/PurposeMobile`).
 * Colores: tokens `--color-hero-*` (bimodales); el fondo horneado del vídeo se elimina con `MAP_BLEND`.
 */

import { useRef } from "react";
import PurposeMobile from "./purpose/PurposeMobile";
import PurposeRail from "./purpose/desktop/PurposeRail";
import { MapVideo } from "./purpose/shared";
import { usePurposeMotion } from "./purpose/usePurposeMotion";

export default function PurposeCompany() {
  const containerRef = useRef<HTMLElement>(null);

  usePurposeMotion(containerRef);

  return (
    <section ref={containerRef} className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] z-10">
      {/* ── DESKTOP ── */}
      <div className="hidden lg:block">
        <PurposeRail />
      </div>

      {/* ── MÓVIL / TABLET: misión · mapa · visión ── */}
      <div className="lg:hidden py-section-md">
        <PurposeMobile
          map={
            // Marco con hairline (como en desktop), dentro del margen de 14px. `scale-130` acerca el mapa;
            // el marco recorta y lleva el marfil (grupo del blend del vídeo).
            <div className="px-gutter-sm md:px-gutter-md pointer-events-none" aria-hidden="true">
              <div className="w-full aspect-video overflow-hidden border border-[var(--color-border-Strokes-default)] bg-[var(--color-hero-ivory)]">
                <MapVideo className="pcm-map w-full h-full object-cover scale-130 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
