"use client";

/**
 * @file JoinUsHero.tsx
 * @description Sección 1 de /join-us — hero partido papel | azul (2026-10-11). Sin fotografía.
 * - Izquierda (papel): el titular en peso ligero con la idea clave en semibold (como /company),
 *   la bajada y el bloque "Contact" del usuario.
 * - Derecha: un panel azul de marca que sangra hasta el borde derecho de la ventana y, dentro, el
 *   formulario en una hoja blanca. El panel sube como una cortina al cargar (contenedor + interior inverso,
 *   solo transforms). Es el destino de los botones "Register" (`JOIN_FORM_ID`).
 * - Móvil (4 cols): titular, bajada, el panel azul a sangre con el formulario y después el contacto.
 */

import { useTranslations } from "next-intl";
import { keyed } from "@/components/team/case/keyed";
import { JOIN_FORM_ID, JOIN_GRID } from "./joinUsData";
import type { RoleProps } from "./types";
import JoinForm from "./shared/JoinForm";
import JoinContact from "./shared/JoinContact";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";
/** Desktop: el panel sale del borde derecho de la retícula hasta el borde de la ventana. */
const BLEED_RIGHT = "lg:mr-[calc((min(100vw,var(--max-w-section-xl))-100vw)/2-var(--space-gutter-md))]";
/** Padding derecho del interior cuando sangra: devuelve el formulario a la retícula. */
const BLEED_PAD = "lg:pr-[calc((100vw-min(100vw,var(--max-w-section-xl)))/2+var(--space-gutter-md))]";

export default function JoinUsHero({ role, roleNs }: RoleProps) {
  const t = useTranslations(roleNs);
  const title = t.raw("title") as string[];
  const contactTitle = t.has("contactTitle") ? t("contactTitle") : undefined;

  return (
    <section data-act="hero" className="relative w-full pt-[calc(var(--space-section-sm)+var(--spacing-static-2xl))] lg:pt-[calc(var(--space-section-md)+var(--spacing-static-lg))] pb-section-sm lg:pb-section-xl">
      <div className={`relative ${WRAP} ${JOIN_GRID} gap-y-static-lg lg:gap-y-static-2xl items-start`}>
        {/* ── TITULAR: a todo el ancho, en su propia fila ── */}
        <div className="col-span-full lg:row-start-1">
          {/* Peso ligero; la idea clave (<k> en messages) recupera el semibold. Margen creativo: como /company. */}
          <h1 className="text-display lg:text-display-xl">
            {title.map((line) => (
              <span key={line} className="block overflow-hidden pb-static-xs">
                <span className="jb-birth block font-light">{keyed(line)}</span>
              </span>
            ))}
          </h1>
        </div>

        {/* ── TEXTO: bajada y contacto ── */}
        <div className="col-span-full lg:col-start-1 lg:col-span-6 lg:self-start lg:row-start-2 min-w-0 flex flex-col gap-static-lg lg:gap-static-xl lg:pr-static-xl">
          <p className="jb-rise max-w-xl text-body-lg lg:text-body-xl text-[var(--color-text-secondary)]">{t("subtitle")}</p>
          <JoinContact title={contactTitle} className="hidden lg:flex mt-static-xl" />
        </div>

        {/* ── PANEL con el formulario ── */}
        <div
          id={JOIN_FORM_ID}
          className={`col-span-full lg:col-start-7 lg:col-span-6 lg:row-start-2 -mx-[var(--space-gutter-sm)] md:-mx-[var(--space-gutter-md)] lg:mx-0 ${BLEED_RIGHT} scroll-mt-[var(--space-section-xs)]`}
        >
          <div className="jb-curtain relative overflow-hidden bg-[var(--color-brand-blue)] lg:rounded-l-xl">
            <div className={`jb-curtain-in flex flex-col gap-static-md lg:gap-static-2xl px-gutter-sm md:px-gutter-md lg:pl-section-xs ${BLEED_PAD} py-static-lg md:py-static-xl lg:py-section-xs`}>
              <JoinForm role={role} roleNs={roleNs} className="jb-rise rounded-lg overflow-hidden w-full shadow-elevation-3" />
            </div>
          </div>
        </div>

        {/* Móvil: el contacto después del formulario */}
        <JoinContact title={contactTitle} className="lg:hidden col-span-full pt-static-xs" />
      </div>
    </section>
  );
}
