"use client";

/**
 * @file HeroTeam.tsx
 * @description Acto 00 de /team — "The cast". Titular a la izquierda y, a la derecha, el elenco clay
 * en 3 profundidades como una foto de grupo de película: atrás tres figuras, en medio dos, delante el
 * agente (la figura azul, el protagonista) tan cerca que el borde lo recorta.
 * - Entrada tras el loader, scroll que separa las capas y cursor que las mueve: `hero/useHeroTeamMotion`.
 * - Móvil: titular arriba, elenco debajo a sangre; solo entrada (sin scroll ni cursor).
 * Fondo papel bimodal (`--color-hero-ivory` / `--color-hero-ink`).
 */

import { useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type Lenis from "lenis";
import { asset } from "@/lib/asset";
import SecondaryCta from "@/components/go-crm/cta/SecondaryCta";
import { DEPTHS, HERO_CAST, type CastSlot } from "./cast";
import { useHeroTeamMotion } from "./hero/useHeroTeamMotion";

/** Sección a la que lleva el CTA ("Meet the crew"): el índice del equipo (Acto 02). */
export const TEAM_CREW_ID = "team-crew";

/**
 * Vida latente: cada figura respira (sube y baja 0.4 % de su alto) a su propio ritmo. Keyframe CSS en
 * el compositor, pausado fuera de pantalla con `.is-offscreen`. Margen creativo: 5–7 s por ciclo.
 */
const BREATH_CSS = `
@keyframes ht-breath { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(0, -0.4%, 0); } }
@media (prefers-reduced-motion: no-preference) {
  .ht-root .ht-breath { animation: ht-breath var(--ht-breath, 6s) ease-in-out infinite alternate; }
  .ht-root.is-offscreen .ht-breath { animation-play-state: paused; }
}
`;

/** Por Lenis: `window.scrollTo` con smooth pelea con él. Si el índice aún no existe, baja una pantalla. */
function scrollToCrew() {
  const target = document.getElementById(TEAM_CREW_ID);
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  const y = target ? target.getBoundingClientRect().top + window.scrollY : window.innerHeight;
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/** Sombra de contacto bajo cada figura: la asienta en el "suelo" del set (overlay del DS al 18 %, oscuro en ambos temas). */
const CONTACT_SHADOW: CSSProperties = {
  background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-overlay-backdrop) 18%, transparent), transparent)",
};

/** Índice global de cada figura (para desfasar su respiración). */
const LAYER_OFFSET = DEPTHS.map((_, d) => DEPTHS.slice(0, d).reduce((sum, depth) => sum + HERO_CAST[depth].length, 0));

function Figure({ slot, index }: { slot: CastSlot; index: number }) {
  const { asset: a, left, bottom, height } = slot;
  return (
    <div className="ht-fig absolute" style={{ left: `${left}%`, bottom: `${bottom}%`, height: `${height}%`, aspectRatio: `${a.w} / ${a.h}` }}>
      <div aria-hidden="true" className="absolute left-[15%] right-[15%] -bottom-[2%] h-[5%]" style={CONTACT_SHADOW} />
      <div className="ht-tilt relative h-full w-full [transform-style:preserve-3d]">
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza */}
        <img
          src={asset(a.src)}
          alt=""
          aria-hidden="true"
          width={a.w}
          height={a.h}
          decoding="async"
          draggable={false}
          className="ht-breath block h-full w-auto select-none"
          style={{ "--ht-breath": `${5 + (index % 3)}s`, animationDelay: `${-index * 1.3}s` } as CSSProperties}
        />
      </div>
    </div>
  );
}

export default function HeroTeam() {
  const t = useTranslations("team.hero");
  const rootRef = useRef<HTMLElement>(null);
  const title = t.raw("title") as string[];
  useHeroTeamMotion(rootRef);

  return (
    <section
      ref={rootRef}
      className="ht-root relative w-full lg:h-svh lg:min-h-[44rem] overflow-hidden bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)]"
    >
      <style href="team-hero" precedence="default">{BREATH_CSS}</style>

      {/* ── COPY ── */}
      <div className="relative z-10 lg:h-full w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md grid-layout items-center pt-[calc(var(--space-section-md)+var(--spacing-static-lg))] lg:pt-0">
        <div className="ht-copy col-span-full lg:col-span-6 flex flex-col items-start gap-static-lg">
          <div className="overflow-hidden">
            <p className="ht-birth text-overline text-[var(--color-text-accent-blue)]">{t("eyebrow")}</p>
          </div>
          <h1 className="text-display-lg 2xl:text-display-xl">
            {title.map((line) => (
              <span key={line} className="block overflow-hidden pb-static-xs">
                <span className="ht-birth block">{line}</span>
              </span>
            ))}
          </h1>
          <p className="ht-sub text-body-xl border-l border-current pl-static-lg">{t("subtitle")}</p>
          <SecondaryCta tone="light" label={t("cta")} onClick={scrollToCrew} className="ht-cta" />
        </div>
      </div>

      {/* ── EL ELENCO: 3 profundidades (atrás → delante) ── */}
      <div className="ht-stage relative lg:absolute lg:inset-y-0 lg:right-0 w-full lg:w-[54%] h-[54svh] lg:h-full -mt-[10svh] lg:mt-0 [perspective:1400px]">
        {DEPTHS.map((depth, d) => (
          <div key={depth} className={`ht-layer-${depth} absolute inset-0`} style={{ zIndex: d + 1 }}>
            <div className="ht-drift absolute inset-0">
              {HERO_CAST[depth].map((slot, i) => (
                <Figure key={slot.asset.src} slot={slot} index={LAYER_OFFSET[d] + i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
