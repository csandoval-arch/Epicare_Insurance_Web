"use client";

import React from "react";
import gsap from "gsap";
import { GraduationCap } from "@phosphor-icons/react";
import GoHubLogo from "../GoHubLogo";
import HubTitle from "./HubTitle";
import { CONTENT_EDGE_PL } from "./layout";
import type { HubProduct } from "./types";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";

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
    className="hub-mark inline-block ml-[0.3em] w-[0.86em] h-[0.86em] align-[-0.04em] overflow-visible stroke-[var(--color-brand-blue)]"
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
    <GraduationCap weight="fill" className="mark-cap block w-[0.8em] h-[0.8em] text-[var(--color-brand-blue)] origin-center" />
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
 * Pausa el bucle de los glifos cuando `el` sale de pantalla (`.is-offscreen`, Hardware Symphony).
 * Devuelve la función de limpieza.
 */
export const observeHubLoop = (el: Element) => {
  const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
  io.observe(el);
  return () => io.disconnect();
};

/** Logo GO Hub presentado en una placa blanca (hairline + elevación del DS). */
export function HubPlaque({ className = "w-28 h-28", logoClassName = "w-20 h-20" }: { className?: string; logoClassName?: string }) {
  return (
    <div
      className={`hub-plaque ${className} rounded-xl border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] shadow-elevation-2 flex items-center justify-center`}
    >
      <GoHubLogo className={`hub-logo ${logoClassName}`} />
    </div>
  );
}

/**
 * @description Acto 1 del Bento en desktop: placa del logo + titular display-xl con los glifos de
 * producto entre el texto. Primer panel del track, con el borde izquierdo alineado al contenido de la
 * sección anterior (ver `layout.ts`).
 */
export default function HubIntro() {
  return (
    <div className={`w-[86vw] lg:w-[76vw] h-full shrink-0 flex flex-col justify-center ${CONTENT_EDGE_PL}`}>
      <HubPlaque className="w-28 h-28 mb-static-2xl" logoClassName="w-20 h-20" />
      <HubTitle className="hub-title text-display-xl whitespace-nowrap" renderMark={renderHubMark} />
    </div>
  );
}
