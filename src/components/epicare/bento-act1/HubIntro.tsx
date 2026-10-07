"use client";

import React from "react";
import gsap from "gsap";
import { GraduationCap } from "@phosphor-icons/react";
import GoHubLogo from "../GoHubLogo";
import HubTitle from "./HubTitle";
import { ACT_BOX, ACT1_ON_BRAND_CLASS, ACT1_ON_BRAND_VARS, CONTENT_EDGE_PL } from "./layout";
import type { HubProduct } from "./types";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";

// ── GLIFOS · uno distinto por producto, en azul de marca, del tamaño de una letra (miden en em) ──
// Dos capas a propósito: el contenedor `.hub-mark` lo anima la ENTRADA (GSAP, una vez) y las piezas
// internas (.mark-trend · .mark-trend-head · .mark-cap) las anima el BUCLE (keyframes CSS
// en globals.css, "Glifos del acto 1": un solo ciclo en relevo vende → aprende), así ninguna
// animación pisa a la otra. Decorativos (`aria-hidden`).

/** GO CRM · vende más → una línea de tendencia que sube y remata en flecha (se redibuja en el bucle). */
const TrendMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className="hub-mark inline-block ml-[0.3em] w-[0.86em] h-[0.86em] align-[-0.04em] overflow-visible stroke-[var(--hub-glyph,var(--color-brand-blue))]"
    strokeWidth={2.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path className="mark-trend" d="M2.5 18.5 L8.5 12.5 L13 16 L21 7" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
    <path className="mark-trend-head [transform-box:fill-box] origin-top-right" d="M15 7 H21 V13" />
  </svg>
);

/** GO Academy · sigue aprendiendo → un birrete de graduación (en el bucle asiente en su sitio: leve giro + escala sobre su centro). */
const CapMark = () => (
  <span aria-hidden="true" className="hub-mark inline-block ml-[0.25em] align-[-0.06em]">
    <GraduationCap weight="fill" className="mark-cap block w-[0.8em] h-[0.8em] text-[var(--hub-glyph,var(--color-brand-blue))] origin-center" />
  </span>
);

const MARKS: Partial<Record<HubProduct, () => React.JSX.Element>> = { crm: TrendMark, academy: CapMark };

/** Pinta el glifo del producto dentro del titular. */
export const renderHubMark = (product: HubProduct) => {
  const Mark = MARKS[product];
  return Mark ? <Mark /> : null;
};

/**
 * Entrada de los glifos, acotada a `scope`: cada uno se abre en su hueco (scale + y, una vez) y, al
 * terminar, `scope` recibe `.is-live` → arranca el bucle CSS. Sin reduced-motion no se llama, así que
 * los glifos quedan quietos y visibles.
 */
export const hubMarksTimeline = (scope: Element) =>
  gsap.timeline({ onComplete: () => scope.classList.add("is-live") }).from(scope.querySelectorAll(".hub-mark"), {
    scale: 0.4,
    y: REVEAL.sm,
    opacity: 0,
    duration: DUR.fast,
    ease: EASE.dramatic,
    stagger: STAGGER.base,
  });

/**
 * Entrada del acto 1, acotada a `scope`: la placa sube, el símbolo GO Hub se arma, el titular nace por
 * líneas y los glifos se abren en su hueco (y arranca su bucle). Se dispara con el TITULAR al entrar
 * en pantalla (`TRIGGER.standard`), con tiempos cortos y solapados. Llamar dentro de un matchMedia
 * con reduced-motion "no-preference".
 */
export const playHubIntro = (scope: Element) => {
  const $ = (sel: string) => scope.querySelectorAll(sel);
  return gsap
    .timeline({ scrollTrigger: { trigger: scope.querySelector(".hub-title"), start: TRIGGER.standard, once: true } })
    .from($(".hub-plaque"), { opacity: 0, y: REVEAL.sm, duration: DUR.fast, ease: EASE.out })
    .from($(".hub-logo .gohub-shape"), {
      opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: DUR.fast, ease: EASE.dramatic, stagger: STAGGER.tight,
    }, 0)
    .from($(".hub-logo .gohub-letter"), { opacity: 0, yPercent: 40, duration: DUR.micro, ease: EASE.out, stagger: STAGGER.tight }, "<0.15")
    .from($(".hub-title .hub-line"), { yPercent: REVEAL.birthPercent, duration: DUR.base, ease: EASE.dramatic, stagger: STAGGER.base }, 0.1)
    .add(hubMarksTimeline(scope), 0.45);
};

/**
 * Pausa el bucle de los glifos cuando `el` sale de pantalla (`.is-offscreen`, Hardware Symphony).
 * Devuelve la función de limpieza.
 */
export const observeHubLoop = (el: Element) => {
  const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
  io.observe(el);
  return () => io.disconnect();
};

/** Logo GO Hub en un recuadro solo con stroke (hairline del DS, sin fondo ni sombra). */
export function HubPlaque({ className = "w-28 h-28", logoClassName = "w-20 h-20", radiusClass = "rounded-xl" }: { className?: string; logoClassName?: string; radiusClass?: string }) {
  return (
    <div
      className={`hub-plaque ${className} ${radiusClass} border border-[var(--act1-line,var(--color-border-Strokes-default))] flex items-center justify-center`}
    >
      <GoHubLogo className={`hub-logo ${logoClassName}`} />
    </div>
  );
}

/**
 * @description Acto 1 del Bento en desktop: caja con stroke que enmarca la placa del logo + titular display-xl con los glifos de
 * producto entre el texto. Primer panel del track, con el borde izquierdo alineado al contenido de la
 * sección anterior (ver `layout.ts`).
 */
/** Producto que sigue en el track, para su mini-ficha al pie del acto 1. */
export interface HubNextProduct {
  key: string;
  title: string;
}

export default function HubIntro({
  products = [],
  onNavigate,
}: {
  /** Productos que siguen en el track (mini-fichas al pie de la caja). */
  products?: HubNextProduct[];
  /** Lleva el scroll hasta el producto i. */
  onNavigate?: (i: number) => void;
}) {
  return (
    <div className={`w-max h-full shrink-0 flex flex-col justify-center ${CONTENT_EDGE_PL}`}>
      {/* Caja con stroke (hairline del DS) que enmarca el acto 1; mismo alto que las tarjetas (75vh) */}
      <div className={`w-[70vw] lg:w-[50vw] flex flex-col p-static-2xl ${ACT_BOX} ${ACT1_ON_BRAND_CLASS}`} style={ACT1_ON_BRAND_VARS}>
        <div className="flex-1 flex flex-col justify-center">
          <HubPlaque className="w-40 h-20 mb-static-2xl" logoClassName="w-14 h-14" radiusClass="rounded-md" />
          <HubTitle className="hub-title text-display-lg" renderMark={renderHubMark} />
        </div>
        {/* Lo que viene: tres mini-fichas en fila, solo con el nombre (mismo lenguaje que las cajas: hairline
            + radio); hover = borde azul + nombre en primario + leve subida; clic = ir a ese acto */}
        {products.length > 0 && (
          <div className="grid grid-cols-3 gap-static-md">
            {products.map(({ key, title }, i) => (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate?.(i)}
                className="group h-static-2xl px-static-md flex items-center rounded-lg border border-[var(--act1-line,var(--color-border-Strokes-default))] bg-[var(--act1-tile,var(--color-surface-BG-white))] dark:bg-[var(--act1-tile,var(--color-surface-BG-1))] transition-[translate,border-color] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--act1-ink,var(--color-brand-blue))]"
              >
                <span className="text-ui-label text-[var(--act1-ink-soft,var(--color-text-secondary))] transition-colors group-hover:text-[var(--act1-ink,var(--color-text-primary))]">{title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
