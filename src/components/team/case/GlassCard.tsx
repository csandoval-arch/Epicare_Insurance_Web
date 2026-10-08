/**
 * @description Ficha de una etapa del caso: retrato clay a sangre (4:5) con la información en vidrio.
 * Jerarquía (de más a menos): 1 · la etapa (titular grande) · 2 · su frase · 3 · el frente (chip
 * pequeño arriba, sentence case). Sin número de etapa (el usuario lo quitó). La ficha del agente lleva el
 * vidrio teñido de azul: es el protagonista.
 *
 * VIDRIO OPTIMIZADO PARA GPU (Hardware Symphony): sin `backdrop-filter` (se recalcula en cada frame al
 * mover la ficha en 3D). Dentro del panel va una copia del retrato ya desenfocada y alineada con el de
 * fondo (mide el ancho de la ficha con unidades de contenedor `cqw`), recortada por el propio panel.
 * Se rasteriza una vez; el carrusel solo mueve la capa de la ficha (transform/opacity).
 * Clases `.gc-panel` / `.gc-chip`: el carrusel las muestra solo en la ficha activa.
 *
 * MARGEN CREATIVO declarado: desenfoque, tinte y brillo del vidrio son valores de composición.
 */

import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";
import type { CaseStage, StageCard } from "./caseData";

interface Props {
  stage: CaseStage;
  card: StageCard;
  agent?: boolean;
  /** A sangre: sin esquinas redondeadas (hero móvil). */
  bleed?: boolean;
  /** Ficha pequeña: vidrio más cerca de los bordes (0.5rem en vez de 1rem), menos padding y texto un paso menor. */
  tight?: boolean;
  className?: string;
}

/** Copia desenfocada del retrato, del tamaño de la ficha, desplazada al hueco del panel (a `inset` del borde). */
const blurLayer = (inset: string): CSSProperties => ({ left: `-${inset}`, bottom: `-${inset}`, width: "100cqw", height: "125cqw" });
const BLUR_LAYER = blurLayer("var(--spacing-static-md)");
const BLUR_LAYER_TIGHT = blurLayer("var(--spacing-static-sm)");
const BLUR_IMG: CSSProperties = { filter: "blur(20px) saturate(1.3)", transform: "scale(1.06)" };

export default function GlassCard({ stage, card, agent = false, bleed = false, tight = false, className = "" }: Props) {
  const src = asset(card.src);
  const inset = tight ? "inset-x-static-sm" : "inset-x-static-md";

  return (
    <article className={`@container relative block aspect-[4/5] overflow-hidden ${bleed ? "" : "rounded-xl"} bg-[var(--color-surface-BG-2)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza */}
      <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} width={800} height={800} className="absolute inset-0 h-full w-full object-cover object-top select-none" />

      {/* Arriba: el frente (chip) */}
      <div className={`gc-chip absolute ${inset} ${tight ? "top-static-sm" : "top-static-md"} flex items-center`}>
        <span
          className={`h-static-xl px-static-md rounded-full inline-flex items-center text-meta border ${
            agent
              ? "bg-[var(--color-brand-blue)] border-[var(--color-brand-blue)] text-[var(--color-text-White-100)]"
              : "bg-[var(--color-text-White-100)]/80 border-[var(--color-text-White-100)] text-[var(--color-text-Black-100)]"
          }`}
        >
          {stage.front}
        </span>
      </div>

      {/* Abajo: el panel de vidrio con la etapa y su frase */}
      <div
        className={`gc-panel absolute ${inset} ${tight ? "bottom-static-sm" : "bottom-static-md"} overflow-hidden rounded-lg border ${
          agent ? "border-[var(--color-text-White-100)]/40" : "border-[var(--color-text-White-100)]/70"
        }`}
      >
        <span aria-hidden="true" className="absolute" style={tight ? BLUR_LAYER_TIGHT : BLUR_LAYER}>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza */}
          <img src={src} alt="" loading="lazy" decoding="async" draggable={false} width={800} height={800} className="h-full w-full object-cover object-top select-none" style={BLUR_IMG} />
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 ${agent ? "bg-[color-mix(in_srgb,var(--color-brand-blue)_72%,transparent)]" : "bg-[var(--color-text-White-100)]/62"}`}
        />
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[var(--color-text-White-100)]" />
        <div className={`relative flex flex-col gap-static-sm ${tight ? "p-static-md" : "p-static-lg"} ${agent ? "text-[var(--color-text-White-100)]" : "text-[var(--color-text-Black-100)]"}`}>
          <h3 className={tight ? "text-h3" : "text-display-sm"}>{stage.name}</h3>
          <p className={`${tight ? "text-body-sm" : "text-body-md"} ${agent ? "text-[var(--color-text-White-100)]" : "text-[var(--color-text-Black-100)]/70"}`}>{stage.line}</p>
        </div>
      </div>
    </article>
  );
}
