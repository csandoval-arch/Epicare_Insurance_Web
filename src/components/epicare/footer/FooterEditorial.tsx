"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, REVEAL, STAGGER } from "@/lib/motion";
import WindowedVideo from "../hero/WindowedVideo";
import HeroCta from "../hero/HeroCta";
import { CONTACT, NAV_GROUPS } from "./data";
import { curtainEnd } from "./curtain";
import { FooterContact, FooterLegal, FooterNavLink } from "./parts";

const WORD = { before: "Epi", after: "care" };
/** Márgenes laterales: 14px en móvil; gutter lg en tablet y xl en desktop (más aire que el resto de la página). */
const GUTTER = "px-gutter-sm md:px-gutter-lg lg:px-gutter-xl";

/**
 * Espaciados verticales (tablet/desktop), fijados por el usuario con el panel de debug. Token del DS
 * cuando cae a <5px del valor elegido; si no, el valor exacto en rem (margen creativo declarado):
 * frase 142px · frase→retícula 42px · retícula→wordmark 74px · wordmark→legales 72px. Móvil: tokens.
 */
const SPACE = {
  top: "pt-section-sm md:pt-[8.875rem]",
  gap: "pb-static-2xl md:pb-[2.625rem]",
  wordmarkTop: "pt-static-lg md:pt-[4.625rem]",
  wordmarkBottom: "pb-static-xl md:pb-[4.5rem]",
  legal: "py-static-lg md:py-static-2xl",
};
/** Caja del wordmark: margen lateral `gutter-lg` (84px elegidos ≈ 80px); la letra escala con su ancho (`cqi`). */
const WORDMARK_BOX = `px-gutter-sm md:px-gutter-lg ${SPACE.wordmarkTop} ${SPACE.wordmarkBottom}`;
/** Superficie oscura fija (grafito `--color-text-Black-100`, elegido por el usuario) con texto blanco, en los dos temas. */
const BG = "bg-[var(--color-text-Black-100)]";
const SURFACE = `${BG} text-[var(--color-text-White-100)]`;
const HAIRLINE = "border-[var(--color-text-White-100)]/15";
const LINK = "hover:text-[var(--color-brand-blue)]";
/** Celda de la retícula: mismo aire a ambos lados (el bloque va enmarcado) y hairline del mismo tono. */
const PAD_X = "px-static-md md:px-static-lg";
const CELL = `flex flex-col items-start gap-static-xs py-static-lg ${PAD_X} ${HAIRLINE}`;
/** Título de columna: el token de los enlaces (`text-body-md`, 300) con 200 más de peso (500), y su
 * separador. Recupera el padding de la celda (margen negativo) para que la hairline cruce la columna
 * entera y empalme con las verticales. */
const LABEL = `self-stretch text-body-md font-medium pb-static-sm mb-static-sm -mx-static-md px-static-md md:-mx-static-lg md:px-static-lg border-b ${HAIRLINE} [&>span]:opacity-45`;
/**
 * Hairlines entre celdas (el marco exterior lo pone el bloque). Móvil (2 col):
 * [Go Hub | Soluciones] / [Nosotros] / [Contacto]. Desktop (4 × 3 col): una vertical antes de cada
 * celda salvo la primera.
 */
const CELL_EDGES = ["md:col-span-3", "md:col-span-3 border-l", "col-span-2 md:col-span-3 border-t md:border-t-0 md:border-l"];
const CONTACT_EDGE = "col-span-2 md:col-span-3 border-t md:border-t-0 md:border-l";

/**
 * @description Footer · "El cierre editorial". Cierra el libro que abrió el hero: mismo marfil y
 * tinta (bimodal). Frase de cierre + CTA, índice en retícula de 12 columnas con hairlines, legales, y
 * el wordmark "Epicare" a todo el ancho, cortado por el borde inferior, con una ventana al plano de
 * vídeo del hero entre "Epi" y "care". Mientras el telón se abre, la frase y las letras nacen (scrub).
 */
export default function FooterEditorial({ stage }: { stage: RefObject<HTMLElement | null> }) {
  const t = useTranslations("landingV2.footer");
  const tn = useTranslations("landingV2.nav");
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    const trigger = stage.current;
    if (!el || !trigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // El telón: mismo tramo que el de `FooterEpicare` (hasta que el footer queda destapado).
      gsap
        .timeline({ scrollTrigger: { trigger, start: "top bottom", end: curtainEnd, scrub: true, invalidateOnRefresh: true } })
        .fromTo(".fe-line", { yPercent: REVEAL.birthPercent }, { yPercent: 0, ease: EASE.none }, 0)
        .fromTo(".fe-letter", { yPercent: 100 }, { yPercent: 0, ease: EASE.none, stagger: STAGGER.base }, 0.15)
        .fromTo(".fe-window", { clipPath: "inset(50% 50% 50% 50% round 0.08em)" }, { clipPath: "inset(0% 0% 0% 0% round 0.08em)", ease: EASE.none }, 0.35);
    });
    return () => mm.revert();
  }, [stage]);

  return (
    <section ref={root} className={`relative w-full flex flex-col ${SURFACE} overflow-hidden`}>
      <div className="flex flex-col">
        {/* ── CIERRE: frase + CTA ── */}
        <div className={`${GUTTER} ${SPACE.top} ${SPACE.gap} flex flex-col md:flex-row md:items-end justify-between gap-static-lg`}>
          <h2 className="text-display-lg font-medium tracking-tight">
            <span className="block overflow-hidden pb-1">
              <span className="fe-line block">{t("statement")}</span>
            </span>
          </h2>
          <HeroCta href={`mailto:${CONTACT.email}`} label={t("cta")} variant="primary" />
        </div>

        {/* ── RETÍCULA DE ESTUDIO: índice + contacto en 12 columnas, enmarcada con hairlines ── */}
        <div className={GUTTER}>
          <div className={`grid grid-cols-2 md:grid-cols-12 border ${HAIRLINE}`}>
            {NAV_GROUPS.map((group, i) => (
              <nav key={group.label} className={`${CELL} ${CELL_EDGES[i]}`} aria-label={tn(group.label)}>
                <p className={LABEL}>
                  <span>{tn(group.label)}</span>
                </p>
                {group.items.map((item) => (
                  <FooterNavLink key={item.key} item={item} className="text-body-md" accent={LINK} />
                ))}
              </nav>
            ))}
            <div className={`${CELL} ${CONTACT_EDGE}`}>
              <p className={LABEL}>
                <span>{t("contact")}</span>
              </p>
              <FooterContact className="text-body-md gap-static-xs" linkClass={`transition-colors duration-300 ${LINK}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ── WORDMARK a todo el ancho (div: contiene la ventana de vídeo). Si el footer es más alto que
          la pantalla, el scroll posterior al telón revela el resto y los legales. ── */}
      <div className={`@container ${WORDMARK_BOX}`}>
        <div className="text-footer-wordmark flex items-end justify-center whitespace-nowrap select-none" role="img" aria-label="Epicare">
          {[...WORD.before].map((c, i) => (
            <span key={`b${i}`} className="block overflow-hidden" aria-hidden="true">
              <span className="fe-letter block">{c}</span>
            </span>
          ))}
          {/* Ventana al plano del hero: alta como la x, apoyada en la línea base */}
          <span className="fe-window block w-[0.92em] h-[0.53em] mx-[0.05em] mb-[0.11em] overflow-hidden" aria-hidden="true">
            <WindowedVideo surface={BG} />
          </span>
          {[...WORD.after].map((c, i) => (
            <span key={`a${i}`} className="block overflow-hidden" aria-hidden="true">
              <span className="fe-letter block">{c}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── LEGALES: el cierre de la página, bajo el wordmark ── */}
      <div className={GUTTER}>
        <FooterLegal className={`border-t ${HAIRLINE} ${SPACE.legal} opacity-60`} />
      </div>
    </section>
  );
}
