"use client";

import ArrowUR from "@/components/icons/ArrowUR";
import { loginModalStore } from "@/lib/loginModalStore";

/**
 * @description CTA primario de GO CRM (el del Hero): píldora azul con flecha en burbuja blanca y
 * swap diagonal al hover. Abre el modal de login. Se usa en los momentos grandes de la página
 * (Hero, Métricas); el resto de puntos de conversión usa `SecondaryCta`.
 */
export default function PrimaryCta({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => loginModalStore.open()}
      className={`group w-fit min-w-[220px] md:min-w-0 h-static-2xl pl-static-lg pr-static-sm rounded-full flex justify-between md:justify-start items-center gap-3 bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150 cursor-pointer${className ? ` ${className}` : ""}`}
    >
      <span className="text-body-sm font-medium">{label}</span>
      <span className="relative w-static-xl h-static-xl rounded-full bg-[var(--color-surface-BG-white)] text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
        <ArrowUR className="absolute w-static-md h-static-md transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
        <ArrowUR className="absolute w-static-md h-static-md -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </button>
  );
}
