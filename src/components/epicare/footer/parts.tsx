"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import ArrowUR from "@/components/icons/ArrowUR";
import { CONTACT, type NavItem } from "./data";

/**
 * @description Enlace del índice del footer. Con destino: enlace con flecha que aparece al hover.
 * Sin destino (aún no hay página): texto atenuado, sin enlace (nunca un `href="#"` muerto); el
 * "Próximamente" va en el `title`, para no repetir la etiqueta en cada fila.
 */
export function FooterNavLink({ item, className = "", accent }: { item: NavItem; className?: string; accent: string }) {
  const t = useTranslations("landingV2.nav");
  if (!item.href) {
    return (
      <span className={`opacity-35 cursor-default ${className}`} title={t("comingSoon")} aria-disabled="true">
        {t(item.key)}
      </span>
    );
  }
  return (
    <Link href={item.href} className={`group inline-flex items-center gap-static-sm transition-colors duration-300 ${accent} ${className}`}>
      <span>{t(item.key)}</span>
      <ArrowUR className="w-static-md h-static-md opacity-0 -translate-x-1 transition-[opacity,translate] duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  );
}

/** Dirección (enlace a Maps), teléfono y email reales. */
export function FooterContact({ className = "", linkClass }: { className?: string; linkClass: string }) {
  return (
    <address className={`not-italic flex flex-col gap-static-xs ${className}`}>
      <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {CONTACT.address.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </a>
      <a href={`tel:${CONTACT.tel}`} className={linkClass}>
        {CONTACT.phone}
      </a>
      <a href={`mailto:${CONTACT.email}`} className={linkClass}>
        {CONTACT.email}
      </a>
    </address>
  );
}

/** Copyright + legales. Términos y privacidad aún no tienen página: se muestran como texto. */
export function FooterLegal({ className = "" }: { className?: string }) {
  const t = useTranslations("landingV2.footer");
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-static-xs text-meta ${className}`}>
      <p>{t("copyright")}</p>
      <p className="flex gap-static-lg">
        <span>{t("terms")}</span>
        <span>{t("privacy")}</span>
      </p>
    </div>
  );
}
