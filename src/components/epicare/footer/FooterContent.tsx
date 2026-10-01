"use client";

/**
 * @file FooterContent.tsx
 * @description Contenido del footer — "El puente" (aprobado el 30/09/2026). Arriba, sobre el claro, el logo completo de Epicare (nace letra a
 * letra). Abajo, una FOTO de arquitectura con una agente al teléfono en su oficina (`Footer/agent-phone*.jpg`, versión vertical en móvil,
 * elegida el 30/09/2026; antes, el puente de hormigón del hero) en una banda enmarcada (16px), casi
 * cuadrada y tan alta como su contenido, que se ensancha hasta el marco con
 * el telón (scaleX 0.94 → 1, scrub) mientras la foto viaja más lenta que la página (parallax). Dentro de
 * la foto, en blanco: la frase con "Escríbenos", el índice en 4 columnas y la barra legal.
 */

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowUR from "@/components/icons/ArrowUR";
import EpicareLogo from "@/components/icons/EpicareLogo";
import { asset } from "@/lib/asset";
import { EASE, REVEAL } from "@/lib/motion";
import { curtainEnd } from "./curtain";
import { CONTACT } from "./data";
import { FooterLegal } from "./parts";
import { findStage, useCurtainReveal } from "./useCurtainReveal";
import { logoBirth, useRevealWhenVisible } from "./useRevealWhenVisible";
import FooterIndex from "./FooterIndex";

/** Foto de la banda: horizontal desde tablet (md, donde cambia el layout del footer) y vertical en móvil. */
const PHOTO = "/Files/Footer/agent-phone.jpg";
const PHOTO_MOBILE = "/Files/Footer/agent-phone-mobile.jpg";
const PHOTO_DESKTOP_MEDIA = "(min-width: 768px)";
const SURFACE = "bg-[var(--color-surface-BG-1)] text-[var(--color-text-primary)]";
const LINK = "hover:text-[var(--color-brand-blue)]";
/**
 * Aire lateral dentro de la banda: desde tablet, el gutter menos el marco de 16px (`static-md`), así el
 * contenido queda en la columna de la página. En móvil (marco de 8px), aire propio de 16px.
 */
const BAND_PAD =
  "px-static-md md:px-[calc(var(--space-gutter-lg)-var(--spacing-static-md))] lg:px-[calc(var(--space-gutter-xl)-var(--spacing-static-md))]";
/** Margen del logo: en móvil, marco (8px) + aire de la banda (16px), para alinearlo con su texto. */
const LOGO_PAD = "px-[calc(var(--spacing-static-sm)+var(--spacing-static-md))] md:px-gutter-lg lg:px-gutter-xl";
/**
 * Móvil: el logo empieza por debajo del header fijo (`top-4` + `h-[72px]` en `HeaderEpicare` = 88px) más
 * 24px de aire (`static-lg`). Si cambia la geometría del header, actualizar aquí.
 */
const HEADER_CLEARANCE = "pt-[calc(var(--spacing-static-md)+4.5rem+var(--spacing-static-lg))]";
/** Ancho de la banda al empezar el telón (se ensancha hasta el marco). */
const BAND_FROM = 0.94;
/** Recorrido del parallax de la foto (yPercent): viaja más lenta que la página. */
const PHOTO_TRAVEL = 12;

/** Con el telón (scrub) nace la frase. */
function buildCurtain(tl: gsap.core.Timeline, el: HTMLElement) {
  tl.fromTo(el.querySelectorAll(".fp-line"), { yPercent: REVEAL.birthPercent }, { yPercent: 0, ease: EASE.none }, 0);
}

/**
 * @description La banda se ensancha y la foto hace parallax. Scrub desde que el footer asoma hasta el final de
 * la página (la banda está abajo del todo: su tramo visible incluye el scroll tras el telón).
 */
function useBandReveal(band: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = band.current;
    const stage = el && findStage(el);
    if (!el || !stage) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const st = { trigger: stage, start: "top bottom", end: "bottom bottom", scrub: true, invalidateOnRefresh: true, refreshPriority: -1 };
      gsap.fromTo(el, { scaleX: BAND_FROM }, { scaleX: 1, ease: EASE.none, scrollTrigger: { ...st, end: curtainEnd } });
      gsap.fromTo(el.querySelector(".fp-photo"), { yPercent: -PHOTO_TRAVEL }, { yPercent: 0, ease: EASE.none, scrollTrigger: st });
    });
    return () => mm.revert();
  }, [band]);
}

export default function FooterContent() {
  const t = useTranslations("landingV2.footer");
  const root = useRef<HTMLElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  useCurtainReveal(root, buildCurtain);
  useBandReveal(band);
  useRevealWhenVisible(logo, logoBirth, 0.6);
  const statement = t.raw("statement") as string[];

  return (
    <section ref={root} className={`relative w-full ${SURFACE} border-t border-[var(--color-border-Strokes-default)]`}>
      {/* ── ARRIBA: EL LOGO (colores originales; la tinta sigue al tema). Móvil: a la izquierda, alineado con el
          texto de la foto (marco 8px + aire 16px); desde tablet, centrado ── */}
      <div className={`${LOGO_PAD} ${HEADER_CLEARANCE} pb-section-xs md:pt-section-md md:pb-section-sm`}>
        <div ref={logo} className="md:mx-auto w-[min(26rem,64%)]" role="img" aria-label="Epicare Insurance">
          <EpicareLogo className="block w-full h-auto" inkClass="text-[var(--color-text-primary)]" />
        </div>
      </div>

      {/* ── ABAJO: LA FOTO con frase, índice y legales en blanco, dentro de un marco (8px móvil · 16px desde tablet; alto = su contenido) ── */}
      <div className="px-static-sm pb-static-sm md:px-static-md md:pb-static-md">
        <div ref={band} className="relative overflow-hidden rounded-lg md:rounded-xl origin-bottom">
          <picture>
            <source media={PHOTO_DESKTOP_MEDIA} srcSet={asset(PHOTO)} />
            <img
              src={asset(PHOTO_MOBILE)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="fp-photo absolute inset-x-0 -top-[12%] w-full h-[124%] object-cover"
            />
          </picture>
          {/* Velo: el texto blanco se lee sobre la foto */}
          <div className="absolute inset-0 bg-[var(--color-text-Black-100)]/55" aria-hidden="true" />

          {/* Móvil: aire compacto (static); desde tablet, el ritmo de sección */}
          <div className={`relative ${BAND_PAD} pt-static-2xl md:pt-section-sm flex flex-col gap-static-2xl md:gap-[var(--space-section-sm)] text-[var(--color-text-White-100)]`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-static-xl md:gap-static-2xl">
              <div className="md:col-span-5 flex flex-col items-start gap-static-lg md:gap-static-xl">
                <h2 className="text-display-lg">
                  {statement.map((line) => (
                    <span key={line} className="block overflow-hidden pb-2">
                      <span className="fp-line block">{line}</span>
                    </span>
                  ))}
                </h2>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group inline-flex items-center gap-static-sm text-h3 underline underline-offset-8 decoration-1 decoration-[var(--color-brand-blue)] transition-colors duration-300 hover:text-[var(--color-brand-blue)]"
                >
                  {t("cta")}
                  <ArrowUR className="w-static-lg h-static-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
              <FooterIndex
                withContact
                accent={LINK}
                titleClass="text-body-md font-medium opacity-60 mb-static-xs"
                // <lg: 2 columnas — Go Hub a la izquierda; a la derecha, Soluciones y, sin título y pegados a
                // continuación, los enlaces de Nosotros (una sola lista). Contacto debajo.
                groupClass={["row-span-2 lg:row-span-1", "", "col-start-2 lg:col-start-auto -mt-[calc(var(--spacing-static-lg)-var(--spacing-static-xs))] lg:mt-0"]}
                groupTitleClass={["", "", "hidden lg:block"]}
                contactClass="col-span-2 lg:col-span-1"
                className="md:col-span-7 grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.7fr] gap-x-static-xl gap-y-static-lg lg:gap-y-static-2xl"
              />
            </div>
            <FooterLegal className="border-t border-[var(--color-text-White-100)]/25 py-static-md md:py-static-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
