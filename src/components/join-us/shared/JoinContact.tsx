"use client";

/**
 * @description El contacto de la sede ("Contact") como un bento de 3 celdas: stroke del DS y fondo
 * blanco; la dirección a todo el ancho arriba, teléfono y correo en la misma fila debajo.
 * Cada celda: icono azul arriba y, abajo, la etiqueta (sans, gris) y el dato.
 * El teléfono y el correo son enlaces: `tel:`/`mailto:` los entrega el navegador a la app del sistema
 * (en escritorio solo pasa algo si hay una registrada para ese protocolo). La dirección es informativa.
 * Los datos salen de `@/lib/contact` (los mismos del footer); de i18n solo salen las etiquetas.
 */

import { useTranslations } from "next-intl";
import { EnvelopeSimple, MapPin, Phone, type Icon } from "@phosphor-icons/react";
import { CONTACT, CONTACT_ADDRESS_LINE } from "@/lib/contact";

interface Cell {
  key: string;
  icon: Icon;
  label: string;
  value: string;
  /** Destino de la celda; sin `href` la celda es informativa (la dirección). */
  href?: string;
  /** Posición en el bento (2 columnas). */
  area: string;
}

/** Celda del bento: hairline del DS sobre fondo blanco. */
const CELL =
  "jb-rise group flex flex-col justify-between gap-static-md p-static-md md:p-static-lg rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)]";
/** Solo la celda que lleva a algún sitio reacciona: stroke y dato se encienden en azul. */
const CELL_LINK = "transition-colors duration-300 hover:border-[var(--color-border-Strokes-Hover)]";
const VALUE = "text-body-sm md:text-body-md text-[var(--color-text-primary)] [overflow-wrap:anywhere] leading-snug";
const VALUE_LINK = "transition-colors duration-300 group-hover:text-[var(--color-text-accent-blue)]";

export default function JoinContact({ title, className = "" }: { title?: string; className?: string }) {
  const t = useTranslations("joinUs.contact");
  const displayTitle = title || t("title");
  const cells: Cell[] = [
    { key: "address", icon: MapPin, label: t("addressLabel"), value: CONTACT_ADDRESS_LINE, area: "col-span-2" },
    { key: "phone", icon: Phone, label: t("phoneLabel"), value: CONTACT.phone, href: `tel:${CONTACT.tel}`, area: "col-span-1" },
    { key: "email", icon: EnvelopeSimple, label: t("emailLabel"), value: CONTACT.email, href: `mailto:${CONTACT.email}`, area: "col-span-1" },
  ];

  return (
    <div className={`flex-col gap-static-md ${className.split(" ").includes("hidden") ? "" : "flex"} ${className}`}>
      <h3 className="jb-rise text-overline text-[var(--color-text-accent-blue)]">{displayTitle}</h3>
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-static-sm">
        {cells.map(({ key, icon: IconCmp, label, value, href, area }) => {
          const body = (
            <>
              <IconCmp weight="regular" className="w-5 h-5 md:w-static-lg md:h-static-lg text-[var(--color-brand-blue)]" aria-hidden="true" />
              <div className="flex flex-col gap-0.5 md:gap-static-xs">
                <span className="text-caption text-[var(--color-text-secondary)]">{label}</span>
                <span className={`${VALUE} ${href ? VALUE_LINK : ""}`}>{value}</span>
              </div>
            </>
          );
          return href ? (
            <a key={key} href={href} className={`${CELL} ${CELL_LINK} ${area}`}>
              {body}
            </a>
          ) : (
            <div key={key} className={`${CELL} ${area}`}>
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
