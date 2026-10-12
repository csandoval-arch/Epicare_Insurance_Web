"use client";

/**
 * @description El contacto de la sede ("Contact") como un bento de 3 celdas informativas (no son botones):
 * stroke del DS y fondo blanco; la dirección a todo el ancho arriba, teléfono y correo en la misma fila
 * debajo. Cada celda: icono azul arriba y, abajo, la etiqueta (sans, gris) y el dato.
 */

import { useTranslations } from "next-intl";
import { EnvelopeSimple, MapPin, Phone, type Icon } from "@phosphor-icons/react";

interface Cell {
  key: string;
  icon: Icon;
  label: string;
  value: string;
  /** Posición en el bento (2 columnas). */
  area: string;
}

export default function JoinContact({ title, className = "" }: { title?: string; className?: string }) {
  const t = useTranslations("joinUs.contact");
  const displayTitle = title || t("title");
  const cells: Cell[] = [
    { key: "address", icon: MapPin, label: t("addressLabel"), value: t("address"), area: "col-span-2" },
    { key: "phone", icon: Phone, label: t("phoneLabel"), value: t("phone"), area: "col-span-1" },
    { key: "email", icon: EnvelopeSimple, label: t("emailLabel"), value: t("email"), area: "col-span-1" },
  ];

  return (
    <div className={`flex-col gap-static-md ${className.split(" ").includes("hidden") ? "" : "flex"} ${className}`}>
      <h3 className="jb-rise text-overline text-[var(--color-text-accent-blue)]">{displayTitle}</h3>
      <dl className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-static-sm">
        {cells.map(({ key, icon: IconCmp, label, value, area }) => (
          <div
            key={key}
            className={`jb-rise ${area} flex flex-col justify-between gap-static-md p-static-md md:p-static-lg rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)]`}
          >
            <IconCmp weight="regular" className="w-5 h-5 md:w-static-lg md:h-static-lg text-[var(--color-brand-blue)]" aria-hidden="true" />
            <div className="flex flex-col gap-0.5 md:gap-static-xs">
              <dt className="text-caption text-[var(--color-text-secondary)]">{label}</dt>
              <dd className="text-body-sm md:text-body-md text-[var(--color-text-primary)] [overflow-wrap:anywhere] leading-snug">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
