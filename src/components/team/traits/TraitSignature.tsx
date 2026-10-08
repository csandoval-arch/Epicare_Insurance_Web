"use client";

/**
 * @description Panel de firma del acto F (desktop): el retrato de quien firma el rasgo, su ejemplo real
 * y la firma — nombre sobre una línea azul que se traza al cambiar de rasgo. El padre lo remonta con
 * `key`; en el primer render (`animate` false) queda quieto. Layered Unveiling: retrato › frase › firma.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";
import CrewPortrait from "../crew/CrewPortrait";
import { CREW, type CrewKey } from "../crew/crewData";

export default function TraitSignature({ who, quote, dept, animate }: { who: CrewKey; quote: string; dept: string; animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline()
        .fromTo(".ts-portrait", { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: DUR.base, ease: EASE.out, force3D: true }, 0)
        .fromTo(".ts-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.base, ease: EASE.dramatic, force3D: true }, 0.08)
        .fromTo(".ts-line", { scaleX: 0 }, { scaleX: 1, duration: DUR.slow, ease: EASE.inOut }, 0.2)
        .fromTo(".ts-in", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.fast, ease: EASE.snap, stagger: STAGGER.tight }, 0.3);
    });
    return () => mm.revert();
  }, [animate]);

  return (
    <div ref={ref} className="flex flex-col gap-static-lg" aria-live="polite">
      <div className="w-full max-w-80 overflow-hidden rounded-lg">
        <CrewPortrait who={who} className="ts-portrait w-full" />
      </div>
      <p className="text-body-xl overflow-hidden pb-static-xs">
        <span className="ts-birth block">“{quote}”</span>
      </p>
      {/* La firma, encerrada en un recuadro con stroke (blanco al 40 % sobre el azul) */}
      <div className="flex flex-col gap-static-sm w-fit rounded-md border border-[var(--color-text-White-100)]/40 px-static-lg py-static-md">
        <span className="ts-in text-h5">{CREW[who].name}</span>
        <span aria-hidden="true" className="ts-line block h-px w-full origin-left bg-[var(--color-text-White-100)]" />
        <span className="ts-in text-body-sm text-[var(--color-text-White-100)]/80">{dept}</span>
      </div>
    </div>
  );
}
