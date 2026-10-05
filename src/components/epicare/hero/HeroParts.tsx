"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import HeroCta from "./HeroCta";
import { AGENT_AVATARS, HERO_LINKS } from "./data";

/** Avatar del bloque de prueba (retrato o contador), con el borde del color del fondo. */
const AVATAR = "w-static-2xl h-static-2xl rounded-full border-3 border-[var(--color-hero-ivory)] relative";

/** @description Palabras del titular ("Go beyond growth") para que cada variante las reparta. */
export function useHeroTitle() {
  const t = useTranslations("landingV2.hero");
  const title = t("title");
  const words = title.split(" ");
  return { title, words, lead: words.slice(0, -1).join(" "), last: words[words.length - 1] };
}

/**
 * @description Subtítulo grande del hero. `flow` = texto corrido (las líneas del diccionario se
 * unen con espacio); sin `flow`, una línea por entrada, como en el diseño original.
 */
export function HeroSubtitle({ flow = false, className = "" }: { flow?: boolean; className?: string }) {
  const t = useTranslations("landingV2.hero");
  const lines = t.raw("subtitle") as string[];
  return (
    <h2 className={`text-display-sm font-medium tracking-tight ${flow ? "" : "flex flex-col"} ${className}`}>
      {lines.map((line, i) => (
        <span key={line} className={`hero-subtitle ${flow ? "inline-block" : ""}`}>
          {line}
          {flow && i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </h2>
  );
}

/** @description Los dos CTAs del hero (primario + secundario). */
export function HeroCtas({ className = "" }: { className?: string }) {
  const t = useTranslations("landingV2.hero");
  return (
    <div className={`flex flex-wrap items-center gap-static-md ${className}`}>
      <HeroCta href={HERO_LINKS.primary} label={t("ctaPrimary")} variant="primary" />
      <HeroCta href={HERO_LINKS.secondary} label={t("ctaSecondary")} variant="secondary" />
    </div>
  );
}

/** @description Bloque de prueba: avatares + "100+ agentes activos" + copy de soporte. */
export function HeroProofContent({ supportingClassName = "" }: { supportingClassName?: string }) {
  const t = useTranslations("landingV2.hero");
  const agentsLabel = t.raw("agentsLabel") as string[];
  // Acentos en el azul de marca (un solo azul en todo el hero).
  const accent = (chunks: ReactNode) => <span className="text-[var(--color-brand-blue)]">{chunks}</span>;
  return (
    <>
      {/* Contenedor (container query): si el interior de la fila mide menos de 14rem (desktop estrecho), avatares +
          etiqueta no caben → la etiqueta baja bajo los avatares, en una sola línea, en vez de invadir
          el vídeo. Con 14rem o más (≥1440 y móvil), avatares y etiqueta en dos líneas, lado a lado. */}
      <div className="@container flex flex-wrap items-center gap-3 lg:pr-static-md">
        <div className="flex -space-x-3" aria-hidden="true">
          {AGENT_AVATARS.map((src, i) => (
            <div
              key={src}
              className={`${AVATAR} bg-cover bg-center grayscale mix-blend-multiply dark:mix-blend-normal`}
              style={{ backgroundImage: `url(${src})`, zIndex: AGENT_AVATARS.length + 1 - i }}
            />
          ))}
          <div className={`${AVATAR} z-1 bg-[var(--color-hero-ink)] flex items-center justify-center`}>
            <span className="text-caption font-semibold tracking-tighter text-[var(--color-hero-ivory)]">{t("agentsCount")}</span>
          </div>
        </div>
        <p className="text-caption font-medium leading-tight opacity-80 @max-[14rem]:basis-full">
          {agentsLabel.map((line, i) => (
            <span key={line} className="block @max-[14rem]:inline">
              {line}
              {i < agentsLabel.length - 1 ? " " : null}
            </span>
          ))}
        </p>
      </div>

      <p className={`text-h3 font-medium opacity-80 ${supportingClassName}`}>{t.rich("supporting", { b: accent })}</p>
    </>
  );
}
