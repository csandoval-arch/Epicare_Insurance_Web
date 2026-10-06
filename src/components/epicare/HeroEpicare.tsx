"use client";

/**
 * @file HeroEpicare.tsx
 * @description Hero "corte arquitectónico" de la landing (restaurado el 2026-10-05 desde 60de207 y
 * refactorizado): columna vertical de vídeo y el titular gigante cruzándola ("VE MÁS / ALLÁ DEL /
 * CRECIMIENTO." · "GO / BEYOND / GROWTH."). Todas las palabras pasan por delante del vídeo (z-30)
 * y donde lo cruzan se leen en blanco.
 * - Bimodal: fondo `--color-surface-BG-base` (token del DS), texto `--color-hero-ink` (se invierten en dark).
 * - Texto sobre el vídeo SIEMPRE blanco: una copia del titular (`.hero-cut-layer`) recortada a la
 *   columna con `clip-path`, recalculada en cada frame junto con la columna.
 * - Móvil (<md): la columna es una franja a sangre a la derecha, el titular va apilado y los CTAs
 *   quedan a su izquierda; sin pin.
 * Motion en `hero/useHeroMotion.ts` (entrada + acto 2); geometría de la columna en `hero/geometry.ts`.
 */

import React, { useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "./I18nProviderClient";
import { asset } from "@/lib/asset";
import { columnCssVars } from "./hero/geometry";
import { useHeroMotion } from "./hero/useHeroMotion";

const ArrowUR = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

/** Destinos de los CTAs del hero. */
const HERO_LINKS = { primary: "/contrato", secondary: "/go-ams" } as const;
/** Retratos del bloque "100+ agentes activos" (decorativos). */
const AGENT_AVATARS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
] as const;
/** Avatar del bloque de prueba (retrato o contador), con el borde del color del fondo. */
const AVATAR = "w-static-2xl h-static-2xl rounded-full border-3 border-[var(--color-surface-BG-base)] relative";

// ── VALORES FUERA DE TOKEN (margen creativo declarado; el diseño original aprobado) ──
/**
 * Tamaño del titular (`--title-fs`, en el contenedor): 13vw en móvil (apilado), 9.5vw en desktop con
 * tope de 130px. Como variable para que el subtítulo se coloque justo debajo de la última línea.
 */
const TITLE_SIZE = "text-[length:var(--title-fs)]";
// Mayúsculas solo en desktop: en móvil/tablet el titular va en minúsculas normales (lectura más amable).
const TITLE_CLASS = `${TITLE_SIZE} lg:uppercase font-bold leading-[1.05] tracking-[-0.04em] whitespace-nowrap`;
/** Posiciones desktop del titular (ES / EN), del diseño original. */
const TITLE_POS = {
  // left: el mismo en los dos. right: gap SIMÉTRICO alrededor de la columna de vídeo — la palabra derecha
  // empieza a la misma distancia del borde derecho del vídeo que la izquierda termina del izquierdo:
  // right = (col-l + col-w) + (col-l − (title-l + ancho de la palabra izquierda)). El ancho es
  // proporcional al tamaño del titular: "Ve" = 1.2335 × title-fs, "Go" = 1.4035 × (medido). Si cambia el
  // texto de la palabra izquierda, re-medir.
  es: { left: "17.666vw", right: "calc(2 * var(--col-l) + var(--col-w) - var(--title-l) - 1.2335 * var(--title-fs))" },
  en: { left: "17.666vw", right: "calc(2 * var(--col-l) + var(--col-w) - var(--title-l) - 1.4035 * var(--title-fs))" },
} as const;
const ARROW = "absolute w-4 h-4 transition-transform duration-300 ease-out";
const CTA_BASE =
  "hero-cta group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 transition-[translate,scale,box-shadow,background-color] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.96]";

/**
 * Línea del titular dentro de su máscara (text-birth). El `pt`/`-mt` deja sitio a las tildes (Á) y el
 * `pr`/`-mr` al trazo de la última letra: con el tracking negativo (−0.04em) la caja acaba antes que la
 * curva de la "O" y la máscara la recortaba. Los márgenes negativos compensan: nada se mueve.
 */
function TitleLine({ children }: { children: ReactNode }) {
  return (
    <span className="block w-fit overflow-hidden pt-[0.15em] -mt-[0.15em] pr-[0.1em] -mr-[0.1em]">
      <span className="hero-title-line block">{children}</span>
    </span>
  );
}

function CtaArrows() {
  return (
    <>
      <ArrowUR className={`${ARROW} group-hover:translate-x-5 group-hover:-translate-y-5`} />
      <ArrowUR className={`${ARROW} -translate-x-5 translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0`} />
    </>
  );
}

function HeroStage({ isEn }: { isEn: boolean }) {
  const t = useTranslations("landingV2.hero");
  const rootRef = useRef<HTMLDivElement>(null);
  useHeroMotion(rootRef, isEn);

  const title = t.raw("cutTitle") as string[];
  const subtitle = t.raw("subtitle") as string[];
  const pos = isEn ? TITLE_POS.en : TITLE_POS.es;
  const agentsLabel = t.raw("agentsLabel") as string[];
  // Acentos en el azul de marca (un solo azul en todo el hero).
  const accent = (chunks: ReactNode) => <span className="text-[var(--color-brand-blue)]">{chunks}</span>;

  const vars = {
    ...columnCssVars(isEn),
    "--title-l": pos.left,
    "--title-r": pos.right,
  } as CSSProperties;

  /**
   * Las palabras del titular. `cut` = la copia blanca recortada a la columna (todas pasan por delante
   * del vídeo y ahí se leen en blanco), con el overline invisible para mantener la caja.
   * Móvil/tablet (<lg): en flujo, apiladas (overline, línea 1, línea 2, línea 3). Desktop: posicionadas
   * sobre la retícula, ancla vertical `--a` (45 % menos el ajuste por idioma).
   */
  const titleWords = (cut: boolean) => (
    <>
      <div className="hero-act-left relative lg:absolute z-30 lg:top-[var(--a)] lg:-translate-y-full lg:left-[var(--title-l)] flex flex-col items-start gap-3 lg:gap-4">
        <div className={`hero-overline flex items-center font-mono text-[9px] lg:text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-blue)] ${cut ? "invisible" : ""}`}>
          {t("cutOverline")}
          <sup className="ml-1 text-[13px] lg:text-[15px] -translate-y-0.5 font-body">&reg;</sup>
        </div>
        <TitleLine>{title[0]}</TitleLine>
      </div>

      {/* Palabra derecha (BEYOND / ALLÁ DEL): por delante del vídeo, como las demás (también en la copia
          blanca). Posición desktop: --title-r (ajustable por idioma en globals.css). */}
      <div className="hero-act-right hero-title-r relative lg:absolute z-30 lg:top-[var(--a)] lg:-translate-y-full lg:left-[var(--title-r)]">
        <TitleLine>{title[1]}</TitleLine>
      </div>

      <div className="hero-act-left relative lg:absolute z-30 lg:top-[var(--a)] lg:left-[var(--title-l)]">
        <TitleLine>{title[2]}</TitleLine>
      </div>

    </>
  );

  /** Subtítulo pequeño, pieza propia de la sección (fuera del h1). `cut` = su copia blanca. */
  const taglineBlock = (cut = false) => (
    <>
      {/* Subtítulo pequeño, pieza propia de la sección (no del titular): por defecto bajo la última
          línea del titular y alineado con él. Desktop una línea por entrada; móvil corrido. */}
      <div className="hero-act-left hero-tagline relative lg:absolute z-30 order-2 px-[var(--space-gutter-sm)] lg:px-0 mt-static-lg md:mt-static-xl lg:mt-0 lg:left-[var(--title-l)] lg:top-[calc(var(--a)_+_1.05_*_var(--title-fs)_+_var(--spacing-static-xl))]">
        <p className="hero-tagline-text max-w-[22rem] md:max-w-[30rem] lg:max-w-none text-h3 md:text-h1 lg:text-display-sm max-lg:[font-family:var(--font-body-stack)] max-lg:font-medium max-lg:tracking-tight normal-case whitespace-normal">
          {subtitle.map((line) => (
            <React.Fragment key={line}>
              <span className="hero-tagline-line inline-block lg:block">{line}</span>{" "}
            </React.Fragment>
          ))}
        </p>
        {/* ── INDICADOR DE SCROLL (desktop) ── flecha fina con el pie alineado al del subtítulo ("el éxito."),
            a la izquierda de la columna de vídeo con el mismo gap (2rem) que el bloque de prueba a su
            derecha (el subtítulo empieza 2rem dentro de la columna → 4rem a la izquierda). Se revela con
            máscara: entra por arriba, se detiene y sale por abajo (recortada por su caja). */}
        {!cut && (
          <div
            className="hero-scroll-badge absolute bottom-0 left-[calc(-2_*_var(--spacing-static-xl))] -translate-x-full hidden lg:block text-[var(--color-hero-ink)]"
            aria-hidden="true"
          >
            <div className="hero-scroll-badge-inner relative w-3 h-14 overflow-hidden">
              <svg width="12" height="56" viewBox="0 0 12 56" fill="none" stroke="currentColor" className="hero-scroll-arrow absolute inset-0">
                <path d="M6 0V54M6 54L1 48M6 54L11 48" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      ref={rootRef}
      style={vars}
      data-locale={isEn ? "en" : "es"}
      className="hero-root relative w-full flex flex-col lg:block pt-32 md:pt-40 pb-section-sm lg:p-0 lg:h-screen lg:min-h-[700px] lg:[--a:45%] [--title-fs:15vw] md:[--title-fs:11vw] lg:[--title-fs:9.5vw] xl:[--title-fs:130px] overflow-clip bg-[var(--color-surface-BG-base)] text-[var(--color-hero-ink)] transition-colors duration-500"
    >
      {/* ── COLUMNA DE VÍDEO ── marco (escala en el acto 2) → plano a tamaño de la sección (inversa) */}
      <div
        className="hero-col hero-band relative order-3 mt-static-2xl md:mt-section-xs w-full aspect-[4/5] max-h-[70svh] md:aspect-[16/10] lg:aspect-auto lg:max-h-none lg:mt-0 lg:absolute lg:inset-y-0 lg:left-[var(--col-l)] lg:w-[var(--col-w)] z-20 overflow-clip bg-black lg:shadow-2xl origin-center lg:origin-top-left"
        aria-hidden="true"
      >
        <div className="hero-col-plane absolute top-0 left-0 w-screen h-full origin-top-left">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={asset("/Files/Epicare_Landing/Hero/posters/Hero_02.webp")}
            className="hero-band-video absolute inset-0 w-full h-full object-cover scale-[1.1] lg:scale-[1.05]"
          >
            <source src={asset("/Files/Epicare_Landing/Hero/Hero_02.mp4")} type="video/mp4" />
          </video>
        </div>
        {/* Profundidad y tinte azul dentro del corte (se apagan en el acto 2) */}
        <div className="hero-col-shade absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
        <div className="hero-col-shade absolute inset-0 bg-[var(--color-brand-blue)]/10 mix-blend-color pointer-events-none" />
      </div>

      {/* ── TITULAR (color del tema) ── */}
      <h1 className={`relative order-1 px-[var(--space-gutter-sm)] lg:px-0 lg:absolute lg:inset-0 pointer-events-none font-display ${TITLE_CLASS}`}>{titleWords(false)}</h1>
      {taglineBlock()}

      {/* ── COPIA BLANCA recortada a la columna: el texto que cruza el vídeo se lee siempre en blanco ── */}
      <div
        aria-hidden="true"
        className={`hero-cut-layer hidden lg:block absolute inset-0 z-[35] pointer-events-none font-display text-white ${TITLE_CLASS} [clip-path:inset(0_calc(100%_-_var(--col-l)_-_var(--col-w))_0_var(--col-l))]`}
      >
        {titleWords(true)}
        {taglineBlock(true)}
      </div>

      {/* ── PRUEBA SOCIAL + CTAs ── (posición en globals.css: .hero-cta-block) */}
      <div className="hero-act-right hero-cta-block relative order-4 lg:absolute z-30 flex flex-col md:flex-row lg:flex-col md:items-start lg:items-start md:justify-between gap-static-xl md:gap-fluid-sm lg:gap-5 px-[var(--space-gutter-sm)] lg:px-0 mt-static-2xl lg:mt-0 lg:w-full lg:max-w-[380px]">
        {/* Prueba social = la de la versión "Go beyond growth" (2026-10-05): retratos + contador "100+" con
            borde del color del fondo, etiqueta "Agentes activos" y el mensaje en text-h3 con los acentos en el
            azul de marca. Si la fila no cabe (<14rem), la etiqueta baja bajo los avatares en una línea. */}
        <div className="hero-proof flex flex-col gap-static-lg md:max-w-[26rem] lg:max-w-none">
          <div className="@container flex flex-wrap items-center gap-3 lg:pr-static-md">
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
            <p className="text-caption font-medium leading-tight opacity-80 @max-[14rem]:basis-full">
              {agentsLabel.map((line, i) => (
                <span key={line} className="block @max-[14rem]:inline">
                  {line}
                  {i < agentsLabel.length - 1 ? " " : null}
                </span>
              ))}
            </p>
          </div>

          <p className="hero-proof-text text-h3 font-medium opacity-80">{t.rich("supporting", { b: accent })}</p>
        </div>

        <div className="hero-ctas flex flex-col items-start gap-static-md shrink-0">
          <Link href={HERO_LINKS.primary} className={`${CTA_BASE} bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 hover:shadow-elevation-4`}>
            <span className="text-body-sm font-medium whitespace-nowrap">{t("ctaPrimary")}</span>
            <span className="relative w-8 h-8 rounded-full bg-[var(--color-action-primary-text)] text-[var(--color-action-primary-bg)] flex items-center justify-center overflow-hidden shrink-0">
              <CtaArrows />
            </span>
          </Link>
          <Link href={HERO_LINKS.secondary} className={`${CTA_BASE} bg-[var(--color-hero-ink)]/5 border border-[var(--color-hero-ink)]/20 text-[var(--color-hero-ink)] shadow-elevation-1 hover:bg-[var(--color-hero-ink)]/10`}>
            <span className="text-body-sm font-medium whitespace-nowrap">{t("ctaSecondary")}</span>
            <span className="relative w-8 h-8 rounded-full bg-[var(--color-hero-ink)] text-[var(--color-hero-ivory)] flex items-center justify-center overflow-hidden shrink-0">
              <CtaArrows />
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function HeroEpicare() {
  const { locale } = useLocale();
  // `key`: al cambiar de idioma se remonta entero (geometría ES/EN distinta) y GSAP arranca limpio.
  return <HeroStage key={locale} isEn={locale === "en"} />;
}
