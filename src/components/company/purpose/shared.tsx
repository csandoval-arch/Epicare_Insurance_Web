"use client";

import { asset } from "@/lib/asset";
import SmartVideo from "@/components/epicare/SmartVideo";

// ── MAPA ──
export const MAP_SRC = "/Files/About_Company/Pins_fading_on_US_map_20260929131832.mp4";
/** Blend bimodal del mapa: el vídeo trae su fondo beige horneado y se elimina igual en los dos temas.
 *  - Light: brillo 0.9 + contraste 1.6 lleva su fondo a blanco (MÁS CLARO que el marfil) sin aclarar
 *    los puntos, y se funde en `darken` (gana el más oscuro): el fondo desaparece, puntos y pins quedan.
 *  - Dark: se invierte (hue-rotate mantiene los pins azules), se oscurece hasta quedar MÁS OSCURO que
 *    el marfil oscuro y se funde en `lighten` (gana el más claro); el propio vídeo va al 80%.
 *  Opacidad, máscara y escala van SIEMPRE en el vídeo: en un contenedor aislarían el blend (franja).
 *  Si el vídeo queda dentro de un elemento pineado, ese elemento debe llevar el fondo marfil. */
export const MAP_BLEND =
  "[filter:brightness(0.9)_contrast(1.6)] mix-blend-darken dark:opacity-80 dark:[filter:invert(1)_hue-rotate(180deg)_brightness(0.6)] dark:mix-blend-lighten";

/** Vídeo del mapa con el blend bimodal. `className` añade tamaño/posición y la clase que anima GSAP. */
export function MapVideo({ className = "", zoom }: { className?: string; zoom?: number }) {
  return (
    <SmartVideo
      src={asset(MAP_SRC)}
      className={`${className} ${MAP_BLEND}`}
      data-zoom={zoom}
      style={zoom && zoom !== 1 ? { scale: String(zoom) } : undefined}
    />
  );
}

// ── PANELES DE TEXTO (desktop) ──
export const PANEL_COPY = {
  mission: {
    dot: "bg-[var(--color-brand-blue)]",
    overlineColor: "text-[var(--color-hero-blue)]",
  },
  vision: {
    dot: "bg-[var(--color-brand-orange)]",
    overlineColor: "text-[var(--color-brand-orange)]",
  },
} as const;

export type PanelKey = keyof typeof PANEL_COPY;

// ── TITULARES: light con énfasis en semibold ──
// Margen creativo declarado (feedback del cliente, 2026-10-07): los titulares de misión/visión van en
// light (300) y solo las frases marcadas con <b> en los mensajes suben a semibold (600). El token
// `text-display` sigue mandando en tamaño, interlineado y tracking; el peso se pone en cada palabra
// (hija), así no compite con el `font-weight` responsive del token.
export const WORD_LIGHT = "font-light";
export const WORD_BOLD = "font-semibold";

/** Parte un titular con marcas `<b>…</b>` en palabras, cada una con su énfasis. La puntuación pegada
 *  a una marca va DENTRO de ella (`<b>crecer.</b>`): fuera quedaría como palabra suelta ("crecer ."). */
export function richWords(text: string) {
  return text
    .split(/(<b>.*?<\/b>)/)
    .filter(Boolean)
    .flatMap((chunk) => {
      const bold = chunk.startsWith("<b>");
      return chunk
        .replace(/<\/?b>/g, "")
        .split(" ")
        .filter(Boolean)
        .map((word) => ({ word, bold }));
    });
}

/**
 * @description Titular en Text-Birth por palabra: cada palabra vive en su máscara (`overflow-hidden`)
 * y su interior (`.pc-bw`) nace desde abajo. El `pb` de la máscara evita recortar descendentes.
 */
export function BirthWords({ text }: { text: string }) {
  return (
    <>
      {richWords(text).map(({ word, bold }, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-static-xs -mb-static-xs">
            <span className={`pc-bw inline-block ${bold ? WORD_BOLD : WORD_LIGHT}`}>{word}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/**
 * @description El mapa como figura editorial: un marco (el que descubre la cortina) con el vídeo dentro.
 * El marco y el encuadre llevan el marfil: su clip-path / transform los vuelve grupo del blend del vídeo.
 * El encuadre recorta (overflow-hidden): el parallax escala el vídeo y no debe asomar fuera de su fondo.
 */
export function MapFigure({
  className = "",
  frameClass = "aspect-video",
  zoom = 1,
}: {
  className?: string;
  frameClass?: string;
  /** Zoom del vídeo dentro del marco (el marco no cambia, recorta). Con motion lo aplica el parallax
   *  (`data-zoom`); sin motion, la propiedad `scale` en línea. */
  zoom?: number;
}) {
  return (
    <figure className={`pf-figure ${className}`}>
      <div className={`pf-frame relative w-full overflow-hidden bg-[var(--color-hero-ivory)] ${frameClass}`} aria-hidden="true">
        <MapVideo className="pc-map absolute inset-0 w-full h-full object-cover" zoom={zoom} />
      </div>
    </figure>
  );
}
