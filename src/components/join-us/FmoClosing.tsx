"use client";

/**
 * @file FmoClosing.tsx
 * @description Sección 4 de /join-us?role=agency-fmo — Cierre estratégico y Plan de Lanzamiento.
 * - Titular editorial de alto impacto: «Start faster, recruit smarter, and keep more».
 * - Subtexto descriptivo y CTA «Schedule a Meeting» conectado al formulario del Hero.
 * - Fotografía editorial cinematográfica con grano de película 35mm (manos al centro en alianza de equipo).
 * - Badge de acreditación flotante con chip de vidrio líquido.
 */

import { useTranslations } from "next-intl";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { keyed } from "@/components/team/case/keyed";
import { RegisterCta } from "./shared/parts";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

export default function FmoClosing() {
  const t = useTranslations("joinUs.roles.agency-fmo.closing");
  const title = t.raw("title") as string[];

  return (
    <section
      data-act="closing"
      className="relative w-full py-section-sm lg:py-section-lg border-t border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)]"
    >
      <div className={`${WRAP} flex flex-col gap-static-xl lg:gap-static-2xl`}>
        {/* ── ENCABEZADO Y LLAMADA A LA ACCIÓN ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-static-lg lg:gap-static-2xl">
          <div className="flex flex-col gap-static-md max-w-4xl lg:max-w-5xl">
            <span className="block overflow-hidden">
              <span className="jb-birth block text-overline text-[var(--color-text-accent-blue)]">
                {t("eyebrow")}
              </span>
            </span>

            <h2 className="text-display lg:text-display-lg text-[var(--color-text-primary)]">
              {title.map((line) => (
                <span key={line} className="block overflow-hidden pb-static-xs">
                  <span className="jb-birth block font-light">{keyed(line)}</span>
                </span>
              ))}
            </h2>

            <p className="jb-rise text-body-md lg:text-body-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              {t("body")}
            </p>
          </div>

          <div className="shrink-0 flex items-center pt-static-xs lg:pt-0">
            <RegisterCta label={t("cta")} className="jb-rise" />
          </div>
        </div>

        {/* ── FOTOGRAFÍA EDITORIAL 16:9 CON GRANO Y CHIP FLOTANTE ── */}
        <div className="jb-rise relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-[var(--color-border-Strokes-default)] shadow-elevation-2">
          <Image
            src={asset("/Files/join-us/fmo-launch.webp")}
            alt={t("alt")}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover object-center filter contrast-[1.02] brightness-[0.98]"
            priority={false}
          />

          {/* Sutil viñeta para legibilidad y profundidad cinematográfica */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
          />

          {/* Badge flotante en la esquina inferior izquierda */}
          <div className="absolute bottom-static-md md:bottom-static-lg left-static-md md:left-static-lg z-10">
            <div className="flex items-center gap-static-sm px-static-md py-static-xs rounded-full bg-[var(--color-surface-BG-white)]/85 dark:bg-[var(--color-surface-BG-1)]/85 backdrop-blur-md border border-[var(--color-border-Strokes-default)] text-[var(--color-text-primary)] shadow-elevation-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
              <span className="text-meta font-medium tracking-wide">
                {t("badge")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
