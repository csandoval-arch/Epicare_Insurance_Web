"use client";

/**
 * @description Móvil / reduced-motion de las variantes con pin (H, I): encabezado centrado y las 6 etapas
 * en un slider horizontal nativo (MOBILE-PATTERN-LIBRARY §1: `scroll-snap`, indicador por rAF). Cada
 * slide: la ficha de vidrio de la etapa (retrato + frente, etapa y frase). Debajo, la frase de cierre
 * (a la izquierda, ligera salvo la idea clave).
 */

import { useRef, useState } from "react";
import { keyed } from "./keyed";
import GlassCard from "./GlassCard";
import CaseHeader from "./CaseHeader";
import { AGENT_STAGE, STAGE_CARDS, type CaseStage } from "./caseData";

export default function CaseMobileSlider({ stages, closing, className = "" }: { stages: CaseStage[]; closing: string[]; className?: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      const index = Math.min(stages.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  return (
    <div className={`w-full py-section-sm flex-col items-center gap-static-xl ${className}`}>
      <CaseHeader center large className="px-gutter-sm" />
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="w-full flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm scroll-px-[var(--space-gutter-sm)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {stages.map((s, i) => (
          <li key={s.key} className="w-[72vw] max-w-72 shrink-0 snap-start">
            <GlassCard stage={s} card={STAGE_CARDS[s.key]} index={i} agent={s.key === AGENT_STAGE} className="w-full h-full shadow-elevation-2" />
          </li>
        ))}
      </ul>
      <div className="w-full px-gutter-sm" aria-hidden="true">
        <div className="relative h-1.5 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden" style={{ width: `${stages.length * 2}rem` }}>
          <span className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out" style={{ translate: `${active * 100}% 0` }} />
        </div>
      </div>
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
