"use client";

/**
 * @file LoginModal.tsx
 * @description Modal de login (Link Hub de Epicare) sobre la carcasa de vidrio líquido compartida
 * (`GlassModal`): mismas proporciones, márgenes y panel que el modal Join.
 * - Principal: las plataformas Epicare (CRM, AMS, Eppigo) como tiles de vidrio con el hover de luz (`GlassLight`);
 *   sin vídeos (la versión anterior con vídeos está en `_quarantine/epicare/LoginModal_v1_videos.tsx`).
 * - Secundario: enlaces más pequeños en dos grupos (Enrollment Platforms · Carriers).
 * - Desktop: enlaces en columna vertical a la izquierda (3 col) | titular + 3 tiles altos (9 col).
 * - Móvil: tarjetas cuadradas 2 por fila (logo + resumen corto `login.short`); los 2 grupos de enlaces lado a lado,
 *   cada uno un panel de vidrio con filas divididas (lista agrupada).
 * Destinos en `login/loginData.ts` (pendientes). Montado una vez en `app/layout.tsx`.
 */

import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import ArrowUR from "@/components/icons/ArrowUR";
import GlassModal from "@/components/glass/GlassModal";
import { GlassLight, LIGHT_TILE, trackPointer } from "@/components/glass/GlassLight";
import { useLoginModal } from "@/lib/loginModalStore";
import { EppigoIcon } from "./EcosystemIcons";
import { AcademyLogo, AmsLogo, CrmLogo } from "./login/LoginLogos";
import { LINK_GROUPS, PLATFORMS, type PlatformId } from "./login/loginData";

// Wordmarks (CRM, AMS) e icono (Eppigo, con su nombre al lado); CRM/AMS traen aire a la izquierda en el viewBox
const LOGO: Record<PlatformId, ComponentType<{ className?: string }>> = {
  crm: CrmLogo,
  ams: AmsLogo,
  eppigo: EppigoIcon,
};

const LABEL: Record<PlatformId, string> = { crm: "GO CRM", ams: "GO AMS", eppigo: "Eppigo" };

const go = (href: string | null) => href && window.location.assign(href);

export default function LoginModal() {
  const t = useTranslations();
  const { isOpen, close } = useLoginModal();

  return (
    <GlassModal open={isOpen} onClose={close} titleId="login-modal-title" title={t("login.title")} closeLabel={t("login.close")} zClass="z-[9999999]">
      {/* Desktop: enlaces secundarios en columna vertical (3 col, izquierda) | plataformas (9 col), con divisor de vidrio.
          Dos filas (titular, tarjetas) compartidas por subgrid → los enlaces y el divisor arrancan a la altura de las tarjetas.
          Móvil: apilados; ritmo plataformas → (xl) → enlaces. */}
      <div className="grid lg:grid-cols-12 lg:grid-rows-[auto_auto] gap-y-static-xl lg:gap-y-static-lg lg:gap-x-[var(--space-section-xs)]">
        {/* ── PLATAFORMAS ── */}
        <section aria-label={t("login.platformsLabel")} className="gm-reveal lg:col-start-4 lg:col-span-9 lg:row-start-1 lg:row-span-2 flex flex-col gap-static-md lg:grid lg:grid-rows-subgrid">
          {/* Titular solo en desktop (en móvil manda el título del modal) */}
          <div className="hidden lg:flex flex-col gap-static-sm">
            <h2 className="text-display-sm">{t("login.heading")}</h2>
            <p className="text-body-lg text-[var(--color-text-secondary)]">{t("login.body")}</p>
          </div>
          {/* Móvil: tarjetas cuadradas, 2 por fila (la tercera también cuadrada, sin estirarse); desktop: 3 altas en fila */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-static-sm lg:gap-static-md">
            {PLATFORMS.map((p) => {
              const Logo = LOGO[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(p.href)}
                  onPointerMove={trackPointer}
                  aria-label={`${t("login.open")} · ${LABEL[p.id]}`}
                  className={`${LIGHT_TILE} w-full max-lg:aspect-square lg:h-full lg:min-h-96 p-static-md lg:p-static-lg flex flex-col gap-static-sm lg:gap-static-lg`}
                >
                  <GlassLight />
                  {/* Identidad: wordmark (CRM, AMS) o icono + nombre (Eppigo); en móvil, flecha arriba a la derecha */}
                  <span className="relative flex items-start justify-between gap-static-xs">
                    <span className="flex items-center gap-static-xs lg:gap-static-sm text-[var(--color-brand-blue)]">
                      <Logo className={p.name ? "h-static-xl lg:h-static-2xl w-auto" : "h-10 lg:h-14 w-auto -ml-1.5 lg:-ml-2"} />
                      {p.name && <span className="text-h4 text-[var(--color-text-primary)]">{p.name}</span>}
                    </span>
                    <ArrowUR aria-hidden="true" className="lg:hidden shrink-0 w-static-md h-static-md text-[var(--color-text-accent-blue)]" />
                  </span>
                  {/* Móvil: resumen corto al pie. Desktop: descripción completa + CTA al pie */}
                  <span className="relative mt-auto lg:hidden line-clamp-2 text-body-sm text-[var(--color-text-secondary)]">{t(`login.short.${p.id}`)}</span>
                  <span className="relative hidden lg:block text-body-md text-[var(--color-text-secondary)]">{t(p.descKey as never)}</span>
                  {/* Al pie (mt-auto): los CTAs de la fila quedan alineados aunque los textos midan distinto */}
                  <span className="relative hidden mt-auto lg:flex items-center gap-static-xs text-body-sm text-[var(--color-text-accent-blue)]">
                    {t("login.open")}
                    <ArrowUR className="w-static-md h-static-md transition-transform duration-200 ease-out group-hover/tile:translate-x-1 group-hover/tile:-translate-y-1" />
                  </span>
                </button>
              );
            })}
            {/* Móvil: Academy "próximamente" completa la 2.ª fila. Sin título (el logo ya lo lleva), no clicable */}
            <div aria-disabled="true" className="lg:hidden glass-liquid-tile rounded-lg aspect-square p-static-md flex flex-col gap-static-sm">
              <AcademyLogo className="h-static-xl w-auto self-start" />
              <span className="mt-auto self-start h-static-lg px-static-sm inline-flex items-center rounded-full border border-[var(--glass-liquid-divider)] text-body-xs lowercase text-[var(--color-text-secondary)]">
                {t("login.comingSoon")}
              </span>
            </div>
          </div>
        </section>

        {/* ── ENLACES SECUNDARIOS ── más pequeños: título de grupo (sin mayúsculas) + enlaces.
            Desktop: columna vertical de filas de vidrio sueltas.
            Móvil: los dos grupos lado a lado; cada uno es UN panel de vidrio con filas divididas (lista agrupada).
            Subgrid: títulos y paneles alineados entre columnas aunque un título ocupe dos líneas. */}
        <aside className="gm-reveal grid grid-cols-2 grid-rows-[auto_auto] gap-x-static-sm gap-y-static-sm lg:flex lg:flex-col lg:gap-static-xl lg:col-start-1 lg:col-span-3 lg:row-start-2 lg:border-r lg:border-[var(--glass-liquid-divider)] lg:pr-[var(--space-section-xs)]">
          {LINK_GROUPS.map((g) => (
            <section key={g.key} aria-labelledby={`login-group-${g.key}`} className="row-span-2 grid grid-rows-subgrid lg:flex lg:flex-col lg:gap-static-sm">
              <h3 id={`login-group-${g.key}`} className="text-h4 self-end lg:self-auto">
                {t(`login.groups.${g.key}`)}
              </h3>
              <ul className="max-lg:self-start flex flex-col lg:gap-static-xs max-lg:glass-liquid-tile max-lg:rounded-lg max-lg:overflow-hidden max-lg:divide-y max-lg:divide-[var(--glass-liquid-divider)]">
                {g.links.map((l) => {
                  const label = l.label ?? t(`login.links.${l.key}` as never);
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => go(l.href)}
                        className="group/link w-full min-h-static-2xl py-static-xs px-static-sm lg:h-static-2xl lg:py-0 lg:px-static-md flex items-center justify-between gap-static-xs lg:gap-static-sm text-body-sm text-left cursor-pointer transition-[translate,scale,background-color] duration-200 ease-out max-lg:active:bg-[var(--glass-liquid-tile)] lg:glass-liquid-tile lg:rounded-md lg:hover:translate-x-0.5 lg:active:scale-[0.98] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
                      >
                        {label}
                        <ArrowUR aria-hidden="true" className="shrink-0 w-static-md h-static-md text-[var(--color-text-accent-blue)] transition-transform duration-200 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </aside>
      </div>
    </GlassModal>
  );
}
