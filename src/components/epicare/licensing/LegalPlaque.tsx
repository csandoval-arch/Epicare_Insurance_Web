"use client";

import { useTranslations } from "next-intl";

// ── DATOS LEGALES (obligatorios por ley; nombres registrados, no se traducen) ──
const LEGAL = {
  company: "Epicare Insurance Corp",
  phone: "(888) 374-2467",
  phoneHref: "tel:+18883742467",
  npn: "19985316",
  caDba: "GO EIC INSURANCE AGENCY",
  nyDba: "EIC INSURANCE AGENCY",
} as const;

/**
 * @description Placa legal del hero de /licensing: ficha editorial con la razón social como titular,
 * el teléfono como enlace y una tabla de dos columnas (etiqueta / valor) separada por hairlines.
 * Etiquetas en `landingV2.licensingHero.legal`; los valores son datos legales fijos.
 */
export default function LegalPlaque({ className = "" }: { className?: string }) {
  const t = useTranslations("landingV2.licensingHero.legal");

  const rows = [
    { label: t("npn"), value: LEGAL.npn },
    { label: t("caDba"), value: LEGAL.caDba },
    { label: t("nyDba"), value: LEGAL.nyDba },
  ];

  return (
    <aside aria-label={t("label")} className={`rounded-lg border border-[var(--color-border-Strokes-default)] ${className}`}>
      {/* ── RAZÓN SOCIAL + TELÉFONO ── */}
      <div className="flex items-baseline justify-between gap-static-md px-static-md py-static-md">
        <p className="text-h5 text-[var(--color-text-primary)]">{LEGAL.company}</p>
        <a
          href={LEGAL.phoneHref}
          aria-label={`${t("phone")} ${LEGAL.phone}`}
          className="text-body-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-action-primary-bg)]"
        >
          {LEGAL.phone}
        </a>
      </div>

      {/* ── NPN Y DBA: tabla de dos columnas con hairlines ── */}
      <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-static-md border-t border-[var(--color-border-Strokes-default)] divide-y divide-[var(--color-border-Strokes-default)]">
        {rows.map(({ label, value }) => (
          <div key={label} className="col-span-2 grid grid-cols-subgrid items-baseline px-static-md py-static-sm">
            <dt className="text-body-sm text-[var(--color-text-secondary)]">{label}</dt>
            <dd className="text-body-sm text-right whitespace-nowrap text-[var(--color-text-primary)]">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
