/**
 * @description Ficha de una etapa del caso: retrato clay a sangre (4:5) con la información en vidrio.
 * Jerarquía (de más a menos): 1 · la etapa (titular grande) · 2 · su frase · 3 · el frente (chip
 * pequeño arriba, sentence case) · 4 · el número de etapa (mono, discreto). La ficha del agente lleva el
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
  index: number;
  agent?: boolean;
  className?: string;
}

/** Copia desenfocada del retrato, del tamaño de la ficha, desplazada al hueco del panel (que está a 1rem del borde). */
const BLUR_LAYER: CSSProperties = { left: "-1rem", bottom: "-1rem", width: "100cqw", height: "125cqw" };
const BLUR_IMG: CSSProperties = { filter: "blur(20px) saturate(1.3)", transform: "scale(1.06)" };

export default function GlassCard({ stage, card, index, agent = false, className = "" }: Props) {
  const src = asset(card.src);
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className={`@container relative block aspect-[4/5] overflow-hidden rounded-xl bg-[var(--color-surface-BG-2)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza */}
      <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} width={800} height={800} className="absolute inset-0 h-full w-full object-cover object-top select-none" />

      {/* Arriba: el frente (chip) y el número de etapa */}
      <div className="gc-chip absolute inset-x-static-md top-static-md flex items-center justify-between">
        <span
          className={`h-static-xl px-static-md rounded-full inline-flex items-center text-meta border ${
            agent
              ? "bg-[var(--color-brand-blue)] border-[var(--color-brand-blue)] text-[var(--color-text-White-100)]"
              : "bg-[var(--color-text-White-100)]/80 border-[var(--color-text-White-100)] text-[var(--color-text-Black-100)]"
          }`}
        >
          {stage.front}
        </span>
        <span className="text-data text-[var(--color-text-Black-100)]/50">{num}</span>
      </div>

      {/* Abajo: el panel de vidrio con la etapa y su frase */}
      <div
        className={`gc-panel absolute inset-x-static-md bottom-static-md overflow-hidden rounded-lg border ${
          agent ? "border-[var(--color-text-White-100)]/40" : "border-[var(--color-text-White-100)]/70"
        }`}
      >
        <span aria-hidden="true" className="absolute" style={BLUR_LAYER}>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza */}
          <img src={src} alt="" loading="lazy" decoding="async" draggable={false} width={800} height={800} className="h-full w-full object-cover object-top select-none" style={BLUR_IMG} />
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 ${agent ? "bg-[color-mix(in_srgb,var(--color-brand-blue)_72%,transparent)]" : "bg-[var(--color-text-White-100)]/62"}`}
        />
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[var(--color-text-White-100)]" />
        <div className={`relative flex flex-col gap-static-sm p-static-lg ${agent ? "text-[var(--color-text-White-100)]" : "text-[var(--color-text-Black-100)]"}`}>
          <h3 className="text-display-sm">{stage.name}</h3>
          <p className={`text-body-md ${agent ? "text-[var(--color-text-White-100)]" : "text-[var(--color-text-Black-100)]/70"}`}>{stage.line}</p>
        </div>
      </div>
    </article>
  );
}
