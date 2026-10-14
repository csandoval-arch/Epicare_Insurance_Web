"use client";

/**
 * @file AgencySolutionsEpicare.tsx
 * @description Sección del landing que promociona la página de marketing (`/solutions`).
 *
 * Paradigma: **la vitrina** — encabezado editorial con el único CTA a la derecha del subtítulo y
 * tres celdas separadas por hairlines de 1px (`gap-px`). Cero imagen, cero tarjeta de vidrio: la
 * estructura es el diseño. Es el tráiler de `/solutions` en su propio idioma, para que quien hace
 * clic reconozca la página a la que llega.
 *
 * Cierre QUEMADO (13-10-2026, dos intentos): la banda azul plana bajo las celdas ("ese bloque azul
 * no tiene gracia alguna" — el mismo rechazo que en /solutions el mismo día) y su recambio, el
 * enunciado del coste con aura difuminada ("no quiero ese mensaje todo largo"). La sección no tiene
 * bloque inferior: termina en la retícula.
 *
 * Sustituye a `ProductSpotlightEpicare variant="solutions"` (13-10-2026), cuyo paradigma queda
 * QUEMADO: tarjeta de cristal sobre ilustración isométrica + rotador numerado `01 02 03` que
 * enseñaba 1 de 3 mensajes. Su chip decía "EQUIPAMIENTO CLÍNICO" (otro producto, en español, en la
 * página inglesa) y sus dos CTA apuntaban a `#marketing` / `#technology`, anclas inexistentes en el
 * landing. En `_quarantine/epicare/`.
 *
 * Vecinas: Eppigo arriba (tarjeta de vidrio + vídeo a sangre) y AgentAgency abajo — de ahí que esta
 * no lleve ni media ni tarjeta. Sin pin: el presupuesto del landing está agotado (3/3).
 */

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, EASE_CSS, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";
import { useSnapIndex } from "@/components/solutions/useSnapIndex";
import HoloPlate, { type HoloPlateVariant } from "@/components/solutions/HoloPlate";
import SlideIndicator from "@/components/team/SlideIndicator";

interface AgencyTile {
  title: string;
  desc: string;
}

/**
 * Una ilustración holográfica por tarjeta, en el orden del diccionario (skill
 * `holographic-tech-visuals`): silueta simétrica a stroke fino con su micro-interacción, que se
 * pausa fuera de pantalla. Sustituye a los iconos de Phosphor el 13-10-2026.
 */
const TILE_ART: HoloPlateVariant[] = ["campaigns", "funnels", "material"];

/**
 * Destino del CTA: la página de marketing **por su principio**, sin ancla.
 * Con `#marketing` el `scrollToHash` de `solutions/page.tsx` cumple su trabajo y deja al visitante
 * en la sección 2 (medido: `scrollY 943` frente a `0` sin hash), saltándose el hero. Ese salto es
 * correcto para el menú del header, que apunta a una sección concreta; aquí no.
 */
const MARKETING_HREF = "/solutions";

/**
 * Superficie de tarjeta: un escalón MÁS CLARO que el fondo de la sección en los dos modos
 * (blanco sobre #F2F2F2 en claro · BG-1 sobre BG-base en oscuro). En oscuro no vale BG-black:
 * sobre la banda base quedaría más oscura, no más clara.
 */
const SURFACE = "bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)]";
const HAIRLINE = "border-[var(--color-border-Strokes-default)]";

/**
 * Alto de celda. **Reporte de Margen Creativo:** el DS no tiene tokens de altura de tarjeta, así que
 * la composición "ilustración arriba / texto abajo" necesita un mínimo declarado. En móvil, el
 * cuadrado del patrón de slider estirado a 4:5; en desktop, 24rem sobre la escala de 4px del DS.
 */
const TILE_HEIGHT = "aspect-[4/5] md:aspect-auto md:min-h-[24rem]";

/** Acento superior que se extiende al pasar por la celda (la celda es `group/tile`). */
const HOVER_RULE =
  "absolute top-0 inset-x-0 h-0.5 bg-[var(--color-brand-blue)] origin-left scale-x-0 group-hover/tile:scale-x-100 transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Flecha diagonal de las burbujas de CTA (la firma de botón del sitio). */
const ArrowUR = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

export default function AgencySolutionsEpicare() {
  const t = useTranslations("landingV2.agencySolutions");
  const tiles = t.raw("items") as AgencyTile[];
  const sectionRef = useRef<HTMLElement>(null);
  const { trackRef, onScroll, active } = useSnapIndex(tiles.length);

  // ── ENTRADA · una sola pasada, sin scrub ni pin (los vecinos ya gastan la cámara) ──
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Text-birth del encabezado: cada línea sube desde su máscara.
      gsap.fromTo(
        ".as-birth",
        { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" },
        {
          yPercent: 0,
          opacity: 1,
          duration: DUR.birth,
          ease: EASE.dramatic,
          stagger: STAGGER.base,
          force3D: true,
          clearProps: "willChange",
          scrollTrigger: { trigger: el, start: TRIGGER.late, toggleActions: "play none none reverse" },
        },
      );

      // Celdas: fade-up en cascada. `clearProps` del transform o la capa propia de cada celda
      // se come el hairline de 1px del `gap-px`.
      gsap.fromTo(
        ".as-fade",
        { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER.wave,
          force3D: true,
          clearProps: "transform,willChange",
          scrollTrigger: { trigger: el, start: TRIGGER.standard, toggleActions: "play none none reverse" },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      // La sección pinta su propia banda (el tono `BG-base` de Hero/Brands/DarkGradient/Metrics), así
      // que también paga su aire: el `pb` dejó de vivir en el envoltorio de `page.tsx` o la banda se
      // habría cortado a ras del contenido.
      className="relative w-full bg-[var(--color-surface-BG-base)] transition-colors duration-500 pt-section-sm md:pt-section-md pb-section-sm md:pb-section-md"
    >
      <div className="max-w-section-xl w-full mx-auto px-gutter-sm md:px-gutter-md flex flex-col gap-static-xl lg:gap-static-2xl">
        {/* ── ENCABEZADO · el CTA vive aquí, a la derecha del subtítulo (13-10-2026) ── */}
        <header className="flex flex-col items-start gap-static-md w-full">
          <div className="overflow-hidden">
            <p className="as-birth text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</p>
          </div>
          {/* Dos líneas dictadas, no un ancho que las provoque: cada una entra desde su máscara. */}
          <h2 className="text-display lg:text-display-lg text-[var(--color-text-primary)]">
            <span className="block overflow-hidden">
              <span className="as-birth block">{t("headlineLine1")}</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="as-birth block">{t("headlineLine2")}</span>
            </span>
          </h2>

          <div className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-static-lg">
            <p className="as-fade text-body-lg text-[var(--color-text-secondary)] max-w-2xl">{t("subhead")}</p>

            <Link
              href={MARKETING_HREF}
              className="as-fade group w-full lg:w-fit shrink-0 h-12 pl-6 pr-2 rounded-full flex items-center justify-between lg:justify-start gap-3 bg-[var(--color-brand-blue)] text-white shadow-elevation-2 transition-all duration-[450ms] hover:-translate-y-0.5 hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150"
              style={{ transitionTimingFunction: EASE_CSS.ui }}
            >
              <span className="text-body-sm font-medium">{t("cta")}</span>
              <span
                className="relative w-8 h-8 rounded-full bg-white text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0"
                aria-hidden="true"
              >
                <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
              </span>
            </Link>
          </div>
        </header>

        {/* ── LA VITRINA · tres tarjetas sueltas a 12px (13-10-2026, por petición): ya no es una
            retícula de hairlines con marco, sino tres piezas separadas que respiran. ── */}
        <div className="as-fade flex flex-col gap-3">
          {/* Móvil: slider de cuadrados · md+: tres tarjetas en fila. */}
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible"
          >
            {tiles.map((tile, i) => {
              const art = TILE_ART[i] ?? "campaigns";
              return (
                <article
                  key={tile.title}
                  className={`group/tile relative w-[80%] shrink-0 snap-start border ${HAIRLINE} md:w-auto ${SURFACE} ${TILE_HEIGHT} px-gutter-sm py-static-lg md:p-static-lg lg:p-static-xl flex flex-col justify-between gap-static-xl overflow-hidden`}
                >
                  <span className={HOVER_RULE} aria-hidden="true" />
                  <HoloPlate variant={art} />
                  <div className="flex flex-col gap-static-sm">
                    <h3 className="text-display-xs text-[var(--color-text-primary)]">{tile.title}</h3>
                    <p className="text-body text-[var(--color-text-secondary)]">{tile.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* `-mx-gutter-sm` NO existe (no hay `@utility mx-gutter-*` en globals.css, solo `px-`):
              el gutter del indicador se cancela con el token directo, como en `JoinUsHero`. */}
          <div className="md:hidden -mx-[var(--space-gutter-sm)]">
            <SlideIndicator n={tiles.length} active={active} />
          </div>

        </div>
      </div>
    </section>
  );
}
