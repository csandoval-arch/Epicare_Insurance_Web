"use client";

import { useTranslations } from "next-intl";
import { NAV_GROUPS } from "./data";
import { FooterContact, FooterNavLink } from "./parts";

interface FooterIndexProps {
  /** Rejilla de las columnas (cada look decide cuántas y cómo caen en móvil). */
  className?: string;
  /** Título de cada columna. */
  titleClass: string;
  /** Hover de los enlaces. */
  accent: string;
  /** Añade la columna de contacto (dirección, teléfono, email) al final. */
  withContact?: boolean;
  /** Clases extra de cada grupo, en el orden de `NAV_GROUPS` (colocación en la rejilla). */
  groupClass?: string[];
  /** Clases extra del título de cada grupo, en el mismo orden (p. ej. ocultarlo en móvil). */
  groupTitleClass?: string[];
  /** Clases extra de la columna de contacto (p. ej. ocupar la fila entera en móvil: el email es largo). */
  contactClass?: string;
}

/**
 * @description Índice del footer por columnas: Go Hub · Soluciones · Nosotros (+ Contacto), espejo del
 * header. Sin estilos de superficie: los pone quien lo usa (`FooterContent`).
 */
export default function FooterIndex({ className = "", titleClass, accent, withContact = false, groupClass = [], groupTitleClass = [], contactClass = "" }: FooterIndexProps) {
  const t = useTranslations("landingV2.footer");
  const tn = useTranslations("landingV2.nav");
  return (
    <div className={className}>
      {NAV_GROUPS.map((group, i) => (
        <nav key={group.label} className={`flex flex-col items-start gap-static-xs ${groupClass[i] ?? ""}`} aria-label={tn(group.label)}>
          <p className={`${titleClass} ${groupTitleClass[i] ?? ""}`}>{tn(group.label)}</p>
          {group.items.map((item) => (
            <FooterNavLink key={item.key} item={item} className="text-body-md" accent={accent} />
          ))}
        </nav>
      ))}
      {withContact && (
        <div className={`flex flex-col items-start gap-static-xs ${contactClass}`}>
          <p className={titleClass}>{t("contact")}</p>
          <FooterContact className="text-body-md gap-static-xs" linkClass={`transition-colors duration-300 ${accent}`} />
        </div>
      )}
    </div>
  );
}
