"use client";

/**
 * @description Piezas del modal "Join Epicare" con el lenguaje del menú móvil (vidrio líquido):
 * - `IconChip` (en `glass/IconChip`): pastilla de icono — mismo tratamiento en ramas y resultados.
 * - `BranchHead`: cabecera de una rama (icono + etiqueta, pregunta, texto).
 * - `JoinTile`: un resultado del filtro (p. ej. "Soy agente"). Tile de vidrio entero pulsable: icono, título,
 *   texto y "More Info" con la flecha azul al pie. Lleva al formulario de esa versión (destino en
 *   `joinData.ts`; `href` null = aún no navega).
 */

import type { ComponentType } from "react";
import { Buildings, Certificate, Handshake, SealCheck, Trademark, User, type IconProps } from "@phosphor-icons/react";
import ArrowUR from "@/components/icons/ArrowUR";
import { GlassLight, LIGHT_TILE, trackPointer } from "@/components/glass/GlassLight";
import { IconChip } from "@/components/glass/IconChip";
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

export function JoinTile({ icon, title, text, more, href }: { icon: Icon; title: string; text: string; more: string; href: string | null }) {
  return (
    <button
      type="button"
      onClick={() => href && window.location.assign(href)}
      onPointerMove={trackPointer}
      className={`jm-tile ${LIGHT_TILE} w-full h-full lg:min-h-56 p-static-md lg:p-static-lg flex flex-col gap-static-md lg:gap-static-lg`}
    >
      {/* Hover de luz (desktop): foco neutro que sigue al cursor + canto azul; ver `GlassLight` */}
      <GlassLight />
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
