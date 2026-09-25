"use client";

/**
 * @file HeroEpicare.tsx
 * @description Hero editorial de la landing ("Construimos"). Titular gigante + dos ventanas a un
 * mismo plano de vídeo + subtítulo en líneas + bloque de prueba (agentes, aseguradoras) + CTAs.
 * - Desktop (≥lg): retícula de 12 columnas, composición aprobada (ventana pequeña arriba a la
 *   derecha, ventana grande a sangre a la izquierda, subtítulo y CTAs al centro, prueba a la derecha).
 * - Móvil / tablet (<lg): una columna con el mismo orden de lectura — titular, subtítulo, CTAs, las
 *   dos ventanas a sangre (asimétricas, como en desktop) y el bloque de prueba.
 * Motion en `hero/useHeroEntrance.ts`. Colores: tokens `--color-hero-*` (bimodales).
 */

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import HeaderEpicare from "./HeaderEpicare";
import HeroCta from "./hero/HeroCta";
import WindowedVideo from "./hero/WindowedVideo";
import { AGENT_AVATARS, HERO_LINKS } from "./hero/data";
import { useHeroEntrance } from "./hero/useHeroEntrance";

/** Avatar del bloque de prueba (retrato o contador), con el borde del color del fondo. */
const AVATAR = "w-static-2xl h-static-2xl rounded-full border-3 border-[var(--color-hero-ivory)] relative";

export default function HeroEpicare() {
  const t = useTranslations("landingV2.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const subtitle = t.raw("subtitle") as string[];
  const agentsLabel = t.raw("agentsLabel") as string[];
  const accent = (chunks: ReactNode) => <span className="text-[var(--color-hero-blue)]">{chunks}</span>;

  useHeroEntrance(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full lg:min-h-screen pb-section-sm lg:pb-0 bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] overflow-hidden"
    >
      <HeaderEpicare isHeaderPill={false} isHeaderForcedDark={false} scrollSafeZone={150} />

      {/* Retícula editorial: 6 col (móvil) · 8 (tablet) · 12 (desktop). Sin gutter horizontal:
          las ventanas de vídeo sangran hasta el borde y el texto lleva su propio margen. */}
      <div className="grid-layout relative z-10 w-full lg:min-h-screen gap-x-0">
        {/* ── VENTANAS DE VÍDEO (capa 20) ── */}
        <div className="hero-visual-right z-20 w-full col-start-5 col-span-2 md:col-start-6 md:col-span-3 row-start-4 pl-static-sm mt-static-2xl lg:pl-0 lg:mt-0 lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:row-span-2">
          <div className="w-full h-40 md:h-60">
            <WindowedVideo />
          </div>
        </div>

        <div className="hero-visual-left z-20 w-full col-start-1 col-span-4 md:col-span-5 row-start-4 lg:col-span-5 lg:row-start-2 lg:row-span-2">
          <div className="w-full h-72 md:h-96 lg:h-120">
            <WindowedVideo />
          </div>
        </div>

        {/* ── TEXTOS Y CTAs (capa 30) ── */}
        <div className="z-30 col-span-full row-start-1 px-gutter-sm lg:px-0 lg:pl-static-2xl pt-[12vh] overflow-hidden">
          <h1 className="hero-title-line text-hero-display whitespace-nowrap">{t("title")}</h1>
        </div>

        {/* Subtítulo + CTAs. Desktop: los CTAs se centran en el alto que queda en la columna. */}
        <div className="z-30 col-span-full row-start-2 row-span-2 flex flex-col px-gutter-sm pt-static-sm md:pt-static-lg lg:px-0 lg:pt-0 lg:col-start-6 lg:col-span-2 lg:h-full lg:ml-static-xl">
          <h2 className="text-display-sm font-medium tracking-tight flex flex-col lg:mt-3.5">
            {subtitle.map((line) => (
              <span key={line} className="hero-subtitle">
                {line}
              </span>
            ))}
          </h2>

          <div className="flex flex-col pt-static-xl lg:pt-0 lg:flex-1 lg:justify-center lg:pb-static-xl">
            <div className="flex flex-wrap items-center gap-static-md">
              <HeroCta href={HERO_LINKS.primary} label={t("ctaPrimary")} variant="primary" />
              <HeroCta href={HERO_LINKS.secondary} label={t("ctaSecondary")} variant="secondary" />
            </div>
          </div>
        </div>

        {/* ── BLOQUE DE PRUEBA: agentes + aseguradoras ── */}
        <div className="hero-proof z-30 col-span-full row-start-5 flex flex-col justify-start gap-static-lg px-gutter-sm pt-static-2xl lg:px-0 lg:pt-0 lg:col-start-9 lg:col-span-2 lg:row-start-2 lg:mt-6.5">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3" aria-hidden="true">
              {AGENT_AVATARS.map((src, i) => (
                <div
                  key={src}
                  className={`${AVATAR} bg-cover bg-center grayscale mix-blend-multiply dark:mix-blend-normal`}
                  style={{ backgroundImage: `url(${src})`, zIndex: AGENT_AVATARS.length + 1 - i }}
                />
              ))}
              <div className={`${AVATAR} z-1 bg-[var(--color-hero-ink)] flex items-center justify-center`}>
                <span className="text-caption font-semibold tracking-tighter text-[var(--color-hero-ivory)]">{t("agentsCount")}</span>
              </div>
            </div>
            <p className="text-caption font-medium leading-tight opacity-80">
              {agentsLabel.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <p className="text-h3 font-medium opacity-80 lg:pr-static-2xl">{t.rich("supporting", { b: accent })}</p>
        </div>
      </div>
    </section>
  );
}
