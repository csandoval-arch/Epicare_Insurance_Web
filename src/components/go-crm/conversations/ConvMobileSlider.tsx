"use client";

/**
 * @description Móvil (<md) de "Conversaciones": las 3 piezas de la consola en un slider horizontal
 * nativo (MOBILE-PATTERN-LIBRARY §1: `scroll-snap`, sin JS de arrastre, indicador por rAF). Cada
 * slide = panel con la proporción del hilo (todas iguales; la siguiente asoma) + título y texto
 * debajo, fuera del contenedor. La historia de cada panel la monta `ConvExploded`.
 */

import { useRef, useState, type ComponentType } from "react";
import FeatureTitle from "./FeatureTitle";
import { PANELS, type ConvFeature } from "./convData";
import { Artboard } from "./console/ui";

interface Props {
  cards: ConvFeature[];
  panels: readonly ComponentType[];
  panelClass: string;
}

export default function ConvMobileSlider({ cards, panels, panelClass }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  // Slide activo (medido como mucho una vez por frame).
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      const index = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  return (
    <div className="cx-slider md:hidden flex flex-col gap-static-lg">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm scroll-px-[var(--space-gutter-sm)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => {
          const Ui = panels[i];
          return (
            <div key={card.title} className="cx-item w-[84vw] max-w-sm shrink-0 snap-start flex flex-col gap-static-md">
              <div className={`overflow-hidden ${panelClass}`}>
                <Artboard w={PANELS[i].w} h={PANELS[i].h} view={PANELS[i].mobile}>
                  <Ui />
                </Artboard>
              </div>
              <div>
                <FeatureTitle card={card} index={i} />
                <p className="mt-static-sm text-body-md text-[var(--color-text-secondary)]">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicador: pista n×2rem, pulgar movido con `translate` (compositor) */}
      <div className="px-gutter-sm" aria-hidden="true">
        <div className="relative h-1.5 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden" style={{ width: `${cards.length * 2}rem` }}>
          <span
            className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out"
            style={{ translate: `${active * 100}% 0` }}
          />
        </div>
      </div>
    </div>
  );
}
