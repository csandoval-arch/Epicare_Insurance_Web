"use client";

/**
 * @description Piezas compartidas de /join-us: el botón "Register" (CTA primario que baja al formulario del hero, por Lenis)
 * y el encabezado de sección (eyebrow + titular con Text-Birth; la animación la pone `useJoinMotion`).
 */

import type Lenis from "lenis";
import Button from "@/components/ui/Button";
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
  return <Button label={label} onClick={scrollToForm} className={className} />;
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
