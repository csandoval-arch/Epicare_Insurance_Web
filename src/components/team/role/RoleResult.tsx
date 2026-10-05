"use client";

/**
 * @description Resultado del selector del Acto 03: el camino elegido (número · etiqueta, título,
 * texto del brandbook, quién te acompaña y CTA) junto a la figura clay de esa persona, girada hacia
 * el texto — "te mira". El padre lo remonta con `key` al cambiar de camino; si `animate`, entra con
 * Layered Unveiling: la figura sube desde abajo, el título nace de su máscara y el resto le sigue.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { asset } from "@/lib/asset";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PrimaryCta from "@/components/go-crm/cta/PrimaryCta";
import { DUR, EASE, REVEAL, SCRUB, STAGGER } from "@/lib/motion";
import { PATH_GUIDE, type RolePath } from "./rolePaths";

interface RoleResultProps {
  path: RolePath;
  guideLabel: string;
  cta: string;
  /** false en el primer render: la entrada de la sección la hace el padre al llegar con el scroll. */
  animate: boolean;
}

export default function RoleResult({ path, guideLabel, cta, animate }: RoleResultProps) {
  const ref = useRef<HTMLDivElement>(null);
  const guide = PATH_GUIDE[path.key];

  // ── PARALLAX (desktop): la figura flota más lenta que el texto (dos velocidades; el texto, quieto) ──
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ".rr-float",
        { y: REVEAL.lg },
        { y: -REVEAL.lg, ease: EASE.none, scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: SCRUB.smooth } }
      );
    });
    return () => mm.revert();
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline()
        .fromTo(".rr-figure", { y: REVEAL.lg, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, force3D: true }, 0)
        .fromTo(".rr-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.fast, ease: EASE.dramatic, force3D: true }, 0.05)
        .fromTo(".rr-in", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.fast, ease: EASE.snap, stagger: STAGGER.tight, force3D: true }, 0.1);
    });
    return () => mm.revert();
  }, [animate]);

  return (
    <div ref={ref} className="relative flex items-end gap-static-lg" aria-live="polite">
      {/* ── TEXTO ── */}
      <div className="flex-1 min-w-0 flex flex-col items-start gap-static-md pb-static-lg">
        <span className="rr-in text-meta text-[var(--color-text-secondary)]">
          {path.n} · {path.tag}
        </span>
        <h3 className="text-display-sm overflow-hidden pb-static-xs">
          <span className="rr-birth block">{path.title}</span>
        </h3>
        <p className="rr-in text-body-lg text-[var(--color-text-secondary)]">{path.body}</p>
        <p className="rr-in text-meta text-[var(--color-text-secondary)]">
          {guideLabel} — <span className="text-[var(--color-text-primary)]">{path.guide}</span>
        </p>
        <div className="rr-in pt-static-sm">
          <PrimaryCta label={cta} />
        </div>
      </div>

      {/* ── QUIEN TE ACOMPAÑA: una capa por transform — entrada (GSAP) › parallax (GSAP) › giro hacia el
          texto, "te mira" (CSS) › respiración (CSS, pausada fuera de pantalla). Si GSAP animara el mismo
          nodo que lleva el giro, lo pisaría.
          Margen creativo: alto de la figura en svh (es una figura de cuerpo entero, no un medio del DS). */}
      <div
        className="rr-figure shrink-0 h-[38svh] lg:h-[min(34rem,62svh)]"
        style={{ aspectRatio: `${guide.w} / ${guide.h}` }}
        aria-hidden="true"
      >
        <div className="rr-float h-full">
          <div className="h-full [transform:perspective(60rem)_rotateY(-14deg)] origin-bottom">
            <img src={asset(guide.src)} alt="" decoding="async" loading="lazy" className="rt-breath block h-full w-auto select-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
