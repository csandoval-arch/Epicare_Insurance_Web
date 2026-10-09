"use client";

/**
 * @description Piezas del modal "Join Epicare" con el lenguaje del menú móvil (vidrio líquido):
 * - `IconChip`: pastilla de icono (azul de marca tenue) — mismo tratamiento en ramas y resultados.
 * - `BranchHead`: cabecera de una rama (icono + etiqueta, pregunta, texto).
 * - `JoinTile`: un resultado del filtro (p. ej. "Soy agente"). Tile de vidrio entero pulsable: icono, título,
 *   texto y "More Info" con la flecha azul al pie. Lleva al formulario de esa versión (destino en
 *   `joinData.ts`; `href` null = aún no navega).
 */

import type { ComponentType, CSSProperties, PointerEvent } from "react";
import { Buildings, Certificate, Handshake, SealCheck, Trademark, User, type IconProps } from "@phosphor-icons/react";
import ArrowUR from "@/components/icons/ArrowUR";
import type { JoinBranch } from "@/lib/joinModalStore";
import type { JoinPathKey } from "./joinData";

type Icon = ComponentType<IconProps>;

export const BRANCH_ICON: Record<JoinBranch, Icon> = { agent: User, agency: Buildings };
export const PATH_ICON: Record<JoinPathKey, Icon> = {
  "agent-licensed": SealCheck,
  "agent-unlicensed": Certificate,
  "agency-fmo": Handshake,
  "agency-trademark": Trademark,
};

/** `md` es responsive: pastilla compacta en móvil, grande en desktop. `live`: dentro de un tile, se enciende
 * (azul lleno, icono blanco) con el hover del tile en desktop. */
export function IconChip({ icon: I, size = "md", live = false }: { icon: Icon; size?: "sm" | "md"; live?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 inline-flex items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--color-brand-blue)_14%,transparent)] text-[var(--color-text-accent-blue)] ${
        size === "sm" ? "w-static-xl h-static-xl" : "w-static-xl h-static-xl lg:w-static-2xl lg:h-static-2xl"
      }${live ? " transition-colors duration-300 ease-out lg:group-hover/tile:bg-[var(--color-brand-blue)] lg:group-hover/tile:text-[var(--color-text-White-100)]" : ""}`}
    >
      <I weight="regular" className={size === "sm" ? "w-static-md h-static-md" : "w-static-md h-static-md lg:w-static-lg lg:h-static-lg"} />
    </span>
  );
}

export function BranchHead({ icon, tag, title, body }: { icon: Icon; tag: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-static-xs lg:gap-static-md">
      {/* La rama como encabezado: h4 solo en móvil (más aire); pastilla + h4 como columna en desktop */}
      <span className="flex items-center gap-static-md">
        <span className="hidden lg:contents">
          <IconChip icon={icon} />
        </span>
        <span className="text-h4">{tag}</span>
      </span>
      {/* Solo desktop: pregunta display + texto de apoyo (en móvil la rama es solo su etiqueta) */}
      <div className="hidden lg:flex flex-col gap-static-sm">
        <h2 className="text-display-sm">{title}</h2>
        <p className="text-body-lg text-[var(--color-text-secondary)]">{body}</p>
      </div>
    </div>
  );
}

/* ── Hover de luz (desktop) ──
   El puntero escribe --mx/--my en el tile (sin re-render de React); dos capas leen esa posición:
   - SPOTLIGHT: luz neutra (el relleno del vidrio, `--glass-liquid-tile`) que sigue al cursor: aclara el fondo
     bajo el texto en vez de teñirlo → el contraste no baja. El azul queda solo en el canto y el icono.
   - RING: el mismo foco recortado a 1px de borde (máscara content-box exclude) → el canto se ilumina
     solo cerca del cursor. Ambas entran solo con opacity. Margen creativo: 85 % de azul en el canto, radios 260/200px. */
const SPOTLIGHT: CSSProperties = {
  background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), var(--glass-liquid-tile), transparent 70%)",
};
const RING: CSSProperties = {
  padding: 1,
  background: "radial-gradient(200px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--color-brand-blue) 85%, transparent), transparent 70%)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};
const LIGHT_LAYER = "hidden lg:block absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 transition-opacity duration-300 ease-out group-hover/tile:opacity-100";

const trackPointer = (e: PointerEvent<HTMLButtonElement>) => {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export function JoinTile({ icon, title, text, more, href }: { icon: Icon; title: string; text: string; more: string; href: string | null }) {
  return (
    <button
      type="button"
      onClick={() => href && window.location.assign(href)}
      onPointerMove={trackPointer}
      className="jm-tile glass-liquid-tile group/tile relative overflow-hidden w-full h-full lg:min-h-56 text-left rounded-lg p-static-md lg:p-static-lg flex flex-col gap-static-md lg:gap-static-lg cursor-pointer transition-[translate,scale] duration-300 ease-out hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
    >
      <span aria-hidden="true" className={LIGHT_LAYER} style={SPOTLIGHT} />
      <span aria-hidden="true" className={LIGHT_LAYER} style={RING} />
      {/* Móvil (compacto): icono ↔ flecha arriba; título y subtítulo debajo. Desktop: además "More Info" al pie */}
      <span className="relative flex items-start justify-between">
        <IconChip icon={icon} live />
        <ArrowUR aria-hidden="true" className="lg:hidden w-static-md h-static-md text-[var(--color-text-accent-blue)]" />
      </span>
      <span className="relative flex flex-col gap-static-xs lg:gap-static-sm">
        <span className="text-h4 lg:text-h3">{title}</span>
        <span className="text-body-sm lg:text-body-md text-[var(--color-text-secondary)]">{text}</span>
      </span>
      {/* Al pie (mt-auto): los "More Info" de una fila quedan alineados aunque los textos midan distinto */}
      <span className="relative hidden mt-auto lg:flex items-center gap-static-xs text-body-sm text-[var(--color-text-accent-blue)]">
        {more}
        <ArrowUR className="w-static-md h-static-md transition-transform duration-200 ease-out group-hover/tile:translate-x-1 group-hover/tile:-translate-y-1" />
      </span>
    </button>
  );
}
