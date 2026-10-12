"use client";

/**
 * @description Piezas compartidas de /join-us: el botón "Register" (CTA primario que baja al formulario del hero, por Lenis)
 * y el encabezado de sección (eyebrow + titular con Text-Birth; la animación la pone `useJoinMotion`).
 */

import type Lenis from "lenis";
import ArrowUR from "@/components/icons/ArrowUR";
import { JOIN_FORM_ID } from "../joinUsData";

/** Margen sobre el formulario al llegar (deja sitio al header en píldora). */
const FORM_OFFSET_VH = 0.12;

/** Por Lenis: `scrollIntoView`/`window.scrollTo` con smooth pelean con él. */
export function scrollToForm() {
  const target = document.getElementById(JOIN_FORM_ID);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - window.innerHeight * FORM_OFFSET_VH;
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/**
 * "Register": CTA Primario oficial de marca (píldora azul con burbuja blanca y swap diagonal de flecha en hover).
 * Conecta directamente al formulario de registro en el Hero.
 */
export function RegisterCta({ label, className = "" }: { label: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <button
      type="button"
      onClick={scrollToForm}
      className={`group w-fit h-static-2xl pl-static-lg pr-static-sm rounded-full flex items-center gap-3 bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150 cursor-pointer ${className}`}
    >
      <span className="text-body-sm font-medium">{label}</span>
      <span className="relative w-static-xl h-static-xl rounded-full bg-[var(--color-surface-BG-white)] text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
        <ArrowUR className="absolute w-static-md h-static-md transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
        <ArrowUR className="absolute w-static-md h-static-md -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </button>
  );
}

export function SectionTitle({ eyebrow, title, inverse = false, className = "" }: { eyebrow: string; title: string; inverse?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col gap-static-md ${className}`}>
      <span className="block overflow-hidden">
        <span className={`jb-birth block text-overline ${inverse ? "text-[var(--color-text-White-100)]/80" : "text-[var(--color-text-accent-blue)]"}`}>{eyebrow}</span>
      </span>
      <h2 className="text-display lg:text-display-lg">
        <span className="block overflow-hidden pb-static-xs">
          <span className="jb-birth block">{title}</span>
        </span>
      </h2>
    </div>
  );
}
