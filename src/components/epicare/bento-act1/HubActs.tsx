"use client";

import React from "react";
import { asset, posterFor } from "@/lib/asset";
import SmartVideo from "../SmartVideo";
import { MediaHover } from "./ProductScene";
import { CARD_LIGHT } from "./layout";
import type { PanelSpec } from "../BentoGridDesktop";

/**
 * @description Los actos de producto del track de GO Hub. Un acto = un producto, en UN solo
 * contenedor: a la izquierda la jerarquía de lectura (logo → claim → detalle, anclada arriba) y a la
 * derecha su vídeo, fundido con la superficie de la tarjeta para que no se lea como una pieza aparte
 * de su información. El acto entero es el CTA: el círculo nace en el cursor y lo persigue.
 *
 * Medidas elegidas por el usuario el 14/10/2026 con un panel de pruebas (ya purgado a
 * `_quarantine/landing/gohub-debug/`). Los otros 3 paradigmas que se compararon están en
 * `_quarantine/landing/gohub-discarded/`.
 */

/** Geometría del acto. Las que no son token (vw/vh/px de la caja) son margen creativo declarado. */
const ACT = {
  /** Ancho del acto (65vw → 58vw, pedido de dirección 15/10/2026: tarjetas menos anchas). */
  w: "58vw",
  /** Alto del acto; el mismo que la caja del acto 1. */
  h: "75vh",
  /**
   * Porcentaje del acto que ocupa la columna de texto. Subió de 42% a 52% al estrechar la tarjeta:
   * los títulos llevan un corte de línea más largo (15/10/2026) y la línea más larga del set
   * ("Sabes a quién llamar" / "You know who to call") necesita ≈434px a 1440 para no partirse sola.
   * El recorte de ancho sale de la columna del vídeo.
   */
  split: "52%",
  /** Caja del logo: ancho y alto propios, independientes del tamaño del logo. */
  box: { w: "144px", h: "120px" },
  /** Alto del logo dentro de la caja (Academy va 2px más alto: su marca es más baja de x-height). */
  logo: { base: "46px", academy: "48px" },
} as const;

const { surface: SURFACE, hairline: HAIRLINE, logoSurface: LOGO_SURFACE, ink: INK, inkSoft: INK_SOFT, logoInk: LOGO_INK } = CARD_LIGHT;

/** El vídeo del hero de AMS tiene su poster con otro nombre (`posterFor` no lo deriva). */
const AMS_POSTER = asset("/Files/Go_AMS/hero/posters/go-ams-hero-poster.webp");
const posterOf = (p: PanelSpec, src: string) => (p.isAms ? AMS_POSTER : posterFor(src));

/** Texto con sus cortes de línea fijos (el salto viene de messages/*.json). */
const lines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));

/** El logo vive en una caja sin stroke, separada de la tarjeta solo por su fondo. */
function ActLogo({ panel }: { panel: PanelSpec }) {
  const { Logo, isAcademy } = panel;
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-md ${LOGO_SURFACE}`}
      // La tarjeta es siempre clara, así que el trazo del logo se ancla a la tinta oscura y no se
      // vuelve blanco en modo oscuro (los SVG lo leen de `--logo-ink`).
      style={{ width: ACT.box.w, height: ACT.box.h, ...LOGO_INK }}
    >
      <span className="inline-flex items-center shrink-0" style={{ height: isAcademy ? ACT.logo.academy : ACT.logo.base }}>
        <Logo className="h-full w-auto text-[var(--color-brand-blue)]" />
      </span>
    </div>
  );
}

/**
 * El vídeo del producto dentro de la tarjeta.
 * - CRM y Academy son vídeos de fondo plano: `multiply` en claro (el blanco se vuelve transparente) y
 *   `screen` en oscuro (el negro), así el fondo desaparece y el vídeo se funde con la superficie.
 * - AMS es una captura real con su propio fondo: va en una caja con hairline, a 78% de alto.
 */
function ActMedia({ panel, className = "" }: { panel: PanelSpec; className?: string }) {
  if (panel.isAms) {
    return (
      <div className={`flex items-center justify-end ${className}`}>
        <div className={`relative w-full h-[78%] overflow-hidden rounded-l-md md:rounded-l-lg border-l border-y border-[color-mix(in_srgb,var(--color-text-Black-100)_12%,var(--color-surface-BG-white))] shadow-elevation-3 ${LOGO_SURFACE}`}>
          <SmartVideo src={panel.videoLight} poster={posterOf(panel, panel.videoLight)} className="absolute inset-0 w-full h-full object-cover object-left" />
        </div>
      </div>
    );
  }

  const fit = panel.isAcademy ? "object-contain scale-[0.85]" : "object-cover";
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <SmartVideo
        src={panel.videoLight}
        poster={posterOf(panel, panel.videoLight)}
        className={`absolute inset-0 w-full h-full ${fit} mix-blend-multiply`}
      />
    </div>
  );
}

/** Un producto = un acto. Texto y vídeo en el mismo contenedor, con su jerarquía de lectura. */
export function HubAct({ panel, lead, body, hoverLabel }: {
  panel: PanelSpec;
  lead: string;
  body: string;
  hoverLabel: string;
}) {
  return (
    <article className="hub-act shrink-0" style={{ width: ACT.w, height: ACT.h }}>
      <MediaHover
        href={panel.comingSoon ? undefined : panel.href}
        label={hoverLabel}
        tone={panel.comingSoon ? "muted" : "brand"}
        className={`h-full w-full rounded-xl ${HAIRLINE} ${SURFACE} flex group`}
      >
        {/* Jerarquía de lectura, anclada ARRIBA: logo (marca) → claim (ancla) → detalle. */}
        <div
          className="h-full px-static-2xl pt-static-2xl pb-static-2xl flex flex-col justify-start gap-static-xl shrink-0 pointer-events-none"
          style={{ width: ACT.split }}
        >
          <ActLogo panel={panel} />
          <p className={`text-display-sm ${INK}`}>{lines(lead)}</p>
          <p className={`text-body-lg ${INK_SOFT}`}>{lines(body)}</p>
        </div>

        <ActMedia panel={panel} className="h-full flex-1 min-w-0" />
      </MediaHover>
    </article>
  );
}
