"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { asset, posterFor } from "@/lib/asset";
import SmartVideo from "../SmartVideo";
import type { PanelSpec } from "../BentoGridDesktop";
import { CARD_SURFACE, CARD_LIGHT } from "./layout";

// Piezas de cada acto de producto del Bento (desktop): la UI del producto (vídeo), y logo + una línea + CTA. Sin adornos: el producto es el protagonista.

/** El vídeo del hero de AMS tiene su poster con otro nombre (posterFor no lo deriva). */
const AMS_POSTER = asset("/Files/Go_AMS/hero/posters/go-ams-hero-poster.webp");
const posterOf = (p: PanelSpec, src: string) => (p.isAms ? AMS_POSTER : posterFor(src));

/** CTA de producto: el mismo `Button` de todo el sitio, pero navega. */
export function SceneCta({ href = "#", label }: { href?: string; label: string }) {
  return <Button href={href} label={label} />;
}

/** Etiqueta "Próximamente" en lugar del CTA, para productos sin página todavía (no es interactiva). */
export function ComingSoonTag({ label }: { label: string }) {
  return (
    <span className="w-fit h-static-2xl px-static-lg rounded-button flex items-center border border-[var(--color-border-Strokes-default)] text-ui-label text-[var(--color-text-secondary)]">
      {label}
    </span>
  );
}

/** Copy con cortes fijos: el salto va en el texto (salto de línea en messages/*.json; gancho y detalle a
 *  2 líneas) y cada línea no se parte, así las tres tarjetas componen igual. */
export const lines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i} className="block whitespace-nowrap">
      {line}
    </span>
  ));

/** Una fila en tres columnas: logo en una cajita con stroke (hairline del DS, radio pequeño) · frase
 *  gancho (bold, 2 líneas) · detalle (body-lg, gris oscuro de marca para que no se pierda, 2 líneas).
 *  CTA (o "Próximamente") bajo el gancho si `showCta`. */
export function ProductCopy({ panel, lead, body, cta, comingSoonLabel, className = "", showCta = true }: {
  panel: PanelSpec;
  /** Frase gancho (negrita, color primario). */
  lead: string;
  /** Detalle (gris oscuro de marca). */
  body: string;
  cta?: string;
  comingSoonLabel?: string;
  className?: string;
  /** false cuando la tarjeta entera es el enlace y el CTA va aparte. */
  showCta?: boolean;
}) {
  const { Logo, isAcademy, href, comingSoon } = panel;
  return (
    <div className={`grid grid-cols-[auto_auto_1fr] gap-x-static-xl items-center ${className}`}>
      <div className="w-40 h-20 shrink-0 flex items-center justify-center rounded-md border border-[var(--color-border-Strokes-default)]">
        <Logo className={`${isAcademy ? "h-12" : "h-11"} w-auto text-[var(--color-brand-blue)] dark:text-[var(--color-text-White-100)]`} />
      </div>
      <div className="flex flex-col items-start">
        <p className="text-h4 text-[var(--color-text-primary)]">{lines(lead)}</p>
        {showCta && <div className="mt-static-xl">{comingSoon ? <ComingSoonTag label={comingSoonLabel ?? cta ?? ""} /> : <SceneCta href={href} label={cta ?? ""} />}</div>}
      </div>
      <p className="justify-self-end text-body-lg text-[var(--color-text-accent-dark)]">{lines(body)}</p>
    </div>
  );
}

/** UI del producto (vídeo light/dark). `framed`: con hairline y radio propios; sin él, va a sangre
 *  dentro de un contenedor que ya la enmarca y recorta. Con `panel.blend` (vídeos de fondo plano: CRM,
 *  Academy) el fondo del vídeo desaparece y se funde con el de la sección: `multiply` en claro (el
 *  blanco se vuelve transparente) y `screen` en oscuro (el negro se vuelve transparente). */
export function ProductMedia({ panel, className = "", framed = true, forceLight = false }: { panel: PanelSpec; className?: string; framed?: boolean; /** Tarjeta siempre clara: se usa el vídeo claro en los dos temas. */ forceLight?: boolean }) {
  const fit = panel.isAms ? "object-cover object-left-top" : panel.isAcademy ? "object-contain scale-[0.85]" : "object-contain";
  const frame = framed ? "rounded-xl border border-[var(--color-border-Strokes-default)]" : "";
  // Con blend, la superficie es la MISMA de la sección (BG-1): el track pineado es una capa aislada
  // (will-change), así que el vídeo se mezcla con lo que tenga debajo dentro de ella, no con la página.
  const surface = CARD_SURFACE;
  const light = panel.blend ? "mix-blend-multiply" : "";
  const dark = panel.blend ? "mix-blend-screen" : "";
  if (forceLight) {
    return (
      <div className={`relative overflow-hidden ${framed ? `rounded-xl ${CARD_LIGHT.hairline}` : ""} ${CARD_LIGHT.surface} ${className}`}>
        <SmartVideo src={panel.videoLight} poster={posterOf(panel, panel.videoLight)} className={`absolute inset-0 w-full h-full ${fit} ${light}`} />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${frame} ${surface} ${className}`}>
      <SmartVideo src={panel.videoLight} poster={posterOf(panel, panel.videoLight)} className={`absolute inset-0 w-full h-full ${fit} ${light} dark:hidden`} />
      <SmartVideo src={panel.videoDark} poster={posterOf(panel, panel.videoDark)} className={`absolute inset-0 w-full h-full ${fit} ${dark} hidden dark:block`} />
    </div>
  );
}
