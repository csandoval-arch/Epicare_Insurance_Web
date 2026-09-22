/**
 * @description Tarjeta de feature de "Conversaciones" (llamadas · documentos · mensajes
 * automáticos) con su ilustración holográfica. Las clases `.conv-*` las animan los keyframes CSS
 * de `ConversationsGoCrm` (compositor: solo transform/opacity).
 * - `float`: desktop, flotando sobre el vídeo con cristal (backdrop-blur). El posicionamiento
 *   (`absolute` + coordenadas) llega por `className`: la base no declara `position` para no pisarlo.
 * - `slide`: móvil, dentro del slider bajo el vídeo. Cuadrada y compacta (más chica que el vídeo):
 *   solo icono + título, sin subtítulo. Fondo sólido, SIN backdrop-filter: detrás no hay nada que
 *   desenfocar y el blur sobre un vídeo se recalculaba en cada frame (Hardware Symphony).
 */

import type { ReactNode } from "react";

export interface ConvCopy {
  title: string;
  desc: string;
}

const Rings = () => (
  <>
    <div className="conv-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
    <div className="conv-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
  </>
);

const ICON = "conv-svg w-7 h-7 relative z-10";
const STROKE = { fill: "none", stroke: "white", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Llamadas: teléfono + nodo que late. */
const CallArt = () => (
  <>
    <svg viewBox="0 0 24 24" className={ICON} {...STROKE}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
    <div className="conv-node absolute w-static-sm h-static-sm bg-white rounded-full z-20 top-1 right-1 shadow-[0_0_8px_rgba(255,255,255,1)]" />
  </>
);

/** Documentos: hoja + línea de escaneo. */
const DocArt = () => (
  <>
    <svg viewBox="0 0 24 24" className={ICON} {...STROKE}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="11" y2="9" />
    </svg>
    <div className="conv-scanner absolute w-6 h-px bg-white z-20 shadow-[0_0_8px_rgba(255,255,255,1)]" />
  </>
);

/** Mensajes automáticos: reloj + campana. */
const AutoArt = () => (
  <>
    <svg viewBox="0 0 24 24" className={`${ICON} overflow-visible`} {...STROKE}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="12" x2="12" y2="6" />
      <line x1="12" y1="12" x2="16" y2="14" />
      <circle cx="16" cy="14" r="1.5" fill="white" stroke="none" />
    </svg>
    <div className="absolute top-0 right-0 z-20 w-static-md h-static-md bg-[var(--color-brand-blue)] rounded-full border border-white/30 flex items-center justify-center shadow-[0_0_8px_var(--color-brand-blue)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    </div>
  </>
);

const ARTS: (() => ReactNode)[] = [CallArt, DocArt, AutoArt];

interface ConvCardProps {
  copy: ConvCopy;
  index: number;
  variant: "float" | "slide";
  /** Esquina donde va el punto de acento (desktop: hacia el vídeo). */
  dot?: "left" | "right";
  className?: string;
}

export default function ConvCard({ copy, index, variant, dot = "right", className = "" }: ConvCardProps) {
  const Art = ARTS[index];
  const surface =
    variant === "float"
      ? "bg-[var(--color-brand-blue)]/50 backdrop-blur-[32px] saturate-150 shadow-elevation-4"
      : "relative aspect-square flex flex-col justify-between bg-[var(--color-brand-blue)] shadow-elevation-2";
  const isSlide = variant === "slide";

  return (
    <div className={`${surface} border border-white/20 rounded ${isSlide ? "p-static-md" : "p-static-lg"} ${className}`}>
      {/* Punto de acento en la esquina (solo desktop, en las flotantes) */}
      {!isSlide && (
        <div
          aria-hidden="true"
          className={`absolute -top-[3px] ${dot === "left" ? "-left-[3px]" : "-right-[3px]"} w-static-sm h-static-sm rounded-full bg-[var(--color-brand-blue)] shadow-[0_0_8px_var(--color-brand-blue)]`}
        />
      )}

      <div className={`flex items-start justify-between ${isSlide ? "" : "border-b border-white/20 pb-static-md mb-static-md"}`} aria-hidden="true">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute w-static-xl h-static-xl bg-white/10 blur-[10px] rounded-full" />
          <Rings />
          <Art />
        </div>
      </div>
      <h3 className={`text-body-md font-bold text-[var(--color-text-White-100)] leading-snug ${isSlide ? "" : "mb-static-sm"}`}>{copy.title}</h3>
      {!isSlide && <p className="text-body-sm text-[var(--color-text-White-100)] leading-relaxed">{copy.desc}</p>}
    </div>
  );
}
