"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { NAV_GROUPS } from "./data";
import { FooterContact, FooterNavLink } from "./parts";
import { HAIRLINE, LINK, PAD_X } from "./theme";

/** Título de columna: token de los enlaces (`text-body-md`) +200 de peso, con separador a lo ancho de la celda. */
export const LABEL = `self-stretch text-body-md font-medium pb-static-sm mb-static-sm -mx-static-md px-static-md md:-mx-static-lg md:px-static-lg border-b ${HAIRLINE} [&>span]:opacity-45`;
const CELL = `group relative flex flex-col items-start gap-static-xs py-static-lg ${PAD_X} ${HAIRLINE}`;

interface FooterGridProps {
  /** Celda final. Por defecto, el contacto. */
  tail?: ReactNode;
  /** Clases extra de la celda final (p. ej. la celda azul de resolución). */
  tailClass?: string;
  /** Línea azul superior que se enciende al hover en cada celda del índice. */
  hoverLine?: boolean;
}

/**
 * @description Retícula de estudio del footer: bloque enmarcado con hairlines en los 4 lados, 12 col en
 * desktop y 2 en móvil: Go Hub · Soluciones · Nosotros · [celda final], 3 col cada una en desktop.
 * En móvil los tres grupos caben en 2 columnas (Go Hub a la izquierda; Soluciones + Nosotros como una
 * sola lista a la derecha) y la celda final ocupa la fila completa. Hairlines calculadas por posición.
 */
export default function FooterGrid({ tail, tailClass = "", hoverLine = false }: FooterGridProps) {
  const t = useTranslations("landingV2.footer");
  const tn = useTranslations("landingV2.nav");
  const span = "md:col-span-3";
  // Móvil (2 col): Go Hub a la izquierda; a la derecha, los enlaces de Soluciones y, a continuación y
  // sin título, los de Nosotros (una sola lista). Desktop: una fila, hairline vertical antes de cada celda.
  const edge = (i: number) => {
    if (i === 0) return "row-span-2 md:row-span-1";
    if (i === 1) return "border-l pb-0 md:pb-static-lg";
    return "col-start-2 md:col-start-auto border-l pt-static-xs md:pt-static-lg";
  };
  /** En móvil, el título de Nosotros se oculta: sus enlaces continúan la lista de Soluciones. */
  const labelVisibility = (i: number) => (i === 2 ? "hidden md:block" : "");

  return (
    <div className={`grid grid-cols-2 md:grid-cols-12 border ${HAIRLINE}`}>
      {NAV_GROUPS.map((group, i) => (
        <nav key={group.label} className={`${CELL} ${span} ${edge(i)}`} aria-label={tn(group.label)}>
          {hoverLine && (
            <span className="absolute -top-px inset-x-0 h-0.5 bg-[var(--color-brand-blue)] origin-left scale-x-0 transition-[scale] duration-300 group-hover:scale-x-100" aria-hidden="true" />
          )}
          <p className={`${LABEL} ${labelVisibility(i)}`}>
            <span>{tn(group.label)}</span>
          </p>
          {group.items.map((item) => (
            <FooterNavLink key={item.key} item={item} className="text-body-md" accent={LINK} />
          ))}
        </nav>
      ))}

      <div className={`${CELL} col-span-2 ${span} border-t md:border-t-0 md:border-l ${tailClass}`}>
        {tail ?? (
          <>
            <p className={LABEL}>
              <span>{t("contact")}</span>
            </p>
            <FooterContact className="text-body-md gap-static-xs" linkClass={`transition-colors duration-300 ${LINK}`} />
          </>
        )}
      </div>
    </div>
  );
}
