"use client";

import ArrowUR from "@/components/icons/ArrowUR";
import { loginModalStore } from "@/lib/loginModalStore";

interface SecondaryCtaProps {
  label: string;
  /** Sin `backdrop-filter` (Hardware Symphony): para capas que se escalan en móvil. */
  lite?: boolean;
  className?: string;
}

/**
 * @description CTA secundario de Epicare (el mismo del header, "Más de Epicare") en su variante
 * sobre fondo oscuro: píldora de cristal con borde y flecha en burbuja con swap diagonal al hover.
 * Abre el modal de login, igual que el CTA principal del Hero.
 */
export default function SecondaryCta({ label, lite = false, className = "" }: SecondaryCtaProps) {
  return (
    <button
      type="button"
      onClick={() => loginModalStore.open()}
      className={`group pointer-events-auto w-fit h-[44px] pl-5 pr-1.5 rounded-full flex justify-between items-center gap-3 border text-body-sm font-medium normal-case shadow-elevation-1 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-3 active:scale-95 bg-white/10 border-white/40 text-[var(--color-text-White-100)] hover:bg-white/20 cursor-pointer${lite ? "" : " backdrop-blur-md"}${className ? ` ${className}` : ""}`}
    >
      <span>{label}</span>
      <span className="relative w-static-xl h-static-xl rounded-full bg-white/10 text-[var(--color-text-White-100)] flex items-center justify-center overflow-hidden shrink-0">
        <ArrowUR className="absolute w-static-md h-static-md transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
        <ArrowUR className="absolute w-static-md h-static-md -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </button>
  );
}
