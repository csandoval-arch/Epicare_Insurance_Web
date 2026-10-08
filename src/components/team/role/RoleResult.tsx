"use client";

/**
 * @description Resultado del selector del Acto 03: el camino elegido (número · etiqueta, título,
 * texto y CTA). Sin figura (el usuario la quitó: solo texto). El padre lo remonta
 * con `key` al cambiar de camino; si `animate`, entra con Layered Unveiling: el título nace de su
 * máscara y el resto le sigue.
 */

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import PrimaryCta from "@/components/go-crm/cta/PrimaryCta";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";
import type { RolePath } from "./rolePaths";

/** Textura de las tarjetas de camino (también la usa el slider móvil). */
export const GLOW: CSSProperties = {
  backgroundImage: "radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--color-brand-blue) 16%, transparent), transparent 60%)",
};

interface RoleResultProps {
  path: RolePath;
  cta: string;
  /** false en el primer render: la entrada de la sección la hace el padre al llegar con el scroll. */
  animate: boolean;
}

export default function RoleResult({ path, cta, animate }: RoleResultProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline()
        .fromTo(".rr-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.fast, ease: EASE.dramatic, force3D: true }, 0)
        .fromTo(".rr-in", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.fast, ease: EASE.snap, stagger: STAGGER.tight, force3D: true }, 0.05);
    });
    return () => mm.revert();
  }, [animate]);

  return (
    <div ref={ref} className="flex flex-col items-start gap-static-lg" aria-live="polite">
      {/* El camino elegido, encerrado en un contenedor con stroke (el mismo borde que las opciones) y una
          textura difuminada mínima: un halo del azul de marca que nace en la esquina y se disuelve antes
          del texto. Solo un gradiente (sin filter). Margen creativo: 16 % de azul, elipse 120×90 %. */}
      <div
        className="w-full flex flex-col items-start gap-static-md rounded-lg border border-[var(--color-border-Strokes-default)] p-static-lg md:p-static-xl"
        style={GLOW}
      >
        <span className="rr-in text-meta text-[var(--color-text-secondary)]">
          {path.n} · {path.tag}
        </span>
        <h3 className="text-display overflow-hidden pb-static-xs">
          <span className="rr-birth block">{path.title}</span>
        </h3>
        <p className="rr-in text-body-xl text-[var(--color-text-secondary)]">{path.body}</p>
      </div>
      <div className="rr-in">
        <PrimaryCta label={cta} />
      </div>
    </div>
  );
}
