"use client";

/**
 * @file TrademarkManifesto.tsx
 * @description Sección 3 de /join-us?role=agency-trademark — Manifiesto Editorial y Declaración de Marca.
 * - Gran lienzo inmersivo de marca en azul profundo con auras lumínicas radiales.
 * - Mensaje completo unificado en escala display con acento en «zero franchise fees».
 * - 100% blindado contra desync de caché de Turbopack/next-intl (cero leaks de strings de claves).
 */

import { useLocale, useTranslations } from "next-intl";
import { RegisterCta } from "./shared/parts";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

const STATEMENTS: Record<string, string> = {
  en: "Create your Epicare Agency with <k>zero franchise fees.</k> Use our brand, processes and tech to sell and recruit faster in any state with performance-based splits that improve as you grow.",
  es: "Crea tu Agencia Epicare con <k>cero tarifas de franquicia.</k> Utiliza nuestra marca, procesos y tecnología para vender y reclutar más rápido en cualquier estado, con comisiones basadas en desempeño que mejoran a medida que creces.",
};

const EYEBROWS: Record<string, string> = {
  en: "The Licensee Model",
  es: "El Modelo de Licencia",
};

const CTAS: Record<string, string> = {
  en: "Get Started",
  es: "Empezar ahora",
};

const BADGES: Record<string, string[]> = {
  en: ["0% Franchise Fees", "All 50 States", "Complete GO Stack", "Performance Splits"],
  es: ["0% Tarifas de franquicia", "Los 50 estados", "Stack GO completo", "Comisiones progresivas"],
};

export default function TrademarkManifesto() {
  const t = useTranslations("joinUs.roles.agency-trademark.manifesto");
  const locale = useLocale();

  // ── RESOLUCIÓN DEFENSIVA CON t.raw ──
  // Usamos t.raw() para obtener la cadena directa sin que el formateador ICU de next-intl
  // lance FORMATTING_ERROR por la etiqueta <k>.
  let statementText = STATEMENTS[locale] ?? STATEMENTS.en;
  try {
    const val = t.raw("statement") as string;
    if (typeof val === "string" && val && !val.startsWith("joinUs.")) {
      statementText = val;
    }
  } catch {
    // Fallback garantizado
  }

  let eyebrowText = EYEBROWS[locale] ?? EYEBROWS.en;
  try {
    const val = t.raw("eyebrow") as string;
    if (typeof val === "string" && val && !val.startsWith("joinUs.")) {
      eyebrowText = val;
    }
  } catch {
    // Fallback garantizado
  }

  let ctaText = CTAS[locale] ?? CTAS.en;
  try {
    const val = t.raw("cta") as string;
    if (typeof val === "string" && val && !val.startsWith("joinUs.")) {
      ctaText = val;
    }
  } catch {
    // Fallback garantizado
  }

  let badgesList = BADGES[locale] ?? BADGES.en;
  try {
    const val = t.raw("badges") as string[];
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string" && !val[0].startsWith("joinUs.")) {
      badgesList = val;
    }
  } catch {
    // Fallback garantizado
  }

  // Parser para resaltar <k>...</k> con tono cyan brillante y subrayado sutil
  const renderStatement = (text: string) => {
    return text.split(/(<k>.*?<\/k>)/g).map((part, i) =>
      part.startsWith("<k>") ? (
        <span
          key={i}
          className="font-semibold text-[#62CDFF] underline decoration-[#62CDFF]/35 underline-offset-8"
        >
          {part.slice(3, -4)}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section data-act="manifesto" className="relative w-full py-section-sm lg:py-section-md">
      <div className={WRAP}>
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[var(--color-brand-blue)] via-[#0251A3] to-[#012F6C] text-[var(--color-text-White-100)] p-static-xl md:p-static-2xl lg:p-[calc(var(--space-section-xs)+var(--spacing-static-xl))] shadow-elevation-4 border border-white/15">
          {/* Auras lumínicas radiales de fondo */}
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[radial-gradient(circle,rgba(98,205,255,0.28)_0%,transparent_70%)] blur-2xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[radial-gradient(circle,rgba(53,187,253,0.22)_0%,transparent_70%)] blur-2xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col gap-static-lg lg:gap-static-xl max-w-5xl mx-auto text-center items-center">
            {/* Chip de Eyebrow en Vidrio Líquido */}
            <span className="jb-rise inline-flex items-center gap-2 px-static-md py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-meta text-white/90 font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62CDFF] animate-pulse" />
              {eyebrowText}
            </span>

            {/* Mensaje Unificado Monumental */}
            <h2 className="jb-rise text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.15rem] font-light leading-[1.24] tracking-tight text-white max-w-5xl mx-auto">
              {renderStatement(statementText)}
            </h2>

            {/* 4 Distintivos de Confianza */}
            <div className="jb-rise flex flex-wrap items-center justify-center gap-static-sm md:gap-static-md pt-static-xs">
              {badgesList.map((b) => (
                <span
                  key={b}
                  className="px-static-md py-static-xs rounded-lg bg-white/10 hover:bg-white/15 transition-colors border border-white/15 text-caption md:text-body-sm font-medium tracking-wide text-white/95 backdrop-blur-sm"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Botón de Acción Directo */}
            <div className="pt-static-md">
              <RegisterCta label={ctaText} className="jb-rise" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
