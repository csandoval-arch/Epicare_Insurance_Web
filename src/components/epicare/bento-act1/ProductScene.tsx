"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ArrowUR from "@/components/icons/ArrowUR";
import { asset, posterFor } from "@/lib/asset";
import { DUR, EASE } from "@/lib/motion";
import SmartVideo from "../SmartVideo";
import type { PanelSpec } from "../BentoGridDesktop";

// Piezas de cada acto de producto del Bento (desktop): la UI del producto (vídeo), la pill que sigue al
// ratón sobre ella, y logo + una línea + CTA. Sin adornos: el producto es el protagonista.

/** El vídeo del hero de AMS tiene su poster con otro nombre (posterFor no lo deriva). */
const AMS_POSTER = asset("/Files/Go_AMS/hero/posters/go-ams-hero-poster.webp");
const posterOf = (p: PanelSpec, src: string) => (p.isAms ? AMS_POSTER : posterFor(src));

/** CTA de producto: mismo dibujo que `PrimaryCta` (píldora azul + flecha en burbuja), pero navega. */
export function SceneCta({ href = "#", label }: { href?: string; label: string }) {
  return (
    <Link
      href={href}
      className="group w-fit h-static-2xl pl-static-lg pr-static-sm rounded-full flex items-center gap-3 bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-elevation-4 active:scale-[0.96]"
    >
      <span className="text-body-sm font-medium">{label}</span>
      <span className="relative w-static-xl h-static-xl rounded-full bg-[var(--color-surface-BG-white)] text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
        <ArrowUR className="absolute w-static-md h-static-md transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
        <ArrowUR className="absolute w-static-md h-static-md -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </Link>
  );
}

/** Etiqueta "Próximamente" en lugar del CTA, para productos sin página todavía (no es interactiva). */
export function ComingSoonTag({ label }: { label: string }) {
  return (
    <span className="w-fit h-static-2xl px-static-lg rounded-full flex items-center border border-[var(--color-border-Strokes-default)] text-ui-label text-[var(--color-text-secondary)]">
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
  /** false cuando la tarjeta entera es el CTA (círculo que sigue al ratón, ver `MediaHover`). */
  showCta?: boolean;
}) {
  const { Logo, isAcademy, href, comingSoon } = panel;
  return (
    <div className={`grid grid-cols-[auto_auto_1fr] gap-x-static-xl items-center ${className}`}>
      <div className="rounded-md border border-[var(--color-border-Strokes-default)] px-static-lg py-static-md">
        <Logo className={`${isAcademy ? "h-11" : "h-10"} w-auto text-[var(--color-brand-blue)] dark:text-[var(--color-text-White-100)]`} />
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
export function ProductMedia({ panel, className = "", framed = true }: { panel: PanelSpec; className?: string; framed?: boolean }) {
  const fit = panel.isAms ? "object-cover object-left-top" : panel.isAcademy ? "object-contain scale-[0.85]" : "object-contain";
  const frame = framed ? "rounded-xl border border-[var(--color-border-Strokes-default)]" : "";
  // Con blend, la superficie es la MISMA de la sección (BG-1): el track pineado es una capa aislada
  // (will-change), así que el vídeo se mezcla con lo que tenga debajo dentro de ella, no con la página.
  const surface = panel.blend ? "bg-[var(--color-surface-BG-1)]" : "bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)]";
  const light = panel.blend ? "mix-blend-multiply" : "";
  const dark = panel.blend ? "mix-blend-screen" : "";
  return (
    <div className={`relative overflow-hidden ${frame} ${surface} ${className}`}>
      <SmartVideo src={panel.videoLight} poster={posterOf(panel, panel.videoLight)} className={`absolute inset-0 w-full h-full ${fit} ${light} dark:hidden`} />
      <SmartVideo src={panel.videoDark} poster={posterOf(panel, panel.videoDark)} className={`absolute inset-0 w-full h-full ${fit} ${dark} hidden dark:block`} />
    </div>
  );
}

/**
 * @description Zona (la tarjeta entera) con un círculo que sigue al ratón (late al alcanzarlo y se hunde al hacer clic) mientras está encima ("Ver CRM",
 * "Próximamente"…). El círculo CRECE desde 0 en el punto del cursor (EASE.dramatic) y se encoge al
 * salir; persigue al cursor con un retardo suave (`gsap.quickTo`, solo transform). Con `href` toda la
 * zona es un enlace; sin él, solo informa.
 * En táctil no hay hover: la pill no aparece y el enlace sigue funcionando.
 */
export function MediaHover({ href, label, tone = "brand", className = "", children }: {
  href?: string;
  label: string;
  /** brand = círculo azul con flecha (navega); muted = círculo gris sin flecha (p. ej. "Próximamente"). */
  tone?: "brand" | "muted";
  className?: string;
  children: React.ReactNode;
}) {
  const zoneRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null); // sigue al ratón + aparece/desaparece
  const faceRef = useRef<HTMLSpanElement>(null); // latido al llegar + hundido al hacer clic
  const moveX = useRef<((v: number) => void) | null>(null);
  const moveY = useRef<((v: number) => void) | null>(null);
  const settle = useRef<number | undefined>(undefined);
  const interactive = tone === "brand";

  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const ctx = gsap.context(() => {
      gsap.set(pill, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      moveX.current = gsap.quickTo(pill, "x", { duration: DUR.fast, ease: EASE.out });
      moveY.current = gsap.quickTo(pill, "y", { duration: DUR.fast, ease: EASE.out });
    });
    return () => {
      window.clearTimeout(settle.current);
      ctx.revert();
    };
  }, []);

  // Latido de "llegada": cuando el ratón se detiene, el círculo termina de alcanzarlo (≈ DUR.fast) y
  // late una vez (crece 8 % y vuelve).
  const arrive = () =>
    gsap.fromTo(faceRef.current, { scale: 1 }, { scale: 1.08, duration: DUR.micro, ease: EASE.snap, yoyo: true, repeat: 1, overwrite: "auto" });

  const place = (e: React.PointerEvent) => {
    const r = zoneRef.current?.getBoundingClientRect();
    if (!r) return;
    moveX.current?.(e.clientX - r.left);
    moveY.current?.(e.clientY - r.top);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(arrive, DUR.fast * 1000);
  };
  const show = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = zoneRef.current?.getBoundingClientRect();
    if (r) gsap.set(pillRef.current, { x: e.clientX - r.left, y: e.clientY - r.top });
    gsap.to(pillRef.current, { scale: 1, autoAlpha: 1, duration: DUR.fast, ease: EASE.dramatic, overwrite: "auto" });
  };
  const hide = () => {
    window.clearTimeout(settle.current);
    gsap.to(pillRef.current, { scale: 0, autoAlpha: 0, duration: DUR.microOut, ease: EASE.snap, overwrite: "auto" });
  };
  // Clic (solo si navega): se hunde al pulsar y rebota al soltar.
  const press = () => interactive && gsap.to(faceRef.current, { scale: 0.86, duration: DUR.micro, ease: EASE.snap, overwrite: "auto" });
  const release = () => interactive && gsap.to(faceRef.current, { scale: 1, duration: DUR.fast, ease: EASE.dramatic, overwrite: "auto" });

  const faceTone = interactive
    ? "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)]"
    : "bg-[var(--color-text-secondary)] text-[var(--color-text-White-100)]";

  const inner = (
    <>
      {children}
      <span ref={pillRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20 w-24 h-24">
        <span
          ref={faceRef}
          className={`w-full h-full p-static-sm rounded-full flex flex-col items-center justify-center gap-1 text-center shadow-elevation-4 ${faceTone}`}
        >
          <span className="text-body-sm font-medium leading-tight">{label}</span>
          {interactive && <ArrowUR className="w-4 h-4" strokeWidth={1.75} />}
        </span>
      </span>
    </>
  );

  const zone = `media-hover relative overflow-hidden ${className}`;
  const handlers = {
    onPointerEnter: show,
    onPointerMove: place,
    onPointerLeave: () => { release(); hide(); },
    onPointerDown: press,
    onPointerUp: release,
  };
  return href ? (
    <Link ref={zoneRef as React.RefObject<HTMLAnchorElement>} href={href} {...handlers} className={zone}>
      {inner}
    </Link>
  ) : (
    <div ref={zoneRef as React.RefObject<HTMLDivElement>} {...handlers} className={zone}>
      {inner}
    </div>
  );
}
