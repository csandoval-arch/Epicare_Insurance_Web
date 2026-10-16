"use client";

import React from "react";
import { asset, posterFor } from "@/lib/asset";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SmartVideo from "../SmartVideo";
import { CARD_LIGHT } from "./layout";
import type { PanelSpec } from "../BentoGridDesktop";

/**
 * @description Los actos de producto del track de GO Hub. Un acto = un producto, en UN solo
 * contenedor: a la izquierda la jerarquía de lectura (logo → claim → detalle, anclada arriba) y a la
 * derecha su vídeo, fundido con la superficie de la tarjeta para que no se lea como una pieza aparte
 * de su información. El acto entero es el enlace; el CTA bajo el detalle es la cara visible.
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
  /**
   * Cuánto entra el vídeo POR DEBAJO de la columna de texto (% del acto, 15/10/2026). Al estrechar
   * la tarjeta el vídeo se quedó en 400px y recortaba la escena; en vez de devolverle ancho a costa
   * del texto, se mete bajo la columna (el texto va en `z-10`).
   * - `blend`: vídeos de fondo plano (CRM, Academy). Se funden con la tarjeta, así que el solape es
   *   invisible y pueden entrar a fondo.
   * - `framed`: el panel de AMS es una captura OPACA con su marco. Entra menos porque, por debajo
   *   del título, un solape real se vería: a 11% el titular inglés "The core of your" lo tocaría en
   *   pantallas de ~1280 (la tipografía está topada en 40px y la tarjeta sí encoge con el viewport).
   */
  pull: { blend: "11%", framed: "6%" },
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

/**
 * El logo va solo, sin contenedor de fondo (feedback 16/10/2026). La caja se conserva únicamente como
 * reserva de espacio (mismo alto que antes: el texto no se mueve) y el logo se alinea a la izquierda,
 * en el borde de la columna de texto.
 */
function ActLogo({ panel }: { panel: PanelSpec }) {
  const { Logo, isAcademy } = panel;
  return (
    <div
      className="flex items-center justify-start"
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
function ActMedia({ panel, className = "", style }: { panel: PanelSpec; className?: string; style?: React.CSSProperties }) {
  if (panel.isAms) {
    return (
      <div className={`flex items-center justify-end ${className}`} style={style}>
        <div className={`relative w-full h-[78%] overflow-hidden rounded-l-md md:rounded-l-lg border-l border-y border-[color-mix(in_srgb,var(--color-text-Black-100)_12%,var(--color-surface-BG-white))] shadow-elevation-3 ${LOGO_SURFACE}`}>
          <SmartVideo src={panel.videoLight} poster={posterOf(panel, panel.videoLight)} className="absolute inset-0 w-full h-full object-cover object-left" />
        </div>
      </div>
    );
  }

  const fit = panel.isAcademy ? "object-contain scale-[0.85]" : "object-cover";
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <SmartVideo
        src={panel.videoLight}
        poster={posterOf(panel, panel.videoLight)}
        className={`absolute inset-0 w-full h-full ${fit} mix-blend-multiply`}
      />
    </div>
  );
}

/**
 * Un producto = un acto. Texto y vídeo en el mismo contenedor, con su jerarquía de lectura.
 * La tarjeta entera es el enlace (hit box); el CTA bajo el detalle es solo visual (`decorative`, sin
 * segundo `<a>` anidado) y reacciona al hover de la tarjeta (`group`). Sin `href` (Academy) la
 * tarjeta no navega y en su lugar va la etiqueta "Próximamente".
 */
export function HubAct({ panel, lead, body, ctaLabel }: {
  panel: PanelSpec;
  lead: string;
  body: string;
  /** Texto del CTA ("Explorar GO CRM") o, si el producto no tiene página, "Próximamente". */
  ctaLabel: string;
}) {
  const zoneClass = `h-full w-full rounded-xl ${HAIRLINE} ${SURFACE} flex group relative overflow-hidden`;
  const navigates = !panel.comingSoon && !!panel.href;
  const content = (
    <>
      {/* Jerarquía de lectura, anclada ARRIBA: logo (marca) → claim (ancla) → detalle → CTA.
          `relative z-10` la deja POR ENCIMA del vídeo, que entra por debajo (ver ACT.pull). */}
      <div
        className="relative z-10 h-full px-static-2xl pt-static-2xl pb-static-2xl flex flex-col justify-start gap-static-xl shrink-0 pointer-events-none"
        style={{ width: ACT.split }}
      >
        <ActLogo panel={panel} />
        {/* El titular se mide por su línea más larga en vez de partirse dentro de la columna: con
            el vídeo debajo y fundido, puede invadirlo. Solo en las tarjetas con blend; la de AMS
            lleva un panel opaco y su titular cabe sin ayuda. */}
        <p className={`text-display-sm ${INK} ${panel.blend ? "w-max max-w-[132%]" : ""}`}>{lines(lead)}</p>
        <p className={`text-body-lg ${INK_SOFT}`}>{lines(body)}</p>
        {navigates ? (
          <Button label={ctaLabel} decorative className="mt-static-md" />
        ) : (
          <span className={`mt-static-md w-fit h-static-2xl px-static-lg rounded-button flex items-center ${HAIRLINE} text-ui-label ${INK_SOFT}`}>
            {ctaLabel}
          </span>
        )}
      </div>

      <ActMedia
        panel={panel}
        className="h-full flex-1 min-w-0"
        style={{ marginLeft: `-${panel.blend ? ACT.pull.blend : ACT.pull.framed}` }}
      />
    </>
  );

  return (
    <article className="hub-act shrink-0" style={{ width: ACT.w, height: ACT.h }}>
      {navigates ? (
        <Link href={panel.href!} aria-label={ctaLabel} className={zoneClass}>
          {content}
        </Link>
      ) : (
        <div className={zoneClass}>{content}</div>
      )}
    </article>
  );
}
