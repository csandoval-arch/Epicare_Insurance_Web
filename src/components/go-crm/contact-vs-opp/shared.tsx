"use client";

/**
 * @file shared.tsx
 * @description Piezas de "Cartera" (Fractura v3, 2026-10-07): las personas que rotan (foto + ficha +
 * sus oportunidades), el ciclo de rotación, la tarjeta de nombre y el ticket de oportunidad.
 * Datos de demo fijos (DATA-MOCK-UI): nombres, fuentes y primas no se traducen.
 */

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import { CONTACTS_LEFT, CONTACTS_RIGHT, type DemoContact } from "./data";

// ── PERSONAS QUE ROTAN ──
export interface Person {
  contact: DemoContact;
  image: string;
  /** Oportunidad por producto (Dental · Salud · Vida): prima mensual + índice de etapa. */
  opps: { price: string; stage: number }[];
}

export const PEOPLE: Person[] = [
  { contact: CONTACTS_LEFT[0], image: "/client_auto.jpg", opps: [{ price: "$38", stage: 0 }, { price: "$412", stage: 1 }, { price: "$95", stage: 2 }] },
  { contact: CONTACTS_LEFT[2], image: "/client_scenario_1.jpg", opps: [{ price: "$42", stage: 2 }, { price: "$389", stage: 0 }, { price: "$120", stage: 1 }] },
  { contact: CONTACTS_LEFT[1], image: "/client_business.jpg", opps: [{ price: "$35", stage: 1 }, { price: "$455", stage: 2 }, { price: "$88", stage: 0 }] },
  { contact: CONTACTS_RIGHT[1], image: "/client_family.jpg", opps: [{ price: "$64", stage: 0 }, { price: "$730", stage: 1 }, { price: "$140", stage: 2 }] },
];

/** Color de acento de cada oportunidad: los 3 de marca (el oscuro con su token bimodal de texto). */
export const OPP_DOTS = [
  "bg-[var(--color-brand-blue)]",
  "bg-[var(--color-brand-orange)]",
  "bg-[var(--color-text-accent-dark)]",
] as const;

/** Copy de una oportunidad (`goCrm.contactVsOpp.opps`). */
export interface OppCopy {
  label: string;
  desc: string;
}

/** Copy de la sección (`goCrm.contactVsOpp` + `.v2`). */
export function useCvoCopy() {
  const t = useTranslations("goCrm.contactVsOpp");
  return {
    overline: t("overline"),
    /** Titular con el nombre de la persona dentro: [antes, después] de `{name}`. */
    title: (t.raw("v2.title") as string).split("{name}") as [string, string],
    sub: t("v2.sub"),
    cta: t("cta"),
    stages: t.raw("v2.stages") as string[],
    /** Siguiente paso según la etapa (mismo índice que `stages`). */
    nextSteps: t.raw("v2.nextSteps") as string[],
    openOpps: (count: number) => t("v2.openOpps", { count }),
    perMonth: t("v2.perMonth"),
    opps: t.raw("opps") as OppCopy[],
  };
}

// ── CICLO DE ROTACIÓN ──
/** Cuánto se queda cada persona. */
export const PERSON_MS = 3600;

/**
 * @description Ciclo de personas. El reloj es la hairline de la tarjeta de nombre (animación CSS
 * `cvo-timer`, sin setInterval): cada iteración llama a `next`. Corre solo con `el` en pantalla y
 * sin reduced-motion. El `NameTag` oculto (display:none) no anima, así que nunca avanza dos veces.
 */
export function usePersonCycle(el: HTMLElement | null) {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [el]);
  const next = useCallback(() => setIndex((i) => (i + 1) % PEOPLE.length), []);
  return { index, running, next };
}

// ── PIEZAS ──
/** Pila de fotos de todas las personas; solo la activa es visible (fundido CSS de opacidad). */
export function PeopleStack({ active, className = "", imgClassName = "" }: { active: number; className?: string; imgClassName?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {PEOPLE.map((p, i) => (
        <img
          key={p.image}
          src={asset(p.image)}
          alt=""
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        />
      ))}
    </div>
  );
}

/**
 * Reloj del ciclo: hairline azul que se llena en `PERSON_MS`; cada vuelta llama a `onCycle`. Debe haber
 * UNO visible por sección (uno en display:none no anima, así que no cuenta dos veces).
 */
export function CycleTimer({ running, onCycle, className = "" }: { running: boolean; onCycle: () => void; className?: string }) {
  return (
    <span
      aria-hidden="true"
      onAnimationIteration={onCycle}
      className={`cvo-timer block h-px w-full bg-[var(--color-brand-blue)] origin-left ${className}`}
      style={{ animationPlayState: running ? "running" : "paused" }}
    />
  );
}

/**
 * Tarjeta de nombre: avatar, nombre y fuente; cambia con la persona (fundido + subida corta). Su hairline
 * inferior es el reloj del ciclo: se llena en `PERSON_MS` y al completarse avanza a la siguiente persona.
 */
export function NameTag({
  person,
  running,
  onCycle,
  className = "",
}: {
  person: Person;
  running: boolean;
  onCycle: () => void;
  className?: string;
}) {
  const { contact } = person;
  return (
    <div className={`relative overflow-hidden rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] shadow-elevation-2 p-static-sm pr-static-md flex items-center gap-static-sm ${className}`}>
      <CycleTimer running={running} onCycle={onCycle} className="absolute left-0 bottom-0" />
      <span className="size-static-xl shrink-0 rounded-full bg-[var(--color-text-primary)] text-[var(--color-surface-BG-white)] dark:text-[var(--color-surface-BG-black)] text-meta grid place-items-center" aria-hidden="true">
        {contact.initials}
      </span>
      <span key={contact.name} className="cvo-swap flex flex-col min-w-0">
        <span className="text-body-sm font-medium text-[var(--color-text-primary)] truncate">{contact.name}</span>
        <span className="text-meta text-[var(--color-text-secondary)] truncate">{contact.source}</span>
      </span>
    </div>
  );
}

/** Ticket de oportunidad: producto + prima + etapa del pipeline. El contenido cambia con la persona. */
export function OppTicket({
  label,
  price,
  perMonth,
  stage,
  dot,
  swapKey,
  className = "",
}: {
  label: string;
  price: string;
  perMonth: string;
  stage: string;
  dot: string;
  swapKey: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] p-static-md flex flex-col gap-static-sm shadow-elevation-1 ${className}`}>
      <div className="flex items-center justify-between gap-static-md">
        <span className="text-h4 text-[var(--color-text-primary)]">{label}</span>
        <span className={`size-static-sm rounded-full ${dot}`} aria-hidden="true" />
      </div>
      <span key={swapKey} className="cvo-swap flex flex-col gap-static-sm">
        <span className="text-body-md text-[var(--color-text-primary)]">
          <span className="font-medium">{price}</span>
          <span className="text-[var(--color-text-secondary)]">{perMonth}</span>
        </span>
        <span className="text-meta text-[var(--color-text-secondary)] border-t border-[var(--color-border-Strokes-default)] pt-static-sm">{stage}</span>
      </span>
    </div>
  );
}

/** Keyframe del cambio de contenido (solo opacity/transform). React lo sube al `<head>` y lo deduplica. */
export function SwapStyle(): ReactNode {
  return (
    <style href="cvo-swap" precedence="default">{`
      @keyframes cvo-swap { from { opacity: 0; transform: translate3d(0, 0.375rem, 0); } to { opacity: 1; transform: none; } }
      @keyframes cvo-timer { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      .cvo-swap { animation: cvo-swap 450ms cubic-bezier(0.22, 1, 0.36, 1) both; }
      .cvo-timer { animation: cvo-timer ${PERSON_MS}ms linear infinite; }
      @media (prefers-reduced-motion: reduce) { .cvo-swap, .cvo-timer { animation: none; } }
    `}</style>
  );
}
