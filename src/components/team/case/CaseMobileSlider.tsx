"use client";

/**
 * @description Móvil / reduced-motion del carrusel del Acto 01: las 6 etapas en un slider horizontal
 * nativo (MOBILE-PATTERN-LIBRARY §1: `scroll-snap`, indicador por rAF). Cada slide: la ficha de vidrio
 * de la etapa (retrato + frente, etapa y frase). Debajo, la frase de cierre (a la izquierda, ligera
 * salvo la idea clave).
 * - Con encabezado (`header`): slider simple, tarjetas al 72vw alineadas al inicio.
 * - Dentro del hero (`header` false): como en desktop — fila de 3 con la activa al centro y las vecinas
 *   asomando, veladas y sin info; INFINITO (`useInfiniteSnap`): arranca en la primera y el indicador y
 *   el contador marcan la etapa (1–6): al dar la vuelta, la barrita vuelve al inicio.
 */

import type { ReactNode } from "react";
import { useInfiniteSnap } from "../useInfiniteSnap";
import SlideIndicator from "../SlideIndicator";
import { keyed } from "./keyed";
import GlassCard from "./GlassCard";
import CaseHeader from "./CaseHeader";
import { AGENT_STAGE, STAGE_CARDS, type CaseStage } from "./caseData";

interface Props {
  stages: CaseStage[];
  closing: string[];
  /** false dentro del hero: sin encabezado, fila de 3 infinita, vidrio cerca del borde y contador 01/06. */
  header?: boolean;
  /** Contenido entre el indicador y la frase de cierre (el hero pone ahí su subtítulo + CTA). */
  afterTrack?: ReactNode;
  className?: string;
}

export default function CaseMobileSlider({ stages, closing, header = true, afterTrack, className = "" }: Props) {
  const inHero = !header;
  const n = stages.length;
  const { trackRef, onScroll, current, active, copies } = useInfiniteSnap(n, inHero);
  const items = Array.from({ length: copies }, (_, c) => stages.map((s) => ({ s, c }))).flat();

  return (
    <div className={`w-full ${header ? "py-section-sm" : "pt-static-xl pb-section-sm"} flex-col items-center gap-static-xl ${className}`}>
      {header && <CaseHeader center large className="px-gutter-sm" />}
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className={`w-full flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          // Hero: el padding lateral (22vw = (100 - 56) / 2) centra cualquier tarjeta.
          inHero ? "gap-static-sm px-[22vw]" : "gap-static-md px-gutter-sm scroll-px-[var(--space-gutter-sm)]"
        }`}
      >
        {items.map(({ s, c }, k) => {
          // Margen creativo: velo de las vecinas (opacidad 0.7) como el de profundidad en desktop.
          const side = inHero && k !== current;
          // Solo la copia central existe para los lectores de pantalla.
          const clone = copies > 1 && c !== 1;
          return (
            <li
              key={`${c}-${s.key}`}
              aria-hidden={clone || undefined}
              className={`shrink-0 ${inHero ? "w-[56vw] max-w-72 snap-center transition-opacity duration-300 ease-out" : "w-[72vw] max-w-72 snap-start"} ${
                side ? "opacity-70 [&_.gc-panel]:opacity-0 [&_.gc-chip]:opacity-0" : ""
              }`}
            >
              <GlassCard
                stage={s}
                card={STAGE_CARDS[s.key]}
                agent={s.key === AGENT_STAGE}
                tight={inHero}
                className="w-full h-full shadow-elevation-2 [&_.gc-panel]:transition-opacity [&_.gc-chip]:transition-opacity [&_.gc-panel]:duration-300 [&_.gc-chip]:duration-300"
              />
            </li>
          );
        })}
      </ul>
      {/* Indicador (+ contador 01/06 en el hero): marca la etapa, no la copia */}
      <SlideIndicator n={n} active={active} counter={inHero} />
      {afterTrack}
      <p className="w-full px-gutter-sm text-display font-light text-left mt-static-lg">
        {closing.map((line, i) => (
          <span key={line}>
            {i > 0 && " "}
            {keyed(line)}
          </span>
        ))}
      </p>
    </div>
  );
}
