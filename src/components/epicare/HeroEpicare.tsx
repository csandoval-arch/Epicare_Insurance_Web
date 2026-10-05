"use client";

/**
 * @file HeroEpicare.tsx
 * @description Hero editorial de la landing ("Go beyond growth"). Titular gigante + dos ventanas a
 * un mismo plano de vídeo + subtítulo en líneas + bloque de prueba (agentes, aseguradoras) + CTAs.
 * - Desktop (≥lg): retícula de 12 columnas. Titular en una línea a todo lo ancho; ventana grande a
 *   sangre a la izquierda; subtítulo y CTAs al centro; prueba y, a su derecha, la ventana pequeña a
 *   sangre, con los mismos límites verticales que la ventana grande (misma fila y mismo alto), así
 *   que quedan alineadas en cualquier ancho.
 * - Móvil / tablet (<lg): una columna — titular en dos líneas, subtítulo, CTAs, las dos ventanas a
 *   sangre (asimétricas) y el bloque de prueba.
 * - Acto 2 (solo desktop, pin): la ventana grande crece hasta la pantalla completa y empuja lo que
 *   tiene alrededor; cada pieza declara por qué borde con `data-push` (ver `hero/useHeroAct2.ts`).
 * Motion en `hero/useHeroEntrance.ts` (entrada) y `hero/useHeroAct2.ts` (acto 2). Colores: tokens
 * `--color-hero-*` (bimodales).
 */

import { useRef } from "react";
import WindowedVideo from "./hero/WindowedVideo";
import { HeroCtas, HeroProofContent, HeroSubtitle, useHeroTitle } from "./hero/HeroParts";
import { useHeroAct2 } from "./hero/useHeroAct2";
import { useHeroEntrance } from "./hero/useHeroEntrance";

export default function HeroEpicare() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lead, last } = useHeroTitle();

  useHeroEntrance(sectionRef);
  useHeroAct2(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full lg:min-h-screen pb-section-sm lg:pb-0 bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] overflow-hidden"
    >
      {/* Retícula editorial: 6 col (móvil) · 8 (tablet) · 12 (desktop). Sin gutter horizontal:
          las ventanas de vídeo sangran hasta el borde y el texto lleva su propio margen. */}
      <div className="grid-layout relative z-10 w-full lg:min-h-screen gap-x-0">
        {/* ── VENTANAS DE VÍDEO (capa 20) ──
            Desktop: las dos ventanas en las filas 2-3, arriba, y con el mismo alto (`lg:h-120`) →
            mismo borde superior e inferior en cualquier ancho. */}
        <div
          data-push="right"
          className="hero-visual-right z-20 w-full col-start-5 col-span-2 md:col-start-6 md:col-span-3 row-start-4 pl-static-sm mt-static-2xl lg:pl-0 lg:mt-0 lg:col-start-11 lg:col-span-2 lg:row-start-2 lg:row-span-2 lg:self-start"
        >
          <div className="w-full h-40 md:h-60 lg:h-120">
            <WindowedVideo />
          </div>
        </div>

        <div className="hero-visual-left z-20 w-full col-start-1 col-span-4 md:col-span-5 row-start-4 lg:col-start-1 lg:col-span-5 lg:row-start-2 lg:row-span-2 lg:self-start">
          <div className="w-full h-72 md:h-96 lg:h-120">
            <WindowedVideo />
          </div>
        </div>

        {/* ── TITULAR (capa 30). El `pb` deja sitio a los descendentes (y, g) dentro de la máscara de la
            entrada. Móvil: 0.25 × el tamaño del titular (17vw − 0.25rem), compensado con el mismo
            margen negativo para que el subtítulo no se mueva. ── */}
        <div
          data-push="up"
          className="hero-heading z-30 col-start-1 col-span-full row-start-1 px-gutter-sm lg:px-0 lg:pl-static-2xl pt-[12vh] pb-[calc((17vw_-_0.25rem)_*_0.25_+_0.2em)] -mb-[calc((17vw_-_0.25rem)_*_0.25)] md:mb-0 md:pb-[3vw] lg:pb-[0.2em] overflow-hidden"
        >
          <h1 className="hero-title-line text-hero-display whitespace-nowrap">
            <span className="block lg:inline">{lead}</span> <span className="block lg:inline">{last}</span>
          </h1>
        </div>

        {/* ── SUBTÍTULO + CTAs. Desktop: los CTAs se centran en el alto que queda en la columna. ── */}
        <div
          data-push="right"
          className="hero-copy z-30 col-start-1 col-span-full row-start-2 row-span-2 flex flex-col px-gutter-sm pt-static-sm md:pt-static-lg lg:px-0 lg:pt-0 lg:col-start-6 lg:col-span-2 lg:h-full lg:ml-static-xl"
        >
          <HeroSubtitle className="lg:mt-3.5" />
          <div className="flex flex-col pt-static-xl pb-static-sm md:pb-0 lg:pt-0 lg:flex-1 lg:justify-center lg:pb-static-xl">
            <HeroCtas />
          </div>
        </div>

        {/* ── BLOQUE DE PRUEBA: agentes + aseguradoras ── */}
        <div
          data-push="right"
          className="hero-proof z-30 col-start-1 col-span-full row-start-5 flex flex-col justify-start gap-static-lg px-gutter-sm pt-static-2xl lg:px-0 lg:pt-0 lg:col-start-9 lg:col-span-2 lg:row-start-2 lg:mt-6.5"
        >
          <HeroProofContent supportingClassName="lg:pr-static-2xl" />
        </div>
      </div>
    </section>
  );
}
