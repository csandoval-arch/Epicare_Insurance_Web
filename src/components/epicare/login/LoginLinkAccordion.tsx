"use client";

import { useId, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import ArrowUR from "@/components/icons/ArrowUR";
import type { CarrierLink } from "./loginData";

interface LoginLinkAccordionProps {
  label: string;
  links: CarrierLink[];
  /** Abre el portal elegido (lo decide el modal: pestaña nueva para externos). */
  onSelect: (href: string) => void;
}

/**
 * @description Fila de vidrio desplegable con los portales de un tipo de carrier.
 * Mismo aspecto que las filas simples del modal: en desktop cada fila es un tile suelto; en móvil las
 * filas viven dentro del panel agrupado del `<ul>` padre (divisores, sin radio propio).
 * El panel anima con `grid-template-rows` (0fr → 1fr) y queda `inert` cerrado, así su contenido no
 * entra en el orden de tabulación.
 */
export default function LoginLinkAccordion({ label, links, onSelect }: LoginLinkAccordionProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="flex flex-col lg:gap-static-xs">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="group/link w-full min-h-static-2xl py-static-xs px-static-sm lg:h-static-2xl lg:py-0 lg:px-static-md flex items-center justify-between gap-static-xs lg:gap-static-sm text-body-sm text-left cursor-pointer transition-[translate,scale,background-color] duration-200 ease-out max-lg:active:bg-[var(--glass-liquid-tile)] lg:glass-liquid-tile lg:rounded-md lg:active:scale-[0.98] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
      >
        {label}
        <CaretDown
          aria-hidden="true"
          weight="bold"
          className={`shrink-0 w-static-md h-static-md text-[var(--color-text-accent-blue)] transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <ul className="min-h-0 overflow-hidden flex flex-col lg:gap-static-xs lg:pl-static-sm max-lg:border-t max-lg:border-[var(--glass-liquid-divider)] max-lg:divide-y max-lg:divide-[var(--glass-liquid-divider)]">
          {links.map((l) => (
            <li key={l.label}>
              <button
                type="button"
                onClick={() => onSelect(l.href)}
                className="group/link w-full min-h-static-xl py-static-xs px-static-sm lg:px-static-md flex items-center justify-between gap-static-xs text-body-xs lg:text-body-sm text-left text-[var(--color-text-secondary)] cursor-pointer transition-[translate,background-color] duration-200 ease-out max-lg:active:bg-[var(--glass-liquid-tile)] lg:rounded-md lg:hover:bg-[var(--glass-liquid-tile)] lg:hover:text-[var(--color-text-primary)] lg:hover:translate-x-0.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
              >
                {l.label}
                <ArrowUR
                  aria-hidden="true"
                  className="shrink-0 w-static-sm h-static-sm text-[var(--color-text-accent-blue)] transition-transform duration-200 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
