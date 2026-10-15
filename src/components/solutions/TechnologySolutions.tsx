"use client";

/**
 * @file TechnologySolutions.tsx
 * @description Sección 5 de /solutions — «La plancha partida».
 *
 * Concepto: **una sola fotografía, cortada en tres**. El acto II no es una imagen al lado de un
 * texto ni una plancha con una banda de pie: es la misma escena repartida en tres franjas
 * separadas por el aire del DS, y cada franja lleva encima su lectura del equipo en una hoja de
 * vidrio líquido. Juntas se leen como una sola fotografía; separadas, cada una sostiene su idea.
 *
 * Paradigma traído de `ContactVsOpportunity` de /go-crm (APROBADO 2026-10-07, *"hermoso"*), por
 * pedido del usuario el 15-10-2026: cortina por franja de izquierda a derecha, la foto asentándose
 * a otra velocidad detrás, y la tarjeta subiendo después de cada franja. Lo que se trae es la
 * mecánica; el material del vidrio es el del DS (`glass-liquid`), no el CSS local de aquella.
 *
 * Dos actos:
 *  I · EL TITULAR — «**Business Intelligence** es el equipo que mantiene la agencia por delante
 *      del mercado», con el nombre del equipo en azul de marca DENTRO del título (pedido del
 *      usuario, 14-10-2026; por eso la sección no lleva overline: sería la misma etiqueta dos
 *      veces). Al lado, en columna corta, sobre qué plataforma opera el agente: las cuatro piezas
 *      se nombran dentro del texto corrido, porque la lista de nombre + descripción se rechazó
 *      cuatro veces el 13-10-2026 (*"no quiero un componente con esa lista fea"*).
 *  II · LAS TRES FRANJAS — qué hace el equipo, escrito sobre la escena.
 *
 * Paradigmas ya rechazados por el usuario en esta sección, en `_quarantine/solutions/` (no volver
 * a proponerlos): dos columnas de párrafo bajo un titular-losa · foto a un lado y texto al otro
 * (dos veces, con y sin sangrado) · tríptico de tres fotografías distintas.
 *
 * Desviaciones declaradas (Reporte de Margen Creativo):
 *  · El velo de cada franja es un `linear-gradient` derivado por `color-mix` del token
 *    `--color-overlay-backdrop`: el DS no tiene tokens de gradiente y el hex a mano está prohibido.
 *  · Alturas de encuadre en `vh`, igual que el hero de esta página.
 *  · `SLICE_IMAGE_START`: la foto arranca un 8% más cerca dentro de su franja y se asienta — es lo
 *    que da la segunda velocidad detrás de la cortina.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";
import { BIRTH_FROM, BIRTH_TO, CARD_FROM, CARD_TO, CONTAINER, FULL, SECTION, oneShot } from "./shared";
import HoloIcon, { type HoloVariant } from "./HoloIcon";

/**
 * Iconografía diegética de las tres lecturas (skill `holographic-tech-visuals`). Siluetas nuevas,
 * no las de la sección de la agencia: dos secciones de la misma página no comparten icono.
 */
const READING_ICONS: HoloVariant[] = ["metrics", "build", "tools"];

/**
 * ⚠️ PROVISIONAL: fotografía de archivo, no es el equipo de Epicare. Sustituir por la sesión
 * propia de Business Intelligence antes de dar la página por cerrada.
 */
const PLATE_PHOTO = "/Files/Solutions/people-tech-convergence.webp";

const SLICES = [0, 1, 2] as const;

/** Separación entre franjas (token static-lg); la foto se desplaza lo mismo para seguir siendo una sola. */
const SLICE_GAP = "var(--spacing-static-lg)";

/** Zoom de partida de la foto dentro de cada franja mientras se descubre (segunda velocidad). */
const SLICE_IMAGE_START = 1.08;

/**
 * Velo de cada franja: oscurece la parte baja, que es donde se apoya el vidrio. Sin él, el blanco
 * de la tarjeta se juega el contraste contra lo que haya en la foto.
 */
const PHOTO_SCRIM =
  "absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--color-overlay-backdrop)]/65 via-[var(--color-overlay-backdrop)]/25 to-transparent pointer-events-none";

/** Los nombres que, además de resaltar, llevan a su página. El resto solo pesa más. */
const PRODUCT_HREF: Record<string, string> = {
  "GO CRM": "/go-crm",
  "GO AMS": "/go-ams",
};

/** Parte el texto por las marcas `**…**`: lo marcado sube a primario y, si es producto, enlaza. */
function renderStatement(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) => {
    if (i % 2 === 0) return chunk;
    const href = PRODUCT_HREF[chunk];
    if (!href) {
      return (
        <strong key={i} className="font-medium text-[var(--color-text-primary)]">
          {chunk}
        </strong>
      );
    }
    return (
      <Link
        key={i}
        href={href}
        className="font-medium text-[var(--color-text-primary)] underline decoration-[var(--color-brand-blue)] decoration-2 underline-offset-4 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[var(--color-text-accent-blue)]"
      >
        {chunk}
      </Link>
    );
  });
}

/**
 * Igual que `renderStatement`, pero para la palabra que vive SOBRE la fotografía. Todo el texto
 * va en blanco pleno (sin grises, decisión del usuario 14-10-2026): la jerarquía dentro de la
 * frase la marca solo el peso. Aquí no hay enlaces: una frase sobre una escena no se interrumpe
 * con un subrayado.
 */
function renderOverImage(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
    i % 2 === 0 ? chunk : (
      <strong key={i} className="font-semibold">
        {chunk}
      </strong>
    )
  );
}

/**
 * Fondo propio de la sección: la MISMA superficie de la página, pero en oscuro — `#191A1A`, el
 * gris profundo de la marca (pedido del usuario, 15-10-2026; antes se probaron el azul, el escalón
 * BG-1 y el gris `#2F3437`, los tres descartados).
 * No hace falta cambiar ninguna clase: basta con `dark` local sobre la sección. Dentro, TODOS los
 * tokens resuelven a su versión oscura en los dos temas de la página — la superficie se vuelve
 * `#191A1A` y el texto, los enlaces y el vidrio se aclaran solos, sin un override por elemento.
 * El `pt` es la excepción declarada a la regla de un solo dueño del espacio: sin él el corte de
 * color cae pegado al titular.
 */
const SECTION_SURFACE = "dark " + SECTION + " pt-section-sm lg:pt-section-md";

export default function TechnologySolutions() {
  const t = useTranslations("solutionsPage.technology");
  const readings = t.raw("readings") as string[];
  const sectionRef = useRef<HTMLElement>(null);
  /** Los bucles de los iconos solo corren con la escena en pantalla (HARDWARE-SYMPHONY). */
  const [plateInView, setPlateInView] = useState(false);
  /** Móvil: mueve el tramo del indicador según el progreso del scroll horizontal (sin re-render). */
  const thumbRef = useRef<HTMLSpanElement>(null);
  const onRowScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const row = e.currentTarget;
    const max = row.scrollWidth - row.clientWidth;
    if (thumbRef.current) thumbRef.current.style.transform = `translate3d(${max > 0 ? (row.scrollLeft / max) * 100 : 0}%, 0, 0)`;
  };

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      // ── ACTO I ──
      gsap.fromTo(".tc-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(".tc-fade", CARD_FROM, { ...CARD_TO, ...oneShot(el, TRIGGER.late) });
    });

    // ── ACTO II (desktop) · cortina por franja, izq → centro → der, y detrás de cada una su tarjeta.
    //    El contenedor sube desde abajo y su interior hace lo inverso: la foto se queda quieta y lo
    //    que viaja es el corte. Solo transform/opacity. ──
    mm.add(`(min-width: 768px) and ${FULL}`, () => {
      const scene = el.querySelector(".tc-plate");
      const tl = gsap.timeline({ defaults: { force3D: true }, ...oneShot(scene, TRIGGER.early) });

      gsap.utils.toArray<HTMLElement>(".tc-slice", el).forEach((slice, i) => {
        const at = i * STAGGER.wave;
        const card = slice.querySelector(".tc-glass");
        tl.fromTo(slice.querySelector(".tc-curtain"), { yPercent: 100 }, { yPercent: 0, duration: DUR.slow, ease: EASE.dramatic }, at)
          .fromTo(slice.querySelector(".tc-curtain-inner"), { yPercent: -100 }, { yPercent: 0, duration: DUR.slow, ease: EASE.dramatic }, at)
          .fromTo(slice.querySelector(".tc-slice-img"), { scale: SLICE_IMAGE_START }, { scale: 1, duration: DUR.cinematic, ease: EASE.out }, at);
        if (!card) return;
        tl.fromTo(card, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: DUR.base, ease: EASE.out }, at + 0.55)
          .fromTo(card.querySelectorAll(".tc-read"), { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.base, ease: EASE.dramatic }, at + 0.65);
      });
    });

    // ── ACTO II (móvil) · los cuadrados de vidrio suben escalonados al asomar la foto ──
    mm.add(`(max-width: 767px) and ${FULL}`, () => {
      gsap.fromTo(".tc-m-card", CARD_FROM, {
        ...CARD_TO,
        stagger: STAGGER.wave,
        ...oneShot(el.querySelector(".tc-m-photo"), TRIGGER.standard),
      });
    });

    // Los iconos holográficos solo laten con la escena a la vista.
    const watcher = ScrollTrigger.create({
      trigger: el.querySelector(".tc-plate"),
      start: TRIGGER.parallaxStart,
      end: TRIGGER.parallaxEnd,
      onToggle: ({ isActive }) => setPlateInView(isActive),
    });

    return () => {
      watcher.kill();
      mm.revert();
    };
  }, []);

  /** La lectura `i` dentro de su hoja de vidrio: icono arriba, frase abajo. */
  const readingCard = (i: number, { compact = false } = {}) => (
    <>
      <span aria-hidden="true" className="glass-liquid-sheen pointer-events-none absolute inset-0" />
      {/* El icono es la única marca de la tarjeta: sin regla debajo. */}
      <span className="relative">
        <HoloIcon variant={READING_ICONS[i] ?? "metrics"} active={plateInView} chrome={false} />
      </span>
      <div className="relative overflow-hidden pb-1">
        <p className={`tc-read ${compact ? "text-h4" : "text-h3"} text-[var(--color-text-White-100)]`}>
          {renderOverImage(readings[i] ?? "")}
        </p>
      </div>
    </>
  );

  return (
    <section ref={sectionRef} className={SECTION_SURFACE}>
      {/* ── ACTO I · EL TITULAR ──
          Dos columnas desiguales: la plataforma se lee AL LADO del título, no 200px más abajo. */}
      <div className={`mx-auto w-full ${CONTAINER} grid-layout gap-y-static-lg items-end`}>
        <div className="col-span-12 lg:col-span-7">
          <div className="overflow-hidden pb-1">
            <h2 className="tc-birth text-display lg:text-display-lg text-[var(--color-text-primary)]">
              <span className="text-[var(--color-brand-blue)]">{t("headlineAccent")}</span>{" "}
              {t("headlineRest")}
            </h2>
          </div>
        </div>

        <p className="tc-fade col-span-12 lg:col-start-9 lg:col-span-4 text-body text-[var(--color-text-secondary)]">
          {renderStatement(t("statement"))}
        </p>
      </div>

      {/* ── ACTO II · LA ESCENA ── */}
      <div className="tc-plate relative w-full mt-static-2xl">
        {/* DESKTOP: la foto partida en tres franjas alineadas; juntas son una sola imagen.
            `dark` local: las hojas viven sobre una fotografía, así que su vidrio es SIEMPRE el
            oscuro, en los dos temas de la página. */}
        <div className={`dark hidden md:block mx-auto w-full ${CONTAINER}`}>
          <div
            className="relative grid grid-cols-3 h-[76vh] min-h-[30rem] lg:max-h-[46rem]"
            style={{ columnGap: SLICE_GAP }}
          >
            {SLICES.map((i) => (
              <div key={i} className="tc-slice relative h-full overflow-hidden rounded-lg">
                {/* Cortina: el contenedor sube desde abajo y su interior hace lo inverso. */}
                <div className="tc-curtain absolute inset-0 overflow-hidden">
                  <div className="tc-curtain-inner absolute inset-0">
                    {/* La misma foto en las 3 franjas, desplazada (con la separación). */}
                    <div
                      className="tc-slice-img absolute top-0 bottom-0"
                      style={{ left: `calc(-${i} * (100% + ${SLICE_GAP}))`, width: `calc(300% + 2 * ${SLICE_GAP})` }}
                    >
                      <img
                        src={asset(PLATE_PHOTO)}
                        alt={i === 0 ? t("imageAlt") : ""}
                        aria-hidden={i === 0 ? undefined : "true"}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <span className={PHOTO_SCRIM} aria-hidden="true" />
                  </div>
                </div>

                {/* La lectura de esta franja, en hoja de vidrio líquido del DS. */}
                <div className="absolute inset-x-0 bottom-0 p-static-sm">
                  <div className="tc-glass relative overflow-hidden rounded glass-liquid flex flex-col items-start gap-static-lg p-static-lg lg:p-static-xl">
                    {readingCard(i)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MÓVIL: la foto a sangre y, sobre su parte baja, una fila con scroll horizontal nativo de
            las tres lecturas en cuadrados de vidrio (sin pin). */}
        <div className="dark md:hidden w-full">
          <div className="tc-m-photo relative aspect-[4/5] overflow-hidden">
            <img
              src={asset(PLATE_PHOTO)}
              alt={t("imageAlt")}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <span className={PHOTO_SCRIM} aria-hidden="true" />

            <div
              onScroll={onRowScroll}
              className="absolute inset-x-0 bottom-0 pb-static-lg flex gap-static-sm overflow-x-auto snap-x snap-mandatory scroll-px-static-sm px-static-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SLICES.map((i) => (
                <div
                  key={i}
                  className="tc-m-card relative overflow-hidden rounded glass-liquid shrink-0 w-[72%] snap-start flex flex-col items-start justify-between gap-static-lg p-static-md"
                >
                  {readingCard(i, { compact: true })}
                </div>
              ))}
            </div>

            {/* Indicador de scroll ultraminimalista: hairline corta con un tramo blanco que sigue al scroll */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-static-sm w-12 h-px bg-[var(--color-text-White-100)]/30 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <span ref={thumbRef} className="block h-full w-1/3 bg-[var(--color-text-White-100)] will-change-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
