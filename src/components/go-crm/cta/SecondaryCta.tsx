"use client";

import ArrowUR from "@/components/icons/ArrowUR";
import { loginModalStore } from "@/lib/loginModalStore";

interface SecondaryCtaProps {
  label: string;
  /**
   * - `dark` (por defecto): sobre fondos oscuros/imagen. Píldora de cristal blanca translúcida.
   * - `light`: sobre las superficies claras del DS (bimodal). Píldora con borde y flecha en azul.
   */
  tone?: "dark" | "light";
  /** Sin `backdrop-filter` (Hardware Symphony): para capas que se escalan en móvil. Solo `dark`. */
  lite?: boolean;
  className?: string;
}

const BASE =
  "group pointer-events-auto w-fit h-[44px] pl-5 pr-1.5 rounded-full flex justify-between items-center gap-3 border text-body-sm font-medium normal-case shadow-elevation-1 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-3 active:scale-95 cursor-pointer";

const TONES = {
  dark: {
    pill: "bg-white/10 border-white/40 text-[var(--color-text-White-100)] hover:bg-white/20",
    bubble: "bg-white/10 text-[var(--color-text-White-100)]",
  },
  light: {
    pill: "bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] border-[var(--color-border-Strokes-default)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-blue)]",
    bubble: "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)]",
  },
} as const;

/**
 * @description CTA secundario de GO CRM (el mismo del header, "Más de Epicare"): píldora con borde
 * y flecha en burbuja con swap diagonal al hover. Abre el modal de login, igual que `PrimaryCta`.
 */
export default function SecondaryCta({ label, tone = "dark", lite = false, className = "" }: SecondaryCtaProps) {
  const { pill, bubble } = TONES[tone];
  const blur = tone === "dark" && !lite ? " backdrop-blur-md" : "";
  return (
    <button type="button" onClick={() => loginModalStore.open()} className={`${BASE} ${pill}${blur}${className ? ` ${className}` : ""}`}>
      <span>{label}</span>
      <span className={`relative w-static-xl h-static-xl rounded-full ${bubble} flex items-center justify-center overflow-hidden shrink-0`}>
        <ArrowUR className="absolute w-static-md h-static-md transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
        <ArrowUR className="absolute w-static-md h-static-md -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </button>
  );
}
