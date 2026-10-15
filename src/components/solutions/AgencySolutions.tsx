"use client";

/**
 * @file AgencySolutions.tsx
 * @description Sección 2 de /solutions — «El terreno de juego».
 *
 * Paradigma: **escena fija con foco**. La ilustración isométrica de marca se queda clavada a la
 * izquierda mientras la lista de servicios pasa por la derecha; al activarse cada servicio la
 * cámara se acerca a la pieza del dibujo que lo representa (la diana, el puzzle, los columpios).
 * Cero tarjetas en fila. Remate: el coste de la gestión como frase tipográfica, no como banda.
 *
 * Paradigmas quemados aquí — no reintroducir (citas en `sections/solutions/context.md`):
 *   1. Retícula de 3 celdas con hairlines.  2. Tarjetas de vidrio sobre velos azules.
 *   3. Matriz suiza con etiquetas pseudo-técnicas.  4. La banda azul del coste ("ese bloque azul
 *   ahí tan feo", 13-10-2026) — la información se conserva, el bloque no.
 *
 * Cámara: `transform` puro sobre la imagen (translate + scale), dentro de un marco con
 * `overflow-hidden`. Nada de `width/height/filter`: solo compositor.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MetaLogo, GoogleLogo, TiktokLogo, type Icon } from "@phosphor-icons/react";
import { asset } from "@/lib/asset";
import HoloIcon, { type HoloVariant } from "./HoloIcon";
import { STAGGER, TRIGGER } from "@/lib/motion";
import { BIRTH_FROM, BIRTH_TO, CARD_FROM, CARD_TO, CONTAINER, FULL, SECTION, oneShot } from "./shared";

interface AgencyItem {
  title: string;
  desc: string;
  meta: string;
}

/**
 * Punto del mapa al que se acerca la cámara en cada servicio, en fracción del ancho y del alto
 * de la imagen, más cuánto se acerca. Medido sobre el mapa de puntos con pines:
 *   0 el racimo de pines del oeste · 1 el del centro-sur · 2 el del noreste.
 */
/** Plataformas donde Epicare opera las campañas (brief de marketing, punto 4). */
const PLATFORMS: { name: string; Logo: Icon }[] = [
  { name: "Meta", Logo: MetaLogo },
  { name: "Google", Logo: GoogleLogo },
  { name: "TikTok", Logo: TiktokLogo },
];

/** Silueta holográfica por servicio, en el orden del diccionario. */
const HOLO_VARIANTS: HoloVariant[] = ["campaigns", "funnels", "material"];

/** Imágenes de la agencia in-house por cada servicio (brief y assets de marketing). */
const AGENCY_IMAGES = [
  "/Files/Marketing/IN-HOUSE AGENCY/Code_Generated_Image.webp",
  "/Files/Marketing/IN-HOUSE AGENCY/Code_Generated_Image (1).webp",
  "/Files/Marketing/IN-HOUSE AGENCY/Code_Generated_Image (2).webp",
] as const;

export default function AgencySolutions() {
  const t = useTranslations("solutionsPage.agency");
  const items = t.raw("items") as AgencyItem[];
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // ── ENTRADAS Y SEGUIMIENTO DEL SERVICIO ACTIVO ──
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      gsap.fromTo(".ag-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(".ag-fade", CARD_FROM, { ...CARD_TO, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(".ag-stage", CARD_FROM, { ...CARD_TO, ...oneShot(el.querySelector(".ag-stage")) });
      gsap.fromTo(".ag-close", CARD_FROM, { ...CARD_TO, ...oneShot(el.querySelector(".ag-close")) });
    });

    // El servicio activo es el que cruza la zona de lectura central.
    const steps = gsap.utils.toArray<HTMLElement>(".ag-step", el);
    const triggers = steps.map((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      })
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={SECTION}>
      <div className={`mx-auto w-full ${CONTAINER}`}>
        {/* ── ENCABEZADO ── */}
        <header className="flex flex-col items-start gap-static-sm max-w-3xl mb-static-xl lg:mb-static-2xl">
          <div className="overflow-hidden">
            <p className="ag-birth text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</p>
          </div>
          <div className="overflow-hidden pb-1">
            <h2 className="ag-birth text-display lg:text-display-lg text-[var(--color-text-primary)]">
              {t("headline")}
            </h2>
          </div>
          <p className="ag-fade text-body-lg text-[var(--color-text-secondary)] max-w-2xl">{t("subhead")}</p>
        </header>

        <div className="grid-layout gap-y-static-lg">
          {/* ── LA ESCENA · fija mientras pasa la lista ── */}
          <div className="ag-stage hidden lg:block col-span-12 lg:col-span-6 lg:sticky lg:top-[var(--space-section-md)] self-start z-0">
            {/* Sin radio: la escena es un marco recto, igual que las tarjetas de la lista. */}
            <div className="relative w-full aspect-[16/11] lg:aspect-[4/3] overflow-hidden border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]">
              {AGENCY_IMAGES.map((imgSrc, i) => {
                const isCurrent = i === active;
                return (
                  <img
                    key={imgSrc}
                    src={asset(imgSrc)}
                    alt={items[i]?.title ?? t("artAlt")}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      isCurrent
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 z-0 pointer-events-none"
                    }`}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                );
              })}

              {/* Indicador sutil de posición de la escena */}
              <div className="absolute bottom-static-md right-static-md z-20 px-static-sm py-static-xs bg-[var(--color-surface-BG-base)]/85 backdrop-blur-sm border border-[var(--color-border-Strokes-default)] text-meta text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-text-accent-blue)] font-medium">0{active + 1}</span>
                <span className="opacity-40"> / </span>
                <span>0{AGENCY_IMAGES.length}</span>
              </div>
            </div>
          </div>

          {/* ── LA LISTA · cada servicio enciende su pieza ── */}
          <ol className="col-span-12 lg:col-start-8 lg:col-span-5 relative z-10 flex flex-col gap-static-lg lg:gap-static-2xl">
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.title} className="ag-step lg:min-h-[46vh] flex flex-col justify-center">
                  {/* Tarjeta a stroke, sin radio ni relleno: el borde es el único contenedor. */}
                  <article
                    className={`flex flex-col gap-static-md border bg-[var(--color-surface-BG-base)] transition-[border-color] duration-500 ${
                      isActive
                        ? "border-[var(--color-brand-blue)]"
                        : "border-[var(--color-border-Strokes-default)]"
                    }`}
                  >
                    {/* En móvil cada tarjeta muestra directamente su imagen asignada */}
                    <div className="lg:hidden relative w-full aspect-[16/9] overflow-hidden border-b border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]">
                      <img
                        src={asset(AGENCY_IMAGES[i] ?? AGENCY_IMAGES[0])}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-static-md p-static-lg lg:p-static-xl">
                      <div className="flex items-center gap-static-md">
                        <HoloIcon variant={HOLO_VARIANTS[i]} active={isActive} />
                        <span
                          className={`text-overline transition-colors duration-500 ${
                            isActive ? "text-[var(--color-text-accent-blue)]" : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {item.meta}
                        </span>
                      </div>

                      <h3 className="text-display-sm lg:text-display text-[var(--color-text-primary)]">
                        {item.title}
                      </h3>

                      <p className="text-body-lg text-[var(--color-text-secondary)] max-w-xl">{item.desc}</p>

                      {/* Las plataformas donde corren las campañas, con su marca real: el brief las
                          nombra una por una y en texto se perdían dentro del párrafo. */}
                      {i === 0 && (
                        <ul className="flex flex-wrap items-center gap-static-sm pt-static-xs">
                          {PLATFORMS.map(({ name, Logo }) => (
                            <li
                              key={name}
                              title={name}
                              className={`w-static-2xl h-static-2xl flex items-center justify-center border transition-colors duration-500 ${
                                isActive
                                  ? "border-[var(--color-brand-blue)] text-[var(--color-brand-blue)]"
                                  : "border-[var(--color-border-Strokes-default)] text-[var(--color-text-muted)]"
                              }`}
                            >
                              <Logo size={22} weight="fill" aria-label={name} />
                            </li>
                          ))}
                          <li className="text-body-sm text-[var(--color-text-muted)]">{t("platformsMore")}</li>
                        </ul>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── REMATE · quién opera y quién paga, sin banda de color ── */}
        <div className="ag-close mt-static-2xl pt-static-xl border-t border-[var(--color-border-Strokes-default)] flex flex-col gap-static-md">
          <p className="text-overline text-[var(--color-text-muted)]">{t("costTag")}</p>
          <p className="text-display-sm lg:text-display text-[var(--color-text-primary)] max-w-5xl">
            {t.rich("costStatement", {
              blue: (chunks) => <span className="text-[var(--color-brand-blue)]">{chunks}</span>,
            })}
          </p>
          <p className="text-meta text-[var(--color-text-muted)]">{t("costNote")}</p>
        </div>
      </div>
    </section>
  );
}
